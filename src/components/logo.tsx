import Image from 'next/image';
import { cn } from '@/lib/utils';

export function Logo({ className, imageClassName }: { className?: string, imageClassName?: string }) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <Image 
        src="https://storage.googleapis.com/studio-hosting-storage/2024-07-31-05-24-52-965Z-asgw/form-submission/form-submission/d507b1a2-e6a3-49a3-a79d-3382f71887e5.png" 
        alt="Nyaya Sahayak Logo" 
        width={512} 
        height={512} 
        className={cn("h-10 w-auto", imageClassName)}
        priority
      />
    </div>
  );
}
