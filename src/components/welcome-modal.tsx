
"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  MessageSquare, 
  Search, 
  FileSearch, 
  BookText, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  X,
  Activity
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface FeatureProps {
    icon: any;
    title: string;
    desc: string;
    color: string;
    bg: string;
    delay: number;
}

function FeatureItem({ icon: Icon, title, desc, color, bg, delay }: FeatureProps) {
    return (
        <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ 
                type: "spring", 
                stiffness: 100, 
                damping: 20,
                delay: 0.4 + delay 
            }}
            className="flex items-start gap-5 p-5 rounded-[1.5rem] bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.06] transition-all group"
        >
            <div className={cn("p-3 rounded-2xl shadow-xl transition-transform group-hover:scale-110", bg, color)}>
                <Icon className="h-6 w-6" />
            </div>
            <div className="text-left space-y-1">
                <h4 className="font-black text-base tracking-tight text-white/90">{title}</h4>
                <p className="text-xs font-medium text-white/40 leading-relaxed">{desc}</p>
            </div>
        </motion.div>
    );
}

export function WelcomeModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem("ns_welcome_complete");
    if (!hasSeenWelcome) {
      const timer = setTimeout(() => setOpen(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem("ns_welcome_complete", "true");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent 
        hideClose 
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        className="sm:max-w-xl p-0 overflow-hidden border-none shadow-[0_0_120px_rgba(0,0,0,0.6)] rounded-[3rem] bg-[#0a0a0a] text-white"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-primary/15 via-transparent to-transparent pointer-events-none" />
        
        <div className="relative z-10 p-10 sm:p-14 flex flex-col items-center text-center">
            <motion.div 
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
                className="mb-10"
            >
                <div className="relative">
                    <div className="absolute inset-0 bg-primary/30 blur-3xl rounded-full animate-pulse" />
                    <div className="h-24 w-24 rounded-[2rem] bg-primary flex items-center justify-center border-4 border-white/10 shadow-[0_20px_50px_rgba(153,75,0,0.4)] relative z-10">
                        <Sparkles className="h-12 w-12 text-white" />
                    </div>
                </div>
            </motion.div>

            <DialogHeader className="space-y-3 border-none mb-10">
                <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary">
                        <Activity className="h-3 w-3 animate-pulse" />
                        <span className="text-[9px] font-black uppercase tracking-[0.3em]">Node Authorization Active</span>
                    </div>
                    <DialogTitle className="text-3xl sm:text-5xl font-black tracking-tighter text-white uppercase leading-[0.95]">
                        Nyaya Sahayak <br /> <span className="text-primary italic">Synchronized.</span>
                    </DialogTitle>
                </div>
                <DialogDescription className="text-sm font-bold text-white/40 uppercase tracking-[0.2em] pt-2">
                    Elite AI Legal Assistant for Bharat
                </DialogDescription>
            </DialogHeader>

            <div className="w-full space-y-4 mb-12">
                <FeatureItem 
                    icon={MessageSquare} 
                    title="Forensic Q&A" 
                    desc="Ask any statutory question and get mathematically precise answers instantly." 
                    color="text-blue-400" 
                    bg="bg-blue-500/10"
                    delay={0.1}
                />
                <FeatureItem 
                    icon={FileSearch} 
                    title="Document Intelligence" 
                    desc="Upload contracts or notices for deep neural analysis and risk identification." 
                    color="text-orange-400" 
                    bg="bg-orange-500/10"
                    delay={0.2}
                />
                <FeatureItem 
                    icon={ShieldCheck} 
                    title="Statutory Privacy" 
                    desc="All data is encrypted via TLS 1.3 and subject to strict confidentiality nodes." 
                    color="text-green-400" 
                    bg="bg-green-500/10"
                    delay={0.3}
                />
            </div>

            <Button 
                onClick={handleClose}
                className="w-full h-16 bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-[0.2em] text-xs rounded-2xl shadow-[0_30px_60px_rgba(153,75,0,0.3)] active:scale-[0.97] transition-all group overflow-hidden relative"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <span className="relative z-10 flex items-center gap-3">
                    Initialize Terminal <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </span>
            </Button>

            <div className="mt-10 flex items-center justify-center gap-3 opacity-20">
                <ShieldCheck className="h-4 w-4" />
                <p className="text-[9px] font-black uppercase tracking-widest leading-none">
                    Registry synchronized // Secure ingress active
                </p>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
