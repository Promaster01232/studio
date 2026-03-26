"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useState, useEffect } from "react";
import { 
  ArrowRight, 
  Landmark, 
  Lightbulb, 
  Loader2, 
  Scale, 
  ShieldCheck, 
  Sparkles,
  BrainCircuit,
  FileSearch,
  MessageSquare,
  ShieldAlert,
  Zap,
  Globe,
  Lock,
  Cpu,
  Fingerprint,
  FileText
} from "lucide-react";
import { Logo } from "@/components/logo";
import { useAuth } from "@/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { Footer } from "@/components/footer";
import { motion, AnimatePresence } from "framer-motion";

const NeuralRain = () => {
  return (
    <div className="neural-rain opacity-10">
      {Array.from({ length: 25 }).map((_, i) => (
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
      <div className="flex-1 flex flex-col items-center justify-center p-4 py-16 sm:py-24 relative">
        <NeuralRain />
        
        {/* Ambient Background Elements */}
        <div className="absolute top-0 left-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-primary/5 rounded-full blur-[80px] sm:blur-[120px] -z-10 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-accent/5 rounded-full blur-[70px] sm:blur-[100px] -z-10 animate-pulse [animation-delay:2s]"></div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 50, damping: 20 }}
          className="w-full max-w-5xl"
        >
          <Card className="overflow-hidden border-none shadow-2xl bg-card/40 backdrop-blur-2xl rounded-[2.5rem] relative">
            <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none">
                <Landmark className="h-40 w-40" />
            </div>
            
            <CardContent className="flex flex-col items-center p-8 sm:p-16 text-center relative z-10">
              <motion.div 
                className="relative mb-8 sm:mb-12"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="absolute -inset-4 rounded-full bg-primary/10 animate-ping [animation-duration:3s]"></div>
                <div className="absolute -inset-8 rounded-full bg-primary/5 animate-pulse [animation-duration:4s]"></div>
                <Logo className="h-24 w-24 sm:h-32 sm:w-32 shadow-2xl relative z-10 border-none bg-white rounded-full p-2" />
              </motion.div>

              <div className="space-y-6 mb-10 sm:mb-12">
                <div className="flex items-center justify-center gap-2 text-primary">
                    <Sparkles className="h-4 w-4 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">Official Forensic Terminal</span>
                </div>
                <h1 className="text-4xl sm:text-7xl font-black font-headline tracking-tighter leading-tight text-foreground">
                  Nyaya Sahayak
                </h1>
                <p className="text-base sm:text-xl font-bold text-primary italic max-w-2xl mx-auto px-4">
                  The Pinnacle of AI-Powered Legal Empowerment for the Modern Indian Citizen.
                </p>
                
                <div className="max-w-3xl mx-auto space-y-6 text-sm sm:text-base text-muted-foreground font-medium leading-relaxed px-2 text-left sm:text-center">
                  <p>
                    Nyaya Sahayak is India's premier AI legal assistant, meticulously engineered to bridge the gap between complex judicial protocols and citizen needs. In an era where legal clarity is often obscured by jargon and procedural friction, our ecosystem provides high-fidelity forensic tools that empower you to navigate the law with absolute dignity and confidence.
                  </p>
                  <p className="hidden sm:block">
                    Our platform utilizes state-of-the-art neural processing nodes to deconstruct statutory clauses, analyze case narratives in real-time, and generate legally sound drafting nodes. Whether you are a citizen seeking justice, a business managing compliance, or a legal professional optimizing research, nyayasahayak.in serves as your institutional co-pilot in the Indian judicial landscape.
                  </p>
                </div>
              </div>

              <div className="w-full max-w-md space-y-4 px-4">
                <Button 
                  asChild={!loading} 
                  disabled={loading}
                  size="lg" 
                  className="group w-full h-16 text-lg font-black shadow-2xl transition-all duration-500 active:scale-95 rounded-2xl shadow-primary/20 hover:shadow-primary/40 bg-primary text-white"
                >
                  <Link href={loading ? "#" : (user ? "/dashboard" : "/login")}>
                    {loading ? (
                      <span className="flex items-center gap-3">
                        <Loader2 className="h-5 w-5 animate-spin" /> 
                        <span className="text-xs uppercase tracking-widest">Registry Sync...</span>
                      </span>
                    ) : (
                      <>
                        {user ? "Enter Dashboard Terminal" : "Initialize Enrollment Protocol"} 
                        <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1.5" />
                      </>
                    )}
                  </Link>
                </Button>
                
                <div className="flex items-center justify-center gap-4 pt-2">
                    <div className="flex items-center gap-1.5">
                        <Lock className="h-3 w-3 text-primary/60" />
                        <span className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-widest">AES-256 Encrypted</span>
                    </div>
                    <div className="h-1 w-1 rounded-full bg-muted-foreground/20"></div>
                    <div className="flex items-center gap-1.5">
                        <ShieldCheck className="h-3 w-3 text-primary/60" />
                        <span className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-widest">TLS 1.3 Secure</span>
                    </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Forensic Capabilities Section */}
        <div className="w-full max-w-6xl mt-24 space-y-12">
            <div className="text-center space-y-4">
                <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">Institutional Capabilities</h2>
                <h3 className="text-3xl sm:text-5xl font-black tracking-tighter leading-none">Forensic AI Intelligence Nodes</h3>
                <p className="text-sm sm:text-lg text-muted-foreground font-medium max-w-2xl mx-auto">Access a suite of elite legal tools designed for precision, speed, and accuracy.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 px-4 sm:px-6">
                <Card className="glass p-8 rounded-[2.5rem] border-primary/5 hover:border-primary/20 transition-all text-left group">
                    <div className="bg-primary/10 p-4 rounded-2xl w-fit mb-6 text-primary shadow-inner group-hover:scale-110 transition-transform duration-500">
                        <BrainCircuit className="h-7 w-7" />
                    </div>
                    <h2 className="text-xl font-black tracking-tight mb-4">Forensic Case Auditor</h2>
                    <p className="text-sm text-muted-foreground leading-relaxed font-medium mb-4">
                        Our neural engine processes complex legal narratives in milliseconds. By utilizing advanced LLM nodes, Nyaya Sahayak identifies relevant laws, sections (IPC, CrPC, BNSS), and jurisdictional requirements with mathematically precise accuracy.
                    </p>
                    <ul className="text-[11px] font-bold text-primary/80 space-y-2 uppercase tracking-wide">
                        <li className="flex items-center gap-2"><Fingerprint className="h-3 w-3" /> Narrative Reconstruction</li>
                        <li className="flex items-center gap-2"><Landmark className="h-3 w-3" /> Jurisdictional Mapping</li>
                    </ul>
                </Card>

                <Card className="glass p-8 rounded-[2.5rem] border-emerald-500/5 hover:border-emerald-500/20 transition-all text-left group">
                    <div className="bg-emerald-500/10 p-4 rounded-2xl w-fit mb-6 text-emerald-600 shadow-inner group-hover:scale-110 transition-transform duration-500">
                        <FileSearch className="h-7 w-7" />
                    </div>
                    <h2 className="text-xl font-black tracking-tight mb-4">Document Risk Scanner</h2>
                    <p className="text-sm text-muted-foreground leading-relaxed font-medium mb-4">
                        Upload any legal document for a deep-layer statutory audit. Our AI deconstructs complex clauses to reveal hidden legal risks, time-sensitive deadlines, and potential procedural consequences within the Indian legal framework.
                    </p>
                    <ul className="text-[11px] font-bold text-emerald-600/80 space-y-2 uppercase tracking-wide">
                        <li className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3" /> Clause Extraction</li>
                        <li className="flex items-center gap-2"><ShieldAlert className="h-3 w-3" /> Risk Mitigation</li>
                    </ul>
                </Card>

                <Card className="glass p-8 rounded-[2.5rem] border-amber-500/5 hover:border-amber-500/20 transition-all text-left group">
                    <div className="bg-amber-500/10 p-4 rounded-2xl w-fit mb-6 text-amber-600 shadow-inner group-hover:scale-110 transition-transform duration-500">
                        <Zap className="h-7 w-7" />
                    </div>
                    <h2 className="text-xl font-black tracking-tight mb-4">AI Procedural Roadmap</h2>
                    <p className="text-sm text-muted-foreground leading-relaxed font-medium mb-4">
                        Navigate the Indian judicial system with an AI-generated personalized roadmap. We provide step-by-step guides on filing FIRs, responding to legal notices, and understanding court etiquette with high-fidelity clarity.
                    </p>
                    <ul className="text-[11px] font-bold text-amber-600/80 space-y-2 uppercase tracking-wide">
                        <li className="flex items-center gap-2"><StepForward className="h-3 w-3" /> Actionable Milestones</li>
                        <li className="flex items-center gap-2"><Cpu className="h-3 w-3" /> Real-time Updates</li>
                    </ul>
                </Card>
            </div>
        </div>

        {/* Detailed Content for SEO Ranking */}
        <div className="w-full max-w-4xl mt-32 space-y-20 px-6">
            <section className="space-y-8">
                <div className="flex items-center gap-4 mb-2">
                    <div className="h-px flex-1 bg-primary/10"></div>
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Mission Node</span>
                    <div className="h-px flex-1 bg-primary/10"></div>
                </div>
                <h2 className="text-3xl sm:text-5xl font-black tracking-tighter text-center">Democratizing Legal Intelligence</h2>
                <div className="grid md:grid-cols-2 gap-12 text-left">
                    <div className="space-y-4">
                        <h3 className="text-xl font-black tracking-tight flex items-center gap-3">
                            <Logo className="h-6 w-6 border-none shadow-none" /> The Nyaya Sahayak Vision
                        </h3>
                        <p className="text-sm sm:text-base text-muted-foreground font-medium leading-relaxed">
                            Access to justice should not be a privilege of the elite. At Nyaya Sahayak, we believe that technology can serve as a powerful equalizer. By providing citizens with the tools to understand their rights and the procedures required to enforce them, we are building a more transparent and equitable judicial ecosystem for 1.4 billion people.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-xl font-black tracking-tight flex items-center gap-3">
                            <ShieldCheck className="h-6 w-6 text-primary" /> Institutional Reliability
                        </h3>
                        <p className="text-sm sm:text-base text-muted-foreground font-medium leading-relaxed">
                            Our system is built on a foundation of trust. Every AI-generated output is accompanied by relevant legal citations and recommendations for human advocate review. We bridge the gap between automated intelligence and expert professional advice, ensuring that you receive the most accurate navigational support possible.
                        </p>
                    </div>
                </div>
            </section>

            <section className="bg-primary/5 rounded-[3rem] p-8 sm:p-16 border border-primary/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-[0.03]">
                    <Fingerprint className="h-64 w-64" />
                </div>
                <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <h2 className="text-3xl sm:text-4xl font-black tracking-tighter leading-none">Your Data is a <br/><span className="text-primary italic">Sovereign Asset.</span></h2>
                        <p className="text-sm sm:text-base text-muted-foreground font-medium leading-relaxed">
                            Nyaya Sahayak operates on a strict **Zero-Sale Commitment**. Unlike traditional data-driven platforms, we do not monetize your personal legal narratives or document nodes. Your case details remain cryptographically secure within our institutional vault, used solely for providing you with real-time forensic insights.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <Badge variant="secondary" className="bg-white/50 border-primary/10 text-primary font-bold px-4 py-1 rounded-full uppercase text-[10px]">No Data Training</Badge>
                            <Badge variant="secondary" className="bg-white/50 border-primary/10 text-primary font-bold px-4 py-1 rounded-full uppercase text-[10px]">Isolated Sessions</Badge>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Card className="p-6 glass border-primary/10 text-center space-y-2 rounded-2xl">
                            <div className="text-2xl font-black text-primary">100%</div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Privacy Sync</p>
                        </Card>
                        <Card className="p-6 glass border-primary/10 text-center space-y-2 rounded-2xl">
                            <div className="text-2xl font-black text-primary">TLS 1.3</div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Encryption</p>
                        </Card>
                        <Card className="p-6 glass border-primary/10 text-center space-y-2 rounded-2xl">
                            <div className="text-2xl font-black text-primary">Zero</div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Knowledge Policy</p>
                        </Card>
                        <Card className="p-6 glass border-primary/10 text-center space-y-2 rounded-2xl">
                            <div className="text-2xl font-black text-primary">256-bit</div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Data Vault</p>
                        </Card>
                    </div>
                </div>
            </section>

            <section className="space-y-12">
                <div className="text-center space-y-4">
                    <h2 className="text-3xl sm:text-4xl font-black tracking-tighter">Why Choose Nyaya Sahayak?</h2>
                    <div className="h-1 w-20 bg-primary mx-auto rounded-full"></div>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-10 text-left">
                    <div className="flex gap-5">
                        <div className="shrink-0 pt-1">
                            <div className="bg-primary/10 p-3 rounded-xl"><ShieldCheck className="h-6 w-6 text-primary" /></div>
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-black text-lg">Institutional Trust Hub</h3>
                            <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed">
                                Every node on nyayasahayak.in is engineered for absolute reliability. We connect citizens with a strictly verified Advocate Registry, ensuring that you only receive professional advice from audited legal practitioners.
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-5">
                        <div className="shrink-0 pt-1">
                            <div className="bg-primary/10 p-3 rounded-xl"><Globe className="h-6 w-6 text-primary" /></div>
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-black text-lg">Multi-Lingual Protocol</h3>
                            <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed">
                                Justice should not have a language barrier. Our platform supports major Indian languages, allowing you to narrate problems and receive summaries in your native dialect, ensuring 100% comprehension of complex jargon.
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-5">
                        <div className="shrink-0 pt-1">
                            <div className="bg-primary/10 p-3 rounded-xl"><Landmark className="h-6 w-6 text-primary" /></div>
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-black text-lg">Real-time Case Registry</h3>
                            <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed">
                                Stay synchronized with the official eCourts database. Monitor hearing dates, court orders, and case status changes directly from your secure dashboard with automated notification nodes.
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-5">
                        <div className="shrink-0 pt-1">
                            <div className="bg-red-500/10 p-3 rounded-xl"><ShieldAlert className="h-6 w-6 text-red-600" /></div>
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-black text-lg">Emergency SOS Response</h3>
                            <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed">
                                Our integrated SOS node provides instantaneous access to national emergency helplines. In situations of immediate legal or physical threat, initiate the protocol for direct connection to authoritative assistance.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="text-center space-y-8 pb-20">
                <div className="p-12 rounded-[3rem] bg-gradient-to-br from-primary via-accent to-blue-400 text-white shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                    <div className="relative z-10 space-y-6">
                        <h2 className="text-3xl sm:text-5xl font-black tracking-tighter">Ready to Navigate the Law?</h2>
                        <p className="text-sm sm:text-lg font-bold opacity-90 max-w-xl mx-auto">Initialize your secure registry node today and access the pinnacle of AI legal intelligence.</p>
                        <Button asChild size="lg" className="h-16 px-12 bg-white text-primary hover:bg-white/90 font-black uppercase tracking-widest text-xs rounded-2xl shadow-2xl transition-transform active:scale-95">
                            <Link href="/register">Initialize Enrollment <ArrowRight className="ml-3 h-5 w-5" /></Link>
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
