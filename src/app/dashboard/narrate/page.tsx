"use client";

import { useFormState } from "react-dom";
import { summarizeCaseAction, type CaseSummaryState } from "./actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, Bot, FileText, Scale, Landmark, StepForward, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { useToast } from "@/hooks/use-toast";
import { useState, useRef, useEffect } from "react";

const initialState: CaseSummaryState = {
  status: "idle",
  data: null,
  error: null,
};

export default function NarrateProblemPage() {
  const [state, formAction] = useFormState(summarizeCaseAction, initialState);
  const { toast } = useToast();

  const [hasPermission, setHasPermission] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(0);

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
            
            if (blob.size > 0) {
                const formData = new FormData();
                const audioFile = new File([blob], "recording.webm", { type: "audio/webm" });
                formData.append("problemAudio", audioFile);
                formAction(formData);
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

  const handleMicClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const isLoading = state.status === "loading";

  return (
    <div className="space-y-8">
      <PageHeader
        title="Speak Your Problem"
        description="Narrate your issue and get instant AI analysis."
      />

      <Card>
        <CardHeader>
          <CardTitle>Voice Recorder</CardTitle>
          <CardDescription>Click the button to start recording.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center space-y-6 py-10">
          <Button
            size="icon"
            className="h-24 w-24 rounded-full shadow-lg data-[recording=true]:bg-destructive data-[recording=true]:hover:bg-destructive/90 data-[recording=true]:animate-pulse"
            onClick={handleMicClick}
            disabled={!hasPermission || isLoading}
            data-recording={isRecording}
          >
            <Mic className="h-10 w-10" />
          </Button>
          <p className="text-4xl font-mono font-bold tracking-wider">{formatTime(timer)}</p>
          <p className="text-sm text-muted-foreground">Your session is private and not stored.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><Bot className="mr-2" /> AI Analysis</CardTitle>
          <CardDescription>Your analysis will appear here after recording.</CardDescription>
        </CardHeader>
        <CardContent className="min-h-48">
            {isLoading && 
              <div className="flex flex-col items-center justify-center text-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-4"/>
                  <p className="text-muted-foreground">Analyzing your recording, please wait...</p>
              </div>
            }
            
            {state.status === 'idle' && (
                <p className="text-center text-muted-foreground py-10">
                    {hasPermission ? 'Click the microphone to start your recording.' : 'Please enable microphone access.'}
                </p>
            )}

            {state.status === "success" && state.data && (
                <div className="space-y-4 text-sm">
                  <div className="p-3 bg-background rounded-lg border">
                    <h3 className="font-semibold mb-1">Simple Summary</h3>
                    <p className="text-muted-foreground">{state.data.caseSummary}</p>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                     <div className="p-3 bg-background rounded-lg border">
                        <h3 className="font-semibold mb-1 flex items-center"><Scale className="mr-2 text-primary" /> Case Type</h3>
                        <p className="text-lg font-semibold">{state.data.caseType}</p>
                    </div>
                    <div className="p-3 bg-background rounded-lg border">
                        <h3 className="font-semibold mb-1 flex items-center"><Landmark className="mr-2 text-primary" /> Jurisdiction</h3>
                        <p className="text-muted-foreground">{state.data.jurisdiction}</p>
                    </div>
                  </div>
                   <div className="p-3 bg-background rounded-lg border">
                    <h3 className="font-semibold mb-1 flex items-center"><FileText className="mr-2 text-primary" /> Relevant Laws</h3>
                    <p className="text-muted-foreground">{state.data.relevantLaws}</p>
                  </div>
                  <div className="p-3 bg-background rounded-lg border">
                    <h3 className="font-semibold mb-1 flex items-center"><StepForward className="mr-2 text-primary" /> Next Actions</h3>
                    <div className="text-muted-foreground whitespace-pre-line">{state.data.nextActions}</div>
                  </div>
                </div>
              )}
        </CardContent>
      </Card>
    </div>
  );
}
