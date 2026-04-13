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
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

const navItems = [
  { name: "Features", href: "/features" },
  { name: "How it works", href: "/how-it-works" },
  { name: "Pricing", href: "/pricing" },
  { name: "Faqs", href: "/faqs" },
  { name: "Blog", href: "/blog" },
  { name: "About", href: "/about" },
];

export function PublicHeader() {
  const auth = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    return onAuthStateChanged(auth, setUser);
  }, [auth]);

  return (
    <header className="sticky top-0 z-[100] w-full border-b bg-background/40 backdrop-blur-md border-border/10">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="https://nyayasahayak.in" className="flex items-center gap-3 active:scale-95 transition-all">
          <Logo className="h-8 w-8 shadow-none border-none p-0 bg-transparent" priority={true} />
          <span className="text-xl font-black tracking-tight text-foreground font-headline">
            Nyaya Sahayak
          </span>
        </Link>

        {!user && (
          <div className="hidden md:flex items-center gap-10">
            {navItems.map((item) => (
              <Link 
                key={item.name} 
                href={item.href}
                className="text-sm font-medium text-foreground/60 hover:text-primary transition-all duration-300"
              >
                {item.name}
              </Link>
            ))}
          </div>
        )}
        
        <div className="flex items-center gap-2 sm:gap-4">
          {user ? (
            <Button asChild size="sm" variant="outline" className="font-bold rounded-xl h-10 px-6 border-border/10 hover:bg-primary/5 text-foreground">
              <Link href="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" /> Dashboard
              </Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm" className="font-bold text-xs h-10 px-4 sm:px-6 hover:bg-primary/5 text-foreground">
                <Link href="/login">Login</Link>
              </Button>

              <div className="hidden md:block">
                <Button asChild size="sm" className="bg-primary text-primary-foreground font-bold text-xs h-10 px-6 rounded-xl shadow-lg shadow-primary/20 active:scale-95 transition-all">
                  <Link href="/register">
                    Join hub
                  </Link>
                </Button>
              </div>

              <div className="md:hidden">
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-foreground hover:bg-primary/5 rounded-xl h-10 w-10">
                      <Menu className="h-6 w-6" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="bg-background border-border/10 text-foreground w-[280px] p-0">
                    <SheetHeader className="p-6 border-b border-border/10">
                      <SheetTitle className="text-foreground text-left font-headline font-black text-xl tracking-tighter">Navigation</SheetTitle>
                      <SheetDescription className="text-muted-foreground text-left text-[10px] uppercase font-bold tracking-widest">Public terminal</SheetDescription>
                    </SheetHeader>
                    <div className="flex flex-col p-6 gap-6 text-left">
                      {navItems.map((item) => (
                        <Link 
                          key={item.name} 
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className="text-left text-lg font-bold text-foreground/60 hover:text-primary transition-all"
                        >
                          {item.name}
                        </Link>
                      ))}
                      <div className="h-px bg-border/10 my-2" />
                      <Button asChild variant="ghost" className="justify-start px-0 text-foreground/60 hover:text-primary h-10 font-bold" onClick={() => setIsOpen(false)}>
                        <Link href="/login">Login</Link>
                      </Button>
                      <Button asChild className="bg-primary text-primary-foreground font-bold h-12 rounded-xl" onClick={() => setIsOpen(false)}>
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
