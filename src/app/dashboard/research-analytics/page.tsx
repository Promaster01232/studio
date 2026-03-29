'use client';

import { useToast } from "@/hooks/use-toast";
import React, { useState, useEffect, useRef } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  PlusCircle, 
  Loader2, 
  ArrowRight, 
  User, 
  MoreVertical, 
  Trash2, 
  Flag,
  Activity,
  BadgeCheck,
  Search,
  Twitter,
  CheckCircle2,
  TrendingUp,
  Globe,
  Sparkles,
  Zap,
  Newspaper,
  ShieldCheck,
  Bot,
  Command,
  Layers,
  ArrowUpRight
} from "lucide-react";
import { useAuth, useFirestore } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, orderBy, onSnapshot, Timestamp, getDoc, doc, updateDoc, increment, arrayUnion, arrayRemove, deleteDoc, addDoc, serverTimestamp } from "firebase/firestore";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from '@/components/ui/skeleton';
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError, type SecurityRuleContext } from "@/firebase/errors";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
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
    postType?: 'Idea' | 'Question' | 'Suggestion' | 'Poll' | 'News';
    tags?: string[];
    isAnonymous?: boolean;
}

interface UserProfile {
    firstName: string;
    lastName: string;
    photoURL?: string;
    email?: string;
    isAdmin?: boolean;
}

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
            <div className="relative">
                <Avatar className="h-10 w-10 border border-primary/10 shadow-lg rounded-xl group-hover/author:scale-105 transition-transform duration-500">
                    {authorAvatar && <AvatarImage src={authorAvatar} alt={authorName} className="object-cover" />}
                    <AvatarFallback className="font-black bg-primary/10 text-primary text-xs">{fallback}</AvatarFallback>
                </Avatar>
                {isAdmin && <div className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-0.5 border-2 border-background shadow-sm"><BadgeCheck className="h-2 w-2 text-white" /></div>}
            </div>
            <div className="flex-1 text-left">
                <div className="flex items-center gap-1.5">
                    <p className="font-black text-xs tracking-tight group-hover/author:text-primary transition-colors">{authorName}</p>
                </div>
                <p className="text-[9px] text-muted-foreground font-black uppercase tracking-[0.2em] opacity-40">
                    {post.createdAt ? formatDistanceToNow(post.createdAt.toDate(), { addSuffix: true }) : 'Syncing...'}
                </p>
            </div>
        </Link>
    );
}

