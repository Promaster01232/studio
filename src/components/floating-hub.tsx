
"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Bot, 
  Plus, 
  Send, 
  X, 
  Sparkles, 
  Loader2, 
  Activity, 
  ShieldCheck,
  MoreHorizontal
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";
import { useAuth } from "@/firebase";

interface Message {
    role: 'user' | 'ai';
    text: string;
}

export function FloatingHub() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const auth = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Ensure consistent SSR/CSR render to avoid hydration mismatch
  if (!mounted || !auth.currentUser) return null;

  return (
    <>
      <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-[100] flex flex-col items-end gap-4 pointer-events-none">
        <div className="flex flex-col gap-3 pointer-events-auto">
          {/* Post Dispatch Node */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              asChild
              className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-white dark:bg-zinc-900 border border-primary/10 shadow-2xl hover:bg-primary/5 text-primary group transition-all"
            >
              <Link href="/dashboard/research-analytics/new">
                <Plus className="h-6 w-6 transition-transform group-hover:rotate-90" />
                <span className="sr-only">Initialize Post</span>
              </Link>
            </Button>
          </motion.div>

          {/* AI Robot Node */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={() => setIsChatOpen(true)}
              className="h-14 w-14 sm:h-16 sm:w-16 rounded-[1.8rem] sm:rounded-[2rem] bg-primary text-white shadow-[0_20px_50px_rgba(153,75,0,0.3)] hover:bg-primary/90 relative group overflow-hidden border-2 border-white/10"
            >
              <Bot className="h-7 w-7 sm:h-8 sm:w-8 relative z-10 transition-transform group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              {/* Pulsing Core */}
              <div className="absolute inset-0 bg-white/10 animate-ping opacity-20 rounded-full" />
            </Button>
          </motion.div>
        </div>
      </div>

      <AIChatDialog open={isChatOpen} onOpenChange={setIsChatOpen} />
    </>
  );
}

function AIChatDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'ai', text: "Namaste! I am Nyaya Mitra, your AI legal co-pilot. How can I assist your forensic research today?" }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = () => {
        if (!input.trim() || isLoading) return;
        
        const userMsg = input.trim();
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setInput("");
        setIsLoading(true);

        // Simulate Neural Processing
        setTimeout(() => {
            setMessages(prev => [...prev, { 
                role: 'ai', 
                text: "I am analyzing your query against the statutory registry. For a more detailed deconstruction, please utilize the specialized terminals like 'Narrate Problem' or 'Strength Matrix'." 
            }]);
            setIsLoading(false);
        }, 1500);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-[2rem] border-none shadow-[0_0_100px_rgba(0,0,0,0.2)] bg-card text-left">
                <DialogHeader className="bg-primary p-6 text-white border-none flex flex-row items-center gap-4 space-y-0">
                    <div className="relative">
                        <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                            <Bot className="h-6 w-6" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-primary shadow-sm animate-pulse" />
                    </div>
                    <div className="text-left flex-1 min-w-0">
                        <DialogTitle className="text-xl font-black tracking-tighter leading-none text-white">Nyaya Mitra Chat</DialogTitle>
                        <DialogDescription className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/60 mt-1">Forensic Assistant Node Active</DialogDescription>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="text-white/60 hover:text-white hover:bg-white/10 rounded-full h-8 w-8">
                        <X className="h-4 w-4" />
                    </Button>
                </DialogHeader>

                <div className="h-[450px] flex flex-col bg-muted/5">
                    <ScrollArea className="flex-1 p-6" viewportRef={scrollRef}>
                        <div className="space-y-6">
                            {messages.map((m, i) => (
                                <motion.div 
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={cn(
                                        "flex flex-col max-w-[85%] space-y-1.5",
                                        m.role === 'user' ? "ml-auto items-end" : "items-start"
                                    )}
                                >
                                    <div className={cn(
                                        "px-4 py-3 rounded-2xl text-sm font-medium leading-relaxed shadow-sm",
                                        m.role === 'user' 
                                            ? "bg-primary text-white rounded-tr-none" 
                                            : "bg-white dark:bg-zinc-900 border border-primary/5 text-foreground rounded-tl-none"
                                    )}>
                                        {m.text}
                                    </div>
                                    <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest px-1">
                                        {m.role === 'ai' ? 'Nyaya Mitra' : 'Registry Node'}
                                    </span>
                                </motion.div>
                            ))}
                            {isLoading && (
                                <div className="flex gap-2 items-center text-primary/40 p-2">
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                    <span className="text-[10px] font-black uppercase tracking-widest animate-pulse">Neural Ingress...</span>
                                </div>
                            )}
                        </div>
                    </ScrollArea>

                    <div className="p-4 bg-background/80 backdrop-blur-md border-t border-primary/5">
                        <div className="flex items-center gap-2">
                            <Input 
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Consult the AI co-pilot..." 
                                className="h-11 rounded-xl glass border-primary/10 focus:border-primary font-bold text-xs"
                            />
                            <Button 
                                onClick={handleSend}
                                disabled={!input.trim() || isLoading}
                                className="h-11 w-11 rounded-xl p-0 shadow-lg"
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="mt-3 flex items-center justify-center gap-2 opacity-30">
                            <ShieldCheck className="h-3 w-3" />
                            <span className="text-[8px] font-black uppercase tracking-[0.3em]">Encrypted Session</span>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
