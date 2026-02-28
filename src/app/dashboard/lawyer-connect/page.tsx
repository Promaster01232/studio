
"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Filter, Search, Star, MapPin, Gavel, Briefcase, BadgeCheck, MessageSquare, ArrowRight, Scale, User } from "lucide-react";
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
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader
        title="Advocate Directory"
        description="Connect with verified legal professionals across various courts."
      />
      
      <div className="flex gap-2">
        <div className="relative flex-1 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Search by Name, Practice Area, or City..." 
              className="pl-10 h-11 border-primary/10 focus:border-primary bg-background/50 backdrop-blur-sm rounded-xl" 
              onChange={handleSearch}
            />
        </div>
        <Button variant="outline" className="hidden sm:flex h-11 px-4 border-primary/10 rounded-xl bg-background/50 font-bold gap-2">
            <Filter className="h-4 w-4" />
            Filter
        </Button>
      </div>

      <div className="flex justify-between items-center border-b border-primary/5 pb-2">
        <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <Scale className="h-4 w-4 text-primary" />
            Verified Results ({filteredAdvocates.length})
        </h2>
      </div>

      <div className="grid gap-3">
        <AnimatePresence mode="popLayout">
            {filteredAdvocates.length > 0 ? filteredAdvocates.map((lawyer, index) => (
            <motion.div
                key={lawyer.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
            >
                <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-primary/5 hover:border-primary/20 group bg-card/40 backdrop-blur-md rounded-2xl">
                    <div className="flex flex-col sm:flex-row items-center p-4 gap-4 sm:gap-6">
                        <div className="relative shrink-0">
                            <Avatar className="h-16 w-16 sm:h-20 sm:w-20 border-2 border-white dark:border-zinc-900 rounded-2xl shadow-md group-hover:scale-105 transition-transform duration-500">
                                <AvatarImage src={lawyer.image?.imageUrl} alt={lawyer.name} data-ai-hint={lawyer.image?.imageHint} className="object-cover" />
                                <AvatarFallback className="rounded-2xl bg-primary/5 text-primary border-2 border-primary/10 shadow-inner flex items-center justify-center">
                                    <User className="h-8 w-8 opacity-40" />
                                </AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-1 -right-1 bg-green-500 border-2 border-white dark:border-zinc-900 h-5 w-5 rounded-full shadow-md flex items-center justify-center" title="Available">
                                <div className="h-1.5 w-1.5 bg-white rounded-full animate-pulse"></div>
                            </div>
                        </div>

                        <div className="flex-1 min-w-0 text-center sm:text-left space-y-1">
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                                <p className="font-bold text-xl leading-tight font-headline group-hover:text-primary transition-colors truncate tracking-tight">
                                    {lawyer.name}
                                </p>
                                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 py-0 px-2 rounded-full text-[9px] font-black tracking-widest uppercase">
                                    <BadgeCheck className="h-3 w-3 mr-1" /> Verified
                                </Badge>
                            </div>
                            
                            <p className="text-[11px] text-primary font-black tracking-widest uppercase flex items-center justify-center sm:justify-start gap-2">
                                {lawyer.specialty}
                            </p>
                            
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 pt-1">
                                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-yellow-500/5 border border-yellow-500/10 text-xs">
                                    <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                                    <span className="font-black">{lawyer.rating}</span>
                                    {lawyer.reviews !== undefined && <span className="text-muted-foreground text-[10px] font-bold">({lawyer.reviews})</span>}
                                </div>
                                {lawyer.courtName && (
                                    <div className="flex items-center gap-1 text-muted-foreground text-[11px] font-bold uppercase tracking-tight">
                                        <MapPin className="h-3 w-3 text-primary" />
                                        <span className="truncate">{lawyer.courtName}</span>
                                    </div>
                                )}
                                {lawyer.experience && (
                                    <div className="flex items-center gap-1 text-muted-foreground text-[11px] font-bold uppercase tracking-tight">
                                        <Briefcase className="h-3 w-3 text-primary" />
                                        <span>{lawyer.experience.split(' ')[0]} Yrs Exp.</span>
                                    </div>
                                )}
                            </div>
                            
                            {lawyer.barId && (
                                <p className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-widest mt-1">
                                    BAR ID: {lawyer.barId}
                                </p>
                            )}
                        </div>
                        
                        <div className="flex gap-2 sm:flex-col lg:flex-row shrink-0 mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-primary/5 w-full sm:w-auto">
                            <Button variant="outline" size="sm" className="flex-1 sm:w-32 h-10 rounded-xl border-primary/20 hover:bg-primary/5 font-black text-xs transition-all" asChild>
                                <Link href={`/dashboard/lawyer-connect/${lawyer.id}/chat`}>
                                    <MessageSquare className="mr-2 h-3.5 w-3.5"/> Message
                                </Link>
                            </Button>
                            <Button size="sm" className="flex-1 sm:w-32 h-10 rounded-xl shadow-lg shadow-primary/20 font-black text-xs transition-all group/btn" asChild>
                                <Link href={`/dashboard/lawyer-connect/${lawyer.id}`}>
                                    Profile <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1" />
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
                    className="text-center py-20 bg-muted/5 rounded-3xl border-2 border-dashed border-primary/10"
                >
                    <div className="bg-primary/5 p-6 rounded-full w-fit mx-auto mb-6">
                        <Search className="h-12 w-12 text-muted-foreground opacity-20" />
                    </div>
                    <h3 className="text-xl font-black font-headline tracking-tighter">No advocates found</h3>
                    <p className="text-muted-foreground max-w-xs mx-auto mt-2 text-sm font-medium">Try refining your search to find the right legal professional.</p>
                    <Button variant="link" className="mt-4 text-primary font-black" onClick={() => setFilteredAdvocates(allAdvocates)}>
                        Show all advocates
                    </Button>
                </motion.div>
            )}
        </AnimatePresence>
      </div>
    </div>
  );
}
