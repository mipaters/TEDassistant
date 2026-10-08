import express from "express";
import cors from "cors";
import http from "node:http";
import { WebSocketServer } from "ws";
import twilio from "twilio";
import { config, isAzureOpenAIConfigured, isAzureSpeechConfigured } from "./config";
import { handleTwilioVoiceWebhook } from "./twilioVoice";
import { handleMediaStreamConnection } from "./mediaStream";
import { getSarahPhoneNumber, setSarahPhoneNumber, normalizePhoneNumber, getTrustedContacts, addTrustedContact, removeTrustedContact } from "./demoConfig";
import { getWebChatReply, type WebChatTurn } from "./chat";
import { synthesizeSpeechMp3 } from "./azureSpeech";

// A crash in one call's handling must never take down calls in progress for
// everyone else. Log and keep the process alive.
process.on("uncaughtException", (err) => {
  console.error("[ted-voice-server] uncaughtException:", err);
});
process.on("unhandledRejection", (reason) => {
  console.error("[ted-voice-server] unhandledRejection:", reason);
});

const app = express();
// Allowed to be called cross-origin from the TED static web app so the Call
// Concierge settings page can read/save Sarah's phone number. This endpoint
// only ever exposes a single phone number, so an open CORS policy is an
// acceptable tradeoff for this demo.
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    azureOpenAIConfigured: isAzureOpenAIConfigured(),
    azureSpeechConfigured: isAzureSpeechConfigured(),
  });
});

app.get("/api/sarah-number", (_req, res) => {
  res.json({ phoneNumber: getSarahPhoneNumber() });
});

app.post("/api/sarah-number", (req, res) => {
  const raw = typeof req.body?.phoneNumber === "string" ? req.body.phoneNumber : "";
  const normalized = normalizePhoneNumber(raw);
  if (!normalized) {
    res.status(400).json({ error: "Please provide a valid phone number." });
    return;
  }
  setSarahPhoneNumber(normalized);
  res.json({ phoneNumber: normalized });
});

app.get("/api/trusted-contacts", (_req, res) => {
  res.json({ contacts: getTrustedContacts() });
});

app.post("/api/trusted-contacts", (req, res) => {
  const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
  const rawNumber = typeof req.body?.phoneNumber === "string" ? req.body.phoneNumber : "";
  const normalized = normalizePhoneNumber(rawNumber);
  if (!name || !normalized) {
    res.status(400).json({ error: "Please provide a name and a valid phone number." });
    return;
  }
  const contact = addTrustedContact(name, normalized);
  res.json({ contact });
});

app.delete("/api/trusted-contacts/:id", (req, res) => {
  removeTrustedContact(req.params.id);
  res.json({ ok: true });
});

app.post("/api/chat", async (req, res) => {
  const message = typeof req.body?.message === "string" ? req.body.message.trim() : "";
  const rawHistory: unknown[] = Array.isArray(req.body?.history) ? req.body.history : [];
  if (!message) {
    res.status(400).json({ error: "Please provide a message." });
    return;
  }
  const history: WebChatTurn[] = rawHistory
    .filter((t: unknown): t is { role: string; content: string } => {
      const turn = t as { role?: unknown; content?: unknown };
      return (turn.role === "user" || turn.role === "assistant") && typeof turn.content === "string";
    })
    .map((t) => ({ role: t.role as "user" | "assistant", content: t.content }));

  try {
    const reply = await getWebChatReply(history, message);
    res.json({ reply });
  } catch (err) {
    console.error("[ted-voice-server] /api/chat failed:", err);
    res.status(502).json({ error: "TED's chat service is temporarily unavailable." });
  }
});

app.post("/api/speak", async (req, res) => {
  const text = typeof req.body?.text === "string" ? req.body.text.trim() : "";
  if (!text) {
    res.status(400).json({ error: "Please provide text to speak." });
    return;
  }
  try {
    const mp3 = await synthesizeSpeechMp3(text);
    res.set("Content-Type", "audio/mpeg");
    res.send(mp3);
  } catch (err) {
    console.error("[ted-voice-server] /api/speak failed:", err);
    res.status(502).json({ error: "TED's voice service is temporarily unavailable." });
  }
});

app.post("/twilio/voice", (req, res) => {
  if (config.validateTwilioSignature && config.twilioAuthToken) {
    const signature = req.header("X-Twilio-Signature") ?? "";
    const host = config.publicHostname ?? req.get("host");
    const url = `https://${host}${req.originalUrl}`;
    const valid = twilio.validateRequest(config.twilioAuthToken, signature, url, req.body);
    if (!valid) {
      res.status(403).send("Invalid Twilio signature");
      return;
    }
  }
  handleTwilioVoiceWebhook(req, res);
});

const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: "/media" });
wss.on("connection", handleMediaStreamConnection);

server.listen(config.port, () => {
  console.log(`[ted-voice-server] listening on port ${config.port}`);
  console.log(`[ted-voice-server] Twilio webhook: POST /twilio/voice`);
  console.log(`[ted-voice-server] Media stream:  wss://<host>/media`);
  console.log(`[ted-voice-server] Azure OpenAI configured: ${isAzureOpenAIConfigured()}`);
  console.log(`[ted-voice-server] Azure Speech configured:  ${isAzureSpeechConfigured()}`);
});

