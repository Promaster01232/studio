'use client';

import { Logo } from "@/components/logo";
import { motion } from "framer-motion";
import { Activity } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[300] flex flex-col items-center justify-center bg-background/90 backdrop-blur-md">
      <div className="relative mb-8">
        {/* Rapid Neural Pulse */}
        <motion.div
          animate={{ 
            scale: [1, 1.15, 1],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute -inset-8 bg-primary/20 rounded-full blur-2xl"
        />
        <div className="relative p-1 rounded-full bg-gradient-to-tr from-primary via-accent to-blue-400">
          <div className="bg-white rounded-full p-2.5 shadow-2xl">
            <Logo className="h-16 w-16 border-none shadow-none bg-transparent p-0" priority={true} />
          </div>
        </div>
      </div>
      
      <div className="space-y-3 flex flex-col items-center">
        <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 shadow-sm">
          <Activity className="h-3.5 w-3.5 text-primary animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">
            Syncing Registry
          </span>
        </div>
        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 animate-pulse">
          Establishing Secure Ingress // NS-NODE-ALPHA
        </p>
      </div>
    </div>
  );
}