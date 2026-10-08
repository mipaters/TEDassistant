import type { WebSocket, RawData } from "ws";
import { muLawBufferToPcm16, pcm16ToMuLawBuffer } from "./audio";
import { SpeechSession, synthesizeSpeech } from "./azureSpeech";
import { getPhoneReply, getCallSummary, type PhoneTurn } from "./azureOpenAI";
import { config } from "./config";
import { classifyTranscript, type CallDisposition } from "./escalation";
import { bridgeCallToSarah, endCallWithMessage, sendSmsToSarah } from "./twilioActions";
import { getSarahPhoneNumber } from "./demoConfig";

// Twilio recommends sending media back in ~20ms frames (160 bytes of 8kHz µ-law audio).
const MEDIA_CHUNK_BYTES = 160;

interface TwilioStreamMessage {
  event: "connected" | "start" | "media" | "stop" | "mark";
  start?: {
    streamSid: string;
    callSid: string;
    customParameters?: { callerNumber?: string };
  };
  media?: { payload: string };
  streamSid?: string;
}

/**
 * Handles one Twilio Media Streams WebSocket connection for the lifetime of a
 * call: greets the caller, continuously recognizes their speech via Azure AI
 * Speech, asks Azure OpenAI for TED's reply, and streams synthesized audio back.
 *
 * Also decides, turn by turn, whether TED should keep handling the call
 * itself, live-transfer ("put through") the caller to Sarah's real phone, or
 * shut the call down as a suspected scam — see `escalation.ts`.
 */
export function handleMediaStreamConnection(ws: WebSocket) {
  let streamSid: string | undefined;
  let callSid: string | undefined;
  let callerNumber = "Unknown";
  let speechSession: SpeechSession | undefined;
  let speaking = false;
  let disposition: CallDisposition = "continue";
  const history: PhoneTurn[] = [];

  async function speak(text: string) {
    speaking = true;
    try {
      const pcm = await synthesizeSpeech(text);
      const muLaw = pcm16ToMuLawBuffer(pcm);
      for (let offset = 0; offset < muLaw.length; offset += MEDIA_CHUNK_BYTES) {
        if (ws.readyState !== ws.OPEN) break;
        const chunk = muLaw.subarray(offset, offset + MEDIA_CHUNK_BYTES);
        ws.send(
          JSON.stringify({
            event: "media",
            streamSid,
            media: { payload: chunk.toString("base64") },
          })
        );
      }
      history.push({ role: "assistant", content: text });
    } catch (err) {
      console.error("[media-stream] TTS failed:", err);
    } finally {
      speaking = false;
    }
  }

  async function handleCallerUtterance(text: string) {
    // While TED is speaking, ignore recognized text to avoid reacting to its
    // own voice bleeding back in, or talking over the caller mid-reply.
    if (speaking || disposition !== "continue") return;
    history.push({ role: "user", content: text });

    // Rule-based, zero-latency check: should this call be put through to
    // Sarah live, or shut down as a suspected scam, instead of TED replying?
    const { disposition: verdict, reasons } = classifyTranscript(text);
    if (verdict === "block") {
      disposition = "block";
      console.log(`[media-stream] blocking call ${callSid}: ${reasons.join(", ")}`);
      await speak("I'm detecting signs of a scam on this call, so I'm ending it now for your protection.");
      if (callSid) {
        await endCallWithMessage(callSid, "Goodbye.").catch((err) =>
          console.error("[media-stream] failed to end blocked call:", err)
        );
        const sarahNumber = getSarahPhoneNumber();
        if (sarahNumber) {
          await sendSmsToSarah(
            sarahNumber,
            `TED blocked a suspected scam call from ${callerNumber}. Reasons: ${reasons.join(", ")}.`
          ).catch((err) => console.error("[media-stream] failed to send scam alert SMS:", err));
        }
      }
      return;
    }
    if (verdict === "escalate") {
      disposition = "escalate";
      console.log(`[media-stream] escalating call ${callSid} to Sarah: ${reasons.join(", ")}`);
      const sarahNumber = getSarahPhoneNumber();
      if (!sarahNumber) {
        disposition = "continue"; // No number on file — fall back to handling it normally.
      } else {
        await speak("One moment — I'm connecting you with Sarah directly now.");
        if (callSid) {
          await bridgeCallToSarah(callSid, sarahNumber).catch((err) =>
            console.error("[media-stream] failed to bridge call to Sarah:", err)
          );
        }
        return;
      }
    }

    try {
      const reply = await getPhoneReply(history);
      await speak(reply);
    } catch (err) {
      console.error("[media-stream] OpenAI reply failed:", err);
      await speak("I'm sorry, I'm having trouble connecting right now. Please try again shortly.");
    }
  }

  ws.on("message", (raw: RawData) => {
    // Never let a single call's error crash the whole process — that would
    // drop every other in-progress call too.
    try {
      let msg: TwilioStreamMessage;
      try {
        msg = JSON.parse(raw.toString());
      } catch {
        return;
      }

      switch (msg.event) {
        case "start": {
          streamSid = msg.start?.streamSid;
          callSid = msg.start?.callSid;
          callerNumber = msg.start?.customParameters?.callerNumber ?? "Unknown";
          console.log(`[media-stream] call started: ${callSid} / ${streamSid} from ${callerNumber}`);
          speechSession = new SpeechSession(
            (text) => void handleCallerUtterance(text),
            (err) => console.error("[media-stream] recognition error:", err)
          );
          speechSession.start();
          void speak(config.greeting);
          break;
        }
        case "media": {
          if (!speechSession || !msg.media) return;
          const payload = Buffer.from(msg.media.payload, "base64");
          speechSession.writePcm16(muLawBufferToPcm16(payload));
          break;
        }
        case "stop": {
          console.log(`[media-stream] call ended: ${callSid} (disposition: ${disposition})`);
          speechSession?.close();
          // Only send a routine "here's what happened" summary when TED
          // handled the whole call itself. Escalated/blocked calls already
          // got their own SMS at the moment of escalation/blocking.
          if (disposition === "continue" && history.length > 0) {
            const sarahNumber = getSarahPhoneNumber();
            if (sarahNumber) {
              void getCallSummary(history)
                .then((summary) => sendSmsToSarah(sarahNumber, summary))
                .catch((err) => console.error("[media-stream] failed to send call summary SMS:", err));
            }
          }
          ws.close();
          break;
        }
        default:
          break;
      }
    } catch (err) {
      console.error("[media-stream] unhandled error processing message:", err);
      try {
        ws.close();
      } catch {
        // ignore
      }
    }
  });


  ws.on("close", () => {
    speechSession?.close();
  });
}
