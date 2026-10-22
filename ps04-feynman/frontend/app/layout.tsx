import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PS04 Socratic Quest & Academic Workload Engine",
  description:
    "Boot.dev-style Dark Fantasy RPG academic engine with bi-directional Obsidian Vault sync and deterministic NetworkX DAG scheduling.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#0d0e12] text-[#e2e8f0] min-h-screen">
        {children}
      </body>
    </html>
  );
}
