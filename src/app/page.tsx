"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState, useEffect, use } from "react";
import { 
  ArrowRight, 
  Loader2, 
  ShieldCheck, 
  Sparkles,
  Activity,
  Mic,
  FileText,
  FileSignature,
  Search,
  Gavel,
  Scale,
  BrainCircuit,
  Lock,
  Globe
} from "lucide-react";
import { Logo } from "@/components/logo";
import { useAuth } from "@/firebase";
import { onAuthStateChanged, type User as FirebaseUser } from "firebase/auth";
import { PublicHeader } from "@/components/public-header";
import { motion } from "framer-motion";
import { Footer } from "@/components/footer";

const TricolorBackground = () => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="fixed inset-0 bg-background z-0" />;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute top-[-5%] left-[-5%] w-[50%] h-[50%] bg-[#FF9933] blur-[120px] opacity-[0.06] animate-pulse"></div>
      <div className="absolute bottom-[-5%] right-[-5%] w-[50%] h-[50%] bg-[#128807] blur-[120px] opacity-[0.06] animate-pulse"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.015]">
          <svg className="ashoka-rotate w-[600px] h-[600px] lg:w-[1000px] lg:h-[1000px] text-[#000080]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.05">
              <circle cx="50" cy="50" r="45" />
              <circle cx="50" cy="50" r="5" fill="currentColor" />
              {Array.from({ length: 24 }).map((_, i) => {
                  const angle = (i * 15 * Math.PI) / 180;
                  const x2 = (50 + 45 * Math.cos(angle)).toFixed(10);
                  const y2 = (50 + 45 * Math.sin(angle)).toFixed(10);
                  return (
                    <line 
                      key={i} 
                      x1="50" 
                      y1="50" 
                      x2={x2} 
                      y2={y2} 
                    />
                  );
              })}
          </svg>
      </div>
    </div>
  );
};

const featureNodes = [
  { icon: Mic, title: "Forensic Case Auditor", sector: "Sector: Forensic", desc: "Voice-to-statute neural engine. Converts complex legal narratives into structured reports.", href: "/dashboard/narrate", color: "text-orange-500", bg: "bg-orange-500/5" },
  { icon: Search, title: "Statutory Risk Scanner", sector: "Sector: Statutory", desc: "Institutional document audit system. Scans FIRs and notices for hidden risks.", href: "/dashboard/document-intelligence", color: "text-blue-600", bg: "bg-blue-600/5" },
  { icon: FileText, title: "Statutory Drafting Terminal", sector: "Sector: Civil", desc: "Elite AI drafting node. Generate legally sound petitions tailored to Indian standards.", href: "/dashboard/document-generator", color: "text-emerald-600", bg: "bg-emerald-600/5" },
  { icon: FileSignature, title: "Bond Structural Ingress", sector: "Sector: Registry", desc: "Specialized generation of affidavits, bail bonds, and indemnity instruments.", href: "/dashboard/bond-generator", color: "text-purple-600", bg: "bg-purple-600/5" },
  { icon: BrainCircuit, title: "Case Strength Matrix", sector: "Sector: Analytics", desc: "AI-driven litigation success probability based on forensic data and past precedents.", href: "/dashboard/strength-analyzer", color: "text-red-500", bg: "bg-red-500/5" },
  { icon: Gavel, title: "Courtroom Assistant", sector: "Sector: Judicial", desc: "Real-time transcription and cross-examination question generator for legal professionals.", href: "/dashboard/court-assistant", color: "text-indigo-600", bg: "bg-indigo-600/5" },
  { icon: Lock, title: "Secure Case Vault", sector: "Sector: Security", desc: "End-to-end encrypted case management and document storage for absolute privacy.", href: "/dashboard/my-cases", color: "text-cyan-600", bg: "bg-cyan-600/5" },
  { icon: Globe, title: "Advocate Directory", sector: "Sector: Professional", desc: "Connect with AI-authenticated and manually verified legal professionals across India.", href: "/dashboard/lawyer-connect", color: "text-amber-600", bg: "bg-amber-600/5" },
];

