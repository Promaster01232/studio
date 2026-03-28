
"use client";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "./ui/input";
import { Search, FileText, Gavel, Library, ArrowRight, Zap, History, Command, User, ShieldCheck, Activity, Sparkles, Cpu } from "lucide-react";
import { ReactNode, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Card } from "./ui/card";

const suggestions = [
    { name: "Narrate Problem", type: "AI Tool", icon: Zap, href: "/dashboard/narrate", color: "text-amber-500", bg: "bg-amber-500/10" },
    { name: "Legal Knowledge Hub", type: "Resource", icon: Library, href: "/dashboard/learn", color: "text-blue-500", bg: "bg-blue-500/10" },
    { name: "My Tracked Cases", type: "Tracker", icon: Gavel, href: "/dashboard/my-cases", color: "text-indigo-500", bg: "bg-indigo-500/10" },
    { name: "Document Generator", type: "Action", icon: FileText, href: "/dashboard/document-generator", color: "text-green-600", bg: "bg-green-600/10" },
];

const institutionalKnowledge = [
    { 
        keywords: ["ceo", "piyush", "founder", "piyush singh"], 
        title: "Piyush Singh", 
        role: "CEO & Co-founder", 
        bio: "Steers the strategic trajectory of Nyaya Sahayak, focusing on institutional growth and the democratization of elite legal tools.",
        icon: User,
        color: "text-blue-500",
        bg: "bg-blue-500/10"
    },
    { 
        keywords: ["hardy", "founder", "architect", "hardy pie"], 
        title: "Hardy Pie", 
        role: "Founder & Architect", 
        bio: "The visionary architect behind the core forensic logic and high-fidelity neural interfaces of the Nyaya Sahayak ecosystem.",
        icon: Cpu,
        color: "text-amber-600",
        bg: "bg-amber-500/10"
    },
    {
        keywords: ["about", "mission", "nyaya sahayak", "what is"],
        title: "About Nyaya Sahayak",
        role: "Institutional Mandate",
        bio: "India's premier AI legal assistant providing forensic case audits, BNS statutory scanning, and procedural roadmaps for 1.4 billion citizens.",
        icon: ShieldCheck,
        color: "text-primary",
        bg: "bg-primary/5"
    }
];

