"use client";

import { useActionState, useRef, useState, useEffect } from "react";
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
  X,
  FileCheck,
  Search,
  Zap
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

export default function DocumentIntelligencePage() {
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
        updateDoc(userRef, { aiUsageCount: increment(1) }).catch(() => {});
        
        setTimeout(() => {
            reportRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
    }
  }, [state.status, auth.currentUser, firestore]);

  const handleReset = () => {
      window.location.reload();
  };

  return (
    <div className="space-y-12 max-w-6xl mx-auto pb-32 px-4 sm:px-6 text-left">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row items-center justify-between border-b-4 border-foreground pb-4 mb-10 gap-6">
            <div className="flex items-center gap-4">
                <div className="p-4 border-2 border-foreground rounded-2xl bg-foreground/5 shadow-sm">
                    <FileSearch className="h-6 w-6 text-primary" />
                </div>
                <div className="text-left">
                    <h1 className="text-2xl sm:text-4xl font-black font-headline tracking-tighter leading-none">Document scan</h1>
                </div>
            </div>
            <Button variant="outline" size="sm" className="rounded-full font-black text-[10px] uppercase tracking-widest h-10 px-6 border-foreground/20 hover:bg-foreground hover:text-background transition-all" asChild>
                <Link href="/dashboard">
                    <ArrowLeft className="mr-2 h-3.5 w-3.5" /> Back to terminal
                </Link>
            </Button>
        </motion.div>

        <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-3xl mx-auto"
        >
            <Card className="glass shadow-2xl overflow-hidden rounded-[2.5rem] border-primary/5 bg-card">
                <CardHeader className="bg-primary/5 border-b border-primary/10 p-8 text-left">
                    <div className="flex items-center gap-3 mb-2 text-primary">
                        <FileUp className="h-5 w-5" />
                        <CardTitle className="text-xl font-black uppercase tracking-tight text-left">Statutory ingress</CardTitle>
                    </div>
                    <CardDescription className="text-[10px] font-bold uppercase tracking-widest opacity-60">Upload your legal instrument for neural audit.</CardDescription>
                </CardHeader>
                <CardContent className="p-8 sm:p-10">
                    <form action={formAction} className="space-y-10 text-left">
                        <div className="space-y-4">
                            <Label htmlFor="document" className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">Legal instrument</Label>
                            <div className="relative group">
                                <div className="absolute inset-0 bg-primary/5 rounded-[2rem] transition-all group-hover:bg-primary/10 border-2 border-dashed border-primary/10 pointer-events-none"></div>
                                <Input 
                                    id="document" 
                                    name="document" 
                                    type="file" 
                                    required 
                                    onChange={handleFileChange}
                                    ref={fileInputRef}
                                    accept=".pdf,.doc,.docx,image/*"
                                    className="h-40 opacity-0 cursor-pointer relative z-10"
                                />
                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 pointer-events-none">
                                    <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 shadow-xl border border-primary/5 group-hover:scale-110 transition-transform duration-500">
                                        <Search className="h-8 w-8 text-primary opacity-40" />
                                    </div>
                                    <div className="space-y-1 text-center px-6">
                                        <p className="text-xs font-black uppercase tracking-widest text-foreground">
                                            {fileName ? fileName : "Click to initialize upload"}
                                        </p>
                                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em]">PDF, DOC, or image assets</p>
                                    </div>
                                </div>
                            </div>
                            {fileName && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 p-5 bg-green-500/5 rounded-2xl border border-green-500/10 shadow-inner">
                                    <div className="bg-green-500 p-1.5 rounded-lg text-white"><CheckCircle2 className="h-4 w-4" /></div>
                                    <p className="text-xs font-black truncate flex-1 uppercase tracking-tight text-green-700 dark:text-green-400">{fileName}</p>
                                    <button type="button" onClick={() => { setFileName(""); if(fileInputRef.current) fileInputRef.current.value=""; }} className="text-muted-foreground hover:text-destructive active:scale-90 transition-all p-2 rounded-full hover:bg-destructive/5">
                                        <X className="h-4 w-4" />
                                    </button>
                                </motion.div>
                            )}
                        </div>

                        <div className="space-y-4">
                            <Label htmlFor="language" className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1 flex items-center gap-2">
                                <Languages className="h-3.5 w-3.5 text-primary" /> Audit dialect
                            </Label>
                            <Select name="language" defaultValue={selectedLanguage} onValueChange={setSelectedLanguage} required>
                                <SelectTrigger id="language" className="h-14 glass border-primary/5 font-black uppercase text-[10px] rounded-2xl active:scale-95 transition-all">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="glass border-primary/5 rounded-[1.5rem]">
                                    <SelectItem value="English" className="font-black uppercase text-[10px]">English protocol</SelectItem>
                                    <SelectItem value="Hindi" className="font-black uppercase text-[10px]">Hindi protocol</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Button type="submit" disabled={state.status === "loading"} className="w-full h-16 text-[11px] font-black uppercase tracking-[0.4em] shadow-2xl shadow-primary/20 rounded-[2rem] group relative overflow-hidden active:scale-95 transition-all">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                            {state.status === "loading" ? (
                                <><Loader2 className="mr-3 h-5 w-5 animate-spin" /> Running neural scan...</>
                            ) : (
                                <><ShieldCheck className="mr-3 h-5 w-5" /> Start forensic audit</>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </motion.div>

        <div ref={reportRef} className="space-y-8 scroll-mt-20">
            <div className="flex flex-col items-center gap-4 mb-4">
                <ChevronDown className="h-8 w-8 text-primary animate-bounce opacity-20" />
                <Badge variant="outline" className="font-black text-[10px] uppercase tracking-widest bg-primary/5 text-primary border-primary/10 px-6 py-2 rounded-full">Report node</Badge>
            </div>

            <Card className="glass border-primary/20 shadow-3xl rounded-[3rem] overflow-hidden relative min-h-[600px] flex flex-col bg-card">
                <div className="absolute inset-0 p-12 opacity-[0.02] pointer-events-none grayscale flex items-center justify-center">
                    <Logo className="h-[600px] w-[600px] border-none p-0" priority={false} />
                </div>

                <CardHeader className={cn(
                    "p-8 sm:p-12 relative z-10 transition-colors duration-700 border-b border-primary/10",
                    state.status === 'success' ? "bg-primary text-primary-foreground" : "bg-muted/30 text-foreground"
                )}>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 text-left">
                        <div className="space-y-6 text-left flex-1 min-w-0">
                            <div className="flex items-center gap-4">
                                <div className={cn(
                                    "flex items-center gap-3 px-4 py-1.5 rounded-full border shadow-sm",
                                    state.status === 'success' ? "bg-white/10 border-white/20" : "bg-background border-primary/5"
                                )}>
                                    <Bot className={cn("h-4 w-4", state.status === 'success' ? "text-white" : "text-primary")} />
                                    <span className={cn("text-[10px] font-bold uppercase", state.status === 'success' ? "text-white" : "text-primary")}>
                                        {state.status === 'success' ? "Scan complete" : "Awaiting scan"}
                                    </span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <CardTitle className="text-xl sm:text-3xl font-black font-headline leading-none uppercase">
                                    {state.status === 'success' ? "Statutory report ready" : "Awaiting instrument"}
                                </CardTitle>
                                <div className={cn(
                                    "text-[11px] font-medium flex items-center gap-3",
                                    state.status === 'success' ? "text-white/70" : "text-muted-foreground"
                                )}>
                                    <ShieldCheck className="h-4 w-4" /> End-to-end encrypted session
                                </div>
                            </div>
                        </div>
                        
                        {state.status === 'success' && (
                            <div className="flex flex-wrap items-center gap-4 shrink-0">
                                <Button 
                                    variant="secondary" 
                                    size="sm" 
                                    onClick={handleReset}
                                    className="h-12 px-8 rounded-2xl font-black text-[10px] uppercase tracking-widest gap-3 shadow-2xl active:scale-95"
                                >
                                    <PlusCircle className="h-4 w-4" /> New scan
                                </Button>
                                <AudioAssistant 
                                    text={`${state.data?.summary}. Risks identified: ${state.data?.legalRisks}.`} 
                                    language={selectedLanguage} 
                                />
                            </div>
                        )}
                    </div>
                </CardHeader>
                
                <CardContent className="p-10 sm:p-16 flex-1 relative z-10">
                    <AnimatePresence mode="wait">
                        {state.status === 'loading' ? (
                            <motion.div 
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center justify-center h-full py-24 text-center gap-12"
                            >
                                <div className="relative w-fit mx-auto">
                                    <Loader2 className="h-24 w-24 animate-spin text-primary opacity-20" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Activity className="h-10 w-10 text-primary animate-pulse" />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <p className="font-black text-3xl tracking-tighter uppercase text-foreground">Analyzing instrument...</p>
                                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground animate-pulse">Deconstructing statutory clauses...</p>
                                </div>
                            </motion.div>
                        ) : state.status === "success" && state.data ? (
                            <motion.div 
                                key="report-content"
                                initial={{ opacity: 0, y: 20 }} 
                                animate={{ opacity: 1, y: 0 }} 
                                className="space-y-16 pb-12 text-left"
                            >
                                <div className="p-10 glass rounded-[3rem] border border-primary/10 shadow-inner bg-primary/[0.02] relative overflow-hidden">
                                    <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-primary"></div>
                                    <div className="flex items-center gap-3 mb-6 text-primary opacity-40">
                                        <Fingerprint className="h-6 w-6" />
                                        <span className="text-[11px] font-black uppercase tracking-[0.4em]">Registry summary</span>
                                    </div>
                                    <p className="text-xl sm:text-2xl text-foreground font-black leading-tight tracking-tight uppercase">{state.data.summary}</p>
                                </div>
                                
                                <div className="grid md:grid-cols-2 gap-10 text-left">
                                    <Card className="bg-red-500/[0.03] rounded-[2.5rem] border border-red-500/10 p-10 shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden">
                                        <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-red-500"></div>
                                        <h3 className="text-[11px] font-black text-red-600 uppercase tracking-[0.4em] mb-8 flex items-center gap-4">
                                            <AlertTriangle className="h-5 w-5" /> Risk indicators
                                        </h3>
                                        <p className="text-sm font-bold text-muted-foreground leading-loose">{state.data.legalRisks}</p>
                                    </Card>
                                    <Card className="bg-amber-500/[0.03] rounded-[2.5rem] border border-amber-500/10 p-10 shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden">
                                        <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-amber-500"></div>
                                        <h3 className="text-[11px] font-black text-amber-600 uppercase tracking-[0.4em] mb-8 flex items-center gap-4">
                                            <CalendarClock className="h-5 w-5" /> Statutory dates
                                        </h3>
                                        <p className="text-sm font-bold text-muted-foreground leading-loose">{state.data.deadlines}</p>
                                    </Card>
                                </div>

                                <div className="p-10 sm:p-12 bg-background rounded-[4rem] border border-primary/10 shadow-3xl relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                                        <Search className="h-40 w-40" />
                                    </div>
                                    <h3 className="text-[11px] font-black text-primary uppercase tracking-[0.4em] mb-8 flex items-center gap-4 relative z-10">
                                        <ListChecks className="h-6 w-6" /> Action roadmap
                                    </h3>
                                    <div className="prose dark:prose-invert max-w-none relative z-10">
                                        <p className="text-sm sm:text-base font-bold text-muted-foreground leading-relaxed whitespace-pre-line">{state.data.requiredActions}</p>
                                    </div>
                                </div>

                                <div className="pt-12 mt-12 border-t border-primary/5 flex flex-col sm:flex-row items-center justify-between gap-10 opacity-30">
                                    <div className="flex items-center gap-5">
                                        <div className="p-4 rounded-2xl bg-muted text-foreground shadow-inner">
                                            <ShieldCheck className="h-7 w-7" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-[11px] font-black uppercase tracking-widest">Statutory security</p>
                                            <p className="text-[10px] font-bold">This terminal is protected under TLS 1.3 protocol.</p>
                                        </div>
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.6em]">NYAYASAHAYAK.IN // SCAN-OS</p>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="idle" 
                                initial={{ opacity: 0, scale: 0.95 }} 
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center justify-center py-40 text-center gap-12"
                            >
                                <div className="relative">
                                    <div className="absolute -inset-8 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
                                    <div className="p-12 rounded-[3rem] bg-muted/30 border border-primary/5 relative z-10 transition-transform group-hover:scale-110 duration-700">
                                        <FileSearch className="h-24 w-24 text-primary opacity-20 group-hover:opacity-40 transition-opacity" />
                                    </div>
                                </div>
                                <div className="space-y-6 max-w-md px-8 text-center">
                                    <h3 className="font-black text-4xl tracking-tighter uppercase text-foreground leading-none">Ready for scan</h3>
                                    <p className="text-[11px] text-muted-foreground font-black uppercase tracking-[0.3em] leading-relaxed italic opacity-40">
                                        Upload a legal instrument to initialize the neural forensic audit.
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </CardContent>
                <div className="h-3 w-full bg-gradient-to-r from-primary via-accent to-blue-400"></div>
            </Card>
        </div>
    </div>
  );
}
