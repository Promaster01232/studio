"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useFirestore } from "@/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, ShieldCheck, Loader2, User, Cpu, Fingerprint, Globe, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import { DigitalIDCard } from "../page";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function UserPublicProfilePage({ params }: { params: Promise<{ uid: string }> }) {
  const unwrappedParams = use(params);
  const uid = unwrappedParams.uid;
  const firestore = useFirestore();
  
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) return;

    const userRef = doc(firestore, "users", uid);
    const unsubscribe = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        setProfile({ ...docSnap.data(), uid: docSnap.id });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [uid, firestore]);

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary opacity-20" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col h-[70vh] items-center justify-center gap-4">
        <User className="h-16 w-16 text-muted-foreground opacity-20" />
        <h2 className="text-xl font-black font-headline tracking-tighter uppercase">Registry Node Not Found</h2>
        <Button variant="outline" asChild className="rounded-xl font-bold">
          <Link href="/dashboard/research-analytics">Back to Registry Feed</Link>
        </Button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-10 pb-20 px-2 sm:px-0 text-left"
    >
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" className="rounded-xl font-bold hover:bg-primary/5 group" asChild>
          <Link href="/dashboard/research-analytics">
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" /> Return to Feed
          </Link>
        </Button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-primary">
            <ShieldCheck className="h-4 w-4 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Official Registry Node Access</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black font-headline tracking-tighter">Identity Audit</h1>
        <p className="text-xs sm:text-sm text-muted-foreground font-medium max-w-2xl">
            Detailed forensic profile for institutional identity verification on nyayasahayak.in.
        </p>
      </div>

      <div className="grid md:grid-cols-12 gap-8 items-start">
        <div className="md:col-span-5 space-y-6">
            <div className="space-y-3">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">Digital Identity Card</p>
                <DigitalIDCard user={profile} photoURL={profile.photoURL || ""} />
            </div>
            
            <Card className="glass border-primary/5 rounded-[2rem] overflow-hidden shadow-xl">
                <CardHeader className="bg-primary/5 border-b border-primary/5 p-6">
                    <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                        <Cpu className="h-4 w-4 text-primary" /> Node Specifications
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-primary/5">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Authorized Role</span>
                        <Badge variant="outline" className="font-black text-[8px] uppercase border-primary/20 text-primary px-3">{profile.userType}</Badge>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-primary/5">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Network Status</span>
                        <span className="flex items-center gap-1.5 text-green-600 text-[10px] font-black uppercase">
                            <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></div>
                            Synced
                        </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Registry ID</span>
                        <span className="text-[9px] font-mono font-bold text-primary">NS-NODE-{uid.substring(0,6).toUpperCase()}</span>
                    </div>
                </CardContent>
            </Card>
        </div>

        <div className="md:col-span-7 space-y-6">
            <Card className="glass border-primary/5 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                    <Fingerprint className="h-40 w-40" />
                </div>
                <CardHeader className="p-8 sm:p-10 bg-primary/5 border-b border-primary/10 flex flex-row items-center justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-primary">
                            <User className="h-4 w-4" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Institutional Dossier</span>
                        </div>
                        <CardTitle className="text-2xl sm:text-4xl font-black tracking-tighter leading-none">Public Profile</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="p-8 sm:p-10 space-y-10">
                    <div className="space-y-8">
                        <div className="grid sm:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Identity Label</p>
                                <div className="p-5 rounded-2xl bg-muted/30 border border-primary/5 font-black text-xl tracking-tight text-foreground">
                                    {profile.firstName} {profile.lastName}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Official Registry Node</p>
                                <div className="p-5 rounded-2xl bg-muted/30 border border-primary/5 font-bold text-sm tracking-tight flex items-center gap-3">
                                    <Mail className="h-5 w-5 text-primary opacity-40 shrink-0" />
                                    <span className="truncate lowercase">{profile.email}</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 space-y-4 shadow-inner">
                            <div className="flex items-center gap-3 text-primary">
                                <ShieldCheck className="h-5 w-5" />
                                <h3 className="font-black text-xs uppercase tracking-[0.2em]">Forensic Verification</h3>
                            </div>
                            <p className="text-xs text-muted-foreground font-medium leading-relaxed italic">
                                "This node identity has been cryptographically verified within the nyayasahayak.in ecosystem. All community transmissions from this registry point are authenticated."
                            </p>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-primary/5 flex flex-col sm:flex-row gap-4">
                        <Button className="flex-1 h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20 active:scale-95 transition-all">
                            <MessageSquare className="mr-3 h-4 w-4" /> Message Registry Point
                        </Button>
                        <Button variant="outline" className="h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-[10px] border-primary/10 hover:bg-primary/5 transition-all">
                            <Globe className="mr-3 h-4 w-4" /> Verify Node
                        </Button>
                    </div>
                </CardContent>
            </Card>
            
            <div className="text-center pt-8 opacity-20">
                <p className="text-[8px] font-black uppercase tracking-[0.6em] text-muted-foreground">nyayasahayak.in // Institutional Registry Protocol</p>
            </div>
        </div>
      </div>
    </motion.div>
  );
}