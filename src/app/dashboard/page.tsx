
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
  ChevronRight,
  TrendingUp,
  Newspaper,
  Link as LinkIcon,
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
  getDoc,
} from "firebase/firestore";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
                "flex items-center gap-3 group/author transition-all active:scale-[0.98]",
                post.isAnonymous ? "pointer-events-none opacity-60" : "cursor-pointer"
            )}
        >
            <Avatar className="h-10 w-10 border-2 border-background shadow-lg rounded-xl group-hover/author:scale-105 transition-transform">
                {authorAvatar && <AvatarImage src={authorAvatar} alt={authorName} className="object-cover" />}
                <AvatarFallback className="font-black bg-primary/10 text-primary text-xs">{fallback}</AvatarFallback>
            </Avatar>
            <div className="flex-1 text-left">
                <div className="flex items-center gap-1.5">
                    <p className="font-black text-[13px] tracking-tight group-hover/author:text-primary transition-colors">{authorName}</p>
                    {isAdmin && <BadgeCheck className="h-3.5 w-3.5 text-blue-500" />}
                </div>
                <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest opacity-60">
                    {post.createdAt ? formatDistanceToNow(post.createdAt.toDate(), { addSuffix: true }) : '...'}
                </p>
            </div>
        </Link>
    );
}

