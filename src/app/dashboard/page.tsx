
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
  Lock,
  Gavel,
  ShieldAlert,
  Cpu,
  Fingerprint,
  Layers,
  FileCheck,
  Globe
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
        <Card className="overflow-hidden bg-card/40 backdrop-blur-md border-primary/5 hover:border-primary/20 transition-all rounded-2xl shadow-sm text-left group">
            <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                        <Avatar className="h-8 w-8 rounded-lg shadow-sm">
                            <AvatarImage src={post.authorAvatar} />
                            <AvatarFallback className="bg-primary/5 text-primary text-[10px] font-bold">{post.authorName?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-black text-[11px] uppercase tracking-tight">{post.authorName}</p>
                            <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest opacity-40">
                                {post.createdAt ? formatDistanceToNow(post.createdAt.toDate(), { addSuffix: true }) : 'Just now'}
                            </p>
                        </div>
                    </div>
                </div>
                <h3 className="font-bold text-sm mb-1.5 leading-tight group-hover:text-primary transition-colors">{post.title}</h3>
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
    { href: "/dashboard/strength-analyzer", icon: BrainCircuit, title: "Case Strength", desc: "Litigation success probability.", color: "text-blue-500", bg: "bg-blue-500/10" },
    { href: "/dashboard/document-intelligence", icon: Search, title: "Forensic Analysis", desc: "Scan documents for hidden risks.", color: "text-amber-600", bg: "bg-amber-500/10" },
    { href: "/dashboard/document-generator", icon: FileText, title: "Statutory Drafting", desc: "Generate professional legal notices.", color: "text-emerald-600", bg: "bg-emerald-500/10" },
    { href: "/dashboard/bond-generator", icon: FileSignature, title: "Bond Protocol", desc: "Official bail and indemnity bonds.", color: "text-purple-600", bg: "bg-purple-500/10" },
    { href: "/dashboard/evidence-audit", icon: ShieldCheck, title: "Evidence Audit", desc: "Verify evidence consistency.", color: "text-cyan-500", bg: "bg-cyan-500/10" },
    { href: "/dashboard/bail-estimator", icon: Gavel, title: "Bail Matrix", desc: "AI-powered bail success estimator.", color: "text-rose-500", bg: "bg-rose-500/10" },
    { href: "/dashboard/statutory-linker", icon: Zap, title: "BNS Linker", desc: "Maps cases to latest BNS sections.", color: "text-indigo-500", bg: "bg-indigo-500/10" },
    { href: "/dashboard/contract-auditor", icon: FileCheck, title: "Contract Audit", desc: "Identify unfavorable clauses.", color: "text-teal-600", bg: "bg-teal-600/10" },
];

