
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
  title: {
    default: "Nyaya Sahayak | Ai legal assistant & forensic auditor",
    template: "%s | Nyaya Sahayak"
  },
  description: "Nyaya Sahayak provides elite ai legal assistance, bns statutory forensic scans, and automated document drafting for bharat's 1.4 billion citizens.",
  keywords: [
    "Ai legal assistant india", 
    "Nyaya Sahayak", 
    "Legal ai bharat", 
    "Bns forensic audit", 
    "Statutory risk scanner", 
    "Indian judicial ai", 
    "Legal notice generator india",
    "Bail bond generator",
    "Case strength probability ai",
    "Ideaspark institutional tech"
  ],
  authors: [{ name: "Ideaspark" }],
  creator: "Ideaspark",
  publisher: "Ideaspark",
  metadataBase: new URL('https://nyayasahayak.in'),
  alternates: { canonical: "/" },
  openGraph: {
    title: "Nyaya Sahayak | Your ai-powered legal co-pilot",
    description: "Mathematically precise ai forensic audits and statutory guidance for the indian judicial landscape.",
    url: "https://nyayasahayak.in",
    siteName: "Nyaya Sahayak",
    images: [{ url: "/Logo.png", width: 1200, height: 1200, alt: "Nyaya Sahayak institutional identity" }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nyaya Sahayak | Ai legal assistant for bharat',
    description: 'Transforming legal access with institutional ai intelligence.',
    images: ['/Logo.png'],
    creator: "@Ideaspark",
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
    "alternateName": "Nyaya Sahayak ai",
    "url": "https://nyayasahayak.in",
    "logo": "https://nyayasahayak.in/Logo.png",
    "description": "Premium ai-driven legal assistance and forensic document auditing platform for the indian judicial system.",
    "founder": {
      "@type": "Person",
      "name": "Piyush singh"
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "New Delhi",
      "addressRegion": "Delhi",
      "addressCountry": "IN"
    }
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script id="structured-data-org" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
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
