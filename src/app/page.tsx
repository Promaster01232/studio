"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  UserCheck,
  Sparkles,
  Zap,
  Activity,
  Gavel
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
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02]">
          <svg className="ashoka-rotate w-[600px] h-[600px] lg:w-[1000px] lg:h-[1000px] text-primary" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.05">
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
  { icon: Mic, title: "Voice Ingress", desc: "Speak your problem naturally. Our neural engine deconstructs your narrative into simple statutory facts.", href: "/dashboard/narrate", badge: "Live Node" },
  { icon: Search, title: "Forensic Audit", desc: "Upload any legal instrument for a deep statutory scan. Identify hidden risks and procedural traps instantly.", href: "/dashboard/document-intelligence", badge: "BNS Ready" },
  { icon: FileText, title: "Drafting Terminal", desc: "Generate professional petitions, notices, and applications using elite AI forensic logic.", href: "/dashboard/document-generator", badge: "Official Format" },
  { icon: Globe, title: "Advocate Registry", desc: "Connect with authenticated legal professionals for high-fidelity strategy and representation.", href: "/dashboard/lawyer-connect", badge: "Verified" },
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
        {/* Hero Section */}
        <section className="w-full max-w-7xl pt-16 pb-12 sm:pt-32 sm:pb-32 px-6 text-center space-y-12">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, ease: "easeOut" }} 
            className="space-y-12"
          >
            <header className="flex flex-col items-center gap-6">
              <div className="relative">
                <div className="absolute -inset-4 bg-primary/10 rounded-full blur-2xl animate-pulse"></div>
                <Logo className="h-24 w-24 sm:h-36 sm:w-32 shadow-2xl relative z-10" priority={true} />
              </div>
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 shadow-sm">
                <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/80">Neural Statutory Hub Alpha</span>
              </div>
            </header>

            <div className="space-y-6 max-w-5xl mx-auto">
              <h1 className="text-5xl sm:text-8xl font-black tracking-tighter leading-[0.9] text-foreground text-center uppercase">
                India's Premier <br/>
                <span className="text-primary italic">AI Legal Terminal.</span>
              </h1>
              <p className="text-lg sm:text-2xl text-muted-foreground font-medium max-w-3xl mx-auto leading-relaxed">
                Empowering 1.4 Billion citizens with precise forensic audits, BNS statutory scanning, and automated drafting nodes.
              </p>
            </div>

            <nav className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
              {!loading ? (
                <Button asChild className="h-16 w-full sm:w-auto min-w-[300px] px-12 text-xs font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/20 rounded-2xl active:scale-95 transition-all group overflow-hidden relative">
                  <Link href="/dashboard">
                    <span className="relative z-10 flex items-center gap-3">
                      Initialize Session <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </span>
                    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  </Link>
                </Button>
              ) : (
                <div className="h-16 w-[300px] flex items-center justify-center bg-muted/10 rounded-2xl border border-primary/5">
                  <Loader2 className="h-6 w-6 animate-spin text-primary opacity-30" />
                </div>
              )}
              <Button variant="outline" asChild className="h-16 w-full sm:w-auto min-w-[240px] px-10 text-xs font-black uppercase tracking-[0.2em] rounded-2xl border-primary/10 hover:bg-primary/5 group">
                <Link href="/about" className="flex items-center gap-3">
                  Forensic Protocol <Activity className="h-4 w-4 opacity-40 group-hover:animate-pulse" />
                </Link>
              </Button>
            </nav>
          </motion.div>
        </section>

        {/* Process Roadmap */}
        <section className="w-full max-w-6xl py-20 px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {[
                    { step: "01", title: "Narrate", desc: "Transmit your legal narrative via voice or textual node.", icon: Mic, color: "text-primary" },
                    { step: "02", title: "Audit", desc: "AI deconstructs facts against the latest statutory framework.", icon: ShieldCheck, color: "text-primary" },
                    { step: "03", title: "Redress", desc: "Receive a professional roadmap and generated instruments.", icon: CheckCircle2, color: "text-primary" },
                ].map((item, i) => (
                    <motion.div 
                        key={i} 
                        initial={{ opacity: 0, y: 20 }} 
                        whileInView={{ opacity: 1, y: 0 }} 
                        viewport={{ once: true }} 
                        transition={{ delay: i * 0.2 }}
                        className="group relative p-10 rounded-[2.5rem] bg-card border border-primary/5 shadow-sm text-left hover:border-primary/20 transition-all hover:shadow-2xl"
                    >
                        <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center mb-8 shadow-inner bg-primary/5 border border-primary/5 transition-transform group-hover:scale-110", item.color)}>
                            <item.icon className="h-6 w-6" />
                        </div>
                        <div className="absolute top-8 right-10 text-6xl font-black text-primary/5 select-none transition-colors group-hover:text-primary/10">{item.step}</div>
                        <h3 className="text-2xl font-black tracking-tighter mb-3 uppercase leading-none">{item.title}</h3>
                        <p className="text-sm text-muted-foreground font-medium leading-relaxed opacity-80">{item.desc}</p>
                    </motion.div>
                ))}
            </div>
        </section>

        {/* Tool Matrix */}
        <section className="w-full max-w-7xl py-32 px-6 space-y-16">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3 text-primary">
              <Zap className="h-5 w-5 animate-pulse" />
              <h2 className="text-[11px] font-black uppercase tracking-[0.5em]">Forensic Tool Matrix</h2>
            </div>
            <h3 className="text-4xl sm:text-6xl font-black tracking-tighter uppercase leading-none">System Ingress <span className="text-primary italic">Nodes.</span></h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featureNodes.map((node, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Link href={node.href} className="block group h-full">
                  <Card className="h-full flex flex-col glass transition-all duration-500 rounded-[2.5rem] overflow-hidden border-primary/5 group-hover:border-primary/30 group-hover:-translate-y-2 shadow-sm group-hover:shadow-3xl relative">
                    {/* Watermark Logo */}
                    <div className="absolute top-0 right-0 p-6 opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] transition-opacity">
                      <Logo className="h-32 w-32 grayscale" priority={false} />
                    </div>
                    
                    <CardContent className="p-10 flex flex-col h-full text-left relative z-10">
                      <div className="flex items-center justify-between mb-10">
                        <div className="p-4 rounded-2xl shadow-lg bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                          <node.icon className="h-7 w-7" />
                        </div>
                        <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full border-primary/10 text-primary opacity-60 group-hover:opacity-100 group-hover:bg-primary/5 transition-all">
                          {node.badge}
                        </Badge>
                      </div>
                      
                      <h3 className="text-2xl font-black tracking-tighter leading-tight group-hover:text-primary transition-colors uppercase">{node.title}</h3>
                      <p className="text-sm text-muted-foreground font-medium leading-relaxed mt-4 flex-grow opacity-80 group-hover:opacity-100">{node.desc}</p>
                      
                      <div className="pt-10 mt-10 border-t border-primary/5 flex items-center justify-between">
                        <span className="text-[9px] font-black uppercase tracking-widest text-primary/40 group-hover:text-primary transition-colors">Initialize Ingress</span>
                        <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Human Assistance Node */}
        <section className="w-full bg-primary/5 border-y border-primary/10 py-32 px-6">
            <div className="max-w-5xl mx-auto flex flex-col lg:flex-row items-center gap-16 text-center lg:text-left">
                <div className="relative">
                    <div className="absolute -inset-10 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="p-10 rounded-[3.5rem] bg-background shadow-3xl border border-primary/5 relative z-10 group hover:rotate-2 transition-transform duration-700">
                        <UserCheck className="h-24 w-24 text-primary group-hover:scale-110 transition-transform" />
                    </div>
                </div>
                <div className="flex-1 space-y-8">
                    <div className="space-y-4">
                        <div className="flex items-center justify-center lg:justify-start gap-3 text-primary">
                            <Activity className="h-5 w-5" />
                            <span className="text-[11px] font-black uppercase tracking-[0.4em]">Strategic Support Ingress</span>
                        </div>
                        <h2 className="text-4xl sm:text-6xl font-black tracking-tighter leading-none uppercase">Need Human <br className="hidden sm:block"/> <span className="text-primary italic">Intervention?</span></h2>
                    </div>
                    <p className="text-xl text-muted-foreground font-medium leading-relaxed max-w-2xl">
                        AI provides the foundation; human advocates provide the strategy. Access our verified registry or connect with institutional support for complex litigation needs.
                    </p>
                    <div className="flex flex-wrap justify-center lg:justify-start gap-6 pt-4">
                        <Button className="rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] h-16 px-12 shadow-2xl shadow-primary/20 active:scale-95 transition-all group overflow-hidden relative" asChild>
                            <Link href="/dashboard/lawyer-connect">
                                <span className="relative z-10 flex items-center gap-3">
                                    Browse Registry <Globe className="h-4 w-4" />
                                </span>
                                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            </Link>
                        </Button>
                        <Button variant="outline" className="rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] h-16 px-12 border-primary/10 hover:bg-primary/5 transition-all group" asChild>
                            <Link href="/contact" className="flex items-center gap-3">
                                Dispatch Message <MessageCircle className="h-4 w-4 opacity-40 group-hover:animate-bounce" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>

        {/* Statutory Commitment */}
        <section className="w-full py-32 px-6">
            <div className="max-w-4xl mx-auto text-center space-y-10">
                <Gavel className="h-12 w-12 text-primary/20 mx-auto animate-bounce" />
                <p className="text-2xl sm:text-4xl font-black text-foreground tracking-tighter leading-tight italic uppercase opacity-80">
                    "Engineering Dignity through Precise <span className="text-primary">Neural Legal Intelligence.</span> We don't just provide answers; we build procedural paths to justice."
                </p>
                <div className="space-y-2">
                    <p className="text-[11px] font-black uppercase tracking-[0.5em] text-primary opacity-60">Nyaya Sahayak // Node NS-ALPHA</p>
                    <p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest">Authorized Statutory Helper // Established 2024</p>
                </div>
            </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
