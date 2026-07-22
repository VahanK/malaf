import type { Metadata } from "next";
import { Inter, Tajawal, Fraunces } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-tajawal",
  display: "swap",
});

// Display serif for the homepage — H1 and section H2s only. Optical-size axis
// gives it a warm, premium feel at large sizes (the marketing brand voice),
// distinct from the app's Inter UI stack.
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "WorkWith — your freelance business, from one link",
  description:
    "For Lebanese freelancers: build a professional page free, publish it live for $29/year, and run the whole job behind it — quotes, invoices, getting paid on Whish, USDT & cash.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" dir="ltr" className={`${inter.variable} ${tajawal.variable} ${fraunces.variable}`} suppressHydrationWarning>
      <body className="font-sans" style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
