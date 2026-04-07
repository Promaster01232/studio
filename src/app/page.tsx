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
  ChevronRight,
  Lock,
  Cpu
} from "lucide-react";
import { Logo } from "@/components/logo";
import { useAuth } from "@/firebase";
import { onAuthStateChanged, type User as FirebaseUser } from "firebase/auth";
import { PublicHeader } from "@/components/public-header";
import { motion, AnimatePresence } from "framer-motion";
import { Footer } from "@/components/footer";

const featureNodes = [
  { icon: Mic, title: "Record Voice", desc: "Speak your case and get a smart summary instantly.", href: "/dashboard/narrate", badge: "Smart" },
  { icon: Search, title: "Check Files", desc: "Scan legal papers for risks and important dates.", href: "/dashboard/document-intelligence", badge: "Safe" },
  { icon: FileText, title: "Write Papers", desc: "Create professional legal notices in seconds.", href: "/dashboard/document-generator", badge: "Live" },
  { icon: Globe, title: "Ask Experts", desc: "Connect with real lawyers for personalized help.", href: "/dashboard/lawyer-connect", badge: "Real" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
};

export default function WelcomePage() {
  const auth = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, () => {
      setLoading(false);
    });
    return () => unsubscribe();
  }, [auth]);

  return (
    <div className="flex flex-col min-h-screen bg-background selection:bg-primary/10 overflow-x-hidden text-left relative">
      <PublicHeader />
      
      <main className="flex-1 flex flex-col items-center relative z-10">
        {/* HERO SECTION */}
        <section className="w-full max-w-7xl pt-16 pb-20 sm:pt-24 sm:pb-32 px-6 text-center space-y-12">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-10"
          >
            <motion.header variants={itemVariants} className="flex flex-col items-center gap-6">
              <div className="relative group">
                <div className="absolute -inset-8 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-1000"></div>
                <Logo className="h-24 w-24 sm:h-32 sm:w-32 shadow-2xl relative z-10 animate-pulse" priority={true} />
              </div>
              <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span className="text-[10px] font-black tracking-[0.3em] text-primary uppercase">Smart Legal Assistant</span>
              </div>
            </motion.header>

            <motion.div variants={itemVariants} className="space-y-6 max-w-4xl mx-auto">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tighter text-foreground leading-tight text-center">
                Helping everyone with <br className="hidden md:block" /> <span className="text-primary italic">smart legal AI.</span>
              </h1>
              <p className="text-base sm:text-xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
                Experience the new way to get legal help. Our app checks your case, scans laws, and helps you talk to experts.
              </p>
            </motion.div>

            <motion.nav variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
              {!loading ? (
                <Button asChild size="lg" className="h-16 w-full sm:w-auto min-w-[260px] rounded-2xl shadow-2xl shadow-primary/20 active:scale-95 transition-all group relative overflow-hidden">
                  <Link href="/dashboard" className="flex items-center gap-3 relative z-10 font-black uppercase text-xs tracking-widest">
                    Enter Dashboard <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </Link>
                </Button>
              ) : (
                <div className="h-16 w-[260px] flex items-center justify-center bg-muted/10 rounded-2xl border border-primary/10">
                  <Loader2 className="h-5 w-5 animate-spin text-primary opacity-40" />
                </div>
              )}
              <Button variant="outline" size="lg" asChild className="h-16 w-full sm:w-auto min-w-[200px] rounded-2xl border-primary/10 hover:bg-primary/5 transition-all font-black uppercase text-xs tracking-widest">
                <Link href="/about" className="flex items-center gap-2">
                  Our Mission <ChevronRight className="h-4 w-4 opacity-40" />
                </Link>
              </Button>
            </motion.nav>
          </motion.div>
        </section>

        {/* SECURITY & TRUST */}
        <section className="w-full max-w-7xl px-6 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                    { label: "Safe Data", value: "Fully Protected", icon: Lock },
                    { label: "Easy Access", value: "Private", icon: ShieldCheck },
                    { label: "AI Status", value: "Online", icon: Activity },
                    { label: "Law Status", value: "Updated", icon: Cpu },
                ].map((stat, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="p-6 rounded-[2rem] bg-card border border-primary/5 shadow-sm text-center space-y-2 group hover:border-primary/20 transition-all"
                    >
                        <stat.icon className="h-5 w-5 text-primary/40 mx-auto group-hover:scale-110 transition-transform" />
                        <p className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-60">{stat.label}</p>
                        <p className="text-[10px] font-black uppercase text-foreground">{stat.value}</p>
                    </motion.div>
                ))}
            </div>
        </section>

        {/* FEATURES GRID */}
        <section className="w-full max-w-7xl py-24 px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featureNodes.map((node, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ delay: i * 0.1 }}
              >
                <Link href={node.href} className="block group h-full">
                  <Card className="h-full flex flex-col bg-card border-primary/5 hover:border-primary/20 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 rounded-[2.5rem] overflow-hidden">
                    <CardContent className="p-10 flex flex-col h-full text-left">
                      <div className="flex items-center justify-between mb-10">
                        <div className="p-4 rounded-2xl bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                          <node.icon className="h-7 w-7" />
                        </div>
                        <Badge variant="outline" className="bg-primary/5 text-primary text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1 border-primary/10">
                          {node.badge}
                        </Badge>
                      </div>
                      <h3 className="text-xl font-black tracking-tight text-foreground mb-3 uppercase">{node.title}</h3>
                      <p className="text-sm text-muted-foreground font-medium leading-relaxed flex-grow opacity-80">{node.desc}</p>
                      <div className="mt-8 pt-8 border-t border-primary/5 flex items-center text-primary/40 group-hover:text-primary transition-all text-[10px] font-black uppercase tracking-[0.3em]">
                        Use Tool <ArrowRight className="h-3.5 w-3.5 ml-2 transition-transform group-hover:translate-x-1" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* TRUST BANNER */}
        <section className="w-full py-32 px-6 border-t border-primary/5 bg-muted/20 relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none grayscale flex items-center justify-center">
                <Logo className="h-[600px] w-[600px]" priority={false} />
            </div>
            <div className="max-w-4xl mx-auto text-center space-y-10 relative z-10">
                <div className="p-4 rounded-3xl bg-primary/5 w-fit mx-auto border border-primary/10">
                    <Gavel className="h-10 w-10 text-primary opacity-40 animate-pulse" />
                </div>
                <p className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight leading-tight italic uppercase">
                    "Making it easy for everyone to get <span className="text-primary">Legal Help with AI.</span>"
                </p>
                <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">Nyaya Sahayak</p>
                    <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">Founded 2024 • Built by IdeaSpark</p>
                </div>
            </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
