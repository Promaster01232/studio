import { cn } from '@/lib/utils';
import Image from 'next/image';

export function Logo({ className, imageClassName, priority = true }: { className?: string, imageClassName?: string, priority?: boolean }) {
  return (
    <div className={cn(
      "relative flex items-center justify-center shrink-0 overflow-hidden aspect-square",
      "w-24 h-24",
      className
    )}>
      <div className="relative z-10 w-full h-full">
        <Image 
          src="/Logo.png" 
          alt="Nyaya Sahayak Identity" 
          width={128}
          height={128}
          className={cn("object-contain transition-transform group-hover:scale-105 duration-700 w-full h-full", imageClassName)} 
          priority={priority}
        />
      </div>
    </div>
  );
}
