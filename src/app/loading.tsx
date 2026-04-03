'use client';

import { Logo } from "@/components/logo";
import { motion } from "framer-motion";
import { Activity } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[300] flex flex-col items-center justify-center bg-background/95 backdrop-blur-md">
      <div className="relative mb-6">
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute -inset-6 bg-primary/10 rounded-full blur-2xl"
        />
        <div className="relative p-1 rounded-full bg-primary/5">
          <div className="bg-white rounded-full p-2 shadow-2xl">
            <Logo className="h-16 w-16 border-none shadow-none bg-transparent p-0" priority={true} />
          </div>
        </div>
      </div>
      
      <div className="space-y-2 flex flex-col items-center">
        <div className="flex items-center gap-2 px-4 py-1 rounded-full bg-primary/5 border border-primary/10">
          <Activity className="h-3 w-3 text-primary animate-pulse" />
          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-primary">
            Syncing Node
          </span>
        </div>
        <p className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground/40">
          Establishing Secure Ingress
        </p>
      </div>
    </div>
  );
}