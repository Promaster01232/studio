
"use client";

import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight, ArrowLeft, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { guides } from "./data";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function PoliceGuidePage() {
  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-20 px-2 sm:px-0">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-primary/5 pb-8">
        <PageHeader
          title="Police & Court Protocols"
          description="Institutional guides for navigating law enforcement and judicial procedures."
        />
        <Button variant="ghost" size="sm" className="rounded-xl font-bold hover:bg-primary/5 group h-10 px-6 border border-primary/5 text-primary text-[10px] uppercase tracking-widest" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" /> Back to Dashboard
          </Link>
        </Button>
      </motion.div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {guides.map((guide, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link href={`/dashboard/police-guide/${guide.slug}`} className="block group">
                <Card className={cn(
                    "h-full min-h-[240px] flex flex-col justify-between transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-1 border-none text-primary-foreground overflow-hidden rounded-[2rem] relative",
                    guide.gradient 
                )}>
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="p-8 pb-0 flex-grow relative z-10 text-left">
                        <div className="bg-white/20 p-3 rounded-2xl w-fit backdrop-blur-md border border-white/10 shadow-xl group-hover:scale-110 transition-transform duration-500">
                            <guide.icon className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-black mt-6 font-headline tracking-tighter leading-tight">{guide.title}</h3>
                        <p className="opacity-70 mt-2 text-[11px] font-bold uppercase tracking-widest leading-relaxed">{guide.description}</p>
                    </div>
                    <div className="p-8 pt-2 relative z-10">
                        <div className={cn("mt-4 flex items-center font-black text-[10px] uppercase tracking-[0.2em] bg-white/20 backdrop-blur-md rounded-xl px-5 py-2.5 w-fit group-hover:bg-white/30 transition-all border border-white/10", guide.gradient.includes("text-black") && "bg-black/10 group-hover:bg-black/20")}>
                            <span>Initialize Guide</span>
                            <ArrowRight className="h-3.5 w-3.5 ml-2 transition-transform group-hover:translate-x-1" />
                        </div>
                    </div>
                </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
