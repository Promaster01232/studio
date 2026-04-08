"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
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
  MessageCircle,
  Sparkles,
  Zap,
  Send,
  Bot,
  Layers,
  FileSearch,
  Scale,
  BadgeCheck,
  User,
  Library,
  Edit,
  FileCheck,
  Globe,
  Fingerprint
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth, useFirestore } from "@/firebase";
import { collection, query, orderBy, onSnapshot, Timestamp, doc, getDoc, limit } from "firebase/firestore";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Logo } from "@/components/logo";
import { getGeneralAiResponseAction } from "./chat-actions";
import { AudioAssistant } from "@/components/audio-assistant";

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
    { icon: Mic, title: "Voice summary", desc: "Convert your story into a clear legal roadmap.", href: "/dashboard/narrate", color: "text-blue-500", bg: "bg-blue-500/5", glow: "shadow-blue-500/20" },
    { icon: FileSearch, title: "Document scan", desc: "Identify risks and deadlines in your legal papers.", href: "/dashboard/document-intelligence", color: "text-indigo-500", bg: "bg-indigo-500/5", glow: "shadow-indigo-500/20" },
    { icon: FileText, title: "Write drafts", desc: "Generate professional legal documents instantly.", href: "/dashboard/document-generator", color: "text-sky-500", bg: "bg-sky-500/5", glow: "shadow-sky-500/20" },
    { icon: BrainCircuit, title: "Strength matrix", desc: "Calculate the probability of case success.", href: "/dashboard/strength-analyzer", color: "text-cyan-500", bg: "bg-cyan-500/5", glow: "shadow-cyan-500/20" },
];

const actionChips = [
    { label: "Draft a notice", icon: FileSignature, href: "/dashboard/document-generator" },
    { label: "Explain BNS", icon: Gavel, href: "/dashboard/learn" },
    { label: "Check success", icon: Scale, href: "/dashboard/strength-analyzer" },
    { label: "Scan FIR/PDF", icon: Search, href: "/dashboard/document-intelligence" },
];

