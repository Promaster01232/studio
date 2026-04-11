
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  MessageSquare, 
  Languages, 
  Upload, 
  Heart, 
  Paperclip, 
  Mic, 
  Send, 
  Sparkles,
  ShieldCheck,
  BookOpen,
  Zap,
  Activity,
  ArrowRight,
  Gavel,
  Scale,
  Globe
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const logos = [
  { name: "Erode Law College", icon: Gavel },
  { name: "Commonwealth Lawyers Association", icon: ShieldCheck },
  { name: "Legal Service India", icon: Scale },
  { name: "Lawful Legal", icon: BookOpen },
  { name: "IJIRL Law Journal", icon: Activity },
];

const features = [
  {
    title: "All Major Acts",
    desc: "IPC, BNS, CrPC, CPC, family, property, consumer, labour, and more",
    icon: Scale,
  },
  {
    title: "Real Case References",
    desc: "Supreme Court and High Court judgments cited inline",
    icon: BookOpen,
  },
  {
    title: "Fully Private",
    desc: "Your conversations stay between you and the AI",
    icon: ShieldCheck,
  },
  {
    title: "Answers in Seconds",
    desc: "No appointments, no fees, no waiting",
    icon: Zap,
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
          <Logo className="h-10 w-10 border-none bg-transparent shadow-none" priority={true} />
          <span className="text-xl font-black font-headline tracking-tighter">Nyaya Sahayak</span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild className="text-[10px] font-black uppercase tracking-widest hover:bg-white/5">
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild className="bg-primary text-primary-foreground font-black text-[10px] uppercase tracking-widest px-6 rounded-xl shadow-lg shadow-primary/20">
            <Link href="/register">Join hub</Link>
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-20 px-4">
        <div className="max-w-5xl mx-auto text-center space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest mb-8">
              <div className="h-1.5 w-1.5 rounded-full bg-green-500 mr-2 animate-pulse" />
              India's First Law Bot, since 2023
            </Badge>
            
            <h1 className="text-4xl sm:text-7xl font-black tracking-tighter leading-[1.1] mb-8 font-serif">
              NyayGuru: <span className="text-primary italic">Your Legal AI for Indian Law</span>
            </h1>
            
            <p className="text-lg sm:text-2xl text-white/60 font-medium max-w-3xl mx-auto leading-relaxed">
              Got a property dispute? Cheque bounce? Tenant trouble?<br />
              Ask in plain Hindi or English. Get clear answers with the law cited. Free.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/40"
          >
            <div className="flex items-center gap-2"><MessageSquare className="h-3.5 w-3.5 text-primary" /> Ask Legal Query</div>
            <div className="flex items-center gap-2"><Globe className="h-3.5 w-3.5 text-primary" /> Any Language</div>
            <div className="flex items-center gap-2"><Upload className="h-3.5 w-3.5 text-primary" /> Upload PDFs</div>
            <div className="flex items-center gap-2"><Heart className="h-3.5 w-3.5 text-primary" /> Free Forever</div>
          </motion.div>

          {/* Neural Search Hub */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="max-w-4xl mx-auto pt-10"
          >
            <div className="relative p-[1px] rounded-[2rem] bg-gradient-to-br from-primary/40 via-primary/5 to-white/10 shadow-[0_0_50px_rgba(153,75,0,0.15)]">
              <div className="bg-[#0a0a0a] rounded-[1.95rem] p-5 flex items-center gap-4 border border-white/5 transition-all group focus-within:border-primary/40">
                <div className="p-3 rounded-2xl bg-primary/10 text-primary shadow-inner">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div className="flex-1 relative flex items-center">
                  <span className="text-xl font-bold text-white/20 absolute pointer-events-none left-0">
                    Type your<span className="animate-cursor ml-1">|</span>
                  </span>
                  <Input 
                    className="bg-transparent border-none focus-visible:ring-0 text-xl font-bold h-14 w-full p-0 shadow-none text-white selection:bg-primary/30" 
                    placeholder=""
                  />
                </div>
                <div className="flex items-center gap-3 pr-2">
                  <Button variant="ghost" size="icon" className="h-11 w-11 rounded-xl text-white/30 hover:text-white hover:bg-white/5" silent>
                    <Paperclip className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-11 w-11 rounded-xl text-white/30 hover:text-white hover:bg-white/5" silent>
                    <Mic className="h-5 w-5" />
                  </Button>
                  <Button className="h-12 w-12 rounded-full bg-primary text-primary-foreground shadow-2xl shadow-primary/40 active:scale-90 transition-transform group">
                    <Send className="h-5 w-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Button>
                </div>
              </div>
            </div>
            <p className="mt-6 text-[10px] font-black uppercase tracking-[0.5em] text-white/20">Free to use. Your conversations are private.</p>
          </motion.div>
        </div>
      </main>

      {/* Trust Registry Section */}
      <section className="py-24 bg-white/[0.01] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-16">
          <div className="flex items-center justify-center gap-6">
            <div className="h-[1px] w-16 bg-primary/20" />
            <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-primary/60">As Seen In</h3>
            <div className="h-[1px] w-16 bg-primary/20" />
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-10 sm:gap-20 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-1000">
            {logos.map((logo, i) => (
              <div key={i} className="flex items-center gap-4 group">
                <div className="p-2 rounded-lg bg-white/5 border border-white/10 transition-all group-hover:border-primary/40 group-hover:bg-primary/5">
                    <logo.icon className="h-6 w-6 text-white group-hover:text-primary transition-colors" />
                </div>
                <span className="font-black text-sm tracking-tight text-white/80 group-hover:text-white">{logo.name}</span>
              </div>
            ))}
          </div>
          
          <div className="pt-4">
            <p className="text-sm sm:text-base font-medium text-white/40 max-w-2xl mx-auto leading-relaxed">
                Used and trusted by <span className="text-primary font-black">3,00,000+ Indians</span> including advocates, litigants, law schools, students, and researchers
            </p>
          </div>
        </div>
      </section>

      {/* Feature Capabilities Grid */}
      <section className="py-32 px-4 bg-black">
        <div className="max-w-6xl mx-auto space-y-24">
          <div className="text-center space-y-6">
            <h2 className="text-4xl sm:text-6xl font-black tracking-tighter uppercase leading-none font-serif">
              Covers Every Area of <span className="text-primary italic">Indian Law</span>
            </h2>
            <p className="text-base sm:text-xl text-white/40 font-medium max-w-3xl mx-auto leading-relaxed italic opacity-80">
              "Whether you're a citizen with a tenant dispute, a startup checking GST compliance, or a lawyer cross-referencing case law, just ask."
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10 }}
                className="group"
              >
                <Card className="h-full bg-white/[0.02] border-white/5 rounded-[2.5rem] overflow-hidden transition-all duration-500 group-hover:bg-white/[0.04] group-hover:border-primary/20 group-hover:shadow-[0_20px_50px_rgba(153,75,0,0.1)]">
                  <CardContent className="p-10 space-y-8 text-center">
                    <div className="mx-auto h-16 w-16 rounded-[1.2rem] bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500 shadow-xl border border-primary/5">
                      <f.icon className="h-8 w-8" />
                    </div>
                    <div className="space-y-3">
                      <h4 className="text-xl font-black uppercase tracking-tight leading-tight">{f.title}</h4>
                      <p className="text-[11px] font-bold text-white/30 leading-relaxed uppercase tracking-widest">{f.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center pt-10">
            <Button asChild className="rounded-[1.5rem] font-black uppercase tracking-[0.4em] text-xs h-16 px-12 shadow-2xl shadow-primary/20 group active:scale-95 transition-all relative overflow-hidden">
              <Link href="/dashboard" className="flex items-center gap-4 relative z-10">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                Initialize System <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Institutional Footer */}
      <footer className="py-16 border-t border-white/5 bg-[#050505] text-center">
        <div className="flex flex-col items-center gap-6 opacity-30">
            <Logo className="h-10 w-10 border-none shadow-none bg-transparent grayscale p-0" priority={false} />
            <p className="text-[10px] font-black uppercase tracking-[0.8em] text-white">NYAYASAHAYAK.IN // JUSTICE FOR BHARAT // 2025</p>
        </div>
      </footer>
    </div>
  );
}
