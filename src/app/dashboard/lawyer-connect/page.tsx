
"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Filter, Search, Star, MapPin, Briefcase, BadgeCheck, MessageSquare, Scale, Globe, Phone, Mail, ChevronRight, Loader2, ShieldCheck } from "lucide-react";
import { type Lawyer } from "@/lib/advocates-data";
import { motion, AnimatePresence } from "framer-motion";
import { useDatabase } from "@/firebase";
import { ref, onValue } from "firebase/database";

export default function LawyerConnectPage() {
  const rtdb = useDatabase();
  const [allAdvocates, setAllAdvocates] = useState<Lawyer[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Lawyer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const advocatesRef = ref(rtdb, "advocates");
    
    const unsubscribe = onValue(advocatesRef, (snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            const list = Object.values(data) as Lawyer[];
            
            // CRITICAL: Filter for Approved AND Not Blocked professionals
            // Unapproved profiles are never visible to the public.
            const approvedList = list.filter(adv => 
                adv.isApproved === true && 
                adv.isBlocked !== true
            );
            
            setAllAdvocates(approvedList);
            setFilteredAdvocates(approvedList);
        } else {
            setAllAdvocates([]);
            setFilteredAdvocates([]);
        }
        setLoading(false);
    }, (error) => {
        console.error("Failed to fetch directory:", error);
        setLoading(false);
    });

    return () => unsubscribe();
  }, [rtdb]);

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

  if (loading) {
      return (
          <div className="flex h-[60vh] items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
      );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <PageHeader
        title="Advocate Directory"
        description="Connect with AI-authenticated and manually verified legal professionals."
      />
      
      <div className="flex gap-2">
        <div className="relative flex-1 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Search..." 
              className="pl-9 h-11 border-primary/10 focus:border-primary bg-background/50 backdrop-blur-sm rounded-xl font-medium text-sm" 
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
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            Verified professionals ({filteredAdvocates.length})
        </h2>
      </div>

      <div className="grid gap-6">
        <AnimatePresence mode="popLayout">
            {filteredAdvocates.length > 0 ? filteredAdvocates.map((lawyer, index) => (
            <motion.div
                key={lawyer.uid || lawyer.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.03 }}
                className="group"
            >
                <Card className="overflow-hidden border-primary/10 bg-card/40 backdrop-blur-md rounded-2xl transition-all duration-300 hover:shadow-xl hover:border-primary/30 flex flex-col h-full">
                    <div className="flex flex-col sm:flex-row flex-1 min-h-[220px]">
                        {/* Digital ID Section */}
                        <div className="w-full sm:w-[200px] md:w-[240px] flex flex-col items-center justify-center p-6 bg-muted/20 border-b sm:border-b-0 sm:border-r border-primary/5 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent"></div>
                            <div className="relative group/avatar">
                                {lawyer.image?.imageUrl ? (
                                    <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-4 border-background shadow-2xl rounded-full transition-transform group-hover/avatar:scale-105 duration-500">
                                        <AvatarImage src={lawyer.image.imageUrl} alt={lawyer.name} className="object-cover" />
                                        <AvatarFallback className="text-2xl font-black">{lawyer.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                ) : (
                                    <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-primary/10 flex items-center justify-center text-primary border-4 border-background shadow-xl">
                                        <Scale className="h-8 w-8 sm:h-10 sm:w-10 opacity-40" />
                                    </div>
                                )}
                                <div className="absolute -bottom-1 -right-1 bg-green-500 border-4 border-background h-5 w-5 sm:h-6 sm:w-6 rounded-full shadow-lg animate-pulse"></div>
                            </div>
                            <div className="mt-4 text-center z-10">
                                <p className="text-[8px] sm:text-[9px] font-bold text-primary/60 mt-1 uppercase tracking-tighter">Verified Member</p>
                            </div>
                        </div>

                        {/* Professional Info Section */}
                        <div className="flex-1 p-5 sm:p-6 md:p-8 flex flex-col justify-center">
                            <div className="mb-4 sm:mb-6 space-y-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    <h3 className="text-xl sm:text-2xl font-black tracking-tighter leading-none group-hover:text-primary transition-colors truncate">
                                        {lawyer.name}
                                    </h3>
                                    {lawyer.isVerified && (
                                        <BadgeCheck className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 shrink-0" />
                                    )}
                                </div>
                                <p className="text-[11px] sm:text-sm font-bold text-primary tracking-tight">
                                    {lawyer.specialty}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 sm:gap-y-3 gap-x-6 text-[10px] sm:text-[11px] font-bold text-muted-foreground">
                                <div className="flex items-center gap-2 sm:gap-3 group/item">
                                    <div className="p-1.5 rounded-lg bg-primary/5 text-primary group-hover/item:bg-primary group-hover/item:text-white transition-colors">
                                        <Globe className="h-3 w-3" />
                                    </div>
                                    <span className="truncate tracking-tight">Nyaya Sahayak Registry</span>
                                </div>
                                <div className="flex items-center gap-2 sm:gap-3 group/item">
                                    <div className="p-1.5 rounded-lg bg-primary/5 text-primary group-hover/item:bg-primary group-hover/item:text-white transition-colors">
                                        <Phone className="h-3 w-3" />
                                    </div>
                                    <span>{lawyer.contact?.phone || 'Identity Verified'}</span>
                                </div>
                                <div className="flex items-center gap-2 sm:gap-3 group/item">
                                    <div className="p-1.5 rounded-lg bg-primary/5 text-primary group-hover/item:bg-primary group-hover/item:text-white transition-colors">
                                        <Mail className="h-3 w-3" />
                                    </div>
                                    <span className="truncate lowercase">{lawyer.contact?.email}</span>
                                </div>
                                <div className="flex items-center gap-2 sm:gap-3 group/item">
                                    <div className="p-1.5 rounded-lg bg-primary/5 text-primary group-hover/item:bg-primary group-hover/item:text-white transition-colors">
                                        <MapPin className="h-3 w-3" />
                                    </div>
                                    <span className="truncate">{lawyer.courtName || 'District Court Chamber'}</span>
                                </div>
                            </div>
                            
                            <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-primary/5 flex items-center gap-4 sm:gap-6">
                                <div className="flex items-center gap-1 sm:gap-1.5">
                                    <Star className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-yellow-500 fill-yellow-500" />
                                    <span className="text-xs sm:text-sm font-black tracking-tighter">{lawyer.rating}</span>
                                    <span className="text-[9px] sm:text-[10px] opacity-40">({lawyer.reviews})</span>
                                </div>
                                <div className="flex items-center gap-1 sm:gap-1.5 text-muted-foreground">
                                    <Briefcase className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                    <span className="text-xs sm:text-sm font-black tracking-tighter">{lawyer.experience?.split(' ')[0]}Y exp.</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-primary/10 flex divide-x divide-primary/10 bg-muted/5 group-hover:bg-muted/10 transition-colors">
                        <Button variant="ghost" className="flex-1 h-12 rounded-none font-bold text-[10px] sm:text-xs hover:bg-primary/5 active:bg-primary/10 transition-all" asChild>
                            <Link href={`/dashboard/lawyer-connect/${lawyer.uid || lawyer.id}/chat`}>
                                <MessageSquare className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                Chat
                            </Link>
                        </Button>
                        <Button variant="ghost" className="flex-1 h-12 rounded-none font-bold text-[10px] sm:text-xs hover:bg-primary/5 active:bg-primary/10 transition-all" asChild>
                            <Link href={`/dashboard/lawyer-connect/${lawyer.uid || lawyer.id}`}>
                                Profile
                                <ChevronRight className="ml-1 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </Link>
                        </Button>
                    </div>
                    <div className="h-1 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20"></div>
                </Card>
            </motion.div>
            )) : (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-20 bg-muted/5 rounded-3xl border-2 border-dashed border-primary/10 mx-2"
                >
                    <div className="bg-primary/5 p-6 rounded-full w-fit mx-auto mb-4">
                        <Search className="h-10 w-10 text-muted-foreground opacity-20" />
                    </div>
                    <h3 className="text-lg font-black font-headline tracking-tighter">No verified professionals found</h3>
                    <p className="text-muted-foreground max-w-[200px] mx-auto mt-2 text-[10px] font-medium leading-relaxed">Advocates only appear here after their Bar credentials have been manually verified by the Admin.</p>
                </motion.div>
            )}
        </AnimatePresence>
      </div>
    </div>
  );
}
