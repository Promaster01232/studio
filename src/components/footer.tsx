
import { Logo } from "@/components/logo";
import { ShieldCheck, FileText, Cookie, AlertCircle, Info, Mail, Facebook, Twitter, Instagram, Youtube, Linkedin, CreditCard } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t border-primary/5 bg-card/20 backdrop-blur-xl mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-10 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5 space-y-6 flex flex-col items-center lg:items-start text-center lg:text-left">
            <Link href="/" className="flex items-center gap-4 group cursor-pointer transition-transform active:scale-95">
              <div className="relative">
                  <div className="absolute -inset-2 rounded-full bg-gradient-to-tr from-primary/20 via-accent/20 to-blue-400/20 blur-lg animate-pulse group-hover:scale-125 transition-transform duration-700"></div>
                  <div className="relative p-1 rounded-full bg-gradient-to-tr from-primary via-accent to-blue-400">
                    <div className="bg-white rounded-full p-1.5 shadow-2xl relative z-10">
                        <Logo className="h-10 w-10 border-none shadow-none p-0" priority={false} />
                    </div>
                  </div>
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
            <div className="flex items-center gap-4 pt-2">
                <Link href="https://www.facebook.com/profile.php?id=61578664907514" target="_blank" className="p-2 rounded-xl bg-primary/5 text-primary hover:bg-primary hover:text-white transition-all duration-300 shadow-sm"><Facebook className="h-4 w-4" /></Link>
                <Link href="https://x.com/nyayasahayak/" target="_blank" className="p-2 rounded-xl bg-primary/5 text-primary hover:bg-primary hover:text-white transition-all duration-300 shadow-sm"><Twitter className="h-4 w-4" /></Link>
                <Link href="https://www.instagram.com/nyaya_sahayak/" target="_blank" className="p-2 rounded-xl bg-primary/5 text-primary hover:bg-primary hover:text-white transition-all duration-300 shadow-sm"><Instagram className="h-4 w-4" /></Link>
                <Link href="https://youtube.com/@nyayasahayak?si=8VsU3XSsYKILZVo3" target="_blank" className="p-2 rounded-xl bg-primary/5 text-primary hover:bg-primary hover:text-white transition-all duration-300 shadow-sm"><Youtube className="h-4 w-4" /></Link>
                <Link href="https://in.linkedin.com/in/nyayasahayak-050608400" target="_blank" className="p-2 rounded-xl bg-primary/5 text-primary hover:bg-primary hover:text-white transition-all duration-300 shadow-sm"><Linkedin className="h-4 w-4" /></Link>
            </div>
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
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Privacy", href: "/privacy", icon: ShieldCheck },
                  { label: "Terms", href: "/terms", icon: FileText },
                  { label: "Refunds", href: "/refund-policy", icon: CreditCard },
                  { label: "Cookies", href: "/cookie-policy", icon: Cookie }
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
