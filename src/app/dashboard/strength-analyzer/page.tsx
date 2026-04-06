
"use client";

import { useActionState, useEffect, useState, use, useRef } from "react";
import { analyzeCaseStrengthAction, type CaseStrengthState } from "./actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Loader2, 
  Sparkles, 
  ArrowLeft, 
  BrainCircuit, 
  ShieldCheck, 
  ShieldAlert, 
  Activity, 
  CheckCircle2, 
  Lightbulb, 
  Search, 
  Cpu,
  FileText,
  Clock,
  Globe,
  PlusCircle,
  ChevronDown,
  FileSearch,
  FileCheck
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AudioAssistant } from "@/components/audio-assistant";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useFirestore, useAuth } from "@/firebase";
import { doc, updateDoc, increment } from "firebase/firestore";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";

const initialState: CaseStrengthState = {
  status: "idle",
  data: null,
  error: null,
};

export default function StrengthAnalyzerPage(props: { params: Promise<any>, searchParams: Promise<any> }) {
  use(props.params);
  use(props.searchParams);

  const [state, formAction] = useActionState(analyzeCaseStrengthAction, initialState);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const reportRef = useRef<HTMLDivElement>(null);
  
  const firestore = useFirestore();
  const auth = useAuth();

  useEffect(() => {
    if (state.status === "success" && state.data) {
      if (auth.currentUser) {
          const userRef = doc(firestore, "users", auth.currentUser.uid);
          updateDoc(userRef, { aiUsageCount: increment(1) }).catch(console.error);
      }
      setTimeout(() => {
        reportRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    }
  }, [state.status, state.data, auth.currentUser, firestore]);

  const handleReset = () => {
      window.location.reload();
  };

  return (
    <div className="space-y-10 max-w-6xl mx-auto pb-32 px-4 sm:px-0 text-left">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-primary/5 pb-6">
            <PageHeader
            title="Strength Matrix"
            description="Institutional probability modeling for statutory litigation success."
            />
            <Button variant="ghost" size="sm" className="rounded-xl font-bold hover:bg-primary/5 group h-10 px-6 border border-primary/5 text-primary text-[10px] uppercase tracking-widest" asChild>
            <Link href="/dashboard">
                <ArrowLeft className="mr-2 h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" /> Back to Terminal
            </Link>
            </Button>
        </motion.div>

        <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-3xl mx-auto"
        >
            <Card className="glass shadow-2xl rounded-[2.5rem] overflow-hidden border-primary/5">
                <CardHeader className="bg-primary/5 border-b border-primary/10 p-8 text-left">
                <div className="flex items-center gap-3 mb-2 text-primary">
                    <BrainCircuit className="h-5 w-5" />
                    <CardTitle className="text-xl font-black uppercase tracking-tight">Narrative Ingress</CardTitle>
                </div>
                <CardDescription className="text-[10px] font-bold uppercase tracking-widest opacity-60">Provide detailed chronological facts for audit.</CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                <form action={formAction} className="space-y-8 text-left">
                    <div className="space-y-3">
                    <Label htmlFor="caseDescription" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Statutory Narrative</Label>
                    <Textarea id="caseDescription" name="caseDescription" placeholder="Enter sequence of events, evidence IDs, and party names..." rows={6} required className="glass rounded-[1.5rem] font-medium text-base p-6 shadow-inner min-h-[150px]" />
                    </div>
                    
                    <div className="space-y-3">
                        <Label htmlFor="language" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Forensic Dialect</Label>
                        <Select name="language" defaultValue={selectedLanguage} onValueChange={setSelectedLanguage} required>
                        <SelectTrigger id="language" className="h-12 glass border-primary/5 font-bold rounded-xl active:scale-95 transition-all">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="glass border-primary/5 rounded-[1.5rem]">
                            <SelectItem value="English" className="font-bold">English Protocol</SelectItem>
                            <SelectItem value="Hindi" className="font-bold">Hindi Protocol</SelectItem>
                        </SelectContent>
                        </Select>
                    </div>

                    <Button type="submit" disabled={state.status === 'loading'} className="w-full h-16 text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 transition-all active:scale-95 rounded-[1.5rem] group overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                        {state.status === 'loading' ? (
                            <><Loader2 className="mr-3 h-5 w-5 animate-spin" /> Deconstructing Matrix...</>
                        ) : (
                            <><Sparkles className="mr-3 h-5 w-5" /> Initialize Forensic Audit</>
                        )}
                    </Button>
                </form>
                </CardContent>
            </Card>
        </motion.div>

        <div ref={reportRef} className="space-y-8 scroll-mt-20">
            <div className="flex flex-col items-center gap-4 mb-4">
                <ChevronDown className="h-8 w-8 text-primary animate-bounce opacity-40" />
                <Badge variant="outline" className="font-black text-[9px] uppercase tracking-widest bg-primary/5 text-primary border-primary/10 px-4 py-1.5 rounded-full">Statutory Audit Node</Badge>
            </div>

            <Card className="glass border-primary/20 shadow-3xl overflow-hidden rounded-[3rem] relative min-h-[600px] flex flex-col">
                <div className="absolute inset-0 p-12 opacity-[0.02] pointer-events-none grayscale flex items-center justify-center">
                    <Logo className="h-[600px] w-[600px] border-none p-0" priority={false} />
                </div>

                <CardHeader className={cn(
                    "p-8 sm:p-12 relative z-10 transition-colors duration-500",
                    state.status === 'success' ? "bg-primary text-primary-foreground" : "bg-primary/5 text-foreground"
                )}>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 text-left">
                        <div className="space-y-4 text-left flex-1 min-w-0">
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "flex items-center gap-2 px-3 py-1 rounded-full border",
                                    state.status === 'success' ? "bg-white/10 border-white/20" : "bg-primary/10 border-primary/20"
                                )}>
                                    <FileCheck className={cn("h-4 w-4", state.status === 'success' ? "text-white" : "text-primary")} />
                                    <span className={cn("text-[10px] font-black uppercase tracking-widest", state.status === 'success' ? "text-white" : "text-primary")}>
                                        Official AI Report Node
                                    </span>
                                </div>
                                <Badge variant="outline" className={cn(
                                    "text-[9px] font-black uppercase tracking-[0.2em]",
                                    state.status === 'success' ? "border-white/20 text-white/80" : "border-primary/20 text-primary/60"
                                )}>
                                    NS-MATX-ST-4.2
                                </Badge>
                            </div>
                            <div className="space-y-1">
                                <CardTitle className="text-3xl sm:text-5xl font-black uppercase tracking-tighter leading-none">
                                    {state.status === 'success' ? <><span className="italic opacity-80">Audit Dossier</span> Ready.</> : "Awaiting Ingress"}
                                </CardTitle>
                                <p className={cn(
                                    "text-[10px] font-bold uppercase tracking-[0.3em] flex items-center gap-2",
                                    state.status === 'success' ? "text-white/60" : "text-muted-foreground"
                                )}>
                                    <Globe className="h-3 w-3" /> Secure Session: Encrypted // Transience Active
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
                                    <PlusCircle className="h-4 w-4" /> Start New Audit
                                </Button>
                                <AudioAssistant 
                                    text={`${state.data?.summary}. Strength Score is ${state.data?.strengthScore} percent.`} 
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
                                    <p className="font-black text-2xl tracking-tighter uppercase text-foreground">Running Forensic Audit...</p>
                                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground animate-pulse">Calculating success probability nodes...</p>
                                </div>
                            </motion.div>
                        ) : state.status === "success" && state.data ? (
                            <motion.div 
                                key="report-content" 
                                initial={{ opacity: 0, y: 20 }} 
                                animate={{ opacity: 1, y: 0 }} 
                                className="space-y-12 pb-10 text-left"
                            >
                                <div className="flex flex-col lg:flex-row items-center gap-12">
                                    <div className="relative h-56 w-56 flex items-center justify-center shrink-0">
                                        <svg className="h-full w-full transform -rotate-90">
                                            <circle cx="50%" cy="50%" r="45%" className="stroke-muted/10 fill-none" strokeWidth="12" />
                                            <motion.circle 
                                                initial={{ strokeDasharray: "0 314" }}
                                                animate={{ strokeDasharray: `${state.data.strengthScore * 3.14} 314` }}
                                                transition={{ duration: 2, ease: "easeOut" }}
                                                cx="50%" cy="50%" r="45%" 
                                                className={cn("fill-none drop-shadow-2xl", state.data.strengthScore <= 30 ? "stroke-red-500" : state.data.strengthScore <= 65 ? "stroke-amber-500" : "stroke-green-500")} 
                                                strokeWidth="12" 
                                                strokeLinecap="round" 
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                            <span className="text-6xl font-black tracking-tighter">{state.data.strengthScore}%</span>
                                            <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Success Probability</span>
                                        </div>
                                    </div>
                                    <div className="flex-1 space-y-6 text-left">
                                        <div className="flex items-center gap-3 text-primary opacity-40">
                                            <Fingerprint className="h-5 w-5" />
                                            <span className="text-[11px] font-black uppercase tracking-widest">Executive Audit Summary</span>
                                        </div>
                                        <p className="text-lg sm:text-2xl font-black leading-tight tracking-tight text-foreground">{state.data.summary}</p>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8">
                                    <Card className="p-8 glass rounded-[2.5rem] border-red-500/10 text-left bg-red-500/[0.02] shadow-sm hover:shadow-xl transition-all group">
                                        <h3 className="text-[11px] font-black text-red-600 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                                            <ShieldAlert className="h-4 w-4" /> Forensic Risk Nodes
                                        </h3>
                                        <ul className="space-y-4">
                                            {state.data.riskIndicators.map((r, i) => (
                                                <li key={i} className="text-sm font-bold flex gap-3 text-muted-foreground">
                                                    <div className="h-1.5 w-1.5 rounded-full bg-red-500 mt-2 shrink-0 group-hover:animate-ping" />
                                                    {r}
                                                </li>
                                            ))}
                                        </ul>
                                    </Card>
                                    <Card className="p-8 glass rounded-[2.5rem] border-primary/10 text-left bg-primary/[0.02] shadow-sm hover:shadow-xl transition-all group">
                                        <h3 className="text-[11px] font-black text-primary uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                                            <Lightbulb className="h-4 w-4" /> Statutory Hardening
                                        </h3>
                                        <ul className="space-y-4">
                                            {state.data.recommendedActions.map((a, i) => (
                                                <li key={i} className="text-sm font-bold flex gap-3 text-muted-foreground">
                                                    <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0 group-hover:animate-ping" />
                                                    {a}
                                                </li>
                                            ))}
                                        </ul>
                                    </Card>
                                </div>

                                <div className="space-y-6 text-left">
                                    <div className="flex items-center justify-between border-b border-primary/10 pb-4">
                                        <h3 className="text-[11px] font-black text-primary uppercase tracking-[0.3em] flex items-center gap-3">
                                            <FileSearch className="h-5 w-5" /> Deconstructed Research
                                        </h3>
                                    </div>
                                    <div className="p-8 sm:p-12 glass rounded-[3rem] border-primary/10 text-sm sm:text-base font-medium leading-loose whitespace-pre-line text-left shadow-lg bg-muted/10 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] transition-opacity duration-700">
                                            <Logo className="h-64 w-64 grayscale" priority={false} />
                                        </div>
                                        {state.data.forensicResearch}
                                    </div>
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
                                    <p className="text-[9px] font-black uppercase tracking-[0.5em]">NYAYASAHAYAK.IN // TERMINAL ST-MATRIX</p>
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
                                        <Cpu className="h-20 w-20 text-primary opacity-40 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </div>
                                <div className="space-y-4 max-w-sm px-6 text-center">
                                    <h3 className="font-black text-3xl tracking-tighter uppercase text-foreground leading-none">Ready for Audit</h3>
                                    <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-[0.2em] leading-relaxed italic opacity-60">
                                        Initialize the forensic node by providing the statutory narrative for neural matrix analysis.
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
