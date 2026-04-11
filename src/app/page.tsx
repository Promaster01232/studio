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
  Scale
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { useState, useEffect } from "react";

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
    <div className="min-h-screen bg-[#050505] text-white selection:bg-primary/30 overflow-x-hidden">
      {/* Header / Nav */}
      <nav className="fixed top-0 w-full z-50 px-6 py-4 flex justify-between items-center bg-black/20 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-2">
          <Logo className="h-10 w-10 border-none bg-transparent shadow-none" priority={true} />
          <span className="text-xl font-black font-headline tracking-tighter">Nyaya Sahayak</span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild className="text-xs font-black uppercase tracking-widest hover:bg-white/5">
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild className="bg-primary text-primary-foreground font-black text-xs uppercase tracking-widest px-6 rounded-xl shadow-lg shadow-primary/20">
            <Link href="/register">Join hub</Link>
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-20 px-4">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
              <div className="h-1.5 w-1.5 rounded-full bg-green-500 mr-2 animate-pulse" />
              India's First Law Bot, since 2023
            </Badge>
            <h1 className="text-4xl sm:text-7xl font-black font-headline tracking-tighter leading-tight mb-6">
              Nyaya Sahayak: <span className="text-primary italic">Your Legal AI for Indian Law</span>
            </h1>
            <p className="text-lg sm:text-2xl text-white/60 font-medium max-w-3xl mx-auto leading-relaxed">
              Got a property dispute? Cheque bounce? Tenant trouble?<br />
              Ask in plain Hindi or English. Get clear answers with the law cited. Free.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/40"
          >
            <div className="flex items-center gap-2"><MessageSquare className="h-3.5 w-3.5 text-primary" /> Ask Legal Query</div>
            <div className="flex items-center gap-2"><Languages className="h-3.5 w-3.5 text-primary" /> Any Language</div>
            <div className="flex items-center gap-2"><Upload className="h-3.5 w-3.5 text-primary" /> Upload PDFs</div>
            <div className="flex items-center gap-2"><Heart className="h-3.5 w-3.5 text-primary" /> Free Forever</div>
          </motion.div>

          {/* Search Bar Interface */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="max-w-3xl mx-auto pt-8"
          >
            <div className="relative p-1 rounded-3xl bg-gradient-to-br from-primary/30 via-primary/5 to-white/5 shadow-2xl">
              <div className="bg-[#0a0a0a] rounded-[1.4rem] p-4 flex items-center gap-4 border border-white/5 group focus-within:border-primary/40 transition-all">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div className="flex-1 relative">
                  <p className="text-lg font-bold text-white/20 absolute inset-0 flex items-center pointer-events-none">
                    Type your<span className="animate-cursor ml-1">|</span>
                  </p>
                  <Input 
                    className="bg-transparent border-none focus-visible:ring-0 text-lg font-bold h-12 w-full p-0 shadow-none text-white" 
                    placeholder=""
                  />
                </div>
                <div className="flex items-center gap-2 px-2">
                  <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-white/40 hover:text-white hover:bg-white/5">
                    <Paperclip className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-white/40 hover:text-white hover:bg-white/5">
                    <Mic className="h-5 w-5" />
                  </Button>
                  <Button className="h-10 w-10 rounded-xl bg-primary text-primary-foreground shadow-xl shadow-primary/20">
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
            <p className="mt-4 text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Free to use. Your conversations are private.</p>
          </motion.div>
        </div>
      </main>

      {/* As Seen In Section */}
      <section className="py-20 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-12">
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-12 bg-primary/20" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-primary/60">As Seen In</h3>
            <div className="h-px w-12 bg-primary/20" />
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-16 opacity-40 grayscale group hover:grayscale-0 transition-all duration-700">
            {logos.map((logo, i) => (
              <div key={i} className="flex items-center gap-3">
                <logo.icon className="h-6 w-6" />
                <span className="font-bold text-sm tracking-tight">{logo.name}</span>
              </div>
            ))}
          </div>
          <p className="text-sm font-medium text-white/40">
            Used and trusted by <span className="text-primary font-black">3,00,000+ Indians</span> including advocates, litigants, law schools, students, and researchers
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-4 bg-black">
        <div className="max-w-6xl mx-auto space-y-20">
          <div className="text-center space-y-6">
            <h2 className="text-3xl sm:text-6xl font-black font-headline tracking-tighter uppercase leading-none">
              Covers Every Area of <span className="text-primary italic">Indian Law</span>
            </h2>
            <p className="text-base sm:text-xl text-white/40 font-medium max-w-2xl mx-auto leading-relaxed italic">
              "Whether you're a citizen with a tenant dispute, a startup checking GST compliance, or a lawyer cross-referencing case law, just ask."
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -8 }}
                className="group"
              >
                <Card className="h-full bg-white/[0.03] border-white/5 rounded-[2rem] overflow-hidden transition-all duration-500 group-hover:bg-white/[0.06] group-hover:border-primary/20 group-hover:shadow-2xl group-hover:shadow-primary/5">
                  <CardContent className="p-8 space-y-6 text-center">
                    <div className="mx-auto h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500 shadow-xl border border-primary/5">
                      <f.icon className="h-7 w-7" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-lg font-black uppercase tracking-tight">{f.title}</h4>
                      <p className="text-[11px] font-medium text-white/40 leading-relaxed uppercase tracking-widest">{f.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center pt-10">
            <Button asChild size="xl" className="rounded-2xl font-black uppercase tracking-[0.2em] text-xs h-16 px-12 shadow-2xl shadow-primary/20 group active:scale-95 transition-all">
              <Link href="/dashboard" className="flex items-center gap-4">
                Initialize System <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer Support */}
      <footer className="py-12 border-t border-white/5 bg-[#050505] text-center">
        <p className="text-[9px] font-black uppercase tracking-[0.6em] text-white/20">NYAYASAHAYAK.IN // JUSTICE FOR BHARAT // 2025</p>
      </footer>
    </div>
  );
}