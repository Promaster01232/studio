"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ShieldAlert, RefreshCcw, Home, Activity } from "lucide-react";
import { motion } from "framer-motion";
import { Logo } from "@/components/logo";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[STATUTORY FAILURE]", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background bg-golden-animate flex items-center justify-center p-6 selection:bg-primary/20">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full text-center space-y-12"
      >
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="absolute inset-0 bg-red-500/20 blur-3xl rounded-full animate-pulse" />
            <div className="bg-red-500 p-6 rounded-[2.5rem] shadow-2xl relative z-10 border-4 border-white/10">
              <ShieldAlert className="h-12 w-12 text-white" />
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-3">
              <Logo className="h-8 w-8 p-0 border-none shadow-none bg-transparent" priority={false} />
              <h1 className="text-3xl sm:text-4xl font-black tracking-tighter uppercase text-foreground leading-none">
                System Breach Detected
              </h1>
            </div>
            <p className="text-[10px] sm:text-[12px] font-bold text-muted-foreground uppercase tracking-[0.4em]">
              The neural hub encountered a procedural runtime error.
            </p>
          </div>
        </div>

        <div className="p-8 rounded-[2.5rem] bg-card border border-red-500/10 shadow-inner">
          <div className="flex items-center gap-3 text-red-500 mb-4 justify-center">
            <Activity className="h-4 w-4 animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-widest">Forensic Error Registry</span>
          </div>
          <p className="text-sm font-bold text-muted-foreground bg-muted/30 p-4 rounded-xl font-mono truncate">
            {error.message || "An institutional exception occurred during node synchronization."}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button 
            size="lg" 
            onClick={() => reset()}
            className="rounded-2xl font-black uppercase tracking-widest text-[10px] h-14 px-10 shadow-2xl active:scale-95 transition-all"
          >
            <RefreshCcw className="mr-3 h-4 w-4" /> Restart Node
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            asChild
            className="rounded-2xl font-black uppercase tracking-widest text-[10px] h-14 px-10 border-primary/10 hover:bg-primary/5 active:scale-95 transition-all text-foreground"
          >
            <Link href="/">
              <Home className="mr-3 h-4 w-4" /> Exit Terminal
            </Link>
          </Button>
        </div>

        <p className="text-[9px] font-black uppercase tracking-[0.6em] text-muted-foreground/30">
          NYAYASAHAYAK.IN // RESILIENCE PROTOCOL // ERROR {error.digest || "HUB"}
        </p>
      </motion.div>
    </div>
  );
}