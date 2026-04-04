
"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Search, Bookmark, ShieldCheck, ArrowLeft, Sparkles, Activity, Layers, Globe } from "lucide-react";
import { topics } from "./data";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const categories = ["All", "Constitutional", "Criminal", "Civil", "Digital", "Corporate", "Public", "Industrial", "Specialized"];

const categoryStyles: Record<string, { color: string, bg: string, border: string, glow: string }> = {
    "Constitutional": { color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/20", glow: "from-orange-500/20" },
    "Criminal": { color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20", glow: "from-red-500/20" },
    "Civil": { color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20", glow: "from-blue-500/20" },
    "Digital": { color: "text-cyan-500", bg: "bg-cyan-500/10", border: "border-cyan-500/20", glow: "from-cyan-500/20" },
    "Corporate": { color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/20", glow: "from-purple-500/20" },
    "Public": { color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20", glow: "from-emerald-500/20" },
    "Industrial": { color: "text-amber-600", bg: "bg-amber-600/10", border: "border-amber-600/20", glow: "from-amber-600/20" },
    "Specialized": { color: "text-indigo-500", bg: "bg-indigo-500/10", border: "border-indigo-500/20", glow: "from-indigo-500/20" },
};

export default function LearnPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredTopics = useMemo(() => {
    return topics.filter(topic => {
      const matchesSearch = topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           topic.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === "All" || topic.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-20 px-2 sm:px-0 text-left">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-primary/5 pb-8">
        <div className="space-y-1 text-left">
            <h1 className="text-3xl sm:text-4xl font-black font-headline tracking-tighter">Learning <span className="text-primary italic">Center</span></h1>
            <p className="text-sm text-muted-foreground font-medium">Access detailed guides on 60+ Indian law topics.</p>
        </div>
        <Button variant="ghost" size="sm" className="rounded-xl font-bold hover:bg-primary/5 group h-10 px-6 border border-primary/5 text-primary text-[10px] uppercase tracking-widest" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" /> Back to Home
          </Link>
        </Button>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between border-b border-primary/5 pb-8">
        <div className="relative group max-w-xl w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
            placeholder="Search topics, sections, or laws..." 
            className="pl-12 h-14 glass rounded-[1.2rem] font-bold text-base shadow-xl border-primary/5 focus:border-primary transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>
        <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
                <Button 
                    key={cat} 
                    variant={activeCategory === cat ? "default" : "outline"} 
                    onClick={() => setActiveCategory(cat)}
                    className={cn(
                        "h-9 px-4 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all",
                        activeCategory === cat ? "shadow-lg shadow-primary/20" : "border-primary/5 hover:border-primary/20"
                    )}
                >
                    {cat}
                </Button>
            ))}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
            {filteredTopics.map((topic, index) => {
                const style = categoryStyles[topic.category] || { color: "text-primary", bg: "bg-primary/10", border: "border-primary/20", glow: "from-primary/20" };
                return (
                    <motion.div
                        key={topic.slug}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: index * 0.01, duration: 0.4 }}
                        className="group"
                    >
                        <Card className={cn(
                            "h-full flex flex-col glass relative overflow-hidden transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:-translate-y-1 rounded-[2.5rem] border-primary/5",
                            "group-hover:border-primary/30"
                        )}>
                            <div className={cn(
                                "absolute inset-0 bg-gradient-to-br via-transparent to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-700",
                                style.glow
                            )} />
                            
                            <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.15] transition-all duration-700 group-hover:scale-125">
                                <topic.icon className={cn("h-32 w-32", style.color)} />
                            </div>

                            <CardContent className="p-8 flex flex-col flex-grow relative z-10 text-left">
                                <div className="flex items-center justify-between mb-6">
                                    <div className={cn(
                                        "p-4 rounded-2xl transition-transform duration-500 group-hover:scale-110 shadow-lg",
                                        style.bg, style.color
                                    )}>
                                        <topic.icon className="h-7 w-7" />
                                    </div>
                                    <Badge variant="secondary" className={cn(
                                        "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border",
                                        style.bg, style.color, style.border
                                    )}>
                                        {topic.category}
                                    </Badge>
                                </div>
                                
                                <div className="space-y-3 flex-grow">
                                    <h3 className="text-xl sm:text-2xl font-black font-headline tracking-tighter group-hover:text-primary transition-colors leading-tight line-clamp-2">
                                        {topic.title}
                                    </h3>
                                    <p className="text-muted-foreground text-[11px] font-medium leading-relaxed line-clamp-3">
                                        {topic.description}
                                    </p>
                                </div>
                                
                                <div className="pt-8 mt-6 border-t border-primary/5 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Bookmark className="h-3.5 w-3.5 text-muted-foreground opacity-20 group-hover:opacity-100 transition-opacity cursor-pointer hover:text-primary" />
                                    </div>
                                    <Button asChild variant="ghost" className={cn(
                                        "h-10 px-5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 group-hover:text-white",
                                        "hover:shadow-xl",
                                        activeCategory === "All" ? "group-hover:bg-primary group-hover:shadow-primary/20" : `group-hover:${style.bg.replace('/10', '')} group-hover:shadow-current/20`
                                    )}>
                                        <Link href={`/dashboard/learn/${topic.slug}`}>
                                            <span>Read Guide</span>
                                            <ArrowRight className="ml-2 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                            
                            <div className={cn("h-1 w-0 group-hover:w-full transition-all duration-700 bg-gradient-to-r", style.glow.replace('from-', 'from-').replace('/20', ''), "to-transparent")} />
                        </Card>
                    </motion.div>
                );
            })}
        </AnimatePresence>
      </div>

      {filteredTopics.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-32 text-center opacity-40 flex flex-col items-center gap-6">
          <div className="p-8 rounded-[2.5rem] bg-muted/50 border-2 border-dashed border-primary/10">
            <Search className="h-16 w-16 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <p className="font-black text-2xl tracking-tighter uppercase">No Results</p>
            <p className="text-xs text-muted-foreground font-medium italic">Try another topic.</p>
          </div>
        </motion.div>
      )}

      <div className="pt-16 border-t border-primary/5 flex flex-col sm:flex-row items-center justify-between gap-8 opacity-30 text-center sm:text-left">
        <div className="flex flex-wrap justify-center gap-8">
            <div className="flex items-center gap-4 group">
                <div className="p-3 rounded-2xl bg-primary/5 text-primary group-hover:scale-110 transition-transform">
                    <ShieldCheck className="h-5 w-5" />
                </div>
                <div className="text-left">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Accurate Info</p>
                    <p className="text-[9px] font-bold text-muted-foreground opacity-60">Verified resources.</p>
                </div>
            </div>
            <div className="flex items-center gap-4 group">
                <div className="p-3 rounded-2xl bg-blue-500/5 text-blue-500 group-hover:scale-110 transition-transform">
                    <Layers className="h-5 w-5" />
                </div>
                <div className="text-left">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">Wide Range</p>
                    <p className="text-[9px] font-bold text-muted-foreground opacity-60">60+ Topics covered.</p>
                </div>
            </div>
            <div className="flex items-center gap-4 group">
                <div className="p-3 rounded-2xl bg-emerald-500/5 text-emerald-500 group-hover:scale-110 transition-transform">
                    <Globe className="h-5 w-5" />
                </div>
                <div className="text-left">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500">Open Access</p>
                    <p className="text-[9px] font-bold text-muted-foreground opacity-60">Available for all.</p>
                </div>
            </div>
        </div>
        <p className="text-[9px] font-black uppercase tracking-[0.5em] text-muted-foreground/40 shrink-0">NYAYASAHAYAK.IN</p>
      </div>
    </div>
  );
}
