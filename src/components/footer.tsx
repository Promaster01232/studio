
import { Logo } from "@/components/logo";
import { Linkedin, Facebook, Twitter, ShieldCheck, FileText, Cookie, AlertCircle, Info, Mail } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t bg-card/30 backdrop-blur-md mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 md:gap-16 text-center sm:text-left">
          {/* Brand Section */}
          <div className="space-y-6 flex flex-col items-center sm:items-start">
            <div className="flex items-center gap-3">
              <Logo className="h-10 w-10 shadow-xl shadow-primary/10" />
              <span className="text-xl font-black font-headline tracking-tighter text-foreground">
                Nyaya Sahayak
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed font-medium max-w-xs sm:max-w-none mx-auto sm:mx-0">
              Precision AI nodes for the modern legal ecosystem. Delivering clarity through forensic intelligence and institutional trust.
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
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 border-b border-primary/5 pb-2 w-fit mx-auto sm:mx-0">
              Institutional
            </h3>
            <ul className="space-y-4">
              <li>
                <Link href="/about" className="group flex items-center justify-center sm:justify-start gap-2 text-sm font-bold text-foreground/80 hover:text-primary transition-all">
                  <div className="p-1 rounded-md bg-primary/5 text-primary opacity-40 group-hover:opacity-100 transition-opacity">
                    <Info className="h-3 w-3" />
                  </div>
                  <span>About Node</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="group flex items-center justify-center sm:justify-start gap-2 text-sm font-bold text-foreground/80 hover:text-primary transition-all">
                  <div className="p-1 rounded-md bg-primary/5 text-primary opacity-40 group-hover:opacity-100 transition-opacity">
                    <Mail className="h-3 w-3" />
                  </div>
                  <span>Contact Hub</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Protocols Section */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 border-b border-primary/5 pb-2 w-fit mx-auto sm:mx-0">
              Protocols
            </h3>
            <ul className="space-y-4">
              <li>
                <Link href="/privacy" className="group flex items-center justify-center sm:justify-start gap-2 text-sm font-bold text-foreground/80 hover:text-primary transition-all">
                  <div className="p-1 rounded-md bg-primary/5 text-primary opacity-40 group-hover:opacity-100 transition-opacity">
                    <ShieldCheck className="h-3 w-3" />
                  </div>
                  <span>Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link href="/terms" className="group flex items-center justify-center sm:justify-start gap-2 text-sm font-bold text-foreground/80 hover:text-primary transition-all">
                  <div className="p-1 rounded-md bg-primary/5 text-primary opacity-40 group-hover:opacity-100 transition-opacity">
                    <FileText className="h-3 w-3" />
                  </div>
                  <span>Terms of Service</span>
                </Link>
              </li>
              <li>
                <Link href="/cookie-policy" className="group flex items-center justify-center sm:justify-start gap-2 text-sm font-bold text-foreground/80 hover:text-primary transition-all">
                  <div className="p-1 rounded-md bg-primary/5 text-primary opacity-40 group-hover:opacity-100 transition-opacity">
                    <Cookie className="h-3 w-3" />
                  </div>
                  <span>Cookie Protocol</span>
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="group flex items-center justify-center sm:justify-start gap-2 text-sm font-bold text-foreground/80 hover:text-primary transition-all">
                  <div className="p-1 rounded-md bg-primary/5 text-primary opacity-40 group-hover:opacity-100 transition-opacity">
                    <AlertCircle className="h-3 w-3" />
                  </div>
                  <span>Legal Disclaimer</span>
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
