"use client";

import { useEffect, useState, use } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, MessageSquare, Star, MapPin, BadgeCheck, Briefcase, Globe, User, Scale, Phone, Mail, Loader2, ChevronRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { type Lawyer } from '@/lib/advocates-data';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { motion } from "framer-motion";
import { useDatabase } from '@/firebase';
import { ref, get } from 'firebase/database';

export default function LawyerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const rtdb = useDatabase();
  const [lawyer, setLawyer] = useState<Lawyer | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLawyer = async () => {
        try {
            const advocateRef = ref(rtdb, `advocates/${unwrappedParams.id}`);
            const snapshot = await get(advocateRef);
            if (snapshot.exists()) {
                const data = snapshot.val() as Lawyer;
                if (data.isApproved) {
                    setLawyer(data);
                }
            }
        } catch (error) {
            console.error("Error fetching lawyer:", error);
        } finally {
            setLoading(false);
        }
    };
    
    fetchLawyer();
  }, [unwrappedParams.id, rtdb]);

  if (loading) {
      return (
          <div className="space-y-6">
              <Skeleton className="h-10 w-48" />
              <Skeleton className="h-56 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-40 w-full" />
          </div>
      );
  }
  
  if (!lawyer) {
    notFound();
  }

  return (
    <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-6 max-w-5xl mx-auto"
    >
       <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" className="hover:bg-primary/5 text-primary font-bold h-9 rounded-xl" asChild>
            <Link href="/dashboard/lawyer-connect">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Directory
            </Link>
        </Button>
      </div>
      
      <Card className="overflow-hidden border-primary/10 shadow-2xl bg-card/40 backdrop-blur-md rounded-2xl">
        <div className="bg-primary/5 p-6 md:p-8 relative">
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6 md:gap-8">
            {lawyer.image?.imageUrl ? (
              <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-background rounded-2xl shadow-xl shrink-0 transition-transform hover:scale-[1.02]">
                <AvatarImage src={lawyer.image.imageUrl} alt={lawyer.name} className="object-cover" />
              </Avatar>
            ) : (
                <div className="h-32 w-32 md:h-40 md:w-40 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border-4 border-background shadow-xl shrink-0">
                    <User className="h-16 w-16 text-primary/30" />
                </div>
            )}
            
            <div className="flex-1 space-y-3 min-w-0">
                <div className="space-y-1">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                        <h2 className="text-2xl md:text-4xl font-bold font-headline tracking-tighter truncate">
                            {lawyer.name}
                        </h2>
                        {lawyer.isVerified && (
                            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 py-0.5 px-2 text-[9px] font-bold shrink-0">
                                <BadgeCheck className="h-3 w-3 mr-1 text-blue-500" /> Verified
                            </Badge>
                        )}
                    </div>
                    <p className="text-sm md:text-lg text-primary font-bold tracking-tight">{lawyer.specialty}</p>
                </div>
                
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-5">
                    <div className="flex items-center gap-1.5">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-bold text-sm">{lawyer.rating}</span>
                        <span className="text-muted-foreground text-[10px] font-bold">({lawyer.reviews} Reviews)</span>
                    </div>
                    {lawyer.courtName && (
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground/80 tracking-tight">
                            <MapPin className="h-3.5 w-3.5 text-primary" />
                            {lawyer.courtName}
                        </div>
                    )}
                </div>

                <div className="mt-6 flex flex-col sm:flex-row gap-3 max-w-sm">
                    <Button variant="outline" size="sm" className="flex-1 h-11 font-bold border-primary/10 bg-background/50 rounded-xl" asChild>
                        <Link href={`/dashboard/lawyer-connect/${lawyer.uid || lawyer.id}/chat`}>
                            <MessageSquare className="mr-2 h-4 w-4"/> Chat
                        </Link>
                    </Button>
                    <Button size="sm" className="flex-1 h-11 font-bold shadow-xl shadow-primary/20 tracking-tighter rounded-xl" asChild>
                        <Link href={`/dashboard/lawyer-connect/${lawyer.uid || lawyer.id}/book`}>Book Consult</Link>
                    </Button>
                </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
            <Card className="border-primary/5 shadow-xl bg-card/30 backdrop-blur-sm rounded-2xl">
                <CardHeader className="p-5 border-b border-primary/5 bg-primary/5">
                    <CardTitle className="flex items-center gap-2 text-sm font-bold tracking-tight">
                        <Scale className="h-4 w-4 text-primary" /> Professional Bio
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <p className="text-muted-foreground leading-relaxed text-sm whitespace-pre-line font-medium">{lawyer.about}</p>
                </CardContent>
            </Card>
            
            <Card className="border-primary/5 shadow-xl bg-card/30 backdrop-blur-sm rounded-2xl overflow-hidden">
                <CardHeader className="p-5 border-b border-primary/5 bg-primary/5">
                    <CardTitle className="flex items-center gap-2 text-sm font-bold tracking-tight">
                        <BadgeCheck className="h-4 w-4 text-primary" /> Core Credentials
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <p className="text-[9px] text-muted-foreground font-bold tracking-tight flex items-center gap-2">
                                <Briefcase className="h-3 w-3 text-primary" /> Core Practice
                            </p>
                            <p className="font-bold text-sm text-foreground">{lawyer.specialty}</p>
                        </div>
                        <div className="space-y-1.5">
                            <p className="text-[9px] text-muted-foreground font-bold tracking-tight flex items-center gap-2">
                                <Scale className="h-3 w-3 text-primary" /> Total Experience
                            </p>
                            <p className="font-bold text-sm text-foreground">{lawyer.experience}</p>
                        </div>
                    </div>
                    
                    {lawyer.courts && lawyer.courts.length > 0 && (
                        <div className="pt-5 border-t border-primary/5">
                            <p className="text-[9px] text-muted-foreground font-bold tracking-tight mb-3">Authorized Jurisdictions</p>
                            <div className="flex flex-wrap gap-2">
                                {lawyer.courts.map((c: string) => (
                                    <Badge key={c} variant="outline" className="bg-primary/5 font-bold border-primary/10 text-primary text-[10px] rounded-lg py-1 px-3 tracking-tighter">{c}</Badge>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>

        <div className="space-y-6">
            <Card className="border-primary/5 shadow-xl bg-card/30 backdrop-blur-sm rounded-2xl overflow-hidden">
                <CardHeader className="p-5 border-b border-primary/5 bg-primary/5">
                    <CardTitle className="flex items-center gap-2 text-sm font-bold tracking-tight">
                        <MapPin className="h-4 w-4 text-primary" /> Practice Location
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-5">
                    <div className="space-y-2">
                        <p className="font-bold text-foreground text-lg tracking-tighter leading-tight">{lawyer.courtName || 'District Court Chamber'}</p>
                        <p className="text-xs text-muted-foreground font-medium leading-relaxed">{lawyer.courtAddress || 'Authorized practice area within state jurisdiction.'}</p>
                    </div>
                    <Button variant="outline" size="sm" className="w-full font-bold border-primary/10 h-10 text-[10px] tracking-tight rounded-xl hover:bg-primary/5" asChild>
                        <Link href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lawyer.courtName + ' ' + (lawyer.courtAddress || ''))}`} target="_blank">
                            <Globe className="mr-2 h-3.5 w-3.5" /> Open Maps
                        </Link>
                    </Button>
                </CardContent>
            </Card>

            <Card className="border-primary/5 shadow-xl bg-card/30 backdrop-blur-sm rounded-2xl overflow-hidden">
                <CardHeader className="p-5 border-b border-primary/5 bg-primary/5">
                    <CardTitle className="flex items-center gap-2 text-sm font-bold tracking-tight">
                        <Phone className="h-4 w-4 text-primary" /> Contact Details
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-3">
                    <div className="flex items-center p-3 rounded-xl bg-primary/5 border border-primary/10">
                        <div className="bg-primary text-white p-2 rounded-lg mr-3 shadow-lg shadow-primary/20">
                            <Phone className="h-3.5 w-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[8px] text-muted-foreground font-bold tracking-tight">Mobile Number</p>
                            <span className="font-bold text-xs text-foreground truncate block">Verified</span>
                        </div>
                    </div>
                    <div className="flex items-center p-3 rounded-xl bg-primary/5 border border-primary/10">
                        <div className="bg-primary text-white p-2 rounded-lg mr-3 shadow-lg shadow-primary/20">
                            <Mail className="h-3.5 w-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[8px] text-muted-foreground font-bold tracking-tight">Official Email</p>
                            <span className="font-bold text-xs text-foreground truncate block lowercase">{lawyer.contact?.email}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </motion.div>
  );
}
