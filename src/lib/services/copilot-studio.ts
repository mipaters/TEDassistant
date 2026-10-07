// Future integration placeholder: Copilot Studio agent orchestration.

export interface CopilotStudioAgentClient {
  invokeAgent(topic: string, input: Record<string, unknown>): Promise<{ output: string }>;
}

export const copilotStudioAgentClient: CopilotStudioAgentClient = {
  async invokeAgent(topic, input) {
    return { output: `mock-copilot-studio-response for topic "${topic}" with input ${JSON.stringify(input)}` };
  },
};
