
"use client";

import { useEffect, useState, use } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Phone, Paperclip, Mic, Video, ShieldCheck, Loader2 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { type Lawyer } from "@/lib/advocates-data";
import { Skeleton } from "@/components/ui/skeleton";
import { useDatabase } from "@/firebase";
import { ref, onValue } from "firebase/database";

export default function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const rtdb = useDatabase();
  const [lawyer, setLawyer] = useState<Lawyer | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const advocateRef = ref(rtdb, `advocates/${unwrappedParams.id}`);
    
    const unsubscribe = onValue(advocateRef, (snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val() as Lawyer;
            // SECURITY: Ensure unapproved profiles are inaccessible via direct URL
            if (data.isApproved) {
                setLawyer(data);
            } else {
                setLawyer(undefined);
            }
        }
        setLoading(false);
    });

    return () => unsubscribe();
  }, [unwrappedParams.id, rtdb]);

  if (loading) {
    return (
        <div className="flex flex-col h-full bg-muted/30">
            <header className="flex items-center gap-4 p-4 border-b bg-background">
                <Skeleton className="h-10 w-10" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-16" />
                </div>
                <div className="ml-auto">
                    <Skeleton className="h-10 w-10" />
                </div>
            </header>
            <div className="flex-1 p-4 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary opacity-20" />
            </div>
            <footer className="p-4 bg-background border-t">
                <Skeleton className="h-12 w-full rounded-full" />
            </footer>
        </div>
    )
  }
  
  if (!lawyer) {
    notFound();
  }

  return (
    <div className="flex flex-col h-full bg-muted/30 -m-4 md:-m-6 lg:-m-8">
        <header className="flex items-center gap-4 p-4 border-b bg-background/80 backdrop-blur-md sticky top-0 z-10">
            <Button variant="ghost" size="icon" className="rounded-xl hover:bg-primary/5" asChild>
                <Link href={`/dashboard/lawyer-connect/${lawyer.uid || lawyer.id}`}>
                    <ArrowLeft className="h-5 w-5" />
                    <span className="sr-only">Back</span>
                </Link>
            </Button>
            <div className="flex items-center gap-3">
                <div className="relative">
                    <Avatar className="h-10 w-10 border border-primary/10 shadow-sm">
                        {lawyer.image && <AvatarImage src={lawyer.image.imageUrl} alt={lawyer.name} className="object-cover" />}
                        <AvatarFallback className="font-black bg-primary/10 text-primary">{lawyer.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-0.5 -right-0.5 bg-green-500 h-3 w-3 rounded-full border-2 border-white shadow-sm"></div>
                </div>
                <div>
                    <div className="flex items-center gap-1.5">
                        <p className="font-black text-sm tracking-tight">{lawyer.name}</p>
                        <ShieldCheck className="h-3 w-3 text-blue-500" />
                    </div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Verified Member</p>
                </div>
            </div>
            <div className="ml-auto flex items-center gap-1">
                <Button variant="ghost" size="icon" className="rounded-xl text-muted-foreground hover:text-primary">
                    <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-xl text-muted-foreground hover:text-primary">
                    <Video className="h-4 w-4" />
                </Button>
            </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            <Card className="p-6 max-w-sm mx-auto bg-card/40 backdrop-blur-sm border-primary/5 shadow-xl rounded-2xl text-center">
                <Avatar className="h-20 w-20 border-4 border-background shadow-xl mx-auto mb-4 rounded-2xl">
                    {lawyer.image && <AvatarImage src={lawyer.image.imageUrl} alt={lawyer.name} className="object-cover" />}
                    <AvatarFallback className="text-xl font-black">{lawyer.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="space-y-1 mb-6">
                    <h2 className="font-black text-xl tracking-tighter">{lawyer.name}</h2>
                    <p className="text-xs font-bold text-primary uppercase tracking-widest">{lawyer.specialty}</p>
                    <div className="flex items-center justify-center gap-1.5 mt-2">
                        <div className="flex text-yellow-500">
                            {[...Array(5)].map((_, i) => <span key={i} className="text-xs">★</span>)}
                        </div>
                        <span className="text-[10px] font-black">{lawyer.rating}</span>
                    </div>
                </div>
                <p className="text-[10px] font-medium text-muted-foreground leading-relaxed px-4">
                    Your session with this advocate is encrypted and strictly confidential under legal privilege.
                </p>
            </Card>
            
            <div className="flex justify-center my-8">
                <span className="bg-muted px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-muted-foreground border border-primary/5">Consultation Started</span>
            </div>
        </div>
        
        <footer className="p-4 bg-background/80 backdrop-blur-md border-t sticky bottom-0">
            <div className="relative max-w-4xl mx-auto">
                <Input placeholder="Message your legal co-pilot..." className="h-12 pr-24 rounded-2xl bg-muted/30 border-primary/5 focus:border-primary font-medium text-sm transition-all"/>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-muted-foreground hover:text-primary">
                        <Paperclip className="h-4 w-4" />
                    </Button>
                     <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-muted-foreground hover:text-primary">
                        <Mic className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </footer>
    </div>
  );
}
