import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import clsx from "clsx";
import FireFlyBackground from "../components/background/FireFlyBackground";
import Sound from "@/components/Sounds/Sound";
import QueryProvider from "@/providers/QueryProvider";
import ChatButton from "@/components/chatbot/ChatButton";
import { Analytics } from "@vercel/analytics/next";
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Simon Nguyen",
  description: "Portfolio of Simon Nguyen",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={clsx(
          inter.variable,
          "bg-background text-foreground font-inter",
        )}
      >
        <div className="z-0">
          <FireFlyBackground />
        </div>
        <div className="z-20">
          <Sound />
        </div>
        <div className="z-50">
          <ChatButton />
        </div>
        <div id="my-modal" />
        <QueryProvider>{children}</QueryProvider>
        <Analytics />
      </body>
    </html>
  );
}
