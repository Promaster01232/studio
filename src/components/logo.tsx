import Image from 'next/image';
import { cn } from '@/lib/utils';

export function Logo({ className, imageClassName }: { className?: string, imageClassName?: string }) {
  return (
    <div className={cn("flex items-center justify-center rounded-full bg-card p-1.5", className)}>
      <Image 
        src="/Logo.png" 
        alt="Nyaya Sahayak Logo" 
        width={512} 
        height={512} 
        className={cn("h-14 w-auto", imageClassName)}
      />
    </div>
  );
}
