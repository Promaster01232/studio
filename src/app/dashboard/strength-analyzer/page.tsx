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
    <div className="space-y-8 max-w-6xl mx-auto pb-32 px-4 sm:px-0 text-left">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-primary/5 pb-6">
            <PageHeader
            title="Case Strength"
            description="Professional AI audit of your case probability based on statutory frameworks."
            />
            <Button variant="outline" size="sm" className="rounded-xl font-bold h-10 px-6 group" asChild>
            <Link href="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" /> Home
            </Link>
            </Button>
        </motion.div>

        <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-3xl mx-auto"
        >
            <Card className="bg-card border-primary/5 shadow-xl rounded-3xl overflow-hidden">
                <CardHeader className="bg-primary/5 p-8 text-left">
                <div className="flex items-center gap-3 mb-2">
                    <BrainCircuit className="h-5 w-5 text-primary" />
                    <CardTitle className="text-xl font-bold tracking-tight">Case Description</CardTitle>
                </div>
                <CardDescription className="text-xs font-medium opacity-70">Provide details for a precise AI analysis.</CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                <form action={formAction} className="space-y-6">
                    <div className="space-y-3">
                    <Label htmlFor="caseDescription" className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Your Narrative</Label>
                    <Textarea id="caseDescription" name="caseDescription" placeholder="Enter events, evidence, and parties involved..." rows={6} required className="bg-muted/30 border-primary/5 rounded-2xl p-5 text-sm font-medium leading-relaxed" />
                    </div>
                    
                    <div className="space-y-3">
                        <Label htmlFor="language" className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Language</Label>
                        <Select name="language" defaultValue={selectedLanguage} onValueChange={setSelectedLanguage} required>
                        <SelectTrigger id="language" className="h-12 border-primary/5 font-bold rounded-xl bg-muted/30">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            <SelectItem value="English" className="font-bold">English</SelectItem>
                            <SelectItem value="Hindi" className="font-bold">Hindi</SelectItem>
                        </SelectContent>
                        </Select>
                    </div>

                    <Button type="submit" disabled={state.status === 'loading'} className="w-full h-14 rounded-xl font-bold text-base shadow-xl shadow-primary/20 transition-all active:scale-95">
                    {state.status === 'loading' ? (
                        <><Loader2 className="mr-3 h-5 w-5 animate-spin" /> Analyzing Case Details...</>
                    ) : (
                        <><Sparkles className="mr-3 h-5 w-5" /> Run Analysis</>
                    )}
                    </Button>
                </form>
                </CardContent>
            </Card>
        </motion.div>

        <div ref={reportRef} className="space-y-8 scroll-mt-20">
            <Card className="bg-card border-primary/10 shadow-2xl rounded-[2.5rem] overflow-hidden relative min-h-[500px] flex flex-col">
                <CardHeader className={cn(
                    "p-8 sm:p-10 relative z-10 transition-colors duration-500",
                    state.status === 'success' ? "bg-primary text-primary-foreground" : "bg-primary/5 text-foreground"
                )}>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-2">
                                <BrainCircuit className={cn("h-5 w-5", state.status === 'success' ? "text-white" : "text-primary")} />
                                <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">AI Analysis Report</span>
                            </div>
                            <CardTitle className="text-2xl sm:text-4xl font-black tracking-tight leading-none uppercase">
                                {state.status === 'success' ? "Analysis Ready" : "Awaiting Input"}
                            </CardTitle>
                        </div>
                        
                        {state.status === 'success' && (
                            <div className="flex flex-wrap items-center gap-3">
                                <Button variant="secondary" size="sm" onClick={handleReset} className="h-10 px-5 rounded-xl font-bold gap-2"><PlusCircle className="h-4 w-4" /> New Audit</Button>
                                <AudioAssistant text={`${state.data?.summary}. Score: ${state.data?.strengthScore} percent.`} language={selectedLanguage} />
                            </div>
                        )}
                    </div>
                </CardHeader>
                
                <CardContent className="p-8 sm:p-10 flex-1 relative z-10">
                    <AnimatePresence mode="wait">
                        {state.status === 'loading' ? (
                            <div className="flex flex-col items-center justify-center h-[300px] py-20 text-center gap-6">
                                <Loader2 className="h-12 w-12 animate-spin text-primary opacity-20" />
                                <p className="font-bold text-xl tracking-tight animate-pulse">Running Statutory Audit...</p>
                            </div>
                        ) : state.status === "success" && state.data ? (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                                <div className="flex flex-col md:flex-row items-center gap-10">
                                    <div className="relative h-40 w-40 flex items-center justify-center shrink-0">
                                        <svg className="h-full w-full transform -rotate-90">
                                            <circle cx="50%" cy="50%" r="45%" className="stroke-muted/20 fill-none" strokeWidth="10" />
                                            <motion.circle 
                                                initial={{ strokeDasharray: "0 282" }}
                                                animate={{ strokeDasharray: `${state.data.strengthScore * 2.82} 282` }}
                                                transition={{ duration: 1.5, ease: "easeOut" }}
                                                cx="50%" cy="50%" r="45%" 
                                                className={cn("fill-none", state.data.strengthScore <= 30 ? "stroke-red-500" : state.data.strengthScore <= 65 ? "stroke-yellow-500" : "stroke-primary")} 
                                                strokeWidth="10" 
                                                strokeLinecap="round" 
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                            <span className="text-4xl font-black">{state.data.strengthScore}%</span>
                                            <span className="text-[8px] font-bold uppercase text-muted-foreground">Probability</span>
                                        </div>
                                    </div>
                                    <div className="flex-1 text-left space-y-4">
                                        <h3 className="text-2xl font-bold tracking-tight">Executive Summary</h3>
                                        <p className="text-base font-medium leading-relaxed text-foreground/80">{state.data.summary}</p>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <Card className="bg-red-500/5 rounded-2xl border-red-500/10 p-6 text-left">
                                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-red-600 mb-4 flex items-center gap-2"><ShieldAlert className="h-4 w-4" /> Risk Indicators</h3>
                                        <ul className="space-y-2">
                                            {state.data.riskIndicators.map((r, i) => <li key={i} className="text-xs font-bold flex gap-2"><div className="h-1.5 w-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />{r}</li>)}
                                        </ul>
                                    </Card>
                                    <Card className="bg-primary/5 rounded-2xl border-primary/10 p-6 text-left">
                                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-4 flex items-center gap-2"><Lightbulb className="h-4 w-4" /> Recommended Actions</h3>
                                        <ul className="space-y-2">
                                            {state.data.recommendedActions.map((a, i) => <li key={i} className="text-xs font-bold flex gap-2"><div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />{a}</li>)}
                                        </ul>
                                    </Card>
                                </div>

                                <div className="space-y-6 text-left border-t border-primary/5 pt-8">
                                    <div className="flex items-center gap-3">
                                        <Search className="h-5 w-5 text-primary" />
                                        <h3 className="text-lg font-bold tracking-tight">Detailed Analysis</h3>
                                    </div>
                                    <div className="p-6 sm:p-8 bg-muted/30 rounded-2xl text-sm font-medium leading-loose whitespace-pre-line text-foreground/90">
                                        {state.data.forensicResearch}
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 opacity-30 gap-4">
                                <BrainCircuit className="h-16 w-16" />
                                <p className="font-bold text-sm uppercase tracking-widest">Awaiting Case Details</p>
                            </div>
                        )}
                    </AnimatePresence>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}