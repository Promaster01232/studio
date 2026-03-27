import { cn } from '@/lib/utils';
import Image from 'next/image';

export function Logo({ className, imageClassName }: { className?: string, imageClassName?: string }) {
  return (
    <div className={cn(
      "relative flex items-center justify-center shrink-0 rounded-full bg-white shadow-[0_10px_40px_rgba(0,0,0,0.15)] border border-primary/10 overflow-hidden aspect-square",
      className
    )}>
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-accent/5 pointer-events-none"></div>
      <Image 
        src="/Logo.png" 
        alt="Nyaya Sahayak Institutional Identity" 
        width={400} 
        height={400} 
        className={cn("h-full w-full object-cover transition-transform group-hover:scale-110 duration-700", imageClassName)} 
        priority
      />
    </div>
  );
}
