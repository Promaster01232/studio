
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
  MessageCircle,
  Share2,
  Bookmark,
  Loader2,
  BadgeCheck,
  MoreVertical,
  Flag,
  Trash2,
  Twitter,
  TrendingUp,
  ChevronRight,
  Plus,
  Zap,
  Cpu,
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
import Image from "next/image";
import { Logo } from "@/components/logo";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError, type SecurityRuleContext } from "@/firebase/errors";

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

const ForensicLabel = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={cn("flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.3em] text-primary/60", className)}>
        <div className="h-1 w-1 rounded-full bg-primary animate-pulse" />
        {children}
    </div>
);

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
                "flex items-center gap-2.5",
                post.isAnonymous ? "pointer-events-none opacity-60" : "cursor-pointer"
            )}
        >
            <Avatar className="h-9 w-9 border border-background shadow-md rounded-lg">
                {authorAvatar && <AvatarImage src={authorAvatar} alt={authorName} className="object-cover" />}
                <AvatarFallback className="font-black bg-primary/10 text-primary text-[10px]">{fallback}</AvatarFallback>
            </Avatar>
            <div className="flex-1 text-left">
                <div className="flex items-center gap-1">
                    <p className="font-black text-xs tracking-tight">{authorName}</p>
                    {isAdmin && <BadgeCheck className="h-3 w-3 text-blue-500" />}
                </div>
                <p className="text-[8px] text-muted-foreground font-bold uppercase tracking-widest opacity-60">
                    {post.createdAt ? formatDistanceToNow(post.createdAt.toDate(), { addSuffix: true }) : '...'}
                </p>
            </div>
        </Link>
    );
}

