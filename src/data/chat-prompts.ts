export interface ChatActionItem {
  label: string;
  value: string;
  tone?: "default" | "success";
}

export interface ChatActionCard {
  title: string;
  detail: string;
  items: ChatActionItem[];
  cta: string;
  doneLabel: string;
}

export interface ChatExchange {
  id: string;
  prompt: string;
  tedReplies: string[];
  actionCard?: ChatActionCard;
}

export const chatPrompts: ChatExchange[] = [
  {
    id: "schedule-tech",
    prompt: "Can you schedule a technician visit to check our WiFi signal?",
    tedReplies: [
      "Checking technician availability in your area…",
      "I found an opening this Thursday between 9–11 AM.",
      "Done — I've booked the appointment and added it to your family calendar.",
    ],
    actionCard: {
      title: "Technician Visit Scheduled",
      detail: "Rogers Ignite Gigabit · signal diagnostic",
      items: [
        { label: "Date", value: "Thursday, 9:00–11:00 AM" },
        { label: "Calendar", value: "Updated", tone: "success" },
        { label: "Reminder", value: "Set for Wednesday, 6:00 PM", tone: "success" },
      ],
      cta: "View in Calendar",
      doneLabel: "Added to calendar",
    },
  },
  {
    id: "better-plan",
    prompt: "Can you find me a better plan based on how we actually use our services?",
    tedReplies: [
      "Reviewing your usage across wireless, internet, and TV…",
      "Your family uses nearly 2x your current data allowance in peak months.",
      "Switching to Rogers Infinite Plus + Ignite Gigabit Max saves $12/month with double the data.",
    ],
    actionCard: {
      title: "Plan Optimization Found",
      detail: "Infinite Plus + Ignite Gigabit Max",
      items: [
        { label: "Current plan", value: "$214/mo" },
        { label: "Recommended plan", value: "$202/mo", tone: "success" },
        { label: "Data allowance", value: "2x increase", tone: "success" },
      ],
      cta: "Switch My Plan",
      doneLabel: "Plan switch requested",
    },
  },
  {
    id: "compare-providers",
    prompt: "How do we compare against other providers right now?",
    tedReplies: [
      "Comparing Rogers against Bell and Telus for your exact usage pattern…",
      "Rogers remains $18/month cheaper with stronger 5G coverage at your address.",
      "I also confirmed your loyalty tenure qualifies you for an additional loyalty credit.",
    ],
    actionCard: {
      title: "Provider Comparison",
      detail: "Based on your household's usage & location",
      items: [
        { label: "Rogers (current)", value: "$202/mo · 5G strong", tone: "success" },
        { label: "Bell", value: "$220/mo · 5G moderate" },
        { label: "Telus", value: "$216/mo · 5G moderate" },
      ],
      cta: "Apply Loyalty Credit",
      doneLabel: "Loyalty credit applied",
    },
  },
  {
    id: "concert-tickets",
    prompt: "Can you get me tickets to the Backstreet Boys concert at Rogers Stadium?",
    tedReplies: [
      "Checking available seats at Rogers Stadium for the Backstreet Boys show…",
      "Found two seats in Section 112, Row J — your Rogers loyalty discount applies at checkout.",
      "Purchasing now and adding the tickets to your mobile wallet…",
    ],
    actionCard: {
      title: "Tickets Purchased",
      detail: "Backstreet Boys · Rogers Stadium · Section 112, Row J",
      items: [
        { label: "Seats", value: "2 (Row J)" },
        { label: "Price", value: "$333.00 after loyalty discount", tone: "success" },
        { label: "Delivery", value: "Added to mobile wallet", tone: "success" },
      ],
      cta: "View Tickets",
      doneLabel: "Tickets added to wallet",
    },
  },
  {
    id: "highlight-reel",
    prompt: "Can you put together Auston Matthews highlights from last night's game and text me a video?",
    tedReplies: [
      "Pulling last night's Maple Leafs broadcast from Sportsnet…",
      "Found 3 Auston Matthews highlights — 2 goals and a highlight-reel assist.",
      "Editing a 45-second reel now and sending it straight to your phone.",
    ],
    actionCard: {
      title: "Highlight Reel Sent",
      detail: "Auston Matthews · Maple Leafs · Sportsnet",
      items: [
        { label: "Clips", value: "3 highlights (2 goals, 1 assist)" },
        { label: "Length", value: "0:45" },
        { label: "Delivery", value: "Sent via text message", tone: "success" },
      ],
      cta: "Watch Again",
      doneLabel: "Video sent",
    },
  },
];
