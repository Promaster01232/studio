import Image from 'next/image';
import { cn } from '@/lib/utils';

export function Logo({ className, imageClassName }: { className?: string, imageClassName?: string }) {
  return (
    <div className={cn(
      "flex items-center justify-center rounded-full bg-white shadow-md border border-primary/10 p-1.5 transition-transform hover:scale-105 duration-300 shrink-0", 
      className
    )}>
      <Image 
        src="/Logo.png" 
        alt="Nyaya Sahayak Logo" 
        width={512} 
        height={512} 
        className={cn("h-full w-auto object-contain", imageClassName)}
      />
    </div>
  );
}
