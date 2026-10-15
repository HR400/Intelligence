import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

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
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#070a12] text-gray-100 min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
