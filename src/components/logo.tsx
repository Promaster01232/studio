"use client";

import { cn } from '@/lib/utils';
import Image from 'next/image';
import { motion } from 'framer-motion';

/**
 * Institutional Identity Hub (Logo)
 * 
 * Optimized for Largest Contentful Paint (LCP) with priority rendering support.
 * Added continuous pulse animation to indicate active session protection.
 */
export function Logo({ className, imageClassName, priority = true }: { className?: string, imageClassName?: string, priority?: boolean }) {
  return (
    <motion.div 
      initial={{ scale: 0.95 }}
      animate={{ scale: [0.95, 1, 0.95] }}
      transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
      className={cn(
        "relative flex items-center justify-center shrink-0 overflow-hidden aspect-square rounded-2xl transition-all duration-500",
        "w-24 h-24",
        "hover:scale-105 active:scale-95 shadow-2xl shadow-primary/5",
        className
      )}
    >
      <div className="relative z-10 w-full h-full p-1">
        <Image 
          src="/Logo.png" 
          alt="Nyaya Sahayak Identity" 
          width={128}
          height={128}
          className={cn("object-contain w-full h-full", imageClassName)} 
          priority={priority}
        />
      </div>
      {/* Design Polish: Subtle Glow indicative of Active Protection */}
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-primary/5 animate-pulse rounded-full blur-xl pointer-events-none" />
    </motion.div>
  );
}
