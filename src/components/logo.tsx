import { cn } from '@/lib/utils';
import Image from 'next/image';

export function Logo({ className, imageClassName }: { className?: string, imageClassName?: string }) {
  return (
    <div className={cn("relative flex items-center justify-center shrink-0", className)}>
      <Image 
        src="/Logo.png" 
        alt="Nyaya Sahayak" 
        width={200} 
        height={200} 
        className={cn("h-full w-auto object-contain", imageClassName)} 
        priority
      />
    </div>
  );
}
