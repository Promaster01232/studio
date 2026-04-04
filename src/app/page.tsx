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
  { icon: Mic, title: "Voice Assistant", desc: "Tell your problem and get an immediate case analysis.", href: "/dashboard/narrate", badge: "AI" },
  { icon: Search, title: "Document Analysis", desc: "Scan legal papers for risks and important clauses.", href: "/dashboard/document-intelligence", badge: "Safe" },
  { icon: FileText, title: "Drafting Tools", desc: "Generate professional legal notices and applications.", href: "/dashboard/document-generator", badge: "New" },
  { icon: Globe, title: "Lawyer Connect", desc: "Connect with verified legal professionals for expert help.", href: "/dashboard/lawyer-connect", badge: "Live" },
];

export default function WelcomePage(props: { params: Promise<any>, searchParams: Promise<any> }) {
  // Unwrap dynamic props for Next.js 15 compliance
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
      <MinimalBackground />
      
      <main className="flex-1 flex flex-col items-center relative z-10">
        <section className="w-full max-w-7xl pt-8 pb-10 sm:pt-12 sm:pb-16 px-6 text-center space-y-10">
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
                <span className="text-[9px] font-black tracking-wider text-primary/80 uppercase">AI Legal Portal</span>
              </div>
            </header>

            <div className="space-y-6 max-w-4xl mx-auto">
              <h1 className="text-4xl sm:text-6xl font-bold tracking-tight leading-[1.1] text-foreground text-center">
                India's premier <span className="text-primary italic">AI legal assistant.</span>
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
                Simple and professional legal help for everyone. Analyze cases, scan documents, and get the guidance you need in seconds.
              </p>
            </div>

            <nav className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              {!loading ? (
                <Button asChild className="h-14 w-full sm:w-auto min-w-[240px] px-8 text-xs font-black tracking-wide shadow-xl shadow-primary/20 rounded-xl active:scale-95 transition-all">
                  <Link href="/dashboard" className="flex items-center gap-2">
                    Get Started Now <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <div className="h-14 w-[240px] flex items-center justify-center bg-muted/5 rounded-xl border border-primary/5">
                  <Loader2 className="h-5 w-5 animate-spin text-primary opacity-30" />
                </div>
              )}
              <Button variant="outline" asChild className="h-14 w-full sm:w-auto min-w-[200px] px-8 text-xs font-black tracking-wide rounded-xl border-primary/10 hover:bg-primary/5">
                <Link href="/about" className="flex items-center gap-2">
                  Learn More <Activity className="h-4 w-4 opacity-40" />
                </Link>
              </Button>
            </nav>
          </motion.div>
        </section>

        <section className="w-full max-w-6xl py-12 px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { step: "01", title: "Tell your problem", desc: "Voice record or upload your legal query.", icon: Mic },
                    { step: "02", title: "AI Analysis", desc: "Our AI checks your case against the latest laws.", icon: ShieldCheck },
                    { step: "03", title: "Get Solutions", desc: "Receive a clear roadmap and the next steps.", icon: CheckCircle2 },
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
                                <h3 className="text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
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

        <section className="w-full max-w-7xl py-16 px-6 space-y-10">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-primary">
              <Zap className="h-4 w-4 animate-pulse" />
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em]">Feature Access</h2>
            </div>
            <h3 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground">Our <span className="text-primary">Services</span></h3>
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
                      <h3 className="text-lg font-bold tracking-tight text-foreground">{node.title}</h3>
                      <p className="text-xs text-muted-foreground font-medium leading-relaxed mt-2 flex-grow opacity-80">{node.desc}</p>
                      <div className="pt-6 mt-6 border-t border-primary/5 flex items-center justify-between">
                        <span className="text-[8px] font-black uppercase tracking-widest text-primary/40 group-hover:text-primary transition-colors">Open Terminal</span>
                        <ArrowRight className="h-3.5 w-3.5 text-primary opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="w-full bg-primary/5 border-y border-primary/10 py-16 px-6">
            <div className="max-w-5xl mx-auto flex flex-col lg:flex-row items-center gap-10 text-center lg:text-left">
                <div className="p-8 rounded-[2.5rem] bg-background shadow-2xl border border-primary/5 relative z-10 group hover:rotate-1 transition-transform">
                    <Globe className="h-16 w-16 text-primary group-hover:scale-105 transition-transform" />
                </div>
                <div className="flex-1 space-y-6">
                    <div className="space-y-2">
                        <div className="flex items-center justify-center lg:justify-start gap-2 text-primary">
                            <Activity className="h-4 w-4" />
                            <span className="text-[9px] font-black uppercase tracking-[0.3em]">Support Access</span>
                        </div>
                        <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground leading-none">Talk to a <span className="text-primary italic">Human Expert?</span></h2>
                    </div>
                    <p className="text-base text-muted-foreground font-medium leading-relaxed max-w-xl">
                        AI provides the analysis, but human advocates provide the strategy. Connect with verified professionals for your complex legal needs.
                    </p>
                    <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-2">
                        <Button className="rounded-xl font-bold uppercase text-[9px] h-12 px-10 shadow-lg active:scale-95 transition-all" asChild>
                            <Link href="/dashboard/lawyer-connect">Find a Lawyer</Link>
                        </Button>
                        <Button variant="outline" className="rounded-xl font-bold uppercase text-[9px] h-12 px-10 border-primary/10 hover:bg-primary/5 transition-all" asChild>
                            <Link href="/contact" className="flex items-center gap-3">
                                Send a Message <MessageCircle className="h-4 w-4 opacity-40 group-hover:animate-bounce" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>

        <section className="w-full py-16 px-6">
            <div className="max-w-3xl mx-auto text-center space-y-8">
                <Gavel className="h-8 w-8 text-primary/20 mx-auto animate-bounce" />
                <p className="text-xl sm:text-3xl font-bold text-foreground tracking-tight leading-tight italic uppercase opacity-80 text-center">
                    "Empowering citizens with simple and <span className="text-primary">Reliable AI Assistance.</span>"
                </p>
                <div className="space-y-1">
                    <p className="text-[9px] font-black uppercase tracking-[0.4em] text-primary opacity-60">Nyaya Sahayak // Portal</p>
                    <p className="text-[8px] font-bold text-muted-foreground/40 uppercase tracking-widest">Since 2024</p>
                </div>
            </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
