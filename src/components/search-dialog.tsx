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
import { Search, FileText, Gavel, Library, ArrowRight, Zap, History, Command } from "lucide-react";
import { ReactNode, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const suggestions = [
    { name: "Narrate Problem", type: "AI Tool", icon: Zap, href: "/dashboard/narrate", color: "text-amber-500", bg: "bg-amber-500/10" },
    { name: "Legal Knowledge Hub", type: "Resource", icon: Library, href: "/dashboard/learn", color: "text-blue-500", bg: "bg-blue-500/10" },
    { name: "My Tracked Cases", type: "Tracker", icon: Gavel, href: "/dashboard/my-cases", color: "text-indigo-500", bg: "bg-indigo-500/10" },
    { name: "Document Generator", type: "Action", icon: FileText, href: "/dashboard/document-generator", color: "text-green-600", bg: "bg-green-600/10" },
];

const recentSearches = [
    "FIR filing procedure",
    "Bail bond formats",
    "Consumer rights in India"
];

export function SearchDialog({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
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
      <DialogContent className="sm:max-w-2xl p-0 overflow-hidden border-none shadow-2xl rounded-2xl bg-card">
        <DialogHeader className="sr-only">
          <DialogTitle>Institutional Search Hub</DialogTitle>
          <DialogDescription>Search for legal tools, resources, or tracked cases within the Nyaya Sahayak ecosystem.</DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center border-b p-4 gap-3 bg-muted/20">
            <Search className="h-5 w-5 text-muted-foreground animate-pulse" />
            <Input 
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tools, legal resources, or cases..." 
                className="flex-1 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 font-bold text-lg p-0 h-10 shadow-none"
                autoFocus
            />
            <div className="flex items-center gap-1.5 px-2 py-1 bg-background border rounded-lg text-[10px] font-black text-muted-foreground uppercase tracking-widest shadow-sm">
                Esc
            </div>
        </div>
        
        <div className="p-4 sm:p-6 space-y-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
            {query.length === 0 ? (
                <>
                    <section className="space-y-3">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 px-1 flex items-center gap-2">
                            <Zap className="h-3 w-3" /> Recommended Nodes
                        </h3>
                        <div className="grid sm:grid-cols-2 gap-3">
                            {suggestions.map((item) => (
                                <button
                                    key={item.href}
                                    onClick={() => runCommand(item.href)}
                                    className="flex items-center p-3 rounded-xl hover:bg-primary/5 text-left w-full border border-primary/5 transition-all hover:border-primary/20 group"
                                >
                                    <div className={cn("p-2.5 rounded-lg mr-3 shadow-sm transition-transform group-hover:scale-110", item.bg, item.color)}>
                                        <item.icon className="h-4 w-4" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-xs tracking-tight">{item.name}</p>
                                        <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-tighter opacity-60">{item.type}</p>
                                    </div>
                                    <ArrowRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                                </button>
                            ))}
                        </div>
                    </section>

                    <section className="space-y-3">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 px-1 flex items-center gap-2">
                            <History className="h-3 w-3" /> Recent Activity
                        </h3>
                        <div className="flex flex-col gap-1">
                            {recentSearches.map((search) => (
                                <button
                                    key={search}
                                    className="flex items-center p-3 rounded-lg hover:bg-muted text-xs font-bold text-muted-foreground hover:text-foreground transition-colors text-left"
                                >
                                    <Search className="h-3.5 w-3.5 mr-3 opacity-40" />
                                    {search}
                                </button>
                            ))}
                        </div>
                    </section>
                </>
            ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center opacity-40">
                    <div className="p-4 bg-muted rounded-full mb-4">
                        <Search className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <p className="font-black text-lg tracking-tighter">Searching for "{query}"...</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest mt-1">Institutional Index Audit in Progress</p>
                </div>
            )}
        </div>
        
        <div className="p-4 border-t bg-muted/10 flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">
            <div className="flex items-center gap-4">
                <span className="flex items-center gap-1"><ArrowRight className="h-2.5 w-2.5 text-primary" /> Select</span>
                <span className="flex items-center gap-1"><Command className="h-2.5 w-2.5 text-primary" /> Navigate</span>
            </div>
            <div className="flex items-center gap-1">
                Nyaya Sahayak <span className="text-primary/40 ml-1">// Search Hub</span>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}