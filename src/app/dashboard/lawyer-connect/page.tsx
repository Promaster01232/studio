
"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Filter, Search, Star, MapPin, Gavel, Briefcase, BadgeCheck } from "lucide-react";
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
        (lawyer.courtName && lawyer.courtName.toLowerCase().includes(query)) ||
        (lawyer.barId && lawyer.barId.toLowerCase().includes(query))
    );
    setFilteredAdvocates(filtered);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Verified Advocate Directory"
        description="Search and connect with legal professionals across high courts and district courts."
      />
      
      <div className="flex gap-2">
        <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search Name, Specialization, Bar ID, or Court Location..." 
              className="pl-10 h-12 shadow-sm border-primary/10 focus:border-primary transition-all" 
              onChange={handleSearch}
            />
        </div>
        <Button variant="outline" size="icon" className="hidden sm:flex h-12 w-12 border-primary/10">
            <Filter className="h-4 w-4" />
            <span className="sr-only">Filter</span>
        </Button>
      </div>

      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
            <Gavel className="h-5 w-5 text-primary" />
            Verified Results ({filteredAdvocates.length})
        </h2>
      </div>

      <div className="grid gap-6">
        {filteredAdvocates.length > 0 ? filteredAdvocates.map((lawyer) => (
          <Card key={lawyer.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 border-primary/5 hover:border-primary/30 group bg-card/50 backdrop-blur-sm">
             <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between p-6 gap-6">
                <div className="flex items-start sm:items-center gap-6 flex-1">
                    {lawyer.image ? (
                        <Avatar className="h-20 w-20 border-2 border-primary/20 rounded-2xl group-hover:border-primary/50 transition-all shadow-md">
                            <AvatarImage src={lawyer.image.imageUrl} alt={lawyer.name} data-ai-hint={lawyer.image.imageHint} className="object-cover" />
                            <AvatarFallback className="rounded-2xl bg-primary/5 text-primary font-bold text-xl">{lawyer.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                    ) : (
                        <div className="h-20 w-20 bg-primary/10 rounded-2xl flex items-center justify-center border-2 border-primary/20">
                            <Gavel className="h-8 w-8 text-primary opacity-50" />
                        </div>
                    )}
                    <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <p className="font-bold text-2xl leading-none font-headline group-hover:text-primary transition-colors truncate">{lawyer.name}</p>
                            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 uppercase text-[10px] font-black tracking-widest">
                                <BadgeCheck className="h-3 w-3 mr-1" /> Verified
                            </Badge>
                        </div>
                        <p className="text-sm text-primary font-bold tracking-tight uppercase">{lawyer.specialty}</p>
                        
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3">
                            <div className="flex items-center gap-1.5 text-sm bg-yellow-500/5 px-2 py-1 rounded-md border border-yellow-500/10">
                                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                <span className="font-bold">{lawyer.rating}</span>
                                {lawyer.reviews !== undefined && <span className="text-muted-foreground text-xs font-medium">({lawyer.reviews} Reviews)</span>}
                            </div>
                            {lawyer.courtName && (
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-md border border-border/50">
                                    <MapPin className="h-3.5 w-3.5 text-primary" />
                                    <span className="truncate font-medium">{lawyer.courtName}</span>
                                </div>
                            )}
                             {lawyer.experience && (
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-md border border-border/50">
                                    <Briefcase className="h-3.5 w-3.5 text-primary" />
                                    <span className="truncate font-medium">{lawyer.experience.split(' ')[0]} Years Exp.</span>
                                </div>
                            )}
                        </div>
                        
                        {lawyer.barId && (
                            <p className="text-[10px] font-mono text-muted-foreground/60 mt-2 uppercase tracking-tighter">Bar ID: {lawyer.barId}</p>
                        )}
                    </div>
                </div>
                
                <div className="flex flex-row md:flex-col gap-3 justify-end md:w-48 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-primary/5 pl-0 md:pl-6">
                    <Button variant="outline" className="flex-1 md:w-full border-primary/20 hover:bg-primary/5" asChild>
                        <Link href={`/dashboard/lawyer-connect/${lawyer.id}/chat`}>Quick Message</Link>
                    </Button>
                    <Button className="flex-1 md:w-full shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all font-bold" asChild>
                        <Link href={`/dashboard/lawyer-connect/${lawyer.id}`}>View Full Profile</Link>
                    </Button>
                </div>
            </div>
          </Card>
        )) : (
            <div className="text-center py-24 bg-muted/10 rounded-3xl border-2 border-dashed border-primary/10">
                <div className="bg-primary/5 p-6 rounded-full w-fit mx-auto mb-6">
                    <Search className="h-16 w-16 text-muted-foreground opacity-20" />
                </div>
                <h3 className="text-2xl font-bold font-headline">No matching advocates found</h3>
                <p className="text-muted-foreground max-w-sm mx-auto mt-2">Try searching by name, specialization, or Bar ID to find the right professional for your needs.</p>
                <Button variant="link" className="mt-4 text-primary font-bold" onClick={() => setFilteredAdvocates(allAdvocates)}>
                    Clear search and show all
                </Button>
            </div>
        )}
      </div>
    </div>
  );
}
