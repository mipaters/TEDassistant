// Future integration placeholder: Azure Functions orchestration layer.
// In production, this module would call an HTTP-triggered Azure Function
// that orchestrates speech, OpenAI reasoning, and CRM writes.

export interface OrchestrationRequest {
  scenario: string;
  transcriptSoFar: string[];
}

export interface OrchestrationResponse {
  nextAction: string;
  confidence: number;
}

export async function callOrchestrationFunction(
  req: OrchestrationRequest
): Promise<OrchestrationResponse> {
  // Mock latency + deterministic response for demo purposes.
  await new Promise((r) => setTimeout(r, 150));
  return {
    nextAction: `mock-orchestrated-response:${req.scenario}`,
    confidence: 0.92,
  };
}
