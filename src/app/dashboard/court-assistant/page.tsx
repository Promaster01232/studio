"use client";

import { useActionState, useState, useRef, useEffect } from "react";
import { generateQuestionsAction, type CourtAssistantState } from "./actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mic, BrainCircuit, Loader2, Languages, ArrowLeft, Activity, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const initialState: CourtAssistantState = {
  status: "idle",
  data: null,
  error: null,
};

const mockTranscription = [
  "ORDER, Case no. 2024-CR-0123. The prosecution calls...",
  "Your Honor, we object, line of questioning is...",
  "Overruled. Proceed.",
  "Could you state your name for the record?",
  "John Doe.",
  "Mr. Doe, where were you on the night of October 31st?",
];

const Waveform = () => (
    <div className="flex items-end justify-center h-16 gap-0.5">
      {Array.from({ length: 40 }).map((_, i) => (
        <div
          key={i}
          className="w-1 bg-cyan-400 rounded-full"
          style={{
            height: `${[20,30,50,60,70,80,60,40,30,20,25,35,45,55,65,75,85,65,55,45,35,25,20,30,40,50,60,70,80,70,60,50,40,30,20,30,40,50,60,70][i % 40]}%`,
          }}
        />
      ))}
    </div>
  );

export default function CourtAssistantPage() {
  const [state, formAction] = useActionState(generateQuestionsAction, initialState);
  const { toast } = useToast();

  const [hasPermission, setHasPermission] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState<string[]>([]);
  
  const transcriptInterval = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    const getMicrophonePermission = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setHasPermission(true);
      } catch (error) {
        setHasPermission(false);
        toast({
          variant: "destructive",
          title: "Microphone Access Denied",
          description: "Please enable microphone permissions in your browser settings.",
        });
      }
    };
    getMicrophonePermission();
  }, [toast]);

  const startRecording = () => {
    if (!hasPermission) return;
    setIsRecording(true);
    setTranscript([]);
    let line = 0;
    transcriptInterval.current = setInterval(() => {
        setTranscript(prev => [...prev, mockTranscription[line]]);
        line = (line + 1) % mockTranscription.length;
    }, 3000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (transcriptInterval.current) clearInterval(transcriptInterval.current);
  };

  const isLoading = state.status === "loading";

  return (
    <div className="bg-[#0D1B2A] text-white min-h-full -m-4 md:-m-10 p-4 md:p-10 space-y-10">
        <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-cyan-500/10 pb-8 text-left">
            <div className="space-y-1">
                <h1 className="text-3xl font-black tracking-tighter text-cyan-300 font-headline uppercase">Court Operations</h1>
                <p className="text-[10px] font-bold text-cyan-200/60 uppercase tracking-widest">Real-time statutory assist & transcription interface.</p>
            </div>
            <Button variant="outline" size="sm" className="rounded-xl font-bold h-10 px-6 border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/10 text-[10px] uppercase tracking-widest" asChild>
                <Link href="/dashboard">
                    <ArrowLeft className="mr-2 h-3.5 w-3.5" /> Back to terminal
                </Link>
            </Button>
        </motion.header>

        <div className="grid lg:grid-cols-2 gap-8">
            <Card className="bg-[#1B263B]/80 border-cyan-500/20 text-white rounded-[2rem] overflow-hidden shadow-2xl">
                <CardHeader className="bg-cyan-500/5 border-b border-cyan-500/10 p-8 text-left">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-cyan-500/10">
                                <Activity className="h-5 w-5 text-cyan-400 animate-pulse" />
                            </div>
                            <CardTitle className="text-xl font-black uppercase tracking-tight">Audio Capture</CardTitle>
                        </div>
                        <Badge variant="outline" className="border-cyan-500/30 text-cyan-400 text-[8px] uppercase tracking-widest font-black">Live</Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-8 flex flex-col items-center justify-center space-y-8">
                    <button onClick={isRecording ? stopRecording : startRecording} disabled={!hasPermission} className="disabled:opacity-50 transition-all hover:scale-105 active:scale-95 group">
                        <div className="relative">
                            <div className={cn("absolute -inset-6 rounded-full blur-xl transition-all duration-500", isRecording ? "bg-red-500/20 animate-pulse" : "bg-cyan-500/10 group-hover:bg-cyan-500/20")}></div>
                            <div className={cn("relative h-24 w-24 rounded-full flex items-center justify-center border-2 transition-all duration-500", isRecording ? "bg-red-500 border-red-400 shadow-xl shadow-red-500/20" : "bg-cyan-500/10 border-cyan-500/20")}>
                                <Mic className={cn("h-10 w-10 transition-colors", isRecording ? "text-white" : "text-cyan-400")} />
                            </div>
                        </div>
                    </button>
                    
                    <div className="w-full space-y-4">
                        <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-cyan-300/60 text-left">Registry Transcription</h3>
                        <div className="w-full h-48 bg-[#0D1B2A] rounded-2xl p-6 overflow-y-auto border border-cyan-500/10 shadow-inner text-left">
                            {isRecording ? <Waveform /> : transcript.length === 0 && <p className="text-cyan-200/30 text-center pt-12 text-xs font-bold uppercase tracking-widest">Awaiting Capture Signal</p>}
                            <div className="mt-6 space-y-2 text-sm font-mono text-cyan-100/80 text-left">
                                {transcript.map((line, i) => (
                                    <p key={i} className="animate-in fade-in slide-in-from-left-2">{"{"}{">"}{"}"} {line}</p>
                                ))}
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex gap-4 w-full">
                        <Button 
                            className="flex-1 h-12 bg-red-500/10 border border-red-500/20 hover:bg-red-500 hover:text-white text-red-500 font-black uppercase text-[10px] tracking-widest rounded-xl transition-all" 
                            onClick={stopRecording} 
                            disabled={!isRecording}>
                                Terminate
                        </Button>
                        <Button variant="outline" className="flex-1 h-12 border-cyan-500/20 text-cyan-400 hover:bg-cyan-400 hover:text-black font-black uppercase text-[10px] tracking-widest rounded-xl transition-all" disabled={isRecording || transcript.length === 0}>Save Record</Button>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-[#1B263B]/80 border-cyan-500/20 text-white rounded-[2.5rem] overflow-hidden shadow-2xl">
                <CardHeader className="bg-cyan-500/5 border-b border-cyan-500/10 p-8 text-left">
                    <div className="flex items-center gap-3">
                        <BrainCircuit className="h-6 w-6 text-cyan-400" />
                        <CardTitle className="text-xl font-black uppercase tracking-tight">Strategy Generator</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="p-8">
                    <form action={formAction} className="space-y-6 text-left">
                        <div className="space-y-2">
                            <Label htmlFor="witnessName" className="text-[10px] font-black uppercase tracking-widest text-cyan-300/60 ml-1">Witness Identity</Label>
                            <Input id="witnessName" name="witnessName" placeholder="e.g., John Doe" className="h-12 bg-[#0D1B2A] border-cyan-500/20 text-white font-bold rounded-xl focus:border-cyan-400" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="topic" className="text-[10px] font-black uppercase tracking-widest text-cyan-300/60 ml-1">Forensic Topic</Label>
                            <Input id="topic" name="topic" placeholder="e.g., Alibi for October 31st" className="h-12 bg-[#0D1B2A] border-cyan-500/20 text-white font-bold rounded-xl focus:border-cyan-400" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="language" className="text-[10px] font-black uppercase tracking-widest text-cyan-300/60 ml-1 flex items-center gap-2"><Languages className="h-3 w-3" /> Dialect Protocol</Label>
                            <Select name="language" defaultValue="English" required>
                              <SelectTrigger className="h-12 bg-[#0D1B2A] border-cyan-500/20 text-white font-bold rounded-xl">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-[#1B263B] border-cyan-500/20 text-white rounded-xl">
                                <SelectItem value="English" className="font-bold">English Protocol</SelectItem>
                                <SelectItem value="Hindi" className="font-bold">Hindi Protocol</SelectItem>
                              </SelectContent>
                            </Select>
                        </div>
                        <Button type="submit" disabled={isLoading} className="w-full h-14 bg-cyan-500 hover:bg-cyan-600 text-black font-black uppercase tracking-[0.2em] text-xs rounded-xl shadow-xl shadow-cyan-500/20 transition-all active:scale-95 mt-4">
                            {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : "Initialize Question Protocol"}
                        </Button>
                    </form>

                    <AnimatePresence>
                        {(state.status === 'success' && state.data) || state.status === 'loading' ? (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-10 space-y-4 text-left">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-cyan-300 flex items-center gap-2">
                                    <ShieldCheck className="h-4 w-4" /> Generated Question Registry
                                </h3>
                                <div className="space-y-4 text-sm p-6 rounded-2xl bg-[#0D1B2A] border border-cyan-500/10 min-h-24 shadow-inner">
                                   {isLoading && <p className="text-cyan-200/30 font-bold uppercase tracking-widest text-center py-8">Neural Engine Processing...</p>}
                                   {state.data?.questions.map((q, i) => (
                                       <div key={i} className="flex gap-4 group">
                                           <span className="font-mono text-cyan-500 font-bold">{i + 1}.</span>
                                           <p className="font-medium text-cyan-100/90 leading-relaxed group-hover:text-white transition-colors">{q}</p>
                                       </div>
                                   ))}
                                </div>
                            </motion.div>
                        ) : null}
                    </AnimatePresence>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