function PostCard({ post, userProfile }: { post: Post, userProfile: any }) {
    const { toast } = useToast();
    const firestore = useFirestore();
    const auth = useAuth();
    const { currentUser } = auth;
    
    const [isLiking, setIsLiking] = useState(false);
    const [optimisticLikes, setOptimisticLikes] = useState(post.likes);
    const [optimisticLikedBy, setOptimisticLikedBy] = useState(post.likedBy || []);
    const [optimisticPoll, setOptimisticPoll] = useState(post.poll);

    const userHasLiked = optimisticLikedBy.includes(currentUser?.uid ?? '');
    const isAdmin = currentUser?.email && (ADMIN_EMAILS.includes(currentUser.email.toLowerCase()) || userProfile?.isAdmin);
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
        }).then(() => {
            if (!userHasLiked && post.authorUid !== currentUser.uid) {
                addDoc(collection(firestore, "notifications"), {
                    userId: post.authorUid,
                    type: 'like',
                    title: 'Transmission Liked',
                    description: `${userProfile?.firstName || 'A citizen'} liked your post: "${post.title}"`,
                    isRead: false,
                    createdAt: serverTimestamp()
                });
            }
        }).catch(() => {
            setOptimisticLikes(post.likes);
            setOptimisticLikedBy(post.likedBy || []);
        }).finally(() => setIsLiking(false));
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to purge this transmission from the registry?")) return;
        try {
            await deleteDoc(doc(firestore, "posts", post.id));
            toast({ title: "Transmission Purged", description: "The node has been erased from the official registry." });
        } catch (error) {
            toast({ variant: "destructive", title: "Action Refused", description: "Insufficient node permissions." });
        }
    };

    const handleReport = () => {
        toast({ title: "Transmission Flagged", description: "Our forensic moderation unit will review this node." });
    };

    const handleShare = (platform: 'whatsapp' | 'twitter' | 'copy') => {
        const shareText = `Institutional transmission on Nyaya Sahayak: "${post.title}"\n\nRead more at: ${window.location.origin}/dashboard/research-analytics`;
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
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            whileHover={{ y: -4 }}
            className="w-full"
        >
            <Card className="group relative overflow-hidden glass border-primary/10 hover:border-primary/30 transition-all duration-500 shadow-2xl rounded-[2.5rem] flex flex-col sm:flex-row h-full min-h-[320px]">
                {/* Visual Identity Strip */}
                <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-gradient-to-b from-primary via-accent to-blue-400 group-hover:w-2 transition-all duration-500 hidden sm:block"></div>
                
                {/* News Image Section (Left) */}
                <div className="relative w-full sm:w-[300px] md:w-[380px] h-48 sm:h-auto overflow-hidden shrink-0">
                    {post.image ? (
                        <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            className="object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                    ) : (
                        <div className="absolute inset-0 bg-primary/5 flex items-center justify-center">
                            <Logo className="h-20 w-20 opacity-[0.05]" />
                            <Newspaper className="h-16 w-16 text-primary/10 absolute animate-pulse" />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent sm:hidden"></div>
                    <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
                        <Badge className="bg-primary text-white font-black text-[9px] uppercase tracking-[0.2em] shadow-2xl px-4 py-1.5 rounded-full backdrop-blur-md">
                            {post.postType || 'Transmission'}
                        </Badge>
                    </div>
                </div>

                {/* Content Section (Right) */}
                <div className="flex-1 flex flex-col p-6 sm:p-10 text-left">
                    <div className="flex items-center justify-between mb-6">
                        <AuthorIdentityNode post={post} isAdmin={ADMIN_EMAILS.includes(post.authorUid)} />
                        <div className="flex items-center gap-2">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-2xl hover:bg-primary/5 active:scale-90 transition-all">
                                        <MoreVertical className="h-5 w-5 text-muted-foreground" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56 rounded-[1.5rem] p-3 shadow-2xl glass border-primary/5">
                                    <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-2 px-2">Node Protocols</DropdownMenuLabel>
                                    {(isAuthor || isAdmin) ? (
                                        <DropdownMenuItem onSelect={handleDelete} className="rounded-xl font-bold text-xs h-11 px-4 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10 gap-3">
                                            <Trash2 className="h-4 w-4" /> Purge from Registry
                                        </DropdownMenuItem>
                                    ) : (
                                        <DropdownMenuItem onSelect={handleReport} className="rounded-xl font-bold text-xs h-11 px-4 cursor-pointer gap-3">
                                            <Flag className="h-4 w-4" /> Flag for Audit
                                        </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem className="rounded-xl font-bold text-xs h-11 px-4 cursor-pointer gap-3" onSelect={() => handleShare('copy')}>
                                        <Bookmark className="h-4 w-4" /> Save Citation
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    <div className="space-y-4 flex-1 mb-8">
                        <h3 className="text-2xl sm:text-4xl font-black font-headline leading-none tracking-tighter text-foreground group-hover:text-primary transition-colors duration-500 line-clamp-2">
                            {post.title}
                        </h3>
                        <p className="text-muted-foreground text-sm sm:text-base font-medium leading-relaxed line-clamp-3">
                            {post.content}
                        </p>
                        
                        {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-2">
                                {post.tags.map(tag => (
                                    <span key={tag} className="text-[10px] font-black text-primary/60 uppercase tracking-widest bg-primary/5 px-3 py-1 rounded-lg border border-primary/10">#{tag}</span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer / Interaction Node */}
                    <div className="flex items-center justify-between pt-8 border-t border-primary/5">
                        <div className="flex items-center gap-4">
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className={cn(
                                    "h-11 px-5 rounded-2xl font-black text-[11px] uppercase tracking-widest gap-3 transition-all active:scale-95 shadow-sm",
                                    userHasLiked ? "bg-red-500 text-white shadow-red-500/20 hover:bg-red-600" : "bg-primary/5 hover:bg-primary/10 text-primary"
                                )}
                                onClick={handleLike}
                                disabled={isLiking}
                            >
                                {isLiking ? <Loader2 className="h-4 w-4 animate-spin" /> : <Heart className={cn("h-4 w-4", userHasLiked && "fill-current scale-110")} />}
                                <span>{optimisticLikes} Impact</span>
                            </Button>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="h-11 w-11 rounded-2xl border-primary/10 hover:bg-primary/5 hover:border-primary/30 transition-all shadow-sm">
                                        <Share2 className="h-4 w-4 text-primary" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start" className="w-56 rounded-[1.5rem] p-3 shadow-2xl glass border-primary/5">
                                    <DropdownMenuItem onSelect={() => handleShare('whatsapp')} className="rounded-xl font-bold text-xs h-11 px-4 cursor-pointer gap-3">
                                        <MessageCircle className="h-4 w-4 text-green-600" /> WhatsApp
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onSelect={() => handleShare('twitter')} className="rounded-xl font-bold text-xs h-11 px-4 cursor-pointer gap-3">
                                        <Twitter className="h-4 w-4 text-blue-500" /> Twitter (X)
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onSelect={() => handleShare('copy')} className="rounded-xl font-bold text-xs h-11 px-4 cursor-pointer gap-3">
                                        <LinkIcon className="h-4 w-4 text-primary" /> Copy Link
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        <Button 
                            variant="ghost" 
                            className="h-11 px-6 rounded-2xl font-black text-[11px] uppercase tracking-widest gap-3 hover:bg-primary hover:text-white transition-all group/btn shadow-xl hover:shadow-primary/20 active:translate-x-1"
                            asChild
                        >
                            <Link href="/dashboard/research-analytics">
                                Inspect Node <ChevronRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </Card>
        </motion.div>
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

const SectionTitle = ({children, icon: Icon}: {children: React.ReactNode, icon?: any}) => (
    <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
            {Icon && <Icon className="h-6 w-6 text-primary opacity-40" />}
            <h2 className="text-xl sm:text-3xl font-black font-headline tracking-tighter text-foreground uppercase">{children}</h2>
        </div>
        <div className="h-px flex-1 bg-gradient-to-r from-primary/10 to-transparent ml-8 hidden sm:block"></div>
    </div>
)

export default function DashboardHomePage() {
  const [text, setText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const fullText = 'Nyaya Sahayak';
  
  const firestore = useFirestore();
  const auth = useAuth();
  const [latestPosts, setLatestPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);

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
    if (auth.currentUser) {
      const userDocRef = doc(firestore, "users", auth.currentUser.uid);
      getDoc(userDocRef).then(docSnap => {
        if (docSnap.exists()) {
          setUserProfile(docSnap.data());
        }
      });
    }
  }, [auth.currentUser, firestore]);
  
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
    <div className="flex flex-col h-full space-y-20 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        <MotionWrapper>
          <div className="relative p-8 sm:p-20 rounded-[3rem] overflow-hidden bg-primary/5 border border-primary/10 shadow-[0_50px_100px_rgba(0,0,0,0.05)] group">
              <NeuralRain />
              <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                  <Landmark className="h-80 w-80" />
              </div>
              <div className="relative z-10 space-y-8">
                  <div className="flex items-center gap-3 text-primary">
                      <div className="p-2 rounded-xl bg-primary/10 animate-pulse">
                        <Sparkles className="h-5 w-5" />
                      </div>
                      <span className="text-xs font-black uppercase tracking-[0.5em] leading-none">Institutional Node Alpha-4</span>
                  </div>
                  <h1 className="text-5xl sm:text-8xl font-black font-headline tracking-tighter leading-none text-foreground">
                      Welcome to <br />
                      <span className="bg-gradient-to-r from-primary via-accent to-blue-400 bg-clip-text text-transparent animate-animated-gradient bg-[200%_auto] italic">{text}</span>
                      <span className="animate-pulse ml-1 text-primary">|</span>
                  </h1>
                  <p className="text-base sm:text-2xl text-muted-foreground font-medium max-w-2xl leading-relaxed">
                      Access high-fidelity legal intelligence and forensic tools designed for the modern Indian judicial landscape.
                  </p>
                  <div className="flex flex-wrap gap-6 pt-6">
                      <Button size="lg" className="rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[11px] px-10 h-16 shadow-2xl shadow-primary/20 active:scale-95 transition-all group/hero" asChild>
                          <Link href="/dashboard/narrate">
                            Initialize Narration <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover/hero:translate-x-2" />
                          </Link>
                      </Button>
                      <Button variant="outline" size="lg" className="rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[11px] px-10 h-16 border-primary/10 glass hover:bg-primary/5 active:scale-95 transition-all" asChild>
                          <Link href="/dashboard/support">Hub Support</Link>
                      </Button>
                  </div>
              </div>
          </div>
        </MotionWrapper>

        <div className="space-y-24">
          <section id="transmissions">
              <MotionWrapper delay={0.1}>
                <SectionTitle icon={TrendingUp}>Latest Community Transmissions</SectionTitle>
              </MotionWrapper>
              
              <div className="grid grid-cols-1 gap-8">
                  {postsLoading ? (
                      <div className="space-y-8">
                          {[...Array(3)].map((_, i) => (
                              <Card key={i} className="glass rounded-[2.5rem] h-[320px] animate-pulse border-primary/5" />
                          ))}
                      </div>
                  ) : (
                      <div className="space-y-8">
                          <AnimatePresence mode="popLayout">
                              {latestPosts.map((post, index) => (
                                  <PostCard key={post.id} post={post} userProfile={userProfile} />
                              ))}
                          </AnimatePresence>
                      </div>
                  )}
              </div>
              
              <div className="mt-12 flex justify-center">
                  <Button variant="ghost" className="h-14 px-10 rounded-2xl font-black uppercase tracking-[0.3em] text-[11px] gap-4 hover:bg-primary/5 group transition-all" asChild>
                      <Link href="/dashboard/research-analytics">
                          Sync Full Registry <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-2" />
                      </Link>
                  </Button>
              </div>
          </section>

          <section>
              <MotionWrapper delay={0.3}>
                <SectionTitle icon={Zap}>Primary Forensic Audit Nodes</SectionTitle>
              </MotionWrapper>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <MotionWrapper delay={0.4}>
                    <Link href="/dashboard/narrate" className="block group h-full">
                        <Card className="h-full glass hover:border-primary/30 transition-all duration-700 overflow-hidden relative group rounded-[3rem] shadow-2xl">
                            <CardContent className="p-12 flex flex-col sm:flex-row items-center gap-10">
                                <div className="p-8 rounded-[2rem] bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-700 shadow-inner ring-1 ring-primary/20 shrink-0">
                                    <Mic className="h-12 w-12" />
                                </div>
                                <div className="space-y-3 flex-1 text-center sm:text-left">
                                    <h3 className="text-3xl font-black tracking-tighter">Narrate Case Problem</h3>
                                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.3em] opacity-60">Voice Summary Unit NS-V1</p>
                                    <p className="text-sm text-muted-foreground font-medium leading-relaxed max-w-sm">Convert natural speech into a structured statutory report with identified IPC/BNSS violations.</p>
                                    <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        Initialize Protocol <ArrowRight className="h-3 w-3" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                  </MotionWrapper>
                  <MotionWrapper delay={0.5}>
                    <Link href="/dashboard/document-intelligence" className="block group h-full">
                        <Card className="h-full glass hover:border-emerald-500/30 transition-all duration-700 overflow-hidden relative group rounded-[3rem] shadow-2xl">
                            <CardContent className="p-12 flex flex-col sm:flex-row items-center gap-10">
                                <div className="p-8 rounded-[2rem] bg-emerald-500/10 text-emerald-600 group-hover:scale-110 transition-transform duration-700 shadow-inner ring-1 ring-emerald-500/20 shrink-0">
                                    <Search className="h-12 w-12" />
                                </div>
                                <div className="space-y-3 flex-1 text-center sm:text-left">
                                    <h3 className="text-3xl font-black tracking-tighter">Document Intelligence</h3>
                                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.3em] opacity-60">Risk Audit Node NS-D2</p>
                                    <p className="text-sm text-muted-foreground font-medium leading-relaxed max-w-sm">Perform a deep-layer forensic audit of legal contracts to detect hidden liabilities and deadlines.</p>
                                    <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-widest pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        Initialize Protocol <ArrowRight className="h-3 w-3" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                  </MotionWrapper>
              </div>
          </section>

          <section>
              <MotionWrapper delay={0.6}>
                <SectionTitle icon={Sparkles}>Institutional AI Toolkit</SectionTitle>
              </MotionWrapper>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                  {aiFeatures.map((feature, index) => (
                    <MotionWrapper key={feature.href} delay={0.7 + index * 0.1}>
                      <Link href={feature.href} className="block group h-full">
                          <Card className="h-full glass p-8 sm:p-10 flex flex-col items-start hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-700 active:scale-[0.97] rounded-[2.5rem] border-primary/5">
                              <div className={cn("p-5 rounded-2xl mb-8 group-hover:scale-110 transition-transform duration-700 shadow-sm ring-1 ring-white/10", feature.bg, feature.color)}>
                                <feature.icon className="h-7 w-7" />
                              </div>
                              <h3 className="font-black text-xl tracking-tight leading-tight mb-3">{feature.title}</h3>
                              <p className="text-[10px] text-muted-foreground leading-relaxed font-bold uppercase tracking-widest opacity-60 mb-8">{feature.description}</p>
                              <div className="mt-auto flex items-center text-[10px] font-black text-primary uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-opacity">
                                Initialize <ArrowRight className="ml-3 h-3.5 w-3.5" />
                              </div>
                          </Card>
                      </Link>
                    </MotionWrapper>
                  ))}
              </div>
          </section>

          <section>
            <MotionWrapper delay={0.8}>
              <SectionTitle icon={Library}>Platform Infrastructure</SectionTitle>
            </MotionWrapper>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
              {[
                { href: "/dashboard/learn", icon: Library, title: "Knowledge Hub", desc: "Statutory forensic guides." },
                { href: "/dashboard/ngo-legal-aid", icon: HeartHandshake, title: "Legal Aid Node", desc: "Verified pro-bono orgs." },
                { href: "/dashboard/my-cases", icon: Landmark, title: "Case Registry", desc: "eCourts synchronization." },
              ].map((item, index) => (
                <MotionWrapper key={item.href} delay={0.9 + index * 0.1}>
                  <Link href={item.href} className="block group h-full">
                    <Card className="h-full glass group-hover:border-primary/30 transition-all duration-500 rounded-[2.5rem] shadow-xl hover:shadow-2xl border-primary/5 overflow-hidden">
                      <CardContent className="p-10 text-left relative">
                        <div className="flex items-center gap-6 relative z-10">
                          <div className="p-5 rounded-2xl bg-muted group-hover:bg-primary/10 group-hover:text-primary transition-all duration-500 shadow-inner ring-1 ring-black/5">
                            <item.icon className="h-7 w-7" />
                          </div>
                          <div className="min-w-0 space-y-1.5">
                            <h3 className="font-black text-xl tracking-tight truncate">{item.title}</h3>
                            <p className="text-[10px] text-muted-foreground font-bold truncate uppercase tracking-widest opacity-60">{item.desc}</p>
                          </div>
                        </div>
                        <div className="absolute top-0 right-0 p-4 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                            <item.icon className="h-20 w-20" />
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
            <div className="pt-20 text-center border-t border-primary/5 flex flex-col items-center gap-6">
                <div className="bg-primary/5 p-4 rounded-2xl">
                    <Logo className="h-10 w-10 opacity-40 grayscale" />
                </div>
                <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.6em] text-muted-foreground/40">Institutional Terminal // NYAYASAHAYAK.IN</p>
                    <p className="text-xs font-bold text-primary/60 italic">"Engineering Dignity through Precise Neural Legal Intelligence."</p>
                </div>
                <div className="flex items-center gap-4 pt-4 opacity-20">
                    <div className="h-1 w-1 rounded-full bg-primary"></div>
                    <div className="h-1 w-1 rounded-full bg-primary"></div>
                    <div className="h-1 w-1 rounded-full bg-primary"></div>
                </div>
            </div>
        </MotionWrapper>
    </div>
  );
}
