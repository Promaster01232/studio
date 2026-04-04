"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

/**
 * Institutional Terminal Decommissioning
 * This node has been removed from the active registry to ensure platform stability.
 * Any attempt to access this terminal will be rerouted to the secure dashboard ingress.
 */
export default function NotificationsPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/dashboard');
    }, [router]);

    return (
        <div className="flex h-[70vh] w-full flex-col items-center justify-center gap-4">
            <div className="relative">
                <Loader2 className="h-10 w-10 animate-spin text-primary opacity-20" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground animate-pulse">
                Redirecting to Secure Terminal...
            </p>
        </div>
    );
}
