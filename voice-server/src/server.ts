import express from "express";
import http from "node:http";
import { WebSocketServer } from "ws";
import twilio from "twilio";
import { config } from "./config";
import { handleTwilioVoiceWebhook } from "./twilioVoice";
import { handleMediaStreamConnection } from "./mediaStream";

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
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
});
