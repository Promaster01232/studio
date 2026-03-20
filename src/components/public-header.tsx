
'use client';

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { useState, useEffect } from "react";
import { LogIn, ArrowLeft } from "lucide-react";

export function PublicHeader() {
  const auth = useAuth();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    return onAuthStateChanged(auth, setUser);
  }, [auth]);

  return (
    <header className="sticky top-0 z-[100] w-full border-b bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <Logo className="h-10 w-10" />
          <span className="text-xl font-black font-headline tracking-tighter text-foreground hidden sm:block">
            Nyaya Sahayak
          </span>
        </Link>
        
        <div className="flex items-center gap-4">
          {user ? (
            <Button asChild size="sm" className="font-bold rounded-xl shadow-lg shadow-primary/20 h-10 px-6 group transition-all active:scale-95">
              <Link href="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" /> Back
              </Link>
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" size="sm" className="font-bold rounded-xl h-10 px-6 hidden sm:flex">
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild size="sm" className="font-bold rounded-xl shadow-lg shadow-primary/20 h-10 px-6">
                <Link href="/register">
                  <LogIn className="mr-2 h-4 w-4" /> Register
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
