import type { Metadata } from "next";
import Script from "next/script";
import { Inter } from "next/font/google";
import { AgentationToolbar } from "@/components/agentation-toolbar";
import { PayInFourThemeProvider } from "@/components/pay-in-four-theme";
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
        <PayInFourThemeProvider>
          {children}
          <AgentationToolbar />
          {process.env.NODE_ENV === "development" ? (
            <Script
              src="https://mcp.figma.com/mcp/html-to-design/capture.js"
              strategy="afterInteractive"
            />
          ) : null}
        </PayInFourThemeProvider>
      </body>
    </html>
  )
}
