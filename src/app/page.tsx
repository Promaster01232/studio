
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useState, useEffect } from "react";
import { 
  ArrowRight, 
  Landmark, 
  Loader2, 
  ShieldCheck, 
  Sparkles,
  BrainCircuit,
  FileSearch,
  Zap,
  Lock,
  StepForward,
  CheckCircle2,
  Fingerprint
} from "lucide-react";
import { Logo } from "@/components/logo";
import { useAuth } from "@/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { Footer } from "@/components/footer";
import { PublicHeader } from "@/components/public-header";
import { motion } from "framer-motion";

const NeuralRain = () => {
  return (
    <div className="neural-rain opacity-10">
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={i}
          className="rain-drop"
          style={{
            left: `${Math.random() * 100}%`,
            animationDuration: `${Math.random() * 3 + 2}s`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}
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
    <div className="flex flex-col min-h-screen bg-background selection:bg-primary/10 overflow-x-hidden">
      <PublicHeader />
      
      <div className="flex-1 flex flex-col items-center justify-center p-4 py-16 sm:py-24 relative">
        <NeuralRain />
        
        {/* Ambient Background Elements */}
        <div className="absolute top-0 left-1/4 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-primary/5 rounded-full blur-[80px] sm:blur-[150px] -z-10 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-[250px] sm:w-[500px] h-[250px] sm:h-[500px] bg-accent/5 rounded-full blur-[70px] sm:blur-[120px] -z-10 animate-pulse [animation-delay:2s]"></div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 50, damping: 20 }}
          className="w-full max-w-5xl"
        >
          <Card className="overflow-hidden border-none shadow-[0_50px_100px_rgba(0,0,0,0.15)] bg-card/40 backdrop-blur-3xl rounded-[3rem] relative">
            <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none">
                <Landmark className="h-64 w-64" />
            </div>
            
            <CardContent className="flex flex-col items-center p-8 sm:p-20 text-center relative z-10">
              <motion.div 
                className="relative mb-10 sm:mb-16"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="absolute -inset-6 rounded-full bg-primary/10 animate-ping [animation-duration:4s]"></div>
                <div className="absolute -inset-12 rounded-full bg-primary/5 animate-pulse [animation-duration:6s]"></div>
                <div className="relative p-2 rounded-full bg-gradient-to-tr from-primary via-accent to-blue-400">
                    <Logo className="h-28 w-24 sm:h-36 sm:w-36 shadow-2xl relative z-10 border-none bg-white rounded-full p-2" />
                </div>
              </motion.div>

              <div className="space-y-8 mb-12 sm:mb-16">
                <div className="flex items-center justify-center gap-3 text-primary">
                    <Sparkles className="h-5 w-5 animate-pulse" />
                    <span className="text-[11px] font-black uppercase tracking-[0.5em] leading-none">Institutional Forensic Terminal</span>
                </div>
                <h1 className="text-5xl sm:text-8xl font-black font-headline tracking-tighter leading-none text-foreground">
                  Nyaya Sahayak
                </h1>
                <p className="text-lg sm:text-2xl font-bold text-primary italic max-w-2xl mx-auto px-4 leading-tight">
                  The Pinnacle of AI-Powered Legal Empowerment <br className="hidden sm:block"/> for the Modern Indian Citizen.
                </p>
                
                <div className="max-w-3xl mx-auto space-y-6 text-sm sm:text-base text-muted-foreground font-medium leading-relaxed px-4">
                  <p>
                    Nyaya Sahayak is India's premier AI legal assistant, meticulously engineered to bridge the gap between complex judicial protocols and citizen needs. We provide high-fidelity forensic tools that empower you to navigate the law with absolute dignity.
                  </p>
                </div>
              </div>

              <div className="w-full max-w-xl space-y-6 px-4">
                {!loading ? (
                  <Button 
                    asChild 
                    size="lg" 
                    className="group w-full h-16 sm:h-20 text-lg font-black shadow-[0_20px_50px_rgba(var(--primary),0.3)] transition-all duration-500 active:scale-95 rounded-2xl bg-primary text-white hover:shadow-primary/50"
                  >
                    <Link href="/dashboard">
                      <span className="tracking-[0.1em] uppercase">Initialize Terminal</span>
                      <ArrowRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-2" />
                    </Link>
                  </Button>
                ) : (
                  <Button 
                    disabled
                    size="lg" 
                    className="w-full h-16 sm:h-20 text-lg font-black rounded-2xl bg-primary/50 text-white"
                  >
                    <span className="flex items-center gap-3">
                      <Loader2 className="h-6 w-6 animate-spin" /> 
                      <span className="text-xs uppercase tracking-widest font-black">Registry Sync active...</span>
                    </span>
                  </Button>
                )}
                
                <div className="flex items-center justify-center gap-6 pt-4">
                    <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-primary/60" />
                        <span className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest">AES-256 REST</span>
                    </div>
                    <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/20"></div>
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-primary/60" />
                        <span className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest">TLS 1.3 SECURE</span>
                    </div>
                </div>
              </div>
            </CardContent>
            <div className="h-2 w-full bg-gradient-to-r from-primary via-accent to-blue-400"></div>
          </Card>
        </motion.div>

        {/* Forensic Capabilities Section */}
        <div className="w-full max-w-6xl mt-32 space-y-16">
            <div className="text-center space-y-4 px-4">
                <h2 className="text-[11px] font-black uppercase tracking-[0.6em] text-primary">Institutional Capabilities</h2>
                <h3 className="text-4xl sm:text-6xl font-black tracking-tighter leading-none">Forensic AI Intelligence</h3>
                <p className="text-base sm:text-xl text-muted-foreground font-medium max-w-2xl mx-auto">Access elite legal nodes designed for statutory precision and speed.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 sm:px-6">
                <Card className="glass p-10 rounded-[3rem] border-primary/5 hover:border-primary/20 transition-all duration-500 text-left group hover:shadow-2xl">
                    <div className="bg-primary/10 p-5 rounded-2xl w-fit mb-8 text-primary shadow-inner group-hover:scale-110 transition-transform duration-700 ring-1 ring-primary/20">
                        <BrainCircuit className="h-8 w-8" />
                    </div>
                    <h2 className="text-2xl font-black tracking-tight mb-4 leading-none">Forensic Case Auditor</h2>
                    <p className="text-sm text-muted-foreground leading-relaxed font-medium mb-6">
                        Our neural engine processes complex legal narratives in milliseconds, identifying relevant IPC/BNSS sections with mathematically precise accuracy.
                    </p>
                    <ul className="text-[11px] font-black text-primary/80 space-y-3 uppercase tracking-widest">
                        <li className="flex items-center gap-3"><Fingerprint className="h-4 w-4" /> Narrative Reconstruction</li>
                        <li className="flex items-center gap-3"><Landmark className="h-4 w-4" /> Jurisdictional Mapping</li>
                    </ul>
                </Card>

                <Card className="glass p-10 rounded-[3rem] border-emerald-500/5 hover:border-emerald-500/20 transition-all duration-500 text-left group hover:shadow-2xl">
                    <div className="bg-emerald-500/10 p-5 rounded-2xl w-fit mb-8 text-emerald-600 shadow-inner group-hover:scale-110 transition-transform duration-700 ring-1 ring-emerald-500/20">
                        <FileSearch className="h-8 w-8" />
                    </div>
                    <h2 className="text-2xl font-black tracking-tight mb-4 leading-none">Document Risk Scanner</h2>
                    <p className="text-sm text-muted-foreground leading-relaxed font-medium mb-6">
                        Upload legal contracts for a deep-layer statutory audit. Detect hidden liabilities and potential procedural consequences instantly.
                    </p>
                    <ul className="text-[11px] font-black text-emerald-600/80 space-y-3 uppercase tracking-widest">
                        <li className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4" /> Clause Extraction</li>
                        <li className="flex items-center gap-3"><ShieldCheck className="h-4 w-4" /> Risk Mitigation</li>
                    </ul>
                </Card>

                <Card className="glass p-10 rounded-[3rem] border-amber-500/5 hover:border-amber-500/20 transition-all duration-500 text-left group hover:shadow-2xl">
                    <div className="bg-amber-500/10 p-5 rounded-2xl w-fit mb-8 text-amber-600 shadow-inner group-hover:scale-110 transition-transform duration-700 ring-1 ring-amber-500/20">
                        <Zap className="h-8 w-8" />
                    </div>
                    <h2 className="text-2xl font-black tracking-tight mb-4 leading-none">AI Procedural Roadmap</h2>
                    <p className="text-sm text-muted-foreground leading-relaxed font-medium mb-6">
                        Navigate the judicial system with an AI-generated personalized roadmap. Step-by-step guides on filing and etiquette with absolute clarity.
                    </p>
                    <ul className="text-[11px] font-black text-amber-600/80 space-y-3 uppercase tracking-widest">
                        <li className="flex items-center gap-3"><StepForward className="h-4 w-4" /> Actionable Milestones</li>
                        <li className="flex items-center gap-3"><Cpu className="h-4 w-4" /> Real-time Updates</li>
                    </ul>
                </Card>
            </div>
        </div>

        {/* Detailed Mission Section */}
        <div className="w-full max-w-4xl mt-40 space-y-24 px-6 pb-20">
            <section className="space-y-10">
                <div className="flex items-center gap-6 mb-4">
                    <div className="h-px flex-1 bg-primary/10"></div>
                    <span className="text-[11px] font-black uppercase tracking-[0.5em] text-primary">Statutory Mandate</span>
                    <div className="h-px flex-1 bg-primary/10"></div>
                </div>
                <h2 className="text-4xl sm:text-6xl font-black tracking-tighter text-center">Democratizing Intelligence</h2>
                <div className="grid md:grid-cols-2 gap-16 text-left">
                    <div className="space-y-6">
                        <h3 className="text-2xl font-black tracking-tight flex items-center gap-4">
                            <Logo className="h-8 w-8 border-none shadow-none" /> The Vision
                        </h3>
                        <p className="text-base text-muted-foreground font-medium leading-relaxed">
                            Access to justice should not be a privilege of the elite. Technology can serve as a powerful equalizer, building a more transparent and equitable judicial ecosystem for every citizen.
                        </p>
                    </div>
                    <div className="space-y-6">
                        <h3 className="text-2xl font-black tracking-tight flex items-center gap-4">
                            <ShieldCheck className="h-8 w-8 text-primary" /> Institutional Trust
                        </h3>
                        <p className="text-base text-muted-foreground font-medium leading-relaxed">
                            Every AI output is accompanied by relevant legal citations. We bridge the gap between automated intelligence and expert professional advice.
                        </p>
                    </div>
                </div>
            </section>

            <section className="text-center pt-10">
                <div className="p-12 sm:p-20 rounded-[4rem] bg-gradient-to-br from-primary via-accent to-blue-400 text-white shadow-3xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                    <div className="relative z-10 space-y-8">
                        <h2 className="text-4xl sm:text-7xl font-black tracking-tighter">Initialize Your Node</h2>
                        <p className="text-lg sm:text-2xl font-bold opacity-90 max-w-xl mx-auto italic">"Ready to Navigate the Law with Absolute Confidence?"</p>
                        <Button asChild size="lg" className="h-20 px-16 bg-white text-primary hover:bg-white/90 font-black uppercase tracking-[0.2em] text-sm rounded-2xl shadow-3xl transition-transform active:scale-95">
                            <Link href="/dashboard">Initialize Terminal <ArrowRight className="ml-4 h-6 w-6" /></Link>
                        </Button>
                    </div>
                </div>
            </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}
