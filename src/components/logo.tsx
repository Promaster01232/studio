import { cn } from '@/lib/utils';
import Image from 'next/image';

export function Logo({ className, imageClassName }: { className?: string, imageClassName?: string }) {
  return (
    <div className={cn(
      "relative flex items-center justify-center shrink-0 rounded-full bg-white shadow-2xl border border-primary/10 overflow-hidden",
      className
    )}>
      <Image 
        src="/Logo.png" 
        alt="Nyaya Sahayak" 
        width={400} 
        height={400} 
        className={cn("h-full w-full object-cover", imageClassName)} 
        priority
      />
    </div>
  );
}
