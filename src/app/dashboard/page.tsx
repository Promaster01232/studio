"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  FileSearch,
  FileText,
  FileSignature,
  BrainCircuit,
  Library,
  HeartHandshake,
  Landmark,
  Gavel,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

const MotionWrapper = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ 
        type: "spring",
        stiffness: 100,
        damping: 20,
        delay 
      }}
    >
      {children}
    </motion.div>
  );
};

const aiFeatures = [
    {
      href: "/dashboard/strength-analyzer",
      icon: BrainCircuit,
      title: "Strength Analyzer",
      description: "Neural case assessment.",
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    {
      href: "/dashboard/document-intelligence",
      icon: FileSearch,
      title: "Doc Intelligence",
      description: "Forensic risk auditor.",
      color: "text-emerald-500",
      bg: "bg-emerald-500/10"
    },
    {
      href: "/dashboard/document-generator",
      icon: FileText,
      title: "Doc Generator",
      description: "Automated legal drafting.",
      color: "text-amber-500",
      bg: "bg-amber-500/10"
    },
    {
      href: "/dashboard/bond-generator",
      icon: FileSignature,
      title: "Bond Generator",
      description: "Structural bond creation.",
      color: "text-purple-500",
      bg: "bg-purple-500/10"
    },
];

const SectionTitle = ({children}: {children: React.ReactNode}) => (
    <div className="flex items-center gap-3 mb-6">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/10 to-transparent"></div>
        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-muted-foreground/60">{children}</h2>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/10 to-transparent"></div>
    </div>
)

export default function DashboardHomePage() {
  const [text, setText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const fullText = 'Nyaya Sahayak';
  
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isTyping) {
      if (text.length < fullText.length) {
        timeoutId = setTimeout(() => setText(fullText.slice(0, text.length + 1)), 80);
      } else {
        timeoutId = setTimeout(() => setIsTyping(false), 2000);
      }
    } else {
      timeoutId = setTimeout(() => {
        setText('');
        setIsTyping(true);
      }, 3000);
    }
    return () => clearTimeout(timeoutId);
  }, [text, isTyping]);

  return (
    <div className="flex flex-col h-full space-y-12 pb-20 max-w-7xl mx-auto px-2 sm:px-0">
        <MotionWrapper>
          <div className="relative p-8 sm:p-12 rounded-[2rem] overflow-hidden bg-primary/5 border border-primary/10">
              <div className="absolute top-0 right-0 p-12 opacity-[0.03]">
                  <Landmark className="h-64 w-64" />
              </div>
              <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-2 text-primary">
                      <Sparkles className="h-4 w-4 animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-[0.3em]">Neural Terminal Active</span>
                  </div>
                  <h1 className="text-4xl sm:text-6xl font-black font-headline tracking-tighter leading-none">
                      Welcome to <br />
                      <span className="bg-gradient-to-r from-primary via-accent to-blue-400 bg-clip-text text-transparent animate-animated-gradient bg-[200%_auto] italic">{text}</span>
                      <span className="animate-pulse ml-1 text-primary">|</span>
                  </h1>
                  <p className="text-sm sm:text-lg text-muted-foreground font-medium max-w-xl">
                      Access high-fidelity legal intelligence and forensic tools designed for the modern judicial landscape.
                  </p>
                  <div className="flex gap-3 pt-4">
                      <Button size="lg" className="rounded-2xl font-bold px-8 shadow-xl shadow-primary/20 active:scale-95 transition-all" asChild>
                          <Link href="/dashboard/narrate">Start Narration</Link>
                      </Button>
                      <Button variant="outline" size="lg" className="rounded-2xl font-bold px-8 border-primary/10 glass hover:bg-primary/5 active:scale-95 transition-all" asChild>
                          <Link href="/dashboard/support">Support Hub</Link>
                      </Button>
                  </div>
              </div>
          </div>
        </MotionWrapper>

        <div className="space-y-16">
          <section>
              <MotionWrapper delay={0.1}>
                <SectionTitle>Primary Audit Nodes</SectionTitle>
              </MotionWrapper>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <MotionWrapper delay={0.2}>
                    <Link href="/dashboard/narrate" className="block group">
                        <Card className="h-full glass hover:border-primary/30 transition-all duration-500 overflow-hidden relative group">
                            <CardContent className="p-8 flex items-center gap-6">
                                <div className="p-4 rounded-2xl bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-500">
                                    <Mic className="h-8 w-8" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-xl font-black tracking-tight">Narrate Case</h3>
                                    <p className="text-xs text-muted-foreground font-medium">Neural transcription and forensic summary generation.</p>
                                </div>
                                <ArrowRight className="ml-auto h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-500" />
                            </CardContent>
                        </Card>
                    </Link>
                  </MotionWrapper>
                  <MotionWrapper delay={0.3}>
                    <Link href="/dashboard/document-intelligence" className="block group">
                        <Card className="h-full glass hover:border-primary/30 transition-all duration-500 overflow-hidden relative group">
                            <CardContent className="p-8 flex items-center gap-6">
                                <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-600 group-hover:scale-110 transition-transform duration-500">
                                    <FileSearch className="h-8 w-8" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-xl font-black tracking-tight">Document Scan</h3>
                                    <p className="text-xs text-muted-foreground font-medium">Automated risk identification and clause analysis.</p>
                                </div>
                                <ArrowRight className="ml-auto h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-500" />
                            </CardContent>
                        </Card>
                    </Link>
                  </MotionWrapper>
              </div>
          </section>

          <section>
              <MotionWrapper delay={0.4}>
                <SectionTitle>Neural AI Toolkit</SectionTitle>
              </MotionWrapper>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {aiFeatures.map((feature, index) => (
                    <MotionWrapper key={feature.href} delay={0.5 + index * 0.1}>
                      <Link href={feature.href} className="block group h-full">
                          <Card className="h-full glass p-6 flex flex-col items-start hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 active:scale-[0.97]">
                              <div className={cn("p-3 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-500", feature.bg, feature.color)}>
                                <feature.icon className="h-5 w-5" />
                              </div>
                              <h3 className="font-black text-sm tracking-tight">{feature.title}</h3>
                              <p className="text-[10px] text-muted-foreground mt-2 leading-relaxed font-medium">{feature.description}</p>
                          </Card>
                      </Link>
                    </MotionWrapper>
                  ))}
              </div>
          </section>

          <section>
            <MotionWrapper delay={0.8}>
              <SectionTitle>Protocol Resources</SectionTitle>
            </MotionWrapper>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { href: "/dashboard/learn", icon: Library, title: "Knowledge Hub", desc: "Constitutional and statutory guides." },
                { href: "/dashboard/ngo-legal-aid", icon: HeartHandshake, title: "Legal Aid Hub", desc: "Connect with verified aid organizations." },
                { href: "/dashboard/my-cases", icon: Landmark, title: "Case Registry", desc: "Secure tracking of personal litigations." },
              ].map((item, index) => (
                <MotionWrapper key={item.href} delay={0.9 + index * 0.1}>
                  <Link href={item.href} className="block group">
                    <Card className="glass group-hover:border-primary/30 transition-all duration-500">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-xl bg-muted group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                            <item.icon className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-bold text-sm tracking-tight">{item.title}</h3>
                            <p className="text-[10px] text-muted-foreground font-medium">{item.desc}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </MotionWrapper>
              ))}
            </div>
          </section>
        </div>
    </div>
  );
}