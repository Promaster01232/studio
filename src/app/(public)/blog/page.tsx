
"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Newspaper, Calendar, ArrowRight, Sparkles, Zap, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const posts = [
  {
    title: "Understanding the Bharatiya Nyaya Sanhita (BNS) 2023",
    excerpt: "A forensic breakdown of the major shifts from the IPC 1860 to the new BNS framework and how it affects the citizen.",
    date: "June 15, 2025",
    category: "Statutory Law",
    icon: Newspaper,
    color: "text-blue-500",
    bg: "bg-blue-500/10"
  },
  {
    title: "The role of AI in procedural justice",
    excerpt: "How neural forensic engines are democratizing legal information and providing personalized roadmaps for 1.4 billion people.",
    date: "June 10, 2025",
    category: "Legal Tech",
    icon: Sparkles,
    color: "text-amber-500",
    bg: "bg-amber-500/10"
  },
  {
    title: "Data privacy under the DPDP Act 2023",
    excerpt: "Protecting citizen data sovereignty in the digital age: a guide to your new statutory rights in Bharat.",
    date: "June 02, 2025",
    category: "Privacy",
    icon: ShieldCheck,
    color: "text-green-500",
    bg: "bg-green-500/10"
  }
];

export default function BlogPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-32 px-4 sm:px-6 text-left">
      <motion.div 
        initial={{ opacity: 0, y: -10 }} 
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 border-b border-white/10 pb-8"
      >
        <PageHeader
          title="Institutional blog"
          description="Statutory news, legal awareness updates, and the latest amendments in the Indian judicial system."
        />
        <Badge variant="outline" className="font-bold text-[9px] uppercase tracking-widest bg-primary/5 text-primary border-primary/10 px-4 py-1.5 rounded-full">Legal News</Badge>
      </motion.div>

      <div className="grid gap-8">
        {posts.map((post, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="border-white/5 bg-card/40 backdrop-blur-md rounded-[2.5rem] overflow-hidden hover:border-primary/20 transition-all group">
              <div className="grid md:grid-cols-4 gap-0 h-full">
                <div className={cn("p-10 flex items-center justify-center md:border-r border-white/5", post.bg)}>
                  <post.icon className={cn("h-16 w-16", post.color)} />
                </div>
                <div className="md:col-span-3 p-10 space-y-6 flex flex-col justify-center">
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className="text-[8px] font-black uppercase border-white/10">{post.category}</Badge>
                    <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-2">
                      <Calendar className="h-3 w-3" /> {post.date}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black tracking-tighter text-white group-hover:text-primary transition-colors leading-tight">{post.title}</h3>
                    <p className="text-sm text-muted-foreground font-medium leading-relaxed max-w-2xl">{post.excerpt}</p>
                  </div>
                  <Button variant="ghost" className="w-fit p-0 h-auto hover:bg-transparent font-black text-[10px] uppercase tracking-widest text-primary gap-2">
                    <span>Read full report</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="text-center pt-8 opacity-30">
          <p className="text-[9px] font-black uppercase tracking-[0.5em] text-muted-foreground">NYAYASAHAYAK.IN // TRANSMISSION HUB</p>
      </div>
    </div>
  );
}
