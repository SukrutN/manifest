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
  title: "Manifest · one order's day through five systems",
  description:
    "Manifest runs one order through five material-handling systems and journals the whole day: the order, the seats, the walk, the plan, the verdicts, the ledger. Every figure comes from a real harness run you can replay yourself.",
  openGraph: {
    title: "Manifest · one order's day through five systems",
    description:
      "One order walks five systems, from the lane it lands on to the verdicts the floor journals back. Every figure on the page comes from a real run.",
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
    title: "Manifest · one order's day through five systems",
    description:
      "One order walks five systems, from the lane it lands on to the verdicts the floor journals back.",
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
