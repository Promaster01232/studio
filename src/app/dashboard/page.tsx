"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import React, { useState, useEffect, useRef, use } from "react";
import {
  Mic,
  Search,
  FileText,
  FileSignature,
  BrainCircuit,
  ArrowRight,
  Sparkles,
  Activity,
  Heart,
  Zap,
  BadgeCheck,
  Crown,
  ShieldCheck,
  Bot,
  Loader2,
  Newspaper,
  Layers,
  Clock,
  TrendingUp
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
  getDoc
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
import { Logo } from "@/components/logo";
import { useSoundEffect } from "@/hooks/use-sound-effect";

const ADMIN_EMAILS = [
  'enterspaceindia@gmail.com', 
  'piyushkumrsingh23399@gmail.com',
  'nyayasahayakhelp@gmail.com'
];

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
    postType?: string;
    poll?: any;
    isAnonymous?: boolean;
}

const MotionWrapper = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 15 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
      transition={{ delay, duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
};

function PostCard({ post, userProfile, isAdmin }: { post: Post, userProfile: any, isAdmin: boolean }) {
    const { toast } = useToast();
    const { playSound } = useSoundEffect();
    const firestore = useFirestore();
    const auth = useAuth();
    const { currentUser } = auth;
    
    const [isLiking, setIsLiking] = useState(false);
    const userHasLiked = post.likedBy?.includes(currentUser?.uid ?? '');

    const handleLike = () => {
        if (!currentUser || isLiking) return;
        setIsLiking(true);
        const postRef = doc(firestore, "posts", post.id);
        
        updateDoc(postRef, {
            likes: increment(userHasLiked ? -1 : 1),
            likedBy: userHasLiked ? arrayRemove(currentUser.uid) : arrayUnion(currentUser.uid)
        }).then(() => {
            playSound(userHasLiked ? 'click' : 'success');
        }).finally(() => setIsLiking(false));
    };

    return (
        <Card className="overflow-hidden glass border-primary/10 transition-all rounded-[1.5rem] shadow-sm hover:shadow-xl text-left">
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 rounded-lg">
                            <AvatarImage src={post.authorAvatar} />
                            <AvatarFallback className="font-black bg-primary/5 text-primary text-[10px]">{post.authorName?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-black text-xs tracking-tight">{post.isAnonymous ? 'Anonymous' : post.authorName}</p>
                            <p className="text-[9px] font-bold text-muted-foreground opacity-60">
                                {post.createdAt ? formatDistanceToNow(post.createdAt.toDate(), { addSuffix: true }) : 'Syncing...'}
                            </p>
                        </div>
                    </div>
                    <Badge variant="outline" className="font-black text-[8px] uppercase px-2 py-0.5 rounded-full border-primary/20 text-primary">
                        {post.postType || 'Transmission'}
                    </Badge>
                </div>
                <h3 className="font-black text-lg tracking-tight mb-2 leading-tight">{post.title}</h3>
                <p className="text-sm text-muted-foreground font-medium leading-relaxed mb-6 line-clamp-3">{post.content}</p>
                <div className="flex items-center justify-between pt-4 border-t border-primary/5">
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className={cn("h-8 px-3 rounded-lg text-[10px] font-black uppercase gap-2", userHasLiked ? "text-primary bg-primary/5" : "text-muted-foreground")}
                        onClick={handleLike}
                        disabled={isLiking}
                    >
                        <Heart className={cn("h-3.5 w-3.5", userHasLiked && "fill-current")} />
                        <span>{post.likes}</span>
                    </Button>
                    <div className="flex items-center gap-2 text-[8px] font-black uppercase opacity-40">
                        <Clock className="h-3 w-3" />
                        <span>Transience Node</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

const aiFeatures = [
    { href: "/dashboard/strength-analyzer", icon: BrainCircuit, title: "Analyzer", desc: "Forensic assessment." },
    { href: "/dashboard/document-intelligence", icon: Search, title: "Doc Intel", desc: "Statutory audit." },
    { href: "/dashboard/document-generator", icon: FileText, title: "Drafting", desc: "Legal petitions." },
    { href: "/dashboard/bond-generator", icon: FileSignature, title: "Bonds", desc: "Legal affidavits." },
];

export default function DashboardHomePage(props: { params: Promise<any>, searchParams: Promise<any> }) {
  use(props.params);
  use(props.searchParams);

  const [text, setText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const fullText = 'Sahayak';
  const { playSound } = useSoundEffect();
  
  const firestore = useFirestore();
  const auth = useAuth();
  const [latestPosts, setLatestPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
        if (user) {
            getDoc(doc(firestore, "users", user.uid)).then(d => d.exists() && setUserProfile(d.data()));
        }
        onSnapshot(query(collection(firestore, "posts"), orderBy("createdAt", "desc"), limit(5)), (snap) => {
            const list: Post[] = snap.docs.map(d => ({ id: d.id, ...d.data() } as Post));
            setLatestPosts(list);
            setPostsLoading(false);
        });
    });
    return () => unsubAuth();
  }, [auth, firestore]);
  
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isTyping) {
      if (text.length < fullText.length) {
        timeoutId = setTimeout(() => setText(fullText.slice(0, text.length + 1)), 100); 
      } else {
        timeoutId = setTimeout(() => setIsTyping(false), 2000);
      }
    } else {
      timeoutId = setTimeout(() => {
        setText('');
        setIsTyping(true);
      }, 1000);
    }
    return () => clearTimeout(timeoutId);
  }, [text, isTyping]);

  const isAdmin = userProfile?.email && ADMIN_EMAILS.includes(userProfile.email.toLowerCase());
  const isElite = isAdmin || userProfile?.subscriptionType?.includes('unlimited');

  return (
    <div className="flex flex-col h-full space-y-12 pb-20 max-w-6xl mx-auto text-left relative">
        <MotionWrapper>
          <Card className="relative p-8 sm:p-12 rounded-[2.5rem] overflow-hidden border-primary/10 bg-card/40 backdrop-blur-xl shadow-2xl">
              <div className="absolute top-0 right-0 p-10 opacity-[0.02] pointer-events-none">
                  <Logo className="h-64 w-64 grayscale" priority={true} />
              </div>
              <div className="relative z-10 space-y-8">
                  <div className="space-y-4">
                      <div className="flex items-center gap-3">
                          <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em]">
                              Registry Node Alpha // {isElite ? 'Elite Clearance' : 'Standard Ingress'}
                          </Badge>
                      </div>
                      <h1 className="text-4xl sm:text-6xl font-black font-headline tracking-tighter leading-none text-foreground">
                          Welcome, <br />
                          <span className="text-primary italic">Nyaya {text}</span>
                      </h1>
                  </div>
                  <p className="text-lg text-muted-foreground font-medium max-w-xl leading-relaxed">
                      Access precision AI nodes for statutory auditing and procedural navigation within Bharat&apos;s judicial ecosystem.
                  </p>
                  <div className="flex flex-wrap gap-4 pt-2">
                      <Button size="lg" className="rounded-2xl font-black uppercase tracking-widest text-xs h-14 px-10 shadow-xl" asChild>
                          <Link href="/dashboard/narrate">Initialize Narration</Link>
                      </Button>
                  </div>
              </div>
          </Card>
        </MotionWrapper>

        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-10">
              <section>
                  <div className="flex items-center justify-between mb-6 border-b border-primary/5 pb-4">
                      <div className="flex items-center gap-3">
                          <TrendingUp className="h-5 w-5 text-primary/40" />
                          <h2 className="text-[13px] font-black tracking-widest text-foreground/80 uppercase">Community Audits</h2>
                      </div>
                  </div>
                  <div className="space-y-6">
                      {postsLoading ? (
                          <div className="space-y-5">
                              {[...Array(2)].map((_, i) => (
                                  <Card key={i} className="h-32 animate-pulse border-primary/5 rounded-[1.5rem] bg-muted/20" />
                              ))}
                          </div>
                      ) : latestPosts.length === 0 ? (
                          <Card className="py-20 text-center glass rounded-[2rem] border-dashed border-2 border-primary/10 opacity-40">
                              <p className="font-bold text-sm tracking-tight lowercase">registry clear // awaiting transmissions</p>
                          </Card>
                      ) : (
                          <div className="space-y-6">
                              {latestPosts.map((post) => (
                                  <PostCard key={post.id} post={post} userProfile={userProfile} isAdmin={isAdmin || false} />
                              ))}
                          </div>
                      )}
                  </div>
              </section>
          </div>

          <div className="lg:col-span-4 space-y-10">
              <section>
                  <div className="flex items-center justify-between mb-6 border-b border-primary/5 pb-4">
                      <div className="flex items-center gap-3">
                          <Sparkles className="h-5 w-5 text-primary/40" />
                          <h2 className="text-[13px] font-black tracking-widest text-foreground/80 uppercase">Tool Matrix</h2>
                      </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                      {aiFeatures.map((f) => (
                        <Link key={f.href} href={f.href} className="block group" onMouseEnter={() => playSound('hover')}>
                            <Card className="h-full glass p-6 rounded-[1.5rem] border-primary/10 group-hover:border-primary/40 transition-all text-left relative overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-xl group-active:scale-95">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-xl bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                                        <f.icon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-sm tracking-tight text-foreground uppercase leading-none">{f.title}</h3>
                                        <p className="text-[10px] font-bold text-muted-foreground mt-1">{f.desc}</p>
                                    </div>
                                </div>
                            </Card>
                        </Link>
                      ))}
                  </div>
              </section>
          </div>
        </div>
    </div>
  );
}