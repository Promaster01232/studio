
'use client';

import Image from "next/image";
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
  Link as LinkIcon
} from "lucide-react";
import { useAuth, useFirestore } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, orderBy, onSnapshot, Timestamp, getDoc, doc, updateDoc, increment, arrayUnion, arrayRemove, deleteDoc, addDoc, serverTimestamp } from "firebase/firestore";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from '@/components/ui/skeleton';
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";
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
                "flex items-start gap-4 group/author transition-all active:scale-[0.98]",
                post.isAnonymous ? "pointer-events-none opacity-60" : "cursor-pointer"
            )}
        >
            <Avatar className="h-12 w-12 border-2 border-background shadow-xl rounded-2xl group-hover/author:scale-105 transition-transform">
                {authorAvatar && <AvatarImage src={authorAvatar} alt={authorName} className="object-cover" />}
                <AvatarFallback className="font-black bg-primary/10 text-primary">{fallback}</AvatarFallback>
            </Avatar>
            <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                    <p className="font-black text-sm tracking-tight group-hover/author:text-primary transition-colors underline decoration-primary/0 group-hover/author:decoration-primary/30 underline-offset-4">{authorName}</p>
                    {isAdmin && <BadgeCheck className="h-3.5 w-3.5 text-blue-500" />}
                </div>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest opacity-60">
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
    
    const handleAction = (action: string) => {
        toast({
            title: `Action: ${action}`,
            description: "This feature is for institutional demonstration purposes.",
        });
    };

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
        if (!currentUser) {
            toast({ variant: 'destructive', title: 'Registry Access Required', description: 'Authenticate your node to interact with community transmissions.' });
            return;
        }
        if (isLiking) return;
        setIsLiking(true);

        const postRef = doc(firestore, "posts", post.id);

        setOptimisticLikes(prev => userHasLiked ? prev - 1 : prev + 1);
        setOptimisticLikedBy(prev => {
            if (userHasLiked) {
                return prev.filter(uid => uid !== currentUser.uid);
            } else {
                return [...prev, currentUser.uid];
            }
        });

        updateDoc(postRef, {
            likes: increment(userHasLiked ? -1 : 1),
            likedBy: userHasLiked ? arrayRemove(currentUser.uid) : arrayUnion(currentUser.uid)
        }).then(() => {
            // Trigger Notification for Like
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
                requestResourceData: { likes: '...', likedBy: '...' },
            }, serverError);
            errorEmitter.emit('permission-error', permissionError);
        }).finally(() => {
            setIsLiking(false);
        });
    };


    const handleVote = (optionIndex: number) => {
        if (!currentUser || !optimisticPoll || isVoting) return;

        const userHasVoted = optimisticPoll.voters?.includes(currentUser.uid);
        if (userHasVoted) {
            toast({ title: "Protocol Refused", description: "Your registry node has already submitted a vote for this poll." });
            return;
        }

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
                    requestResourceData: { poll: newPollState },
                }, serverError);
                errorEmitter.emit('permission-error', permissionError);
            })
            .finally(() => {
                setIsVoting(false);
            });
    };

    const handleDeletePost = () => {
        if (!confirm("Are you sure you want to purge this transmission?")) return;
        const postRef = doc(firestore, "posts", post.id);
        deleteDoc(postRef)
            .then(() => {
                toast({ title: "Post Purged", description: "The content has been erased from the community registry." });
            })
            .catch((serverError) => {
                const permissionError = new FirestorePermissionError({
                    path: postRef.path,
                    operation: 'delete',
                }, serverError);
                errorEmitter.emit('permission-error', permissionError);
            });
    };

    const handleReportPost = () => {
        toast({ title: "Post Reported", description: "Our forensic moderation team will review this content for statutory violations." });
    };

    const totalVotes = optimisticPoll ? optimisticPoll.options.reduce((acc, option) => acc + option.votes, 0) : 0;
    const userHasVotedOnPoll = optimisticPoll?.voters?.includes(currentUser?.uid ?? '');
    
    return (
        <Card key={post.id} className="overflow-hidden glass border-primary/5 hover:border-primary/20 transition-all shadow-lg rounded-[2rem]">
            <CardContent className="p-4 sm:p-8 pb-0">
                <div className="flex items-start justify-between mb-6">
                    <AuthorIdentityNode post={post} isAdmin={isAdmin || false} />
                    <div className="flex items-center gap-2">
                        {post.postType && (
                            <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/10 px-3 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest h-5">
                                {post.postType}
                            </Badge>
                        )}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl hover:bg-primary/5">
                                    <MoreVertical className="h-4 w-4 text-muted-foreground" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 rounded-xl p-2 shadow-2xl glass border-primary/5">
                                {(isAuthor || isAdmin) ? (
                                    <DropdownMenuItem onSelect={handleDeletePost} className="rounded-lg font-bold text-xs h-10 px-3 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10 gap-3">
                                        <Trash2 className="h-4 w-4" /> Purge Post
                                    </DropdownMenuItem>
                                ) : (
                                    <DropdownMenuItem onSelect={handleReportPost} className="rounded-lg font-bold text-xs h-10 px-3 cursor-pointer gap-3">
                                        <Flag className="h-4 w-4" /> Report Content
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                <div className="space-y-4 text-left">
                    <h3 className="text-xl sm:text-2xl font-black font-headline leading-tight tracking-tighter text-foreground">{post.title}</h3>
                    {post.content && <p className="text-muted-foreground text-sm font-medium leading-relaxed whitespace-pre-line">{post.content}</p>}

                    {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                            {post.tags.map(tag => (
                                <Badge key={tag} variant="outline" className="bg-muted/30 border-primary/5 text-[9px] font-bold px-3 py-0.5 rounded-lg">#{tag}</Badge>
                            ))}
                        </div>
                    )}
                </div>
            </CardContent>

            <div className="p-4 sm:px-8 sm:pb-0 sm:pt-6">
                 {post.link && (
                    <a href={post.link} target="_blank" rel="noopener noreferrer" className="mt-2 block p-4 rounded-2xl border border-primary/5 bg-primary/5 hover:bg-primary/10 transition-all group shadow-inner">
                        <div className="flex items-center gap-4">
                            <div className="p-2 rounded-lg bg-background shadow-sm">
                                <Search className="h-4 w-4 text-primary" />
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className="text-xs font-black truncate text-foreground group-hover:text-primary tracking-tight">{post.link}</p>
                            </div>
                            <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                        </div>
                    </a>
                )}
                
                {post.image && (
                    <div className="relative aspect-video mt-6 rounded-[1.5rem] overflow-hidden border border-primary/5 shadow-2xl">
                        <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            className="object-cover transition-transform duration-700 hover:scale-105"
                        />
                    </div>
                )}
                
                {optimisticPoll && (
                    <div className="pt-6 space-y-3">
                       {optimisticPoll.options.map((option, index) => {
                           const votePercentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
                           const userVotedForThis = post.poll?.voters?.includes(currentUser?.uid ?? '');

                           return (
                            <Button 
                                key={index} 
                                variant="ghost" 
                                className={cn(
                                    "w-full justify-start h-auto p-4 flex flex-col items-start relative overflow-hidden rounded-xl border border-primary/5 transition-all",
                                    userVotedForThis ? 'bg-primary/5 border-primary/20' : 'bg-muted/20 hover:bg-muted/40'
                                )}
                                onClick={() => handleVote(index)}
                                disabled={userHasVotedOnPoll || isVoting}
                            >
                                <div className="flex items-center justify-between w-full z-10">
                                    <div className="flex items-center gap-3">
                                        <div className={cn("h-4 w-4 rounded-full border-2 flex items-center justify-center transition-all", userVotedForThis ? "border-primary" : "border-muted-foreground/30")}>
                                            {userVotedForThis && <div className="h-2 w-2 bg-primary rounded-full" />}
                                        </div>
                                        <span className="font-black text-sm tracking-tight">{option.text}</span>
                                        {isVoting && userVotedForThis && <Loader2 className="h-3 w-3 animate-spin text-primary" />}
                                    </div>
                                    {userHasVotedOnPoll && <span className="text-xs font-black font-mono text-primary">{votePercentage.toFixed(0)}%</span>}
                                </div>
                               {userHasVotedOnPoll && (
                                   <div className="absolute inset-y-0 left-0 bg-primary/10 transition-all duration-1000 ease-out" style={{width: `${votePercentage}%`}}></div>
                               )}
                           </Button>
                       )})}
                    </div>
                )}
            </div>

            <CardFooter className="p-4 sm:p-6 mt-4 flex justify-between items-center bg-muted/5 border-t border-primary/5">
                <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="flex items-center gap-2 h-10 px-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all hover:bg-red-500/10 hover:text-red-500" onClick={handleLike} disabled={isLiking}>
                        {isLiking ? <Loader2 className="h-4 w-4 animate-spin text-primary" /> : <Heart className={cn("h-4 w-4 transition-all", userHasLiked && "fill-red-500 text-red-500 scale-110")} />}
                        <span>{optimisticLikes}</span>
                    </Button>
                    
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-primary/10 transition-all">
                                <Share2 className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 rounded-xl p-2 shadow-2xl glass border-primary/5">
                            <DropdownMenuItem onSelect={() => handleShare('whatsapp')} className="rounded-lg font-bold text-xs h-10 px-3 cursor-pointer gap-3">
                                <div className="bg-green-500/10 p-1.5 rounded-md text-green-600">
                                    <MessageCircle className="h-3.5 w-3.5" />
                                </div>
                                WhatsApp
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => handleShare('twitter')} className="rounded-lg font-bold text-xs h-10 px-3 cursor-pointer gap-3">
                                <div className="bg-blue-500/10 p-1.5 rounded-md text-blue-500">
                                    <Twitter className="h-3.5 w-3.5" />
                                </div>
                                Twitter (X)
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => handleShare('copy')} className="rounded-lg font-bold text-xs h-10 px-3 cursor-pointer gap-3">
                                <div className="bg-primary/10 p-1.5 rounded-md text-primary">
                                    <Bookmark className="h-3.5 w-3.5" />
                                </div>
                                Copy Registry Link
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-primary/10 transition-all" onClick={() => handleAction('Bookmark')}>
                    <Bookmark className="h-4 w-4" />
                </Button>
            </CardFooter>
        </Card>
    );
}