function PostCard({ post, userProfile }: { post: Post, userProfile: UserProfile | null }) {
    const { toast } = useToast();
    const firestore = useFirestore();
    const auth = useAuth();
    const { currentUser } = auth;
    
    const [isVoting, setIsVoting] = useState(false);
    const [isLiking, setIsLiking] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    
    const [optimisticLikes, setOptimisticLikes] = useState(post.likes);
    const [optimisticLikedBy, setOptimisticLikedBy] = useState(post.likedBy || []);
    const [optimisticPoll, setOptimisticPoll] = useState(post.poll);

    const userHasLiked = optimisticLikedBy.includes(currentUser?.uid ?? '');
    const isAuthor = post.authorUid === currentUser?.uid;
    const userHasVotedOnPoll = optimisticPoll?.voters?.includes(currentUser?.uid ?? '');
    const totalVotes = optimisticPoll ? optimisticPoll.options.reduce((acc, option) => acc + option.votes, 0) : 0;
    
    const contentLimit = 300;
    const shouldShowReadMore = post.content && post.content.length > contentLimit;
    const displayedContent = isExpanded ? post.content : (post.content?.slice(0, contentLimit) + (shouldShowReadMore ? "..." : ""));

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
        }).catch((serverError) => {
            setOptimisticLikes(post.likes);
            setOptimisticLikedBy(post.likedBy || []);
            const permissionError = new FirestorePermissionError({
                path: postRef.path,
                operation: 'update',
                requestResourceData: { likes: post.likes },
            } satisfies SecurityRuleContext, serverError);
            errorEmitter.emit('permission-error', permissionError);
        }).finally(() => {
            setIsLiking(false);
        });
    };

    const handleVote = (optionIndex: number) => {
        if (!currentUser || !optimisticPoll || isVoting || userHasVotedOnPoll) return;
        setIsVoting(true);

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
            .finally(() => {
                setIsVoting(false);
            });
    };

    const handleDeletePost = () => {
        if (!confirm("Confirm Transmission Purge: This action will permanently erase the node from the community registry.")) return;
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

    return (
        <Card className="overflow-hidden bg-card/40 backdrop-blur-md border-primary/10 transition-all shadow-xl hover:shadow-2xl hover:border-primary/20 rounded-[2rem] relative group/post text-left">
            {/* Subtle Vertical Identity Bar */}
            <div className="absolute top-0 left-0 bottom-0 w-1 flex flex-col">
                <div className="flex-1 bg-primary/20"></div>
                <div className="flex-1 bg-background"></div>
                <div className="flex-1 bg-green-500/20"></div>
            </div>
            
            <CardHeader className="p-6 sm:p-8 pb-0 ml-1">
                <div className="flex items-start justify-between mb-6">
                    <AuthorIdentityNode post={post} isAdmin={ADMIN_EMAILS.includes(post.authorUid)} />
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-primary/5 border-primary/10 text-[9px] font-black uppercase px-3 py-0.5 rounded-full tracking-wider text-primary">
                            {post.postType || 'Transmission'}
                        </Badge>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="h-9 w-9 rounded-xl hover:bg-primary/5 flex items-center justify-center transition-all">
                                    <MoreVertical className="h-4 w-4 text-muted-foreground" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-52 p-2 rounded-2xl shadow-2xl glass border-primary/10">
                                {isAuthor ? (
                                    <DropdownMenuItem onSelect={handleDeletePost} className="rounded-xl font-bold text-xs h-10 px-3 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10 gap-3">
                                        <Trash2 className="h-4 w-4" /> 
                                        <span>Purge record</span>
                                    </DropdownMenuItem>
                                ) : (
                                    <DropdownMenuItem className="rounded-xl font-bold text-xs h-10 px-3 cursor-pointer gap-3 hover:bg-red-500/5 hover:text-red-500">
                                        <Flag className="h-4 w-4" /> 
                                        <span>Flag node</span>
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-xl sm:text-2xl font-black tracking-tight text-foreground/90 leading-tight">{post.title}</h3>
                    
                    {post.content && (
                        <div className="space-y-3">
                            <p className="text-sm sm:text-base text-muted-foreground font-medium leading-relaxed whitespace-pre-line">
                                {displayedContent}
                            </p>
                            {shouldShowReadMore && (
                                <button 
                                    onClick={() => setIsExpanded(!isExpanded)}
                                    className="text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:underline"
                                >
                                    {isExpanded ? "Close audit" : "Expand full audit"}
                                </button>
                            )}
                        </div>
                    )}

                    {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                            {post.tags.map(tag => (
                                <Badge key={tag} variant="outline" className="bg-muted/30 border-primary/5 text-[8px] font-black uppercase px-2.5 py-0.5 rounded-lg tracking-widest text-muted-foreground">
                                    #{tag}
                                </Badge>
                            ))}
                        </div>
                    )}
                </div>
            </CardHeader>

            <div className="px-6 sm:px-8 pb-0 pt-6 ml-1">
                 {post.link && (
                    <a href={post.link} target="_blank" rel="noopener noreferrer" className="block p-4 rounded-2xl border border-primary/5 bg-primary/5 hover:bg-primary/10 transition-all group/link">
                        <div className="flex items-center gap-4">
                            <div className="p-2 rounded-xl bg-background shadow-sm group-hover/link:scale-110 transition-transform">
                                <Globe className="h-4 w-4 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/60">Citation Ingress</p>
                                <p className="text-xs font-bold truncate text-foreground/80">{post.link}</p>
                            </div>
                            <ArrowUpRight className="h-4 w-4 text-primary opacity-20 group-hover/link:opacity-100 transition-opacity" />
                        </div>
                    </a>
                )}
                
                {optimisticPoll && (
                    <div className="pt-6 space-y-3">
                       <div className="grid gap-2">
                            {optimisticPoll.options.map((option, index) => {
                                const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
                                return (
                                    <button 
                                        key={index} 
                                        onClick={() => handleVote(index)}
                                        disabled={userHasVotedOnPoll || isVoting}
                                        className={cn(
                                            "w-full relative h-12 rounded-xl border border-primary/5 overflow-hidden transition-all text-left px-4 group/option shadow-sm",
                                            userHasVotedOnPoll ? "bg-muted/10 cursor-default" : "bg-white dark:bg-black/20 hover:border-primary/20 active:scale-[0.99]"
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
                                                    "h-2 w-2 rounded-full border border-primary/30",
                                                    userHasVotedOnPoll ? "opacity-0" : "group-hover/option:scale-125"
                                                )} />
                                                <span className="font-bold text-xs sm:text-sm tracking-tight">{option.text}</span>
                                            </div>
                                            {userHasVotedOnPoll && (
                                                <span className="font-black text-xs text-primary">{percentage.toFixed(0)}%</span>
                                            )}
                                        </div>
                                    </button>
                                )
                            })}
                       </div>
                       {userHasVotedOnPoll && (
                            <div className="flex items-center gap-2 px-2 text-[9px] font-black uppercase tracking-[0.2em] text-[#128807] animate-in fade-in slide-in-from-left-2">
                                <CheckCircle2 className="h-3 w-3" />
                                identity-verified consensus captured
                            </div>
                        )}
                    </div>
                )}
            </div>

            <CardFooter className="p-6 sm:p-8 mt-6 flex justify-between items-center bg-muted/5 border-t border-primary/5 ml-1">
                <div className="flex gap-2">
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className={cn(
                            "h-9 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest gap-2.5 transition-all", 
                            userHasLiked ? "text-red-500 bg-red-500/5 shadow-inner" : "text-primary hover:bg-primary/5"
                        )} 
                        onClick={handleLike} 
                        disabled={isLiking}
                    >
                        {isLiking ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Heart className={cn("h-3.5 w-3.5", userHasLiked && "fill-current")} />}
                        <span>{optimisticLikes} Audits</span>
                    </Button>
                    
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="h-9 w-9 rounded-xl bg-background border border-primary/10 flex items-center justify-center text-muted-foreground hover:text-primary transition-all">
                                <Share2 className="h-3.5 w-3.5" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl shadow-2xl glass border-primary/10">
                            <DropdownMenuItem onClick={() => handleShare('whatsapp')} className="rounded-xl font-bold text-xs h-10 px-3 cursor-pointer gap-3">
                                <MessageCircle className="h-4 w-4 text-green-600" /> WhatsApp
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleShare('twitter')} className="rounded-xl font-bold text-xs h-10 px-3 cursor-pointer gap-3">
                                <Twitter className="h-4 w-4 text-blue-500" /> Twitter (X)
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleShare('copy')} className="rounded-xl font-bold text-xs h-10 px-3 cursor-pointer gap-3">
                                <Bookmark className="h-4 w-4 text-primary" /> Copy ID
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                
                <Button asChild variant="ghost" className="h-9 px-4 rounded-xl font-black text-[10px] uppercase tracking-widest text-primary hover:bg-primary hover:text-white transition-all group/btn">
                    <Link href="/dashboard/research-analytics">
                        Analyze <ArrowRight className="ml-2 h-3 w-3 transition-transform group-hover/btn:translate-x-1" />
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}

