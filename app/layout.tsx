import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import CookieConsentBanner from "@/components/CookieConsentBanner";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Free SaaS Valuation Calculator 2026 | Get Your Business Value in Minutes",
  description: "Calculate your SaaS company's market value instantly with our free AI-powered valuation tool. Trusted by 1,000+ founders. Get accurate ARR multiples and exit estimates for 2026.",
  keywords: "SaaS valuation calculator, free business valuation tool, SaaS company value, ARR multiples 2026, how to value my SaaS",
  openGraph: {
    title: "Free SaaS Valuation Calculator | Accurate Market Value for Your Business",
    description: "Get a professional, data-driven valuation for your SaaS company in minutes. Free calculator trusted by 1,000+ founders with 2026 market multiples.",
  },
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
        <CookieConsentBanner />
        <Analytics />
        <Script id="schema-org" type="application/ld+json" strategy="afterInteractive">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'Organization',
                name: 'SaaS Valuation',
                url: 'https://saasvaluation.app',
                logo: 'https://saasvaluation.app/favicon.ico',
                sameAs: [],
              },
              {
                '@type': 'WebSite',
                name: 'SaaS Valuation',
                url: 'https://saasvaluation.app',
              },
            ],
          })}
        </Script>
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=G-772JV93TYR`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
        >
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', {
              ad_storage: 'denied',
              analytics_storage: 'denied',
              functionality_storage: 'denied',
              personalization_storage: 'denied',
              security_storage: 'granted'
            });
            gtag('js', new Date());
            gtag('config', 'G-772JV93TYR', { anonymize_ip: true });
          `}
        </Script>
      </body>
    </html>
  );
}
