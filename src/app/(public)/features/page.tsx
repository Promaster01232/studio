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
  Sparkles,
  Shield,
  BookMarked,
  Clock,
  ChevronRight,
  ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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

const trustBadges = [
  { label: "Built for indian law", icon: Scale },
  { label: "Updated with latest acts", icon: BookMarked },
  { label: "No legal advice. information only.", icon: Shield },
  { label: "Available 24/7", icon: Clock },
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
    <div className="max-w-7xl mx-auto space-y-24 pb-32 px-4 sm:px-6 text-left">
      <motion.div 
        initial={{ opacity: 0, y: -10 }} 
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 border-b border-white/5 pb-12"
      >
        <div className="space-y-4">
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 px-4 py-1 rounded-full text-[10px] font-bold">
                Protocol 2025
            </Badge>
            <PageHeader
              title="Platform capabilities"
              description="A comprehensive registry of high-fidelity AI tools engineered for the Indian legal ecosystem."
            />
        </div>
        <Button size="lg" className="rounded-2xl font-bold text-xs h-14 px-10 shadow-2xl shadow-primary/20 active:scale-95 transition-all" asChild>
            <Link href="/register">Initialize access <ArrowRight className="ml-2 h-4 w-4" /></Link>
        </Button>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {features.map((f, i) => (
          <motion.div key={i} variants={itemVariants}>
            <Card className="h-full border-white/5 bg-[#161b22] hover:border-primary/20 transition-all duration-500 group rounded-[2.5rem] overflow-hidden relative shadow-2xl">
              <div className="absolute top-0 right-0 p-6 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                <f.icon className="h-32 w-32" />
              </div>
              <CardContent className="p-10 space-y-8 text-left relative z-10">
                <div className={cn("p-4 rounded-2xl w-fit transition-transform group-hover:scale-110 duration-500 shadow-xl border border-white/5", f.bg, f.color)}>
                  <f.icon className="h-7 w-7" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-black tracking-tight text-white leading-tight">{f.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-400 leading-relaxed font-medium">
                    {f.desc}
                  </p>
                </div>
                <div className="pt-4">
                    <div className="h-px w-full bg-white/5 mb-6" />
                    <Link href="/login" className="flex items-center gap-2 text-[10px] font-bold text-primary/40 group-hover:text-primary transition-colors">
                        Login <ChevronRight className="h-3 w-3" />
                    </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <section className="py-20 border-t border-white/5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {trustBadges.map((badge, idx) => (
                <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center gap-6 text-center group"
                >
                    <div className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-primary shadow-xl transition-all duration-500 group-hover:scale-110 group-hover:bg-primary/5 group-hover:border-primary/20">
                        <badge.icon className="h-5 w-5" />
                    </div>
                    <p className="text-[11px] font-bold text-gray-400 max-w-[140px] leading-relaxed transition-colors group-hover:text-white">
                        {badge.label}
                    </p>
                </motion.div>
            ))}
        </div>
      </section>
    </div>
  );
}
