
"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ArrowLeft, FileUp, Loader2, Sparkles, Activity } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function EvidenceAuditPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-20 text-left px-2">
      <div className="flex items-center justify-between border-b border-primary/5 pb-6">
        <PageHeader title="Evidence Audit" description="Statutory forensic verification of documentary and digital evidence nodes." />
        <Button variant="ghost" size="sm" className="rounded-xl font-bold hover:bg-primary/5 group h-10 px-6 border border-primary/5 text-primary text-[10px] uppercase tracking-widest" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" /> Back to Terminal
          </Link>
        </Button>
      </div>

      <Card className="glass border-primary/5 shadow-2xl rounded-[2.5rem] overflow-hidden">
        <CardHeader className="bg-primary/5 border-b border-primary/10 p-10 text-center">
            <div className="p-6 bg-white dark:bg-black/20 rounded-full w-fit mx-auto mb-6 shadow-xl border border-primary/10">
                <ShieldCheck className="h-16 w-16 text-primary animate-pulse" />
            </div>
            <CardTitle className="text-3xl font-black font-headline tracking-tighter uppercase mb-2">Initialize Forensic Scan</CardTitle>
            <CardDescription className="text-xs font-medium uppercase tracking-[0.2em] opacity-60">Upload files for statutory consistency auditing.</CardDescription>
        </CardHeader>
        <CardContent className="p-10 flex flex-col items-center justify-center gap-10">
            <div className="w-full max-w-sm border-2 border-dashed border-primary/20 rounded-3xl p-12 text-center bg-primary/[0.02] transition-all hover:bg-primary/[0.05] group cursor-pointer">
                <FileUp className="h-12 w-12 text-primary/40 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Select Ingress Files</p>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full">
                <Card className="p-6 bg-muted/20 border-primary/5 rounded-2xl text-center space-y-2">
                    <Activity className="h-5 w-5 text-primary mx-auto opacity-40" />
                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Network Status</p>
                    <p className="text-xs font-black text-green-600">Optimal</p>
                </Card>
                <Card className="p-6 bg-muted/20 border-primary/5 rounded-2xl text-center space-y-2">
                    <Sparkles className="h-5 w-5 text-amber-600 mx-auto opacity-40" />
                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Neural Capacity</p>
                    <p className="text-xs font-black text-amber-600">Standard</p>
                </Card>
            </div>
            <Button className="w-full h-16 font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl shadow-xl shadow-primary/20">
                Start Forensic Audit Node
            </Button>
        </CardContent>
      </Card>
    </div>
  );
}
