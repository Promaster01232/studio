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
  ChevronDown,
  X,
  FileUp,
  MapPin,
  User,
  Smartphone,
  Calendar,
  AlertTriangle
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
  DropdownMenuSeparator,
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
    postType?: string;
    isAnonymous?: boolean;
}

const aiFeatures = [
    { id: "strength", icon: BrainCircuit, title: "Case Strength", desc: "Litigation success probability.", color: "text-blue-500", bg: "bg-blue-500/10", href: "/dashboard/strength-analyzer" },
    { id: "intel", icon: Search, title: "Forensic Analysis", desc: "Scan documents for hidden risks.", color: "text-amber-600", bg: "bg-amber-500/10", href: "/dashboard/document-intelligence" },
    { id: "draft", icon: FileText, title: "Statutory Drafting", desc: "Generate professional legal notices.", color: "text-emerald-600", bg: "bg-emerald-500/10", href: "/dashboard/document-generator" },
    { id: "bond", icon: FileSignature, title: "Bond Protocol", desc: "Official bail and indemnity bonds.", color: "text-purple-600", bg: "bg-purple-500/10", href: "/dashboard/bond-generator" },
];

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
    <div className="flex flex-col h-full space-y-8 pb-20 max-w-7xl mx-auto text-left relative pt-2">
        {/* HERO SECTION */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="relative overflow-hidden border-none bg-card/40 backdrop-blur-xl shadow-2xl rounded-[2.5rem] group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5 pointer-events-none" />
              <div className="p-8 sm:p-12 relative z-10 flex flex-col lg:flex-row items-center gap-10">
                  <div className="flex-1 space-y-8 text-center lg:text-left">
                      <div className="space-y-4">
                          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-foreground leading-none">
                              Nyaya <span className="animate-pan italic">{text}</span>
                          </h1>
                          <p className="text-sm sm:text-lg text-muted-foreground font-medium max-w-xl leading-relaxed opacity-80">
                              Elite AI legal command center. Experience mathematically precise forensic intelligence and statutory roadmaps.
                          </p>
                      </div>

                      <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                          <Button size="lg" className="rounded-xl font-black uppercase tracking-widest h-12 px-8 shadow-xl shadow-primary/20 active:scale-95 transition-all text-[10px]" asChild>
                              <Link href="/dashboard/narrate">
                                  <Mic className="h-4 w-4 mr-2" /> Start Case Record
                              </Link>
                          </Button>
                          <Button variant="ghost" className="h-12 rounded-xl px-6 font-black uppercase tracking-widest text-primary text-[10px] hover:bg-primary/5" asChild>
                              <Link href="/dashboard/learn">Knowledge Ingress</Link>
                          </Button>
                      </div>
                  </div>

                  <div className="hidden lg:flex flex-col gap-3 w-72">
                      <div className="p-4 rounded-2xl bg-white/50 dark:bg-black/20 border border-primary/10 shadow-sm flex items-center gap-4 group/sec">
                          <div className="p-2 rounded-lg bg-primary/10 group-hover/sec:bg-primary/20 transition-colors">
                              <ShieldCheck className="h-4 w-4 text-primary" />
                          </div>
                          <div className="text-left">
                              <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Shield Status</p>
                              <p className="text-[10px] font-black text-primary uppercase">AES-256 Active</p>
                          </div>
                      </div>
                  </div>
              </div>
              <div className="h-1 w-full bg-gradient-to-r from-primary via-blue-400 to-primary/20"></div>
          </Card>
        </motion.div>

        {/* NEURAL AGENDA COMMAND BAR */}
        <motion.section 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.2 }}
            className="w-full flex flex-col items-center py-10 space-y-8"
        >
            <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-foreground/80">
                What's on the agenda today?
            </h2>
            
            <div className="w-full max-w-3xl relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-primary/5 to-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                
                <div className="relative flex items-center bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 rounded-full h-16 sm:h-20 px-4 sm:px-6 shadow-2xl shadow-black/5">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-10 w-10 sm:h-12 sm:w-12 rounded-full hover:bg-muted/50 text-muted-foreground hover:text-primary transition-all active:scale-90">
                                <Plus className="h-5 w-5 sm:h-6 sm:w-6" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-64 p-2 rounded-[1.5rem] shadow-3xl glass border-primary/10 mb-4">
                            <DropdownMenuLabel className="px-3 pb-2 text-[9px] font-black uppercase tracking-widest text-primary">Initialize AI Protocol</DropdownMenuLabel>
                            {aiFeatures.map((f) => (
                                <DropdownMenuItem key={f.id} onClick={() => setSelectedTool(f.id)} className="rounded-xl h-12 px-3 cursor-pointer gap-3 focus:bg-primary/10">
                                    <div className={cn("p-2 rounded-lg", f.bg, f.color)}>
                                        <f.icon className="h-4 w-4" />
                                    </div>
                                    <span className="font-bold text-xs uppercase tracking-tight">{f.title}</span>
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <div className="flex-1 px-4 text-left">
                        <Input 
                            placeholder="Ask anything..." 
                            className="border-none bg-transparent shadow-none focus-visible:ring-0 text-base sm:text-lg font-medium placeholder:text-muted-foreground/40 p-0 h-full"
                            value={quickJargon}
                            onChange={(e) => setQuickJargon(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleQuickAudit()}
                        />
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4">
                        <Button variant="ghost" size="icon" className="h-10 w-10 sm:h-12 sm:w-12 rounded-full text-muted-foreground hover:text-primary active:scale-90 transition-all">
                            <Mic className="h-5 w-5 sm:h-6 sm:w-6" />
                        </Button>
                        <Button className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-black text-white dark:bg-white dark:text-black flex items-center justify-center shadow-lg active:scale-95 transition-all group/wave" onClick={handleQuickAudit}>
                            <div className="flex gap-0.5">
                                {[1, 2, 3].map((i) => (
                                    <motion.div 
                                        key={i}
                                        animate={{ height: [4, 12, 4] }}
                                        transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }}
                                        className="w-0.5 bg-current rounded-full"
                                    />
                                ))}
                            </div>
                        </Button>
                    </div>
                </div>
            </div>
        </motion.section>

        {/* QUICK ACTION DIALOG */}
        <Dialog open={!!selectedTool} onOpenChange={(o) => { if(!o) setSelectedTool(null); }}>
            <DialogContent className="sm:max-w-xl rounded-[2.5rem] p-0 overflow-hidden border-none shadow-3xl bg-card text-left">
                <DialogHeader className="p-8 pb-4 bg-primary/5 border-b border-primary/5 text-left">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3 text-primary">
                            {selectedTool === 'strength' && <BrainCircuit className="h-6 w-6" />}
                            {selectedTool === 'intel' && <Search className="h-6 w-6" />}
                            {selectedTool === 'draft' && <FileText className="h-6 w-6" />}
                            {selectedTool === 'bond' && <FileSignature className="h-6 w-6" />}
                            <DialogTitle className="text-2xl font-black tracking-tighter uppercase leading-none">
                                {aiFeatures.find(f => f.id === selectedTool)?.title} Ingress
                            </DialogTitle>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => setSelectedTool(null)} className="h-8 w-8 rounded-full">
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                    <DialogDescription className="text-xs font-medium uppercase tracking-widest opacity-60">
                        Initialize forensic node for immediate statutory reporting.
                    </DialogDescription>
                </DialogHeader>

                <div className="p-8 sm:p-10 space-y-8 text-left">
                    {selectedTool === 'strength' && (
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Case Narrative</Label>
                                <Textarea placeholder="Describe your legal situation in detail..." rows={5} className="glass rounded-2xl font-medium text-sm p-4 shadow-inner" />
                            </div>
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Language Node</Label>
                                <Select defaultValue="English">
                                    <SelectTrigger className="h-12 glass font-bold rounded-xl"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-xl glass">
                                        <SelectItem value="English" className="font-bold">English Protocol</SelectItem>
                                        <SelectItem value="Hindi" className="font-bold">Hindi Protocol</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}

                    {selectedTool === 'intel' && (
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">Instrument Node</Label>
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-primary/5 rounded-2xl border-2 border-dashed border-primary/10 pointer-events-none"></div>
                                    <Input type="file" onChange={handleFileChange} className="h-32 opacity-0 cursor-pointer relative z-10" />
                                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 pointer-events-none">
                                        <FileUp className="h-8 w-8 text-primary opacity-40 group-hover:scale-110 transition-transform" />
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                            {fileName || "Select Statutory File"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {selectedTool === 'draft' && (
                        <div className="grid sm:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Draft Type</Label>
                                <Select defaultValue="Notice">
                                    <SelectTrigger className="h-12 glass font-bold rounded-xl"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-xl glass">
                                        <SelectItem value="Notice" className="font-bold">Legal Notice</SelectItem>
                                        <SelectItem value="Complaint" className="font-bold">Police Complaint</SelectItem>
                                        <SelectItem value="FIR" className="font-bold">FIR Application</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Author Name</Label>
                                <Input placeholder="Rajesh Kumar" className="h-12 glass font-bold rounded-xl" />
                            </div>
                            <div className="sm:col-span-2 space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Case Summary</Label>
                                <Textarea placeholder="Core facts for the document..." className="glass rounded-2xl font-medium text-sm p-4" />
                            </div>
                        </div>
                    )}

                    {selectedTool === 'bond' && (
                        <div className="space-y-6">
                            <div className="grid sm:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Bond Category</Label>
                                    <Select defaultValue="Bail">
                                        <SelectTrigger className="h-12 glass font-bold rounded-xl"><SelectValue /></SelectTrigger>
                                        <SelectContent className="rounded-xl glass">
                                            <SelectItem value="Bail" className="font-bold">Bail Bond</SelectItem>
                                            <SelectItem value="Personal" className="font-bold">Personal Bond</SelectItem>
                                            <SelectItem value="Surety" className="font-bold">Surety Bond</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Case No.</Label>
                                    <Input placeholder="OS 123/2024" className="h-12 glass font-bold rounded-xl" />
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="pt-6 border-t border-primary/10 flex flex-col sm:flex-row gap-4">
                        <Button variant="outline" className="flex-1 h-14 font-black uppercase tracking-widest text-[10px] rounded-xl border-primary/10" onClick={() => setSelectedTool(null)}>
                            Abort Protocol
                        </Button>
                        <Button className="flex-1 h-14 font-black uppercase tracking-[0.2em] text-[10px] rounded-xl shadow-xl shadow-primary/20 active:scale-95 group overflow-hidden relative" onClick={handleLaunchFullTool}>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                            Initialize Audit
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>

        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-10">
              {/* SECTION: COMMUNITY TRANSMISSIONS */}
              <section>
                  <div className="flex items-center justify-between mb-6 pb-2 border-b border-primary/5">
                      <div className="flex items-center gap-3 text-primary/60">
                          <Newspaper className="h-5 w-5" />
                          <h2 className="text-xs font-black tracking-[0.3em] uppercase">Community Transmissions</h2>
                      </div>
                      <Link href="/dashboard/research-analytics" className="text-[9px] font-black uppercase text-primary hover:underline">Full Stream</Link>
                  </div>
                  
                  <div className="grid gap-4">
                      {postsLoading ? (
                          <div className="py-12 flex flex-col items-center justify-center gap-3 opacity-20">
                              <Loader2 className="h-8 w-8 animate-spin" />
                              <span className="text-[10px] font-black uppercase tracking-widest">Syncing Registry...</span>
                          </div>
                      ) : posts.length > 0 ? (
                          posts.map((post, idx) => (
                              <motion.div key={post.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }}>
                                  <Card className="rounded-[1.8rem] border-primary/5 bg-card/40 hover:bg-card hover:shadow-xl transition-all overflow-hidden group cursor-pointer" asChild>
                                      <Link href={`/dashboard/profile/${post.authorUid}`}>
                                          <div className="p-6 flex flex-col sm:flex-row gap-6">
                                              <div className="flex items-center gap-4 sm:border-r sm:border-primary/5 sm:pr-6 sm:min-w-[180px]">
                                                  <Avatar className="h-10 w-10 border border-primary/10 rounded-xl shadow-lg">
                                                      {!post.isAnonymous && <AvatarImage src={post.authorAvatar} className="object-cover" />}
                                                      <AvatarFallback className="font-black bg-primary/5 text-primary text-[10px]">
                                                          {post.isAnonymous ? 'A' : post.authorName.charAt(0)}
                                                      </AvatarFallback>
                                                  </Avatar>
                                                  <div className="text-left space-y-0.5">
                                                      <p className="font-black text-xs tracking-tight">{post.isAnonymous ? 'Anonymous' : post.authorName}</p>
                                                      <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">
                                                          {post.createdAt ? formatDistanceToNow(post.createdAt.toDate(), { addSuffix: true }) : 'Processing...'}
                                                      </p>
                                                  </div>
                                              </div>
                                              <div className="flex-1 space-y-3 text-left">
                                                  <div className="flex items-center justify-between gap-4">
                                                      <h3 className="font-black text-sm tracking-tight uppercase group-hover:text-primary transition-colors line-clamp-1">{post.title}</h3>
                                                      <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/10 text-[8px] font-black uppercase tracking-widest shrink-0">
                                                          {post.postType || 'Idea'}
                                                      </Badge>
                                                  </div>
                                                  <p className="text-xs text-muted-foreground font-medium leading-relaxed line-clamp-2 italic">
                                                      "{post.content || 'Polling community consensus...'}"
                                                  </p>
                                              </div>
                                          </div>
                                      </Link>
                                  </Card>
                              </motion.div>
                          ))
                      ) : (
                          <div className="py-12 text-center bg-muted/10 rounded-3xl border-2 border-dashed border-primary/5">
                              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">No institutional transmissions recorded.</p>
                          </div>
                      )}
                  </div>
              </section>

              {/* SECTION: INSTANT FORENSIC INGRESS */}
              <section className="space-y-6">
                  <div className="flex items-center gap-3 mb-2 pb-2 border-b border-primary/5">
                      <Zap className="h-5 w-5 text-primary" />
                      <h2 className="text-xs font-black tracking-[0.3em] uppercase">Quick Ingress Terminal</h2>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                      <Card className="p-6 rounded-[2rem] border-primary/5 bg-primary/[0.02] shadow-xl text-left group">
                          <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                  <span className="text-[9px] font-black uppercase tracking-widest text-primary">Jargon Simplifier Node</span>
                                  <Lightbulb className="h-4 w-4 text-amber-500 opacity-40" />
                              </div>
                              <div className="flex gap-2">
                                  <Input 
                                    placeholder="Enter legal term..." 
                                    className="h-10 bg-background border-primary/10 font-bold text-xs rounded-xl"
                                    value={quickJargon}
                                    onChange={(e) => setQuickJargon(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleQuickAudit()}
                                  />
                                  <Button size="icon" className="h-10 w-10 rounded-xl shrink-0" onClick={handleQuickAudit} disabled={isProcessingJargon || !quickJargon}>
                                      {isProcessingJargon ? <Loader2 className="h-4 w-4 animate-spin" /> : <ChevronRight className="h-4 w-4" />}
                                  </Button>
                              </div>
                              
                              <AnimatePresence>
                                  {jargonReport && (
                                      <motion.div 
                                        initial={{ opacity: 0, height: 0 }} 
                                        animate={{ opacity: 1, height: 'auto' }} 
                                        exit={{ opacity: 0, height: 0 }}
                                        className="mt-4 p-4 rounded-2xl bg-white dark:bg-zinc-900 border-2 border-primary/10 shadow-inner relative overflow-hidden"
                                      >
                                          <div className="absolute top-0 right-0 p-2 opacity-5"><Logo className="h-12 w-12" priority={false} /></div>
                                          <div className="flex items-center gap-2 mb-2">
                                              <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                                              <span className="text-[8px] font-black uppercase text-primary tracking-widest">Forensic Report Node</span>
                                          </div>
                                          <p className="text-[10px] font-black uppercase mb-1">{jargonReport.term}</p>
                                          <p className="text-[9px] font-medium leading-relaxed text-muted-foreground">{jargonReport.exp}</p>
                                      </motion.div>
                                  )}
                              </AnimatePresence>
                          </div>
                      </Card>
                      <Card className="p-6 rounded-[2rem] border-primary/5 bg-blue-500/[0.02] shadow-xl text-left group">
                          <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                  <span className="text-[9px] font-black uppercase tracking-widest text-blue-600">BNS Statutory Hub</span>
                                  <Gavel className="h-4 w-4 text-blue-500 opacity-40" />
                              </div>
                              <div className="flex gap-2">
                                  <Input placeholder="Search BNS section..." className="h-10 bg-background border-primary/10 font-bold text-xs rounded-xl" />
                                  <Button size="icon" variant="outline" className="h-10 w-10 rounded-xl shrink-0 border-primary/10 text-primary">
                                      <Search className="h-4 w-4" />
                                  </Button>
                              </div>
                              <p className="text-[8px] font-bold text-muted-foreground opacity-60">Map old IPC codes to the new BNS framework instantly.</p>
                          </div>
                      </Card>
                  </div>
              </section>

              {/* SECTION: ELITE MODULES */}
              <section>
                  <div className="flex items-center justify-between mb-6 pb-2 border-b border-primary/5">
                      <div className="flex items-center gap-3 text-primary/60">
                          <Sparkles className="h-5 w-5" />
                          <h2 className="text-xs font-black tracking-[0.3em] uppercase">Specialized Terminals</h2>
                      </div>
                      <Badge variant="outline" className="font-black text-[8px] uppercase tracking-widest border-primary/20 text-primary">Elite Access Node</Badge>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {aiFeatures.map((f, i) => (
                        <motion.div key={f.href} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + (i * 0.05) }}>
                            <Link href={f.href} className="block group h-full">
                                <Card className="p-6 rounded-[1.8rem] border-primary/5 hover:border-primary/20 hover:bg-card transition-all text-left shadow-lg group-active:scale-[0.98] relative overflow-hidden h-full">
                                    <div className="flex items-start gap-5 relative z-10">
                                        <div className={cn(
                                            "p-4 rounded-2xl transition-all shadow-md shrink-0",
                                            f.bg, f.color, "group-hover:scale-110"
                                        )}>
                                            <f.icon className="h-6 w-6" />
                                        </div>
                                        <div className="flex-1 space-y-1 min-w-0">
                                            <h3 className="font-black text-sm tracking-tight text-foreground uppercase leading-none group-hover:text-primary transition-colors truncate">{f.title}</h3>
                                            <p className="text-[10px] text-muted-foreground font-bold leading-relaxed">{f.desc}</p>
                                        </div>
                                        <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0 mt-1" />
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Card>
                            </Link>
                        </motion.div>
                      ))}
                  </div>
              </section>

              {/* SECTION: AUDIT LEDGER */}
              <section>
                  <div className="flex items-center justify-between mb-6 pb-2 border-b border-primary/5">
                      <div className="flex items-center gap-3 text-primary/60">
                          <History className="h-5 w-5" />
                          <h2 className="text-xs font-black tracking-[0.3em] uppercase">Statutory Audit Registry</h2>
                      </div>
                      <Link href="/dashboard/my-cases" className="text-[9px] font-black uppercase text-primary hover:underline">Full Ledger</Link>
                  </div>
                  <Card className="rounded-[2.5rem] border-primary/5 shadow-xl overflow-hidden bg-card/40">
                      <div className="divide-y divide-primary/5">
                          {[
                              { id: "AUD-001", type: "Document Intelligence", date: "2H ago", status: "Success", color: "text-green-600", bg: "bg-green-500/5", icon: FileCheck },
                              { id: "AUD-002", type: "Voice Narration", date: "1D ago", status: "Analyzed", color: "text-blue-600", bg: "bg-blue-500/5", icon: Mic },
                              { id: "AUD-003", type: "Bail Probability", date: "3D ago", status: "High Risk", color: "text-amber-600", bg: "bg-amber-500/5", icon: AlertTriangle }
                          ].map((audit, i) => (
                              <div key={audit.id} className="p-5 flex items-center justify-between group hover:bg-primary/[0.02] transition-colors cursor-pointer">
                                  <div className="flex items-center gap-4">
                                      <div className={cn("p-2.5 rounded-xl border border-primary/5 shadow-sm", audit.bg)}>
                                          <audit.icon className={cn("h-4 w-4", audit.color)} />
                                      </div>
                                      <div className="text-left">
                                          <p className="font-black text-xs uppercase tracking-tight text-foreground">{audit.type}</p>
                                          <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Node: {audit.id} • {audit.date}</p>
                                      </div>
                                  </div>
                                  <div className="flex items-center gap-4">
                                      <Badge variant="outline" className={cn("font-black text-[8px] uppercase tracking-widest px-3 py-1 border-primary/10", audit.color, audit.bg)}>
                                          {audit.status}
                                      </Badge>
                                      <ChevronRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                  </div>
                              </div>
                          ))}
                      </div>
                  </Card>
              </section>
          </div>

          <div className="lg:col-span-4 space-y-8">
              {/* SIDEBAR: ACTIONS */}
              <section className="space-y-6">
                  <Card className="bg-primary border-none rounded-[2.2rem] overflow-hidden shadow-2xl shadow-primary/20 relative group cursor-pointer" asChild>
                      <Link href="/dashboard/billing">
                        <div className="p-8 text-white relative z-10 space-y-6">
                            <div className="flex justify-between items-start">
                                <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-md border border-white/10">
                                    <Zap className="h-6 w-6 text-white" />
                                </div>
                                <Badge className="bg-white text-primary font-black text-[8px] uppercase tracking-widest border-none">Elite Access</Badge>
                            </div>
                            <div className="space-y-2 text-left">
                                <h3 className="text-2xl font-black tracking-tighter uppercase leading-none">Upgrade Node</h3>
                                <p className="text-white/70 text-[10px] font-medium leading-relaxed">Unlock the full potential of elite forensic AI terminals and unlimited reports.</p>
                            </div>
                            <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest bg-white/10 w-fit px-5 py-2.5 rounded-xl border border-white/10 group-hover:bg-white/20 transition-all">
                                Protocol Options <ChevronRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                  </Card>
              </section>
          </div>
        </div>
    </div>
  );
}
