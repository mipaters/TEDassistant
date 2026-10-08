import type { WebSocket, RawData } from "ws";
import { muLawBufferToPcm16, pcm16ToMuLawBuffer } from "./audio";
import { SpeechSession, synthesizeSpeech } from "./azureSpeech";
import { getPhoneReply, type PhoneTurn } from "./azureOpenAI";
import { config } from "./config";

// Twilio recommends sending media back in ~20ms frames (160 bytes of 8kHz µ-law audio).
const MEDIA_CHUNK_BYTES = 160;

interface TwilioStreamMessage {
  event: "connected" | "start" | "media" | "stop" | "mark";
  start?: { streamSid: string; callSid: string };
  media?: { payload: string };
  streamSid?: string;
}

/**
 * Handles one Twilio Media Streams WebSocket connection for the lifetime of a
 * call: greets the caller, continuously recognizes their speech via Azure AI
 * Speech, asks Azure OpenAI for TED's reply, and streams synthesized audio back.
 */
export function handleMediaStreamConnection(ws: WebSocket) {
  let streamSid: string | undefined;
  let callSid: string | undefined;
  let speechSession: SpeechSession | undefined;
  let speaking = false;
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
    if (speaking) return;
    history.push({ role: "user", content: text });
    try {
      const reply = await getPhoneReply(history);
      await speak(reply);
    } catch (err) {
      console.error("[media-stream] OpenAI reply failed:", err);
      await speak("I'm sorry, I'm having trouble connecting right now. Please try again shortly.");
    }
  }

  ws.on("message", (raw: RawData) => {
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
        console.log(`[media-stream] call started: ${callSid} / ${streamSid}`);
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
        console.log(`[media-stream] call ended: ${callSid}`);
        speechSession?.close();
        ws.close();
        break;
      }
      default:
        break;
    }
  });

  ws.on("close", () => {
    speechSession?.close();
  });
}
