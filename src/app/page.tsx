
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
  Fingerprint,
  Cpu,
  Activity,
  Globe,
  Award,
  BadgeCheck,
  Mic
} from "lucide-react";
import { Logo } from "@/components/logo";
import { useAuth } from "@/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { Footer } from "@/components/footer";
import { PublicHeader } from "@/components/public-header";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

const NeuralRain = () => {
  return (
    <div className="neural-rain opacity-[0.08]">
      {Array.from({ length: 40 }).map((_, i) => (
        <div
          key={i}
          className="rain-drop"
          style={{
            left: `${Math.random() * 100}%`,
            animationDuration: `${Math.random() * 2 + 2}s`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}
    </div>
  );
};

const ForensicLabel = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={cn("flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.3em] text-primary/60", className)}>
        <div className="h-1 w-1 rounded-full bg-primary animate-pulse" />
        {children}
    </div>
);

export default function WelcomePage() {
  const auth = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const fullText = 'Nyaya Sahayak';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isTyping) {
      if (text.length < fullText.length) {
        timeoutId = setTimeout(() => setText(fullText.slice(0, text.length + 1)), 150);
      } else {
        timeoutId = setTimeout(() => setIsTyping(false), 3000);
      }
    } else {
      timeoutId = setTimeout(() => {
        setText('');
        setIsTyping(true);
      }, 1000);
    }
    return () => clearTimeout(timeoutId);
  }, [text, isTyping]);

  return (
    <div className="flex flex-col min-h-screen bg-background selection:bg-primary/10 overflow-x-hidden text-left font-body">
      <PublicHeader />
      
      <div className="flex-1 flex flex-col items-center p-4 py-8 sm:py-12 relative">
        <NeuralRain />
        
        <div className="absolute top-0 left-1/4 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-primary/5 rounded-full blur-[100px] -z-10"></div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-4xl"
        >
          <Card className="overflow-hidden border-primary/5 shadow-xl bg-card/30 backdrop-blur-3xl rounded-3xl relative group">
            <CardContent className="flex flex-col items-center p-6 sm:p-12 text-center relative z-10">
              <motion.div 
                className="relative mb-6"
                whileHover={{ scale: 1.02 }}
              >
                <div className="bg-white rounded-full p-1.5 shadow-lg relative z-10 border border-primary/5">
                    <Logo className="h-12 w-12 sm:h-16 sm:w-16 border-none p-0" />
                </div>
              </motion.div>

              <div className="space-y-6 mb-10">
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 px-4 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.2em]">
                    Terminal Node // NS-ALPHA
                </Badge>
                
                <h1 className="text-3xl sm:text-5xl font-black font-headline tracking-tighter leading-none text-foreground">
                  Nyaya <span className="text-primary italic">{text}</span>
                  <span className="animate-pulse ml-1 text-primary">|</span>
                </h1>
                
                <div className="max-w-xl mx-auto space-y-4">
                    <p className="text-base sm:text-lg font-bold text-muted-foreground tracking-tight leading-tight">
                        AI-Powered Legal Intelligence for the Modern Citizen.
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed max-w-lg mx-auto opacity-80">
                        Bridging the gap between complex judicial protocols and citizen rights with precise forensic tools and procedural roadmaps.
                    </p>
                </div>
              </div>

              <div className="w-full max-w-xs space-y-6">
                {!loading ? (
                  <div className="space-y-3">
                    <Button 
                        asChild 
                        className="group w-full h-12 text-[10px] font-black shadow-xl shadow-primary/20 transition-all rounded-xl bg-primary text-white"
                    >
                        <Link href="/dashboard">
                            <span className="tracking-[0.2em] uppercase">Enter Dashboard</span>
                            <ArrowRight className="ml-3 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </Button>
                    <p className="text-[8px] font-black text-primary/40 uppercase tracking-[0.3em]">Institutional Access Active</p>
                  </div>
                ) : (
                  <Button disabled className="w-full h-12 rounded-xl bg-primary/20 text-white border-primary/10">
                    <Loader2 className="h-4 w-4 animate-spin opacity-40 mr-2" /> 
                    <span className="text-[8px] uppercase tracking-[0.3em] font-black opacity-40">Syncing Node...</span>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Scaled Down Capability Grid */}
        <div className="w-full max-w-5xl mt-20 space-y-12 px-4">
            <div className="flex flex-col items-center text-center space-y-3">
                <Badge variant="outline" className="border-primary/20 text-primary px-3 py-0.5 rounded-full text-[8px] font-black uppercase tracking-[0.3em]">
                    Registry Capabilities
                </Badge>
                <h2 className="text-2xl sm:text-4xl font-black font-headline tracking-tighter">Institutional <span className="text-primary italic">Nodes</span></h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {[
                    {
                        title: "Case Auditor",
                        desc: "Neural violation mapping with institutional precision.",
                        icon: BrainCircuit,
                        color: "text-blue-500",
                        bg: "bg-blue-500/5",
                    },
                    {
                        title: "Document Risk",
                        desc: "Scanning legal instruments for hidden statutory liabilities.",
                        icon: FileSearch,
                        color: "text-emerald-500",
                        bg: "bg-emerald-500/5",
                    },
                    {
                        title: "AI Roadmap",
                        desc: "Step-by-step navigation cycles for the judicial system.",
                        icon: Zap,
                        color: "text-amber-500",
                        bg: "bg-amber-500/5",
                    }
                ].map((item, idx) => (
                    <Card key={idx} className="glass p-6 rounded-2xl border-primary/5 text-left group hover:border-primary/20 transition-all h-full">
                        <div className={cn("p-3 rounded-xl w-fit mb-4 group-hover:scale-105 transition-transform", item.bg, item.color)}>
                            <item.icon className="h-5 w-5" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-sm font-black uppercase tracking-tight">{item.title}</h3>
                            <p className="text-xs text-muted-foreground font-medium leading-relaxed opacity-80">
                                {item.desc}
                            </p>
                        </div>
                    </Card>
                ))}
            </div>
        </div>

        {/* Institutional Summary - Refined Size */}
        <div className="w-full max-w-4xl mt-24 space-y-16 px-4 pb-20">
            <section className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <ForensicLabel>Protocol: Statutory-Mandate</ForensicLabel>
                        <h2 className="text-2xl sm:text-4xl font-black font-headline tracking-tighter leading-none text-foreground">Democratizing <br /> <span className="text-primary italic">Intelligence</span></h2>
                    </div>
                    <div className="space-y-6">
                        <div className="flex gap-4 items-start">
                            <div className="p-2.5 rounded-xl bg-primary/5 text-primary shrink-0 border border-primary/10">
                                <Globe className="h-4 w-4" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-sm font-black tracking-tight uppercase">The Vision Node</h3>
                                <p className="text-xs text-muted-foreground leading-relaxed font-medium">Access to justice as a citizen right, optimized through forensic neural technology.</p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start">
                            <div className="p-2.5 rounded-xl bg-primary/5 text-primary shrink-0 border border-primary/10">
                                <Award className="h-4 w-4" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-sm font-black tracking-tight uppercase">Forensic Trust</h3>
                                <p className="text-xs text-muted-foreground leading-relaxed font-medium">Every output synchronized with current amendments for 100% transparency.</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <Card className="glass rounded-3xl p-1 border-primary/10 shadow-lg overflow-hidden">
                    <div className="bg-muted/20 h-[450px] rounded-[1.4rem] flex flex-col items-center relative overflow-hidden">
                        <div className="absolute inset-0 flex flex-col p-6 text-left space-y-4">
                            <div className="flex items-center justify-between border-b border-primary/10 pb-3 mb-2">
                                <div className="flex items-center gap-2">
                                    <BadgeCheck className="h-5 w-5 text-primary" />
                                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-primary">Registry Overview</span>
                                </div>
                                <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                            </div>

                            <ScrollArea className="flex-1 pr-2 custom-scrollbar">
                                <div className="prose dark:prose-invert prose-xs max-w-none space-y-6 pb-6">
                                    <p className="text-sm font-black font-headline tracking-tighter leading-tight italic text-foreground border-l-3 border-primary pl-4 py-1.5 bg-primary/5 rounded-r-lg">
                                        "Engineering Dignity through Precise Neural Intelligence."
                                    </p>

                                    <div className="space-y-3">
                                        <h4 className="text-[9px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                            <Zap className="h-3 w-3" /> Era of Digital Justice
                                        </h4>
                                        <p className="text-[11px] text-muted-foreground font-medium leading-relaxed">
                                            Nyaya Sahayak represents a revolutionary leap in the democratization of legal intelligence. Our platform leverages state-of-the-art neural processing to bridge the gap between complex protocols and everyday citizen needs.
                                        </p>
                                    </div>

                                    <div className="space-y-3">
                                        <h4 className="text-[9px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                            <Mic className="h-3 w-3" /> Voice Narration (NS-V1)
                                        </h4>
                                        <p className="text-[11px] text-muted-foreground font-medium leading-relaxed">
                                            Speak directly to the terminal. Our engine performs a deep-layer audit, identifying statutory violations and providing word-for-word transcriptions alongside simplified summaries.
                                        </p>
                                    </div>

                                    <div className="space-y-3">
                                        <h4 className="text-[9px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                            <FileSearch className="h-3 w-3" /> Document Audit (NS-D2)
                                        </h4>
                                        <p className="text-[11px] text-muted-foreground font-medium leading-relaxed">
                                            OCR-powered scanners provide multi-stage forensic audits of contracts and notices, highlighting critical deadlines and mandated procedural actions instantly.
                                        </p>
                                    </div>

                                    <div className="space-y-3">
                                        <h4 className="text-[9px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                            <BrainCircuit className="h-3 w-3" /> Strength Matrix
                                        </h4>
                                        <p className="text-[11px] text-muted-foreground font-medium leading-relaxed">
                                            Probabilistic engines evaluate litigation by analyzing precedents and evidence, providing a comprehensive risk score and recommended strategy.
                                        </p>
                                    </div>

                                    <div className="space-y-3">
                                        <h4 className="text-[9px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                            <Fingerprint className="h-3 w-3" /> Technical Sovereignty
                                        </h4>
                                        <p className="text-[11px] text-muted-foreground font-medium leading-relaxed">
                                            User data is encrypted using AES-256 and tunneled through TLS 1.3. We operate on a 'Zero-Knowledge' commitment, fully compliant with the DPDP Act 2023.
                                        </p>
                                    </div>

                                    <div className="pt-4 border-t border-primary/5 text-center">
                                        <p className="text-[7px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">End Transmission // Node Active</p>
                                    </div>
                                </div>
                            </ScrollArea>
                        </div>
                    </div>
                </Card>
            </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}
