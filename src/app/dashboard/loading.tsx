'use client';

import { Logo } from "@/components/logo";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] w-full">
      <div className="relative mb-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
          className="absolute -inset-12 border border-primary/5 rounded-full border-dashed"
        />
        
        <div className="relative">
          <div className="p-1 rounded-full bg-primary/5 shadow-2xl">
            <div className="bg-white rounded-full p-2 shadow-inner">
              <Logo className="h-16 w-16 shadow-none border-none p-0" priority={true} />
            </div>
          </div>
          
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.1, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 bg-primary/20 rounded-full blur-2xl -z-10"
          />
        </div>
      </div>

      <div className="space-y-4 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-1 rounded-full bg-primary/5 border border-primary/10">
            <ShieldCheck className="h-3.5 w-3.5 text-primary animate-pulse" />
            <h3 className="text-sm font-black tracking-tight text-foreground uppercase">
              Authorizing Terminal
            </h3>
          </div>
          <p className="text-[8px] font-black uppercase tracking-[0.4em] text-muted-foreground/30">
            Registry Syncing // Ingress Active
          </p>
        </div>
      </div>
    </div>
  );
}
