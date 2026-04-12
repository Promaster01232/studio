"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Bot, 
  Plus, 
  Send, 
  X, 
  Loader2, 
  ShieldCheck
} from "lucide-react";
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
import { cn } from "@/lib/utils";
import { useAuth } from "@/firebase";
import { getGeneralAiResponseAction } from "@/app/dashboard/chat-actions";

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

  if (!mounted || !auth.currentUser) return null;

  return (
    <>
      <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-[100] flex flex-col items-end gap-3 pointer-events-none">
        <div className="flex flex-col gap-2 pointer-events-auto">
          <Button
            asChild
            className="h-11 w-11 sm:h-12 sm:w-12 rounded-xl bg-white dark:bg-zinc-900 border border-primary/10 shadow-xl hover:bg-primary/5 text-primary group transition-all"
            silent
          >
            <Link href="/dashboard/research-analytics/new">
              <Plus className="h-5 w-5" />
              <span className="sr-only">Initialize Post</span>
            </Link>
          </Button>

          <Button
            onClick={() => setIsChatOpen(true)}
            className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-primary text-white shadow-2xl hover:bg-primary/90 relative group border-2 border-white/10"
          >
            <Bot className="h-6 w-6 sm:h-7 sm:w-7 relative z-10" />
          </Button>
        </div>
      </div>

      <AIChatDialog open={isChatOpen} onOpenChange={setIsChatOpen} />
    </>
  );
}

function AIChatDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'ai', text: "Namaste! I Am Nyaya Sahayak, Your AI Legal Co-Pilot. How Can I Assist Your Forensic Research Today?" }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;
        
        const userMsg = input.trim();
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setInput("");
        setIsLoading(true);

        const result = await getGeneralAiResponseAction(userMsg);

        setMessages(prev => [...prev, { 
            role: 'ai', 
            text: result.response 
        }]);
        setIsLoading(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-2xl border-none shadow-2xl bg-card text-left">
                <DialogHeader className="bg-primary p-5 text-white border-none flex flex-row items-center gap-3 space-y-0">
                    <div className="bg-white/20 p-2 rounded-lg backdrop-blur-md">
                        <Bot className="h-5 w-5" />
                    </div>
                    <div className="text-left flex-1 min-w-0">
                        <DialogTitle className="text-lg font-black tracking-tighter leading-none text-white">Nyaya Sahayak Chat</DialogTitle>
                        <DialogDescription className="text-[8px] font-bold text-white/60 mt-1 uppercase">Forensic Assistant Hub Active</DialogDescription>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="text-white/60 hover:text-white hover:bg-white/10 rounded-full h-8 w-8" silent>
                        <X className="h-4 w-4" />
                    </Button>
                </DialogHeader>

                <div className="h-[400px] flex flex-col bg-muted/5">
                    <ScrollArea className="flex-1 p-5" viewportRef={scrollRef}>
                        <div className="space-y-4">
                            {messages.map((m, i) => (
                                <div 
                                    key={i}
                                    className={cn(
                                        "flex flex-col max-w-[85%] space-y-1",
                                        m.role === 'user' ? "ml-auto items-end" : "items-start"
                                    )}
                                >
                                    <div className={cn(
                                        "px-4 py-2.5 rounded-xl text-sm font-medium leading-relaxed shadow-sm",
                                        m.role === 'user' 
                                            ? "bg-primary text-white rounded-tr-none" 
                                            : "bg-white dark:bg-zinc-900 border border-primary/5 text-foreground rounded-tl-none"
                                    )}>
                                        {m.text}
                                    </div>
                                    <span className="text-[7px] font-bold text-muted-foreground px-1 uppercase tracking-widest">
                                        {m.role === 'ai' ? 'Nyaya Sahayak' : 'Registry Point'}
                                    </span>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex gap-2 items-center text-primary/40 p-1">
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                    <span className="text-[8px] font-black uppercase tracking-widest">Syncing Hub...</span>
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
                                placeholder="Consult The AI Co-Pilot..." 
                                className="h-10 rounded-xl glass border-primary/10 focus:border-primary font-bold text-xs"
                            />
                            <Button 
                                onClick={handleSend}
                                disabled={!input.trim() || isLoading}
                                className="h-10 w-10 rounded-xl p-0 shadow-lg"
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="mt-2 flex items-center justify-center gap-2 opacity-30">
                            <ShieldCheck className="h-3 w-3" />
                            <span className="text-[7px] font-black uppercase tracking-widest">Encrypted Session</span>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}