export function SearchDialog({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [matchingKnowledge, setMatchingKnowledge] = useState<any[]>([]);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  useEffect(() => {
    if (query.length > 1) {
        const lowerQuery = query.toLowerCase();
        const matches = institutionalKnowledge.filter(k => 
            k.keywords.some(kw => lowerQuery.includes(kw)) ||
            k.title.toLowerCase().includes(lowerQuery)
        );
        setMatchingKnowledge(matches);
    } else {
        setMatchingKnowledge([]);
    }
  }, [query]);

  const runCommand = (href: string) => {
    setOpen(false);
    setQuery("");
    router.push(href);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl p-0 overflow-hidden border-none shadow-[0_0_100px_rgba(0,0,0,0.2)] rounded-[2rem] bg-card text-left">
        <DialogHeader className="sr-only">
          <DialogTitle>Institutional Search Hub</DialogTitle>
          <DialogDescription>Search for legal tools, resources, or tracked cases within the nyayasahayak.in ecosystem.</DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center border-b p-6 gap-4 bg-muted/20">
            <Search className="h-6 w-6 text-primary animate-pulse" />
            <Input 
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search anything about Nyaya Sahayak..." 
                className="flex-1 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 font-black text-xl p-0 h-12 shadow-none placeholder:opacity-30"
                autoFocus
            />
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-background border rounded-xl text-[10px] font-black text-muted-foreground uppercase tracking-widest shadow-sm">
                Esc
            </div>
        </div>
        
        <div className="p-6 space-y-8 max-h-[65vh] overflow-y-auto custom-scrollbar">
            <AnimatePresence mode="wait">
                {query.length > 0 ? (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }} 
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        {matchingKnowledge.length > 0 && (
                            <section className="space-y-4">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary px-1 flex items-center gap-2">
                                    <Sparkles className="h-3 w-3" /> Institutional Intelligence
                                </h3>
                                <div className="grid gap-4">
                                    {matchingKnowledge.map((item, idx) => (
                                        <Card key={idx} className="border-primary/10 bg-primary/5 rounded-[1.5rem] overflow-hidden group shadow-lg">
                                            <div className="p-6 flex gap-5 text-left">
                                                <div className={cn("p-4 rounded-2xl h-fit shrink-0 shadow-xl", item.bg, item.color)}>
                                                    <item.icon className="h-6 w-6" />
                                                </div>
                                                <div className="space-y-2">
                                                    <div>
                                                        <h4 className="font-black text-lg leading-tight tracking-tighter">{item.title}</h4>
                                                        <p className={cn("text-[10px] font-black uppercase tracking-widest", item.color)}>{item.role}</p>
                                                    </div>
                                                    <p className="text-sm font-medium text-muted-foreground leading-relaxed">{item.bio}</p>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </section>
                        )}

                        <section className="space-y-3">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 px-1 flex items-center gap-2">
                                <Activity className="h-3 w-3" /> Navigation Nodes
                            </h3>
                            <div className="grid gap-2">
                                {suggestions.filter(s => s.name.toLowerCase().includes(query.toLowerCase())).map((item) => (
                                    <button
                                        key={item.href}
                                        onClick={() => runCommand(item.href)}
                                        className="flex items-center p-4 rounded-2xl hover:bg-primary/5 text-left w-full border border-transparent hover:border-primary/10 transition-all group"
                                    >
                                        <div className={cn("p-2 rounded-lg mr-4 shadow-sm group-hover:scale-110 transition-transform", item.bg, item.color)}>
                                            <item.icon className="h-4 w-4" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-black text-sm tracking-tight">{item.name}</p>
                                            <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-tighter opacity-60">{item.type}</p>
                                        </div>
                                        <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0" />
                                    </button>
                                ))}
                            </div>
                        </section>
                    </motion.div>
                ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
                        <section className="space-y-4">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/60 px-1 flex items-center gap-2 text-left">
                                <Zap className="h-3 w-3" /> Neural Recommendations
                            </h3>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {suggestions.map((item) => (
                                    <button
                                        key={item.href}
                                        onClick={() => runCommand(item.href)}
                                        className="flex items-center p-4 rounded-[1.2rem] bg-muted/30 hover:bg-primary/5 text-left w-full border border-primary/5 transition-all hover:border-primary/20 group shadow-sm"
                                    >
                                        <div className={cn("p-3 rounded-xl mr-4 shadow-lg transition-transform group-hover:scale-110", item.bg, item.color)}>
                                            <item.icon className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-black text-sm tracking-tight">{item.name}</p>
                                            <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-tighter opacity-60">{item.type}</p>
                                        </div>
                                        <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                                    </button>
                                ))}
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 px-1 flex items-center gap-2 text-left">
                                <History className="h-3 w-3" /> Recent Audit Activity
                            </h3>
                            <div className="flex flex-col gap-2">
                                {[
                                    "Who is the CEO of Nyaya Sahayak?",
                                    "BNS section for theft",
                                    "FIR application for mobile theft"
                                ].map((search) => (
                                    <button
                                        key={search}
                                        onClick={() => setQuery(search)}
                                        className="flex items-center p-4 rounded-xl hover:bg-muted/50 text-xs font-bold text-muted-foreground hover:text-primary transition-all text-left group"
                                    >
                                        <Search className="h-4 w-4 mr-4 opacity-20 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                                        {search}
                                    </button>
                                ))}
                            </div>
                        </section>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
        
        <div className="p-5 border-t bg-muted/10 flex items-center justify-between text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">
            <div className="flex items-center gap-6">
                <span className="flex items-center gap-2"><ArrowRight className="h-3 w-3 text-primary" /> Execute</span>
                <span className="flex items-center gap-2"><Command className="h-3 w-3 text-primary" /> Navigate</span>
            </div>
            <div className="flex items-center gap-2">
                Nyaya Sahayak <span className="text-primary/40">// Neural Forensic Hub</span>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
