import { Logo } from "@/components/logo";
import { Linkedin, Facebook, Twitter } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t bg-card/30 backdrop-blur-md mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-16">
          {/* Brand Section */}
          <div className="md:col-span-2 space-y-8">
            <div className="flex items-center gap-4">
              <Logo className="h-14 w-14 shadow-2xl shadow-primary/10" />
              <span className="text-3xl font-black font-headline tracking-tighter text-foreground">
                Nyaya Sahayak
              </span>
            </div>
            <p className="text-base text-muted-foreground max-w-sm leading-relaxed font-medium">
              The pinnacle of AI-driven legal nodes. Delivering precision roadmaps and mathematically perfect problem resolution.
            </p>
            <div className="flex items-center gap-6 pt-4">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-all active:scale-90">
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-all active:scale-90">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-all active:scale-90">
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Institutional Section */}
          <div className="space-y-8">
            <h3 className="text-[11px] font-black uppercase tracking-[0.25em] text-muted-foreground/50">
              Institutional
            </h3>
            <ul className="space-y-5">
              <li>
                <Link href="/dashboard/learn" className="text-[15px] font-bold text-foreground/80 hover:text-primary transition-colors">
                  About Nyaya Sahayak
                </Link>
              </li>
              <li>
                <Link href="/dashboard/contact" className="text-[15px] font-bold text-foreground/80 hover:text-primary transition-colors">
                  Contact Node
                </Link>
              </li>
              <li>
                <Link href="#" className="text-[15px] font-bold text-foreground/80 hover:text-primary transition-colors">
                  System Status
                </Link>
              </li>
            </ul>
          </div>

          {/* Protocols Section */}
          <div className="space-y-8">
            <h3 className="text-[11px] font-black uppercase tracking-[0.25em] text-muted-foreground/50">
              Protocols
            </h3>
            <ul className="space-y-5">
              <li>
                <Link href="#" className="text-[15px] font-bold text-foreground/80 hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-[15px] font-bold text-foreground/80 hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="text-[15px] font-bold text-foreground/80 hover:text-primary transition-colors">
                  Cookie Protocol
                </Link>
              </li>
              <li>
                <Link href="#" className="text-[15px] font-bold text-foreground/80 hover:text-primary transition-colors">
                  Legal Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
