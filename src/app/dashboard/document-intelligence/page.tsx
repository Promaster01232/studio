"use client";

import { useActionState, useRef, useState, useEffect, use } from "react";
import { understandDocumentAction, type DocumentIntelligenceState } from "./actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  FileUp, 
  Bot, 
  AlertTriangle, 
  CalendarClock, 
  ListChecks, 
  ShieldCheck, 
  Loader2, 
  Activity, 
  FileText,
  Plus,
  FileCheck,
  Sparkles,
  Download,
  Printer,
  ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AudioAssistant } from "@/components/audio-assistant";
import { useFirestore, useAuth } from "@/firebase";
import { doc, updateDoc, increment } from "firebase/firestore";
import { Logo } from "@/components/logo";
import { Badge } from "@/components/ui/badge";
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
    <div className="min-h-full space-y-8 max-w-4xl mx-auto pb-32 px-4 sm:px-6 text-center">
        <AnimatePresence mode="wait">
            {state.status === 'idle' && !fileName ? (
                <motion.div 
                    key="idle-state"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex flex-col items-center justify-center py-20 space-y-8"
                >
                    <div className="relative group">
                        <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                        <div className="relative h-16 w-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 group-hover:scale-110 group-hover:text-primary transition-all duration-500 shadow-2xl">
                            <FileText className="h-8 w-8 opacity-40 group-hover:opacity-100" />
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <h2 className="text-2xl font-black tracking-tight text-white leading-none">Ready to analyze your files</h2>
                        <p className="text-sm font-medium text-gray-500 tracking-wide max-w-sm mx-auto">Upload any legal document, contract, or court order. My forensic engine will identify risks and summarize the content instantly.</p>
                    </div>

                    <div className="relative pt-4">
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleFileChange} 
                            className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                            accept=".pdf,.doc,.docx,image/*"
                        />
                        <Button className="h-14 px-10 rounded-2xl bg-primary text-primary-foreground font-black text-xs tracking-widest shadow-2xl active:scale-95 transition-all gap-3">
                            <FileUp className="h-5 w-5" />
                            Upload document
                        </Button>
                        <p className="mt-4 text-[10px] font-bold text-gray-600 uppercase tracking-widest">Supports pdf, docx, and images</p>
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
                        <Loader2 className="h-20 w-20 animate-spin text-primary opacity-20" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Bot className="h-8 w-8 text-primary animate-pulse" />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <h3 className="text-2xl font-black tracking-tight text-white">Analyzing record...</h3>
                        <p className="text-[10px] font-black text-gray-500 tracking-[0.4em] animate-pulse uppercase">Running forensic Ocr engine</p>
                    </div>
                </motion.div>
            ) : state.status === 'success' && state.data ? (
                <motion.div 
                    key="report-state"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8 text-left"
                    ref={reportRef}
                >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-6 bg-[#161b22] border border-white/5 rounded-[2rem] shadow-2xl">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-inner">
                                <FileCheck className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black tracking-tight text-white leading-none">Analysis report ready</h3>
                                <div className="flex items-center gap-2 mt-1.5">
                                    <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20 text-[8px] font-black px-2 uppercase">Verified scan</Badge>
                                    <span className="text-[9px] font-bold text-gray-500 tracking-wider truncate max-w-[150px]">{fileName}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button variant="outline" size="sm" onClick={handleReset} className="h-9 px-4 rounded-xl border-white/10 hover:bg-white/5 text-[9px] font-black tracking-widest uppercase">
                                <Plus className="h-3 w-3 mr-2" /> New scan
                            </Button>
                            <AudioAssistant text={`${state.data.summary}. Risks: ${state.data.legalRisks}`} language="English" />
                        </div>
                    </div>

                    <div className="bg-[#111111] border border-white/5 rounded-[2.5rem] p-8 sm:p-12 shadow-3xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                            <Logo className="h-64 w-64 grayscale opacity-20" priority={false} />
                        </div>
                        
                        <div className="relative z-10 space-y-12">
                            {/* AI Summary Section */}
                            <div className="flex items-start gap-5">
                                <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 shadow-lg">
                                    <Bot className="h-5 w-5 text-primary" />
                                </div>
                                <div className="space-y-4 flex-1">
                                    <div className="flex items-center gap-2 text-primary opacity-40">
                                        <Sparkles className="h-3.5 w-3.5" />
                                        <span className="text-[9px] font-black tracking-[0.2em] uppercase">Executive audit</span>
                                    </div>
                                    <p className="text-xl font-black text-white leading-tight tracking-tight">{state.data.summary}</p>
                                </div>
                            </div>

                            {/* Risk Grid */}
                            <div className="grid md:grid-cols-2 gap-6 ml-0 sm:ml-14">
                                <div className="bg-red-500/[0.03] border border-red-500/10 rounded-[1.8rem] p-6 space-y-4 shadow-inner group/card hover:bg-red-500/[0.05] transition-all">
                                    <h4 className="text-[9px] font-black text-red-600 tracking-[0.3em] flex items-center gap-2 uppercase">
                                        <AlertTriangle className="h-3.5 w-3.5" /> Statutory risks
                                    </h4>
                                    <p className="text-sm font-bold text-gray-400 leading-relaxed">{state.data.legalRisks}</p>
                                </div>
                                <div className="bg-amber-500/[0.03] border border-amber-500/10 rounded-[1.8rem] p-6 space-y-4 shadow-inner group/card hover:bg-amber-500/[0.05] transition-all">
                                    <h4 className="text-[9px] font-black text-amber-600 tracking-[0.3em] flex items-center gap-2 uppercase">
                                        <CalendarClock className="h-3.5 w-3.5" /> Procedural deadlines
                                    </h4>
                                    <p className="text-sm font-bold text-gray-400 leading-relaxed">{state.data.deadlines}</p>
                                </div>
                            </div>

                            {/* Actions Section */}
                            <div className="flex items-start gap-5">
                                <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 shadow-lg">
                                    <ListChecks className="h-5 w-5 text-indigo-400" />
                                </div>
                                <div className="space-y-6 flex-1 bg-white/[0.02] border border-white/5 p-8 rounded-[2rem] shadow-xl">
                                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                                        <div className="flex items-center gap-2 text-indigo-400">
                                            <Activity className="h-3.5 w-3.5" />
                                            <span className="text-[9px] font-black tracking-[0.2em] uppercase">Recommended actions</span>
                                        </div>
                                        <Badge variant="outline" className="border-indigo-500/20 text-indigo-400 text-[8px] uppercase font-black">Procedural path</Badge>
                                    </div>
                                    <div className="prose dark:prose-invert max-w-none">
                                        <p className="text-sm sm:text-base font-bold text-gray-400 leading-relaxed whitespace-pre-line">
                                            {state.data.requiredActions}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Warning Section */}
                            <div className="ml-0 sm:ml-14 p-8 bg-destructive/5 border border-destructive/10 rounded-[2rem] shadow-inner flex flex-col sm:flex-row items-center gap-6">
                                <div className="p-4 rounded-xl bg-destructive/10 text-destructive shadow-sm">
                                    <ShieldCheck className="h-6 w-6" />
                                </div>
                                <div className="space-y-1 text-center sm:text-left">
                                    <h4 className="text-[9px] font-black text-destructive tracking-[0.4em] uppercase">Audit warning: Consequences</h4>
                                    <p className="text-xs font-medium text-gray-500 leading-relaxed max-w-2xl">{state.data.consequences}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6 opacity-40">
                            <div className="flex items-center gap-4">
                                <Button variant="ghost" size="sm" className="h-8 px-3 rounded-lg font-bold text-[9px] gap-2 hover:bg-white/5 uppercase">
                                    <Download className="h-3 w-3" /> Save record
                                </Button>
                                <Button variant="ghost" size="sm" className="h-8 px-3 rounded-lg font-bold text-[9px] gap-2 hover:bg-white/5 uppercase">
                                    <Printer className="h-3 w-3" /> Print dossier
                                </Button>
                            </div>
                            <p className="text-[9px] font-black tracking-[0.6em] text-white uppercase">Nyayasahayak.in // Scan hub</p>
                        </div>
                    </div>
                </motion.div>
            ) : null}
        </AnimatePresence>
    </div>
  );
}
