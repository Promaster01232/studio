
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
import { MessageSquare, Search } from "lucide-react";
import { ReactNode, useState, useEffect } from "react";
import { getAdvocates, type Lawyer } from "@/lib/advocates-data";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";
import { ScrollArea } from "./ui/scroll-area";
import { Input } from "./ui/input";

export function ChatListDialog({ children }: { children: ReactNode }) {
  const [advocates, setAdvocates] = useState<Lawyer[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    // In a real app, this would be a real-time listener
    // For now we fetch from our local directory
    setAdvocates(getAdvocates());
  }, []);

  const filtered = advocates.filter(a => 
    a.name.toLowerCase().includes(search.toLowerCase()) || 
    a.specialty.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Connect & Chat
          </DialogTitle>
          <DialogDescription>
            Select an advocate from your directory to start a conversation.
          </DialogDescription>
        </DialogHeader>
        
        <div className="relative my-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
                placeholder="Search by name or specialty..." 
                className="pl-9" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
        </div>

        <ScrollArea className="h-[400px] mt-2 pr-4">
            <div className="space-y-3">
                {filtered.length > 0 ? filtered.map((advocate) => (
                    <div key={advocate.id} className="flex items-center gap-4 p-3 rounded-xl border bg-card hover:shadow-md transition-all">
                        <Avatar className="h-10 w-10 border border-primary/10">
                            {advocate.image && <AvatarImage src={advocate.image.imageUrl} alt={advocate.name} />}
                            <AvatarFallback>{advocate.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold truncate">{advocate.name}</p>
                            <p className="text-[10px] uppercase tracking-wider text-primary font-medium truncate">{advocate.specialty}</p>
                        </div>
                        <Button size="sm" variant="secondary" asChild className="rounded-full px-4">
                            <Link href={`/dashboard/lawyer-connect/${advocate.id}/chat`}>
                                Chat
                            </Link>
                        </Button>
                    </div>
                )) : (
                    <div className="text-center py-20 bg-muted/20 rounded-xl border border-dashed">
                        <Search className="h-10 w-10 text-muted-foreground mx-auto mb-2 opacity-20" />
                        <p className="text-sm text-muted-foreground">No advocates found matching your search.</p>
                    </div>
                )}
            </div>
        </ScrollArea>
        <div className="pt-4 border-t text-center">
            <Button variant="link" className="text-xs" asChild>
                <Link href="/dashboard/lawyer-connect">View Full Directory</Link>
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
