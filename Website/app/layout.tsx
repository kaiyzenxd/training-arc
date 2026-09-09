import type { Metadata } from "next";
import { Archivo, Martian_Mono } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

const martianMono = Martian_Mono({
  variable: "--font-martian",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = "https://mrb-portfolio.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Mark Ryan Baricuatro — AI automation, drawn like circuit boards",
    template: "%s — Mark Ryan Baricuatro",
  },
  description:
    "AI-agent automations built and self-hosted on n8n. Each workflow drawn as a fabricated board: trigger, reasoning, tool calls, outcome, and how it fails safely.",
  openGraph: {
    title: "Mark Ryan Baricuatro — AI automation, drawn like circuit boards",
    description:
      "AI-agent automations built and self-hosted on n8n. Each workflow drawn as a fabricated board.",
    url: SITE_URL,
    siteName: "Mark Ryan Baricuatro",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${martianMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
