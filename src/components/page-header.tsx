import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description: string;
  children?: ReactNode;
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
      <div className="space-y-1.5 text-left">
        <h1 className="text-2xl sm:text-4xl font-black font-headline tracking-tighter text-foreground leading-tight">
          {title}
        </h1>
        <p className="text-sm text-muted-foreground font-medium max-w-2xl leading-relaxed">
          {description}
        </p>
      </div>
      {children && <div className="w-full sm:w-auto shrink-0">{children}</div>}
    </div>
  );
}
