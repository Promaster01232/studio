"use client";

import { useActionState, useEffect, useState, useRef } from "react";
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
  Cpu,
  Globe,
  PlusCircle,
  ChevronDown,
  FileSearch,
  FileCheck,
  Fingerprint
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

export default function StrengthAnalyzerPage() {
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
    <div className="space-y-12 max-w-6xl mx-auto pb-32 px-4 sm:px-0 text-left">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-primary/5 pb-8">
            <PageHeader
            title="Strength matrix"
            description="Institutional probability modeling for legal case success."
            />
            <Button variant="ghost" size="sm" className="rounded-xl font-bold hover:bg-primary/5 group h-10 px-6 border border-primary/5 text-foreground text-[10px] uppercase tracking-widest" asChild>
            <Link href="/dashboard">
                <ArrowLeft className="mr-2 h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" /> Back to terminal
            </Link>
            </Button>
        </motion.div>

        <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-3xl mx-auto"
        >
            <Card className="glass shadow-3xl rounded-[3rem] overflow-hidden border-primary/5 bg-card">
                <CardHeader className="bg-muted/30 border-b border-primary/10 p-10 text-left">
                <div className="flex items-center gap-4 mb-3">
                    <div className="p-3 rounded-2xl bg-background border border-primary/10">
                        <BrainCircuit className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-3xl font-black uppercase tracking-tighter">Case entry</CardTitle>
                </div>
                <CardDescription className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Provide the facts for analysis.</CardDescription>
                </CardHeader>
                <CardContent className="p-10">
                <form action={formAction} className="space-y-10 text-left">
                    <div className="space-y-4">
                    <Label htmlFor="caseDescription" className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">Case narrative</Label>
                    <Textarea id="caseDescription" name="caseDescription" placeholder="Enter sequence of events, evidence details..." rows={8} required className="bg-muted/20 border-primary/10 rounded-[2rem] font-bold text-sm p-8 shadow-inner focus:border-foreground transition-all min-h-[200px]" />
                    </div>
                    
                    <div className="space-y-4">
                        <Label htmlFor="language" className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">Analysis language</Label>
                        <Select name="language" defaultValue={selectedLanguage} onValueChange={setSelectedLanguage} required>
                        <SelectTrigger id="language" className="h-14 bg-muted/20 border-primary/10 font-black uppercase text-[10px] rounded-2xl active:scale-95 transition-all">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-[1.5rem] glass">
                            <SelectItem value="English" className="font-black uppercase text-[10px]">English</SelectItem>
                            <SelectItem value="Hindi" className="font-black uppercase text-[10px]">Hindi</SelectItem>
                        </SelectContent>
                        </Select>
                    </div>

                    <Button type="submit" disabled={state.status === 'loading'} className="w-full h-16 text-[11px] font-black uppercase tracking-[0.4em] shadow-2xl shadow-primary/10 transition-all active:scale-95 rounded-[2rem] group overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                        {state.status === 'loading' ? (
                            <><Loader2 className="mr-3 h-5 w-5 animate-spin" /> Analyzing your case...</>
                        ) : (
                            <><Sparkles className="mr-3 h-5 w-5" /> Start analysis</>
                        )}
                    </Button>
                </form>
                </CardContent>
            </Card>
        </motion.div>

        <div ref={reportRef} className="space-y-10 scroll-mt-20">
            <div className="flex flex-col items-center gap-4 mb-6">
                <ChevronDown className="h-8 w-8 text-foreground animate-bounce opacity-20" />
                <Badge variant="outline" className="font-black text-[10px] uppercase tracking-[0.4em] bg-muted px-6 py-2 rounded-full border-primary/10">Report entry</Badge>
            </div>

            <Card className="border-primary/10 shadow-3xl rounded-[4rem] overflow-hidden relative min-h-[700px] flex flex-col bg-card">
                <div className="absolute inset-0 p-12 opacity-[0.02] pointer-events-none grayscale flex items-center justify-center">
                    <Logo className="h-[600px] w-[600px] border-none p-0" priority={false} />
                </div>

                <CardHeader className={cn(
                    "p-8 sm:p-12 relative z-10 transition-colors duration-700 border-b border-primary/10",
                    state.status === 'success' ? "bg-primary text-primary-foreground" : "bg-muted/30 text-foreground"
                )}>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 text-left">
                        <div className="space-y-6 text-left flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-4">
                                <div className={cn(
                                    "flex items-center gap-3 px-4 py-1.5 rounded-full border shadow-sm",
                                    state.status === 'success' ? "bg-white/10 border-white/20" : "bg-background border-primary/5"
                                )}>
                                    <FileCheck className={cn("h-4 w-4", state.status === 'success' ? "text-white" : "text-primary")} />
                                    <span className={cn("text-[10px] font-bold", state.status === 'success' ? "text-white" : "text-primary")}>
                                        {state.status === 'success' ? "Analysis complete" : "AI report"}
                                    </span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <CardTitle className="text-xl sm:text-3xl font-black font-headline leading-none">
                                    {state.status === 'success' ? "Your report is ready" : "Waiting for case details"}
                                </CardTitle>
                                <div className={cn(
                                    "text-[11px] font-medium flex items-center gap-3",
                                    state.status === 'success' ? "text-white/70" : "text-muted-foreground"
                                )}>
                                    <ShieldCheck className="h-4 w-4" /> Your data is protected
                                </div>
                            </div>
                        </div>
                        
                        {state.status === 'success' && (
                            <div className="flex flex-wrap items-center gap-4 shrink-0">
                                <Button 
                                    variant="secondary" 
                                    size="sm" 
                                    onClick={handleReset}
                                    className="h-12 px-8 rounded-2xl font-black text-[10px] uppercase tracking-widest gap-3 shadow-2xl"
                                >
                                    <PlusCircle className="h-4 w-4" /> New report
                                </Button>
                                <AudioAssistant 
                                    text={`${state.data?.summary}. Strength score is ${state.data?.strengthScore} percent.`} 
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
                                    <Loader2 className="h-24 w-24 animate-spin text-foreground opacity-10" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Activity className="h-10 w-10 text-foreground animate-pulse" />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <p className="font-black text-3xl tracking-tighter uppercase text-foreground">Running analysis...</p>
                                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground animate-pulse">Calculating success probability...</p>
                                </div>
                            </motion.div>
                        ) : state.status === "success" && state.data ? (
                            <motion.div 
                                key="report-content" 
                                initial={{ opacity: 0, y: 20 }} 
                                animate={{ opacity: 1, y: 0 }} 
                                className="space-y-16 pb-12 text-left"
                            >
                                <div className="flex flex-col lg:flex-row items-center gap-16">
                                    <div className="relative h-64 w-64 flex items-center justify-center shrink-0">
                                        <svg className="h-full w-full transform -rotate-90">
                                            <circle cx="50%" cy="50%" r="45%" className="stroke-muted/10 fill-none" strokeWidth="16" />
                                            <motion.circle 
                                                initial={{ strokeDasharray: "0 314" }}
                                                animate={{ strokeDasharray: `${state.data.strengthScore * 3.14} 314` }}
                                                transition={{ duration: 2, ease: "easeOut" }}
                                                cx="50%" cy="50%" r="45%" 
                                                className="fill-none stroke-foreground drop-shadow-2xl" 
                                                strokeWidth="16" 
                                                strokeLinecap="round" 
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                            <span className="text-7xl font-black tracking-tighter">{state.data.strengthScore}%</span>
                                            <span className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.3em] mt-2">Success rate</span>
                                        </div>
                                    </div>
                                    <div className="flex-1 space-y-8 text-left">
                                        <div className="flex items-center gap-4 text-muted-foreground opacity-40">
                                            <Fingerprint className="h-6 w-6" />
                                            <span className="text-[11px] font-black uppercase tracking-[0.4em]">Report summary</span>
                                        </div>
                                        <p className="text-2xl sm:text-4xl font-black leading-tight tracking-tight text-foreground uppercase">{state.data.summary}</p>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-10">
                                    <Card className="p-10 rounded-[3rem] border-primary/5 text-left bg-muted/20 shadow-sm hover:shadow-2xl transition-all group">
                                        <h3 className="text-[11px] font-black text-foreground uppercase tracking-[0.4em] mb-8 flex items-center gap-4">
                                            <ShieldAlert className="h-5 w-5" /> Risk factors
                                        </h3>
                                        <ul className="space-y-6">
                                            {state.data.riskIndicators.map((r, i) => (
                                                <li key={i} className="text-sm font-bold flex gap-4 text-muted-foreground">
                                                    <div className="h-2 w-2 rounded-full bg-foreground mt-1.5 shrink-0 group-hover:scale-125 transition-transform" />
                                                    {r}
                                                </li>
                                            ))}
                                        </ul>
                                    </Card>
                                    <Card className="p-10 rounded-[3rem] border-primary/5 text-left bg-muted/20 shadow-sm hover:shadow-2xl transition-all group">
                                        <h3 className="text-[11px] font-black text-foreground uppercase tracking-[0.4em] mb-8 flex items-center gap-4">
                                            <Activity className="h-5 w-5" /> Recommendations
                                        </h3>
                                        <ul className="space-y-6">
                                            {state.data.recommendedActions.map((a, i) => (
                                                <li key={i} className="text-sm font-bold flex gap-4 text-muted-foreground">
                                                    <div className="h-2 w-2 rounded-full bg-foreground mt-1.5 shrink-0 group-hover:scale-125 transition-transform" />
                                                    {a}
                                                </li>
                                            ))}
                                        </ul>
                                    </Card>
                                </div>

                                <div className="space-y-8 text-left">
                                    <div className="flex items-center justify-between border-b border-primary/10 pb-6">
                                        <h3 className="text-[11px] font-black text-foreground uppercase tracking-[0.4em] flex items-center gap-4">
                                            <FileSearch className="h-6 w-6" /> Detailed analysis
                                        </h3>
                                    </div>
                                    <div className="p-10 sm:p-16 rounded-[4rem] border border-primary/10 text-sm sm:text-base font-medium leading-loose whitespace-pre-line text-left shadow-inner bg-muted/10 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-16 opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] transition-opacity duration-700">
                                            <Logo className="h-80 w-80 grayscale" priority={false} />
                                        </div>
                                        <div className="relative z-10 prose dark:prose-invert max-w-none">
                                            {state.data.forensicResearch}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="pt-12 mt-12 border-t border-primary/5 flex flex-col sm:flex-row items-center justify-between gap-10 opacity-30">
                                    <div className="flex items-center gap-5">
                                        <div className="p-4 rounded-2xl bg-muted text-foreground">
                                            <ShieldCheck className="h-7 w-7" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-[11px] font-black uppercase tracking-widest">Secure system</p>
                                            <p className="text-[10px] font-bold">This terminal is protected and private.</p>
                                        </div>
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.6em]">NYAYASAHAYAK.IN</p>
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
                                    <div className="absolute -inset-8 bg-foreground/5 rounded-full blur-3xl animate-pulse"></div>
                                    <div className="p-12 rounded-[3rem] bg-muted/30 border border-primary/5 relative z-10 transition-transform group-hover:scale-110 duration-700">
                                        <Cpu className="h-24 w-24 text-foreground opacity-10 group-hover:opacity-30 transition-opacity" />
                                    </div>
                                </div>
                                <div className="space-y-6 max-w-md px-8 text-center">
                                    <h3 className="font-black text-4xl tracking-tighter uppercase text-foreground leading-none">Ready to start</h3>
                                    <p className="text-[11px] text-muted-foreground font-black uppercase tracking-[0.3em] leading-relaxed italic opacity-40">
                                        Provide case details to start your AI analysis.
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </CardContent>
                <div className="h-3 w-full bg-foreground/10"></div>
            </Card>
        </div>
    </div>
  );
}
