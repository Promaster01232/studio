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
  History as HistoryIcon,
  Upload,
  User,
  Plus,
  Loader2,
  Activity,
  Heart,
  Layers,
  Bot,
  Newspaper,
  ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth, useFirestore } from "@/firebase";
import { collection, query, orderBy, onSnapshot, Timestamp, doc, updateDoc, increment, arrayUnion, arrayRemove, limit } from "firebase/firestore";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getGeneralAiResponseAction } from "./chat-actions";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Logo } from "@/components/logo";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError, type SecurityRuleContext } from "@/firebase/errors";

const features = [
  {
    title: "Record Voice",
    desc: "Speak your legal problem. Get a quick word-for-word summary and forensic analysis.",
    icon: Mic,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    href: "/dashboard/narrate"
  },
  {
    title: "Scan Documents",
    desc: "Upload court orders or notices. AI reads and identifies statutory risks.",
    icon: FileSearch,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    href: "/dashboard/document-intelligence"
  },
  {
    title: "Write Documents",
    desc: "Draft professional legal notices and complaints in any Indian language.",
    icon: FileText,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    href: "/dashboard/document-generator"
  },
  {
    title: "Create Bonds",
    desc: "Generate legally sound bail, personal, and indemnity bonds instantly.",
    icon: FileSignature,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    href: "/dashboard/bond-generator"
  },
  {
    title: "Check Chance",
    desc: "Analyze case details to see the statistical probability of a win or bail.",
    icon: BrainCircuit,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    href: "/dashboard/strength-analyzer"
  }
];

const suggestions = [
  "What Are Tenant Rights In India?",
  "How To File A Consumer Complaint?",
  "Explain Domestic Violence Act"
];

const TRANSience_WINDOW = 56 * 60 * 60 * 1000;

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
}

const typeConfig: Record<string, { color: string, bg: string, border: string, icon: any, gradient: string }> = {
    'Idea': { color: 'text-amber-600', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: Sparkles, gradient: 'from-amber-500/5' },
    'Question': { color: 'text-blue-600', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: Bot, gradient: 'from-blue-500/5' },
    'Suggestion': { color: 'text-emerald-600', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: Zap, gradient: 'from-emerald-500/5' },
    'Poll': { color: 'text-purple-600', bg: 'bg-purple-500/10', border: 'border-purple-500/20', icon: Layers, gradient: 'from-purple-500/5' },
    'News': { color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20', icon: Newspaper, gradient: 'from-primary/5' },
};

function DashboardPostCard({ post }: { post: Post }) {
    const firestore = useFirestore();
    const auth = useAuth();
    const { currentUser } = auth;
    const [isLiking, setIsLiking] = useState(false);
    
    const config = typeConfig[post.postType || 'Idea'] || typeConfig['Idea'];
    const userHasLiked = post.likedBy?.includes(currentUser?.uid ?? '');

    const handleLike = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!currentUser || isLiking) return;
        setIsLiking(true);
        const postRef = doc(firestore, "posts", post.id);
        
        updateDoc(postRef, {
            likes: increment(userHasLiked ? -1 : 1),
            likedBy: userHasLiked ? arrayRemove(currentUser.uid) : arrayUnion(currentUser.uid)
        }).catch(async (serverError) => {
            const permissionError = new FirestorePermissionError({
                path: postRef.path,
                operation: 'update',
                requestResourceData: { likes: userHasLiked ? -1 : 1 },
            } satisfies SecurityRuleContext, serverError);
            errorEmitter.emit('permission-error', permissionError);
        }).finally(() => setIsLiking(false));
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            className="group h-full"
        >
            <Link href={`/dashboard/profile/${post.authorUid}`} className="h-full block">
                <Card className="bg-card border-border/10 rounded-3xl overflow-hidden hover:border-primary/30 transition-all duration-500 shadow-lg hover:shadow-xl group active:scale-[0.98] text-left h-full relative">
                    <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity", config.gradient)}></div>
                    <CardContent className="p-6 space-y-4 flex flex-col h-full">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8 border border-primary/10 rounded-lg">
                                    <AvatarImage src={post.authorAvatar} className="object-cover" />
                                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-[10px]">{post.authorName?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span className="text-[10px] font-bold text-foreground/60">By {post.authorName}</span>
                            </div>
                            <Badge variant="outline" className={cn("text-[8px] font-bold px-2 py-0.5 rounded-full", config.bg, config.color)}>
                                {post.postType}
                            </Badge>
                        </div>
                        
                        <div className="space-y-1 flex-grow">
                            <h4 className="font-bold text-sm tracking-tight text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                                {post.title}
                            </h4>
                            <p className="text-[11px] text-muted-foreground font-medium leading-relaxed line-clamp-2">
                                {post.content}
                            </p>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-border/5">
                            <button 
                                onClick={handleLike}
                                className={cn(
                                    "flex items-center gap-1.5 text-[9px] font-bold transition-colors",
                                    userHasLiked ? "text-red-500" : "text-muted-foreground hover:text-primary"
                                )}
                            >
                                <Heart className={cn("h-3 w-3", userHasLiked && "fill-current")} />
                                <span>{post.likes}</span>
                            </button>
                            <span className="text-[8px] font-bold text-muted-foreground opacity-40">Registry Entry</span>
                        </div>
                    </CardContent>
                </Card>
            </Link>
        </motion.div>
    );
}

