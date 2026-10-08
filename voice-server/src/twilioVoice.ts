import type { Request, Response } from "express";
import { twiml as Twiml } from "twilio";
import { config } from "./config";

/**
 * Twilio Voice webhook: answers the inbound call and connects it to our
 * WebSocket media stream, where the live STT/TTS/OpenAI conversation happens.
 */
export function handleTwilioVoiceWebhook(req: Request, res: Response) {
  const host = config.publicHostname ?? req.get("host");
  const response = new Twiml.VoiceResponse();
  const connect = response.connect();
  connect.stream({ url: `wss://${host}/media` });

  res.type("text/xml");
  res.send(response.toString());
}
