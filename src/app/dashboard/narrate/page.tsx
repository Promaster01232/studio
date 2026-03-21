"use client";

import { useActionState, useState, useRef, useEffect, startTransition } from "react";
import { summarizeCaseAction, type CaseSummaryState } from "./actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, Bot, FileText, Scale, Landmark, StepForward, Loader2, Languages, Headphones, FileSearch, Upload, Sparkles, ShieldCheck, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { AudioAssistant } from "@/components/audio-assistant";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const initialState: CaseSummaryState = {
  status: "idle",
  data: null,
  error: null,
};

export default function NarrateProblemPage() {
  const [state, formAction] = useActionState(summarizeCaseAction, initialState);
  const { toast } = useToast();

  const [hasPermission, setHasPermission] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const [language, setLanguage] = useState("English");

  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const timerInterval = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const getMicrophonePermission = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setHasPermission(true);
      } catch (error) {
        setHasPermission(false);
        toast({
          variant: "destructive",
          title: "Capture Protocol Denied",
          description: "Enable microphone permissions in browser settings to initialize audio capture.",
        });
      }
    };
    getMicrophonePermission();
  }, [toast]);

  const startRecording = async () => {
    if (!hasPermission || state.status === "loading") return;
    setIsRecording(true);
    setTimer(0);
    if(timerInterval.current) clearInterval(timerInterval.current);
    timerInterval.current = setInterval(() => setTimer((prev) => prev + 1), 1000);

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
        mediaRecorder.current = recorder;
        const chunks: Blob[] = [];
        recorder.ondataavailable = (e) => e.data.size > 0 && chunks.push(e.data);
        recorder.onstop = () => {
            stream.getTracks().forEach((track) => track.stop());
            if (timerInterval.current) clearInterval(timerInterval.current);
            const blob = new Blob(chunks, { type: "audio/webm" });
            if (blob.size > 500) {
                const formData = new FormData();
                formData.append("problemAudio", new File([blob], "narration.webm", { type: "audio/webm" }));
                formData.append("language", language);
                startTransition(() => formAction(formData));
            } else {
                 toast({ variant: "destructive", title: "Capture Insufficient", description: "Narration must exceed 2 seconds for neural audit." });
            }
            setIsRecording(false);
        };
        recorder.start();
    } catch(err) {
        toast({ variant: "destructive", title: "Hardware Failure", description: "Could not initialize microphone node." });
        setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) mediaRecorder.current.stop();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && state.status !== "loading") {
        if (!file.type.startsWith('audio/')) {
            toast({ variant: "destructive", title: "Registry Mismatch", description: "Upload compatible audio files only." });
            return;
        }
        const formData = new FormData();
        formData.append("problemAudio", file);
        formData.append("language", language);
        startTransition(() => formAction(formData));
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const isLoading = state.status === "loading";

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-20 px-2 sm:px-0">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <PageHeader
            title="Neural Voice Narrator"
            description="Institutional-grade audio analysis. Speak naturally to generate a comprehensive forensic legal report."
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-4 space-y-6"
        >
            <Card className="glass shadow-2xl overflow-hidden rounded-[2.5rem] border-primary/5">
                <CardHeader className="bg-primary/5 border-b border-primary/10 p-8">
                    <div className="flex items-center gap-3 mb-2 text-primary">
                        <Mic className="h-5 w-5" />
                        <CardTitle className="text-xl font-black tracking-tight leading-none uppercase">Capture Node</CardTitle>
                    </div>
                    <CardDescription className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">Secured Registry Protocol</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center space-y-8 pt-10 pb-10">
                    <div className="w-full space-y-4 px-2">
                        <div className="space-y-3">
                            <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1 flex items-center gap-2">
                                <Languages className="h-3 w-3" /> Dialect Registry
                            </Label>
                            <Select value={language} onValueChange={setLanguage} disabled={isRecording || isLoading}>
                                <SelectTrigger className="h-12 glass border-primary/5 font-bold rounded-xl active:scale-95 transition-all">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="glass border-primary/5 rounded-[1.5rem]">
                                    <SelectItem value="English" className="font-bold rounded-lg">English (Forensic)</SelectItem>
                                    <SelectItem value="Hindi" className="font-bold rounded-lg">Hindi (Official)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="relative group">
                        <AnimatePresence>
                            {isRecording && (
                                <motion.div 
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1.5, opacity: 1 }}
                                    exit={{ scale: 0.8, opacity: 0 }}
                                    className="absolute inset-0 rounded-full bg-red-500/20 blur-2xl -z-10"
                                />
                            )}
                        </AnimatePresence>
                        
                        <Button
                            onClick={isRecording ? stopRecording : startRecording}
                            disabled={!hasPermission || isLoading}
                            className={cn(
                                "h-32 w-32 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex flex-col gap-3 transition-all duration-500 relative z-10 active:scale-90",
                                isRecording ? 'bg-red-500 hover:bg-red-600 scale-110 shadow-red-500/40' : 'bg-primary hover:shadow-primary/40'
                            )}
                        >
                            {isRecording ? (
                                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="h-10 w-10 bg-white rounded-xl shadow-lg" />
                            ) : (
                                <Mic className="h-12 w-12" />
                            )}
                            <span className="text-[10px] font-black uppercase tracking-widest">
                                {isRecording ? "Abort" : "Initialize"}
                            </span>
                        </Button>
                    </div>

                    <div className="text-center space-y-2">
                        <p className={cn("text-5xl font-mono font-black tracking-tighter transition-colors duration-500", isRecording ? "text-red-500" : "text-primary")}>
                            {formatTime(timer)}
                        </p>
                        <div className="flex items-center justify-center gap-2">
                            <div className={cn("h-1.5 w-1.5 rounded-full animate-pulse", isRecording ? "bg-red-500" : "bg-primary")}></div>
                            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em]">
                                {isRecording ? "Transmission Active" : isLoading ? "AI Processing Unit..." : "Node Ready"}
                            </p>
                        </div>
                    </div>

                    <div className="w-full pt-6 border-t border-primary/5 flex flex-col items-center gap-4">
                        <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="audio/*" className="hidden" />
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isRecording || isLoading}
                            className="text-[10px] font-black uppercase tracking-widest text-primary/60 hover:text-primary hover:bg-primary/5 rounded-xl gap-3 transition-all active:scale-95"
                        >
                            <Upload className="h-4 w-4" />
                            Ingest Registry File
                        </Button>
                    </div>
                </CardContent>
            </Card>
            
            <Card className="bg-primary/5 border-primary/10 rounded-[2rem] p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-[0.05] group-hover:scale-110 transition-transform duration-700">
                    <ShieldCheck className="h-20 w-20" />
                </div>
                <div className="flex gap-4 relative z-10">
                    <div className="p-3 rounded-2xl bg-white/50 dark:bg-black/50 shadow-sm border border-primary/5 shrink-0 h-fit">
                        <Headphones className="h-5 w-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-xs font-black text-primary uppercase tracking-widest">Protocol Instructions</p>
                        <p className="text-[11px] text-muted-foreground leading-relaxed font-medium">
                            Briefly outline the incident, involved entities, and core grievance. Clarity maximizes neural audit precision.
                        </p>
                    </div>
                </div>
            </Card>
        </motion.div>

        <motion.div 
            initial={{ opacity: 0, x: 30 }} 
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-8 space-y-8"
        >
            <Card className="glass shadow-2xl min-h-[600px] flex flex-col rounded-[2.5rem] overflow-hidden border-primary/5">
                <CardHeader className="bg-primary/5 border-b border-primary/10 flex flex-row items-center justify-between p-8 sm:p-10">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-primary mb-1">
                            <Bot className="h-4 w-4" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Institutional AI Node</span>
                        </div>
                        <CardTitle className="text-2xl font-black tracking-tight leading-none">Forensic Audit Output</CardTitle>
                    </div>
                    {state.status === "success" && state.data && (
                        <AudioAssistant 
                            text={`Narration Summary: ${state.data.caseSummary}. Detailed Forensic Analysis: ${state.data.detailedAnalysis}. Mandatory Next Steps: ${state.data.nextActions}`} 
                            language={language}
                        />
                    )}
                </CardHeader>
                <CardContent className="p-8 sm:p-10 flex-1">
                    <AnimatePresence mode="wait">
                        {isLoading && (
                            <motion.div 
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="flex flex-col items-center justify-center h-full py-20 text-center gap-10"
                            >
                                <div className="relative">
                                    <motion.div 
                                        animate={{ rotate: 360 }} 
                                        transition={{ repeat: Infinity, duration: 6, ease: "linear" }} 
                                        className="p-16 rounded-full border-4 border-dashed border-primary/20"
                                    >
                                        <Bot className="h-20 w-20 text-primary opacity-20" />
                                    </motion.div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Loader2 className="h-10 w-10 animate-spin text-primary" />
                                    </div>
                                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute -top-2 -right-2 p-2 rounded-lg bg-primary text-white shadow-xl">
                                        <Sparkles className="h-4 w-4" />
                                    </motion.div>
                                </div>
                                <div className="space-y-3">
                                    <p className="font-black text-3xl tracking-tighter">Deconstructing Narration...</p>
                                    <p className="text-sm text-muted-foreground font-medium max-w-[320px] mx-auto leading-relaxed">Extracting statutory violations and generating procedural roadmap.</p>
                                </div>
                            </motion.div>
                        )}
                        
                        {state.status === 'idle' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-full py-20 text-center gap-8 opacity-40">
                                <div className="p-10 rounded-[2.5rem] bg-muted/50 border-2 border-dashed border-primary/10 transition-all duration-700 hover:rotate-2">
                                    <Mic className="h-20 w-20 text-muted-foreground" />
                                </div>
                                <div className="space-y-2">
                                    <p className="font-black text-xl tracking-tighter uppercase">Awaiting Registry Transmission</p>
                                    <p className="text-xs text-muted-foreground font-medium max-w-[280px] mx-auto leading-relaxed italic">Your comprehensive forensic report will materialize here once the neural audit protocol finishes.</p>
                                </div>
                            </motion.div>
                        )}

                        {state.status === "success" && state.data && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10 pb-10">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] flex items-center gap-3">
                                            <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></div>
                                            Registry Transcription
                                        </h3>
                                        <CheckCircle2 className="h-4 w-4 text-green-600 opacity-40" />
                                    </div>
                                    <div className="p-6 sm:p-8 glass rounded-[2rem] border-primary/5 italic text-sm sm:text-base font-medium text-muted-foreground leading-relaxed shadow-inner">
                                        "{state.data.transcription}"
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Card className="p-8 glass rounded-[2.5rem] border-primary/10 shadow-xl shadow-primary/5">
                                        <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-4 flex items-center gap-3">
                                            <Bot className="h-4 w-4" /> Case Summary
                                        </h3>
                                        <p className="text-sm sm:text-base font-black leading-relaxed tracking-tight text-foreground">{state.data.caseSummary}</p>
                                    </Card>
                                    <div className="space-y-4">
                                        <div className="p-6 glass rounded-2xl border-primary/10 flex items-center justify-between group transition-all hover:bg-primary/5">
                                            <div className="flex items-center gap-4">
                                                <div className="p-2.5 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                                                    <Scale className="h-5 w-5" />
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Nature</span>
                                            </div>
                                            <span className="text-[10px] font-black text-primary bg-primary/5 px-4 py-1.5 rounded-full uppercase border border-primary/10">{state.data.caseType}</span>
                                        </div>
                                        <div className="p-6 glass rounded-2xl border-primary/10 flex items-center justify-between group transition-all hover:bg-primary/5">
                                            <div className="flex items-center gap-4">
                                                <div className="p-2.5 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                                                    <Landmark className="h-5 w-5" />
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Registry</span>
                                            </div>
                                            <span className="text-[10px] font-bold text-muted-foreground/80 truncate max-w-[140px] text-right">{state.data.jurisdiction}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] flex items-center gap-3 px-2">
                                        <FileSearch className="h-4 w-4" /> Forensic Statutory Audit
                                    </h3>
                                    <div className="p-8 sm:p-10 glass rounded-[2.5rem] border-primary/10 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:rotate-12 transition-transform duration-1000">
                                            <Scale className="h-40 w-40" />
                                        </div>
                                        <div className="text-sm sm:text-base font-medium text-foreground leading-relaxed whitespace-pre-line relative z-10 prose dark:prose-invert max-w-none prose-p:font-bold">
                                            {state.data.detailedAnalysis}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] flex items-center gap-3 px-2">
                                            <StepForward className="h-4 w-4" /> Procedural Roadmap
                                        </h3>
                                        <div className="p-6 sm:p-8 bg-primary/5 rounded-[2.5rem] border border-primary/10 min-h-[120px] shadow-inner">
                                            <div className="text-[11px] sm:text-xs font-bold text-muted-foreground leading-relaxed whitespace-pre-line italic">
                                                {state.data.nextActions}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] flex items-center gap-3 px-2">
                                            <FileText className="h-4 w-4" /> Applicable Statutes
                                        </h3>
                                        <div className="p-6 sm:p-8 bg-muted/20 rounded-[2.5rem] border border-primary/5 min-h-[120px]">
                                            <p className="text-[11px] sm:text-xs font-black text-primary leading-relaxed uppercase tracking-tighter">
                                                {state.data.relevantLaws}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </CardContent>
            </Card>
        </motion.div>
      </div>
    </div>
  );
}