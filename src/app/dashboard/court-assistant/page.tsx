"use client";

import { useActionState, useState, useRef, useEffect } from "react";
import { generateQuestionsAction, type CourtAssistantState } from "./actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mic, BrainCircuit, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
        title: "AI Error",
        description: state.error,
      });
    }
  }, [state, toast]);

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
    if (transcriptInterval.current) {
        clearInterval(transcriptInterval.current);
    }
  };

  const isLoading = state.status === "loading";

  return (
    <div className="bg-[#0D1B2A] text-white min-h-full -m-4 md:-m-6 lg:-m-8 p-4 md:p-6 lg:p-8">
        <header className="flex items-center gap-3 py-2">
            <h1 className="text-2xl font-bold font-headline text-cyan-300">Court Room Tools (Real-time)</h1>
        </header>

        <div className="grid md:grid-cols-2 gap-8 mt-6">
            <Card className="bg-[#1B263B]/80 border-cyan-500/20 text-white">
                <CardContent className="p-6 flex flex-col items-center justify-center space-y-6">
                    <button onClick={startRecording} disabled={isRecording || !hasPermission} className="disabled:opacity-50">
                        <div className="relative">
                            <Mic className="h-20 w-20 text-cyan-400" />
                            {isRecording && (
                            <>
                                <div className="absolute inset-0 rounded-full bg-cyan-400/20 animate-ping -z-10" style={{ animationDuration: '2s' }}></div>
                                <div className="absolute inset-0 rounded-full bg-cyan-400/10 animate-ping -z-10" style={{ animationDuration: '2s', animationDelay: '1s' }}></div>
                            </>
                            )}
                        </div>
                    </button>
                    <h2 className="text-xl font-semibold">Live Transcription</h2>
                    
                    <div className="w-full h-40 bg-[#0D1B2A] rounded-lg p-4 overflow-y-auto border border-cyan-500/20">
                        {isRecording ? <Waveform /> : <p className="text-cyan-200/50 text-center pt-8">Click the mic to start recording</p>}
                        
                        <div className="mt-4 space-y-1 text-sm font-mono">
                            {transcript.map((line, i) => (
                                <p key={i}>{line}</p>
                            ))}
                        </div>
                    </div>
                    
                    <div className="flex gap-4 w-full">
                        <Button 
                            className="w-full bg-red-500 hover:bg-red-600 text-white" 
                            onClick={stopRecording} 
                            disabled={!isRecording}>
                                Stop Recording
                        </Button>
                        <Button variant="outline" className="w-full border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black" disabled={isRecording || transcript.length === 0}>Save Transcript</Button>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-[#1B263B]/80 border-cyan-500/20 text-white">
                <CardContent className="p-6">
                     <div className="flex items-center gap-3 mb-4">
                        <BrainCircuit className="h-8 w-8 text-cyan-400" />
                        <h2 className="text-xl font-semibold">Cross-Examination AI</h2>
                    </div>
                    <form action={formAction} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="witnessName" className="text-cyan-200">Witness Name</Label>
                            <Input id="witnessName" name="witnessName" placeholder="e.g., John Doe" className="bg-[#0D1B2A] border-cyan-500/30 text-white placeholder:text-gray-500" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="topic" className="text-cyan-200">Topic</Label>
                            <Input id="topic" name="topic" placeholder="e.g., Alibi for October 31st" className="bg-[#0D1B2A] border-cyan-500/30 text-white placeholder:text-gray-500" />
                        </div>
                        <Button type="submit" disabled={isLoading} className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-bold">
                            {isLoading ? <Loader2 className="animate-spin" /> : "Generate Questions"}
                        </Button>
                    </form>

                     {state.status === "error" && (
                        <Alert variant="destructive" className="mt-4">
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{state.error}</AlertDescription>
                        </Alert>
                    )}

                    {(state.status === 'success' && state.data) || state.status === 'loading' ? (
                        <div className="mt-6 space-y-2">
                            <h3 className="font-semibold text-cyan-300">Generated Questions:</h3>
                            <div className="space-y-3 text-sm p-3 rounded-md bg-[#0D1B2A] border border-cyan-500/20 min-h-24">
                               {isLoading && <p className="text-cyan-200/50">Generating...</p>}
                               {state.data?.questions.map((q, i) => (
                                   <div key={i} className="flex gap-2">
                                       <span className="text-cyan-400">{i + 1}.</span>
                                       <p>{q}</p>
                                   </div>
                               ))}
                            </div>
                        </div>
                    ) : null}
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
