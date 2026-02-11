"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Phone, Paperclip, Mic } from "lucide-react";
import Link from "next/link";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";

// Mock data
const lawyers = [
  {
    id: 1,
    name: "Anjali Sharma",
    specialty: "Family Law",
    rating: 4.8,
    image: PlaceHolderImages.find(img => img.id === 'lawyer2'),
  },
  // Add other lawyers if needed
];

const messages = [
    { id: 1, sender: 'other', text: 'The yet a free cow thate ham masrie tti' },
    { id: 2, sender: 'me', text: 'Was anjali sharma on be half the your officew busy' },
    { id: 3, sender: 'other', text: 'The younahly is per win ael call thweer' },
    { id: 4, sender: 'me', text: 'Youra sharma your ou the inclohay' },
    { id: 5, sender: 'other', text: 'Wes sce but he may have the drora yout have liiay' },
    { id: 6, sender: 'other', text: 'Yousee do woescki ookind for for then you caen dant' },
];


export default function ChatPage({ params }: { params: { id: string } }) {
  const lawyer = lawyers.find(l => l.id.toString() === params.id);
  
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
                        <p className="text-sm font-bold">4.8</p>
                    </div>
                    <div className="flex gap-2">
                        <Button size="icon" variant="outline" className="bg-green-100 border-green-200 text-green-700">
                            <Phone />
                        </Button>
                         <Button size="icon" variant="outline" className="bg-green-500 text-white">
                            <Phone />
                        </Button>
                    </div>
                </div>
            </Card>
            
            {messages.map(message => (
                 <div key={message.id} className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`px-4 py-2 rounded-lg max-w-[80%] ${message.sender === 'me' ? 'bg-primary text-primary-foreground' : 'bg-background'}`}>
                        {message.text}
                    </div>
                </div>
            ))}
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
