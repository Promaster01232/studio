
"use client";

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

/**
 * Institutional Identity Hub (Logo)
 * 
 * Custom-designed SVG for Nyaya Sahayak representing the pinnacle of legal intelligence.
 * Optimized for Largest Contentful Paint (LCP).
 */
export function Logo({ className, imageClassName, priority = true }: { className?: string, imageClassName?: string, priority?: boolean }) {
  return (
    <motion.div 
      initial={{ scale: 0.95 }}
      animate={{ scale: [0.95, 1, 0.95] }}
      transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
      className={cn(
        "relative flex items-center justify-center shrink-0 overflow-hidden aspect-square rounded-xl transition-all duration-500",
        "w-10 h-10",
        "hover:scale-105 active:scale-95",
        className
      )}
    >
      <div className="relative z-10 w-full h-full flex items-center justify-center text-primary">
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          className={cn("w-full h-full drop-shadow-sm", imageClassName)}
        >
          {/* Pillar of Justice */}
          <path 
            d="M12 3V21M12 3L9 5M12 3L15 5M12 21H8M12 21H16" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          {/* Main Beam */}
          <path 
            d="M3 10C3 10 7.5 7 12 7C16.5 7 21 10 21 10" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
          />
          {/* Left Pan */}
          <path 
            d="M6 10V14C6 15.6569 4.65685 17 3 17M6 10L3 17H9L6 10Z" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          {/* Right Pan */}
          <path 
            d="M18 10V14C18 15.6569 19.3431 17 21 17M18 10L21 17H15L18 10Z" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
        </svg>
      </div>
      <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl pointer-events-none" />
    </motion.div>
  );
}