export default function ResearchAnalyticsPage() {
    const { toast } = useToast();
    const [feed, setFeed] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const firestore = useFirestore();
    const auth = useAuth();
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
                        }, serverError);
                        errorEmitter.emit('permission-error', permissionError);
                    }
                    setLoading(false);
                    setFeed([]);
                }
            );
        });

        return () => {
            unsubscribeAuth();
            if (postsUnsubscribeRef.current) {
                postsUnsubscribeRef.current();
            }
        };
    }, [auth, firestore]);
    
    if (loading) {
        return (
            <div className="space-y-8">
                <PageHeader title="Community Feed & News" description="Discuss legal topics and stay informed." />
                <Skeleton className="h-24 w-full" />
                <div className="max-w-3xl mx-auto space-y-6">
                    {[...Array(3)].map((_, i) => (
                        <Card key={i}>
                            <CardContent className="p-4 sm:p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <Skeleton className="h-10 w-10 rounded-full" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-3 w-16" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Skeleton className="h-5 w-3/4" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-5/6" />
                                </div>
                            </CardContent>
                            <CardFooter className="p-2 sm:p-3">
                                <Skeleton className="h-8 w-full" />
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-10 max-w-7xl mx-auto pb-20 px-2 sm:px-0 text-left">
            <PageHeader title="Community Registry Feed" description="Institutional forum for legal news, idea synchronization, and statutory discussions." />
            
            <Card className="glass border-primary/10 shadow-xl rounded-[2rem] overflow-hidden group">
                <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12 border-2 border-background shadow-lg rounded-2xl shrink-0">
                            {userProfile?.photoURL ? (
                                <AvatarImage src={userProfile.photoURL} alt={userProfile.firstName} className="object-cover" />
                            ) : (
                                <AvatarFallback className="font-black bg-primary/10 text-primary">
                                    {userProfile ? (
                                        `${userProfile.firstName?.charAt(0) || ''}${userProfile.lastName?.charAt(0) || ''}`
                                    ) : (
                                        <User className="h-5 w-5"/>
                                    )}
                                </AvatarFallback>
                            )}
                        </Avatar>
                        <Link 
                            href={isAuthenticated ? "/dashboard/research-analytics/new" : "/login"}
                            className="w-full text-left bg-muted/40 hover:bg-muted/60 text-muted-foreground font-bold rounded-2xl px-6 py-4 transition-all text-sm shadow-inner border border-primary/5 active:scale-[0.99] flex items-center justify-between"
                        >
                            <span>Initialize new post... Share ideas or start a community poll.</span>
                            <ArrowRight className="h-4 w-4 opacity-40 group-hover:opacity-100 transition-opacity" />
                        </Link>
                        <Button asChild disabled={!isAuthenticated} size="icon" className="h-12 w-12 rounded-2xl shrink-0 shadow-xl shadow-primary/20 active:scale-95 transition-all">
                            <Link href="/dashboard/research-analytics/new">
                                <PlusCircle className="h-6 w-6"/>
                                <span className="sr-only">Initialize Node</span>
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <div className="flex items-center justify-between flex-wrap gap-6 border-b border-primary/5 pb-6">
                <div className="flex items-center gap-3">
                    <Activity className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-black font-headline tracking-tighter">Live Registry Stream</h2>
                </div>
                <div className="flex flex-wrap bg-muted/30 p-1 rounded-xl border border-primary/5">
                    {["All", "Idea", "Poll", "Question", "Suggestion"].map((f) => (
                        <Button key={f} variant="ghost" size="sm" className="h-8 px-4 rounded-lg font-black text-[9px] uppercase tracking-widest hover:bg-background transition-all">
                            {f}
                        </Button>
                    ))}
                </div>
            </div>

            <div className="grid gap-8 max-w-3xl mx-auto">
                <AnimatePresence mode="popLayout">
                    {!isAuthenticated && !loading ? (
                        <motion.div key="auth-req" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <Card className="glass border-primary/10 rounded-[2.5rem] py-20 text-center">
                                <CardContent className="space-y-4">
                                    <div className="bg-primary/5 p-6 rounded-full w-fit mx-auto mb-4">
                                        <Flag className="h-12 w-12 text-primary opacity-20" />
                                    </div>
                                    <p className="font-black text-xl tracking-tighter uppercase">Clearance Required</p>
                                    <p className="text-muted-foreground text-xs font-medium max-w-xs mx-auto">Authenticate your registry node to access and contribute to the community feed.</p>
                                    <Button asChild className="mt-4 rounded-xl font-black text-[10px] uppercase tracking-widest h-11 px-8 shadow-xl shadow-primary/20">
                                        <Link href="/login">Initialize Sign In</Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ) : feed.length === 0 && !loading ? (
                        <motion.div key="empty-feed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <Card className="glass border-primary/10 rounded-[2.5rem] py-20 text-center">
                                <CardContent className="space-y-4">
                                    <div className="bg-primary/5 p-6 rounded-full w-fit mx-auto mb-4">
                                        <MessageCircle className="h-12 w-12 text-primary opacity-20" />
                                    </div>
                                    <p className="font-black text-xl tracking-tighter uppercase">Registry Empty</p>
                                    <p className="text-muted-foreground text-xs font-medium italic">"No community transmissions have been initialized in this sector."</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ) : (
                        <div className="space-y-10">
                            {feed.map((item) => <PostCard key={item.id} post={item} userProfile={userProfile} />)}
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
