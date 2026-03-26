"use client";

import { useEffect, useState, use } from "react";
import { useFirestore } from "@/firebase";
import { doc, onSnapshot, collection, query, where, getDocs } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  ArrowLeft, 
  Mail, 
  ShieldCheck, 
  Loader2, 
  User, 
  Cpu, 
  Fingerprint, 
  Globe, 
  MessageSquare, 
  Star, 
  Trophy, 
  Zap, 
  Activity, 
  BadgeCheck, 
  Gavel, 
  FileText,
  Heart,
  Users
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DigitalIDCard } from "../page";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";
import { Label } from "@/components/ui/label";

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

export default function UserPublicProfilePage({ params }: { params: Promise<{ uid: string }> }) {
  const unwrappedParams = use(params);
  const uid = unwrappedParams.uid;
  const firestore = useFirestore();
  
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ posts: 0, likes: 0, impact: 0 });

  useEffect(() => {
    if (!uid) return;

    const userRef = doc(firestore, "users", uid);
    const unsubscribe = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        setProfile({ ...docSnap.data(), uid: docSnap.id });
      }
      setLoading(false);
    });

    // Fetch basic stats for the profile
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
            <h2 className="text-2xl font-black font-headline tracking-tighter uppercase">Registry Node Not Found</h2>
            <p className="text-sm text-muted-foreground max-w-xs">The requested identity has been purged or never existed in the official database.</p>
        </div>
        <Button variant="outline" asChild className="rounded-xl font-bold h-11 px-8">
          <Link href="/dashboard/research-analytics">Return to Hub</Link>
        </Button>
      </div>
    );
  }

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
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" /> Hub Registry
          </Link>
        </Button>
        <div className="flex items-center gap-2">
            <Badge variant="outline" className="h-8 border-primary/10 font-bold bg-background shadow-sm px-4 rounded-lg text-[10px] uppercase tracking-widest text-muted-foreground">
                Node Synced // Active Terminal
            </Badge>
        </div>
      </motion.div>

      {/* Hero Header */}
      <motion.div variants={itemVariants} className="relative rounded-[2.5rem] overflow-hidden border-none shadow-2xl bg-card">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5 -z-10"></div>
          <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none">
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
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                          <h1 className="text-3xl sm:text-5xl font-black font-headline tracking-tighter leading-none">
                              {profile.firstName} {profile.lastName}
                          </h1>
                          <BadgeCheck className="h-6 w-6 text-blue-500" />
                      </div>
                      <p className="text-lg sm:text-xl text-primary font-bold tracking-tight flex items-center justify-center sm:justify-start gap-2">
                          <Zap className="h-4 w-4 animate-pulse" />
                          Official {profile.userType?.toUpperCase()} Node
                      </p>
                  </div>
                  
                  <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                      <Button className="h-12 px-8 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20 active:scale-95 transition-all">
                          <Users className="mr-2 h-4 w-4" /> Connect Node
                      </Button>
                      <Button variant="outline" className="h-12 px-8 rounded-2xl font-black uppercase tracking-widest text-[10px] glass hover:bg-primary/5 active:scale-95 transition-all">
                          <MessageSquare className="mr-2 h-4 w-4" /> Direct Transmission
                      </Button>
                  </div>
              </div>
          </div>
          <div className="h-1.5 w-full bg-gradient-to-r from-primary via-accent to-blue-400"></div>
      </motion.div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left Column */}
          <div className="lg:col-span-5 space-y-8">
              <motion.div variants={itemVariants} className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground flex items-center gap-2">
                        <Fingerprint className="h-3 w-3" /> Identity Matrix
                    </Label>
                    <span className="text-[9px] font-bold text-primary/40">SECURE-BLOCK-ALPHA</span>
                  </div>
                  <DigitalIDCard user={profile} photoURL={profile.photoURL || ""} />
              </motion.div>

              <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4">
                  {[
                      { label: "Registry Posts", value: stats.posts, icon: FileText, color: "text-blue-500", bg: "bg-blue-500/10" },
                      { label: "Community Likes", value: stats.likes, icon: Heart, color: "text-red-500", bg: "bg-red-500/10" },
                      { label: "Node Impact", value: stats.impact, icon: Activity, color: "text-amber-500", bg: "bg-amber-500/10" }
                  ].map((stat, i) => (
                      <Card key={i} className="glass p-4 rounded-2xl text-center space-y-2 border-primary/5 hover:border-primary/20 transition-all cursor-default group">
                          <div className={cn("p-2 rounded-lg w-fit mx-auto transition-transform group-hover:scale-110", stat.bg, stat.color)}>
                              <stat.icon className="h-4 w-4" />
                          </div>
                          <div className="space-y-0.5">
                              <p className="text-xl font-black tracking-tight">{stat.value}</p>
                              <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground opacity-60 leading-none">{stat.label}</p>
                          </div>
                      </Card>
                  ))}
              </motion.div>

              <motion.div variants={itemVariants}>
                  <Card className="glass border-primary/5 rounded-[2rem] overflow-hidden shadow-xl">
                      <CardHeader className="bg-primary/5 border-b border-primary/5 p-6">
                          <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                              <Cpu className="h-4 w-4 text-primary" /> Technical Specifications
                          </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6 space-y-4">
                          <div className="flex justify-between items-center py-2 border-b border-primary/5">
                              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Registry ID</span>
                              <span className="text-[9px] font-mono font-bold text-primary bg-primary/5 px-2 py-1 rounded">NS-NODE-{uid.substring(0,8).toUpperCase()}</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-primary/5">
                              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Network Access</span>
                              <span className="flex items-center gap-1.5 text-green-600 text-[10px] font-black uppercase">
                                  <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-ping"></div>
                                  High Performance
                              </span>
                          </div>
                          <div className="flex justify-between items-center py-2">
                              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Registry Status</span>
                              <span className="text-[10px] font-bold uppercase text-primary">Active Member</span>
                          </div>
                      </CardContent>
                  </Card>
              </motion.div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-7 space-y-8">
              <motion.div variants={itemVariants}>
                  <Card className="glass border-primary/5 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
                      <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                          <Trophy className="h-40 w-40" />
                      </div>
                      <CardHeader className="p-8 sm:p-10 pb-0 border-none">
                          <div className="flex items-center gap-3 text-primary mb-2">
                              <Globe className="h-4 w-4" />
                              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Forensic Dossier</span>
                          </div>
                          <CardTitle className="text-2xl sm:text-3xl font-black tracking-tighter">Bio & Registry Profile</CardTitle>
                      </CardHeader>
                      <CardContent className="p-8 sm:p-10 space-y-10">
                          <div className="p-6 rounded-3xl bg-muted/20 border border-primary/5 text-sm font-medium leading-relaxed text-foreground/80 italic shadow-inner">
                              "Identity synchronizing... This user is an active participant in the nyayasahayak.in legal ecosystem, contributing to statutory discussions and community legal awareness."
                          </div>

                          <div className="space-y-6">
                              <div className="flex items-center justify-between border-b border-primary/5 pb-2">
                                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                                      <Star className="h-3.5 w-3.5" /> Institutional Badges
                                  </h3>
                                  <span className="text-[9px] font-bold text-muted-foreground uppercase">Earned Protocols</span>
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

                          <div className="pt-6 border-t border-primary/5 flex flex-col sm:flex-row items-center justify-between gap-6">
                              <div className="space-y-1 text-left">
                                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-40">Identity Authenticator</p>
                                  <p className="text-xs font-bold text-primary">NS-SECURE-NODE-001</p>
                              </div>
                              <Button variant="ghost" className="rounded-xl h-10 px-6 font-bold text-[10px] uppercase tracking-widest text-primary hover:bg-primary/5">
                                  Request Forensic Verification
                              </Button>
                          </div>
                      </CardContent>
                  </Card>
              </motion.div>

              <motion.div variants={itemVariants} className="text-center pt-4 opacity-30">
                  <p className="text-[8px] font-black uppercase tracking-[0.6em] text-muted-foreground">NYAYASAHAYAK.IN // THE FUTURE OF JUSTICE IS NEURAL</p>
              </motion.div>
          </div>
      </div>
    </motion.div>
  );
}
