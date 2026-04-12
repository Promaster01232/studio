"use client";

import { useActionState, useState, useRef, useEffect, startTransition } from "react";
import { summarizeCaseAction, type CaseSummaryState } from "./actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Mic, 
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
          title: "Microphone Denied",
          description: "Please Allow Microphone Access In Your Settings To Use This Feature.",
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
                 toast({ variant: "destructive", title: "Too Short", description: "Your Recording Was Too Short To Analyze." });
            }
            setIsRecording(false);
        };
        recorder.start();
    } catch(err) {
        setIsRecording(false);
        if (timerInterval.current) clearInterval(timerInterval.current);
        toast({ variant: "destructive", title: "Recording Error", description: "Could Not Start Audio Capture." });
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
    <div className="space-y-8 max-w-6xl mx-auto pb-12 px-4 sm:px-6 text-left">
        <div className="max-w-3xl mx-auto">
            <Card className="bg-[#161b22] shadow-xl rounded-2xl overflow-hidden border-white/5">
                <CardHeader className="bg-white/5 border-b border-white/5 p-8 text-left">
                    <div className="flex items-center gap-3 mb-2 text-primary">
                        <Activity className="h-5 w-5" />
                        <CardTitle className="text-xl font-black tracking-tight text-left">Audio Capture</CardTitle>
                    </div>
                    <CardDescription className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Record Your Narrative For A Professional Statutory Report.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center space-y-10 py-10">
                    <div className="w-full max-w-sm space-y-3 px-2 text-left">
                        <Label className="text-[10px] font-bold text-gray-500 ml-1 uppercase tracking-widest">Select Language</Label>
                        <Select value={language} onValueChange={setLanguage} disabled={isRecording || state.status === 'loading'}>
                            <SelectTrigger className="h-12 bg-white/5 border-white/5 font-bold rounded-xl active:scale-95 transition-all text-left">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-[#161b22] border-white/5 rounded-xl">
                                <SelectItem value="English" className="font-bold text-xs">Simple English</SelectItem>
                                <SelectItem value="Hindi" className="font-bold text-xs">Hindi (Official)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="relative flex flex-col items-center gap-6">
                        <Button
                            onClick={isRecording ? stopRecording : startRecording}
                            disabled={!hasPermission || state.status === 'loading'}
                            className={cn(
                                "h-28 w-28 rounded-2xl shadow-2xl flex flex-col gap-2 transition-all active:scale-95 relative group overflow-hidden",
                                isRecording ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-primary text-primary-foreground'
                            )}
                        >
                            {isRecording ? <div className="h-8 w-8 bg-white rounded-lg z-10" /> : <Mic className="h-10 w-10 z-10" />}
                            <span className="text-[9px] font-bold z-10 uppercase tracking-widest">{isRecording ? "Stop" : state.status === 'loading' ? "Syncing" : "Record"}</span>
                        </Button>
                        
                        <div className="text-center space-y-1">
                            <p className={cn("text-4xl font-mono font-black tracking-tighter", isRecording ? "text-red-500" : "text-white")}>{formatTime(timer)}</p>
                            <p className="text-[9px] text-gray-500 font-bold tracking-widest uppercase">{isRecording ? "Transmitting..." : state.status === 'loading' ? "Processing..." : "Ready"}</p>
                        </div>
                    </div>

                    <div className="w-full pt-6 border-t border-white/5 text-center">
                        <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="audio/*" className="hidden" />
                        <Button variant="ghost" size="sm" onClick={() => fileInputRef.current?.click()} disabled={isRecording || state.status === 'loading'} className="text-[9px] font-bold text-primary/60 hover:text-primary gap-2 rounded-lg hover:bg-white/5 px-6 h-9 transition-all uppercase tracking-widest">
                            <Upload className="h-3.5 w-3.5" /> Upload Existing Record
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>

        <div ref={reportRef} className="space-y-6 scroll-mt-20">
            <div className="flex flex-col items-center gap-2 mb-4">
                <ChevronDown className="h-6 w-6 text-primary opacity-20" />
                <Badge variant="outline" className="font-bold text-[9px] bg-primary/5 px-6 py-1.5 rounded-full border-primary/10 shadow-sm uppercase tracking-widest">Statutory Report</Badge>
            </div>

            <Card className="bg-[#161b22] border-white/5 shadow-2xl rounded-3xl overflow-hidden relative min-h-[500px] flex flex-col">
                <div className="absolute inset-0 p-12 opacity-[0.02] pointer-events-none grayscale flex items-center justify-center">
                    <Logo className="h-[400px] w-[400px] border-none p-0 bg-transparent" priority={false} />
                </div>

                <CardHeader className={cn(
                    "p-8 sm:p-10 relative z-10 border-b border-white/5",
                    state.status === 'success' ? "bg-primary text-primary-foreground" : "bg-white/5 text-white"
                )}>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 text-left">
                        <div className="space-y-4 text-left flex-1 min-w-0">
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "flex items-center gap-2 px-4 py-1.5 rounded-full border shadow-sm",
                                    state.status === 'success' ? "bg-white/10 border-white/20" : "bg-black/20 border-white/5"
                                )}>
                                    <FileCheck className={cn("h-4 w-4", state.status === 'success' ? "text-white" : "text-primary")} />
                                    <span className={cn("text-[10px] font-bold", state.status === 'success' ? "text-white" : "text-primary")}>
                                        {state.status === 'success' ? "Audit Complete" : "System Standby"}
                                    </span>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <CardTitle className="text-xl sm:text-2xl font-black font-headline leading-none tracking-tighter text-left uppercase">
                                    {state.status === 'success' ? "Institutional Analysis Ready" : "Awaiting Audio Entry"}
                                </CardTitle>
                                <div className={cn(
                                    "text-[10px] font-bold flex items-center gap-2",
                                    state.status === 'success' ? "text-white/70" : "text-gray-500"
                                )}>
                                    <Globe className="h-3.5 w-3.5" /> Secure Statutory Session Active
                                </div>
                            </div>
                        </div>
                        
                        {state.status === 'success' && (
                            <div className="flex flex-wrap items-center gap-3 shrink-0">
                                <Button 
                                    variant="secondary" 
                                    size="sm" 
                                    onClick={handleReset}
                                    className="h-10 px-6 rounded-xl font-bold text-[10px] gap-2 shadow-xl active:scale-95 uppercase tracking-widest"
                                >
                                    <PlusCircle className="h-3.5 w-3.5" /> New Report
                                </Button>
                                <AudioAssistant 
                                    text={`Summary: ${state.data?.caseSummary}. Next Steps: ${state.data?.nextActions}.`} 
                                    language={language} 
                                />
                            </div>
                        )}
                    </div>
                </CardHeader>
                
                <CardContent className="p-8 sm:p-12 flex-1 relative z-10">
                    {state.status === 'loading' ? (
                        <div className="flex flex-col items-center justify-center h-full py-20 text-center gap-8">
                            <Activity className="h-12 w-12 text-primary opacity-20" />
                            <div className="space-y-2">
                                <p className="font-black text-2xl tracking-tighter text-white uppercase">Synthesizing Report...</p>
                                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Running Forensic Audio Audit...</p>
                            </div>
                        </div>
                    ) : state.status === "success" && state.data ? (
                        <div className="space-y-10 pb-6 text-left">
                            <div className="p-6 bg-white/5 rounded-2xl border border-white/5 italic text-sm font-medium text-gray-400 leading-relaxed shadow-inner relative overflow-hidden">
                                <div className="absolute top-0 left-0 bottom-0 w-1 bg-blue-500"></div>
                                <div className="flex items-center gap-2 mb-3 text-primary opacity-40">
                                    <Fingerprint className="h-3.5 w-3.5" />
                                    <span className="text-[9px] font-bold uppercase tracking-widest">Transcription Registry</span>
                                </div>
                                "{state.data.transcription}"
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <Card className="p-6 rounded-2xl border border-primary/10 text-left bg-white/[0.02] shadow-sm relative overflow-hidden">
                                    <div className="absolute top-0 left-0 bottom-0 w-1 bg-primary"></div>
                                    <h3 className="text-[9px] font-bold text-primary tracking-widest mb-4 flex items-center gap-2 uppercase">
                                        <StepForward className="h-3.5 w-3.5" /> Executive Summary
                                    </h3>
                                    <p className="text-sm sm:text-base font-black leading-relaxed tracking-tight text-white">{state.data.caseSummary}</p>
                                </Card>
                                <Card className="p-6 rounded-2xl border border-green-500/10 text-left bg-white/[0.02] shadow-sm relative overflow-hidden">
                                    <div className="absolute top-0 left-0 bottom-0 w-1 bg-green-500"></div>
                                    <h3 className="text-[9px] font-bold text-green-600 tracking-widest mb-4 flex items-center gap-2 uppercase">
                                        <Globe className="h-3.5 w-3.5" /> Procedural Path
                                    </h3>
                                    <p className="text-sm font-bold leading-relaxed text-gray-400">{state.data.nextActions}</p>
                                </Card>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                                    <h3 className="text-[9px] font-bold text-primary tracking-widest flex items-center gap-3 uppercase">
                                        <FileSearch className="h-4 w-4" /> Forensic Analysis
                                    </h3>
                                </div>
                                <div className="p-8 bg-white/[0.01] rounded-3xl border border-white/5 text-sm font-medium leading-relaxed whitespace-pre-line text-left shadow-lg relative overflow-hidden">
                                    <div className="prose dark:prose-invert max-w-none relative z-10 text-left">
                                        {state.data.detailedAnalysis}
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
                        <div className="flex flex-col items-center justify-center py-20 text-center gap-10">
                            <Mic className="h-16 w-16 text-primary opacity-10" />
                            <div className="space-y-4 max-sm px-6 text-center">
                                <h3 className="font-black text-xl tracking-tighter text-white leading-none uppercase">System Standby</h3>
                                <p className="text-[10px] text-gray-500 font-bold tracking-widest leading-relaxed italic opacity-40 uppercase">
                                    Initialize The Terminal By Recording Or Uploading Your Case Narration.
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