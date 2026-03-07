
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
import { MessageSquare, ShieldCheck, HeartHandshake } from "lucide-react";
import { ReactNode } from "react";
import Link from "next/link";

export function ChatListDialog({ children }: { children: ReactNode }) {
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
                    <DialogTitle className="font-headline font-black text-xl tracking-tight">Legal Aid Support</DialogTitle>
                </div>
                <DialogDescription className="font-medium text-xs">
                    Get guidance on connecting with legal aid organizations.
                </DialogDescription>
            </DialogHeader>
        </div>
        
        <div className="p-8 text-center space-y-4">
            <div className="bg-primary/5 p-6 rounded-full w-fit mx-auto mb-4">
                <HeartHandshake className="h-12 w-12 text-primary opacity-40" />
            </div>
            <h3 className="font-black text-lg tracking-tight">Community Support Hub</h3>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-xs mx-auto">
                Direct messaging is currently reserved for specialized support. Please explore our NGO & Legal Aid directory for assistance.
            </p>
            <Button className="w-full h-11 font-bold rounded-xl shadow-lg shadow-primary/20" asChild>
                <Link href="/dashboard/ngo-legal-aid">View Legal Aid Directory</Link>
            </Button>
        </div>
        
        <div className="p-4 border-t bg-muted/5 text-center">
            <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                <ShieldCheck className="h-3 w-3" />
                Trusted Platform
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
