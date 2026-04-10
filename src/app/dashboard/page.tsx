"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
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
  Fingerprint,
  Trash2,
  MoreVertical,
  Share2,
  Twitter,
  Bookmark,
  Flag
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth, useFirestore } from "@/firebase";
import { collection, query, orderBy, onSnapshot, Timestamp, doc, getDoc, limit, deleteDoc, updateDoc, increment, arrayUnion, arrayRemove } from "firebase/firestore";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Logo } from "@/components/logo";
import { getGeneralAiResponseAction } from "./chat-actions";
import { AudioAssistant } from "@/components/audio-assistant";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ADMIN_EMAILS = [
  'enterspaceindia@gmail.com', 
  'piyushkumrsingh23399@gmail.com',
  'nyayasahayakhelp@gmail.com'
];

interface Post {
    id: string;
    authorUid: string;
    authorName: string;
    authorAvatar?: string;
    createdAt: Timestamp;
    title: string;
    content: string;
    likes: number;
    likedBy?: string[];
    postType?: 'Idea' | 'Question' | 'Suggestion' | 'Poll' | 'News';
    isAnonymous?: boolean;
}

const typeConfig: Record<string, { color: string, bg: string, border: string, icon: any, gradient: string, glow: string }> = {
    'Idea': { color: 'text-amber-600', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: Sparkles, gradient: 'from-amber-500/5', glow: 'shadow-amber-500/10' },
    'Question': { color: 'text-blue-600', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: Bot, gradient: 'from-blue-500/5', glow: 'shadow-blue-500/10' },
    'Suggestion': { color: 'text-emerald-600', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: Zap, gradient: 'from-emerald-500/5', glow: 'shadow-emerald-500/10' },
    'Poll': { color: 'text-purple-600', bg: 'bg-purple-500/10', border: 'border-purple-500/20', icon: Layers, gradient: 'from-purple-500/5', glow: 'shadow-purple-500/10' },
    'News': { color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20', icon: Newspaper, gradient: 'from-primary/5', glow: 'shadow-primary/10' },
};

const tools = [
    { icon: Mic, title: "Voice summary", desc: "Convert your story into a clear legal roadmap.", href: "/dashboard/narrate", color: "text-blue-500", bg: "bg-blue-500/5", glow: "shadow-blue-500/20" },
    { icon: FileSearch, title: "Document scan", desc: "Identify risks and deadlines in your legal papers.", href: "/dashboard/document-intelligence", color: "text-indigo-500", bg: "bg-indigo-500/5", glow: "shadow-indigo-500/20" },
    { icon: FileText, title: "Write drafts", desc: "Generate professional legal documents instantly.", href: "/dashboard/document-generator", color: "text-sky-500", bg: "bg-sky-500/5", glow: "shadow-sky-500/20" },
    { icon: BrainCircuit, title: "Strength matrix", desc: "Calculate the probability of case success.", href: "/dashboard/strength-analyzer", color: "text-cyan-500", bg: "bg-cyan-500/5", glow: "shadow-cyan-500/20" },
];

const actionChips = [
    { label: "Draft a notice", icon: FileSignature, href: "/dashboard/document-generator" },
    { label: "Explain laws", icon: Gavel, href: "/dashboard/learn" },
    { label: "Check success", icon: Scale, href: "/dashboard/strength-analyzer" },
    { label: "Scan papers", icon: Search, href: "/dashboard/document-intelligence" },
];

export default function DashboardHomePage() {
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();
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

  const handleDeletePost = async (postId: string) => {
      if (!confirm("Confirm record purge? This action will permanently erase this record.")) return;
      try {
          await deleteDoc(doc(firestore, "posts", postId));
          toast({ title: "Transmission purged" });
      } catch (e) {
          toast({ variant: "destructive", title: "Access denied" });
      }
  };

  const handleLikePost = async (post: Post) => {
      if (!auth.currentUser) return;
      const userHasLiked = post.likedBy?.includes(auth.currentUser.uid);
      const postRef = doc(firestore, "posts", post.id);
      try {
          await updateDoc(postRef, {
              likes: increment(userHasLiked ? -1 : 1),
              likedBy: userHasLiked ? arrayRemove(auth.currentUser.uid) : arrayUnion(auth.currentUser.uid)
          });
      } catch (e) {}
  };

  const handleShare = (post: Post, platform: 'whatsapp' | 'twitter' | 'copy') => {
    const shareText = `Check out this institutional transmission on Nyaya Sahayak: "${post.title}"\n\nRead more at: ${window.location.origin}/dashboard/research-analytics`;
    
    if (platform === 'whatsapp') {
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
    } else if (platform === 'twitter') {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank');
    } else if (platform === 'copy') {
        navigator.clipboard.writeText(shareText);
        toast({ title: "Link copied" });
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 py-8 px-4 sm:px-6 text-left font-body">
      
      <motion.section 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full"
      >
        <Card className="border border-primary/5 bg-white dark:bg-zinc-950 shadow-soft rounded-[2.5rem] overflow-hidden group transition-all hover:shadow-lg">
          <div className="p-6 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 text-left">
            <div className="flex items-start gap-6">
              <div className="p-3.5 rounded-xl bg-sky-50 text-sky-500 dark:bg-sky-500/10 shadow-sm border border-sky-100 dark:border-sky-500/20">
                <Edit className="h-7 w-7" />
              </div>
              <div className="space-y-1 text-left">
                <h2 className="text-xl sm:text-2xl font-black tracking-tighter text-foreground">Share your spark</h2>
                <p className="text-sm text-muted-foreground font-medium leading-relaxed max-w-md">
                  Disseminate your institutional ideas or legal queries to the community.
                </p>
              </div>
            </div>
            <Button asChild className="h-12 px-8 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs gap-3 shadow-lg shadow-sky-500/20 active:scale-95 transition-all shrink-0">
              <Link href="/dashboard/research-analytics/new">
                Initialize post <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Card>
      </motion.section>

      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full flex flex-col items-center text-center space-y-10"
      >
        <div className="space-y-4">
            <div className="flex items-center justify-center gap-3">
                <div className="p-2 rounded-full bg-primary/10">
                    <Sparkles className="h-5 w-5 text-primary fill-primary/20" />
                </div>
                <h2 className="text-xl sm:text-2xl font-medium text-foreground/60 tracking-tight text-center">Hi {userName}</h2>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tighter text-foreground leading-tight text-center">
                How can I assist your research today?
            </h1>
        </div>

        <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-primary/10 shadow-[0_40px_100px_rgba(0,0,0,0.08)] overflow-hidden transition-all hover:border-primary/20 hover:shadow-[0_40px_120px_rgba(0,0,0,0.12)] relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
            
            <div className="p-6 pb-2 text-left relative z-10">
                <span className="text-[10px] font-black text-primary/40 ml-3">Consult assistant</span>
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
                        <Badge variant="outline" className="h-11 px-6 rounded-full bg-background/50 hover:bg-primary hover:text-white hover:border-primary border-primary/10 font-black text-[10px] transition-all flex items-center gap-2.5 shadow-sm tracking-tight">
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
                className="w-full max-w-4xl mx-auto space-y-10"
            >
                {messages.map((m, i) => (
                    <div key={i} className={cn("flex gap-6 items-start", m.role === 'user' ? "flex-row-reverse" : "flex-col")}>
                        {m.role === 'user' ? (
                            <>
                                <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border border-primary/10 bg-muted text-muted-foreground shadow-sm">
                                    <User className="h-5 w-5" />
                                </div>
                                <div className="px-6 py-4 rounded-[1.5rem] rounded-tr-none text-sm font-bold leading-relaxed max-w-[80%] shadow-lg bg-primary text-white text-left">
                                    {m.text}
                                </div>
                            </>
                        ) : (
                            <Card className="w-full glass border-primary/20 shadow-3xl rounded-[2.5rem] overflow-hidden relative">
                                <div className="absolute inset-0 p-12 opacity-[0.02] pointer-events-none grayscale flex items-center justify-center">
                                    <Logo className="h-[400px] w-[400px] border-none p-0 shadow-none" priority={false} />
                                </div>
                                <CardHeader className="p-8 sm:p-10 bg-primary text-primary-foreground relative z-10 border-b border-white/10 text-left">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                                        <div className="space-y-4 text-left">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-white/10 backdrop-blur-md">
                                                    <FileCheck className="h-5 w-5 text-white" />
                                                </div>
                                                <span className="text-[10px] font-black">AI report</span>
                                            </div>
                                            <div className="space-y-1 text-left">
                                                <CardTitle className="text-xl sm:text-2xl font-black tracking-tighter leading-none">Your report is ready</CardTitle>
                                                <div className="text-[10px] font-bold text-white/60 flex items-center gap-2">
                                                    <Globe className="h-3 w-3" /> Your data is protected
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <AudioAssistant text={m.text} language="English" />
                                            <Badge variant="outline" className="border-white/20 text-white font-black text-[9px] h-9 px-4">Registry active</Badge>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-8 sm:p-12 relative z-10 text-left">
                                    <div className="prose dark:prose-invert max-w-none text-left">
                                        <div className="whitespace-pre-line leading-loose text-sm sm:text-base font-medium text-foreground/90 selection:bg-primary/10">
                                            {m.text}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                ))}
                {isProcessing && (
                    <div className="flex gap-4 items-center pl-4 text-primary/40">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        <span className="text-[10px] font-black animate-pulse">Running analysis...</span>
                    </div>
                )}
            </motion.section>
        )}
      </AnimatePresence>

      <section className="space-y-8">
        <div className="flex items-center justify-between border-b-4 border-foreground pb-4 mb-10 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 border-2 border-foreground rounded-2xl bg-foreground/5 shadow-sm">
                    <Newspaper className="h-6 w-6 text-primary" />
                </div>
                <div className="text-left">
                    <h2 className="text-2xl sm:text-4xl font-black font-headline tracking-tighter leading-none uppercase">Transmissions</h2>
                </div>
            </div>
            <Button variant="outline" size="sm" asChild className="h-10 px-6 text-[10px] font-black rounded-full hover:bg-foreground hover:text-background transition-all border-foreground/20 uppercase tracking-widest">
              <Link href="/dashboard/research-analytics">
                View stream <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
                {loading ? (
                    <div className="col-span-full py-20 flex flex-col items-center justify-center gap-4">
                        <Loader2 className="h-10 w-10 animate-spin text-primary opacity-20" />
                        <p className="text-[10px] font-black text-muted-foreground animate-pulse">Syncing registry...</p>
                    </div>
                ) : posts.map((post, idx) => {
                    const isAuthor = post.authorUid === auth.currentUser?.uid;
                    const isAdmin = auth.currentUser?.email && ADMIN_EMAILS.includes(auth.currentUser.email.toLowerCase());
                    const canDelete = isAuthor || isAdmin;
                    const userHasLiked = post.likedBy?.includes(auth.currentUser?.uid ?? '');
                    const config = typeConfig[post.postType || 'Idea'] || typeConfig['Idea'];

                    return (
                        <motion.div
                            key={post.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <Card className={cn(
                                "h-full border-primary/10 hover:border-primary/30 transition-all duration-500 rounded-[2.5rem] bg-card/40 backdrop-blur-sm shadow-soft hover:shadow-2xl overflow-hidden relative flex flex-col group",
                                config.glow
                            )}>
                                <div className={cn("absolute top-0 left-0 bottom-0 w-1.5 transition-all", config.bg.replace('bg-', 'bg-').replace('/10', ''))} />
                                <CardHeader className="p-8 pb-4 text-left ml-1.5">
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10 rounded-xl border border-primary/10 shadow-sm">
                                                {!post.isAnonymous && post.authorAvatar && <AvatarImage src={post.authorAvatar} className="object-cover" />}
                                                <AvatarFallback className="text-xs font-black bg-primary/10 text-primary">
                                                    {post.isAnonymous ? 'A' : post.authorName.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="text-left">
                                                <p className="text-xs font-black tracking-tight">{post.isAnonymous ? 'Identity masked' : post.authorName}</p>
                                                <p className="text-[9px] text-muted-foreground font-black opacity-40 uppercase tracking-tight">
                                                    {post.createdAt ? formatDistanceToNow(post.createdAt.toDate(), { addSuffix: true }) : 'Just now'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="secondary" className={cn("bg-primary/5 text-primary border-primary/10 text-[8px] font-black px-3 py-1 rounded-full uppercase", config.bg, config.color)}>
                                                {post.postType || 'Idea'}
                                            </Badge>
                                            
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:bg-primary/5">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48 p-2 rounded-xl glass border-primary/10 shadow-2xl">
                                                    {canDelete && (
                                                        <DropdownMenuItem 
                                                            onClick={() => handleDeletePost(post.id)}
                                                            className="rounded-lg font-bold text-[10px] h-10 px-3 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10 gap-3 uppercase"
                                                        >
                                                            <Trash2 className="h-4 w-4" /> Purge node
                                                        </DropdownMenuItem>
                                                    )}
                                                    <DropdownMenuItem className="rounded-lg font-bold text-[10px] h-10 px-3 cursor-pointer gap-3 uppercase">
                                                        <Flag className="h-4 w-4" /> Report breach
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                    <h3 className="text-xl sm:text-2xl font-black tracking-tight group-hover:text-primary transition-colors leading-tight line-clamp-2">{post.title}</h3>
                                </CardHeader>
                                <CardContent className="p-8 pt-0 flex-1 text-left ml-1.5">
                                    <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed font-medium">
                                        {post.content}
                                    </p>
                                </CardContent>
                                <CardFooter className="p-8 pt-4 border-t border-primary/5 flex items-center justify-between ml-1.5">
                                    <div className="flex items-center gap-4">
                                        <button 
                                            onClick={() => handleLikePost(post)}
                                            className={cn(
                                                "flex items-center gap-2 text-[10px] font-black transition-all active:scale-95",
                                                userHasLiked ? "text-red-500" : "text-muted-foreground hover:text-red-500"
                                            )}
                                        >
                                            <Heart className={cn("h-4 w-4", userHasLiked && "fill-current")} /> {post.likes}
                                        </button>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-primary/5 text-muted-foreground">
                                                <Share2 className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-48 p-2 rounded-xl glass border-primary/10 shadow-2xl">
                                            <DropdownMenuItem onClick={() => handleShare(post, 'whatsapp')} className="rounded-lg font-bold text-xs h-10 px-3 cursor-pointer gap-3 text-left">
                                                <div className="bg-green-500/10 p-1.5 rounded-md text-green-600">
                                                    <MessageCircle className="h-3.5 w-3.5" />
                                                </div>
                                                WhatsApp
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleShare(post, 'twitter')} className="rounded-lg font-bold text-xs h-10 px-3 cursor-pointer gap-3 text-left">
                                                <div className="bg-blue-500/10 p-1.5 rounded-md text-blue-500">
                                                    <Twitter className="h-3.5 w-3.5" />
                                                </div>
                                                Twitter (X)
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleShare(post, 'copy')} className="rounded-lg font-bold text-xs h-10 px-3 cursor-pointer gap-3 text-left">
                                                <div className="p-1.5 rounded-md bg-primary/10 text-primary">
                                                    <Bookmark className="h-3.5 w-3.5" />
                                                </div>
                                                Copy link
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
      </section>

      <section className="space-y-8">
        <div className="flex items-center justify-between border-b-4 border-foreground pb-4 mb-10 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 border-2 border-foreground rounded-2xl bg-foreground/5 shadow-sm">
                    <Zap className="h-6 w-6 text-primary" />
                </div>
                <div className="text-left">
                    <h2 className="text-2xl sm:text-4xl font-black font-headline tracking-tighter leading-none uppercase">Forensic terminals</h2>
                </div>
            </div>
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
                    "h-full border-primary/5 bg-card/40 backdrop-blur-sm transition-all duration-500 rounded-[2.2rem] overflow-hidden group-hover:border-primary/20",
                    "relative shadow-soft hover:shadow-2xl",
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
            <Card className="bg-primary text-primary-foreground rounded-[2.5rem] overflow-hidden border-none shadow-3xl shadow-primary/20 group relative h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="absolute top-0 right-0 p-8 opacity-[0.05] pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                    <Logo className="h-40 w-40 border-none shadow-none grayscale" priority={false} />
                </div>
                <CardContent className="p-10 sm:p-16 flex flex-col md:flex-row items-center gap-12 relative z-10 text-center md:text-left h-full">
                    <div className="space-y-6 flex-1 text-left">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <Zap className="h-5 w-5 text-amber-400 fill-amber-400" />
                                <span className="text-[10px] font-black opacity-60 uppercase tracking-widest">Registry upgrade</span>
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
            <Card className="border-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] shadow-soft overflow-hidden h-full flex flex-col group hover:border-primary/20 transition-all duration-500">
                <CardHeader className="p-8 pb-4 border-b border-primary/5 bg-primary/5 text-left">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                            <Library className="h-5 w-5" />
                        </div>
                        <CardTitle className="text-[10px] font-black text-foreground uppercase tracking-widest">Quick guides</CardTitle>
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
                                <span className="text-[11px] font-bold text-muted-foreground group-hover:item:text-foreground transition-colors tracking-tight">{item.label}</span>
                            </div>
                            <ChevronRight className="h-3 w-3 text-muted-foreground/30 group-hover:item:text-primary group-hover:item:translate-x-1 transition-all" />
                        </Link>
                    ))}
                </CardContent>
                <div className="p-6 bg-primary/5 border-t border-primary/5 text-center">
                    <Button variant="link" asChild className="h-auto p-0 text-[10px] font-black text-primary/60 hover:text-primary uppercase tracking-widest">
                        <Link href="/dashboard/learn">Explore full library</Link>
                    </Button>
                </div>
            </Card>
        </div>
      </div>
    </div>
  );
}