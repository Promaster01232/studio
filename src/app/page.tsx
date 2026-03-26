
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
  Globe
} from "lucide-react";
import { Logo } from "@/components/logo";
import { useAuth } from "@/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { Footer } from "@/components/footer";
import { motion } from "framer-motion";

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
    <div className="flex flex-col min-h-screen bg-background selection:bg-primary/10">
      <div className="flex-1 flex flex-col items-center justify-center p-4 py-20 relative overflow-hidden">
        {/* Ambient Background Elements */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] -z-10 animate-pulse [animation-delay:2s]"></div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 50, damping: 20 }}
          className="w-full max-w-4xl"
        >
          <Card className="overflow-hidden border-none shadow-2xl bg-card/40 backdrop-blur-2xl rounded-[2.5rem] relative">
            <div className="absolute top-0 right-0 p-8 opacity-[0.02]">
                <Landmark className="h-40 w-40" />
            </div>
            
            <CardContent className="flex flex-col items-center p-8 sm:p-16 text-center relative z-10">
              <motion.div 
                className="relative mb-12"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="absolute -inset-4 rounded-full bg-primary/10 animate-ping [animation-duration:3s]"></div>
                <div className="absolute -inset-8 rounded-full bg-primary/5 animate-pulse [animation-duration:4s]"></div>
                <Logo className="h-32 w-32 shadow-2xl relative z-10 border-none bg-white rounded-full p-2" />
              </motion.div>

              <div className="space-y-6 mb-12">
                <div className="flex items-center justify-center gap-2 text-primary">
                    <Sparkles className="h-4 w-4 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">Official Forensic Terminal</span>
                </div>
                <h1 className="text-4xl sm:text-6xl font-black font-headline tracking-tighter leading-none text-foreground">
                  Nyaya Sahayak
                </h1>
                <p className="text-base sm:text-xl font-bold text-primary italic max-w-xl mx-auto">
                  Precision AI Legal Intelligence for the Modern Citizen.
                </p>
                <div className="max-w-2xl mx-auto space-y-4 text-sm sm:text-base text-muted-foreground font-medium leading-relaxed">
                  <p>
                    Nyaya Sahayak is India's premier AI-powered legal assistant, engineered to democratize access to high-fidelity judicial intelligence. Our ecosystem provides citizens, businesses, and legal professionals with mathematically precise forensic auditing and procedural roadmaps.
                  </p>
                  <p>
                    From deconstructing complex statutory clauses to generating legally sound drafting nodes, nyayasahayak.in serves as your institutional co-pilot in the Indian judicial landscape.
                  </p>
                </div>
              </div>

              <div className="w-full max-w-md space-y-4">
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
                
                <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                    Zero-Knowledge Encryption // TLS 1.3 SECURE
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* SEO Long Content Sections */}
        <div className="w-full max-w-6xl mt-20 grid md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
            <Card className="glass p-8 rounded-[2rem] border-primary/5 hover:border-primary/20 transition-all">
                <div className="bg-primary/10 p-3 rounded-xl w-fit mb-6 text-primary">
                    <BrainCircuit className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-black tracking-tight mb-4">Forensic Case Auditor</h2>
                <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                    Our neural engine processes complex legal narratives in milliseconds. By utilizing advanced LLM nodes, Nyaya Sahayak identifies relevant laws, sections, and jurisdictional requirements with mathematically precise accuracy. Whether it's a civil dispute or a criminal matter, our forensic report provides the clarity needed to navigate the Indian Penal Code and specialized statutes.
                </p>
            </Card>

            <Card className="glass p-8 rounded-[2rem] border-emerald-500/5 hover:border-emerald-500/20 transition-all">
                <div className="bg-emerald-500/10 p-3 rounded-xl w-fit mb-6 text-emerald-600">
                    <FileSearch className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-black tracking-tight mb-4">Document Risk Scanner</h2>
                <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                    Upload any legal document for a deep-layer statutory audit. Our AI deconstructs clauses to reveal hidden risks, time-sensitive deadlines, and potential legal consequences. This tool is essential for reviewing rent agreements, employment bonds, and corporate contracts, ensuring that no citizen is caught off-guard by complex legal terminology.
                </p>
            </Card>

            <Card className="glass p-8 rounded-[2rem] border-amber-500/5 hover:border-amber-500/20 transition-all">
                <div className="bg-amber-500/10 p-3 rounded-xl w-fit mb-6 text-amber-600">
                    <Zap className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-black tracking-tight mb-4">AI Procedural Roadmap</h2>
                <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                    Navigate the Indian judicial system with an AI-generated roadmap. We provide step-by-step guides on filing FIRs, responding to legal notices, and understanding court etiquette. Our "Police Process Guide" empowers users with the knowledge of their rights during arrest or police interaction, bridging the gap between statutory law and citizen action.
                </p>
            </Card>
        </div>

        <div className="w-full max-w-4xl mt-20 text-center space-y-12 px-4 pb-20">
            <div className="space-y-4">
                <h2 className="text-3xl sm:text-4xl font-black tracking-tighter">Why Choose Nyaya Sahayak?</h2>
                <div className="h-1 w-20 bg-primary mx-auto rounded-full"></div>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-10 text-left">
                <div className="flex gap-4">
                    <div className="shrink-0"><ShieldCheck className="h-6 w-6 text-primary" /></div>
                    <div className="space-y-2">
                        <h3 className="font-black text-lg">Institutional Trust</h3>
                        <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                            Every node on nyayasahayak.in is engineered for reliability. We connect citizens with a verified Advocate Registry, ensuring that professional legal advice is just a click away after your AI audit.
                        </p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="shrink-0"><Globe className="h-6 w-6 text-primary" /></div>
                    <div className="space-y-2">
                        <h3 className="font-black text-lg">Multi-Lingual Support</h3>
                        <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                            Justice should not have a language barrier. Our platform supports multiple Indian languages, providing simplifications of complex legal jargon in your preferred dialect.
                        </p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="shrink-0"><MessageSquare className="h-6 w-6 text-primary" /></div>
                    <div className="space-y-2">
                        <h3 className="font-black text-lg">Instant Case Tracking</h3>
                        <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                            Stay updated with real-time access to the eCourts registry. Monitor hearing dates, orders, and case status changes directly from your personal dashboard tracker.
                        </p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="shrink-0"><ShieldAlert className="h-6 w-6 text-destructive" /></div>
                    <div className="space-y-2">
                        <h3 className="font-black text-lg">Emergency SOS Protocol</h3>
                        <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                            Our integrated SOS node provides immediate access to national emergency helplines, ensuring that legal and physical safety is always a priority.
                        </p>
                    </div>
                </div>
            </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
