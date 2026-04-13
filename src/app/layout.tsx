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
    default: "Nyaya Sahayak | Elite AI Legal Assistant & Forensic Auditor",
    template: "%s | Nyaya Sahayak"
  },
  description: "Nyaya Sahayak provides elite AI legal assistance, BNS statutory forensic scans, and automated document drafting for Bharat. Access the most accurate legal toolkit at https://nyayasahayak.in.",
  keywords: [
    "AI Legal Assistant India", 
    "Nyaya Sahayak", 
    "Legal AI Bharat", 
    "BNS Forensic Scan", 
    "Statutory Risk Scanner", 
    "Indian Judicial AI", 
    "Legal Notice Generator",
    "Bail Bond Generator",
    "Case Strength Probability",
    "Online Legal Information India"
  ],
  authors: [{ name: "IdeaSpark" }],
  creator: "IdeaSpark",
  publisher: "IdeaSpark",
  metadataBase: new URL('https://nyayasahayak.in'),
  alternates: { 
    canonical: "https://nyayasahayak.in" 
  },
  openGraph: {
    title: "Nyaya Sahayak | AI-Powered Legal Co-Pilot for India",
    description: "Mathematically precise AI forensic audits and statutory guidance for the indian judicial landscape.",
    url: "https://nyayasahayak.in",
    siteName: "Nyaya Sahayak",
    images: [{ url: "/Logo.png", width: 1200, height: 1200, alt: "Nyaya Sahayak Identity" }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nyaya Sahayak | Elite AI Legal Assistant',
    description: 'Transforming legal access with institutional AI intelligence and BNS compliance audits.',
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
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "LegalService",
    "name": "Nyaya Sahayak",
    "url": "https://nyayasahayak.in",
    "logo": "https://nyayasahayak.in/Logo.png",
    "description": "Premium AI-driven legal assistance and forensic document auditing platform for the Indian Judicial System.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "New Delhi",
      "addressRegion": "Delhi",
      "addressCountry": "IN"
    },
    "priceRange": "₹0 - ₹4999"
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
