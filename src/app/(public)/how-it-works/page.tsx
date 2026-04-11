
"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Mic, 
  Bot, 
  Users, 
  ArrowRight, 
  ShieldCheck, 
  Activity, 
  Globe,
  CheckCircle2,
  Cpu,
  Sparkles
} from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const steps = [
  {
    title: "1. Tell your story",
    desc: "Record your legal problem in your own words. Use any language you are comfortable with. Our AI accurately transcribes your narrative.",
    icon: Mic,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    title: "2. Deep forensic audit",
    desc: "Our neural engine identifies the relevant acts, sections, and statutory risks. It builds a personalized procedural roadmap for your case.",
    icon: Bot,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    title: "3. Connect with experts",
    desc: "Once you have your roadmap, connect with verified legal professionals through our registry to execute your strategy with confidence.",
    icon: Users,
    color: "text-green-500",
    bg: "bg-green-500/10",
  }
];

export default function HowItWorksPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-16 pb-32 px-4 sm:px-6 text-left">
      <motion.div 
        initial={{ opacity: 0, y: -10 }} 
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 border-b border-white/10 pb-8"
      >
        <PageHeader
          title="How it works"
          description="A seamless three-stage protocol to transform your legal problems into actionable statutory roadmaps."
        />
        <Badge variant="outline" className="font-bold text-[9px] uppercase tracking-widest bg-primary/5 text-primary border-primary/10 px-4 py-1.5 rounded-full">Process Node</Badge>
      </motion.div>

      <div className="grid gap-12 lg:grid-cols-3 relative">
        <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px bg-white/5 -z-10" />
        
        {steps.map((step, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 }}
          >
            <Card className="h-full border-white/5 bg-card/40 backdrop-blur-md rounded-[2.5rem] overflow-hidden text-center group hover:border-primary/20 transition-all">
              <CardContent className="p-10 space-y-8 flex flex-col items-center">
                <div className={`${step.bg} ${step.color} p-6 rounded-3xl shadow-xl transition-transform group-hover:scale-110 duration-500`}>
                  <step.icon className="h-10 w-10" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-black tracking-tight text-white">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                    {step.desc}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        className="pt-10"
      >
        <Card className="bg-primary/5 border border-primary/10 rounded-[3rem] p-10 sm:p-16 flex flex-col md:flex-row items-center justify-between gap-10 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none grayscale">
            <Cpu className="h-64 w-64" />
          </div>
          <div className="space-y-6 text-left relative z-10 max-w-xl">
            <div className="flex items-center gap-3 text-primary">
              <div className="p-2 rounded-lg bg-primary/10">
                <ShieldCheck className="h-5 w-5 animate-pulse" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest">Statutory Trust</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white leading-none tracking-tighter">Your data is <br /> <span className="text-primary italic">Your property.</span></h2>
            <p className="text-sm sm:text-lg text-gray-400 font-medium leading-relaxed">
              Every forensic report and narration is encrypted via TLS 1.3 and is strictly confidential. We do not train models on citizen data.
            </p>
          </div>
          <div className="flex items-center justify-center p-8 bg-black/40 rounded-[2.5rem] border border-white/5 shadow-2xl relative z-10">
            <CheckCircle2 className="h-20 w-20 text-primary opacity-40" />
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
