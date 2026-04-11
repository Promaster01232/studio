
"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { 
  MessageSquare, 
  Mic, 
  FileSearch, 
  FileText, 
  FileSignature, 
  BrainCircuit, 
  Gavel, 
  ShieldCheck, 
  Scale, 
  Zap, 
  FileCheck,
  Activity,
  Globe,
  Sparkles
} from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const features = [
  {
    title: "Ai legal chat",
    desc: "Ask about any act or section. Get an explanation with the relevant law cited instantly.",
    icon: MessageSquare,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    title: "Record voice",
    desc: "Speak your legal problem. Get a word-for-word summary and detailed forensic analysis.",
    icon: Mic,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
  },
  {
    title: "Scan documents",
    desc: "Upload court orders or notices. Ai reads and identifies statutory risks and deadlines.",
    icon: FileSearch,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    title: "Write documents",
    desc: "Draft professional legal notices and complaints in any indian language within seconds.",
    icon: FileText,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
  {
    title: "Create bonds",
    desc: "Generate legally sound bail, personal, and indemnity bonds through guided templates.",
    icon: FileSignature,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    title: "Check chance",
    desc: "Analyze case details to see the statistical probability of a successful outcome.",
    icon: BrainCircuit,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    title: "Court helper",
    desc: "Get prepared questions for witness cross-examination and preparation strategy.",
    icon: Gavel,
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
  },
  {
    title: "Check evidence",
    desc: "Audit your digital and physical evidence for statutory admissibility in courts.",
    icon: ShieldCheck,
    color: "text-rose-500",
    bg: "bg-rose-500/10",
  },
  {
    title: "Law linker",
    desc: "Locate specific bns sections and amendments relevant to your unique situation.",
    icon: Zap,
    color: "text-pink-500",
    bg: "bg-pink-500/10",
  },
  {
    title: "Check contract",
    desc: "Identify unfavorable clauses and verify statutory fairness in any legal deed.",
    icon: FileCheck,
    color: "text-teal-500",
    bg: "bg-teal-500/10",
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 15 }
  },
};

export default function FeaturesPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-32 px-4 sm:px-6 text-left">
      <motion.div 
        initial={{ opacity: 0, y: -10 }} 
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 border-b border-white/10 pb-8"
      >
        <PageHeader
          title="Platform capabilities"
          description="A comprehensive registry of high-fidelity AI tools engineered for the Indian legal ecosystem."
        />
        <Badge variant="outline" className="font-bold text-[9px] uppercase tracking-widest bg-primary/5 text-primary border-primary/10 px-4 py-1.5 rounded-full">Protocol 2025</Badge>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        {features.map((f, i) => (
          <motion.div key={i} variants={itemVariants}>
            <Card className="h-full border-white/5 bg-card/40 backdrop-blur-md hover:border-primary/20 transition-all duration-500 group rounded-[2rem] overflow-hidden relative">
              <div className="absolute top-0 right-0 p-6 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                <f.icon className="h-24 w-24" />
              </div>
              <CardContent className="p-8 space-y-6 text-left relative z-10">
                <div className={cn("p-4 rounded-2xl w-fit transition-transform group-hover:scale-110 duration-500 shadow-xl", f.bg, f.color)}>
                  <f.icon className="h-6 w-6" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-black tracking-tight text-white leading-tight">{f.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                    {f.desc}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="pt-20 text-center opacity-30">
          <p className="text-[9px] font-black uppercase tracking-[0.5em] text-muted-foreground">NYAYASAHAYAK.IN // FORENSIC REGISTRY</p>
      </div>
    </div>
  );
}
