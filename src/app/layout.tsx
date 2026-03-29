
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
  title: "Nyaya Sahayak | AI Legal Assistant & Forensic Case Auditor India",
  description: "India's premier AI Legal Assistant. Access forensic case audits, BNS statutory scanning, and document risk analysis on nyayasahayak.in.",
  keywords: ["AI Legal Assistant India", "BNS Forensic Audit", "Legal Document Risk Scanner India", "Nyaya Sahayak", "Indian Judicial AI", "Online Legal Advice India"],
  authors: [{ name: "IdeaSpark Institutional Tech" }],
  referrer: "origin-when-cross-origin",
  metadataBase: new URL('https://nyayasahayak.in'),
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
    description: "Analyze case strength and audit documents with mathematically precise AI on India's premier legal-tech terminal.",
    url: "https://nyayasahayak.in",
    siteName: "Nyaya Sahayak",
    images: [{ url: "/Logo.png", width: 1200, height: 1200, alt: "Nyaya Sahayak Institutional Identity" }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nyaya Sahayak | AI Legal Assistant',
    description: 'Elite forensic AI for the Indian judicial landscape.',
    images: ['/Logo.png'],
  },
  icons: {
    icon: '/Logo.png',
    shortcut: '/Logo.png',
    apple: '/Logo.png',
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
    "image": "https://nyayasahayak.in/Logo.png",
    "description": "Premium AI-driven legal assistance and forensic document auditing platform specifically engineered for the Indian judicial system and Bharat's citizens.",
    "brand": {
      "@type": "Brand",
      "name": "Nyaya Sahayak",
      "logo": "https://nyayasahayak.in/Logo.png"
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Digital Registry Terminal",
      "addressLocality": "New Delhi",
      "addressRegion": "Delhi",
      "postalCode": "110001",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "28.6139",
      "longitude": "77.2090"
    },
    "sameAs": [
      "https://www.facebook.com/profile.php?id=61578664907514",
      "https://x.com/nyayasahayak/",
      "https://www.instagram.com/nyaya_sahayak/"
    ]
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google tag (gtag.js) */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-R8G6PW6X1K"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-R8G6PW6X1K');
          `}
        </Script>
        
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <Script id="facebook-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1770764872917'); 
            fbq('track', 'PageView');
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
