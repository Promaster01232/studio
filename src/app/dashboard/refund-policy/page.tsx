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

const policyNodes = [
  {
    title: "Service consumption",
    desc: "Services—including AI forensic analysis and document generation—are digital content. Usage is tracked via 'AI usage count'. Once an operation is executed, the service is considered 'consumed'.",
    icon: RotateCcw,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20"
  },
  {
    title: "Refund eligibility",
    desc: "Refunds are issued for technical failures where the AI fails to generate output despite deducting credits. Claims must be filed within 48 hours of the recorded transaction.",
    icon: ShieldCheck,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20"
  },
  {
    title: "Cancellation protocol",
    desc: "Subscription access can be cancelled any time via the billing terminal. Cancellation stops future cycles; partial refunds for current cycles are not provided.",
    icon: Clock,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20"
  },
  {
    title: "Processing timeline",
    desc: "Approved refunds are processed via the original Razorpay ingress node. Allow 5-7 business days for the credit to materialize in your statutory bank account.",
    icon: CreditCard,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20"
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
              description="Institutional transparency regarding statutory billing, credit restoration, and service cancellation."
            />
        </div>
        <Button variant="outline" size="sm" className="rounded-full font-black text-[10px] uppercase tracking-widest h-10 px-6 border-foreground/20 hover:bg-foreground hover:text-background transition-all" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-3.5 w-3.5" /> Back to Terminal
          </Link>
        </Button>
      </motion.div>

      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
        <Card className="border-none ring-1 ring-primary/10 shadow-3xl rounded-[3rem] overflow-hidden bg-card/40 backdrop-blur-xl relative">
          <CardContent className="p-8 sm:p-16 relative z-10 text-left">
            <div className="flex items-center gap-3 text-primary mb-6">
              <div className="bg-primary/10 p-2.5 rounded-xl shadow-inner">
                <Info className="h-6 w-6" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Razorpay Secure Ingress</span>
            </div>
            <div className="space-y-6 max-w-4xl">
              <h2 className="text-3xl sm:text-6xl font-black tracking-tighter leading-[0.9] uppercase">
                Fair use for <br />
                <span className="text-primary italic">Absolute fairness.</span>
              </h2>
              <p className="text-sm sm:text-xl text-muted-foreground font-medium leading-relaxed">
                Nyaya Sahayak is committed to institutional integrity. Our refund protocols protect citizens in cases of system latency or neural processing failures while ensuring the sustainability of our AI infrastructure.
              </p>
            </div>
          </CardContent>
          <div className="h-2 w-full bg-gradient-to-r from-primary via-accent to-blue-400"></div>
        </Card>
      </motion.div>

      <div className="grid gap-8 sm:grid-cols-2">
        {policyNodes.map((node, idx) => (
          <motion.div key={idx} initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }}>
            <Card className="h-full border-none ring-1 ring-primary/5 bg-card/30 hover:bg-card/50 transition-all duration-500 group rounded-[2.5rem] shadow-lg relative overflow-hidden">
              <div className={cn("absolute top-0 left-0 bottom-0 w-1.5 transition-all duration-500 group-hover:w-2", node.bg.replace('bg-', 'bg-').replace('/10', ''))} />
              <CardContent className="p-10 space-y-6 text-left ml-1.5">
                <div className={cn("p-4 rounded-2xl w-fit shadow-xl group-hover:scale-110 transition-transform duration-500", node.bg, node.color)}>
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
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-12 border-t border-primary/5">
        <div className="grid lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="flex items-center gap-3 text-primary">
              <Scale className="h-6 w-6" />
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Statutory compliance</h4>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed font-medium max-w-2xl">
              Transactions on nyayasahayak.in are subject to the Consumer Protection (E-Commerce) Rules, 2020. Our refund protocols do not override your statutory rights under Indian law. For any discrepancies in Razorpay captures, please contact our support hub immediately.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10">
                    <Activity className="h-3.5 w-3.5 text-primary animate-pulse" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Active gateway monitoring</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/5 border border-green-500/10">
                    <Zap className="h-3.5 w-3.5 text-green-600" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Instant TX verification</span>
                </div>
            </div>
          </div>
          
          <Card className="lg:col-span-5 p-10 bg-primary/5 border border-primary/10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none group-hover:scale-110 transition-transform">
                <Mail className="h-32 w-32 text-primary" />
            </div>
            <div className="relative z-10 space-y-8">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary text-white rounded-2xl shadow-xl shadow-primary/20">
                        <Mail className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-primary">Claim desk</p>
                        <h3 className="text-lg font-black tracking-tight">Statutory support hub</h3>
                    </div>
                </div>
                <div className="space-y-4">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Email transaction ID to:</p>
                    <p className="text-xl font-black text-foreground hover:text-primary transition-colors cursor-pointer select-all">nyayasahayakhelp@gmail.com</p>
                </div>
                <Button className="w-full h-12 font-black uppercase text-[10px] tracking-widest rounded-xl shadow-xl active:scale-95 transition-all">
                    Initialize Support link
                </Button>
            </div>
          </Card>
        </div>
      </motion.div>

      <div className="text-center pt-16 opacity-30">
          <p className="text-[9px] font-black uppercase tracking-[0.6em] text-muted-foreground">NYAYASAHAYAK.IN // BILLING PROTOCOL // 2025</p>
      </div>
    </div>
  );
}
