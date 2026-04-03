'use client';

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { useState, useEffect } from "react";
import { LogIn, ArrowLeft, Activity } from "lucide-react";
import { motion } from "framer-motion";

export function PublicHeader() {
  const auth = useAuth();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    return onAuthStateChanged(auth, setUser);
  }, [auth]);

  return (
    <header className="sticky top-0 z-[100] w-full border-b bg-background/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group transition-all active:scale-95">
          <Logo className="h-9 w-9 shadow-none border-none bg-transparent p-0" priority={true} />
          <div className="flex flex-col">
            <span className="text-lg font-black font-headline tracking-tighter text-foreground leading-none">
              Nyaya Sahayak
            </span>
            <span className="text-[6px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 leading-none mt-0.5">Terminal</span>
          </div>
        </Link>
        
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-primary/5 border border-primary/10">
            <Activity className="h-2.5 w-2.5 text-green-500 animate-pulse" />
            <span className="text-[7px] font-black uppercase tracking-widest text-primary/60">Ready</span>
          </div>
          
          {user ? (
            <Button asChild size="sm" className="font-bold rounded-lg shadow-md h-9 px-5 group active:scale-95 transition-all text-[10px] uppercase">
              <Link href="/dashboard">
                <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Dashboard
              </Link>
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" size="sm" className="font-bold rounded-lg h-9 px-4 hidden xs:flex text-[10px] uppercase">
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild size="sm" className="font-bold rounded-lg shadow-md h-9 px-5 active:scale-95 transition-all text-[10px] uppercase">
                <Link href="/register">
                  <LogIn className="mr-1.5 h-3.5 w-3.5" /> Register
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
