"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  MessageSquare, 
  Upload, 
  ShieldCheck, 
  Zap, 
  Activity, 
  ArrowRight, 
  Gavel, 
  Scale, 
  Globe,
  Sparkles,
  FileSearch,
  FileText,
  FileSignature,
  BrainCircuit,
  FileCheck,
  Languages,
  BookOpen,
  Mic,
  Menu
} from "lucide-react";
import { motion } from "framer-motion";
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
    title: "Ai legal chat",
    desc: "Ask about any act or section. Get an explanation with the relevant law cited.",
    icon: MessageSquare,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
  {
    title: "Document ocr",
    desc: "Upload a court order or notice as pdf or image. Text is extracted.",
    icon: FileSearch,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    title: "Smart notes",
    desc: "Save chats, add notes, organize into collections. Search across everything.",
    icon: FileText,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    title: "Case laws",
    desc: "Responses reference supreme court and high court judgments where relevant.",
    icon: BookOpen,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    title: "Files storage",
    desc: "Keep your documents (pdf, word, images) in one place. Encrypted cloud storage.",
    icon: Upload,
    color: "text-rose-500",
    bg: "bg-rose-500/10",
  },
  {
    title: "Multi-language",
    desc: "Works in hindi, english, marathi, tamil, telugu, kannada, malayalam, and more.",
    icon: Languages,
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
  },
  {
    title: "Voice input",
    desc: "Don't want to type? Speak your question. Works on mobile and desktop.",
    icon: Mic,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
  },
  {
    title: "Privacy first",
    desc: "End-to-end encryption. No data sharing. No training on your conversations.",
    icon: ShieldCheck,
    color: "text-primary",
    bg: "bg-primary/10",
  }
];

const navItems = [
  { name: "Features", href: "/features" },
  { name: "How it works", href: "/how-it-works" },
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    },
  };

  return (
    <div className="min-h-screen bg-background text-foreground bg-golden-animate selection:bg-primary/30 overflow-x-hidden font-body text-left">
      <nav className="fixed top-0 w-full z-50 px-6 py-4 flex justify-between items-center bg-background/40 backdrop-blur-md border-b border-border/10">
        <div className="flex items-center gap-2">
          <Logo className="h-10 w-10 border-none bg-transparent shadow-none p-0" priority={true} />
          <span className="text-xl font-black font-headline tracking-tighter text-foreground">Nyaya Sahayak</span>
        </div>
        
        <div className="hidden md:flex items-center gap-10">
          {navItems.map((item) => (
            <Link 
              key={item.name} 
              href={item.href}
              className="text-sm font-medium text-foreground/60 hover:text-primary transition-all duration-300"
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
              <Button asChild className="bg-primary text-primary-foreground font-bold text-xs px-6 h-10 rounded-xl shadow-lg shadow-primary/20 active:scale-95 transition-all">
                <Link href="/register">Join hub</Link>
              </Button>
            </div>
          </div>

          <div className="md:hidden">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-foreground hover:bg-primary/5 rounded-xl h-10 w-10">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-background border-border/10 text-foreground w-[280px] p-0">
                <SheetHeader className="p-6 border-b border-border/10">
                  <SheetTitle className="text-foreground text-left font-headline font-black text-xl tracking-tighter">Navigation</SheetTitle>
                  <SheetDescription className="text-muted-foreground text-left text-[10px] uppercase font-bold tracking-widest">Institutional hub</SheetDescription>
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
                    <Link href="/register">Join hub</Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      <main className="pt-48 pb-20 px-4">
        <div className="max-w-5xl mx-auto text-center space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center"
          >
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 px-4 py-1.5 rounded-full text-[9px] font-bold mb-10 uppercase tracking-widest">
              Platform status: active
            </Badge>
            
            <h1 className="text-4xl sm:text-7xl font-black tracking-tighter leading-[1.1] mb-8 text-foreground">
              Your complete <br /> <span className="text-primary italic">Legal research toolkit.</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
              Ai-powered chat, document analysis, voice input, and multi-language support. everything you need to navigate indian law with absolute confidence.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4"
          >
            <Button asChild className="h-14 px-8 rounded-2xl bg-primary text-primary-foreground font-bold text-xs shadow-2xl shadow-primary/20 active:scale-95 transition-all">
              <Link href="/dashboard">
                <span className="relative z-10 flex items-center">
                  Start your first legal query free <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              </Link>
            </Button>
          </motion.div>
        </div>
      </main>

      <section className="py-32 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/10 to-transparent" />
        
        <div className="max-w-7xl mx-auto space-y-24">
          <div className="text-center space-y-6">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 px-5 py-1.5 rounded-full text-[10px] font-bold mb-4">
              Features
            </Badge>
            <h2 className="text-4xl sm:text-6xl font-black tracking-tighter leading-none text-foreground">
              What you can do with Nyaya Sahayak
            </h2>
            <p className="text-lg text-muted-foreground font-medium tracking-tight">
              Eight tools, all included free. from chat to document ocr to voice input.
            </p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {capabilities.map((item, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                className="group"
              >
                <Card className="h-full bg-card border-border/10 rounded-[2rem] overflow-hidden transition-all duration-500 hover:border-primary/20 hover:shadow-3xl">
                  <CardContent className="p-8 sm:p-10 flex flex-col h-full text-left space-y-8">
                    <div className={cn("p-4 rounded-2xl h-fit w-fit shadow-xl border border-border/5 transition-transform group-hover:scale-110 duration-500", item.bg, item.color)}>
                      <item.icon className="h-6 w-6" />
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="text-xl font-black tracking-tight text-foreground leading-tight">{item.title}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                        {item.desc}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
