import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import AppBar from "@/components/AppBar";
import Footer from "@/components/Footer";

const plexSans = IBM_Plex_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-body", display: "swap" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-mono", display: "swap" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-display", display: "swap" });

export const metadata: Metadata = {
  title: { default: "ASCVD Risk Factor Atlas", template: "%s — ASCVD Risk Factor Atlas" },
  description:
    "A de novo, evidence-linked catalog of every risk factor reported for atherosclerotic cardiovascular disease (ASCVD) — each graded by evidence strength and mapped against the AHA PREVENT equations.",
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#f7f9fd" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${plexSans.variable} ${plexMono.variable} ${spaceGrotesk.variable}`}>
      <body>
        <AppBar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
