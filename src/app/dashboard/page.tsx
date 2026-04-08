
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  Bot,
  Layers,
  FileSearch,
  Scale,
  Edit3,
  SquarePen,
  ChevronDown,
  User,
  BadgeCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth, useFirestore } from "@/firebase";
import { collection, query, orderBy, limit, onSnapshot, Timestamp, doc, getDoc } from "firebase/firestore";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Logo } from "@/components/logo";

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
    { icon: Mic, title: "Voice Summary", desc: "Convert your story into a clear legal roadmap.", href: "/dashboard/narrate", color: "text-blue-500", bg: "bg-blue-500/5", glow: "shadow-blue-500/20" },
    { icon: FileSearch, title: "Document Scan", desc: "Identify risks and deadlines in your legal papers.", href: "/dashboard/document-intelligence", color: "text-indigo-500", bg: "bg-indigo-500/5", glow: "shadow-indigo-500/20" },
    { icon: FileText, title: "Write Drafts", desc: "Generate professional legal documents instantly.", href: "/dashboard/document-generator", color: "text-sky-500", bg: "bg-sky-500/5", glow: "shadow-sky-500/20" },
    { icon: BrainCircuit, title: "Strength Matrix", desc: "Calculate the probability of case success.", href: "/dashboard/strength-analyzer", color: "text-cyan-500", bg: "bg-cyan-500/5", glow: "shadow-cyan-500/20" },
];

const actionChips = [
    { label: "Draft a Notice", icon: FileSignature, href: "/dashboard/document-generator" },
    { label: "Explain BNS", icon: Gavel, href: "/dashboard/learn" },
    { label: "Check Success", icon: Scale, href: "/dashboard/strength-analyzer" },
    { label: "Scan FIR/PDF", icon: Search, href: "/dashboard/document-intelligence" },
    { label: "Bail Helper", icon: ShieldCheck, href: "/dashboard/bail-estimator" },
];

