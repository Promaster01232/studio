
"use client";

import Image from "next/image";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Filter, Search, Star } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const lawyers = [
  {
    id: 1,
    name: "Anjali Sharma",
    specialty: "Family Law",
    rating: 4.3,
    reviews: 1903,
    image: PlaceHolderImages.find(img => img.id === 'lawyer2')
  },
  {
    id: 2,
    name: "Siddharth Rao",
    specialty: "Cyber Law",
    rating: 4.8,
    reviews: 1500,
    image: PlaceHolderImages.find(img => img.id === 'lawyer1')
  },
  {
    id: 3,
    name: "Priya Singh",
    specialty: "Civil Law",
    rating: 5.0,
    reviews: 893,
    image: PlaceHolderImages.find(img => img.id === 'lawyer5')
  },
  {
    id: 4,
    name: "Rajesh Kumar",
    specialty: "Crypto Law",
    rating: 4.7,
    reviews: 1354,
    image: PlaceHolderImages.find(img => img.id === 'lawyer3')
  },
  {
    id: 5,
    name: "Sunita Reddy",
    specialty: "Real Estate",
    rating: 4.9,
    reviews: 1101,
    image: PlaceHolderImages.find(img => img.id === 'lawyer2')
  },
  {
    id: 6,
    name: "Amit Verma",
    specialty: "Corporate Law",
    rating: 4.6,
    reviews: 750,
    image: PlaceHolderImages.find(img => img.id === 'lawyer6')
  },
];


export default function LawyerConnectPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Advocate Directory"
        description="Search and connect with advocates."
      />
      
      <div className="flex gap-2">
        <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search Name or Specialization" className="pl-10" />
        </div>
        <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
            <span className="sr-only">Filter</span>
        </Button>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Personal Details</h2>
        <Button variant="link" className="text-primary">See All</Button>
      </div>

      <div className="space-y-4">
        {lawyers.map((lawyer) => (
          <Card key={lawyer.id} className="overflow-hidden hover:shadow-lg transition-shadow">
             <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                    {lawyer.image && (
                        <Avatar className="h-14 w-14 border-2 border-primary">
                            <AvatarImage src={lawyer.image.imageUrl} alt={lawyer.name} data-ai-hint={lawyer.image.imageHint} />
                            <AvatarFallback>{lawyer.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                    )}
                    <div>
                        <p className="font-semibold text-lg">{lawyer.name}</p>
                        <p className="text-sm text-muted-foreground">{lawyer.specialty}</p>
                        <div className="flex items-center gap-1 text-sm mt-1">
                            <Star className="h-4 w-4 text-accent fill-accent" />
                            <span className="font-bold">{lawyer.rating}</span>
                            <span className="text-muted-foreground text-xs">({lawyer.reviews} reviews)</span>
                        </div>
                    </div>
                </div>
                <Button>Connect</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
