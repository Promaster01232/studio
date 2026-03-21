import { Logo } from "@/components/logo";
import { Linkedin, Facebook, Twitter, ShieldCheck, FileText, Cookie, AlertCircle, Info, Mail, Github } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t border-primary/5 bg-card/20 backdrop-blur-xl mt-auto transition-all duration-500">
      <div className="max-w-7xl mx-auto px-6 py-8 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Brand Hub */}
          <div className="lg:col-span-5 space-y-4 flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="flex items-center gap-4 group cursor-pointer">
              <div className="relative">
                  <div className="absolute -inset-2 rounded-full bg-primary/10 animate-pulse group-hover:scale-110 transition-transform"></div>
                  <Logo className="h-10 w-10 shadow-2xl relative z-10" />
              </div>
              <span className="text-xl font-black font-headline tracking-tighter text-foreground group-hover:text-primary transition-colors">
                Nyaya Sahayak
              </span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-medium max-w-sm">
              Engineered for the future of justice. Our neural forensic nodes provide mathematically precise legal intelligence and institutional navigational roadmaps.
            </p>
            <div className="flex items-center justify-center lg:justify-start gap-4 pt-1">
              {[
                { icon: Linkedin, href: "#" },
                { icon: Twitter, href: "#" },
                { icon: Github, href: "#" },
                { icon: Mail, href: "/contact" }
              ].map((social, i) => (
                <Link key={i} href={social.href} className="text-muted-foreground hover:text-primary transition-all active:scale-90 p-2 rounded-xl hover:bg-primary/5 border border-transparent hover:border-primary/10">
                  <social.icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Nav Nodes Wrapper */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-8">
            {/* Institutional Node */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/40 border-b border-primary/5 pb-2 w-fit mx-auto sm:mx-0">
                Institutional
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <Link href="/about" className="group flex items-center gap-3 px-4 py-3 rounded-2xl glass hover:bg-primary/5 hover:border-primary/20 transition-all text-[11px] font-black uppercase tracking-widest text-foreground/70 active:scale-95">
                  <div className="p-1.5 rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                    <Info className="h-3.5 w-3.5" />
                  </div>
                  <span>About</span>
                </Link>
                <Link href="/contact" className="group flex items-center gap-3 px-4 py-3 rounded-2xl glass hover:bg-primary/5 hover:border-primary/20 transition-all text-[11px] font-black uppercase tracking-widest text-foreground/70 active:scale-95">
                  <div className="p-1.5 rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                    <Mail className="h-3.5 w-3.5" />
                  </div>
                  <span>Contact</span>
                </Link>
              </div>
            </div>

            {/* Protocol Node */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/40 border-b border-primary/5 pb-2 w-fit mx-auto sm:mx-0">
                Protocols
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Privacy", href: "/privacy", icon: ShieldCheck },
                  { label: "Terms", href: "/terms", icon: FileText },
                  { label: "Cookies", href: "/cookie-policy", icon: Cookie },
                  { label: "Disclaim", href: "/disclaimer", icon: AlertCircle }
                ].map((item) => (
                  <Link key={item.label} href={item.href} className="group flex items-center gap-3 px-4 py-3 rounded-2xl glass hover:bg-primary/5 hover:border-primary/20 transition-all text-[11px] font-black uppercase tracking-widest text-foreground/70 active:scale-95">
                    <div className="p-1.5 rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform shrink-0">
                      <item.icon className="h-3.5 w-3.5" />
                    </div>
                    <span className="truncate">{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-10 pt-6 border-t border-primary/5 text-center space-y-3">
          <div className="flex items-center justify-center gap-2 text-primary/30">
              <ShieldCheck className="h-3 w-3" />
              <p className="text-[10px] font-black uppercase tracking-[0.4em] leading-relaxed">
                Secure Forensic Registry // NS-NODE-ALPHA-CORE
              </p>
          </div>
          <p className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-widest">
            &copy; {new Date().getFullYear()} NYAYA SAHAYAK INSTITUTIONAL ECOSYSTEM. ALL PROTOCOLS RESERVED.
          </p>
        </div>
      </div>
    </footer>
  );
}
