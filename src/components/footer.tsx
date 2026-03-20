import { Logo } from "@/components/logo";
import { Linkedin, Facebook, Twitter, Send, Loader2 } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setEmail("");
      toast({
        title: "Registry Enrollment",
        description: "You have been successfully added to our institutional update list.",
      });
    }, 1200);
  };

  return (
    <footer className="w-full border-t bg-card/30 backdrop-blur-md mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 md:gap-8">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Logo className="h-10 w-10 shadow-xl shadow-primary/10" />
              <span className="text-xl font-black font-headline tracking-tighter text-foreground">
                Nyaya Sahayak
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed font-medium">
              Precision AI nodes for the modern legal ecosystem. Delivering clarity through forensic intelligence.
            </p>
            <div className="flex items-center gap-4 pt-2">
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

          {/* Accept User / Subscription Section */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
              Stay Connected
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed font-medium">
              Join the institutional mailing list for critical legal alerts and node updates.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
              <Input 
                type="email" 
                placeholder="Registry Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 text-xs font-bold bg-background/50" 
                required
              />
              <Button size="sm" type="submit" disabled={loading} className="h-10 font-bold active:scale-95 transition-all shadow-lg shadow-primary/20">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Send className="mr-2 h-3.5 w-3.5" /> Enroll Now</>}
              </Button>
            </form>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-primary/5 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">
            &copy; {new Date().getFullYear()} NYAYA SAHAYAK INSTITUTIONAL NODE. ALL PROTOCOLS RESERVED.
          </p>
        </div>
      </div>
    </footer>
  );
}
