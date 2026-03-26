
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
  HeartHandshake,
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
  Zap,
  ChevronRight,
  TrendingUp,
  Newspaper,
  Link as LinkIcon,
  Plus,
  Bot,
  Send,
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
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Logo } from "@/components/logo";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError, type SecurityRuleContext } from "@/firebase/errors";

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

const NeuralRain = () => {
  return (
    <div className="neural-rain opacity-20">
      {Array.from({ length: 25 }).map((_, i) => (
        <div
          key={i}
          className="rain-drop"
          style={{
            left: `${Math.random() * 100}%`,
            animationDuration: `${Math.random() * 2 + 1}s`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}
    </div>
  );
};

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
    { href: "/dashboard/strength-analyzer", icon: BrainCircuit, title: "Analyzer", desc: "Case assessment.", color: "text-blue-500", bg: "bg-blue-500/5" },
    { href: "/dashboard/document-intelligence", icon: Search, title: "Doc Intel", desc: "Statutory audit.", color: "text-emerald-500", bg: "bg-emerald-500/5" },
    { href: "/dashboard/document-generator", icon: FileText, title: "Drafting", desc: "Legal petitions.", color: "text-amber-500", bg: "bg-amber-500/5" },
    { href: "/dashboard/bond-generator", icon: FileSignature, title: "Bonds", desc: "Affidavits.", color: "text-purple-500", bg: "bg-purple-500/5" },
];

const SectionTitle = ({children, icon: Icon}: {children: React.ReactNode, icon?: any}) => (
    <div className="flex items-center gap-3 mb-6">
        {Icon && <Icon className="h-5 w-5 text-primary opacity-40" />}
        <h2 className="text-sm font-black uppercase tracking-[0.2em] text-foreground">{children}</h2>
    </div>
)

export default function DashboardHomePage() {
  const [text, setText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const fullText = 'Nyaya Sahayak';
  
  const firestore = useFirestore();
  const auth = useAuth();
  const [latestPosts, setLatestPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
        if (!user) {
            setPostsLoading(false);
            return;
        }

        const postsRef = collection(firestore, "posts");
        const q = query(postsRef, orderBy("createdAt", "desc"), limit(5));
        
        const unsubscribe = onSnapshot(q, (snap) => {
            const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as Post));
            setLatestPosts(list);
            setPostsLoading(false);
        }, (serverError) => {
            const permissionError = new FirestorePermissionError({
                path: postsRef.path,
                operation: 'list',
            } satisfies SecurityRuleContext, serverError);
            errorEmitter.emit('permission-error', permissionError);
            setPostsLoading(false);
        });

        getDoc(doc(firestore, "users", user.uid)).then(docSnap => {
            if (docSnap.exists()) setUserProfile(docSnap.data());
        });

        return () => unsubscribe();
    });

    return () => unsubscribeAuth();
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
          <div className="relative p-8 sm:p-12 rounded-3xl overflow-hidden bg-primary/5 border border-primary/10 shadow-sm">
              <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-3 text-primary">
                      <Sparkles className="h-4 w-4 animate-pulse" />
                      <span className="text-[9px] font-black uppercase tracking-[0.4em]">Node: Alpha-4</span>
                  </div>
                  <h1 className="text-3xl sm:text-5xl font-black font-headline tracking-tighter leading-none text-foreground">
                      Welcome back, <br />
                      <span className="bg-gradient-to-r from-primary via-accent to-blue-400 bg-clip-text text-transparent italic">{text}</span>
                  </h1>
                  <p className="text-sm sm:text-base text-muted-foreground font-medium max-w-xl">
                      Access legal intelligence and forensic tools designed for precision.
                  </p>
                  <div className="flex flex-wrap gap-4 pt-4">
                      <Button size="sm" className="rounded-xl font-black uppercase tracking-widest text-[9px] px-6 h-11" asChild>
                          <Link href="/dashboard/narrate">Initialize Narration</Link>
                      </Button>
                      <Button variant="outline" size="sm" className="rounded-xl font-black uppercase tracking-widest text-[9px] px-6 h-11 border-primary/10" asChild>
                          <Link href="/dashboard/support">Hub Support</Link>
                      </Button>
                  </div>
              </div>
          </div>
        </MotionWrapper>

        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-10">
              <section>
                  <SectionTitle icon={TrendingUp}>Live Stream</SectionTitle>
                  <div className="space-y-6">
                      {postsLoading ? (
                          <div className="space-y-4">
                              {[...Array(3)].map((_, i) => (
                                  <Card key={i} className="h-32 animate-pulse border-primary/5" />
                              ))}
                          </div>
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
                  <SectionTitle icon={Sparkles}>AI Nodes</SectionTitle>
                  <div className="grid grid-cols-2 gap-4">
                      {aiFeatures.map((f) => (
                        <Link key={f.href} href={f.href} className="block group">
                            <Card className="h-full glass p-5 rounded-2xl border-primary/5 group-hover:border-primary/20 transition-all text-left">
                                <div className={cn("p-2.5 rounded-lg w-fit mb-3", f.bg, f.color)}>
                                    <f.icon className="h-4 w-4" />
                                </div>
                                <h3 className="font-black text-xs uppercase tracking-tight">{f.title}</h3>
                                <p className="text-[10px] text-muted-foreground font-bold mt-1">{f.desc}</p>
                            </Card>
                        </Link>
                      ))}
                  </div>
              </section>

              <section>
                  <SectionTitle icon={Library}>Registry</SectionTitle>
                  <div className="space-y-3">
                      {[
                        { href: "/dashboard/learn", icon: Library, title: "Knowledge Hub" },
                        { href: "/dashboard/my-cases", icon: Landmark, title: "Case Tracker" },
                      ].map((item) => (
                        <Link key={item.href} href={item.href} className="block group">
                            <Card className="glass p-4 rounded-xl border-primary/5 group-hover:bg-primary/5 transition-all flex items-center gap-4">
                                <div className="p-2 rounded-lg bg-primary/5 text-primary">
                                    <item.icon className="h-4 w-4" />
                                </div>
                                <span className="font-black text-xs uppercase tracking-widest">{item.title}</span>
                            </Card>
                        </Link>
                      ))}
                  </div>
              </section>
          </div>
        </div>

        <div className="pt-12 text-center border-t border-primary/5 opacity-30">
            <p className="text-[8px] font-black uppercase tracking-[0.6em] text-muted-foreground">NYAYASAHAYAK.IN // TERMINAL ACTIVE</p>
        </div>
    </div>
  );
}