interface Message {
  role: 'user' | 'ai';
  text: string;
}

export default function DashboardHomePage() {
  const auth = useAuth();
  const firestore = useFirestore();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [greeting, setGreeting] = useState("");
  
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [posts, setPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 17) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");

    if (auth.currentUser) {
      const userRef = doc(firestore, "users", auth.currentUser.uid);
      const unsub = onSnapshot(userRef, (docSnap) => {
        if (docSnap.exists()) {
          setUserProfile(docSnap.data());
        }
      }, async (err) => {
          const permissionError = new FirestorePermissionError({
              path: userRef.path,
              operation: 'get',
          } satisfies SecurityRuleContext, err);
          errorEmitter.emit('permission-error', permissionError);
      });

      const postsCol = collection(firestore, "posts");
      const streamQuery = query(postsCol, orderBy("createdAt", "desc"), limit(6));
      const unsubStream = onSnapshot(streamQuery, (snap) => {
          const now = Date.now();
          const list: Post[] = snap.docs
            .map(d => ({ id: d.id, ...d.data() } as Post))
            .filter(p => {
                const ct = p.createdAt?.toMillis() || now;
                return (now - ct) < TRANSience_WINDOW;
            });
          setPosts(list);
          setPostsLoading(false);
      }, async (err) => {
          const permissionError = new FirestorePermissionError({
              path: postsCol.path,
              operation: 'list',
          } satisfies SecurityRuleContext, err);
          errorEmitter.emit('permission-error', permissionError);
          setPostsLoading(false);
      });

      return () => { unsub(); unsubStream(); };
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
      setMessages(prev => [...prev, { role: 'ai', text: "The Neural Hub Is Temporarily Busy. Please Try Again In A Few Moments." }]);
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

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-32 px-4 sm:px-6">
      
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full bg-[#f0f4ff] dark:bg-card border border-blue-100/50 dark:border-border/10 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6"
      >
        <div className="flex items-center gap-6 text-left">
          <Avatar className="h-16 w-16 sm:h-20 sm:w-20 border-4 border-white dark:border-zinc-800 shadow-xl rounded-full">
            <AvatarImage src={userProfile?.photoURL} className="object-cover" />
            <AvatarFallback className="bg-primary text-primary-foreground font-bold text-2xl">
              {userProfile?.firstName?.charAt(0) || <User className="h-8 w-8" />}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground leading-none">
                {greeting}, {userProfile?.firstName || 'There'}!
              </h2>
              <Badge variant="outline" className="bg-background/50 border-border/10 text-[10px] font-bold px-2.5 py-0.5 rounded-lg text-muted-foreground">
                {userProfile?.subscriptionType || 'Free'}
              </Badge>
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              Welcome To Your Nyaya Sahayak Dashboard
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-12 px-6 rounded-xl border-border/10 bg-background font-bold text-xs gap-2 shadow-sm" asChild>
            <Link href="/dashboard/document-intelligence">
              <Upload className="h-4 w-4" /> Upload
            </Link>
          </Button>
          <Button 
            onClick={() => setMessages([])}
            className="h-12 px-6 rounded-xl bg-primary text-primary-foreground font-bold text-xs gap-2 shadow-xl active:scale-95 transition-all"
          >
            <Sparkles className="h-4 w-4" /> New Chat
          </Button>
        </div>
      </motion.div>

      {/* Central Hub Ingress */}
      <section className="flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-4xl bg-card rounded-[2.5rem] p-8 sm:p-12 border border-border/10 shadow-2xl relative overflow-hidden text-center flex flex-col items-center gap-8"
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
                <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight leading-tight">
                  Hello, How Can I Help You Today?
                </h1>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  {suggestions.map((s, i) => (
                    <motion.button
                      key={i}
                      onClick={() => handleSend(s)}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 + (i * 0.1) }}
                      className="px-5 py-2.5 rounded-full bg-muted/30 border border-border/10 text-muted-foreground hover:bg-muted/50 hover:text-primary hover:border-primary/30 transition-all text-xs font-medium"
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
                className="w-full h-[450px] flex flex-col"
              >
                <ScrollArea className="flex-1 pr-4" viewportRef={scrollRef}>
                  <div className="space-y-6 pb-4">
                    {messages.map((m, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 10, x: m.role === 'user' ? 20 : -20 }}
                        animate={{ opacity: 1, y: 0, x: 0 }}
                        className={cn(
                          "flex flex-col max-w-[90%] space-y-1.5",
                          m.role === 'user' ? "ml-auto items-end" : "items-start"
                        )}
                      >
                        <div className={cn(
                          "px-5 py-4 rounded-[1.5rem] text-sm sm:text-base font-medium leading-relaxed text-left shadow-lg",
                          m.role === 'user' 
                            ? "bg-primary text-primary-foreground rounded-tr-none" 
                            : "bg-muted/30 border border-border/10 text-foreground rounded-tl-none prose dark:prose-invert max-w-none"
                        )}>
                          {m.text}
                        </div>
                        <span className="text-[8px] font-bold text-muted-foreground/40 px-2 uppercase tracking-widest">
                          {m.role === 'ai' ? 'Nyaya Sahayak Terminal' : 'Citizen Registry Point'}
                        </span>
                      </motion.div>
                    ))}
                    {isLoading && (
                      <div className="flex gap-3 items-center text-primary/40 p-4">
                        <div className="relative">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <Activity className="absolute inset-0 h-5 w-5 animate-pulse" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">Neural Ingress In Progress...</span>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="w-full max-w-3xl space-y-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-background/50 rounded-2xl border border-border/10 pointer-events-none group-focus-within:border-primary/40 transition-colors" />
              <div className="flex items-center gap-4 p-3 relative z-10">
                <Textarea 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Consult The Forensic AI Co-Pilot..." 
                  className="flex-1 bg-transparent border-none focus-visible:ring-0 text-foreground text-lg placeholder:text-muted-foreground/30 min-h-[48px] h-10 py-2 resize-none overflow-hidden" 
                />
                <div className="flex items-center gap-2 pr-2">
                  <button className="p-2 text-muted-foreground/40 hover:text-primary transition-colors"><Paperclip className="h-5 w-5" /></button>
                  <button className="p-2 text-muted-foreground/40 hover:text-primary transition-colors"><Mic className="h-5 w-5" /></button>
                  <button 
                    onClick={() => handleSend()}
                    disabled={!input.trim() || isLoading}
                    className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-xl active:scale-[0.95] transition-all disabled:opacity-50"
                  >
                    <Send className="h-5 w-5 fill-current" />
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4 text-[9px] font-bold text-muted-foreground/20 uppercase tracking-widest">
                <div className="flex items-center gap-1.5"><ShieldCheck className="h-3 w-3" /> End-to-end encryption active</div>
                <div className="h-1 w-1 rounded-full bg-border" />
                <div>Identity masked protocol</div>
            </div>
          </div>

          {/* Community Stream Ingress */}
          <div className="w-full pt-10 border-t border-border/5">
              <div className="flex items-center justify-between mb-8 text-left">
                  <div className="space-y-1">
                      <div className="flex items-center gap-2 text-primary">
                          <Activity className="h-4 w-4 animate-pulse" />
                          <span className="text-[10px] font-bold uppercase tracking-widest">Live Community Stream</span>
                      </div>
                      <h3 className="text-xl font-bold tracking-tight text-foreground">Recent Transmissions</h3>
                  </div>
                  <Button variant="ghost" size="sm" asChild className="h-9 px-4 rounded-xl font-bold text-[9px] text-primary hover:bg-primary/5 uppercase tracking-widest">
                      <Link href="/dashboard/research-analytics">View Full Registry <ArrowRight className="ml-2 h-3.5 w-3.5" /></Link>
                  </Button>
              </div>

              {postsLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[1, 2, 3].map(i => (
                          <div key={i} className="h-40 rounded-3xl bg-muted/20 animate-pulse border border-border/5" />
                      ))}
                  </div>
              ) : posts.length === 0 ? (
                  <div className="py-12 bg-muted/5 rounded-[2rem] border-2 border-dashed border-border/5 text-center">
                      <p className="text-[10px] font-bold text-muted-foreground opacity-20 uppercase tracking-widest">No Transmissions Registered In This Hub.</p>
                  </div>
              ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {posts.map((post) => (
                          <DashboardPostCard key={post.id} post={post} />
                      ))}
                  </div>
              )}
          </div>
        </motion.div>
      </section>

      {/* Feature Matrix */}
      <section className="space-y-12">
        <div className="text-left border-l-4 border-primary pl-6 py-2">
          <h2 className="text-[10px] font-bold text-primary mb-1 uppercase tracking-widest">Core Hub</h2>
          <h3 className="text-3xl font-bold tracking-tighter text-foreground">Forensic Terminals</h3>
          <p className="text-sm text-muted-foreground font-medium mt-1">Select A Tool To Initialize Forensic Audit.</p>
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
                <Card className="bg-card border-border/10 rounded-[2rem] h-full overflow-hidden hover:border-primary/20 transition-all duration-500 group cursor-pointer active:scale-95 shadow-lg hover:shadow-2xl hover:-translate-y-2">
                  <CardContent className="p-6 flex flex-col gap-4 text-left">
                    <div className={cn("p-2.5 rounded-xl transition-transform group-hover:scale-110 shadow-lg w-fit", f.bg, f.color)}>
                      <f.icon className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-bold text-sm text-foreground tracking-tight leading-none">{f.title}</h3>
                      <p className="text-[10px] text-muted-foreground leading-relaxed font-medium line-clamp-3">{f.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Professional Synergy Hub */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="pt-10"
      >
        <Card className="bg-primary/5 border border-primary/10 rounded-[4rem] p-12 sm:p-24 flex flex-col md:flex-row items-center justify-between gap-16 overflow-hidden relative group shadow-3xl">
          <div className="absolute top-0 right-0 p-20 opacity-[0.03] group-hover:scale-110 transition-transform duration-[3s] pointer-events-none grayscale">
            <Logo className="h-96 w-96" priority={false} />
          </div>
          <div className="space-y-8 text-left relative z-10 max-w-2xl">
            <div className="flex items-center gap-4 text-primary">
              <div className="p-3 rounded-2xl bg-primary/10">
                <ShieldCheck className="h-6 w-6 animate-pulse" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Statutory Trust</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-foreground leading-tight tracking-tighter">Democratizing <br /> <span className="text-primary">Legal Intelligence.</span></h2>
            <p className="text-lg sm:text-2xl text-muted-foreground font-medium leading-relaxed">
              Every forensic report and narration is encrypted via TLS 1.3 and is strictly confidential. We do not train models on citizen data.
            </p>
            <Button size="xl" className="rounded-3xl font-black uppercase tracking-widest text-xs h-16 px-12 shadow-2xl active:scale-95 transition-all shadow-primary/20" asChild>
                <Link href="/dashboard/strength-analyzer">Start Forensic Audit <ArrowRight className="ml-3 h-5 w-5" /></Link>
            </Button>
          </div>
          <div className="flex items-center justify-center p-12 bg-white/5 dark:bg-black/40 rounded-[3.5rem] border border-border/5 shadow-2xl relative z-10 group-hover:rotate-2 transition-transform duration-700">
            <Activity className="h-32 w-32 text-primary opacity-20 group-hover:opacity-40 transition-opacity" />
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
