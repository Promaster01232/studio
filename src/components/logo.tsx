import { cn } from '@/lib/utils';
import { Scale } from 'lucide-react';

export function Logo({ className, imageClassName }: { className?: string, imageClassName?: string }) {
  return (
    <div className={cn(
      "flex items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg border border-primary/10 p-2 transition-transform hover:scale-105 duration-300 shrink-0", 
      className
    )}>
      <Scale className={cn("h-full w-full", imageClassName)} />
    </div>
  );
}
