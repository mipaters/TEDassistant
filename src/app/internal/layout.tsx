import { InternalShell } from "@/components/layout/internal-shell";

export default function InternalLayout({ children }: { children: React.ReactNode }) {
  return <InternalShell>{children}</InternalShell>;
}
