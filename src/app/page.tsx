"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ArrowRight, Lightbulb, Loader2 } from "lucide-react";
import { Logo } from "@/components/logo";
import { useAuth } from "@/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

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
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md overflow-hidden border-none shadow-2xl">
        <CardContent className="flex flex-col items-center p-10 text-center">
          <div className="relative mb-10 flex h-32 w-32 items-center justify-center">
            <div className="absolute -inset-3 rounded-full bg-primary/10 animate-pulse [animation-duration:4s] [animation-delay:1s]"></div>
             <div className="absolute -inset-6 rounded-full bg-primary/10 animate-pulse [animation-duration:4s]"></div>
            <Logo className="h-28 w-28 shadow-2xl" imageClassName="h-20 w-auto" />
          </div>

          <h1 className="text-4xl font-black font-headline mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-animated-gradient bg-[200%_auto] tracking-tighter">
            Nyaya Sahayak
          </h1>

          <p className="mb-10 text-sm font-medium text-muted-foreground leading-relaxed">
            Your AI-powered legal assistant for a modern world. Clarity and confidence in navigating the legal system.
          </p>
          
          <Button asChild size="lg" className="group w-full h-12 font-bold shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300 active:scale-95 rounded-xl">
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
          </Button>

          <Link 
            href="https://ideasparkweb.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="mt-12 group flex flex-col items-center gap-1 hover:opacity-80 transition-opacity"
          >
            <p className="text-[10px] font-bold text-muted-foreground opacity-60">
              Developed by
            </p>
            <div className="flex items-center gap-1.5 transition-transform group-hover:scale-105 duration-300">
              <Lightbulb className="h-4 w-4 text-primary fill-primary/20" />
              <span className="text-base font-black font-headline tracking-tighter text-primary">
                IdeaSpark
              </span>
            </div>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
