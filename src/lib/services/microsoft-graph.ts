// Future integration placeholder: Microsoft Graph (calendar, mail, contacts).

export interface MicrosoftGraphClient {
  createCalendarEvent(event: { title: string; start: string; end?: string }): Promise<{ id: string }>;
  getUpcomingEvents(): Promise<Array<{ id: string; title: string; start: string }>>;
}

export const microsoftGraphClient: MicrosoftGraphClient = {
  async createCalendarEvent(event) {
    return { id: `graph_mock_${Date.now()}`, ...event } as { id: string };
  },
  async getUpcomingEvents() {
    return [];
  },
};
