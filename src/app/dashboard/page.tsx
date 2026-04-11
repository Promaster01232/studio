
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
  Plus,
  FileText,
  FileSearch,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth, useFirestore } from "@/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import Link from "next/link";

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

      // Set greeting based on time
      const hour = new Date().getHours();
      if (hour < 12) setGreeting("Good morning");
      else if (hour < 17) setGreeting("Good afternoon");
      else setGreeting("Good evening");

      return () => unsub();
    }
  }, [auth, firestore]);

  const suggestions = [
    "What are tenant rights in India?",
    "How to file a consumer complaint?",
    "Explain Domestic Violence Act",
    "What is bail process in India?"
  ];

  const stats = [
    { label: "Total Chats", value: "0", icon: MessageSquare, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Documents", value: "0", icon: FileSearch, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Notes", value: "0", icon: FileText, color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "AI Usage", value: `${userProfile?.aiUsageCount || 0} / 100`, icon: Zap, color: "text-amber-500", bg: "bg-amber-500/10" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      
      {/* 1. ANIMATED GREETING CARD (Top Section) */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full"
      >
        <Card className="bg-[#161b22] border-white/5 rounded-3xl overflow-hidden shadow-2xl">
          <CardContent className="p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5 text-left">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-tr from-primary to-accent rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                <Avatar className="h-14 w-14 border-2 border-white/10 rounded-2xl shadow-2xl relative z-10">
                  <AvatarImage src={userProfile?.photoURL} className="object-cover" />
                  <AvatarFallback className="bg-[#e91e63] text-white font-black text-xl">
                    {userProfile?.firstName?.charAt(0) || "P"}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-xl sm:text-3xl font-black tracking-tighter text-white leading-none">
                    {greeting}, {userProfile?.firstName || "Piyush"}!
                  </h2>
                  <Badge variant="secondary" className="bg-white/5 text-gray-400 border-white/10 font-bold text-[9px] uppercase tracking-widest px-2.5 py-0.5 rounded-lg">
                    Free
                  </Badge>
                </div>
                <p className="text-xs sm:text-sm text-gray-500 font-medium tracking-tight">
                  Welcome back to your institutional terminal.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <Button 
                variant="outline" 
                className="flex-1 md:flex-none h-11 px-6 rounded-xl border-white/10 bg-white/5 text-white font-bold text-xs gap-2 hover:bg-white/10 active:scale-95 transition-all"
                asChild
              >
                <Link href="/dashboard/document-intelligence">
                  <Upload className="h-4 w-4" /> Upload
                </Link>
              </Button>
              <Button 
                className="flex-1 md:flex-none h-11 px-6 rounded-xl bg-primary text-primary-foreground font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 gap-2 active:scale-95 transition-all"
                asChild
              >
                <Link href="/dashboard/narrate">
                  <Sparkles className="h-4 w-4" /> New Chat
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 2. STATS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + (i * 0.05) }}
          >
            <Card className="bg-[#161b22] border-white/5 rounded-2xl overflow-hidden hover:border-primary/20 transition-all group">
              <CardContent className="p-5 sm:p-6 flex flex-col items-start gap-4 text-left">
                <div className={cn("p-2.5 rounded-xl transition-transform group-hover:scale-110", stat.bg, stat.color)}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{stat.label}</p>
                  <p className="text-xl sm:text-2xl font-black text-white tracking-tighter">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* 3. CENTRAL CHAT HUB */}
      <div className="flex flex-col items-center justify-center pt-10 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8"
        >
          <div className="p-4 rounded-full bg-primary/10 border border-primary/20 shadow-[0_0_40px_rgba(153,75,0,0.15)]">
            <Sparkles className="h-10 w-10 text-primary" />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4 mb-10"
        >
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
            Hello, how can I help you today?
          </h1>
          <p className="text-gray-400 text-lg font-medium max-w-2xl mx-auto leading-relaxed">
            Ask NyayGuru about Indian statutes, procedural roadmaps, or case research.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-16"
        >
          {suggestions.map((text, i) => (
            <button 
              key={i} 
              className="rounded-full bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:text-white font-bold text-xs h-10 px-6 transition-all active:scale-95"
            >
              {text}
            </button>
          ))}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full max-w-3xl"
        >
          <Card className="bg-[#161b22] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-6 space-y-4 text-left">
              <Textarea 
                placeholder="Ask NyayGuru Legal AI..." 
                className="bg-transparent border-none focus-visible:ring-0 text-white text-lg placeholder:text-gray-600 min-h-[120px] resize-none p-0 custom-scrollbar"
              />
              
              <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between pt-4 border-t border-white/5">
                <div className="flex items-center gap-4 text-gray-500">
                  <button className="hover:text-primary transition-all active:scale-90 p-1">
                    <Paperclip className="h-4 w-4" />
                  </button>
                  <button className="hover:text-primary transition-all active:scale-90 p-1">
                    <SlidersHorizontal className="h-4 w-4" />
                  </button>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/5">
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span className="text-[10px] font-black uppercase tracking-tighter">10/10</span>
                  </div>
                  <div className="flex items-center gap-1.5 group cursor-pointer hover:text-gray-300 transition-colors">
                    <Clock className="h-3.5 w-3.5" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Saved</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-end gap-4">
                  <button className="text-gray-500 hover:text-primary transition-all active:scale-90 p-2">
                    <Mic className="h-5 w-5" />
                  </button>
                  <button className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20 active:scale-95 transition-all hover:bg-primary/90">
                    <Send className="h-5 w-5 fill-current" />
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

    </div>
  );
}
