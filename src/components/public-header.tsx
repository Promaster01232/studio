
'use client';

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { useState, useEffect } from "react";
import { ArrowLeft, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export function PublicHeader() {
  const auth = useAuth();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    return onAuthStateChanged(auth, setUser);
  }, [auth]);

  const navItems = ["Features", "How it works", "Pricing", "Faqs", "Blog", "About"];

  return (
    <header className="sticky top-0 z-[100] w-full border-b bg-black/90 backdrop-blur-md border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 active:scale-95 transition-all">
          <Logo className="h-8 w-8 shadow-none border-none p-0 bg-transparent" priority={true} />
          <span className="text-xl font-black tracking-tight text-white font-headline">
            Nyaya Sahayak
          </span>
        </Link>

        {!user && (
          <div className="hidden md:flex items-center gap-10">
            {navItems.map((item) => (
              <button 
                key={item} 
                className="text-sm font-medium text-white/60 hover:text-white transition-all duration-300"
              >
                {item}
              </button>
            ))}
          </div>
        )}
        
        <div className="flex items-center gap-4">
          {user ? (
            <Button asChild size="sm" variant="outline" className="font-bold rounded-xl h-10 px-6 border-white/10 hover:bg-white/5 text-white">
              <Link href="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" /> Dashboard
              </Link>
            </Button>
          ) : (
            <>
              <div className="hidden md:flex items-center gap-2">
                <Button asChild variant="ghost" size="sm" className="font-black text-[10px] uppercase tracking-widest h-10 px-6 hover:bg-white/5 text-white">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild size="sm" className="bg-primary text-primary-foreground font-black text-[10px] uppercase tracking-widest h-10 px-6 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95">
                  <Link href="/register">
                    Join hub
                  </Link>
                </Button>
              </div>

              <div className="md:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/5 rounded-xl h-10 w-10">
                      <Menu className="h-6 w-6" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="bg-[#0a0a0a] border-white/5 text-white w-[280px]">
                    <div className="flex flex-col gap-6 mt-10 text-left">
                      {navItems.map((item) => (
                        <button 
                          key={item} 
                          className="text-left text-lg font-medium text-white/60 hover:text-white transition-all"
                        >
                          {item}
                        </button>
                      ))}
                      <div className="h-px bg-white/5 my-2" />
                      <Button asChild variant="ghost" className="justify-start px-0 text-white/60 hover:text-white h-10 font-bold">
                        <Link href="/login">Login</Link>
                      </Button>
                      <Button asChild className="bg-primary text-primary-foreground font-bold h-12 rounded-xl">
                        <Link href="/register">Join hub</Link>
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
