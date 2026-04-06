"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import React, { useState, useEffect, useRef, use } from "react";
import {
  Mic,
  Search,
  FileText,
  FileSignature,
  BrainCircuit,
  ArrowRight,
  Sparkles,
  Activity,
  Heart,
  Zap,
  ShieldCheck,
  Loader2,
  Clock,
  TrendingUp,
  ChevronRight,
  Lock
} from "lucide-react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth, useFirestore } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { 
  collection, 
  query, 
  orderBy, 
  limit, 
  onSnapshot, 
  Timestamp, 
  doc, 
  updateDoc, 
  increment, 
  arrayUnion, 
  arrayRemove, 
  getDoc
} from "firebase/firestore";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Logo } from "@/components/logo";
import { useSoundEffect } from "@/hooks/use-sound-effect";

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
}

const MotionWrapper = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
      transition={{ delay, duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

function PostCard({ post }: { post: Post }) {
    const { playSound } = useSoundEffect();
    const firestore = useFirestore();
    const auth = useAuth();
    const { currentUser } = auth;
    
    const [isLiking, setIsLiking] = useState(false);
    const userHasLiked = post.likedBy?.includes(currentUser?.uid ?? '');

    const handleLike = () => {
        if (!currentUser || isLiking) return;
        setIsLiking(true);
        const postRef = doc(firestore, "posts", post.id);
        
        updateDoc(postRef, {
            likes: increment(userHasLiked ? -1 : 1),
            likedBy: userHasLiked ? arrayRemove(currentUser.uid) : arrayUnion(currentUser.uid)
        }).then(() => {
            playSound(userHasLiked ? 'click' : 'success');
        }).finally(() => setIsLiking(false));
    };

    return (
        <Card className="overflow-hidden bg-card border-primary/5 hover:border-primary/20 transition-all rounded-2xl shadow-sm text-left">
            <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                        <Avatar className="h-8 w-8 rounded-lg">
                            <AvatarImage src={post.authorAvatar} />
                            <AvatarFallback className="bg-primary/5 text-primary text-[10px] font-bold">{post.authorName?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-bold text-[11px]">{post.authorName}</p>
                            <p className="text-[9px] text-muted-foreground opacity-60">
                                {post.createdAt ? formatDistanceToNow(post.createdAt.toDate(), { addSuffix: true }) : 'Just now'}
                            </p>
                        </div>
                    </div>
                </div>
                <h3 className="font-bold text-sm mb-1.5 leading-tight">{post.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4 line-clamp-2">{post.content}</p>
                <div className="flex items-center justify-between pt-3 border-t border-primary/5">
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className={cn("h-8 px-3 rounded-lg text-xs font-bold gap-2", userHasLiked ? "text-primary bg-primary/5" : "text-muted-foreground")}
                        onClick={handleLike}
                        disabled={isLiking}
                    >
                        <Heart className={cn("h-3.5 w-3.5", userHasLiked && "fill-current")} />
                        <span>{post.likes}</span>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

const aiFeatures = [
    { href: "/dashboard/strength-analyzer", icon: BrainCircuit, title: "Case Strength", desc: "Check success probability." },
    { href: "/dashboard/document-intelligence", icon: Search, title: "Analysis", desc: "Scan for potential risks." },
    { href: "/dashboard/document-generator", icon: FileText, title: "Drafting", desc: "Create legal documents." },
    { href: "/dashboard/bond-generator", icon: FileSignature, title: "Legal Bonds", desc: "Generate official forms." },
];

export default function DashboardHomePage(props: { params: Promise<any>, searchParams: Promise<any> }) {
  use(props.params);
  use(props.searchParams);

  const [text, setText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const fullText = 'Assistant';
  const { playSound } = useSoundEffect();
  
  const firestore = useFirestore();
  const auth = useAuth();
  const [latestPosts, setLatestPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, () => {
        const q = query(collection(firestore, "posts"), orderBy("createdAt", "desc"), limit(3));
        return onSnapshot(q, (snap) => {
            const list: Post[] = snap.docs.map(d => ({ id: d.id, ...d.data() } as Post));
            setLatestPosts(list);
            setPostsLoading(false);
        }, () => setPostsLoading(false));
    });
    return () => unsubAuth();
  }, [auth, firestore]);
  
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isTyping) {
      if (text.length < fullText.length) {
        timeoutId = setTimeout(() => setText(fullText.slice(0, text.length + 1)), 150); 
      } else {
        timeoutId = setTimeout(() => setIsTyping(false), 2000);
      }
    } else {
      timeoutId = setTimeout(() => {
        setText('');
        setIsTyping(true);
      }, 1000);
    }
    return () => clearTimeout(timeoutId);
  }, [text, isTyping]);

  const isGuest = !auth.currentUser;

  return (
    <div className="flex flex-col h-full space-y-10 pb-12 max-w-6xl mx-auto text-left relative pt-2">
        <MotionWrapper>
          <Card className="relative overflow-hidden border-primary/5 bg-card/40 backdrop-blur-xl shadow-2xl rounded-[2.5rem] group hover:border-primary/20 transition-all duration-500">
              <div className="p-10 sm:p-16 relative z-10 flex flex-col lg:flex-row items-center gap-12">
                  <div className="flex-1 space-y-10 text-center lg:text-left">
                      <div className="space-y-6">
                          <h1 className="text-4xl sm:text-7xl font-black tracking-tight text-foreground leading-[1.1]">
                              Nyaya <span className="animate-pan italic">{text}</span>
                          </h1>
                          <p className="text-base sm:text-xl text-muted-foreground font-medium max-w-2xl leading-relaxed">
                              India's premier AI legal assistant. Analyze cases, draft documents, and get answers instantly with professional-grade intelligence.
                          </p>
                      </div>

                      <div className="flex flex-wrap items-center justify-center lg:justify-start gap-5">
                          <Button size="lg" className="rounded-2xl font-bold h-14 px-10 shadow-2xl shadow-primary/20 active:scale-95 transition-all group overflow-hidden" asChild>
                              <Link href="/dashboard/narrate">
                                  Record Your Case <ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
                              </Link>
                          </Button>
                          <Button variant="ghost" className="h-14 rounded-2xl px-8 font-bold hover:bg-primary/5 text-primary text-base" asChild>
                              <Link href="/dashboard/learn">Knowledge Hub</Link>
                          </Button>
                      </div>
                  </div>

                  <div className="hidden lg:flex w-72 shrink-0 flex-col gap-5">
                      <Card className="bg-background/50 border-primary/5 p-6 rounded-[1.5rem] shadow-md hover:shadow-lg transition-all group/status">
                          <div className="flex items-center gap-3 mb-3">
                              <div className="p-2 rounded-lg bg-green-500/10 group-hover/status:bg-green-500/20 transition-colors">
                                <Activity className="h-4 w-4 text-green-600 animate-pulse" />
                              </div>
                              <p className="font-bold text-[10px] uppercase tracking-widest text-muted-foreground">System Status</p>
                          </div>
                          <p className="text-sm font-black text-green-600">Online & Synchronized</p>
                      </Card>
                      <Card className="bg-background/50 border-primary/5 p-6 rounded-[1.5rem] shadow-md hover:shadow-lg transition-all group/sec">
                          <div className="flex items-center gap-3 mb-3">
                              <div className="p-2 rounded-lg bg-primary/10 group-hover/sec:bg-primary/20 transition-colors">
                                <ShieldCheck className="h-4 w-4 text-primary" />
                              </div>
                              <p className="font-bold text-[10px] uppercase tracking-widest text-muted-foreground">Encryption</p>
                          </div>
                          <p className="text-sm font-black text-primary">Secure Session Node</p>
                      </Card>
                  </div>
              </div>
              <div className="h-1.5 w-full bg-gradient-to-r from-primary via-blue-400 to-primary"></div>
          </Card>
        </MotionWrapper>

        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-8">
              <section>
                  <div className="flex items-center justify-between mb-6 pb-2 border-b border-primary/5">
                      <div className="flex items-center gap-3 text-primary/60">
                          <TrendingUp className="h-5 w-5" />
                          <h2 className="text-sm font-black tracking-[0.2em] uppercase">Community Registry</h2>
                      </div>
                      <Button variant="link" className="h-auto p-0 text-sm font-bold text-primary hover:no-underline" asChild>
                          <Link href="/dashboard/research-analytics" className="flex items-center gap-1">
                            Explore All <ChevronRight className="h-4 w-4" />
                          </Link>
                      </Button>
                  </div>
                  <div className="grid gap-6">
                      {postsLoading ? (
                          <div className="space-y-6">
                              {[...Array(2)].map((_, i) => (
                                  <Card key={i} className="h-32 animate-pulse border-primary/5 rounded-[1.5rem] bg-muted/10" />
                              ))}
                          </div>
                      ) : (
                          <div className="grid gap-6">
                              {latestPosts.map((post) => (
                                  <PostCard key={post.id} post={post} />
                              ))}
                          </div>
                      )}
                  </div>
              </section>
          </div>

          <div className="lg:col-span-4 space-y-8">
              <section>
                  <div className="flex items-center gap-3 text-primary/60 mb-6 pb-2 border-b border-primary/5">
                      <Sparkles className="h-5 w-5" />
                      <h2 className="text-sm font-black tracking-[0.2em] uppercase">Intelligence Tools</h2>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                      {aiFeatures.map((f) => (
                        <Link key={f.href} href={f.href} className="block group" onMouseEnter={() => playSound('hover')}>
                            <Card className="p-5 rounded-2xl border-primary/5 hover:border-primary/20 hover:bg-primary/5 transition-all text-left shadow-md group-active:scale-[0.98] relative overflow-hidden">
                                <div className="flex items-center gap-4 relative z-10">
                                    <div className={cn(
                                        "p-3 rounded-xl transition-all shadow-lg",
                                        "bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white"
                                    )}>
                                        <f.icon className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-black text-sm tracking-tight text-foreground uppercase leading-none">{f.title}</h3>
                                        <p className="text-[11px] text-muted-foreground font-medium mt-1.5">{f.desc}</p>
                                    </div>
                                    {isGuest ? (
                                        <Lock className="h-3.5 w-3.5 text-muted-foreground opacity-30" />
                                    ) : (
                                        <ChevronRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                                    )}
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Card>
                        </Link>
                      ))}
                  </div>
              </section>
          </div>
        </div>
    </div>
  );
}