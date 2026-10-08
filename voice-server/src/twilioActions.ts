import twilio, { twiml as Twiml } from "twilio";
import { config } from "./config";

function getClient() {
  if (!config.twilioAccountSid || !config.twilioAuthToken) return undefined;
  return twilio(config.twilioAccountSid, config.twilioAuthToken);
}

/**
 * Live-transfers an in-progress call to Sarah's real phone by replacing the
 * call's active TwiML (tearing down the media stream) with a <Dial>. This is
 * how TED "puts a call through" instead of just handling it itself.
 */
export async function bridgeCallToSarah(callSid: string, sarahNumber: string): Promise<void> {
  const client = getClient();
  if (!client) {
    console.error("[twilio-actions] cannot bridge call: TWILIO_ACCOUNT_SID/TWILIO_AUTH_TOKEN not configured");
    return;
  }
  const response = new Twiml.VoiceResponse();
  // Twilio requires the callerId to be a number you own/have verified, so we
  // show the call as coming from TED's own number rather than the original
  // (unverified) external caller.
  const dial = response.dial(config.twilioFromNumber ? { callerId: config.twilioFromNumber } : undefined);
  dial.number(sarahNumber);
  await client.calls(callSid).update({ twiml: response.toString() });
}

/**
 * Ends an in-progress call after TED speaks a short closing message — used
 * when a call is classified as a likely scam and should be blocked.
 */
export async function endCallWithMessage(callSid: string, message: string): Promise<void> {
  const client = getClient();
  if (!client) {
    console.error("[twilio-actions] cannot end call: TWILIO_ACCOUNT_SID/TWILIO_AUTH_TOKEN not configured");
    return;
  }
  const response = new Twiml.VoiceResponse();
  response.say(message);
  response.hangup();
  await client.calls(callSid).update({ twiml: response.toString() });
}

/**
 * Sends an SMS summary/alert to Sarah's phone. Used both for routine
 * "TED handled this, here's what happened" summaries and for scam-block
 * alerts.
 */
export async function sendSmsToSarah(toNumber: string, body: string): Promise<void> {
  const client = getClient();
  if (!client || !config.twilioFromNumber) {
    console.error("[twilio-actions] cannot send SMS: Twilio REST client or TWILIO_FROM_NUMBER not configured");
    return;
  }
  await client.messages.create({ to: toNumber, from: config.twilioFromNumber, body });
}
