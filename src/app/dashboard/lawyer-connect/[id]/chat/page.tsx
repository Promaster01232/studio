
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Phone, Paperclip, Mic, Video } from "lucide-react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { getAdvocates, type Lawyer } from "@/lib/advocates-data";
import { Skeleton } from "@/components/ui/skeleton";

const messages: {id: number, sender: string, text: string}[] = [];


export default function ChatPage() {
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
            <div className="flex-1 p-4 space-y-4">
                <Skeleton className="h-28 w-full max-w-md mx-auto" />
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
    <div className="flex flex-col h-full bg-muted/30">
        <header className="flex items-center gap-4 p-4 border-b bg-background">
            <Button variant="ghost" size="icon" asChild>
                <Link href={`/dashboard/lawyer-connect/${lawyer.id}`}>
                    <ArrowLeft />
                    <span className="sr-only">Back</span>
                </Link>
            </Button>
            <div className="flex items-center gap-3">
                {lawyer.image && (
                    <Avatar className="h-10 w-10 border">
                        <AvatarImage src={lawyer.image.imageUrl} alt={lawyer.name} data-ai-hint={lawyer.image.imageHint} />
                        <AvatarFallback>{lawyer.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                )}
                <div>
                    <p className="font-semibold">{lawyer.name}</p>
                    <p className="text-xs text-muted-foreground">Online</p>
                </div>
            </div>
            <div className="ml-auto">
                <Button variant="ghost" size="icon">
                    <Phone />
                    <span className="sr-only">Call</span>
                </Button>
            </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <Card className="p-4 max-w-md mx-auto">
                <div className="flex items-center gap-4">
                    {lawyer.image && (
                        <Avatar className="h-12 w-12">
                            <AvatarImage src={lawyer.image.imageUrl} alt={lawyer.name} data-ai-hint={lawyer.image.imageHint} />
                            <AvatarFallback>{lawyer.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                    )}
                    <div className="flex-1">
                        <p className="font-bold">{lawyer.name}</p>
                        <p className="text-sm text-muted-foreground">{lawyer.specialty}</p>
                        <p className="text-sm font-bold">{lawyer.rating}</p>
                    </div>
                    <div className="flex gap-2">
                        <Button size="icon" variant="outline">
                            <Phone />
                        </Button>
                         <Button size="icon">
                            <Video />
                        </Button>
                    </div>
                </div>
            </Card>
            
            {messages.length > 0 ? messages.map(message => (
                 <div key={message.id} className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`px-4 py-2 rounded-lg max-w-[80%] ${message.sender === 'me' ? 'bg-primary text-primary-foreground' : 'bg-background'}`}>
                        {message.text}
                    </div>
                </div>
            )) : (
              <div className="text-center text-sm text-muted-foreground py-10">
                No messages yet. Start the conversation!
              </div>
            )}
        </div>
        
        <footer className="p-4 bg-background border-t">
            <div className="relative">
                <Input placeholder="Type your message..." className="pr-24 rounded-full"/>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="text-muted-foreground">
                        <Paperclip />
                    </Button>
                     <Button variant="ghost" size="icon" className="text-muted-foreground">
                        <Mic />
                    </Button>
                </div>
            </div>
        </footer>
    </div>
  );
}
