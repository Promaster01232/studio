"use client";

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, MessageSquare, Star, MapPin, BadgeCheck, Briefcase, GraduationCap, Globe, User, Scale, Phone, Mail } from "lucide-react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { getAdvocates, type Lawyer } from '@/lib/advocates-data';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

export default function LawyerProfilePage() {
  const params = useParams<{ id: string }>();
  const [lawyer, setLawyer] = useState<Lawyer | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const advocates = getAdvocates();
    const foundLawyer = advocates.find(l => l.id.toString() === params.id);
    setLawyer(foundLawyer);
    setLoading(false);
  }, [params.id]);

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
    <div className="space-y-8 max-w-6xl mx-auto">
       <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" className="hover:bg-primary/5 text-primary font-bold" asChild>
            <Link href="/dashboard/lawyer-connect">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Directory
            </Link>
        </Button>
      </div>
      
      <Card className="overflow-hidden border-primary/10 shadow-2xl shadow-primary/5">
        <div className="bg-muted/5 p-8 md:p-12 relative">
          <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-8">
            {lawyer.image?.imageUrl && (
              <Avatar className="h-40 w-32 md:h-48 md:w-40 border-4 border-white dark:border-zinc-900 rounded-3xl shadow-2xl transition-transform hover:scale-[1.02]">
                <AvatarImage src={lawyer.image.imageUrl} alt={lawyer.name} data-ai-hint={lawyer.image.imageHint} className="object-cover" />
                <AvatarFallback className="rounded-3xl bg-primary/5 text-primary text-4xl font-black font-headline border-2 border-primary/10 shadow-inner flex items-center justify-center">
                    <User className="h-16 w-16 opacity-20" />
                </AvatarFallback>
              </Avatar>
            )}
            
            <div className="flex-1 space-y-4">
                <div className="space-y-1">
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                        <h2 className="text-4xl md:text-5xl font-black font-headline tracking-tighter">
                            {lawyer.name}
                        </h2>
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 py-1 px-3">
                            <BadgeCheck className="h-4 w-4 mr-1.5" /> Verified Advocate
                        </Badge>
                    </div>
                    <p className="text-xl text-primary font-bold tracking-tight uppercase">{lawyer.specialty}</p>
                </div>
                
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 pt-2">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`h-5 w-5 ${i < Math.floor(Number(lawyer.rating)) ? 'text-yellow-400 fill-yellow-400' : 'text-muted opacity-30'}`} />
                            ))}
                        </div>
                        <span className="font-black text-lg">{lawyer.rating}</span>
                        <span className="text-muted-foreground text-sm font-medium">({lawyer.reviews} Reviews)</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
                        <MapPin className="h-4 w-4 text-primary" />
                        {lawyer.courtName}
                    </div>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-4 max-w-md">
                    <Button variant="outline" size="lg" className="flex-1 h-14 text-lg border-primary/20 hover:bg-primary/5 font-bold" asChild>
                    <Link href={`/dashboard/lawyer-connect/${lawyer.id}/chat`}>
                        <MessageSquare className="mr-2 h-5 w-5"/> Message
                    </Link>
                    </Button>
                    <Button size="lg" className="flex-1 h-14 text-lg shadow-xl shadow-primary/20 font-bold hover:scale-[1.02] active:scale-95 transition-all" asChild>
                    <Link href={`/dashboard/lawyer-connect/${lawyer.id}/book`}>Book Consultation</Link>
                    </Button>
                </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
            <Card className="border-primary/10">
                <CardHeader className="border-b bg-muted/30">
                    <CardTitle className="flex items-center gap-3 text-xl font-bold font-headline">
                        <Scale className="h-6 w-6 text-primary" /> Professional Bio
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                    <p className="text-muted-foreground leading-relaxed text-lg whitespace-pre-line">{lawyer.about}</p>
                </CardContent>
            </Card>
            
            <Card className="border-primary/10 overflow-hidden">
                <CardHeader className="border-b bg-primary/5">
                    <CardTitle className="flex items-center gap-3 text-xl font-bold font-headline">
                        <BadgeCheck className="h-6 w-6 text-primary" /> Verified Credentials
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x border-b">
                        <div className="p-6 space-y-1">
                            <p className="text-xs text-muted-foreground uppercase font-black tracking-widest flex items-center gap-2">
                                <GraduationCap className="h-3.5 w-3.5 text-primary" /> Bar Council ID
                            </p>
                            <p className="font-mono text-lg font-black text-foreground">{lawyer.barId || 'ID-VERIFIED-BCI'}</p>
                        </div>
                        <div className="p-6 space-y-1">
                            <p className="text-xs text-muted-foreground uppercase font-black tracking-widest flex items-center gap-2">
                                <Scale className="h-3.5 w-3.5 text-primary" /> Core Practice
                            </p>
                            <p className="font-bold text-lg text-foreground">{lawyer.specialty}</p>
                        </div>
                    </div>
                    <div className="p-8 space-y-4">
                        <div className="space-y-2">
                            <p className="text-xs text-muted-foreground uppercase font-black tracking-widest flex items-center gap-2">
                                <Briefcase className="h-3.5 w-3.5 text-primary" /> Experience & Achievements
                            </p>
                            <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10">
                                <p className="text-foreground font-medium leading-relaxed">{lawyer.experience}</p>
                            </div>
                        </div>
                        {lawyer.courts && lawyer.courts.length > 0 && (
                            <div className="space-y-2">
                                <p className="text-xs text-muted-foreground uppercase font-black tracking-widest">Authorized Courts</p>
                                <div className="flex flex-wrap gap-2">
                                    {lawyer.courts.map((c: string) => (
                                        <Badge key={c} variant="outline" className="bg-background font-bold border-primary/20 text-primary">{c}</Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>

        <div className="space-y-8">
            <Card className="border-primary/10 overflow-hidden">
                <CardHeader className="border-b bg-muted/30">
                    <CardTitle className="flex items-center gap-3 text-lg font-bold font-headline">
                        <MapPin className="h-5 w-5 text-primary" /> Practice Location
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                    <div className="space-y-2">
                        <p className="font-black text-foreground text-xl leading-tight">{lawyer.courtName || 'District Court Chamber'}</p>
                        <p className="text-sm text-muted-foreground font-medium leading-relaxed">{lawyer.courtAddress || 'Authorized practice area within state jurisdiction.'}</p>
                    </div>
                    <Button variant="outline" className="w-full h-12 border-primary/20 hover:bg-primary/5 font-bold" asChild>
                        <Link href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lawyer.courtName + ' ' + (lawyer.courtAddress || ''))}`} target="_blank">
                            <Globe className="mr-2 h-4 w-4" /> View Office Map
                        </Link>
                    </Button>
                </CardContent>
            </Card>

            <Card className="border-primary/10 overflow-hidden">
                <CardHeader className="border-b bg-muted/30">
                    <CardTitle className="flex items-center gap-3 text-lg font-bold font-headline">
                        <Phone className="h-5 w-5 text-primary" /> Verified Contact
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                    <div className="flex items-center p-3 rounded-2xl bg-primary/5 border border-primary/10 transition-colors hover:bg-primary/10">
                        <div className="bg-primary text-white p-2.5 rounded-xl mr-4 shadow-lg shadow-primary/20">
                            <Phone className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Phone</p>
                            <a href={`tel:${lawyer.contact?.phone}`} className="font-black text-foreground hover:text-primary transition-colors">{lawyer.contact?.phone}</a>
                        </div>
                    </div>
                    <div className="flex items-center p-3 rounded-2xl bg-primary/5 border border-primary/10 transition-colors hover:bg-primary/10">
                        <div className="bg-primary text-white p-2.5 rounded-xl mr-4 shadow-lg shadow-primary/20">
                            <Mail className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Official Email</p>
                            <a href={`mailto:${lawyer.contact?.email}`} className="font-black text-foreground hover:text-primary transition-colors truncate block">{lawyer.contact?.email}</a>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
