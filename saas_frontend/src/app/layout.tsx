import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Optimize font loading
const inter = Inter({ 
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter"
});

export const metadata: Metadata = {
  title: {
    default: "Strategic Growth Platform",
    template: "%s | Strategic Growth Platform"
  },
  description: "Enterprise SaaS Solution for Strategic Business Growth and Analytics",
  keywords: ["enterprise", "saas", "business growth", "analytics", "strategy"],
  authors: [{ name: "Your Company Name" }],
  creator: "Your Company Name",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Strategic Growth Platform",
    description: "Enterprise SaaS Solution for Strategic Business Growth",
    siteName: "Strategic Growth Platform",
  },
  twitter: {
    card: "summary_large_image",
    title: "Strategic Growth Platform",
    description: "Enterprise SaaS Solution for Strategic Business Growth",
    creator: "@yourhandle",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="antialiased text-text bg-background font-sans min-h-screen">
        <div id="portal-root" />
        <main className="relative">
          {children}
        </main>
        <div id="modal-root" />
      </body>
    </html>
  );
}