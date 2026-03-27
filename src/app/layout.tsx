
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
  title: "Nyaya Sahayak | AI Legal Assistant & Forensic Case Auditor",
  description: "Empowering Indian citizens with elite AI legal intelligence. Use our Forensic Case Auditor, Document Risk Scanner, and Procedural Roadmap tools to navigate the Indian judicial system with 100% confidence. Get instant summaries and legal drafting support on nyayasahayak.in.",
  keywords: ["AI Legal Assistant India", "Forensic Case Auditor", "Legal Document Risk Assessment", "Indian Law AI", "Legal Notice Generator India", "Nyaya Sahayak", "Online FIR Guide India", "Legal Jargon Simplifier", "Indian Court Assistant"],
  authors: [{ name: "IdeaSpark Institutional Tech" }],
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  referrer: "origin-when-cross-origin",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  alternates: {
    canonical: "https://nyayasahayak.in",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "Nyaya Sahayak | Your AI-Powered Legal Co-Pilot",
    description: "The pinnacle of AI-driven legal empowerment. Analyze case strength, audit documents, and connect with verified advocates on India's premier legal-tech terminal.",
    url: "https://nyayasahayak.in",
    siteName: "Nyaya Sahayak",
    images: [
      {
        url: "/Logo.png",
        width: 1200,
        height: 1200,
        alt: "Nyaya Sahayak Institutional Identity",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nyaya Sahayak | AI Legal Intelligence Terminal",
    description: "Navigate Indian Law with Precision AI. Document audits and forensic summaries on nyayasahayak.in.",
    images: ["/Logo.png"],
    site: "@nyayasahayak",
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
    },
    "sameAs": [
      "https://facebook.com/profile.php?id=61578664907514",
      "https://twitter.com/nyayasahayak",
      "https://instagram.com/nyaya_sahayak/"
    ]
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
          src={`https://www.googletagmanager.com/gtag/js?id=G-GTCT653LHY`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-GTCT653LHY');
          `}
        </Script>
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
