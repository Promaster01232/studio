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
  Globe,
  Scale,
  ExternalLink
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
      <div className="tricolor-glow bg-[#FF9933]" style={{ top: '-10%', left: '10%' }}></div>
      <div className="tricolor-glow bg-[#FFFFFF]" style={{ top: '30%', left: '40%', width: '800px', opacity: 0.05 }}></div>
      <div className="tricolor-glow bg-[#128807]" style={{ bottom: '-10%', right: '10%' }}></div>
      
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
                <div className="absolute -inset-6 rounded-full bg-primary/10 animate-pulse group-hover:scale-110 transition-transform"></div>
                <Logo className="h-24 w-24 sm:h-32 sm:w-32 relative z-10" priority />
              </div>

              <div className="space-y-6 mb-10 text-left">
                <Badge variant="outline" className="border-primary/20 text-primary px-5 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.3em] bg-primary/5 mx-auto block w-fit">
                    Institutional Terminal // NYAYASAHAYAK.IN
                </Badge>
                
                <h1 className="text-3xl sm:text-5xl font-black font-headline tracking-tighter leading-none text-foreground text-center">
                  Nyaya Sahayak: Elite AI <span className="bg-gradient-to-r from-primary via-orange-400 to-accent bg-clip-text text-transparent italic">Legal Assistant</span>
                  <span className="animate-pulse ml-1 text-primary">|</span>
                </h1>
                
                <div className="max-w-2xl mx-auto space-y-6">
                    <p className="text-sm sm:text-lg text-muted-foreground font-medium leading-relaxed text-center sm:text-left">
                        Nyaya Sahayak represents the definitive leap forward in AI-powered legal empowerment for the Indian citizenry. In a landscape where the judicial system is often perceived as a dense thicket of complex statutes and intimidating procedural protocols, our platform serves as a high-fidelity navigational beacon. We have engineered this ecosystem to bridge the gap between statutory complexity and the fundamental rights of every individual, providing mathematically precise forensic tools that were previously reserved for elite legal institutions.
                    </p>
                    
                    <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground border-l-4 border-primary pl-4">Forensic Case Auditor</h2>
                    <p className="text-sm sm:text-lg text-muted-foreground font-medium leading-relaxed">
                        At the core of the Nyaya Sahayak terminal is the Forensic Case Auditor. This neural engine is specifically trained on the nuances of the Bharatiya Nyaya Sanhita (BNS) and the Bharatiya Sakshya Adhiniyam (BSA). When a citizen narrates their legal problem, our AI performs a deep-layer deconstruction of the narrative, identifying potential statutory violations, mapping relevant sections of the law, and generating a professional case summary. This process transforms a confusing series of events into a structured legal dossier, empowering the user to approach law enforcement or legal counsel with absolute clarity and dignity.
                    </p>

                    <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground border-l-4 border-accent pl-4">Document Risk Scanner</h2>
                    <p className="text-sm sm:text-lg text-muted-foreground font-medium leading-relaxed">
                        Furthermore, our Document Risk Scanner provides an institutional-grade audit of legal instruments. Whether it is a legal notice, a contract, or an FIR application, the AI node performs a comprehensive forensic scan to identify non-compliance markers, hidden liabilities, and critical procedural deadlines. By automating the risk assessment process, we ensure that no citizen is caught off-guard by the fine print of legal documentation. The system operates on a zero-trust architecture, ensuring that your sensitive data nodes are processed in isolated, transient environments.
                    </p>

                    <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground border-l-4 border-orange-400 pl-4">Procedural Roadmap Intelligence</h2>
                    <p className="text-sm sm:text-lg text-muted-foreground font-medium leading-relaxed">
                        The Procedural Roadmap Intelligence is another critical pillar of our mission. Navigating the Bharatiya Nagarik Suraksha Sanhita (BNSS) requires a step-by-step understanding of judicial cycles. Nyaya Sahayak provides dynamic, personalized roadmaps that guide users through the intricacies of filing complaints, understanding writ jurisdictions under Articles 32 and 226, and maintaining proper courtroom decorum. We are building a more transparent and equitable legal landscape for 1.4 billion people, ensuring that technology serves as a bridge to justice rather than a barrier.
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
                            <span className="tracking-[0.2em] uppercase">Initialize Dashboard</span>
                            <ArrowRight className="ml-3 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </Button>
                    <p className="text-[8px] font-black text-primary/40 uppercase tracking-[0.4em]">Secure Institutional Access Active</p>
                  </div>
                ) : (
                  <Button disabled className="w-full h-14 rounded-2xl bg-primary/20 text-white border-primary/10">
                    <Loader2 className="h-4 w-4 animate-spin opacity-40 mr-2" /> 
                    <span className="text-[8px] uppercase tracking-[0.3em] font-black opacity-40">Syncing Registry...</span>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="w-full max-w-5xl mt-24 space-y-24 px-4 relative z-10 text-left">
            <section className="space-y-12">
                <div className="flex flex-col items-center text-center space-y-3">
                    <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20 px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.3em]">
                        Forensic Capabilities
                    </Badge>
                    <h2 className="text-2xl sm:text-4xl font-black font-headline tracking-tighter text-foreground">Institutional <span className="text-primary italic">Forensic Sectors</span></h2>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {[
                        {
                            title: "Forensic Case Auditor",
                            desc: "Utilize neural violation mapping to deconstruct complex legal problems with institutional precision and statutory accuracy.",
                            icon: BrainCircuit,
                            color: "text-primary",
                            bg: "bg-primary/5",
                            sector: "Sector: Forensic"
                        },
                        {
                            title: "Document Risk Scanner",
                            desc: "Initialize high-fidelity scans of legal instruments to identify hidden statutory liabilities and non-compliance risks.",
                            icon: FileSearch,
                            color: "text-accent",
                            bg: "bg-accent/5",
                            sector: "Sector: Statutory"
                        },
                        {
                            title: "AI Procedural Roadmap",
                            desc: "Access step-by-step navigation cycles designed to guide citizens through the intricacies of the judicial system.",
                            icon: Zap,
                            color: "text-orange-500",
                            bg: "bg-orange-500/5",
                            sector: "Sector: Navigational"
                        }
                    ].map((item, idx) => (
                        <Card key={idx} className="glass p-8 rounded-[2rem] border-primary/10 text-left group hover:border-primary/30 transition-all h-full shadow-xl">
                            <div className="flex justify-between items-start mb-6">
                                <div className={cn("p-3 rounded-xl transition-transform group-hover:scale-110 shadow-inner", item.bg, item.color)}>
                                    <item.icon className="h-6 w-6" />
                                </div>
                                <span className="text-[8px] font-black text-muted-foreground/40 uppercase tracking-widest">{item.sector}</span>
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-sm font-black uppercase tracking-tight text-foreground">{item.title}</h3>
                                <p className="text-[11px] text-muted-foreground font-medium leading-relaxed opacity-80">
                                    {item.desc}
                                </p>
                            </div>
                        </Card>
                    ))}
                </div>
            </section>

            <section className="space-y-12">
                <div className="flex flex-col items-center text-center space-y-3">
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.3em]">
                        External Connectivity
                    </Badge>
                    <h2 className="text-2xl sm:text-4xl font-black font-headline tracking-tighter text-foreground">Official <span className="text-primary italic">Judicial Resources</span></h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
                    <a href="https://services.ecourts.gov.in/" target="_blank" rel="noopener noreferrer" className="group">
                        <Card className="glass p-6 rounded-2xl border-primary/5 hover:border-primary/30 transition-all flex items-center justify-between shadow-lg">
                            <div className="flex items-center gap-4">
                                <div className="p-2 rounded-xl bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                    <Globe className="h-5 w-5" />
                                </div>
                                <span className="font-bold text-sm">eCourts Services</span>
                            </div>
                            <ExternalLink className="h-4 w-4 opacity-20 group-hover:opacity-100 transition-all" />
                        </Card>
                    </a>
                    <a href="https://www.india.gov.in/" target="_blank" rel="noopener noreferrer" className="group">
                        <Card className="glass p-6 rounded-2xl border-primary/5 hover:border-primary/30 transition-all flex items-center justify-between shadow-lg">
                            <div className="flex items-center gap-4">
                                <div className="p-2 rounded-xl bg-accent/5 text-accent group-hover:bg-accent group-hover:text-white transition-all">
                                    <Scale className="h-5 w-5" />
                                </div>
                                <span className="font-bold text-sm">National Portal India</span>
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
