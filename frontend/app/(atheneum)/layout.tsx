import { AtheneumShell } from "@/components/atheneum/AtheneumShell";

export default function AtheneumLayout({ children }: { children: React.ReactNode }) {
  return <AtheneumShell>{children}</AtheneumShell>;
}
