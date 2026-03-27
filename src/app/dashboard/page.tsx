
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
  TrendingUp,
  Plus,
  Zap,
  Cpu,
  Bot,
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
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
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
            <Avatar className="h-8 w-8 border border-background shadow-md rounded-lg">
                {authorAvatar && <AvatarImage src={authorAvatar} alt={authorName} className="object-cover" />}
                <AvatarFallback className="font-black bg-primary/10 text-primary text-[10px]">{fallback}</AvatarFallback>
            </Avatar>
            <div className="flex-1 text-left">
                <div className="flex items-center gap-1">
                    <p className="font-black text-[11px] tracking-tight">{authorName}</p>
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
        if (!confirm("Confirm identity node purge from community registry?")) return;
        const postRef = doc(firestore, "posts", post.id);
        deleteDoc(postRef).catch((serverError) => {
            const permissionError = new FirestorePermissionError({
                path: postRef.path,
                operation: 'delete',
            } satisfies SecurityRuleContext, serverError);
            errorEmitter.emit('permission-error', permissionError);
        });
    };

    const handleReport = () => {
        toast({
            title: "Transmission Reported",
            description: "Institutional audit initiated for forensic compliance.",
        });
    };

    return (
        <motion.div layout className="w-full">
            <Card className="overflow-hidden glass border-primary/10 transition-all rounded-[1.5rem] flex flex-col relative">
                <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-gradient-to-b from-primary via-accent to-blue-500"></div>
                
                <div className="flex-1 flex flex-col p-5 sm:p-6 text-left ml-1.5">
                    <div className="flex items-center justify-between mb-4">
                        <AuthorIdentityNode post={post} isAdmin={ADMIN_EMAILS.includes(post.authorUid)} />
                        <div className="flex items-center gap-2">
                            <Badge className="bg-primary/10 text-primary border-primary/10 font-black text-[7px] uppercase tracking-widest px-2 py-0.5 rounded-full">
                                {post.postType || 'TX'}
                            </Badge>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg hover:bg-primary/5">
                                        <MoreVertical className="h-3.5 w-3.5 text-muted-foreground" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48 p-2 rounded-xl shadow-2xl glass border-primary/10">
                                    {(isAuthor || isAdmin) ? (
                                        <DropdownMenuItem onSelect={handleDelete} className="rounded-lg font-bold text-[10px] h-9 px-3 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10 gap-2.5">
                                            <Trash2 className="h-3.5 w-3.5" /> 
                                            <span>Purge Identity Node</span>
                                        </DropdownMenuItem>
                                    ) : (
                                        <DropdownMenuItem onSelect={handleReport} className="rounded-lg font-bold text-[10px] h-9 px-3 cursor-pointer gap-2.5 hover:bg-red-500/5 hover:text-red-500">
                                            <Flag className="h-3.5 w-3.5" /> 
                                            <span>Report Forensic Breach</span>
                                        </DropdownMenuItem>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    <div className="space-y-2 flex-1 mb-5">
                        <h3 className="text-base sm:text-lg font-black tracking-tight leading-tight text-foreground">{post.title}</h3>
                        <p className="text-[11px] sm:text-xs text-muted-foreground font-medium line-clamp-3 leading-relaxed">{post.content}</p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-primary/5">
                        <div className="flex gap-2">
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className={cn("h-8 px-3 rounded-lg text-[10px] font-black uppercase tracking-widest gap-2 transition-all", userHasLiked ? "text-red-500 bg-red-500/5" : "text-primary hover:bg-primary/5")}
                                onClick={handleLike}
                                disabled={isLiking}
                            >
                                {isLiking ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Heart className={cn("h-3.5 w-3.5", userHasLiked && "fill-current")} />}
                                <span>{optimisticLikes}</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 px-3 rounded-lg text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all">
                                <MessageCircle className="h-3.5 w-3.5 mr-2" /> {post.comments}
                            </Button>
                        </div>
                        <Button variant="ghost" size="sm" className="h-8 px-4 rounded-xl font-black text-[9px] uppercase tracking-widest text-primary border border-primary/10 hover:bg-primary hover:text-white transition-all shadow-sm" asChild>
                            <Link href="/dashboard/research-analytics">
                                <span>Analyze Node</span>
                                <ArrowRight className="ml-2 h-3 w-3" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}

const aiFeatures = [
    { href: "/dashboard/strength-analyzer", icon: BrainCircuit, title: "Analyzer", desc: "Forensic assessment.", color: "text-blue-500", bg: "bg-blue-500/5", sector: "Node: Forensic" },
    { href: "/dashboard/document-intelligence", icon: Search, title: "Doc Intel", desc: "Statutory audit.", color: "text-emerald-500", bg: "bg-emerald-500/5", sector: "Node: Statutory" },
    { href: "/dashboard/document-generator", icon: FileText, title: "Drafting", desc: "Legal petitions.", color: "text-amber-500", bg: "bg-amber-500/5", sector: "Node: Civil" },
    { href: "/dashboard/bond-generator", icon: FileSignature, title: "Bonds", desc: "Legal affidavits.", color: "text-purple-500", bg: "bg-purple-500/5", sector: "Node: Registry" },
];

const SectionHeader = ({ children, icon: Icon, sector }: { children: React.ReactNode, icon?: any, sector?: string }) => (
    <div className="flex items-center justify-between mb-5 border-b border-primary/5 pb-3">
        <div className="flex items-center gap-2.5">
            {Icon && <Icon className="h-4 w-4 text-primary opacity-40" />}
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
    <div className="flex flex-col h-full space-y-10 pb-20 max-w-6xl mx-auto text-left relative">
        <MotionWrapper>
          <Card className="relative p-6 sm:p-10 rounded-[2rem] overflow-hidden border-primary/5 bg-card/40 backdrop-blur-xl shadow-2xl">
              <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none">
                  <Logo className="h-48 w-48 border-none p-0 grayscale" />
              </div>
              <div className="relative z-10 space-y-6">
                  <div className="space-y-1">
                      <h1 className="text-2xl sm:text-4xl font-black font-headline tracking-tighter leading-none text-foreground">
                          Welcome back, <br />
                          <span className="bg-gradient-to-r from-primary via-accent to-blue-400 bg-clip-text text-transparent italic">Nyaya {text}</span>
                      </h1>
                  </div>
                  <p className="text-[11px] sm:text-xs text-muted-foreground font-medium max-w-lg leading-relaxed">
                      Access high-fidelity legal intelligence nodes and forensic auditing tools designed for statutory precision.
                  </p>
                  <div className="flex flex-wrap gap-3 pt-1">
                      <Button size="sm" className="rounded-xl font-black uppercase tracking-[0.2em] text-[8px] px-6 h-10 shadow-xl shadow-primary/20 active:scale-95 transition-all" asChild>
                          <Link href="/dashboard/narrate">Initialize Narration</Link>
                      </Button>
                      <Button variant="outline" size="sm" className="rounded-xl font-black uppercase tracking-[0.2em] text-[8px] px-6 h-10 border-primary/10 hover:bg-primary/5 active:scale-95 transition-all" asChild>
                          <Link href="/dashboard/support">Hub Support</Link>
                      </Button>
                  </div>
              </div>
          </Card>
        </MotionWrapper>

        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
              <section>
                  <SectionHeader icon={TrendingUp} sector="Sector: Community">Live Transmission Stream</SectionHeader>
                  
                  <div className="space-y-5">
                      {postsLoading ? (
                          <div className="space-y-4">
                              {[...Array(3)].map((_, i) => (
                                  <Card key={i} className="h-24 animate-pulse border-primary/5 rounded-2xl bg-muted/20" />
                              ))}
                          </div>
                      ) : latestPosts.length === 0 ? (
                          <Card className="py-16 text-center glass rounded-[2rem] border-dashed border-2 border-primary/10 opacity-40">
                              <p className="font-black uppercase tracking-[0.2em] text-[9px]">Registry Empty // No active transmissions</p>
                          </Card>
                      ) : (
                          <div className="space-y-5">
                              {latestPosts.map((post) => (
                                  <PostCard key={post.id} post={post} userProfile={userProfile} />
                              ))}
                          </div>
                      )}
                  </div>
              </section>
          </div>

          <div className="lg:col-span-4 space-y-8">
              <section>
                  <SectionHeader icon={Sparkles} sector="Status: Optimized">System Node Matrix</SectionHeader>
                  <div className="grid grid-cols-2 gap-3">
                      {aiFeatures.map((f) => (
                        <Link key={f.href} href={f.href} className="block group">
                            <Card className="h-full glass p-3.5 sm:p-4 rounded-[1.25rem] border-primary/5 group-hover:border-primary/20 transition-all text-left relative overflow-hidden flex flex-col justify-between min-h-[110px]">
                                <div className="absolute top-0 right-0 p-2 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                                    <f.icon className="h-6 w-6" />
                                </div>
                                <div>
                                    <div className={cn("p-2 rounded-lg w-fit mb-2.5 transition-transform group-hover:scale-110", f.bg, f.color)}>
                                        <f.icon className="h-3.5 w-3.5" />
                                    </div>
                                    <h3 className="font-black text-[10px] uppercase tracking-[0.12em] text-foreground leading-none">{f.title}</h3>
                                    <p className="text-[9px] text-muted-foreground font-medium mt-1 leading-tight opacity-70 line-clamp-1">{f.desc}</p>
                                </div>
                                <div className="mt-2.5 pt-2 border-t border-primary/5">
                                    <span className="text-[7px] font-black uppercase tracking-widest text-primary/40">{f.sector}</span>
                                </div>
                            </Card>
                        </Link>
                      ))}
                  </div>
              </section>

              <section>
                  <SectionHeader icon={Library} sector="Status: Ready">Statutory Registry</SectionHeader>
                  <div className="space-y-2.5">
                      {[
                        { href: "/dashboard/learn", icon: Library, title: "Knowledge Hub", label: "NODE-LERN" },
                        { href: "/dashboard/my-cases", icon: Landmark, title: "Case Tracker", label: "NODE-CASE" },
                      ].map((item) => (
                        <Link key={item.href} href={item.href} className="block group">
                            <Card className="glass p-3.5 rounded-xl border-primary/5 group-hover:bg-primary/5 group-hover:border-primary/20 transition-all flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-1.5 rounded-lg bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                        <item.icon className="h-3.5 w-3.5" />
                                    </div>
                                    <span className="font-black text-[9px] uppercase tracking-[0.2em]">{item.title}</span>
                                </div>
                                <span className="text-[7px] font-mono font-bold text-muted-foreground opacity-40">{item.label}</span>
                            </Card>
                        </Link>
                      ))}
                  </div>
              </section>
          </div>
        </div>

        <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-center gap-4">
            <Link href="/dashboard/research-analytics/new">
                <motion.button
                    animate={{
                        y: [0, -8, 0],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative group h-14 w-14 bg-primary text-white rounded-2xl shadow-2xl flex items-center justify-center transition-all overflow-hidden"
                >
                    <motion.div 
                        animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.1, 0.2] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="absolute inset-0 bg-primary rounded-2xl"
                    />
                    <Bot className="h-7 w-7 relative z-10" />
                    
                    <div className="absolute top-1.5 right-1.5 bg-accent text-accent-foreground rounded-full p-0.5 shadow-xl z-20 border-2 border-primary group-hover:scale-110 transition-transform">
                        <Plus className="h-2.5 w-2.5 font-black" />
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </motion.button>
            </Link>
            
            <div className="absolute -top-8 right-0 bg-background border border-primary/20 px-2 py-1 rounded-lg shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <span className="text-[8px] font-black uppercase tracking-widest text-primary">Neural Assistant Active</span>
            </div>
        </div>

        <div className="pt-10 text-center border-t border-primary/5 opacity-30">
            <p className="text-[7px] font-black uppercase tracking-[0.6em] text-muted-foreground">NYAYASAHAYAK.IN // TERMINAL ACTIVE // PROTOCOL ALPHA-4</p>
        </div>
    </div>
  );
}
