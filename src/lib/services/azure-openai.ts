// Azure OpenAI Service integration.
//
// Server-only module (reads process.env secrets — never import this from a
// "use client" component). Falls back to lightweight mock behavior when the
// AZURE_OPENAI_* environment variables are not configured, so the rest of the
// demo keeps working without credentials.

export interface ChatTurn {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface AzureOpenAIClient {
  getCompletion(messages: ChatTurn[]): Promise<string>;
  classifyIntent(utterance: string): Promise<{ intent: string; confidence: number }>;
}

export type TedVoiceMode = "concierge" | "scam";

export interface TedTurnRequest {
  mode: TedVoiceMode;
  history: { speaker: "caller" | "ted"; text: string }[];
  utterance: string;
}

export interface TedTurnResponse {
  reply: string;
  intent: string;
  identityConfidence: "low" | "medium" | "high";
  recommendedAction: string;
  summary: string;
  fraudScore: number | null;
  flags: string[];
  blocked: boolean;
}

function getConfig() {
  const endpoint = process.env.AZURE_OPENAI_ENDPOINT?.replace(/\/$/, "");
  const apiKey = process.env.AZURE_OPENAI_API_KEY;
  const deployment = process.env.AZURE_OPENAI_DEPLOYMENT;
  const apiVersion = process.env.AZURE_OPENAI_API_VERSION || "2024-08-01-preview";
  return { endpoint, apiKey, deployment, apiVersion };
}

export function isAzureOpenAIConfigured(): boolean {
  const { endpoint, apiKey, deployment } = getConfig();
  return Boolean(endpoint && apiKey && deployment);
}

const CONCIERGE_SYSTEM_PROMPT = `You are TED, a Rogers AI call concierge, live-screening a phone call on behalf of your customer Sarah Thompson.
You are speaking directly to the caller (the user in this conversation is playing the role of the caller).
Be courteous, brief, and efficient — like a skilled executive assistant. Figure out why they are calling, confirm any
relevant details, and take the appropriate action (e.g. confirm an appointment, log a delivery window, take a message).
Keep each reply to 1-2 short sentences, suitable for being spoken aloud.

You MUST respond with strict JSON only, matching exactly this shape, and nothing else:
{
  "reply": string,               // what TED says out loud next
  "intent": string,               // short label for caller intent, e.g. "Appointment confirmation"
  "identityConfidence": "low" | "medium" | "high",
  "recommendedAction": string,    // short label, e.g. "Confirm attendance"
  "summary": string                // one sentence recap of the call so far
}`;

const SCAM_SYSTEM_PROMPT = `You are TED, a Rogers AI scam-protection concierge, live-screening a suspicious phone call on behalf of
your customer Sarah Thompson. The user in this conversation is playing the role of the caller, who MAY be attempting a
scam (e.g. urgency tactics, fake bank/security alerts, requests for payment, gift cards, personal/financial information,
remote access, or impersonating an institution). Stay calm, ask clarifying questions, and never reveal personal or
financial information. Keep each reply to 1-2 short sentences, suitable for being spoken aloud.

You MUST respond with strict JSON only, matching exactly this shape, and nothing else:
{
  "reply": string,                      // what TED says out loud next
  "intent": string,                      // short label, e.g. "Suspected bank impersonation scam"
  "fraudScore": number,                  // your running 0-100 estimate of scam probability given everything said so far
  "flags": string[],                     // short detection reasons observed so far, e.g. ["Urgency language detected"]
  "blocked": boolean,                    // true once fraudScore is high enough (generally >= 85) that TED should end the call
  "summary": string                       // one sentence recap of the call so far
}`;

function buildMessages(req: TedTurnRequest): ChatTurn[] {
  const systemPrompt = req.mode === "scam" ? SCAM_SYSTEM_PROMPT : CONCIERGE_SYSTEM_PROMPT;
  const historyTurns: ChatTurn[] = req.history.map((line) => ({
    role: line.speaker === "ted" ? "assistant" : "user",
    content: line.text,
  }));
  return [
    { role: "system", content: systemPrompt },
    ...historyTurns,
    { role: "user", content: req.utterance },
  ];
}

function fallbackTurnResponse(req: TedTurnRequest): TedTurnResponse {
  const lower = req.utterance.toLowerCase();
  if (req.mode === "scam") {
    const isUrgent = /immediately|compromised|act now|urgent|gift card|password|verify your account/.test(lower);
    const fraudScore = isUrgent ? 82 : 35;
    return {
      reply: isUrgent
        ? "I'm not able to verify your identity, and I won't share any account details. This call will now be blocked."
        : "Can you tell me more about why you're calling, and provide a callback number I can verify?",
      intent: isUrgent ? "Suspected scam — urgency & identity pressure" : "Unverified caller",
      identityConfidence: "low",
      recommendedAction: isUrgent ? "Block call" : "Request verification",
      summary: isUrgent ? "Caller used urgency tactics and could not verify identity." : "Awaiting more detail from caller.",
      fraudScore,
      flags: isUrgent ? ["Urgency language detected", "Identity unverifiable"] : ["Identity unverifiable"],
      blocked: isUrgent,
    };
  }
  return {
    reply: "Thank you — could you confirm the purpose of your call so I can help?",
    intent: "General inquiry",
    identityConfidence: "medium",
    recommendedAction: "Gather more detail",
    summary: "Call in progress; TED is gathering context (Azure OpenAI not configured — showing mock response).",
    fraudScore: null,
    flags: [],
    blocked: false,
  };
}

export const azureOpenAIClient: AzureOpenAIClient = {
  async getCompletion(messages: ChatTurn[]) {
    const { endpoint, apiKey, deployment, apiVersion } = getConfig();
    if (!endpoint || !apiKey || !deployment) {
      const last = messages[messages.length - 1]?.content ?? "";
      return `Mock Azure OpenAI response to: "${last}"`;
    }
    const url = `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "api-key": apiKey },
      body: JSON.stringify({ messages, temperature: 0.4, max_tokens: 300 }),
    });
    if (!res.ok) {
      throw new Error(`Azure OpenAI request failed: ${res.status} ${await res.text()}`);
    }
    const data = await res.json();
    return data.choices?.[0]?.message?.content ?? "";
  },

  async classifyIntent(utterance: string) {
    const lower = utterance.toLowerCase();
    if (lower.includes("bank") || lower.includes("compromised") || lower.includes("immediately")) {
      return { intent: "potential_fraud", confidence: 0.94 };
    }
    if (lower.includes("appointment") || lower.includes("confirm")) {
      return { intent: "appointment_confirmation", confidence: 0.97 };
    }
    if (lower.includes("delivery") || lower.includes("package")) {
      return { intent: "delivery_notification", confidence: 0.96 };
    }
    return { intent: "general_inquiry", confidence: 0.8 };
  },
};

/**
 * Drives one turn of the live, real-time Call Concierge / Scam Protection voice
 * demo. Given the conversation so far and the caller's latest utterance, asks
 * Azure OpenAI (in character as TED) for a structured reply. Falls back to a
 * deterministic mock when Azure OpenAI is not configured.
 */
export async function getTedTurnResponse(req: TedTurnRequest): Promise<TedTurnResponse> {
  const { endpoint, apiKey, deployment, apiVersion } = getConfig();
  if (!endpoint || !apiKey || !deployment) {
    return fallbackTurnResponse(req);
  }

  const url = `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", "api-key": apiKey },
    body: JSON.stringify({
      messages: buildMessages(req),
      temperature: 0.4,
      max_tokens: 400,
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) {
    throw new Error(`Azure OpenAI request failed: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content ?? "{}";
  let parsed: Partial<TedTurnResponse> = {};
  try {
    parsed = JSON.parse(content);
  } catch {
    parsed = { reply: content };
  }

  return {
    reply: parsed.reply ?? "I'm sorry, could you repeat that?",
    intent: parsed.intent ?? "Analyzing…",
    identityConfidence: parsed.identityConfidence ?? "low",
    recommendedAction: parsed.recommendedAction ?? "Continue screening",
    summary: parsed.summary ?? "Call in progress.",
    fraudScore: req.mode === "scam" ? Math.max(0, Math.min(100, Number(parsed.fraudScore ?? 0))) : null,
    flags: Array.isArray(parsed.flags) ? parsed.flags : [],
    blocked: Boolean(parsed.blocked),
  };
}
