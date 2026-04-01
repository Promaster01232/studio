
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  Search,
  FileText,
  FileSignature,
  BrainCircuit,
  Library,
  Landmark,
  ArrowRight,
  Sparkles,
  Activity,
  Heart,
  Plus,
  Zap,
  CheckCircle2,
  MoreVertical,
  Flag,
  Trash2,
  TrendingUp,
  BadgeCheck,
  CreditCard,
  Crown,
  ShieldCheck,
  Globe,
  Bot,
  Loader2,
  Share2,
  Twitter,
  Bookmark,
  MessageCircle,
  Layers
} from "lucide-react";
import { motion, useInView, AnimatePresence } from "framer-motion";
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
  deleteDoc, 
  addDoc, 
  serverTimestamp,
  getDoc
} from "firebase/firestore";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Logo } from "@/components/logo";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError, type SecurityRuleContext } from "@/firebase/errors";
import { useSoundEffect } from "@/hooks/use-sound-effect";

const ADMIN_EMAILS = [
  'enterspaceindia@gmail.com', 
  'piyushkumrsingh23399@gmail.com',
  'nyayasahayakhelp@gmail.com'
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

const typeConfig: Record<string, { color: string, bg: string, border: string, icon: any, gradient: string, glow: string }> = {
    'Idea': { color: 'text-amber-600', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: Sparkles, gradient: 'from-amber-500/5', glow: 'shadow-amber-500/10' },
    'Question': { color: 'text-blue-600', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: Bot, gradient: 'from-blue-500/5', glow: 'shadow-blue-500/10' },
    'Suggestion': { color: 'text-emerald-600', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: Zap, gradient: 'from-emerald-500/5', glow: 'shadow-emerald-500/10' },
    'Poll': { color: 'text-purple-600', bg: 'bg-purple-500/10', border: 'border-purple-500/20', icon: Layers, gradient: 'from-purple-500/5', glow: 'shadow-purple-500/10' },
};

const MotionWrapper = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 15 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
      transition={{ delay, duration: 0.2 }}
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
                "flex items-center gap-3",
                post.isAnonymous ? "pointer-events-none opacity-60" : "cursor-pointer"
            )}
        >
            <Avatar className="h-9 w-9 border border-background shadow-md rounded-lg">
                {authorAvatar && <AvatarImage src={authorAvatar} alt={authorName} className="object-cover" />}
                <AvatarFallback className="font-black bg-primary/10 text-primary text-xs">{fallback}</AvatarFallback>
            </Avatar>
            <div className="flex-1 text-left">
                <div className="flex items-center gap-1.5">
                    <p className="font-black text-xs tracking-tight">{authorName}</p>
                    {isAdmin && <BadgeCheck className="h-3.5 w-3.5 text-blue-500" />}
                </div>
                <p className="text-[10px] text-muted-foreground font-bold opacity-60">
                    {post.createdAt ? formatDistanceToNow(post.createdAt.toDate(), { addSuffix: true }) : 'Syncing...'}
                </p>
            </div>
        </Link>
    );
}

