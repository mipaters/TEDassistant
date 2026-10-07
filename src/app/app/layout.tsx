import { ConsumerShell } from "@/components/app-experience/consumer-shell";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <ConsumerShell>{children}</ConsumerShell>;
}
