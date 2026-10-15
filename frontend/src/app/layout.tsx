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
        {/* Preconnect for Google Fonts loaded in globals.css */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased bg-canvas text-ink min-h-screen">
        {children}
      </body>
    </html>
  );
}
