"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { 
  CreditCard, 
  ShieldCheck, 
  RotateCcw, 
  Clock, 
  Info, 
  Mail,
  Scale,
  ArrowLeft,
  ChevronRight,
  Zap,
  Activity
} from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";

const policyNodes = [
  {
    title: "Service consumption",
    desc: "Services—including AI forensic analysis and document generation—are digital content. Usage is tracked via 'AI usage count'. Once an operation is executed, the service is considered 'consumed'.",
    icon: RotateCcw,
    color: "text-blue-500",
    bg: "bg-blue-500/10"
  },
  {
    title: "Refund eligibility",
    desc: "Refunds are issued for technical failures where the AI fails to generate output despite deducting credits. Claims must be filed within 48 hours of the recorded transaction.",
    icon: ShieldCheck,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10"
  },
  {
    title: "Cancellation protocol",
    desc: "Subscription access can be cancelled any time via the billing terminal. Cancellation stops future cycles; partial refunds for current cycles are not provided.",
    icon: Clock,
    color: "text-amber-500",
    bg: "bg-amber-500/10"
  },
  {
    title: "Processing timeline",
    desc: "Approved refunds are processed via the original Razorpay ingress node. Allow 5-7 business days for the credit to materialize in your statutory bank account.",
    icon: CreditCard,
    color: "text-purple-500",
    bg: "bg-purple-500/10"
  }
];

export default function RefundPolicyPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-32 px-4 sm:px-6 text-left">
      <motion.div 
        initial={{ opacity: 0, y: -10 }} 
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 border-b-4 border-foreground pb-8"
      >
        <div className="flex items-center gap-6">
            <div className="p-4 border-2 border-foreground rounded-2xl bg-foreground/5 shadow-sm">
                <RotateCcw className="h-8 w-8 text-primary" />
            </div>
            <PageHeader
              title="Refund protocol"
              description="Official institutional policy regarding Razorpay transactions and statutory credit restoration."
            />
        </div>
        <Button variant="outline" size="sm" className="rounded-full font-black text-[10px] uppercase tracking-widest h-10 px-6 border-foreground/20 hover:bg-foreground hover:text-background transition-all" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-3.5 w-3.5" /> Back to terminal
          </Link>
        </Button>
      </motion.div>

      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
        <Card className="border-none ring-1 ring-primary/10 shadow-3xl rounded-[3rem] overflow-hidden bg-card/40 backdrop-blur-xl relative">
          <div className="absolute top-0 right-0 p-16 opacity-[0.03] pointer-events-none grayscale">
            <Logo className="h-64 w-64" />
          </div>
          <CardContent className="p-8 sm:p-16 relative z-10 text-left space-y-8">
            <div className="flex items-center gap-3 text-primary mb-2">
              <div className="bg-primary/10 p-2.5 rounded-xl shadow-inner">
                <Info className="h-6 w-6" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Razorpay secure ingress</span>
            </div>
            <div className="space-y-6 max-w-4xl">
              <h2 className="text-3xl sm:text-6xl font-black tracking-tighter leading-[0.9] uppercase text-foreground">
                Statutory <br />
                <span className="text-primary italic">Billing integrity.</span>
              </h2>
              <p className="text-sm sm:text-xl text-muted-foreground font-medium leading-relaxed text-left">
                Our refund protocols ensure that every citizen is protected from system discrepancies. All transactions processed via Razorpay are subject to rigorous forensic audit before restoration.
              </p>
            </div>
          </CardContent>
          <div className="h-2 w-full bg-gradient-to-r from-primary via-accent to-blue-400"></div>
        </Card>
      </motion.div>

      <section className="space-y-8 text-left">
        <div className="flex items-center gap-3">
            <div className="h-1 w-8 bg-primary rounded-full" />
            <h2 className="text-xl font-black uppercase tracking-tighter">Policy entries</h2>
        </div>
        <div className="grid gap-8 sm:grid-cols-2">
            {policyNodes.map((node, idx) => (
                <Card key={idx} className="h-full border-none ring-1 ring-primary/5 bg-card/30 rounded-[2.5rem] shadow-lg group hover:ring-primary/20 transition-all relative overflow-hidden">
                    <div className={cn("absolute top-0 left-0 bottom-0 w-1.5 transition-all group-hover:w-2", node.bg.replace('bg-', 'bg-').replace('/10', ''))} />
                    <CardContent className="p-10 space-y-6 text-left ml-1.5">
                        <div className={cn("p-4 rounded-2xl w-fit transition-transform group-hover:scale-110 duration-500 shadow-xl", node.bg, node.color)}>
                            <node.icon className="h-7 w-7" />
                        </div>
                        <div className="space-y-3">
                            <h3 className="text-xl font-black tracking-tight uppercase leading-tight">{node.title}</h3>
                            <p className="text-[11px] sm:text-sm text-muted-foreground leading-relaxed font-medium">
                                {node.desc}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
      </section>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-12 border-t border-primary/5 text-center sm:text-left space-y-8">
        <div className="flex flex-col md:flex-row gap-10 items-start">
          <div className="space-y-4 flex-1 text-left">
            <div className="flex items-center gap-2 text-primary">
              <Scale className="h-5 w-5" />
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Statutory compliance</h4>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed font-medium max-w-2xl">
              Transactions are subject to the Consumer Protection Rules, 2020. Our protocols for the Razorpay gateway maintain the highest standards of financial security and consumer rights.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10">
                    <Activity className="h-3 w-3 text-primary animate-pulse" />
                    <span className="text-[9px] font-black uppercase">Live gateway sync</span>
                </div>
            </div>
          </div>
          <Card className="p-10 bg-primary/5 border border-primary/10 rounded-[3rem] w-full sm:w-96 shrink-0 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-[0.02] pointer-events-none group-hover:scale-110 transition-transform">
                <Mail className="h-20 w-20 text-primary" />
            </div>
            <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-3 text-left">
                    <div className="p-2 bg-primary/10 rounded-lg"><Mail className="h-5 w-5 text-primary" /></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">Claim hub</span>
                </div>
                <div className="space-y-1 text-left">
                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-tight">Email TXID to:</p>
                    <p className="text-sm font-black text-primary hover:underline cursor-pointer select-all truncate">nyayasahayakhelp@gmail.com</p>
                </div>
                <Button className="w-full h-12 font-black uppercase text-[10px] rounded-xl shadow-xl active:scale-95 transition-all">
                    Initialize link
                </Button>
            </div>
          </Card>
        </div>
      </motion.div>

      <div className="text-center pt-8 opacity-30">
          <p className="text-[9px] font-black uppercase tracking-[0.6em] text-muted-foreground">NYAYASAHAYAK.IN // FINANCIAL PROTOCOL // 2025</p>
      </div>
    </div>
  );
}
