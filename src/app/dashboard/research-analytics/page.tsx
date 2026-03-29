
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
        <Card className="overflow-hidden bg-card/40 backdrop-blur-md border-primary/10 transition-all shadow-2xl rounded-[2.5rem] relative group/post text-left">
            {/* Tricolor Forensic Indicator */}
            <div className="absolute top-0 left-0 bottom-0 w-1.5 flex flex-col">
                <div className="flex-1 bg-[#FF9933]"></div>
                <div className="flex-1 bg-white"></div>
                <div className="flex-1 bg-[#128807]"></div>
            </div>
            
            <CardHeader className="p-8 sm:p-10 pb-0 ml-1.5">
                <div className="flex items-start justify-between mb-8">
                    <AuthorIdentityNode post={post} isAdmin={ADMIN_EMAILS.includes(post.authorUid)} />
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary/5 border border-primary/10 shadow-inner">
                            <Activity className="h-3 w-3 text-primary animate-pulse" />
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">{post.postType || 'Dossier'}</span>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="h-10 w-10 rounded-2xl hover:bg-primary/5 flex items-center justify-center transition-all bg-muted/20 border border-transparent hover:border-primary/10">
                                    <MoreVertical className="h-4.5 w-4.5 text-muted-foreground" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl shadow-2xl shadow-black/10 glass border-primary/10">
                                {isAuthor ? (
                                    <DropdownMenuItem onSelect={handleDeletePost} className="rounded-xl font-bold text-xs h-11 px-4 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10 gap-3">
                                        <Trash2 className="h-4 w-4" /> 
                                        <span>Purge Transmission</span>
                                    </DropdownMenuItem>
                                ) : (
                                    <DropdownMenuItem className="rounded-xl font-bold text-xs h-11 px-4 cursor-pointer gap-3 hover:bg-red-500/5 hover:text-red-500">
                                        <Flag className="h-4 w-4" /> 
                                        <span>Statutory Report</span>
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                <div className="space-y-5">
                    <div className="space-y-2">
                        <h3 className="text-2xl sm:text-4xl font-black tracking-tighter text-foreground leading-tight">{post.title}</h3>
                        <div className="h-1 w-12 bg-primary rounded-full"></div>
                    </div>
                    
                    {post.content && (
                        <div className="space-y-4">
                            <p className="text-sm sm:text-lg text-muted-foreground font-medium leading-relaxed whitespace-pre-line">
                                {displayedContent}
                            </p>
                            {shouldShowReadMore && (
                                <button 
                                    onClick={() => setIsExpanded(!isExpanded)}
                                    className="text-[11px] font-black uppercase tracking-[0.3em] text-primary hover:text-primary/80 flex items-center gap-2 transition-colors"
                                >
                                    {isExpanded ? "Close Dossier" : "Analyze Full Dossier"} <ArrowRight className={cn("h-3 w-3 transition-transform", isExpanded ? "-rotate-90" : "rotate-0")} />
                                </button>
                            )}
                        </div>
                    )}

                    {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-4">
                            {post.tags.map(tag => (
                                <Badge key={tag} variant="outline" className="bg-primary/5 border-primary/10 text-[10px] font-black uppercase px-4 py-1 rounded-xl tracking-widest text-primary/60">
                                    <Sparkles className="h-2.5 w-2.5 mr-2 opacity-40" />
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    )}
                </div>
            </CardHeader>

            <div className="px-8 sm:p-10 pb-0 pt-8 ml-1.5">
                 {post.link && (
                    <a href={post.link} target="_blank" rel="noopener noreferrer" className="block p-6 rounded-[2rem] border border-primary/10 bg-primary/5 hover:bg-primary/10 transition-all group/link relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover/link:opacity-[0.08] transition-opacity">
                            <Globe className="h-16 w-16" />
                        </div>
                        <div className="flex items-center gap-5 relative z-10">
                            <div className="p-3 rounded-2xl bg-white dark:bg-black shadow-xl group-hover/link:scale-110 transition-all duration-500">
                                <Search className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[10px] font-black uppercase tracking-widest text-primary/60 mb-1">External Citation Node</p>
                                <p className="text-xs font-bold truncate text-foreground tracking-tight">{post.link}</p>
                            </div>
                            <ArrowUpRight className="h-5 w-5 text-primary opacity-40 group-hover/link:opacity-100 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-all" />
                        </div>
                    </a>
                )}
                
                {optimisticPoll && (
                    <div className="pt-8 space-y-4">
                       <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/60 px-2 flex items-center gap-3 mb-2">
                           <Zap className="h-3 w-3" /> Consensus Protocol
                       </h4>
                       <div className="grid gap-3">
                            {optimisticPoll.options.map((option, index) => {
                                const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
                                const userVotedForThis = post.poll?.voters?.includes(currentUser?.uid ?? '');

                                return (
                                    <button 
                                        key={index} 
                                        onClick={() => handleVote(index)}
                                        disabled={userHasVotedOnPoll || isVoting}
                                        className={cn(
                                            "w-full relative h-16 rounded-[1.5rem] border border-primary/5 overflow-hidden transition-all text-left px-6 group/option shadow-sm",
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
                                            <div className="flex items-center gap-4">
                                                <div className={cn(
                                                    "h-3.5 w-3.5 rounded-full border-2 border-primary/20 transition-all",
                                                    userHasVotedOnPoll && !userVotedForThis ? "opacity-0" : "group-hover/option:scale-125 group-hover/option:border-primary",
                                                    userVotedForThis && "bg-primary border-primary shadow-[0_0_20px_rgba(255,153,51,0.4)]"
                                                )} />
                                                <span className="font-bold text-sm sm:text-base tracking-tight">{option.text}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                {userHasVotedOnPoll && (
                                                    <span className="font-black text-sm sm:text-lg text-primary tracking-tighter">{percentage.toFixed(0)}%</span>
                                                )}
                                                <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover/option:opacity-100 -translate-x-2 group-hover/option:translate-x-0 transition-all" />
                                            </div>
                                        </div>
                                    </button>
                                )
                            })}
                       </div>
                       {userHasVotedOnPoll && (
                            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/5 border border-green-500/10 text-[10px] font-black uppercase tracking-[0.2em] text-[#128807] w-fit animate-in fade-in slide-in-from-left-4">
                                <CheckCircle2 className="h-4 w-4" />
                                identity-locked consensus captured
                            </div>
                        )}
                    </div>
                )}
            </div>

            <CardFooter className="p-8 sm:p-10 mt-10 flex flex-col sm:flex-row justify-between items-center gap-6 bg-muted/5 border-t border-primary/10 ml-1.5">
                <div className="flex gap-4 w-full sm:w-auto">
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className={cn(
                            "flex-1 sm:flex-none flex items-center justify-center gap-3 h-12 px-8 rounded-[1.2rem] font-black text-[11px] uppercase tracking-[0.3em] transition-all", 
                            userHasLiked ? "text-red-500 bg-red-500/5 shadow-inner" : "text-primary hover:bg-primary/5"
                        )} 
                        onClick={handleLike} 
                        disabled={isLiking}
                    >
                        {isLiking ? <Loader2 className="h-4 w-4 animate-spin" /> : <Heart className={cn("h-4.5 w-4.5 transition-all", userHasLiked && "fill-current scale-110")} />}
                        <span>{optimisticLikes} Audits</span>
                    </Button>
                    
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="h-12 w-12 rounded-[1.2rem] bg-background border border-primary/10 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-all shadow-sm">
                                <Share2 className="h-5 w-5" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-64 p-3 rounded-[1.5rem] shadow-2xl shadow-black/10 glass border-primary/10">
                            <DropdownMenuItem onClick={() => handleShare('whatsapp')} className="rounded-xl font-bold text-xs h-12 px-4 cursor-pointer gap-4">
                                <div className="p-2 rounded-lg bg-green-500/10 text-green-600 shadow-sm"><MessageCircle className="h-4.5 w-4.5" /></div>
                                WhatsApp Dispatch
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleShare('twitter')} className="rounded-xl font-bold text-xs h-12 px-4 cursor-pointer gap-4">
                                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500 shadow-sm"><Twitter className="h-4.5 w-4.5" /></div>
                                Twitter (X) Node
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleShare('copy')} className="rounded-xl font-bold text-xs h-12 px-4 cursor-pointer gap-4">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary shadow-sm"><Bookmark className="h-4.5 w-4.5" /></div>
                                Copy Registry Link
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                
                <Button asChild className="w-full sm:w-auto h-12 px-10 rounded-[1.2rem] font-black text-[11px] uppercase tracking-[0.3em] shadow-xl shadow-primary/20 group/btn transition-all active:scale-95">
                    <Link href="/dashboard/research-analytics">
                        Analyze Protocol
                        <ArrowRight className="ml-3 h-4 w-4 transition-transform group-hover/btn:translate-x-2" />
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
            <div className="space-y-16 max-w-5xl mx-auto pb-20 px-4 sm:px-0 text-left">
                <div className="flex items-center gap-6">
                    <Skeleton className="h-20 w-20 rounded-[2rem]" />
                    <div className="space-y-3">
                        <Skeleton className="h-10 w-64 rounded-xl" />
                        <Skeleton className="h-5 w-96 rounded-lg" />
                    </div>
                </div>
                <div className="space-y-12">
                    {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-[500px] w-full rounded-[3rem]" />)}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-16 max-w-5xl mx-auto pb-24 px-2 sm:px-0 text-left">
            {/* Redesigned Mandatory Institutional Header */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative p-10 sm:p-16 rounded-[3rem] overflow-hidden bg-card/40 backdrop-blur-xl border border-primary/10 shadow-[0_50px_100px_rgba(0,0,0,0.1)]"
            >
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                    <Logo className="h-64 w-64 grayscale" priority />
                </div>
                
                <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-end justify-between gap-12">
                    <div className="space-y-6">
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 shadow-sm">
                                <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Community Authority Hub</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/5 border border-blue-500/10 shadow-sm">
                                <Activity className="h-4 w-4 text-blue-500" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-blue-500/70">Registry: Active</span>
                            </div>
                        </div>
                        
                        <div className="space-y-3">
                            <h1 className="text-4xl sm:text-7xl font-black font-headline tracking-tighter uppercase leading-[0.9] text-foreground">
                                Live <br/>
                                <span className="bg-gradient-to-r from-primary via-orange-400 to-accent bg-clip-text text-transparent italic">Transmissions.</span>
                            </h1>
                            <p className="text-base sm:text-xl text-muted-foreground font-medium max-w-2xl leading-relaxed">
                                Publicly audited statutory ideas, community polling, and real-time legal forensics from the Nyaya Sahayak registry terminal.
                            </p>
                        </div>
                    </div>

                    <div className="w-full lg:w-auto">
                        <Button size="lg" className="h-16 w-full lg:w-auto px-10 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-primary/30 transition-all active:scale-95 group overflow-hidden relative" asChild>
                            <Link href={isAuthenticated ? "/dashboard/research-analytics/new" : "/login"}>
                                <span className="relative z-10 flex items-center gap-4">
                                    <PlusCircle className="h-6 w-6 group-hover:rotate-90 transition-transform duration-500" />
                                    Initialize Transmission
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                            </Link>
                        </Button>
                    </div>
                </div>
                
                {/* Visual Status Bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1.5 flex">
                    <div className="flex-1 bg-[#FF9933] opacity-40"></div>
                    <div className="flex-1 bg-white opacity-40"></div>
                    <div className="flex-1 bg-[#128807] opacity-40"></div>
                </div>
            </motion.div>
            
            {/* Feed Section */}
            <div className="grid gap-12">
                <AnimatePresence mode="popLayout">
                    {!isAuthenticated ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-32 text-center opacity-40 flex flex-col items-center gap-10">
                            <div className="p-12 rounded-[3rem] bg-muted/20 border-2 border-dashed border-primary/10 relative">
                                <Zap className="h-24 w-24 text-primary opacity-20" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <ShieldCheck className="h-10 w-10 text-primary/40 animate-pulse" />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <p className="font-black text-3xl tracking-tighter uppercase">Clearance Required</p>
                                <p className="text-sm font-medium italic max-w-sm mx-auto leading-relaxed">"Initialize dashboard ingress to access live community transmissions and statutory nodes."</p>
                            </div>
                        </motion.div>
                    ) : feed.length === 0 ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-32 text-center opacity-40 flex flex-col items-center gap-10">
                            <div className="p-12 rounded-[3rem] bg-muted/20 border-2 border-dashed border-primary/10">
                                <Newspaper className="h-24 w-24 text-muted-foreground opacity-20" />
                            </div>
                            <div className="space-y-3">
                                <p className="font-black text-3xl tracking-tighter uppercase">Registry Clear</p>
                                <p className="text-sm font-medium italic max-w-sm mx-auto">"No active transmissions currently found in the community consensus node."</p>
                            </div>
                        </motion.div>
                    ) : (
                        feed.map((item, index) => (
                            <motion.div 
                                key={item.id}
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                            >
                                <PostCard post={item} userProfile={userProfile} />
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>

            {/* Footer Compliance Section */}
            <div className="pt-24 border-t border-primary/5 flex flex-col sm:flex-row items-center justify-between gap-12">
                <div className="flex flex-wrap justify-center gap-16">
                    <div className="flex items-center gap-5 group">
                        <div className="p-4 rounded-[1.5rem] bg-primary/5 text-primary group-hover:scale-110 transition-transform duration-500 shadow-sm border border-primary/5">
                            <ShieldCheck className="h-7 w-7" />
                        </div>
                        <div className="text-left space-y-1">
                            <p className="text-[11px] font-black uppercase tracking-widest text-primary">Verified Hub</p>
                            <p className="text-[10px] font-bold text-muted-foreground opacity-60">Forensic Identity Audit Active.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-5 group">
                        <div className="p-4 rounded-[1.5rem] bg-blue-500/5 text-blue-500 group-hover:scale-110 transition-transform duration-500 shadow-sm border border-blue-500/10">
                            <Layers className="h-7 w-7" />
                        </div>
                        <div className="text-left space-y-1">
                            <p className="text-[11px] font-black uppercase tracking-widest text-blue-500">Registry Density</p>
                            <p className="text-[10px] font-bold text-muted-foreground opacity-60">High-fidelity consensus nodes.</p>
                        </div>
                    </div>
                </div>
                <div className="text-center sm:text-right space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.6em] text-muted-foreground/30">NYAYASAHAYAK.IN // NS-STREAM-V4</p>
                    <div className="flex items-center justify-center sm:justify-end gap-3 opacity-20">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                        <div className="h-1.5 w-1.5 rounded-full bg-white border border-muted"></div>
                        <div className="h-1.5 w-1.5 rounded-full bg-[#128807]"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
