
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useState, useEffect } from "react";
import { 
  ArrowRight, 
  Loader2, 
  ShieldCheck, 
  Sparkles,
  BrainCircuit,
  FileSearch,
  Zap,
  BadgeCheck,
  Globe,
  Award,
  Mic,
  Scale
} from "lucide-react";
import { Logo } from "@/components/logo";
import { useAuth } from "@/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { Footer } from "@/components/footer";
import { PublicHeader } from "@/components/public-header";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

const TricolorBackground = () => {
  return (
    <div className="tricolor-pulse">
      <div className="tricolor-glow bg-[#FF9933]" style={{ top: '-10%', left: '10%' }}></div>
      <div className="tricolor-glow bg-[#FFFFFF]" style={{ top: '30%', left: '40%', width: '800px', opacity: 0.05 }}></div>
      <div className="tricolor-glow bg-[#128807]" style={{ bottom: '-10%', right: '10%' }}></div>
      
      {/* Ashoka Chakra Watermark */}
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

const ForensicLabel = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={cn("flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.3em] text-primary", className)}>
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
  const fullText = 'Sahayak';

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
    <div className="flex flex-col min-h-screen bg-background selection:bg-primary/10 overflow-x-hidden text-left font-body relative">
      <PublicHeader />
      
      <div className="flex-1 flex flex-col items-center p-4 py-8 sm:py-12 relative">
        <TricolorBackground />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-4xl relative z-10"
        >
          <Card className="overflow-hidden border-primary/10 shadow-2xl bg-card/40 backdrop-blur-3xl rounded-[2.5rem] relative group">
            <CardContent className="flex flex-col items-center p-6 sm:p-12 text-center relative z-10">
              <div className="relative mb-8">
                <div className="absolute -inset-4 rounded-full bg-primary/10 animate-pulse group-hover:scale-110 transition-transform"></div>
                <div className="bg-white rounded-full p-2 shadow-2xl relative z-10 border border-primary/10">
                    <Logo className="h-12 w-12 sm:h-16 sm:w-16 border-none p-0" />
                </div>
              </div>

              <div className="space-y-6 mb-10">
                <Badge variant="outline" className="border-primary/20 text-primary px-5 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.3em] bg-primary/5">
                    Terminal // NS-ALPH-4
                </Badge>
                
                <h1 className="text-3xl sm:text-5xl font-black font-headline tracking-tighter leading-none text-foreground">
                  Nyaya <span className="bg-gradient-to-r from-primary via-orange-400 to-accent bg-clip-text text-transparent italic">{text}</span>
                  <span className="animate-pulse ml-1 text-primary">|</span>
                </h1>
                
                <div className="max-w-xl mx-auto space-y-4">
                    <p className="text-base sm:text-lg font-bold text-muted-foreground tracking-tight leading-tight">
                        AI-Powered Legal Intelligence for the Modern Indian Citizen.
                    </p>
                    <p className="text-[11px] sm:text-xs text-muted-foreground font-medium leading-relaxed max-w-lg mx-auto opacity-80">
                        Bridging the profound gap between complex judicial protocols and citizen rights with precise forensic tools and high-fidelity procedural roadmaps.
                    </p>
                </div>
              </div>

              <div className="w-full max-w-xs space-y-6">
                {!loading ? (
                  <div className="space-y-3">
                    <Button 
                        asChild 
                        className="group w-full h-14 text-[10px] font-black shadow-2xl shadow-primary/20 transition-all rounded-2xl bg-primary text-white hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <Link href="/dashboard">
                            <span className="tracking-[0.2em] uppercase">Enter Dashboard</span>
                            <ArrowRight className="ml-3 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </Button>
                    <p className="text-[8px] font-black text-primary/40 uppercase tracking-[0.4em]">Institutional Access Active</p>
                  </div>
                ) : (
                  <Button disabled className="w-full h-14 rounded-2xl bg-primary/20 text-white border-primary/10">
                    <Loader2 className="h-4 w-4 animate-spin opacity-40 mr-2" /> 
                    <span className="text-[8px] uppercase tracking-[0.3em] font-black opacity-40">Syncing...</span>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Capability Matrix */}
        <div className="w-full max-w-5xl mt-24 space-y-12 px-4 relative z-10">
            <div className="flex flex-col items-center text-center space-y-3">
                <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20 px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.3em]">
                    Registry Capabilities
                </Badge>
                <h2 className="text-2xl sm:text-4xl font-black font-headline tracking-tighter text-foreground">Institutional <span className="text-primary italic">Sectors</span></h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {[
                    {
                        title: "Case Auditor",
                        desc: "Neural violation mapping with institutional precision.",
                        icon: BrainCircuit,
                        color: "text-primary",
                        bg: "bg-primary/5",
                        sector: "Sector: NS-V1"
                    },
                    {
                        title: "Document Risk",
                        desc: "Scanning legal instruments for hidden statutory liabilities.",
                        icon: FileSearch,
                        color: "text-accent",
                        bg: "bg-accent/5",
                        sector: "Sector: NS-D2"
                    },
                    {
                        title: "AI Roadmap",
                        desc: "Step-by-step navigation cycles for the judicial system.",
                        icon: Zap,
                        color: "text-orange-500",
                        bg: "bg-orange-500/5",
                        sector: "Sector: NS-Z4"
                    }
                ].map((item, idx) => (
                    <Card key={idx} className="glass p-6 rounded-[2rem] border-primary/10 text-left group hover:border-primary/30 transition-all h-full shadow-xl">
                        <div className="flex justify-between items-start mb-6">
                            <div className={cn("p-3 rounded-xl transition-transform group-hover:scale-110 shadow-inner", item.bg, item.color)}>
                                <item.icon className="h-5 w-5" />
                            </div>
                            <span className="text-[8px] font-black text-muted-foreground/40 uppercase tracking-widest">{item.sector}</span>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-sm font-black uppercase tracking-tight text-foreground">{item.title}</h3>
                            <p className="text-[11px] text-muted-foreground font-medium leading-relaxed opacity-80">
                                {item.desc}
                            </p>
                        </div>
                    </Card>
                ))}
            </div>
        </div>

        {/* Vision Section */}
        <div className="w-full max-w-4xl mt-24 space-y-16 px-4 pb-20 relative z-10">
            <section className="grid lg:grid-cols-2 gap-16 items-center">
                <div className="space-y-8">
                    <div className="space-y-3">
                        <ForensicLabel>Protocol: Statutory-Mandate</ForensicLabel>
                        <h2 className="text-2xl sm:text-4xl font-black font-headline tracking-tighter leading-tight text-foreground">Democratizing <br /> <span className="text-primary italic">Intelligence</span></h2>
                    </div>
                    <div className="space-y-8">
                        <div className="flex gap-5 items-start group">
                            <div className="p-3 rounded-2xl bg-primary/5 text-primary shrink-0 border border-primary/10 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                                <Globe className="h-4 w-4" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-xs font-black tracking-tight uppercase">The Vision</h3>
                                <p className="text-[11px] text-muted-foreground leading-relaxed font-medium">Access to justice as an inherent citizen right, optimized through forensic neural technology.</p>
                            </div>
                        </div>
                        <div className="flex gap-5 items-start group">
                            <div className="p-3 rounded-2xl bg-accent/5 text-accent shrink-0 border border-accent/10 group-hover:bg-accent group-hover:text-white transition-all shadow-sm">
                                <Award className="h-4 w-4" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-xs font-black tracking-tight uppercase">Institutional Trust</h3>
                                <p className="text-[11px] text-muted-foreground leading-relaxed font-medium">Every output synchronized with current judicial amendments for 100% forensic transparency.</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <Card className="glass rounded-[2.5rem] p-1 border-primary/10 shadow-2xl overflow-hidden">
                    <div className="bg-muted/30 h-[480px] rounded-[2.2rem] flex flex-col items-center relative overflow-hidden">
                        <div className="absolute inset-0 flex flex-col p-8 text-left space-y-5">
                            <div className="flex items-center justify-between border-b border-primary/10 pb-4 mb-2">
                                <div className="flex items-center gap-2.5">
                                    <BadgeCheck className="h-5 w-5 text-primary" />
                                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">Registry Overview</span>
                                </div>
                                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                            </div>

                            <ScrollArea className="flex-1 pr-4 custom-scrollbar">
                                <div className="prose dark:prose-invert prose-xs max-w-none space-y-8 pb-8">
                                    <p className="text-xs font-black font-headline tracking-tighter leading-tight italic text-foreground border-l-4 border-primary pl-5 py-2 bg-primary/5 rounded-r-2xl">
                                        "Engineering Dignity through Precise Neural Intelligence. We are deconstructing the judicial barriers of the past."
                                    </p>

                                    <div className="space-y-3">
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                            <Zap className="h-3 w-3" /> Era of Digital Justice
                                        </h4>
                                        <p className="text-[11px] text-muted-foreground font-medium leading-relaxed">
                                            Nyaya Sahayak represents a revolutionary leap in the democratization of legal intelligence within the Indian judicial ecosystem. Our platform leverages state-of-the-art neural processing to bridge the gap between complex protocols and everyday citizen needs.
                                        </p>
                                    </div>

                                    <div className="space-y-3">
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                            <Mic className="h-3 w-3" /> Voice Narration (NS-V1)
                                        </h4>
                                        <p className="text-[11px] text-muted-foreground font-medium leading-relaxed">
                                            Speak directly to the terminal. Our engine performs a deep-layer audit, identifying statutory violations and providing word-for-word transcriptions alongside simplified summaries.
                                        </p>
                                    </div>

                                    <div className="space-y-3">
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                            <FileSearch className="h-3 w-3" /> Document Audit (NS-D2)
                                        </h4>
                                        <p className="text-[11px] text-muted-foreground font-medium leading-relaxed">
                                            OCR-powered scanners provide multi-stage forensic audits of contracts and notices, highlighting critical deadlines and mandated procedural actions instantly.
                                        </p>
                                    </div>

                                    <div className="space-y-3">
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                            <BrainCircuit className="h-3 w-3" /> Strength Matrix
                                        </h4>
                                        <p className="text-[11px] text-muted-foreground font-medium leading-relaxed">
                                            Probabilistic engines evaluate litigation by analyzing precedents and evidence, providing a comprehensive risk score and recommended strategy.
                                        </p>
                                    </div>

                                    <div className="pt-6 border-t border-primary/5 text-center">
                                        <p className="text-[8px] font-black uppercase tracking-[0.4em] text-muted-foreground/40">End Transmission // Active</p>
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
