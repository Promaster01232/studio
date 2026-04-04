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

const featureNodes = [
  { icon: Mic, title: "Voice Record", desc: "Speak your case and get an instant, high-level summary of your situation.", href: "/dashboard/narrate", badge: "AI" },
  { icon: Search, title: "Analyze Document", desc: "Scan legal papers for risks, deadlines, and critical statutory clauses.", href: "/dashboard/document-intelligence", badge: "Secure" },
  { icon: FileText, title: "Drafting", desc: "Generate professionally structured legal notices and applications in seconds.", href: "/dashboard/document-generator", badge: "Live" },
  { icon: Globe, title: "Expert Connect", desc: "Seamlessly connect with verified legal professionals for personalized strategy.", href: "/dashboard/lawyer-connect", badge: "Verified" },
];

export default function WelcomePage(props: { params: Promise<any>, searchParams: Promise<any> }) {
  use(props.params);
  use(props.searchParams);

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
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, ease: "easeOut" }} 
            className="space-y-10"
          >
            <header className="flex flex-col items-center gap-6">
              <div className="relative">
                <div className="absolute -inset-6 bg-primary/5 rounded-full blur-3xl"></div>
                <Logo className="h-24 w-24 sm:h-32 sm:w-32 shadow-xl relative z-10" priority={true} />
              </div>
              <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span className="text-[10px] font-bold tracking-widest text-primary uppercase">Modern Legal Intelligence</span>
              </div>
            </header>

            <div className="space-y-6 max-w-4xl mx-auto">
              <h1 className="text-4xl sm:text-7xl font-black tracking-tight text-foreground leading-[1.1] text-center">
                Empowering every citizen with <span className="text-primary">precision legal AI</span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
                Experience the next generation of legal help. Our platform provides case analysis, document drafting, and direct access to experts.
              </p>
            </div>

            <nav className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
              {!loading ? (
                <Button asChild size="lg" className="h-14 w-full sm:w-auto min-w-[240px] rounded-xl shadow-xl shadow-primary/20 active:scale-95 transition-all group relative overflow-hidden">
                  <Link href="/dashboard" className="flex items-center gap-2 relative z-10">
                    Get Started <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </Link>
                </Button>
              ) : (
                <div className="h-14 w-[240px] flex items-center justify-center bg-muted/10 rounded-xl border border-primary/10">
                  <Loader2 className="h-5 w-5 animate-spin text-primary opacity-40" />
                </div>
              )}
              <Button variant="outline" size="lg" asChild className="h-14 w-full sm:w-auto min-w-[200px] rounded-xl border-primary/10 hover:bg-primary/5 transition-all">
                <Link href="/about" className="flex items-center gap-2">
                  Learn More <ChevronRight className="h-4 w-4 opacity-40" />
                </Link>
              </Button>
            </nav>
          </motion.div>
        </section>

        {/* FEATURES GRID */}
        <section className="w-full max-w-7xl py-20 px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featureNodes.map((node, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Link href={node.href} className="block group h-full">
                  <Card className="h-full flex flex-col bg-card border-primary/5 hover:border-primary/20 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 rounded-3xl overflow-hidden">
                    <CardContent className="p-8 flex flex-col h-full text-left">
                      <div className="flex items-center justify-between mb-8">
                        <div className="p-3 rounded-2xl bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-all">
                          <node.icon className="h-6 w-6" />
                        </div>
                        <Badge variant="secondary" className="bg-primary/10 text-primary text-[9px] font-bold uppercase">
                          {node.badge}
                        </Badge>
                      </div>
                      <h3 className="text-lg font-bold text-foreground mb-2">{node.title}</h3>
                      <p className="text-sm text-muted-foreground font-medium leading-relaxed flex-grow">{node.desc}</p>
                      <div className="mt-6 pt-6 border-t border-primary/5 flex items-center text-primary/40 group-hover:text-primary transition-colors text-[10px] font-bold uppercase tracking-widest">
                        Launch <ArrowRight className="h-3 w-3 ml-2" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* TRUST BANNER */}
        <section className="w-full py-24 px-6 border-t border-primary/5 bg-muted/20">
            <div className="max-w-4xl mx-auto text-center space-y-8">
                <Gavel className="h-10 w-10 text-primary/20 mx-auto" />
                <p className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight leading-snug italic">
                    "Redefining access to justice with <span className="text-primary">Reliable AI Technology.</span>"
                </p>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Nyaya Sahayak Identity Node</p>
            </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}