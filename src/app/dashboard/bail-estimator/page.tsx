
"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gavel, ArrowLeft, TrendingUp, ShieldAlert, Cpu, Activity } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function BailEstimatorPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-20 text-left px-2">
      <div className="flex items-center justify-between border-b border-primary/5 pb-6">
        <PageHeader title="Bail Matrix" description="AI-powered predictive modeling for statutory bail success probability." />
        <Button variant="ghost" size="sm" className="rounded-xl font-bold hover:bg-primary/5 group h-10 px-6 border border-primary/5 text-primary text-[10px] uppercase tracking-widest" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" /> Back to Terminal
          </Link>
        </Button>
      </div>

      <Card className="glass border-primary/5 shadow-2xl rounded-[2.5rem] overflow-hidden">
        <CardHeader className="bg-primary/5 border-b border-primary/10 p-10 text-center">
            <div className="p-6 bg-white dark:bg-black/20 rounded-full w-fit mx-auto mb-6 shadow-xl border border-primary/10">
                <Gavel className="h-16 w-16 text-rose-500" />
            </div>
            <CardTitle className="text-3xl font-black font-headline tracking-tighter uppercase mb-2">Bail Probability Node</CardTitle>
            <CardDescription className="text-xs font-medium uppercase tracking-[0.2em] opacity-60">Initialize success modeling based on BNS sections.</CardDescription>
        </CardHeader>
        <CardContent className="p-10 text-center space-y-10">
            <div className="grid sm:grid-cols-3 gap-6">
                {[
                    { label: "BNS-Audit", icon: ShieldAlert, val: "Ready" },
                    { label: "Judicial Node", icon: Cpu, val: "Synced" },
                    { label: "Latency", icon: Activity, val: "42ms" }
                ].map((item, i) => (
                    <Card key={i} className="p-6 bg-muted/20 border-primary/5 rounded-2xl space-y-2">
                        <item.icon className="h-5 w-5 text-primary mx-auto opacity-40" />
                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">{item.label}</p>
                        <p className="text-xs font-black text-foreground">{item.val}</p>
                    </Card>
                ))}
            </div>
            <div className="p-10 border border-primary/10 bg-primary/5 rounded-3xl italic text-sm font-medium text-muted-foreground leading-relaxed">
                "Modeling requires case reference number and BNS section mapping for statutory accuracy."
            </div>
            <Button className="w-full h-16 font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl shadow-xl shadow-primary/20">
                Initialize Success Matrix
            </Button>
        </CardContent>
      </Card>
    </div>
  );
}
