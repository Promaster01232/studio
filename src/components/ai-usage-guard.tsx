
"use client";

import { ReactNode, useState, useEffect } from "react";
import { useAuth, useFirestore } from "@/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldAlert, Zap, ArrowRight, Loader2, CreditCard } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const ADMIN_EMAILS = [
  'enterspaceindia@gmail.com', 
  'piyushkumarsingh23323@gmail.com',
  'piyushkumrsingh23323@gmail.com',
  'piyushkumrsingh23399@gmail.com',
  'nyayasahayakhelp@gmail.com'
];

interface AIUsageGuardProps {
  children: ReactNode;
  featureName: string;
}

export function AIUsageGuard({ children, featureName }: AIUsageGuardProps) {
  const auth = useAuth();
  const firestore = useFirestore();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) return;

    const unsub = onSnapshot(doc(firestore, "users", auth.currentUser.uid), (doc) => {
      setProfile(doc.data());
      setLoading(false);
    });

    return () => unsub();
  }, [auth, firestore]);

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary opacity-20" />
      </div>
    );
  }

  const isAdmin = profile?.email && ADMIN_EMAILS.includes(profile.email.toLowerCase());
  const usage = profile?.aiUsageCount || 0;
  const plan = profile?.subscriptionType || 'free';
  
  // Root Admins always have unlimited access
  let limit = 5;
  if (isAdmin || plan === 'unlimited_monthly' || plan === 'unlimited_yearly') {
    limit = 9999999;
  } else if (plan === 'pro_20') {
    limit = 20;
  }

  const isLimitReached = usage >= limit;

  if (isLimitReached) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="py-12">
        <Card className="max-w-2xl mx-auto glass border-primary/20 shadow-2xl rounded-[2.5rem] overflow-hidden text-left">
          <div className="bg-primary/10 p-10 flex justify-center border-b border-primary/10">
            <ShieldAlert className="h-20 w-20 text-primary animate-pulse" />
          </div>
          <CardHeader className="p-8 sm:p-10 text-center">
            <div className="flex items-center justify-center gap-2 text-primary mb-3">
              <Zap className="h-4 w-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Statutory Limit Reached</span>
            </div>
            <CardTitle className="text-3xl font-black font-headline tracking-tighter">Usage Quota Exhausted</CardTitle>
            <CardDescription className="text-sm font-medium pt-4 text-muted-foreground leading-relaxed px-4">
              Your current node has exhausted its free-tier forensic credits. To continue utilizing the <span className="text-primary font-bold">{featureName}</span>, please upgrade your institutional clearance.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-10 space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-muted/30 border border-primary/5 text-center">
                    <p className="text-[9px] font-black uppercase text-muted-foreground opacity-60">Operations</p>
                    <p className="text-2xl font-black tracking-tighter">{usage}</p>
                </div>
                <div className="p-4 rounded-2xl bg-muted/30 border border-primary/5 text-center">
                    <p className="text-[9px] font-black uppercase text-muted-foreground opacity-60">Status</p>
                    <p className="text-sm font-black text-red-500 uppercase tracking-tighter pt-1">EXHAUSTED</p>
                </div>
            </div>
            <Button asChild className="w-full h-14 font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-primary/20 active:scale-95 transition-all">
              <Link href="/dashboard/billing">
                <CreditCard className="mr-3 h-4 w-4" />
                Initialize Upgrade Protocol
              </Link>
            </Button>
          </CardContent>
          <div className="p-4 bg-muted/5 border-t text-center">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">Nyaya Sahayak // Quota Management Terminal</span>
          </div>
        </Card>
      </motion.div>
    );
  }

  return <>{children}</>;
}
