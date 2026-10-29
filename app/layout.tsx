import type { Metadata, Viewport } from "next";
import type { CSSProperties } from "react";
import { wedding } from "@/config/wedding";
import "./globals.css";

const { couple, theme } = wedding;

export const metadata: Metadata = {
  title: couple.browserTitle || `${couple.groomName} & ${couple.brideName} — Wedding Invitation`,
  description: `${couple.groomName} & ${couple.brideName} — Wedding Invitation`,
  openGraph: {
    title: couple.browserTitle,
    description: `${couple.groomName} & ${couple.brideName} — Wedding Invitation`,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: theme.ink,
};

/* colours from config/wedding.ts override the stylesheet defaults */
const themeVars = {
  "--gold": theme.gold,
  "--light-gold": theme.lightGold,
  "--deep-rose": theme.deepRose,
  "--rose": theme.rose,
  "--cream": theme.cream,
  "--ink": theme.ink,
  "--reveal": `${theme.revealSpeed}s`,
} as CSSProperties;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" style={themeVars}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Lora:ital,wght@0,400;0,500;0,600;1,400&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
