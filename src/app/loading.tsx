
'use client';

import { Logo } from "@/components/logo";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-background/80 backdrop-blur-xl">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -inset-6 bg-primary/10 rounded-full blur-xl"
          />
          <div className="relative p-1 rounded-full bg-gradient-to-tr from-primary via-accent to-blue-400">
            <Logo className="h-14 w-14 border-none bg-white rounded-full p-2 shadow-2xl" priority />
          </div>
        </div>
        <div className="flex items-center gap-3 text-primary font-black text-[10px] uppercase tracking-[0.4em]">
          <Loader2 className="h-4 w-4 animate-spin" />
          Synchronizing Registry...
        </div>
      </div>
    </div>
  );
}
