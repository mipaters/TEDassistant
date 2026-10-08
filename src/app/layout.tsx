import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { DemoModeProvider } from "@/context/demo-mode-context";
import { DemoModeBar } from "@/components/layout/demo-mode-bar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TED · Trusted Everyday Digital Assistant | Rogers",
  description:
    "TED is Rogers' trusted everyday digital assistant — an executive demonstration of AI-powered call concierge, scam protection, family safety, travel assistance and subscription intelligence.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icons/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "TED",
  },
};

export const viewport = {
  themeColor: "#05070d",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}>
      <body className="min-h-full">
        <DemoModeProvider>
          {children}
          <DemoModeBar />
        </DemoModeProvider>
      </body>
    </html>
  );
}
