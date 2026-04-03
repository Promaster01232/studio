"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Cookie, 
  ShieldCheck, 
  Activity, 
  Settings, 
  Lock, 
  Cpu, 
  MousePointer2, 
  History,
  Info
} from "lucide-react";
import { motion } from "framer-motion";
import { Logo } from "@/components/logo";
import { Badge } from "@/components/ui/badge";

const cookieNodes = [
  {
    title: "Essential Registry Nodes",
    desc: "Critical for secure operation of the Nyaya Sahayak dashboard. These nodes manage your authentication state and ensure that your registry session remains active.",
    icon: Lock,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20"
  },
  {
    title: "Forensic Performance Nodes",
    desc: "Used for internal system auditing. These allow us to monitor AI response times and detect dashboard latency without identifying individuals.",
    icon: Cpu,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20"
  },
  {
    title: "Preference Memory Nodes",
    desc: "Enhances localized experience by remembering choice of language (e.g., Hindi, English) and theme configuration across browser restarts.",
    icon: Settings,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20"
  },
  {
    title: "Security Validation Nodes",
    desc: "Implemented to prevent unauthorized Cross-Site Request Forgery (CSRF). These verify that actions are initiated strictly by the registered user.",
    icon: ShieldCheck,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20"
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

export default function CookiePolicyPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20 px-2 sm:px-6 text-left">
      <motion.div 
        initial={{ opacity: 0, y: -10 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 border-b border-primary/5 pb-8"
      >
        <PageHeader
          title="Cookie Protocol"
          description="Institutional transparency regarding localized data tracking and session memory nodes on nyayasahayak.in."
        />
        <Badge variant="outline" className="font-black text-[9px] uppercase tracking-widest bg-primary/5 text-primary border-primary/10 px-4 py-1.5 rounded-full">Local Memory Node</Badge>
      </motion.div>

      {/* Hero Transparency Card */}
      <motion.div variants={itemVariants} initial="hidden" animate="visible">
        <Card className="border-none ring-1 ring-primary/10 shadow-3xl rounded-[3rem] overflow-hidden bg-card/40 backdrop-blur-xl relative">
          <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none grayscale">
            <Logo className="h-64 w-64" />
          </div>
          <CardContent className="p-8 sm:p-16 relative z-10 text-left">
            <div className="flex items-center gap-3 text-primary mb-6">
              <div className="bg-primary/10 p-2.5 rounded-xl shadow-inner">
                <Info className="h-6 w-6" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Protocol Transparency</span>
            </div>
            <div className="space-y-6 max-w-4xl">
              <h2 className="text-3xl sm:text-6xl font-black tracking-tighter leading-[0.9] uppercase text-foreground">
                Minimalist Tracking for <br />
                <span className="text-primary italic">Maximum Integrity.</span>
              </h2>
              <p className="text-sm sm:text-xl text-muted-foreground font-medium leading-relaxed">
                Nyaya Sahayak utilizes minimalist cookie technology strictly to facilitate secure registry sessions and remember your localized preferences. We do <span className="text-foreground font-bold">NOT</span> utilize third-party advertising trackers or sell your behavioral data nodes.
              </p>
            </div>
          </CardContent>
          <div className="h-2 w-full bg-gradient-to-r from-primary via-accent to-blue-400"></div>
        </Card>
      </motion.div>

      {/* Detailed Node Grid */}
      <div className="grid gap-6 sm:grid-cols-2">
        {cookieNodes.map((node, idx) => (
          <motion.div key={idx} variants={itemVariants} initial="hidden" animate="visible">
            <Card className={`h-full border-none ring-1 ${node.border} bg-card/30 hover:bg-card/50 transition-all duration-500 group rounded-[2.5rem] shadow-lg`}>
              <CardContent className="p-8 space-y-6 text-left">
                <div className={`${node.bg} p-4 rounded-2xl w-fit transition-transform group-hover:scale-110 duration-500 shadow-xl`}>
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

      {/* Node Management Section */}
      <motion.div variants={itemVariants} initial="hidden" animate="visible">
        <Card className="border-primary/5 shadow-2xl rounded-[2.5rem] bg-muted/30 overflow-hidden">
          <CardHeader className="bg-primary/5 border-b border-primary/5 p-8 text-left">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-white shadow-xl border border-primary/10 text-primary">
                <MousePointer2 className="h-6 w-6" />
              </div>
              <CardTitle className="text-2xl font-black tracking-tight leading-none uppercase">User Authority</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-8 sm:p-12 space-y-8 text-left">
            <p className="text-sm sm:text-base text-muted-foreground font-medium leading-relaxed">
              Users of nyayasahayak.in maintain sovereign authority over their security settings. You may deactivate non-essential cookie protocols via your browser console. 
            </p>
            <div className="bg-destructive/5 border border-destructive/20 rounded-[1.5rem] p-6 flex gap-5 items-start shadow-inner">
              <div className="p-3 rounded-xl bg-destructive/10">
                <Lock className="h-6 w-6 text-destructive shrink-0" />
              </div>
              <p className="text-[11px] sm:text-xs font-black text-destructive/80 leading-relaxed uppercase tracking-tighter">
                WARNING: Deactivating "Essential Registry Nodes" will terminate your secure session and may result in the deactivation of dashboard tools.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="text-center pt-8 opacity-30">
          <p className="text-[9px] font-black uppercase tracking-[0.6em] text-muted-foreground">NYAYASAHAYAK.IN // MEMORY PROTOCOL // <History className="inline h-3 w-3" /> 2024</p>
      </div>
    </div>
  );
}
