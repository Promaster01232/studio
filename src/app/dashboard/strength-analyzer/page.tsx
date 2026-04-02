"use client";

import { useActionState, useEffect, useState } from "react";
import { analyzeCaseStrengthAction, type CaseStrengthState } from "./actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Lightbulb, Loader2, ShieldAlert, Sparkles, ArrowLeft, BrainCircuit, FileText, AlertTriangle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AudioAssistant } from "@/components/audio-assistant";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useFirestore, useAuth } from "@/firebase";
import { doc, updateDoc, increment } from "firebase/firestore";
import { cn } from "@/lib/utils";

const initialState: CaseStrengthState = {
  status: "idle",
  data: null,
  error: null,
};

export default function StrengthAnalyzerPage() {
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
    }
  }, [state, auth.currentUser, firestore]);

  const getStrengthColor = (score: number) => {
    if (score <= 30) return "bg-red-500";
    if (score <= 65) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthText = (score: number) => {
    if (score <= 30) return "Weak";
    if (score <= 65) return "Moderate";
    return "Strong";
  };

  return (
    <div className="space-y-10 max-w-5xl mx-auto pb-20 px-4 sm:px-0 text-left">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-primary/5 pb-8 text-left">
            <PageHeader
            title="Case Strength Matrix"
            description="Institutional AI assessment of litigation success probability based on forensic data."
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
                <CardTitle className="text-xl font-black uppercase tracking-tight">Narrative Ingestion</CardTitle>
            </div>
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest opacity-60">Provide detailed forensic context for the neural engine.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 sm:p-10">
            <form action={formAction} className="space-y-8 text-left">
                <div className="space-y-3">
                <Label htmlFor="caseDescription" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Forensic Description</Label>
                <Textarea id="caseDescription" name="caseDescription" placeholder="Provide a chronological description of events, evidence, and people involved for a precise forensic audit..." rows={8} required className="glass rounded-[2rem] p-6 text-sm font-medium leading-relaxed" />
                </div>
                
                <div className="space-y-3">
                    <Label htmlFor="language" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Response Protocol</Label>
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
                    <><Loader2 className="mr-3 h-5 w-5 animate-spin" /> Neural Mapping Active...</>
                ) : (
                    <><Sparkles className="mr-3 h-5 w-5" /> Initialize Strength Audit</>
                )}
                </Button>
            </form>
            </CardContent>
        </Card>
        
        <AnimatePresence>
            {state.status === 'loading' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 text-center space-y-4">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto opacity-20" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground animate-pulse text-center">Running Statutory Simulations...</p>
                </motion.div>
            )}

            {state.status === "error" && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    <Card className="glass border-destructive/20 shadow-2xl rounded-[2rem] overflow-hidden">
                        <div className="p-8 sm:p-10 flex flex-col items-center text-center gap-6">
                            <div className="p-4 rounded-2xl bg-destructive/10 text-destructive">
                                <AlertTriangle className="h-10 w-10" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-black uppercase tracking-tight text-destructive">Audit Failed</h3>
                                <p className="text-sm font-medium text-muted-foreground leading-relaxed max-w-md mx-auto">
                                    {state.error}
                                </p>
                            </div>
                            <Button onClick={() => window.location.reload()} variant="outline" className="rounded-xl font-bold h-11 px-8 border-destructive/20 text-destructive hover:bg-destructive/5">
                                Re-initialize Protocol
                            </Button>
                        </div>
                    </Card>
                </motion.div>
            )}

            {state.status === "success" && state.data && (
                <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 text-left">
                    <Card className="glass shadow-2xl rounded-[2.5rem] overflow-hidden border-primary/5">
                        <CardHeader className="bg-primary/5 border-b border-primary/10 flex flex-row items-center justify-between p-8 text-left">
                            <div className="space-y-1 text-left">
                                <div className="flex items-center gap-2 mb-1">
                                    <FileText className="h-5 w-5 text-primary" />
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Official AI Report Node Active</span>
                                </div>
                                <CardTitle className="text-2xl font-black uppercase tracking-tight text-left">Audit Output: Strength Matrix</CardTitle>
                                <CardDescription className="text-[10px] font-bold uppercase tracking-widest opacity-60 text-left">AI-Generated Success Matrix</CardDescription>
                            </div>
                            <AudioAssistant 
                                text={`${state.data.summary}. The case strength score is ${state.data.strengthScore} percent.`} 
                                language={selectedLanguage} 
                            />
                        </CardHeader>
                        <CardContent className="p-8 sm:p-12 space-y-10 text-left">
                            <div className="text-center space-y-6">
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] text-center">Forensic Strength Score</p>
                                <div className="flex items-center justify-center gap-6">
                                    <span className={cn("text-4xl font-black uppercase tracking-tighter", getStrengthColor(state.data.strengthScore).replace('bg-', 'text-'))}>
                                        {getStrengthText(state.data.strengthScore)}
                                    </span>
                                    <div className="h-12 w-px bg-primary/10 hidden sm:block"></div>
                                    <span className="text-6xl font-black font-mono tracking-tighter">{state.data.strengthScore}%</span>
                                </div>
                                <Progress value={progress} className="h-4 bg-muted/30 rounded-full" indicatorClassName={getStrengthColor(state.data.strengthScore)} />
                            </div>
                            
                            <div className="p-8 bg-primary/5 rounded-[2rem] border border-primary/10 shadow-inner text-left">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-primary mb-4 text-left">Statutory Summary</h3>
                                <p className="text-sm sm:text-base text-foreground font-bold leading-relaxed text-left">{state.data.summary}</p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8 text-left">
                                <div className="space-y-4 text-left">
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-red-600 flex items-center gap-2 text-left">
                                        <ShieldAlert className="h-4 w-4" /> Risk Indicators
                                    </h3>
                                    <div className="space-y-3 text-left">
                                        {state.data.riskIndicators.map((risk, idx) => (
                                            <div key={idx} className="flex gap-3 p-4 rounded-xl bg-red-500/5 border border-red-500/10 text-xs font-bold leading-relaxed text-left">
                                                <div className="h-1.5 w-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                                                {risk}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-4 text-left">
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-green-600 flex items-center gap-2 text-left">
                                        <Lightbulb className="h-4 w-4" /> Recommended Actions
                                    </h3>
                                    <div className="space-y-3 text-left">
                                        {state.data.recommendedActions.map((action, idx) => (
                                            <div key={idx} className="flex gap-3 p-4 rounded-xl bg-green-500/5 border border-green-500/10 text-xs font-bold leading-relaxed text-left">
                                                <div className="h-1.5 w-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
                                                {action}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
  );
}
