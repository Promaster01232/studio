"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Filter, Search, Star, MapPin, Briefcase, BadgeCheck, MessageSquare, ArrowRight, Scale, User } from "lucide-react";
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
        description="Connect with verified legal professionals."
      />
      
      <div className="flex gap-2">
        <div className="relative flex-1 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Search..." 
              className="pl-9 h-11 border-primary/10 focus:border-primary bg-background/50 backdrop-blur-sm rounded-xl" 
              onChange={handleSearch}
            />
        </div>
        <Button variant="outline" className="h-11 px-3 sm:px-4 border-primary/10 rounded-xl bg-background/50 font-bold gap-2">
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Filter</span>
        </Button>
      </div>

      <div className="flex justify-between items-center border-b border-primary/5 pb-2">
        <h2 className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <Scale className="h-3.5 w-3.5 text-primary" />
            Verified ({filteredAdvocates.length})
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
                <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-primary/5 hover:border-primary/20 group bg-card/40 backdrop-blur-md rounded-2xl active:scale-[0.99]">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start p-4 gap-4 sm:gap-6">
                        {lawyer.image?.imageUrl ? (
                            <div className="relative shrink-0">
                                <Avatar className="h-16 w-16 sm:h-20 sm:w-20 border-2 border-white dark:border-zinc-900 rounded-2xl shadow-md">
                                    <AvatarImage src={lawyer.image.imageUrl} alt={lawyer.name} className="object-cover" />
                                </Avatar>
                                <div className="absolute -bottom-1 -right-1 bg-green-500 border-2 border-white dark:border-zinc-900 h-4 w-4 sm:h-5 sm:w-5 rounded-full shadow-md flex items-center justify-center">
                                    <div className="h-1 sm:h-1.5 w-1 sm:w-1.5 bg-white rounded-full animate-pulse"></div>
                                </div>
                            </div>
                        ) : null}

                        <div className="flex-1 min-w-0 text-center sm:text-left space-y-1">
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                                <p className="font-bold text-lg sm:text-xl leading-tight font-headline group-hover:text-primary transition-colors truncate tracking-tight">
                                    {lawyer.name}
                                </p>
                                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 py-0 px-2 rounded-full text-[8px] sm:text-[9px] font-black tracking-widest uppercase shrink-0">
                                    <BadgeCheck className="h-3 w-3 mr-1" /> Verified
                                </Badge>
                            </div>
                            
                            <p className="text-[10px] sm:text-[11px] text-primary font-black tracking-widest uppercase flex items-center justify-center sm:justify-start gap-2">
                                {lawyer.specialty}
                            </p>
                            
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 sm:gap-x-4 gap-y-1.5 pt-1">
                                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-yellow-500/5 border border-yellow-500/10 text-[10px] sm:text-xs">
                                    <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                                    <span className="font-black">{lawyer.rating}</span>
                                </div>
                                {lawyer.courtName && (
                                    <div className="flex items-center gap-1 text-muted-foreground text-[10px] sm:text-[11px] font-bold uppercase tracking-tight">
                                        <MapPin className="h-3 w-3 text-primary" />
                                        <span className="truncate max-w-[120px] sm:max-w-none">{lawyer.courtName}</span>
                                    </div>
                                )}
                                {lawyer.experience && (
                                    <div className="flex items-center gap-1 text-muted-foreground text-[10px] sm:text-[11px] font-bold uppercase tracking-tight">
                                        <Briefcase className="h-3 w-3 text-primary" />
                                        <span>{lawyer.experience.split(' ')[0]}Y Exp.</span>
                                    </div>
                                )}
                            </div>
                            
                            {lawyer.barId && (
                                <p className="text-[8px] sm:text-[9px] font-black text-muted-foreground/40 uppercase tracking-widest mt-1">
                                    BAR ID: {lawyer.barId}
                                </p>
                            )}
                        </div>
                        
                        <div className="flex gap-2 sm:flex-col shrink-0 mt-2 sm:mt-0 w-full sm:w-auto">
                            <Button variant="outline" size="sm" className="flex-1 sm:w-28 h-9 sm:h-10 rounded-xl border-primary/20 hover:bg-primary/5 font-black text-[10px] sm:text-xs" asChild>
                                <Link href={`/dashboard/lawyer-connect/${lawyer.id}/chat`}>
                                    <MessageSquare className="mr-1.5 h-3.5 w-3.5"/> Chat
                                </Link>
                            </Button>
                            <Button size="sm" className="flex-1 sm:w-28 h-9 sm:h-10 rounded-xl shadow-lg shadow-primary/20 font-black text-[10px] sm:text-xs" asChild>
                                <Link href={`/dashboard/lawyer-connect/${lawyer.id}`}>
                                    Profile
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
                    className="text-center py-16 bg-muted/5 rounded-3xl border-2 border-dashed border-primary/10"
                >
                    <div className="bg-primary/5 p-5 rounded-full w-fit mx-auto mb-4">
                        <Search className="h-10 w-10 text-muted-foreground opacity-20" />
                    </div>
                    <h3 className="text-lg font-black font-headline tracking-tighter">No results</h3>
                    <p className="text-muted-foreground max-w-[200px] mx-auto mt-1 text-[10px] font-medium">Try refining your search to find the right professional.</p>
                    <Button variant="link" size="sm" className="mt-2 text-primary font-black" onClick={() => setFilteredAdvocates(allAdvocates)}>
                        Show all
                    </Button>
                </motion.div>
            )}
        </AnimatePresence>
      </div>
    </div>
  );
}
