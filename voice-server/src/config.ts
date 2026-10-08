import "dotenv/config";

export interface VoiceServerConfig {
  port: number;
  publicHostname: string | undefined; // e.g. "ted-voice.azurewebsites.net" (no protocol)
  twilioAuthToken: string | undefined;
  twilioAccountSid: string | undefined;
  twilioFromNumber: string | undefined; // the Twilio number itself, e.g. "+12898141439"
  defaultSarahPhoneNumber: string | undefined;
  validateTwilioSignature: boolean;
  azureOpenAI: {
    endpoint: string | undefined;
    apiKey: string | undefined;
    deployment: string | undefined;
    apiVersion: string;
  };
  azureSpeech: {
    key: string | undefined;
    region: string | undefined;
    voice: string;
  };
  greeting: string;
}

function bool(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined) return fallback;
  return value.toLowerCase() === "true" || value === "1";
}

export const config: VoiceServerConfig = {
  port: Number(process.env.PORT ?? 8080),
  publicHostname: process.env.PUBLIC_HOSTNAME,
  twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
  twilioAccountSid: process.env.TWILIO_ACCOUNT_SID,
  twilioFromNumber: process.env.TWILIO_FROM_NUMBER,
  defaultSarahPhoneNumber: process.env.SARAH_PHONE_NUMBER,
  // Defaults to validating signatures whenever a Twilio auth token is present,
  // but can be forced off (e.g. for local ngrok testing without a token).
  validateTwilioSignature: bool(process.env.VALIDATE_TWILIO_SIGNATURE, Boolean(process.env.TWILIO_AUTH_TOKEN)),
  azureOpenAI: {
    endpoint: process.env.AZURE_OPENAI_ENDPOINT?.replace(/\/$/, ""),
    apiKey: process.env.AZURE_OPENAI_API_KEY,
    deployment: process.env.AZURE_OPENAI_DEPLOYMENT,
    apiVersion: process.env.AZURE_OPENAI_API_VERSION ?? "2024-08-01-preview",
  },
  azureSpeech: {
    key: process.env.AZURE_SPEECH_KEY,
    region: process.env.AZURE_SPEECH_REGION,
    // en-US-GuyNeural: Microsoft's standard US-English male neural voice.
    // Other good male options: en-US-DavisNeural, en-US-TonyNeural, en-CA-LiamNeural.
    voice: process.env.AZURE_SPEECH_VOICE ?? "en-US-GuyNeural",
  },
  greeting:
    process.env.TED_GREETING ??
    "Hi, you've reached Ted, the personal AI assistant for Sarah. How can I help you today?",
};

export function isAzureOpenAIConfigured(): boolean {
  const { endpoint, apiKey, deployment } = config.azureOpenAI;
  return Boolean(endpoint && apiKey && deployment);
}

export function isAzureSpeechConfigured(): boolean {
  const { key, region } = config.azureSpeech;
  return Boolean(key && region);
}
