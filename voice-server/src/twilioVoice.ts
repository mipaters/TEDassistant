import type { Request, Response } from "express";
import { twiml as Twiml } from "twilio";
import { config } from "./config";
import { findTrustedContactByNumber, getSarahPhoneNumber } from "./demoConfig";

/**
 * Twilio Voice webhook: answers the inbound call. Trusted contacts (e.g.
 * Sarah's husband) are put straight through live to Sarah's real phone —
 * TED recognizes the caller instantly and doesn't screen the call at all.
 * Everyone else is connected to our WebSocket media stream, where the live
 * STT/TTS/OpenAI conversation happens.
 */
export function handleTwilioVoiceWebhook(req: Request, res: Response) {
  const from = typeof req.body.From === "string" ? req.body.From : "";
  const trustedContact = from ? findTrustedContactByNumber(from) : undefined;
  const sarahNumber = getSarahPhoneNumber();

  if (trustedContact && sarahNumber) {
    const response = new Twiml.VoiceResponse();
    response.say(`Hi ${trustedContact.name}, connecting you to Sarah now.`);
    const dial = response.dial(config.twilioFromNumber ? { callerId: config.twilioFromNumber } : undefined);
    dial.number(sarahNumber);
    res.type("text/xml");
    res.send(response.toString());
    return;
  }

  const host = config.publicHostname ?? req.get("host");
  const response = new Twiml.VoiceResponse();
  const connect = response.connect();
  const stream = connect.stream({ url: `wss://${host}/media` });
  // Forward the caller's number through as a custom parameter so the media
  // stream handler can reference it (e.g. in SMS summaries to Sarah).
  stream.parameter({ name: "callerNumber", value: from || "Unknown" });

  res.type("text/xml");
  res.send(response.toString());
}