function PostCard({ post, userProfile }: { post: Post, userProfile: any }) {
    const { toast } = useToast();
    const firestore = useFirestore();
    const auth = useAuth();
    const { currentUser } = auth;
    
    const [isLiking, setIsLiking] = useState(false);
    const [optimisticLikes, setOptimisticLikes] = useState(post.likes);
    const [optimisticLikedBy, setOptimisticLikedBy] = useState(post.likedBy || []);

    const userHasLiked = optimisticLikedBy.includes(currentUser?.uid ?? '');
    const isAdmin = currentUser?.email && (ADMIN_EMAILS.includes(currentUser.email.toLowerCase()) || userProfile?.isAdmin);
    const isAuthor = post.authorUid === currentUser?.uid;
    
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

    const handleDelete = async () => {
        if (!confirm("Confirm node deletion from community registry?")) return;
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
            <Card className="overflow-hidden glass border-primary/10 transition-all rounded-2xl flex flex-col sm:flex-row h-full min-h-[200px]">
                <div className="relative w-full sm:w-48 h-40 sm:h-auto overflow-hidden shrink-0">
                    {post.image ? (
                        <Image src={post.image} alt={post.title} fill className="object-cover" />
                    ) : (
                        <div className="absolute inset-0 bg-primary/5 flex items-center justify-center">
                            <Logo className="h-12 w-12 opacity-10" />
                        </div>
                    )}
                    <div className="absolute top-3 left-3">
                        <Badge className="bg-primary text-white font-black text-[7px] uppercase tracking-widest px-2 py-0.5 rounded-full">
                            {post.postType || 'TX'}
                        </Badge>
                    </div>
                </div>

                <div className="flex-1 flex flex-col p-5 sm:p-6 text-left">
                    <div className="flex items-center justify-between mb-4">
                        <AuthorIdentityNode post={post} isAdmin={ADMIN_EMAILS.includes(post.authorUid)} />
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-primary/5">
                                    <MoreVertical className="h-4 w-4 text-muted-foreground" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40 p-1.5 rounded-xl border-primary/5">
                                {(isAuthor || isAdmin) ? (
                                    <DropdownMenuItem onSelect={handleDelete} className="text-xs font-bold text-destructive">
                                        <Trash2 className="h-3 w-3 mr-2" /> Purge
                                    </DropdownMenuItem>
                                ) : (
                                    <DropdownMenuItem className="text-xs font-bold">
                                        <Flag className="h-3 w-3 mr-2" /> Report
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <div className="space-y-2 flex-1 mb-6">
                        <h3 className="text-lg font-black tracking-tight leading-tight line-clamp-1">{post.title}</h3>
                        <p className="text-xs text-muted-foreground font-medium line-clamp-2">{post.content}</p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-primary/5">
                        <div className="flex gap-3">
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className={cn("h-8 px-3 rounded-lg text-[10px] font-black uppercase tracking-widest gap-2", userHasLiked ? "text-red-500" : "text-primary")}
                                onClick={handleLike}
                                disabled={isLiking}
                            >
                                {isLiking ? <Loader2 className="h-3 w-3 animate-spin" /> : <Heart className={cn("h-3.5 w-3.5", userHasLiked && "fill-current")} />}
                                <span>{optimisticLikes}</span>
                            </Button>
                        </div>
                        <Button variant="ghost" size="sm" className="h-8 px-4 text-[10px] font-black uppercase" asChild>
                            <Link href="/dashboard/research-analytics">View Node</Link>
                        </Button>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}

const aiFeatures = [
    { href: "/dashboard/strength-analyzer", icon: BrainCircuit, title: "Analyzer", desc: "Case assessment.", color: "text-blue-500", bg: "bg-blue-500/5", sector: "Sector: Forensic" },
    { href: "/dashboard/document-intelligence", icon: Search, title: "Doc Intel", desc: "Statutory audit.", color: "text-emerald-500", bg: "bg-emerald-500/5", sector: "Sector: Statutory" },
    { href: "/dashboard/document-generator", icon: FileText, title: "Drafting", desc: "Legal petitions.", color: "text-amber-500", bg: "bg-amber-500/5", sector: "Sector: Civil" },
    { href: "/dashboard/bond-generator", icon: FileSignature, title: "Bonds", desc: "Affidavits.", color: "text-purple-500", bg: "bg-purple-500/5", sector: "Sector: Registry" },
];

const SectionHeader = ({ children, icon: Icon, sector }: { children: React.ReactNode, icon?: any, sector?: string }) => (
    <div className="flex items-center justify-between mb-6 border-b border-primary/5 pb-4">
        <div className="flex items-center gap-3">
            {Icon && <Icon className="h-5 w-5 text-primary opacity-40" />}
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground">{children}</h2>
        </div>
        {sector && <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground opacity-40">{sector}</span>}
    </div>
)

export default function DashboardHomePage() {
  const [text, setText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const fullText = 'Sahayak';
  
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
            if (auth.currentUser) {
                const permissionError = new FirestorePermissionError({
                    path: postsRef.path,
                    operation: 'list',
                } satisfies SecurityRuleContext, serverError);
                errorEmitter.emit('permission-error', permissionError);
            }
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

  return (
    <div className="flex flex-col h-full space-y-12 pb-20 max-w-6xl mx-auto text-left relative">
        <MotionWrapper>
          <Card className="relative p-8 sm:p-12 rounded-[2rem] overflow-hidden border-primary/5 bg-card/40 backdrop-blur-xl shadow-2xl">
              <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none">
                  <Logo className="h-64 w-64 border-none p-0 grayscale" />
              </div>
              <div className="relative z-10 space-y-8">
                  <div className="space-y-2">
                      <h1 className="text-3xl sm:text-5xl font-black font-headline tracking-tighter leading-none text-foreground">
                          Welcome back, <br />
                          <span className="bg-gradient-to-r from-primary via-accent to-blue-400 bg-clip-text text-transparent italic">Nyaya {text}</span>
                      </h1>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground font-medium max-w-xl leading-relaxed">
                      Access high-fidelity legal intelligence nodes and forensic auditing tools designed for statutory precision.
                  </p>
                  <div className="flex flex-wrap gap-4 pt-2">
                      <Button size="sm" className="rounded-xl font-black uppercase tracking-[0.2em] text-[9px] px-8 h-12 shadow-xl shadow-primary/20 active:scale-95 transition-all" asChild>
                          <Link href="/dashboard/narrate">Initialize Narration</Link>
                      </Button>
                      <Button variant="outline" size="sm" className="rounded-xl font-black uppercase tracking-[0.2em] text-[9px] px-8 h-12 border-primary/10 hover:bg-primary/5 active:scale-95 transition-all" asChild>
                          <Link href="/dashboard/support">Hub Support</Link>
                      </Button>
                  </div>
              </div>
          </Card>
        </MotionWrapper>

        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-10">
              <section>
                  <SectionHeader icon={TrendingUp} sector="Sector: Community">Live Transmission Stream</SectionHeader>
                  <div className="space-y-6">
                      {postsLoading ? (
                          <div className="space-y-4">
                              {[...Array(3)].map((_, i) => (
                                  <Card key={i} className="h-32 animate-pulse border-primary/5 rounded-2xl bg-muted/20" />
                              ))}
                          </div>
                      ) : latestPosts.length === 0 ? (
                          <Card className="py-20 text-center glass rounded-3xl border-dashed border-2 border-primary/10 opacity-40">
                              <p className="font-black uppercase tracking-[0.2em] text-[10px]">Registry Empty // No active transmissions</p>
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
                  <SectionHeader icon={Sparkles} sector="Status: Optimized">System Node Matrix</SectionHeader>
                  <div className="grid grid-cols-2 gap-4">
                      {aiFeatures.map((f) => (
                        <Link key={f.href} href={f.href} className="block group">
                            <Card className="h-full glass p-5 rounded-2xl border-primary/5 group-hover:border-primary/20 transition-all text-left relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-2 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                                    <f.icon className="h-8 w-8" />
                                </div>
                                <div className={cn("p-2.5 rounded-lg w-fit mb-4 transition-transform group-hover:scale-110", f.bg, f.color)}>
                                    <f.icon className="h-4 w-4" />
                                </div>
                                <h3 className="font-black text-[10px] uppercase tracking-tighter text-foreground">{f.title}</h3>
                                <p className="text-[9px] text-muted-foreground font-bold mt-1 leading-tight opacity-60">{f.desc}</p>
                                <div className="mt-4 pt-3 border-t border-primary/5">
                                    <span className="text-[7px] font-black uppercase tracking-widest text-primary/40">{f.sector}</span>
                                </div>
                            </Card>
                        </Link>
                      ))}
                  </div>
              </section>

              <section>
                  <SectionHeader icon={Library} sector="Status: Ready">Statutory Registry</SectionHeader>
                  <div className="space-y-3">
                      {[
                        { href: "/dashboard/learn", icon: Library, title: "Knowledge Hub", label: "NODE-LERN" },
                        { href: "/dashboard/my-cases", icon: Landmark, title: "Case Tracker", label: "NODE-CASE" },
                      ].map((item) => (
                        <Link key={item.href} href={item.href} className="block group">
                            <Card className="glass p-4 rounded-xl border-primary/5 group-hover:bg-primary/5 group-hover:border-primary/20 transition-all flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 rounded-lg bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                        <item.icon className="h-4 w-4" />
                                    </div>
                                    <span className="font-black text-[10px] uppercase tracking-[0.2em]">{item.title}</span>
                                </div>
                                <span className="text-[7px] font-mono font-bold text-muted-foreground opacity-40">{item.label}</span>
                            </Card>
                        </Link>
                      ))}
                  </div>
              </section>
          </div>
        </div>

        <div className="pt-12 text-center border-t border-primary/5 opacity-30">
            <p className="text-[8px] font-black uppercase tracking-[0.6em] text-muted-foreground">NYAYASAHAYAK.IN // TERMINAL ACTIVE // PROTOCOL ALPHA-4</p>
        </div>
    </div>
  );
}
