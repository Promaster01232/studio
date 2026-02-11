import { ReactNode } from "react";

export default function LoginLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-background">
      {children}
    </div>
  );
}
