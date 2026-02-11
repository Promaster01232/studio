
"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Filter, Search, Star } from "lucide-react";
import { getAdvocates, type Lawyer } from "@/lib/advocates-data";


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
        lawyer.specialty.toLowerCase().includes(query)
    );
    setFilteredAdvocates(filtered);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Advocate Directory"
        description="Search and connect with advocates."
      />
      
      <div className="flex gap-2">
        <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search Name or Specialization" 
              className="pl-10" 
              onChange={handleSearch}
            />
        </div>
        <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
            <span className="sr-only">Filter</span>
        </Button>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Found {filteredAdvocates.length} Advocates</h2>
        {/* <Button variant="link" className="text-primary">See All</Button> */}
      </div>

      <div className="space-y-4">
        {filteredAdvocates.map((lawyer) => (
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
                            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                            <span className="font-bold">{lawyer.rating}</span>
                            {lawyer.reviews !== undefined && <span className="text-muted-foreground text-xs">({lawyer.reviews} reviews)</span>}
                        </div>
                    </div>
                </div>
                <Button asChild>
                  <Link href={`/dashboard/lawyer-connect/${lawyer.id}`}>Connect</Link>
                </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
