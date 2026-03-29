
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
    <header className="sticky top-0 z-[100] w-full border-b bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group transition-all active:scale-95">
          <motion.div
            whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="absolute -inset-2 bg-primary/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
            <Logo className="h-10 w-10 shadow-none border-none bg-transparent relative z-10 p-0" priority />
          </motion.div>
          <div className="flex flex-col">
            <span className="text-xl font-black font-headline tracking-tighter bg-gradient-to-r from-[#FF9933] via-[#000080] to-[#128807] bg-clip-text text-transparent animate-animated-gradient bg-[200%_auto] leading-none">
              Nyaya Sahayak
            </span>
            <span className="text-[7px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 mt-0.5 leading-none">Institutional Terminal</span>
          </div>
        </Link>
        
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-2 mr-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10">
            <Activity className="h-3 w-3 text-green-500 animate-pulse" />
            <span className="text-[8px] font-black uppercase tracking-widest text-primary/60">System Ready</span>
          </div>
          
          {user ? (
            <Button asChild size="sm" className="font-bold rounded-xl shadow-lg shadow-primary/20 h-10 px-6 group transition-all active:scale-95">
              <Link href="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" /> Dashboard
              </Link>
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" size="sm" className="font-bold rounded-xl h-10 px-6 hidden sm:flex">
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild size="sm" className="font-bold rounded-xl shadow-lg shadow-primary/20 h-10 px-6 overflow-hidden relative group">
                <Link href="/register" className="flex items-center gap-2">
                  <span className="relative z-10 flex items-center gap-2">
                    <LogIn className="h-4 w-4" /> Register
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
