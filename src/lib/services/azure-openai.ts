// Future integration placeholder: Azure OpenAI Service.
// Replace the mock completion with a real chat-completions call against
// an Azure OpenAI deployment (e.g. gpt-4o) once credentials are available.

export interface ChatTurn {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface AzureOpenAIClient {
  getCompletion(messages: ChatTurn[]): Promise<string>;
  classifyIntent(utterance: string): Promise<{ intent: string; confidence: number }>;
}

export const azureOpenAIClient: AzureOpenAIClient = {
  async getCompletion(messages: ChatTurn[]) {
    const last = messages[messages.length - 1]?.content ?? "";
    return `Mock Azure OpenAI response to: "${last}"`;
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
