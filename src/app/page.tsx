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
  Mic,
  FileText,
  Search,
  Globe,
  CheckCircle2,
  Sparkles,
  Zap,
  Activity,
  Gavel,
  MessageCircle
} from "lucide-react";
import { Logo } from "@/components/logo";
import { useAuth } from "@/firebase";
import { onAuthStateChanged, type User as FirebaseUser } from "firebase/auth";
import { PublicHeader } from "@/components/public-header";
import { motion } from "framer-motion";
import { Footer } from "@/components/footer";

const MinimalBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.01]">
          <svg className="ashoka-rotate w-[600px] h-[600px] lg:w-[1000px] lg:h-[1000px] text-primary" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.05">
              <circle cx="50" cy="50" r="45" />
              <circle cx="50" cy="50" r="5" fill="currentColor" />
              {Array.from({ length: 24 }).map((_, i) => {
                  const angle = (i * 15 * Math.PI) / 180;
                  const x2 = (50 + 45 * Math.cos(angle)).toFixed(10);
                  const y2 = (50 + 45 * Math.sin(angle)).toFixed(10);
                  return (
                    <line key={i} x1="50" y1="50" x2={x2} y2={y2} />
                  );
              })}
          </svg>
      </div>
    </div>
  );
};

const featureNodes = [
  { icon: Mic, title: "Voice Ingress", desc: "Speak your problem naturally for immediate deconstruction.", href: "/dashboard/narrate", badge: "Live" },
  { icon: Search, title: "Forensic Audit", desc: "Scan legal instruments for statutory risks instantly.", href: "/dashboard/document-intelligence", badge: "BNS" },
  { icon: FileText, title: "Drafting terminal", desc: "Generate professional petitions with AI forensic logic.", href: "/dashboard/document-generator", badge: "Direct" },
  { icon: Globe, title: "Advocate registry", desc: "Connect with verified professionals for strategy.", href: "/dashboard/lawyer-connect", badge: "Auth" },
];

