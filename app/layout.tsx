import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "SaaS Valuation | Accurate Market Value for your SaaS",
  description: "Get a professional, data-driven valuation for your SaaS company in minutes. Trusted by 1,000+ founders.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable} antialiased bg-slate-950 text-slate-100 font-sans`}>
        {children}
      </body>
    </html>
  );
}
