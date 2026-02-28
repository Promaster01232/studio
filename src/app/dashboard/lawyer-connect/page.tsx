"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Filter, Search, Star, MapPin, Briefcase, BadgeCheck, MessageSquare, Scale, User, ChevronRight } from "lucide-react";
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
        (lawyer.courtName && lawyer.courtName.toLowerCase().includes(query))
    );
    setFilteredAdvocates(filtered);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader
        title="Advocate Directory"
        description="Connect with verified legal professionals near you."
      />
      
      <div className="flex gap-2">
        <div className="relative flex-1 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Search by name, court or specialty..." 
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
            Active Professionals ({filteredAdvocates.length})
        </h2>
      </div>

      <div className="grid gap-2">
        <AnimatePresence mode="popLayout">
            {filteredAdvocates.length > 0 ? filteredAdvocates.map((lawyer, index) => (
            <motion.div
                key={lawyer.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.03 }}
                whileHover={{ x: 4 }}
                className="group"
            >
                <Card className="overflow-hidden border-primary/5 hover:border-primary/20 bg-card/40 backdrop-blur-md rounded-xl transition-all duration-300 hover:shadow-md">
                    <div className="flex flex-col sm:flex-row items-center p-3 sm:p-4 gap-4">
                        {/* Avatar Section */}
                        <div className="relative shrink-0">
                            {lawyer.image?.imageUrl ? (
                                <Avatar className="h-12 w-12 sm:h-14 sm:w-14 border-2 border-white dark:border-zinc-900 rounded-full shadow-sm">
                                    <AvatarImage src={lawyer.image.imageUrl} alt={lawyer.name} className="object-cover" />
                                </Avatar>
                            ) : (
                                <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-inner">
                                    <User className="h-6 w-6 opacity-40" />
                                </div>
                            )}
                            <div className="absolute -bottom-0.5 -right-0.5 bg-green-500 border-2 border-background h-3.5 w-3.5 rounded-full shadow-sm"></div>
                        </div>

                        {/* Content Section */}
                        <div className="flex-1 min-w-0 text-center sm:text-left">
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                                <p className="font-bold text-base sm:text-lg leading-tight group-hover:text-primary transition-colors truncate tracking-tight">
                                    {lawyer.name}
                                </p>
                                <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/10 py-0 px-1.5 rounded text-[8px] sm:text-[9px] font-black tracking-widest uppercase shrink-0">
                                    <BadgeCheck className="h-3 w-3 mr-1" /> Verified
                                </Badge>
                            </div>
                            
                            <p className="text-[10px] sm:text-[11px] text-muted-foreground font-bold tracking-tight uppercase mt-0.5">
                                {lawyer.specialty}
                            </p>
                            
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1 mt-1.5">
                                <div className="flex items-center gap-1 text-[10px] sm:text-xs">
                                    <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                                    <span className="font-black">{lawyer.rating}</span>
                                </div>
                                {lawyer.courtName && (
                                    <div className="flex items-center gap-1 text-muted-foreground/60 text-[10px] sm:text-xs font-medium truncate max-w-[120px] sm:max-w-none">
                                        <MapPin className="h-3 w-3" />
                                        <span>{lawyer.courtName}</span>
                                    </div>
                                )}
                                {lawyer.experience && (
                                    <div className="flex items-center gap-1 text-muted-foreground/60 text-[10px] sm:text-xs font-medium">
                                        <Briefcase className="h-3 w-3" />
                                        <span>{lawyer.experience.split(' ')[0]}Y Exp.</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        {/* Actions Section */}
                        <div className="flex gap-2 shrink-0 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 mt-1 sm:mt-0">
                            <Button variant="ghost" size="sm" className="flex-1 sm:w-auto h-9 rounded-lg hover:bg-primary/10 font-bold text-[10px] sm:text-xs" asChild>
                                <Link href={`/dashboard/lawyer-connect/${lawyer.id}/chat`}>
                                    <MessageSquare className="mr-1.5 h-3.5 w-3.5"/> Chat
                                </Link>
                            </Button>
                            <Button size="sm" className="flex-1 sm:w-auto h-9 px-4 rounded-lg shadow-md font-black text-[10px] sm:text-xs group/btn" asChild>
                                <Link href={`/dashboard/lawyer-connect/${lawyer.id}`}>
                                    View Profile
                                    <ChevronRight className="ml-1 h-3 w-3 transition-transform group-hover/btn:translate-x-0.5" />
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
                    className="text-center py-16 bg-muted/5 rounded-2xl border-2 border-dashed border-primary/10"
                >
                    <div className="bg-primary/5 p-5 rounded-full w-fit mx-auto mb-4">
                        <Search className="h-10 w-10 text-muted-foreground opacity-20" />
                    </div>
                    <h3 className="text-lg font-black font-headline tracking-tighter">No results found</h3>
                    <p className="text-muted-foreground max-w-[200px] mx-auto mt-1 text-[10px] font-medium">Try searching for a different name or court location.</p>
                    <Button variant="link" size="sm" className="mt-2 text-primary font-black" onClick={() => setFilteredAdvocates(allAdvocates)}>
                        Show all professionals
                    </Button>
                </motion.div>
            )}
        </AnimatePresence>
      </div>
    </div>
  );
}
