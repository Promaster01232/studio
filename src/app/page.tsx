
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
  Scale, 
  Zap, 
  FileCheck,
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
    desc: "Speak Your Legal Problem. Get A Quick Word-For-Word Summary And Analysis.",
    icon: Mic,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    title: "Scan Documents",
    desc: "Upload Court Orders Or Notices. AI Reads And Identifies Statutory Risks.",
    icon: FileSearch,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    title: "Write Documents",
    desc: "Draft Professional Legal Notices And Complaints In Any Indian Language.",
    icon: FileText,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
  {
    title: "Create Bonds",
    desc: "Generate Legally Sound Bail, Personal, And Indemnity Bonds Instantly.",
    icon: FileSignature,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    title: "Check Chance",
    desc: "Analyze Case Details To See The Statistical Probability Of A Win Or Bail.",
    icon: BrainCircuit,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    title: "Court Helper",
    desc: "Get Prepared Questions For Witness Cross-Examination And Preparation.",
    icon: Gavel,
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
  },
  {
    title: "Check Evidence",
    desc: "Audit Your Digital And Physical Evidence For Statutory Admissibility.",
    icon: ShieldCheck,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
  },
  {
    title: "Bail Helper",
    desc: "Predictive Modeling For Bail Success Based On BNS Sections And Records.",
    icon: Scale,
    color: "text-red-500",
    bg: "bg-red-500/10",
  },
  {
    title: "Law Linker",
    desc: "Locate Specific BNS Sections And Amendments Relevant To Your Situation.",
    icon: Zap,
    color: "text-pink-500",
    bg: "bg-pink-500/10",
  },
  {
    title: "Check Contract",
    desc: "Identify Unfavorable Clauses And Verify Fairness In Any Legal Deed.",
    icon: FileCheck,
    color: "text-teal-500",
    bg: "bg-teal-500/10",
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
      <nav className="fixed top-0 w-full z-50 px-6 py-4 flex justify-between items-center bg-background border-b border-border/10">
        <div className="flex items-center gap-2">
          <Logo className="h-10 w-10 border-none bg-transparent shadow-none p-0" priority={true} />
          <span className="text-xl font-bold tracking-tighter text-foreground">Nyaya Sahayak</span>
        </div>
        
        <div className="hidden md:flex items-center gap-10">
          {navItems.map((item) => (
            <Link 
              key={item.name} 
              href={item.href}
              className="text-sm font-medium text-foreground/60 hover:text-primary transition-all"
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-4">
            <Button variant="ghost" asChild className="text-xs font-bold hover:bg-primary/5 text-foreground h-10 px-4 sm:px-6">
              <Link href="/login">Login</Link>
            </Button>
            <div className="hidden md:block">
              <Button asChild className="bg-primary text-primary-foreground font-bold text-xs px-6 h-10 rounded-xl shadow-lg active:scale-95 transition-all">
                <Link href="/register">Join Hub</Link>
              </Button>
            </div>
          </div>

          <div className="md:hidden">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-foreground hover:bg-primary/5 rounded-xl h-10 w-10" aria-label="Toggle Navigation Menu">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-background border-border/10 text-foreground w-[280px] p-0">
                <SheetHeader className="p-6 border-b border-border/10">
                  <SheetTitle className="text-foreground text-left font-bold text-xl tracking-tighter">Navigation</SheetTitle>
                  <SheetDescription className="text-muted-foreground text-left text-[10px] font-bold tracking-widest">Institutional Hub</SheetDescription>
                </SheetHeader>
                <div className="flex flex-col p-6 gap-6 text-left">
                  {navItems.map((item) => (
                    <Link 
                      key={item.name} 
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="text-left text-lg font-bold text-foreground/60 hover:text-primary transition-all"
                    >
                      {item.name}
                    </Link>
                  ))}
                  <div className="h-px bg-border/10 my-2" />
                  <Button asChild variant="ghost" className="justify-start px-0 text-foreground/60 hover:text-primary h-10 font-bold" onClick={() => setIsMenuOpen(false)}>
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button asChild className="bg-primary text-primary-foreground font-bold h-12 rounded-xl" onClick={() => setIsMenuOpen(false)}>
                    <Link href="/register">Join Hub</Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      <main className="pt-20 pb-8 px-4">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <div className="flex flex-col items-center">
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 px-4 py-1.5 rounded-full text-[9px] font-bold mb-4">
              Platform Status: Active
            </Badge>
            
            <h1 className="text-3xl sm:text-5xl font-black tracking-tighter leading-tight mb-4 text-foreground">
              Your Complete Legal Research Toolkit For India.
            </h1>
            
            <p className="text-base sm:text-lg text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
              AI-Powered Chat, Document Analysis, Voice Input, And Multi-Language Support. Everything You Need To Navigate Indian Law With Absolute Confidence.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-2">
            <Button asChild className="h-14 px-10 rounded-xl bg-primary text-primary-foreground font-black text-sm shadow-xl active:scale-95 transition-all">
              <Link href="/dashboard" className="flex items-center gap-3">
                Start Your First Legal Query Free <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <section className="py-12 px-4 sm:px-6 border-t border-border/10">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 px-5 py-1.5 rounded-full text-[10px] font-bold mb-2">
              Features
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tighter leading-none text-foreground">
              Ten Elite AI Tools For Legal Clarity
            </h2>
            <p className="text-base text-muted-foreground font-medium tracking-tight">
              A Comprehensive Suite Of Forensic Terminals Synchronized With The Modern Indian Judicial Landscape.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {capabilities.map((item, i) => (
              <Card key={i} className="h-full bg-card border-border/10 rounded-2xl overflow-hidden hover:border-primary/20 shadow-sm transition-all">
                <CardContent className="p-6 flex flex-col h-full text-left space-y-4">
                  <div className={cn("p-3 rounded-xl h-fit w-fit border border-border/5", item.bg, item.color)}>
                    <item.icon className="h-5 w-5" />
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold tracking-tight text-foreground leading-tight">{item.title}</h3>
                    <p className="text-[11px] text-muted-foreground leading-relaxed font-medium">
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
