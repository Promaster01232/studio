"use client";

import { cn } from '@/lib/utils';
import Image from 'next/image';

/**
 * Institutional Identity Hub (Logo)
 * 
 * Static version for maximum professional clarity and zero distraction.
 */
export function Logo({ className, imageClassName, priority = true }: { className?: string, imageClassName?: string, priority?: boolean }) {
  return (
    <div 
      className={cn(
        "relative flex items-center justify-center shrink-0 overflow-hidden aspect-square rounded-lg",
        "w-10 h-10",
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
    </div>
  );
}