import { Logo } from "@/components/logo";
import { ShieldCheck, FileText, Cookie, CreditCard, Info, Mail, ShieldAlert } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t border-primary/5 bg-card/20 backdrop-blur-xl mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-10 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5 space-y-6 flex flex-col items-center lg:items-start text-center lg:text-left">
            <Link href="/" className="flex items-center gap-4 group cursor-pointer transition-transform active:scale-95">
              <div className="relative">
                  <Logo className="h-12 w-12 border-none shadow-none p-0 bg-transparent" priority={false} />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black font-headline tracking-tighter text-foreground">
                  Nyaya Sahayak
                </span>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 leading-none mt-1 group-hover:text-primary transition-colors">
                  nyayasahayak.in
                </span>
              </div>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed font-medium max-w-sm">
              Engineered for the future of justice. Our neural forensic nodes provide mathematically precise legal intelligence and institutional navigational roadmaps.
            </p>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-10">
            <div className="space-y-6">
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

            <div className="space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary border-b border-primary/10 pb-2 w-fit mx-auto sm:mx-0">
                Security & Payments
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { label: "Privacy Policy", href: "/privacy", icon: ShieldCheck },
                  { label: "Terms & Conditions", href: "/terms", icon: FileText },
                  { label: "Refund Policy", href: "/refund-policy", icon: CreditCard },
                  { label: "Cookie Policy", href: "/cookie-policy", icon: Cookie },
                  { label: "Legal Disclaimer", href: "/disclaimer", icon: ShieldAlert }
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
      </div>
    </footer>
  );
}