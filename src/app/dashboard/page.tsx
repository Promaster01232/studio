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
  FileSignature,
  Zap,
  ArrowRight,
  Upload,
  User,
  Loader2,
  Activity,
  Heart,
  Layers,
  Bot,
  Newspaper,
  ChevronDown
} from "lucide-react";
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
    desc: "Speak your legal problem. Get a forensic report.",
    icon: Mic,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    href: "/dashboard/narrate"
  },
  {
    title: "Scan Documents",
    desc: "AI identifies statutory risks in legal papers.",
    icon: FileSearch,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    href: "/dashboard/document-intelligence"
  },
  {
    title: "Write Documents",
    desc: "Draft professional legal notices instantly.",
    icon: FileText,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    href: "/dashboard/document-generator"
  },
  {
    title: "Create Bonds",
    desc: "Generate legally sound bail and surety bonds.",
    icon: FileSignature,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    href: "/dashboard/bond-generator"
  },
  {
    title: "Check Chance",
    desc: "Probability modeling for wins or bail success.",
    icon: BrainCircuit,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    href: "/dashboard/strength-analyzer"
  }
];

const suggestions = [
  "What are tenant rights in india?",
  "How to file a consumer complaint?",
  "Explain domestic violence act"
];

const TRANSIENCE_WINDOW = 56 * 60 * 60 * 1000;

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

