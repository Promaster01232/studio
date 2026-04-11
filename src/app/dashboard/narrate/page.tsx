"use client";

import { useActionState, useState, useRef, useEffect, startTransition } from "react";
import { summarizeCaseAction, type CaseSummaryState } from "./actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Mic, 
  Bot, 
  StepForward, 
  Loader2, 
  Upload, 
  ShieldCheck, 
  Activity, 
  Globe, 
  Fingerprint, 
  PlusCircle, 
  FileSearch, 
  ChevronDown, 
  FileCheck 
} from "lucide-react";
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
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getMicrophonePermission = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setHasPermission(true);
      } catch (error) {
        setHasPermission(false);
        toast({
          variant: "destructive",
          title: "Microphone denied",
          description: "Please allow microphone access in your settings to use this feature.",
        });
      }
    };
    getMicrophonePermission();
  }, [toast]);

  useEffect(() => {
    if (state.status === 'success' && auth.currentUser) {
        const userRef = doc(firestore, "users", auth.currentUser.uid);
        updateDoc(userRef, { aiUsageCount: increment(1) }).catch(() => {});
        
        setTimeout(() => {
            reportRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
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
                 toast({ variant: "destructive", title: "Too short", description: "Your recording was too short to analyze." });
            }
            setIsRecording(false);
        };
        recorder.start();
    } catch(err) {
        setIsRecording(false);
        if (timerInterval.current) clearInterval(timerInterval.current);
        toast({ variant: "destructive", title: "Recording error", description: "Could not start audio capture." });
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

  return (
    <div className="space-y-12 max-w-6xl mx-auto pb-32 px-4 sm:px-6 text-left">
        <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-3xl mx-auto"
        >
            <Card className="bg-[#161b22] shadow-2xl overflow-hidden rounded-[2.5rem] border-white/5">
                <CardHeader className="bg-white/5 border-b border-white/5 p-8 text-left">
                    <div className="flex items-center gap-3 mb-2 text-primary">
                        <Activity className="h-5 w-5 animate-pulse" />
                        <CardTitle className="text-xl font-black tracking-tight text-left">Audio capture</CardTitle>
                    </div>
                    <CardDescription className="text-[10px] font-bold opacity-60">Record your narrative for a professional statutory report.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center space-y-12 pt-12 pb-12">
                    <div className="w-full max-w-sm space-y-4 px-2 text-left">
                        <div className="space-y-3">
                            <Label className="text-[10px] font-bold text-gray-500 ml-1">Select language</Label>
                            <Select value={language} onValueChange={setLanguage} disabled={isRecording || state.status === 'loading'}>
                                <SelectTrigger className="h-12 bg-white/5 border-white/5 font-bold rounded-xl active:scale-95 transition-all text-left">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-[#161b22] border-white/5 rounded-xl">
                                    <SelectItem value="English" className="font-bold text-xs">Simple english</SelectItem>
                                    <SelectItem value="Hindi" className="font-bold text-xs">Hindi (Official)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="relative flex flex-col items-center gap-8">
                        <AnimatePresence>
                            {isRecording && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    className="absolute -top-16 flex items-center gap-1.5"
                                >
                                    {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                                        <motion.div 
                                            key={i}
                                            animate={{ height: [8, 32, 8] }}
                                            transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                                            className="w-1.5 bg-red-500 rounded-full"
                                        />
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <Button
                            onClick={isRecording ? stopRecording : startRecording}
                            disabled={!hasPermission || state.status === 'loading'}
                            className={cn(
                                "h-36 w-36 rounded-[3.5rem] shadow-3xl flex flex-col gap-3 transition-all duration-500 active:scale-90 relative group overflow-hidden",
                                isRecording ? 'bg-red-500 hover:bg-red-600 scale-110 text-white' : 'bg-primary text-primary-foreground'
                            )}
                        >
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            {isRecording ? <div className="h-12 w-12 bg-white rounded-2xl animate-pulse z-10" /> : <Mic className="h-14 w-14 z-10 transition-transform group-hover:scale-110" />}
                            <span className="text-[10px] font-bold z-10">{isRecording ? "Stop" : state.status === 'loading' ? "Syncing" : "Tap to speak"}</span>
                        </Button>
                        
                        <div className="text-center space-y-2">
                            <p className={cn("text-6xl font-mono font-black tracking-tighter", isRecording ? "text-red-500" : "text-white")}>{formatTime(timer)}</p>
                            <p className="text-[10px] text-gray-500 font-bold tracking-[0.3em]">{isRecording ? "Transmitting audio..." : state.status === 'loading' ? "Neural processing..." : "Terminal ready"}</p>
                        </div>
                    </div>

                    <div className="w-full pt-8 border-t border-white/5 text-center">
                        <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="audio/*" className="hidden" />
                        <Button variant="ghost" size="sm" onClick={() => fileInputRef.current?.click()} disabled={isRecording || state.status === 'loading'} className="text-[10px] font-bold text-primary/60 hover:text-primary gap-3 rounded-xl hover:bg-white/5 px-8 h-10 transition-all">
                            <Upload className="h-4 w-4" /> Upload existing record
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>

        <div ref={reportRef} className="space-y-8 scroll-mt-20">
            <div className="flex flex-col items-center gap-4 mb-4">
                <ChevronDown className="h-8 w-8 text-primary animate-bounce opacity-20" />
                <Badge variant="outline" className="font-bold text-[10px] bg-primary/5 px-6 py-2 rounded-full border-primary/10 shadow-sm">Statutory report</Badge>
            </div>

            <Card className="bg-[#161b22] border-white/5 shadow-3xl rounded-[3rem] overflow-hidden relative min-h-[600px] flex flex-col">
                <div className="absolute inset-0 p-12 opacity-[0.02] pointer-events-none grayscale flex items-center justify-center">
                    <Logo className="h-[600px] w-[600px] border-none p-0 bg-transparent" priority={false} />
                </div>

                <CardHeader className={cn(
                    "p-8 sm:p-12 relative z-10 transition-colors duration-500 border-b border-white/5",
                    state.status === 'success' ? "bg-primary text-primary-foreground" : "bg-white/5 text-white"
                )}>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 text-left">
                        <div className="space-y-6 text-left flex-1 min-w-0">
                            <div className="flex items-center gap-4">
                                <div className={cn(
                                    "flex items-center gap-3 px-4 py-1.5 rounded-full border shadow-sm",
                                    state.status === 'success' ? "bg-white/10 border-white/20" : "bg-black/20 border-white/5"
                                )}>
                                    <FileCheck className={cn("h-4 w-4", state.status === 'success' ? "text-white" : "text-primary")} />
                                    <span className={cn("text-[10px] font-bold", state.status === 'success' ? "text-white" : "text-primary")}>
                                        {state.status === 'success' ? "Audit complete" : "System standby"}
                                    </span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <CardTitle className="text-xl sm:text-3xl font-black font-headline leading-none tracking-tighter text-left">
                                    {state.status === 'success' ? "Institutional analysis ready" : "Awaiting audio entry"}
                                </CardTitle>
                                <div className={cn(
                                    "text-[11px] font-medium flex items-center gap-3",
                                    state.status === 'success' ? "text-white/70" : "text-gray-500"
                                )}>
                                    <Globe className="h-4 w-4" /> Secure statutory session active
                                </div>
                            </div>
                        </div>
                        
                        {state.status === 'success' && (
                            <div className="flex flex-wrap items-center gap-4 shrink-0">
                                <Button 
                                    variant="secondary" 
                                    size="sm" 
                                    onClick={handleReset}
                                    className="h-12 px-8 rounded-2xl font-bold text-xs gap-3 shadow-2xl active:scale-95"
                                >
                                    <PlusCircle className="h-4 w-4" /> New report
                                </Button>
                                <AudioAssistant 
                                    text={`Summary: ${state.data?.caseSummary}. Next steps: ${state.data?.nextActions}.`} 
                                    language={language} 
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
                                className="flex flex-col items-center justify-center h-full py-24 text-center gap-12"
                            >
                                <div className="relative w-fit mx-auto">
                                    <Activity className="h-20 w-20 animate-spin text-primary opacity-20" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Activity className="h-8 w-8 text-primary animate-pulse" />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <p className="font-black text-3xl tracking-tighter text-white">Synthesizing report...</p>
                                    <p className="text-[10px] font-bold text-gray-500 animate-pulse">Running forensic audio audit...</p>
                                </div>
                            </motion.div>
                        ) : state.status === "success" && state.data ? (
                            <motion.div 
                                key="success" 
                                initial={{ opacity: 0, y: 20 }} 
                                animate={{ opacity: 1, y: 0 }} 
                                className="space-y-12 pb-10 text-left"
                            >
                                <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/5 italic text-sm sm:text-base font-medium text-gray-400 leading-relaxed shadow-inner relative overflow-hidden">
                                    <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-blue-500"></div>
                                    <div className="flex items-center gap-3 mb-4 text-primary opacity-40">
                                        <Fingerprint className="h-4 w-4" />
                                        <span className="text-[10px] font-bold">Transcription registry</span>
                                    </div>
                                    "{state.data.transcription}"
                                </div>

                                <div className="grid md:grid-cols-2 gap-8">
                                    <Card className="p-8 rounded-[2.5rem] border-white/5 text-left bg-white/[0.02] shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
                                        <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-primary"></div>
                                        <h3 className="text-[11px] font-bold text-primary tracking-[0.3em] mb-6 flex items-center gap-3">
                                            <StepForward className="h-4 w-4" /> Executive summary
                                        </h3>
                                        <p className="text-sm sm:text-base font-black leading-relaxed tracking-tight text-white">{state.data.caseSummary}</p>
                                    </Card>
                                    <Card className="p-8 rounded-[2.5rem] border-white/5 text-left bg-white/[0.02] shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
                                        <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-green-500"></div>
                                        <h3 className="text-[11px] font-bold text-green-600 tracking-[0.3em] mb-6 flex items-center gap-3">
                                            <Globe className="h-4 w-4" /> Procedural path
                                        </h3>
                                        <p className="text-sm font-bold leading-relaxed text-gray-400">{state.data.nextActions}</p>
                                    </Card>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                        <h3 className="text-[11px] font-bold text-primary tracking-[0.3em] flex items-center gap-3">
                                            <FileSearch className="h-5 w-5" /> Forensic analysis
                                        </h3>
                                    </div>
                                    <div className="p-8 sm:p-12 bg-white/[0.01] rounded-[3rem] border border-white/5 text-sm sm:text-base font-medium leading-loose whitespace-pre-line text-left shadow-xl relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] transition-opacity duration-700">
                                            <Logo className="h-64 w-64 grayscale opacity-20" priority={false} />
                                        </div>
                                        <div className="prose dark:prose-invert max-w-none relative z-10 text-left">
                                            {state.data.detailedAnalysis}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="pt-10 mt-10 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-8 opacity-30">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-2xl bg-white/5 text-white">
                                            <ShieldCheck className="h-6 w-6" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-[10px] font-bold">Identity protection</p>
                                            <p className="text-[9px] font-bold">This report record is private and encrypted.</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="idle" 
                                initial={{ opacity: 0, scale: 0.95 }} 
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center justify-center py-32 text-center gap-12"
                            >
                                <div className="relative">
                                    <div className="absolute -inset-8 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
                                    <div className="p-12 rounded-[2.5rem] bg-white/5 border border-white/5 relative z-10 transition-transform group-hover:scale-110 duration-700">
                                        <Mic className="h-24 w-24 text-primary opacity-20" />
                                    </div>
                                </div>
                                <div className="space-y-4 max-sm px-6 text-center">
                                    <h3 className="font-black text-2xl tracking-tighter text-white">System standby</h3>
                                    <p className="text-[11px] text-gray-500 font-bold leading-relaxed italic opacity-40">
                                        Initialize the terminal by recording or uploading your case narration.
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </CardContent>
                <div className="h-3 w-full bg-gradient-to-r from-primary via-accent to-blue-400"></div>
            </Card>
        </div>
    </div>
  );
}
