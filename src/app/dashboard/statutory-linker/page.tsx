
"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, ArrowLeft, ArrowRight, Globe, Fingerprint, Activity, Layers } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function StatutoryLinkerPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-20 text-left px-2">
      <div className="flex items-center justify-between border-b border-primary/5 pb-6">
        <PageHeader title="BNS Linker" description="Neural mapping of cases to Bharatiya Nyaya Sanhita (BNS) sections." />
        <Button variant="ghost" size="sm" className="rounded-xl font-bold hover:bg-primary/5 group h-10 px-6 border border-primary/5 text-primary text-[10px] uppercase tracking-widest" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" /> Back to Terminal
          </Link>
        </Button>
      </div>

      <Card className="glass border-primary/5 shadow-2xl rounded-[2.5rem] overflow-hidden">
        <CardHeader className="bg-primary/5 border-b border-primary/10 p-10 text-center">
            <div className="p-6 bg-white dark:bg-black/20 rounded-full w-fit mx-auto mb-6 shadow-xl border border-primary/10">
                <Zap className="h-16 w-16 text-indigo-500 animate-pulse" />
            </div>
            <CardTitle className="text-3xl font-black font-headline tracking-tighter uppercase mb-2">BNS Statutory Hub</CardTitle>
            <CardDescription className="text-xs font-medium uppercase tracking-[0.2em] opacity-60">Synchronize your case with modern Indian law.</CardDescription>
        </CardHeader>
        <CardContent className="p-10 text-center space-y-10">
            <div className="grid gap-4">
                {[
                    { title: "IPC-to-BNS Ingress", desc: "Convert old section references to new statutory codes.", icon: Globe },
                    { title: "Statutory Clause Search", desc: "Locate specific BNS amendments in real-time.", icon: Fingerprint }
                ].map((node, i) => (
                    <Card key={i} className="p-6 bg-muted/20 border-primary/5 rounded-2xl flex items-center gap-6 text-left group hover:bg-primary/5 transition-all cursor-pointer">
                        <div className="p-3 bg-white dark:bg-zinc-900 rounded-xl shadow-md group-hover:scale-110 transition-transform">
                            <node.icon className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1 space-y-1">
                            <h4 className="font-black text-sm uppercase tracking-tight">{node.title}</h4>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{node.desc}</p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-all" />
                    </Card>
                ))}
            </div>
            <Button className="w-full h-16 font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl shadow-xl shadow-primary/20">
                Execute Statutory Linker
            </Button>
        </CardContent>
      </Card>
    </div>
  );
}
