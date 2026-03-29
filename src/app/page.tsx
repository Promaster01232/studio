
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useState, useEffect } from "react";
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
  Globe,
  Scale,
  ExternalLink
} from "lucide-react";
import { Logo } from "@/components/logo";
import { useAuth } from "@/firebase";
import { onAuthStateChanged, type User } from "firebase/auth";
import { PublicHeader } from "@/components/public-header";
import { motion } from "framer-motion";
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

const featureNodes = [
  {
    icon: Mic,
    title: "Forensic Case Auditor",
    sector: "Sector: Forensic",
    desc: "Neural engine trained on the Bharatiya Nyaya Sanhita (BNS). It performs deep-layer deconstruction of legal narratives to map relevant statutory sections.",
    href: "/dashboard/narrate",
    color: "text-orange-500",
    bg: "bg-orange-500/5"
  },
  {
    icon: Search,
    title: "Statutory Risk Scanner",
    sector: "Sector: Statutory",
    desc: "Institutional-grade audit system for legal instruments. Scans notices, contracts, and FIR applications to identify non-compliance and liability markers.",
    href: "/dashboard/document-intelligence",
    color: "text-blue-600",
    bg: "bg-blue-600/5"
  },
  {
    icon: FileText,
    title: "Statutory Drafting Terminal",
    sector: "Sector: Civil",
    desc: "AI-driven drafting node for complex legal petitions and notices. Ensures all instruments adhere to the latest judicial amendments and procedural protocols.",
    href: "/dashboard/document-generator",
    color: "text-emerald-600",
    bg: "bg-emerald-600/5"
  },
  {
    icon: FileSignature,
    title: "Bond Structural Ingress",
    sector: "Sector: Registry",
    desc: "Specialized tool for generating legally sound affidavits, bail bonds, and indemnity instruments with precise forensic placeholder mapping.",
    href: "/dashboard/bond-generator",
    color: "text-purple-600",
    bg: "bg-purple-600/5"
  }
];

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
        <section className="w-full max-w-7xl pt-12 pb-8 sm:pt-16 sm:pb-10 px-6 text-center space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <header className="flex justify-center">
              <Logo className="h-24 w-24 sm:h-32 sm:w-32 shadow-2xl relative z-10" priority />
            </header>

            <div className="space-y-4 max-w-4xl mx-auto">
              <div className="flex justify-center">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/10 bg-primary/5 backdrop-blur-md">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                  <span className="text-[9px] font-black uppercase tracking-[0.4em] text-primary">
                    Institutional Terminal // Alpha v4.2
                  </span>
                </div>
              </div>
              
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black font-headline tracking-tighter leading-[0.95] text-foreground">
                <span className="sr-only">Nyaya Sahayak | India's Premier AI Legal Assistant & Forensic Case Auditor</span>
                Elite AI Assistant for <br/>
                <span className="bg-gradient-to-r from-[#FF9933] via-[#000080] to-[#128807] bg-clip-text text-transparent animate-animated-gradient bg-[200%_auto] italic">
                  Indian Citizens.
                </span>
              </h1>

              <p className="text-sm sm:text-lg text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed opacity-80 px-4">
                Precision neural forensics for statutory deconstruction and navigating the complex Indian judicial landscape with absolute institutional clarity. Trusted by 1.4 billion for legal empowerment.
              </p>
            </div>

            <nav className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              {!loading ? (
                <div className="flex flex-col items-center gap-3 w-full sm:w-auto">
                  <Button 
                    asChild 
                    className="h-14 w-full sm:w-auto min-w-[240px] px-8 text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 rounded-xl transition-all group overflow-hidden relative"
                  >
                    <Link href="/dashboard">
                      <span className="relative z-10 flex items-center gap-3">
                        <span className="hidden sm:inline">Initialize Dashboard</span>
                        <span className="sm:hidden">Start Hub</span>
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-2" />
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    </Link>
                  </Button>
                  <div className="flex items-center gap-1.5 text-primary/50 font-black text-[8px] uppercase tracking-[0.25em]">
                    <ShieldCheck className="h-3 w-3" />
                    Secure Institutional Access Active
                  </div>
                </div>
              ) : (
                <div className="h-14 w-[240px] flex items-center justify-center gap-3 px-8 bg-muted/10 rounded-xl border border-primary/5">
                  <Loader2 className="h-4 w-4 animate-spin text-primary opacity-30" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30">Synchronizing...</span>
                </div>
              )}
            </nav>
          </motion.div>
        </section>

        <section className="w-full max-w-7xl py-12 px-6">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12 border-b border-primary/5 pb-8">
            <div className="space-y-2 text-left">
              <div className="flex items-center gap-2 text-primary">
                <Sparkles className="h-5 w-5" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Forensic Registry</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black font-headline tracking-tighter leading-[1] uppercase">
                Neural <span className="text-primary italic font-black">Capabilities.</span>
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featureNodes.map((node, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <article>
                  <Card className="h-full flex flex-col glass transition-all duration-500 rounded-[2rem] overflow-hidden border-primary/10 hover:border-primary/30 group active:scale-[0.98] shadow-lg hover:shadow-2xl">
                    <CardContent className="p-8 flex flex-col flex-grow relative z-10 text-left">
                      <div className="flex items-center justify-between mb-6">
                        <div className={cn("p-3.5 rounded-2xl transition-all duration-500 group-hover:scale-110", node.bg, node.color)}>
                          <node.icon className="h-6 w-6" aria-hidden="true" />
                        </div>
                        <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest border-primary/5 opacity-40">
                          {node.sector}
                        </Badge>
                      </div>
                      
                      <div className="space-y-3 flex-grow">
                        <h3 className="text-lg font-black tracking-tight leading-tight group-hover:text-primary transition-colors">{node.title}</h3>
                        <p className="text-xs text-muted-foreground font-medium leading-relaxed opacity-80">
                          {node.desc}
                        </p>
                      </div>
                      
                      <div className="pt-6 mt-6 border-t border-primary/5 flex items-center justify-between">
                        <Button asChild variant="ghost" className="p-0 h-auto font-black text-[9px] uppercase tracking-[0.2em] text-primary hover:bg-transparent group/btn">
                          <Link href={node.href} className="flex items-center gap-2">
                            Access Node
                            <ArrowRight className="h-3 w-3 transition-transform group-hover/btn:translate-x-1.5" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </article>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="w-full max-w-[1000px] py-12 px-6 text-center space-y-10">
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { icon: Globe, label: "eCourts Services", sub: "Official Judicial Registry", href: "https://services.ecourts.gov.in/", color: "text-primary", bg: "bg-primary/5" },
              { icon: Scale, label: "National Portal", sub: "Statutory Access Node", href: "https://www.india.gov.in/", color: "text-blue-600", bg: "bg-blue-600/5" }
            ].map((link, i) => (
              <a key={i} href={link.href} target="_blank" rel="noopener noreferrer" className="group" aria-label={`Visit ${link.label}`}>
                <Card className="glass p-8 rounded-[2.5rem] border-primary/10 hover:border-primary/40 transition-all duration-500 flex flex-col items-center justify-center gap-4 shadow-xl relative overflow-hidden active:scale-[0.98]">
                  <div className="p-4 rounded-2xl bg-muted/30 transition-all duration-500 group-hover:scale-110">
                    <link.icon className={cn("h-8 w-8", link.color)} aria-hidden="true" />
                  </div>
                  <div className="space-y-1">
                    <span className="font-black text-xl tracking-tighter uppercase block">{link.label}</span>
                    <span className="text-[9px] font-bold text-muted-foreground uppercase opacity-50">{link.sub}</span>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 opacity-20 group-hover:opacity-100 transition-all absolute top-6 right-6" />
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
