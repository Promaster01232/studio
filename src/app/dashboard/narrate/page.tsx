"use client";

import { useActionState, useState, useRef, useEffect, startTransition } from "react";
import { summarizeCaseAction, type CaseSummaryState } from "./actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, Bot, FileText, Scale, Landmark, StepForward, Loader2, Languages, Headphones, FileSearch, Quote } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { AudioAssistant } from "@/components/audio-assistant";
import { motion, AnimatePresence } from "framer-motion";

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

  useEffect(() => {
    const getMicrophonePermission = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setHasPermission(true);
      } catch (error) {
        console.error("Error accessing microphone:", error);
        setHasPermission(false);
        toast({
          variant: "destructive",
          title: "Microphone Access Denied",
          description: "Please enable microphone permissions in your browser settings to use this feature.",
        });
      }
    };
    getMicrophonePermission();
  }, [toast]);

  useEffect(() => {
    if (state.status === "error" && state.error) {
      toast({
        variant: "destructive",
        title: "Analysis Error",
        description: state.error,
      });
    }
  }, [state, toast]);

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
                const audioFile = new File([blob], "recording.webm", { type: "audio/webm" });
                formData.append("problemAudio", audioFile);
                formData.append("language", language);
                startTransition(() => {
                    formAction(formData);
                });
            } else {
                 toast({
                    variant: "destructive",
                    title: "Recording Too Short",
                    description: "Please record for at least a few seconds to analyze.",
                });
            }
            setIsRecording(false);
        };

        recorder.start();
    } catch(err) {
        console.error("Error during recording:", err)
        toast({
            variant: "destructive",
            title: "Recording Error",
            description: "Could not start recording. Please check your microphone.",
        });
        setIsRecording(false);
        if (timerInterval.current) clearInterval(timerInterval.current);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const isLoading = state.status === "loading";

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      <PageHeader
        title="Voice Case Narrator"
        description="Speak your problem naturally. Our AI will transcribe your words and generate a comprehensive legal report instantly."
      />

      <div className="grid md:grid-cols-3 gap-8 items-start">
        <div className="md:col-span-1 space-y-6">
            <Card className="border-primary/10 shadow-xl overflow-hidden rounded-2xl">
                <CardHeader className="bg-primary/5 border-b border-primary/10">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                        <Mic className="h-5 w-5 text-primary" /> Audio Capture
                    </CardTitle>
                    <CardDescription className="text-[11px] font-medium uppercase tracking-wider">Secure Recording Node</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center space-y-6 pt-8">
                    <div className="w-full space-y-4 mb-4">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                <Languages className="h-3 w-3" /> Preferred Language
                            </Label>
                            <Select value={language} onValueChange={setLanguage} disabled={isRecording || isLoading}>
                                <SelectTrigger className="h-11 font-bold bg-background">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="English" className="font-bold">English</SelectItem>
                                    <SelectItem value="Hindi" className="font-bold">Hindi</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="relative group">
                        <Button
                            onClick={isRecording ? stopRecording : startRecording}
                            disabled={!hasPermission || isLoading}
                            className={`h-32 w-32 rounded-full shadow-2xl flex flex-col gap-2 transition-all duration-500 relative z-10 ${
                                isRecording ? 'bg-red-500 hover:bg-red-600 scale-110' : 'bg-primary hover:scale-105'
                            }`}
                        >
                            {isRecording ? (
                                <div className="h-10 w-10 bg-white rounded-lg animate-pulse" />
                            ) : (
                                <Mic className="h-12 w-12" />
                            )}
                            <span className="text-[10px] font-black uppercase tracking-widest">
                                {isRecording ? "Stop" : "Speak Now"}
                            </span>
                        </Button>
                        
                        {isRecording && (
                            <>
                                <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping [animation-duration:2s]"></div>
                                <div className="absolute inset-0 rounded-full bg-red-500/10 animate-ping [animation-duration:3s]"></div>
                            </>
                        )}
                    </div>

                    <div className="text-center space-y-1">
                        <p className="text-4xl font-mono font-black tracking-tighter text-primary">{formatTime(timer)}</p>
                        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest animate-pulse">
                            {isRecording ? "Recording Live..." : isLoading ? "AI Processing..." : "Ready to Listen"}
                        </p>
                    </div>
                </CardContent>
            </Card>
            
            <Card className="bg-primary/5 border-primary/10 rounded-2xl p-4">
                <div className="flex gap-3">
                    <Headphones className="h-5 w-5 text-primary shrink-0" />
                    <div className="space-y-1">
                        <p className="text-xs font-bold text-primary">Instructions</p>
                        <p className="text-[10px] text-muted-foreground leading-relaxed font-medium">
                            Briefly describe the incident, people involved, dates, and your primary concern. Keep it under 5 minutes for the best analysis.
                        </p>
                    </div>
                </div>
            </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
            <Card className="border-primary/10 shadow-2xl min-h-[600px] flex flex-col rounded-2xl overflow-hidden bg-card/40 backdrop-blur-md">
                <CardHeader className="bg-primary/5 border-b border-primary/10 flex flex-row items-center justify-between space-y-0">
                    <div className="space-y-1">
                        <CardTitle className="flex items-center gap-2 text-xl font-black tracking-tight">
                            <Bot className="h-6 w-6 text-primary" /> AI Case Intelligence
                        </CardTitle>
                        <CardDescription className="text-xs font-medium">Comprehensive Legal Analysis Report</CardDescription>
                    </div>
                    {state.status === "success" && state.data && (
                        <AudioAssistant 
                            text={`Report Summary: ${state.data.caseSummary}. Detailed Analysis: ${state.data.detailedAnalysis}. Next Steps: ${state.data.nextActions}`} 
                            language={language}
                        />
                    )}
                </CardHeader>
                <CardContent className="p-6 flex-1">
                    <AnimatePresence mode="wait">
                        {isLoading && (
                            <motion.div 
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="flex flex-col items-center justify-center h-full py-20 text-center gap-6"
                            >
                                <div className="relative">
                                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="p-8 rounded-full border-4 border-dashed border-primary/20">
                                        <Bot className="h-16 w-16 text-primary/40" />
                                    </motion.div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <p className="font-black text-xl tracking-tight">Transcribing & Analyzing...</p>
                                    <p className="text-sm text-muted-foreground font-medium max-w-sm mx-auto">Our AI is converting your voice to text and performing a deep forensic legal audit.</p>
                                </div>
                            </motion.div>
                        )}
                        
                        {state.status === 'idle' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-full py-20 text-center gap-4 opacity-40">
                                <div className="bg-muted p-8 rounded-full">
                                    <Mic className="h-16 w-16 text-muted-foreground" />
                                </div>
                                <div className="space-y-1">
                                    <p className="font-black text-lg tracking-tight">Waiting for Recording</p>
                                    <p className="text-xs font-medium text-muted-foreground max-w-[250px] mx-auto">Your comprehensive report will appear here once you stop recording.</p>
                                </div>
                            </motion.div>
                        )}

                        {state.status === "success" && state.data && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pb-10">
                                {/* Transcription Section */}
                                <div className="space-y-3">
                                    <h3 className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-2">
                                        <Quote className="h-3.5 w-3.5" /> Word-for-Word Transcription
                                    </h3>
                                    <div className="p-5 bg-muted/30 rounded-2xl border border-primary/5 italic text-sm font-medium text-muted-foreground leading-relaxed">
                                        "{state.data.transcription}"
                                    </div>
                                </div>

                                {/* Summary & Meta */}
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="p-5 bg-primary/5 rounded-2xl border border-primary/10">
                                        <h3 className="text-[10px] font-black text-primary uppercase tracking-widest mb-3 flex items-center gap-2">
                                            <Bot className="h-3.5 w-3.5" /> Simple Summary
                                        </h3>
                                        <p className="text-sm font-bold text-foreground leading-relaxed">{state.data.caseSummary}</p>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="p-4 bg-background rounded-xl border border-primary/10 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <Scale className="h-5 w-5 text-primary" />
                                                <span className="text-xs font-black uppercase tracking-tighter">Case Nature</span>
                                            </div>
                                            <span className="text-xs font-bold text-primary bg-primary/5 px-3 py-1 rounded-full uppercase">{state.data.caseType}</span>
                                        </div>
                                        <div className="p-4 bg-background rounded-xl border border-primary/10 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <Landmark className="h-5 w-5 text-primary" />
                                                <span className="text-xs font-black uppercase tracking-tighter">Jurisdiction</span>
                                            </div>
                                            <span className="text-[10px] font-bold text-muted-foreground text-right">{state.data.jurisdiction}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Detailed Analysis */}
                                <div className="space-y-3">
                                    <h3 className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-2 px-1">
                                        <FileSearch className="h-3.5 w-3.5" /> Comprehensive Legal Analysis
                                    </h3>
                                    <div className="p-6 bg-primary/5 rounded-2xl border border-primary/10">
                                        <div className="text-sm font-medium text-foreground leading-relaxed whitespace-pre-line prose dark:prose-invert max-w-none">
                                            {state.data.detailedAnalysis}
                                        </div>
                                    </div>
                                </div>

                                {/* Next Actions & Laws */}
                                <div className="grid sm:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <h3 className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-2 px-1">
                                            <StepForward className="h-3.5 w-3.5" /> Strategy & Next Actions
                                        </h3>
                                        <div className="p-5 bg-background rounded-2xl border border-primary/10 min-h-24">
                                            <div className="text-xs font-bold text-muted-foreground leading-relaxed whitespace-pre-line">
                                                {state.data.nextActions}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <h3 className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-2 px-1">
                                            <FileText className="h-3.5 w-3.5" /> Applicable Statutes
                                        </h3>
                                        <div className="p-5 bg-background rounded-2xl border border-primary/10 min-h-24">
                                            <p className="text-xs font-bold text-primary leading-relaxed">
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
        </div>
      </div>
    </div>
  );
}
