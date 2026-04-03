"use client";

import { useActionState, useRef, useState, useEffect, use } from "react";
import { understandDocumentAction, type DocumentIntelligenceState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileUp, 
  Bot, 
  AlertTriangle, 
  CalendarClock, 
  ListChecks, 
  Bomb, 
  Languages, 
  FileText, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowLeft, 
  Loader2, 
  Activity, 
  Cpu,
  Clock,
  Globe,
  Fingerprint,
  PlusCircle,
  FileSearch,
  ChevronDown,
  X
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { AudioAssistant } from "@/components/audio-assistant";
import Link from "next/link";
import { useFirestore, useAuth } from "@/firebase";
import { doc, updateDoc, increment } from "firebase/firestore";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";

const initialState: DocumentIntelligenceState = {
  status: "idle",
  data: null,
  error: null,
};

export default function DocumentIntelligencePage(props: { params: Promise<any>, searchParams: Promise<any> }) {
  // Next.js 15: Explicitly unwrap dynamic properties to prevent enumeration errors
  use(props.params);
  use(props.searchParams);

  const [state, formAction] = useActionState(understandDocumentAction, initialState);
  const [fileName, setFileName] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const reportRef = useRef<HTMLDivElement>(null);
  
  const firestore = useFirestore();
  const auth = useAuth();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  useEffect(() => {
    if (state.status === 'success' && auth.currentUser) {
        const userRef = doc(firestore, "users", auth.currentUser.uid);
        updateDoc(userRef, { aiUsageCount: increment(1) }).catch(console.error);
        
        setTimeout(() => {
            reportRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
    }
  }, [state.status, auth.currentUser, firestore]);

  const handleReset = () => {
      window.location.reload();
  };

  return (
    <div className="space-y-10 max-w-6xl mx-auto pb-32 px-4 sm:px-0 text-left">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-primary/5 pb-6">
            <PageHeader
            title="Document Intelligence"
            description="Institutional-grade AI deconstruction for statutory document risk assessment."
            />
            <Button variant="ghost" size="sm" className="rounded-xl font-bold hover:bg-primary/5 group h-10 px-6 border border-primary/5 text-primary text-[10px] uppercase tracking-widest" asChild>
            <Link href="/dashboard">
                <ArrowLeft className="mr-2 h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" /> Back to Dashboard
            </Link>
            </Button>
        </motion.div>

        <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-4xl mx-auto"
        >
            <Card className="glass shadow-2xl overflow-hidden rounded-[2.5rem] border-primary/5">
                <CardHeader className="bg-primary/5 border-b border-primary/10 p-8 text-left">
                    <div className="flex items-center gap-3 mb-2 text-primary">
                        <div className="p-2.5 rounded-xl bg-primary/10">
                            <FileUp className="h-5 w-5" />
                        </div>
                        <CardTitle className="text-xl font-black uppercase tracking-tight text-left">Ingestion Hub</CardTitle>
                    </div>
                    <CardDescription className="text-[10px] font-bold uppercase tracking-widest opacity-60">Secured forensic document transmission protocol.</CardDescription>
                </CardHeader>
                <CardContent className="p-8 sm:p-10">
                    <form action={formAction} className="space-y-8 text-left">
                        <div className="space-y-4">
                            <Label htmlFor="document" className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">Statutory Registry</Label>
                            <div className="relative group">
                                <div className="absolute inset-0 bg-primary/5 rounded-[1.5rem] transition-all group-hover:bg-primary/10 border border-primary/10 group-hover:border-primary/30 pointer-events-none"></div>
                                <Input 
                                    id="document" 
                                    name="document" 
                                    type="file" 
                                    required 
                                    onChange={handleFileChange}
                                    ref={fileInputRef}
                                    accept=".pdf,.doc,.docx,image/*"
                                    className="h-28 opacity-0 cursor-pointer relative z-10"
                                />
                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 pointer-events-none">
                                    <div className="p-3 rounded-xl bg-background shadow-md border border-primary/5 group-hover:scale-110 transition-transform duration-500">
                                        <FileText className="h-6 w-6 text-primary opacity-60" />
                                    </div>
                                    <p className="text-[11px] font-bold text-muted-foreground group-hover:text-primary transition-colors">
                                        {fileName ? fileName : "Drag & drop statutory document or browse"}
                                    </p>
                                </div>
                            </div>
                            {fileName && (
                                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-3 p-4 bg-green-500/5 rounded-xl border border-green-500/10">
                                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                                    <p className="text-xs font-bold text-green-600 truncate flex-1">{fileName}</p>
                                    <button type="button" onClick={() => { setFileName(""); if(fileInputRef.current) fileInputRef.current.value=""; }} className="text-muted-foreground hover:text-destructive transition-colors active:scale-90">
                                        <X className="h-4 w-4" />
                                    </button>
                                </motion.div>
                            )}
                        </div>

                        <div className="space-y-4">
                            <Label htmlFor="language" className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1 flex items-center gap-2">
                                <Languages className="h-3 w-3" /> Audit Language Node
                            </Label>
                            <Select name="language" defaultValue={selectedLanguage} onValueChange={setSelectedLanguage} required>
                                <SelectTrigger id="language" className="h-12 glass border-primary/5 font-bold rounded-xl active:scale-95 transition-all">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="glass border-primary/5 rounded-[1.5rem]">
                                    <SelectItem value="English" className="font-bold rounded-lg">English (Forensic)</SelectItem>
                                    <SelectItem value="Hindi" className="font-bold rounded-lg">Hindi (Official)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Button type="submit" disabled={state.status === "loading"} className="w-full h-16 text-xs font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/20 transition-all active:scale-95 rounded-[1.5rem] group">
                            {state.status === "loading" ? (
                                <><Loader2 className="mr-3 h-5 w-5 animate-spin" /> Executing Forensic Scan...</>
                            ) : (
                                <><ShieldCheck className="mr-3 h-5 w-5 transition-transform group-hover:scale-110" /> Initialize Document Audit</>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </motion.div>

        <div ref={reportRef} className="space-y-8 scroll-mt-20">
            <div className="flex flex-col items-center gap-4 mb-4">
                <ChevronDown className="h-8 w-8 text-primary animate-bounce opacity-40" />
                <Badge variant="outline" className="font-black text-[9px] uppercase tracking-widest bg-primary/5 text-primary border-primary/10 px-4 py-1.5 rounded-full">Statutory Intelligence Node</Badge>
            </div>

            <Card className="glass border-primary/20 shadow-3xl rounded-[3rem] overflow-hidden relative min-h-[600px] flex flex-col">
                <div className="absolute inset-0 p-12 opacity-[0.02] pointer-events-none grayscale flex items-center justify-center">
                    <Logo className="h-[600px] w-[600px] border-none p-0" priority={false} />
                </div>

                <CardHeader className={cn(
                    "p-8 sm:p-12 relative z-10 transition-colors duration-500",
                    state.status === 'success' ? "bg-primary text-primary-foreground" : "bg-primary/5 text-foreground"
                )}>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 text-left">
                        <div className="space-y-4 text-left flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-3">
                                <div className={cn(
                                    "flex items-center gap-2 px-3 py-1 rounded-full border",
                                    state.status === 'success' ? "bg-white/10 border-white/20" : "bg-primary/10 border-primary/20"
                                )}>
                                    <Bot className={cn("h-4 w-4", state.status === 'success' ? "text-white" : "text-primary")} />
                                    <span className={cn("text-[10px] font-black uppercase tracking-widest", state.status === 'success' ? "text-white" : "text-primary")}>
                                        Forensic AI Deconstruction
                                    </span>
                                </div>
                                <Badge variant="outline" className={cn(
                                    "text-[9px] font-black uppercase tracking-[0.2em]",
                                    state.status === 'success' ? "border-white/20 text-white/80" : "border-primary/20 text-primary/60"
                                )}>
                                    NS-INTEL-ST-4.2
                                </Badge>
                                {state.isSimulated && (
                                    <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-[9px] font-black uppercase tracking-widest">
                                        <Cpu className="h-3 w-3 mr-1.5" /> Local Node Fallback
                                    </Badge>
                                )}
                            </div>
                            <div className="space-y-1">
                                <CardTitle className="text-3xl sm:text-5xl font-black uppercase tracking-tighter leading-none">
                                    {state.status === 'success' ? <><span className="italic opacity-80">Audit Dossier</span> Ready.</> : "Awaiting Document Ingress"}
                                </CardTitle>
                                <p className={cn(
                                    "text-[10px] font-bold uppercase tracking-[0.3em] flex items-center gap-2",
                                    state.status === 'success' ? "text-white/60" : "text-muted-foreground"
                                )}>
                                    <Globe className="h-3 w-3" /> Transience Node // BNS-COMPLIANT REGISTRY
                                </p>
                            </div>
                        </div>
                        
                        {state.status === 'success' && (
                            <div className="flex flex-wrap items-center gap-3 shrink-0">
                                <Button 
                                    variant="secondary" 
                                    size="sm" 
                                    onClick={handleReset}
                                    className="h-11 px-6 rounded-xl font-black text-[10px] uppercase tracking-widest gap-2 shadow-lg"
                                >
                                    <PlusCircle className="h-4 w-4" /> New Audit
                                </Button>
                                <AudioAssistant 
                                    text={`${state.data?.summary}. Legal risks: ${state.data?.legalRisks}.`} 
                                    language={selectedLanguage} 
                                />
                            </div>
                        )}
                    </div>
                </CardHeader>
                
                <CardContent className="p-8 sm:p-12 flex-1 relative z-10">
                    <AnimatePresence mode="wait">
                        {state.status === 'loading' ? (
                            <motion.div 
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center justify-center h-full py-20 text-center gap-10"
                            >
                                <div className="relative w-fit mx-auto">
                                    <Loader2 className="h-20 w-20 animate-spin text-primary opacity-20" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Activity className="h-8 w-8 text-primary animate-pulse" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <p className="font-black text-2xl tracking-tighter uppercase text-foreground leading-none">Deconstructing Clauses...</p>
                                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground animate-pulse">Initializing forensic document engine // BNS-V4.2 Ingress</p>
                                </div>
                            </motion.div>
                        ) : state.status === "success" && state.data ? (
                            <motion.div 
                                key="report-content"
                                initial={{ opacity: 0, y: 20 }} 
                                animate={{ opacity: 1, y: 0 }} 
                                className="space-y-12 pb-10 text-left"
                            >
                                <div className="p-8 bg-primary/5 rounded-[2.5rem] border border-primary/10 shadow-inner group transition-all hover:bg-primary/10">
                                    <div className="flex items-center gap-3 mb-4 text-primary opacity-40">
                                        <Fingerprint className="h-4 w-4" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Executive Summary</span>
                                    </div>
                                    <p className="text-sm sm:text-base text-foreground font-black leading-relaxed tracking-tight">{state.data.summary}</p>
                                </div>
                                
                                <div className="grid sm:grid-cols-2 gap-8 text-left">
                                    <Card className="bg-red-500/[0.03] rounded-[2.5rem] border-red-500/10 p-8 sm:p-10 hover:bg-red-500/[0.06] transition-all duration-500 group shadow-sm">
                                        <h3 className="text-[11px] font-black text-red-600 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                                            <AlertTriangle className="h-4 w-4" /> Forensic Risks
                                        </h3>
                                        <p className="text-sm font-bold text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors">{state.data.legalRisks}</p>
                                    </Card>
                                    <Card className="bg-amber-500/[0.03] rounded-[2.5rem] border-amber-500/10 p-8 sm:p-10 hover:bg-amber-500/[0.06] transition-all duration-500 group shadow-sm">
                                        <h3 className="text-[11px] font-black text-amber-600 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                                            <CalendarClock className="h-4 w-4" /> Critical Timelines
                                        </h3>
                                        <p className="text-sm font-bold text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors">{state.data.deadlines}</p>
                                    </Card>
                                </div>

                                <div className="p-8 sm:p-10 bg-background rounded-[2.5rem] border border-primary/10 shadow-lg transition-all hover:shadow-2xl hover:shadow-primary/5 group">
                                    <h3 className="text-[11px] font-black text-primary uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                                        <ListChecks className="h-5 w-5" /> Recommended Strategy
                                    </h3>
                                    <p className="text-sm font-bold text-muted-foreground leading-relaxed whitespace-pre-line group-hover:text-foreground transition-colors">{state.data.requiredActions}</p>
                                </div>

                                <div className="p-8 sm:p-10 bg-destructive/[0.03] rounded-[2.5rem] border border-destructive/10 group hover:bg-destructive/[0.06] transition-all">
                                    <h3 className="text-[11px] font-black text-destructive uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                                        <Bomb className="h-5 w-5" /> Procedural Consequences
                                    </h3>
                                    <p className="text-sm font-bold text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors">{state.data.consequences}</p>
                                </div>

                                <div className="pt-10 mt-10 border-t border-primary/5 flex flex-col sm:flex-row items-center justify-between gap-8 opacity-40">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-2xl bg-primary/5 text-primary">
                                            <ShieldCheck className="h-6 w-6" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-[10px] font-black uppercase tracking-widest">Statutory Security</p>
                                            <p className="text-[9px] font-bold">This node is protected under attorney-client transience protocols.</p>
                                        </div>
                                    </div>
                                    <p className="text-[9px] font-black uppercase tracking-[0.5em]">NYAYASAHAYAK.IN // TERMINAL NS-INTEL</p>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="idle" 
                                initial={{ opacity: 0, scale: 0.95 }} 
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center justify-center py-32 text-center gap-10"
                            >
                                <div className="relative">
                                    <div className="absolute -inset-6 bg-primary/5 rounded-full blur-2xl animate-pulse"></div>
                                    <div className="p-10 rounded-[2.5rem] bg-muted/30 border border-primary/5 relative z-10 transition-transform group-hover:scale-110 duration-700">
                                        <FileSearch className="h-20 w-20 text-primary opacity-20" />
                                    </div>
                                </div>
                                <div className="space-y-4 max-w-sm px-6 text-center">
                                    <h3 className="font-black text-3xl tracking-tighter uppercase text-foreground leading-none">Awaiting Ingress</h3>
                                    <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-[0.2em] leading-relaxed italic opacity-60">
                                        Upload a statutory document to initialize the neural forensic scanning protocol.
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </CardContent>
                <div className="h-2 w-full bg-gradient-to-r from-primary via-accent to-blue-400"></div>
            </Card>
        </div>
    </div>
  );
}