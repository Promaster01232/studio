
"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { MessageSquare, Search, ShieldCheck } from "lucide-react";
import { ReactNode, useState, useEffect } from "react";
import { type Lawyer } from "@/lib/advocates-data";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";
import { ScrollArea } from "./ui/scroll-area";
import { Input } from "./ui/input";
import { useDatabase } from "@/firebase";
import { ref, onValue } from "firebase/database";

export function ChatListDialog({ children }: { children: ReactNode }) {
  const rtdb = useDatabase();
  const [advocates, setAdvocates] = useState<Lawyer[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const advocatesRef = ref(rtdb, "advocates");
    
    // Only show approved and verified advocates in the chat selection
    const unsubscribe = onValue(advocatesRef, (snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            const list = Object.values(data) as Lawyer[];
            setAdvocates(list.filter(adv => adv.isApproved === true));
        } else {
            setAdvocates([]);
        }
    });

    return () => unsubscribe();
  }, [rtdb]);

  const filtered = advocates.filter(a => 
    a.name.toLowerCase().includes(search.toLowerCase()) || 
    a.specialty.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-2xl">
        <div className="bg-primary/5 p-6 border-b border-primary/5">
            <DialogHeader className="p-0 border-none mb-0">
                <div className="flex items-center gap-3 mb-1">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    <DialogTitle className="font-headline font-black text-xl tracking-tight">Verified Professionals</DialogTitle>
                </div>
                <DialogDescription className="font-medium text-xs">
                    Start a secure consultation with approved legal experts.
                </DialogDescription>
            </DialogHeader>
        </div>
        
        <div className="p-4">
            <div className="relative mb-4 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input 
                    placeholder="Search by name or specialty..." 
                    className="pl-9 h-11 border-primary/10 rounded-xl bg-background/50 font-bold text-sm" 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <ScrollArea className="h-[350px] pr-2">
                <div className="space-y-3">
                    {filtered.length > 0 ? filtered.map((advocate) => (
                        <div key={advocate.uid || advocate.id} className="flex items-center gap-4 p-3 rounded-xl border border-primary/5 bg-card hover:bg-primary/5 hover:border-primary/20 transition-all group">
                            <Avatar className="h-12 w-12 border-2 border-background shadow-md group-hover:scale-105 transition-transform">
                                {advocate.image && <AvatarImage src={advocate.image.imageUrl} alt={advocate.name} className="object-cover" />}
                                <AvatarFallback className="font-black bg-primary/10 text-primary">{advocate.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-black truncate tracking-tight">{advocate.name}</p>
                                <div className="flex items-center gap-1">
                                    <span className="text-[9px] uppercase tracking-widest text-primary font-black truncate">{advocate.specialty}</span>
                                    <ShieldCheck className="h-2.5 w-2.5 text-blue-500 shrink-0" />
                                </div>
                            </div>
                            <Button size="sm" variant="outline" asChild className="rounded-xl h-9 px-4 font-bold border-primary/10 hover:bg-primary hover:text-white shadow-sm transition-all active:scale-95">
                                <Link href={`/dashboard/lawyer-connect/${advocate.uid || advocate.id}/chat`}>
                                    Chat
                                </Link>
                            </Button>
                        </div>
                    )) : (
                        <div className="text-center py-16 bg-muted/10 rounded-2xl border border-dashed border-primary/10 mx-1">
                            <Search className="h-10 w-10 text-muted-foreground mx-auto mb-2 opacity-20" />
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">No verified advocates found.</p>
                        </div>
                    )}
                </div>
            </ScrollArea>
        </div>
        <div className="p-4 border-t bg-muted/5 text-center">
            <Button variant="link" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors" asChild>
                <Link href="/dashboard/lawyer-connect">Explore Full Registry</Link>
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
