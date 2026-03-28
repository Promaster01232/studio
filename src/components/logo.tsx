import { cn } from '@/lib/utils';
import Image from 'next/image';
import { motion } from 'framer-motion';

export function Logo({ className, imageClassName, priority = false }: { className?: string, imageClassName?: string, priority?: boolean }) {
  return (
    <div className={cn(
      "relative flex items-center justify-center shrink-0 rounded-full bg-white shadow-[0_20px_50px_rgba(0,0,0,0.15)] border-none overflow-hidden aspect-square p-1",
      "w-[128px] h-[128px]",
      className
    )}>
      {/* Neural Glow Layers */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#FF9933]/20 via-[#000080]/10 to-[#128807]/20 animate-pulse"></div>
      <div className="absolute inset-0 bg-gradient-to-bl from-primary/10 via-transparent to-accent/10"></div>
      
      {/* Professional Inner Border */}
      <div className="absolute inset-[2px] rounded-full bg-white z-0 shadow-inner border border-primary/5"></div>
      
      <Image 
        src="/Logo.png" 
        alt="Nyaya Sahayak Institutional Identity" 
        width={128}
        height={128}
        sizes="(max-width: 768px) 96px, 128px"
        className={cn("object-cover transition-transform group-hover:scale-110 duration-1000 w-full h-full relative z-10", imageClassName)} 
        priority={priority}
      />
      
      {/* Decorative Ashoka Rim */}
      <div className="absolute inset-0 border-[3px] border-dashed border-[#000080]/5 rounded-full animate-[spin_60s_linear_infinite] pointer-events-none"></div>
    </div>
  );
}
