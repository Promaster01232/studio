
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
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
  ArrowRight,
  Sparkles,
  Activity,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Loader2,
  BadgeCheck,
  MoreVertical,
  Flag,
  Trash2,
  Twitter,
  Zap,
  ChevronRight,
  TrendingUp,
  Newspaper,
  Link as LinkIcon,
  Plus,
  Bot,
  Send
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Logo } from "@/components/logo";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError, type SecurityRuleContext } from "@/firebase/errors";

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
      {Array.from({ length: 25 }).map((_, i) => (
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
            <Avatar className="h-11 w-11 border-2 border-background shadow-lg rounded-xl group-hover/author:scale-105 transition-transform">
                {authorAvatar && <AvatarImage src={authorAvatar} alt={authorName} className="object-cover" />}
                <AvatarFallback className="font-black bg-primary/10 text-primary text-xs">{fallback}</AvatarFallback>
            </Avatar>
            <div className="flex-1 text-left">
                <div className="flex items-center gap-1.5">
                    <p className="font-black text-[14px] tracking-tight group-hover/author:text-primary transition-colors">{authorName}</p>
                    {isAdmin && <BadgeCheck className="h-4 w-4 text-blue-500" />}
                </div>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest opacity-60">
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

    const userHasLiked = optimisticLikedBy.includes(currentUser?.uid ?? '');
    const isAdmin = currentUser?.email && (ADMIN_EMAILS.includes(currentUser.email.toLowerCase()) || userProfile?.isAdmin);
    const isAuthor = post.authorUid === currentUser?.uid;
    
    const handleLike = () => {
        if (!currentUser) return;
        if (isLiking) return;
        setIsLiking(true);

        const postRef = doc(firestore, "posts", post.id);
        const updateData = {
            likes: increment(userHasLiked ? -1 : 1),
            likedBy: userHasLiked ? arrayRemove(currentUser.uid) : arrayUnion(currentUser.uid)
        };

        setOptimisticLikes(prev => userHasLiked ? prev - 1 : prev + 1);
        setOptimisticLikedBy(prev => userHasLiked ? prev.filter(uid => uid !== currentUser.uid) : [...prev, currentUser.uid]);

        updateDoc(postRef, updateData)
            .then(() => {
                if (!userHasLiked && post.authorUid !== currentUser.uid) {
                    addDoc(collection(firestore, "notifications"), {
                        userId: post.authorUid,
                        type: 'like',
                        title: 'Transmission Liked',
                        description: `${userProfile?.firstName || 'A citizen'} liked your post: "${post.title}"`,
                        isRead: false,
                        createdAt: serverTimestamp()
                    }).catch(() => {});
                }
            })
            .catch(async (serverError) => {
                setOptimisticLikes(post.likes);
                setOptimisticLikedBy(post.likedBy || []);
                
                const permissionError = new FirestorePermissionError({
                    path: postRef.path,
                    operation: 'update',
                    requestResourceData: updateData,
                } satisfies SecurityRuleContext, serverError);
                errorEmitter.emit('permission-error', permissionError);
            })
            .finally(() => setIsLiking(false));
    };

    const handleDelete = async () => {
        const postRef = doc(firestore, "posts", post.id);
        deleteDoc(postRef)
            .then(() => {
                toast({ title: "Transmission Purged", description: "The node has been erased from the official registry." });
            })
            .catch(async (serverError) => {
                const permissionError = new FirestorePermissionError({
                    path: postRef.path,
                    operation: 'delete',
                } satisfies SecurityRuleContext, serverError);
                errorEmitter.emit('permission-error', permissionError);
            });
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
                <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-gradient-to-b from-primary via-accent to-blue-400 group-hover:w-2 transition-all duration-500 hidden sm:block"></div>
                
                <div className="relative w-full sm:w-[320px] md:w-[420px] h-56 sm:h-auto overflow-hidden shrink-0">
                    {post.image ? (
                        <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            className="object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                    ) : (
                        <div className="absolute inset-0 bg-primary/5 flex items-center justify-center">
                            <Logo className="h-24 w-24 opacity-[0.05]" />
                            <Newspaper className="h-20 w-20 text-primary/10 absolute animate-pulse" />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent sm:hidden"></div>
                    <div className="absolute top-6 left-6">
                        <Badge className="bg-primary text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl px-5 py-2 rounded-full backdrop-blur-md">
                            {post.postType || 'Transmission'}
                        </Badge>
                    </div>
                </div>

                <div className="flex-1 flex flex-col p-8 sm:p-12 text-left">
                    <div className="flex items-center justify-between mb-8">
                        <AuthorIdentityNode post={post} isAdmin={ADMIN_EMAILS.includes(post.authorUid)} />
                        <div className="flex items-center gap-2">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-11 w-11 rounded-2xl hover:bg-primary/5 active:scale-90 transition-all">
                                        <MoreVertical className="h-6 w-6 text-muted-foreground" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-60 rounded-[1.5rem] p-3 shadow-3xl glass border-primary/5">
                                    <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-2 px-2">Node Protocols</DropdownMenuLabel>
                                    {(isAuthor || isAdmin) ? (
                                        <DropdownMenuItem onSelect={handleDelete} className="rounded-xl font-bold text-xs h-12 px-4 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10 gap-3">
                                            <Trash2 className="h-4 w-4" /> Purge from Registry
                                        </DropdownMenuItem>
                                    ) : (
                                        <DropdownMenuItem onSelect={handleReport} className="rounded-xl font-bold text-xs h-12 px-4 cursor-pointer gap-3">
                                            <Flag className="h-4 w-4" /> Flag for Audit
                                        </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem className="rounded-xl font-bold text-xs h-12 px-4 cursor-pointer gap-3" onSelect={() => handleShare('copy')}>
                                        <Bookmark className="h-4 w-4" /> Save Citation
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    <div className="space-y-5 flex-1 mb-10">
                        <h3 className="text-3xl sm:text-5xl font-black font-headline leading-none tracking-tighter text-foreground group-hover:text-primary transition-colors duration-500 line-clamp-2">
                            {post.title}
                        </h3>
                        <p className="text-muted-foreground text-base sm:text-lg font-medium leading-relaxed line-clamp-3">
                            {post.content}
                        </p>
                        
                        {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2.5 pt-3">
                                {post.tags.map(tag => (
                                    <span key={tag} className="text-[11px] font-black text-primary/60 uppercase tracking-widest bg-primary/5 px-4 py-1.5 rounded-xl border border-primary/10">#{tag}</span>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-between pt-10 border-t border-primary/5">
                        <div className="flex items-center gap-5">
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className={cn(
                                    "h-12 px-6 rounded-2xl font-black text-[12px] uppercase tracking-widest gap-3 transition-all active:scale-95 shadow-sm",
                                    userHasLiked ? "bg-red-500 text-white shadow-red-500/20 hover:bg-red-600" : "bg-primary/5 hover:bg-primary/10 text-primary"
                                )}
                                onClick={handleLike}
                                disabled={isLiking}
                            >
                                {isLiking ? <Loader2 className="h-4 w-4 animate-spin" /> : <Heart className={cn("h-5 w-5", userHasLiked && "fill-current scale-110")} />}
                                <span>{optimisticLikes} Impact</span>
                            </Button>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="h-12 w-12 rounded-2xl border-primary/10 hover:bg-primary/5 hover:border-primary/30 transition-all shadow-sm">
                                        <Share2 className="h-5 w-5 text-primary" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start" className="w-60 rounded-[1.5rem] p-3 shadow-3xl glass border-primary/5">
                                    <DropdownMenuItem onSelect={() => handleShare('whatsapp')} className="rounded-xl font-bold text-xs h-12 px-4 cursor-pointer gap-3">
                                        <MessageCircle className="h-4 w-4 text-green-600" /> WhatsApp
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onSelect={() => handleShare('twitter')} className="rounded-xl font-bold text-xs h-12 px-4 cursor-pointer gap-3">
                                        <Twitter className="h-4 w-4 text-blue-500" /> Twitter (X)
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onSelect={() => handleShare('copy')} className="rounded-xl font-bold text-xs h-12 px-4 cursor-pointer gap-3">
                                        <LinkIcon className="h-4 w-4 text-primary" /> Copy Link
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        <Button 
                            variant="ghost" 
                            className="h-12 px-8 rounded-2xl font-black text-[12px] uppercase tracking-widest gap-3 hover:bg-primary hover:text-white transition-all group/btn shadow-xl hover:shadow-primary/20"
                            asChild
                        >
                            <Link href="/dashboard/research-analytics">
                                Inspect Node <ChevronRight className="h-5 w-5 transition-transform group-hover/btn:translate-x-1.5" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}

function FloatingActionNodes() {
    return (
        <div className="fixed bottom-10 right-10 flex flex-col gap-5 z-[100]">
            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
                <Dialog>
                    <DialogTrigger asChild>
                        <Button 
                            size="icon" 
                            className="h-16 w-16 rounded-full shadow-[0_20px_50px_rgba(var(--primary),0.4)] bg-primary text-white hover:scale-110 active:scale-95 transition-all group"
                        >
                            <Bot className="h-7 w-7 group-hover:animate-bounce" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg rounded-[3rem] glass shadow-3xl border-primary/10 p-0 overflow-hidden">
                        <div className="bg-primary/5 p-8 border-b border-primary/10">
                            <DialogHeader className="p-0 border-none">
                                <div className="flex items-center gap-3 mb-2 text-primary">
                                    <Bot className="h-6 w-6" />
                                    <span className="text-[11px] font-black uppercase tracking-[0.4em]">Institutional Intelligence Node</span>
                                </div>
                                <DialogTitle className="text-3xl font-black tracking-tighter leading-none">AI Assistant Unit</DialogTitle>
                                <DialogDescription className="font-medium text-sm pt-2">
                                    Ask any query regarding nyayasahayak.in statutory tools or protocols.
                                </DialogDescription>
                            </DialogHeader>
                        </div>
                        <div className="p-8 space-y-8 text-left">
                            <div className="p-6 rounded-[2rem] bg-primary/5 border border-primary/10 text-sm font-medium leading-relaxed italic text-muted-foreground shadow-inner">
                                "Initialize institutional query transmission below. Our neural engine will deconstruct your input and provide forensic guidance."
                            </div>
                            <div className="flex items-center gap-4">
                                <Input placeholder="Type your statutory query..." className="h-14 glass border-primary/5 rounded-2xl font-bold text-base px-6" />
                                <Button size="icon" className="h-14 w-14 rounded-2xl shadow-xl shadow-primary/20 active:scale-90 transition-all">
                                    <Send className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                        <div className="p-4 bg-muted/5 border-t text-center">
                            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">NS-NODE-GUIDE // SECURE SESSION ACTIVE</p>
                        </div>
                    </DialogContent>
                </Dialog>
            </motion.div>

            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
            >
                <Button 
                    asChild
                    size="icon" 
                    className="h-16 w-16 rounded-full shadow-[0_20px_50px_rgba(var(--accent),0.4)] bg-accent text-white hover:scale-110 active:scale-95 transition-all group"
                >
                    <Link href="/dashboard/research-analytics/new">
                        <Plus className="h-7 w-7 group-hover:rotate-90 transition-transform duration-500" />
                    </Link>
                </Button>
            </motion.div>
        </div>
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
    <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-5">
            {Icon && <Icon className="h-8 w-8 text-primary opacity-40" />}
            <h2 className="text-2xl sm:text-4xl font-black font-headline tracking-tighter text-foreground uppercase">{children}</h2>
        </div>
        <div className="h-px flex-1 bg-gradient-to-r from-primary/10 to-transparent ml-10 hidden sm:block"></div>
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
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
        if (!user) {
            setPostsLoading(false);
            return;
        }

        const postsRef = collection(firestore, "posts");
        const q = query(postsRef, orderBy("createdAt", "desc"), limit(20));
        
        const unsubscribe = onSnapshot(q, 
            (snap) => {
                const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as Post));
                setLatestPosts(list);
                setPostsLoading(false);
            },
            (serverError) => {
                const permissionError = new FirestorePermissionError({
                    path: postsRef.path,
                    operation: 'list',
                } satisfies SecurityRuleContext, serverError);
                errorEmitter.emit('permission-error', permissionError);
                setPostsLoading(false);
            }
        );

        const userDocRef = doc(firestore, "users", user.uid);
        getDoc(userDocRef).then(docSnap => {
            if (docSnap.exists()) {
                setUserProfile(docSnap.data());
            }
        });

        return () => unsubscribe();
    });

    return () => unsubscribeAuth();
  }, [firestore, auth]);
  
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
    <div className="flex flex-col h-full space-y-24 pb-32 max-w-7xl mx-auto text-left relative">
        <MotionWrapper>
          <div className="relative p-10 sm:p-24 rounded-[4rem] overflow-hidden bg-primary/5 border border-primary/10 shadow-[0_50px_100px_rgba(0,0,0,0.05)] group">
              <NeuralRain />
              <div className="absolute top-0 right-0 p-16 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                  <Landmark className="h-96 w-96" />
              </div>
              <div className="relative z-10 space-y-10">
                  <div className="flex items-center gap-4 text-primary">
                      <div className="p-3 rounded-2xl bg-primary/10 animate-pulse ring-1 ring-primary/20 shadow-sm">
                        <Sparkles className="h-6 w-6" />
                      </div>
                      <span className="text-[11px] font-black uppercase tracking-[0.6em] leading-none">Institutional Node Alpha-4</span>
                  </div>
                  <h1 className="text-6xl sm:text-9xl font-black font-headline tracking-tighter leading-none text-foreground">
                      Welcome to <br />
                      <span className="bg-gradient-to-r from-primary via-accent to-blue-400 bg-clip-text text-transparent animate-animated-gradient bg-[200%_auto] italic">{text}</span>
                      <span className="animate-pulse ml-1 text-primary">|</span>
                  </h1>
                  <p className="text-lg sm:text-3xl text-muted-foreground font-medium max-w-3xl leading-relaxed">
                      Access precision legal intelligence and forensic tools designed for the modern judicial landscape.
                  </p>
                  <div className="flex flex-wrap gap-8 pt-8">
                      <Button size="lg" className="rounded-[2rem] font-black uppercase tracking-[0.2em] text-[12px] px-12 h-20 shadow-3xl shadow-primary/20 active:scale-95 transition-all group/hero" asChild>
                          <Link href="/dashboard/narrate">
                            Initialize Narration <ArrowRight className="ml-4 h-6 w-6 transition-transform group-hero:translate-x-2" />
                          </Link>
                      </Button>
                      <Button variant="outline" size="lg" className="rounded-[2rem] font-black uppercase tracking-[0.2em] text-[12px] px-12 h-20 border-primary/10 glass hover:bg-primary/5 active:scale-95 transition-all" asChild>
                          <Link href="/dashboard/support">Hub Support</Link>
                      </Button>
                  </div>
              </div>
          </div>
        </MotionWrapper>

        <div className="space-y-24">
          <section id="transmissions">
              <MotionWrapper delay={0.1}>
                <SectionTitle icon={TrendingUp}>Community Transmissions</SectionTitle>
              </MotionWrapper>
              
              <div className="grid grid-cols-1 gap-10">
                  {postsLoading ? (
                      <div className="space-y-10">
                          {[...Array(3)].map((_, i) => (
                              <Card key={i} className="glass rounded-[3rem] h-[360px] animate-pulse border-primary/5" />
                          ))}
                      </div>
                  ) : (
                      <div className="space-y-10">
                          <AnimatePresence mode="popLayout">
                              {latestPosts.map((post) => (
                                  <PostCard key={post.id} post={post} userProfile={userProfile} />
                              ))}
                          </AnimatePresence>
                      </div>
                  )}
              </div>
              
              <div className="mt-16 flex justify-center">
                  <Button variant="ghost" className="h-16 px-12 rounded-3xl font-black uppercase tracking-[0.4em] text-[11px] gap-5 hover:bg-primary/5 group transition-all" asChild>
                      <Link href="/dashboard/research-analytics">
                          Sync Full Registry <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2" />
                      </Link>
                  </Button>
              </div>
          </section>

          <section>
              <MotionWrapper delay={0.3}>
                <SectionTitle icon={Zap}>Primary Forensic Nodes</SectionTitle>
              </MotionWrapper>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <MotionWrapper delay={0.4}>
                    <Link href="/dashboard/narrate" className="block group h-full">
                        <Card className="h-full glass hover:border-primary/30 transition-all duration-700 overflow-hidden relative group rounded-[3.5rem] shadow-3xl">
                            <CardContent className="p-12 sm:p-16 flex flex-col sm:flex-row items-center gap-12">
                                <div className="p-10 rounded-[2.5rem] bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-700 shadow-inner ring-1 ring-primary/20 shrink-0">
                                    <Mic className="h-14 w-14" />
                                </div>
                                <div className="space-y-4 flex-1 text-center sm:text-left">
                                    <h3 className="text-4xl font-black tracking-tighter">Narrate Case</h3>
                                    <p className="text-[11px] text-muted-foreground font-black uppercase tracking-[0.4em] opacity-60">Voice Unit NS-V1</p>
                                    <p className="text-base text-muted-foreground font-medium leading-relaxed max-w-sm">Convert natural speech into a structured statutory report with identified IPC/BNSS violations.</p>
                                    <div className="flex items-center gap-3 text-primary font-black text-[11px] uppercase tracking-widest pt-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0">
                                        Initialize Protocol <ArrowRight className="h-4 w-4" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                  </MotionWrapper>
                  <MotionWrapper delay={0.5}>
                    <Link href="/dashboard/document-intelligence" className="block group h-full">
                        <Card className="h-full glass hover:border-emerald-500/30 transition-all duration-700 overflow-hidden relative group rounded-[3.5rem] shadow-3xl">
                            <CardContent className="p-12 sm:p-16 flex flex-col sm:flex-row items-center gap-12">
                                <div className="p-10 rounded-[2.5rem] bg-emerald-500/10 text-emerald-600 group-hover:scale-110 transition-transform duration-700 shadow-inner ring-1 ring-emerald-500/20 shrink-0">
                                    <Search className="h-14 w-14" />
                                </div>
                                <div className="space-y-4 flex-1 text-center sm:text-left">
                                    <h3 className="text-4xl font-black tracking-tighter">Doc Intelligence</h3>
                                    <p className="text-[11px] text-muted-foreground font-black uppercase tracking-[0.4em] opacity-60">Risk Node NS-D2</p>
                                    <p className="text-base text-muted-foreground font-medium leading-relaxed max-w-sm">Perform a deep-layer forensic audit of contracts to detect hidden liabilities and deadlines.</p>
                                    <div className="flex items-center gap-3 text-emerald-600 font-black text-[11px] uppercase tracking-widest pt-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0">
                                        Initialize Protocol <ArrowRight className="h-4 w-4" />
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
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                  {aiFeatures.map((feature, index) => (
                    <MotionWrapper key={feature.href} delay={0.7 + index * 0.1}>
                      <Link href={feature.href} className="block group h-full">
                          <Card className="h-full glass p-10 flex flex-col items-start hover:border-primary/30 hover:shadow-3xl hover:shadow-primary/10 transition-all duration-700 active:scale-[0.97] rounded-[3rem] border-primary/5">
                              <div className={cn("p-6 rounded-[1.5rem] mb-10 group-hover:scale-110 transition-transform duration-700 shadow-sm ring-1 ring-white/10", feature.bg, feature.color)}>
                                <feature.icon className="h-8 w-8" />
                              </div>
                              <h3 className="font-black text-2xl tracking-tight leading-tight mb-4">{feature.title}</h3>
                              <p className="text-[11px] text-muted-foreground leading-relaxed font-bold uppercase tracking-widest opacity-60 mb-10">{feature.description}</p>
                              <div className="mt-auto flex items-center text-[11px] font-black text-primary uppercase tracking-[0.4em] opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                                Initialize <ArrowRight className="ml-3 h-4 w-4" />
                              </div>
                          </Card>
                      </Link>
                    </MotionWrapper>
                  ))}
              </div>
          </section>

          <section>
            <MotionWrapper delay={0.8}>
              <SectionTitle icon={Library}>Infrastructure Hub</SectionTitle>
            </MotionWrapper>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                { href: "/dashboard/learn", icon: Library, title: "Knowledge Hub", desc: "Statutory forensic guides." },
                { href: "/dashboard/ngo-legal-aid", icon: HeartHandshake, title: "Legal Aid Node", desc: "Verified pro-bono orgs." },
                { href: "/dashboard/my-cases", icon: Landmark, title: "Case Registry", desc: "eCourts synchronization." },
              ].map((item, index) => (
                <MotionWrapper key={item.href} delay={0.9 + index * 0.1}>
                  <Link href={item.href} className="block group h-full">
                    <Card className="h-full glass group-hover:border-primary/30 transition-all duration-500 rounded-[3rem] shadow-2xl hover:shadow-3xl border-primary/5 overflow-hidden">
                      <CardContent className="p-12 text-left relative">
                        <div className="flex items-center gap-8 relative z-10">
                          <div className="p-6 rounded-2xl bg-muted group-hover:bg-primary/10 group-hover:text-primary transition-all duration-500 shadow-inner ring-1 ring-black/5">
                            <item.icon className="h-8 w-8" />
                          </div>
                          <div className="min-w-0 space-y-2">
                            <h3 className="font-black text-2xl tracking-tight truncate">{item.title}</h3>
                            <p className="text-[11px] text-muted-foreground font-black truncate uppercase tracking-[0.2em] opacity-60">{item.desc}</p>
                          </div>
                        </div>
                        <div className="absolute top-0 right-0 p-6 opacity-[0.02] group-hover:opacity-[0.08] transition-opacity">
                            <item.icon className="h-24 w-24" />
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
            <div className="pt-24 text-center border-t border-primary/5 flex flex-col items-center gap-8">
                <div className="bg-primary/5 p-5 rounded-3xl">
                    <Logo className="h-12 w-12 opacity-40 grayscale" />
                </div>
                <div className="space-y-3">
                    <p className="text-[11px] font-black uppercase tracking-[0.8em] text-muted-foreground/40">Institutional Terminal // NYAYASAHAYAK.IN</p>
                    <p className="text-sm font-bold text-primary/60 italic">"Engineering Dignity through Precise Neural Legal Intelligence."</p>
                </div>
                <div className="flex items-center gap-6 pt-6 opacity-20">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></div>
                    <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse [animation-delay:0.2s]"></div>
                    <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse [animation-delay:0.4s]"></div>
                </div>
            </div>
        </MotionWrapper>

        <FloatingActionNodes />
    </div>
  );
}
