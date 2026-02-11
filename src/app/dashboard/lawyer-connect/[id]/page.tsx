
"use client";

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Mail, MessageSquare, Phone, Star } from "lucide-react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { getAdvocates, type Lawyer } from '@/lib/advocates-data';
import { Skeleton } from '@/components/ui/skeleton';

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
      
      <Card className="overflow-hidden">
        <div className="bg-card p-6">
          <div className="flex flex-col items-center text-center">
            {lawyer.image && (
              <Avatar className="h-24 w-24 border-4 border-primary/50 mb-4">
                <AvatarImage src={lawyer.image.imageUrl} alt={lawyer.name} data-ai-hint={lawyer.image.imageHint} />
                <AvatarFallback>{lawyer.name.charAt(0)}</AvatarFallback>
              </Avatar>
            )}
            <h2 className="text-2xl font-bold font-headline">{lawyer.name}</h2>
            <p className="text-muted-foreground">{lawyer.specialty}</p>
            <div className="flex items-center gap-1 text-lg mt-1">
              <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
              <span className="font-bold">{lawyer.rating}</span>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <Button variant="outline" asChild>
              <Link href={`/dashboard/lawyer-connect/${lawyer.id}/chat`}>
                <MessageSquare className="mr-2"/> Message
              </Link>
            </Button>
            <Button asChild>
              <Link href={`/dashboard/lawyer-connect/${lawyer.id}/book`}>Book Consultation</Link>
            </Button>
          </div>
        </div>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>About Me</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{lawyer.about}</p>
        </CardContent>
      </Card>
      
      {lawyer.experience && (
        <Card>
            <CardHeader>
            <CardTitle>Experience</CardTitle>
            </CardHeader>
            <CardContent>
            <p className="text-muted-foreground">{lawyer.experience}</p>
            </CardContent>
        </Card>
      )}
      
      {lawyer.contact && (
        <Card>
            <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
            <div className="flex items-center">
                <Phone className="mr-4 h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                <p className="text-sm text-muted-foreground">Phone</p>
                <a href={`tel:${lawyer.contact.phone}`} className="font-semibold hover:underline">{lawyer.contact.phone}</a>
                </div>
            </div>
            <div className="flex items-center">
                <Mail className="mr-4 h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Email</p>
                    <a href={`mailto:${lawyer.contact.email}`} className="font-semibold hover:underline">{lawyer.contact.email}</a>
                </div>
            </div>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
