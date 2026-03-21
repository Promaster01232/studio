
import { Logo } from "@/components/logo";
import { Linkedin, Facebook, Twitter, ShieldCheck, FileText, Cookie, AlertCircle, Info, Mail } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t bg-card/30 backdrop-blur-md mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Brand Section */}
          <div className="lg:col-span-4 space-y-4 flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="flex items-center gap-3">
              <Logo className="h-10 w-10 shadow-xl shadow-primary/10" />
              <span className="text-xl font-black font-headline tracking-tighter text-foreground">
                Nyaya Sahayak
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed font-medium max-w-xs sm:max-w-none">
              Precision AI nodes for the modern legal ecosystem. Delivering clarity through forensic intelligence and institutional trust.
            </p>
            <div className="flex items-center justify-center lg:justify-start gap-4 pt-1">
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

          {/* Links Section Wrapper */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
            {/* Institutional Section */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 border-b border-primary/5 pb-2 w-fit mx-auto sm:mx-0">
                Institutional
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <Link href="/about" className="group flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/5 border border-transparent hover:border-primary/10 hover:bg-primary/10 transition-all text-[11px] font-bold text-foreground/80">
                  <div className="p-1 rounded-md bg-background/50 text-primary shrink-0">
                    <Info className="h-3 w-3" />
                  </div>
                  <span className="truncate">About</span>
                </Link>
                <Link href="/contact" className="group flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/5 border border-transparent hover:border-primary/10 hover:bg-primary/10 transition-all text-[11px] font-bold text-foreground/80">
                  <div className="p-1 rounded-md bg-background/50 text-primary shrink-0">
                    <Mail className="h-3 w-3" />
                  </div>
                  <span className="truncate">Contact</span>
                </Link>
              </div>
            </div>

            {/* Protocols Section */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 border-b border-primary/5 pb-2 w-fit mx-auto sm:mx-0">
                Protocols
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <Link href="/privacy" className="group flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/5 border border-transparent hover:border-primary/10 hover:bg-primary/10 transition-all text-[11px] font-bold text-foreground/80">
                  <div className="p-1 rounded-md bg-background/50 text-primary shrink-0">
                    <ShieldCheck className="h-3 w-3" />
                  </div>
                  <span className="truncate">Privacy</span>
                </Link>
                <Link href="/terms" className="group flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/5 border border-transparent hover:border-primary/10 hover:bg-primary/10 transition-all text-[11px] font-bold text-foreground/80">
                  <div className="p-1 rounded-md bg-background/50 text-primary shrink-0">
                    <FileText className="h-3 w-3" />
                  </div>
                  <span className="truncate">Terms</span>
                </Link>
                <Link href="/cookie-policy" className="group flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/5 border border-transparent hover:border-primary/10 hover:bg-primary/10 transition-all text-[11px] font-bold text-foreground/80">
                  <div className="p-1 rounded-md bg-background/50 text-primary shrink-0">
                    <Cookie className="h-3 w-3" />
                  </div>
                  <span className="truncate">Cookies</span>
                </Link>
                <Link href="/disclaimer" className="group flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/5 border border-transparent hover:border-primary/10 hover:bg-primary/10 transition-all text-[11px] font-bold text-foreground/80">
                  <div className="p-1 rounded-md bg-background/50 text-primary shrink-0">
                    <AlertCircle className="h-3 w-3" />
                  </div>
                  <span className="truncate">Disclaimer</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-primary/5 text-center">
          <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 leading-relaxed">
            &copy; {new Date().getFullYear()} NYAYA SAHAYAK INSTITUTIONAL NODE. ALL PROTOCOLS RESERVED.
          </p>
        </div>
      </div>
    </footer>
  );
}
