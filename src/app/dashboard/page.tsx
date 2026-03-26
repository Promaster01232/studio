"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  Search,
  FileText,
  FileSignature,
  BrainCircuit,
  Library,
  HeartHandshake,
  Landmark,
  Gavel,
  ArrowRight,
  Sparkles,
  Activity,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Loader2,
  BadgeCheck,
  User,
  MoreVertical,
  Flag,
  Trash2,
  Twitter,
  Zap,
} from "lucide-react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth, useFirestore } from "@/firebase";
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
  deleteDoc, 
  addDoc, 
  serverTimestamp,
  getDoc
} from "firebase/firestore";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { Logo } from "@/components/logo";

const ADMIN_EMAILS = [
  'enterspaceindia@gmail.com', 
  'piyushkumarsingh23323@gmail.com',
  'piyushkumrsingh23323@gmail.com',
  'piyushkumrsingh23399@gmail.com'
];

interface Post {
    id: string;
    authorUid: string;
    authorName: string;
    authorAvatar?: string;
    createdAt: Timestamp;
    title: string;
    content: string;
    image?: string;
    link?: string;
    poll?: {
        options: { text: string; votes: number }[];
        voters?: string[];
    };
    likes: number;
    likedBy?: string[];
    comments: number;
    postType?: 'Idea' | 'Question' | 'Suggestion' | 'Poll';
    tags?: string[];
    isAnonymous?: boolean;
}

const NeuralRain = () => {
  return (
    <div className="neural-rain opacity-20">
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="rain-drop"
          style={{
            left: `${Math.random() * 100}%`,
            animationDuration: `${Math.random() * 2 + 1}s`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}
    </div>
  );
};

const MotionWrapper = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ 
        type: "spring",
        stiffness: 100,
        damping: 20,
        delay 
      }}
    >
      {children}
    </motion.div>
  );
};

function AuthorIdentityNode({ post, isAdmin }: { post: Post, isAdmin: boolean }) {
    const authorName = post.isAnonymous ? 'Anonymous' : post.authorName;
    const authorAvatar = post.isAnonymous ? undefined : post.authorAvatar;
    const fallback = post.isAnonymous ? 'A' : (authorName?.charAt(0) || '');

    return (
        <Link 
            href={post.isAnonymous ? "#" : `/dashboard/profile/${post.authorUid}`} 
            className={cn(
                "flex items-start gap-4 group/author transition-all active:scale-[0.98]",
                post.isAnonymous ? "pointer-events-none opacity-60" : "cursor-pointer"
            )}
        >
            <Avatar className="h-10 w-10 border-2 border-background shadow-lg rounded-xl group-hover/author:scale-105 transition-transform">
                {authorAvatar && <AvatarImage src={authorAvatar} alt={authorName} className="object-cover" />}
                <AvatarFallback className="font-black bg-primary/10 text-primary text-xs">{fallback}</AvatarFallback>
            </Avatar>
            <div className="flex-1 text-left">
                <div className="flex items-center gap-1.5">
                    <p className="font-black text-xs tracking-tight group-hover/author:text-primary transition-colors underline decoration-primary/0 group-hover/author:decoration-primary/30 underline-offset-4">{authorName}</p>
                    {isAdmin && <BadgeCheck className="h-3 w-3 text-blue-500" />}
                </div>
                <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest opacity-60">
                    {post.createdAt ? formatDistanceToNow(post.createdAt.toDate(), { addSuffix: true }) : '...'}
                </p>
            </div>
        </Link>
    );
}

