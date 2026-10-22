import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Socratic Academic Engine | Gamified Mastery & DAG Scheduler",
  description:
    "Autonomous gamified academic planner powered by NetworkX DAG scheduling, zero-token calendar drift cascade, and token-bounded Socratic Feynman proctoring.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect for Google Fonts & Fontshare (Switzer) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="anonymous" />
        <link href="https://api.fontshare.com/v2/css?f[]=switzer@400,500,600&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased bg-canvas text-ink min-h-screen" style={{ backgroundColor: "#0d0e12", color: "#e2e8f0" }}>
        {children}
      </body>
    </html>
  );
}
