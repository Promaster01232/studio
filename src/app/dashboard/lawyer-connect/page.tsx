
"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Filter, Search, Star, MapPin, Gavel, Briefcase, BadgeCheck, MessageSquare, ArrowRight } from "lucide-react";
import { getAdvocates, type Lawyer } from "@/lib/advocates-data";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

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
    <div className="space-y-8 max-w-6xl mx-auto">
      <PageHeader
        title="Verified Advocate Directory"
        description="Search and connect with top-rated legal professionals across High Courts and District Courts."
      />
      
      <div className="flex gap-3">
        <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Search by Name, Practice Area, Bar ID, or City..." 
              className="pl-12 h-14 shadow-sm border-primary/10 focus:border-primary bg-background/50 backdrop-blur-sm transition-all text-lg rounded-2xl" 
              onChange={handleSearch}
            />
        </div>
        <Button variant="outline" className="hidden sm:flex h-14 px-6 border-primary/10 rounded-2xl bg-background/50 font-bold gap-2">
            <Filter className="h-5 w-5" />
            Filter
        </Button>
      </div>

      <div className="flex justify-between items-center border-b border-primary/5 pb-4">
        <h2 className="text-xl font-black font-headline flex items-center gap-3">
            <Gavel className="h-6 w-6 text-primary" />
            Verified Results ({filteredAdvocates.length})
        </h2>
      </div>

      <div className="grid gap-6">
        <AnimatePresence mode="popLayout">
            {filteredAdvocates.length > 0 ? filteredAdvocates.map((lawyer, index) => (
            <motion.div
                key={lawyer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
            >
                <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 border-primary/5 hover:border-primary/20 group bg-card/40 backdrop-blur-md rounded-3xl">
                    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between p-6 sm:p-8 gap-8">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8 flex-1 min-w-0">
                            <div className="relative shrink-0">
                                {lawyer.image ? (
                                    <Avatar className="h-24 w-24 sm:h-32 sm:w-28 border-4 border-white dark:border-zinc-900 rounded-[2.5rem] group-hover:scale-105 transition-transform duration-500 shadow-xl">
                                        <AvatarImage src={lawyer.image.imageUrl} alt={lawyer.name} data-ai-hint={lawyer.image.imageHint} className="object-cover" />
                                        <AvatarFallback className="rounded-[2.5rem] bg-primary/5 text-primary font-black text-3xl">{lawyer.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                ) : (
                                    <div className="h-24 w-24 sm:h-32 sm:w-28 bg-primary/5 rounded-[2.5rem] flex items-center justify-center border-4 border-white dark:border-zinc-900 shadow-xl">
                                        <Gavel className="h-12 w-12 text-primary opacity-30" />
                                    </div>
                                )}
                                <div className="absolute -bottom-2 -right-2 bg-green-500 border-4 border-white dark:border-zinc-900 h-8 w-8 rounded-full shadow-lg flex items-center justify-center" title="Available Now">
                                    <div className="h-2.5 w-2.5 bg-white rounded-full animate-pulse"></div>
                                </div>
                            </div>

                            <div className="space-y-3 flex-1 min-w-0">
                                <div className="space-y-1">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <p className="font-black text-3xl leading-tight font-headline group-hover:text-primary transition-colors truncate tracking-tighter">
                                            {lawyer.name}
                                        </p>
                                        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 py-1 px-3 rounded-full text-[10px] font-black tracking-widest uppercase">
                                            <BadgeCheck className="h-3.5 w-3.5 mr-1.5" /> Verified
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-primary font-black tracking-widest uppercase flex items-center gap-2">
                                        {lawyer.specialty}
                                    </p>
                                </div>
                                
                                <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-yellow-500/5 border border-yellow-500/10 shadow-sm">
                                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                        <span className="font-black text-sm">{lawyer.rating}</span>
                                        {lawyer.reviews !== undefined && <span className="text-muted-foreground text-xs font-bold">({lawyer.reviews} Reviews)</span>}
                                    </div>
                                    {lawyer.courtName && (
                                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary/5 border border-primary/10 shadow-sm text-muted-foreground">
                                            <MapPin className="h-4 w-4 text-primary" />
                                            <span className="truncate text-xs font-black uppercase tracking-tight">{lawyer.courtName}</span>
                                        </div>
                                    )}
                                    {lawyer.experience && (
                                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary/5 border border-primary/10 shadow-sm text-muted-foreground">
                                            <Briefcase className="h-4 w-4 text-primary" />
                                            <span className="truncate text-xs font-black uppercase tracking-tight">{lawyer.experience.split(' ')[0]} Years Exp.</span>
                                        </div>
                                    )}
                                </div>
                                
                                {lawyer.barId && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest bg-muted/30 px-2 py-0.5 rounded-md border">
                                            BAR ID: {lawyer.barId}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row lg:flex-col gap-4 justify-end lg:w-64 pt-6 lg:pt-0 border-t lg:border-t-0 lg:border-l border-primary/5 lg:pl-8">
                            <Button variant="outline" size="lg" className="flex-1 lg:w-full h-14 rounded-2xl border-primary/20 hover:bg-primary/5 font-black text-base shadow-sm transition-all" asChild>
                                <Link href={`/dashboard/lawyer-connect/${lawyer.id}/chat`}>
                                    <MessageSquare className="mr-2 h-5 w-5"/> Quick Message
                                </Link>
                            </Button>
                            <Button size="lg" className="flex-1 lg:w-full h-14 rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/30 font-black text-base transition-all group/btn" asChild>
                                <Link href={`/dashboard/lawyer-connect/${lawyer.id}`}>
                                    View Full Profile <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover/btn:translate-x-1" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </Card>
            </motion.div>
            )) : (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-32 bg-muted/5 rounded-[3rem] border-2 border-dashed border-primary/10"
                >
                    <div className="bg-primary/5 p-8 rounded-full w-fit mx-auto mb-8">
                        <Search className="h-20 w-20 text-muted-foreground opacity-20" />
                    </div>
                    <h3 className="text-3xl font-black font-headline tracking-tighter">No matching advocates found</h3>
                    <p className="text-muted-foreground max-w-sm mx-auto mt-3 font-medium">Try searching by name, specialization, or Bar ID to find the right professional for your needs.</p>
                    <Button variant="link" className="mt-6 text-primary font-black text-lg" onClick={() => setFilteredAdvocates(allAdvocates)}>
                        Clear search and show all
                    </Button>
                </motion.div>
            )}
        </AnimatePresence>
      </div>
    </div>
  );
}
