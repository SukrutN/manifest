import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Sora } from "next/font/google";
import "./globals.css";

// Open faces throughout; none licensed, none bundled beyond next/font.
// Sora Light plays the reference's display role, Sora Regular the body,
// and JetBrains Mono carries the figures, the wire output, and the
// micro labels, because this page is denser in numbers than the
// reference ever needs to be.
const light = Sora({
  subsets: ["latin"],
  weight: ["300"],
  variable: "--font-light",
  display: "swap",
});

const regular = Sora({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-regular",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Manifest: one order's day through five systems",
  description:
    "How five warehouse systems run one order together, from the line that decides to the ledger that closes clean.",
  openGraph: {
    title: "Manifest: one order's day through five systems",
    description:
      "How five warehouse systems run one order together, from the line that decides to the ledger that closes clean.",
    type: "website",
    images: [
      {
        url: "https://sukrutn.github.io/manifest/og.png",
        width: 1200,
        height: 630,
        alt: "Manifest: one order's day through five systems",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Manifest: one order's day through five systems",
    description:
      "How five warehouse systems run one order together, from the line that decides to the ledger that closes clean.",
    images: ["https://sukrutn.github.io/manifest/og.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0e0e0e",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${light.variable} ${regular.variable} ${mono.variable}`}>
        {children}
      </body>
    </html>
  );
}
