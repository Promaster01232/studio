"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ArrowRight, 
  Mic, 
  FileSearch, 
  FileText, 
  FileSignature, 
  BrainCircuit, 
  Gavel, 
  ShieldCheck, 
  Menu
} from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Footer } from "@/components/footer";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

const capabilities = [
  {
    title: "Record Voice",
    desc: "Speak your legal problem. Get a quick summary and forensic analysis.",
    icon: Mic,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    title: "Scan Documents",
    desc: "Upload court orders or notices. AI reads and identifies statutory risks.",
    icon: FileSearch,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    title: "Write Documents",
    desc: "Draft professional legal notices and complaints in any indian language.",
    icon: FileText,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
  {
    title: "Create Bonds",
    desc: "Generate legally sound bail, personal, and indemnity bonds instantly.",
    icon: FileSignature,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    title: "Check Chance",
    desc: "Analyze case details to see the statistical probability of a win or bail.",
    icon: BrainCircuit,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  }
];

const navItems = [
  { name: "Features", href: "/features" },
  { name: "How It Works", href: "/how-it-works" },
  { name: "Pricing", href: "/pricing" },
  { name: "Faqs", href: "/faqs" },
  { name: "Blog", href: "/blog" },
  { name: "About", href: "/about" },
];

export default function RootPage() {
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 overflow-x-hidden font-body text-left">
      <nav className="fixed top-0 w-full z-50 px-6 py-3 flex justify-between items-center bg-background/80 backdrop-blur-md border-b border-border/10">
        <Link href="https://nyayasahayak.in" className="flex items-center gap-3 active:scale-95 transition-all">
          <Logo className="h-8 w-8 border-none bg-transparent shadow-none p-0" priority={true} />
          <span className="text-lg font-bold tracking-tight text-foreground">Nyaya Sahayak</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link 
              key={item.name} 
              href={item.href}
              className="text-xs font-bold text-foreground/60 hover:text-primary transition-all"
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild className="text-xs font-bold hover:bg-primary/5 text-foreground h-9 px-4">
            <Link href="/login">Login</Link>
          </Button>
          <div className="hidden md:block">
            <Button asChild className="bg-primary text-primary-foreground font-bold text-xs px-5 h-9 rounded-lg shadow-md active:scale-95 transition-all">
              <Link href="/register">Join Hub</Link>
            </Button>
          </div>

          <div className="md:hidden">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-foreground hover:bg-primary/5 rounded-lg h-9 w-9">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-background border-border/10 text-foreground w-[280px] p-0">
                <SheetHeader className="p-6 border-b border-border/10">
                  <SheetTitle className="text-foreground text-left font-bold text-lg tracking-tight">Navigation</SheetTitle>
                  <SheetDescription className="text-muted-foreground text-left text-[10px] font-bold">Institutional Hub</SheetDescription>
                </SheetHeader>
                <div className="flex flex-col p-6 gap-4 text-left">
                  {navItems.map((item) => (
                    <Link 
                      key={item.name} 
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="text-left text-base font-bold text-foreground/60 hover:text-primary transition-all"
                    >
                      {item.name}
                    </Link>
                  ))}
                  <div className="h-px bg-border/10 my-2" />
                  <Button asChild variant="ghost" className="justify-start px-0 text-foreground/60 hover:text-primary h-10 font-bold" onClick={() => setIsMenuOpen(false)}>
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button asChild className="bg-primary text-primary-foreground font-bold h-11 rounded-lg" onClick={() => setIsMenuOpen(false)}>
                    <Link href="/register">Join Hub</Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      <main className="pt-12 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="flex flex-col items-center">
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 px-3 py-1 rounded-full text-[9px] font-bold mb-4">
              Platform Status: Active
            </Badge>
            
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-2 text-foreground">
              Complete Legal Research Toolkit.
            </h1>
            
            <p className="text-sm sm:text-base text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
              AI-Powered chat, document analysis, and voice input. Navigate indian law with absolute confidence at https://nyayasahayak.in.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Button asChild className="h-12 px-8 rounded-lg bg-primary text-primary-foreground font-bold text-sm shadow-lg active:scale-95 transition-all">
              <Link href="/dashboard" className="flex items-center gap-2">
                Start Legal Query <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <section className="py-12 px-4 sm:px-6 border-t border-border/10">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              Elite AI Forensic Tools
            </h2>
            <p className="text-sm text-muted-foreground font-medium">
              Synchronized with the modern indian judicial landscape.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {capabilities.map((item, i) => (
              <Card key={i} className="bg-card border-border/10 rounded-xl overflow-hidden hover:border-primary/20 shadow-sm transition-all">
                <CardContent className="p-5 flex flex-col h-full text-left space-y-3">
                  <div className={cn("p-2 rounded-lg h-fit w-fit border border-border/5", item.bg, item.color)}>
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold tracking-tight text-foreground leading-tight">{item.title}</h3>
                    <p className="text-[10px] text-muted-foreground leading-relaxed font-medium">
                      {item.desc}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
