"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useState, useEffect } from "react";
import { 
  ArrowRight, 
  Loader2, 
  ShieldCheck, 
  BrainCircuit,
  FileSearch,
  Zap,
  Globe,
  Scale,
  ExternalLink,
  Activity,
  Sparkles,
  Command,
  ChevronRight,
  TrendingUp,
  Cpu,
  Layers,
  Fingerprint,
  Gavel,
  ShieldAlert,
  Dna
} from "lucide-react";
import { Logo } from "@/components/logo";
import { useAuth } from "@/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { PublicHeader } from "@/components/public-header";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Footer } from "@/components/footer";

const TricolorBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute top-[-5%] left-[-5%] w-[50%] h-[50%] bg-[#FF9933] blur-[120px] opacity-[0.06] animate-pulse"></div>
      <div className="absolute bottom-[-5%] right-[-5%] w-[50%] h-[50%] bg-[#128807] blur-[120px] opacity-[0.06] animate-pulse"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.015]">
          <svg className="ashoka-rotate w-[600px] h-[600px] lg:w-[1000px] lg:h-[1000px] text-[#000080]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.05">
              <circle cx="50" cy="50" r="45" />
              <circle cx="50" cy="50" r="5" fill="currentColor" />
              {Array.from({ length: 24 }).map((_, i) => (
                  <line 
                    key={i} 
                    x1="50" y1="50" 
                    x2={50 + 45 * Math.cos((i * 15 * Math.PI) / 180)} 
                    y2={50 + 45 * Math.sin((i * 15 * Math.PI) / 180)} 
                  />
              ))}
          </svg>
      </div>
    </div>
  );
};

