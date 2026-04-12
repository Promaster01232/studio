
"use client";

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import Image from 'next/image';

/**
 * Institutional Identity Hub (Logo)
 * 
 * Reverted to original image asset node as per statutory mandate.
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
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        <Image 
          src="/Logo.png" 
          alt="Nyaya Sahayak Logo" 
          width={40}
          height={40}
          priority={priority}
          className={cn("object-contain p-0.5", imageClassName)}
        />
      </div>
      <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl pointer-events-none" />
    </motion.div>
  );
}
