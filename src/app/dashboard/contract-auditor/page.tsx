
"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileCheck, ArrowLeft, Search, AlertTriangle, Scale, Lock } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ContractAuditorPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-20 text-left px-2">
      <div className="flex items-center justify-between border-b border-primary/5 pb-6">
        <PageHeader title="Contract Auditor" description="Institutional-grade AI audit for identifying unfavorable statutory clauses." />
        <Button variant="ghost" size="sm" className="rounded-xl font-bold hover:bg-primary/5 group h-10 px-6 border border-primary/5 text-primary text-[10px] uppercase tracking-widest" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" /> Back to Terminal
          </Link>
        </Button>
      </div>

      <Card className="glass border-primary/5 shadow-2xl rounded-[2.5rem] overflow-hidden">
        <CardHeader className="bg-primary/5 border-b border-primary/10 p-10 text-center">
            <div className="p-6 bg-white dark:bg-black/20 rounded-full w-fit mx-auto mb-6 shadow-xl border border-primary/10">
                <FileCheck className="h-16 w-16 text-teal-600" />
            </div>
            <CardTitle className="text-3xl font-black font-headline tracking-tighter uppercase mb-2">Neural Contract Scan</CardTitle>
            <CardDescription className="text-xs font-medium uppercase tracking-[0.2em] opacity-60">High-fidelity risk assessment for agreements and deeds.</CardDescription>
        </CardHeader>
        <CardContent className="p-10 text-center space-y-10">
            <div className="grid grid-cols-2 gap-6 text-left">
                <div className="space-y-4 p-6 bg-red-500/5 rounded-3xl border border-red-500/10">
                    <div className="flex items-center gap-2 text-red-600">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Risk Nodes</span>
                    </div>
                    <p className="text-[11px] font-bold text-muted-foreground leading-relaxed">AI identifies predatory clauses and statutory inconsistencies.</p>
                </div>
                <div className="space-y-4 p-6 bg-primary/5 rounded-3xl border border-primary/10">
                    <div className="flex items-center gap-2 text-primary">
                        <Scale className="h-4 w-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Equitability</span>
                    </div>
                    <p className="text-[11px] font-bold text-muted-foreground leading-relaxed">Measures balance of power between contracting parties.</p>
                </div>
            </div>
            <div className="p-8 border border-primary/10 bg-background rounded-3xl text-center space-y-4">
                <Lock className="h-8 w-8 text-primary mx-auto opacity-20" />
                <p className="text-xs font-black uppercase tracking-widest text-primary">End-to-End Encryption Active</p>
                <p className="text-[10px] font-medium text-muted-foreground max-w-xs mx-auto">Your contracts are processed in an isolated vault and never stored on persistent nodes.</p>
            </div>
            <Button className="w-full h-16 font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl shadow-xl shadow-primary/20">
                Initialize Contract Audit
            </Button>
        </CardContent>
      </Card>
    </div>
  );
}
