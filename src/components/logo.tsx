import { cn } from '@/lib/utils';
import Image from 'next/image';

export function Logo({ className, imageClassName, priority = true }: { className?: string, imageClassName?: string, priority?: boolean }) {
  return (
    <div className={cn(
      "relative flex items-center justify-center shrink-0 rounded-full bg-white shadow-[0_20px_80px_rgba(0,0,0,0.2)] border-none overflow-hidden aspect-square",
      "w-32 h-32",
      className
    )}>
      {/* Spectral Side Animation Layer */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#FF9933] via-[#000080] to-[#128807] animate-[spin_4s_linear_infinite] opacity-40 scale-150 blur-xl"></div>
        <div className="absolute inset-0 bg-gradient-to-bl from-[#128807] via-[#000080] to-[#FF9933] animate-[spin_6s_linear_infinite_reverse] opacity-30 scale-150 blur-2xl"></div>
      </div>

      {/* Professional Inner Glow */}
      <div className="absolute inset-[2px] rounded-full bg-white z-10 shadow-inner border border-primary/5 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5"></div>
        
        <Image 
          src="/Logo.png" 
          alt="Nyaya Sahayak Institutional Identity" 
          width={128}
          height={128}
          sizes="(max-width: 768px) 96px, 128px"
          className={cn("object-cover transition-transform group-hover:scale-110 duration-1000 w-full h-full relative z-20", imageClassName)} 
          priority={priority}
        />
      </div>
      
      {/* Kinetic Border Pulse */}
      <div className="absolute inset-0 border-[2px] border-primary/20 rounded-full animate-pulse z-30 pointer-events-none"></div>
      
      {/* Decorative Rotating Rim */}
      <div className="absolute inset-0 border-[4px] border-dashed border-[#000080]/10 rounded-full animate-[spin_60s_linear_infinite] pointer-events-none z-40"></div>
    </div>
  );
}
