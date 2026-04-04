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
  BadgeCheck,
  ShieldCheck,
  Loader2,
  Newspaper,
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
    postType?: string;
    poll?: any;
    isAnonymous?: boolean;
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

function PostCard({ post, userProfile }: { post: Post, userProfile: any, isAdmin: boolean }) {
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
        <Card className="overflow-hidden glass border-primary/5 transition-all rounded-2xl shadow-sm hover:shadow-xl text-left">
            <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                        <Avatar className="h-7 w-7 rounded-lg">
                            <AvatarImage src={post.authorAvatar} />
                            <AvatarFallback className="font-black bg-primary/5 text-primary text-[9px]">{post.authorName?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-bold text-[10px] tracking-tight">{post.isAnonymous ? 'Anonymous' : post.authorName}</p>
                            <p className="text-[8px] font-medium text-muted-foreground opacity-50">
                                {post.createdAt ? formatDistanceToNow(post.createdAt.toDate(), { addSuffix: true }) : 'Just now'}
                            </p>
                        </div>
                    </div>
                    <Badge variant="outline" className="font-black text-[7px] uppercase px-2 py-0.5 border-primary/10 text-primary">
                        {post.postType || 'Discussion'}
                    </Badge>
                </div>
                <h3 className="font-bold text-base tracking-tight mb-1.5 leading-tight">{post.title}</h3>
                <p className="text-xs text-muted-foreground font-medium leading-relaxed mb-4 line-clamp-2">{post.content}</p>
                <div className="flex items-center justify-between pt-3 border-t border-primary/5">
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className={cn("h-7 px-2.5 rounded-lg text-[9px] font-black uppercase gap-1.5", userHasLiked ? "text-primary bg-primary/5" : "text-muted-foreground")}
                        onClick={handleLike}
                        disabled={isLiking}
                    >
                        <Heart className={cn("h-3 w-3", userHasLiked && "fill-current")} />
                        <span>{post.likes}</span>
                    </Button>
                    <div className="flex items-center gap-1.5 text-[7px] font-black uppercase opacity-30">
                        <Clock className="h-2.5 w-2.5" />
                        <span>Recent Update</span>
                    </div>
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
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
        if (user) {
            getDoc(doc(firestore, "users", user.uid)).then(d => d.exists() && setUserProfile(d.data()));
        }
        const q = query(collection(firestore, "posts"), orderBy("createdAt", "desc"), limit(5));
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
        timeoutId = setTimeout(() => setText(fullText.slice(0, text.length + 1)), 100); 
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

  const isAdmin = userProfile?.email && ADMIN_EMAILS.includes(userProfile.email.toLowerCase());

  return (
    <div className="flex flex-col h-full space-y-6 pb-12 max-w-6xl mx-auto text-left relative pt-2">
        <MotionWrapper>
          <Card className="relative overflow-hidden border-primary/5 bg-card/40 backdrop-blur-xl shadow-2xl rounded-[2.5rem] group hover:border-primary/20 transition-all duration-700">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-primary/[0.01] -z-10"></div>
              <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.06] group-hover:scale-110 transition-all duration-1000 pointer-events-none grayscale">
                  <Logo className="h-64 w-64" priority={true} />
              </div>
              
              <div className="p-8 sm:p-12 relative z-10 flex flex-col lg:flex-row items-center gap-10">
                  <div className="flex-1 space-y-8 text-center lg:text-left">
                      <div className="space-y-4">
                          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-foreground leading-[1.1]">
                              Welcome to <br />
                              <span className="text-primary italic font-semibold tracking-normal">Nyaya {text}</span>
                          </h1>
                          <p className="text-base sm:text-lg text-muted-foreground font-medium max-w-xl leading-relaxed">
                              India's premier legal assistant. Analyze cases, draft documents, and get answers to your legal questions.
                          </p>
                      </div>

                      <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                          <Button size="lg" className="rounded-2xl font-bold uppercase tracking-wider text-[10px] h-14 px-10 shadow-xl shadow-primary/20 active:scale-95 transition-all group overflow-hidden relative" asChild>
                              <Link href="/dashboard/narrate">
                                  <span className="relative z-10 flex items-center gap-2">
                                      Record Case <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                  </span>
                                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                              </Link>
                          </Button>
                          <Button variant="ghost" className="h-14 rounded-2xl px-8 font-bold uppercase tracking-widest text-[9px] hover:bg-primary/5 text-primary border border-transparent hover:border-primary/10" asChild>
                              <Link href="/dashboard/learn">
                                  Knowledge Base
                              </Link>
                          </Button>
                      </div>
                  </div>

                  <div className="hidden lg:flex w-72 shrink-0 flex-col gap-4">
                      <Card className="bg-background/50 border-primary/5 p-5 rounded-2xl shadow-inner group/node hover:border-primary/20 transition-all">
                          <div className="flex items-center gap-3 mb-3">
                              <div className="p-2 rounded-lg bg-primary/5 text-primary group-hover/node:bg-primary group-hover/node:text-white transition-all">
                                  <Activity className="h-4 w-4" />
                              </div>
                              <p className="font-bold text-[10px] uppercase tracking-widest">Platform Status</p>
                          </div>
                          <div className="h-1 w-full bg-primary/5 rounded-full overflow-hidden">
                              <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} className="h-full bg-primary" />
                          </div>
                          <p className="text-[8px] font-bold text-muted-foreground mt-2 uppercase tracking-widest">Ready</p>
                      </Card>
                      <Card className="bg-background/50 border-primary/5 p-5 rounded-2xl shadow-inner group/node hover:border-primary/20 transition-all">
                          <div className="flex items-center gap-3 mb-3">
                              <div className="p-2 rounded-lg bg-primary/5 text-primary group-hover/node:bg-primary group-hover/node:text-white transition-all">
                                  <ShieldCheck className="h-4 w-4" />
                              </div>
                              <p className="font-bold text-[10px] uppercase tracking-widest">Security Status</p>
                          </div>
                          <p className="text-xs font-bold truncate">Secure Connection</p>
                          <p className="text-[8px] font-bold text-muted-foreground mt-1 uppercase tracking-widest">Encrypted</p>
                      </Card>
                  </div>
              </div>
              <div className="h-1 w-full bg-gradient-to-r from-primary via-accent to-blue-400"></div>
          </Card>
        </MotionWrapper>

        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
              <section>
                  <div className="flex items-center justify-between mb-4 border-b border-primary/5 pb-2">
                      <div className="flex items-center gap-2.5 text-primary/40">
                          <TrendingUp className="h-4 w-4" />
                          <h2 className="text-[10px] font-bold tracking-widest text-foreground/80 uppercase">Community Discussions</h2>
                      </div>
                      <Button variant="link" className="h-auto p-0 text-[10px] font-bold uppercase tracking-widest" asChild>
                          <Link href="/dashboard/research-analytics">View All Posts</Link>
                      </Button>
                  </div>
                  <div className="space-y-4">
                      {postsLoading ? (
                          <div className="space-y-4">
                              {[...Array(2)].map((_, i) => (
                                  <Card key={i} className="h-28 animate-pulse border-primary/5 rounded-2xl bg-muted/10" />
                              ))}
                          </div>
                      ) : latestPosts.length === 0 ? (
                          <Card className="py-16 text-center glass rounded-[2rem] border-dashed border-2 border-primary/5 opacity-30">
                              <p className="font-bold text-[10px] tracking-tight">No discussions yet...</p>
                          </Card>
                      ) : (
                          <div className="grid gap-4">
                              {latestPosts.map((post) => (
                                  <PostCard key={post.id} post={post} userProfile={userProfile} isAdmin={isAdmin || false} />
                              ))}
                          </div>
                      )}
                  </div>
              </section>
          </div>

          <div className="lg:col-span-4 space-y-6">
              <section>
                  <div className="flex items-center justify-between mb-4 border-b border-primary/5 pb-2">
                      <div className="flex items-center gap-2.5 text-primary/40">
                          <Sparkles className="h-4 w-4" />
                          <h2 className="text-[10px] font-bold tracking-widest text-foreground/80 uppercase">Tools & Features</h2>
                      </div>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                      {aiFeatures.map((f) => (
                        <Link key={f.href} href={f.href} className="block group" onMouseEnter={() => playSound('hover')}>
                            <Card className="h-full glass p-4 rounded-2xl border-primary/5 group-hover:border-primary/20 transition-all text-left relative overflow-hidden shadow-sm hover:shadow-xl group-active:scale-95">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 rounded-xl bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                                        <f.icon className="h-4 w-4" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-[11px] tracking-tight text-foreground uppercase leading-none">{f.title}</h3>
                                        <p className="text-[9px] font-medium text-muted-foreground mt-1">{f.desc}</p>
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
