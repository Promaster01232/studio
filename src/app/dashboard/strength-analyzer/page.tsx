"use client";

import { useActionState, useEffect, useState, use } from "react";
import { analyzeCaseStrengthAction, type CaseStrengthState } from "./actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Loader2, Sparkles, ArrowLeft, BrainCircuit, FileText, ShieldAlert, Activity, CheckCircle2, ShieldCheck, AlertTriangle, Lightbulb, Search, Landmark, Cpu } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AudioAssistant } from "@/components/audio-assistant";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useFirestore, useAuth } from "@/firebase";
import { doc, updateDoc, increment } from "firebase/firestore";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const initialState: CaseStrengthState = {
  status: "idle",
  data: null,
  error: null,
};

export default function StrengthAnalyzerPage(props: { params: Promise<any>, searchParams: Promise<any> }) {
  // Next.js 15: unwrap dynamic props
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

        <Card className="glass shadow-2xl overflow-hidden rounded-[2.5rem] border-primary/5">
            <CardHeader className="bg-primary/5 border-b border-primary/5 p-8 text-left">
            <div className="flex items-center gap-3 text-primary mb-2">
                <BrainCircuit className="h-5 w-5" />
                <CardTitle className="text-xl font-black uppercase tracking-tight">Narrative Research Ingestion</CardTitle>
            </div>
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest opacity-60">Provide case context for an exhaustive statutory audit.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 sm:p-10">
            <form action={formAction} className="space-y-8 text-left">
                <div className="space-y-3">
                <Label htmlFor="caseDescription" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Forensic Description</Label>
                <Textarea id="caseDescription" name="caseDescription" placeholder="Enter chronological events, evidence details, and party identities for a deep research report..." rows={8} required className="glass rounded-[2rem] p-6 text-sm font-medium leading-relaxed" />
                </div>
                
                <div className="space-y-3">
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
                <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="space-y-10 text-left">
                    <Card className="glass border-primary shadow-2xl rounded-[3rem] overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none">
                            <Landmark className="h-64 w-64" />
                        </div>
                        <CardHeader className="bg-primary/5 border-b border-primary/10 flex flex-col md:flex-row items-center justify-between p-8 sm:p-12 text-left gap-6">
                            <div className="space-y-2 text-left">
                                <div className="flex items-center gap-3 text-primary mb-1">
                                    <ShieldCheck className="h-6 w-6" />
                                    <span className="text-[11px] font-black uppercase tracking-[0.4em] opacity-80">Official Statutory Record Active</span>
                                </div>
                                <CardTitle className="text-3xl sm:text-5xl font-black tracking-tighter text-left leading-none">FORENSIC STRENGTH REPORT</CardTitle>
                                <div className="flex items-center gap-3 mt-2">
                                    <Badge variant="outline" className="text-[9px] font-black uppercase tracking-[0.2em] border-primary/20 opacity-60">NS-STRENGTH-ALPHA-4.2</Badge>
                                    {state.isSimulated && (
                                        <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-[9px] font-black uppercase tracking-widest">
                                            <Cpu className="h-3 w-3 mr-1.5" /> Local Node Fallback
                                        </Badge>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-4 shrink-0">
                                <AudioAssistant 
                                    text={`${state.data.summary}. The case strength score is ${state.data.strengthScore} percent.`} 
                                    language={selectedLanguage} 
                                />
                                <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/20 px-4 py-1.5 rounded-full font-black text-[9px] uppercase tracking-widest">Research Finalized</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 sm:p-16 space-y-16 text-left">
                            <div className="flex flex-col md:flex-row items-center gap-12 sm:gap-20">
                                <div className="relative h-48 w-48 sm:h-64 sm:w-64 flex items-center justify-center shrink-0">
                                    <svg className="h-full w-full transform -rotate-90">
                                        <circle cx="50%" cy="50%" r="45%" className="stroke-muted/20 fill-none" strokeWidth="12" />
                                        <circle cx="50%" cy="50%" r="45%" className={cn("fill-none transition-all duration-1000", state.data.strengthScore <= 30 ? "stroke-red-500" : state.data.strengthScore <= 65 ? "stroke-yellow-500" : "stroke-green-500")} strokeWidth="12" strokeDasharray={`${state.data.strengthScore * 2.82} 282`} strokeLinecap="round" />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                        <span className="text-5xl sm:text-7xl font-black font-mono tracking-tighter">{state.data.strengthScore}%</span>
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Audit Score</span>
                                    </div>
                                </div>
                                <div className="flex-1 space-y-6 text-center md:text-left">
                                    <h3 className={cn("text-4xl sm:text-6xl font-black uppercase tracking-tighter leading-none", 
                                        state.data.strengthScore <= 30 ? "text-red-500" : state.data.strengthScore <= 65 ? "text-yellow-500" : "text-green-500")}>
                                        {state.data.strengthScore <= 30 ? "Procedurally Weak" : state.data.strengthScore <= 65 ? "Statutory Moderate" : "Research Solid"}
                                    </h3>
                                    <p className="text-lg sm:text-xl font-bold leading-relaxed text-foreground/80">
                                        {state.data.summary}
                                    </p>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-10 text-left">
                                <Card className="bg-red-500/5 rounded-[2.5rem] border-red-500/10 p-8 sm:p-10 shadow-inner group transition-all hover:bg-red-500/10">
                                    <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-red-600 flex items-center gap-3 mb-6">
                                        <ShieldAlert className="h-5 w-5" /> Forensic Risk Indicators
                                    </h3>
                                    <div className="space-y-4">
                                        {state.data.riskIndicators.map((risk, idx) => (
                                            <div key={idx} className="flex gap-4 p-4 rounded-2xl bg-white dark:bg-zinc-950 border border-red-500/5 text-sm font-bold leading-relaxed text-foreground/80 shadow-sm">
                                                <div className="h-2 w-2 rounded-full bg-red-500 mt-1.5 shrink-0 animate-pulse" />
                                                {risk}
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                                <Card className="bg-green-500/5 rounded-[2.5rem] border-green-500/10 p-8 sm:p-10 shadow-inner group transition-all hover:bg-green-500/10">
                                    <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-green-600 flex items-center gap-3 mb-6">
                                        <Lightbulb className="h-5 w-5" /> Recommended Research Steps
                                    </h3>
                                    <div className="space-y-4">
                                        {state.data.recommendedActions.map((action, idx) => (
                                            <div key={idx} className="flex gap-4 p-4 rounded-2xl bg-white dark:bg-zinc-950 border border-green-500/5 text-sm font-bold leading-relaxed text-foreground/80 shadow-sm">
                                                <div className="h-2 w-2 rounded-full bg-green-500 mt-1.5 shrink-0" />
                                                {action}
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            </div>

                            <div className="space-y-8 text-left border-t border-primary/5 pt-16">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                                        <Landmark className="h-6 w-6" />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="text-2xl font-black tracking-tight leading-none uppercase">Detailed Forensic Deep-Dive</h3>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">Research Audit Node // NS-DATA-SYNC</p>
                                    </div>
                                </div>
                                <div className="p-8 sm:p-12 bg-muted/20 rounded-[2.5rem] border border-primary/5 shadow-inner">
                                    <p className="text-sm sm:text-base font-medium leading-loose text-foreground/90 whitespace-pre-line text-left prose dark:prose-invert max-w-none">
                                        {state.data.forensicResearch}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                        <div className="h-2 w-full bg-gradient-to-r from-primary via-accent to-blue-400"></div>
                    </Card>
                </motion.div>
            )}

            {state.status === 'idle' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-full py-32 text-center gap-10 opacity-40">
                    <div className="p-10 rounded-[3rem] bg-muted/50 border-4 border-dashed border-primary/10 transition-transform hover:scale-105 duration-700">
                        <BrainCircuit className="h-24 w-24 text-muted-foreground" />
                    </div>
                    <div className="space-y-3 text-center">
                        <p className="font-black text-3xl tracking-tighter uppercase text-center">Awaiting Forensic Ingress</p>
                        <p className="text-sm text-muted-foreground font-medium max-w-[320px] mx-auto leading-relaxed text-center italic">
                            "Provide your case narrative to initialize the 20-stage deep neural research protocol."
                        </p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
  );
}
