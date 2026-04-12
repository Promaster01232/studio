'use client';

import { Logo } from "@/components/logo";
import { ShieldCheck, Activity } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] w-full">
      <div className="relative mb-6">
        <div className="p-1 rounded-full bg-primary/5 shadow-xl">
          <div className="bg-white rounded-full p-2">
            <Logo className="h-12 w-12 shadow-none border-none p-0 bg-transparent" priority={true} />
          </div>
        </div>
      </div>

      <div className="space-y-3 text-center">
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 px-4 py-1 rounded-full bg-primary/5 border border-primary/10">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            <h3 className="text-xs font-black tracking-tight text-foreground uppercase">
              Authorizing Terminal
            </h3>
          </div>
          <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-muted-foreground/30">
            <Activity className="h-3 w-3" />
            Registry Syncing // Ingress Active
          </div>
        </div>
      </div>
    </div>
  );
}