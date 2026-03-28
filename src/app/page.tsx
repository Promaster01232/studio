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
        {/* Hero Sector - Compact High-Design */}
        <section className="w-full max-w-[1200px] pt-10 pb-12 sm:pt-16 sm:pb-20 lg:pt-20 lg:pb-24 px-6 text-center space-y-6 sm:space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6 sm:space-y-8"
          >
            <div className="flex justify-center">
              <motion.div 
                whileHover={{ scale: 1.02, rotate: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="relative cursor-pointer group"
              >
                <div className="absolute -inset-6 rounded-full bg-gradient-to-tr from-primary/10 via-transparent to-accent/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <Logo className="h-20 w-20 sm:h-28 sm:w-28 shadow-[0_20px_60px_rgba(0,0,0,0.1)] relative z-10" priority />
              </motion.div>
            </div>

            <div className="space-y-4 max-w-4xl mx-auto">
              <div className="flex justify-center">
                <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-primary/10 bg-primary/5 shadow-sm backdrop-blur-sm">
                  <div className="h-1 w-1 rounded-full bg-primary animate-pulse" />
                  <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.4em] text-primary">
                    Institutional Node NS-ALPHA v4.2
                  </span>
                </div>
              </div>
              
              <h1 className="text-3xl sm:text-6xl lg:text-7xl font-black font-headline tracking-tighter leading-[0.9] text-foreground text-center">
                Elite AI for <br/>
                <span className="bg-gradient-to-r from-[#FF9933] via-[#000080] to-[#128807] bg-clip-text text-transparent animate-animated-gradient bg-[200%_auto] italic">
                  Indian Citizens.
                </span>
              </h1>

              <p className="text-sm sm:text-lg lg:text-xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed opacity-80 px-4">
                Precision neural forensics for statutory deconstruction and navigating Bharat's judicial landscape with absolute institutional clarity.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              {!loading ? (
                <div className="flex flex-col items-center gap-2.5 w-full sm:w-auto">
                  <Button 
                    asChild 
                    className="h-12 sm:h-14 w-full sm:w-auto min-w-[220px] px-8 text-[11px] sm:text-xs font-black uppercase tracking-[0.2em] shadow-[0_15px_40px_rgba(var(--primary),0.2)] rounded-xl transition-all group overflow-hidden relative"
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
                  <p className="flex items-center gap-1.5 text-primary/50 font-black text-[7px] uppercase tracking-[0.2em]">
                    <ShieldCheck className="h-2.5 w-2.5" />
                    Secure Institutional Access Active
                  </p>
                </div>
              ) : (
                <div className="h-12 sm:h-14 w-[220px] flex items-center justify-center gap-3 px-8 bg-muted/10 rounded-xl border border-primary/5">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-primary opacity-30" />
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-30">Syncing...</span>
                </div>
              )}
              
              <Button variant="ghost" className="h-12 sm:h-14 w-full sm:w-auto px-8 text-[11px] sm:text-xs font-black uppercase tracking-widest rounded-xl border border-primary/10 hover:bg-primary/5 transition-all group" asChild>
                <Link href="/about" className="flex items-center gap-3">
                  Our Mandate
                  <ChevronRight className="h-4 w-4 opacity-30 group-hover:opacity-100 transition-all" />
                </Link>
              </Button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-8 max-w-3xl mx-auto pt-8 border-t border-primary/5"
          >
            {[
              { icon: Activity, label: "Forensic Audit", color: "text-primary" },
              { icon: ShieldCheck, label: "Secured Nodes", color: "text-blue-600" },
              { icon: Globe, label: "Digital Sync", color: "text-[#128807]" },
              { icon: Zap, label: "Neural Ingress", color: "text-amber-500" }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center gap-2 group/stat text-center">
                <div className={cn("p-2.5 rounded-lg bg-muted/20 transition-all group-hover/stat:bg-white dark:group-hover/stat:bg-zinc-900 group-hover/stat:shadow-md", stat.color.replace('text-', 'bg-').replace('600', '10'))}>
                  <stat.icon className={cn("h-4 w-4 sm:h-5 sm:w-5", stat.color)} />
                </div>
                <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 group-hover/stat:text-foreground transition-colors leading-tight">
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>
        </section>

        {/* Mandate Sector - Professional Precision */}
        <section className="w-full max-w-[1200px] py-12 sm:py-16 lg:py-20 px-6 space-y-12">
          <div className="grid lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
              <div className="space-y-4 text-left">
                <div className="flex items-center gap-2 text-primary">
                  <Sparkles className="h-5 w-5" />
                  <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.4em]">Elite Registry</span>
                </div>
                <h2 className="text-2xl sm:text-5xl font-black font-headline tracking-tighter leading-[0.95] uppercase">
                  Institutional <br />
                  <span className="text-primary italic font-black">Architecture.</span>
                </h2>
                <p className="text-sm sm:text-lg text-muted-foreground font-medium leading-relaxed opacity-80">
                  Nyaya Sahayak is Bharat's premier AI legal terminal, specifically engineered to provide mathematically precise forensic auditing for 1.4 billion citizens.
                </p>
              </div>
              
              <Card className="glass border-primary/5 rounded-[1.5rem] overflow-hidden shadow-md p-6 sm:p-8 transition-all hover:border-primary/20">
                <div className="flex items-center gap-5">
                  <div className="p-4 rounded-xl bg-primary text-white shadow-lg shadow-primary/20">
                    <Command className="h-6 w-6" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-primary leading-none mb-1">System Node NS-ALPHA</p>
                    <p className="text-[9px] font-bold text-muted-foreground uppercase opacity-50 tracking-widest">Verified Forensic Protocol</p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="lg:col-span-7 space-y-4 sm:space-y-6">
              {[
                {
                  icon: BrainCircuit,
                  title: "Forensic Case Auditor",
                  desc: "Neural mapping trained on BNS and IPC frameworks to structure legal narratives into elite dossiers.",
                  href: "/dashboard/narrate",
                  color: "text-primary",
                  bg: "bg-primary/5"
                },
                {
                  icon: FileSearch,
                  title: "Statutory Risk Scanner",
                  desc: "Audit legal instruments for non-compliance markers and hidden procedural liabilities.",
                  href: "/dashboard/document-intelligence",
                  color: "text-blue-600",
                  bg: "bg-blue-600/5"
                },
                {
                  icon: Zap,
                  title: "Roadmap Intelligence",
                  desc: "Dynamic navigational roadmaps for BNSS judicial cycles and jurisdictional filing protocols.",
                  href: "/dashboard/police-guide",
                  color: "text-amber-500",
                  bg: "bg-amber-500/5"
                }
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="glass border-primary/5 hover:border-primary/20 rounded-[2rem] overflow-hidden shadow-md transition-all duration-500 group active:scale-[0.99]">
                    <CardContent className="p-6 sm:p-8 flex items-center gap-5 sm:gap-8">
                      <div className={cn("p-4 sm:p-6 rounded-[1.2rem] transition-all group-hover:scale-105 duration-500 shadow-sm shrink-0", feature.bg)}>
                        <feature.icon className={cn("h-5 w-5 sm:h-6 sm:w-6", feature.color)} />
                      </div>
                      <div className="flex-1 text-left space-y-2">
                        <h3 className="text-lg sm:text-xl font-black tracking-tight uppercase leading-none">{feature.title}</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-snug opacity-80">
                          {feature.desc}
                        </p>
                        <Button variant="ghost" className="p-0 h-auto font-black text-[9px] uppercase tracking-[0.2em] text-primary hover:bg-transparent group/btn" asChild>
                          <Link href={feature.href} className="flex items-center gap-2">
                            Initialize Node 
                            <ArrowRight className="h-3 w-3 transition-transform group-hover/btn:translate-x-2" />
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

        {/* Resources Sector - Unified Transparency */}
        <section className="w-full max-w-[1000px] pb-16 sm:pb-24 px-6 text-center space-y-10 sm:space-y-16">
          <div className="space-y-3">
            <div className="h-px w-10 bg-primary/20 mx-auto" />
            <h2 className="text-2xl sm:text-5xl font-black font-headline tracking-tighter text-foreground leading-none uppercase">Official Registry</h2>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-5 lg:gap-8">
            {[
              { icon: Globe, label: "eCourts Services", sub: "Live Judicial Registry", href: "https://services.ecourts.gov.in/", color: "text-primary", bg: "bg-primary/5" },
              { icon: Scale, label: "National Portal", sub: "Statutory Access Node", href: "https://www.india.gov.in/", color: "text-blue-600", bg: "bg-blue-600/5" }
            ].map((link, i) => (
              <a key={i} href={link.href} target="_blank" rel="noopener noreferrer" className="group">
                <Card className="glass p-6 sm:p-10 rounded-[2rem] border-primary/5 hover:border-primary/30 transition-all duration-500 flex flex-col items-center justify-center gap-5 shadow-lg relative overflow-hidden active:scale-[0.98]">
                  <div className="p-4 rounded-xl transition-all duration-500 shadow-sm group-hover:scale-110 group-hover:-rotate-2 bg-muted/20">
                    <link.icon className={cn("h-6 w-6 sm:h-8 sm:w-8", link.color)} />
                  </div>
                  <div className="space-y-1 relative z-10">
                    <span className="font-black text-lg sm:text-2xl tracking-tighter leading-none uppercase block">{link.label}</span>
                    <span className="text-[8px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] block opacity-50">{link.sub}</span>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 opacity-20 group-hover:opacity-100 group-hover:text-primary transition-all duration-500 absolute top-6 right-6" />
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
