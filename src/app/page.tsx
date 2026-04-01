"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
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
  Search
} from "lucide-react";
import { Logo } from "@/components/logo";
import { useAuth } from "@/firebase";
import { onAuthStateChanged, type User } from "firebase/auth";
import { PublicHeader } from "@/components/public-header";
import { motion } from "framer-motion";
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
                  <line key={i} x1="50" y1="50" x2={50 + 45 * Math.cos((i * 15 * Math.PI) / 180)} y2={50 + 45 * Math.sin((i * 15 * Math.PI) / 180)} />
              ))}
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
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="space-y-6">
            <header className="flex justify-center">
              <Logo className="h-24 w-24 sm:h-32 sm:w-32 shadow-2xl relative z-10" priority />
            </header>

            <div className="space-y-4 max-w-4xl mx-auto">
              <div className="flex justify-center">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/10 bg-primary/5 backdrop-blur-md">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                  <span className="text-[9px] font-black uppercase tracking-[0.4em] text-primary">Institutional Terminal // Alpha v4.2</span>
                </div>
              </div>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black font-headline tracking-tighter leading-[0.95] text-foreground">
                Elite AI Assistant for <br/><span className="bg-gradient-to-r from-[#FF9933] via-[#000080] to-[#128807] bg-clip-text text-transparent animate-animated-gradient bg-[200%_auto] italic">Indian Citizens.</span>
              </h1>
              <p className="text-sm sm:text-lg text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed opacity-80 px-4">
                Precision neural forensics for statutory deconstruction and navigating the complex Indian judicial landscape with absolute institutional clarity.
              </p>
            </div>

            <nav className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              {!loading ? (
                <Button asChild className="h-14 w-full sm:w-auto min-w-[240px] px-8 text-[11px] font-black uppercase tracking-[0.2em] shadow-xl rounded-xl transition-all group overflow-hidden relative">
                  <Link href="/dashboard">
                    <span className="relative z-10 flex items-center gap-3">
                      Initialize Dashboard <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-2" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  </Link>
                </Button>
              ) : (
                <div className="h-14 w-[240px] flex items-center justify-center gap-3 px-8 bg-muted/10 rounded-xl"><Loader2 className="h-4 w-4 animate-spin text-primary opacity-30" /></div>
              )}
            </nav>
          </motion.div> section
        </section>

        <section className="w-full max-w-7xl py-12 px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featureNodes.map((node, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                <Link href={node.href} className="block group h-full">
                  <Card className="h-full flex flex-col glass transition-all duration-500 rounded-[2rem] overflow-hidden border-primary/10 group-hover:border-primary/40 active:scale-[0.98] shadow-lg group-hover:shadow-2xl">
                    <CardContent className="p-8 flex flex-col flex-grow relative z-10 text-left">
                      <div className="flex items-center justify-between mb-6">
                        <div className={cn("p-3.5 rounded-2xl transition-all duration-500 group-hover:scale-110 shadow-lg", node.bg, node.color)}>
                          <node.icon className="h-6 w-6" aria-hidden="true" />
                        </div>
                        <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest border-primary/5 opacity-40">{node.sector}</Badge>
                      </div>
                      <h3 className="text-lg font-black tracking-tight leading-tight group-hover:text-primary transition-colors">{node.title}</h3>
                      <p className="text-xs text-muted-foreground font-medium leading-relaxed opacity-80 mt-3 flex-grow">{node.desc}</p>
                      <div className="pt-6 mt-6 border-t border-primary/5 flex items-center justify-between">
                        <span className="font-black text-[9px] uppercase tracking-[0.2em] text-primary/60 group-hover:text-primary transition-colors flex items-center gap-2">Initialize Node <ArrowRight className="h-3 w-3" /></span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
