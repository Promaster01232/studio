
"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Sparkles, BookMarked, Search, Filter, Bookmark, Landmark, Scale, ShieldCheck, Zap } from "lucide-react";
import { topics } from "./data";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const categories = ["All", "Constitutional", "Criminal", "Civil", "Digital", "Corporate", "Public", "Specialized"];

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
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <PageHeader
          title="Institutional Knowledge Hub"
          description="Access a massive, high-fidelity registry of Indian laws, constitutional rights, and statutory forensic guides."
        />
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between border-b border-primary/5 pb-8">
        <div className="relative group max-w-xl w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
            placeholder="Search Registry IDs, sections, or statutes..." 
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
            {filteredTopics.map((topic, index) => (
            <motion.div
                key={topic.slug}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.02 }}
            >
                <Card className="h-full flex flex-col glass group overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/30 rounded-[2.5rem] border-primary/5 relative">
                <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                    <topic.icon className="h-24 w-24" />
                </div>
                <CardContent className="p-8 flex flex-col flex-grow relative z-10">
                    <div className="flex items-center justify-between mb-6">
                    <div className="bg-primary/10 p-4 rounded-2xl text-primary group-hover:scale-110 transition-transform duration-500 shadow-inner ring-1 ring-primary/20">
                        <topic.icon className="h-7 w-7" />
                    </div>
                    <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/10 px-3 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest">
                        {topic.category || 'Statutory'}
                    </Badge>
                    </div>
                    
                    <div className="space-y-3 flex-grow">
                    <h3 className="text-xl sm:text-2xl font-black font-headline tracking-tighter group-hover:text-primary transition-colors leading-tight min-h-[3rem]">
                        {topic.title}
                    </h3>
                    <p className="text-muted-foreground text-[11px] sm:text-xs font-medium leading-relaxed line-clamp-3">
                        {topic.description}
                    </p>
                    </div>
                    
                    <div className="pt-8 mt-6 border-t border-primary/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Bookmark className="h-3.5 w-3.5 text-muted-foreground opacity-20 group-hover:opacity-100 transition-opacity cursor-pointer hover:text-primary" />
                        <span className="text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">NODE-{topic.slug.toUpperCase().substring(0, 4)}</span>
                    </div>
                    <Button asChild variant="ghost" className="h-10 px-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 group-hover:bg-primary group-hover:text-white shadow-sm">
                        <Link href={`/dashboard/learn/${topic.slug}`}>
                        <span>Initialize Audit</span>
                        <ArrowRight className="ml-2 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </Button>
                    </div>
                </CardContent>
                </Card>
            </motion.div>
            ))}
        </AnimatePresence>
      </div>

      {filteredTopics.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-32 text-center opacity-40 flex flex-col items-center gap-6">
          <div className="p-8 rounded-[2.5rem] bg-muted/50 border-2 border-dashed border-primary/10">
            <Search className="h-16 w-16 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <p className="font-black text-2xl tracking-tighter uppercase">Registry Record Not Found</p>
            <p className="text-xs text-muted-foreground font-medium italic">"No institutional statutes match the current query filter."</p>
          </div>
        </motion.div>
      )}

      <div className="pt-16 border-t border-primary/5 flex flex-col sm:flex-row items-center justify-between gap-6 opacity-60">
        <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-primary/5 text-primary">
                <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="text-left">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Forensic Compliance</p>
                <p className="text-[9px] font-bold text-muted-foreground">All modules are audited for current judicial amendments.</p>
            </div>
        </div>
        <p className="text-[9px] font-black uppercase tracking-[0.5em] text-muted-foreground/40">Knowledge Node // NYAYASAHAYAK.IN</p>
      </div>
    </div>
  );
}
