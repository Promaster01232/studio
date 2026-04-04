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
  MessageCircle,
  ChevronRight
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
  { icon: Mic, title: "Voice Assistant", desc: "Speak your concerns and receive an instant, high-level analysis of your situation.", href: "/dashboard/narrate", badge: "AI" },
  { icon: Search, title: "Document Analysis", desc: "Professionally scan legal papers for risks, deadlines, and critical statutory clauses.", href: "/dashboard/document-intelligence", badge: "Safe" },
  { icon: FileText, title: "Smart Drafting", desc: "Generate professionally structured legal notices, complaints, and applications in seconds.", href: "/dashboard/document-generator", badge: "Live" },
  { icon: Globe, title: "Expert Connect", desc: "Seamlessly connect with verified legal professionals for personalized strategy.", href: "/dashboard/lawyer-connect", badge: "Secure" },
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
        {/* HERO SECTION - REDESIGNED FOR HIGH PROFESSIONAL IMPACT */}
        <section className="w-full max-w-7xl pt-12 pb-16 sm:pt-20 sm:pb-24 px-6 text-center space-y-12">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, ease: "easeOut" }} 
            className="space-y-10"
          >
            <header className="flex flex-col items-center gap-6">
              <div className="relative">
                <div className="absolute -inset-4 bg-primary/10 rounded-full blur-2xl animate-pulse"></div>
                <Logo className="h-24 w-24 sm:h-32 sm:w-32 shadow-2xl relative z-10" priority={true} />
              </div>
              <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 shadow-sm">
                <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
                <span className="text-[10px] font-black tracking-[0.2em] text-primary uppercase">Institutional Intelligence</span>
              </div>
            </header>

            <div className="space-y-6 max-w-5xl mx-auto">
              <h1 className="text-5xl sm:text-7xl font-bold tracking-tighter leading-[1.05] text-foreground text-center">
                Empowering Every Citizen with <br className="hidden md:block" />
                <span className="text-primary italic font-semibold">Precision Legal AI.</span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground font-medium max-w-3xl mx-auto leading-relaxed opacity-80">
                Experience the next generation of legal empowerment. Our platform provides authoritative case analysis, professional document drafting, and direct access to justice.
              </p>
            </div>

            <nav className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-6">
              {!loading ? (
                <Button asChild size="lg" className="h-16 w-full sm:w-auto min-w-[260px] px-10 text-xs font-black uppercase tracking-widest shadow-2xl shadow-primary/30 rounded-2xl active:scale-95 transition-all group overflow-hidden relative">
                  <Link href="/dashboard" className="flex items-center gap-3 relative z-10">
                    Get Started Now <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </Link>
                </Button>
              ) : (
                <div className="h-16 w-[260px] flex items-center justify-center bg-muted/10 rounded-2xl border border-primary/10">
                  <Loader2 className="h-6 w-6 animate-spin text-primary opacity-40" />
                </div>
              )}
              <Button variant="outline" size="lg" asChild className="h-16 w-full sm:w-auto min-w-[220px] px-10 text-xs font-black uppercase tracking-widest rounded-2xl border-primary/10 hover:bg-primary/5 active:scale-95 transition-all">
                <Link href="/about" className="flex items-center gap-3">
                  Discover Mission <ChevronRight className="h-5 w-5 opacity-40 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </nav>
          </motion.div>
        </section>

        {/* PROCESS STEPS */}
        <section className="w-full max-w-6xl py-16 px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { step: "01", title: "Detail Your Matter", desc: "Provide your case details via secure voice recording or document upload.", icon: Mic },
                    { step: "02", title: "Professional Audit", desc: "Our AI executes a comprehensive audit against current statutory frameworks.", icon: ShieldCheck },
                    { step: "03", title: "Receive Guidance", desc: "Obtain a clear roadmap, drafted documents, and professional next steps.", icon: CheckCircle2 },
                ].map((item, i) => (
                    <motion.div 
                        key={i} 
                        initial={{ opacity: 0, y: 20 }} 
                        whileInView={{ opacity: 1, y: 0 }} 
                        viewport={{ once: true }} 
                        transition={{ delay: i * 0.15 }}
                        className="group relative p-8 rounded-[2.5rem] bg-card/40 backdrop-blur-xl border border-primary/5 shadow-xl hover:border-primary/20 transition-all duration-500"
                    >
                        <div className="absolute top-6 right-8 text-3xl font-black text-primary/5 select-none font-mono">
                            {item.step}
                        </div>
                        <div className="flex flex-col gap-6 relative z-10">
                            <div className="h-14 w-14 rounded-2xl flex items-center justify-center shadow-lg bg-primary/5 border border-primary/10 group-hover:scale-110 transition-transform duration-500">
                                <item.icon className="h-6 w-6 text-primary" />
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-muted-foreground font-medium leading-relaxed opacity-70">
                                    {item.desc}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>

        {/* SERVICES GRID */}
        <section className="w-full max-w-7xl py-20 px-6 space-y-12">
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-2.5 text-primary">
              <Zap className="h-4 w-4 animate-pulse" />
              <h2 className="text-[11px] font-black uppercase tracking-[0.5em]">Statutory Services</h2>
            </div>
            <h3 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground">Advanced <span className="text-primary">Legal Terminals.</span></h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featureNodes.map((node, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Link href={node.href} className="block group h-full">
                  <Card className="h-full flex flex-col glass transition-all duration-500 rounded-[2.2rem] overflow-hidden border-primary/5 group-hover:border-primary/30 group-hover:-translate-y-2 shadow-sm hover:shadow-3xl relative">
                    <CardContent className="p-10 flex flex-col h-full text-left relative z-10">
                      <div className="flex items-center justify-between mb-10">
                        <div className="p-4 rounded-2xl shadow-xl bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                          <node.icon className="h-6 w-6" />
                        </div>
                        <Badge variant="outline" className="text-[8px] font-black uppercase border-primary/10 text-primary px-3 py-1 rounded-full">
                          {node.badge}
                        </Badge>
                      </div>
                      <h3 className="text-xl font-bold tracking-tight text-foreground">{node.title}</h3>
                      <p className="text-sm text-muted-foreground font-medium leading-relaxed mt-3 flex-grow opacity-80">{node.desc}</p>
                      <div className="pt-8 mt-8 border-t border-primary/5 flex items-center justify-between">
                        <span className="text-[9px] font-black uppercase tracking-widest text-primary/40 group-hover:text-primary transition-colors">Launch Module</span>
                        <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-all -translate-x-3 group-hover:translate-x-0" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* HUMAN EXPERT SECTION */}
        <section className="w-full bg-muted/30 border-y border-primary/5 py-24 px-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-24 opacity-[0.02] pointer-events-none grayscale">
                <Logo className="h-96 w-96" priority={false} />
            </div>
            <div className="max-w-5xl mx-auto flex flex-col lg:flex-row items-center gap-16 text-center lg:text-left relative z-10">
                <div className="p-10 rounded-[3rem] bg-background shadow-3xl border border-primary/5 relative group hover:rotate-2 transition-transform duration-700">
                    <Globe className="h-20 w-20 text-primary group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute -inset-4 bg-primary/5 rounded-full blur-2xl -z-10 animate-pulse"></div>
                </div>
                <div className="flex-1 space-y-8">
                    <div className="space-y-3">
                        <div className="flex items-center justify-center lg:justify-start gap-3 text-primary">
                            <Activity className="h-5 w-5 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Expert Registry</span>
                        </div>
                        <h2 className="text-3xl sm:text-5xl font-bold tracking-tighter leading-none text-foreground">Consult with <span className="text-primary italic">Legal Experts.</span></h2>
                    </div>
                    <p className="text-lg text-muted-foreground font-medium leading-relaxed max-w-2xl">
                        While AI provides the analytical foundation, complex litigation requires human strategy. Connect with our registry of verified advocates for personalized expertise and representation.
                    </p>
                    <div className="flex flex-wrap justify-center lg:justify-start gap-5 pt-4">
                        <Button size="lg" className="rounded-2xl font-black uppercase tracking-widest text-[10px] h-14 px-10 shadow-2xl active:scale-95 transition-all" asChild>
                            <Link href="/dashboard/lawyer-connect">Access Advocate Directory</Link>
                        </Button>
                        <Button variant="outline" size="lg" className="rounded-2xl font-black uppercase tracking-widest text-[10px] h-14 px-10 border-primary/10 hover:bg-primary/5 active:scale-95 transition-all" asChild>
                            <Link href="/contact" className="flex items-center gap-3 group">
                                Inquire Now <MessageCircle className="h-5 w-5 opacity-40 group-hover:animate-bounce" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>

        {/* TRUST QUOTE */}
        <section className="w-full py-24 px-6">
            <div className="max-w-4xl mx-auto text-center space-y-10">
                <Gavel className="h-10 w-10 text-primary/20 mx-auto animate-bounce" />
                <p className="text-2xl sm:text-4xl font-bold text-foreground tracking-tight leading-snug italic uppercase opacity-90 text-center">
                    "Redefining access to justice through <br /> <span className="text-primary">Reliable Artificial Intelligence.</span>"
                </p>
                <div className="space-y-2">
                    <p className="text-[11px] font-black uppercase tracking-[0.5em] text-primary opacity-60">Official Portal // Nyaya Sahayak</p>
                    <p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest">Technically Optimized Registry Node</p>
                </div>
            </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
