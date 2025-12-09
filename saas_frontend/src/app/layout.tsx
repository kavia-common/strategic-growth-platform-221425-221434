import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Strategic Growth Platform",
  description: "Enterprise SaaS Solution",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased text-text bg-background" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