function PostCard({ post, userProfile }: { post: Post, userProfile: any }) {
    const { toast } = useToast();
    const { playSound } = useSoundEffect();
    const firestore = useFirestore();
    const auth = useAuth();
    const { currentUser } = auth;
    
    const [isLiking, setIsLiking] = useState(false);
    const [isVoting, setIsVoting] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [optimisticLikes, setOptimisticLikes] = useState(post.likes);
    const [optimisticLikedBy, setOptimisticLikedBy] = useState(post.likedBy || []);
    const [optimisticPoll, setOptimisticPoll] = useState(post.poll);

    const userHasLiked = optimisticLikedBy.includes(currentUser?.uid ?? '');
    const isAuthor = post.authorUid === currentUser?.uid;
    const isGlobalAdmin = currentUser?.email && ADMIN_EMAILS.includes(currentUser.email.toLowerCase());
    
    const userHasVotedOnPoll = optimisticPoll?.voters?.includes(currentUser?.uid ?? '');
    const totalVotes = optimisticPoll ? optimisticPoll.options.reduce((acc, option) => acc + option.votes, 0) : 0;
    
    const contentLimit = 200;
    const shouldShowReadMore = post.content && post.content.length > contentLimit;
    const displayedContent = isExpanded ? post.content : (post.content?.slice(0, contentLimit) + (shouldShowReadMore ? "..." : ""));

    const config = typeConfig[post.postType || 'Idea'] || typeConfig['Idea'];

    const handleLike = () => {
        if (!currentUser) {
            toast({ title: "Authentication Required", description: "Initialize dashboard ingress to participate in audits." });
            return;
        }
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
                playSound(userHasLiked ? 'click' : 'success');
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

    const handleVote = (optionIndex: number) => {
        if (!currentUser || !optimisticPoll || isVoting || userHasVotedOnPoll) {
            if (!currentUser) toast({ title: "Consensus Required", description: "Initialize dashboard ingress to participate in community polls." });
            return;
        }
        setIsVoting(true);
        playSound('success');

        const postRef = doc(firestore, "posts", post.id);
        const newOptions = [...optimisticPoll.options];
        newOptions[optionIndex] = { ...newOptions[optionIndex], votes: newOptions[optionIndex].votes + 1 };
        
        const newPollState = {
            ...optimisticPoll,
            options: newOptions,
            voters: [...(optimisticPoll.voters || []), currentUser.uid]
        };

        setOptimisticPoll(newPollState);

        updateDoc(postRef, { poll: newPollState })
            .catch((serverError) => {
                setOptimisticPoll(post.poll);
                const permissionError = new FirestorePermissionError({
                    path: postRef.path,
                    operation: 'update',
                } satisfies SecurityRuleContext, serverError);
                errorEmitter.emit('permission-error', permissionError);
            })
            .finally(() => setIsVoting(false));
    };

    const handleDelete = async () => {
        const msg = isGlobalAdmin && !isAuthor ? "ADMIN PURGE: Confirm record erasure from community registry?" : "Confirm record purge from community registry?";
        if (!confirm(msg)) return;
        
        const postRef = doc(firestore, "posts", post.id);
        deleteDoc(postRef)
            .then(() => {
                toast({ title: "Post Purged", description: "Registry data erased permanently." });
            })
            .catch((serverError) => {
                const permissionError = new FirestorePermissionError({
                    path: postRef.path,
                    operation: 'delete',
                } satisfies SecurityRuleContext, serverError);
                errorEmitter.emit('permission-error', permissionError);
            });
    };

    const handleShare = (platform: 'whatsapp' | 'twitter' | 'copy') => {
        const shareText = `Statutory Transmission: "${post.title}"\n\nAnalyze this node on Nyaya Sahayak: ${window.location.origin}/dashboard/research-analytics`;
        
        if (platform === 'whatsapp') {
            window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
        } else if (platform === 'twitter') {
            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank');
        } else if (platform === 'copy') {
            navigator.clipboard.writeText(shareText);
            toast({ title: "Registry Link Copied", description: "Transmission data saved to clipboard." });
        }
    };

    return (
        <motion.div layout className="w-full">
            <Card className={cn(
                "overflow-hidden glass border-primary/10 transition-all rounded-[1.5rem] flex flex-col relative shadow-sm hover:shadow-xl",
                config.glow
            )}>
                <div className={cn("absolute top-0 left-0 bottom-0 w-1 bg-gradient-to-b", config.gradient)}></div>
                
                <div className="flex-1 flex flex-col p-6 text-left ml-1">
                    <div className="flex items-center justify-between mb-5">
                        <AuthorIdentityNode post={post} isAdmin={ADMIN_EMAILS.includes(post.authorUid)} />
                        <div className="flex items-center gap-2">
                            <Badge className={cn("bg-primary/10 text-primary border-primary/10 font-bold text-[9px] px-2.5 py-0.5 rounded-full", config.bg, config.color)}>
                                {post.postType || 'Transmission'}
                            </Badge>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-primary/5">
                                        <MoreVertical className="h-4 w-4 text-muted-foreground" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-52 p-2 rounded-xl shadow-2xl shadow-black/10 glass border-primary/10">
                                    {(isAuthor || isGlobalAdmin) ? (
                                        <DropdownMenuItem onSelect={handleDelete} className="rounded-lg font-bold text-xs h-10 px-3 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10 gap-2.5">
                                            <Trash2 className="h-4 w-4" /> 
                                            <span>Purge record</span>
                                        </DropdownMenuItem>
                                    ) : (
                                        <DropdownMenuItem className="rounded-lg font-bold text-xs h-10 px-3 cursor-pointer gap-2.5 hover:bg-red-500/5 hover:text-red-500">
                                            <Flag className="h-4 w-4" /> 
                                            <span>Report breach</span>
                                        </DropdownMenuItem>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    <div className="space-y-2 flex-1 mb-6">
                        <h3 className="text-lg sm:text-xl font-black tracking-tight leading-tight text-foreground/90">{post.title}</h3>
                        {post.content && (
                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground font-medium leading-relaxed whitespace-pre-line">
                                    {displayedContent}
                                </p>
                                {shouldShowReadMore && (
                                    <button 
                                        onClick={() => setIsExpanded(!isExpanded)}
                                        className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline"
                                    >
                                        {isExpanded ? "Show less" : "Read more"}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {optimisticPoll && (
                        <div className="space-y-3 mb-6">
                            {optimisticPoll.options.map((option, idx) => {
                                const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
                                return (
                                    <button
                                        key={idx}
                                        onClick={() => handleVote(idx)}
                                        onMouseEnter={() => playSound('hover')}
                                        disabled={userHasVotedOnPoll || isVoting}
                                        className={cn(
                                            "w-full relative h-12 rounded-xl border border-primary/5 overflow-hidden transition-all text-left px-4 group/option",
                                            userHasVotedOnPoll ? "bg-muted/10 cursor-default" : "bg-white dark:bg-black/20 hover:border-primary/30 active:scale-[0.99]"
                                        )}
                                    >
                                        <AnimatePresence>
                                            {userHasVotedOnPoll && (
                                                <motion.div 
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${percentage}%` }}
                                                    className="absolute inset-y-0 left-0 bg-primary/10 border-r border-primary/20"
                                                />
                                            )}
                                        </AnimatePresence>
                                        <div className="relative z-10 flex items-center justify-between h-full">
                                            <span className="font-bold text-sm tracking-tight">{option.text}</span>
                                            {userHasVotedOnPoll && <span className="font-black text-xs text-primary">{percentage.toFixed(0)}%</span>}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    <div className="flex items-center justify-between pt-5 border-t border-primary/5">
                        <div className="flex gap-2">
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className={cn(
                                    "h-9 px-4 rounded-xl text-[11px] font-bold gap-2.5 transition-all", 
                                    userHasLiked ? "text-red-500 bg-red-500/5 shadow-inner" : "text-primary hover:bg-primary/5"
                                )}
                                onClick={handleLike}
                                disabled={isLiking}
                            >
                                {isLiking ? <Loader2 className="h-4 w-4 animate-spin" /> : <Heart className={cn("h-4 w-4", userHasLiked && "fill-current")} />}
                                <span className="font-black">{optimisticLikes}</span>
                            </Button>
                        </div>
                        <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">
                            <Activity className="h-3 w-3" />
                            <span>Registry Transient</span>
                        </div>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}

const aiFeatures = [
    { href: "/dashboard/strength-analyzer", icon: BrainCircuit, title: "analyzer", desc: "Forensic assessment.", color: "text-blue-500", bg: "bg-blue-500/5", sector: "Sector: Forensic" },
    { href: "/dashboard/document-intelligence", icon: Search, title: "doc intel", desc: "Statutory audit.", color: "text-emerald-500", bg: "bg-emerald-500/5", sector: "Sector: Statutory" },
    { href: "/dashboard/document-generator", icon: FileText, title: "drafting", desc: "Legal petitions.", color: "text-amber-500", bg: "bg-amber-500/5", sector: "Sector: Civil" },
    { href: "/dashboard/bond-generator", icon: FileSignature, title: "bonds", desc: "Legal affidavits.", color: "text-purple-500", bg: "bg-purple-500/5", sector: "Sector: Registry" },
];

const SectionHeader = ({ children, icon: Icon, sector }: { children: React.ReactNode, icon?: any, sector?: string }) => (
    <div className="flex items-center justify-between mb-6 border-b border-primary/5 pb-4">
        <div className="flex items-center gap-3">
            {Icon && <Icon className="h-5 w-5 text-primary/40" />}
            <h2 className="text-[13px] font-black tracking-tight text-foreground/80 lowercase first-letter:uppercase">{children}</h2>
        </div>
        {sector && <span className="text-[11px] font-bold text-muted-foreground/40">{sector}</span>}
    </div>
)

export default function DashboardHomePage() {
  const [text, setText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const fullText = 'Sahayak';
  const { playSound } = useSoundEffect();
  
  const firestore = useFirestore();
  const auth = useAuth();
  const [latestPosts, setLatestPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);

  const postsUnsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
        if (postsUnsubscribeRef.current) {
            postsUnsubscribeRef.current();
            postsUnsubscribeRef.current = null;
        }

        if (user) {
            const userDocRef = doc(firestore, "users", user.uid);
            getDoc(userDocRef).then(docSnap => {
                if (docSnap.exists()) setUserProfile(docSnap.data());
            });
        } else {
            setUserProfile(null);
        }

        const postsRef = collection(firestore, "posts");
        const q = query(postsRef, orderBy("createdAt", "desc"), limit(5));
        
        postsUnsubscribeRef.current = onSnapshot(q, (snap) => {
            const now = Date.now();
            const list: Post[] = [];
            
            snap.docs.forEach(d => {
                const data = d.data() as Post;
                const createdAtMillis = data.createdAt?.toMillis() || now;
                
                // 56-hour Transience Window Check
                if (now - createdAtMillis > TRANSience_WINDOW) {
                    deleteDoc(doc(firestore, "posts", d.id)).catch(() => {});
                } else {
                    list.push({ id: d.id, ...data });
                }
            });
            
            setLatestPosts(list);
            setPostsLoading(false);
        }, (serverError) => {
            console.error("Feed error:", serverError);
            setPostsLoading(false);
        });
    });

    return () => {
        unsubscribeAuth();
        if (postsUnsubscribeRef.current) postsUnsubscribeRef.current();
    };
  }, [firestore, auth]);
  
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isTyping) {
      if (text.length < fullText.length) {
        timeoutId = setTimeout(() => setText(fullText.slice(0, text.length + 1)), 50); 
      } else {
        timeoutId = setTimeout(() => setIsTyping(false), 2000);
      }
    } else {
      timeoutId = setTimeout(() => {
        setText('');
        setIsTyping(true);
      }, 800);
    }
    return () => clearTimeout(timeoutId);
  }, [text, isTyping]);

  const isAdmin = userProfile?.email && ADMIN_EMAILS.includes(userProfile.email.toLowerCase());
  const isLimited = !userProfile?.subscriptionType?.includes('unlimited') && !isAdmin;
  const isMonthly = userProfile?.subscriptionType === 'unlimited_monthly';
  const isYearly = userProfile?.subscriptionType === 'unlimited_yearly' || isAdmin;

  return (
    <div className="flex flex-col h-full space-y-12 pb-20 max-w-6xl mx-auto text-left relative">
        <MotionWrapper>
          <Card className={cn(
              "relative p-8 sm:p-12 rounded-[2.5rem] overflow-hidden border-primary/5 backdrop-blur-xl shadow-2xl transition-all duration-700",
              (isYearly || isMonthly) ? "bg-gradient-to-br from-primary/10 via-amber-500/5 to-primary/5 shadow-primary/10 border-primary/20" : "bg-card/40 shadow-primary/5"
          )}>
              <div className="absolute top-0 right-0 p-10 opacity-[0.02] pointer-events-none text-left">
                  <div className="bg-white rounded-full p-10 grayscale">
                    <Logo className="h-56 w-56 border-none p-0 bg-transparent shadow-none" priority />
                  </div>
              </div>
              <div className="relative z-10 space-y-8">
                  <div className="space-y-4">
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                          {isLimited ? (
                            <Link href="/dashboard/billing">
                                <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] hover:bg-primary/20 transition-all cursor-pointer">
                                    Tier: {(userProfile?.subscriptionType || 'Free').replace('_', ' ')} // Upgrade Now
                                </Badge>
                            </Link>
                          ) : (
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="flex gap-2"
                            >
                                <Badge className="bg-green-500/10 text-green-600 border-green-500/20 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                                    {isYearly ? <ShieldCheck className="h-3 w-3" /> : <Crown className="h-3 w-3" />}
                                    Clearance: {isYearly ? 'Institutional Annual' : 'Unlimited Monthly'} Node
                                </Badge>
                            </motion.div>
                          )}
                      </div>
                      <h1 className="text-3xl sm:text-5xl font-black font-headline tracking-tighter leading-none text-foreground text-left">
                          Greetings, <br />
                          <span className={cn(
                              "bg-gradient-to-r bg-clip-text text-transparent italic",
                              (isYearly || isMonthly) ? "from-primary via-amber-500 to-orange-600 animate-animated-gradient bg-[200%_auto]" : "from-primary via-orange-400 to-accent"
                          )}>Nyaya {text}</span>
                      </h1>
                  </div>
                  <p className="text-sm sm:text-base text-muted-foreground font-medium max-w-xl leading-relaxed text-left">
                      Access precision AI nodes for statutory auditing within the Indian judicial ecosystem. 
                      <span className="block mt-2 font-black text-[10px] uppercase text-primary/60 tracking-widest flex items-center gap-2">
                        <Activity className="h-3 w-3" /> Transience protocol active: Posts purge after 56H.
                      </span>
                  </p>
                  <div className="flex flex-wrap gap-4 pt-2">
                      <Button size="sm" className={cn(
                          "rounded-xl font-bold px-8 h-14 shadow-xl transition-all text-xs",
                          (isYearly || isMonthly) ? "bg-primary shadow-primary/30 hover:scale-105" : "shadow-primary/20"
                      )} asChild>
                          <Link href="/dashboard/narrate">initialize narration</Link>
                      </Button>
                  </div>
              </div>
          </Card>
        </MotionWrapper>

        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-10">
              <section>
                  <SectionHeader icon={TrendingUp} sector="Sector: Community">live transient stream</SectionHeader>
                  <div className="space-y-6">
                      {postsLoading ? (
                          <div className="space-y-5">
                              {[...Array(2)].map((_, i) => (
                                  <Card key={i} className="h-32 animate-pulse border-primary/5 rounded-2xl bg-muted/20 shadow-sm" />
                              ))}
                          </div>
                      ) : latestPosts.length === 0 ? (
                          <Card className="py-20 text-center glass rounded-[2.5rem] border-dashed border-2 border-primary/10 opacity-40">
                              <p className="font-bold text-sm tracking-tight">registry clear // awaiting transmissions</p>
                          </Card>
                      ) : (
                          <div className="space-y-6">
                              {latestPosts.map((post) => (
                                  <PostCard key={post.id} post={post} userProfile={userProfile} />
                              ))}
                          </div>
                      )}
                  </div>
              </section>
          </div>

          <div className="lg:col-span-4 space-y-10">
              <section>
                  <SectionHeader icon={Sparkles} sector="Status: Optimized">system matrix</SectionHeader>
                  <div className="grid grid-cols-2 gap-4">
                      {aiFeatures.map((f) => (
                        <Link key={f.href} href={f.href} className="block group" onMouseEnter={() => playSound('hover')}>
                            <Card className="h-full glass p-5 rounded-[1.5rem] border-primary/5 group-hover:border-primary/20 transition-all text-left relative overflow-hidden flex flex-col justify-between min-h-[130px] group-hover:scale-[1.02] group-active:scale-[0.98] shadow-sm hover:shadow-xl shadow-primary/5">
                                <div className="absolute top-0 right-0 p-3 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                                    <f.icon className="h-8 w-8" />
                                </div>
                                <div>
                                    <div className={cn("p-2.5 rounded-xl w-fit mb-3 transition-transform group-hover:scale-110 shadow-sm", f.bg, f.color)}>
                                        <f.icon className="h-4 w-4" />
                                    </div>
                                    <h3 className="font-black text-[12px] tracking-tight text-foreground leading-none lowercase first-letter:uppercase">{f.title}</h3>
                                </div>
                                <div className="mt-3.5 pt-3 border-t border-primary/5">
                                    <span className="text-[9px] font-bold text-primary/40 tracking-wider">{f.sector}</span>
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
