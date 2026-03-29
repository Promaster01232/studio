
'use client';

import { Logo } from "@/components/logo";
import { motion } from "framer-motion";
import { Loader2, Activity } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[60vh] w-full">
      <div className="flex flex-col items-center gap-8">
        <div className="relative">
          {/* Animated Forensic Rings */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
            className="absolute -inset-12 border border-primary/5 rounded-full opacity-40"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
            className="absolute -inset-8 border border-accent/5 rounded-full opacity-40"
          />
          
          <div className="relative">
            <div className="p-1 rounded-full bg-gradient-to-tr from-primary via-accent to-blue-400 shadow-2xl">
              <Logo className="h-16 w-16 shadow-none" priority />
            </div>
            
            {/* Pulsing Tricolor Glow */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.2, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 bg-primary/20 rounded-full blur-xl -z-10"
            />
          </div>
        </div>

        <div className="space-y-4 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 shadow-sm">
              <Activity className="h-3 w-3 text-primary animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Protocol Synchronization</span>
            </div>
            <h3 className="text-xl font-black font-headline tracking-tighter text-foreground">
              Initialising Forensic Terminal...
            </h3>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>Registry Status: Active // NS-ALPH-4</span>
          </div>
        </div>
      </div>
    </div>
  );
}
