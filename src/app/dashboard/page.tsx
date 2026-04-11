
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useState, useEffect } from "react";
import {
  MessageSquare,
  FileText,
  FileSearch,
  Upload,
  Plus,
  Zap,
  Lightbulb,
  X,
  History,
  Star,
  ChevronRight,
  Database,
  ArrowRight,
  Clock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth, useFirestore } from "@/firebase";
import { doc, getDoc, collection, query, where, getDocs, limit, orderBy } from "firebase/firestore";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { WelcomeModal } from "@/components/welcome-modal";
import Link from "next/link";

export default function DashboardHomePage() {
  const auth = useAuth();
  const firestore = useFirestore();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [greeting, setGreeting] = useState("Good day");
  const [showTip, setShowTip] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    if (auth.currentUser) {
      const userRef = doc(firestore, "users", auth.currentUser.uid);
      getDoc(userRef).then(doc => {
        if (doc.exists()) {
          setUserProfile(doc.data());
        }
        setLoading(false);
      });
    }
  }, [auth, firestore]);

  const stats = [
    { label: "Total Chats", value: "0", icon: MessageSquare, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Documents", value: "0", icon: FileSearch, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Notes", value: "0", icon: FileText, color: "text-purple-500", bg: "bg-purple-500/10" },
    { 
      label: "AI Usage", 
      value: `${userProfile?.aiUsageCount || 0} / 100`, 
      sub: "uses", 
      icon: Zap, 
      color: "text-amber-500", 
      bg: "bg-amber-500/10" 
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 py-6 px-4 sm:px-6 text-left font-body">
      <WelcomeModal />
      
      {/* GREETING TERMINAL */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full"
      >
        <Card className="border-none bg-[#161b22] shadow-2xl rounded-[2rem] overflow-hidden p-8 sm:p-10 relative">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-8 relative z-10">
            <div className="flex items-center gap-6">
              <Avatar className="h-16 w-16 sm:h-20 sm:w-20 border-2 border-white/10 rounded-full shadow-xl">
                <AvatarImage src={userProfile?.photoURL} className="object-cover" />
                <AvatarFallback className="bg-primary text-primary-foreground font-black text-2xl">
                  {userProfile?.firstName?.charAt(0) || "P"}
                </AvatarFallback>
              </Avatar>
              <div className="text-left space-y-1">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                    {greeting}, {userProfile?.firstName || "Piyush"}!
                  </h1>
                  <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-none font-bold text-[10px] h-6 px-3">
                    Free
                  </Badge>
                </div>
                <p className="text-sm text-gray-400 font-medium">
                  Welcome to your NyayGuru dashboard
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" className="h-11 px-6 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs gap-2 border border-white/5 transition-all">
                <Upload className="h-4 w-4" /> Upload
              </Button>
              <Button asChild className="h-11 px-6 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-black text-xs gap-2 shadow-lg shadow-primary/20 active:scale-95 transition-all">
                <Link href="/dashboard/narrate">
                  <Zap className="h-4 w-4 fill-current" /> New Chat
                </Link>
              </Button>
            </div>
          </div>
        </Card>
      </motion.section>

      {/* STATS GRID */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + (i * 0.1) }}
          >
            <Card className="bg-[#161b22] border-none rounded-2xl p-6 transition-all hover:bg-white/5 group shadow-lg">
              <div className="flex items-start justify-between">
                <div className="text-left space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">{stat.label}</p>
                  <h3 className="text-2xl font-black text-white">{stat.value}</h3>
                  {stat.sub && <p className="text-[9px] font-bold text-gray-600 uppercase tracking-tighter">{stat.sub}</p>}
                </div>
                <div className={cn("p-3 rounded-xl transition-transform group-hover:scale-110", stat.bg, stat.color)}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </section>

      {/* LEGAL TIP NODE */}
      <AnimatePresence>
        {showTip && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="bg-[#1c120a] border border-amber-900/30 rounded-2xl p-6 relative overflow-hidden group">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                  <Lightbulb className="h-5 w-5" />
                </div>
                <div className="flex-1 text-left space-y-1 pr-8">
                  <h4 className="text-sm font-black text-amber-500 uppercase tracking-tight">Legal Tip of the Day</h4>
                  <p className="text-xs font-medium text-amber-200/70 leading-relaxed">
                    A consumer complaint can be filed within 2 years from the date of cause of action.
                  </p>
                </div>
                <button 
                  onClick={() => setShowTip(false)}
                  className="absolute right-4 top-4 p-1 rounded-full hover:bg-white/5 text-amber-500/40 hover:text-amber-500 transition-all"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* RECENT SECTIONS */}
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="bg-[#161b22] border-none rounded-[2rem] shadow-xl overflow-hidden">
          <CardHeader className="p-8 pb-4 flex flex-row items-center justify-between bg-white/20 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <History className="h-4 w-4" />
              </div>
              <CardTitle className="text-sm font-black uppercase tracking-widest text-white">Recent Chats</CardTitle>
            </div>
            <Button variant="link" className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/80" asChild>
              <Link href="/dashboard/research-analytics">View All <ChevronRight className="ml-1 h-3 w-3" /></Link>
            </Button>
          </CardHeader>
          <CardContent className="p-8 text-center py-20 opacity-30">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-500" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Your latest chat sessions</p>
          </CardContent>
        </Card>

        <Card className="bg-[#161b22] border-none rounded-[2rem] shadow-xl overflow-hidden">
          <CardHeader className="p-8 pb-4 flex flex-row items-center justify-between bg-white/20 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                <Star className="h-4 w-4" />
              </div>
              <CardTitle className="text-sm font-black uppercase tracking-widest text-white">Favorite Chats</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-8 text-center py-20 opacity-30">
            <Star className="h-12 w-12 mx-auto mb-4 text-gray-500" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Your starred conversations</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
