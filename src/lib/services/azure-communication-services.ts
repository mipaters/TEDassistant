// Future integration placeholder: Azure Communication Services (calling, SMS).

export interface AcsClient {
  sendSms(to: string, body: string): Promise<{ messageId: string }>;
  placeOutboundCall(to: string): Promise<{ callId: string }>;
}

export const acsClient: AcsClient = {
  async sendSms(to: string, body: string) {
    void to;
    void body;
    return { messageId: `acs_mock_${Date.now()}` };
  },
  async placeOutboundCall(to: string) {
    void to;
    return { callId: `acs_call_mock_${Date.now()}` };
  },
};
