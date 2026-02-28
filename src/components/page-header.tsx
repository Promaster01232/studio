import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description: string;
  children?: ReactNode;
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="mb-6 sm:mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-black font-headline tracking-tighter leading-tight">{title}</h1>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-prose">{description}</p>
      </div>
      {children && <div className="w-full sm:w-auto shrink-0">{children}</div>}
    </div>
  );
}
