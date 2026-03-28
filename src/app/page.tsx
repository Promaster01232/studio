
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
  ChevronRight
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
    <div className="tricolor-pulse">
      <div className="tricolor-glow bg-[#FF9933] top-[-10%] left-[10%] opacity-[0.15]"></div>
      <div className="tricolor-glow bg-[#FFFFFF] top-[30%] left-[40%] w-[800px] opacity-[0.05]"></div>
      <div className="tricolor-glow bg-[#128807] bottom-[-10%] right-[10%] opacity-[0.15]"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
          <svg className="ashoka-rotate w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] text-[#000080]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.2">
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
      
      <div className="flex-1 flex flex-col items-center p-4 py-8 sm:py-24 relative">
        <TricolorBackground />
        
        {/* Hero Sector */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-[1400px] relative z-10 text-center space-y-10 sm:space-y-16"
        >
          <div className="space-y-6 sm:space-y-12">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 80, damping: 20 }}
              className="flex justify-center mb-4 sm:mb-12"
            >
              <div className="relative group cursor-pointer">
                <div className="absolute -inset-8 sm:-inset-16 rounded-full bg-gradient-to-tr from-[#FF9933]/30 via-[#000080]/15 to-[#128807]/30 blur-3xl animate-pulse group-hover:scale-125 transition-transform duration-1000"></div>
                <Logo className="h-24 w-24 sm:h-48 sm:w-48 relative z-10 shadow-[0_40px_80px_rgba(0,0,0,0.25)] bg-white border-none p-2 sm:p-4" priority />
              </div>
            </motion.div>

            <div className="flex flex-col items-center gap-4 sm:gap-8 px-2">
              <Badge variant="outline" className="h-8 sm:h-12 px-6 sm:px-10 rounded-full border-primary/20 text-primary bg-primary/5 font-black uppercase tracking-[0.3em] sm:tracking-[0.5em] text-[8px] sm:text-[11px] animate-in fade-in slide-in-from-bottom-2 duration-1000">
                Institutional Terminal // Alpha v4.2
              </Badge>
              <h1 className="text-4xl sm:text-7xl lg:text-[9rem] font-black font-headline tracking-tighter leading-[0.9] sm:leading-[0.85] text-foreground max-w-7xl mx-auto">
                Elite AI for <br/>
                <span className="bg-gradient-to-r from-[#FF9933] via-[#000080] to-[#128807] bg-clip-text text-transparent animate-animated-gradient bg-[200%_auto] italic">
                  Indian Citizens.
                </span>
              </h1>
            </div>

            <p className="text-lg sm:text-2xl lg:text-4xl text-muted-foreground font-medium max-w-4xl mx-auto leading-tight sm:leading-relaxed opacity-80 px-4">
              Precision neural forensics for statutory deconstruction and navigating the complex Indian judicial landscape with India's premier AI legal co-pilot.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center gap-6 sm:gap-10 pt-4 sm:pt-10 px-4">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 w-full sm:w-auto">
              {!loading ? (
                <div className="flex flex-col items-center gap-3 w-full sm:w-auto">
                  <Button 
                    asChild 
                    className="h-20 sm:h-28 w-full sm:w-[400px] px-10 sm:px-20 text-base sm:text-lg font-black uppercase tracking-[0.25em] shadow-[0_25px_60px_rgba(var(--primary),0.35)] rounded-[1.5rem] sm:rounded-[2.5rem] transition-all group overflow-hidden relative"
                  >
                    <Link href="/dashboard">
                      <span className="relative z-10 flex items-center gap-4">
                        <span className="hidden sm:inline">Initialize Dashboard</span>
                        <span className="sm:hidden">Start Hub</span>
                        <ArrowRight className="h-5 w-5 sm:h-8 sm:w-8 transition-transform group-hover:translate-x-3" />
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </Link>
                  </Button>
                  <div className="flex items-center gap-2 text-primary/60 font-black text-[8px] sm:text-[10px] uppercase tracking-widest animate-pulse">
                    <ShieldCheck className="h-3 w-3 sm:h-4 w-4" />
                    <span className="hidden sm:inline">Secure Institutional Access Active</span>
                    <span className="sm:hidden">Secured Node</span>
                  </div>
                </div>
              ) : (
                <div className="h-20 sm:h-28 w-full sm:w-[400px] flex items-center justify-center gap-4 px-10 bg-muted/20 rounded-[1.5rem] sm:rounded-[2.5rem] border border-primary/10">
                  <Loader2 className="h-6 w-6 sm:h-10 sm:w-10 animate-spin text-primary opacity-40" />
                  <span className="text-[10px] sm:text-[14px] font-black uppercase tracking-[0.3em] opacity-40">Syncing Registry...</span>
                </div>
              )}
              
              <div className="flex flex-col items-center gap-3 w-full sm:w-auto">
                <Button variant="ghost" className="h-20 sm:h-28 w-full sm:w-auto px-8 sm:px-16 text-sm sm:text-lg font-black uppercase tracking-widest rounded-[1.5rem] sm:rounded-[2.5rem] border border-primary/10 hover:bg-primary/5 transition-all group" asChild>
                  <Link href="/about" className="flex items-center gap-4">
                    <span className="hidden sm:inline">Explore Mandate</span>
                    <span className="sm:hidden">Explore</span>
                    <ChevronRight className="h-5 w-5 opacity-40 group-hover:opacity-100 transition-all" />
                  </Link>
                </Button>
                <div className="flex items-center gap-2 text-muted-foreground/40 font-black text-[8px] sm:text-[10px] uppercase tracking-widest">
                  <Globe className="h-3 w-3 sm:h-4 w-4" />
                  <span className="hidden sm:inline">Open Network Registry</span>
                  <span className="sm:hidden">Open Registry</span>
                </div>
              </div>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="pt-12 sm:pt-24 flex flex-wrap justify-center gap-8 sm:gap-20 opacity-40 grayscale group-hover:grayscale-0 transition-all duration-1000 px-4"
          >
            {[
              { icon: Activity, label: "BNS Audit", full: "Real-time BNS Audit" },
              { icon: ShieldCheck, label: "Secured", full: "Secured Registry" },
              { icon: Globe, label: "Digital Sync", full: "Digital India Sync" },
              { icon: Zap, label: "Neural Ingress", full: "Neural Ingress" }
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-3 sm:gap-5 group/stat">
                <stat.icon className="h-5 w-5 sm:h-7 sm:w-7 text-primary group-hover/stat:animate-bounce" />
                <span className="text-[9px] sm:text-[13px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em]">
                  <span className="hidden sm:inline">{stat.full}</span>
                  <span className="sm:hidden">{stat.label}</span>
                </span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Mandate Sector (SEO Content) */}
        <div className="w-full max-w-[1200px] mt-32 sm:mt-64 space-y-24 sm:space-y-48 px-4 relative z-10 text-left">
          <section className="grid lg:grid-cols-12 gap-12 sm:gap-24 items-start">
            <div className="lg:col-span-5 space-y-10 sm:space-y-16 lg:sticky lg:top-32">
              <div className="space-y-6 sm:space-y-10">
                <div className="flex items-center gap-4 text-primary mb-2">
                  <Sparkles className="h-5 w-5 sm:h-8 sm:w-8 animate-pulse" />
                  <span className="text-[10px] sm:text-[14px] font-black uppercase tracking-[0.4em]">Statutory Excellence</span>
                </div>
                <h2 className="text-4xl sm:text-7xl font-black font-headline tracking-tighter leading-[0.9] uppercase">
                  Democratizing <br />
                  <span className="text-primary italic">Legal Intelligence.</span>
                </h2>
              </div>
              <p className="text-lg sm:text-2xl text-muted-foreground font-medium leading-relaxed">
                Nyaya Sahayak represents the definitive leap forward in AI-powered legal empowerment for the Indian citizenry. In a landscape where the judicial system is often perceived as a dense thicket of complex statutes, our platform serves as a high-fidelity navigational beacon. We are Bharat's most advanced AI Nyaya Mitra.
              </p>
              <div className="p-8 sm:p-12 rounded-[2rem] sm:rounded-[3rem] bg-primary/5 border border-primary/10 shadow-inner group transition-all hover:bg-primary/10">
                <div className="flex items-center gap-6 sm:gap-8">
                  <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-black shadow-xl">
                    <Command className="h-6 w-6 sm:h-10 sm:w-10 text-primary" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] sm:text-[15px] font-black uppercase tracking-[0.3em] text-primary">Protocol NS-ALPHA-4</span>
                    <span className="text-[9px] sm:text-[12px] font-bold text-muted-foreground uppercase opacity-60">Verified Forensic Clearance</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-12 sm:space-y-24">
              {[
                {
                  icon: BrainCircuit,
                  title: "Forensic Auditor Node",
                  desc: "At the core of the Nyaya Sahayak terminal is the Forensic Case Auditor. This neural engine is specifically trained on the nuances of the Bharatiya Nyaya Sanhita (BNS) and the Bharatiya Sakshya Adhiniyam (BSA). When a citizen narrates their legal problem, our AI performs a deep-layer deconstruction identifying potential statutory violations and mapping relevant sections of the Indian Penal Code and BNS.",
                  href: "/dashboard/narrate",
                  color: "text-primary",
                  bg: "bg-primary/5"
                },
                {
                  icon: FileSearch,
                  title: "Risk Scanner Protocol",
                  desc: "Our Document Risk Scanner provides an institutional-grade audit of legal instruments. Whether it is a legal notice, a contract, or an FIR application, the AI node performs a comprehensive forensic scan to identify non-compliance markers, hidden liabilities, and critical procedural deadlines under current Indian Law.",
                  href: "/dashboard/document-intelligence",
                  color: "text-blue-600",
                  bg: "bg-blue-600/5"
                },
                {
                  icon: Zap,
                  title: "Roadmap Intelligence",
                  desc: "Navigating the Bharatiya Nagarik Suraksha Sanhita (BNSS) requires a step-by-step understanding of judicial cycles. Nyaya Sahayak provides dynamic, personalized roadmaps that guide users through the intricacies of filing complaints, bail procedures, and maintaining proper courtroom decorum in Indian High Courts and District Courts.",
                  href: "/dashboard/police-guide",
                  color: "text-amber-500",
                  bg: "bg-amber-500/5"
                }
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                >
                  <Card className="glass border-primary/10 rounded-[2.5rem] sm:rounded-[3.5rem] overflow-hidden shadow-2xl transition-all hover:border-primary/30 hover:shadow-primary/5 group">
                    <CardContent className="p-8 sm:p-16 space-y-8 sm:space-y-12">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-10 mb-2">
                        <div className={cn("p-4 sm:p-6 rounded-2xl sm:rounded-[2rem] transition-transform group-hover:scale-110 group-hover:rotate-3 duration-500 shadow-2xl shrink-0", feature.bg)}>
                          <feature.icon className={cn("h-8 w-8 sm:h-14 sm:w-14", feature.color)} />
                        </div>
                        <h3 className="text-2xl sm:text-5xl font-black tracking-tight uppercase leading-tight">{feature.title}</h3>
                      </div>
                      <p className="text-base sm:text-2xl text-muted-foreground font-medium leading-relaxed">
                        {feature.desc}
                      </p>
                      <Button variant="ghost" className="p-0 font-black text-[10px] sm:text-[14px] uppercase tracking-[0.2em] text-primary hover:bg-transparent group/btn" asChild>
                        <Link href={feature.href} className="flex items-center gap-3">
                          Initialize Protocol 
                          <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6 transition-transform group-hover/btn:translate-x-3" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>

          {/* External Sector */}
          <section className="space-y-16 sm:space-y-32 pb-16 sm:pb-32">
            <div className="flex flex-col items-center text-center space-y-6 px-4">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 px-6 sm:px-10 py-2 sm:py-4 rounded-full text-[10px] sm:text-[14px] font-black uppercase tracking-[0.3em] sm:tracking-[0.5em]">
                Statutory Connectivity
              </Badge>
              <h2 className="text-3xl sm:text-8xl font-black font-headline tracking-tighter text-foreground leading-none uppercase">Official Resources</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-6 sm:gap-12 max-w-6xl mx-auto px-4">
              {[
                { icon: Globe, label: "eCourts Services India", href: "https://services.ecourts.gov.in/", color: "text-primary", bg: "bg-primary/5" },
                { icon: Scale, label: "National Portal of India", href: "https://www.india.gov.in/", color: "text-blue-600", bg: "bg-blue-600/5" }
              ].map((link, i) => (
                <a key={i} href={link.href} target="_blank" rel="noopener noreferrer" className="group">
                  <Card className="glass p-8 sm:p-16 rounded-[2rem] sm:rounded-[4rem] border-primary/5 hover:border-primary/30 transition-all flex items-center justify-between shadow-2xl active:scale-[0.98] group-hover:shadow-primary/5">
                    <div className="flex items-center gap-6 sm:gap-10">
                      <div className={cn("p-4 sm:p-6 rounded-2xl sm:rounded-3xl transition-all shadow-xl group-hover:scale-110", link.bg, link.color)}>
                        <link.icon className="h-8 w-8 sm:h-12 sm:w-12" />
                      </div>
                      <span className="font-black text-xl sm:text-4xl tracking-tighter leading-none uppercase">{link.label}</span>
                    </div>
                    <ExternalLink className="h-5 w-5 sm:h-8 sm:w-8 opacity-20 group-hover:opacity-100 group-hover:text-primary transition-all" />
                  </Card>
                </a>
              ))}
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}
