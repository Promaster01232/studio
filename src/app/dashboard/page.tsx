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
import { motion, useInView, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const NeuralRain = () => {
  return (
    <div className="neural-rain opacity-20">
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="rain-drop"
          style={{
            left: `${Math.random() * 100}%`,
            animationDuration: `${Math.random() * 2 + 1}s`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}
    </div>
  );
};

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
      description: "Neural case assessment and probability auditing.",
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    {
      href: "/dashboard/document-intelligence",
      icon: FileSearch,
      title: "Doc Intelligence",
      description: "Forensic risk auditor for statutory compliance.",
      color: "text-emerald-500",
      bg: "bg-emerald-500/10"
    },
    {
      href: "/dashboard/document-generator",
      icon: FileText,
      title: "Doc Generator",
      description: "Automated legal drafting for formal petitions.",
      color: "text-amber-500",
      bg: "bg-amber-500/10"
    },
    {
      href: "/dashboard/bond-generator",
      icon: FileSignature,
      title: "Bond Generator",
      description: "Structural bond creation and affidavit drafting.",
      color: "text-purple-500",
      bg: "bg-purple-500/10"
    },
];

const SectionTitle = ({children}: {children: React.ReactNode}) => (
    <div className="flex items-center gap-3 mb-6">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/10 to-transparent"></div>
        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">{children}</h2>
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
        timeoutId = setTimeout(() => setText(fullText.slice(0, text.length + 1)), 150);
      } else {
        timeoutId = setTimeout(() => setIsTyping(false), 3000);
      }
    } else {
      timeoutId = setTimeout(() => {
        setText('');
        setIsTyping(true);
      }, 1000);
    }
    return () => clearTimeout(timeoutId);
  }, [text, isTyping]);

  return (
    <div className="flex flex-col h-full space-y-12 pb-20 max-w-7xl mx-auto px-2 sm:px-0 text-left">
        <MotionWrapper>
          <div className="relative p-8 sm:p-16 rounded-[2.5rem] overflow-hidden bg-primary/5 border border-primary/10 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
              <NeuralRain />
              <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                  <Landmark className="h-64 w-64" />
              </div>
              <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-2 text-primary">
                      <Sparkles className="h-4 w-4 animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-[0.3em]">Neural Terminal Active</span>
                  </div>
                  <h1 className="text-4xl sm:text-7xl font-black font-headline tracking-tighter leading-none text-foreground">
                      Welcome to <br />
                      <span className="bg-gradient-to-r from-primary via-accent to-blue-400 bg-clip-text text-transparent animate-animated-gradient bg-[200%_auto] italic">{text}</span>
                      <span className="animate-pulse ml-1 text-primary">|</span>
                  </h1>
                  <p className="text-sm sm:text-xl text-muted-foreground font-medium max-w-2xl leading-relaxed">
                      Access high-fidelity legal intelligence and forensic tools designed for the modern Indian judicial landscape. Our ecosystem empowers you with mathematically precise statutory audits and procedural navigation roadmaps on nyayasahayak.in.
                  </p>
                  <div className="flex flex-wrap gap-4 pt-4">
                      <Button size="lg" className="rounded-2xl font-black uppercase tracking-widest text-xs px-8 h-14 shadow-2xl shadow-primary/20 active:scale-95 transition-all" asChild>
                          <Link href="/dashboard/narrate">Initialize Narration</Link>
                      </Button>
                      <Button variant="outline" size="lg" className="rounded-2xl font-black uppercase tracking-widest text-xs px-8 h-14 border-primary/10 glass hover:bg-primary/5 active:scale-95 transition-all" asChild>
                          <Link href="/dashboard/support">Institutional Support</Link>
                      </Button>
                  </div>
              </div>
          </div>
        </MotionWrapper>

        <div className="space-y-16">
          <section>
              <MotionWrapper delay={0.1}>
                <SectionTitle>Primary Forensic Audit Nodes</SectionTitle>
              </MotionWrapper>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <MotionWrapper delay={0.2}>
                    <Link href="/dashboard/narrate" className="block group">
                        <Card className="h-full glass hover:border-primary/30 transition-all duration-500 overflow-hidden relative group rounded-[2.5rem] shadow-xl">
                            <CardContent className="p-10 flex items-center gap-8">
                                <div className="p-6 rounded-[1.5rem] bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-500 shadow-inner ring-1 ring-primary/20">
                                    <Mic className="h-10 w-10" />
                                </div>
                                <div className="space-y-2 flex-1">
                                    <h3 className="text-2xl font-black tracking-tight">Narrate Case Problem</h3>
                                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em] opacity-60">Forensic Voice Summary Unit</p>
                                    <p className="text-xs text-muted-foreground font-medium leading-relaxed max-w-xs">Convert natural speech into a structured statutory report with identified IPC/BNSS violations.</p>
                                </div>
                                <ArrowRight className="h-6 w-6 text-primary opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-500" />
                            </CardContent>
                        </Card>
                    </Link>
                  </MotionWrapper>
                  <MotionWrapper delay={0.3}>
                    <Link href="/dashboard/document-intelligence" className="block group">
                        <Card className="h-full glass hover:border-emerald-500/30 transition-all duration-500 overflow-hidden relative group rounded-[2.5rem] shadow-xl">
                            <CardContent className="p-10 flex items-center gap-8">
                                <div className="p-6 rounded-[1.5rem] bg-emerald-500/10 text-emerald-600 group-hover:scale-110 transition-transform duration-500 shadow-inner ring-1 ring-emerald-500/20">
                                    <FileSearch className="h-10 w-10" />
                                </div>
                                <div className="space-y-2 flex-1">
                                    <h3 className="text-2xl font-black tracking-tight">Document Intelligence</h3>
                                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em] opacity-60">Neural Risk Assessment Node</p>
                                    <p className="text-xs text-muted-foreground font-medium leading-relaxed max-w-xs">Perform a deep-layer forensic audit of legal contracts to detect hidden liabilities and deadlines.</p>
                                </div>
                                <ArrowRight className="h-6 w-6 text-emerald-600 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-500" />
                            </CardContent>
                        </Card>
                    </Link>
                  </MotionWrapper>
              </div>
          </section>

          <section>
              <MotionWrapper delay={0.4}>
                <SectionTitle>Institutional AI Toolkit</SectionTitle>
              </MotionWrapper>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  {aiFeatures.map((feature, index) => (
                    <MotionWrapper key={feature.href} delay={0.5 + index * 0.1}>
                      <Link href={feature.href} className="block group h-full">
                          <Card className="h-full glass p-8 flex flex-col items-start hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 active:scale-[0.97] rounded-[2rem] border-primary/5">
                              <div className={cn("p-4 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-500 shadow-sm ring-1 ring-white/10", feature.bg, feature.color)}>
                                <feature.icon className="h-6 w-6" />
                              </div>
                              <h3 className="font-black text-lg tracking-tight leading-tight">{feature.title}</h3>
                              <p className="text-[10px] text-muted-foreground mt-3 leading-relaxed font-bold uppercase tracking-widest opacity-60">{feature.description}</p>
                              <div className="mt-6 flex items-center text-[9px] font-black text-primary uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity">
                                Initialize Node <ArrowRight className="ml-2 h-3 w-3" />
                              </div>
                          </Card>
                      </Link>
                    </MotionWrapper>
                  ))}
              </div>
          </section>

          <section>
            <MotionWrapper delay={0.8}>
              <SectionTitle>Platform Infrastructure & Resources</SectionTitle>
            </MotionWrapper>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { href: "/dashboard/learn", icon: Library, title: "Knowledge Hub", desc: "Constitutional and statutory forensic guides." },
                { href: "/dashboard/ngo-legal-aid", icon: HeartHandshake, title: "Legal Aid Node", desc: "Connect with verified pro-bono organizations." },
                { href: "/dashboard/my-cases", icon: Landmark, title: "Case Registry", desc: "Secure synchronization with official eCourts." },
              ].map((item, index) => (
                <MotionWrapper key={item.href} delay={0.9 + index * 0.1}>
                  <Link href={item.href} className="block group">
                    <Card className="glass group-hover:border-primary/30 transition-all duration-500 rounded-[2rem] shadow-lg hover:shadow-2xl border-primary/5">
                      <CardContent className="p-8 text-left">
                        <div className="flex items-center gap-5">
                          <div className="p-4 rounded-2xl bg-muted group-hover:bg-primary/10 group-hover:text-primary transition-colors shadow-inner ring-1 ring-black/5">
                            <item.icon className="h-6 w-6" />
                          </div>
                          <div className="min-w-0 space-y-1">
                            <h3 className="font-black text-base tracking-tight truncate">{item.title}</h3>
                            <p className="text-[10px] text-muted-foreground font-bold truncate uppercase tracking-widest opacity-60">{item.desc}</p>
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

        <MotionWrapper delay={1.2}>
            <div className="pt-12 text-center border-t border-primary/5">
                <p className="text-[9px] font-black uppercase tracking-[0.5em] text-muted-foreground/40 mb-2">Institutional System ID: NS-ALPHA-NODE-001</p>
                <p className="text-[10px] font-bold text-primary/60 italic">"Engineering Dignity through Precise Legal Intelligence."</p>
            </div>
        </MotionWrapper>
    </div>
  );
}
