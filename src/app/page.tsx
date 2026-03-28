
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useState, useEffect } from "react";
import { 
  ArrowRight, 
  Loader2, 
  ShieldCheck, 
  BrainCircuit,
  FileSearch,
  Zap,
  Globe,
  Scale,
  ExternalLink,
  Activity,
  Sparkles,
  Command,
  ChevronRight
} from "lucide-react";
import { Logo } from "@/components/logo";
import { useAuth } from "@/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { PublicHeader } from "@/components/public-header";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Footer } from "@/components/footer";

const TricolorBackground = () => {
  return (
    <div className="tricolor-pulse">
      <div className="tricolor-glow bg-[#FF9933] top-[-10%] left-[10%]"></div>
      <div className="tricolor-glow bg-[#FFFFFF] top-[30%] left-[40%] w-[800px] opacity-[0.05]"></div>
      <div className="tricolor-glow bg-[#128807] bottom-[-10%] right-[10%]"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] pointer-events-none">
          <svg className="ashoka-rotate w-[600px] h-[600px] text-[#000080]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
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
      
      <div className="flex-1 flex flex-col items-center p-4 py-12 sm:py-20 relative">
        <TricolorBackground />
        
        {/* Hero Sector */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-5xl relative z-10 text-center space-y-10"
        >
          <div className="space-y-6">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex justify-center mb-8"
            >
              <div className="relative">
                <div className="absolute -inset-8 rounded-full bg-primary/10 blur-2xl animate-pulse"></div>
                <Logo className="h-28 w-24 sm:h-32 sm:w-32 relative z-10 shadow-2xl" priority />
              </div>
            </motion.div>

            <div className="flex flex-col items-center gap-4">
              <Badge variant="outline" className="h-9 px-6 rounded-full border-primary/20 text-primary bg-primary/5 font-black uppercase tracking-[0.3em] text-[10px] animate-in fade-in slide-in-from-bottom-2 duration-700">
                Institutional Terminal // NYAYASAHAYAK.IN
              </Badge>
              <h1 className="text-4xl sm:text-7xl font-black font-headline tracking-tighter leading-none text-foreground max-w-4xl mx-auto">
                Elite AI Legal Assistant for <span className="text-primary italic">Indian Citizens.</span>
              </h1>
            </div>

            <p className="text-lg sm:text-xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed opacity-80">
              High-fidelity neural forensics for deconstructing statutes and navigating the Indian judicial landscape.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            {!loading ? (
              <Button 
                asChild 
                className="h-16 px-10 text-xs font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/20 rounded-2xl active:scale-95 transition-all group overflow-hidden relative"
              >
                <Link href="/dashboard">
                  <span className="relative z-10">Initialize Dashboard</span>
                  <ArrowRight className="ml-3 h-4 w-4 relative z-10 transition-transform group-hover:translate-x-1" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </Link>
              </Button>
            ) : (
              <div className="h-16 flex items-center gap-3 px-10 bg-muted/20 rounded-2xl border border-primary/5">
                <Loader2 className="h-5 w-5 animate-spin text-primary opacity-40" />
                <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Syncing Registry...</span>
              </div>
            )}
            <Button variant="ghost" className="h-16 px-8 text-xs font-black uppercase tracking-widest rounded-2xl border border-primary/5 hover:bg-primary/5 active:scale-95 transition-all" asChild>
              <Link href="/about">Explore Mandate</Link>
            </Button>
          </div>

          <div className="pt-8 flex flex-wrap justify-center gap-8 opacity-40 grayscale group-hover:grayscale-0 transition-all duration-1000">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Real-time BNS Audit</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Secured Registry</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Digital India Sync</span>
            </div>
          </div>
        </motion.div>

        {/* Mandate Sector (SEO Rich) */}
        <div className="w-full max-w-6xl mt-32 space-y-24 px-4 relative z-10 text-left">
          <section className="grid lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5 space-y-8 sticky top-24">
              <div className="space-y-4">
                <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em]">
                  The Nyaya Sahayak Mandate
                </Badge>
                <h2 className="text-3xl sm:text-5xl font-black font-headline tracking-tighter leading-tight">
                  Democratizing <br />
                  <span className="text-primary italic">Legal Intelligence.</span>
                </h2>
              </div>
              <p className="text-sm sm:text-lg text-muted-foreground font-medium leading-relaxed">
                Nyaya Sahayak represents the definitive leap forward in AI-powered legal empowerment for the Indian citizenry. In a landscape where the judicial system is often perceived as a dense thicket of complex statutes and intimidating procedural protocols, our platform serves as a high-fidelity navigational beacon. We have engineered this ecosystem to bridge the gap between statutory complexity and the fundamental rights of every individual, providing mathematically precise forensic tools that were previously reserved for elite legal institutions.
              </p>
              <div className="p-6 rounded-[2rem] bg-primary/5 border border-primary/10 shadow-inner">
                <div className="flex items-center gap-4 text-primary">
                  <Command className="h-6 w-6" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em]">Protocol NS-ALPHA-4</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-12">
              <Card className="glass border-primary/10 rounded-[2.5rem] overflow-hidden shadow-2xl transition-all hover:border-primary/30">
                <CardContent className="p-8 sm:p-12 space-y-6">
                  <div className="flex items-center gap-4 text-primary mb-2">
                    <div className="p-3 rounded-2xl bg-primary/5">
                      <BrainCircuit className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black tracking-tight uppercase">Forensic Case Auditor Node</h3>
                  </div>
                  <p className="text-sm sm:text-base text-muted-foreground font-medium leading-relaxed">
                    At the core of the Nyaya Sahayak terminal is the Forensic Case Auditor. This neural engine is specifically trained on the nuances of the Bharatiya Nyaya Sanhita (BNS) and the Bharatiya Sakshya Adhiniyam (BSA). When a citizen narrates their legal problem, our AI performs a deep-layer deconstruction of the narrative, identifying potential statutory violations, mapping relevant sections of the law, and generating a professional case summary. This process transforms a confusing series of events into a structured legal dossier, empowering the user to approach law enforcement or legal counsel with absolute clarity and dignity.
                  </p>
                  <Button variant="ghost" className="p-0 font-black text-[10px] uppercase tracking-widest text-primary hover:bg-transparent" asChild>
                    <Link href="/dashboard/narrate">Initialize Narration <ChevronRight className="ml-1 h-3 w-3" /></Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="glass border-accent/10 rounded-[2.5rem] overflow-hidden shadow-2xl transition-all hover:border-accent/30">
                <CardContent className="p-8 sm:p-12 space-y-6">
                  <div className="flex items-center gap-4 text-accent mb-2">
                    <div className="p-3 rounded-2xl bg-accent/5">
                      <FileSearch className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black tracking-tight uppercase">Document Risk Scanner Protocol</h3>
                  </div>
                  <p className="text-sm sm:text-base text-muted-foreground font-medium leading-relaxed">
                    Furthermore, our Document Risk Scanner provides an institutional-grade audit of legal instruments. Whether it is a legal notice, a contract, or an FIR application, the AI node performs a comprehensive forensic scan to identify non-compliance markers, hidden liabilities, and critical procedural deadlines. By automating the risk assessment process, we ensure that no citizen is caught off-guard by the fine print of legal documentation. The system operates on a zero-trust architecture, ensuring that your sensitive data nodes are processed in isolated, transient environments within our secure judicial cloud.
                  </p>
                  <Button variant="ghost" className="p-0 font-black text-[10px] uppercase tracking-widest text-accent hover:bg-transparent" asChild>
                    <Link href="/dashboard/document-intelligence">Initialize Audit <ChevronRight className="ml-1 h-3 w-3" /></Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="glass border-orange-400/10 rounded-[2.5rem] overflow-hidden shadow-2xl transition-all hover:border-orange-400/30">
                <CardContent className="p-8 sm:p-12 space-y-6">
                  <div className="flex items-center gap-4 text-orange-500 mb-2">
                    <div className="p-3 rounded-2xl bg-orange-500/5">
                      <Zap className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black tracking-tight uppercase">Procedural Roadmap Intelligence Hub</h3>
                  </div>
                  <p className="text-sm sm:text-base text-muted-foreground font-medium leading-relaxed">
                    The Procedural Roadmap Intelligence is another critical pillar of our mission. Navigating the Bharatiya Nagarik Suraksha Sanhita (BNSS) requires a step-by-step understanding of judicial cycles. Nyaya Sahayak provides dynamic, personalized roadmaps that guide users through the intricacies of filing complaints, understanding writ jurisdictions under Articles 32 and 226, and maintaining proper courtroom decorum. We are building a more transparent and equitable legal landscape for 1.4 billion people, ensuring that technology serves as a bridge to justice rather than a barrier.
                  </p>
                  <Button variant="ghost" className="p-0 font-black text-[10px] uppercase tracking-widest text-orange-500 hover:bg-transparent" asChild>
                    <Link href="/dashboard/police-guide">Explore Guides <ChevronRight className="ml-1 h-3 w-3" /></Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* External Sector */}
          <section className="space-y-12 pb-20">
            <div className="flex flex-col items-center text-center space-y-3">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.3em]">
                External Connectivity
              </Badge>
              <h2 className="text-2xl sm:text-4xl font-black font-headline tracking-tighter text-foreground">Official Judicial Resources</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
              <a href="https://services.ecourts.gov.in/" target="_blank" rel="noopener noreferrer" className="group">
                <Card className="glass p-6 rounded-2xl border-primary/5 hover:border-primary/30 transition-all flex items-center justify-between shadow-lg active:scale-[0.98]">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-xl bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-inner">
                      <Globe className="h-5 w-5" />
                    </div>
                    <span className="font-bold text-sm">eCourts Services India</span>
                  </div>
                  <ExternalLink className="h-4 w-4 opacity-20 group-hover:opacity-100 transition-all" />
                </Card>
              </a>
              <a href="https://www.india.gov.in/" target="_blank" rel="noopener noreferrer" className="group">
                <Card className="glass p-6 rounded-2xl border-primary/5 hover:border-primary/30 transition-all flex items-center justify-between shadow-lg active:scale-[0.98]">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-xl bg-accent/5 text-accent group-hover:bg-accent group-hover:text-white transition-all shadow-inner">
                      <Scale className="h-5 w-5" />
                    </div>
                    <span className="font-bold text-sm">National Portal of India</span>
                  </div>
                  <ExternalLink className="h-4 w-4 opacity-20 group-hover:opacity-100 transition-all" />
                </Card>
              </a>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}
