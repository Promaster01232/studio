"use client";

import { Logo } from "@/components/logo";
import Link from "next/link";
import { Twitter, Linkedin, Instagram, Youtube } from "lucide-react";
import { Button } from "./ui/button";

const footerLinks = {
  product: [
    { name: "Features", href: "/features" },
    { name: "How it works", href: "/how-it-works" },
    { name: "Pricing", href: "/pricing" },
  ],
  resources: [
    { name: "Blog", href: "/blog" },
    { name: "Faqs", href: "/faqs" },
    { name: "Reviews", href: "#" },
  ],
  company: [
    { name: "About us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ],
  legal: [
    { name: "Privacy policy", href: "/privacy" },
    { name: "Terms of service", href: "/terms" },
    { name: "Refund policy", href: "/refund-policy" },
    { name: "Disclaimer", href: "/disclaimer" },
    { name: "Cookie policy", href: "/cookie-policy" },
  ]
};

export function Footer() {
  return (
    <footer className="w-full border-t border-border/5 bg-background pt-20 pb-10 text-left">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-10">
          {/* Brand identity node */}
          <div className="lg:col-span-4 space-y-8">
            <Link href="/" className="flex items-center gap-3 active:scale-95 transition-all group">
              <Logo className="h-10 w-10 shadow-none border-none p-0 bg-transparent" priority={false} />
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tighter text-foreground font-headline leading-none">Nyaya sahayak</span>
                <span className="text-[8px] font-black uppercase tracking-[0.3em] text-primary/60 mt-1">Legal intelligence for india</span>
              </div>
            </Link>
            <p className="text-sm sm:text-base font-medium text-muted-foreground max-w-sm leading-relaxed">
              India's first law Ai chatbot. Understand the law without paying for a lawyer.
            </p>
            <div className="flex items-center gap-3">
                {[
                    { icon: Twitter, href: "#" },
                    { icon: Linkedin, href: "#" },
                    { icon: Instagram, href: "#" },
                    { icon: Youtube, href: "#" }
                ].map((social, i) => (
                    <Button key={i} variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-muted/20 border border-border/5 hover:bg-primary hover:text-white transition-all shadow-sm" asChild>
                        <a href={social.href} target="_blank" rel="noopener noreferrer">
                            <social.icon className="h-4 w-4" />
                        </a>
                    </Button>
                ))}
            </div>
          </div>

          {/* Links matrix */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-10">
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground">Product</h4>
              <nav className="flex flex-col gap-4">
                {footerLinks.product.map(link => (
                    <Link key={link.name} href={link.href} className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">{link.name}</Link>
                ))}
              </nav>
            </div>
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground">Resources</h4>
              <nav className="flex flex-col gap-4">
                {footerLinks.resources.map(link => (
                    <Link key={link.name} href={link.href} className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">{link.name}</Link>
                ))}
              </nav>
            </div>
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground">Company</h4>
              <nav className="flex flex-col gap-4">
                {footerLinks.company.map(link => (
                    <Link key={link.name} href={link.href} className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">{link.name}</Link>
                ))}
              </nav>
            </div>
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground">Legal</h4>
              <nav className="flex flex-col gap-4">
                {footerLinks.legal.map(link => (
                    <Link key={link.name} href={link.href} className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">{link.name}</Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
