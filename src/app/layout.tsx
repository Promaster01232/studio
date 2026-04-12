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
    { media: "(prefers-color-scheme: dark)", color: "#050505" },
  ],
};

export const metadata: Metadata = {
  title: {
    default: "Nyaya Sahayak | AI Legal Assistant & Forensic Auditor India",
    template: "%s | Nyaya Sahayak"
  },
  description: "Nyaya Sahayak Provides Elite AI Legal Assistance, BNS Statutory Forensic Scans, And Automated Document Drafting For Bharat's 1.4 Billion Citizens. Access India's Most Accurate Legal AI Toolkit.",
  keywords: [
    "AI Legal Assistant India", 
    "Nyaya Sahayak", 
    "Legal AI Bharat", 
    "BNS Forensic Audit", 
    "Statutory Risk Scanner", 
    "Indian Judicial AI", 
    "Legal Notice Generator India",
    "Bail Bond Generator",
    "Case Strength Probability AI",
    "Bharatiya Nyaya Sanhita Helper",
    "Online Legal Advice India",
    "Legal Document Drafting AI"
  ],
  authors: [{ name: "IdeaSpark" }],
  creator: "IdeaSpark",
  publisher: "IdeaSpark",
  metadataBase: new URL('https://nyayasahayak.in'),
  alternates: { 
    canonical: "https://nyayasahayak.in" 
  },
  openGraph: {
    title: "Nyaya Sahayak | Your AI-Powered Legal Co-Pilot For India",
    description: "Mathematically Precise AI Forensic Audits And Statutory Guidance For The Indian Judicial Landscape. Democratizing Legal Intelligence For Every Citizen.",
    url: "https://nyayasahayak.in",
    siteName: "Nyaya Sahayak",
    images: [{ url: "/Logo.png", width: 1200, height: 1200, alt: "Nyaya Sahayak Institutional Identity" }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nyaya Sahayak | Elite AI Legal Assistant For Bharat',
    description: 'Transforming Legal Access With Institutional AI Intelligence And BNS Compliance Audits.',
    images: ['/Logo.png'],
    creator: "@IdeaSpark",
  },
  icons: { 
    icon: [
      { url: '/Logo.png', sizes: '32x32', type: 'image/png' },
      { url: '/Logo.png', sizes: '192x192', type: 'image/png' },
      { url: '/Logo.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/Logo.png', 
    apple: [
      { url: '/Logo.png', sizes: '180x180', type: 'image/png' },
    ],
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
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "LegalService",
    "name": "Nyaya Sahayak",
    "alternateName": "Nyaya Sahayak AI",
    "url": "https://nyayasahayak.in",
    "logo": "https://nyayasahayak.in/Logo.png",
    "image": "https://nyayasahayak.in/Logo.png",
    "description": "Premium AI-Driven Legal Assistance And Forensic Document Auditing Platform For The Indian Judicial System. Offering Statutory Insights Into BNS, IPC, And CrPC.",
    "founder": {
      "@type": "Person",
      "name": "Piyush Singh"
    },
    "foundingDate": "2024",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "New Delhi",
      "addressRegion": "Delhi",
      "addressCountry": "IN"
    },
    "priceRange": "₹0 - ₹4999",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Legal AI Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Forensic Document Audit"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Legal Notice Generation"
          }
        }
      ]
    }
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script id="structured-data-org" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
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
