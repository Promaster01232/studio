"use client";

import { useActionState, useState, useRef, useEffect, startTransition } from "react";
import { summarizeCaseAction, type CaseSummaryState } from "./actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Mic, 
  Bot, 
  FileText, 
  StepForward, 
  Loader2, 
  Languages, 
  FileSearch, 
  Upload, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Activity, 
  Cpu,
  Clock,
  Globe,
  Fingerprint,
  Landmark,
  PlusCircle,
  ArrowLeft,
  X
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { AudioAssistant } from "@/components/audio-assistant";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useFirestore, useAuth } from "@/firebase";
import { doc, updateDoc, increment } from "firebase/firestore";
import { Logo } from "@/components/logo";
import Link from "next/link";

const initialState: CaseSummaryState = {
  status: "idle",
  data: null,
  error: null,
};

export default function NarrateProblemPage() {
  const [state, formAction] = useActionState(summarizeCaseAction, initialState);
  const { toast } = useToast();
  const firestore = useFirestore();
  const auth = useAuth();

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
          description: "Please enable microphone permissions in your browser settings.",
        });
      }
    };
    getMicrophonePermission();
  }, [toast]);

  useEffect(() => {
    if (state.status === 'success' && auth.currentUser) {
        const userRef = doc(firestore, "users", auth.currentUser.uid);
        updateDoc(userRef, { aiUsageCount: increment(1) }).catch(console.error);
    }
  }, [state.status, auth.currentUser, firestore]);

  const startRecording = async () => {
    if (!hasPermission || state.status === "loading") return;
    setIsRecording(true);
    setTimer(0);
    timerInterval.current = setInterval(() => setTimer((prev) => prev + 1), 1000);

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
        mediaRecorder.current = recorder;
        const chunks: Blob[] = [];
        recorder.ondataavailable = (e) => {
            if (e.data.size > 0) chunks.push(e.data);
        };
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
                 toast({ variant: "destructive", title: "Transmission Insufficient", description: "Audio capture too short for deconstruction." });
            }
            setIsRecording(false);
        };
        recorder.start();
    } catch(err) {
        setIsRecording(false);
        if (timerInterval.current) clearInterval(timerInterval.current);
        toast({ variant: "destructive", title: "Ingress Error", description: "Could not initialize audio capture node." });
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
        mediaRecorder.current.stop();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && state.status !== "loading") {
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

  const handleReset = () => {
      window.location.reload();
  };

  const isLoading = state.status === "loading";

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20 px-4 sm:px-0 text-left">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-primary/5 pb-6">
            <PageHeader
                title="Voice Narrator"
                description="Initialize neural deconstruction of your legal narrative via voice ingress."
            />
            <Button variant="ghost" size="sm" className="rounded-xl font-bold hover:bg-primary/5 group h-10 px-6 border border-primary/5 text-primary text-[10px] uppercase tracking-widest" asChild>
                <Link href="/dashboard">
                    <ArrowLeft className="mr-2 h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" /> Back to Terminal
                </Link>
            </Button>
        </motion.div>

        <div className={cn("grid grid-cols-1 gap-8 items-start", state.status !== 'success' ? "lg:grid-cols-12" : "lg:grid-cols-1")}>
            <AnimatePresence mode="wait">
                {state.status !== 'success' ? (
                    <motion.div 
                        key="input-form"
                        initial={{ opacity: 0, x: -20 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        exit={{ opacity: 0, y: -20 }}
                        className="lg:col-span-5 space-y-6"
                    >
                        <Card className="glass shadow-2xl overflow-hidden rounded-[2.5rem] border-primary/5">
                            <CardHeader className="bg-primary/5 border-b border-primary/10 p-8 text-left">
                                <div className="flex items-center gap-3 mb-2 text-primary">
                                    <div className="p-2.5 rounded-xl bg-primary/10">
                                        <Mic className="h-5 w-5" />
                                    </div>
                                    <CardTitle className="text-xl font-black uppercase tracking-tight">Capture Protocol</CardTitle>
                                </div>
                                <CardDescription className="text-[10px] font-bold uppercase tracking-widest opacity-60">Initialize secured voice transmission.</CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col items-center justify-center space-y-8 pt-10 pb-10">
                                <div className="w-full space-y-4 px-2 text-left">
                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">Audit Language</Label>
                                        <Select value={language} onValueChange={setLanguage} disabled={isRecording || isLoading}>
                                            <SelectTrigger className="h-12 glass border-primary/5 font-bold rounded-xl active:scale-95 transition-all">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="glass border-primary/5 rounded-[1.5rem]">
                                                <SelectItem value="English" className="font-bold">English (Forensic)</SelectItem>
                                                <SelectItem value="Hindi" className="font-bold">Hindi (Official)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="relative flex flex-col items-center gap-6">
                                    <AnimatePresence>
                                        {isRecording && (
                                            <motion.div 
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                                className="absolute -top-12 flex items-center gap-1"
                                            >
                                                {[1, 2, 3, 4, 5].map((i) => (
                                                    <motion.div 
                                                        key={i}
                                                        animate={{ height: [4, 16, 4] }}
                                                        transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                                                        className="w-1 bg-red-500 rounded-full"
                                                    />
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <Button
                                        onClick={isRecording ? stopRecording : startRecording}
                                        disabled={!hasPermission || isLoading}
                                        className={cn(
                                            "h-32 w-32 rounded-[2.5rem] shadow-3xl flex flex-col gap-3 transition-all duration-500 active:scale-90",
                                            isRecording ? 'bg-red-500 hover:bg-red-600 scale-110 text-white' : 'bg-primary text-white'
                                        )}
                                    >
                                        {isRecording ? <div className="h-10 w-10 bg-white rounded-xl animate-pulse" /> : <Mic className="h-12 w-12" />}
                                        <span className="text-[10px] font-black uppercase tracking-widest">{isRecording ? "Terminate" : isLoading ? "Deconstructing" : "Speak Now"}</span>
                                    </Button>
                                    
                                    <div className="text-center space-y-1">
                                        <p className={cn("text-5xl font-mono font-black tracking-tighter", isRecording ? "text-red-500" : "text-primary")}>{formatTime(timer)}</p>
                                        <p className="text-[9px] text-muted-foreground font-black uppercase tracking-[0.2em]">{isRecording ? "Forensic Node Ingress" : isLoading ? "Neural Analysis Active" : "Awaiting transmission"}</p>
                                    </div>
                                </div>

                                <div className="w-full pt-6 border-t border-primary/5 text-center">
                                    <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="audio/*" className="hidden" />
                                    <Button variant="ghost" size="sm" onClick={() => fileInputRef.current?.click()} disabled={isRecording || isLoading} className="text-[10px] font-black uppercase tracking-widest text-primary/60 hover:text-primary gap-3 rounded-xl">
                                        <Upload className="h-4 w-4" /> Ingest From Registry
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ) : null}
            </AnimatePresence>

            <motion.div 
                layout
                className={cn("space-y-6", state.status !== 'success' ? "lg:col-span-7" : "lg:col-span-12")}
            >
                <Card className="glass shadow-2xl min-h-[600px] flex flex-col rounded-[2.5rem] overflow-hidden border-primary/5">
                    <CardHeader className="bg-primary/5 border-b border-primary/10 flex flex-row items-center justify-between p-8 sm:p-12 text-left gap-8 relative z-10">
                        <div className="space-y-4 text-left flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-3">
                                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                                    <Bot className="h-3.5 w-3.5 text-primary" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">Official AI Report</span>
                                </div>
                                {state.isSimulated && (
                                    <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-[9px] font-black uppercase tracking-widest">
                                        <Cpu className="h-3 w-3 mr-1.5" /> Local Node Fallback
                                    </Badge>
                                )}
                            </div>
                            <div className="space-y-1">
                                <CardTitle className="text-2xl sm:text-4xl font-black tracking-tighter uppercase leading-none">Voice Audit <span className="text-primary italic">Dossier</span></CardTitle>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em] flex items-center gap-2">
                                    <Globe className="h-3 w-3" /> Transience Node // BNS-V4.2
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col items-center sm:items-end gap-4 shrink-0">
                            <AnimatePresence>
                                {state.status === 'success' && (
                                    <div className="flex gap-3">
                                        <Button onClick={handleReset} variant="outline" size="sm" className="h-9 px-4 rounded-xl font-black text-[10px] uppercase tracking-widest gap-2 shadow-sm border-primary/10 hover:bg-primary/5">
                                            <PlusCircle className="h-4 w-4" /> New Narration
                                        </Button>
                                        <AudioAssistant 
                                            text={`Summary: ${state.data?.caseSummary}. Next Steps: ${state.data?.nextActions}. Full Analysis: ${state.data?.detailedAnalysis}.`} 
                                            language={language}
                                        />
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 sm:p-12 flex-1 relative z-10">
                        {/* Background Watermark */}
                        <div className="absolute inset-0 p-12 opacity-[0.01] pointer-events-none flex items-center justify-center grayscale">
                            <Logo className="h-[500px] w-[500px] border-none p-0" priority={false} />
                        </div>

                        <AnimatePresence mode="wait">
                            {isLoading ? (
                                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center h-full py-20 text-center gap-10">
                                    <div className="relative w-fit mx-auto">
                                        <Loader2 className="h-20 w-20 animate-spin text-primary opacity-20" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Activity className="h-8 w-8 text-primary animate-pulse" />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <p className="font-black text-2xl tracking-tighter uppercase">Deconstructing Transmission...</p>
                                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground animate-pulse">Running forensic sectional scan // BNS-2023</p>
                                    </div>
                                </motion.div>
                            ) : state.status === "success" && state.data ? (
                                <motion.div key="success" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12 pb-10 text-left relative z-10">
                                    <div className="p-8 glass rounded-[2rem] border-primary/5 italic text-sm sm:text-base font-medium text-muted-foreground leading-relaxed shadow-inner bg-muted/5">
                                        <div className="flex items-center gap-3 mb-4 text-primary opacity-40">
                                            <Fingerprint className="h-4 w-4" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Transcription Registry</span>
                                        </div>
                                        "{state.data.transcription}"
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-8">
                                        <Card className="p-8 glass rounded-[2rem] border-primary/10 text-left bg-primary/[0.02] shadow-sm hover:shadow-xl transition-all">
                                            <h3 className="text-[11px] font-black text-primary uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                                <StepForward className="h-4 w-4" /> Case Summary
                                            </h3>
                                            <p className="text-sm sm:text-base font-black leading-relaxed tracking-tight text-foreground">{state.data.caseSummary}</p>
                                        </Card>
                                        <Card className="p-8 glass rounded-[2rem] border-primary/10 text-left bg-blue-500/[0.02] shadow-sm hover:shadow-xl transition-all">
                                            <h3 className="text-[11px] font-black text-blue-600 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                                <Landmark className="h-4 w-4" /> Procedural Roadmap
                                            </h3>
                                            <p className="text-sm font-bold leading-relaxed text-foreground/80">{state.data.nextActions}</p>
                                        </Card>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between border-b border-primary/10 pb-4">
                                            <h3 className="text-[11px] font-black text-primary uppercase tracking-[0.3em] flex items-center gap-3">
                                                <FileSearch className="h-5 w-5" /> Forensic Statutory Audit
                                            </h3>
                                            <Badge variant="outline" className="text-[9px] font-black uppercase border-primary/20 opacity-40">Sectional Ingress: COMPLETE</Badge>
                                        </div>
                                        <div className="p-8 sm:p-12 glass rounded-[2.5rem] border-primary/10 text-sm sm:text-base font-medium leading-loose whitespace-pre-line text-left shadow-lg bg-muted/10 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none">
                                                <ScaleIcon className="h-40 w-40" />
                                            </div>
                                            {state.data.detailedAnalysis}
                                        </div>
                                    </div>
                                    
                                    <div className="pt-10 mt-10 border-t border-primary/5 flex flex-col sm:flex-row items-center justify-between gap-8 opacity-40">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 rounded-2xl bg-primary/5 text-primary">
                                                <ShieldCheck className="h-6 w-6" />
                                            </div>
                                            <div className="text-left">
                                                <p className="text-[10px] font-black uppercase tracking-widest">Institutional Security</p>
                                                <p className="text-[9px] font-bold">This node is protected under attorney-client transience protocols.</p>
                                            </div>
                                        </div>
                                        <p className="text-[9px] font-black uppercase tracking-[0.5em]">NYAYASAHAYAK.IN // TERMINAL NS-VOICE</p>
                                    </div>
                                </motion.div>
                            ) : state.status === 'error' ? (
                                <motion.div key="error" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
                                    <Card className="glass border-destructive/20 shadow-2xl rounded-[2rem] overflow-hidden">
                                        <div className="p-8 sm:p-10 flex flex-col items-center text-center gap-6">
                                            <div className="p-4 rounded-2xl bg-destructive/10 text-destructive shadow-inner">
                                                <AlertTriangle className="h-10 w-10" />
                                            </div>
                                            <div className="space-y-2">
                                                <h3 className="text-2xl font-black uppercase tracking-tight text-destructive">Ingress Delayed</h3>
                                                <p className="text-sm font-medium text-muted-foreground leading-relaxed max-w-md mx-auto px-4">
                                                    {state.error}
                                                </p>
                                            </div>
                                            <Button onClick={handleReset} variant="outline" className="rounded-xl font-bold h-12 px-10 border-destructive/20 text-destructive hover:bg-destructive/5 active:scale-95 transition-all">
                                                Re-initialize Protocol
                                            </Button>
                                        </div>
                                    </Card>
                                </motion.div>
                            ) : (
                                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-12">
                                    <Card className="glass border-dashed border-2 border-primary/10 rounded-[3rem] py-24 flex flex-col items-center justify-center text-center gap-10 shadow-inner group hover:border-primary/20 transition-all duration-500">
                                        <div className="relative">
                                            <div className="absolute -inset-6 bg-primary/5 rounded-full blur-2xl animate-pulse group-hover:bg-primary/10 transition-colors"></div>
                                            <div className="p-10 rounded-[2.5rem] bg-muted/30 border border-primary/5 relative z-10 transition-transform group-hover:scale-110 duration-700">
                                                <Mic className="h-20 w-20 text-primary opacity-40 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                        </div>
                                        <div className="space-y-4 max-w-sm px-6">
                                            <h3 className="font-black text-3xl tracking-tighter uppercase text-foreground leading-none">Awaiting Transmission</h3>
                                            <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-[0.2em] leading-relaxed italic opacity-60">
                                                Initialize the forensic node by providing your case narration for neural analysis.
                                            </p>
                                        </div>
                                    </Card>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </CardContent>
                    <div className="h-2 w-full bg-gradient-to-r from-primary via-accent to-blue-400"></div>
                </Card>
            </motion.div>
        </div>
    </div>
  );
}

function ScaleIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
            <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
            <path d="M7 21h10" />
            <path d="M12 3v18" />
            <path d="M3 7h2c2 0 5-1 7-2 3 1 5 2 7 2h2" />
        </svg>
    )
}