export default function WelcomePage(props: { params: Promise<any>, searchParams: Promise<any> }) {
  use(props.params);
  use(props.searchParams);

  const auth = useAuth();
  const [user, setUser] = useState<FirebaseUser | null>(null);
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
        <section className="w-full max-w-7xl pt-16 pb-12 sm:pt-24 sm:pb-20 px-6 text-center space-y-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="space-y-8">
            <header className="flex justify-center">
              <Logo className="h-28 w-24 sm:h-40 sm:w-40 shadow-3xl relative z-10" priority={true} />
            </header>

            <div className="space-y-6 max-w-5xl mx-auto">
              <div className="flex justify-center">
                <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-primary/10 bg-primary/5 backdrop-blur-xl shadow-inner">
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Institutional Terminal // Alpha v4.2</span>
                </div>
              </div>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-headline tracking-tighter leading-[0.9] text-foreground">
                Elite AI Legal Assistant for <br/>
                <span className="bg-gradient-to-r from-[#FF9933] via-[#000080] to-[#128807] bg-clip-text text-transparent animate-animated-gradient bg-[200%_auto] italic">Bharat's Citizens.</span>
              </h1>
              <p className="text-base sm:text-xl text-muted-foreground font-medium max-xl mx-auto leading-relaxed opacity-80 px-4">
                Precision neural forensics for statutory deconstruction and navigating the complex Indian judicial landscape with absolute institutional clarity.
              </p>
            </div>

            <nav className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
              {!loading ? (
                <Button asChild className="h-16 w-full sm:w-auto min-w-[280px] px-10 text-xs font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/20 rounded-2xl transition-all group overflow-hidden relative text-center">
                  <Link href="/dashboard">
                    <span className="relative z-10 flex items-center gap-3">
                      Initialize Dashboard <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </Link>
                </Button>
              ) : (
                <div className="h-16 w-[280px] flex items-center justify-center gap-3 px-10 bg-muted/10 rounded-2xl">
                  <Loader2 className="h-5 w-5 animate-spin text-primary opacity-30" />
                </div>
              )}
              <Button variant="outline" asChild className="h-16 w-full sm:w-auto min-w-[280px] px-10 text-xs font-black uppercase tracking-[0.2em] rounded-2xl border-primary/10 hover:bg-primary/5 transition-all">
                <Link href="/about">Statutory Mandate</Link>
              </Button>
            </nav>
          </motion.div>
        </section>

        <section className="w-full max-w-7xl py-20 px-6 space-y-16">
          <div className="flex flex-col items-center text-center space-y-4">
            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">Core Architecture</h2>
            <h3 className="text-3xl sm:text-5xl font-black tracking-tighter">Forensic Statutory <span className="text-primary">Matrix.</span></h3>
            <p className="text-muted-foreground font-medium max-w-2xl">Access India's most comprehensive registry of AI-driven legal tools.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featureNodes.map((node, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                <Link href={node.href} className="block group h-full">
                  <Card className="h-full flex flex-col glass transition-all duration-500 rounded-[2.5rem] overflow-hidden border-primary/10 group-hover:border-primary/40 active:scale-[0.98] shadow-xl group-hover:shadow-3xl">
                    <CardContent className="p-10 flex flex-col flex-grow relative z-10 text-left">
                      <div className="flex items-center justify-between mb-8">
                        <div className={cn("p-4 rounded-2xl transition-all duration-500 group-hover:scale-110 shadow-lg", node.bg, node.color)}>
                          <node.icon className="h-7 w-7" aria-hidden="true" />
                        </div>
                        <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest border-primary/10 opacity-40">{node.sector}</Badge>
                      </div>
                      <h3 className="text-xl font-black tracking-tight leading-tight group-hover:text-primary transition-colors">{node.title}</h3>
                      <p className="text-sm text-muted-foreground font-medium leading-relaxed opacity-80 mt-4 flex-grow">{node.desc}</p>
                      <div className="pt-8 mt-8 border-t border-primary/5 flex items-center justify-between">
                        <span className="font-black text-[10px] uppercase tracking-[0.2em] text-primary/60 group-hover:text-primary transition-colors flex items-center gap-2">Initialize Node <ArrowRight className="h-4 w-4" /></span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="w-full bg-muted/30 border-y border-primary/5 py-24 px-6 text-center">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">Institutional Trust</h3>
              <h2 className="text-4xl sm:text-6xl font-black tracking-tighter">Engineered for <span className="text-primary italic">Integrity.</span></h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
              <div className="space-y-3">
                <div className="text-4xl font-black text-foreground">100%</div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Forensic Privacy</p>
              </div>
              <div className="space-y-3">
                <div className="text-4xl font-black text-foreground">60+</div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Statutory Protocols</p>
              </div>
              <div className="space-y-3">
                <div className="text-4xl font-black text-foreground">24/7</div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Statutory Access</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
