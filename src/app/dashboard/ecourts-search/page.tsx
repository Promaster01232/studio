
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function ECourtsSearchPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/dashboard/my-cases');
    }, [router]);

    return (
        <div className="flex h-full w-full items-center justify-center">
            <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Redirecting...</span>
            </div>
        </div>
    );
}
