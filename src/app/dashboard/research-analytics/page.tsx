"use client";

import { useToast } from "@/hooks/use-toast";
import React, { useState, useEffect, useRef, use } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Heart, 
  Share2, 
  Bookmark, 
  PlusCircle, 
  Loader2, 
  MoreVertical, 
  Trash2, 
  Flag,
  Activity,
  BadgeCheck,
  MessageCircle,
  Twitter,
  Clock,
  Sparkles,
  Zap,
  Newspaper,
  Bot,
  Layers
} from "lucide-react";
import { useAuth, useFirestore } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, orderBy, onSnapshot, Timestamp, getDoc, doc, updateDoc, increment, arrayUnion, arrayRemove, deleteDoc, serverTimestamp } from "firebase/firestore";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/logo";
import Link from "next/link";

const ADMIN_EMAILS = [
  'enterspaceindia@gmail.com', 
  'piyushkumrsingh23399@gmail.com',
  'nyayasahayakhelp@gmail.com'
];

// 56 hours in milliseconds for Transience Protocol
const TRANSience_WINDOW = 56 * 60 * 60 * 1000;

interface Post {
    id: string;
    authorUid: string;
    authorName: string;
    authorAvatar?: string;
    createdAt: Timestamp;
    title: string;
    content: string;
    likes: number;
    likedBy?: string[];
    postType?: 'Idea' | 'Question' | 'Suggestion' | 'Poll' | 'News';
    poll?: {
        options: { text: string; votes: number }[];
        voters?: string[];
    };
    isAnonymous?: boolean;
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
        <Link href={post.isAnonymous ? "#" : `/dashboard/profile/${post.authorUid}`} className={cn("flex items-center gap-3", post.isAnonymous ? "pointer-events-none opacity-60" : "cursor-pointer")}>
            <Avatar className="h-10 w-10 border border-primary/10 shadow-lg rounded-xl">
                {authorAvatar && <AvatarImage src={authorAvatar} alt={authorName} className="object-cover" />}
                <AvatarFallback className="font-black bg-primary/10 text-primary text-xs">{fallback}</AvatarFallback>
            </Avatar>
            <div className="flex-1 text-left">
                <div className="flex items-center gap-1.5">
                    <p className="font-black text-xs tracking-tight">{authorName}</p>
                    {isAdmin && <BadgeCheck className="h-3.5 w-3.5 text-blue-500" />}
                </div>
                <p className="text-[9px] text-muted-foreground font-black uppercase tracking-[0.2em] opacity-40">
                    {post.createdAt ? formatDistanceToNow(post.createdAt.toDate(), { addSuffix: true }) : 'Syncing...'}
                </p>
            </div>
        </Link>
    );
}

