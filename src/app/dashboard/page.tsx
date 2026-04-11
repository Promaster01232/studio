"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import React, { useState, useEffect } from "react";
import {
  MessageSquare,
  Sparkles,
  Paperclip,
  SlidersHorizontal,
  Clock,
  Mic,
  Send,
  Upload,
  FileText,
  FileSearch,
  Lock,
  Globe,
  Lightbulb,
  MessageCircle,
  ShieldCheck,
  Plus,
  BrainCircuit,
  Gavel,
  Scale,
  FileCheck,
  FileSignature,
  Zap
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth, useFirestore } from "@/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import Link from "next/link";

const features = [
  {
    title: "Record voice",
    desc: "Speak your legal problem. Get a quick word-for-word summary and analysis.",
    icon: Mic,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    href: "/dashboard/narrate"
  },
  {
    title: "Scan documents",
    desc: "Upload court orders or notices. Ai reads and identifies statutory risks.",
    icon: FileSearch,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    href: "/dashboard/document-intelligence"
  },
  {
    title: "Write documents",
    desc: "Draft professional legal notices and complaints in any Indian language.",
    icon: FileText,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    href: "/dashboard/document-generator"
  },
  {
    title: "Create bonds",
    desc: "Generate legally sound bail, personal, and indemnity bonds instantly.",
    icon: FileSignature,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    href: "/dashboard/bond-generator"
  },
  {
    title: "Check chance",
    desc: "Analyze case details to see the statistical probability of a win or bail.",
    icon: BrainCircuit,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    href: "/dashboard/strength-analyzer"
  },
  {
    title: "Court helper",
    desc: "Get prepared questions for witness cross-examination and preparation.",
    icon: Gavel,
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
    href: "/dashboard/court-assistant"
  },
  {
    title: "Check evidence",
    desc: "Audit your digital and physical evidence for statutory admissibility.",
    icon: ShieldCheck,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
    href: "/dashboard/evidence-audit"
  },
  {
    title: "Bail helper",
    desc: "Predictive modeling for bail success based on Bns sections and records.",
    icon: Scale,
    color: "text-red-500",
    bg: "bg-red-500/10",
    href: "/dashboard/bail-estimator"
  },
  {
    title: "Law linker",
    desc: "Locate specific Bns sections and amendments relevant to your situation.",
    icon: Zap,
    color: "text-pink-500",
    bg: "bg-pink-500/10",
    href: "/dashboard/statutory-linker"
  },
  {
    title: "Check contract",
    desc: "Identify unfavorable clauses and verify fairness in any legal deed.",
    icon: FileCheck,
    color: "text-teal-500",
    bg: "bg-teal-500/10",
    href: "/dashboard/contract-auditor"
  }
];

const steps = [
  {
    num: "01",
    title: "Ask your question",
    desc: "Type or speak your legal question in plain language.",
    icon: MessageCircle
  },
  {
    num: "02",
    title: "Get Ai analysis",
    desc: "Nyayguru checks relevant acts, sections, and court judgments.",
    icon: Lightbulb
  },
  {
    num: "03",
    title: "Receive guidance",
    desc: "You get a clear answer with the exact law sections and next steps.",
    icon: ShieldCheck
  }
];

