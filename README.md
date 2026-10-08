# TED — Trusted Everyday Digital Assistant

A Rogers-branded executive demonstration of a future personal AI assistant, built as a
Microsoft Executive Briefing Center–style showcase. TED handles everyday calls, protects
against scams, keeps families connected, assists with travel, and optimizes subscription
spend — all powered by (mock) Azure AI and Rogers network intelligence.

## Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS v4
- Hand-authored shadcn-style UI primitives (Button, Card, Badge, Progress, Tabs, Separator)
- Framer Motion for animation
- Lucide React icons

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The root route redirects to `/home`.

## Pages

| Route | Description |
| --- | --- |
| `/home` | Hero, six capability cards, executive KPI dashboard |
| `/call-concierge` | AI call concierge — appointment confirmation & package delivery scenarios |
| `/scam-protection` | Real-time fraud scoring and call-blocking simulation |
| `/family-safety` | Trusted-institution recognition and escalation workflow |
| `/travel-assistant` | Proactive travel widgets (roaming, flight, weather, currency) |
| `/subscription-advisor` | Synthetic subscription audit and savings recommendations |
| `/why-rogers` | Executive strategy: six pillars of Rogers' unique advantage |
| `/architecture` | Interactive technical architecture walkthrough |

## Executive Demo Mode

Click **Start Executive Demo** (top right) to auto-advance through every scenario on a timer,
with Previous / Pause / Next controls in the floating control bar.

## Data & Integrations

- `src/data/*` — synthetic customer data (Sarah Thompson household) modeling calls, SMS,
  calendar, travel, and subscriptions as JSON-shaped mock data, ready to be swapped for real
  APIs.
- `src/lib/services/*` — clean interface placeholders for future integrations: Twilio Voice,
  Azure Functions, Azure OpenAI, Azure AI Speech, Azure Communication Services, Microsoft
  Graph, and Copilot Studio. Each exports a typed client with mock implementations today.