export default function ResearchAnalyticsPage() {
    const firestore = useFirestore();
    const auth = useAuth();
    const { toast } = useToast();
    const [feed, setFeed] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    
    const postsUnsubscribeRef = useRef<(() => void) | null>(null);
    
    useEffect(() => {
        if (!firestore || !auth) return;

        const unsubscribeAuth = onAuthStateChanged(auth, user => {
            setIsAuthenticated(!!user);

            if (postsUnsubscribeRef.current) {
                postsUnsubscribeRef.current();
                postsUnsubscribeRef.current = null;
            }

            if (!user) {
                setLoading(false);
                setFeed([]);
                setUserProfile(null);
                return;
            }

            setLoading(true);
            const userDocRef = doc(firestore, "users", user.uid);
            getDoc(userDocRef).then(userDoc => {
                if (userDoc.exists()) {
                    setUserProfile(userDoc.data() as UserProfile);
                }
            });

            const postsCollection = collection(firestore, "posts");
            const q = query(postsCollection, orderBy("createdAt", "desc"));

            postsUnsubscribeRef.current = onSnapshot(q,
                (querySnapshot) => {
                    const postsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
                    setFeed(postsData);
                    setLoading(false);
                },
                (serverError) => {
                    if (auth.currentUser) {
                        const permissionError = new FirestorePermissionError({
                            path: postsCollection.path,
                            operation: 'list',
                        } satisfies SecurityRuleContext, serverError);
                        errorEmitter.emit('permission-error', permissionError);
                    }
                    setLoading(false);
                    setFeed([]);
                }
            );
        });

        return () => {
            unsubscribeAuth();
            if (postsUnsubscribeRef.current) postsUnsubscribeRef.current();
        };
    }, [auth, firestore]);
    
    if (loading) {
        return (
            <div className="space-y-12 max-w-4xl mx-auto pb-20 px-4 sm:px-0 text-left">
                <div className="space-y-4">
                    <Skeleton className="h-12 w-64 rounded-xl" />
                    <Skeleton className="h-6 w-full max-w-lg rounded-lg" />
                </div>
                <div className="space-y-8">
                    {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-64 w-full rounded-[2rem]" />)}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-12 max-w-4xl mx-auto pb-20 px-2 sm:px-0 text-left">
            {/* Compact Professional Header */}
            <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative p-8 sm:p-12 rounded-[2.5rem] overflow-hidden bg-card/40 backdrop-blur-xl border border-primary/10 shadow-2xl"
            >
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                    <Logo className="h-48 w-48 grayscale" priority />
                </div>
                
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                                <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
                                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-primary">Community Authority</span>
                            </div>
                            <Badge variant="outline" className="text-[8px] font-black uppercase border-blue-500/20 text-blue-500/70 tracking-widest bg-blue-500/5">Registry: Active</Badge>
                        </div>
                        <h1 className="text-3xl sm:text-5xl font-black font-headline tracking-tighter uppercase leading-tight text-foreground">
                            Live <span className="text-primary italic">Transmissions.</span>
                        </h1>
                        <p className="text-sm sm:text-base text-muted-foreground font-medium max-w-xl leading-relaxed opacity-80">
                            Publicly audited statutory ideas, community polling, and real-time legal forensics from the Nyaya Sahayak registry terminal.
                        </p>
                    </div>

                    <Button size="lg" className="h-14 px-8 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-primary/30 group active:scale-95 transition-all" asChild>
                        <Link href={isAuthenticated ? "/dashboard/research-analytics/new" : "/login"}>
                            <PlusCircle className="mr-3 h-5 w-5" />
                            Initialize Post
                        </Link>
                    </Button>
                </div>
            </motion.div>
            
            {/* Feed Section */}
            <div className="grid gap-8">
                <AnimatePresence mode="popLayout">
                    {!isAuthenticated ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-24 text-center opacity-40 flex flex-col items-center gap-8">
                            <div className="p-8 rounded-[2rem] bg-muted/20 border-2 border-dashed border-primary/10">
                                <Zap className="h-16 w-16 text-primary" />
                            </div>
                            <div className="space-y-2">
                                <p className="font-black text-2xl tracking-tighter uppercase">Clearance Required</p>
                                <p className="text-xs font-medium italic max-w-xs mx-auto">"Initialize dashboard ingress to access live community transmissions."</p>
                            </div>
                        </motion.div>
                    ) : feed.length === 0 ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-24 text-center opacity-40 flex flex-col items-center gap-8">
                            <div className="p-8 rounded-[2rem] bg-muted/20 border-2 border-dashed border-primary/10">
                                <Newspaper className="h-16 w-16 text-muted-foreground" />
                            </div>
                            <div className="space-y-2">
                                <p className="font-black text-2xl tracking-tighter uppercase">Registry Clear</p>
                                <p className="text-xs font-medium italic max-w-xs mx-auto">"No active transmissions currently found in the community node."</p>
                            </div>
                        </motion.div>
                    ) : (
                        feed.map((item, index) => (
                            <motion.div 
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05, duration: 0.5 }}
                            >
                                <PostCard post={item} userProfile={userProfile} />
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>

            <div className="pt-16 border-t border-primary/5 flex flex-col sm:flex-row items-center justify-between gap-8 opacity-40">
                <div className="flex gap-12">
                    <div className="flex items-center gap-4">
                        <ShieldCheck className="h-5 w-5 text-primary" />
                        <div className="text-left">
                            <p className="text-[9px] font-black uppercase tracking-widest text-primary">Verified Hub</p>
                            <p className="text-[8px] font-bold text-muted-foreground">Forensic Identity Audit Active.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Layers className="h-5 w-5 text-blue-500" />
                        <div className="text-left">
                            <p className="text-[9px] font-black uppercase tracking-widest text-blue-500">Registry Density</p>
                            <p className="text-[8px] font-bold text-muted-foreground">High-fidelity consensus nodes.</p>
                        </div>
                    </div>
                </div>
                <p className="text-[8px] font-black uppercase tracking-[0.5em] text-muted-foreground">NYAYASAHAYAK.IN // NS-STREAM-V4</p>
            </div>
        </div>
    );
}
