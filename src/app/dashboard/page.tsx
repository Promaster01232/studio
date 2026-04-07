"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import {
  Mic,
  Search,
  FileText,
  FileSignature,
  BrainCircuit,
  ArrowRight,
  ShieldCheck,
  Loader2,
  Clock,
  ChevronRight,
  Gavel,
  Activity,
  Heart,
  Newspaper,
  Plus,
  MessageSquare,
  MessageCircle,
  Sparkles,
  Zap,
  Send,
  Bot
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth, useFirestore } from "@/firebase";
import { collection, query, orderBy, limit, onSnapshot, Timestamp } from "firebase/firestore";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Post {
    id: string;
    authorUid: string;
    authorName: string;
    authorAvatar?: string;
    createdAt: Timestamp;
    title: string;
    content: string;
    likes: number;
    postType?: string;
    isAnonymous?: boolean;
}

const tools = [
    { icon: Mic, title: "Voice Summary", desc: "Instantly convert your story into a clear legal roadmap.", href: "/dashboard/narrate", color: "text-blue-500", bg: "bg-blue-500/5", glow: "shadow-blue-500/20" },
    { icon: Search, title: "Document Scan", desc: "Identify risks and deadlines in your legal papers automatically.", href: "/dashboard/document-intelligence", color: "text-indigo-500", bg: "bg-indigo-500/5", glow: "shadow-indigo-500/20" },
    { icon: FileText, title: "Write Drafts", href: "/dashboard/document-generator", color: "text-sky-500", bg: "bg-sky-500/5", glow: "shadow-sky-500/20" },
    { icon: FileSignature, title: "Create Bonds", href: "/dashboard/bond-generator", color: "text-cyan-500", bg: "bg-cyan-500/5", glow: "shadow-cyan-500/20" },
];

const NeuralPulse = () => (
  <div className="relative flex items-center justify-center h-4 w-4">
    <div className="absolute h-full w-full rounded-full bg-primary/40 animate-ping" />
    <div className="relative h-2 w-2 rounded-full bg-primary" />
  </div>
);

