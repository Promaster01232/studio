
'use client';

import { useToast } from "@/hooks/use-toast";
import React, { useState, useEffect, useRef } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
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
  DropdownMenuSeparator,
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
    postType?: 'Idea' | 'Question' | 'Suggestion' | 'Poll';
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
            <Avatar className="h-9 w-9 border border-background shadow-lg rounded-lg group-hover/author:scale-105 transition-transform">
                {authorAvatar && <AvatarImage src={authorAvatar} alt={authorName} className="object-cover" />}
                <AvatarFallback className="font-black bg-primary/10 text-primary text-[10px]">{fallback}</AvatarFallback>
            </Avatar>
            <div className="flex-1 text-left">
                <div className="flex items-center gap-1.5">
                    <p className="font-black text-[11px] tracking-tight group-hover/author:text-primary transition-colors underline decoration-primary/0 group-hover/author:decoration-primary/30 underline-offset-4">{authorName}</p>
                    {isAdmin && <BadgeCheck className="h-3 w-3 text-blue-500" />}
                </div>
                <p className="text-[8px] text-muted-foreground font-bold uppercase tracking-widest opacity-60">
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
    
    const [optimisticLikes, setOptimisticLikes] = useState(post.likes);
    const [optimisticLikedBy, setOptimisticLikedBy] = useState(post.likedBy || []);
    const [optimisticPoll, setOptimisticPoll] = useState(post.poll);

    const userHasLiked = optimisticLikedBy.includes(currentUser?.uid ?? '');
    const isAuthor = post.authorUid === currentUser?.uid;
    const isAdmin = currentUser?.email && (ADMIN_EMAILS.includes(currentUser.email.toLowerCase()) || userProfile?.isAdmin);
    const userHasVotedOnPoll = optimisticPoll?.voters?.includes(currentUser?.uid ?? '');
    const totalVotes = optimisticPoll ? optimisticPoll.options.reduce((acc, option) => acc + option.votes, 0) : 0;
    
    const handleShare = (platform: 'whatsapp' | 'twitter' | 'copy') => {
        const shareText = `Check out this institutional transmission on Nyaya Sahayak: "${post.title}"\n\nRead more at: ${window.location.origin}/dashboard/research-analytics`;
        
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
        <Card key={post.id} className="overflow-hidden glass border-primary/10 transition-all shadow-lg rounded-[1.5rem] relative group">
            <div className="absolute top-0 left-0 bottom-0 w-1 bg-gradient-to-b from-[#FF9933] via-white to-[#128807]"></div>
            
            <CardContent className="p-5 sm:p-6 pb-0 ml-1">
                <div className="flex items-start justify-between mb-5">
                    <AuthorIdentityNode post={post} isAdmin={ADMIN_EMAILS.includes(post.authorUid)} />
                    <div className="flex items-center gap-2">
                        {post.postType && (
                            <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/10 px-2 py-0.5 rounded-full text-[7px] font-black uppercase tracking-widest h-4">
                                {post.postType}
                            </Badge>
                        )}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg hover:bg-primary/5">
                                    <MoreVertical className="h-3.5 w-3.5 text-muted-foreground" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 p-2 rounded-xl shadow-2xl glass border-primary/10">
                                {(isAuthor || isAdmin) ? (
                                    <DropdownMenuItem onSelect={handleDeletePost} className="rounded-lg font-bold text-[10px] h-9 px-3 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10 gap-2.5">
                                        <Trash2 className="h-3.5 w-3.5" /> 
                                        <span>Purge Identity Record</span>
                                    </DropdownMenuItem>
                                ) : (
                                    <DropdownMenuItem className="rounded-lg font-bold text-[10px] h-9 px-3 cursor-pointer gap-2.5 hover:bg-red-500/5 hover:text-red-500">
                                        <Flag className="h-3.5 w-3.5" /> 
                                        <span>Report Forensic Breach</span>
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                <div className="space-y-2.5 text-left">
                    <h3 className="text-base sm:text-lg font-black tracking-tight text-foreground leading-snug">{post.title}</h3>
                    {post.content && <p className="text-[11px] sm:text-xs text-muted-foreground font-medium leading-relaxed whitespace-pre-line">{post.content}</p>}

                    {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                            {post.tags.map(tag => (
                                <Badge key={tag} variant="outline" className="bg-muted/30 border-primary/5 text-[8px] font-bold px-2 py-0 h-4 rounded-md">#{tag}</Badge>
                            ))}
                        </div>
                    )}
                </div>
            </CardContent>

            <div className="px-5 sm:px-6 pb-0 pt-4 ml-1">
                 {post.link && (
                    <a href={post.link} target="_blank" rel="noopener noreferrer" className="block p-3 rounded-xl border border-primary/5 bg-primary/5 hover:bg-primary/10 transition-all group/link">
                        <div className="flex items-center gap-3">
                            <Search className="h-3 w-3 text-primary opacity-40" />
                            <p className="text-[9px] font-black truncate text-foreground group-hover/link:text-primary tracking-tight flex-1">{post.link}</p>
                            <ArrowRight className="h-3 w-3 text-primary opacity-0 group-hover/link:opacity-100 -translate-x-1 group-hover/link:translate-x-0 transition-all" />
                        </div>
                    </a>
                )}
                
                {optimisticPoll && (
                    <div className="pt-4 space-y-2.5">
                       {optimisticPoll.options.map((option, index) => {
                           const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
                           const userVotedForThis = post.poll?.voters?.includes(currentUser?.uid ?? '');

                           return (
                            <button 
                                key={index} 
                                onClick={() => handleVote(index)}
                                disabled={userHasVotedOnPoll || isVoting}
                                className={cn(
                                    "w-full relative h-11 rounded-xl border border-primary/5 overflow-hidden transition-all text-left px-4 group/option",
                                    userHasVotedOnPoll ? "bg-muted/10 cursor-default" : "bg-white dark:bg-black/20 hover:border-primary/30"
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
                                            "h-2 w-2 rounded-full border border-primary/30 transition-all",
                                            userHasVotedOnPoll && !userVotedForThis ? "opacity-0" : "group-hover/option:scale-125",
                                            userVotedForThis && "bg-primary border-primary shadow-[0_0_10px_rgba(255,153,51,0.5)]"
                                        )} />
                                        <span className="font-bold text-[11px] tracking-tight">{option.text}</span>
                                    </div>
                                    {userHasVotedOnPoll && (
                                        <span className="font-black text-[10px] text-primary">{percentage.toFixed(0)}%</span>
                                    )}
                                </div>
                            </button>
                       )})}
                       {userHasVotedOnPoll && (
                            <div className="flex items-center gap-2 px-1 text-[8px] font-black uppercase tracking-[0.2em] text-[#128807] animate-in fade-in slide-in-from-left-2">
                                <CheckCircle2 className="h-3 w-3" />
                                Consensus Captured // Registry Secure
                            </div>
                        )}
                    </div>
                )}
            </div>

            <CardFooter className="p-4 sm:px-6 mt-4 flex justify-between items-center bg-muted/5 border-t border-primary/5 ml-1">
                <div className="flex gap-1.5">
                    <Button variant="ghost" size="sm" className={cn("flex items-center gap-1.5 h-8 px-3 rounded-lg font-black text-[9px] uppercase tracking-[0.2em] hover:text-red-500", userHasLiked && "text-red-500")} onClick={handleLike} disabled={isLiking}>
                        {isLiking ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Heart className={cn("h-3.5 w-3.5 transition-all", userHasLiked && "fill-current scale-110")} />}
                        <span>{optimisticLikes}</span>
                    </Button>
                    
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:bg-primary/10">
                                <Share2 className="h-3.5 w-3.5 text-muted-foreground" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44 p-1.5 rounded-xl shadow-2xl glass border-primary/5">
                            <DropdownMenuItem onClick={() => handleShare('whatsapp')} className="rounded-lg font-bold text-[10px] h-9 px-3 cursor-pointer gap-2.5">
                                <MessageCircle className="h-3.5 w-3.5 text-green-600" /> WhatsApp
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleShare('twitter')} className="rounded-lg font-bold text-[10px] h-9 px-3 cursor-pointer gap-2.5">
                                <Twitter className="h-3.5 w-3.5 text-blue-500" /> Twitter (X)
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleShare('copy')} className="rounded-lg font-bold text-[10px] h-9 px-3 cursor-pointer gap-2.5">
                                <Bookmark className="h-3.5 w-3.5 text-primary" /> Copy Registry Link
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="h-8 px-4 rounded-xl font-black text-[9px] uppercase tracking-[0.2em] text-primary border border-primary/10 hover:bg-primary hover:text-white transition-all shadow-sm group/btn" asChild>
                        <Link href="/dashboard/research-analytics">
                            <span>Analyze Node</span>
                            <ArrowRight className="ml-2 h-3 w-3 transition-transform group-hover/btn:translate-x-1" />
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
            <div className="space-y-10 max-w-4xl mx-auto pb-20 px-2 sm:px-0 text-left">
                <PageHeader title="Community Registry" description="Statutory feed synchronization." />
                <div className="space-y-6">
                    {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-40 w-full rounded-[1.5rem]" />)}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-10 max-w-4xl mx-auto pb-20 px-2 sm:px-0 text-left">
            <PageHeader title="Community Registry Stream" description="Institutional forum for idea synchronization and statutory discussions." />
            
            <Card className="glass border-primary/5 rounded-[1.5rem] overflow-hidden group">
                <CardContent className="p-5 flex items-center gap-4">
                    <Avatar className="h-10 w-10 border border-background shadow-md rounded-lg shrink-0">
                        <AvatarImage src={userProfile?.photoURL} className="object-cover" />
                        <AvatarFallback className="font-black bg-primary/5 text-primary text-xs">
                            {userProfile ? `${userProfile.firstName?.charAt(0)}${userProfile.lastName?.charAt(0)}` : <User className="h-4 w-4"/>}
                        </AvatarFallback>
                    </Avatar>
                    <Link 
                        href={isAuthenticated ? "/dashboard/research-analytics/new" : "/login"}
                        className="flex-1 text-left bg-muted/30 hover:bg-muted/50 text-muted-foreground font-bold rounded-xl px-5 h-11 transition-all text-[11px] border border-primary/5 flex items-center justify-between"
                    >
                        <span>Initialize new community transmission...</span>
                        <PlusCircle className="h-4 w-4 text-primary opacity-40 group-hover:opacity-100" />
                    </Link>
                </CardContent>
            </Card>

            <div className="flex items-center justify-between border-b border-primary/5 pb-4">
                <div className="flex items-center gap-2.5 text-primary">
                    <Activity className="h-4 w-4" />
                    <h2 className="text-xs font-black uppercase tracking-widest leading-none">Live Transmission Registry</h2>
                </div>
            </div>

            <div className="grid gap-6">
                <AnimatePresence mode="popLayout">
                    {!isAuthenticated ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 text-center opacity-40">
                            <Badge variant="outline" className="h-10 px-6 rounded-xl font-black text-[10px] uppercase tracking-widest border-primary/20">Clearance Required</Badge>
                        </motion.div>
                    ) : feed.length === 0 ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 text-center opacity-40">
                            <p className="font-black uppercase tracking-[0.2em] text-[10px]">Registry Empty // No active transmissions</p>
                        </motion.div>
                    ) : (
                        feed.map((item) => <PostCard key={item.id} post={item} userProfile={userProfile} />)
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
