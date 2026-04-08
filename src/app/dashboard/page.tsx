
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
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
  BadgeCheck,
  PlusCircle
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

  const handleSendMessage = () => {
    if (!chatInput.trim() || isProcessing) return;
    
    const userMsg = chatInput.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput("");
    setIsProcessing(true);

    setTimeout(() => {
        setMessages(prev => [...prev, { 
            role: 'ai', 
            text: "I am analyzing your query against the latest BNS statutory registry. For a definitive forensic audit, I recommend using the specialized terminals below." 
        }]);
        setIsProcessing(false);
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-16 py-8 px-4 sm:px-6 text-left font-body">
      
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto w-full flex flex-col items-center text-center space-y-8 py-12"
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
                <span className="text-[10px] font-black text-primary/40 ml-3">Nyaya Sahayak AI hub</span>
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
                        <Badge variant="outline" className="h-11 px-6 rounded-full bg-background/50 hover:bg-primary hover:text-white hover:border-primary cursor-pointer border-primary/10 font-black text-[10px] transition-all flex items-center gap-2.5 shadow-sm">
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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl mx-auto w-full space-y-6 pt-10 border-t border-primary/5"
            >
                {messages.map((m, i) => (
                    <div key={i} className={cn("flex gap-4 items-start", m.role === 'user' ? "flex-row-reverse" : "")}>
                        <div className={cn(
                            "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border border-primary/10",
                            m.role === 'ai' ? "bg-primary/5 text-primary" : "bg-muted text-muted-foreground"
                        )}>
                            {m.role === 'ai' ? <Logo className="h-6 w-6 border-none p-0 shadow-none" priority={false} /> : <User className="h-5 w-5" />}
                        </div>
                        <div className={cn(
                            "px-6 py-4 rounded-[1.5rem] text-sm font-bold leading-relaxed max-w-[80%] shadow-sm",
                            m.role === 'ai' ? "bg-muted/30 text-foreground" : "bg-primary text-white"
                        )}>
                            {m.text}
                        </div>
                    </div>
                ))}
                {isProcessing && (
                    <div className="flex gap-4 items-center pl-14 text-primary/40">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-[10px] font-black animate-pulse">Neural ingress...</span>
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
                    <h2 className="text-2xl font-black font-headline tracking-tighter leading-none">Community transmissions</h2>
                    <p className="text-[10px] font-bold text-muted-foreground mt-1">Live statutory ideas from verified citizen nodes.</p>
                </div>
            </div>
            <Button variant="ghost" size="sm" asChild className="h-10 px-6 text-[10px] font-black rounded-xl hover:bg-primary/5 border border-primary/5">
              <Link href="/dashboard/research-analytics">
                View all records <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
                {loading ? (
                    <div className="col-span-full py-20 flex flex-col items-center justify-center gap-4">
                        <Loader2 className="h-10 w-10 animate-spin text-primary opacity-20" />
                        <p className="text-[10px] font-black text-muted-foreground animate-pulse">Syncing registry nodes...</p>
                    </div>
                ) : posts.map((post, idx) => (
                    <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                    >
                        <Link href={`/dashboard/research-analytics`} className="block group h-full">
                            <Card className="h-full border-primary/10 hover:border-primary/30 transition-all duration-500 rounded-[2.5rem] bg-card/40 backdrop-blur-sm shadow-lg hover:shadow-2xl overflow-hidden relative flex flex-col">
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
                                                <p className="text-[9px] text-muted-foreground font-black opacity-40">{post.createdAt ? formatDistanceToNow(post.createdAt.toDate(), { addSuffix: true }) : 'Just now'}</p>
                                            </div>
                                        </div>
                                        <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/10 text-[8px] font-black px-3 py-1 rounded-full">
                                            {post.postType || 'Node'}
                                        </Badge>
                                    </div>
                                    <h3 className="text-lg font-black tracking-tight group-hover:text-primary transition-colors leading-tight line-clamp-2">{post.title}</h3>
                                </CardHeader>
                                <CardContent className="p-8 pt-0 flex-1 text-left">
                                    <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed font-medium">
                                        {post.content}
                                    </p>
                                </CardContent>
                                <CardFooter className="p-8 pt-0 flex items-center gap-6">
                                    <div className="flex items-center gap-2 text-red-500/60 font-black text-[10px]">
                                        <Heart className="h-4 w-4 fill-current" /> {post.likes}
                                    </div>
                                    <div className="flex items-center gap-2 text-primary/60 font-black text-[10px]">
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
            <h2 className="text-xl font-black text-foreground font-headline">Forensic terminals</h2>
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
                    "relative shadow-xl hover:shadow-2xl",
                    tool.glow
                )}>
                    <CardContent className="p-8 flex flex-col justify-between h-full relative z-10 text-left">
                    <div className={cn("p-4 rounded-2xl w-fit mb-8 shadow-inner transition-transform duration-500 group-hover:scale-110", tool.bg, tool.color)}>
                        <tool.icon className="h-7 w-7" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-black tracking-tight leading-none">{tool.title}</h3>
                        <p className="text-[11px] text-muted-foreground font-medium leading-relaxed line-clamp-2">
                            {tool.desc}
                        </p>
                    </div>
                    <div className="mt-10 flex items-center justify-between">
                        <div className="flex items-center text-[10px] font-black text-primary/60 group-hover:text-primary transition-colors">
                        Initialize node
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
                                <span className="text-[10px] font-black opacity-60">Statutory expansion</span>
                            </div>
                            <h3 className="text-3xl sm:text-5xl font-black font-headline tracking-tighter leading-[0.9]">Elevate your authority.</h3>
                            <p className="text-sm sm:text-lg opacity-80 font-medium leading-relaxed max-w-lg">
                                Unlock unlimited AI forensic scans, professional document drafting, and root access to the legal registry.
                            </p>
                        </div>
                        <Button variant="secondary" className="w-full md:w-auto font-black text-[10px] rounded-2xl h-14 px-12 shadow-2xl active:scale-95 transition-all" asChild>
                            <Link href="/dashboard/billing">Upgrade registry node</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>

        <div className="lg:col-span-4">
            <Card className="border-primary/5 bg-muted/20 rounded-[3rem] shadow-sm overflow-hidden h-full flex flex-col">
                <CardHeader className="p-8 pb-4 border-b border-primary/5 bg-primary/5 text-left">
                    <div className="flex items-center gap-3">
                        <ShieldCheck className="h-5 w-5 text-primary" />
                        <CardTitle className="text-[10px] font-black text-muted-foreground">Neural matrix status</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="p-8 space-y-8 text-left flex-1 flex flex-col justify-center">
                    <div className="flex justify-between items-center text-[10px] font-black">
                        <span className="flex items-center gap-3 text-muted-foreground"><Activity className="h-4 w-4 text-green-500" /> AI core node</span>
                        <span className="text-green-500">Synchronized</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-black">
                        <span className="flex items-center gap-3 text-muted-foreground"><Clock className="h-4 w-4 text-blue-500" /> Global latency</span>
                        <span className="text-foreground">42ms Optimal</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-black">
                        <span className="flex items-center gap-3 text-muted-foreground"><ShieldCheck className="h-4 w-4 text-indigo-500" /> Statutory guard</span>
                        <span className="text-foreground">AES-256 Active</span>
                    </div>
                </CardContent>
                <div className="p-6 bg-primary/5 border-t border-primary/5 text-center">
                    <p className="text-[8px] font-black text-primary/40">Registry validated // Network optimized</p>
                </div>
            </Card>
        </div>
      </div>

      <div className="pt-12 border-t border-primary/5 flex flex-col sm:flex-row items-center justify-between gap-8 opacity-20 text-center sm:text-left">
        <p className="text-[9px] font-black text-muted-foreground">nyayasahayak.in // Terminal hub // 2025</p>
        <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                <span className="text-[9px] font-black">Secured</span>
            </div>
            <div className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                <span className="text-[9px] font-black">Live node</span>
            </div>
        </div>
      </div>
    </div>
  );
}
