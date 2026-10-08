import { config, isAzureOpenAIConfigured } from "./config";

export interface PhoneTurn {
  role: "system" | "user" | "assistant";
  content: string;
}

const PHONE_SYSTEM_PROMPT = `You are TED, a Rogers AI personal assistant answering a live phone call on behalf of your
customer, Sarah Thompson. You already greeted the caller. Be warm, concise, and efficient — like a skilled executive
assistant speaking out loud on the phone. Figure out why they're calling and help them (e.g. take a message, confirm
an appointment, answer a question about Sarah's availability, or politely screen out spam/scam callers). Keep replies
to 1-2 short, natural-sounding sentences — this is a spoken conversation, not a chat window. Never read out markdown,
bullet points, or JSON; respond in plain spoken sentences only.`;

/**
 * Gets TED's next spoken reply for the live phone call, given the conversation
 * so far. Falls back to a short deterministic response if Azure OpenAI isn't
 * configured, so the call doesn't go silent.
 */
export async function getPhoneReply(history: PhoneTurn[]): Promise<string> {
  if (!isAzureOpenAIConfigured()) {
    return "I'm sorry, my connection to Azure OpenAI isn't configured yet, so I can't help with that right now.";
  }

  const { endpoint, apiKey, deployment, apiVersion } = config.azureOpenAI;
  const url = `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`;
  const messages: PhoneTurn[] = [{ role: "system", content: PHONE_SYSTEM_PROMPT }, ...history];

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", "api-key": apiKey as string },
    body: JSON.stringify({ messages, temperature: 0.5, max_tokens: 150 }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Azure OpenAI request failed: ${res.status} ${text}`);
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  return data.choices?.[0]?.message?.content?.trim() || "Sorry, could you say that again?";
}

const SUMMARY_SYSTEM_PROMPT = `You write short SMS text message summaries of phone calls that TED (an AI assistant)
just handled on behalf of Sarah Thompson. Summarize who called and what happened/was decided in ONE short sentence,
under 160 characters, in plain text (no markdown, no quotes). Start with "TED: " and do not mention that this is a
summary or that you are an AI.`;

/**
 * Produces a short SMS-ready summary of a completed call for Sarah, once TED
 * has handled it end-to-end without needing to escalate.
 */
export async function getCallSummary(history: PhoneTurn[]): Promise<string> {
  if (!isAzureOpenAIConfigured()) {
    return "TED: Handled a call for you. (Summary unavailable — Azure OpenAI not configured.)";
  }

  const { endpoint, apiKey, deployment, apiVersion } = config.azureOpenAI;
  const url = `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`;
  const messages: PhoneTurn[] = [{ role: "system", content: SUMMARY_SYSTEM_PROMPT }, ...history];

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", "api-key": apiKey as string },
    body: JSON.stringify({ messages, temperature: 0.3, max_tokens: 80 }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Azure OpenAI summary request failed: ${res.status} ${text}`);
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  return data.choices?.[0]?.message?.content?.trim() || "TED: Handled a call for you.";
}
