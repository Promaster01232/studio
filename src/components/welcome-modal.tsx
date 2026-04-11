
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
  CheckCircle2
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
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + delay }}
            className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.06] transition-all group"
        >
            <div className={cn("p-2.5 rounded-xl shadow-lg transition-transform group-hover:scale-110", bg, color)}>
                <Icon className="h-5 w-5" />
            </div>
            <div className="text-left space-y-0.5">
                <h4 className="font-black text-sm tracking-tight text-white/90">{title}</h4>
                <p className="text-[11px] font-medium text-white/40 leading-tight">{desc}</p>
            </div>
        </motion.div>
    );
}

export function WelcomeModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem("ns_welcome_complete");
    if (!hasSeenWelcome) {
      const timer = setTimeout(() => setOpen(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem("ns_welcome_complete", "true");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden border-none shadow-[0_0_100px_rgba(0,0,0,0.5)] rounded-[2.5rem] bg-[#121212] text-white">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="relative z-10 p-8 sm:p-10 flex flex-col items-center text-center">
            <motion.div 
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="mb-8"
            >
                <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse" />
                    <div className="h-20 w-20 rounded-full bg-primary flex items-center justify-center border-4 border-white/10 shadow-2xl relative z-10">
                        <Sparkles className="h-10 w-10 text-white" />
                    </div>
                </div>
            </motion.div>

            <DialogHeader className="space-y-2 border-none mb-8">
                <DialogTitle className="text-2xl sm:text-3xl font-black tracking-tighter text-white uppercase leading-none">
                    Welcome to Nyaya Guru! 🎉
                </DialogTitle>
                <DialogDescription className="text-sm font-bold text-white/40 uppercase tracking-widest">
                    Your AI-powered legal assistant for India
                </DialogDescription>
            </DialogHeader>

            <div className="w-full space-y-3 mb-10">
                <FeatureItem 
                    icon={MessageSquare} 
                    title="Legal Q&A" 
                    desc="Ask any legal question and get instant, reliable answers" 
                    color="text-blue-400" 
                    bg="bg-blue-500/10"
                    delay={0.1}
                />
                <FeatureItem 
                    icon={Search} 
                    title="Web Search" 
                    desc="Find latest judgments and legal updates from the web" 
                    color="text-purple-400" 
                    bg="bg-purple-500/10"
                    delay={0.2}
                />
                <FeatureItem 
                    icon={FileSearch} 
                    title="Document Analysis" 
                    desc="Upload contracts & agreements for AI-powered review" 
                    color="text-orange-400" 
                    bg="bg-orange-500/10"
                    delay={0.3}
                />
                <FeatureItem 
                    icon={BookText} 
                    title="Notes & Docs" 
                    desc="Organize your legal documents and notes in one place" 
                    color="text-green-400" 
                    bg="bg-green-500/10"
                    delay={0.4}
                />
            </div>

            <Button 
                onClick={handleClose}
                className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest text-xs rounded-2xl shadow-[0_20px_50px_rgba(153,75,0,0.3)] active:scale-95 transition-all group overflow-hidden relative"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <Sparkles className="mr-2 h-4 w-4" /> Get Started
            </Button>

            <p className="mt-8 text-[10px] font-medium text-white/20 leading-relaxed max-w-[280px]">
                Nyaya Guru provides general legal information, not legal advice. Consult a lawyer for specific matters.
            </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
