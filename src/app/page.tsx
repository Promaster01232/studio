"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

/**
 * Root Redirect Node
 * 
 * This page has been decommissioned to facilitate direct dashboard ingress.
 * All traffic reaching the root terminal is automatically routed to the 
 * secure dashboard hub.
 */
export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard");
  }, [router]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background">
      <div className="relative">
        <Loader2 className="h-10 w-10 animate-spin text-primary opacity-20" />
      </div>
      <p className="mt-4 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground animate-pulse">
        Initializing Secure Terminal Ingress...
      </p>
    </div>
  );
}
