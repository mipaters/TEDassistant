// Future integration placeholder: Twilio Programmable Voice
// Today this returns mock call-session events. Swap the mock implementation
// for a real Twilio Voice webhook/SDK client without changing callers.

export interface VoiceCallSession {
  callSid: string;
  from: string;
  to: string;
  status: "ringing" | "in-progress" | "completed" | "blocked";
}

export interface TwilioVoiceClient {
  initiateMockInboundCall(from: string): Promise<VoiceCallSession>;
  endCall(callSid: string, outcome: VoiceCallSession["status"]): Promise<void>;
}

export const twilioVoiceClient: TwilioVoiceClient = {
  async initiateMockInboundCall(from: string) {
    return {
      callSid: `CA_mock_${Math.random().toString(36).slice(2, 10)}`,
      from,
      to: "+14165550142",
      status: "ringing",
    };
  },
  async endCall() {
    // no-op in mock mode
  },
};
