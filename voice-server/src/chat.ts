import { config, isAzureOpenAIConfigured } from "./config";

export interface WebChatTurn {
  role: "system" | "user" | "assistant";
  content: string;
}

const WEB_CHAT_SYSTEM_PROMPT = `You are TED, Rogers' trusted everyday digital AI assistant, chatting directly with
your customer (not a phone caller this time — this is the customer typing or talking to you through the TED app).
Be warm, concise, and genuinely helpful, like a sharp executive assistant. You can discuss their Rogers wireless,
internet, and TV services, travel plans, family safety, scam protection, and subscriptions in general terms. If asked
to do something you cannot actually perform in this demo (e.g. booking a technician, buying tickets), answer helpfully
in character and explain what you'd do next, rather than breaking character. Keep replies conversational and no more
than 2-3 short sentences, suitable for being read on a phone screen or spoken aloud.`;

/**
 * Gets TED's next reply for the website's "Chat with TED" experience (text or
 * voice), given the conversation so far and the customer's latest message.
 * Falls back to a short deterministic response if Azure OpenAI isn't
 * configured, so the chat UI doesn't go silent.
 */
export async function getWebChatReply(history: WebChatTurn[], message: string): Promise<string> {
  if (!isAzureOpenAIConfigured()) {
    return "I'm sorry, my connection to Azure OpenAI isn't configured yet, so I can't help with that right now.";
  }

  const { endpoint, apiKey, deployment, apiVersion } = config.azureOpenAI;
  const url = `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`;
  const messages: WebChatTurn[] = [
    { role: "system", content: WEB_CHAT_SYSTEM_PROMPT },
    ...history,
    { role: "user", content: message },
  ];

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", "api-key": apiKey as string },
    body: JSON.stringify({ messages, temperature: 0.6, max_tokens: 250 }),
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
