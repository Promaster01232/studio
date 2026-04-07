"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
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
  ShieldCheck,
  Loader2,
  Clock,
  ChevronRight,
  Gavel,
  ShieldAlert,
  Cpu,
  Fingerprint,
  Layers,
  FileCheck,
  Globe,
  History,
  Lightbulb,
  Newspaper,
  MessageCircle,
  BadgeCheck,
  Plus,
  X,
  FileUp,
  MapPin,
  User,
  Smartphone,
  Calendar,
  AlertTriangle,
  ChevronDown,
  Lock,
  RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
  deleteDoc 
} from "firebase/firestore";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Logo } from "@/components/logo";
import { useSoundEffect } from "@/hooks/use-sound-effect";
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
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";

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
    postType?: 'Idea' | 'Question' | 'Suggestion' | 'Poll' | 'News';
    poll?: {
        options: { text: string; votes: number }[];
        voters?: string[];
    };
    isAnonymous?: boolean;
}

const aiFeatures = [
    { id: "strength", icon: BrainCircuit, title: "Case Strength", desc: "Litigation success probability.", href: "/dashboard/strength-analyzer", color: "text-blue-600", bg: "bg-blue-500/10" },
    { id: "intel", icon: Search, title: "Forensic Analysis", desc: "Scan documents for hidden risks.", href: "/dashboard/document-intelligence", color: "text-indigo-600", bg: "bg-indigo-500/10" },
    { id: "draft", icon: FileText, title: "Statutory Drafting", desc: "Generate professional legal notices.", href: "/dashboard/document-generator", color: "text-sky-600", bg: "bg-sky-500/10" },
    { id: "bond", icon: FileSignature, title: "Bond Protocol", desc: "Official bail and indemnity bonds.", href: "/dashboard/bond-generator", color: "text-cyan-600", bg: "bg-cyan-500/10" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100, damping: 15 } }
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

