import { Logo } from "@/components/logo";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-left">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-3">
              <Logo className="h-8 w-8 shadow-none border-none p-0 bg-transparent" priority={false} />
              <span className="text-xl font-bold text-foreground">Nyaya Sahayak</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              Simple and modern legal assistance for everyone. Our AI tools provide clear roadmaps and document help for the Indian judicial system.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Resources</h4>
            <nav className="flex flex-col gap-2">
              <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">About Us</Link>
              <Link href="/contact" className="text-sm font-medium hover:text-primary transition-colors">Contact</Link>
            </nav>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Legal</h4>
            <nav className="flex flex-col gap-2">
              <Link href="/privacy" className="text-sm font-medium hover:text-primary transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="text-sm font-medium hover:text-primary transition-colors">Terms of Service</Link>
              <Link href="/cookie-policy" className="text-sm font-medium hover:text-primary transition-colors">Cookie Policy</Link>
            </nav>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row justify-between gap-4 text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
          <span>© 2025 Nyaya Sahayak. Built by IdeaSpark.</span>
          <span>Justice for all.</span>
        </div>
      </div>
    </footer>
  );
}
