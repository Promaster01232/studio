"use client";

import { useActionState, useEffect, useState, useRef } from "react";
import { analyzeCaseStrengthAction, type CaseStrengthState } from "./actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Loader2, 
  Sparkles, 
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
          updateDoc(userRef, { aiUsageCount: increment(1) }).catch(() => {});
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
    <div className="space-y-12 max-w-6xl mx-auto pb-32 px-4 sm:px-6 text-left">
        <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-3xl mx-auto"
        >
            <Card className="bg-[#161b22] shadow-3xl rounded-[3rem] overflow-hidden border-white/5">
                <CardHeader className="bg-white/5 border-b border-white/5 p-10 text-left">
                <div className="flex items-center gap-4 mb-3 text-primary">
                    <div className="p-3 rounded-2xl bg-black border border-white/5 shadow-inner">
                        <Activity className="h-6 w-6 animate-pulse" />
                    </div>
                    <CardTitle className="text-2xl font-black tracking-tight text-left">Forensic ingress</CardTitle>
                </div>
                <CardDescription className="text-[10px] font-bold opacity-40">Provide the case narrative for high-fidelity probability modeling.</CardDescription>
                </CardHeader>
                <CardContent className="p-10">
                <form action={formAction} className="space-y-10 text-left">
                    <div className="space-y-4">
                    <Label htmlFor="caseDescription" className="text-[10px] font-bold text-gray-500 ml-1">Case narration</Label>
                    <Textarea id="caseDescription" name="caseDescription" placeholder="Enter chronological sequence of events, evidence details, and parties involved..." rows={8} required className="bg-white/5 border-white/5 rounded-[2rem] font-bold text-sm p-8 shadow-inner focus:border-primary transition-all min-h-[220px]" />
                    </div>
                    
                    <div className="space-y-4 max-w-sm">
                        <Label htmlFor="language" className="text-[10px] font-bold text-gray-500 ml-1">Audit protocol language</Label>
                        <Select name="language" defaultValue={selectedLanguage} onValueChange={setSelectedLanguage} required>
                        <SelectTrigger id="language" className="h-14 bg-white/5 border-white/5 font-bold text-xs rounded-2xl active:scale-95 transition-all">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#161b22] border-white/5 rounded-xl">
                            <SelectItem value="English" className="font-bold text-xs">English protocol</SelectItem>
                            <SelectItem value="Hindi" className="font-bold text-xs">Hindi protocol</SelectItem>
                        </SelectContent>
                        </Select>
                    </div>

                    <Button type="submit" disabled={state.status === 'loading'} className="w-full h-16 text-xs font-bold shadow-2xl shadow-primary/10 transition-all active:scale-95 rounded-[2.5rem] group overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                        {state.status === 'loading' ? (
                            <><Loader2 className="mr-3 h-5 w-5 animate-spin" /> Modeling probabilities...</>
                        ) : (
                            <><Sparkles className="mr-3 h-5 w-5" /> Execute strength analysis</>
                        )}
                    </Button>
                </form>
                </CardContent>
            </Card>
        </motion.div>

        <div ref={reportRef} className="space-y-10 scroll-mt-20">
            <div className="flex flex-col items-center gap-4 mb-6">
                <ChevronDown className="h-8 w-8 text-white animate-bounce opacity-20" />
                <Badge variant="outline" className="font-bold text-[10px] bg-white/5 px-8 py-2.5 rounded-full border-white/5 shadow-sm">Report entry</Badge>
            </div>

            <Card className="bg-[#161b22] border-white/5 shadow-3xl rounded-[4rem] overflow-hidden relative min-h-[700px] flex flex-col">
                <div className="absolute inset-0 p-12 opacity-[0.02] pointer-events-none grayscale flex items-center justify-center">
                    <Logo className="h-[600px] w-[600px] border-none p-0 bg-transparent shadow-none" priority={false} />
                </div>

                <CardHeader className={cn(
                    "p-10 sm:p-16 relative z-10 transition-colors duration-700 border-b border-white/5",
                    state.status === 'success' ? "bg-primary text-primary-foreground" : "bg-white/5 text-white"
                )}>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 text-left">
                        <div className="space-y-8 text-left flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-4">
                                <div className={cn(
                                    "flex items-center gap-3 px-5 py-2 rounded-full border shadow-sm",
                                    state.status === 'success' ? "bg-white/10 border-white/20" : "bg-black/20 border-white/5"
                                )}>
                                    <FileCheck className={cn("h-5 w-5", state.status === 'success' ? "text-white" : "text-primary")} />
                                    <span className={cn("text-[11px] font-bold", state.status === 'success' ? "text-white" : "text-primary")}>
                                        {state.status === 'success' ? "Analysis synthesized" : "System standby"}
                                    </span>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <CardTitle className="text-xl sm:text-3xl font-black font-headline leading-none tracking-tighter">
                                    {state.status === 'success' ? "Success matrix ready" : "Awaiting forensic parameters"}
                                </CardTitle>
                                <div className={cn(
                                    "text-[11px] font-bold flex items-center gap-3",
                                    state.status === 'success' ? "text-white/70" : "text-gray-500"
                                )}>
                                    <Globe className="h-4 w-4" /> End-to-end statutory encryption active
                                </div>
                            </div>
                        </div>
                        
                        {state.status === 'success' && (
                            <div className="flex flex-wrap items-center gap-4 shrink-0">
                                <Button 
                                    variant="secondary" 
                                    size="sm" 
                                    onClick={handleReset}
                                    className="h-12 px-10 rounded-[1.5rem] font-bold text-xs gap-3 shadow-2xl active:scale-95"
                                >
                                    <PlusCircle className="h-4 w-4" /> New audit
                                </Button>
                                <AudioAssistant 
                                    text={`${state.data?.summary}. Strength score is ${state.data?.strengthScore} percent.`} 
                                    language={selectedLanguage} 
                                />
                            </div>
                        )}
                    </div>
                </CardHeader>
                
                <CardContent className="p-10 sm:p-20 flex-1 relative z-10">
                    <AnimatePresence mode="wait">
                        {state.status === 'loading' ? (
                            <motion.div 
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center justify-center h-full py-32 text-center gap-12"
                            >
                                <div className="relative w-fit mx-auto">
                                    <Loader2 className="h-24 w-24 animate-spin text-white opacity-10" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Activity className="h-10 w-10 text-white animate-pulse" />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <p className="font-black text-3xl tracking-tighter text-white">Modeling success probabilities...</p>
                                    <p className="text-[10px] font-bold text-gray-500 animate-pulse">Running neural forensic matrix...</p>
                                </div>
                            </motion.div>
                        ) : state.status === "success" && state.data ? (
                            <motion.div 
                                key="report-content" 
                                initial={{ opacity: 0, y: 20 }} 
                                animate={{ opacity: 1, y: 0 }} 
                                className="space-y-20 pb-12 text-left"
                            >
                                <div className="flex flex-col lg:flex-row items-center gap-20">
                                    <div className="relative h-72 w-72 flex items-center justify-center shrink-0">
                                        <svg className="h-full w-full transform -rotate-90">
                                            <circle cx="50%" cy="50%" r="45%" className="stroke-white/5 fill-none" strokeWidth="20" />
                                            <motion.circle 
                                                initial={{ strokeDasharray: "0 314" }}
                                                animate={{ strokeDasharray: `${state.data.strengthScore * 3.14} 314` }}
                                                transition={{ duration: 2, ease: "easeOut" }}
                                                cx="50%" cy="50%" r="45%" 
                                                className="fill-none stroke-white drop-shadow-2xl" 
                                                strokeWidth="20" 
                                                strokeLinecap="round" 
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                            <span className="text-8xl font-black tracking-tighter leading-none text-white">{state.data.strengthScore}%</span>
                                            <span className="text-[10px] font-bold text-gray-500 tracking-[0.4em] mt-4">Success score</span>
                                        </div>
                                    </div>
                                    <div className="flex-1 space-y-10 text-left">
                                        <div className="flex items-center gap-5 text-gray-500 opacity-40">
                                            <Fingerprint className="h-8 w-8" />
                                            <span className="text-[12px] font-bold tracking-[0.5em]">Forensic registry entry</span>
                                        </div>
                                        <p className="text-2xl sm:text-4xl font-black leading-[1.1] tracking-tighter text-white">{state.data.summary}</p>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-12 text-left">
                                    <Card className="p-10 rounded-[3rem] border border-red-500/10 text-left bg-red-500/[0.02] shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden">
                                        <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-red-500"></div>
                                        <h3 className="text-[11px] font-bold text-red-600 tracking-[0.4em] mb-10 flex items-center gap-4">
                                            <ShieldAlert className="h-6 w-6" /> Statutory risk nodes
                                        </h3>
                                        <ul className="space-y-8">
                                            {state.data.riskIndicators.map((r, i) => (
                                                <li key={i} className="text-sm font-bold flex gap-5 text-gray-400">
                                                    <div className="h-2.5 w-2.5 rounded-full bg-red-500 mt-1.5 shrink-0 group-hover:scale-125 transition-transform" />
                                                    {r}
                                                </li>
                                            ))}
                                        </ul>
                                    </Card>
                                    <Card className="p-10 rounded-[3rem] border border-primary/10 text-left bg-primary/[0.02] shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden">
                                        <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-primary"></div>
                                        <h3 className="text-[11px] font-bold text-primary tracking-[0.4em] mb-10 flex items-center gap-4">
                                            <Activity className="h-6 w-6" /> Strategic roadmap
                                        </h3>
                                        <ul className="space-y-8">
                                            {state.data.recommendedActions.map((a, i) => (
                                                <li key={i} className="text-sm font-bold flex gap-5 text-gray-400">
                                                    <div className="h-2.5 w-2.5 rounded-full bg-primary mt-1.5 shrink-0 group-hover:scale-125 transition-transform" />
                                                    {a}
                                                </li>
                                            ))}
                                        </ul>
                                    </Card>
                                </div>

                                <div className="space-y-10 text-left">
                                    <div className="flex items-center justify-between border-b-2 border-white/5 pb-6">
                                        <h3 className="text-[11px] font-bold text-white tracking-[0.5em] flex items-center gap-5">
                                            <FileSearch className="h-7 w-7" /> Deep forensic registry
                                        </h3>
                                    </div>
                                    <div className="p-10 sm:p-20 rounded-[4rem] border-2 border-white/5 text-sm sm:text-lg font-medium leading-loose whitespace-pre-line text-left shadow-3xl bg-white/[0.01] relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-20 opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] transition-opacity duration-700">
                                            <Logo className="h-96 w-96 grayscale opacity-20" priority={false} />
                                        </div>
                                        <div className="relative z-10 prose dark:prose-invert max-none prose-headings:font-black prose-headings:tracking-tighter prose-headings:text-primary">
                                            {state.data.forensicResearch}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="pt-16 mt-16 border-t-2 border-white/5 flex flex-col sm:flex-row items-center justify-between gap-12 opacity-30">
                                    <div className="flex items-center gap-6">
                                        <div className="p-5 rounded-[1.5rem] bg-white/5 text-white shadow-inner">
                                            <ShieldCheck className="h-8 w-8" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-[12px] font-bold">Institutional security</p>
                                            <p className="text-[11px] font-bold">This terminal record is encrypted and restricted.</p>
                                        </div>
                                    </div>
                                    <p className="text-[11px] font-bold tracking-[0.8em] text-white">Nyayasahayak.in // Matrix-hub</p>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="idle" 
                                initial={{ opacity: 0, scale: 0.95 }} 
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center justify-center h-full py-48 text-center gap-16"
                            >
                                <div className="relative">
                                    <div className="absolute -inset-12 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
                                    <div className="p-16 rounded-[4rem] bg-white/5 border border-white/5 relative z-10 transition-transform group-hover:scale-110 duration-700">
                                        <Cpu className="h-32 w-32 text-white opacity-10 group-hover:opacity-30 transition-opacity" />
                                    </div>
                                </div>
                                <div className="space-y-8 max-w-md px-10 text-center">
                                    <h3 className="font-black text-2xl tracking-tighter text-white leading-none">System standby</h3>
                                    <p className="text-[12px] text-gray-500 font-bold tracking-[0.4em] leading-relaxed italic opacity-40">
                                        Provide case narrative to start neural success modeling.
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </CardContent>
                <div className="h-4 w-full bg-white/5"></div>
            </Card>
        </div>
    </div>
  );
}
