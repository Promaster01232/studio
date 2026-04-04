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
  ChevronRight
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

  return (
    <div className="flex flex-col h-full space-y-8 pb-12 max-w-6xl mx-auto text-left relative pt-2">
        <MotionWrapper>
          <Card className="relative overflow-hidden border-primary/5 bg-card/40 backdrop-blur-xl shadow-2xl rounded-3xl group hover:border-primary/20 transition-all duration-500">
              <div className="p-8 sm:p-12 relative z-10 flex flex-col lg:flex-row items-center gap-10">
                  <div className="flex-1 space-y-8 text-center lg:text-left">
                      <div className="space-y-4">
                          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-foreground leading-[1.1]">
                              Nyaya <span className="text-primary italic">{text}</span>
                          </h1>
                          <p className="text-base sm:text-lg text-muted-foreground font-medium max-w-xl">
                              India's premier legal helper. Analyze cases, draft documents, and get answers instantly.
                          </p>
                      </div>

                      <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                          <Button size="lg" className="rounded-xl font-bold h-12 px-8 shadow-xl shadow-primary/20 active:scale-95 transition-all group overflow-hidden" asChild>
                              <Link href="/dashboard/narrate">
                                  Record Case <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                              </Link>
                          </Button>
                          <Button variant="ghost" className="h-12 rounded-xl px-6 font-bold hover:bg-primary/5 text-primary" asChild>
                              <Link href="/dashboard/learn">Knowledge Base</Link>
                          </Button>
                      </div>
                  </div>

                  <div className="hidden lg:flex w-64 shrink-0 flex-col gap-4">
                      <Card className="bg-background/50 border-primary/5 p-4 rounded-2xl shadow-sm">
                          <div className="flex items-center gap-3 mb-2">
                              <Activity className="h-4 w-4 text-primary" />
                              <p className="font-bold text-[10px] uppercase tracking-widest">System Status</p>
                          </div>
                          <p className="text-xs font-bold text-green-600">Online & Ready</p>
                      </Card>
                      <Card className="bg-background/50 border-primary/5 p-4 rounded-2xl shadow-sm">
                          <div className="flex items-center gap-3 mb-2">
                              <ShieldCheck className="h-4 w-4 text-primary" />
                              <p className="font-bold text-[10px] uppercase tracking-widest">Security</p>
                          </div>
                          <p className="text-xs font-bold">Encrypted Session</p>
                      </Card>
                  </div>
              </div>
              <div className="h-1 w-full bg-gradient-to-r from-primary via-blue-400 to-primary"></div>
          </Card>
        </MotionWrapper>

        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
              <section>
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-primary/5">
                      <div className="flex items-center gap-2 text-primary/60">
                          <TrendingUp className="h-4 w-4" />
                          <h2 className="text-xs font-bold tracking-widest uppercase">Community Feed</h2>
                      </div>
                      <Button variant="link" className="h-auto p-0 text-xs font-bold text-primary" asChild>
                          <Link href="/dashboard/research-analytics">View All</Link>
                      </Button>
                  </div>
                  <div className="space-y-4">
                      {postsLoading ? (
                          <div className="space-y-4">
                              {[...Array(2)].map((_, i) => (
                                  <Card key={i} className="h-24 animate-pulse border-primary/5 rounded-2xl bg-muted/10" />
                              ))}
                          </div>
                      ) : (
                          <div className="grid gap-4">
                              {latestPosts.map((post) => (
                                  <PostCard key={post.id} post={post} />
                              ))}
                          </div>
                      )}
                  </div>
              </section>
          </div>

          <div className="lg:col-span-4 space-y-6">
              <section>
                  <div className="flex items-center gap-2 text-primary/60 mb-4 pb-2 border-b border-primary/5">
                      <Sparkles className="h-4 w-4" />
                      <h2 className="text-xs font-bold tracking-widest uppercase">Tools</h2>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                      {aiFeatures.map((f) => (
                        <Link key={f.href} href={f.href} className="block group" onMouseEnter={() => playSound('hover')}>
                            <Card className="p-4 rounded-xl border-primary/5 hover:border-primary/20 hover:bg-primary/5 transition-all text-left shadow-sm group-active:scale-[0.98]">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                        <f.icon className="h-4 w-4" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-xs tracking-tight text-foreground uppercase leading-none">{f.title}</h3>
                                        <p className="text-[10px] text-muted-foreground mt-1">{f.desc}</p>
                                    </div>
                                    <ChevronRight className="h-3 w-3 text-primary opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                                </div>
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