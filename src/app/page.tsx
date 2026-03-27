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
  Scale,
  ExternalLink
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
                <div className="absolute -inset-6 rounded-full bg-primary/10 animate-pulse group-hover:scale-110 transition-transform"></div>
                <Logo className="h-20 w-20 sm:h-28 sm:w-28 relative z-10 shadow-[0_20px_50px_rgba(0,0,0,0.2)]" />
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
                        Advanced AI Legal Assistant & Forensic Case Auditor for the Modern Indian Citizen.
                    </p>
                    <p className="text-[11px] sm:text-xs text-muted-foreground font-medium leading-relaxed max-w-lg mx-auto opacity-80">
                        Bridging the gap between the complex Indian judicial system and fundamental citizen rights with precision forensic tools, automated document risk scanners, and high-fidelity procedural roadmaps.
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

        {/* Informational Content for SEO & Depth */}
        <div className="w-full max-w-5xl mt-24 space-y-24 px-4 relative z-10 text-left">
            <section className="space-y-8">
                <div className="space-y-3 text-center">
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.3em]">
                        Statutory Mandate
                    </Badge>
                    <h2 className="text-3xl sm:text-4xl font-black font-headline tracking-tighter">Your Advanced AI <span className="text-primary italic">Legal Assistant</span></h2>
                </div>
                <div className="grid md:grid-cols-2 gap-12 items-start">
                    <div className="space-y-6">
                        <p className="text-sm sm:text-base text-muted-foreground font-medium leading-relaxed">
                            Nyaya Sahayak represents the pinnacle of AI legal intelligence designed specifically for the unique complexities of the <span className="text-foreground font-bold">Indian judicial system</span>. Our mission is to empower every citizen with elite-grade legal forensic tools that were previously accessible only to high-tier legal firms. By leveraging state-of-the-art neural processing, we provide a mathematical approach to legal navigation.
                        </p>
                        <p className="text-sm sm:text-base text-muted-foreground font-medium leading-relaxed">
                            Our platform integrates several high-performance modules, including the <span className="text-foreground font-bold">Forensic Case Auditor</span>, which analyzes legal narratives to identify statutory violations, and the <span className="text-foreground font-bold">Document Risk Scanner</span>, an OCR-powered engine that dissects contracts and notices to surface hidden liabilities and critical deadlines.
                        </p>
                    </div>
                    <Card className="glass p-8 rounded-[2.5rem] border-primary/10 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-[0.05]">
                            <Scale className="h-24 w-24 text-primary" />
                        </div>
                        <h3 className="text-xl font-black tracking-tight mb-4">Navigational Roadmaps</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed font-medium mb-6">
                            Navigating the Indian courts and police stations requires a precise understanding of procedural cycles. Nyaya Sahayak generates automated <span className="text-primary font-bold">Procedural Roadmaps</span> that guide you step-by-step through filing FIRs, submitting evidence, and understanding court decorum.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest border-primary/20">Criminal Law Audit</Badge>
                            <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest border-primary/20">Civil Liability Scan</Badge>
                            <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest border-primary/20">MSME Compliance</Badge>
                        </div>
                    </Card>
                </div>
            </section>

            <section className="space-y-12">
                <div className="flex flex-col items-center text-center space-y-3">
                    <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20 px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.3em]">
                        Forensic Capabilities
                    </Badge>
                    <h2 className="text-2xl sm:text-4xl font-black font-headline tracking-tighter text-foreground">Institutional <span className="text-primary italic">Sectors</span></h2>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {[
                        {
                            title: "Case Auditor",
                            desc: "Utilize neural violation mapping to deconstruct complex legal problems with institutional precision and statutory accuracy.",
                            icon: BrainCircuit,
                            color: "text-primary",
                            bg: "bg-primary/5",
                            sector: "Sector: NS-V1"
                        },
                        {
                            title: "Document Risk",
                            desc: "Initialize a high-fidelity scan of legal instruments to identify hidden statutory liabilities and mandated procedural actions.",
                            icon: FileSearch,
                            color: "text-accent",
                            bg: "bg-accent/5",
                            sector: "Sector: NS-D2"
                        },
                        {
                            title: "AI Roadmap",
                            desc: "Access dynamic, step-by-step navigation cycles designed to guide citizens through the intricacies of the judicial system.",
                            icon: Zap,
                            color: "text-orange-500",
                            bg: "bg-orange-500/5",
                            sector: "Sector: NS-Z4"
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

            <section className="bg-primary/5 rounded-[3rem] p-8 sm:p-16 border border-primary/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-[0.02]">
                    <Globe className="h-64 w-64" />
                </div>
                <div className="max-w-3xl space-y-8 relative z-10">
                    <ForensicLabel>Protocol: Digital-Justice-Era</ForensicLabel>
                    <h2 className="text-3xl sm:text-5xl font-black font-headline tracking-tighter leading-tight">Engineering Dignity Through <span className="text-primary italic">Neural Intelligence</span></h2>
                    <p className="text-sm sm:text-lg text-muted-foreground font-medium leading-relaxed">
                        In the era of Digital India, legal empowerment must be accessible at the click of a button. Nyaya Sahayak serves as a supplementary navigational node, providing citizens with the tools to understand their legal standing before they even step into a courtroom. By deconstructing judicial barriers, we are building a more transparent and equitable legal landscape for 1.4 billion people.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6">
                        <div className="flex-1 space-y-2">
                            <h4 className="text-xs font-black uppercase text-primary">Official Resources</h4>
                            <div className="space-y-2">
                                <a href="https://services.ecourts.gov.in/" target="_blank" className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground hover:text-primary transition-colors">
                                    <ExternalLink className="h-3 w-3" /> eCourts Services India
                                </a>
                                <a href="https://india.gov.in/" target="_blank" className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground hover:text-primary transition-colors">
                                    <ExternalLink className="h-3 w-3" /> National Portal of India
                                </a>
                            </div>
                        </div>
                        <div className="flex-1 flex items-end">
                            <Button variant="outline" className="rounded-xl font-bold h-12 px-8 border-primary/20 hover:bg-primary/5 active:scale-95 transition-all text-xs" asChild>
                                <Link href="/about">Learn Our Vision</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}
