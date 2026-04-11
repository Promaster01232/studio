"use client";

import { useActionState, useRef, useState, useEffect, use } from "react";
import { understandDocumentAction, type DocumentIntelligenceState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { 
  FileUp, 
  Bot, 
  AlertTriangle, 
  CalendarClock, 
  ListChecks, 
  ShieldCheck, 
  ArrowLeft, 
  Loader2, 
  Activity, 
  FileText,
  Plus,
  X,
  FileCheck,
  Search,
  MessageSquare,
  Sparkles,
  Download,
  Printer,
  History
} from "lucide-react";
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

export default function DocumentIntelligencePage({ 
  params, 
  searchParams 
}: { 
  params: Promise<any>, 
  searchParams: Promise<any> 
}) {
  // Unwrap params for Next.js 15 compliance
  use(params);
  use(searchParams);

  const [state, formAction] = useActionState(understandDocumentAction, initialState);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const reportRef = useRef<HTMLDivElement>(null);
  
  const firestore = useFirestore();
  const auth = useAuth();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      // Automatically trigger form submission when file is selected
      const formData = new FormData();
      formData.append("document", file);
      formData.append("language", "English");
      formAction(formData);
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
      setFileName("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      window.location.reload();
  };

  return (
    <div className="min-h-full space-y-10 max-w-5xl mx-auto pb-32 px-4 sm:px-6 text-center">
        {/* HEADER NAVIGATION */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between border-b border-white/5 pb-6 mb-10 text-left">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="rounded-xl hover:bg-white/5 text-gray-400" asChild>
                    <Link href="/dashboard"><ArrowLeft className="h-5 w-5" /></Link>
                </Button>
                <div>
                    <h1 className="text-xl font-black tracking-tight text-white uppercase">Scan Documents</h1>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Forensic AI Analysis Hub</p>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5">
                    <History className="h-3.5 w-3.5 text-primary" />
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Audit Registry</span>
                </div>
            </div>
        </motion.div>

        <AnimatePresence mode="wait">
            {state.status === 'idle' && !fileName ? (
                <motion.div 
                    key="idle-state"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex flex-col items-center justify-center py-32 space-y-8"
                >
                    <div className="relative group">
                        <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                        <div className="relative h-20 w-20 rounded-[1.8rem] bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 group-hover:scale-110 group-hover:text-primary transition-all duration-500">
                            <FileText className="h-10 w-10 opacity-40 group-hover:opacity-100" />
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-none">No files yet</h2>
                        <p className="text-sm font-medium text-gray-500 tracking-wide">Upload your first document to get started</p>
                    </div>

                    <div className="relative">
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleFileChange} 
                            className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                            accept=".pdf,.doc,.docx,image/*"
                        />
                        <Button className="h-14 px-8 rounded-2xl bg-primary text-primary-foreground font-black text-xs uppercase tracking-widest shadow-[0_20px_50px_rgba(153,75,0,0.3)] active:scale-95 transition-all gap-3">
                            <FileUp className="h-5 w-5" />
                            Upload Document
                        </Button>
                    </div>
                </motion.div>
            ) : state.status === 'loading' ? (
                <motion.div 
                    key="loading-state"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-32 space-y-10"
                >
                    <div className="relative">
                        <Loader2 className="h-24 w-24 animate-spin text-primary opacity-20" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Bot className="h-10 w-10 text-primary animate-pulse" />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <h3 className="text-2xl font-black tracking-tight text-white uppercase">Analyzing Record...</h3>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] animate-pulse">Running forensic OCR engine</p>
                    </div>
                </motion.div>
            ) : state.status === 'success' && state.data ? (
                <motion.div 
                    key="report-state"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-10 text-left"
                    ref={reportRef}
                >
                    {/* CHAT REPORT STYLE HEADER */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-8 bg-[#161b22] border border-white/5 rounded-[2.5rem] shadow-2xl">
                        <div className="flex items-center gap-5">
                            <div className="h-14 w-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                                <FileCheck className="h-7 w-7" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black tracking-tight text-white uppercase leading-none">Analysis Protocol Ready</h3>
                                <div className="flex items-center gap-3 mt-2">
                                    <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 text-[8px] font-black uppercase px-2">Verified Scan</Badge>
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{fileName || 'Untitled Instrument'}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button variant="outline" size="sm" onClick={handleReset} className="h-10 px-5 rounded-xl border-white/10 hover:bg-white/5 text-[10px] font-black uppercase tracking-widest">
                                <Plus className="h-3.5 w-3.5 mr-2" /> New Scan
                            </Button>
                            <AudioAssistant text={`${state.data.summary}. Risks: ${state.data.legalRisks}`} language="English" />
                        </div>
                    </div>

                    {/* MAIN REPORT BODY (CHAT DOSSIER STYLE) */}
                    <div className="grid gap-8">
                        {/* Summary Message */}
                        <div className="flex items-start gap-4 max-w-4xl">
                            <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-1">
                                <Bot className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1 bg-[#161b22] border border-white/5 p-8 rounded-[2rem] rounded-tl-none shadow-xl space-y-6">
                                <div className="flex items-center gap-2 text-primary opacity-40">
                                    <Sparkles className="h-4 w-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Executive Audit</span>
                                </div>
                                <p className="text-lg font-black text-white leading-tight tracking-tight uppercase">{state.data.summary}</p>
                            </div>
                        </div>

                        {/* Risks & Deadlines (Internal Protocol) */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <Card className="bg-red-500/[0.03] border-red-500/10 rounded-[2rem] p-8 shadow-sm hover:shadow-2xl transition-all group overflow-hidden">
                                <h4 className="text-[10px] font-black text-red-600 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                                    <AlertTriangle className="h-4 w-4" /> Statutory Risks
                                </h4>
                                <p className="text-sm font-bold text-gray-400 leading-relaxed">{state.data.legalRisks}</p>
                            </Card>
                            <Card className="bg-amber-500/[0.03] border-amber-500/10 rounded-[2rem] p-8 shadow-sm hover:shadow-2xl transition-all group overflow-hidden">
                                <h4 className="text-[10px] font-black text-amber-600 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                                    <CalendarClock className="h-4 w-4" /> Procedural Deadlines
                                </h4>
                                <p className="text-sm font-bold text-gray-400 leading-relaxed">{state.data.deadlines}</p>
                            </Card>
                        </div>

                        {/* Roadmap Message */}
                        <div className="flex items-start gap-4 max-w-4xl">
                            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 mt-1">
                                <ListChecks className="h-5 w-5 text-indigo-400" />
                            </div>
                            <div className="flex-1 bg-[#161b22] border border-white/5 p-8 rounded-[2rem] rounded-tl-none shadow-xl space-y-6">
                                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                                    <div className="flex items-center gap-2 text-indigo-400">
                                        <Activity className="h-4 w-4" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Recommended Actions</span>
                                    </div>
                                    <Badge variant="outline" className="border-indigo-500/20 text-indigo-400 text-[8px] uppercase">Procedural Path</Badge>
                                </div>
                                <div className="prose dark:prose-invert max-w-none">
                                    <p className="text-sm sm:text-base font-bold text-gray-400 leading-relaxed whitespace-pre-line">
                                        {state.data.requiredActions}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Consequences Alert */}
                        <div className="bg-black/40 border border-white/5 p-10 rounded-[3rem] relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                                <ShieldCheck className="h-40 w-40" />
                            </div>
                            <div className="flex flex-col sm:flex-row gap-8 items-center relative z-10">
                                <div className="p-5 rounded-2xl bg-destructive/10 text-destructive shadow-inner">
                                    <AlertTriangle className="h-8 w-8" />
                                </div>
                                <div className="space-y-2 text-center sm:text-left">
                                    <h4 className="text-[10px] font-black text-destructive uppercase tracking-[0.4em]">Audit Warning: Consequences</h4>
                                    <p className="text-sm font-medium text-gray-500 leading-relaxed max-w-3xl">{state.data.consequences}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* REPORT FOOTER ACTIONS */}
                    <div className="pt-10 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-8 opacity-40">
                        <div className="flex items-center gap-6">
                            <Button variant="ghost" size="sm" className="h-9 px-4 rounded-xl font-bold text-[10px] uppercase gap-2 hover:bg-white/5">
                                <Download className="h-3.5 w-3.5" /> Save Record
                            </Button>
                            <Button variant="ghost" size="sm" className="h-9 px-4 rounded-xl font-bold text-[10px] uppercase gap-2 hover:bg-white/5">
                                <Printer className="h-3.5 w-3.5" /> Print Dossier
                            </Button>
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-[0.6em] text-white">NYAYASAHAYAK.IN // SCAN-HUB</p>
                    </div>
                </motion.div>
            ) : null}
        </AnimatePresence>

        {/* ERROR STATE */}
        {state.status === 'error' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-20">
                <Card className="max-w-md mx-auto bg-destructive/5 border-destructive/20 p-8 rounded-[2rem] space-y-6">
                    <div className="p-4 bg-destructive/10 rounded-full w-fit mx-auto">
                        <X className="h-10 w-10 text-destructive" />
                    </div>
                    <div className="space-y-2 text-center">
                        <h3 className="text-xl font-black uppercase tracking-tight text-destructive">Ingress Refused</h3>
                        <p className="text-sm font-medium text-gray-500 leading-relaxed">{state.error}</p>
                    </div>
                    <Button onClick={handleReset} className="w-full h-12 bg-destructive text-white font-black uppercase tracking-widest text-[10px] rounded-xl active:scale-95 transition-all">
                        Reset Registry
                    </Button>
                </Card>
            </motion.div>
        )}
    </div>
  );
}
