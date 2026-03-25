import { Logo } from "@/components/logo";
import { ShieldCheck, FileText, Cookie, AlertCircle, Info, Mail } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t border-primary/5 bg-card/20 backdrop-blur-xl mt-auto transition-all duration-500">
      <div className="max-w-7xl mx-auto px-6 py-6 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center lg:items-start">
          {/* Brand Hub */}
          <div className="lg:col-span-5 space-y-4 flex flex-col items-center lg:items-start text-center lg:text-left">
            <Link href="/" className="flex items-center gap-4 group cursor-pointer transition-transform active:scale-95">
              <div className="relative">
                  <div className="absolute -inset-2 rounded-full bg-gradient-to-tr from-primary/20 via-accent/20 to-blue-400/20 blur-lg animate-pulse group-hover:scale-125 transition-transform duration-700"></div>
                  <div className="relative p-1 rounded-full bg-gradient-to-tr from-primary via-accent to-blue-400">
                    <Logo className="h-10 w-10 shadow-2xl relative z-10 border-none bg-white rounded-full p-1.5" />
                  </div>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black font-headline tracking-tighter bg-gradient-to-r from-primary via-accent to-blue-400 bg-clip-text text-transparent animate-animated-gradient bg-[200%_auto]">
                  Nyaya Sahayak
                </span>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 leading-none mt-1 group-hover:text-primary transition-colors">
                  Legal Forensic Terminal
                </span>
              </div>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed font-medium max-w-sm">
              Engineered for the future of justice. Our neural forensic nodes provide mathematically precise legal intelligence and institutional navigational roadmaps.
            </p>
          </div>

          {/* Nav Nodes Wrapper */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-8">
            {/* Institutional Node */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary border-b border-primary/10 pb-2 w-fit mx-auto sm:mx-0">
                Institutional Nodes
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <Link href="/about" className="group flex items-center gap-3 px-4 py-3 rounded-2xl glass hover:bg-primary/5 hover:border-primary/20 transition-all text-[11px] font-black uppercase tracking-widest text-foreground/70 active:scale-95">
                  <div className="p-1.5 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform shadow-sm">
                    <Info className="h-3.5 w-3.5" />
                  </div>
                  <span>About</span>
                </Link>
                <Link href="/contact" className="group flex items-center gap-3 px-4 py-3 rounded-2xl glass hover:bg-primary/5 hover:border-primary/20 transition-all text-[11px] font-black uppercase tracking-widest text-foreground/70 active:scale-95">
                  <div className="p-1.5 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform shadow-sm">
                    <Mail className="h-3.5 w-3.5" />
                  </div>
                  <span>Contact</span>
                </Link>
              </div>
            </div>

            {/* Protocol Node */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary border-b border-primary/10 pb-2 w-fit mx-auto sm:mx-0">
                Security Protocols
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Privacy", href: "/privacy", icon: ShieldCheck },
                  { label: "Terms", href: "/terms", icon: FileText },
                  { label: "Cookies", href: "/cookie-policy", icon: Cookie },
                  { label: "Disclaim", href: "/disclaimer", icon: AlertCircle }
                ].map((item) => (
                  <Link key={item.label} href={item.href} className="group flex items-center gap-3 px-4 py-3 rounded-2xl glass hover:bg-primary/5 hover:border-primary/20 transition-all text-[11px] font-black uppercase tracking-widest text-foreground/70 active:scale-95">
                    <div className="p-1.5 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform shrink-0 shadow-sm">
                      <item.icon className="h-3.5 w-3.5" />
                    </div>
                    <span className="truncate">{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-primary/5 text-center space-y-3">
          <div className="flex items-center justify-center gap-3 text-primary/40">
              <ShieldCheck className="h-4 w-4" />
              <p className="text-[9px] font-black uppercase tracking-[0.4em] leading-relaxed">
                Secure Forensic Registry // NS-NODE-ALPHA-CORE-v4.2
              </p>
          </div>
          <p className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-[0.3em]">
            &copy; {new Date().getFullYear()} NYAYA SAHAYAK INSTITUTIONAL ECOSYSTEM. ALL PROTOCOLS RESERVED.
          </p>
        </div>
      </div>
    </footer>
  );
}
