"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  CreditCard, 
  ShieldCheck, 
  RotateCcw, 
  Clock, 
  Info, 
  Mail,
  Scale
} from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const policyNodes = [
  {
    title: "1. Service Consumption",
    desc: "Services—including AI Forensic Analysis and Document Generation—are digital content. Usage is tracked via 'AI Usage Count'. Once an operation is executed, the service is considered 'consumed'.",
    icon: RotateCcw,
    color: "text-blue-500",
    bg: "bg-blue-500/10"
  },
  {
    title: "2. Refund Eligibility",
    desc: "Refunds are issued for technical node failures where the AI fails to generate output despite deducting credits. Claims must be filed within 48 hours of the recorded transaction.",
    icon: ShieldCheck,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10"
  },
  {
    title: "3. Cancellation Protocol",
    desc: "Subscription nodes can be cancelled any time via the Billing Terminal. Cancellation stops future cycles; partial refunds for current cycles are not provided.",
    icon: Clock,
    color: "text-amber-500",
    bg: "bg-amber-500/10"
  },
  {
    title: "4. Processing Timeline",
    desc: "Approved refunds are processed via the original Razorpay ingress node. Allow 5-7 business days for the credit to materialize in your statutory bank account.",
    icon: CreditCard,
    color: "text-purple-500",
    bg: "bg-purple-500/10"
  }
];

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 15 }
  }
};

export default function RefundPolicyPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20 px-4 text-left">
      <motion.div 
        initial={{ opacity: 0, y: -10 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 border-b border-primary/5 pb-8"
      >
        <PageHeader
          title="Refund & Cancellation Policy"
          description="Institutional protocol regarding statutory billing, credit restoration, and service cancellation."
        />
        <Badge variant="outline" className="font-black text-[9px] uppercase tracking-widest bg-primary/5 text-primary border-primary/10 px-4 py-1.5 rounded-full">Billing Protocol</Badge>
      </motion.div>

      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
        <Card className="border-none ring-1 ring-primary/10 shadow-3xl rounded-[3rem] overflow-hidden bg-card/40 backdrop-blur-xl relative">
          <CardContent className="p-8 sm:p-16 relative z-10 text-left">
            <div className="flex items-center gap-3 text-primary mb-6">
              <div className="bg-primary/10 p-2.5 rounded-xl">
                <Info className="h-6 w-6" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Billing Transparency</span>
            </div>
            <div className="space-y-6 max-w-4xl">
              <h2 className="text-3xl sm:text-6xl font-black tracking-tighter leading-[0.9] uppercase">
                Fair Use for <br />
                <span className="text-primary italic">Absolute Fairness.</span>
              </h2>
              <p className="text-sm sm:text-xl text-muted-foreground font-medium leading-relaxed">
                Nyaya Sahayak is committed to institutional integrity. Our refund protocols protect citizens in cases of system latency or neural processing failures while ensuring the sustainability of our AI infrastructure.
              </p>
            </div>
          </CardContent>
          <div className="h-2 w-full bg-gradient-to-r from-primary via-accent to-blue-400"></div>
        </Card>
      </motion.div>

      <div className="grid gap-6 sm:grid-cols-2">
        {policyNodes.map((node, idx) => (
          <motion.div key={idx} initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }}>
            <Card className="h-full border-none ring-1 ring-primary/5 bg-card/30 hover:bg-card/50 transition-all duration-500 group rounded-[2.5rem] shadow-lg">
              <CardContent className="p-8 space-y-6 text-left">
                <div className={`${node.bg} p-4 rounded-2xl w-fit shadow-xl group-hover:scale-110 transition-transform duration-500`}>
                  <node.icon className={`h-6 w-6 ${node.color}`} />
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-black tracking-tight uppercase leading-tight">{node.title}</h3>
                  <p className="text-[11px] text-muted-foreground leading-relaxed font-medium">
                    {node.desc}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-12 border-t border-primary/5 text-center sm:text-left space-y-8">
        <div className="flex flex-col md:flex-row gap-10 items-start">
          <div className="space-y-4 flex-1 text-left">
            <div className="flex items-center gap-2 text-primary">
              <Scale className="h-5 w-5" />
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Statutory Compliance</h4>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed font-medium max-w-2xl">
              Transactions on nyayasahayak.in are subject to the Consumer Protection (E-Commerce) Rules, 2020. Our refund protocols do not override your statutory rights under Indian law. For assistance, contact our Support node.
            </p>
          </div>
          <Card className="p-8 bg-primary/5 border border-primary/10 rounded-[2rem] w-full sm:w-96 shrink-0 shadow-inner">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 rounded-lg"><Mail className="h-5 w-5 text-primary" /></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-primary">Claim Node</span>
            </div>
            <p className="text-xs font-bold mb-2 text-foreground uppercase tracking-tight">Email transaction ID to:</p>
            <p className="text-sm font-black text-primary hover:underline cursor-pointer select-all">nyayasahayakhelp@gmail.com</p>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
