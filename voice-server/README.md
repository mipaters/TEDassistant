# TED Voice Server

A small, always-on Node/Express service that bridges a real Twilio phone
number to Azure AI Speech (speech-to-text + text-to-speech) and Azure OpenAI
(chat), so callers can have a live spoken conversation with TED.

**Why this is a separate service:** the main TED web app (`/..` at the repo
root) is a statically-exported Next.js site hosted on Azure Static Web Apps.
Static sites cannot run webhooks or hold open WebSocket connections, both of
which Twilio Voice requires (a TwiML webhook to answer the call, and a
persistent WebSocket for the live, bidirectional audio "Media Stream"). This
service is the always-on backend that handles both, and is deployed
independently (e.g. to Azure App Service).

## How it works

1. Twilio calls `POST /twilio/voice` when your number receives a call. This
   service responds with TwiML that connects the call to a WebSocket at
   `wss://<host>/media`.
2. Twilio opens that WebSocket and streams the caller's audio in real time
   (8kHz µ-law, in Twilio's "Media Streams" format).
3. Audio is decoded to PCM16 and fed into a continuous Azure AI Speech
   recognizer. As the caller speaks, their recognized text is sent to Azure
   OpenAI (with the ongoing conversation history) for TED's reply.
4. The reply is synthesized with Azure AI Speech (male neural voice, default
   `en-US-GuyNeural`), encoded back to µ-law, and streamed back to Twilio —
   so the caller hears TED respond.
5. The instant the call connects, TED speaks a configurable greeting
   (default: *"Hi, you've reached Ted, the personal AI assistant for Sarah.
   How can I help you today?"*).

## Local development

```bash
cd voice-server
npm install
cp .env.example .env   # fill in your Azure OpenAI + Azure Speech credentials
npm run dev
```

To let Twilio reach your local machine, tunnel it with something like
[ngrok](https://ngrok.com/):

```bash
ngrok http 8080
```

Then, in the Twilio Console, set your phone number's **Voice webhook** (A
call comes in) to:

```
https://<your-ngrok-subdomain>.ngrok-free.app/twilio/voice
```

And set `PUBLIC_HOSTNAME=<your-ngrok-subdomain>.ngrok-free.app` in `.env` so
the generated TwiML points the media stream back at the same tunnel.

## Deploying (Azure App Service)

1. Create a **Linux, Node 20** Azure App Service.
2. In **Configuration > General settings**, turn on **Web sockets**, and make
   sure **Always On** is enabled (so the process doesn't idle out between
   calls).
3. Set the app settings (environment variables) from `.env.example` —
   `AZURE_OPENAI_*`, `AZURE_SPEECH_*`, `TWILIO_AUTH_TOKEN`, and
   `PUBLIC_HOSTNAME` (your App Service's hostname, e.g.
   `ted-voice.azurewebsites.net`).
4. Deploy this `voice-server/` folder (e.g. via `az webapp up`, GitHub
   Actions, or zip deploy). The platform runs `npm install && npm run build`
   then `npm start` (see `package.json`).
5. In the Twilio Console, point your number's Voice webhook at:
   `https://<your-app>.azurewebsites.net/twilio/voice`.

## Required Azure resources

- **Azure OpenAI** resource with a chat-completions model deployed (e.g.
  `gpt-4o` or `gpt-4o-mini`).
- **Azure AI Speech** resource (any region that supports neural TTS voices
  and speech-to-text, e.g. `eastus`).

## Environment variables

See `.env.example` for the full list and descriptions.
