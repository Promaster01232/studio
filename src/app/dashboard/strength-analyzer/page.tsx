"use client";

import { useActionState, useEffect, useState, use } from "react";
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
  PlusCircle
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
  // Unwrap dynamic props for Next.js 15 compliance
  use(props.params);
  use(props.searchParams);

  const [state, formAction] = useActionState(analyzeCaseStrengthAction, initialState);
  const [progress, setProgress] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  
  const firestore = useFirestore();
  const auth = useAuth();

  useEffect(() => {
    if (state.status === "success" && state.data) {
      const timer = setTimeout(() => setProgress(state.data!.strengthScore), 500);
      
      if (auth.currentUser) {
          const userRef = doc(firestore, "users", auth.currentUser.uid);
          updateDoc(userRef, { aiUsageCount: increment(1) }).catch(console.error);
      }
      return () => clearTimeout(timer);
    } else if (state.status === "loading" || state.status === "idle") {
        setProgress(0);
    }
  }, [state, auth.currentUser, firestore]);

  const handleReset = () => {
      window.location.reload();
  };

  return (
    <div className="space-y-10 max-w-6xl mx-auto pb-20 px-4 sm:px-0 text-left">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-primary/5 pb-8 text-left">
            <PageHeader
            title="Forensic Strength Matrix"
            description="Deep AI research and statutory assessment of litigation success probability."
            />
            <Button variant="ghost" size="sm" className="rounded-xl font-bold hover:bg-primary/5 group h-10 px-6 border border-primary/5 text-primary text-[10px] uppercase tracking-widest" asChild>
            <Link href="/dashboard">
                <ArrowLeft className="mr-2 h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" /> Back to Terminal
            </Link>
            </Button>
        </motion.div>

        <AnimatePresence mode="wait">
            {state.status !== 'success' ? (
                <motion.div 
                    key="input-form"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
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
                            <Label htmlFor="caseDescription" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Forensic Description</Label>
                            <Textarea id="caseDescription" name="caseDescription" placeholder="Enter chronological events, evidence details, and party identities for a deep research report..." rows={8} required className="glass rounded-[2rem] p-6 text-sm font-medium leading-relaxed" />
                            </div>
                            
                            <div className="space-y-3 text-left">
                                <Label htmlFor="language" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Audit Protocol</Label>
                                <Select name="language" defaultValue={selectedLanguage} onValueChange={setSelectedLanguage} required>
                                <SelectTrigger id="language" className="h-12 glass border-primary/5 font-bold rounded-xl">
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
                                <><Loader2 className="mr-3 h-5 w-5 animate-spin" /> Neural Research Node Active...</>
                            ) : (
                                <><Sparkles className="mr-3 h-5 w-5" /> Initialize Research Audit</>
                            )}
                            </Button>
                        </form>
                        </CardContent>
                    </Card>
                </motion.div>
            ) : null}
        </AnimatePresence>
        
        <AnimatePresence mode="wait">
            {state.status === 'loading' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-20 text-center space-y-8">
                    <div className="relative w-fit mx-auto">
                        <Loader2 className="h-20 w-20 animate-spin text-primary opacity-20" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Search className="h-8 w-8 text-primary animate-pulse" />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <p className="text-2xl font-black tracking-tight text-foreground uppercase">Executing Deep Forensic Research</p>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground animate-pulse">Scanning statutory precedents & simulating judicial outcomes...</p>
                    </div>
                </motion.div>
            )}

            {state.status === "success" && state.data && (
                <motion.div 
                    initial={{ opacity: 0, y: 40 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="space-y-10 text-left"
                >
                    <Card className="glass border-primary/20 shadow-3xl rounded-[3rem] overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none grayscale">
                            <Logo className="h-96 w-96 border-none p-0" priority={false} />
                        </div>

                        <CardHeader className="bg-primary/5 border-b border-primary/10 flex flex-col md:flex-row items-center justify-between p-8 sm:p-12 text-left gap-8 relative z-10">
                            <div className="space-y-4 text-left flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-3">
                                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                                        <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-primary">Official Statutory Record</span>
                                    </div>
                                    <Badge variant="outline" className="text-[9px] font-black uppercase tracking-[0.2em] border-primary/20 opacity-60">NS-STRENGTH-ALPHA-4.2</Badge>
                                    {state.isSimulated && (
                                        <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-[9px] font-black uppercase tracking-widest">
                                            <Cpu className="h-3 w-3 mr-1.5" /> Local Node Fallback
                                        </Badge>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <h1 className="text-2xl sm:text-4xl font-black tracking-tighter text-left leading-none uppercase">Forensic Strength <span className="text-primary italic">Dossier</span></h1>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em] flex items-center gap-2">
                                        <Globe className="h-3 w-3" /> System ID: {auth.currentUser?.uid.substring(0, 12).toUpperCase()} // Registry: BNS-COMPLIANT
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col items-center sm:items-end gap-4 shrink-0">
                                <div className="flex gap-3">
                                    <Button onClick={handleReset} variant="outline" size="sm" className="h-9 px-4 rounded-xl font-black text-[10px] uppercase tracking-widest gap-2 shadow-sm border-primary/10 hover:bg-primary/5">
                                        <PlusCircle className="h-4 w-4" /> New Audit
                                    </Button>
                                    <AudioAssistant 
                                        text={`${state.data.summary}. The case strength score is ${state.data.strengthScore} percent.`} 
                                        language={selectedLanguage} 
                                    />
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-background border border-primary/10 shadow-sm">
                                    <Activity className="h-3.5 w-3.5 text-green-500 animate-pulse" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-foreground">Audit Finalized</span>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="p-8 sm:p-16 space-y-16 text-left relative z-10">
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
                                        <h3 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter leading-tight">Executive <span className="text-primary italic">Summary</span></h3>
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
                                            <div key={idx} className="flex gap-4 p-5 rounded-2xl bg-white dark:bg-zinc-950 border border-red-500/10 text-sm font-bold leading-relaxed text-foreground/80 shadow-sm group-hover:scale-[1.02] transition-transform">
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
                                            <div key={idx} className="flex gap-4 p-5 rounded-2xl bg-white dark:bg-zinc-950 border border-green-500/10 text-sm font-bold leading-relaxed text-foreground/80 shadow-sm group-hover:scale-[1.02] transition-transform">
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
                                                <Clock className="h-3 w-3" /> Audit Reference // NS-RESEARCH-TOKEN-{Math.random().toString(36).substring(7).toUpperCase()}
                                            </p>
                                        </div>
                                    </div>
                                    <Button variant="outline" className="rounded-xl font-bold h-11 px-6 border-primary/10 text-[10px] uppercase tracking-widest gap-2">
                                        <FileText className="h-4 w-4" /> Export Statutory Log
                                    </Button>
                                </div>
                                <div className="p-8 sm:p-12 bg-muted/20 rounded-[3rem] border border-primary/5 shadow-inner relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                                        <FileText className="h-32 w-32" />
                                    </div>
                                    <div className="text-sm sm:text-base font-medium leading-loose text-foreground/90 whitespace-pre-line text-left prose dark:prose-invert max-w-none relative z-10">
                                        {state.data.forensicResearch}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <div className="h-2 w-full bg-gradient-to-r from-primary via-accent to-blue-400"></div>
                    </Card>
                </motion.div>
            )}

            {state.status === 'idle' && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-12">
                    <Card className="glass border-dashed border-2 border-primary/10 rounded-[3rem] py-24 flex flex-col items-center justify-center text-center gap-10 shadow-inner group hover:border-primary/20 transition-all duration-500">
                        <div className="relative">
                            <div className="absolute -inset-6 bg-primary/5 rounded-full blur-2xl animate-pulse group-hover:bg-primary/10 transition-colors"></div>
                            <div className="p-10 rounded-[2.5rem] bg-muted/30 border border-primary/5 relative z-10 transition-transform group-hover:scale-110 duration-700">
                                <BrainCircuit className="h-20 w-20 text-primary opacity-40 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </div>
                        <div className="space-y-4 max-w-sm px-6">
                            <h3 className="font-black text-3xl tracking-tighter uppercase text-foreground leading-none">Awaiting Forensic Ingress</h3>
                            <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-[0.2em] leading-relaxed italic opacity-60">
                                Provide your case narrative to initialize the 20-stage deep neural research protocol.
                            </p>
                        </div>
                    </Card>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
  );
}
