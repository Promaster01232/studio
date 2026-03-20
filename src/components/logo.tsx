import { cn } from '@/lib/utils';
import { Scale } from 'lucide-react';

export function Logo({ className, imageClassName }: { className?: string, imageClassName?: string }) {
  return (
    <div className={cn(
      "flex items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl border border-primary/20 p-2.5 transition-all hover:scale-105 duration-500 shrink-0", 
      className
    )}>
      <Scale className={cn("h-full w-full drop-shadow-md", imageClassName)} />
    </div>
  );
}
