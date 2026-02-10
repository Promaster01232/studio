import { BookOpen } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center gap-2 text-lg font-semibold tracking-tight font-headline">
      <div className="bg-primary text-primary-foreground p-2 rounded-lg">
        <BookOpen className="h-5 w-5" />
      </div>
      <span>Nyaay Sathi</span>
    </div>
  );
}
