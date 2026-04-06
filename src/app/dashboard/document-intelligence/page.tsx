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
  // unwrap params to avoid enumeration error
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
    <div className="space-y-6 max-w-6xl mx-auto pb-20 px-2 sm:px-0 text-left">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-primary/5 pb-4">
            <PageHeader
            title="Document Intelligence"
            description="Institutional-grade AI deconstruction for statutory document risk assessment."
            />
            <Button variant="ghost" size="sm" className="rounded-xl font-bold hover:bg-primary/5 group h-9 px-4 border border-primary/5 text-primary text-[10px] uppercase tracking-widest" asChild>
            <Link href="/dashboard">
                <ArrowLeft className="mr-2 h-3 w-3 transition-transform group-hover:-translate-x-1" /> Back
            </Link>
            </Button>
        </motion.div>

        <motion.div 
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-3xl mx-auto"
        >
            <Card className="glass shadow-2xl overflow-hidden rounded-[2rem] border-primary/5">
                <CardHeader className="bg-primary/5 border-b border-primary/10 p-6 text-left">
                    <div className="flex items-center gap-3 mb-1 text-primary">
                        <FileUp className="h-5 w-5" />
                        <CardTitle className="text-lg font-black uppercase tracking-tight text-left">Ingestion Hub</CardTitle>
                    </div>
                    <CardDescription className="text-[10px] font-bold uppercase tracking-widest opacity-60">Secured forensic document transmission.</CardDescription>
                </CardHeader>
                <CardContent className="p-6 sm:p-8">
                    <form action={formAction} className="space-y-6 text-left">
                        <div className="space-y-3">
                            <Label htmlFor="document" className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">Statutory Registry</Label>
                            <div className="relative group">
                                <div className="absolute inset-0 bg-primary/5 rounded-xl transition-all group-hover:bg-primary/10 border border-primary/10 pointer-events-none"></div>
                                <Input 
                                    id="document" 
                                    name="document" 
                                    type="file" 
                                    required 
                                    onChange={handleFileChange}
                                    ref={fileInputRef}
                                    accept=".pdf,.doc,.docx,image/*"
                                    className="h-20 opacity-0 cursor-pointer relative z-10"
                                />
                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 pointer-events-none">
                                    <FileText className="h-5 w-5 text-primary opacity-40 group-hover:scale-110 transition-transform" />
                                    <p className="text-[10px] font-bold text-muted-foreground">
                                        {fileName ? fileName : "Upload statutory document"}
                                    </p>
                                </div>
                            </div>
                            {fileName && (
                                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 p-3 bg-green-500/5 rounded-lg border border-green-500/10">
                                    <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                                    <p className="text-[10px] font-bold text-green-600 truncate flex-1">{fileName}</p>
                                    <button type="button" onClick={() => { setFileName(""); if(fileInputRef.current) fileInputRef.current.value=""; }} className="text-muted-foreground hover:text-destructive active:scale-90">
                                        <X className="h-3.5 w-3.5" />
                                    </button>
                                </motion.div>
                            )}
                        </div>

                        <div className="space-y-3">
                            <Label htmlFor="language" className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1 flex items-center gap-2">
                                <Languages className="h-3 w-3" /> Audit Language Node
                            </Label>
                            <Select name="language" defaultValue={selectedLanguage} onValueChange={setSelectedLanguage} required>
                                <SelectTrigger id="language" className="h-11 glass border-primary/5 font-bold rounded-xl">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="glass border-primary/5 rounded-xl">
                                    <SelectItem value="English" className="font-bold">English</SelectItem>
                                    <SelectItem value="Hindi" className="font-bold">Hindi</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Button type="submit" disabled={state.status === "loading"} className="w-full h-14 text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 rounded-xl group">
                            {state.status === "loading" ? (
                                <><Loader2 className="mr-3 h-4 w-4 animate-spin" /> Auditing Node...</>
                            ) : (
                                <><ShieldCheck className="mr-3 h-4 w-4" /> Initialize Document Audit</>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </motion.div>

        <div ref={reportRef} className="space-y-6 scroll-mt-10">
            <Card className="glass border-primary/20 shadow-3xl rounded-[2.5rem] overflow-hidden relative min-h-[500px] flex flex-col">
                <CardHeader className={cn(
                    "p-6 sm:p-8 relative z-10 transition-colors duration-500",
                    state.status === 'success' ? "bg-primary text-primary-foreground" : "bg-primary/5 text-foreground"
                )}>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 text-left">
                        <div className="space-y-2 text-left flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                                <div className={cn(
                                    "flex items-center gap-2 px-2.5 py-0.5 rounded-full border",
                                    state.status === 'success' ? "bg-white/10 border-white/20" : "bg-primary/10 border-primary/20"
                                )}>
                                    <Bot className={cn("h-3.5 w-3.5", state.status === 'success' ? "text-white" : "text-primary")} />
                                    <span className={cn("text-[9px] font-black uppercase tracking-widest", state.status === 'success' ? "text-white" : "text-primary")}>
                                        Forensic AI Audit
                                    </span>
                                </div>
                            </div>
                            <div className="space-y-0.5">
                                <CardTitle className="text-xl sm:text-3xl font-black uppercase tracking-tighter leading-none">
                                    {state.status === 'success' ? "Audit Dossier Ready" : "Awaiting Ingress"}
                                </CardTitle>
                                <p className={cn(
                                    "text-[9px] font-bold uppercase tracking-[0.3em] flex items-center gap-2",
                                    state.status === 'success' ? "text-white/60" : "text-muted-foreground"
                                )}>
                                    <Globe className="h-2.5 w-2.5" /> Statutory Node // NS-INTEL-ST-4.2
                                </p>
                            </div>
                        </div>
                        
                        {state.status === 'success' && (
                            <div className="flex flex-wrap items-center gap-2 shrink-0">
                                <Button 
                                    variant="secondary" 
                                    size="sm" 
                                    onClick={handleReset}
                                    className="h-9 px-4 rounded-lg font-black text-[9px] uppercase tracking-widest gap-2 shadow-lg"
                                >
                                    <PlusCircle className="h-3.5 w-3.5" /> Start New
                                </Button>
                                <AudioAssistant 
                                    text={`${state.data?.summary}. Legal risks: ${state.data?.legalRisks}.`} 
                                    language={selectedLanguage} 
                                />
                            </div>
                        )}
                    </div>
                </CardHeader>
                
                <CardContent className="p-6 sm:p-10 flex-1 relative z-10">
                    <AnimatePresence mode="wait">
                        {state.status === 'loading' ? (
                            <motion.div 
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center justify-center h-[300px] text-center gap-6"
                            >
                                <Loader2 className="h-10 w-10 animate-spin text-primary opacity-20" />
                                <div className="space-y-2">
                                    <p className="font-black text-xl tracking-tighter uppercase text-foreground leading-none">Deconstructing Clauses...</p>
                                    <p className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground animate-pulse">Forensic scan in progress...</p>
                                </div>
                            </motion.div>
                        ) : state.status === "success" && state.data ? (
                            <motion.div 
                                key="report-content"
                                initial={{ opacity: 0, y: 10 }} 
                                animate={{ opacity: 1, y: 0 }} 
                                className="space-y-8 pb-6 text-left"
                            >
                                <div className="p-6 bg-primary/5 rounded-2xl border border-primary/10 shadow-inner">
                                    <div className="flex items-center gap-2 mb-3 text-primary opacity-40">
                                        <Fingerprint className="h-3.5 w-3.5" />
                                        <span className="text-[9px] font-black uppercase tracking-widest">Executive Summary</span>
                                    </div>
                                    <p className="text-xs sm:text-sm text-foreground font-black leading-relaxed tracking-tight">{state.data.summary}</p>
                                </div>
                                
                                <div className="grid sm:grid-cols-2 gap-6 text-left">
                                    <Card className="bg-red-500/[0.03] rounded-2xl border-red-500/10 p-6 shadow-sm">
                                        <h3 className="text-[9px] font-black text-red-600 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                                            <AlertTriangle className="h-3.5 w-3.5" /> Forensic Risks
                                        </h3>
                                        <p className="text-xs font-bold text-muted-foreground leading-relaxed">{state.data.legalRisks}</p>
                                    </Card>
                                    <Card className="bg-amber-500/[0.03] rounded-2xl border-amber-500/10 p-6 shadow-sm">
                                        <h3 className="text-[9px] font-black text-amber-600 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                                            <CalendarClock className="h-3.5 w-3.5" /> Critical Timelines
                                        </h3>
                                        <p className="text-xs font-bold text-muted-foreground leading-relaxed">{state.data.deadlines}</p>
                                    </Card>
                                </div>

                                <div className="p-6 bg-background rounded-2xl border border-primary/10 shadow-lg">
                                    <h3 className="text-[9px] font-black text-primary uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                                        <ListChecks className="h-3.5 w-3.5" /> Recommended Strategy
                                    </h3>
                                    <p className="text-xs font-bold text-muted-foreground leading-relaxed whitespace-pre-line">{state.data.requiredActions}</p>
                                </div>

                                <div className="pt-6 border-t border-primary/5 flex flex-col sm:flex-row items-center justify-between gap-4 opacity-40">
                                    <div className="flex items-center gap-3">
                                        <ShieldCheck className="h-4 w-4 text-primary" />
                                        <p className="text-[8px] font-black uppercase tracking-widest leading-none">Statutory Security Protected</p>
                                    </div>
                                    <p className="text-[8px] font-black uppercase tracking-[0.5em]">NYAYASAHAYAK.IN</p>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="idle" 
                                initial={{ opacity: 0 }} 
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-center justify-center h-[300px] text-center gap-6"
                            >
                                <div className="p-8 rounded-full bg-muted/30 border border-primary/5 opacity-20">
                                    <FileSearch className="h-12 w-12 text-primary" />
                                </div>
                                <div className="space-y-2 max-w-xs px-6 text-center">
                                    <h3 className="font-black text-xl tracking-tighter uppercase text-foreground leading-none">Awaiting Ingress</h3>
                                    <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-[0.2em] leading-relaxed italic opacity-60">
                                        Upload a document to initialize forensic AI scanning.
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
