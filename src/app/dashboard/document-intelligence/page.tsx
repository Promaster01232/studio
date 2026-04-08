"use client";

import { useActionState, useRef, useState, useEffect } from "react";
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
  X,
  FileCheck,
  Search,
  Zap
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

export default function DocumentIntelligencePage() {
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
    <div className="space-y-10 max-w-6xl mx-auto pb-20 px-2 sm:px-0 text-left">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-primary/5 pb-6">
            <PageHeader
            title="Forensic audit"
            description="Institutional AI analysis for legal document risk assessment."
            />
            <Button variant="ghost" size="sm" className="rounded-xl font-bold hover:bg-primary/5 group h-10 px-6 border border-primary/5 text-primary text-[10px] uppercase tracking-widest" asChild>
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
            <Card className="glass shadow-2xl overflow-hidden rounded-[2.5rem] border-primary/5">
                <CardHeader className="bg-primary/5 border-b border-primary/10 p-8 text-left">
                    <div className="flex items-center gap-3 mb-2 text-primary">
                        <FileUp className="h-5 w-5" />
                        <CardTitle className="text-xl font-black uppercase tracking-tight text-left">Upload hub</CardTitle>
                    </div>
                    <CardDescription className="text-[10px] font-bold uppercase tracking-widest opacity-60">Send your file for secure analysis.</CardDescription>
                </CardHeader>
                <CardContent className="p-8 sm:p-10">
                    <form action={formAction} className="space-y-8 text-left">
                        <div className="space-y-3">
                            <Label htmlFor="document" className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">Legal document</Label>
                            <div className="relative group">
                                <div className="absolute inset-0 bg-primary/5 rounded-2xl transition-all group-hover:bg-primary/10 border-2 border-dashed border-primary/10 pointer-events-none"></div>
                                <Input 
                                    id="document" 
                                    name="document" 
                                    type="file" 
                                    required 
                                    onChange={handleFileChange}
                                    ref={fileInputRef}
                                    accept=".pdf,.doc,.docx,image/*"
                                    className="h-32 opacity-0 cursor-pointer relative z-10"
                                />
                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 pointer-events-none">
                                    <div className="p-3 rounded-xl bg-background shadow-sm border border-primary/5 group-hover:scale-110 transition-transform">
                                        <FileSearch className="h-6 w-6 text-primary opacity-40" />
                                    </div>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-center px-4">
                                        {fileName ? fileName : "Select your file"}
                                    </p>
                                </div>
                            </div>
                            {fileName && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 p-4 bg-green-500/5 rounded-xl border border-green-500/10">
                                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                                    <p className="text-[11px] font-bold text-green-600 truncate flex-1 uppercase tracking-tight">{fileName}</p>
                                    <button type="button" onClick={() => { setFileName(""); if(fileInputRef.current) fileInputRef.current.value=""; }} className="text-muted-foreground hover:text-destructive active:scale-90 transition-all p-1">
                                        <X className="h-4 w-4" />
                                    </button>
                                </motion.div>
                            )}
                        </div>

                        <div className="space-y-3">
                            <Label htmlFor="language" className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1 flex items-center gap-2">
                                <Languages className="h-3 w-3" /> Report language
                            </Label>
                            <Select name="language" defaultValue={selectedLanguage} onValueChange={setSelectedLanguage} required>
                                <SelectTrigger id="language" className="h-12 glass border-primary/5 font-bold rounded-xl active:scale-95 transition-all">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="glass border-primary/5 rounded-xl">
                                    <SelectItem value="English" className="font-bold">English</SelectItem>
                                    <SelectItem value="Hindi" className="font-bold">Hindi</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Button type="submit" disabled={state.status === "loading"} className="w-full h-16 text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 rounded-[1.5rem] group relative overflow-hidden active:scale-95 transition-all">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                            {state.status === "loading" ? (
                                <><Loader2 className="mr-3 h-5 w-5 animate-spin" /> Analyzing your document...</>
                            ) : (
                                <><ShieldCheck className="mr-3 h-5 w-5" /> Start analysis</>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </motion.div>

        <div ref={reportRef} className="space-y-8 scroll-mt-20">
            <div className="flex flex-col items-center gap-4 mb-4">
                <ChevronDown className="h-8 w-8 text-primary animate-bounce opacity-40" />
                <Badge variant="outline" className="font-black text-[10px] uppercase tracking-widest bg-primary/5 text-primary border-primary/10 px-4 py-1.5 rounded-full">Report entry</Badge>
            </div>

            <Card className="glass border-primary/20 shadow-3xl rounded-[3rem] overflow-hidden relative min-h-[600px] flex flex-col">
                <div className="absolute inset-0 p-12 opacity-[0.02] pointer-events-none grayscale flex items-center justify-center">
                    <Logo className="h-[600px] w-[600px] border-none p-0" priority={false} />
                </div>

                <CardHeader className={cn(
                    "p-8 sm:p-12 relative z-10 transition-colors duration-500 border-b border-primary/10",
                    state.status === 'success' ? "bg-primary text-primary-foreground" : "bg-muted/30 text-foreground"
                )}>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 text-left">
                        <div className="space-y-6 text-left flex-1 min-w-0">
                            <div className="flex items-center gap-4">
                                <div className={cn(
                                    "flex items-center gap-3 px-4 py-1.5 rounded-full border shadow-sm",
                                    state.status === 'success' ? "bg-white/10 border-white/20" : "bg-background border-primary/5"
                                )}>
                                    <Bot className={cn("h-4 w-4", state.status === 'success' ? "text-white" : "text-primary")} />
                                    <span className={cn("text-[10px] font-bold", state.status === 'success' ? "text-white" : "text-primary")}>
                                        {state.status === 'success' ? "Analysis complete" : "AI analysis"}
                                    </span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <CardTitle className="text-xl sm:text-3xl font-black font-headline leading-none">
                                    {state.status === 'success' ? "Your report is ready" : "Waiting for your file"}
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
                                    text={`${state.data?.summary}. Risks identified: ${state.data?.legalRisks}.`} 
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
                                    <p className="font-black text-2xl tracking-tighter uppercase text-foreground">Analyzing your document...</p>
                                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground animate-pulse">Running AI risk scan...</p>
                                </div>
                            </motion.div>
                        ) : state.status === "success" && state.data ? (
                            <motion.div 
                                key="report-content"
                                initial={{ opacity: 0, y: 20 }} 
                                animate={{ opacity: 1, y: 0 }} 
                                className="space-y-12 pb-10 text-left"
                            >
                                <div className="p-8 glass rounded-[2.5rem] border border-primary/10 shadow-inner bg-primary/[0.02]">
                                    <div className="flex items-center gap-3 mb-4 text-primary opacity-40">
                                        <Fingerprint className="h-5 w-5" />
                                        <span className="text-[11px] font-black uppercase tracking-widest">Report summary</span>
                                    </div>
                                    <p className="text-sm sm:text-lg text-foreground font-black leading-relaxed tracking-tight">{state.data.summary}</p>
                                </div>
                                
                                <div className="grid sm:grid-cols-2 gap-8 text-left">
                                    <Card className="bg-red-500/[0.03] rounded-[2.5rem] border-red-500/10 p-8 shadow-sm hover:shadow-xl transition-all group">
                                        <h3 className="text-[11px] font-black text-red-600 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                                            <AlertTriangle className="h-4 w-4" /> Risk factors
                                        </h3>
                                        <p className="text-sm font-bold text-muted-foreground leading-relaxed">{state.data.legalRisks}</p>
                                    </Card>
                                    <Card className="bg-amber-500/[0.03] rounded-[2.5rem] border-amber-500/10 p-8 shadow-sm hover:shadow-xl transition-all group">
                                        <h3 className="text-[11px] font-black text-amber-600 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                                            <CalendarClock className="h-4 w-4" /> Important dates
                                        </h3>
                                        <p className="text-sm font-bold text-muted-foreground leading-relaxed">{state.data.deadlines}</p>
                                    </Card>
                                </div>

                                <div className="p-8 sm:p-10 bg-background rounded-[3rem] border border-primary/10 shadow-2xl relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none group-hover:scale-110 transition-transform duration-700">
                                        <Search className="h-32 w-32" />
                                    </div>
                                    <h3 className="text-[11px] font-black text-primary uppercase tracking-[0.3em] mb-6 flex items-center gap-3 relative z-10">
                                        <ListChecks className="h-4 w-4" /> Action plan
                                    </h3>
                                    <p className="text-sm sm:text-base font-bold text-muted-foreground leading-loose whitespace-pre-line relative z-10">{state.data.requiredActions}</p>
                                </div>

                                <div className="pt-10 mt-10 border-t border-primary/5 flex flex-col sm:flex-row items-center justify-between gap-8 opacity-40">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-2xl bg-primary/5 text-primary">
                                            <ShieldCheck className="h-6 w-6" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-[10px] font-black uppercase tracking-widest">Secure system</p>
                                            <p className="text-[9px] font-bold">This report is protected by high-level encryption.</p>
                                        </div>
                                    </div>
                                    <p className="text-[9px] font-black uppercase tracking-[0.5em]">NYAYASAHAYAK.IN</p>
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
                                        <FileSearch className="h-20 w-20 text-primary opacity-40 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </div>
                                <div className="space-y-4 max-w-sm px-6 text-center">
                                    <h3 className="font-black text-3xl tracking-tighter uppercase text-foreground leading-none">Ready to start</h3>
                                    <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-[0.2em] leading-relaxed italic opacity-60">
                                        Upload a document to start your AI analysis.
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
