
import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster"
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/components/language-provider";
import { FirebaseClientProvider } from "@/firebase/client-provider";
import { Inter } from 'next/font/google';
import { CookieBanner } from "@/components/cookie-banner";
import Script from "next/script";

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: "Nyaya Sahayak | AI Legal Assistant & Forensic Case Auditor in India",
  description: "Empowering Indian citizens with elite AI legal intelligence. Use our Forensic Case Auditor, Document Risk Scanner, and Procedural Roadmap tools to navigate the Indian judicial system with 100% confidence. Get instant summaries and legal drafting support on nyayasahayak.in.",
  keywords: ["AI Legal Assistant India", "Forensic Case Auditor", "Legal Document Risk Assessment", "Indian Law AI", "Legal Notice Generator India", "Nyaya Sahayak"],
  alternates: {
    canonical: "https://nyayasahayak.in",
  },
  openGraph: {
    title: "Nyaya Sahayak | Your AI-Powered Legal Co-Pilot",
    description: "The pinnacle of AI-driven legal empowerment. Analyze case strength, audit documents, and connect with verified advocates.",
    url: "https://nyayasahayak.in",
    siteName: "Nyaya Sahayak",
    images: [
      {
        url: "https://nyayasahayak.in/Logo.png",
        width: 1200,
        height: 630,
        alt: "Nyaya Sahayak Institutional Logo",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nyaya Sahayak | AI Legal Intelligence Node",
    description: "Navigate the Indian Law with Precision AI. Document audits and forensic summaries on nyayasahayak.in.",
    images: ["https://nyayasahayak.in/Logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LegalService",
    "name": "Nyaya Sahayak",
    "image": "https://nyayasahayak.in/Logo.png",
    "url": "https://nyayasahayak.in",
    "telephone": "+91-000-000-0000",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Digital Registry Node",
      "addressLocality": "New Delhi",
      "addressRegion": "Delhi",
      "postalCode": "110001",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 28.6139,
      "longitude": 77.2090
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "00:00",
      "closes": "23:59"
    }
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`font-body antialiased ${inter.variable}`}>
        <ThemeProvider>
          <LanguageProvider>
            <FirebaseClientProvider>
              {children}
              <CookieBanner />
            </FirebaseClientProvider>
            <Toaster />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
