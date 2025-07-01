import type { Metadata } from "next";

export const metadata: Metadata = { title: "Contact Admin" };

export default function ContactAdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
