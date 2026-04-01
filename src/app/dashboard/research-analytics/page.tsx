'use client';

import { useToast } from "@/hooks/use-toast";
import React, { useState, useEffect, useRef } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Heart, 
  Share2, 
  Bookmark, 
  PlusCircle, 
  Loader2, 
  ArrowRight, 
  MoreVertical, 
  Trash2, 
  Flag,
  Activity,
  BadgeCheck,
  Twitter,
  CheckCircle2,
  Globe,
  Sparkles,
  Zap,
  Newspaper,
  ShieldCheck,
  Bot,
  Layers,
  ArrowUpRight,
  MessageCircle
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

const typeConfig: Record<string, { color: string, bg: string, border: string, icon: any, gradient: string, glow: string }> = {
    'Idea': { color: 'text-amber-600', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: Sparkles, gradient: 'from-amber-500/5', glow: 'shadow-amber-500/10' },
    'Question': { color: 'text-blue-600', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: Bot, gradient: 'from-blue-500/5', glow: 'shadow-blue-500/10' },
    'Suggestion': { color: 'text-emerald-600', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: Zap, gradient: 'from-emerald-500/5', glow: 'shadow-emerald-500/10' },
    'Poll': { color: 'text-purple-600', bg: 'bg-purple-500/10', border: 'border-purple-500/20', icon: Layers, gradient: 'from-purple-500/5', glow: 'shadow-purple-500/10' },
    'News': { color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20', icon: Newspaper, gradient: 'from-primary/5', glow: 'shadow-primary/10' },
};

function AuthorIdentityNode({ post, isAdmin }: { post: Post, isAdmin: boolean }) {
    const authorName = post.isAnonymous ? 'Anonymous' : post.authorName;
    const authorAvatar = post.isAnonymous ? undefined : post.authorAvatar;
    const fallback = post.isAnonymous ? 'A' : (authorName?.charAt(0) || '');

    return (
        <Link 
            href={post.isAnonymous ? "#" : `/dashboard/profile/${post.authorUid}`} 
            className={cn(
                "flex items-center gap-2.5 sm:gap-3 group/author transition-all active:scale-[0.98]",
                post.isAnonymous ? "pointer-events-none opacity-60" : "cursor-pointer"
            )}
        >
            <div className="relative">
                <Avatar className="h-9 w-9 sm:h-10 sm:w-10 border border-primary/10 shadow-lg rounded-xl group-hover/author:scale-105 transition-transform duration-500">
                    {authorAvatar && <AvatarImage src={authorAvatar} alt={authorName} className="object-cover" />}
                    <AvatarFallback className="font-black bg-primary/10 text-primary text-xs">{fallback}</AvatarFallback>
                </Avatar>
                {isAdmin && <div className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-0.5 border-2 border-background shadow-sm"><BadgeCheck className="h-2.5 w-2.5 text-white" /></div>}
            </div>
            <div className="flex-1 text-left">
                <div className="flex items-center gap-1.5">
                    <p className="font-black text-xs tracking-tight group-hover/author:text-primary transition-colors truncate max-w-[120px] sm:max-w-none">{authorName}</p>
                </div>
                <p className="text-[8px] sm:text-[9px] text-muted-foreground font-black uppercase tracking-[0.2em] opacity-40">
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
    const isGlobalAdmin = currentUser?.email && ADMIN_EMAILS.includes(currentUser.email.toLowerCase());
    
    const userHasVotedOnPoll = optimisticPoll?.voters?.includes(currentUser?.uid ?? '');
    const totalVotes = optimisticPoll ? optimisticPoll.options.reduce((acc, option) => acc + option.votes, 0) : 0;
    
    const contentLimit = 300;
    const shouldShowReadMore = post.content && post.content.length > contentLimit;
    const displayedContent = isExpanded ? post.content : (post.content?.slice(0, contentLimit) + (shouldShowReadMore ? "..." : ""));

    const config = typeConfig[post.postType || 'Idea'] || typeConfig['Idea'];

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
        if (!currentUser) {
            toast({ title: "Authentication Required", description: "Initialize dashboard ingress to participate in audits." });
            return;
        }
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
                }).catch(() => {});
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
        if (!currentUser) {
            toast({ title: "Consensus Required", description: "Initialize dashboard ingress to participate in community polls." });
            return;
        }
        if (!optimisticPoll || isVoting || userHasVotedOnPoll) return;
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
        const confirmMsg = isGlobalAdmin && !isAuthor ? "Confirm ADMIN PURGE: You are using institutional root privileges to erase this transmission." : "Confirm Transmission Purge: This action will permanently erase the node from the community registry.";
        if (!confirm(confirmMsg)) return;
        
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
        <Card className={cn(
            "overflow-hidden bg-card border-primary/10 transition-all shadow-xl hover:shadow-2xl hover:border-primary/20 rounded-[2.5rem] relative group/post text-left w-full",
            config.glow
        )}>
            <div className={cn("absolute inset-0 bg-gradient-to-br via-transparent to-transparent opacity-5 group-hover:opacity-10 transition-opacity duration-700", config.gradient)}></div>
            
            <div className="absolute top-0 left-0 bottom-0 w-1 flex flex-col">
                <div className={cn("flex-1 opacity-40", config.bg)}></div>
                <div className="flex-1 bg-white dark:bg-zinc-900"></div>
                <div className={cn("flex-1 opacity-40", config.bg)}></div>
            </div>
            
            <CardHeader className="p-5 sm:p-10 pb-0 ml-1">
                <div className="flex items-start justify-between mb-6 sm:mb-8">
                    <AuthorIdentityNode post={post} isAdmin={ADMIN_EMAILS.includes(post.authorUid)} />
                    <div className="flex items-center gap-2 sm:gap-3">
                        <Badge variant="outline" className={cn("border font-black text-[8px] sm:text-[9px] uppercase px-3 sm:px-4 py-1 rounded-full tracking-[0.1em] shadow-sm whitespace-nowrap", config.bg, config.color, config.border)}>
                            <config.icon className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1.5 sm:mr-2" />
                            {post.postType || 'Transmission'}
                        </Badge>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="h-9 w-9 sm:h-10 sm:w-10 rounded-2xl bg-muted/20 hover:bg-primary/5 flex items-center justify-center transition-all shadow-sm">
                                    <MoreVertical className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl shadow-2xl glass border-primary/10">
                                {(isAuthor || isGlobalAdmin) ? (
                                    <DropdownMenuItem onSelect={handleDeletePost} className="rounded-xl font-bold text-xs h-11 px-4 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10 gap-3">
                                        <Trash2 className="h-4 w-4" /> 
                                        <span>{isGlobalAdmin && !isAuthor ? 'Admin Purge' : 'Purge record'}</span>
                                    </DropdownMenuItem>
                                ) : (
                                    <DropdownMenuItem className="rounded-xl font-bold text-xs h-11 px-4 cursor-pointer gap-3 hover:bg-red-500/5 hover:text-red-500">
                                        <Flag className="h-4 w-4" /> 
                                        <span>Flag node</span>
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                <div className="space-y-4 sm:space-y-5 text-left">
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-foreground/90 leading-[1.1]">{post.title}</h3>
                    
                    {post.content && (
                        <div className="space-y-3 sm:space-y-4">
                            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground font-medium leading-relaxed whitespace-pre-line">
                                {displayedContent}
                            </p>
                            {shouldShowReadMore && (
                                <button 
                                    onClick={() => setIsExpanded(!isExpanded)}
                                    className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-primary hover:underline flex items-center gap-2"
                                >
                                    <Activity className="h-3.5 w-3.5" />
                                    {isExpanded ? "Close forensic audit" : "Expand full audit node"}
                                </button>
                            )}
                        </div>
                    )}

                    {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-1 sm:pt-2">
                            {post.tags.map(tag => (
                                <Badge key={tag} variant="secondary" className="bg-primary/5 border border-primary/10 text-[8px] sm:text-[9px] font-black uppercase px-2.5 sm:px-3 py-1 rounded-xl tracking-widest text-primary/70">
                                    #{tag}
                                </Badge>
                            ))}
                        </div>
                    )}
                </div>
            </CardHeader>

            <div className="px-5 sm:px-10 pb-0 pt-6 sm:pt-8 ml-1 text-left">
                 {post.link && (
                    <a href={post.link} target="_blank" rel="noopener noreferrer" className="block p-4 sm:p-5 rounded-3xl border border-primary/10 bg-muted/30 hover:bg-primary/5 transition-all group/link shadow-inner">
                        <div className="flex items-center gap-4 sm:gap-5">
                            <div className="p-2.5 sm:p-3 rounded-2xl bg-white dark:bg-black/40 shadow-md group-hover/link:scale-110 transition-transform">
                                <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0 text-left">
                                <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-0.5">Statutory Citation Ingress</p>
                                <p className="text-xs sm:text-sm font-bold truncate text-foreground/80">{post.link}</p>
                            </div>
                            <ArrowUpRight className="h-4 w-4 sm:h-5 sm:w-5 text-primary opacity-20 group-hover/link:opacity-100 transition-opacity" />
                        </div>
                    </a>
                )}
                
                {optimisticPoll && (
                    <div className="pt-6 sm:pt-8 space-y-4">
                       <div className="grid gap-2.5 sm:gap-3">
                            {optimisticPoll.options.map((option, index) => {
                                const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
                                return (
                                    <button 
                                        key={index} 
                                        onClick={() => handleVote(index)}
                                        disabled={userHasVotedOnPoll || isVoting}
                                        className={cn(
                                            "w-full relative h-12 sm:h-14 rounded-2xl border border-primary/5 overflow-hidden transition-all text-left px-4 sm:px-5 group/option shadow-sm",
                                            userHasVotedOnPoll ? "bg-muted/20 cursor-default" : "bg-white dark:bg-black/20 hover:border-primary/20 active:scale-[0.99]"
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
                                            <div className="flex items-center gap-3 sm:gap-4">
                                                <div className={cn(
                                                    "h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full border-2 border-primary/30",
                                                    userHasVotedOnPoll ? "bg-primary border-transparent" : "group-hover/option:scale-125"
                                                )} />
                                                <span className="font-bold text-xs sm:text-sm sm:text-base tracking-tight">{option.text}</span>
                                            </div>
                                            {userHasVotedOnPoll && (
                                                <span className="font-black text-xs sm:text-sm text-primary font-mono">{percentage.toFixed(0)}%</span>
                                            )}
                                        </div>
                                    </button>
                                )
                            })}
                       </div>
                       {userHasVotedOnPoll && (
                            <div className="flex items-center gap-2.5 sm:gap-3 px-3 py-3 rounded-2xl bg-green-500/5 border border-green-500/10 text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-[#128807] animate-in fade-in slide-in-from-left-2 text-left">
                                <ShieldCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                identity-verified consensus captured // registry secure
                            </div>
                        )}
                    </div>
                )}
            </div>

            <CardFooter className="p-5 sm:p-10 mt-6 sm:mt-8 flex justify-between items-center bg-muted/5 border-t border-primary/5 ml-1">
                <div className="flex gap-2 sm:gap-3">
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className={cn(
                            "h-10 sm:h-11 px-4 sm:px-6 rounded-2xl text-[10px] sm:text-[11px] font-black uppercase tracking-widest gap-2 sm:gap-3 transition-all shadow-sm", 
                            userHasLiked ? "text-red-500 bg-red-500/5 border border-red-500/10" : "bg-white dark:bg-black/20 text-primary border border-primary/5 hover:bg-primary/5"
                        )} 
                        onClick={handleLike} 
                        disabled={isLiking}
                    >
                        {isLiking ? <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" /> : <Heart className={cn("h-3.5 w-3.5 sm:h-4 sm:w-4", userHasLiked && "fill-current")} />}
                        <span className="font-black">{optimisticLikes} <span className="hidden xs:inline">Audits</span></span>
                    </Button>
                    
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="h-10 sm:h-11 px-4 sm:px-5 rounded-2xl bg-white dark:bg-black/20 border border-primary/5 flex items-center justify-center gap-2 text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all shadow-sm">
                                <Share2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                <span className="hidden xs:inline">Share Node</span>
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-60 p-2 rounded-2xl shadow-2xl glass border-primary/10">
                            <DropdownMenuItem onClick={() => handleShare('whatsapp')} className="rounded-xl font-bold text-xs h-11 px-4 cursor-pointer gap-4">
                                <div className="p-2 rounded-lg bg-green-500/10 text-green-600"><MessageCircle className="h-4 w-4" /></div> WhatsApp
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleShare('twitter')} className="rounded-xl font-bold text-xs h-11 px-4 cursor-pointer gap-4">
                                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500"><Twitter className="h-4 w-4" /></div> Twitter (X)
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleShare('copy')} className="rounded-xl font-bold text-xs h-11 px-4 cursor-pointer gap-4">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary"><Bookmark className="h-4 w-4" /></div> Copy Transmission ID
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                
                <Button asChild variant="ghost" className="h-10 sm:h-11 px-4 sm:px-6 rounded-2xl font-black text-[10px] sm:text-[11px] uppercase tracking-widest text-primary hover:bg-primary hover:text-white transition-all group/btn border border-primary/5 bg-white dark:bg-black/20 shadow-sm">
                    <Link href="/dashboard/research-analytics">
                        <span className="hidden xs:inline">Analyze Protocol</span>
                        <span className="xs:hidden">Analyze</span>
                        <ArrowRight className="ml-2 sm:ml-3 h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform group-hover/btn:translate-x-1.5" />
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}

export default function ResearchAnalyticsPage() {
    const firestore = useFirestore();
    const auth = useAuth();
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

            if (user) {
                const userDocRef = doc(firestore, "users", user.uid);
                getDoc(userDocRef).then(userDoc => {
                    if (userDoc.exists()) {
                        setUserProfile(userDoc.data() as UserProfile);
                    }
                });
            } else {
                setUserProfile(null);
            }

            setLoading(true);
            const postsCollection = collection(firestore, "posts");
            const q = query(postsCollection, orderBy("createdAt", "desc"));

            postsUnsubscribeRef.current = onSnapshot(q,
                (querySnapshot) => {
                    const postsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
                    setFeed(postsData);
                    setLoading(false);
                },
                (serverError) => {
                    console.error("Registry feed ingress error:", serverError);
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
                    <Skeleton className="h-16 w-80 rounded-2xl" />
                    <Skeleton className="h-6 w-full max-w-xl rounded-lg" />
                </div>
                <div className="space-y-10">
                    {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-96 w-full rounded-[2.5rem]" />)}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-12 max-w-4xl mx-auto pb-20 px-2 sm:px-0 text-left">
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative p-8 sm:p-16 rounded-[3rem] overflow-hidden bg-card/40 backdrop-blur-xl border border-primary/10 shadow-3xl"
            >
                <div className="absolute top-0 right-0 p-10 opacity-[0.04] pointer-events-none">
                    <Logo className="h-64 w-64 grayscale" priority />
                </div>
                
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-8 sm:gap-10">
                    <div className="space-y-5 sm:space-y-6 text-left">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 shadow-sm">
                                <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary animate-pulse" />
                                <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.4em] text-primary">Community Ingress Hub</span>
                            </div>
                            <Badge variant="outline" className="text-[8px] sm:text-[9px] font-black uppercase border-blue-500/20 text-blue-500/70 tracking-widest bg-blue-500/5 px-2.5 sm:px-3">Registry: Active</Badge>
                        </div>
                        <h1 className="text-3xl sm:text-6xl lg:text-7xl font-black font-headline tracking-tighter uppercase leading-[0.9] text-foreground">
                            Live <span className="text-primary italic font-black">Transmissions.</span>
                        </h1>
                        <p className="text-xs sm:text-lg text-muted-foreground font-medium max-w-xl leading-relaxed opacity-80 text-left">
                            Publicly audited statutory ideas, community polling, and real-time legal forensics from the Nyaya Sahayak registry terminal.
                        </p>
                    </div>

                    <Button size="lg" className="h-14 sm:h-16 px-8 sm:px-10 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] sm:text-[11px] shadow-2xl shadow-primary/30 group active:scale-95 transition-all shrink-0 w-full md:w-auto" asChild>
                        <Link href={isAuthenticated ? "/dashboard/research-analytics/new" : "/login"}>
                            <PlusCircle className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 group-hover:rotate-90 transition-transform duration-500" />
                            Initialize Post
                        </Link>
                    </Button>
                </div>
            </motion.div>
            
            <div className="grid gap-8 sm:gap-10">
                <AnimatePresence mode="popLayout">
                    {feed.length === 0 ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-32 text-center opacity-40 flex flex-col items-center gap-8 sm:gap-10">
                            <div className="p-10 sm:p-12 rounded-[3rem] bg-muted/20 border-2 border-dashed border-primary/10 shadow-inner">
                                <Newspaper className="h-16 w-16 sm:h-20 sm:w-20 text-muted-foreground" />
                            </div>
                            <div className="space-y-3">
                                <p className="font-black text-2xl sm:text-3xl tracking-tighter uppercase">Registry Clear</p>
                                <p className="text-xs sm:text-sm font-medium italic max-w-xs mx-auto">"No active transmissions currently found in the community node."</p>
                            </div>
                        </motion.div>
                    ) : (
                        feed.map((item, index) => (
                            <motion.div 
                                key={item.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05, duration: 0.6 }}
                            >
                                <PostCard post={item} userProfile={userProfile} />
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>

            <div className="pt-16 sm:pt-20 border-t border-primary/10 flex flex-col sm:flex-row items-center justify-between gap-8 sm:gap-10">
                <div className="flex flex-wrap justify-center gap-8 sm:gap-12">
                    <div className="flex items-center gap-4 sm:gap-5 group">
                        <div className="p-3.5 sm:p-4 rounded-[1.2rem] sm:rounded-[1.5rem] bg-primary/5 text-primary group-hover:scale-110 transition-transform shadow-sm">
                            <ShieldCheck className="h-5 w-5 sm:h-6 sm:w-6" />
                        </div>
                        <div className="text-left">
                            <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-primary">Verified Hub</p>
                            <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground opacity-60">Forensic Identity Audit Active.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 sm:gap-5 group">
                        <div className="p-3.5 sm:p-4 rounded-[1.2rem] sm:rounded-[1.5rem] bg-blue-500/5 text-blue-500 group-hover:scale-110 transition-transform shadow-sm">
                            <Layers className="h-5 w-5 sm:h-6 sm:w-6" />
                        </div>
                        <div className="text-left">
                            <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-blue-500">Registry Density</p>
                            <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground opacity-60">High-fidelity consensus nodes.</p>
                        </div>
                    </div>
                </div>
                <p className="text-[9px] font-black uppercase tracking-[0.6em] text-muted-foreground/30 shrink-0">NYAYASAHAYAK.IN // NS-STREAM-V4</p>
            </div>
        </div>
    );
}