function DashboardPostCard({ post }: { post: Post }) {
    const firestore = useFirestore();
    const auth = useAuth();
    const { currentUser } = auth;
    const [isLiking, setIsLiking] = useState(false);
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
        <Link href={`/dashboard/profile/${post.authorUid}`} className="h-full block">
            <Card className="bg-card border-border/10 rounded-xl overflow-hidden hover:border-primary/30 transition-all shadow-sm active:scale-[0.98] text-left h-full">
                <CardContent className="p-4 space-y-2 flex flex-col h-full">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6 border border-primary/10 rounded-lg">
                                <AvatarImage src={post.authorAvatar} className="object-cover" />
                                <AvatarFallback className="bg-primary/10 text-primary font-bold text-[8px]">{post.authorName?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="text-[8px] font-bold text-foreground/60">By {post.authorName}</span>
                        </div>
                        <Badge variant="outline" className="text-[7px] font-bold px-2 py-0.5 rounded-full">
                            {post.postType}
                        </Badge>
                    </div>
                    
                    <div className="space-y-1 flex-grow">
                        <h4 className="font-bold text-xs tracking-tight text-foreground line-clamp-1">
                            {post.title}
                        </h4>
                        <p className="text-[9px] text-muted-foreground font-medium leading-relaxed line-clamp-2">
                            {post.content}
                        </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-border/5">
                        <button 
                            onClick={handleLike}
                            className={cn(
                                "flex items-center gap-1.5 text-[8px] font-bold transition-colors",
                                userHasLiked ? "text-red-500" : "text-muted-foreground hover:text-primary"
                            )}
                        >
                            <Heart className={cn("h-2.5 w-2.5", userHasLiked && "fill-current")} />
                            <span>{post.likes}</span>
                        </button>
                        <span className="text-[7px] font-bold text-muted-foreground opacity-40 uppercase">Registry Entry</span>
                    </div>
                </CardContent>
            </Card>
        </Link>
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
      });

      const postsCol = collection(firestore, "posts");
      const streamQuery = query(postsCol, orderBy("createdAt", "desc"), limit(6));
      const unsubStream = onSnapshot(streamQuery, (snap) => {
          const now = Date.now();
          const list: Post[] = snap.docs
            .map(d => ({ id: d.id, ...d.data() } as Post))
            .filter(p => {
                const ct = p.createdAt?.toMillis() || now;
                return (now - ct) < TRANSIENCE_WINDOW;
            });
          setPosts(list);
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
      setMessages(prev => [...prev, { role: 'ai', text: "The neural hub is temporarily busy. Please try again in a few moments." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-8 px-4 sm:px-6">
      <div className="w-full bg-card border border-border/10 rounded-xl p-5 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-left">
          <Avatar className="h-12 w-12 border-2 border-background shadow-md rounded-full">
            <AvatarImage src={userProfile?.photoURL} className="object-cover" />
            <AvatarFallback className="bg-primary text-primary-foreground font-bold text-lg">
              {userProfile?.firstName?.charAt(0) || <User className="h-5 w-5" />}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-0.5">
            <h2 className="text-xl font-bold tracking-tight text-foreground leading-none">
              {greeting}, {userProfile?.firstName || 'There'}!
            </h2>
            <p className="text-[10px] font-bold text-muted-foreground uppercase">
              {userProfile?.subscriptionType || 'Free'} Clearance
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" className="h-9 px-4 rounded-lg border-border/10 bg-background font-bold text-xs gap-2" asChild>
            <Link href="/dashboard/document-intelligence">
              <Upload className="h-4 w-4" /> Upload
            </Link>
          </Button>
          <Button 
            onClick={() => setMessages([])}
            className="h-9 px-4 rounded-lg bg-primary text-primary-foreground font-bold text-xs gap-2 shadow-sm active:scale-95"
          >
            <Sparkles className="h-4 w-4" /> New Chat
          </Button>
        </div>
      </div>

      <div className="w-full bg-card rounded-xl p-6 border border-border/10 shadow-lg text-center flex flex-col items-center gap-6">
        {messages.length === 0 ? (
          <div className="space-y-4 w-full">
            <h1 className="text-2xl font-black text-foreground tracking-tight leading-none">
              Hello, How Can I Help You?
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(s)}
                  className="px-3 py-1.5 rounded-full bg-muted/30 border border-border/10 text-muted-foreground hover:bg-muted/50 hover:text-primary transition-all text-[10px] font-bold uppercase tracking-tight"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="w-full h-[350px] flex flex-col">
            <ScrollArea className="flex-1 pr-4" viewportRef={scrollRef}>
              <div className="space-y-4 pb-4">
                {messages.map((m, i) => (
                  <div 
                    key={i}
                    className={cn(
                      "flex flex-col max-w-[90%] space-y-1",
                      m.role === 'user' ? "ml-auto items-end" : "items-start"
                    )}
                  >
                    <div className={cn(
                      "px-4 py-2.5 rounded-xl text-sm font-medium leading-relaxed text-left shadow-sm",
                      m.role === 'user' 
                        ? "bg-primary text-primary-foreground rounded-tr-none" 
                        : "bg-muted/30 border border-border/10 text-foreground rounded-tl-none"
                    )}>
                      {m.text}
                    </div>
                    <span className="text-[7px] font-bold text-muted-foreground/40 px-2 uppercase tracking-widest">
                      {m.role === 'ai' ? 'Nyaya Sahayak Terminal' : 'Citizen Registry Point'}
                    </span>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-2 items-center text-primary/40 p-2">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span className="text-[8px] font-black uppercase tracking-widest">Neural Ingress...</span>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        )}

        <div className="w-full space-y-3">
          <div className="relative">
            <div className="flex items-center gap-3 p-2 bg-background/50 rounded-xl border border-border/10">
              <Textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Consult the AI co-pilot..." 
                className="flex-1 bg-transparent border-none focus-visible:ring-0 text-sm placeholder:text-muted-foreground/30 min-h-[40px] h-10 py-2 resize-none overflow-hidden" 
              />
              <div className="flex items-center gap-1 pr-1">
                <button className="p-2 text-muted-foreground/40 hover:text-primary transition-colors"><Paperclip className="h-4 w-4" /></button>
                <button className="p-2 text-muted-foreground/40 hover:text-primary transition-colors"><Mic className="h-4 w-4" /></button>
                <button 
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isLoading}
                  className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-sm active:scale-[0.95] transition-all disabled:opacity-50"
                >
                  <Send className="h-3.5 w-3.5 fill-current" />
                </button>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3 text-[7px] font-bold text-muted-foreground/20 uppercase tracking-widest">
              <div className="flex items-center gap-1"><ShieldCheck className="h-2 w-2" /> Encrypted Session</div>
              <div className="h-1 w-1 rounded-full bg-border" />
              <div>Identity Masked Protocol</div>
          </div>
        </div>

        <div className="w-full pt-6 border-t border-border/5">
            <div className="flex items-center justify-between mb-4 text-left">
                <div className="space-y-0.5">
                    <div className="flex items-center gap-2 text-primary">
                        <Activity className="h-3 w-3" />
                        <span className="text-[8px] font-bold uppercase tracking-widest">Live Registry Stream</span>
                    </div>
                    <h3 className="text-base font-bold tracking-tight text-foreground">Recent Transmissions</h3>
                </div>
                <Button variant="ghost" size="sm" asChild className="h-7 px-3 rounded-lg font-bold text-[8px] text-primary hover:bg-primary/5 uppercase tracking-widest">
                    <Link href="/dashboard/research-analytics">View Registry <ArrowRight className="ml-1 h-2.5 w-2.5" /></Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {postsLoading ? (
                    [1, 2, 3].map(i => <div key={i} className="h-24 rounded-lg bg-muted/20 animate-pulse" />)
                ) : posts.length === 0 ? (
                    <div className="col-span-full py-6 bg-muted/5 rounded-lg border border-dashed border-border/10 text-center">
                        <p className="text-[8px] font-bold text-muted-foreground opacity-20 uppercase tracking-widest">No transmissions registered.</p>
                    </div>
                ) : (
                    posts.map((post) => <DashboardPostCard key={post.id} post={post} />)
                )}
            </div>
        </div>
      </div>

      <section className="space-y-4">
        <div className="text-left border-l-4 border-primary pl-3 py-0.5">
          <h3 className="text-lg font-bold tracking-tight text-foreground">Forensic Terminals</h3>
          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">Select a hub tool to initialize audit.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {features.map((f, i) => (
            <Link key={i} href={f.href}>
              <Card className="bg-card border-border/10 rounded-xl h-full overflow-hidden hover:border-primary/20 transition-all cursor-pointer active:scale-95 shadow-sm">
                <CardContent className="p-4 flex flex-col gap-2 text-left">
                  <div className={cn("p-1.5 rounded-lg w-fit", f.bg, f.color)}>
                    <f.icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="font-bold text-[11px] text-foreground tracking-tight leading-none">{f.title}</h3>
                    <p className="text-[8px] text-muted-foreground leading-tight font-medium line-clamp-2">{f.desc}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <Card className="bg-primary/5 border border-primary/10 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group shadow-sm">
        <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none grayscale">
          <Logo className="h-48 w-48" priority={false} />
        </div>
        <div className="space-y-4 text-left relative z-10 max-w-xl">
          <div className="flex items-center gap-2 text-primary">
            <ShieldCheck className="h-4 w-4" />
            <span className="text-[8px] font-black uppercase tracking-widest">Statutory Trust</span>
          </div>
          <h2 className="text-2xl font-black text-foreground leading-tight tracking-tight uppercase">Democratizing Legal Intelligence.</h2>
          <p className="text-sm text-muted-foreground font-medium leading-relaxed">
            Every forensic report and narration is encrypted via TLS 1.3 and strictly confidential. We do not train models on citizen data.
          </p>
          <Button size="lg" className="rounded-lg font-bold uppercase tracking-widest text-[10px] h-11 px-8 shadow-md active:scale-95 transition-all shadow-primary/20" asChild>
              <Link href="/dashboard/strength-analyzer">Start Forensic Audit <ArrowRight className="ml-2 h-3 w-3" /></Link>
          </Button>
        </div>
        <div className="flex items-center justify-center p-6 bg-white/5 dark:bg-black/40 rounded-2xl border border-border/5 shadow-inner relative z-10">
          <Activity className="h-16 w-16 text-primary opacity-20" />
        </div>
      </Card>
    </div>
  );
}