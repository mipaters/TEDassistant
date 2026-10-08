export type CallDisposition = "continue" | "escalate" | "block";

export interface EscalationResult {
  disposition: CallDisposition;
  reasons: string[];
}

// Phrases that suggest the caller needs Sarah directly, right now (e.g. a
// school, emergency, or someone insisting on speaking to her personally).
const ESCALATE_PATTERNS: { pattern: RegExp; reason: string }[] = [
  { pattern: /\bschool\b|\bprincipal\b|\bteacher\b/i, reason: "Call relates to a school" },
  { pattern: /\bemergency\b|\bhospital\b|\bambulance\b|\bnurse\b/i, reason: "Emergency or medical context" },
  { pattern: /\bneed to speak (to|with) sarah\b|\bput her on\b|\bthis is urgent\b/i, reason: "Caller insists on speaking to Sarah directly" },
];

// Phrases consistent with common fraud/social-engineering scripts.
const BLOCK_PATTERNS: { pattern: RegExp; reason: string }[] = [
  { pattern: /compromis(ed|e)|account has been (flagged|suspended|locked)/i, reason: "Urgency language detected" },
  { pattern: /act (immediately|now)|verify your (password|pin|account|social security)/i, reason: "Social engineering indicators" },
  { pattern: /\bwire transfer\b|\bgift card\b|\bwiring money\b/i, reason: "Social engineering indicators" },
  { pattern: /\birs\b|\barrest warrant\b|\bsocial security number\b/i, reason: "Identity unverifiable" },
];

/**
 * Lightweight, latency-free keyword classifier run against the running call
 * transcript (caller turns only) to decide whether TED should keep handling
 * the call itself, bridge it live to Sarah, or shut it down as a suspected
 * scam. Deliberately rule-based rather than an extra AI round-trip, so it
 * never adds latency to the live conversation.
 */
export function classifyTranscript(callerText: string): EscalationResult {
  const blockReasons = BLOCK_PATTERNS.filter((p) => p.pattern.test(callerText)).map((p) => p.reason);
  if (blockReasons.length > 0) {
    return { disposition: "block", reasons: Array.from(new Set(blockReasons)) };
  }

  const escalateReasons = ESCALATE_PATTERNS.filter((p) => p.pattern.test(callerText)).map((p) => p.reason);
  if (escalateReasons.length > 0) {
    return { disposition: "escalate", reasons: Array.from(new Set(escalateReasons)) };
  }

  return { disposition: "continue", reasons: [] };
}
