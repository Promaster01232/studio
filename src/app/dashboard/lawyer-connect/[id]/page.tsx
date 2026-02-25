
"use client";

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Mail, MessageSquare, Phone, Star, Gavel, Scale, MapPin, BadgeCheck } from "lucide-react";
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
    <div className="space-y-6">
       <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/lawyer-connect">
                <ArrowLeft />
                <span className="sr-only">Back</span>
            </Link>
        </Button>
        <h1 className="text-xl font-semibold">Advocate Profile</h1>
      </div>
      
      <Card className="overflow-hidden border-primary/20">
        <div className="bg-card p-6 relative">
          <div className="flex flex-col items-center text-center">
            {lawyer.image && (
              <Avatar className="h-28 w-24 border-4 border-primary/50 mb-4 rounded-xl shadow-xl">
                <AvatarImage src={lawyer.image.imageUrl} alt={lawyer.name} data-ai-hint={lawyer.image.imageHint} />
                <AvatarFallback className="rounded-xl">{lawyer.name.charAt(0)}</AvatarFallback>
              </Avatar>
            )}
            <h2 className="text-3xl font-bold font-headline flex items-center gap-2">
                {lawyer.name}
                <BadgeCheck className="h-6 w-6 text-primary fill-primary/10" />
            </h2>
            <p className="text-primary font-semibold mt-1">{lawyer.specialty}</p>
            
            <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-1 text-lg">
                    <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                    <span className="font-bold">{lawyer.rating}</span>
                    <span className="text-muted-foreground text-sm">({lawyer.reviews} reviews)</span>
                </div>
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                    <Gavel className="h-3 w-3 mr-1" /> Verified Advocate
                </Badge>
            </div>
          </div>
          
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button variant="outline" size="lg" className="w-full" asChild>
              <Link href={`/dashboard/lawyer-connect/${lawyer.id}/chat`}>
                <MessageSquare className="mr-2 h-5 w-5"/> Message Advocate
              </Link>
            </Button>
            <Button size="lg" className="w-full shadow-lg shadow-primary/20" asChild>
              <Link href={`/dashboard/lawyer-connect/${lawyer.id}/book`}>Book Consultation</Link>
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Scale className="h-5 w-5 text-primary" /> About Me
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{lawyer.about}</p>
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BadgeCheck className="h-5 w-5 text-primary" /> Professional Credentials
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-3 rounded-lg bg-muted/50 border">
                            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Bar Council ID</p>
                            <p className="font-mono font-semibold">{lawyer.barId || 'Verified'}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-muted/50 border">
                            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Primary Specialization</p>
                            <p className="font-semibold">{lawyer.specialty}</p>
                        </div>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-2">Experience & Practice</p>
                        <p className="text-sm text-foreground bg-primary/5 p-3 rounded-md border border-primary/10">{lawyer.experience}</p>
                    </div>
                </CardContent>
            </Card>
        </div>

        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-primary" /> Practice Location
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <p className="text-sm font-bold text-foreground">{lawyer.courtName || 'Primary Court'}</p>
                        <p className="text-sm text-muted-foreground mt-1">{lawyer.courtAddress || 'Location details verified by Bar Council'}</p>
                    </div>
                    <Button variant="outline" className="w-full" asChild>
                        <Link href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lawyer.courtName + ' ' + (lawyer.courtAddress || ''))}`} target="_blank">
                            <MapPin className="mr-2 h-4 w-4" /> View on Map
                        </Link>
                    </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Phone className="h-5 w-5 text-primary" /> Contact Information
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center">
                        <div className="bg-primary/10 p-2 rounded-md mr-4">
                            <Phone className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Phone</p>
                            <a href={`tel:${lawyer.contact?.phone}`} className="font-semibold hover:underline text-sm">{lawyer.contact?.phone}</a>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <div className="bg-primary/10 p-2 rounded-md mr-4">
                            <Mail className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Email</p>
                            <a href={`mailto:${lawyer.contact?.email}`} className="font-semibold hover:underline text-sm truncate block max-w-[180px]">{lawyer.contact?.email}</a>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
