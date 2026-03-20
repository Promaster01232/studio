"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ArrowRight, Lightbulb, Loader2, ShieldCheck, Info, Mail, Lock, FileText, Cookie, AlertCircle } from "lucide-react";
import { Logo } from "@/components/logo";
import { useAuth } from "@/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function WelcomePage() {
  const auth = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [auth]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md overflow-hidden border-none shadow-2xl bg-card/50 backdrop-blur-md">
          <CardContent className="flex flex-col items-center p-8 sm:p-10 text-center">
            <div className="relative mb-10 flex h-32 w-32 items-center justify-center">
              <div className="absolute -inset-3 rounded-full bg-primary/10 animate-pulse [animation-duration:4s] [animation-delay:1s]"></div>
               <div className="absolute -inset-6 rounded-full bg-primary/10 animate-pulse [animation-duration:4s]"></div>
              <Logo className="h-28 w-28 shadow-2xl relative z-10" />
            </div>

            <h1 className="text-3xl sm:text-4xl font-black font-headline mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-animated-gradient bg-[200%_auto] tracking-tighter">
              Nyaya Sahayak
            </h1>

            <p className="mb-8 text-sm font-medium text-muted-foreground leading-relaxed">
              Your AI-powered legal assistant for a modern world. Clarity and confidence in navigating the legal system.
            </p>

            <div className="w-full space-y-6">
              <div className="flex items-start space-x-3 text-left p-4 rounded-xl bg-primary/5 border border-primary/10 transition-all hover:bg-primary/10">
                <Checkbox 
                  id="terms" 
                  checked={acceptedTerms} 
                  onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                  className="mt-1 border-primary/30 data-[state=checked]:bg-primary"
                />
                <div className="grid gap-1.5 leading-none">
                  <Label
                    htmlFor="terms"
                    className="text-[11px] font-bold text-muted-foreground leading-snug cursor-pointer"
                  >
                    I acknowledge and accept the <Link href="/dashboard/terms" className="text-primary hover:underline">Terms of Service</Link> and <Link href="/dashboard/privacy" className="text-primary hover:underline">Privacy Protocol</Link>.
                  </Label>
                  <p className="text-[9px] text-muted-foreground/60 font-medium">
                    By proceeding, you agree to our institutional usage protocols.
                  </p>
                </div>
              </div>
              
              <Button 
                asChild={acceptedTerms && !loading} 
                disabled={!acceptedTerms || loading}
                size="lg" 
                className={`group w-full h-12 font-bold shadow-xl transition-all duration-300 active:scale-95 rounded-xl ${
                  acceptedTerms 
                    ? 'shadow-primary/20 hover:shadow-primary/30 bg-primary text-white' 
                    : 'bg-muted text-muted-foreground shadow-none opacity-50 cursor-not-allowed'
                }`}
              >
                {acceptedTerms ? (
                  <Link href={loading ? "#" : (user ? "/dashboard" : "/login")}>
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" /> Authenticating...
                      </span>
                    ) : (
                      <>
                        {user ? "Go to Dashboard" : "Get Started"} <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </Link>
                ) : (
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4" /> Accept Terms to Proceed
                  </span>
                )}
              </Button>
            </div>

            <div className="mt-12 flex flex-col items-center gap-1">
              <p className="text-[10px] font-bold text-muted-foreground opacity-60">
                Developed by
              </p>
              <div className="flex items-center gap-1.5">
                <Lightbulb className="h-4 w-4 text-primary fill-primary/20" />
                <span className="text-base font-black font-headline tracking-tighter text-primary">
                  IdeaSpark
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <footer className="w-full border-t bg-card/30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center sm:text-left">
            <div className="space-y-4">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <Logo className="h-6 w-6" />
                <span className="text-sm font-black tracking-tighter">Nyaya Sahayak</span>
              </div>
              <p className="text-[10px] text-muted-foreground font-medium max-w-xs mx-auto sm:mx-0">
                Precision AI for the modern legal ecosystem. 
                Delivering institutional clarity.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">Institutional</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/dashboard/about" className="text-[11px] font-bold flex items-center justify-center sm:justify-start gap-2 text-foreground/70 hover:text-primary transition-colors">
                    <Info className="h-3 w-3" /> About Node
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/contact" className="text-[11px] font-bold flex items-center justify-center sm:justify-start gap-2 text-foreground/70 hover:text-primary transition-colors">
                    <Mail className="h-3 w-3" /> Contact Hub
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">Protocols</h3>
              <div className="flex flex-wrap justify-center sm:justify-start gap-x-4 gap-y-2">
                <Link href="/dashboard/privacy" className="text-[11px] font-bold flex items-center gap-1.5 text-foreground/70 hover:text-primary transition-colors">
                  <Lock className="h-3 w-3" /> Privacy
                </Link>
                <Link href="/dashboard/terms" className="text-[11px] font-bold flex items-center gap-1.5 text-foreground/70 hover:text-primary transition-colors">
                  <FileText className="h-3 w-3" /> Terms
                </Link>
                <Link href="/dashboard/cookie-policy" className="text-[11px] font-bold flex items-center gap-1.5 text-foreground/70 hover:text-primary transition-colors">
                  <Cookie className="h-3 w-3" /> Cookies
                </Link>
                <Link href="/dashboard/disclaimer" className="text-[11px] font-bold flex items-center gap-1.5 text-foreground/70 hover:text-primary transition-colors">
                  <AlertCircle className="h-3 w-3" /> Disclaimer
                </Link>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-primary/5 text-center">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">
              © {new Date().getFullYear()} NYAYA SAHAYAK INSTITUTIONAL NODE.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
