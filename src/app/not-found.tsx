
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { Home, LayoutDashboard, ShieldAlert, Zap, FileSearch, Search, Gavel, Cpu, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { cn } from "@/lib/utils";

export default function NotFound() {
  const errorImage = PlaceHolderImages.find(img => img.id === 'not-found-judicial');

  return (
    <div className="min-h-screen bg-background bg-golden-animate flex items-center justify-center p-6 selection:bg-primary/20">
      <div className="max-w-5xl w-full space-y-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center text-center space-y-10"
        >
          <div className="flex items-center gap-3">
            <Logo className="h-12 w-12 border-none shadow-none p-0 bg-transparent" priority={true} />
            <span className="text-xl font-black font-headline tracking-tighter uppercase text-foreground">Nyaya Sahayak</span>
          </div>

          <div className="relative aspect-video w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-3xl border border-primary/10 group">
            <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors duration-700 z-10" />
            {errorImage && (
              <Image 
                src={errorImage.imageUrl} 
                alt="Registry node error" 
                fill 
                className="object-cover grayscale opacity-40 transition-transform duration-[20s] group-hover:scale-110"
                data-ai-hint={errorImage.imageHint}
              />
            )}
            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-6 bg-background/40 backdrop-blur-[2px] z-20 p-8">
              <div className="p-5 rounded-3xl bg-red-500/10 border border-red-500/20 text-red-500 shadow-2xl">
                <ShieldAlert className="h-12 w-12" />
              </div>
              <div className="space-y-3">
                <h1 className="text-3xl sm:text-4xl font-black tracking-tighter uppercase leading-none text-foreground">
                  Node Synchronization Failure
                </h1>
                <p className="text-[10px] sm:text-[12px] font-bold text-muted-foreground uppercase tracking-[0.4em] max-w-md mx-auto leading-relaxed">
                  The requested document path or statutory module is currently unregistered in our neural hub. This may be due to an outdated reference or a decommissioned registry node.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" className="rounded-2xl font-black uppercase tracking-widest text-[10px] h-14 px-10 shadow-2xl shadow-primary/20 active:scale-95 transition-all" asChild>
              <Link href="/dashboard">
                <LayoutDashboard className="mr-3 h-5 w-5" /> Secure Dashboard
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="rounded-2xl font-black uppercase tracking-widest text-[10px] h-14 px-10 border-primary/10 hover:bg-primary/5 active:scale-95 transition-all text-foreground" asChild>
              <Link href="/">
                <Home className="mr-3 h-5 w-5" /> Home Ingress
              </Link>
            </Button>
          </div>
        </motion.div>

        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-10"
        >
          <div className="flex items-center gap-6 justify-center">
            <div className="h-px flex-1 bg-primary/10 max-w-[100px]" />
            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground/60">Related Forensic Terminals</h2>
            <div className="h-px flex-1 bg-primary/10 max-w-[100px]" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { 
                title: "Statutory Linker", 
                desc: "Locate specific BNS sections and legal amendments relevant to your situation.",
                icon: Zap, 
                href: "/dashboard/statutory-linker", 
                color: "text-indigo-500" 
              },
              { 
                title: "Strength Analyzer", 
                desc: "Analyze case details to determine the statistical probability of a successful outcome.",
                icon: Cpu, 
                href: "/dashboard/strength-analyzer", 
                color: "text-amber-500" 
              },
              { 
                title: "Document Audit", 
                desc: "Identify statutory risks, deadlines, and required actions within your legal papers.",
                icon: FileSearch, 
                href: "/dashboard/document-intelligence", 
                color: "text-emerald-500" 
              },
            ].map((node, i) => (
              <Link key={i} href={node.href}>
                <div className="p-8 h-full rounded-[2.5rem] bg-card border border-primary/5 hover:border-primary/20 transition-all group text-left space-y-6 shadow-xl hover:shadow-2xl flex flex-col">
                  <div className={cn("p-4 rounded-2xl w-fit transition-transform group-hover:scale-110", node.color.replace('text', 'bg').replace('500', '500/10'))}>
                    <node.icon className={cn("h-6 w-6", node.color)} />
                  </div>
                  <div className="space-y-3 flex-1">
                    <p className="text-[11px] font-black uppercase tracking-widest text-foreground group-hover:text-primary transition-colors">{node.title}</p>
                    <p className="text-xs font-medium text-muted-foreground leading-relaxed">{node.desc}</p>
                  </div>
                  <div className="pt-4 border-t border-primary/5 flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-primary/40 group-hover:text-primary transition-colors">
                    Access Terminal <ArrowRight className="h-3 w-3" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
