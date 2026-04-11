"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import React, { useState, useEffect } from "react";
import {
  MessageSquare,
  Sparkles,
  Paperclip,
  Mic,
  Send,
  FileText,
  FileSearch,
  ShieldCheck,
  BrainCircuit,
  Gavel,
  Scale,
  FileCheck,
  FileSignature,
  Zap,
  ArrowRight,
  Search,
  History as HistoryIcon
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth, useFirestore } from "@/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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

const suggestions = [
  "What are tenant rights in india?",
  "How to file a consumer complaint?",
  "Explain domestic violence act"
];

export default function DashboardHomePage() {
  const auth = useAuth();
  const firestore = useFirestore();
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    if (auth.currentUser) {
      const userRef = doc(firestore, "users", auth.currentUser.uid);
      const unsub = onSnapshot(userRef, (doc) => {
        if (doc.exists()) {
          setUserProfile(doc.data());
        }
      });
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
    <div className="max-w-6xl mx-auto space-y-12 pb-32 px-4 sm:px-6">
      
      {/* Central clean hub ingress */}
      <section className="pt-10 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-4xl bg-[#1a1a1a] rounded-[2.5rem] p-8 sm:p-16 border border-white/5 shadow-2xl relative overflow-hidden text-center flex flex-col items-center gap-10"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
          
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight"
          >
            Hello, how can i help you today?
          </motion.h1>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {suggestions.map((s, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + (i * 0.1) }}
                className="px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-white/40 hover:bg-white/10 hover:text-white hover:border-primary/30 transition-all text-xs font-medium"
              >
                {s}
              </motion.button>
            ))}
          </div>

          <div className="w-full max-w-3xl space-y-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-primary/5 rounded-2xl border border-primary/20 pointer-events-none group-focus-within:border-primary/40 transition-colors" />
              <div className="flex items-center gap-4 p-3 relative z-10">
                <div className="h-10 w-10 shrink-0 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
                  <Sparkles className="h-5 w-5" />
                </div>
                <Textarea 
                  placeholder="Type" 
                  className="flex-1 bg-transparent border-none focus-visible:ring-0 text-white text-lg placeholder:text-white/20 min-h-[48px] h-10 py-2 resize-none overflow-hidden" 
                />
                <div className="flex items-center gap-2 pr-2">
                  <button className="p-2 text-white/40 hover:text-primary transition-colors"><Paperclip className="h-5 w-5" /></button>
                  <button className="p-2 text-white/40 hover:text-primary transition-colors"><Mic className="h-5 w-5" /></button>
                  <button className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-xl active:scale-95 transition-all">
                    <Send className="h-5 w-5 fill-current" />
                  </button>
                </div>
              </div>
            </div>
            <p className="text-[10px] font-bold text-white/20 tracking-wide">Free to use. Your conversations are private.</p>
          </div>
        </motion.div>
      </section>

      {/* Feature matrix */}
      <section className="space-y-12">
        <div className="text-left border-l-4 border-primary pl-6 py-2">
          <h2 className="text-[10px] font-bold text-primary mb-1">Institutional core</h2>
          <h3 className="text-3xl font-black tracking-tighter text-white">Forensic ai registry</h3>
          <p className="text-sm text-gray-500 font-medium mt-1">Select a specialized tool to start your statutory audit.</p>
        </div>

        <motion.div 
          variants={containerVariants} 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true }} 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
        >
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

      {/* Modern trust node */}
      <section className="pt-12">
        <Card className="bg-primary/5 border-primary/10 rounded-[2.5rem] p-10 sm:p-16 flex flex-col md:flex-row items-center justify-between gap-10 overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-110 transition-transform duration-1000 pointer-events-none">
            <ShieldCheck className="h-64 w-64" />
          </div>
          <div className="space-y-6 text-left relative z-10 max-w-xl">
            <div className="flex items-center gap-3 text-primary">
              <div className="p-2 rounded-lg bg-primary/10">
                <ShieldCheck className="h-5 w-5 animate-pulse" />
              </div>
              <span className="text-[10px] font-bold text-primary">Statutory trust</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white leading-none tracking-tighter">Your data is <br /> <span className="text-primary italic">your property.</span></h2>
            <p className="text-sm sm:text-lg text-gray-400 font-medium leading-relaxed">
              Every forensic report and narration is encrypted via TLS 1.3 and is strictly confidential. We do not train foundation models on citizen narratives.
            </p>
            <Button variant="outline" className="h-12 px-8 rounded-xl border-primary/20 text-primary font-black text-[10px] uppercase tracking-widest hover:bg-primary/5" asChild>
              <Link href="/dashboard/privacy">Audit security protocol <ArrowRight className="ml-2 h-3.5 w-3.5" /></Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full md:w-auto relative z-10">
            {[
              { label: "Encrypted", icon: Lock },
              { label: "Private", icon: ShieldCheck },
              { label: "Secure", icon: HistoryIcon },
              { label: "Audit ready", icon: Search }
            ].map((n, i) => (
              <div key={i} className="p-6 rounded-3xl bg-white/5 border border-white/5 flex flex-col items-center gap-3 text-center">
                <n.icon className="h-6 w-6 text-primary opacity-40" />
                <span className="text-[10px] font-bold text-white/60">{n.label}</span>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <div className="pt-12 text-center opacity-20">
        <p className="text-[10px] font-bold text-white/20">Nyayasahayak.in // Institutional terminal // 2025</p>
      </div>
    </div>
  );
}
