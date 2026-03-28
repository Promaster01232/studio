
'use client';

import { useToast } from "@/hooks/use-toast";
import React, { useState, useEffect, useRef } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
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
  Newspaper
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
                "flex items-start gap-3 group/author transition-all active:scale-[0.98]",
                post.isAnonymous ? "pointer-events-none opacity-60" : "cursor-pointer"
            )}
        >
            <Avatar className="h-10 w-10 border border-background shadow-lg rounded-xl group-hover/author:scale-105 transition-transform">
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
        <Card className="overflow-hidden glass border-primary/10 transition-all shadow-2xl rounded-[2.5rem] relative group/post text-left">
            <div className="absolute top-0 left-0 bottom-0 w-1 bg-gradient-to-b from-[#FF9933] via-[#000080] to-[#128807]"></div>
            
            <CardHeader className="p-8 sm:p-10 pb-0 ml-1">
                <div className="flex items-start justify-between mb-6">
                    <AuthorIdentityNode post={post} isAdmin={ADMIN_EMAILS.includes(post.authorUid)} />
                    <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/10 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest h-6">
                            {post.postType || 'Transmission'}
                        </Badge>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="h-9 w-9 rounded-xl hover:bg-primary/5 flex items-center justify-center transition-all">
                                    <MoreVertical className="h-4 w-4 text-muted-foreground" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl shadow-2xl shadow-black/10 glass border-primary/10">
                                {isAuthor ? (
                                    <DropdownMenuItem onSelect={handleDeletePost} className="rounded-xl font-bold text-xs h-11 px-4 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10 gap-3">
                                        <Trash2 className="h-4 w-4" /> 
                                        <span>Purge record</span>
                                    </DropdownMenuItem>
                                ) : (
                                    <DropdownMenuItem className="rounded-xl font-bold text-xs h-11 px-4 cursor-pointer gap-3 hover:bg-red-500/5 hover:text-red-500">
                                        <Flag className="h-4 w-4" /> 
                                        <span>Report breach</span>
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-xl sm:text-3xl font-black tracking-tighter text-foreground leading-tight">{post.title}</h3>
                    {post.content && (
                        <div className="space-y-3">
                            <p className="text-sm sm:text-base text-muted-foreground font-medium leading-relaxed whitespace-pre-line">
                                {displayedContent}
                            </p>
                            {shouldShowReadMore && (
                                <button 
                                    onClick={() => setIsExpanded(!isExpanded)}
                                    className="text-[11px] font-black uppercase tracking-widest text-primary hover:underline underline-offset-4 decoration-primary/30"
                                >
                                    {isExpanded ? "Minimize node" : "Expand full dossier"}
                                </button>
                            )}
                        </div>
                    )}

                    {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                            {post.tags.map(tag => (
                                <Badge key={tag} variant="outline" className="bg-muted/30 border-primary/5 text-[9px] font-bold px-3 py-0.5 h-6 rounded-lg tracking-tight">#{tag}</Badge>
                            ))}
                        </div>
                    )}
                </div>
            </CardHeader>

            <div className="px-8 sm:p-10 pb-0 pt-6 ml-1">
                 {post.link && (
                    <a href={post.link} target="_blank" rel="noopener noreferrer" className="block p-5 rounded-2xl border border-primary/10 bg-primary/5 hover:bg-primary/10 transition-all group/link">
                        <div className="flex items-center gap-4">
                            <div className="p-2 rounded-lg bg-white dark:bg-black shadow-sm group-hover/link:scale-110 transition-transform">
                                <Search className="h-4 w-4 text-primary" />
                            </div>
                            <p className="text-[10px] font-black truncate text-foreground group-hover/link:text-primary tracking-tight flex-1">{post.link}</p>
                            <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover/link:opacity-100 -translate-x-2 group-hover/link:translate-x-0 transition-all" />
                        </div>
                    </a>
                )}
                
                {optimisticPoll && (
                    <div className="pt-6 space-y-3">
                       {optimisticPoll.options.map((option, index) => {
                           const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
                           const userVotedForThis = post.poll?.voters?.includes(currentUser?.uid ?? '');

                           return (
                            <button 
                                key={index} 
                                onClick={() => handleVote(index)}
                                disabled={userHasVotedOnPoll || isVoting}
                                className={cn(
                                    "w-full relative h-14 rounded-2xl border border-primary/5 overflow-hidden transition-all text-left px-6 group/option shadow-sm",
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
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "h-3 w-3 rounded-full border border-primary/30 transition-all",
                                            userHasVotedOnPoll && !userVotedForThis ? "opacity-0" : "group-hover/option:scale-125",
                                            userVotedForThis && "bg-primary border-primary shadow-[0_0_15px_rgba(255,153,51,0.5)]"
                                        )} />
                                        <span className="font-bold text-sm sm:text-base tracking-tight">{option.text}</span>
                                    </div>
                                    {userHasVotedOnPoll && (
                                        <span className="font-black text-xs sm:text-sm text-primary">{percentage.toFixed(0)}%</span>
                                    )}
                                </div>
                            </button>
                       )})}
                       {userHasVotedOnPoll && (
                            <div className="flex items-center gap-2 px-2 text-[10px] font-black uppercase tracking-[0.3em] text-[#128807] animate-in fade-in slide-in-from-left-4">
                                <CheckCircle2 className="h-4 w-4" />
                                consensus captured // registry secure
                            </div>
                        )}
                    </div>
                )}
            </div>

            <CardFooter className="p-6 sm:p-10 mt-6 flex justify-between items-center bg-muted/5 border-t border-primary/10 ml-1">
                <div className="flex gap-3">
                    <Button variant="ghost" size="sm" className={cn("flex items-center gap-2.5 h-10 px-5 rounded-xl font-black text-[11px] uppercase tracking-[0.2em] transition-all", userHasLiked ? "text-red-500 bg-red-500/5 shadow-inner" : "text-primary hover:bg-primary/5")} onClick={handleLike} disabled={isLiking}>
                        {isLiking ? <Loader2 className="h-4 w-4 animate-spin" /> : <Heart className={cn("h-4 w-4 transition-all", userHasLiked && "fill-current scale-110")} />}
                        <span>{optimisticLikes}</span>
                    </Button>
                    
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="h-10 w-10 rounded-xl bg-background border border-primary/10 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-all">
                                <Share2 className="h-4 w-4" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-52 p-2 rounded-2xl shadow-2xl shadow-black/10 glass border-primary/10">
                            <DropdownMenuItem onClick={() => handleShare('whatsapp')} className="rounded-xl font-bold text-xs h-11 px-4 cursor-pointer gap-3">
                                <div className="p-1.5 rounded-lg bg-green-500/10 text-green-600"><MessageCircle className="h-4 w-4" /></div>
                                WhatsApp
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleShare('twitter')} className="rounded-xl font-bold text-xs h-11 px-4 cursor-pointer gap-3">
                                <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500"><Twitter className="h-4 w-4" /></div>
                                Twitter (X)
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleShare('copy')} className="rounded-xl font-bold text-xs h-11 px-4 cursor-pointer gap-3">
                                <div className="p-1.5 rounded-lg bg-primary/10 text-primary"><Bookmark className="h-4 w-4" /></div>
                                Copy Node Link
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="h-10 px-6 rounded-xl font-black text-[10px] uppercase tracking-widest text-primary border border-primary/10 hover:bg-primary hover:text-white transition-all shadow-md group/btn" asChild>
                        <Link href="/dashboard/research-analytics">
                            <span>Analyze Protocol</span>
                            <ArrowRight className="ml-2.5 h-4 w-4 transition-transform group-hover/btn:translate-x-2" />
                        </Link>
                    </Button>
                </div>
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
            <div className="space-y-12 max-w-5xl mx-auto pb-20 px-2 sm:px-0 text-left">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-16 w-16 rounded-3xl" />
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-64 rounded-xl" />
                        <Skeleton className="h-4 w-96 rounded-lg" />
                    </div>
                </div>
                <div className="space-y-10">
                    {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-96 w-full rounded-[3rem]" />)}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-12 max-w-5xl mx-auto pb-20 px-2 sm:px-0 text-left">
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 border-b border-primary/5 pb-10">
                <div className="space-y-2">
                    <div className="flex items-center gap-3 text-primary mb-2">
                        <TrendingUp className="h-6 w-6 animate-bounce" />
                        <span className="text-[11px] font-black uppercase tracking-[0.4em]">Community Authority Hub</span>
                    </div>
                    <h1 className="text-4xl sm:text-6xl font-black font-headline tracking-tighter uppercase leading-none">
                        Live <span className="text-primary italic">Transmissions</span>
                    </h1>
                    <p className="text-base sm:text-lg text-muted-foreground font-medium max-w-2xl leading-relaxed">
                        Publicly audited statutory ideas, community polling, and real-time legal forensics from the Nyaya Sahayak registry.
                    </p>
                </div>
                <Button size="lg" className="h-14 px-8 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-primary/20 transition-all active:scale-95 group overflow-hidden relative" asChild>
                    <Link href={isAuthenticated ? "/dashboard/research-analytics/new" : "/login"}>
                        <span className="relative z-10 flex items-center gap-3">
                            <PlusCircle className="h-5 w-5 group-hover:rotate-90 transition-transform" />
                            Initialize Post
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </Link>
                </Button>
            </div>
            
            <div className="grid gap-10">
                <AnimatePresence mode="popLayout">
                    {!isAuthenticated ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-32 text-center opacity-40 flex flex-col items-center gap-8">
                            <div className="p-10 rounded-[3rem] bg-muted/20 border-2 border-dashed border-primary/10">
                                <Zap className="h-20 w-20 text-primary opacity-20" />
                            </div>
                            <div className="space-y-3">
                                <p className="font-black text-2xl tracking-tighter uppercase">Clearance Required</p>
                                <p className="text-sm font-medium italic">"Initialize dashboard ingress to access live transmissions."</p>
                            </div>
                        </motion.div>
                    ) : feed.length === 0 ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-32 text-center opacity-40 flex flex-col items-center gap-8">
                            <div className="p-10 rounded-[3rem] bg-muted/20 border-2 border-dashed border-primary/10">
                                <Newspaper className="h-20 w-20 text-muted-foreground opacity-20" />
                            </div>
                            <div className="space-y-3">
                                <p className="font-black text-2xl tracking-tighter uppercase">Registry Empty</p>
                                <p className="text-sm font-medium italic">"No active transmissions found in the community node."</p>
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

            <div className="pt-20 border-t border-primary/5 flex flex-col sm:flex-row items-center justify-between gap-10">
                <div className="flex flex-wrap justify-center gap-10">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-primary/5 text-primary">
                            <ShieldCheck className="h-6 w-6" />
                        </div>
                        <div className="text-left">
                            <p className="text-[10px] font-black uppercase tracking-widest text-primary">Verified Feed</p>
                            <p className="text-[9px] font-bold text-muted-foreground opacity-60">Audited for forensic accuracy.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-blue-500/5 text-blue-500">
                            <Globe className="h-6 w-6" />
                        </div>
                        <div className="text-left">
                            <p className="text-[10px] font-black uppercase tracking-widest text-blue-500">Open Access</p>
                            <p className="text-[9px] font-bold text-muted-foreground opacity-60">Citizen-driven statutory reform.</p>
                        </div>
                    </div>
                </div>
                <p className="text-[9px] font-black uppercase tracking-[0.6em] text-muted-foreground/30">NYAYASAHAYAK.IN // TRANSMISSION REGISTRY</p>
            </div>
        </div>
    );
}
