// Synthetic customer profile data for the TED executive demo.
// This mirrors the shape of a future real customer-data API response.

export interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  age: number;
  deviceModel: string;
}

export interface SubscriptionService {
  id: string;
  name: string;
  category: string;
  monthlyCost: number;
  lastUsed: string; // ISO date
  usageScore: number; // 0-100
  status: "active" | "underused" | "unused";
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location?: string;
  category: "medical" | "school" | "travel" | "personal" | "delivery";
}

export interface CallHistoryItem {
  id: string;
  caller: string;
  number: string;
  date: string;
  duration: string;
  outcome: string;
  handledBy: "TED" | "Sarah";
}

export interface SmsHistoryItem {
  id: string;
  from: string;
  preview: string;
  date: string;
}

export interface TravelPlan {
  id: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  flightNumber: string;
  airline: string;
}

export const customer = {
  id: "cust_sarah_thompson",
  name: "Sarah Thompson",
  address: "128 Elmwood Crescent, Toronto, ON",
  phone: "416-555-0142",
  services: ["Wireless", "Internet", "TV"],
  planTier: "Rogers Infinite + Ignite Gigabit + Ignite TV",
  memberSince: "2016-03-11",
  familySize: 4,
};

export const familyMembers: FamilyMember[] = [
  { id: "fam-1", name: "Sarah Thompson", relationship: "Parent", age: 41, deviceModel: "iPhone 16 Pro" },
  { id: "fam-2", name: "Mark Thompson", relationship: "Parent", age: 43, deviceModel: "Samsung Galaxy S25" },
  { id: "fam-3", name: "Emma Thompson", relationship: "Child", age: 13, deviceModel: "iPhone 13" },
  { id: "fam-4", name: "Noah Thompson", relationship: "Child", age: 9, deviceModel: "iPad mini (Family Plan)" },
];

export const subscriptions: SubscriptionService[] = [
  { id: "sub-1", name: "Netflix", category: "Streaming", monthlyCost: 20.99, lastUsed: "2025-10-01", usageScore: 88, status: "active" },
  { id: "sub-2", name: "Disney+", category: "Streaming", monthlyCost: 14.99, lastUsed: "2025-08-14", usageScore: 22, status: "underused" },
  { id: "sub-3", name: "Sportsnet+", category: "Sports", monthlyCost: 24.99, lastUsed: "2025-05-30", usageScore: 4, status: "unused" },
  { id: "sub-4", name: "Prime Video", category: "Streaming", monthlyCost: 9.99, lastUsed: "2025-09-27", usageScore: 61, status: "active" },
  { id: "sub-5", name: "Spotify", category: "Music", monthlyCost: 12.99, lastUsed: "2025-10-06", usageScore: 95, status: "active" },
  { id: "sub-6", name: "Sportsnet+ Add-on (duplicate)", category: "Sports", monthlyCost: 12.99, lastUsed: "2025-04-02", usageScore: 2, status: "unused" },
];

export const monthlySubscriptionSpend = subscriptions.reduce((sum, s) => sum + s.monthlyCost, 0);

export const calendarEvents: CalendarEvent[] = [
  { id: "cal-1", title: "Sarah: Dental appointment", date: "2025-10-08", time: "10:30 AM", location: "Elmwood Dental Clinic", category: "medical" },
  { id: "cal-2", title: "Package delivery window", date: "2025-10-07", time: "2:00 PM - 4:00 PM", category: "delivery" },
  { id: "cal-3", title: "Emma: Parent-teacher conference", date: "2025-10-09", time: "4:00 PM", location: "Elmwood Middle School", category: "school" },
  { id: "cal-4", title: "Flight to Barcelona", date: "2025-10-08", time: "6:45 AM", location: "Toronto Pearson (YYZ)", category: "travel" },
  { id: "cal-5", title: "Family dinner", date: "2025-10-10", time: "6:30 PM", category: "personal" },
];

export const callHistory: CallHistoryItem[] = [
  { id: "call-1", caller: "Dr. Patel's Office", number: "416-555-0179", date: "2025-10-07", duration: "1m 48s", outcome: "Appointment confirmed", handledBy: "TED" },
  { id: "call-2", caller: "Unknown Number", number: "613-555-0911", date: "2025-10-07", duration: "0m 52s", outcome: "Blocked - high scam probability", handledBy: "TED" },
  { id: "call-3", caller: "Metro Courier", number: "905-555-0123", date: "2025-10-07", duration: "0m 41s", outcome: "Delivery window logged", handledBy: "TED" },
  { id: "call-4", caller: "Elmwood Middle School", number: "416-555-0100", date: "2025-10-06", duration: "2m 15s", outcome: "Escalated to Sarah", handledBy: "Sarah" },
  { id: "call-5", caller: "Mark Thompson", number: "416-555-0188", date: "2025-10-05", duration: "4m 02s", outcome: "Personal call", handledBy: "Sarah" },
];

export const smsHistory: SmsHistoryItem[] = [
  { id: "sms-1", from: "TED Assistant", preview: "I confirmed your dental appointment for tomorrow at 10:30 AM.", date: "2025-10-07" },
  { id: "sms-2", from: "TED Assistant", preview: "Blocked a suspicious call claiming to be your bank. No action needed.", date: "2025-10-07" },
  { id: "sms-3", from: "TED Assistant", preview: "Your package will arrive between 2-4 PM today. Reminder created.", date: "2025-10-07" },
  { id: "sms-4", from: "Rogers", preview: "Your Ignite Gigabit bill is ready to view.", date: "2025-10-04" },
];

export const travelPlans: TravelPlan[] = [
  {
    id: "trip-1",
    destination: "Barcelona, Spain",
    departureDate: "2025-10-08",
    returnDate: "2025-10-15",
    flightNumber: "AC 874",
    airline: "Air Canada",
  },
];

export const kpiMetrics = [
  { id: "kpi-1", label: "Reduction in Spam Interruptions", value: 90, unit: "%", trend: "up" as const },
  { id: "kpi-2", label: "Reduction in Scam Exposure", value: 65, unit: "%", trend: "up" as const },
  { id: "kpi-3", label: "Customer Satisfaction Improvement", value: 40, unit: "%", trend: "up" as const },
  { id: "kpi-4", label: "Travel Pass Conversion Increase", value: 25, unit: "%", trend: "up" as const },
  { id: "kpi-5", label: "Marketplace Revenue Growth", value: 18, unit: "%", trend: "up" as const },
];
