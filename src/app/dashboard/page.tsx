
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import React, { useState, useEffect } from "react";
import {
  MessageSquare,
  Zap,
  Sparkles,
  Paperclip,
  SlidersHorizontal,
  Clock,
  Mic,
  Send,
  Upload,
  FileText,
  FileSearch,
  BookOpen,
  Lock,
  Globe,
  Lightbulb,
  MessageCircle,
  ShieldCheck,
  ChevronRight,
  Plus
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
    title: "AI Legal Chat",
    desc: "Ask about any act or section. Get an explanation with the relevant law cited.",
    icon: MessageSquare,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    title: "Document OCR",
    desc: "Upload a court order or notice as PDF or image. Text is extracted automatically.",
    icon: FileSearch,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    title: "Smart Notes",
    desc: "Save chats, add notes, organize into collections. Search across everything.",
    icon: FileText,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    title: "Case Laws",
    desc: "Responses reference Supreme Court and High Court judgments where relevant.",
    icon: BookOpen,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    title: "Files Storage",
    desc: "Keep your documents (PDF, Word, images) in one place. Encrypted cloud storage.",
    icon: Upload,
    color: "text-pink-500",
    bg: "bg-pink-500/10",
  },
  {
    title: "Multi-Language",
    desc: "Works in Hindi, English, Marathi, Tamil, Telugu, Kannada, Malayalam, and more.",
    icon: Globe,
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
  },
  {
    title: "Voice Input",
    desc: "Don't want to type? Speak your question. Works on mobile and desktop.",
    icon: Mic,
    color: "text-blue-600",
    bg: "bg-blue-600/10",
  },
  {
    title: "Privacy First",
    desc: "End-to-end encryption. No data sharing. No training on your conversations.",
    icon: Lock,
    color: "text-orange-600",
    bg: "bg-orange-600/10",
  }
];

const steps = [
  {
    num: "01",
    title: "Ask Your Question",
    desc: "Type or speak your legal question in plain language.",
    icon: MessageCircle
  },
  {
    num: "02",
    title: "Get AI Analysis",
    desc: "NyayGuru checks relevant acts, sections, and court judgments.",
    icon: Lightbulb
  },
  {
    num: "03",
    title: "Receive Guidance",
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

  const stats = [
    { label: "Total Chats", value: "0", icon: MessageSquare, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Documents", value: "0", icon: FileSearch, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Notes", value: "0", icon: FileText, color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "AI Usage", value: `${userProfile?.aiUsageCount || 0} / 100`, icon: Zap, color: "text-amber-500", bg: "bg-amber-500/10" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-16 pb-32 px-4 sm:px-6">
      
      {/* GREETING CARD */}
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
                    {greeting}, {userProfile?.firstName || "Friend"}!
                  </h2>
                  <Badge variant="secondary" className="bg-white/5 text-gray-400 border-white/10 font-bold text-[9px] uppercase tracking-widest px-2.5 py-0.5 rounded-lg">
                    Free Tier
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
              <Button className="flex-1 md:flex-none h-11 px-6 rounded-xl bg-primary text-primary-foreground font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 gap-2" asChild>
                <Link href="/dashboard/narrate"><Plus className="h-4 w-4" /> New Chat</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + (i * 0.05) }}>
            <Card className="bg-[#161b22] border-white/5 rounded-2xl overflow-hidden group hover:border-primary/20 transition-all">
              <CardContent className="p-5 sm:p-6 flex flex-col items-start gap-4 text-left">
                <div className={cn("p-2.5 rounded-xl transition-transform group-hover:scale-110", stat.bg, stat.color)}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{stat.label}</p>
                  <p className="text-xl sm:text-2xl font-black text-white tracking-tighter">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* CENTRAL CHAT HUB */}
      <div className="flex flex-col items-center justify-center pt-10 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="mb-8">
          <div className="p-4 rounded-full bg-primary/10 border border-primary/20 shadow-[0_0_40px_rgba(153,75,0,0.15)]">
            <Sparkles className="h-10 w-10 text-primary" />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-4 mb-10">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">Hello, how can I help you?</h1>
          <p className="text-gray-400 text-lg font-medium max-w-2xl mx-auto leading-relaxed">Ask NyayGuru about Indian statutes, procedural roadmaps, or case research.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="w-full max-w-3xl">
          <Card className="bg-[#161b22] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-6 space-y-4 text-left">
              <Textarea placeholder="Ask NyayGuru Legal AI..." className="bg-transparent border-none focus-visible:ring-0 text-white text-lg placeholder:text-gray-600 min-h-[120px] resize-none p-0 custom-scrollbar" />
              <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between pt-4 border-t border-white/5">
                <div className="flex items-center gap-4 text-gray-500">
                  <button className="hover:text-primary transition-all p-1"><Paperclip className="h-4 w-4" /></button>
                  <button className="hover:text-primary transition-all p-1"><SlidersHorizontal className="h-4 w-4" /></button>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-tighter">
                    <MessageSquare className="h-3.5 w-3.5" /> 10/10
                  </div>
                  <div className="flex items-center gap-1.5 hover:text-gray-300 transition-colors cursor-pointer">
                    <Clock className="h-3.5 w-3.5" /> <span className="text-[10px] font-black uppercase tracking-widest">Saved</span>
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

      {/* FEATURES SECTION (What You Can Do) */}
      <section className="pt-20 space-y-16">
        <div className="text-center space-y-4">
          <Badge variant="outline" className="bg-amber-500/5 text-amber-500 border-amber-500/20 px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">Features</Badge>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tighter text-white uppercase">What You Can Do with NyayGuru</h2>
          <p className="text-gray-500 text-sm sm:text-base max-w-2xl mx-auto font-medium">Eight tools, all included free. From chat to document OCR to voice input.</p>
        </div>

        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div key={i} variants={itemVariants}>
              <Card className="bg-[#161b22] border-white/5 rounded-[2rem] h-full overflow-hidden hover:border-primary/30 transition-all duration-500 group">
                <CardContent className="p-8 flex flex-col gap-6 text-left">
                  <div className={cn("p-3 rounded-xl w-fit transition-transform group-hover:scale-110 shadow-lg", f.bg, f.color)}>
                    <f.icon className="h-6 w-6" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-black text-lg text-white tracking-tight leading-none">{f.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed font-medium">{f.desc}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="pt-24 space-y-16">
        <div className="text-center space-y-4">
          <Badge variant="outline" className="bg-amber-500/5 text-amber-500 border-amber-500/20 px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">How It Works</Badge>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tighter text-white uppercase">How It Works</h2>
          <p className="text-gray-500 text-sm sm:text-base max-w-2xl mx-auto font-medium">No appointments. No waiting. Works 24/7, even at 2 AM on a Sunday.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Connecting line for desktop */}
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
                <h3 className="font-black text-xl text-white tracking-tight uppercase">{s.title}</h3>
                <p className="text-xs text-gray-500 font-medium leading-relaxed">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

    </div>
  );
}
