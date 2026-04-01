'use client';

import { Logo } from "@/components/logo";
import { motion } from "framer-motion";
import { Activity, ShieldCheck } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[70vh] w-full">
      <div className="relative mb-10">
        {/* Forensic Scanning Rings */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
          className="absolute -inset-16 border border-primary/10 rounded-full border-dashed"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
          className="absolute -inset-12 border border-accent/10 rounded-full border-dotted"
        />
        
        <div className="relative">
          <div className="p-1.5 rounded-full bg-gradient-to-tr from-primary via-accent to-blue-400 shadow-2xl">
            <div className="bg-white rounded-full p-3 shadow-inner">
              <Logo className="h-20 w-20 shadow-none border-none p-0" priority />
            </div>
          </div>
          
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.4, 0.1, 0.4],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 bg-primary/30 rounded-full blur-2xl -z-10"
          />
        </div>
      </div>

      <div className="space-y-5 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-3 px-5 py-2 rounded-full bg-primary/5 border border-primary/10 shadow-sm">
            <ShieldCheck className="h-4 w-4 text-primary animate-pulse" />
            <h3 className="text-xl font-black font-headline tracking-tighter text-foreground uppercase">
              Authorizing Terminal
            </h3>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
              <div className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
              <div className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" />
            </div>
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">
              Registry Syncing // Forensic Access Protocol 4.2
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
