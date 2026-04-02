
"use client";

import { useEffect, useState, use, useRef } from "react";
import { useFirestore, useAuth } from "@/firebase";
import { doc, onSnapshot, collection, query, where, getDocs, Timestamp, deleteDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  ArrowLeft, 
  ShieldCheck, 
  Loader2, 
  User, 
  Cpu, 
  Globe, 
  Star, 
  Trophy, 
  Zap, 
  Activity, 
  BadgeCheck, 
  Gavel, 
  FileText,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  ChevronDown,
  ArrowRight,
  Trash2,
  Twitter,
  MoreVertical,
  Flag,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ADMIN_EMAILS = [
  'enterspaceindia@gmail.com', 
  'piyushkumrsingh23399@gmail.com',
  'nyayasahayakhelp@gmail.com'
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 15 }
  },
};

const badgeVariants = {
  hover: { scale: 1.05, rotate: 1, transition: { duration: 0.3 } }
};

interface Achievement {
    title: string;
    description: string;
    icon: any;
    color: string;
    bg: string;
}

const achievements: Achievement[] = [
    { title: "Voice of Justice", description: "Voted in 10+ community legal polls.", icon: Gavel, color: "text-amber-600", bg: "from-amber-500/20 to-amber-500/5" },
    { title: "Statutory Auditor", description: "Analyzed 5+ documents with AI node.", icon: FileText, color: "text-blue-600", bg: "from-blue-500/20 to-blue-500/5" },
    { title: "Legal Researcher", description: "Shared 5 insightful community ideas.", icon: Zap, color: "text-purple-600", bg: "from-purple-500/20 to-purple-500/5" },
    { title: "Verified Citizen", description: "Passed 100% forensic identity audit.", icon: ShieldCheck, color: "text-green-600", bg: "from-green-500/20 to-green-500/5" },
];

interface Post {
    id: string;
    authorUid: string;
    authorName: string;
    authorAvatar?: string;
    createdAt: Timestamp;
    title: string;
    content: string;
    likes: number;
    comments: number;
    postType?: string;
}

