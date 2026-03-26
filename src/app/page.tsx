
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
  BadgeCheck
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
    <div className={cn("flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.4em] text-primary/60", className)}>
        <div className="h-1 w-1 rounded-full bg-primary animate-pulse" />
        {children}
    </div>
);

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
    <div className="flex flex-col min-h-screen bg-background selection:bg-primary/10 overflow-x-hidden text-left font-body">
      <PublicHeader />
      
      <div className="flex-1 flex flex-col items-center p-4 py-12 sm:py-16 relative">
        <NeuralRain />
        
        {/* Ambient Forensic Nodes */}
        <div className="absolute top-0 left-1/4 w-[400px] sm:w-[800px] h-[400px] sm:h-[800px] bg-primary/5 rounded-full blur-[120px] -z-10"></div>
        <div className="absolute bottom-0 right-1/4 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-accent/5 rounded-full blur-[100px] -z-10 [animation-delay:2s]"></div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-5xl"
        >
          <Card className="overflow-hidden border-primary/5 shadow-[0_50px_100px_rgba(0,0,0,0.1)] bg-card/30 backdrop-blur-3xl rounded-[3.5rem] relative group">
            <div className="absolute top-0 right-0 p-12 opacity-[0.01] pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                <Landmark className="h-96 w-96" />
            </div>
            
            <CardContent className="flex flex-col items-center p-8 sm:p-12 text-center relative z-10">
              <motion.div 
                className="relative mb-10"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <div className="absolute -inset-6 rounded-full bg-primary/5 animate-pulse [animation-duration:4s]"></div>
                <div className="relative p-1 rounded-full bg-gradient-to-tr from-primary/20 via-accent/20 to-blue-400/20">
                    <div className="bg-white rounded-full p-2 shadow-2xl relative z-10">
                        <Logo className="h-16 w-16 sm:h-20 sm:w-20 border-none p-0" />
                    </div>
                </div>
              </motion.div>

              <div className="space-y-8 mb-12">
                <div className="flex flex-col items-center gap-4">
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 px-6 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] shadow-inner">
                        Node: Terminal-Entry // NS-ALPHA
                    </Badge>
                </div>
                
                <h1 className="text-5xl sm:text-6xl font-black font-headline tracking-tighter leading-none text-foreground">
                  Nyaya <span className="text-primary italic">Sahayak</span>
                </h1>
                
                <div className="max-w-2xl mx-auto space-y-6">
                    <p className="text-lg sm:text-xl font-bold text-muted-foreground tracking-tight leading-tight">
                        The pinnacle of <span className="text-foreground">AI-Powered Legal Intelligence</span> engineered for the modern Indian citizen.
                    </p>
                    <div className="h-px w-24 bg-gradient-to-r from-transparent via-primary/30 to-transparent mx-auto"></div>
                    <p className="text-sm sm:text-base text-muted-foreground font-medium leading-relaxed max-w-xl mx-auto opacity-80">
                        Bridging the gap between complex judicial protocols and citizen rights with mathematically precise forensic auditing tools and high-fidelity procedural roadmaps.
                    </p>
                </div>
              </div>

              <div className="w-full max-w-md space-y-8">
                {!loading ? (
                  <div className="space-y-4">
                    <Button 
                        asChild 
                        size="lg" 
                        className="group w-full h-16 text-xs font-black shadow-3xl shadow-primary/20 transition-all duration-500 active:scale-[0.98] rounded-2xl bg-primary text-white hover:shadow-primary/40 relative overflow-hidden"
                    >
                        <Link href="/dashboard">
                            <span className="relative z-10 tracking-[0.3em] uppercase">Initialize Terminal Node</span>
                            <ArrowRight className="relative z-10 ml-4 h-5 w-5 transition-transform group-hover:translate-x-2" />
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                        </Link>
                    </Button>
                    <p className="text-[9px] font-black text-primary/40 uppercase tracking-[0.5em]">Secure Registry Access Required</p>
                  </div>
                ) : (
                  <Button 
                    disabled
                    size="lg" 
                    className="w-full h-16 rounded-2xl bg-primary/20 text-white border-primary/10"
                  >
                    <span className="flex items-center gap-4">
                      <Loader2 className="h-5 w-5 animate-spin opacity-40" /> 
                      <span className="text-[10px] uppercase tracking-[0.4em] font-black opacity-40">Syncing Registry Nodes...</span>
                    </span>
                  </Button>
                )}
                
                <div className="flex items-center justify-center gap-8 pt-4">
                    <div className="flex flex-col items-center gap-2">
                        <Lock className="h-4 w-4 text-primary/40" />
                        <span className="text-[8px] font-black text-muted-foreground/40 uppercase tracking-widest">AES-256 Vault</span>
                    </div>
                    <div className="h-8 w-px bg-primary/10"></div>
                    <div className="flex flex-col items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-primary/40" />
                        <span className="text-[8px] font-black text-muted-foreground/40 uppercase tracking-widest">TLS 1.3 Active</span>
                    </div>
                    <div className="h-8 w-px bg-primary/10"></div>
                    <div className="flex flex-col items-center gap-2">
                        <Activity className="h-4 w-4 text-primary/40" />
                        <span className="text-[8px] font-black text-muted-foreground/40 uppercase tracking-widest">99.8% Uptime</span>
                    </div>
                </div>
              </div>
            </CardContent>
            <div className="h-1 w-full bg-gradient-to-r from-primary/20 via-accent/40 to-blue-400/20"></div>
          </Card>
        </motion.div>

        {/* High-Fidelity Capability Grid */}
        <div className="w-full max-w-6xl mt-32 space-y-20 px-4 sm:px-6">
            <div className="flex flex-col items-center text-center space-y-4">
                <Badge variant="outline" className="border-primary/20 text-primary px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.4em]">
                    Sector: Capabilities
                </Badge>
                <h2 className="text-4xl sm:text-6xl font-black font-headline tracking-tighter leading-none">Institutional <span className="text-primary italic">Intelligence</span></h2>
                <div className="h-1 w-12 bg-primary/20 rounded-full mt-4"></div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                {[
                    {
                        title: "Forensic Case Auditor",
                        desc: "Neural narrative reconstruction and statutory violation mapping with institutional precision.",
                        icon: BrainCircuit,
                        color: "text-blue-500",
                        bg: "bg-blue-500/5",
                        border: "border-blue-500/10",
                        points: ["IPC/BNSS Cross-Referencing", "Jurisdictional Audit"]
                    },
                    {
                        title: "Document Risk Node",
                        desc: "Deep-layer scanning of legal instruments to detect hidden statutory liabilities and deadlines.",
                        icon: FileSearch,
                        color: "text-emerald-500",
                        bg: "bg-emerald-500/5",
                        border: "border-emerald-500/10",
                        points: ["Statutory Compliance Check", "Risk Mitigation Mapping"]
                    },
                    {
                        title: "Procedural Roadmap",
                        desc: "AI-optimized navigation cycles for the Indian judicial system with real-time Etiquette guidance.",
                        icon: Zap,
                        color: "text-amber-500",
                        bg: "bg-amber-500/5",
                        border: "border-amber-500/10",
                        points: ["Milestone Tracking", "Protocol Optimization"]
                    }
                ].map((item, idx) => (
                    <motion.div 
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                    >
                        <Card className={cn("glass p-10 rounded-[3rem] border-primary/5 hover:border-primary/30 transition-all duration-700 text-left group hover:shadow-3xl relative overflow-hidden h-full")}>
                            <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-110 transition-transform duration-700">
                                <item.icon className="h-32 w-32" />
                            </div>
                            <div className={cn("p-5 rounded-2xl w-fit mb-10 shadow-inner group-hover:scale-110 transition-transform duration-700 ring-1 ring-white/10", item.bg, item.color)}>
                                <item.icon className="h-8 w-8" />
                            </div>
                            <div className="space-y-4 relative z-10">
                                <h3 className="text-2xl font-black tracking-tight leading-none uppercase">{item.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed font-medium opacity-80 min-h-[4rem]">
                                    {item.desc}
                                </p>
                                <div className="pt-6 space-y-3">
                                    {item.points.map((pt, i) => (
                                        <div key={i} className="flex items-center gap-3 text-[10px] font-black text-primary/60 uppercase tracking-widest">
                                            <div className="h-1 w-1 rounded-full bg-primary/40" />
                                            {pt}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>

        {/* Editorial Mandate Node */}
        <div className="w-full max-w-5xl mt-40 space-y-32 px-6 pb-32">
            <section className="grid lg:grid-cols-2 gap-20 items-center">
                <motion.div 
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="space-y-10"
                >
                    <div className="space-y-4">
                        <ForensicLabel>Protocol: Statutory-Mandate</ForensicLabel>
                        <h2 className="text-4xl sm:text-6xl font-black font-headline tracking-tighter leading-none">Democratizing <br /> <span className="text-primary italic">Intelligence</span></h2>
                    </div>
                    <div className="space-y-8">
                        <div className="flex gap-6 items-start">
                            <div className="p-4 rounded-2xl bg-primary/5 text-primary shrink-0 border border-primary/10">
                                <Globe className="h-6 w-6" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-black tracking-tight">The Vision Protocol</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed font-medium">Access to justice should not be a privilege of the elite. Technology serves as the ultimate equalizer in the Indian judicial ecosystem.</p>
                            </div>
                        </div>
                        <div className="flex gap-6 items-start">
                            <div className="p-4 rounded-2xl bg-primary/5 text-primary shrink-0 border border-primary/10">
                                <Award className="h-6 w-6" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-black tracking-tight">Institutional Trust</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed font-medium">Every AI output is audited against current amendments and accompanied by statutory citations for 100% forensic transparency.</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
                
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative"
                >
                    <div className="absolute -inset-10 bg-primary/5 rounded-full blur-[100px] animate-pulse"></div>
                    <Card className="glass rounded-[3.5rem] p-1 border-primary/10 shadow-3xl relative z-10 overflow-hidden">
                        <div className="bg-muted/30 min-h-[600px] rounded-[3.2rem] flex flex-col items-center relative group overflow-hidden">
                            <Logo className="h-48 w-48 opacity-[0.05] grayscale group-hover:scale-110 transition-transform duration-1000 mt-12" />
                            
                            <div className="absolute inset-0 flex flex-col p-8 sm:p-12 text-left space-y-6">
                                <div className="flex items-center justify-between border-b border-primary/10 pb-4 mb-4">
                                    <div className="flex items-center gap-3">
                                        <BadgeCheck className="h-8 w-8 text-primary" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Registry Certified Overview</span>
                                    </div>
                                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                                </div>

                                <ScrollArea className="flex-1 pr-4 custom-scrollbar">
                                    <div className="prose dark:prose-invert prose-sm max-w-none space-y-8 pb-10">
                                        <p className="text-xl font-black font-headline tracking-tighter leading-tight italic text-foreground border-l-4 border-primary pl-6 py-2 bg-primary/5 rounded-r-xl">
                                            "Engineering Dignity through Precise Neural Legal Intelligence. We are deconstructing the judicial barriers of the past."
                                        </p>

                                        <div className="space-y-4">
                                            <h4 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                                <Zap className="h-3 w-3" /> The Era of Digital Justice
                                            </h4>
                                            <p className="text-muted-foreground font-medium leading-relaxed">
                                                Nyaya Sahayak represents a revolutionary leap in the democratization of legal intelligence within the Indian judicial ecosystem. Founded on the principle that justice should not be a commodity reserved for those with extensive resources, our platform leverages state-of-the-art neural processing to bridge the profound gap between complex statutory protocols and the everyday needs of the Indian citizen. At its core, Nyaya Sahayak is an institutional forensic terminal—a sophisticated digital node engineered to deconstruct the intricacies of the law into actionable, high-fidelity guidance.
                                            </p>
                                        </div>

                                        <div className="space-y-4">
                                            <h4 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                                <Mic className="h-3 w-3" /> Neural Voice Narration (Node NS-V1)
                                            </h4>
                                            <p className="text-muted-foreground font-medium leading-relaxed">
                                                One of our primary pillars of intelligence is the Neural Voice Narrator. This system transforms natural speech into structured forensic reports. By speaking directly to the terminal, users can narrate their legal grievances in their native tongue. Our engine then performs a deep-layer audit, identifying relevant sections of the Indian Penal Code (IPC) or the newly enacted Bharatiya Nyaya Sanhita (BNS), providing a word-for-word transcription alongside a simplified layman's summary. This removes the primary barrier to entry for many citizens: the ability to articulate a legal problem in formal statutory terms.
                                            </p>
                                        </div>

                                        <div className="space-y-4">
                                            <h4 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                                <FileSearch className="h-3 w-3" /> Document Risk Node (Node NS-D2)
                                            </h4>
                                            <p className="text-muted-foreground font-medium leading-relaxed">
                                                In a landscape where legal instruments are often laden with opaque clauses and hidden liabilities, our OCR-powered scanner provides a multi-stage forensic audit. By uploading a contract, notice, or petition, citizens receive an instantaneous breakdown of potential risks, critical deadlines, and mandated procedural actions. This node ensures that no individual is ever forced to sign or respond to a document they do not fully comprehend, effectively mitigating the power imbalance inherent in many legal transactions.
                                            </p>
                                        </div>

                                        <div className="space-y-4">
                                            <h4 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                                <BrainCircuit className="h-3 w-3" /> Case Strength Matrix
                                            </h4>
                                            <p className="text-muted-foreground font-medium leading-relaxed">
                                                The third pillar of our intelligence suite is the Case Strength Matrix. This probabilistic assessment engine evaluates ongoing or potential litigation by analyzing historical precedents, evidence availability, and jurisdictional factors. The resulting strength score is not merely a number; it is accompanied by a comprehensive list of risk indicators and recommended strategies to improve the case's standing. This allows citizens to make informed decisions about whether to pursue litigation or seek alternative dispute resolution, potentially saving thousands of hours and significant financial resources.
                                            </p>
                                        </div>

                                        <div className="space-y-4">
                                            <h4 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                                <StepForward className="h-3 w-3" /> Procedural Roadmap Protocols
                                            </h4>
                                            <p className="text-muted-foreground font-medium leading-relaxed">
                                                The Indian judicial complex is notoriously difficult to navigate, with a labyrinth of filing requirements, court etiquette, and jurisdictional nuances. Nyaya Sahayak generates personalized, step-by-step navigation cycles that guide the user from the initial police complaint to the final courtroom decree. These roadmaps are dynamic, updating in real-time as new information becomes available, and are paired with extensive guides on courtroom decorum and police interaction protocols.
                                            </p>
                                        </div>

                                        <div className="space-y-4">
                                            <h4 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                                <Fingerprint className="h-3 w-3" /> Technical Sovereignty & Security
                                            </h4>
                                            <p className="text-muted-foreground font-medium leading-relaxed">
                                                Security and data sovereignty are the cornerstones of our operational protocol. We operate on a 'Zero-Knowledge' and 'Zero-Sale' commitment. User data, including sensitive voice narrations and legal documents, are encrypted at rest using industry-standard AES-256 algorithms and tunneled through TLS 1.3. We do not monetize user behavior or train global LLM models on private citizen data. We are fully compliant with the Digital Personal Data Protection Act (DPDP), 2023, ensuring that your data remains your sovereign asset, protected within our institutional vault.
                                            </p>
                                        </div>

                                        <div className="pt-6 border-t border-primary/5">
                                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 text-center">End of Transmission // Node Active</p>
                                        </div>
                                    </div>
                                </ScrollArea>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            </section>

            {/* Terminal Activation Block */}
            <section className="text-center pt-10">
                <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="p-12 sm:p-24 rounded-[4rem] bg-primary text-white shadow-[0_50px_100px_rgba(var(--primary),0.3)] relative overflow-hidden group"
                >
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary via-primary to-blue-600"></div>
                    
                    <div className="relative z-10 space-y-10">
                        <div className="flex justify-center">
                            <div className="bg-white/10 backdrop-blur-xl p-4 rounded-3xl border border-white/20 animate-bounce">
                                <Cpu className="h-10 w-10 text-white" />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h2 className="text-4xl sm:text-7xl font-black font-headline tracking-tighter leading-none">Initialize <span className="text-blue-200">Your Node</span></h2>
                            <p className="text-lg sm:text-2xl font-bold opacity-80 max-w-xl mx-auto italic tracking-tight">"Ready to Navigate the Law with Absolute Confidence?"</p>
                        </div>
                        <div className="flex justify-center">
                            <Button asChild size="lg" className="h-20 px-16 bg-white text-primary hover:bg-white/90 font-black uppercase tracking-[0.3em] text-[12px] rounded-[2rem] shadow-3xl transition-all active:scale-95 group/btn">
                                <Link href="/dashboard">
                                    Access Terminal <ArrowRight className="ml-4 h-6 w-6 transition-transform group-btn:translate-x-2" />
                                </Link>
                            </Button>
                        </div>
                        <div className="flex items-center justify-center gap-4 opacity-40">
                            <div className="h-1 w-1 rounded-full bg-white animate-ping"></div>
                            <span className="text-[9px] font-black uppercase tracking-[0.6em]">System: Active // Sync: Optimized</span>
                        </div>
                    </div>
                </motion.div>
            </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}
