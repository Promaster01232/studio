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
  Fingerprint
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
      <div className="absolute top-[-10%] left-[-5%] w-[60%] h-[60%] bg-[#FF9933] blur-[150px] opacity-[0.08] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[60%] h-[60%] bg-[#128807] blur-[150px] opacity-[0.08] animate-pulse"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02]">
          <svg className="ashoka-rotate w-[800px] h-[800px] lg:w-[1200px] lg:h-[1200px] text-[#000080]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.1">
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
        {/* Hero Sector - Architectural Design */}
        <section className="w-full max-w-[1400px] pt-16 pb-24 sm:py-32 lg:py-48 px-6 text-center space-y-12 sm:space-y-20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-10 sm:space-y-16"
          >
            <div className="flex justify-center">
              <motion.div 
                whileHover={{ scale: 1.05, rotate: 2 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className="relative cursor-pointer group"
              >
                <div className="absolute -inset-12 rounded-full bg-gradient-to-tr from-[#FF9933]/20 via-transparent to-[#128807]/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                <Logo className="h-32 w-32 sm:h-48 sm:w-48 shadow-[0_40px_100px_rgba(0,0,0,0.1)] relative z-10" priority />
              </motion.div>
            </div>

            <div className="space-y-8 max-w-6xl mx-auto">
              <div className="flex justify-center">
                <Badge variant="outline" className="h-10 px-8 rounded-full border-primary/20 text-primary bg-primary/5 font-black uppercase tracking-[0.4em] text-[9px] sm:text-[11px] shadow-sm">
                  Institutional Terminal // NS-NODE-ALPHA
                </Badge>
              </div>
              
              <h1 className="text-5xl sm:text-8xl lg:text-[8.5rem] font-black font-headline tracking-tighter leading-[0.85] text-foreground">
                Elite AI for <br/>
                <span className="bg-gradient-to-r from-[#FF9933] via-[#000080] to-[#128807] bg-clip-text text-transparent animate-animated-gradient bg-[200%_auto] italic">
                  Indian Citizens.
                </span>
              </h1>

              <p className="text-lg sm:text-2xl lg:text-3xl text-muted-foreground font-medium max-w-4xl mx-auto leading-relaxed opacity-80 px-4">
                Precision neural forensics for statutory deconstruction and navigating the complex Indian judicial landscape with India's premier AI legal co-pilot.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
              {!loading ? (
                <div className="flex flex-col items-center gap-4 w-full sm:w-auto">
                  <Button 
                    asChild 
                    className="h-16 sm:h-20 w-full sm:w-auto min-w-[280px] px-12 text-sm sm:text-lg font-black uppercase tracking-[0.2em] shadow-[0_25px_60px_rgba(var(--primary),0.3)] rounded-2xl transition-all group overflow-hidden relative"
                  >
                    <Link href="/dashboard">
                      <span className="relative z-10 flex items-center gap-4">
                        Initialize Dashboard
                        <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 transition-transform group-hover:translate-x-3" />
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </Link>
                  </Button>
                  <p className="flex items-center gap-2 text-primary/60 font-black text-[9px] uppercase tracking-widest animate-pulse">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Secured Institutional Access Active
                  </p>
                </div>
              ) : (
                <div className="h-16 sm:h-20 w-[280px] flex items-center justify-center gap-4 px-12 bg-muted/20 rounded-2xl border border-primary/10">
                  <Loader2 className="h-6 w-6 animate-spin text-primary opacity-40" />
                  <span className="text-[11px] font-black uppercase tracking-[0.3em] opacity-40">Syncing Registry...</span>
                </div>
              )}
              
              <Button variant="ghost" className="h-16 sm:h-20 w-full sm:w-auto px-12 text-sm sm:text-lg font-black uppercase tracking-widest rounded-2xl border border-primary/10 hover:bg-primary/5 transition-all group" asChild>
                <Link href="/about" className="flex items-center gap-4">
                  Explore Mandate
                  <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 opacity-40 group-hover:opacity-100 transition-all" />
                </Link>
              </Button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-16 max-w-5xl mx-auto pt-12 sm:pt-24 border-t border-primary/5"
          >
            {[
              { icon: Activity, label: "BNS Forensic Audit", color: "text-primary" },
              { icon: ShieldCheck, label: "Secured Registry", color: "text-blue-600" },
              { icon: Globe, label: "Digital India Sync", color: "text-[#128807]" },
              { icon: Zap, label: "Neural Ingress", color: "text-amber-500" }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center gap-4 group/stat text-center">
                <div className={cn("p-4 rounded-2xl bg-muted/30 transition-transform group-hover/stat:scale-110", stat.color.replace('text-', 'bg-').replace('600', '10'))}>
                  <stat.icon className={cn("h-6 w-6 sm:h-8 sm:w-8", stat.color)} />
                </div>
                <span className="text-[10px] sm:text-[12px] font-black uppercase tracking-[0.3em] text-muted-foreground group-hover/stat:text-foreground transition-colors leading-tight">
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>
        </section>

        {/* Mandate Sector - Premium Grid */}
        <section className="w-full max-w-[1400px] py-24 sm:py-48 px-6 space-y-24 sm:space-y-48">
          <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-start">
            <div className="lg:col-span-5 space-y-12 lg:sticky lg:top-32">
              <div className="space-y-8 text-left">
                <div className="flex items-center gap-4 text-primary">
                  <Sparkles className="h-8 w-8 animate-pulse" />
                  <span className="text-[12px] sm:text-[15px] font-black uppercase tracking-[0.5em]">Executive Mandate</span>
                </div>
                <h2 className="text-4xl sm:text-7xl font-black font-headline tracking-tighter leading-[0.9] uppercase">
                  Democratizing <br />
                  <span className="text-primary italic">Legal Intelligence.</span>
                </h2>
                <p className="text-lg sm:text-2xl text-muted-foreground font-medium leading-relaxed">
                  Nyaya Sahayak is Bharat's premier AI Nyaya Mitra, specifically engineered to bridge the gap between statutory complexity and the fundamental rights of 1.4 billion citizens through mathematically precise forensic tools.
                </p>
              </div>
              
              <Card className="glass border-primary/10 rounded-[3rem] overflow-hidden shadow-xl p-8 sm:p-12">
                <div className="flex items-center gap-8">
                  <div className="p-6 rounded-3xl bg-primary text-white shadow-2xl">
                    <Command className="h-10 w-10" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[15px] font-black uppercase tracking-[0.3em] text-primary">Protocol NS-ALPH-4</p>
                    <p className="text-[12px] font-bold text-muted-foreground uppercase opacity-60">Verified Forensic Clearance</p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="lg:col-span-7 space-y-12 sm:space-y-20">
              {[
                {
                  icon: BrainCircuit,
                  title: "Forensic Case Auditor",
                  desc: "Deconstruct legal narratives into structured dossiers using neural mapping trained on the Bharatiya Nyaya Sanhita (BNS) and IPC frameworks.",
                  href: "/dashboard/narrate",
                  color: "text-primary",
                  bg: "bg-primary/5"
                },
                {
                  icon: FileSearch,
                  title: "Statutory Risk Scanner",
                  desc: "Perform institutional-grade audits of legal documents to identify non-compliance markers, hidden liabilities, and critical procedural deadlines.",
                  href: "/dashboard/document-intelligence",
                  color: "text-blue-600",
                  bg: "bg-blue-600/5"
                },
                {
                  icon: Zap,
                  title: "Roadmap Intelligence",
                  desc: "Generate dynamic, step-by-step navigational roadmaps for the Bharatiya Nagarik Suraksha Sanhita (BNSS) and judicial cycles.",
                  href: "/dashboard/police-guide",
                  color: "text-amber-500",
                  bg: "bg-amber-500/5"
                },
                {
                  icon: Fingerprint,
                  title: "Identity Authenticator",
                  desc: "Verify professional credentials and identity nodes through multi-stage AI forensic audits for 100% platform accuracy.",
                  href: "/dashboard/profile",
                  color: "text-emerald-600",
                  bg: "bg-emerald-600/5"
                }
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="glass border-primary/5 hover:border-primary/20 rounded-[3rem] sm:rounded-[4rem] overflow-hidden shadow-2xl transition-all duration-500 group">
                    <CardContent className="p-8 sm:p-16 flex flex-col sm:flex-row items-center sm:items-start gap-8 sm:gap-12">
                      <div className={cn("p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] transition-transform group-hover:scale-110 group-hover:rotate-2 duration-500 shadow-xl shrink-0", feature.bg)}>
                        <feature.icon className={cn("h-8 w-8 sm:h-12 sm:w-12", feature.color)} />
                      </div>
                      <div className="flex-1 text-center sm:text-left space-y-6">
                        <h3 className="text-2xl sm:text-4xl font-black tracking-tight uppercase leading-none">{feature.title}</h3>
                        <p className="text-base sm:text-xl text-muted-foreground font-medium leading-relaxed">
                          {feature.desc}
                        </p>
                        <Button variant="ghost" className="p-0 h-auto font-black text-[11px] sm:text-[13px] uppercase tracking-[0.3em] text-primary hover:bg-transparent group/btn" asChild>
                          <Link href={feature.href} className="flex items-center gap-3">
                            Execute Protocol 
                            <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover/btn:translate-x-4" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Official Data Sectors - Professional Trust */}
        <section className="w-full max-w-[1200px] pb-24 sm:pb-48 px-6 text-center space-y-16 sm:space-y-32">
          <div className="space-y-6">
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 px-8 py-3 rounded-full text-[11px] sm:text-[13px] font-black uppercase tracking-[0.4em]">
              Statutory Integration
            </Badge>
            <h2 className="text-4xl sm:text-8xl font-black font-headline tracking-tighter text-foreground leading-none uppercase">Official Resources</h2>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-8 lg:gap-16 max-w-6xl mx-auto">
            {[
              { icon: Globe, label: "eCourts Services", sub: "Live Judicial Registry", href: "https://services.ecourts.gov.in/", color: "text-primary", bg: "bg-primary/5" },
              { icon: Scale, label: "National Portal", sub: "Statutory Access Node", href: "https://www.india.gov.in/", color: "text-blue-600", bg: "bg-blue-600/5" }
            ].map((link, i) => (
              <a key={i} href={link.href} target="_blank" rel="noopener noreferrer" className="group">
                <Card className="glass p-10 sm:p-20 rounded-[3rem] sm:rounded-[5rem] border-primary/5 hover:border-primary/30 transition-all duration-700 flex flex-col items-center justify-center gap-8 shadow-2xl relative overflow-hidden active:scale-[0.98]">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className={cn("p-6 sm:p-8 rounded-[2rem] sm:rounded-[3rem] transition-all duration-700 shadow-xl group-hover:scale-110 group-hover:-rotate-3", link.bg, link.color)}>
                    <link.icon className="h-10 w-10 sm:h-16 sm:w-16" />
                  </div>
                  <div className="space-y-2 relative z-10">
                    <span className="font-black text-2xl sm:text-5xl tracking-tighter leading-none uppercase block">{link.label}</span>
                    <span className="text-[10px] sm:text-[13px] font-bold text-muted-foreground uppercase tracking-[0.3em] block opacity-60">{link.sub}</span>
                  </div>
                  <ExternalLink className="h-6 w-6 sm:h-8 sm:w-8 opacity-20 group-hover:opacity-100 group-hover:text-primary transition-all duration-500 absolute top-12 right-12" />
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
