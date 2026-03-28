import type { Metadata, Viewport } from "next";
import { Toaster } from "@/components/ui/toaster"
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/components/language-provider";
import { FirebaseClientProvider } from "@/firebase/client-provider";
import { Inter } from 'next/font/google';
import { CookieBanner } from "@/components/cookie-banner";
import Script from "next/script";

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export const metadata: Metadata = {
  title: "Nyaya Sahayak | AI Legal Assistant & Forensic Case Auditor",
  description: "Elite AI Legal Assistant for Indian citizens. Access Forensic Case Auditor, Document Risk Scanner & Procedural Roadmaps on nyayasahayak.in.",
  keywords: ["AI Legal Assistant India", "Forensic Case Auditor", "Legal Document Risk Assessment", "Indian Law AI", "Legal Notice Generator India", "Nyaya Sahayak", "Online FIR Guide India", "Legal Jargon Simplifier", "Indian Court Assistant"],
  authors: [{ name: "IdeaSpark Institutional Tech" }],
  referrer: "origin-when-cross-origin",
  alternates: {
    canonical: "https://nyayasahayak.in",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Nyaya Sahayak | Your AI-Powered Legal Co-Pilot",
    description: "Analyze case strength and audit documents with precision AI on India's premier legal-tech terminal.",
    url: "https://nyayasahayak.in",
    siteName: "Nyaya Sahayak",
    images: [{ url: "/Logo.png", width: 1200, height: 1200, alt: "Nyaya Sahayak Institutional Identity" }],
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "LegalService",
    "name": "Nyaya Sahayak",
    "alternateName": "AI Nyaya Mitra",
    "url": "https://nyayasahayak.in",
    "logo": "https://nyayasahayak.in/Logo.png",
    "description": "Premium AI-driven legal assistance and forensic document auditing platform for the Indian judicial system.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Digital Registry Terminal",
      "addressLocality": "New Delhi",
      "addressRegion": "Delhi",
      "postalCode": "110001",
      "addressCountry": "IN"
    }
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <Script 
          async 
          custom-element="amp-auto-ads"
          src="https://cdn.ampproject.org/v0/amp-auto-ads-0.1.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className={`font-body antialiased ${inter.variable}`}>
        <amp-auto-ads type="adsense" data-ad-client="ca-pub-3991323698767154"></amp-auto-ads>
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