export default function DashboardHomePage(props: { params: Promise<any>, searchParams: Promise<any> }) {
  use(props.params);
  use(props.searchParams);

  const [text, setText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const fullText = 'Sahayak';
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
    <div className="flex flex-col h-full space-y-10 pb-12 max-w-7xl mx-auto text-left relative pt-2">
        <MotionWrapper>
          <Card className="relative overflow-hidden border-none bg-card/40 backdrop-blur-xl shadow-2xl rounded-[2.5rem] group transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5 pointer-events-none" />
              <div className="p-8 sm:p-16 relative z-10 flex flex-col lg:flex-row items-center gap-12">
                  <div className="flex-1 space-y-10 text-center lg:text-left">
                      <div className="space-y-6">
                          <h1 className="text-4xl sm:text-7xl font-black tracking-tight text-foreground leading-[1.1]">
                              Nyaya <span className="animate-pan italic">{text}</span>
                          </h1>
                          <p className="text-base sm:text-xl text-muted-foreground font-medium max-w-2xl leading-relaxed">
                              India's premier AI legal command center. Experience elite-grade forensic intelligence and statutory navigational roadmaps.
                          </p>
                      </div>

                      <div className="flex flex-wrap items-center justify-center lg:justify-start gap-5">
                          <Button size="lg" className="rounded-2xl font-black uppercase tracking-widest h-14 px-10 shadow-2xl shadow-primary/20 active:scale-95 transition-all group overflow-hidden text-[10px]" asChild>
                              <Link href="/dashboard/narrate">
                                  <Mic className="h-4 w-4 mr-3" /> Initialize Case Record <ArrowRight className="h-4 w-4 ml-3 transition-transform group-hover:translate-x-1" />
                              </Link>
                          </Button>
                          <Button variant="ghost" className="h-14 rounded-2xl px-8 font-black uppercase tracking-widest text-primary text-[10px] hover:bg-primary/5" asChild>
                              <Link href="/dashboard/learn">Knowledge Ingress</Link>
                          </Button>
                      </div>
                  </div>

                  <div className="hidden lg:flex w-80 shrink-0 flex-col gap-4">
                      <Card className="bg-background/50 border-primary/5 p-5 rounded-[1.5rem] shadow-md hover:shadow-lg transition-all group/status border-l-4 border-l-green-500">
                          <div className="flex items-center gap-3 mb-2">
                              <div className="p-2 rounded-lg bg-green-500/10 group-hover/status:bg-green-500/20 transition-colors">
                                <Activity className="h-4 w-4 text-green-600 animate-pulse" />
                              </div>
                              <p className="font-black text-[9px] uppercase tracking-widest text-muted-foreground">Neural Status</p>
                          </div>
                          <p className="text-xs font-black text-green-600 uppercase">Terminal Synchronized</p>
                      </Card>
                      <Card className="bg-background/50 border-primary/5 p-5 rounded-[1.5rem] shadow-md hover:shadow-lg transition-all group/sec border-l-4 border-l-primary">
                          <div className="flex items-center gap-3 mb-2">
                              <div className="p-2 rounded-lg bg-primary/10 group-hover/sec:bg-primary/20 transition-colors">
                                <ShieldCheck className="h-4 w-4 text-primary" />
                              </div>
                              <p className="font-black text-[9px] uppercase tracking-widest text-muted-foreground">Forensic Shield</p>
                          </div>
                          <p className="text-xs font-black text-primary uppercase">Active Encryption Node</p>
                      </Card>
                      <div className="px-4 py-2 bg-primary/5 rounded-xl border border-primary/10 text-center">
                          <p className="text-[8px] font-black uppercase tracking-[0.4em] text-primary/60">Institutional ID: NS-ALPHA-4.2</p>
                      </div>
                  </div>
              </div>
              <div className="h-1.5 w-full bg-gradient-to-r from-primary via-blue-400 to-primary"></div>
          </Card>
        </MotionWrapper>

        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-10">
              <section>
                  <div className="flex items-center justify-between mb-8 pb-3 border-b border-primary/10">
                      <div className="flex items-center gap-3 text-primary">
                          <Sparkles className="h-5 w-5" />
                          <h2 className="text-sm font-black tracking-[0.3em] uppercase">Elite AI Suite</h2>
                      </div>
                      <Badge variant="outline" className="font-black text-[8px] uppercase tracking-widest border-primary/20 text-primary">8 Forensic Modules Active</Badge>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {aiFeatures.map((f, i) => (
                        <motion.div key={f.href} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + (i * 0.05) }}>
                            <Link href={f.href} className="block group" onMouseEnter={() => playSound('hover')}>
                                <Card className="p-6 rounded-[1.8rem] border-primary/5 hover:border-primary/20 hover:bg-card transition-all text-left shadow-xl group-active:scale-[0.98] relative overflow-hidden h-full">
                                    <div className="flex items-start gap-5 relative z-10">
                                        <div className={cn(
                                            "p-4 rounded-2xl transition-all shadow-lg shrink-0",
                                            f.bg, f.color, "group-hover:scale-110"
                                        )}>
                                            <f.icon className="h-6 w-6" />
                                        </div>
                                        <div className="flex-1 space-y-1.5 min-w-0">
                                            <h3 className="font-black text-base tracking-tight text-foreground uppercase leading-none group-hover:text-primary transition-colors truncate">{f.title}</h3>
                                            <p className="text-[11px] text-muted-foreground font-bold leading-relaxed">{f.desc}</p>
                                        </div>
                                        <ChevronRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0 mt-1" />
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Card>
                            </Link>
                        </motion.div>
                      ))}
                  </div>
              </section>

              <section>
                  <div className="flex items-center justify-between mb-8 pb-3 border-b border-primary/10">
                      <div className="flex items-center gap-3 text-primary/60">
                          <TrendingUp className="h-5 w-5" />
                          <h2 className="text-sm font-black tracking-[0.3em] uppercase">Statutory Transmissions</h2>
                      </div>
                      <Button variant="link" className="h-auto p-0 text-[10px] font-black uppercase tracking-widest text-primary hover:no-underline" asChild>
                          <Link href="/dashboard/research-analytics" className="flex items-center gap-2">
                            Access Global Feed <ChevronRight className="h-3 w-3" />
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

          <div className="lg:col-span-4 space-y-10">
              <section className="space-y-6">
                  <div className="flex items-center gap-3 text-primary/60 mb-6 pb-3 border-b border-primary/10">
                      <Fingerprint className="h-5 w-5" />
                      <h2 className="text-sm font-black tracking-[0.3em] uppercase">Registry Insights</h2>
                  </div>
                  <Card className="glass border-primary/10 rounded-[2rem] overflow-hidden shadow-2xl relative">
                      <div className="absolute top-0 right-0 p-6 opacity-[0.02] pointer-events-none">
                          <Logo className="h-32 w-32" />
                      </div>
                      <div className="p-8 space-y-8 relative z-10">
                          <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">BNS Audit Volume</span>
                                  <span className="text-xs font-black text-primary">High</span>
                              </div>
                              <div className="h-1.5 w-full bg-primary/5 rounded-full overflow-hidden">
                                  <motion.div initial={{ width: 0 }} animate={{ width: "78%" }} className="h-full bg-primary" />
                              </div>
                          </div>
                          
                          <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Expert Availability</span>
                                  <span className="text-xs font-black text-green-600">Optimal</span>
                              </div>
                              <div className="h-1.5 w-full bg-green-500/5 rounded-full overflow-hidden">
                                  <motion.div initial={{ width: 0 }} animate={{ width: "92%" }} className="h-full bg-green-500" />
                              </div>
                          </div>

                          <div className="pt-6 border-t border-primary/5 text-center">
                              <p className="text-[9px] font-bold text-muted-foreground italic leading-relaxed">
                                  "Real-time forensic telemetry provided by the Nyaya Sahayak Neural Core."
                              </p>
                          </div>
                      </div>
                  </Card>

                  <Card className="bg-primary border-none rounded-[2rem] overflow-hidden shadow-2xl shadow-primary/20 relative group cursor-pointer" asChild>
                      <Link href="/dashboard/billing">
                        <div className="p-8 text-white relative z-10 space-y-6">
                            <div className="flex justify-between items-start">
                                <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-md">
                                    <Zap className="h-6 w-6 text-white" />
                                </div>
                                <Badge className="bg-white text-primary font-black text-[8px] uppercase tracking-widest">Elite Access</Badge>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black tracking-tighter uppercase leading-none">Upgrade Node</h3>
                                <p className="text-white/70 text-xs font-medium leading-relaxed">Unlock the full potential of forensic AI terminals.</p>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-white/10 w-fit px-4 py-2 rounded-xl">
                                Explore Plans <ChevronRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                  </Card>
              </section>
          </div>
        </div>
    </div>
  );
}
