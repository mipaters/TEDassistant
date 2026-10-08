/**
 * Base URL of the always-on voice-server (separate Azure Web App) that
 * handles the live Twilio phone integration. The main TED site is a fully
 * static export (Azure Static Web Apps) and can't host webhooks itself, so a
 * handful of small, low-stakes settings — like Sarah's phone number for call
 * escalation/SMS — are read from and written to that service directly from
 * the browser.
 *
 * Override at build time with NEXT_PUBLIC_VOICE_SERVER_URL if the voice
 * server is ever redeployed somewhere else.
 */
export const VOICE_SERVER_URL =
  process.env.NEXT_PUBLIC_VOICE_SERVER_URL ??
  "https://ted-voice-server-afekg7gea7aceqdd.westus3-01.azurewebsites.net";
