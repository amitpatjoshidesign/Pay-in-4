import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AgentationToolbar } from "@/components/agentation-toolbar";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pay in 4 Checkout Demo",
  description: "A shadcn checkout demo for a Pay in 4 payment option.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <AgentationToolbar />
      </body>
    </html>
  )
}
