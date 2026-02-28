import Image from 'next/image';
import { cn } from '@/lib/utils';

export function Logo({ className, imageClassName }: { className?: string, imageClassName?: string }) {
  return (
    <div className={cn(
      "flex items-center justify-center rounded-full bg-white shadow-lg border border-primary/5 p-2.5 transition-transform hover:scale-105 duration-300", 
      className
    )}>
      <Image 
        src="/Logo.png" 
        alt="Nyaya Sahayak Logo" 
        width={512} 
        height={512} 
        className={cn("h-16 w-auto object-contain", imageClassName)}
      />
    </div>
  );
}