export default function WelcomePage(props: { params: Promise<any>, searchParams: Promise<any> }) {
  const _params = use(props.params);
  const _searchParams = use(props.searchParams);

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
      <MinimalBackground />
      
      <main className="flex-1 flex flex-col items-center relative z-10">
        {/* Hero Section - Reduced Top Gap */}
        <section className="w-full max-w-7xl pt-8 pb-10 sm:pt-12 sm:pb-16 px-6 text-center space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }} 
            className="space-y-8"
          >
            <header className="flex flex-col items-center gap-4">
              <Logo className="h-20 w-24 sm:h-28 sm:w-28 shadow-xl" priority={true} />
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10">
                <Sparkles className="h-3 w-3 text-primary" />
                <span className="text-[9px] font-black tracking-wider text-primary/80 uppercase">Neural Statutory Hub</span>
              </div>
            </header>

            <div className="space-y-4 max-w-4xl mx-auto">
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-foreground text-center">
                India's premier <span className="text-primary italic">AI legal terminal.</span>
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
                Empowering citizens with precise forensic audits, BNS statutory scanning, and automated drafting nodes. Simple, Satik knowledge.
              </p>
            </div>

            <nav className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              {!loading ? (
                <Button asChild className="h-14 w-full sm:w-auto min-w-[240px] px-8 text-xs font-black tracking-wide shadow-xl shadow-primary/20 rounded-xl active:scale-95 transition-all">
                  <Link href="/dashboard" className="flex items-center gap-2">
                    Initialize session <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <div className="h-14 w-[240px] flex items-center justify-center bg-muted/5 rounded-xl border border-primary/5">
                  <Loader2 className="h-5 w-5 animate-spin text-primary opacity-30" />
                </div>
              )}
              <Button variant="outline" asChild className="h-14 w-full sm:w-auto min-w-[200px] px-8 text-xs font-black tracking-wide rounded-xl border-primary/10 hover:bg-primary/5">
                <Link href="/about" className="flex items-center gap-2">
                  Forensic protocol <Activity className="h-4 w-4 opacity-40" />
                </Link>
              </Button>
            </nav>
          </motion.div>
        </section>

        {/* Process Roadmap - Tighter Spacing */}
        <section className="w-full max-w-6xl py-12 px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { step: "01", title: "Narrate problem", desc: "Transmit your legal narrative for AI ingestion.", icon: Mic },
                    { step: "02", title: "Forensic audit", desc: "AI deconstructs facts against the statutory framework.", icon: ShieldCheck },
                    { step: "03", title: "Statutory redress", desc: "Receive a roadmap and legal instruments.", icon: CheckCircle2 },
                ].map((item, i) => (
                    <motion.div 
                        key={i} 
                        initial={{ opacity: 0, y: 20 }} 
                        whileInView={{ opacity: 1, y: 0 }} 
                        viewport={{ once: true }} 
                        transition={{ delay: i * 0.1 }}
                        className="group relative p-6 sm:p-8 rounded-[2rem] bg-card/40 backdrop-blur-xl border border-primary/5 shadow-sm hover:border-primary/20 transition-all duration-500"
                    >
                        <div className="absolute top-4 right-6 text-2xl font-black text-primary/5 select-none">
                            {item.step}
                        </div>
                        <div className="flex flex-col gap-4 relative z-10">
                            <div className="h-12 w-12 rounded-xl flex items-center justify-center shadow-md bg-primary/5 border border-primary/10 group-hover:scale-110 transition-transform">
                                <item.icon className="h-5 w-5 text-primary" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-lg font-black tracking-tight text-foreground group-hover:text-primary transition-colors">
                                    {item.title}
                                </h3>
                                <p className="text-xs text-muted-foreground font-medium leading-relaxed opacity-70">
                                    {item.desc}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>

        {/* Tool Matrix - Sleeker Feature UI */}
        <section className="w-full max-w-7xl py-16 px-6 space-y-10">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-primary">
              <Zap className="h-4 w-4 animate-pulse" />
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em]">System ingress</h2>
            </div>
            <h3 className="text-2xl sm:text-4xl font-black tracking-tight uppercase leading-none">Operational <span className="text-primary italic">Nodes</span></h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featureNodes.map((node, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                <Link href={node.href} className="block group h-full">
                  <Card className="h-full flex flex-col glass transition-all duration-500 rounded-[1.8rem] overflow-hidden border-primary/5 group-hover:border-primary/30 group-hover:-translate-y-1 shadow-sm hover:shadow-2xl relative">
                    <CardContent className="p-8 flex flex-col h-full text-left relative z-10">
                      <div className="flex items-center justify-between mb-8">
                        <div className="p-3 rounded-lg shadow-sm bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-all">
                          <node.icon className="h-5 w-5" />
                        </div>
                        <Badge variant="outline" className="text-[7px] font-black uppercase border-primary/10 text-primary px-2">
                          {node.badge}
                        </Badge>
                      </div>
                      <h3 className="text-lg font-black tracking-tight uppercase">{node.title}</h3>
                      <p className="text-xs text-muted-foreground font-medium leading-relaxed mt-2 flex-grow opacity-80">{node.desc}</p>
                      <div className="pt-6 mt-6 border-t border-primary/5 flex items-center justify-between">
                        <span className="text-[8px] font-black uppercase tracking-widest text-primary/40 group-hover:text-primary transition-colors">Ingress active</span>
                        <ArrowRight className="h-3.5 w-3.5 text-primary opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Human Assistance - Tighter Layout */}
        <section className="w-full bg-primary/5 border-y border-primary/10 py-16 px-6">
            <div className="max-w-5xl mx-auto flex flex-col lg:flex-row items-center gap-10 text-center lg:text-left">
                <div className="p-8 rounded-[2.5rem] bg-background shadow-2xl border border-primary/5 relative z-10 group hover:rotate-1 transition-transform">
                    <Globe className="h-16 w-16 text-primary group-hover:scale-105 transition-transform" />
                </div>
                <div className="flex-1 space-y-6">
                    <div className="space-y-2">
                        <div className="flex items-center justify-center lg:justify-start gap-2 text-primary">
                            <Activity className="h-4 w-4" />
                            <span className="text-[9px] font-black uppercase tracking-[0.3em]">Support ingress</span>
                        </div>
                        <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-none uppercase">Need human <span className="text-primary italic">intervention?</span></h2>
                    </div>
                    <p className="text-base text-muted-foreground font-medium leading-relaxed max-w-xl">
                        AI provides the foundation; human advocates provide the strategy. Access our verified registry for complex litigation needs.
                    </p>
                    <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-2">
                        <Button className="rounded-xl font-black uppercase text-[9px] h-12 px-10 shadow-lg active:scale-95 transition-all" asChild>
                            <Link href="/dashboard/lawyer-connect">Browse registry</Link>
                        </Button>
                        <Button variant="outline" className="rounded-xl font-black uppercase text-[9px] h-12 px-10 border-primary/10 hover:bg-primary/5 transition-all" asChild>
                            <Link href="/contact">Dispatch message</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>

        {/* Final Mandate */}
        <section className="w-full py-16 px-6">
            <div className="max-w-3xl mx-auto text-center space-y-8">
                <Gavel className="h-8 w-8 text-primary/20 mx-auto animate-bounce" />
                <p className="text-xl sm:text-3xl font-black text-foreground tracking-tighter leading-tight italic uppercase opacity-80">
                    "Engineering Dignity through Precise <span className="text-primary">Neural Intelligence.</span>"
                </p>
                <div className="space-y-1">
                    <p className="text-[9px] font-black uppercase tracking-[0.4em] text-primary opacity-60">Nyaya Sahayak // Node Alpha</p>
                    <p className="text-[8px] font-bold text-muted-foreground/40 uppercase tracking-widest">Established 2024</p>
                </div>
            </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
