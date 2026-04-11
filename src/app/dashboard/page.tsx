
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import React, { useState, useEffect, useRef } from "react";
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
  History as HistoryIcon,
  Upload,
  User,
  Plus,
  Loader2,
  Activity
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth, useFirestore } from "@/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getGeneralAiResponseAction } from "./chat-actions";
import { ScrollArea } from "@/components/ui/scroll-area";

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
    desc: "Draft professional legal notices and complaints in any indian language.",
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
    desc: "Predictive modeling for bail success based on bns sections and records.",
    icon: Scale,
    color: "text-red-500",
    bg: "bg-red-500/10",
    href: "/dashboard/bail-estimator"
  },
  {
    title: "Law linker",
    desc: "Locate specific bns sections and amendments relevant to your situation.",
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

const ADMIN_EMAILS = [
  'enterspaceindia@gmail.com', 
  'piyushkumrsingh23399@gmail.com',
  'nyayasahayakhelp@gmail.com'
];

interface Message {
  role: 'user' | 'ai';
  text: string;
}

export default function DashboardHomePage() {
  const auth = useAuth();
  const firestore = useFirestore();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [greeting, setGreeting] = useState("");
  
  // Chat States
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");

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

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (customInput?: string) => {
    const queryText = customInput || input;
    if (!queryText.trim() || isLoading) return;
    
    const userMsg = queryText.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput("");
    setIsLoading(true);

    try {
      const result = await getGeneralAiResponseAction(userMsg);
      setMessages(prev => [...prev, { role: 'ai', text: result.response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: "The neural hub is temporarily busy. Please try again in a few moments." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
  };

  const isAdmin = userProfile?.email && (ADMIN_EMAILS.includes(userProfile.email.toLowerCase()) || !!userProfile?.isAdmin);
  const planLabel = isAdmin ? "Root" : (userProfile?.subscriptionType === 'free' || !userProfile?.subscriptionType ? "Free" : "Pro");

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-32 px-4 sm:px-6">
      
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full bg-[#f0f4ff] dark:bg-[#1a1f2e] border border-blue-100/50 dark:border-blue-900/20 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6"
      >
        <div className="flex items-center gap-6 text-left">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-amber-700 blur-lg opacity-20 group-hover:opacity-40 transition-opacity rounded-full"></div>
            <Avatar className="h-16 w-16 sm:h-20 sm:w-20 border-4 border-white dark:border-zinc-800 shadow-xl rounded-full relative z-10">
              <AvatarImage src={userProfile?.photoURL} className="object-cover" />
              <AvatarFallback className="bg-gradient-to-br from-[#4a4a4a] to-[#1a1a1a] text-white font-black text-2xl">
                {userProfile?.firstName?.charAt(0) || <User className="h-8 w-8" />}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white leading-none">
                {greeting}, {userProfile?.firstName || 'there'}!
              </h2>
              <Badge variant="outline" className="bg-white/50 dark:bg-black/20 border-slate-200 dark:border-slate-700 text-[10px] font-bold px-2.5 py-0.5 rounded-lg text-slate-500 dark:text-slate-400">
                {planLabel}
              </Badge>
            </div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Welcome to your Nyaya Sahayak dashboard
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none h-12 px-6 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-zinc-900 font-bold text-xs gap-2 shadow-sm hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all active:scale-95" asChild>
            <Link href="/dashboard/document-intelligence">
              <Upload className="h-4 w-4" />
              Upload
            </Link>
          </Button>
          <Button 
            onClick={() => setMessages([])}
            className="flex-1 md:flex-none h-12 px-6 rounded-xl bg-[#1e293b] hover:bg-[#0f172a] text-white font-bold text-xs gap-2 shadow-xl active:scale-95 transition-all"
          >
            <Sparkles className="h-4 w-4 text-primary" />
            New chat
          </Button>
        </div>
      </motion.div>

      {/* Central Hub Ingress */}
      <section className="flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-4xl bg-[#1a1a1a] rounded-[2.5rem] p-8 sm:p-12 border border-white/5 shadow-2xl relative overflow-hidden text-center flex flex-col items-center gap-8"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
          
          <AnimatePresence mode="wait">
            {messages.length === 0 ? (
              <motion.div
                key="welcome-prompt"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-8 w-full"
              >
                <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                  Hello, how can i help you today?
                </h1>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  {suggestions.map((s, i) => (
                    <motion.button
                      key={i}
                      onClick={() => handleSend(s)}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 + (i * 0.1) }}
                      className="px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-white/40 hover:bg-white/10 hover:text-white hover:border-primary/30 transition-all text-xs font-medium"
                    >
                      {s}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="chat-history"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full h-[400px] flex flex-col"
              >
                <ScrollArea className="flex-1 pr-4" viewportRef={scrollRef}>
                  <div className="space-y-6 pb-4">
                    {messages.map((m, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: m.role === 'user' ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={cn(
                          "flex flex-col max-w-[85%] space-y-1.5",
                          m.role === 'user' ? "ml-auto items-end" : "items-start"
                        )}
                      >
                        <div className={cn(
                          "px-5 py-3 rounded-2xl text-sm sm:text-base font-medium leading-relaxed text-left shadow-lg",
                          m.role === 'user' 
                            ? "bg-[#2a2a2a] text-white rounded-tr-none border border-white/5" 
                            : "bg-primary/10 border border-primary/20 text-white/90 rounded-tl-none prose dark:prose-invert max-w-none"
                        )}>
                          {m.text}
                        </div>
                        <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/40 px-1">
                          {m.role === 'ai' ? 'Nyaya Sahayak' : 'Registry node'}
                        </span>
                      </motion.div>
                    ))}
                    {isLoading && (
                      <div className="flex gap-3 items-center text-primary/40 p-2">
                        <div className="relative">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <Activity className="absolute inset-0 h-4 w-4 animate-pulse opacity-50" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">Neural ingress active...</span>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="w-full max-w-3xl space-y-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-primary/5 rounded-2xl border border-primary/20 pointer-events-none group-focus-within:border-primary/40 transition-colors" />
              <div className="flex items-center gap-4 p-3 relative z-10">
                <div className="h-10 w-10 shrink-0 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
                  <Sparkles className="h-5 w-5" />
                </div>
                <Textarea 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Ask anything about the law..." 
                  className="flex-1 bg-transparent border-none focus-visible:ring-0 text-white text-lg placeholder:text-white/20 min-h-[48px] h-10 py-2 resize-none overflow-hidden" 
                />
                <div className="flex items-center gap-2 pr-2">
                  <button className="p-2 text-white/40 hover:text-primary transition-colors"><Paperclip className="h-5 w-5" /></button>
                  <button className="p-2 text-white/40 hover:text-primary transition-colors"><Mic className="h-5 w-5" /></button>
                  <button 
                    onClick={() => handleSend()}
                    disabled={!input.trim() || isLoading}
                    className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-xl active:scale-95 transition-all disabled:opacity-50"
                  >
                    <Send className="h-5 w-5 fill-current" />
                  </button>
                </div>
              </div>
            </div>
            <p className="text-[10px] font-bold text-white/20 tracking-wide">Free to use. Your conversations are private.</p>
          </div>
        </motion.div>
      </section>

      {/* Feature Matrix */}
      <section className="space-y-12">
        <div className="text-left border-l-4 border-primary pl-6 py-2">
          <h2 className="text-[10px] font-bold text-primary mb-1 uppercase tracking-widest">Institutional core</h2>
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

      {/* Trust Node */}
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
              <span className="text-[10px] font-bold text-primary uppercase">Statutory trust</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white leading-none tracking-tighter">Your data is <br /> <span className="text-primary italic">your property.</span></h2>
            <p className="text-sm sm:text-lg text-gray-400 font-medium leading-relaxed">
              Every forensic report and narration is encrypted via tls 1.3 and is strictly confidential. We do not train foundation models on citizen narratives.
            </p>
            <Button variant="outline" className="h-12 px-8 rounded-xl border-primary/20 text-primary font-black text-[10px] uppercase tracking-widest hover:bg-primary/5" asChild>
              <Link href="/privacy">Audit security protocol <ArrowRight className="ml-2 h-3.5 w-3.5" /></Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full md:w-auto relative z-10">
            {[
              { label: "Encrypted", icon: HistoryIcon },
              { label: "Private", icon: ShieldCheck },
              { label: "Secure", icon: HistoryIcon },
              { label: "Audit ready", icon: Search }
            ].map((n, i) => (
              <div key={i} className="p-6 rounded-3xl bg-white/5 border border-white/5 flex flex-col items-center gap-3 text-center">
                <n.icon className="h-6 w-6 text-primary opacity-40" />
                <span className="text-[10px] font-bold text-white/60 uppercase">{n.label}</span>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
