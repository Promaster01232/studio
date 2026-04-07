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
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 active:scale-95 transition-all">
          <Logo className="h-8 w-8 shadow-none border-none p-0 bg-transparent" priority={true} />
          <span className="text-xl font-bold tracking-tight text-foreground">
            Nyaya Sahayak
          </span>
        </Link>
        
        <div className="flex items-center gap-4">
          {user ? (
            <Button asChild size="sm" variant="outline" className="font-bold rounded-full h-10 px-6">
              <Link href="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" /> Dashboard
              </Link>
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" size="sm" className="font-bold rounded-full h-10 px-6">
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild size="sm" className="font-bold rounded-full h-10 px-6">
                <Link href="/register">
                  Register
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}