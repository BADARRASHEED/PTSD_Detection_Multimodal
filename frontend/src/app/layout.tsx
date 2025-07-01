import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PTSD Detection System",
  description: "Multimodal PTSD detection platform",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
