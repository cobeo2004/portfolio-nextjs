import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import clsx from "clsx";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "sonner";
import CommandPalette from "@/components/chatbot/CommandPalette";
import Footer from "@/components/footer/Footer";
import Nav from "@/components/navigation/Nav";
import WizardMode from "@/components/wizard/WizardMode";
import { siteConfig } from "@/lib/data";
import { themeBootScript } from "@/lib/theme-store";
import QueryProvider from "@/providers/QueryProvider";
import SiteProvider from "@/providers/SiteProvider";

// Archivo with its width axis for the expanded uppercase display type. The Vietnamese subset is a
// second family so glyphs like "ệ" fall through to it instead of a system font.
const archivo = localFont({
  src: "./fonts/Archivo-wdth.woff2",
  variable: "--font-archivo",
  weight: "100 900",
  declarations: [{ prop: "font-stretch", value: "62% 125%" }],
  display: "swap",
});
const archivoVi = localFont({
  src: "./fonts/Archivo-wdth-vi.woff2",
  variable: "--font-archivo-vi",
  weight: "100 900",
  declarations: [{ prop: "font-stretch", value: "62% 125%" }],
  display: "swap",
  preload: false,
});
const plexSans = localFont({
  src: [
    { path: "./fonts/IBMPlexSans-300.woff2", weight: "300" },
    { path: "./fonts/IBMPlexSans-400.woff2", weight: "400" },
    { path: "./fonts/IBMPlexSans-500.woff2", weight: "500" },
    { path: "./fonts/IBMPlexSans-600.woff2", weight: "600" },
  ],
  variable: "--font-plex-sans",
  display: "swap",
});
const plexMono = localFont({
  src: [
    { path: "./fonts/IBMPlexMono-400.woff2", weight: "400" },
    { path: "./fonts/IBMPlexMono-500.woff2", weight: "500" },
  ],
  variable: "--font-plex-mono",
  display: "swap",
});

const title = "Simon Nguyen, forward deployed and full-stack engineer";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: title,
    template: "%s | Simon Nguyen",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  keywords: [
    "Simon Nguyen",
    "forward deployed engineer",
    "full-stack engineer",
    "AI agents",
    "RAG",
    "Melbourne",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: "/",
    siteName: siteConfig.name,
    title,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: siteConfig.description,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#eef0f4" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0b0f" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={clsx(
        archivo.variable,
        archivoVi.variable,
        plexSans.variable,
        plexMono.variable,
      )}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body>
        <QueryProvider>
          <SiteProvider>
            <WizardMode />
            <Nav />
            {children}
            <Footer />
            <CommandPalette />
          </SiteProvider>
        </QueryProvider>
        <div id="my-modal" />
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              borderRadius: 0,
              border: 0,
              background: "var(--ink)",
              color: "var(--paper)",
              fontFamily: "var(--sans)",
              fontSize: 15,
            },
          }}
        />
        <Analytics />
      </body>
    </html>
  );
}
