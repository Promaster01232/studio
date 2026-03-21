"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ArrowRight, Landmark, Lightbulb, Loader2, Scale, ShieldCheck, Sparkles } from "lucide-react";
import { Logo } from "@/components/logo";
import { useAuth } from "@/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { Footer } from "@/components/footer";
import { motion, AnimatePresence } from "framer-motion";

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
      <div className="flex-1 flex items-center justify-center p-4 py-20 relative overflow-hidden">
        {/* Ambient Background Elements */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] -z-10 animate-pulse [animation-delay:2s]"></div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 50, damping: 20 }}
          className="w-full max-w-lg"
        >
          <Card className="overflow-hidden border-none shadow-2xl bg-card/40 backdrop-blur-2xl rounded-[2.5rem] relative">
            <div className="absolute top-0 right-0 p-8 opacity-[0.02]">
                <Landmark className="h-40 w-40" />
            </div>
            
            <CardContent className="flex flex-col items-center p-8 sm:p-12 text-center relative z-10">
              <motion.div 
                className="relative mb-12"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="absolute -inset-4 rounded-full bg-primary/10 animate-ping [animation-duration:3s]"></div>
                <div className="absolute -inset-8 rounded-full bg-primary/5 animate-pulse [animation-duration:4s]"></div>
                <Logo className="h-32 w-32 shadow-2xl relative z-10 border-none bg-white rounded-full p-2" />
              </motion.div>

              <div className="space-y-4 mb-10">
                <div className="flex items-center justify-center gap-2 text-primary">
                    <Sparkles className="h-4 w-4 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">Official Forensic Terminal</span>
                </div>
                <h1 className="text-4xl sm:text-5xl font-black font-headline tracking-tighter leading-none text-foreground">
                  Nyaya Sahayak
                </h1>
                <p className="text-sm sm:text-base font-medium text-muted-foreground leading-relaxed max-w-[280px] mx-auto">
                  Precision AI intelligence for the modern citizen and legal ecosystem.
                </p>
              </div>

              <div className="w-full space-y-4">
                <Button 
                  asChild={!loading} 
                  disabled={loading}
                  size="lg" 
                  className="group w-full h-14 text-lg font-black shadow-2xl transition-all duration-500 active:scale-95 rounded-2xl shadow-primary/20 hover:shadow-primary/40 bg-primary text-white"
                >
                  <Link href={loading ? "#" : (user ? "/dashboard" : "/login")}>
                    {loading ? (
                      <span className="flex items-center gap-3">
                        <Loader2 className="h-5 w-5 animate-spin" /> 
                        <span className="text-xs uppercase tracking-widest">Registry Sync...</span>
                      </span>
                    ) : (
                      <>
                        {user ? "Enter Dashboard" : "Initiate Enrollment"} 
                        <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1.5" />
                      </>
                    )}
                  </Link>
                </Button>
                
                <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                    Zero-Knowledge Encryption Standard Active
                </p>
              </div>

              <div className="mt-16 pt-8 border-t border-primary/5 w-full flex flex-col items-center gap-2">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">
                  Developed & Engineered by
                </p>
                <div className="flex items-center gap-2 group transition-opacity hover:opacity-100 opacity-60">
                  <Lightbulb className="h-4 w-4 text-primary fill-primary/20 group-hover:animate-bounce" />
                  <span className="text-lg font-black font-headline tracking-tighter text-primary">
                    IdeaSpark
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}