
"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Play, Pause, Loader2, Headset } from "lucide-react";
import { getAudioSummaryAction } from "@/app/dashboard/audio-actions";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

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
        className={`h-9 px-4 font-bold rounded-xl transition-all duration-300 ${
          playing ? 'border-primary bg-primary/5 text-primary shadow-lg shadow-primary/10' : 'border-primary/10'
        }`}
      >
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, rotate: 0 }}
              animate={{ opacity: 1, rotate: 360 }}
              exit={{ opacity: 0 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            >
              <Loader2 className="h-4 w-4" />
            </motion.div>
          ) : playing ? (
            <motion.div
              key="playing"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-2"
            >
              <div className="flex gap-0.5 items-center">
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ height: [4, 12, 4] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }}
                    className="w-0.5 bg-primary rounded-full"
                  />
                ))}
              </div>
              <span>Listen</span>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-2"
            >
              <Headset className="h-4 w-4" />
              <span>Read Aloud</span>
            </motion.div>
          )}
        </AnimatePresence>
      </Button>
    </div>
  );
}
