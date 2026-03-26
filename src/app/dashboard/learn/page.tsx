
"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Sparkles, BookMarked, Search } from "lucide-react";
import { topics } from "./data";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function LearnPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTopics = topics.filter(topic => 
    topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-20">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <PageHeader
          title="Legal Knowledge Hub"
          description="Access a massive institutional registry of Indian laws, constitutional rights, and statutory forensic guides."
        />
      </motion.div>

      <div className="relative group max-w-2xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <Input 
          placeholder="Search for legal modules, sections, or keywords..." 
          className="pl-12 h-14 glass rounded-[1.2rem] font-bold text-base shadow-xl border-primary/5 focus:border-primary transition-all"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredTopics.map((topic, index) => (
          <motion.div
            key={topic.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="h-full flex flex-col glass group overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/30 rounded-[2rem] border-primary/5">
              <CardContent className="p-8 flex flex-col flex-grow text-left">
                <div className="flex items-center justify-between mb-6">
                  <div className="bg-primary/10 p-4 rounded-2xl text-primary group-hover:scale-110 transition-transform duration-500 shadow-inner">
                    <topic.icon className="h-7 w-7" />
                  </div>
                  <div className="flex items-center gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
                    <Sparkles className="h-3 w-3 text-primary animate-pulse" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Premium Node</span>
                  </div>
                </div>
                
                <div className="space-y-3 flex-grow">
                  <h3 className="text-2xl font-black font-headline tracking-tight group-hover:text-primary transition-colors leading-none">
                    {topic.title}
                  </h3>
                  <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                    {topic.description}
                  </p>
                </div>
                
                <div className="pt-8 mt-auto border-t border-primary/5">
                  <Button asChild variant="secondary" className="w-full justify-between h-12 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 group-hover:bg-primary group-hover:text-white shadow-sm">
                    <Link href={`/dashboard/learn/${topic.slug}`}>
                      <span>Initialize Module</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1.5" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredTopics.length === 0 && (
        <div className="py-20 text-center opacity-40 flex flex-col items-center gap-4">
          <Search className="h-16 w-16 text-muted-foreground" />
          <p className="font-black text-xl tracking-tighter">No legal modules found matching your query.</p>
        </div>
      )}

      <div className="pt-12 text-center border-t border-primary/5">
        <p className="text-[9px] font-black uppercase tracking-[0.5em] text-muted-foreground/40 mb-2">Institutional Registry Hub // NYAYASAHAYAK.IN</p>
        <p className="text-[10px] font-bold text-primary/60 italic">"Empowering 1.4 Billion Citizens through Forensic Knowledge."</p>
      </div>
    </div>
  );
}
