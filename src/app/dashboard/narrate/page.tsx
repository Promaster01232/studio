"use client";

import { useActionState, useState, useRef, useEffect } from "react";
import { summarizeCaseAction, type CaseSummaryState } from "./actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, Bot, FileText, Scale, Landmark, StepForward, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { useToast } from "@/hooks/use-toast";

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
          <CardDescription>Use the buttons below to record your problem.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center space-y-6 py-10">
          <div className="flex items-center justify-center gap-4">
              <Button
                  onClick={startRecording}
                  disabled={!hasPermission || isLoading || isRecording}
                  className="h-24 w-32 rounded-lg shadow-lg flex-col gap-2"
              >
                  <Mic className="h-8 w-8" />
                  <span>Start Recording</span>
              </Button>
              <Button
                  onClick={stopRecording}
                  disabled={!isRecording}
                  className="h-24 w-32 rounded-lg shadow-lg flex-col gap-2"
                  variant="destructive"
              >
                  <div className="h-8 w-8 bg-destructive-foreground rounded-sm"></div>
                  <span>Stop Recording</span>
              </Button>
          </div>
          <p className="text-4xl font-mono font-bold tracking-wider">{formatTime(timer)}</p>
          <p className="text-sm text-muted-foreground">
              {isRecording ? "Recording in progress..." : "Click 'Start Recording' to begin."}
          </p>
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
