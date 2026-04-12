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
  FileSearch, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureProps {
    icon: any;
    title: string;
    desc: string;
    color: string;
    bg: string;
}

function FeatureItem({ icon: Icon, title, desc, color, bg }: FeatureProps) {
    return (
        <div className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/[0.05] group">
            <div className={cn("p-2.5 rounded-lg shadow-md", bg, color)}>
                <Icon className="h-5 w-5" />
            </div>
            <div className="text-left space-y-0.5">
                <h4 className="font-black text-sm tracking-tight text-white/90">{title}</h4>
                <p className="text-[10px] font-medium text-white/40 leading-relaxed">{desc}</p>
            </div>
        </div>
    );
}

export function WelcomeModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem("ns_welcome_complete");
    if (!hasSeenWelcome) {
      setOpen(true);
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
        className="sm:max-w-md p-0 overflow-hidden border-none shadow-2xl rounded-2xl bg-[#0a0a0a] text-white"
      >
        <div className="relative z-10 p-8 flex flex-col items-center text-center">
            <div className="mb-8">
                <div className="h-16 w-16 rounded-xl bg-primary flex items-center justify-center border-2 border-white/10 shadow-lg">
                    <Sparkles className="h-8 w-8 text-white" />
                </div>
            </div>

            <DialogHeader className="space-y-2 border-none mb-8">
                <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary">
                        <Activity className="h-3 w-3" />
                        <span className="text-[8px] font-black uppercase tracking-widest">Access Authorization Active</span>
                    </div>
                    <DialogTitle className="text-3xl font-black tracking-tight text-white uppercase leading-none">
                        Nyaya Sahayak <br /> <span className="text-primary">Synchronized.</span>
                    </DialogTitle>
                </div>
                <DialogDescription className="text-[10px] font-bold text-white/40 uppercase tracking-widest pt-1">
                    Elite AI Legal Assistant for Bharat
                </DialogDescription>
            </DialogHeader>

            <div className="w-full space-y-3 mb-10">
                <FeatureItem 
                    icon={MessageSquare} 
                    title="Forensic Q&A" 
                    desc="Ask statutory questions and get precise answers instantly." 
                    color="text-blue-400" 
                    bg="bg-blue-500/10"
                />
                <FeatureItem 
                    icon={FileSearch} 
                    title="Document Intelligence" 
                    desc="Analyze contracts for neural risk identification." 
                    color="text-orange-400" 
                    bg="bg-orange-500/10"
                />
                <FeatureItem 
                    icon={ShieldCheck} 
                    title="Statutory Privacy" 
                    desc="All data is encrypted via TLS 1.3 protocols." 
                    color="text-green-400" 
                    bg="bg-green-500/10"
                />
            </div>

            <Button 
                onClick={handleClose}
                className="w-full h-12 bg-primary text-primary-foreground font-black uppercase tracking-widest text-[10px] rounded-lg shadow-xl active:scale-[0.97] transition-all"
            >
                Initialize Terminal <ArrowRight className="h-4 w-4 ml-2" />
            </Button>

            <div className="mt-8 flex items-center justify-center gap-2 opacity-20">
                <ShieldCheck className="h-3 w-3" />
                <p className="text-[8px] font-black uppercase tracking-widest">
                    Registry Synchronized // Secure Ingress
                </p>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}