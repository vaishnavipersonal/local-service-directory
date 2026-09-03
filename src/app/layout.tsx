import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Saket Sathi - Find Trusted Local Services in Saket",
  description: "Discover trusted, verified local service professionals in Saket, South Delhi with Saket Sathi. Perfect for new residents, couples, and short-term stayers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} h-full antialiased bg-slate-50`}
    >
      <body className="min-h-full flex flex-col font-sans selection:bg-blue-200 selection:text-blue-900">{children}</body>
    </html>
  );
}
