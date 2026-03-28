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
  Cpu,
  Bot,
  CheckCircle2,
  MoreVertical,
  Flag,
  Trash2,
  TrendingUp,
  BadgeCheck,
  CreditCard,
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Logo } from "@/components/logo";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError, type SecurityRuleContext } from "@/firebase/errors";
import { useSoundEffect } from "@/hooks/use-sound-effect";

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

const MotionWrapper = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ delay }}
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
    const userHasVotedOnPoll = optimisticPoll?.voters?.includes(currentUser?.uid ?? '');
    const totalVotes = optimisticPoll ? optimisticPoll.options.reduce((acc, option) => acc + option.votes, 0) : 0;
    
    const contentLimit = 200;
    const shouldShowReadMore = post.content && post.content.length > contentLimit;
    const displayedContent = isExpanded ? post.content : (post.content?.slice(0, contentLimit) + (shouldShowReadMore ? "..." : ""));

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
        if (!currentUser || !optimisticPoll || isVoting || userHasVotedOnPoll) return;
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
        if (!confirm("Confirm record purge from community registry?")) return;
        const postRef = doc(firestore, "posts", post.id);
        deleteDoc(postRef).catch((serverError) => {
            const permissionError = new FirestorePermissionError({
                path: postRef.path,
                operation: 'delete',
            } satisfies SecurityRuleContext, serverError);
            errorEmitter.emit('permission-error', permissionError);
        });
    };

    return (
        <motion.div layout className="w-full">
            <Card className="overflow-hidden glass border-primary/10 transition-all rounded-[1.5rem] flex flex-col relative shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_50px_rgba(255,153,51,0.05)]">
                <div className="absolute top-0 left-0 bottom-0 w-1 bg-gradient-to-b from-[#FF9933] via-white to-[#128807]"></div>
                
                <div className="flex-1 flex flex-col p-6 text-left ml-1">
                    <div className="flex items-center justify-between mb-5">
                        <AuthorIdentityNode post={post} isAdmin={ADMIN_EMAILS.includes(post.authorUid)} />
                        <div className="flex items-center gap-2">
                            <Badge className="bg-primary/10 text-primary border-primary/10 font-bold text-[9px] px-2.5 py-0.5 rounded-full">
                                {post.postType || 'Transmission'}
                            </Badge>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-primary/5">
                                        <MoreVertical className="h-4 w-4 text-muted-foreground" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-52 p-2 rounded-xl shadow-2xl glass border-primary/10">
                                    {isAuthor ? (
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
                                            <div className="flex items-center gap-3">
                                                <div className={cn(
                                                    "h-2.5 w-2.5 rounded-full border border-primary/30 transition-all",
                                                    userHasVotedOnPoll ? "opacity-0" : "group-hover/option:scale-125"
                                                )} />
                                                <span className="font-bold text-sm tracking-tight">{option.text}</span>
                                            </div>
                                            {userHasVotedOnPoll && (
                                                <span className="font-black text-xs text-primary">{percentage.toFixed(0)}%</span>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                            {userHasVotedOnPoll && (
                                <div className="flex items-center gap-2 px-1 text-[10px] font-bold text-[#128807] animate-in fade-in slide-in-from-left-2">
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                    consensus captured // registry secure
                                </div>
                            )}
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
                        <Button variant="ghost" size="sm" className="h-9 px-5 rounded-xl font-bold text-[11px] text-primary border border-primary/10 hover:bg-primary hover:text-white transition-all shadow-sm group/btn" asChild>
                            <Link href="/dashboard/research-analytics">
                                <span>analyze protocol</span>
                                <ArrowRight className="ml-2.5 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                            </Link>
                        </Button>
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

        if (!user) {
            setPostsLoading(false);
            setUserProfile(null);
            setLatestPosts([]);
            return;
        }

        const userDocRef = doc(firestore, "users", user.uid);
        getDoc(userDocRef).then(docSnap => {
            if (docSnap.exists()) setUserProfile(docSnap.data());
        });

        const postsRef = collection(firestore, "posts");
        const q = query(postsRef, orderBy("createdAt", "desc"), limit(5));
        
        postsUnsubscribeRef.current = onSnapshot(q, (snap) => {
            const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as Post));
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

  const isLimited = !userProfile?.subscriptionType?.includes('unlimited');

  return (
    <div className="flex flex-col h-full space-y-12 pb-20 max-w-6xl mx-auto text-left relative">
        <MotionWrapper>
          <Card className="relative p-8 sm:p-12 rounded-[2.5rem] overflow-hidden border-primary/5 bg-card/40 backdrop-blur-xl shadow-2xl">
              <div className="absolute top-0 right-0 p-10 opacity-[0.02] pointer-events-none">
                  <div className="bg-white rounded-full p-10 grayscale">
                    <Logo className="h-56 w-56 border-none p-0 shadow-none" />
                  </div>
              </div>
              <div className="relative z-10 space-y-8">
                  <div className="space-y-4">
                      {isLimited && (
                        <Link href="/dashboard/billing">
                            <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] mb-4 hover:bg-primary/20 transition-all cursor-pointer">
                                Tier: {(userProfile?.subscriptionType || 'Free').replace('_', ' ')} // Upgrade Now
                            </Badge>
                        </Link>
                      )}
                      <h1 className="text-3xl sm:text-5xl font-black font-headline tracking-tighter leading-none text-foreground">
                          Welcome back, <br />
                          <span className="bg-gradient-to-r from-primary via-orange-400 to-accent bg-clip-text text-transparent italic">Nyaya {text}</span>
                      </h1>
                  </div>
                  <p className="text-sm sm:text-base text-muted-foreground font-medium max-w-xl leading-relaxed">
                      Access high-fidelity legal intelligence and forensic auditing tools designed for statutory precision within the Indian judicial ecosystem.
                  </p>
                  <div className="flex flex-wrap gap-4 pt-2">
                      <Button size="sm" className="rounded-xl font-bold px-8 h-12 shadow-xl shadow-primary/20 active:scale-95 transition-all text-xs" asChild>
                          <Link href="/dashboard/narrate">initialize narration</Link>
                      </Button>
                      {isLimited && (
                        <Button variant="outline" size="sm" className="rounded-xl font-bold px-8 h-12 border-primary/10 bg-primary/5 text-primary hover:bg-primary/10 active:scale-95 transition-all text-xs" asChild>
                            <Link href="/dashboard/billing">Upgrade Protocol</Link>
                        </Button>
                      )}
                  </div>
              </div>
          </Card>
        </MotionWrapper>

        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-10">
              <section>
                  <SectionHeader icon={TrendingUp} sector="Sector: Community">live transmission stream</SectionHeader>
                  
                  <div className="space-y-6">
                      {postsLoading ? (
                          <div className="space-y-5">
                              {[...Array(3)].map((_, i) => (
                                  <Card key={i} className="h-32 animate-pulse border-primary/5 rounded-2xl bg-muted/20" />
                              ))}
                          </div>
                      ) : latestPosts.length === 0 ? (
                          <Card className="py-20 text-center glass rounded-[2.5rem] border-dashed border-2 border-primary/10 opacity-40">
                              <p className="font-bold text-sm tracking-tight">registry empty // no active transmissions</p>
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
              {isLimited && (
                <section>
                    <SectionHeader icon={CreditCard} sector="Status: Restricted">Usage Audit</SectionHeader>
                    <Card className="glass p-6 rounded-[2rem] border-primary/10 shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-[0.03]">
                            <Zap className="h-16 w-16 text-primary" />
                        </div>
                        <div className="space-y-6 relative z-10">
                            <div className="flex justify-between items-center">
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Operations Executed</p>
                                <span className="font-mono font-black text-primary">{userProfile?.aiUsageCount || 0} / {userProfile?.subscriptionType === 'pro_20' ? '20' : '5'}</span>
                            </div>
                            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min(100, ((userProfile?.aiUsageCount || 0) / (userProfile?.subscriptionType === 'pro_20' ? 20 : 5)) * 100)}%` }}
                                    className="h-full bg-primary"
                                />
                            </div>
                            <Button asChild className="w-full h-11 font-black uppercase tracking-widest text-[9px] rounded-xl shadow-lg shadow-primary/20 active:scale-95 transition-all">
                                <Link href="/dashboard/billing">Get More Credits</Link>
                            </Button>
                        </div>
                    </Card>
                </section>
              )}

              <section>
                  <SectionHeader icon={Sparkles} sector="Status: Optimized">system matrix</SectionHeader>
                  <div className="grid grid-cols-2 gap-4">
                      {aiFeatures.map((f) => (
                        <Link key={f.href} href={f.href} className="block group" onMouseEnter={() => playSound('hover')}>
                            <Card className="h-full glass p-5 rounded-[1.5rem] border-primary/5 group-hover:border-primary/20 transition-all text-left relative overflow-hidden flex flex-col justify-between min-h-[130px] group-hover:scale-[1.02] group-active:scale-[0.98] shadow-lg">
                                <div className="absolute top-0 right-0 p-3 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                                    <f.icon className="h-8 w-8" />
                                </div>
                                <div>
                                    <div className={cn("p-2.5 rounded-xl w-fit mb-3 transition-transform group-hover:scale-110 shadow-sm", f.bg, f.color)}>
                                        <f.icon className="h-4 w-4" />
                                    </div>
                                    <h3 className="font-black text-[12px] tracking-tight text-foreground leading-none lowercase first-letter:uppercase">{f.title}</h3>
                                    <p className="text-[11px] text-muted-foreground font-medium mt-1.5 leading-snug opacity-70 line-clamp-2">{f.desc}</p>
                                </div>
                                <div className="mt-3.5 pt-3 border-t border-primary/5">
                                    <span className="text-[9px] font-bold text-primary/40 tracking-wider">{f.sector}</span>
                                </div>
                            </Card>
                        </Link>
                      ))}
                  </div>
              </section>

              <section>
                  <SectionHeader icon={Library} sector="Status: Ready">statutory registry</SectionHeader>
                  <div className="space-y-3.5">
                      {[
                        { href: "/dashboard/learn", icon: Library, title: "knowledge hub", label: "learn" },
                        { href: "/dashboard/my-cases", icon: Landmark, title: "case tracker", label: "case" },
                      ].map((item) => (
                        <Link key={item.href} href={item.href} className="block group" onMouseEnter={() => playSound('hover')}>
                            <Card className="glass p-4 rounded-2xl border-primary/5 group-hover:bg-primary/5 group-hover:border-primary/20 transition-all flex items-center justify-between group-hover:scale-[1.01] group-active:scale-[0.99] shadow-sm">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 rounded-xl bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-inner">
                                        <item.icon className="h-4 w-4" />
                                    </div>
                                    <span className="font-bold text-sm tracking-tight lowercase first-letter:uppercase">{item.title}</span>
                                </div>
                                <span className="text-[10px] font-bold text-muted-foreground/30 px-3 py-1 rounded-lg bg-muted/30">{item.label}</span>
                            </Card>
                        </Link>
                      ))}
                  </div>
              </section>
          </div>
        </div>

        <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-center gap-4">
            <Link href="/dashboard/research-analytics/new">
                <motion.button
                    onMouseEnter={() => playSound('hover')}
                    onClick={() => playSound('click')}
                    animate={{
                        y: [0, -8, 0],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative group h-16 w-16 bg-primary text-white rounded-2xl shadow-[0_20px_50px_rgba(var(--primary),0.3)] flex items-center justify-center transition-all overflow-hidden"
                >
                    <motion.div 
                        animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.1, 0.2] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="absolute inset-0 bg-primary rounded-2xl"
                    />
                    <Bot className="h-8 w-8 relative z-10" />
                    
                    <div className="absolute top-2 right-2 bg-accent text-accent-foreground rounded-full p-1 shadow-xl z-20 border-2 border-primary group-hover:scale-110 transition-transform">
                        <Plus className="h-3 w-3 font-black" />
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </motion.button>
            </Link>
            
            <div className="absolute -top-10 right-0 bg-background/80 backdrop-blur-md border border-primary/20 px-3 py-1.5 rounded-xl shadow-2xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <span className="text-[10px] font-black tracking-widest text-primary">Neural assistant active</span>
            </div>
        </div>

        <div className="pt-12 text-center border-t border-primary/5 opacity-30">
            <p className="text-[9px] font-black uppercase tracking-[0.6em] text-muted-foreground">nyayasahayak.in // terminal active // protocol alpha-4</p>
        </div>
    </div>
  );
}