export default function DashboardHomePage() {
  const [text, setText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const fullText = 'Sahayak';
  const { playSound } = useSoundEffect();
  const { toast } = useToast();
  const router = useRouter();
  
  const firestore = useFirestore();
  const auth = useAuth();
  
  const [quickJargon, setQuickJargon] = useState("");
  const [isProcessingJargon, setIsProcessingJargon] = useState(false);
  const [jargonReport, setJargonReport] = useState<{ term: string, exp: string } | null>(null);
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);

  // Quick Action Dialog State
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isTyping) {
      if (text.length < fullText.length) {
        timeoutId = setTimeout(() => setText(fullText.slice(0, text.length + 1)), 150); 
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

  useEffect(() => {
    const postsCol = collection(firestore, "posts");
    const q = query(postsCol, orderBy("createdAt", "desc"), limit(3));
    
    const unsub = onSnapshot(q, (snap) => {
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as Post));
        setPosts(list);
        setPostsLoading(false);
    }, (err) => {
        console.warn("[DASHBOARD] Community node sync restricted.");
        setPostsLoading(false);
    });
    
    return () => unsub();
  }, [firestore]);

  const handleQuickAudit = () => {
      if (!quickJargon) return;
      setIsProcessingJargon(true);
      setJargonReport(null);
      playSound('scan');
      
      setTimeout(() => {
          setIsProcessingJargon(false);
          setJargonReport({
              term: quickJargon,
              exp: `Institutional Forensic Node identifies "${quickJargon}" as a statutory instrument or procedural protocol typically invoked during judicial audits. In layman terms, it refers to the mandatory navigational path for legal restitution.`
          });
          toast({
              title: "Forensic Node Sync",
              description: "Short report generated below.",
          });
      }, 1500);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setFileName(file.name);
  };

  const handleLaunchFullTool = () => {
      const tool = aiFeatures.find(f => f.id === selectedTool);
      if (tool) router.push(tool.href);
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex flex-col h-full space-y-12 pb-24 max-w-6xl mx-auto text-left relative pt-4"
    >
        {/* HERO SECTION - INSTITUTIONAL BLUE WITH MOTION */}
        <motion.div variants={cardVariants}>
          <Card className="relative overflow-hidden border-primary/5 bg-card shadow-2xl rounded-[3rem] group">
              <div className="p-8 sm:p-16 relative z-10 flex flex-col lg:flex-row items-center gap-12">
                  <div className="flex-1 space-y-10 text-center lg:text-left">
                      <div className="space-y-6">
                          <h1 className="text-5xl sm:text-7xl font-black tracking-tighter text-foreground leading-none">
                              NYAYA <span className="animate-pan italic">{text}</span>
                          </h1>
                          <p className="text-sm sm:text-xl text-muted-foreground font-medium max-w-xl leading-relaxed opacity-80">
                              Institutional AI Command Center. Mathematically precise forensic intelligence and statutory roadmaps for every citizen.
                          </p>
                      </div>

                      <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                          <Button size="xl" className="rounded-2xl font-black uppercase tracking-widest h-14 px-10 shadow-2xl shadow-primary/20 active:scale-95 transition-all text-[11px]" asChild>
                              <Link href="/dashboard/narrate">
                                  <Mic className="h-5 w-5 mr-3" /> Start Case Record
                              </Link>
                          </Button>
                          <Button variant="ghost" className="h-14 rounded-2xl px-8 font-black uppercase tracking-widest text-primary text-[11px] hover:bg-primary/5" asChild>
                              <Link href="/dashboard/learn">Knowledge Hub</Link>
                          </Button>
                      </div>
                  </div>

                  <div className="hidden lg:flex flex-col gap-4 w-80">
                      <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className="p-6 rounded-[2rem] bg-primary/5 border border-primary/10 shadow-sm flex items-center gap-5 group/sec"
                      >
                          <div className="p-3 rounded-xl bg-white dark:bg-black/20 border border-primary/10 group-hover/sec:scale-110 transition-transform">
                              <ShieldCheck className="h-5 w-5 text-primary" />
                          </div>
                          <div className="text-left">
                              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-primary/60">Encryption</p>
                              <p className="text-xs font-black uppercase">AES-256 Active</p>
                          </div>
                      </motion.div>
                      <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className="p-6 rounded-[2rem] bg-primary/5 border border-primary/10 shadow-sm flex items-center gap-5 group/sec"
                      >
                          <div className="p-3 rounded-xl bg-white dark:bg-black/20 border border-primary/10 group-hover/sec:scale-110 transition-transform">
                              <Activity className="h-5 w-5 text-primary animate-pulse" />
                          </div>
                          <div className="text-left">
                              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-primary/60">Neural Node</p>
                              <p className="text-xs font-black uppercase">Synchronized</p>
                          </div>
                      </motion.div>
                  </div>
              </div>
              <div className="h-1.5 w-full bg-gradient-to-r from-primary via-blue-400 to-primary opacity-20"></div>
          </Card>
        </motion.div>

        {/* NEURAL AGENDA COMMAND BAR - WITH PULSING WAVEFORM */}
        <motion.section 
            variants={cardVariants}
            className="w-full flex flex-col items-center py-12 space-y-10"
        >
            <div className="flex flex-col items-center gap-2">
                <h2 className="text-3xl sm:text-4xl font-black tracking-tighter text-foreground uppercase">
                    Neural <span className="text-primary font-medium italic lowercase">Agenda Hub</span>
                </h2>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10">
                    <Lock className="h-2.5 w-2.5 text-primary opacity-40" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-primary/60">End-to-End Encrypted Session</span>
                </div>
            </div>
            
            <div className="w-full max-w-3xl relative group">
                <div className="absolute -inset-1 bg-primary/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                
                <div className="relative flex items-center bg-white dark:bg-black border border-primary/20 rounded-full h-20 px-6 sm:px-8 shadow-2xl">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-12 w-12 sm:h-14 sm:w-14 rounded-full hover:bg-primary/5 text-primary/60 hover:text-primary transition-all active:scale-90">
                                <Plus className="h-6 w-6 sm:h-7 sm:w-7" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-72 p-3 rounded-[2rem] shadow-3xl glass border-primary/10 mb-6">
                            <DropdownMenuLabel className="px-4 pb-3 text-[10px] font-black uppercase tracking-[0.3em] text-primary/60">Initialize Protocol</DropdownMenuLabel>
                            {aiFeatures.map((f) => (
                                <DropdownMenuItem key={f.id} onClick={() => setSelectedTool(f.id)} className="rounded-xl h-14 px-4 cursor-pointer gap-4 focus:bg-primary/5 mb-1">
                                    <div className={cn("p-2.5 rounded-lg border border-primary/5", f.bg, f.color)}>
                                        <f.icon className="h-5 w-5" />
                                    </div>
                                    <span className="font-black text-xs uppercase tracking-widest">{f.title}</span>
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <div className="flex-1 px-6 text-left">
                        <Input 
                            placeholder="Initialize forensic query..." 
                            className="border-none bg-transparent shadow-none focus-visible:ring-0 text-lg sm:text-xl font-bold uppercase tracking-tight placeholder:text-primary/20 p-0 h-full"
                            value={quickJargon}
                            onChange={(e) => setQuickJargon(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleQuickAudit()}
                        />
                    </div>

                    <div className="flex items-center gap-4 sm:gap-6">
                        <Button variant="ghost" size="icon" className="h-12 w-12 sm:h-14 sm:w-14 rounded-full text-primary/60 hover:text-primary active:scale-90 transition-all">
                            <Mic className="h-6 w-6 sm:h-7 sm:w-7" />
                        </Button>
                        <Button className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-primary text-white flex items-center justify-center shadow-xl active:scale-95 transition-all group/wave" onClick={handleQuickAudit}>
                            <Search className="h-6 w-6" />
                        </Button>
                    </div>
                </div>
            </div>
        </motion.section>

        {/* QUICK ACTION DIALOG - BLUE ACCENTS */}
        <Dialog open={!!selectedTool} onOpenChange={(o) => { if(!o) setSelectedTool(null); }}>
            <DialogContent className="sm:max-w-xl rounded-[3rem] p-0 overflow-hidden border-none shadow-3xl bg-card text-left">
                <DialogHeader className="p-10 pb-6 border-b border-primary/5 text-left">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-2xl bg-primary/10 text-primary border border-primary/10">
                                {selectedTool === 'strength' && <BrainCircuit className="h-7 w-7" />}
                                {selectedTool === 'intel' && <Search className="h-7 w-7" />}
                                {selectedTool === 'draft' && <FileText className="h-7 w-7" />}
                                {selectedTool === 'bond' && <FileSignature className="h-7 w-7" />}
                            </div>
                            <DialogTitle className="text-3xl font-black tracking-tighter uppercase leading-none text-primary">
                                {aiFeatures.find(f => f.id === selectedTool)?.title}
                            </DialogTitle>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => setSelectedTool(null)} className="h-10 w-10 rounded-full hover:bg-muted">
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                    <DialogDescription className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">
                        Institutional Forensic Ingress Node NS-ALPHA-4.2
                    </DialogDescription>
                </DialogHeader>

                <div className="p-10 space-y-10 text-left">
                    {selectedTool === 'strength' && (
                        <div className="space-y-8">
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">Case Narrative Matrix</Label>
                                <Textarea placeholder="State facts, dates, and statutory points..." rows={6} className="bg-primary/5 border-primary/10 rounded-[1.5rem] font-bold text-sm p-6 shadow-inner focus:border-primary transition-all" />
                            </div>
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">Dialect Registry</Label>
                                <Select defaultValue="English">
                                    <SelectTrigger className="h-14 bg-primary/5 border-primary/10 font-black uppercase text-xs rounded-2xl"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-[1.5rem] glass">
                                        <SelectItem value="English" className="font-black uppercase text-[10px]">English Protocol</SelectItem>
                                        <SelectItem value="Hindi" className="font-black uppercase text-[10px]">Hindi Protocol</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}

                    {selectedTool === 'intel' && (
                        <div className="space-y-8">
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">Statutory Instrument</Label>
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-primary/5 rounded-[2rem] border-2 border-dashed border-primary/10 pointer-events-none"></div>
                                    <Input type="file" onChange={handleFileChange} className="h-40 opacity-0 cursor-pointer relative z-10" />
                                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 pointer-events-none">
                                        <div className="p-4 rounded-2xl bg-background border border-primary/5 group-hover:scale-110 transition-transform shadow-sm">
                                            <FileUp className="h-8 w-8 text-primary opacity-40" />
                                        </div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">
                                            {fileName || "Select Registry Node"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {selectedTool === 'draft' && (
                        <div className="grid sm:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">Instrument Type</Label>
                                <Select defaultValue="Notice">
                                    <SelectTrigger className="h-14 bg-primary/5 border-primary/10 font-black uppercase text-[10px] rounded-2xl"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-[1.5rem] glass">
                                        <SelectItem value="Notice" className="font-black uppercase text-[10px]">Legal Notice</SelectItem>
                                        <SelectItem value="Complaint" className="font-black uppercase text-[10px]">Police Complaint</SelectItem>
                                        <SelectItem value="FIR" className="font-black uppercase text-[10px]">FIR Application</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">Author Identity</Label>
                                <Input placeholder="Full Name" className="h-14 bg-primary/5 border-primary/10 font-black text-sm rounded-2xl px-6" />
                            </div>
                            <div className="sm:col-span-2 space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">Case Synopsis</Label>
                                <Textarea placeholder="Core facts for statutory drafting..." rows={4} className="bg-primary/5 border-primary/10 rounded-[1.5rem] font-bold text-sm p-6" />
                            </div>
                        </div>
                    )}

                    <div className="pt-8 border-t border-primary/5 flex flex-col sm:flex-row gap-4">
                        <Button variant="outline" className="flex-1 h-16 font-black uppercase tracking-widest text-[11px] rounded-2xl border-primary/10 hover:bg-primary/5" onClick={() => setSelectedTool(null)}>
                            Abort Protocol
                        </Button>
                        <Button className="flex-1 h-16 font-black uppercase tracking-[0.3em] text-[11px] rounded-2xl shadow-2xl shadow-primary/20 active:scale-95 group overflow-hidden relative" onClick={handleLaunchFullTool}>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                            Initialize Audit
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>

        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-16">
              {/* SECTION: COMMUNITY TRANSMISSIONS - BLUE ACCENTS */}
              <section>
                  <div className="flex items-center justify-between mb-8 pb-4 border-b border-primary/5">
                      <div className="flex items-center gap-4">
                          <Newspaper className="h-6 w-6 text-primary" />
                          <h2 className="text-sm font-black tracking-[0.4em] uppercase text-primary">Community Transmissions</h2>
                      </div>
                      <Link href="/dashboard/research-analytics" className="text-[10px] font-black uppercase text-muted-foreground hover:text-primary transition-colors tracking-widest">Full Stream</Link>
                  </div>
                  
                  <div className="grid gap-6">
                      {postsLoading ? (
                          <div className="py-20 flex flex-col items-center justify-center gap-4 opacity-20">
                              <Loader2 className="h-10 w-10 animate-spin text-primary" />
                              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Syncing Registry...</span>
                          </div>
                      ) : posts.length > 0 ? (
                          posts.map((post, idx) => (
                              <motion.div key={post.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }}>
                                  <Card className="rounded-[2.5rem] border-primary/5 bg-card hover:bg-primary/[0.02] hover:shadow-2xl transition-all overflow-hidden group cursor-pointer" asChild>
                                      <Link href={`/dashboard/profile/${post.authorUid}`}>
                                          <div className="p-8 flex flex-col sm:flex-row gap-8">
                                              <div className="flex items-center gap-5 sm:border-r border-primary/5 sm:pr-8 sm:min-w-[220px]">
                                                  <Avatar className="h-12 w-12 border border-primary/10 rounded-[1.2rem] shadow-sm">
                                                      {!post.isAnonymous && <AvatarImage src={post.authorAvatar} className="object-cover" />}
                                                      <AvatarFallback className="font-black bg-primary/5 text-primary text-sm uppercase">
                                                          {post.isAnonymous ? 'A' : post.authorName.charAt(0)}
                                                      </AvatarFallback>
                                                  </Avatar>
                                                  <div className="text-left space-y-1">
                                                      <p className="font-black text-xs tracking-tight uppercase">{post.isAnonymous ? 'Anonymous' : post.authorName}</p>
                                                      <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-40">
                                                          {post.createdAt ? formatDistanceToNow(post.createdAt.toDate(), { addSuffix: true }) : 'Processing...'}
                                                      </p>
                                                  </div>
                                              </div>
                                              <div className="flex-1 space-y-4 text-left">
                                                  <div className="flex items-center justify-between gap-4">
                                                      <h3 className="font-black text-base tracking-tight uppercase group-hover:text-primary transition-colors line-clamp-1">{post.title}</h3>
                                                      <Badge variant="outline" className="font-black text-[8px] uppercase tracking-widest px-3 py-1 border-primary/10 text-primary bg-primary/5">
                                                          {post.postType || 'Node'}
                                                      </Badge>
                                                  </div>
                                                  <p className="text-sm text-muted-foreground font-medium leading-relaxed line-clamp-2 italic opacity-80">
                                                      "{post.content || 'Polling community consensus...'}"
                                                  </p>
                                              </div>
                                          </div>
                                      </Link>
                                  </Card>
                              </motion.div>
                          ))
                      ) : (
                          <div className="py-24 text-center bg-primary/5 rounded-[3rem] border-2 border-dashed border-primary/10">
                              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-primary/30">No transmissions recorded in this node.</p>
                          </div>
                      )}
                  </div>
              </section>

              {/* SECTION: INSTANT FORENSIC INGRESS - BLUE ACCENTS */}
              <section className="space-y-8">
                  <div className="flex items-center gap-4 mb-2 pb-4 border-b border-primary/5">
                      <Zap className="h-6 w-6 text-primary" />
                      <h2 className="text-sm font-black tracking-[0.4em] uppercase text-primary">Quick Ingress Terminal</h2>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-6">
                      <Card className="p-8 rounded-[2.5rem] border-primary/5 bg-primary/5 shadow-xl text-left group">
                          <div className="space-y-6">
                              <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/60">Jargon Simplifier</span>
                                  <Lightbulb className="h-5 w-5 text-primary opacity-20" />
                              </div>
                              <div className="flex gap-3">
                                  <Input 
                                    placeholder="Enter legal term..." 
                                    className="h-12 bg-background border-primary/10 font-bold text-xs rounded-xl uppercase tracking-widest px-5 focus:border-primary"
                                    value={quickJargon}
                                    onChange={(e) => setQuickJargon(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleQuickAudit()}
                                  />
                                  <Button size="icon" className="h-12 w-12 rounded-xl shrink-0 shadow-lg shadow-primary/20" onClick={handleQuickAudit} disabled={isProcessingJargon || !quickJargon}>
                                      {isProcessingJargon ? <Loader2 className="h-5 w-5 animate-spin" /> : <ChevronRight className="h-5 w-5" />}
                                  </Button>
                              </div>
                              
                              <AnimatePresence>
                                  {jargonReport && (
                                      <motion.div 
                                        initial={{ opacity: 0, height: 0 }} 
                                        animate={{ opacity: 1, height: 'auto' }} 
                                        exit={{ opacity: 0, height: 0 }}
                                        className="mt-6 p-6 rounded-[1.5rem] bg-background border-2 border-primary/10 shadow-inner relative overflow-hidden"
                                      >
                                          <div className="absolute top-0 right-0 p-3 opacity-5"><Logo className="h-12 w-12" priority={false} /></div>
                                          <div className="flex items-center gap-3 mb-3">
                                              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                                              <span className="text-[9px] font-black uppercase text-primary tracking-[0.3em]">Forensic Report Node</span>
                                          </div>
                                          <p className="text-xs font-black uppercase mb-2 tracking-widest text-primary">{jargonReport.term}</p>
                                          <p className="text-[11px] font-medium leading-relaxed text-muted-foreground">{jargonReport.exp}</p>
                                      </motion.div>
                                  )}
                              </AnimatePresence>
                          </div>
                      </Card>
                      <Card className="p-8 rounded-[2.5rem] border-primary/5 bg-primary/5 shadow-xl text-left group">
                          <div className="space-y-6">
                              <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/60">BNS Statutory Hub</span>
                                  <Gavel className="h-5 w-5 text-primary opacity-20" />
                              </div>
                              <div className="flex gap-3">
                                  <Input placeholder="Search BNS Section..." className="h-12 bg-background border-primary/10 font-bold text-xs rounded-xl uppercase tracking-widest px-5 focus:border-primary" />
                                  <Button size="icon" variant="outline" className="h-12 w-12 rounded-xl shrink-0 border-primary/10 hover:bg-primary/5">
                                      <Search className="h-5 w-5 text-primary" />
                                  </Button>
                              </div>
                              <p className="text-[10px] font-bold text-muted-foreground opacity-60 uppercase tracking-widest leading-relaxed">Map IPC codes to the new BNS framework instantly.</p>
                          </div>
                      </Card>
                  </div>
              </section>

              {/* SECTION: AUDIT LEDGER - BLUE ACCENTS */}
              <section>
                  <div className="flex items-center justify-between mb-8 pb-4 border-b border-primary/5">
                      <div className="flex items-center gap-4">
                          <History className="h-6 w-6 text-primary" />
                          <h2 className="text-sm font-black tracking-[0.4em] uppercase text-primary">Statutory Audit Registry</h2>
                      </div>
                      <Link href="/dashboard/my-cases" className="text-[10px] font-black uppercase text-muted-foreground hover:text-primary transition-colors tracking-widest">Full Ledger</Link>
                  </div>
                  <Card className="rounded-[3rem] border-primary/5 shadow-2xl overflow-hidden bg-card">
                      <div className="divide-y divide-primary/5">
                          {[
                              { id: "AUD-001", type: "Document Intelligence", date: "2H ago", status: "Success", icon: FileCheck, color: "text-green-600", bg: "bg-green-500/10" },
                              { id: "AUD-002", type: "Voice Narration", date: "1D ago", status: "Analyzed", icon: Mic, color: "text-blue-600", bg: "bg-blue-500/10" },
                              { id: "AUD-003", type: "Bail Probability", date: "3D ago", status: "High Risk", icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-500/10" }
                          ].map((audit, i) => (
                              <div key={audit.id} className="p-6 flex items-center justify-between group hover:bg-primary/[0.02] transition-colors cursor-pointer">
                                  <div className="flex items-center gap-6">
                                      <div className={cn("p-3 rounded-2xl border border-primary/5 shadow-sm", audit.bg, audit.color)}>
                                          <audit.icon className="h-5 w-5" />
                                      </div>
                                      <div className="text-left space-y-1">
                                          <p className="font-black text-sm uppercase tracking-tight text-foreground">{audit.type}</p>
                                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-40">Node: {audit.id} • {audit.date}</p>
                                      </div>
                                  </div>
                                  <div className="flex items-center gap-6">
                                      <Badge variant="outline" className={cn("font-black text-[9px] uppercase tracking-[0.3em] px-4 py-1.5 border-primary/10", audit.bg, audit.color)}>
                                          {audit.status}
                                      </Badge>
                                      <ChevronRight className="h-5 w-5 text-primary opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                  </div>
                              </div>
                          ))}
                      </div>
                  </Card>
              </section>
          </div>

          <div className="lg:col-span-4 space-y-12">
              {/* SIDEBAR: ACTIONS - BLUE ACCENTS */}
              <section className="space-y-8">
                  <motion.div variants={cardVariants} whileHover={{ scale: 1.02 }}>
                      <Card className="bg-primary border-none rounded-[3rem] overflow-hidden shadow-2xl shadow-primary/20 relative group cursor-pointer" asChild>
                          <Link href="/dashboard/billing">
                            <div className="p-10 text-white relative z-10 space-y-10">
                                <div className="flex justify-between items-start">
                                    <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                                        <Zap className="h-8 w-8 text-white" />
                                    </div>
                                    <Badge className="bg-white text-primary font-black text-[9px] uppercase tracking-widest border-none">Elite Access</Badge>
                                </div>
                                <div className="space-y-3 text-left">
                                    <h3 className="text-3xl font-black tracking-tighter uppercase leading-tight">Upgrade <br /> Node</h3>
                                    <p className="text-white/60 text-[11px] font-bold uppercase tracking-widest leading-relaxed">Unlock elite forensic AI terminals and unlimited reports.</p>
                                </div>
                                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest bg-white/10 w-fit px-6 py-3 rounded-xl border border-white/10 group-hover:bg-white/20 transition-all">
                                    Protocol Options <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </Link>
                      </Card>
                  </motion.div>

                  {/* SPECIALIZED TERMINALS GRID - BLUE ACCENTS */}
                  <div className="space-y-4">
                      {aiFeatures.map((f, i) => (
                        <motion.div key={f.href} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + (i * 0.05) }}>
                            <Link href={f.href} className="block group h-full">
                                <Card className="p-6 rounded-[2rem] border-primary/5 hover:border-primary/20 hover:bg-primary/[0.02] transition-all text-left shadow-lg group-active:scale-[0.98] relative overflow-hidden h-full">
                                    <div className="flex items-center gap-5 relative z-10">
                                        <div className={cn("p-3.5 rounded-xl border border-primary/5 transition-all group-hover:scale-110 shadow-sm shrink-0", f.bg, f.color)}>
                                            <f.icon className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1 space-y-0.5 min-w-0">
                                            <h3 className="font-black text-xs tracking-widest text-foreground uppercase group-hover:text-primary transition-colors truncate">{f.title}</h3>
                                            <p className="text-[9px] text-muted-foreground font-black uppercase tracking-tighter">{f.desc}</p>
                                        </div>
                                        <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                                    </div>
                                </Card>
                            </Link>
                        </motion.div>
                      ))}
                  </div>
              </section>
          </div>
        </div>
    </motion.div>
  );
}
