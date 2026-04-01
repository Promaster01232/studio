'use client';

import { useState, useEffect } from 'react';
import { Cookie } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if consent has already been given
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      // Small delay to ensure smooth entry after hydration
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Avoid hydration mismatch with client-side only visibility
  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-0 left-0 right-0 z-[200] border-t border-primary/10 bg-background/95 backdrop-blur-xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] py-3 sm:py-2.5 px-4 sm:px-6"
        >
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="shrink-0 p-1.5 bg-sky-500/10 rounded-lg">
                <Cookie className="h-5 w-5 text-sky-500" />
              </div>
              <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed font-medium max-w-4xl text-center sm:text-left">
                We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies. Read our{' '}
                <Link href="/dashboard/cookie-policy" className="text-primary hover:underline font-bold underline decoration-primary/20 underline-offset-4">
                  Cookie Policy
                </Link>.
              </p>
            </div>
            <div className="shrink-0 w-full sm:w-auto">
              <Button 
                onClick={handleAccept} 
                className="bg-sky-500 hover:bg-sky-600 text-white font-bold h-9 sm:h-8 px-6 text-[11px] rounded-lg transition-all active:scale-95 w-full sm:w-auto shadow-lg shadow-sky-500/20"
              >
                Accept All
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  function handleAccept() {
    localStorage.setItem('cookie-consent', 'true');
    setIsVisible(false);
  }
}
