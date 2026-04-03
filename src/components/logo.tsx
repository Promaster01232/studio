import { cn } from '@/lib/utils';
import Image from 'next/image';

export function Logo({ className, imageClassName, priority = true }: { className?: string, imageClassName?: string, priority?: boolean }) {
  return (
    <div className={cn(
      "relative flex items-center justify-center shrink-0 rounded-full bg-white shadow-[0_10px_40px_rgba(0,0,0,0.1)] border-none overflow-hidden aspect-square",
      "w-24 h-24",
      className
    )}>
      {/* Professional Kinetic Halo */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-primary/10 animate-[spin_8s_linear_infinite]"></div>
      </div>

      {/* Inner Design Node */}
      <div className="absolute inset-[3px] rounded-full bg-white z-10 shadow-inner flex items-center justify-center overflow-hidden border border-primary/5">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-black/5"></div>
        
        <Image 
          src="/Logo.png" 
          alt="Nyaya Sahayak Identity" 
          width={128}
          height={128}
          className={cn("object-cover transition-transform group-hover:scale-105 duration-700 w-full h-full relative z-20", imageClassName)} 
          priority={priority}
        />
      </div>
      
      {/* Decorative Rotating Rim */}
      <div className="absolute inset-0 border-[1.5px] border-dashed border-primary/20 rounded-full animate-[spin_40s_linear_infinite] pointer-events-none z-30"></div>
    </div>
  );
}
