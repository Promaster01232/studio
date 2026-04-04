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
  AlertTriangle, 
  Lightbulb, 
  Search, 
  Landmark, 
  Cpu,
  FileText,
  Clock,
  Globe,
  Fingerprint,
  PlusCircle,
  ChevronDown
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
  // Next.js 15: Explicitly unwrap dynamic properties to prevent enumeration errors
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
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-primary/5 pb-6 text-left">
            <PageHeader
            title="Case Strength Analysis"
            description="Authoritative AI audit of your case probability based on Indian statutory frameworks and precedents."
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
            className="max-w-4xl mx-auto"
        >
            <Card className="glass shadow-2xl overflow-hidden rounded-[2.5rem] border-primary/5">
                <CardHeader className="bg-primary/5 border-b border-primary/10 p-8 text-left">
                <div className="flex items-center gap-3 text-primary mb-2">
                    <BrainCircuit className="h-5 w-5" />
                    <CardTitle className="text-xl font-black uppercase tracking-tight text-left">Narrative Research Ingestion</CardTitle>
                </div>
                <CardDescription className="text-[10px] font-bold uppercase tracking-widest opacity-60">Provide case context for an exhaustive statutory audit.</CardDescription>
                </CardHeader>
                <CardContent className="p-8 sm:p-10">
                <form action={formAction} className="space-y-8 text-left">
                    <div className="space-y-3 text-left">
                    <Label htmlFor="caseDescription" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Case Description</Label>
                    <Textarea id="caseDescription" name="caseDescription" placeholder="Enter chronological events, evidence details, and party identities for a deep research report..." rows={8} required className="glass rounded-[2rem] p-6 text-sm font-medium leading-relaxed" />
                    </div>
                    
                    <div className="space-y-3 text-left">
                        <Label htmlFor="language" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Audit Protocol</Label>
                        <Select name="language" defaultValue={selectedLanguage} onValueChange={setSelectedLanguage} required>
                        <SelectTrigger id="language" className="h-12 glass border-primary/5 font-bold rounded-xl active:scale-95 transition-all">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="glass border-primary/5 rounded-[1.5rem]">
                            <SelectItem value="English" className="font-bold">English (Forensic)</SelectItem>
                            <SelectItem value="Hindi" className="font-bold">Hindi (Official)</SelectItem>
                        </SelectContent>
                        </Select>
                    </div>

                    <Button type="submit" disabled={state.status === 'loading'} className="w-full h-16 text-xs font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/20 transition-all active:scale-95 rounded-[1.5rem]">
                    {state.status === 'loading' ? (
                        <><Loader2 className="mr-3 h-5 w-5 animate-spin" /> Analyzing Litigation Success Probability...</>
                    ) : (
                        <><Sparkles className="mr-3 h-5 w-5" /> Run Strength Audit</>
                    )}
                    </Button>
                </form>
                </CardContent>
            </Card>
        </motion.div>

        <div ref={reportRef} className="space-y-8 scroll-mt-20">
            <div className="flex flex-col items-center gap-4 mb-4">
                <ChevronDown className="h-8 w-8 text-primary animate-bounce opacity-40" />
                <Badge variant="outline" className="font-black text-[9px] uppercase tracking-widest bg-primary/5 text-primary border-primary/10 px-4 py-1.5 rounded-full">Statutory Strength Node</Badge>
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
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "flex items-center gap-2 px-3 py-1 rounded-full border",
                                    state.status === 'success' ? "bg-white/10 border-white/20" : "bg-primary/10 border-primary/20"
                                )}>
                                    <BrainCircuit className={cn("h-4 w-4", state.status === 'success' ? "text-white" : "text-primary")} />
                                    <span className={cn("text-[10px] font-black uppercase tracking-widest", state.status === 'success' ? "text-white" : "text-primary")}>
                                        Forensic Strength Audit Active
                                    </span>
                                </div>
                                <Badge variant="outline" className={cn(
                                    "text-[9px] font-black uppercase tracking-[0.2em]",
                                    state.status === 'success' ? "border-white/20 text-white/80" : "border-primary/20 text-primary/60"
                                )}>
                                    NS-STRENGTH-ALPHA-4.2
                                </Badge>
                                {state.isSimulated && (
                                    <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-[9px] font-black uppercase tracking-widest">
                                        <Cpu className="h-3 w-3 mr-1.5" /> Local Node Fallback
                                    </Badge>
                                )}
                            </div>
                            <div className="space-y-1">
                                <CardTitle className="text-3xl sm:text-5xl font-black uppercase tracking-tighter leading-none">
                                    {state.status === 'success' ? <><span className="italic opacity-80">Strength Dossier</span> Ready.</> : "Awaiting Ingress"}
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
                                    text={`${state.data?.summary}. Score: ${state.data?.strengthScore} percent.`} 
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
                                    <p className="font-black text-2xl tracking-tighter uppercase text-foreground">Executing Deep Research...</p>
                                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground animate-pulse">Scanning statutory precedents & simulating outcomes...</p>
                                </div>
                            </motion.div>
                        ) : state.status === "success" && state.data ? (
                            <motion.div 
                                key="report-content"
                                initial={{ opacity: 0, y: 20 }} 
                                animate={{ opacity: 1, y: 0 }} 
                                className="space-y-16 pb-10 text-left"
                            >
                                <div className="flex flex-col md:flex-row items-center gap-12 sm:gap-20">
                                    <div className="relative h-48 w-48 sm:h-64 sm:w-64 flex items-center justify-center shrink-0 group">
                                        <div className="absolute -inset-4 bg-primary/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                        <svg className="h-full w-full transform -rotate-90 relative z-10">
                                            <circle cx="50%" cy="50%" r="45%" className="stroke-muted/20 fill-none" strokeWidth="12" />
                                            <motion.circle 
                                                initial={{ strokeDasharray: "0 282" }}
                                                animate={{ strokeDasharray: `${state.data.strengthScore * 2.82} 282` }}
                                                transition={{ duration: 1.5, ease: "easeOut" }}
                                                cx="50%" cy="50%" r="45%" 
                                                className={cn("fill-none", state.data.strengthScore <= 30 ? "stroke-red-500" : state.data.strengthScore <= 65 ? "stroke-yellow-500" : "stroke-green-500")} 
                                                strokeWidth="12" 
                                                strokeLinecap="round" 
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-20">
                                            <span className="text-5xl sm:text-7xl font-black font-mono tracking-tighter">{state.data.strengthScore}%</span>
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Audit Probability</span>
                                        </div>
                                    </div>
                                    <div className="flex-1 space-y-6 text-center md:text-left">
                                        <div className="space-y-2">
                                            <Badge className={cn("px-4 py-1 rounded-full font-black text-[10px] uppercase tracking-[0.2em]", 
                                                state.data.strengthScore <= 30 ? "bg-red-500/10 text-red-600 border-red-500/20" : state.data.strengthScore <= 65 ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" : "bg-green-500/10 text-green-600 border-green-500/20")}>
                                                Litigation Category: {state.data.strengthScore <= 30 ? "High Procedural Risk" : state.data.strengthScore <= 65 ? "Statutory Moderate" : "Research Optimized"}
                                            </Badge>
                                            <h3 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter leading-none">Executive <span className="text-primary italic">Summary</span></h3>
                                        </div>
                                        <p className="text-lg sm:text-xl font-bold leading-relaxed text-foreground/80 max-w-2xl">
                                            {state.data.summary}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8 text-left">
                                    <Card className="bg-red-500/[0.03] rounded-[2.5rem] border-red-500/10 p-8 sm:p-10 shadow-inner group transition-all hover:bg-red-500/[0.06]">
                                        <div className="flex items-center justify-between mb-8">
                                            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-red-600 flex items-center gap-3">
                                                <ShieldAlert className="h-5 w-5" /> Forensic Risk Indicators
                                            </h3>
                                            <Fingerprint className="h-5 w-5 text-red-600/20" />
                                        </div>
                                        <div className="space-y-4">
                                            {state.data.riskIndicators.map((risk, idx) => (
                                                <div key={idx} className="flex gap-4 p-5 rounded-2xl bg-white dark:bg-zinc-950 border border-red-500/10 text-sm font-bold leading-relaxed text-foreground/80 shadow-sm group-hover:scale-[1.02] transition-transform text-left">
                                                    <div className="h-2 w-2 rounded-full bg-red-500 mt-1.5 shrink-0 animate-pulse" />
                                                    {risk}
                                                </div>
                                            ))}
                                        </div>
                                    </Card>
                                    <Card className="bg-green-500/[0.03] rounded-[2.5rem] border-green-500/10 p-8 sm:p-10 shadow-inner group transition-all hover:bg-green-500/[0.06]">
                                        <div className="flex items-center justify-between mb-8">
                                            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-green-600 flex items-center gap-3">
                                                <Lightbulb className="h-5 w-5" /> Recommended Protocols
                                            </h3>
                                            <CheckCircle2 className="h-5 w-5 text-green-600/20" />
                                        </div>
                                        <div className="space-y-4">
                                            {state.data.recommendedActions.map((action, idx) => (
                                                <div key={idx} className="flex gap-4 p-5 rounded-2xl bg-white dark:bg-zinc-950 border border-green-500/10 text-sm font-bold leading-relaxed text-foreground/80 shadow-sm group-hover:scale-[1.02] transition-transform text-left">
                                                    <div className="h-2 w-2 rounded-full bg-green-500 mt-1.5 shrink-0" />
                                                    {action}
                                                </div>
                                            ))}
                                        </div>
                                    </Card>
                                </div>

                                <div className="space-y-10 text-left border-t border-primary/10 pt-16">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                                        <div className="flex items-center gap-4">
                                            <div className="p-4 rounded-[1.2rem] bg-primary/10 text-primary shadow-lg">
                                                <Search className="h-7 w-7" />
                                            </div>
                                            <div className="text-left space-y-1">
                                                <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-none uppercase">Research Deep-Dive</h3>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                                    <Clock className="h-3 w-3" /> Audit Reference // NS-RESEARCH-V4.2
                                                </p>
                                            </div>
                                        </div>
                                        <Button variant="outline" className="rounded-xl font-bold h-11 px-6 border-primary/10 text-[10px] uppercase tracking-widest gap-2 hover:bg-primary/5">
                                            <FileText className="h-4 w-4" /> Export Statutory Log
                                        </Button>
                                    </div>
                                    <div className="p-8 sm:p-12 bg-muted/20 rounded-[3rem] border border-primary/5 shadow-inner relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-700">
                                            <FileText className="h-32 w-32" />
                                        </div>
                                        <div className="text-sm sm:text-base font-medium leading-loose text-foreground/90 whitespace-pre-line text-left prose dark:prose-invert max-w-none relative z-10">
                                            {state.data.forensicResearch}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="pt-10 mt-10 border-t border-primary/5 flex flex-col sm:flex-row items-center justify-between gap-8 opacity-40">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-2xl bg-primary/5 text-primary">
                                            <ShieldCheck className="h-6 w-6" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-[10px] font-black uppercase tracking-widest">Statutory Security</p>
                                            <p className="text-[9px] font-bold">This node is protected under attorney-client transience.</p>
                                        </div>
                                    </div>
                                    <p className="text-[9px] font-black uppercase tracking-[0.5em]">NYAYASAHAYAK.IN // TERMINAL NS-STRENGTH</p>
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
                                        <BrainCircuit className="h-20 w-20 text-primary opacity-20" />
                                    </div>
                                </div>
                                <div className="space-y-4 max-w-sm px-6 text-center">
                                    <h3 className="font-black text-3xl tracking-tighter uppercase text-foreground leading-none">Awaiting Ingress</h3>
                                    <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-[0.2em] leading-relaxed italic opacity-60">
                                        Provide your case narrative to initialize the 20-stage deep neural research protocol.
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