export default function DashboardHomePage() {
  const auth = useAuth();
  const firestore = useFirestore();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [chatInput, setChatInput] = useState("");
  const [userName, setUserName] = useState("citizen");
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (auth.currentUser) {
        const userRef = doc(firestore, "users", auth.currentUser.uid);
        getDoc(userRef).then(doc => {
            if (doc.exists()) {
                setUserName(doc.data().firstName || "citizen");
            }
        });
    }

    const postsCol = collection(firestore, "posts");
    const q = query(postsCol, orderBy("createdAt", "desc"), limit(3));
    
    const unsub = onSnapshot(q, (snap) => {
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as Post));
        setPosts(list);
        setLoading(false);
    }, () => setLoading(false));
    
    return () => unsub();
  }, [firestore, auth.currentUser]);

  useEffect(() => {
    if (messages.length > 0 && scrollRef.current) {
        scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isProcessing) return;
    
    const userMsg = chatInput.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput("");
    setIsProcessing(true);

    const result = await getGeneralAiResponseAction(userMsg);
    
    setMessages(prev => [...prev, { 
        role: 'ai', 
        text: result.response 
    }]);
    setIsProcessing(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-16 py-8 px-4 sm:px-6 text-left font-body">
      
      <motion.section 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl mx-auto"
      >
        <Card className="border border-primary/5 bg-white dark:bg-zinc-950 shadow-soft rounded-[1.5rem] overflow-hidden group">
          <div className="p-8 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
            <div className="flex items-start gap-6">
              <div className="p-3.5 rounded-xl bg-sky-50 text-sky-500 dark:bg-sky-500/10 shadow-sm border border-sky-100 dark:border-sky-500/20">
                <Edit className="h-7 w-7" />
              </div>
              <div className="space-y-2 text-left">
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">Share your spark</h2>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                    What brilliant idea is on your mind today? Let the community know.
                  </p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-sky-500/60">Community transmission hub</p>
                </div>
              </div>
            </div>
            <Button asChild className="h-12 px-8 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs gap-3 shadow-lg shadow-sky-500/20 active:scale-95 transition-all shrink-0">
              <Link href="/dashboard/research-analytics/new">
                Share your spark <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Card>
      </motion.section>

      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto w-full flex flex-col items-center text-center space-y-8 py-6"
      >
        <div className="space-y-4">
            <div className="flex items-center justify-center gap-3 mb-2">
                <div className="p-2 rounded-full bg-primary/10">
                    <Sparkles className="h-6 w-6 text-primary fill-primary/20" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-medium text-foreground/60 tracking-tight">Hi {userName}</h2>
            </div>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tighter text-foreground leading-none">
                Where should we start?
            </h1>
        </div>

        <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-primary/10 shadow-[0_40px_100px_rgba(0,0,0,0.08)] overflow-hidden transition-all hover:border-primary/20 hover:shadow-[0_40px_120px_rgba(0,0,0,0.12)] relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
            
            <div className="p-6 pb-2 text-left relative z-10">
                <span className="text-[10px] font-black text-primary/40 ml-3 uppercase tracking-widest">Ask Nyaya Sahayak AI</span>
            </div>
            <div className="px-4 pb-4 space-y-4 relative z-10">
                <div className="relative">
                    <Input 
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Consult your legal co-pilot..." 
                        className="h-16 bg-transparent border-none text-lg font-bold px-6 focus-visible:ring-0 shadow-none placeholder:text-muted-foreground/20"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-primary/5 text-muted-foreground" silent>
                            <Plus className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" className="h-10 px-4 rounded-full gap-2 hover:bg-primary/5 text-muted-foreground font-black text-[10px]" silent>
                            <Layers className="h-4 w-4" /> Tools
                        </Button>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-primary/5 text-muted-foreground" silent>
                            <Mic className="h-5 w-5" />
                        </Button>
                        <Button 
                            onClick={handleSendMessage}
                            disabled={!chatInput.trim() || isProcessing}
                            className="h-12 w-12 rounded-2xl bg-primary text-white shadow-xl active:scale-90 transition-transform group"
                        >
                            <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
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
                        <Badge variant="outline" className="h-11 px-6 rounded-full bg-background/50 hover:bg-primary hover:text-white hover:border-primary border-primary/10 font-black text-[10px] transition-all flex items-center gap-2.5 shadow-sm uppercase tracking-tight">
                            <chip.icon className="h-3.5 w-3.5" />
                            {chip.label}
                        </Badge>
                    </Link>
                </motion.div>
            ))}
        </div>
      </motion.section>

      <AnimatePresence>
        {messages.length > 0 && (
            <motion.section 
                ref={scrollRef}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto w-full space-y-10 pt-10 border-t border-primary/5"
            >
                {messages.map((m, i) => (
                    <div key={i} className={cn("flex gap-6 items-start", m.role === 'user' ? "flex-row-reverse" : "flex-col")}>
                        {m.role === 'user' ? (
                            <>
                                <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border border-primary/10 bg-muted text-muted-foreground shadow-sm">
                                    <User className="h-5 w-5" />
                                </div>
                                <div className="px-6 py-4 rounded-[1.5rem] rounded-tr-none text-sm font-bold leading-relaxed max-w-[80%] shadow-lg bg-primary text-white">
                                    {m.text}
                                </div>
                            </>
                        ) : (
                            <Card className="w-full glass border-primary/20 shadow-3xl rounded-[2.5rem] overflow-hidden relative">
                                <div className="absolute inset-0 p-12 opacity-[0.02] pointer-events-none grayscale flex items-center justify-center">
                                    <Logo className="h-[400px] w-[400px] border-none p-0 shadow-none" priority={false} />
                                </div>
                                <CardHeader className="p-8 sm:p-10 bg-primary text-primary-foreground relative z-10 border-b border-white/10">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                                        <div className="space-y-4 text-left">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-white/10 backdrop-blur-md">
                                                    <FileCheck className="h-5 w-5 text-white" />
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Official forensic report</span>
                                            </div>
                                            <div className="space-y-1">
                                                <CardTitle className="text-xl sm:text-2xl font-black tracking-tight leading-none uppercase">Statutory guide summary</CardTitle>
                                                <div className="text-[10px] font-bold text-white/60 flex items-center gap-2">
                                                    <Globe className="h-3 w-3" /> Encrypted session active
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <AudioAssistant text={m.text} language="English" />
                                            <Badge variant="outline" className="border-white/20 text-white font-black text-[9px] uppercase tracking-widest h-9 px-4">Registry active</Badge>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-8 sm:p-12 relative z-10 text-left">
                                    <div className="prose dark:prose-invert max-w-none">
                                        <div className="whitespace-pre-line leading-loose text-sm sm:text-base font-medium text-foreground/90 selection:bg-primary/10">
                                            {m.text}
                                        </div>
                                    </div>
                                    <div className="mt-12 pt-10 border-t border-primary/5 flex flex-col sm:flex-row items-center justify-between gap-8 opacity-30">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 rounded-2xl bg-primary/5 text-primary">
                                                <ShieldCheck className="h-6 w-6" />
                                            </div>
                                            <div className="text-left">
                                                <p className="text-[10px] font-black uppercase tracking-widest">Statutory security</p>
                                                <p className="text-[9px] font-bold">This dossier is protected under attorney-client transience protocols.</p>
                                            </div>
                                        </div>
                                        <p className="text-[9px] font-black uppercase tracking-[0.5em]">NYAYASAHAYAK.IN // REPORT TERMINAL</p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                ))}
                {isProcessing && (
                    <div className="flex gap-4 items-center pl-4 text-primary/40">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span className="text-[10px] font-black animate-pulse uppercase tracking-[0.3em]">Deconstructing statutory matrix...</span>
                    </div>
                )}
            </motion.section>
        )}
      </AnimatePresence>

      <section className="space-y-8">
        <div className="flex items-center justify-between border-b border-primary/5 pb-4">
            <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                    <Newspaper className="h-6 w-6" />
                </div>
                <div className="text-left">
                    <h2 className="text-2xl font-black font-headline tracking-tighter leading-none uppercase">Community transmissions</h2>
                    <p className="text-[10px] font-bold text-muted-foreground mt-1 uppercase tracking-widest">Live statutory ideas from verified citizen records.</p>
                </div>
            </div>
            <Button variant="ghost" size="sm" asChild className="h-10 px-6 text-[10px] font-black rounded-xl hover:bg-primary/5 border border-primary/5 uppercase tracking-widest">
              <Link href="/dashboard/research-analytics">
                View all transmissions <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
                {loading ? (
                    <div className="col-span-full py-20 flex flex-col items-center justify-center gap-4">
                        <Loader2 className="h-10 w-10 animate-spin text-primary opacity-20" />
                        <p className="text-[10px] font-black text-muted-foreground animate-pulse uppercase tracking-widest">Syncing transmissions...</p>
                    </div>
                ) : posts.map((post, idx) => (
                    <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                    >
                        <Link href={`/dashboard/research-analytics`} className="block group h-full">
                            <Card className="h-full border-primary/10 hover:border-primary/30 transition-all duration-500 rounded-[2rem] bg-card/40 backdrop-blur-sm shadow-soft hover:shadow-2xl overflow-hidden relative flex flex-col">
                                <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-primary/20 group-hover:bg-primary transition-all" />
                                <CardHeader className="p-8 pb-4 text-left">
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9 rounded-xl border border-primary/10 shadow-sm">
                                                {post.authorAvatar && <AvatarImage src={post.authorAvatar} />}
                                                <AvatarFallback className="text-[10px] font-black bg-primary/5 text-primary">{post.isAnonymous ? 'A' : post.authorName.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div className="text-left">
                                                <p className="text-xs font-black tracking-tight">{post.isAnonymous ? 'Identity masked' : post.authorName}</p>
                                                <p className="text-[9px] text-muted-foreground font-black opacity-40 uppercase tracking-tight">{post.createdAt ? formatDistanceToNow(post.createdAt.toDate(), { addSuffix: true }) : 'Just now'}</p>
                                            </div>
                                        </div>
                                        <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/10 text-[8px] font-black px-3 py-1 rounded-full uppercase">
                                            {post.postType || 'Idea'}
                                        </Badge>
                                    </div>
                                    <h3 className="text-lg font-black tracking-tight group-hover:text-primary transition-colors leading-tight line-clamp-2 uppercase">{post.title}</h3>
                                </CardHeader>
                                <CardContent className="p-8 pt-0 flex-1 text-left">
                                    <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed font-medium">
                                        {post.content}
                                    </p>
                                </CardContent>
                                <CardFooter className="p-8 pt-0 flex items-center gap-6">
                                    <div className="flex items-center gap-2 text-red-500/60 font-black text-[10px] uppercase">
                                        <Heart className="h-4 w-4 fill-current" /> {post.likes}
                                    </div>
                                    <div className="flex items-center gap-2 text-primary/60 font-black text-[10px] uppercase">
                                        <MessageCircle className="h-4 w-4" /> Discussion
                                    </div>
                                </CardFooter>
                            </Card>
                        </Link>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
      </section>

      <section className="space-y-8">
        <div className="flex items-center gap-3 px-1 text-left">
            <div className="p-2 rounded-lg bg-blue-500/10">
                <Zap className="h-5 w-5 text-blue-500" />
            </div>
            <h2 className="text-xl font-black text-foreground font-headline uppercase">Forensic terminals</h2>
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
                    "h-full border-primary/5 bg-card/40 backdrop-blur-sm transition-all duration-500 rounded-[2.5rem] overflow-hidden group-hover:border-primary/20",
                    "relative shadow-soft hover:shadow-2xl",
                    tool.glow
                )}>
                    <CardContent className="p-8 flex flex-col justify-between h-full relative z-10 text-left">
                    <div className={cn("p-4 rounded-2xl w-fit mb-8 shadow-inner transition-transform duration-500 group-hover:scale-110", tool.bg, tool.color)}>
                        <tool.icon className="h-7 w-7" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-black tracking-tight leading-none uppercase">{tool.title}</h3>
                        <p className="text-[11px] text-muted-foreground font-medium leading-relaxed line-clamp-2">
                            {tool.desc}
                        </p>
                    </div>
                    <div className="mt-10 flex items-center justify-between">
                        <div className="flex items-center text-[10px] font-black text-primary/60 group-hover:text-primary transition-colors uppercase tracking-widest">
                        Initialize tool
                        </div>
                        <div className="h-10 w-10 rounded-2xl bg-primary/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                            <ArrowRight className="h-5 w-5" />
                        </div>
                    </div>
                    </CardContent>
                </Card>
                </Link>
            </motion.div>
            ))}
        </div>
      </section>

      <div className="grid lg:grid-cols-12 gap-8 pt-10">
        <div className="lg:col-span-8">
            <Card className="bg-primary text-primary-foreground rounded-[3rem] overflow-hidden border-none shadow-3xl shadow-primary/20 group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="absolute top-0 right-0 p-8 opacity-[0.05] pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                    <Logo className="h-40 w-40 border-none shadow-none grayscale" />
                </div>
                <CardContent className="p-10 sm:p-16 flex flex-col md:flex-row items-center gap-12 relative z-10 text-center md:text-left">
                    <div className="space-y-6 flex-1">
                        <div className="space-y-3">
                            <div className="flex items-center justify-center md:justify-start gap-2">
                                <Zap className="h-5 w-5 text-amber-400 fill-amber-400" />
                                <span className="text-[10px] font-black opacity-60 uppercase tracking-widest">Statutory expansion</span>
                            </div>
                            <h3 className="text-3xl sm:text-5xl font-black font-headline tracking-tighter leading-[0.9] uppercase">Elevate your authority.</h3>
                            <p className="text-sm sm:text-lg opacity-80 font-medium leading-relaxed max-w-lg">
                                Unlock unlimited AI forensic scans, professional document drafting, and root access to the legal registry.
                            </p>
                        </div>
                        <Button variant="secondary" className="w-full md:w-auto font-black text-[10px] rounded-2xl h-14 px-12 shadow-2xl active:scale-95 transition-all uppercase tracking-widest" asChild>
                            <Link href="/dashboard/billing">Upgrade registry clearance</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>

        <div className="lg:col-span-4">
            <Card className="border-primary/5 bg-card/40 backdrop-blur-sm rounded-[3rem] shadow-soft overflow-hidden h-full flex flex-col group hover:border-primary/20 transition-all duration-500">
                <CardHeader className="p-8 pb-4 border-b border-primary/5 bg-primary/5 text-left">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                            <Library className="h-5 w-5" />
                        </div>
                        <CardTitle className="text-xs font-black text-foreground uppercase tracking-tight">Quick guides</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="p-6 space-y-2 flex-1 flex flex-col justify-center text-left">
                    {[
                        { label: "Fundamental rights", href: "/dashboard/learn/fundamental-rights", icon: Scale },
                        { label: "Criminal jurisprudence", href: "/dashboard/learn/criminal-law-jurisprudence", icon: Gavel },
                        { label: "Filing an FIR", href: "/dashboard/police-guide/fir-complaints", icon: ShieldCheck },
                        { label: "Arrest & bail rights", href: "/dashboard/police-guide/arrest-bail-process", icon: FileText },
                    ].map((item, i) => (
                        <Link key={i} href={item.href} className="flex items-center justify-between p-3 rounded-2xl hover:bg-primary/5 transition-all group/item border border-transparent hover:border-primary/10">
                            <div className="flex items-center gap-3">
                                <item.icon className="h-4 w-4 text-primary/60 group-hover/item:text-primary transition-colors" />
                                <span className="text-[11px] font-bold text-muted-foreground group-hover/item:text-foreground transition-colors uppercase tracking-tight">{item.label}</span>
                            </div>
                            <ChevronRight className="h-3 w-3 text-muted-foreground/30 group-hover/item:text-primary group-hover/item:translate-x-1 transition-all" />
                        </Link>
                    ))}
                </CardContent>
                <div className="p-6 bg-primary/5 border-t border-primary/5 text-center">
                    <Button variant="link" asChild className="h-auto p-0 text-[10px] font-black uppercase tracking-widest text-primary/60 hover:text-primary">
                        <Link href="/dashboard/learn">Explore full library</Link>
                    </Button>
                </div>
            </Card>
        </div>
      </div>

      <div className="pt-12 border-t border-primary/5 flex flex-col sm:flex-row items-center justify-between gap-8 opacity-20 text-center sm:text-left">
        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">nyayasahayak.in // Terminal hub // 2025</p>
        <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                <span className="text-[9px] font-black uppercase tracking-widest">Secured system</span>
            </div>
            <div className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                <span className="text-[9px] font-black uppercase tracking-widest">Live terminal ingress</span>
            </div>
        </div>
      </div>
    </div>
  );
}