export default function DashboardHomePage() {
  const auth = useAuth();
  const firestore = useFirestore();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [chatInput, setChatInput] = useState("");
  const [userName, setUserName] = useState("Citizen");
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (auth.currentUser) {
        const userRef = doc(firestore, "users", auth.currentUser.uid);
        getDoc(userRef).then(doc => {
            if (doc.exists()) {
                setUserName(doc.data().firstName || "Citizen");
            }
        });
    }

    const postsCol = collection(firestore, "posts");
    const q = query(postsCol, orderBy("createdAt", "desc"), limit(4));
    
    const unsub = onSnapshot(q, (snap) => {
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as Post));
        setPosts(list);
        setLoading(false);
    }, () => setLoading(false));
    
    return () => unsub();
  }, [firestore, auth.currentUser]);

  const handleSendMessage = () => {
    if (!chatInput.trim() || isProcessing) return;
    
    const userMsg = chatInput.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput("");
    setIsProcessing(true);

    setTimeout(() => {
        setMessages(prev => [...prev, { 
            role: 'ai', 
            text: "I am analyzing your query against the latest BNS statutory registry. For a definitive forensic audit of this problem, I recommend utilizing the specialized 'Strength Matrix' or 'Voice Summary' terminals below." 
        }]);
        setIsProcessing(false);
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 py-8 px-4 sm:px-6 text-left font-body">
      
      {/* 1. GEMINI STYLE HERO SECTION */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto w-full flex flex-col items-center text-center space-y-10 py-12"
      >
        <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-3 mb-2">
                <Sparkles className="h-8 w-8 text-primary fill-primary/20 animate-pulse" />
                <h2 className="text-3xl font-medium text-foreground/60 tracking-tight">Hi {userName}</h2>
            </div>
            <h1 className="text-5xl sm:text-6xl font-medium tracking-tighter text-foreground leading-none">
                Where should we start?
            </h1>
        </div>

        <div className="w-full max-w-2xl bg-muted/20 backdrop-blur-xl rounded-[2.5rem] border border-primary/10 shadow-[0_30px_60px_rgba(0,0,0,0.05)] overflow-hidden transition-all hover:border-primary/20 hover:shadow-[0_30px_80px_rgba(0,0,0,0.08)]">
            <div className="p-6 pb-2 text-left">
                <span className="text-muted-foreground/40 font-medium text-sm ml-2">Ask Nyaya Sahayak</span>
            </div>
            <div className="px-4 pb-4 space-y-4">
                <div className="relative">
                    <Input 
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Consult your legal co-pilot..." 
                        className="h-14 bg-transparent border-none text-lg font-medium px-4 focus-visible:ring-0 shadow-none placeholder:text-muted-foreground/20"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-primary/5 text-muted-foreground">
                            <Plus className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" className="h-10 px-4 rounded-full gap-2 hover:bg-primary/5 text-muted-foreground font-bold text-[10px] uppercase tracking-widest">
                            <Layers className="h-4 w-4" /> Tools
                        </Button>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="h-10 px-4 rounded-full gap-2 hover:bg-primary/5 text-muted-foreground font-black text-[10px] uppercase tracking-widest hidden sm:flex">
                            Fast <ChevronDown className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-primary/5 text-muted-foreground">
                            <Mic className="h-5 w-5" />
                        </Button>
                        <Button 
                            onClick={handleSendMessage}
                            disabled={!chatInput.trim() || isProcessing}
                            className="h-10 w-10 rounded-full bg-primary text-white shadow-lg active:scale-90 transition-transform"
                        >
                            <ArrowRight className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3 max-w-2xl">
            {actionChips.map((chip, i) => (
                <motion.div
                    key={i}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Link href={chip.href}>
                        <Badge variant="outline" className="h-11 px-5 rounded-full bg-background/50 hover:bg-primary/5 hover:border-primary/30 cursor-pointer border-primary/5 font-bold text-[11px] text-muted-foreground hover:text-primary transition-all flex items-center gap-2.5 shadow-sm">
                            <chip.icon className="h-3.5 w-3.5" />
                            {chip.label}
                        </Badge>
                    </Link>
                </motion.div>
            ))}
        </div>
      </motion.section>

      {/* 2. CHAT MESSAGES DISPLAY */}
      <AnimatePresence>
        {messages.length > 0 && (
            <motion.section 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl mx-auto w-full space-y-6 pt-10 border-t border-primary/5"
            >
                {messages.map((m, i) => (
                    <div key={i} className={cn("flex gap-4 items-start", m.role === 'user' ? "flex-row-reverse" : "")}>
                        <div className={cn(
                            "h-8 w-8 rounded-full flex items-center justify-center shrink-0",
                            m.role === 'ai' ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                        )}>
                            {m.role === 'ai' ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                        </div>
                        <div className={cn(
                            "px-6 py-4 rounded-[1.5rem] text-sm font-medium leading-relaxed max-w-[80%]",
                            m.role === 'ai' ? "bg-muted/30 text-foreground" : "bg-primary text-white"
                        )}>
                            {m.text}
                        </div>
                    </div>
                ))}
                {isProcessing && (
                    <div className="flex gap-4 items-center pl-12 text-primary/40">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">Neural Ingress...</span>
                    </div>
                )}
            </motion.section>
        )}
      </AnimatePresence>

      {/* 3. CORE TOOLS GRID */}
      <section className="space-y-6 pt-10">
        <div className="flex items-center gap-3 px-1 text-left">
            <Zap className="h-4 w-4 text-primary" />
            <h2 className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-60">Forensic Terminals</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {tools.map((tool, i) => (
            <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + (i * 0.1) }}
                whileHover={{ y: -5 }}
                className="group"
            >
                <Link href={tool.href} className="block h-full">
                <Card className={cn(
                    "h-full border-primary/5 bg-card/40 backdrop-blur-sm transition-all duration-500 rounded-[2rem] overflow-hidden group-hover:border-primary/20",
                    "relative shadow-xl hover:shadow-2xl",
                    tool.glow
                )}>
                    <CardContent className="p-8 flex flex-col justify-between h-full relative z-10 text-left">
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
                        Initialize Node
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
        </div>
      </section>

      {/* 4. COMMUNITY FEED & SPARK BANNER */}
      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-8">
          <div className="flex items-center justify-between border-b border-primary/5 pb-4">
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Newspaper className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-black font-headline tracking-tighter uppercase">Community Transmissions</h2>
            </div>
            <Button variant="ghost" size="sm" asChild className="text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary/5">
              <Link href="/dashboard/research-analytics">
                View All <ChevronRight className="ml-1 h-3.5 w-3.5" />
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
                            <CardContent className="p-8 text-left">
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

        <div className="lg:col-span-4 space-y-10">
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
                    Unlock unlimited AI forensic scans, professional document drafting, and root access.
                </p>
              </div>
              <Button variant="secondary" className="w-full font-black uppercase tracking-widest text-[10px] rounded-2xl h-14 shadow-2xl active:scale-95 transition-all" asChild>
                <Link href="/dashboard/billing">Upgrade Node</Link>
              </Button>
            </CardContent>
          </Card>

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
                <span className="flex items-center gap-3 text-muted-foreground"><Clock className="h-4 w-4 text-blue-500" /> Network Latency</span>
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
