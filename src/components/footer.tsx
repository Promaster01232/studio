
import { Logo } from "@/components/logo";
import { Linkedin, Facebook, Twitter } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t bg-card/30 backdrop-blur-md mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 md:gap-8 text-center sm:text-left">
          {/* Brand Section */}
          <div className="space-y-6 flex flex-col items-center sm:items-start">
            <div className="flex items-center gap-3">
              <Logo className="h-10 w-10 shadow-xl shadow-primary/10" />
              <span className="text-xl font-black font-headline tracking-tighter text-foreground">
                Nyaya Sahayak
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed font-medium max-w-xs sm:max-w-none mx-auto sm:mx-0">
              Precision AI nodes for the modern legal ecosystem. Delivering clarity through forensic intelligence.
            </p>
            <div className="flex items-center justify-center sm:justify-start gap-4 pt-2">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-all active:scale-90">
                <Linkedin className="h-4 w-4" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-all active:scale-90">
                <Facebook className="h-4 w-4" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-all active:scale-90">
                <Twitter className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Institutional Section */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
              Institutional
            </h3>
            <ul className="space-y-4">
              <li>
                <Link href="/dashboard/about" className="text-sm font-bold text-foreground/80 hover:text-primary transition-colors">
                  About Node
                </Link>
              </li>
              <li>
                <Link href="/dashboard/contact" className="text-sm font-bold text-foreground/80 hover:text-primary transition-colors">
                  Contact Hub
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm font-bold text-foreground/80 hover:text-primary transition-colors">
                  System Status
                </Link>
              </li>
            </ul>
          </div>

          {/* Protocols Section */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
              Protocols
            </h3>
            <ul className="space-y-4">
              <li>
                <Link href="/dashboard/privacy" className="text-sm font-bold text-foreground/80 hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/dashboard/terms" className="text-sm font-bold text-foreground/80 hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/dashboard/cookie-policy" className="text-sm font-bold text-foreground/80 hover:text-primary transition-colors">
                  Cookie Protocol
                </Link>
              </li>
              <li>
                <Link href="/dashboard/disclaimer" className="text-sm font-bold text-foreground/80 hover:text-primary transition-colors">
                  Legal Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 sm:mt-16 pt-8 border-t border-primary/5 text-center">
          <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 leading-relaxed">
            &copy; {new Date().getFullYear()} NYAYA SAHAYAK INSTITUTIONAL NODE. ALL PROTOCOLS RESERVED.
          </p>
        </div>
      </div>
    </footer>
  );
}