export default function DashboardHomePage() {
  const firestore = useFirestore();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [chatInput, setChatInput] = useState("");

  useEffect(() => {
    const postsCol = collection(firestore, "posts");
    const q = query(postsCol, orderBy("createdAt", "desc"), limit(4));
    
    const unsub = onSnapshot(q, (snap) => {
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as Post));
        setPosts(list);
        setLoading(false);
    }, () => setLoading(false));
    
    return () => unsub();
  }, [firestore]);

  return (
    <div className="max-w-7xl mx-auto space-y-12 py-8 px-4 sm:px-6 text-left">
      {/* WELCOME SECTION WITH ANIMATION */}
      <motion.section 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div className="space-y-2">
          <div className="flex items-center gap-3 mb-1">
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/10 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
              Terminal Active
            </Badge>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              <NeuralPulse /> Neural Sync: 100%
            </div>
          </div>
          <h1 className="text-4xl font-black font-headline tracking-tighter uppercase leading-none">
            Dashboard <span className="text-primary italic">Central.</span>
          </h1>
          <p className="text-sm text-muted-foreground font-medium">Access high-fidelity AI tools and monitor your case nodes.</p>
        </div>
        <div className="flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-muted/30 border border-primary/5 hidden lg:flex items-center gap-4">
                <Activity className="h-5 w-5 text-primary animate-pulse" />
                <div className="text-left leading-none">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">AI Latency</p>
                    <p className="text-xs font-black mt-1">42ms Optimal</p>
                </div>
            </div>
        </div>
      </motion.section>

      {/* CORE TOOLS WITH NEURAL GLOW */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {tools.map((tool, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="group"
          >
            <Link href={tool.href} className="block h-full">
              <Card className={cn(
                "h-full border-primary/5 bg-card/40 backdrop-blur-sm transition-all duration-500 rounded-[2rem] overflow-hidden group-hover:border-primary/20",
                "relative shadow-xl hover:shadow-2xl",
                tool.glow
              )}>
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardContent className="p-8 flex flex-col justify-between h-full relative z-10">
                  <div className={cn("p-4 rounded-2xl w-fit mb-8 shadow-inner transition-transform duration-500 group-hover:scale-110", tool.bg, tool.color)}>
                    <tool.icon className="h-7 w-7" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-black tracking-tight uppercase leading-none">{tool.title}</h3>
                    <p className="text-[11px] text-muted-foreground font-medium leading-relaxed line-clamp-2">
                        {tool.desc}
                    </p>
                  </div>
                  <div className="mt-8 flex items-center justify-between">
                    <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-primary/60 group-hover:text-primary transition-colors">
                      Initialize Tool
                    </div>
                    <div className="h-8 w-8 rounded-xl bg-primary/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                        <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </section>

      <div className="grid lg:grid-cols-12 gap-10">
        {/* MAIN FEED: POST VIEW */}
        <div className="lg:col-span-8 space-y-10">
          <div className="flex items-center justify-between border-b border-primary/5 pb-4">
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Newspaper className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-black font-headline tracking-tighter uppercase">Community Transmissions</h2>
            </div>
            <Button variant="ghost" size="sm" asChild className="text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary/5">
              <Link href="/dashboard/research-analytics">
                View Registry <ChevronRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-6">
            <AnimatePresence mode="popLayout">
                {loading ? (
                <div className="py-20 flex flex-col items-center justify-center gap-4">
                    <Loader2 className="h-10 w-10 animate-spin text-primary opacity-20" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground animate-pulse">Syncing Registry Nodes...</p>
                </div>
                ) : posts.map((post, idx) => (
                <motion.div
                    key={post.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                >
                    <Link href={`/dashboard/research-analytics`} className="block group">
                        <Card className="border-primary/5 hover:border-primary/20 transition-all duration-500 rounded-[2.5rem] bg-card/40 backdrop-blur-sm shadow-lg hover:shadow-2xl overflow-hidden relative">
                            <div className="absolute top-0 left-0 bottom-0 w-1 bg-primary/20 group-hover:bg-primary transition-all" />
                            <CardContent className="p-8">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-10 w-10 rounded-xl border border-primary/10 shadow-sm">
                                            {post.authorAvatar && <AvatarImage src={post.authorAvatar} />}
                                            <AvatarFallback className="text-[10px] font-black bg-primary/5 text-primary uppercase">{post.isAnonymous ? 'A' : post.authorName.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="text-left space-y-0.5">
                                            <p className="text-xs font-black tracking-tight">{post.isAnonymous ? 'Identity Masked' : post.authorName}</p>
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-2.5 w-2.5 text-muted-foreground opacity-40" />
                                                <p className="text-[9px] text-muted-foreground font-black uppercase tracking-widest">{post.createdAt ? formatDistanceToNow(post.createdAt.toDate(), { addSuffix: true }) : 'Just now'}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/10 text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                                        {post.postType || 'Statutory Node'}
                                    </Badge>
                                </div>
                                <h3 className="text-xl font-black tracking-tight mb-3 group-hover:text-primary transition-colors uppercase leading-none">{post.title}</h3>
                                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed font-medium mb-6">
                                    {post.content}
                                </p>
                                <div className="flex items-center gap-6 pt-6 border-t border-primary/5">
                                    <div className="flex items-center gap-2 text-red-500/60 font-black text-[10px]">
                                        <Heart className="h-4 w-4 fill-current" /> {post.likes}
                                    </div>
                                    <div className="flex items-center gap-2 text-primary/60 font-black text-[10px]">
                                        <MessageCircle className="h-4 w-4" /> Discussion Active
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                </motion.div>
                ))}
            </AnimatePresence>
          </div>
        </div>

        {/* SIDEBAR: CHATTING & SYSTEM STATUS */}
        <div className="lg:col-span-4 space-y-10">
          {/* AI CONVERSATION NODE (CHATTING) */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 px-1">
                <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                <h2 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Neural Conversation</h2>
            </div>
            <Card className="border-primary/10 bg-[#0D1B2A] text-white rounded-[2.5rem] overflow-hidden shadow-2xl relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent pointer-events-none" />
                <CardHeader className="bg-white/5 border-b border-white/5 p-6 relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="p-2 rounded-xl bg-primary text-white shadow-xl">
                                <Bot className="h-5 w-5" />
                            </div>
                            <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-[#0D1B2A] shadow-sm animate-pulse" />
                        </div>
                        <div className="text-left">
                            <CardTitle className="text-base font-black tracking-tighter uppercase leading-none">Nyaya Mitra</CardTitle>
                            <p className="text-[8px] font-bold text-primary/60 uppercase tracking-[0.2em] mt-1">AI Co-pilot Active</p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6 relative z-10">
                    <div className="space-y-4 h-48 overflow-y-auto custom-scrollbar text-left pr-2">
                        <div className="bg-white/5 rounded-2xl p-4 border border-white/5 max-w-[90%]">
                            <p className="text-xs font-medium leading-relaxed text-white/80">
                                Namaste. I am analyzing the latest BNS amendments. How can I assist your forensic research today?
                            </p>
                        </div>
                        <div className="bg-primary/20 rounded-2xl p-4 border border-primary/20 max-w-[90%] ml-auto text-right">
                            <p className="text-xs font-medium text-primary-foreground/90">
                                Explain Section 302 of BNS.
                            </p>
                        </div>
                    </div>
                    <div className="relative mt-auto">
                        <Input 
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            placeholder="Consult neural engine..." 
                            className="h-12 bg-white/5 border-white/10 rounded-xl font-bold text-xs pr-12 text-white focus:border-primary transition-all"
                        />
                        <Button size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10 rounded-lg bg-primary hover:bg-primary/90 shadow-xl">
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
          </section>

          {/* PREMIUM BANNER */}
          <Card className="bg-primary text-primary-foreground rounded-[2.5rem] overflow-hidden border-none shadow-2xl shadow-primary/20 group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="absolute top-0 right-0 p-8 opacity-[0.05] pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                <Logo className="h-40 w-40 border-none shadow-none grayscale" />
            </div>
            <CardContent className="p-10 space-y-8 relative z-10 text-left">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-amber-400 fill-amber-400" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Statutory Expansion</span>
                </div>
                <h3 className="text-3xl font-black font-headline tracking-tighter uppercase leading-tight">Elevate Your <br /> <span className="italic">Authority.</span></h3>
                <p className="text-sm opacity-80 font-medium leading-relaxed">
                    Unlock unlimited AI forensic scans, professional document drafting, and root access to the legal registry.
                </p>
              </div>
              <Button variant="secondary" className="w-full font-black uppercase tracking-widest text-[10px] rounded-2xl h-14 shadow-2xl active:scale-95 transition-all" asChild>
                <Link href="/dashboard/billing">Recalibrate Clearance</Link>
              </Button>
            </CardContent>
          </Card>

          {/* SYSTEM STATUS CARD */}
          <Card className="border-primary/5 bg-muted/20 rounded-[2.5rem] shadow-sm overflow-hidden">
            <CardHeader className="p-8 pb-4 border-b border-primary/5 bg-primary/5 text-left">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground">Neural Matrix Status</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-6 text-left">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                <span className="flex items-center gap-3 text-muted-foreground"><Activity className="h-4 w-4 text-green-500" /> AI Core Node</span>
                <span className="text-green-500">Synchronized</span>
              </div>
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                <span className="flex items-center gap-3 text-muted-foreground"><Clock className="h-4 w-4 text-blue-500" /> Global Latency</span>
                <span className="text-foreground">42ms Optimal</span>
              </div>
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                <span className="flex items-center gap-3 text-muted-foreground"><ShieldCheck className="h-4 w-4 text-indigo-500" /> Statutory Guard</span>
                <span className="text-foreground">AES-256 Active</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* INSTITUTIONAL FOOTER BAR */}
      <div className="pt-12 border-t border-primary/5 flex flex-col sm:flex-row items-center justify-between gap-8 opacity-30 text-center sm:text-left">
        <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                <span className="text-[9px] font-black uppercase tracking-widest">Registry Validated</span>
            </div>
            <div className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                <span className="text-[9px] font-black uppercase tracking-widest">Network Optimized</span>
            </div>
        </div>
        <p className="text-[9px] font-black uppercase tracking-[0.5em] text-muted-foreground">NYAYASAHAYAK.IN // TERMINAL HUB</p>
      </div>
    </div>
  );
}
