import Image from 'next/image';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <Image 
        src="https://assets-global.website-files.com/6047a7b68562483569c73335/64883a45c613993c5240b2b8_gavel.png" 
        alt="Nyaya Sahayak Logo" 
        width={512} 
        height={512} 
        className="h-9 w-9 drop-shadow-[0_0_10px_hsl(var(--primary)_/_0.5)]"
        priority
      />
    </div>
  );
}
