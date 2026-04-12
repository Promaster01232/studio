
"use client";

import { useToast } from "@/hooks/use-toast";
import React, { useState, useEffect } from "react";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
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
  BadgeCheck,
  MessageCircle,
  Twitter,
  Sparkles,
  Zap,
  Newspaper,
  Bot,
  Layers,
  Activity
} from "lucide-react";
import { useAuth, useFirestore } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, orderBy, onSnapshot, Timestamp, doc, updateDoc, increment, arrayUnion, arrayRemove, deleteDoc } from "firebase/firestore";
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
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError, type SecurityRuleContext } from "@/firebase/errors";

const ADMIN_EMAILS = [
  'enterspaceindia@gmail.com', 
  'piyushkumrsingh23399@gmail.com',
  'nyayasahayakhelp@gmail.com'
];

const TRANSIENCE_WINDOW = 56 * 60 * 60 * 1000;

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
}

const typeConfig: Record<string, { color: string, bg: string, border: string, icon: any, gradient: string, glow: string }> = {
    'Idea': { color: 'text-amber-600', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: Sparkles, gradient: 'from-amber-500/5', glow: 'shadow-amber-500/10' },
    'Question': { color: 'text-blue-600', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: Bot, gradient: 'from-blue-500/5', glow: 'shadow-blue-500/10' },
    'Suggestion': { color: 'text-emerald-600', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: Zap, gradient: 'from-emerald-500/5', glow: 'shadow-emerald-500/10' },
    'Poll': { color: 'text-purple-600', bg: 'bg-purple-500/10', border: 'border-purple-500/20', icon: Layers, gradient: 'from-purple-500/5', glow: 'shadow-purple-500/10' },
    'News': { color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20', icon: Newspaper, gradient: 'from-primary/5', glow: 'shadow-primary/10' },
};

function AuthorIdentityNode({ post, isAdmin }: { post: Post, isAdmin: boolean }) {
    return (
        <Link href={`/dashboard/profile/${post.authorUid}`} className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-primary/10 shadow-lg rounded-xl">
                <AvatarImage src={post.authorAvatar} alt={post.authorName} className="object-cover" />
                <AvatarFallback className="font-black bg-primary/10 text-primary text-xs">{post.authorName?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 text-left">
                <div className="flex items-center gap-1.5">
                    <p className="font-black text-xs tracking-tight">{post.authorName}</p>
                    {isAdmin && <BadgeCheck className="h-3.5 w-3.5 text-blue-500" />}
                </div>
            </div>
        </Link>
    );
}

function PostCard({ post, isAdmin }: { post: Post, isAdmin: boolean }) {
    const { toast } = useToast();
    const firestore = useFirestore();
    const auth = useAuth();
    const { currentUser } = auth;
    
    const [isLiking, setIsLiking] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const userHasLiked = post.likedBy?.includes(currentUser?.uid ?? '');
    const isAuthor = post.authorUid === currentUser?.uid;

    const config = typeConfig[post.postType || 'Idea'] || typeConfig['Idea'];

    const handleLike = () => {
        if (!currentUser || isLiking) return;
        setIsLiking(true);
        const postRef = doc(firestore, "posts", post.id);
        
        updateDoc(postRef, {
            likes: increment(userHasLiked ? -1 : 1),
            likedBy: userHasLiked ? arrayRemove(currentUser.uid) : arrayUnion(currentUser.uid)
        }).catch(async (err) => {
            const permissionError = new FirestorePermissionError({
                path: postRef.path,
                operation: 'update',
                requestResourceData: { likes: userHasLiked ? -1 : 1 },
            } satisfies SecurityRuleContext, err);
            errorEmitter.emit('permission-error', permissionError);
        }).finally(() => setIsLiking(false));
    };

    const handleDelete = () => {
        if (!isAdmin && !isAuthor) return;
        if (!confirm("Confirm Statutory Record Purge?")) return;
        const postRef = doc(firestore, "posts", post.id);
        deleteDoc(postRef).then(() => toast({ title: "Transmission Purged" }))
        .catch(async (err) => {
            const permissionError = new FirestorePermissionError({
                path: postRef.path,
                operation: 'delete',
            } satisfies SecurityRuleContext, err);
            errorEmitter.emit('permission-error', permissionError);
        });
    };

    const handleShare = (platform: 'whatsapp' | 'twitter' | 'copy') => {
        const shareText = `Check Out This Institutional Transmission At https://nyayasahayak.in: "${post.title}"`;
        const shareUrl = `${window.location.origin}/dashboard/research-analytics`;
        
        if (platform === 'whatsapp') {
            window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank');
        } else if (platform === 'twitter') {
            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
        } else if (platform === 'copy') {
            navigator.clipboard.writeText(shareUrl);
            toast({ title: "Registry Link Copied" });
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
                                    <DropdownMenuItem onClick={handleDelete} className="rounded-xl font-bold text-xs h-11 px-4 cursor-pointer text-destructive focus:text-destructive gap-3"><Trash2 className="h-4 w-4" /> Purge System</DropdownMenuItem>
                                ) : (
                                    <DropdownMenuItem className="rounded-xl font-bold text-xs h-11 px-4 cursor-pointer gap-3"><Flag className="h-4 w-4" /> Report Breach</DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
                <div className="space-y-4">
                    <h3 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">{post.title}</h3>
                    <p className="text-sm sm:text-base text-muted-foreground font-medium leading-relaxed whitespace-pre-line">{isExpanded ? post.content : post.content?.slice(0, 200) + (post.content?.length > 200 ? "..." : "")}</p>
                    {post.content?.length > 200 && <button onClick={() => setIsExpanded(!isExpanded)} className="text-[10px] font-black uppercase text-primary hover:underline">{isExpanded ? "Close Audit" : "Expand Audit"}</button>}
                </div>
            </CardHeader>
            <CardFooter className="p-6 sm:p-10 mt-6 flex justify-between items-center bg-muted/5 border-t border-primary/5">
                <div className="flex gap-3">
                    <Button variant="ghost" className={cn("h-10 px-4 rounded-2xl text-[10px] font-black uppercase gap-2", userHasLiked ? "text-red-500 bg-red-500/5" : "text-primary")} onClick={handleLike} disabled={isLiking}>
                        {isLiking ? <Loader2 className="h-4 w-4 animate-spin" /> : <Heart className={cn("h-4 w-4", userHasLiked && "fill-current")} />} <span>{post.likes}</span>
                    </Button>
                </div>
                <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleShare('copy')} className="h-10 w-10 rounded-2xl text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all"><Bookmark className="h-4 w-4" /></Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-2xl text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all"><Share2 className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 p-2 rounded-xl shadow-2xl glass border-primary/10">
                            <DropdownMenuItem onClick={() => handleShare('whatsapp')} className="rounded-lg font-bold text-xs h-10 px-3 cursor-pointer gap-3"><div className="bg-green-500/10 p-1.5 rounded-md text-green-600"><MessageCircle className="h-3.5 w-3.5" /></div> WhatsApp</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleShare('twitter')} className="rounded-lg font-bold text-xs h-10 px-3 cursor-pointer gap-3"><div className="bg-blue-500/10 p-1.5 rounded-md text-blue-500"><Twitter className="h-3.5 w-3.5" /></div> Twitter (X)</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
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
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const unsubAuth = onAuthStateChanged(auth, u => {
            const adminCheck = u?.email ? ADMIN_EMAILS.includes(u.email.toLowerCase()) : false;
            setIsAdmin(adminCheck);
            
            const postsCol = collection(firestore, "posts");
            const feedQuery = query(postsCol, orderBy("createdAt", "desc"));
            
            const unsubFeed = onSnapshot(feedQuery, snap => {
                const now = Date.now();
                const list: Post[] = [];
                snap.docs.forEach(d => {
                    const data = d.data() as Post;
                    const ct = data.createdAt?.toMillis() || now;
                    if (now - ct > TRANSIENCE_WINDOW) {
                        if (adminCheck) deleteDoc(doc(firestore, "posts", d.id)).catch(() => {});
                    } else {
                        list.push({ id: d.id, ...data });
                    }
                });
                setFeed(list);
                setLoading(false);
            }, (err) => {
                const permissionError = new FirestorePermissionError({
                    path: postsCol.path,
                    operation: 'list',
                } satisfies SecurityRuleContext, err);
                errorEmitter.emit('permission-error', permissionError);
                setLoading(false);
            });

            return () => unsubFeed();
        });
        return () => unsubAuth();
    }, [auth, firestore]);

    if (loading) return <div className="flex h-[70vh] items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-primary opacity-20" /></div>;

    return (
        <div className="space-y-8 max-w-4xl mx-auto pb-20 px-2 sm:px-0 text-left">
            <motion.div 
                initial={{ opacity: 0, y: -20 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="relative p-8 rounded-[2rem] overflow-hidden bg-card/40 backdrop-blur-xl border border-primary/10 shadow-2xl"
            >
                <div className="absolute top-0 right-0 p-6 opacity-[0.02] pointer-events-none">
                    <Logo className="h-48 w-48 grayscale" priority={true} />
                </div>
                
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-left">
                    <div className="space-y-4 text-left">
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-lg">
                            <Sparkles className="h-3 w-3 mr-1.5 animate-pulse" /> Community Registry
                        </Badge>
                        <div className="space-y-1">
                            <h1 className="text-3xl sm:text-4xl font-black font-headline tracking-tighter uppercase leading-none text-foreground">
                                Live Transmissions
                            </h1>
                            <p className="text-sm text-muted-foreground font-medium opacity-80" >
                                Publicly Audited Statutory Ideas At https://nyayasahayak.in. 56-Hour Transience Protocol Active.
                            </p>
                        </div>
                    </div>

                    <Button size="lg" className="h-14 px-8 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-primary/20 active:scale-95 transition-all w-full md:w-auto" asChild>
                        <Link href="/dashboard/research-analytics/new">
                            <PlusCircle className="mr-2 h-4 w-4" /> Initialize Post
                        </Link>
                    </Button>
                </div>
            </motion.div>

            <div className="grid gap-8">
                {feed.length > 0 ? feed.map((item, i) => (
                    <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + (i * 0.05) }}>
                        <PostCard post={item} isAdmin={isAdmin} />
                    </motion.div>
                )) : (
                    <div className="py-32 text-center opacity-40 flex flex-col items-center gap-10">
                        <Newspaper className="h-20 w-20" />
                        <div className="space-y-3">
                            <p className="font-black text-3xl uppercase tracking-tighter">Registry Clear</p>
                            <p className="text-sm italic">"Awaiting Institutional Transmissions."</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