function PostCard({ post, userProfile, isAdmin }: { post: Post, userProfile: any, isAdmin: boolean }) {
    const { toast } = useToast();
    const firestore = useFirestore();
    const auth = useAuth();
    const { currentUser } = auth;
    
    const [isLiking, setIsLiking] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [optimisticLikes, setOptimisticLikes] = useState(post.likes);
    const [optimisticLikedBy, setOptimisticLikedBy] = useState(post.likedBy || []);
    const [optimisticPoll, setOptimisticPoll] = useState(post.poll);

    const userHasLiked = optimisticLikedBy.includes(currentUser?.uid ?? '');
    const isAuthor = post.authorUid === currentUser?.uid;
    const userHasVoted = optimisticPoll?.voters?.includes(currentUser?.uid ?? '');
    const totalVotes = optimisticPoll ? optimisticPoll.options.reduce((acc, o) => acc + o.votes, 0) : 0;

    const config = typeConfig[post.postType || 'Idea'] || typeConfig['Idea'];

    const handleLike = () => {
        if (!currentUser || isLiking) return;
        setIsLiking(true);
        const postRef = doc(firestore, "posts", post.id);
        
        setOptimisticLikes(prev => userHasLiked ? prev - 1 : prev + 1);
        setOptimisticLikedBy(prev => userHasLiked ? prev.filter(u => u !== currentUser.uid) : [...prev, currentUser.uid]);

        updateDoc(postRef, {
            likes: increment(userHasLiked ? -1 : 1),
            likedBy: userHasLiked ? arrayRemove(currentUser.uid) : arrayUnion(currentUser.uid)
        }).then(() => {
            if (!userHasLiked && !isAuthor) {
                addDoc(collection(firestore, "notifications"), {
                    userId: post.authorUid, type: 'like', title: 'Transmission Liked',
                    description: `${userProfile?.firstName || 'A citizen'} liked your post.`,
                    isRead: false, createdAt: serverTimestamp()
                }).catch(() => {});
            }
        }).finally(() => setIsLiking(false));
    };

    const handleVote = (idx: number) => {
        if (!currentUser || !optimisticPoll || userHasVoted) return;
        const postRef = doc(firestore, "posts", post.id);
        const newOptions = [...optimisticPoll.options];
        newOptions[idx] = { ...newOptions[idx], votes: newOptions[idx].votes + 1 };
        const newState = { ...optimisticPoll, options: newOptions, voters: [...(optimisticPoll.voters || []), currentUser.uid] };
        setOptimisticPoll(newState);
        updateDoc(postRef, { poll: newState }).catch(() => setOptimisticPoll(post.poll));
    };

    const handleDelete = () => {
        if (!isAdmin && !isAuthor) return;
        if (!confirm("Permanent Purge: Confirm record erasure from Firestore?")) return;
        deleteDoc(doc(firestore, "posts", post.id)).then(() => toast({ title: "Post Purged" }));
    };

    const handleShare = async (platform: string) => {
        const shareText = `Transmission: "${post.title}" on Nyaya Sahayak`;
        if (platform === 'copy') {
            try { 
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    await navigator.clipboard.writeText(window.location.origin + "/dashboard/research-analytics"); 
                    toast({ title: "Link Copied" }); 
                } else {
                    throw new Error("Clipboard API unavailable");
                }
            } catch(e) {
                toast({ variant: "destructive", title: "Copy Failed", description: "Browser permissions restricted clipboard access." });
            }
        } else {
            window.open(platform === 'whatsapp' ? `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}` : `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank');
        }
    };

    return (
        <Card className={cn("overflow-hidden bg-card border-primary/10 transition-all shadow-xl hover:shadow-2xl rounded-[2.5rem] relative text-left", config.glow)}>
            <div className={cn("absolute inset-0 bg-gradient-to-br opacity-5", config.gradient)}></div>
            <CardHeader className="p-6 sm:p-10 pb-0">
                <div className="flex items-start justify-between mb-6">
                    <AuthorIdentityNode post={post} isAdmin={ADMIN_EMAILS.includes(post.authorUid)} />
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className={cn("font-black text-[8px] uppercase px-3 py-1 rounded-full", config.bg, config.color)}>{post.postType || 'Transmission'}</Badge>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild><button className="h-9 w-9 rounded-2xl bg-muted/20 hover:bg-primary/5 flex items-center justify-center transition-all"><MoreVertical className="h-4 w-4" /></button></DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl shadow-2xl glass border-primary/10">
                                {(isAuthor || isAdmin) ? (
                                    <DropdownMenuItem onClick={handleDelete} className="rounded-xl font-bold text-xs h-11 px-4 cursor-pointer text-destructive focus:text-destructive gap-3"><Trash2 className="h-4 w-4" /> Purge</DropdownMenuItem>
                                ) : (
                                    <DropdownMenuItem className="rounded-xl font-bold text-xs h-11 px-4 cursor-pointer gap-3"><Flag className="h-4 w-4" /> Flag</DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
                <div className="space-y-4">
                    <h3 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">{post.title}</h3>
                    <p className="text-sm sm:text-base text-muted-foreground font-medium leading-relaxed whitespace-pre-line">{isExpanded ? post.content : post.content?.slice(0, 200) + (post.content?.length > 200 ? "..." : "")}</p>
                    {post.content?.length > 200 && <button onClick={() => setIsExpanded(!isExpanded)} className="text-[10px] font-black uppercase text-primary hover:underline">{isExpanded ? "Close audit" : "Expand audit"}</button>}
                </div>
            </CardHeader>
            <div className="px-6 sm:p-10 pt-6">
                {optimisticPoll && (
                    <div className="grid gap-3">
                        {optimisticPoll.options.map((o, i) => {
                            const p = totalVotes > 0 ? (o.votes / totalVotes) * 100 : 0;
                            return (
                                <button key={i} onClick={() => handleVote(i)} disabled={userHasVoted} className="w-full relative h-12 rounded-2xl border border-primary/5 overflow-hidden transition-all text-left px-4 bg-white dark:bg-black/20 hover:border-primary/20 active:scale-[0.99]">
                                    {userHasVoted && <motion.div initial={{ width: 0 }} animate={{ width: `${p}%` }} className="absolute inset-y-0 left-0 bg-primary/10 border-r border-primary/20" />}
                                    <div className="relative z-10 flex justify-between h-full items-center"><span className="font-bold text-xs">{o.text}</span>{userHasVoted && <span className="font-black text-xs text-primary">{p.toFixed(0)}%</span>}</div>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
            <CardFooter className="p-6 sm:p-10 mt-6 flex justify-between items-center bg-muted/5 border-t border-primary/5">
                <div className="flex gap-3">
                    <Button variant="ghost" className={cn("h-10 px-4 rounded-2xl text-[10px] font-black uppercase gap-2", userHasLiked ? "text-red-500 bg-red-500/5" : "text-primary")} onClick={handleLike} disabled={isLiking}>
                        {isLiking ? <Loader2 className="h-4 w-4 animate-spin" /> : <Heart className={cn("h-4 w-4", userHasLiked && "fill-current")} />} <span>{optimisticLikes}</span>
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild><button className="h-10 px-4 rounded-2xl bg-white dark:bg-black/20 border border-primary/5 flex items-center gap-2 text-[10px] font-black uppercase"><Share2 className="h-4 w-4" /> Share</button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-60 p-2 rounded-2xl glass border-primary/10">
                            <DropdownMenuItem onClick={() => handleShare('whatsapp')} className="rounded-xl font-bold text-xs h-11 px-4 cursor-pointer gap-4"><MessageCircle className="h-4 w-4" /> WhatsApp</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleShare('twitter')} className="rounded-xl font-bold text-xs h-11 px-4 cursor-pointer gap-4"><Twitter className="h-4 w-4" /> Twitter</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleShare('copy')} className="rounded-xl font-bold text-xs h-11 px-4 cursor-pointer gap-4"><Bookmark className="h-4 w-4" /> Copy ID</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <div className="flex items-center gap-2 text-[9px] font-black uppercase opacity-40"><Clock className="h-3 w-3" /> Transience: Purge in 56H</div>
            </CardFooter>
        </Card>
    );
}

export default function ResearchAnalyticsPage({ params, searchParams }: { params: Promise<any>, searchParams: Promise<any> }) {
    // Unwrap dynamic props for Next.js 15 compliance
    use(params);
    use(searchParams);

    const firestore = useFirestore();
    const auth = useAuth();
    const [feed, setFeed] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [userProfile, setUserProfile] = useState<any>(null);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const unsubAuth = onAuthStateChanged(auth, u => {
            const adminCheck = u?.email ? ADMIN_EMAILS.includes(u.email.toLowerCase()) : false;
            setIsAdmin(adminCheck);
            if (u) {
                getDoc(doc(firestore, "users", u.uid)).then(d => d.exists() && setUserProfile(d.data()));
            }
            onSnapshot(query(collection(firestore, "posts"), orderBy("createdAt", "desc")), snap => {
                const now = Date.now();
                const list: Post[] = [];
                snap.docs.forEach(d => {
                    const data = d.data() as Post;
                    const ct = data.createdAt?.toMillis() || now;
                    if (now - ct > TRANSience_WINDOW) {
                        // Strictly restrict purge write operations to Authorized Root nodes
                        if (adminCheck) deleteDoc(doc(firestore, "posts", d.id)).catch(() => {});
                    } else {
                        list.push({ id: d.id, ...data });
                    }
                });
                setFeed(list);
                setLoading(false);
            }, (serverError) => {
                console.error("Forensic Feed Stream Restricted:", serverError);
                setLoading(false);
            });
        });
        return () => unsubAuth();
    }, [auth, firestore]);

    if (loading) return <div className="flex h-[70vh] items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-primary opacity-20" /></div>;

    return (
        <div className="space-y-8 max-w-4xl mx-auto pb-20 px-2 sm:px-0 text-left">
            <motion.div 
                initial={{ opacity: 0, y: -20 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="relative p-6 sm:p-8 md:p-10 rounded-[2rem] overflow-hidden bg-card/40 backdrop-blur-xl border border-primary/10 shadow-2xl group"
            >
                <div className="absolute top-0 right-0 p-6 opacity-[0.02] pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                    <Logo className="h-48 w-48 grayscale" priority={true} />
                </div>
                
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="space-y-4">
                        <motion.div 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex items-center gap-2"
                        >
                            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-lg">
                                <Sparkles className="h-3 w-3 mr-1.5 animate-pulse" /> Transience Active
                            </Badge>
                        </motion.div>
                        
                        <div className="space-y-1">
                            <motion.h1 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-2xl sm:text-4xl font-black font-headline tracking-tighter uppercase leading-none text-foreground"
                            >
                                Live <span className="text-primary italic">Transmissions.</span>
                            </motion.h1>
                            <motion.p 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-xs sm:text-sm text-muted-foreground font-medium max-w-lg leading-relaxed opacity-80"
                            >
                                Publicly audited statutory ideas. Every community node is purged from the registry after 56 hours.
                            </motion.p>
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                        className="shrink-0 w-full md:w-auto"
                    >
                        <Button size="lg" className="h-12 px-8 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-primary/20 active:scale-95 transition-all w-full md:w-auto" asChild>
                            <Link href="/dashboard/research-analytics/new">
                                <PlusCircle className="mr-2 h-4 w-4" /> Initialize Post
                            </Link>
                        </Button>
                    </motion.div>
                </div>
                
                <div className="h-1 w-full bg-gradient-to-r from-primary/20 via-primary to-primary/20 absolute bottom-0 left-0"></div>
            </motion.div>

            <div className="grid gap-8">
                {feed.length > 0 ? feed.map((item, i) => (
                    <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + (i * 0.05) }}>
                        <PostCard post={item} userProfile={userProfile} isAdmin={isAdmin} />
                    </motion.div>
                )) : (
                    <div className="py-32 text-center opacity-40 flex flex-col items-center gap-10">
                        <Newspaper className="h-20 w-20" />
                        <div className="space-y-3">
                            <p className="font-black text-3xl uppercase tracking-tighter">Registry Clear</p>
                            <p className="text-sm italic">"Awaiting institutional transmissions."</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
