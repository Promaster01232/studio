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
    <div className="space-y-8 max-w-6xl mx-auto pb-12 px-4 sm:px-6 text-left">
        <div className="max-w-3xl mx-auto">
            <Card className="bg-[#161b22] shadow-xl rounded-2xl overflow-hidden border-white/5">
                <CardHeader className="bg-white/5 border-b border-white/5 p-8 text-left">
                <div className="flex items-center gap-3 mb-2 text-primary">
                    <div className="p-2 rounded-xl bg-black border border-white/5 shadow-inner">
                        <Activity className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-xl font-black tracking-tight text-left">Forensic Ingress</CardTitle>
                </div>
                <CardDescription className="text-[10px] font-bold opacity-40">Provide The Case Narrative For High-Fidelity Probability Modeling.</CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                <form action={formAction} className="space-y-8 text-left">
                    <div className="space-y-3">
                    <Label htmlFor="caseDescription" className="text-[10px] font-bold text-gray-500 ml-1">Case Narration</Label>
                    <Textarea id="caseDescription" name="caseDescription" placeholder="Enter Chronological Sequence Of Events, Evidence Details, And Parties Involved..." rows={6} required className="bg-white/5 border-white/5 rounded-xl font-bold text-sm p-6 shadow-inner focus:border-primary transition-all min-h-[180px]" />
                    </div>
                    
                    <div className="space-y-3 max-w-sm">
                        <Label htmlFor="language" className="text-[10px] font-bold text-gray-500 ml-1">Audit Protocol Language</Label>
                        <Select name="language" defaultValue={selectedLanguage} onValueChange={setSelectedLanguage} required>
                        <SelectTrigger id="language" className="h-12 bg-white/5 border-white/5 font-bold text-xs rounded-xl active:scale-95 transition-all text-left">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#161b22] border-white/5 rounded-xl">
                            <SelectItem value="English" className="font-bold text-xs">English Protocol</SelectItem>
                            <SelectItem value="Hindi" className="font-bold text-xs">Hindi Protocol</SelectItem>
                        </SelectContent>
                        </Select>
                    </div>

                    <Button type="submit" disabled={state.status === 'loading'} className="w-full h-14 text-xs font-bold shadow-lg shadow-primary/10 transition-all active:scale-95 rounded-xl group overflow-hidden relative">
                        {state.status === 'loading' ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Modeling Probabilities...</>
                        ) : (
                            <><Sparkles className="mr-2 h-4 w-4" /> Execute Strength Analysis</>
                        )}
                    </Button>
                </form>
                </CardContent>
            </Card>
        </div>

        <div ref={reportRef} className="space-y-6 scroll-mt-20">
            <div className="flex flex-col items-center gap-2 mb-4">
                <ChevronDown className="h-6 w-6 text-white opacity-20" />
                <Badge variant="outline" className="font-bold text-[9px] bg-white/5 px-6 py-1.5 rounded-full border-white/5 shadow-sm">Report Entry</Badge>
            </div>

            <Card className="bg-[#161b22] border-white/5 shadow-2xl rounded-3xl overflow-hidden relative min-h-[500px] flex flex-col">
                <div className="absolute inset-0 p-12 opacity-[0.02] pointer-events-none grayscale flex items-center justify-center">
                    <Logo className="h-[400px] w-[400px] border-none p-0 bg-transparent shadow-none" priority={false} />
                </div>

                <CardHeader className={cn(
                    "p-8 sm:p-10 relative z-10 border-b border-white/5",
                    state.status === 'success' ? "bg-primary text-primary-foreground" : "bg-white/5 text-white"
                )}>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 text-left">
                        <div className="space-y-4 text-left flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-3">
                                <div className={cn(
                                    "flex items-center gap-2 px-4 py-1.5 rounded-full border shadow-sm",
                                    state.status === 'success' ? "bg-white/10 border-white/20" : "bg-black/20 border-white/5"
                                )}>
                                    <FileCheck className={cn("h-4 w-4", state.status === 'success' ? "text-white" : "text-primary")} />
                                    <span className={cn("text-[10px] font-bold", state.status === 'success' ? "text-white" : "text-primary")}>
                                        {state.status === 'success' ? "Analysis Synthesized" : "System Standby"}
                                    </span>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <CardTitle className="text-xl sm:text-2xl font-black font-headline leading-none tracking-tighter text-left">
                                    {state.status === 'success' ? "Success Matrix Ready" : "Awaiting Forensic Parameters"}
                                </CardTitle>
                                <div className={cn(
                                    "text-[10px] font-bold flex items-center gap-2",
                                    state.status === 'success' ? "text-white/70" : "text-gray-500"
                                )}>
                                    <Globe className="h-3.5 w-3.5" /> End-To-End Statutory Encryption Active
                                </div>
                            </div>
                        </div>
                        
                        {state.status === 'success' && (
                            <div className="flex flex-wrap items-center gap-3 shrink-0">
                                <Button 
                                    variant="secondary" 
                                    size="sm" 
                                    onClick={handleReset}
                                    className="h-10 px-6 rounded-xl font-bold text-[10px] gap-2 shadow-xl active:scale-95"
                                >
                                    <PlusCircle className="h-3.5 w-3.5" /> New Audit
                                </Button>
                                <AudioAssistant 
                                    text={`${state.data?.summary}. Strength Score Is ${state.data?.strengthScore} Percent.`} 
                                    language={selectedLanguage} 
                                />
                            </div>
                        )}
                    </div>
                </CardHeader>
                
                <CardContent className="p-8 sm:p-12 flex-1 relative z-10">
                    {state.status === 'loading' ? (
                        <div className="flex flex-col items-center justify-center h-full py-20 text-center gap-8">
                            <Activity className="h-12 w-12 text-white animate-pulse" />
                            <div className="space-y-2">
                                <p className="font-black text-2xl tracking-tighter text-white">Modeling Success Probabilities...</p>
                                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Running Neural Forensic Matrix...</p>
                            </div>
                        </div>
                    ) : state.status === "success" && state.data ? (
                        <div className="space-y-12 pb-6 text-left">
                            <div className="flex flex-col lg:flex-row items-center gap-12">
                                <div className="relative h-48 w-48 flex items-center justify-center shrink-0">
                                    <svg className="h-full w-full transform -rotate-90">
                                        <circle cx="50%" cy="50%" r="45%" className="stroke-white/5 fill-none" strokeWidth="12" />
                                        <circle 
                                            cx="50%" cy="50%" r="45%" 
                                            style={{ 
                                                strokeDasharray: "282", 
                                                strokeDashoffset: `${282 - (state.data.strengthScore / 100) * 282}` 
                                            }}
                                            className="fill-none stroke-white" 
                                            strokeWidth="12" 
                                            strokeLinecap="round" 
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                        <span className="text-5xl font-black tracking-tighter leading-none text-white">{state.data.strengthScore}%</span>
                                        <span className="text-[8px] font-bold text-gray-500 tracking-widest mt-2 uppercase">Success Score</span>
                                    </div>
                                </div>
                                <div className="flex-1 space-y-6 text-left">
                                    <Fingerprint className="h-6 w-6 text-gray-500 opacity-40" />
                                    <p className="text-xl sm:text-2xl font-black leading-tight tracking-tighter text-white">{state.data.summary}</p>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8 text-left">
                                <Card className="p-8 rounded-2xl border border-red-500/10 text-left bg-red-500/[0.02] shadow-sm relative overflow-hidden">
                                    <div className="absolute top-0 left-0 bottom-0 w-1 bg-red-500"></div>
                                    <h3 className="text-[9px] font-bold text-red-600 tracking-widest mb-6 flex items-center gap-3 uppercase">
                                        <ShieldAlert className="h-4 w-4" /> Statutory Risk Nodes
                                    </h3>
                                    <ul className="space-y-4">
                                        {state.data.riskIndicators.map((r, i) => (
                                            <li key={i} className="text-xs font-bold flex gap-3 text-gray-400">
                                                <div className="h-1.5 w-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                                                {r}
                                            </li>
                                        ))}
                                    </ul>
                                </Card>
                                <Card className="p-8 rounded-2xl border border-primary/10 text-left bg-primary/[0.02] shadow-sm relative overflow-hidden">
                                    <div className="absolute top-0 left-0 bottom-0 w-1 bg-primary"></div>
                                    <h3 className="text-[9px] font-bold text-primary tracking-widest mb-6 flex items-center gap-3 uppercase">
                                        <Activity className="h-4 w-4" /> Strategic Roadmap
                                    </h3>
                                    <ul className="space-y-4">
                                        {state.data.recommendedActions.map((a, i) => (
                                            <li key={i} className="text-xs font-bold flex gap-3 text-gray-400">
                                                <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                                                {a}
                                            </li>
                                        ))}
                                    </ul>
                                </Card>
                            </div>

                            <div className="space-y-6 text-left">
                                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                                    <h3 className="text-[9px] font-bold text-white tracking-widest flex items-center gap-3 uppercase">
                                        <FileSearch className="h-4 w-4" /> Deep Forensic Registry
                                    </h3>
                                </div>
                                <div className="p-8 rounded-3xl border border-white/5 text-sm font-medium leading-relaxed whitespace-pre-line text-left shadow-lg bg-white/[0.01] relative overflow-hidden group">
                                    <div className="relative z-10 prose dark:prose-invert max-none prose-headings:font-black prose-headings:tracking-tighter prose-headings:text-primary text-left">
                                        {state.data.forensicResearch}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6 opacity-30">
                                <div className="flex items-center gap-3">
                                    <ShieldCheck className="h-5 w-5 text-white" />
                                    <div className="text-left">
                                        <p className="text-[9px] font-bold uppercase tracking-widest">Identity Protection</p>
                                        <p className="text-[8px] font-bold">This Report Record Is Private And Encrypted.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full py-20 text-center gap-10">
                            <Cpu className="h-16 w-16 text-white opacity-10" />
                            <div className="space-y-4 max-md px-6 text-center">
                                <h3 className="font-black text-xl tracking-tighter text-white leading-none uppercase">System Standby</h3>
                                <p className="text-[10px] text-gray-500 font-bold tracking-widest leading-relaxed italic opacity-40 uppercase">
                                    Provide Case Narrative To Start Neural Success Modeling.
                                </p>
                            </div>
                        </div>
                    )}
                </CardContent>
                <div className="h-2 w-full bg-white/5"></div>
            </Card>
        </div>
    </div>
  );
}