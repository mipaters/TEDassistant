import { Smartphone, PhoneCall, Zap, BrainCircuit, Mic, Search, Bot, Database } from "lucide-react";

export const architectureNodes = [
  {
    id: "device",
    icon: Smartphone,
    title: "Customer Device",
    description:
      "The subscriber's phone places or receives a call on the Rogers network — the entry point for every TED interaction.",
  },
  {
    id: "twilio",
    icon: PhoneCall,
    title: "Twilio Voice",
    description:
      "Programmable Voice intercepts and routes the call, streaming real-time audio to the orchestration layer.",
  },
  {
    id: "functions",
    icon: Zap,
    title: "Azure Functions",
    description:
      "Serverless orchestration coordinates speech recognition, reasoning, and downstream actions with low-latency scaling.",
  },
  {
    id: "openai",
    icon: BrainCircuit,
    title: "Azure OpenAI",
    description:
      "GPT-class models interpret caller intent, generate responses, and reason over context in natural language.",
  },
  {
    id: "speech",
    icon: Mic,
    title: "Azure AI Speech",
    description:
      "Real-time speech-to-text and natural text-to-speech power a fluid, human-like conversational experience.",
  },
  {
    id: "search",
    icon: Search,
    title: "Azure AI Search",
    description:
      "Retrieval-augmented grounding pulls relevant customer records — appointments, plans, history — into the conversation.",
  },
  {
    id: "copilot-studio",
    icon: Bot,
    title: "Copilot Studio Agents",
    description:
      "Specialized agents (scam detection, travel, subscriptions) execute domain logic and trigger actions like calendar updates.",
  },
  {
    id: "fabric",
    icon: Database,
    title: "Microsoft Fabric",
    description:
      "Unified analytics platform aggregates interaction data into executive KPIs and continuously improves TED's models.",
  },
];
