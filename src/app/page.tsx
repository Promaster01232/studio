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
          <svg className="ashoka-rotate w-[800px] h-[800px] text-[#000080]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.2">
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
      
      <div className="flex-1 flex flex-col items-center p-4 py-12 sm:py-20 relative">
        <TricolorBackground />
        
        {/* Hero Sector */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-5xl relative z-10 text-center space-y-10"
        >
          <div className="space-y-6">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ rotateY: 180 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
              className="flex justify-center mb-8 perspective-1000"
            >
              <div className="relative group cursor-pointer">
                <div className="absolute -inset-8 rounded-full bg-gradient-to-tr from-primary/20 via-blue-500/20 to-accent/20 blur-3xl animate-pulse group-hover:scale-125 transition-transform duration-1000"></div>
                <Logo className="h-32 w-32 sm:h-40 sm:w-40 relative z-10 shadow-[0_20px_50px_rgba(0,0,0,0.2)] bg-white border-none p-2" priority />
              </div>
            </motion.div>

            <div className="flex flex-col items-center gap-4">
              <Badge variant="outline" className="h-9 px-6 rounded-full border-primary/20 text-primary bg-primary/5 font-black uppercase tracking-[0.3em] text-[10px] animate-in fade-in slide-in-from-bottom-2 duration-700">
                Institutional Terminal // Alpha v4.2
              </Badge>
              <h1 className="text-4xl sm:text-8xl font-black font-headline tracking-tighter leading-none text-foreground max-w-5xl mx-auto">
                Elite AI Assistant for <br/>
                <span className="bg-gradient-to-r from-[#FF9933] via-blue-600 to-[#128807] bg-clip-text text-transparent animate-animated-gradient bg-[200%_auto] italic">
                  Indian Citizens.
                </span>
              </h1>
            </div>

            <p className="text-lg sm:text-2xl text-muted-foreground font-medium max-w-3xl mx-auto leading-relaxed opacity-80">
              Precision neural forensics for statutory deconstruction and navigating the complex Indian judicial landscape.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
            {!loading ? (
              <Button 
                asChild 
                className="h-20 px-12 text-sm font-black uppercase tracking-[0.2em] shadow-[0_20px_50px_rgba(var(--primary),0.3)] rounded-2xl active:scale-95 transition-all group overflow-hidden relative"
              >
                <Link href="/dashboard">
                  <span className="relative z-10 flex items-center gap-3">
                    Initialize Dashboard
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </Link>
              </Button>
            ) : (
              <div className="h-20 flex items-center gap-4 px-12 bg-muted/20 rounded-2xl border border-primary/5">
                <Loader2 className="h-6 w-6 animate-spin text-primary opacity-40" />
                <span className="text-[11px] font-black uppercase tracking-[0.3em] opacity-40">Synchronizing Registry...</span>
              </div>
            )}
            <Button variant="ghost" className="h-20 px-10 text-sm font-black uppercase tracking-widest rounded-2xl border border-primary/10 hover:bg-primary/5 active:scale-95 transition-all group" asChild>
              <Link href="/about" className="flex items-center gap-3">
                Explore Mandate 
                <ChevronRight className="h-4 w-4 opacity-40 group-hover:opacity-100 transition-all" />
              </Link>
            </Button>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="pt-12 flex flex-wrap justify-center gap-12 opacity-40 grayscale group-hover:grayscale-0 transition-all duration-1000"
          >
            {[
              { icon: Activity, label: "Real-time BNS Audit" },
              { icon: ShieldCheck, label: "Secured Registry" },
              { icon: Globe, label: "Digital India Sync" },
              { icon: Zap, label: "Neural Ingress" }
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-3 group/stat">
                <stat.icon className="h-5 w-5 text-primary group-hover/stat:animate-bounce" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Mandate Sector */}
        <div className="w-full max-w-6xl mt-48 space-y-32 px-4 relative z-10 text-left">
          <section className="grid lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-5 space-y-10 sticky top-32">
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-primary mb-2">
                  <Sparkles className="h-5 w-5 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em]">Statutory Excellence</span>
                </div>
                <h2 className="text-4xl sm:text-6xl font-black font-headline tracking-tighter leading-none">
                  Democratizing <br />
                  <span className="text-primary italic">Legal Intelligence.</span>
                </h2>
              </div>
              <p className="text-lg text-muted-foreground font-medium leading-relaxed">
                Nyaya Sahayak represents the definitive leap forward in AI-powered legal empowerment for the Indian citizenry. In a landscape where the judicial system is often perceived as a dense thicket of complex statutes, our platform serves as a high-fidelity navigational beacon.
              </p>
              <div className="p-8 rounded-[2.5rem] bg-primary/5 border border-primary/10 shadow-inner group transition-all hover:bg-primary/10">
                <div className="flex items-center gap-5">
                  <div className="p-3 rounded-2xl bg-white dark:bg-black shadow-lg">
                    <Command className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-black uppercase tracking-[0.3em] text-primary">Protocol NS-ALPHA-4</span>
                    <span className="text-[9px] font-bold text-muted-foreground uppercase opacity-60">Verified Forensic Clearance</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-16">
              {[
                {
                  icon: BrainCircuit,
                  title: "Forensic Case Auditor Node",
                  desc: "At the core of the Nyaya Sahayak terminal is the Forensic Case Auditor. This neural engine is specifically trained on the nuances of the Bharatiya Nyaya Sanhita (BNS) and the Bharatiya Sakshya Adhiniyam (BSA). When a citizen narrates their legal problem, our AI performs a deep-layer deconstruction identifying potential statutory violations and generating a professional dossier.",
                  href: "/dashboard/narrate",
                  color: "text-primary",
                  bg: "bg-primary/5"
                },
                {
                  icon: FileSearch,
                  title: "Document Risk Scanner Protocol",
                  desc: "Our Document Risk Scanner provides an institutional-grade audit of legal instruments. Whether it is a legal notice, a contract, or an FIR application, the AI node performs a comprehensive forensic scan to identify non-compliance markers, hidden liabilities, and critical procedural deadlines.",
                  href: "/dashboard/document-intelligence",
                  color: "text-blue-600",
                  bg: "bg-blue-600/5"
                },
                {
                  icon: Zap,
                  title: "Procedural Roadmap Intelligence Hub",
                  desc: "Navigating the Bharatiya Nagarik Suraksha Sanhita (BNSS) requires a step-by-step understanding of judicial cycles. Nyaya Sahayak provides dynamic, personalized roadmaps that guide users through the intricacies of filing complaints and courtroom decorum.",
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
                  <Card className="glass border-primary/10 rounded-[3rem] overflow-hidden shadow-2xl transition-all hover:border-primary/30 hover:shadow-primary/5 group">
                    <CardContent className="p-8 sm:p-12 space-y-8">
                      <div className="flex items-center gap-6 mb-2">
                        <div className={cn("p-4 rounded-3xl transition-transform group-hover:scale-110 group-hover:rotate-3 duration-500 shadow-xl", feature.bg)}>
                          <feature.icon className={cn("h-10 w-10", feature.color)} />
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-black tracking-tight uppercase leading-tight">{feature.title}</h3>
                      </div>
                      <p className="text-sm sm:text-lg text-muted-foreground font-medium leading-relaxed">
                        {feature.desc}
                      </p>
                      <Button variant="ghost" className="p-0 font-black text-xs uppercase tracking-widest text-primary hover:bg-transparent group/btn" asChild>
                        <Link href={feature.href} className="flex items-center gap-2">
                          Initialize Protocol 
                          <ChevronRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-2" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>

          {/* External Sector */}
          <section className="space-y-16 pb-24">
            <div className="flex flex-col items-center text-center space-y-4">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.4em]">
                Statutory Connectivity
              </Badge>
              <h2 className="text-3xl sm:text-5xl font-black font-headline tracking-tighter text-foreground">Official Judicial Resources</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {[
                { icon: Globe, label: "eCourts Services India", href: "https://services.ecourts.gov.in/", color: "text-primary", bg: "bg-primary/5" },
                { icon: Scale, label: "National Portal of India", href: "https://www.india.gov.in/", color: "text-blue-600", bg: "bg-blue-600/5" }
              ].map((link, i) => (
                <a key={i} href={link.href} target="_blank" rel="noopener noreferrer" className="group">
                  <Card className="glass p-8 rounded-[2rem] border-primary/5 hover:border-primary/30 transition-all flex items-center justify-between shadow-xl active:scale-[0.98] group-hover:shadow-primary/5">
                    <div className="flex items-center gap-5">
                      <div className={cn("p-3 rounded-2xl transition-all shadow-lg group-hover:scale-110", link.bg, link.color)}>
                        <link.icon className="h-6 w-6" />
                      </div>
                      <span className="font-black text-lg tracking-tight">{link.label}</span>
                    </div>
                    <ExternalLink className="h-5 w-5 opacity-20 group-hover:opacity-100 group-hover:text-primary transition-all" />
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
