
import { ReactNode } from "react";
import { PublicHeader } from "@/components/public-header";
import { Footer } from "@/components/footer";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PublicHeader />
      <main className="flex-1 w-full max-w-7xl mx-auto py-8 sm:py-12 md:py-16">
        {children}
      </main>
      <Footer />
    </div>
  );
}