export default function WelcomePage() {
  const auth = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [auth]);

  return (
    <div className="flex flex-col min-h-screen bg-background selection:bg-primary/10 overflow-x-hidden text-left font-body relative">
      <PublicHeader />
      <TricolorBackground />
      
      <main className="flex-1 flex flex-col items-center relative z-10">
        {/* Hero Sector - High Design & Compact */}
        <section className="w-full max-w-[1200px] pt-12 pb-10 sm:pt-16 sm:pb-12 lg:pt-20 lg:pb-16 px-6 text-center space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6"
          >
            <div className="flex justify-center">
              <motion.div 
                whileHover={{ scale: 1.02, rotate: 1 }}
                className="relative cursor-pointer group"
              >
                <Logo className="h-24 w-24 sm:h-32 sm:w-32 shadow-2xl relative z-10" priority />
              </motion.div>
            </div>

            <div className="space-y-4 max-w-4xl mx-auto">
              <div className="flex justify-center">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/10 bg-primary/5 shadow-sm backdrop-blur-md">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                  <span className="text-[9px] font-black uppercase tracking-[0.4em] text-primary">
                    Institutional Terminal // Alpha v4.2
                  </span>
                </div>
              </div>
              
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black font-headline tracking-tighter leading-[0.95] text-foreground text-center">
                Elite AI Assistant for <br/>
                <span className="bg-gradient-to-r from-[#FF9933] via-[#000080] to-[#128807] bg-clip-text text-transparent animate-animated-gradient bg-[200%_auto] italic">
                  Indian Citizens.
                </span>
              </h1>

              <p className="text-sm sm:text-lg text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed opacity-80 px-4">
                Precision neural forensics for statutory deconstruction and navigating the complex Indian judicial landscape with absolute institutional clarity.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              {!loading ? (
                <div className="flex flex-col items-center gap-3 w-full sm:w-auto">
                  <Button 
                    asChild 
                    className="h-14 w-full sm:w-auto min-w-[240px] px-8 text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl rounded-xl transition-all group overflow-hidden relative"
                  >
                    <Link href="/dashboard">
                      <span className="relative z-10 flex items-center gap-3">
                        <span className="hidden sm:inline">Initialize Dashboard</span>
                        <span className="sm:hidden">Start Hub</span>
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-2" />
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </Link>
                  </Button>
                  <p className="flex items-center gap-1.5 text-primary/50 font-black text-[8px] uppercase tracking-[0.25em]">
                    <ShieldCheck className="h-3 w-3" />
                    Secure Institutional Access Active
                  </p>
                </div>
              ) : (
                <div className="h-14 w-[240px] flex items-center justify-center gap-3 px-8 bg-muted/10 rounded-xl border border-primary/5">
                  <Loader2 className="h-4 w-4 animate-spin text-primary opacity-30" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30">Synchronizing...</span>
                </div>
              )}
            </div>
          </motion.div>
        </section>

        {/* Feature Documentation Sector - High Labeling */}
        <section className="w-full max-w-[1200px] py-16 px-6">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-4 text-left">
                <div className="flex items-center gap-2 text-primary">
                  <Dna className="h-5 w-5" />
                  <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.4em]">Forensic Mandate</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-black font-headline tracking-tighter leading-[1] uppercase">
                  Statutory <br />
                  <span className="text-primary italic font-black">Intelligence.</span>
                </h2>
                <p className="text-sm sm:text-lg text-muted-foreground font-medium leading-relaxed opacity-80">
                  Nyaya Sahayak represents the definitive leap forward in AI-powered legal empowerment for the Indian citizenry. We have engineered this ecosystem to bridge the gap between statutory complexity and fundamental rights.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Card className="glass border-primary/5 p-5 rounded-2xl shadow-sm">
                  <p className="text-2xl font-black tracking-tight text-primary">1.4B+</p>
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Citizen Reach</p>
                </Card>
                <Card className="glass border-primary/5 p-5 rounded-2xl shadow-sm">
                  <p className="text-2xl font-black tracking-tight text-blue-600">99.8%</p>
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Audit Precision</p>
                </Card>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              {[
                {
                  icon: BrainCircuit,
                  title: "Forensic Case Auditor Node",
                  desc: "Neural engine specifically trained on the nuances of the Bharatiya Nyaya Sanhita (BNS) and the Bharatiya Sakshya Adhiniyam (BSA). It performs deep-layer deconstruction of legal narratives, mapping relevant sections and generating professional statutory dossiers for immediate law enforcement engagement.",
                  href: "/dashboard/narrate",
                  color: "text-primary",
                  bg: "bg-primary/5",
                  sector: "Sector: Forensic"
                },
                {
                  icon: FileSearch,
                  title: "Document Risk Scanner Protocol",
                  desc: "Institutional-grade audit system for legal instruments. Performs a comprehensive forensic scan of notices, contracts, and FIR applications to identify non-compliance markers, hidden liabilities, and critical procedural deadlines under a zero-trust architecture.",
                  href: "/dashboard/document-intelligence",
                  color: "text-blue-600",
                  bg: "bg-blue-600/5",
                  sector: "Sector: Statutory"
                },
                {
                  icon: Gavel,
                  title: "Procedural Roadmap Intelligence",
                  desc: "Dynamic navigational roadmaps for the Bharatiya Nagarik Suraksha Sanhita (BNSS). Provides step-by-step guidance through judicial cycles, including writ jurisdiction under Articles 32 and 226, ensuring technology serves as a bridge to justice.",
                  href: "/dashboard/police-guide",
                  color: "text-[#128807]",
                  bg: "bg-[#128807]/5",
                  sector: "Sector: Procedural"
                }
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="glass border-primary/10 hover:border-primary/30 rounded-[2.5rem] overflow-hidden shadow-xl transition-all duration-500 group active:scale-[0.99] text-left">
                    <CardContent className="p-8 sm:p-10">
                      <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
                        <div className={cn("p-5 rounded-2xl transition-all group-hover:scale-110 duration-500 shadow-lg shrink-0 h-fit w-fit", feature.bg)}>
                          <feature.icon className={cn("h-6 w-6 sm:h-8 sm:w-8", feature.color)} />
                        </div>
                        <div className="flex-1 space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-xl sm:text-2xl font-black tracking-tighter uppercase leading-none">{feature.title}</h3>
                            <span className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-widest hidden sm:block">{feature.sector}</span>
                          </div>
                          <p className="text-sm text-muted-foreground font-medium leading-relaxed opacity-90">
                            {feature.desc}
                          </p>
                          <div className="pt-4 flex items-center justify-between border-t border-primary/5">
                            <Button variant="ghost" className="p-0 h-auto font-black text-[10px] uppercase tracking-[0.2em] text-primary hover:bg-transparent group/btn" asChild>
                              <Link href={feature.href} className="flex items-center gap-2">
                                Initialize Protocol
                                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-2" />
                              </Link>
                            </Button>
                            <div className="flex items-center gap-2">
                                <div className="h-1 w-1 rounded-full bg-primary animate-pulse" />
                                <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Active Node</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Global Registry Sector - Unified Style */}
        <section className="w-full max-w-[1000px] py-16 px-6 text-center space-y-12">
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-3 text-primary mb-2">
                <Globe className="h-5 w-5" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">External Ingress</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black font-headline tracking-tighter text-foreground leading-none uppercase">Official Registry</h2>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-6 lg:gap-10">
            {[
              { icon: Globe, label: "eCourts Services", sub: "Live Judicial Registry", href: "https://services.ecourts.gov.in/", color: "text-primary", bg: "bg-primary/5" },
              { icon: Scale, label: "National Portal", sub: "Statutory Access Node", href: "https://www.india.gov.in/", color: "text-blue-600", bg: "bg-blue-600/5" }
            ].map((link, i) => (
              <a key={i} href={link.href} target="_blank" rel="noopener noreferrer" className="group">
                <Card className="glass p-8 sm:p-12 rounded-[2.5rem] border-primary/10 hover:border-primary/40 transition-all duration-500 flex flex-col items-center justify-center gap-6 shadow-2xl relative overflow-hidden active:scale-[0.98]">
                  <div className="p-5 rounded-2xl transition-all duration-500 shadow-xl group-hover:scale-110 group-hover:-rotate-2 bg-muted/30">
                    <link.icon className={cn("h-8 w-8 sm:h-10 sm:w-10", link.color)} />
                  </div>
                  <div className="space-y-2 relative z-10">
                    <span className="font-black text-2xl sm:text-3xl tracking-tighter leading-none uppercase block">{link.label}</span>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em] block opacity-50">{link.sub}</span>
                  </div>
                  <ExternalLink className="h-4 w-4 opacity-20 group-hover:opacity-100 group-hover:text-primary transition-all duration-500 absolute top-8 right-8" />
                </Card>
              </a>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
