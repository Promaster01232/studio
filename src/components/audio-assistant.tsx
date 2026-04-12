"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Headset } from "lucide-react";
import { getAudioSummaryAction } from "@/app/dashboard/audio-actions";
import { useToast } from "@/hooks/use-toast";

interface AudioAssistantProps {
  text: string;
  language: string;
  title?: string;
}

export function AudioAssistant({ text, language, title = "AI Voice Assistant" }: AudioAssistantProps) {
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const handleTogglePlay = async () => {
    if (audioUri && audioRef.current) {
      if (playing) {
        audioRef.current.pause();
        setPlaying(false);
      } else {
        audioRef.current.play();
        setPlaying(true);
      }
      return;
    }

    setLoading(true);
    const result = await getAudioSummaryAction(text, language);
    setLoading(false);

    if (result.success && result.audioDataUri) {
      setAudioUri(result.audioDataUri);
      setPlaying(true);
    } else {
      toast({
        variant: "destructive",
        title: "Audio Error",
        description: result.error || "Could not generate audio summary.",
      });
    }
  };

  useEffect(() => {
    if (audioUri && audioRef.current && playing) {
      audioRef.current.play().catch(err => {
        console.error("Playback failed:", err);
        setPlaying(false);
      });
    }
  }, [audioUri, playing]);

  const onEnded = () => {
    setPlaying(false);
  };

  return (
    <div className="flex items-center gap-2">
      {audioUri && (
        <audio 
          ref={audioRef} 
          src={audioUri} 
          onEnded={onEnded} 
          onPause={() => setPlaying(false)}
          onPlay={() => setPlaying(true)}
          className="hidden" 
        />
      )}
      
      <Button
        variant="outline"
        size="sm"
        onClick={handleTogglePlay}
        disabled={loading}
        className={`h-9 px-4 font-bold rounded-xl transition-all ${
          playing ? 'border-primary bg-primary/5 text-primary shadow-md' : 'border-primary/10'
        }`}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : playing ? (
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest">Playing</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Headset className="h-4 w-4" />
            <span className="text-[10px] uppercase tracking-widest">Listen</span>
          </div>
        )}
      </Button>
    </div>
  );
}