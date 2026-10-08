import express from "express";
import http from "node:http";
import { WebSocketServer } from "ws";
import twilio from "twilio";
import { config, isAzureOpenAIConfigured, isAzureSpeechConfigured } from "./config";
import { handleTwilioVoiceWebhook } from "./twilioVoice";
import { handleMediaStreamConnection } from "./mediaStream";

// A crash in one call's handling must never take down calls in progress for
// everyone else. Log and keep the process alive.
process.on("uncaughtException", (err) => {
  console.error("[ted-voice-server] uncaughtException:", err);
});
process.on("unhandledRejection", (reason) => {
  console.error("[ted-voice-server] unhandledRejection:", reason);
});

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    azureOpenAIConfigured: isAzureOpenAIConfigured(),
    azureSpeechConfigured: isAzureSpeechConfigured(),
  });
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

