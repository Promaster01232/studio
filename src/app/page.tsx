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
  UserCheck
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
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03]">
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
  { icon: Mic, title: "Tell Your Problem", desc: "Just speak your problem. Our AI will listen and explain the law to you in simple words.", href: "/dashboard/narrate" },
  { icon: Search, title: "Check Your Papers", desc: "Upload any legal paper. We will tell you if there are any risks or dangers inside.", href: "/dashboard/document-intelligence" },
  { icon: FileText, title: "Write Legal Papers", desc: "Need to write an application or a notice? Our AI writes it for you perfectly.", href: "/dashboard/document-generator" },
  { icon: Globe, title: "Find a Lawyer", desc: "Connect with verified lawyers who can help you further with your case.", href: "/dashboard/lawyer-connect" },
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
        <section className="w-full max-w-7xl pt-12 pb-12 sm:pt-20 sm:pb-24 px-6 text-center space-y-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="space-y-10">
            <header className="flex justify-center">
              <Logo className="h-24 w-24 sm:h-32 sm:w-32 shadow-none border-4 border-primary/5" priority={true} />
            </header>

            <div className="space-y-4 max-w-4xl mx-auto">
              <h1 className="text-4xl sm:text-7xl font-black tracking-tighter leading-[1] text-foreground text-center">
                India's Simple <br/>
                <span className="text-primary italic">AI Legal Helper.</span>
              </h1>
              <p className="text-lg sm:text-2xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
                Understand your legal problems and get help in minutes. Simple, fast, and completely private for every citizen.
              </p>
            </div>

            <nav className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              {!loading ? (
                <Button asChild className="h-16 w-full sm:w-auto min-w-[280px] px-10 text-sm font-black uppercase tracking-widest shadow-2xl shadow-primary/20 rounded-2xl active:scale-95 transition-all">
                  <Link href="/dashboard">
                    Start Helping Me <ArrowRight className="h-5 w-5 ml-3" />
                  </Link>
                </Button>
              ) : (
                <div className="h-16 w-[280px] flex items-center justify-center bg-muted/10 rounded-2xl">
                  <Loader2 className="h-6 w-6 animate-spin text-primary opacity-30" />
                </div>
              )}
              <Button variant="outline" asChild className="h-16 w-full sm:w-auto min-w-[280px] px-10 text-sm font-black uppercase tracking-widest rounded-2xl border-primary/20 hover:bg-primary/5">
                <Link href="/about">How it Works</Link>
              </Button>
            </nav>
          </motion.div>
        </section>

        <section className="w-full max-w-6xl py-12 px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { step: "1", title: "Tell Us", desc: "Speak or record your legal problem in your language.", icon: Mic },
                    { step: "2", title: "AI Analyzes", desc: "Our AI checks the latest laws and explains your rights.", icon: ShieldCheck },
                    { step: "3", title: "Get Solution", desc: "Get a clear report and simple steps to solve your issue.", icon: CheckCircle2 },
                ].map((item, i) => (
                    <motion.div 
                        key={i} 
                        initial={{ opacity: 0, y: 20 }} 
                        whileInView={{ opacity: 1, y: 0 }} 
                        viewport={{ once: true }} 
                        transition={{ delay: i * 0.2 }}
                        className="relative p-10 rounded-[2.5rem] bg-card border border-primary/10 shadow-sm text-center group hover:border-primary/30 transition-all"
                    >
                        <div className="h-16 w-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md bg-primary/5 text-primary border border-primary/10">
                            <item.icon className="h-8 w-8" />
                        </div>
                        <div className="absolute top-6 right-8 text-5xl font-black text-primary/5 select-none">{item.step}</div>
                        <h3 className="text-xl font-black tracking-tight mb-2 uppercase">{item.title}</h3>
                        <p className="text-sm text-muted-foreground font-medium leading-relaxed">{item.desc}</p>
                    </motion.div>
                ))}
            </div>
        </section>

        <section className="w-full max-w-7xl py-20 px-6 space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">Institutional Services</h2>
            <h3 className="text-3xl sm:text-5xl font-black tracking-tighter uppercase">Statutory Control <span className="text-primary">Center.</span></h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featureNodes.map((node, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Link href={node.href} className="block group h-full">
                  <Card className="h-full flex flex-col glass transition-all duration-500 rounded-[2.5rem] overflow-hidden border-primary/10 group-hover:border-primary/40 group-hover:-translate-y-1 shadow-sm group-hover:shadow-2xl">
                    <CardContent className="p-10 flex flex-col h-full text-left">
                      <div className="p-4 rounded-2xl w-fit mb-8 shadow-sm bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                        <node.icon className="h-7 w-7" />
                      </div>
                      <h3 className="text-2xl font-black tracking-tighter leading-tight group-hover:text-primary transition-colors uppercase">{node.title}</h3>
                      <p className="text-sm text-muted-foreground font-medium leading-relaxed mt-4 flex-grow">{node.desc}</p>
                      <div className="pt-8 mt-8 border-t border-primary/5 flex items-center text-[10px] font-black uppercase tracking-widest text-primary/60 group-hover:text-primary transition-colors">
                        Access Terminal <ArrowRight className="h-3 w-3 ml-2" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="w-full bg-primary/5 border-y border-primary/10 py-24 px-6">
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-12 text-center md:text-left">
                <div className="p-8 rounded-[3rem] bg-background shadow-2xl border border-primary/10 relative">
                    <div className="absolute -top-2 -right-2 bg-primary h-5 w-5 rounded-full border-4 border-background animate-pulse" />
                    <UserCheck className="h-20 w-20 text-primary" />
                </div>
                <div className="flex-1 space-y-6">
                    <h2 className="text-4xl font-black tracking-tighter leading-none uppercase">Need Human Assistance?</h2>
                    <p className="text-lg text-muted-foreground font-medium leading-relaxed">
                        If you need more help, you can connect with our support team or find a local lawyer through our directory. We are here to support your journey.
                    </p>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
                        <Button className="rounded-2xl font-black uppercase tracking-widest text-xs h-14 px-10 shadow-xl active:scale-95 transition-all" asChild>
                            <Link href="/dashboard/lawyer-connect">Find a Lawyer</Link>
                        </Button>
                        <Button variant="outline" className="rounded-2xl font-black uppercase tracking-widest text-xs h-14 px-10 border-primary/20 hover:bg-primary/5 transition-all" asChild>
                            <Link href="/contact">Message Support</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}