import { Logo } from "@/components/logo";
import { ShieldCheck, FileText, Cookie, AlertCircle, Info, Mail } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t border-primary/5 bg-card/20 backdrop-blur-xl mt-auto transition-all duration-500">
      <div className="max-w-7xl mx-auto px-6 py-4 lg:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 items-center">
          {/* Brand Hub */}
          <div className="lg:col-span-5 space-y-2 flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="relative">
                  <div className="absolute -inset-1.5 rounded-full bg-primary/10 animate-pulse group-hover:scale-110 transition-transform"></div>
                  <Logo className="h-8 w-8 shadow-2xl relative z-10" />
              </div>
              <span className="text-lg font-black font-headline tracking-tighter text-foreground group-hover:text-primary transition-colors">
                Nyaya Sahayak
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground leading-relaxed font-medium max-w-sm">
              Engineered for the future of justice. Our neural forensic nodes provide mathematically precise legal intelligence and institutional navigational roadmaps.
            </p>
          </div>

          {/* Nav Nodes Wrapper */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Institutional Node */}
            <div className="space-y-2">
              <h3 className="text-[9px] font-black uppercase tracking-[0.4em] text-primary/40 border-b border-primary/5 pb-1 w-fit mx-auto sm:mx-0">
                Institutional
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <Link href="/about" className="group flex items-center gap-2 px-3 py-2 rounded-xl glass hover:bg-primary/5 hover:border-primary/20 transition-all text-[10px] font-black uppercase tracking-widest text-foreground/70 active:scale-95">
                  <div className="p-1 rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                    <Info className="h-3 w-3" />
                  </div>
                  <span>About</span>
                </Link>
                <Link href="/contact" className="group flex items-center gap-2 px-3 py-2 rounded-xl glass hover:bg-primary/5 hover:border-primary/20 transition-all text-[10px] font-black uppercase tracking-widest text-foreground/70 active:scale-95">
                  <div className="p-1 rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                    <Mail className="h-3 w-3" />
                  </div>
                  <span>Contact</span>
                </Link>
              </div>
            </div>

            {/* Protocol Node */}
            <div className="space-y-2">
              <h3 className="text-[9px] font-black uppercase tracking-[0.4em] text-primary/40 border-b border-primary/5 pb-1 w-fit mx-auto sm:mx-0">
                Protocols
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Privacy", href: "/privacy", icon: ShieldCheck },
                  { label: "Terms", href: "/terms", icon: FileText },
                  { label: "Cookies", href: "/cookie-policy", icon: Cookie },
                  { label: "Disclaim", href: "/disclaimer", icon: AlertCircle }
                ].map((item) => (
                  <Link key={item.label} href={item.href} className="group flex items-center gap-2 px-3 py-2 rounded-xl glass hover:bg-primary/5 hover:border-primary/20 transition-all text-[10px] font-black uppercase tracking-widest text-foreground/70 active:scale-95">
                    <div className="p-1 rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform shrink-0">
                      <item.icon className="h-3 w-3" />
                    </div>
                    <span className="truncate">{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-primary/5 text-center space-y-1">
          <div className="flex items-center justify-center gap-2 text-primary/30">
              <ShieldCheck className="h-2.5 w-2.5" />
              <p className="text-[8px] font-black uppercase tracking-[0.4em] leading-relaxed">
                Secure Forensic Registry // NS-NODE-ALPHA-CORE
              </p>
          </div>
          <p className="text-[8px] font-bold text-muted-foreground/30 uppercase tracking-widest">
            &copy; {new Date().getFullYear()} NYAYA SAHAYAK INSTITUTIONAL ECOSYSTEM. ALL PROTOCOLS RESERVED.
          </p>
        </div>
      </div>
    </footer>
  );
}