export default function UserPublicProfilePage(props: { 
  params: Promise<{ uid: string }>,
  searchParams: Promise<any>
}) {
  const { uid } = use(props.params);
  // Unwrap searchParams just in case, to maintain Next.js 15 consistency
  use(props.searchParams);

  const firestore = useFirestore();
  const auth = useAuth();
  const { toast } = useToast();
  const postsSectionRef = useRef<HTMLDivElement>(null);
  
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ posts: 0, likes: 0, impact: 0 });
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [showPosts, setShowPosts] = useState(false);
  const [postsLoading, setPostsLoading] = useState(false);

  useEffect(() => {
    if (!uid) return;

    const userRef = doc(firestore, "users", uid);
    const unsubscribe = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        setProfile({ ...docSnap.data(), uid: docSnap.id });
      }
      setLoading(false);
    });

    const postsRef = collection(firestore, "posts");
    const q = query(postsRef, where("authorUid", "==", uid));
    getDocs(q).then(snap => {
        let totalLikes = 0;
        snap.docs.forEach(d => {
            const data = d.data();
            totalLikes += (data.likes || 0);
        });
        setStats({
            posts: snap.size,
            likes: totalLikes,
            impact: (snap.size * 5) + (totalLikes * 2)
        });
    }).catch(() => {});

    return () => unsubscribe();
  }, [uid, firestore]);

  const fetchUserPosts = async () => {
      if (userPosts.length > 0 || postsLoading) {
          setShowPosts(!showPosts);
          if (!showPosts) setTimeout(() => postsSectionRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
          return;
      }

      setPostsLoading(true);
      setShowPosts(true);
      try {
          const postsRef = collection(firestore, "posts");
          const q = query(postsRef, where("authorUid", "==", uid));
          const snap = await getDocs(q);
          const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as Post));
          
          list.sort((a, b) => {
              const dateA = a.createdAt?.toMillis ? a.createdAt.toMillis() : Number(a.createdAt || 0);
              const dateB = b.createdAt?.toMillis ? b.createdAt.toMillis() : Number(b.createdAt || 0);
              return dateB - dateA;
          });

          setUserPosts(list);
          setTimeout(() => postsSectionRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
      } catch (error) {
          console.error("Failed to fetch user transmissions:", error);
      } finally {
          setPostsLoading(false);
      }
  };

  const handleDeletePost = async (postId: string) => {
      if (!confirm("Confirm Transmission Purge: This action will permanently erase the node from the community registry.")) return;
      
      try {
          await deleteDoc(doc(firestore, "posts", postId));
          setUserPosts(prev => prev.filter(p => p.id !== postId));
          setStats(prev => ({ ...prev, posts: Math.max(0, prev.posts - 1) }));
          toast({ title: "Transmission Purged", description: "The node has been erased from the official registry." });
      } catch (error) {
          console.error("Delete failed:", error);
          toast({ variant: "destructive", title: "Action Refused", description: "Registry permissions insufficient for this operation." });
      }
  };

  const handleReport = () => {
      toast({
          title: "Report Node",
          description: "Institutional audit initiated for forensic compliance.",
      });
  };

  const handleShare = (post: Post, platform: 'whatsapp' | 'twitter' | 'copy') => {
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

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="relative">
            <Loader2 className="h-12 w-12 animate-spin text-primary opacity-20" />
            <div className="absolute inset-0 flex items-center justify-center">
                <ShieldCheck className="h-5 w-5 text-primary/40 animate-pulse" />
            </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col h-[70vh] items-center justify-center gap-6">
        <div className="p-8 rounded-full bg-muted/20 border-2 border-dashed">
            <User className="h-16 w-16 text-muted-foreground opacity-20" />
        </div>
        <div className="text-center space-y-2">
            <h2 className="text-2xl font-black font-headline tracking-tighter uppercase">Registry Record Not Found</h2>
            <p className="text-sm text-muted-foreground max-w-xs">The requested identity has been purged or never existed in the official database.</p>
        </div>
        <Button variant="outline" asChild className="rounded-xl font-bold h-11 px-8">
          <Link href="/dashboard/research-analytics">Return to Hub</Link>
        </Button>
      </div>
    );
  }

  const currentUser = auth.currentUser;
  const isUserAdmin = currentUser?.email && (ADMIN_EMAILS.includes(currentUser.email.toLowerCase()));

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-6xl mx-auto space-y-10 pb-20 px-2 sm:px-0 text-left"
    >
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <Button variant="ghost" size="sm" className="rounded-xl font-bold hover:bg-primary/5 group h-10" asChild>
          <Link href="/dashboard/research-analytics">
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" /> back to stream
          </Link>
        </Button>
        <div className="flex items-center gap-2">
            <Badge variant="outline" className="h-8 border-primary/10 font-bold bg-background shadow-sm px-4 rounded-lg text-10 uppercase tracking-widest text-muted-foreground">
                registry synced // active terminal
            </Badge>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="relative rounded-[2.5rem] overflow-hidden border-none shadow-2xl bg-card">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-white/5 to-accent/10 dark:from-primary/10 dark:via-black/5 dark:to-accent/5 -z-10"></div>
          <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
              <Logo className="h-64 w-64 border-none p-0 bg-transparent shadow-none" />
          </div>
          <div className="p-8 sm:p-12 flex flex-col sm:flex-row items-center sm:items-start gap-8 relative z-10">
              <div className="relative group">
                  <div className="absolute -inset-4 rounded-full bg-primary/10 animate-pulse group-hover:scale-110 transition-transform"></div>
                  <Avatar className="h-32 w-32 sm:h-40 sm:w-40 border-4 border-background shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[2rem] sm:rounded-[2.5rem] relative z-10 transition-all group-hover:rotate-2">
                      {profile.photoURL ? (
                          <AvatarImage src={profile.photoURL} alt={profile.firstName} className="object-cover" />
                      ) : (
                          <AvatarFallback className="text-4xl font-black bg-primary/5 text-primary">
                              {profile.firstName?.charAt(0)}{profile.lastName?.charAt(0)}
                          </AvatarFallback>
                      )}
                  </Avatar>
                  <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-2 rounded-2xl border-4 border-background shadow-xl z-20">
                      <ShieldCheck className="h-5 w-5" />
                  </div>
              </div>

              <div className="flex-1 text-center sm:text-left space-y-4">
                  <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                          <h1 className="text-3xl sm:text-5xl font-black font-headline tracking-tighter leading-none text-foreground">
                              {profile.firstName} {profile.lastName}
                          </h1>
                          <BadgeCheck className="h-6 w-6 text-blue-500" />
                      </div>
                      <p className="text-lg sm:text-xl text-primary font-bold tracking-tight flex items-center justify-center sm:justify-start gap-2">
                          <Zap className="h-4 w-4 animate-pulse" />
                          official {profile.userType?.toUpperCase()}
                      </p>
                  </div>
                  
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
                      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-background/50 border border-primary/10 shadow-sm">
                          <Activity className="h-3.5 w-3.5 text-primary" />
                          <span className="text-10 font-black uppercase tracking-widest text-foreground/70">registry synchronized</span>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-background/50 border border-primary/10 shadow-sm">
                          <Globe className="h-3.5 w-3.5 text-blue-500" />
                          <span className="text-10 font-black uppercase tracking-widest text-foreground/70">registry status: active</span>
                      </div>
                  </div>
              </div>
          </div>
          <div className="h-1.5 w-full bg-gradient-to-r from-primary via-accent to-blue-400"></div>
      </motion.div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-8">
              <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
                  {[
                      { 
                          label: "Registry posts", 
                          value: stats.posts, 
                          icon: FileText, 
                          color: "text-blue-500", 
                          bg: "bg-blue-500/10",
                          onClick: fetchUserPosts,
                          isClickable: true
                      },
                      { label: "Community likes", value: stats.likes, icon: Heart, color: "text-red-500", bg: "bg-red-500/10" }
                  ].map((stat, i) => (
                      <Card 
                        key={i} 
                        className={cn(
                            "glass p-4 rounded-2xl text-center space-y-2 border-primary/5 transition-all group",
                            stat.isClickable ? "cursor-pointer hover:border-primary/30 hover:bg-primary/5 active:scale-95" : "cursor-default"
                        )}
                        onClick={stat.onClick}
                      >
                          <div className={cn("p-2 rounded-lg w-fit mx-auto transition-transform group-hover:scale-110", stat.bg, stat.color)}>
                              <stat.icon className="h-4 w-4" />
                          </div>
                          <div className="space-y-0.5">
                              <p className="text-xl font-black tracking-tight">{stat.value}</p>
                              <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground opacity-60 leading-none">{stat.label}</p>
                          </div>
                          {stat.isClickable && (
                              <div className="mt-1 flex items-center justify-center">
                                  <ChevronDown className={cn("h-3 w-3 text-primary transition-transform", showPosts && i === 0 ? "rotate-180" : "")} />
                              </div>
                          )}
                      </Card>
                  ))}
              </motion.div>

              <motion.div variants={itemVariants}>
                  <Card className="glass border-primary/5 rounded-[2rem] overflow-hidden shadow-xl">
                      <CardHeader className="bg-primary/5 border-b border-primary/5 p-6 text-left">
                          <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                              <Cpu className="h-4 w-4 text-primary" /> Technical specifications
                          </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6 space-y-4">
                          <div className="flex justify-between items-center py-2">
                              <span className="text-10 font-bold text-muted-foreground uppercase tracking-widest">Network access</span>
                              <span className="flex items-center gap-1.5 text-green-600 text-10 font-black uppercase">
                                  <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-ping"></div>
                                  High performance
                              </span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-t border-primary/5">
                              <span className="text-10 font-bold text-muted-foreground uppercase tracking-widest">Registry status</span>
                              <span className="text-10 font-bold uppercase text-primary">Active member</span>
                          </div>
                      </CardContent>
                  </Card>
              </motion.div>
          </div>

          <div className="lg:col-span-7 space-y-8">
              <motion.div variants={itemVariants}>
                  <Card className="glass border-primary/5 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
                      <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                          <Trophy className="h-40 w-40" />
                      </div>
                      <CardHeader className="p-8 sm:p-10 pb-0 border-none text-left">
                          <div className="flex items-center gap-3 text-primary mb-2">
                              <Globe className="h-4 w-4" />
                              <span className="text-10 font-black uppercase tracking-[0.3em]">Forensic dossier</span>
                          </div>
                          <CardTitle className="text-2xl sm:text-3xl font-black tracking-tighter">Bio & registry profile</CardTitle>
                      </CardHeader>
                      <CardContent className="p-8 sm:p-10 space-y-10">
                          <div className="p-6 rounded-3xl bg-muted/20 border border-primary/5 text-sm font-medium leading-relaxed text-foreground/80 italic shadow-inner text-left">
                              "Identity synchronizing... This user is an active participant in the nyayasahayak.in legal ecosystem, contributing to statutory discussions and community legal awareness."
                          </div>

                          <div className="space-y-6">
                              <div className="flex items-center justify-between border-b border-primary/5 pb-2">
                                  <h3 className="text-10 font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                                      <Star className="h-3.5 w-3.5" /> institutional badges
                                  </h3>
                                  <span className="text-[9px] font-bold text-muted-foreground uppercase">earned protocols</span>
                              </div>
                              
                              <div className="grid sm:grid-cols-2 gap-4">
                                  {achievements.map((badge, i) => (
                                      <motion.div 
                                          key={i} 
                                          variants={badgeVariants} 
                                          whileHover="hover"
                                          className={cn(
                                              "p-5 rounded-2xl border border-primary/5 bg-gradient-to-br flex items-center gap-4 transition-all shadow-sm",
                                              badge.bg
                                          )}
                                      >
                                          <div className={cn("p-3 rounded-xl bg-background shadow-lg", badge.color)}>
                                              <badge.icon className="h-5 w-5" />
                                          </div>
                                          <div className="flex-1 text-left">
                                              <p className="font-black text-xs tracking-tight text-foreground">{badge.title}</p>
                                              <p className="text-[9px] font-medium text-muted-foreground leading-tight mt-0.5">{badge.description}</p>
                                          </div>
                                      </motion.div>
                                  ))}
                              </div>
                          </div>
                      </CardContent>
                  </Card>
              </motion.div>
          </div>
      </div>

      <AnimatePresence>
          {showPosts && (
              <motion.div 
                ref={postsSectionRef}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 40 }}
                className="space-y-8 pt-8"
              >
                  <div className="flex items-center justify-between border-b border-primary/10 pb-4">
                      <div className="space-y-1">
                          <h2 className="text-2xl font-black font-headline tracking-tighter">Transmission registry</h2>
                          <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Publicly audited community contributions</p>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => setShowPosts(false)} className="rounded-xl hover:bg-destructive/10 hover:text-destructive">
                          <ChevronDown className="h-6 w-6 rotate-180" />
                      </Button>
                  </div>

                  {postsLoading ? (
                      <div className="flex flex-col items-center justify-center py-20 gap-4">
                          <Loader2 className="h-8 w-8 animate-spin text-primary opacity-20" />
                          <p className="text-10 font-black uppercase tracking-[0.3em] text-muted-foreground animate-pulse">Syncing Registry...</p>
                      </div>
                  ) : userPosts.length === 0 ? (
                      <Card className="border-dashed border-2 bg-transparent py-20 rounded-[2.5rem]">
                          <CardContent className="flex flex-col items-center justify-center text-center gap-4 opacity-40">
                              <FileText className="h-12 w-12" />
                              <div className="space-y-1">
                                  <p className="font-black text-xl tracking-tighter">Empty transmission log</p>
                                  <p className="text-xs font-medium italic">"No institutional ideas have been initialized by this node."</p>
                              </div>
                          </CardContent>
                      </Card>
                  ) : (
                      <div className="grid gap-6">
                          {userPosts.map((post, idx) => {
                              const isAuthor = post.authorUid === currentUser?.uid;
                              
                              return (
                                <motion.div 
                                    key={post.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                >
                                    <Card className="glass border-primary/10 hover:border-primary/30 transition-all rounded-[2rem] overflow-hidden group relative">
                                        <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-gradient-to-b from-primary via-accent to-blue-500"></div>
                                        
                                        <CardContent className="p-6 sm:p-8 ml-1.5 text-left">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="space-y-1">
                                                    <h3 className="text-lg sm:text-xl font-black tracking-tight group-hover:text-primary transition-colors">{post.title}</h3>
                                                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                                                        transmission // {post.createdAt ? formatDistanceToNow(post.createdAt.toDate(), { addSuffix: true }) : 'Processing...'}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Badge className="bg-primary/10 text-primary border-primary/10 text-[8px] font-black uppercase tracking-widest">
                                                        {post.postType || 'Idea'}
                                                    </Badge>
                                                    
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:bg-primary/5">
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-48 p-2 rounded-xl shadow-2xl glass border-primary/10">
                                                            {(isAuthor || isUserAdmin) ? (
                                                                <DropdownMenuItem onSelect={() => handleDeletePost(post.id)} className="rounded-lg font-bold text-10 h-9 px-3 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10 gap-2.5">
                                                                    <Trash2 className="h-3.5 w-3.5" /> 
                                                                    <span>{isUserAdmin && !isAuthor ? 'Admin Purge' : 'purge record'}</span>
                                                                </DropdownMenuItem>
                                                            ) : (
                                                                <DropdownMenuItem onSelect={handleReport} className="rounded-lg font-bold text-10 h-9 px-3 cursor-pointer gap-2.5 hover:bg-red-500/5 hover:text-red-500">
                                                                    <Flag className="h-3.5 w-3.5" /> 
                                                                    <span>report breach</span>
                                                                </DropdownMenuItem>
                                                            )}
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </div>
                                            <p className="text-sm text-muted-foreground font-medium leading-relaxed line-clamp-3 mb-6">
                                                {post.content}
                                            </p>
                                            <div className="flex items-center justify-between pt-6 border-t border-primary/5">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex items-center gap-1.5 text-red-500/60 text-10 font-black">
                                                        <Heart className="h-3.5 w-3.5 fill-current" />
                                                        {post.likes}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:bg-primary/5 hover:text-primary transition-all">
                                                                <Share2 className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-48 rounded-xl p-2 shadow-2xl glass border-primary/5">
                                                            <DropdownMenuItem onClick={() => handleShare(post, 'whatsapp')} className="rounded-lg font-bold text-xs h-10 px-3 cursor-pointer gap-3 text-left">
                                                                <div className="bg-green-500/10 p-1.5 rounded-md text-green-600">
                                                                    <MessageCircle className="h-3.5 w-3.5" />
                                                                </div>
                                                                WhatsApp
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleShare(post, 'twitter')} className="rounded-lg font-bold text-xs h-10 px-3 cursor-pointer gap-3 text-left">
                                                                <div className="bg-blue-500/10 p-1.5 rounded-md text-blue-500">
                                                                    <Twitter className="h-3.5 w-3.5" />
                                                                </div>
                                                                Twitter (X)
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleShare(post, 'copy')} className="rounded-lg font-bold text-xs h-10 px-3 cursor-pointer gap-3 text-left">
                                                                <div className="bg-primary/10 p-1.5 rounded-md text-primary">
                                                                    <Bookmark className="h-3.5 w-3.5" />
                                                                </div>
                                                                copy registry link
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                    <Button variant="ghost" size="sm" className="h-8 rounded-lg font-black text-[9px] uppercase tracking-widest gap-2 hover:bg-primary hover:text-white transition-all">
                                                        inspect <ArrowRight className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                              );
                          })}
                      </div>
                  )}
              </motion.div>
          )}
      </AnimatePresence>

      <div className="text-center pt-12 opacity-30">
          <p className="text-[8px] font-black uppercase tracking-[0.6em] text-muted-foreground">NYAYASAHAYAK.IN // THE FUTURE OF JUSTICE IS NEURAL</p>
      </div>
    </motion.div>
  );
}
