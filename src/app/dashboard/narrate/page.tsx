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
  Landmark
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
          description: "Enable microphone permissions in browser settings.",
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
                 toast({ variant: "destructive", title: "Capture Insufficient" });
            }
            setIsRecording(false);
        };
        recorder.start();
    } catch(err) {
        setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) mediaRecorder.current.stop();
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

  const isLoading = state.status === "loading";

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-20 px-4 sm:px-0 text-left">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <PageHeader
                title="Neural Voice Narrator"
                description="Speak naturally to generate a comprehensive forensic legal report."
            />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-4 space-y-6">
                <Card className="glass shadow-2xl overflow-hidden rounded-[2.5rem] border-primary/5">
                    <CardHeader className="bg-primary/5 border-b border-primary/10 p-8 text-left">
                        <div className="flex items-center gap-3 mb-2 text-primary">
                            <Mic className="h-5 w-5" />
                            <CardTitle className="text-xl font-black tracking-tight uppercase">Capture Protocol</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center space-y-8 pt-10 pb-10">
                        <div className="w-full space-y-4 px-2 text-left">
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">Dialect Registry</Label>
                                <Select value={language} onValueChange={setLanguage} disabled={isRecording || isLoading}>
                                    <SelectTrigger className="h-12 glass border-primary/5 font-bold rounded-xl">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="glass border-primary/5 rounded-[1.5rem]">
                                        <SelectItem value="English" className="font-bold">English (Forensic)</SelectItem>
                                        <SelectItem value="Hindi" className="font-bold">Hindi (Official)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <Button
                            onClick={isRecording ? stopRecording : startRecording}
                            disabled={!hasPermission || isLoading}
                            className={cn(
                                "h-32 w-32 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex flex-col gap-3 transition-all duration-500",
                                isRecording ? 'bg-red-500 hover:bg-red-600 scale-110 text-white' : 'bg-primary text-white'
                            )}
                        >
                            {isRecording ? <div className="h-10 w-10 bg-white rounded-xl animate-pulse" /> : <Mic className="h-12 w-12" />}
                            <span className="text-[10px] font-black uppercase tracking-widest">{isRecording ? "Stop" : "Initialize"}</span>
                        </Button>

                        <div className="text-center space-y-2">
                            <p className={cn("text-5xl font-mono font-black tracking-tighter", isRecording ? "text-red-500" : "text-primary")}>{formatTime(timer)}</p>
                            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em]">{isRecording ? "Transmission Active" : isLoading ? "AI Processing Unit..." : "Ready"}</p>
                        </div>

                        <div className="w-full pt-6 border-t border-primary/5">
                            <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="audio/*" className="hidden" />
                            <Button variant="ghost" size="sm" onClick={() => fileInputRef.current?.click()} disabled={isRecording || isLoading} className="w-full text-[10px] font-black uppercase tracking-widest text-primary/60 hover:text-primary gap-3">
                                <Upload className="h-4 w-4" /> Ingest Registry File
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-8">
                <Card className="glass shadow-2xl min-h-[600px] flex flex-col rounded-[2.5rem] overflow-hidden border-primary/5">
                    <CardHeader className="bg-primary/5 border-b border-primary/10 flex flex-row items-center justify-between p-8 sm:p-12 text-left gap-8 relative z-10">
                        <div className="space-y-4 text-left flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-3">
                                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                                    <Bot className="h-3.5 w-3.5 text-primary" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">Institutional AI</span>
                                </div>
                                {state.isSimulated && (
                                    <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-[9px] font-black uppercase tracking-widest">
                                        <Cpu className="h-3 w-3 mr-1.5" /> Local Node Fallback
                                    </Badge>
                                )}
                            </div>
                            <div className="space-y-1">
                                <CardTitle className="text-2xl sm:text-4xl font-black tracking-tighter uppercase leading-none">Voice Audit <span className="text-primary italic">Output</span></CardTitle>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em] flex items-center gap-2">
                                    <Clock className="h-3 w-3" /> Transience Node // BNS-V4.2
                                </p>
                            </div>
                        </div>
                        {state.status === "success" && state.data && (
                            <AudioAssistant 
                                text={`Summary: ${state.data.caseSummary}. Legal Violations: ${state.data.detailedAnalysis}.`} 
                                language={language}
                            />
                        )}
                    </CardHeader>
                    <CardContent className="p-8 sm:p-12 flex-1 relative z-10">
                        {/* Background Watermark */}
                        <div className="absolute inset-0 p-12 opacity-[0.01] pointer-events-none flex items-center justify-center grayscale">
                            <Logo className="h-[500px] w-[500px] border-none p-0" priority={false} />
                        </div>

                        <AnimatePresence mode="wait">
                            {isLoading ? (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center h-full py-20 text-center gap-10">
                                    <div className="relative w-fit mx-auto">
                                        <Loader2 className="h-16 w-16 animate-spin text-primary opacity-20" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Activity className="h-6 w-6 text-primary animate-pulse" />
                                        </div>
                                    </div>
                                    <p className="font-black text-2xl tracking-tighter uppercase">Deconstructing Narration...</p>
                                </motion.div>
                            ) : state.status === "success" && state.data ? (
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12 pb-10 text-left relative z-10">
                                    <div className="p-8 glass rounded-[2.5rem] border-primary/5 italic text-sm sm:text-base font-medium text-muted-foreground leading-relaxed shadow-inner bg-muted/5">
                                        <div className="flex items-center gap-3 mb-4 text-primary opacity-40">
                                            <Fingerprint className="h-4 w-4" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Transcription Registry</span>
                                        </div>
                                        "{state.data.transcription}"
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-8">
                                        <Card className="p-8 glass rounded-[2.5rem] border-primary/10 text-left bg-primary/[0.02]">
                                            <h3 className="text-[11px] font-black text-primary uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                                <StepForward className="h-4 w-4" /> Case Summary
                                            </h3>
                                            <p className="text-sm sm:text-base font-black leading-relaxed tracking-tight text-foreground">{state.data.caseSummary}</p>
                                        </Card>
                                        <Card className="p-8 glass rounded-[2.5rem] border-primary/10 text-left bg-blue-500/[0.02]">
                                            <h3 className="text-[11px] font-black text-blue-600 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                                <Landmark className="h-4 w-4" /> Next Protocols
                                            </h3>
                                            <p className="text-sm font-bold leading-relaxed text-foreground/80">{state.data.nextActions}</p>
                                        </Card>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between border-b border-primary/10 pb-4">
                                            <h3 className="text-[11px] font-black text-primary uppercase tracking-[0.3em] flex items-center gap-3">
                                                <FileSearch className="h-5 w-5" /> Forensic Statutory Audit
                                            </h3>
                                            <Badge variant="outline" className="text-[9px] font-black uppercase border-primary/20 opacity-40">Sectional Ingress Active</Badge>
                                        </div>
                                        <div className="p-8 sm:p-12 glass rounded-[3rem] border-primary/10 text-sm sm:text-base font-medium leading-loose whitespace-pre-line text-left shadow-lg bg-muted/10">
                                            {state.data.detailedAnalysis}
                                        </div>
                                    </div>
                                </motion.div>
                            ) : state.status === 'error' ? (
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
                                    <Card className="glass border-destructive/20 shadow-2xl rounded-[2rem] overflow-hidden">
                                        <div className="p-8 sm:p-10 flex flex-col items-center text-center gap-6">
                                            <div className="p-4 rounded-2xl bg-destructive/10 text-destructive shadow-inner">
                                                <AlertTriangle className="h-10 w-10" />
                                            </div>
                                            <div className="space-y-2">
                                                <h3 className="text-2xl font-black uppercase tracking-tight text-destructive">Audit Delayed</h3>
                                                <p className="text-sm font-medium text-muted-foreground leading-relaxed max-w-md mx-auto px-4">
                                                    {state.error}
                                                </p>
                                            </div>
                                            <Button onClick={() => window.location.reload()} variant="outline" className="rounded-xl font-bold h-12 px-10 border-destructive/20 text-destructive hover:bg-destructive/5 active:scale-95 transition-all">
                                                Re-initialize Capture
                                            </Button>
                                        </div>
                                    </Card>
                                </motion.div>
                            ) : (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-full py-20 text-center gap-8 opacity-40">
                                    <Mic className="h-20 w-20 text-muted-foreground" />
                                    <p className="font-black text-xl tracking-tighter uppercase text-center">Awaiting Transmission</p>
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
