
"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle2, 
  Crown, 
  Layers, 
  Trophy, 
  ZapIcon,
  ShieldCheck,
  Activity,
  ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";

const plans = [
  {
    id: "free",
    name: "Citizen basic",
    price: "0",
    desc: "Standard identity enrollment for individual legal awareness.",
    features: ["Voice narration (5x)", "Document audit (5x)", "Basic case analytics", "Public directory access"],
    icon: ZapIcon,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    id: "pro_20",
    name: "Professional 20",
    price: "99",
    desc: "Essential statutory expansion for complex legal situations.",
    features: ["Voice narration (20x)", "Document audit (20x)", "Extended case tracker", "Priority Ai ingress"],
    badge: "Popular choice",
    icon: Crown,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    id: "unlimited_monthly",
    name: "Unlimited monthly",
    price: "599",
    desc: "Continuous institutional access for active litigation.",
    features: ["Unlimited Ai forensic scans", "Unlimited document audits", "Full case strategy hub", "Verified connect ingress"],
    badge: "Professional tier",
    icon: Layers,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    id: "unlimited_yearly",
    name: "Institutional annual",
    price: "4999",
    desc: "Permanent statutory authority for legal professionals.",
    features: ["Everything in unlimited", "Advanced contract node", "Custom Pdf export protocol", "Root system access"],
    badge: "Elite node",
    icon: Trophy,
    color: "text-primary",
    bg: "bg-primary/10",
  }
];

export default function PricingPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-16 pb-32 px-4 sm:px-6 text-left">
      <motion.div 
        initial={{ opacity: 0, y: -10 }} 
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 border-b border-white/10 pb-8"
      >
        <PageHeader
          title="Statutory plans"
          description="Select your institutional clearance level to access advanced AI forensic tools."
        />
        <Badge variant="outline" className="font-bold text-[9px] bg-primary/5 text-primary border-primary/10 px-4 py-1.5 rounded-full">Financial protocol</Badge>
      </motion.div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 items-stretch">
        {plans.map((plan, i) => (
          <motion.div 
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="relative"
          >
            <Card className="h-full flex flex-col border-white/5 bg-card/40 backdrop-blur-md rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-3xl group">
              {plan.badge && (
                <div className="absolute top-6 right-6 z-20">
                  <Badge className="bg-primary/10 text-primary border-primary/20 font-bold text-[8px] px-2.5 py-1 rounded-lg">
                    {plan.badge}
                  </Badge>
                </div>
              )}
              <CardHeader className="p-8 pb-0 space-y-6 text-left">
                <div className="space-y-4">
                  <h3 className="text-xl font-black font-headline tracking-tighter uppercase leading-none">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black tracking-tight text-white">₹{plan.price}</span>
                    {plan.id !== 'free' && <span className="text-xs font-bold text-muted-foreground">/period</span>}
                  </div>
                </div>
                <p className="text-[11px] font-bold text-muted-foreground leading-relaxed min-h-[32px]">
                  {plan.desc}
                </p>
              </CardHeader>
              <CardContent className="p-8 flex-grow text-left space-y-6">
                <div className="h-px w-full bg-white/5" />
                <ul className="space-y-4">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-[11px] font-medium text-white/80 leading-tight">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="p-8 pt-0">
                <Button asChild className="w-full h-14 rounded-2xl font-bold text-xs transition-all active:scale-95 shadow-xl shadow-primary/20">
                  <Link href="/register">Initialize access</Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="pt-12 text-center opacity-30">
          <div className="flex items-center justify-center gap-6 mb-4">
              <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  <span className="text-[9px] font-bold">Secure gateway sync</span>
              </div>
              <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  <span className="text-[9px] font-bold">Institutional ledger</span>
              </div>
          </div>
          <p className="text-[9px] font-bold tracking-[0.5em] text-muted-foreground uppercase">Nyayasahayak.in // Financial ledger</p>
      </div>
    </div>
  );
}
