import type { Metadata } from "next";
import { Fraunces, DM_Sans } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

// Fallback only — every real page lives under /<slug> (a specific
// company) and could override this with its own generateMetadata later.
// Deliberately names no company here, since this app now serves any of them.
export const metadata: Metadata = {
  title: "Get a Free Quote",
  description: "Answer a few simple questions and get an accurate, no-obligation quote — usually in under 3 minutes.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${fraunces.variable} ${dmSans.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