function PostCard({ post }: { post: Post }) {
    const { toast } = useToast();
    const firestore = useFirestore();
    const auth = useAuth();
    const { currentUser } = auth;
    
    const [isVoting, setIsVoting] = useState(false);
    const [isLiking, setIsLiking] = useState(false);
    const [optimisticLikes, setOptimisticLikes] = useState(post.likes);
    const [optimisticLikedBy, setOptimisticLikedBy] = useState(post.likedBy || []);
    const [optimisticPoll, setOptimisticPoll] = useState(post.poll);

    const userHasLiked = optimisticLikedBy.includes(currentUser?.uid ?? '');
    const isAuthor = post.authorUid === currentUser?.uid;
    
    const handleLike = () => {
        if (!currentUser) return;
        if (isLiking) return;
        setIsLiking(true);

        const postRef = doc(firestore, "posts", post.id);
        setOptimisticLikes(prev => userHasLiked ? prev - 1 : prev + 1);
        setOptimisticLikedBy(prev => userHasLiked ? prev.filter(uid => uid !== currentUser.uid) : [...prev, currentUser.uid]);

        updateDoc(postRef, {
            likes: increment(userHasLiked ? -1 : 1),
            likedBy: userHasLiked ? arrayRemove(currentUser.uid) : arrayUnion(currentUser.uid)
        }).catch(() => {
            setOptimisticLikes(post.likes);
            setOptimisticLikedBy(post.likedBy || []);
        }).finally(() => setIsLiking(false));
    };

    const handleShare = (platform: 'whatsapp' | 'twitter' | 'copy') => {
        const shareText = `Check out this institutional transmission on Nyaya Sahayak: "${post.title}"\n\nRead more at: ${window.location.origin}/dashboard/research-analytics`;
        if (platform === 'whatsapp') window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
        else if (platform === 'twitter') window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank');
        else if (platform === 'copy') {
            navigator.clipboard.writeText(shareText);
            toast({ title: "Registry Link Copied" });
        }
    };

    const totalVotes = optimisticPoll ? optimisticPoll.options.reduce((acc, option) => acc + option.votes, 0) : 0;
    const userHasVotedOnPoll = optimisticPoll?.voters?.includes(currentUser?.uid ?? '');

    return (
        <Card className="glass border-primary/5 hover:border-primary/20 transition-all shadow-lg rounded-[2rem] overflow-hidden">
            <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <AuthorIdentityNode post={post} isAdmin={ADMIN_EMAILS.includes(post.authorUid)} />
                    {post.postType && (
                        <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/10 px-3 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest h-5">
                            {post.postType}
                        </Badge>
                    )}
                </div>
                <div className="space-y-3 text-left">
                    <h3 className="text-lg font-black font-headline leading-tight tracking-tighter text-foreground">{post.title}</h3>
                    {post.content && <p className="text-muted-foreground text-xs font-medium leading-relaxed line-clamp-3">{post.content}</p>}
                </div>
                
                {optimisticPoll && (
                    <div className="mt-4 space-y-2">
                        {optimisticPoll.options.slice(0, 2).map((option, index) => (
                            <div key={index} className="relative h-10 w-full bg-muted/20 rounded-xl overflow-hidden border border-primary/5">
                                <div className="absolute inset-y-0 left-0 bg-primary/10 transition-all duration-1000" style={{ width: `${totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0}%` }}></div>
                                <div className="absolute inset-0 flex items-center justify-between px-4 text-[10px] font-black uppercase tracking-tight">
                                    <span>{option.text}</span>
                                    {userHasVotedOnPoll && <span>{totalVotes > 0 ? ((option.votes / totalVotes) * 100).toFixed(0) : 0}%</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
            <CardFooter className="px-6 py-4 bg-muted/5 border-t border-primary/5 flex justify-between items-center">
                <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="h-8 px-3 rounded-lg font-black text-[9px] uppercase tracking-widest gap-2 hover:bg-red-500/10 hover:text-red-500" onClick={handleLike}>
                        <Heart className={cn("h-3.5 w-3.5", userHasLiked && "fill-red-500 text-red-500")} />
                        <span>{optimisticLikes}</span>
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-primary/10">
                                <Share2 className="h-3.5 w-3.5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 rounded-xl p-2 shadow-2xl glass border-primary/5">
                            <DropdownMenuItem onClick={() => handleShare('whatsapp')} className="rounded-lg font-bold text-xs h-10 px-3 cursor-pointer gap-3">
                                <MessageCircle className="h-3.5 w-3.5 text-green-600" /> WhatsApp
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleShare('twitter')} className="rounded-lg font-bold text-xs h-10 px-3 cursor-pointer gap-3">
                                <Twitter className="h-3.5 w-3.5 text-blue-500" /> Twitter
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <Button variant="ghost" size="sm" className="h-8 rounded-lg font-black text-[9px] uppercase tracking-widest gap-2 hover:bg-primary/10" asChild>
                    <Link href="/dashboard/research-analytics">
                        Inspect <ArrowRight className="h-3 w-3" />
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}

const aiFeatures = [
    {
      href: "/dashboard/strength-analyzer",
      icon: BrainCircuit,
      title: "Strength Analyzer",
      description: "Neural case assessment and probability auditing.",
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    {
      href: "/dashboard/document-intelligence",
      icon: Search,
      title: "Doc Intelligence",
      description: "Forensic risk auditor for statutory compliance.",
      color: "text-emerald-500",
      bg: "bg-emerald-500/10"
    },
    {
      href: "/dashboard/document-generator",
      icon: FileText,
      title: "Doc Generator",
      description: "Automated legal drafting for formal petitions.",
      color: "text-amber-500",
      bg: "bg-amber-500/10"
    },
    {
      href: "/dashboard/bond-generator",
      icon: FileSignature,
      title: "Bond Generator",
      description: "Structural bond creation and affidavit drafting.",
      color: "text-purple-500",
      bg: "bg-purple-500/10"
    },
];

const SectionTitle = ({children}: {children: React.ReactNode}) => (
    <div className="flex items-center gap-3 mb-6">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/10 to-transparent"></div>
        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">{children}</h2>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/10 to-transparent"></div>
    </div>
)

export default function DashboardHomePage() {
  const [text, setText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const fullText = 'Nyaya Sahayak';
  
  const firestore = useFirestore();
  const [latestPosts, setLatestPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);

  useEffect(() => {
    const postsRef = collection(firestore, "posts");
    const q = query(postsRef, orderBy("createdAt", "desc"), limit(20));
    
    const unsubscribe = onSnapshot(q, (snap) => {
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as Post));
        setLatestPosts(list);
        setPostsLoading(false);
    });

    return () => unsubscribe();
  }, [firestore]);
  
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isTyping) {
      if (text.length < fullText.length) {
        timeoutId = setTimeout(() => setText(fullText.slice(0, text.length + 1)), 150);
      } else {
        timeoutId = setTimeout(() => setIsTyping(false), 3000);
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
    <div className="flex flex-col h-full space-y-12 pb-20 max-w-7xl mx-auto px-2 sm:px-0 text-left">
        <MotionWrapper>
          <div className="relative p-8 sm:p-16 rounded-[2.5rem] overflow-hidden bg-primary/5 border border-primary/10 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
              <NeuralRain />
              <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                  <Landmark className="h-64 w-64" />
              </div>
              <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-2 text-primary">
                      <Sparkles className="h-4 w-4 animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-[0.3em]">Neural Terminal Active</span>
                  </div>
                  <h1 className="text-4xl sm:text-7xl font-black font-headline tracking-tighter leading-none text-foreground">
                      Welcome to <br />
                      <span className="bg-gradient-to-r from-primary via-accent to-blue-400 bg-clip-text text-transparent animate-animated-gradient bg-[200%_auto] italic">{text}</span>
                      <span className="animate-pulse ml-1 text-primary">|</span>
                  </h1>
                  <p className="text-sm sm:text-xl text-muted-foreground font-medium max-w-2xl leading-relaxed">
                      Access high-fidelity legal intelligence and forensic tools designed for the modern Indian judicial landscape. Our ecosystem empowers you with mathematically precise statutory audits and procedural navigation roadmaps.
                  </p>
                  <div className="flex flex-wrap gap-4 pt-4">
                      <Button size="lg" className="rounded-2xl font-black uppercase tracking-widest text-xs px-8 h-14 shadow-2xl shadow-primary/20 active:scale-95 transition-all" asChild>
                          <Link href="/dashboard/narrate">Initialize Narration</Link>
                      </Button>
                      <Button variant="outline" size="lg" className="rounded-2xl font-black uppercase tracking-widest text-xs px-8 h-14 border-primary/10 glass hover:bg-primary/5 active:scale-95 transition-all" asChild>
                          <Link href="/dashboard/support">Institutional Support</Link>
                      </Button>
                  </div>
              </div>
          </div>
        </MotionWrapper>

        <div className="space-y-16">
          <section>
              <MotionWrapper delay={0.1}>
                <SectionTitle>Primary Forensic Audit Nodes</SectionTitle>
              </MotionWrapper>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <MotionWrapper delay={0.2}>
                    <Link href="/dashboard/narrate" className="block group">
                        <Card className="h-full glass hover:border-primary/30 transition-all duration-500 overflow-hidden relative group rounded-[2.5rem] shadow-xl">
                            <CardContent className="p-10 flex items-center gap-8">
                                <div className="p-6 rounded-[1.5rem] bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-500 shadow-inner ring-1 ring-primary/20">
                                    <Mic className="h-10 w-10" />
                                </div>
                                <div className="space-y-2 flex-1">
                                    <h3 className="text-2xl font-black tracking-tight">Narrate Case Problem</h3>
                                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em] opacity-60">Forensic Voice Summary Unit</p>
                                    <p className="text-xs text-muted-foreground font-medium leading-relaxed max-w-xs">Convert natural speech into a structured statutory report with identified IPC/BNSS violations.</p>
                                </div>
                                <ArrowRight className="h-6 w-6 text-primary opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-500" />
                            </CardContent>
                        </Card>
                    </Link>
                  </MotionWrapper>
                  <MotionWrapper delay={0.3}>
                    <Link href="/dashboard/document-intelligence" className="block group">
                        <Card className="h-full glass hover:border-emerald-500/30 transition-all duration-500 overflow-hidden relative group rounded-[2.5rem] shadow-xl">
                            <CardContent className="p-10 flex items-center gap-8">
                                <div className="p-6 rounded-[1.5rem] bg-emerald-500/10 text-emerald-600 group-hover:scale-110 transition-transform duration-500 shadow-inner ring-1 ring-emerald-500/20">
                                    <Search className="h-10 w-10" />
                                </div>
                                <div className="space-y-2 flex-1">
                                    <h3 className="text-2xl font-black tracking-tight">Document Intelligence</h3>
                                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em] opacity-60">Neural Risk Assessment Node</p>
                                    <p className="text-xs text-muted-foreground font-medium leading-relaxed max-w-xs">Perform a deep-layer forensic audit of legal contracts to detect hidden liabilities and deadlines.</p>
                                </div>
                                <ArrowRight className="h-6 w-6 text-emerald-600 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-500" />
                            </CardContent>
                        </Card>
                    </Link>
                  </MotionWrapper>
              </div>
          </section>

          <section>
              <MotionWrapper delay={0.4}>
                <SectionTitle>Institutional AI Toolkit</SectionTitle>
              </MotionWrapper>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  {aiFeatures.map((feature, index) => (
                    <MotionWrapper key={feature.href} delay={0.5 + index * 0.1}>
                      <Link href={feature.href} className="block group h-full">
                          <Card className="h-full glass p-8 flex flex-col items-start hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 active:scale-[0.97] rounded-[2rem] border-primary/5">
                              <div className={cn("p-4 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-500 shadow-sm ring-1 ring-white/10", feature.bg, feature.color)}>
                                <feature.icon className="h-6 w-6" />
                              </div>
                              <h3 className="font-black text-lg tracking-tight leading-tight">{feature.title}</h3>
                              <p className="text-[10px] text-muted-foreground mt-3 leading-relaxed font-bold uppercase tracking-widest opacity-60">{feature.description}</p>
                              <div className="mt-6 flex items-center text-[9px] font-black text-primary uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity">
                                Initialize Node <ArrowRight className="ml-2 h-3 w-3" />
                              </div>
                          </Card>
                      </Link>
                    </MotionWrapper>
                  ))}
              </div>
          </section>

          <section>
              <MotionWrapper delay={0.6}>
                <SectionTitle>Latest Community Transmissions</SectionTitle>
              </MotionWrapper>
              
              {postsLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[...Array(6)].map((_, i) => (
                          <Card key={i} className="glass rounded-[2rem] h-48 animate-pulse border-primary/5" />
                      ))}
                  </div>
              ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <AnimatePresence>
                          {latestPosts.map((post, index) => (
                              <motion.div
                                  key={post.id}
                                  initial={{ opacity: 0, scale: 0.95 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: index * 0.05 }}
                              >
                                  <PostCard post={post} />
                              </motion.div>
                          ))}
                      </AnimatePresence>
                  </div>
              )}
              
              <div className="mt-8 flex justify-center">
                  <Button variant="ghost" className="font-black uppercase tracking-widest text-[10px] gap-3 rounded-xl hover:bg-primary/5" asChild>
                      <Link href="/dashboard/research-analytics">
                          View All Community Data <ArrowRight className="h-4 w-4" />
                      </Link>
                  </Button>
              </div>
          </section>

          <section>
            <MotionWrapper delay={0.8}>
              <SectionTitle>Platform Infrastructure & Resources</SectionTitle>
            </MotionWrapper>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { href: "/dashboard/learn", icon: Library, title: "Knowledge Hub", desc: "Constitutional and statutory forensic guides." },
                { href: "/dashboard/ngo-legal-aid", icon: HeartHandshake, title: "Legal Aid Node", desc: "Connect with verified pro-bono organizations." },
                { href: "/dashboard/my-cases", icon: Landmark, title: "Case Registry", desc: "Secure synchronization with official eCourts." },
              ].map((item, index) => (
                <MotionWrapper key={item.href} delay={0.9 + index * 0.1}>
                  <Link href={item.href} className="block group">
                    <Card className="glass group-hover:border-primary/30 transition-all duration-500 rounded-[2rem] shadow-lg hover:shadow-2xl border-primary/5">
                      <CardContent className="p-8 text-left">
                        <div className="flex items-center gap-5">
                          <div className="p-4 rounded-2xl bg-muted group-hover:bg-primary/10 group-hover:text-primary transition-colors shadow-inner ring-1 ring-black/5">
                            <item.icon className="h-6 w-6" />
                          </div>
                          <div className="min-w-0 space-y-1">
                            <h3 className="font-black text-base tracking-tight truncate">{item.title}</h3>
                            <p className="text-[10px] text-muted-foreground font-bold truncate uppercase tracking-widest opacity-60">{item.desc}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </MotionWrapper>
              ))}
            </div>
          </section>
        </div>

        <MotionWrapper delay={1.2}>
            <div className="pt-12 text-center border-t border-primary/5">
                <p className="text-[9px] font-black uppercase tracking-[0.5em] text-muted-foreground/40 mb-2">Institutional System ID: NS-ALPHA-NODE-001</p>
                <p className="text-[10px] font-bold text-primary/60 italic">"Engineering Dignity through Precise Legal Intelligence."</p>
            </div>
        </MotionWrapper>
    </div>
  );
}