export default function DashboardHomePage() {
  const auth = useAuth();
  const firestore = useFirestore();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [greeting, setGreeting] = useState("Good day");

  useEffect(() => {
    if (auth.currentUser) {
      const userRef = doc(firestore, "users", auth.currentUser.uid);
      const unsub = onSnapshot(userRef, (doc) => {
        if (doc.exists()) {
          setUserProfile(doc.data());
        }
      });

      const hour = new Date().getHours();
      if (hour < 12) setGreeting("Good morning");
      else if (hour < 17) setGreeting("Good afternoon");
      else setGreeting("Good evening");

      return () => unsub();
    }
  }, [auth, firestore]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-16 pb-32 px-4 sm:px-6">
      
      {/* Greeting card */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full"
      >
        <Card className="bg-[#161b22] border-white/5 rounded-3xl overflow-hidden shadow-2xl">
          <CardContent className="p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 text-left">
            <div className="flex items-center gap-5">
              <Avatar className="h-14 w-14 border-2 border-white/10 rounded-2xl shadow-2xl">
                <AvatarImage src={userProfile?.photoURL} className="object-cover" />
                <AvatarFallback className="bg-[#e91e63] text-white font-black text-xl">
                  {userProfile?.firstName?.charAt(0) || "P"}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-xl sm:text-3xl font-black tracking-tighter text-white leading-none">
                    {greeting}, {userProfile?.firstName || "friend"}!
                  </h2>
                  <Badge variant="secondary" className="bg-white/5 text-gray-400 border-white/10 font-bold text-[9px] tracking-widest px-2.5 py-0.5 rounded-lg">
                    Free tier
                  </Badge>
                </div>
                <p className="text-xs sm:text-sm text-gray-500 font-medium tracking-tight">
                  Welcome back to your institutional terminal.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <Button variant="outline" className="flex-1 md:flex-none h-11 px-6 rounded-xl border-white/10 bg-white/5 text-white font-bold text-xs gap-2" asChild>
                <Link href="/dashboard/document-intelligence"><Upload className="h-4 w-4" /> Upload</Link>
              </Button>
              <Button className="flex-1 md:flex-none h-11 px-6 rounded-xl bg-primary text-primary-foreground font-black text-xs tracking-widest shadow-lg shadow-primary/20 gap-2" asChild>
                <Link href="/dashboard/narrate"><Plus className="h-4 w-4" /> New chat</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Central chat hub */}
      <div className="flex flex-col items-center justify-center pt-10 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="mb-8">
          <div className="p-4 rounded-full bg-primary/10 border border-primary/20 shadow-[0_0_40px_rgba(153,75,0,0.15)]">
            <Sparkles className="h-10 w-10 text-primary" />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-4 mb-10">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">Hello, how can i help you?</h1>
          <p className="text-gray-400 text-lg font-medium max-w-2xl mx-auto leading-relaxed">Ask Nyayguru about Indian statutes, procedural roadmaps, or case research.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="w-full max-w-3xl">
          <Card className="bg-[#161b22] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-6 space-y-4 text-left">
              <Textarea placeholder="Ask Nyayguru legal Ai..." className="bg-transparent border-none focus-visible:ring-0 text-white text-lg placeholder:text-gray-600 min-h-[120px] resize-none p-0 custom-scrollbar" />
              <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between pt-4 border-t border-white/5">
                <div className="flex items-center gap-4 text-gray-500">
                  <button className="hover:text-primary transition-all p-1"><Paperclip className="h-4 w-4" /></button>
                  <button className="hover:text-primary transition-all p-1"><SlidersHorizontal className="h-4 w-4" /></button>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 text-[10px] font-black tracking-tighter">
                    <MessageSquare className="h-3.5 w-3.5" /> 10/10
                  </div>
                  <div className="flex items-center gap-1.5 hover:text-gray-300 transition-colors cursor-pointer">
                    <Clock className="h-3.5 w-3.5" /> <span className="text-[10px] font-black tracking-widest">Saved</span>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-4">
                  <button className="text-gray-500 hover:text-primary transition-all p-2"><Mic className="h-5 w-5" /></button>
                  <button className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-lg active:scale-95 transition-all"><Send className="h-5 w-5 fill-current" /></button>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Features section */}
      <section className="pt-20 space-y-16">
        <div className="text-center space-y-4">
          <Badge variant="outline" className="bg-amber-500/5 text-amber-500 border-amber-500/20 px-4 py-1 rounded-full text-[9px] font-black tracking-widest">Ai tool registry</Badge>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tighter text-white">What you can do with Nyayguru</h2>
          <p className="text-gray-500 text-sm sm:text-base max-w-2xl mx-auto font-medium">Explore our suite of ten elite legal research terminals, synced with your account.</p>
        </div>

        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {features.map((f, i) => (
            <motion.div key={i} variants={itemVariants}>
              <Link href={f.href}>
                <Card className="bg-[#161b22] border-white/5 rounded-[2rem] h-full overflow-hidden hover:border-primary/30 transition-all duration-500 group cursor-pointer active:scale-95">
                  <CardContent className="p-6 flex flex-col gap-4 text-left">
                    <div className={cn("p-2.5 rounded-xl transition-transform group-hover:scale-110 shadow-lg w-fit", f.bg, f.color)}>
                      <f.icon className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-black text-sm text-white tracking-tight leading-none">{f.title}</h3>
                      <p className="text-[10px] text-gray-500 leading-relaxed font-medium line-clamp-3">{f.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* How it works section */}
      <section className="pt-24 space-y-16">
        <div className="text-center space-y-4">
          <Badge variant="outline" className="bg-amber-500/5 text-amber-500 border-amber-500/20 px-4 py-1 rounded-full text-[9px] font-black tracking-widest">How it works</Badge>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tighter text-white">How it works</h2>
          <p className="text-gray-500 text-sm sm:text-base max-w-2xl mx-auto font-medium">No appointments. No waiting. Works 24/7, even at 2 am on a sunday.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          <div className="hidden md:block absolute top-1/3 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent -z-10" />
          
          {steps.map((s, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, scale: 0.9 }} 
              whileInView={{ opacity: 1, scale: 1 }} 
              viewport={{ once: true }} 
              transition={{ delay: i * 0.2 }}
              className="flex flex-col items-center text-center gap-6"
            >
              <div className="relative group">
                <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="relative h-20 w-20 rounded-[1.8rem] bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500 shadow-xl">
                  <s.icon className="h-8 w-8" />
                  <div className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-[#161b22] border border-white/10 flex items-center justify-center text-[10px] font-black text-primary shadow-lg">
                    {s.num}
                  </div>
                </div>
              </div>
              <div className="space-y-2 max-w-[240px]">
                <h3 className="font-black text-xl text-white tracking-tight">{s.title}</h3>
                <p className="text-xs text-gray-500 font-medium leading-relaxed">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

    </div>
  );
}
