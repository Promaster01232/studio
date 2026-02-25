
"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Filter, Search, Star, MapPin, Gavel } from "lucide-react";
import { getAdvocates, type Lawyer } from "@/lib/advocates-data";
import { Badge } from "@/components/ui/badge";


export default function LawyerConnectPage() {
  const [allAdvocates, setAllAdvocates] = useState<Lawyer[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Lawyer[]>([]);

  useEffect(() => {
    const advocates = getAdvocates();
    setAllAdvocates(advocates);
    setFilteredAdvocates(advocates);
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    const filtered = allAdvocates.filter(
      (lawyer) =>
        lawyer.name.toLowerCase().includes(query) ||
        lawyer.specialty.toLowerCase().includes(query) ||
        (lawyer.courtName && lawyer.courtName.toLowerCase().includes(query))
    );
    setFilteredAdvocates(filtered);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Advocate Directory"
        description="Search and connect with verified legal professionals across various courts."
      />
      
      <div className="flex gap-2">
        <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search Name, Specialization, or Court" 
              className="pl-10" 
              onChange={handleSearch}
            />
        </div>
        <Button variant="outline" size="icon" className="hidden sm:flex">
            <Filter className="h-4 w-4" />
            <span className="sr-only">Filter</span>
        </Button>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold flex items-center gap-2">
            <Gavel className="h-5 w-5 text-primary" />
            Found {filteredAdvocates.length} Advocates
        </h2>
      </div>

      <div className="grid gap-4">
        {filteredAdvocates.length > 0 ? filteredAdvocates.map((lawyer) => (
          <Card key={lawyer.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 border-primary/10 hover:border-primary/30 group">
             <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 gap-4">
                <div className="flex items-center gap-5">
                    {lawyer.image && (
                        <Avatar className="h-16 w-16 border-2 border-primary/20 rounded-xl group-hover:border-primary/50 transition-colors">
                            <AvatarImage src={lawyer.image.imageUrl} alt={lawyer.name} data-ai-hint={lawyer.image.imageHint} />
                            <AvatarFallback className="rounded-xl">{lawyer.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                    )}
                    <div>
                        <div className="flex items-center gap-2">
                            <p className="font-bold text-xl leading-none">{lawyer.name}</p>
                            <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-tighter py-0 px-1 border-primary/20 text-primary">Verified</Badge>
                        </div>
                        <p className="text-sm text-primary font-medium mt-1">{lawyer.specialty}</p>
                        
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
                            <div className="flex items-center gap-1 text-sm">
                                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                <span className="font-bold">{lawyer.rating}</span>
                                {lawyer.reviews !== undefined && <span className="text-muted-foreground text-xs">({lawyer.reviews})</span>}
                            </div>
                            {lawyer.courtName && (
                                <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                                    <MapPin className="h-3 w-3" />
                                    <span className="truncate max-w-[150px]">{lawyer.courtName}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="w-full sm:w-auto flex gap-2">
                    <Button variant="outline" className="flex-1 sm:w-24" asChild>
                        <Link href={`/dashboard/lawyer-connect/${lawyer.id}/chat`}>Chat</Link>
                    </Button>
                    <Button className="flex-1 sm:w-32 shadow-md hover:shadow-lg transition-all" asChild>
                        <Link href={`/dashboard/lawyer-connect/${lawyer.id}`}>View Profile</Link>
                    </Button>
                </div>
            </div>
          </Card>
        )) : (
            <div className="text-center py-20 bg-muted/20 rounded-2xl border-2 border-dashed">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold">No advocates found</h3>
                <p className="text-muted-foreground">Try adjusting your search query or filters.</p>
            </div>
        )}
      </div>
    </div>
  );
}
