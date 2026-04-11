"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  MessageSquare, 
  Upload, 
  ShieldCheck, 
  Zap, 
  Activity, 
  ArrowRight, 
  Gavel, 
  Scale, 
  Globe,
  Sparkles,
  FileSearch,
  FolderKanban,
  Lock,
  Search,
  BookOpen,
  Heart
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const logos = [
  { name: "erode law college", icon: Gavel },
  { name: "commonwealth lawyers association", icon: ShieldCheck },
  { name: "legal service india", icon: Scale },
  { name: "lawful legal", icon: BookOpen },
  { name: "ijirl law journal", icon: Activity },
];

const capabilities = [
  {
    title: "ai legal chat",
    desc: "ask anything about indian law. get answers grounded in statutes, judgments, and legal procedures in any indian language.",
    icon: MessageSquare,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    badges: ["multi-language", "voice input", "live web search"]
  },
  {
    title: "document intelligence",
    desc: "upload contracts, notices, or case files. ask questions and get ai-powered analysis instantly.",
    icon: FileSearch,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    badges: ["pdf & docx", "ocr support", "cloud storage"]
  },
  {
    title: "case & knowledge management",
    desc: "keep your legal research organized by case, client, or topic in collections. find any insight in seconds.",
    icon: FolderKanban,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
    badges: ["collections", "global search", "share via link"]
  },
  {
    title: "security & privacy",
    desc: "enterprise-grade security. your conversations and documents remain completely confidential.",
    icon: Lock,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    badges: ["end-to-end privacy", "not used for ai training", "delete anytime"]
  }
];

export default function RootPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-primary/30 overflow-x-hidden font-body">
      {/* Navigation Ingress */}
      <nav className="fixed top-0 w-full z-50 px-6 py-4 flex justify-between items-center bg-black/20 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-2">
          <Logo className="h-10 w-10 border-none bg-transparent shadow-none p-0" priority={true} />
          <span className="text-xl font-black font-headline tracking-tighter lowercase">nyaya sahayak</span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild className="text-[10px] font-black uppercase tracking-widest hover:bg-white/5 lowercase">
            <Link href="/login">login</Link>
          </Button>
          <Button asChild className="bg-primary text-primary-foreground font-black text-[10px] uppercase tracking-widest px-6 rounded-xl shadow-lg shadow-primary/20 lowercase">
            <Link href="/register">join hub</Link>
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-20 px-4">
        <div className="max-w-5xl mx-auto text-center space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center"
          >
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 px-4 py-1.5 rounded-full text-[9px] font-black tracking-widest mb-10 flex items-center gap-2 lowercase">
              <Sparkles className="h-3 w-3" />
              platform features
            </Badge>
            
            <h1 className="text-4xl sm:text-7xl font-black tracking-tighter leading-[1.1] mb-8 lowercase">
              your complete <span className="text-primary italic">legal research toolkit</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-white/60 font-medium max-w-2xl mx-auto leading-relaxed lowercase">
              ai-powered chat, document analysis, voice input, and multi-language support. everything you need to navigate indian law with confidence.
            </p>
            
            <motion.div 
              className="flex flex-wrap items-center justify-center gap-6 mt-8 text-[10px] font-bold text-white/30 tracking-[0.2em] lowercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <div className="flex items-center gap-2"><MessageSquare className="h-3.5 w-3.5 text-primary" /> ask legal query</div>
              <div className="flex items-center gap-2"><Globe className="h-3.5 w-3.5 text-primary" /> any language</div>
              <div className="flex items-center gap-2"><Upload className="h-3.5 w-3.5 text-primary" /> upload pdfs</div>
              <div className="flex items-center gap-2"><Heart className="h-3.5 w-3.5 text-primary" /> free forever</div>
            </motion.div>
          </motion.div>

          {/* Hero Actions */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4"
          >
            <Button asChild className="h-14 px-8 rounded-2xl bg-primary text-primary-foreground font-black text-xs tracking-widest shadow-2xl shadow-primary/20 active:scale-95 transition-all lowercase">
              <Link href="/dashboard">
                <span className="relative z-10 flex items-center">
                  ask your first legal question free <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              </Link>
            </Button>
            <Button variant="outline" asChild className="h-14 px-8 rounded-2xl border-white/10 hover:bg-white/5 text-white font-black text-xs tracking-widest transition-all lowercase">
              <Link href="/dashboard/about">
                explore all features
              </Link>
            </Button>
          </motion.div>
        </div>
      </main>

      {/* Core Capabilities Registry */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-20">
          <div className="text-center space-y-4">
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 px-4 py-1.5 rounded-full text-[9px] font-black tracking-widest mb-2 lowercase">
              core capabilities
            </Badge>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tighter lowercase leading-none">
              everything you need for legal clarity
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {capabilities.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Card className="h-full bg-white/[0.03] border-white/5 rounded-[2.5rem] overflow-hidden transition-all duration-500 group-hover:bg-white/[0.05] group-hover:border-primary/20 group-hover:shadow-[0_30px_60px_rgba(0,0,0,0.3)]">
                  <CardContent className="p-8 sm:p-10 flex flex-col h-full text-left">
                    <div className="flex gap-6 mb-8">
                      <div className={cn("p-4 rounded-[1.5rem] h-fit shadow-xl border border-white/5", item.bg, item.color)}>
                        <item.icon className="h-7 w-7" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-black tracking-tight lowercase">{item.title}</h3>
                        <p className="text-sm text-white/40 leading-relaxed font-medium lowercase">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-auto flex flex-wrap gap-2">
                      {item.badges.map((b, idx) => (
                        <Badge key={idx} variant="secondary" className="bg-white/5 text-white/40 border-white/5 font-black text-[8px] tracking-widest px-3 py-1.5 rounded-lg lowercase">
                          {b}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Registry Section */}
      <section className="py-24 bg-white/[0.01] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-16">
          <div className="flex items-center justify-center gap-6">
            <div className="h-[1px] w-16 bg-primary/20" />
            <h3 className="text-[11px] font-black tracking-[0.4em] text-primary/60 lowercase">as seen in</h3>
            <div className="h-[1px] w-16 bg-primary/20" />
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-10 sm:gap-20 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-1000">
            {logos.map((logo, i) => (
              <div key={i} className="flex items-center gap-4 group">
                <div className="p-2 rounded-lg bg-white/5 border border-white/10 transition-all group-hover:border-primary/40 group-hover:bg-primary/5">
                    <logo.icon className="h-6 w-6 text-white group-hover:text-primary transition-colors" />
                </div>
                <span className="font-black text-sm tracking-tight text-white/80 group-hover:text-white lowercase">{logo.name}</span>
              </div>
            ))}
          </div>
          
          <div className="pt-4">
            <p className="text-sm sm:text-base font-medium text-white/40 max-w-2xl mx-auto leading-relaxed lowercase">
                used and trusted by <span className="text-primary font-black">3,00,000+ indians</span> including advocates, litigants, law schools, students, and researchers
            </p>
          </div>
        </div>
      </section>

      {/* Institutional Footer */}
      <footer className="py-16 border-t border-white/5 bg-[#050505] text-center">
        <div className="flex flex-col items-center gap-6 opacity-30">
            <Logo className="h-10 w-10 border-none shadow-none bg-transparent grayscale p-0" priority={false} />
            <p className="text-[10px] font-black uppercase tracking-[0.8em] text-white lowercase">nyayasahayak.in // justice for bharat // 2025</p>
        </div>
      </footer>
    </div>
  );
}
