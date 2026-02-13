import Image from 'next/image';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <Image 
        src="https://storage.googleapis.com/project-os-screenshot/1770932454559/image.png" 
        alt="Nyaya Sahayak Logo" 
        width={596} 
        height={524} 
        className="h-10 w-auto drop-shadow-[0_0_10px_hsl(var(--primary)_/_0.5)]"
        priority
      />
    </div>
  );
}
