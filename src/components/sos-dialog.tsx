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
import { ShieldAlert, Phone, Ambulance, Flame, Heart, Baby, Shield } from "lucide-react";
import { ReactNode } from "react";

const helplineNumbers: { name: string; number: string; icon: React.ElementType, color: string }[] = [
  { name: "National Emergency", number: "112", icon: ShieldAlert, color: "bg-red-500/10 text-red-500" },
  { name: "Police", number: "100", icon: Shield, color: "bg-blue-500/10 text-blue-500" },
  { name: "Fire", number: "101", icon: Flame, color: "bg-orange-500/10 text-orange-500" },
  { name: "Ambulance", number: "108", icon: Ambulance, color: "bg-green-500/10 text-green-500" },
  { name: "Women Helpline", number: "1091", icon: Heart, color: "bg-pink-500/10 text-pink-500" },
  { name: "Child Helpline", number: "1098", icon: Baby, color: "bg-purple-500/10 text-purple-500" },
];

export function SosDialog({ children }: { children: ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <ShieldAlert className="h-6 w-6 text-destructive"/>
            Emergency Helplines
          </DialogTitle>
          <DialogDescription>
            In case of emergency, call these numbers immediately. Click a number to dial.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 pt-4">
          {helplineNumbers.map((item) => (
            <a href={`tel:${item.number}`} key={item.name} className="block group rounded-lg transition-colors hover:bg-accent">
              <div className="flex items-center gap-4 p-3">
                <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${item.color}`}>
                  <item.icon className="h-6 w-6"/>
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-2xl font-bold tracking-wider text-foreground">{item.number}</p>
                </div>
                <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground group-hover:text-primary">
                  <div>
                    <Phone className="h-5 w-5" />
                    <span className="sr-only">Call {item.name}</span>
                  </div>
                </Button>
              </div>
            </a>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
