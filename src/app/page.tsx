"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Sparkles,
  Scale
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

/**
 * Institutional Identity Hub (Logo) for Public View
 */
function BrandLogo() {
  return (
    <div className="flex items-center gap-3 group cursor-pointer">
      <div className="p-1 rounded-lg bg-primary/10 transition-transform group-hover:scale-110 duration-500">
        <Scale className="h-8 w-8 text-primary" />
      </div>
      <div className="flex flex-col text-left">
        <span className="text-xl font-black font-headline tracking-tighter text-white leading-none">
          NyayGuru
        </span>
        <span className="text-[8px] font-bold text-primary/60 uppercase tracking-widest mt-1">
          Legal Intelligence for India
        </span>
      </div>
    </div>
  );
}

export default function RootPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-primary/30 overflow-x-hidden font-body">
      {/* Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/5 rounded-full blur-[120px] opacity-50" />
      </div>

      {/* Navigation Ingress */}
      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 w-full z-50 px-6 sm:px-12 py-5 flex justify-between items-center bg-black/20 backdrop-blur-xl border-b border-white/5"
      >
        <BrandLogo />
        
        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-8">
          {["Features", "How it works", "Pricing", "FAQs", "Blog", "About"].map((link) => (
            <Link 
              key={link} 
              href={`#${link.toLowerCase().replace(/\s/g, '-')}`}
              className="text-[13px] font-medium text-white/60 hover:text-white transition-colors"
            >
              {link}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-6">
          <Link href="/login" className="text-[13px] font-black uppercase tracking-widest text-white hover:text-primary transition-colors">
            Login
          </Link>
          <Button asChild className="bg-primary text-primary-foreground font-black text-[11px] uppercase tracking-widest px-6 h-10 rounded-xl shadow-lg shadow-primary/20 active:scale-95 transition-all">
            <Link href="/register">Start Free</Link>
          </Button>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <main className="relative pt-48 pb-32 px-4 flex flex-col items-center justify-center min-h-screen text-center">
        <div className="max-w-5xl mx-auto space-y-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center"
          >
            <div className="bg-primary/5 text-primary border border-primary/20 px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-12 flex items-center gap-2 backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5" />
              Platform Features
            </div>
            
            <h1 className="text-5xl sm:text-8xl font-black tracking-tighter leading-[0.95] mb-10 max-w-4xl">
              Your Complete <span className="text-primary italic">Legal Research Toolkit</span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-white/50 font-medium max-w-3xl mx-auto leading-relaxed px-4">
              AI-powered chat, document analysis, voice input, and multi-language support. Everything you need to navigate Indian law with confidence.
            </p>
            
            <p className="text-[11px] font-bold text-white/20 uppercase tracking-[0.3em] mt-10">
              Built for Indian litigants, lawyers, law students, and legal researchers.
            </p>
          </motion.div>

          {/* Hero Actions */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-5 pt-6"
          >
            <Button asChild className="h-16 px-10 rounded-2xl bg-primary text-primary-foreground font-black text-sm uppercase tracking-tight shadow-[0_20px_50px_rgba(153,75,0,0.3)] active:scale-95 transition-all group overflow-hidden relative">
              <Link href="/dashboard" className="flex items-center gap-3">
                <span className="relative z-10 flex items-center gap-2">
                  Ask Your First Legal Question Free <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </Link>
            </Button>
            
            <Button variant="outline" asChild className="h-16 px-10 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 text-white font-black text-sm uppercase tracking-tight transition-all active:scale-95">
              <Link href="/dashboard/about">
                Explore All Features
              </Link>
            </Button>
          </motion.div>
        </div>
      </main>

      {/* Institutional Footer (Minimal) */}
      <footer className="py-12 border-t border-white/5 bg-[#050505] text-center">
        <div className="flex flex-col items-center gap-4 opacity-20">
            <p className="text-[10px] font-black uppercase tracking-[0.8em] text-white">NYAYASAHAYAK.IN // JUSTICE FOR BHARAT // 2025</p>
        </div>
      </footer>
    </div>
  );
}
