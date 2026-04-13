'use client';

import { useState, useEffect } from 'react';
import { Cookie, ShieldCheck, Activity, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Logo } from '@/components/logo';

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  if (!mounted || !isVisible) return null;

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'true');
    setIsVisible(false);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-background/95 backdrop-blur-3xl p-4 sm:p-6">
      <div className="max-w-2xl w-full bg-card border border-primary/10 shadow-3xl rounded-[2.5rem] overflow-hidden relative text-left">
        <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none">
          <Logo className="h-48 w-48 grayscale" priority={false} />
        </div>
        
        <div className="p-8 sm:p-12 space-y-10 relative z-10 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="shrink-0 p-5 bg-primary/10 rounded-2xl shadow-xl border border-primary/20">
              <Cookie className="h-10 w-10 text-primary" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-center sm:justify-start gap-2 text-primary">
                <Activity className="h-3.5 w-3.5" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Privacy Protocol 2025</span>
              </div>
              <h2 className="text-3xl font-black font-headline tracking-tighter text-foreground uppercase leading-none">Statutory Consent Required</h2>
            </div>
          </div>

          <div className="space-y-6 text-left">
            <p className="text-sm sm:text-lg text-muted-foreground font-medium leading-relaxed">
              To Initialize Your Secure Ingress To The <span className="text-foreground font-black">Nyaya Sahayak</span> Terminal, You Must Acknowledge Our Privacy Protocols. We Use Essential Cookies To Manage Your Forensic Identity And Statutory Registry Sync.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/30 border border-border/10">
                <Lock className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest">Secure Sessions</p>
                  <p className="text-[9px] font-medium text-muted-foreground">Maintains your authenticated registry connection.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/30 border border-border/10">
                <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest">Identity Sync</p>
                  <p className="text-[9px] font-medium text-muted-foreground">Ensures correct mapping of analytical reports.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
            <Button 
              onClick={handleAccept} 
              className="w-full sm:w-auto h-14 px-10 rounded-2xl bg-primary text-primary-foreground font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-primary/20 active:scale-95 transition-all"
            >
              Accept All Protocols
            </Button>
            <Button variant="ghost" asChild className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
              <Link href="/dashboard/cookie-policy">Review Detailed Policy</Link>
            </Button>
          </div>
        </div>
        
        <div className="h-2 w-full bg-gradient-to-r from-primary via-accent to-blue-400"></div>
      </div>
    </div>
  );
}