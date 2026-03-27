
"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Cookie, 
  ShieldCheck, 
  Settings, 
  Lock, 
  Cpu, 
  MousePointer2, 
  History,
  Info,
  Mail,
  Zap,
  Activity
} from "lucide-react";
import { motion } from "framer-motion";

const cookieNodes = [
  {
    title: "Essential Registry",
    desc: "Critical for the secure operation of the nyayasahayak.in dashboard. These manage your authentication state and ensure that your registry session remains active during navigation.",
    icon: Lock,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20"
  },
  {
    title: "Forensic Performance",
    desc: "Used strictly for internal system auditing on nyayasahayak.in. These allow us to monitor AI response times, detect dashboard latency, and optimize processing speeds without identifying individuals.",
    icon: Activity,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20"
  },
  {
    title: "Preference Memory",
    desc: "Enhances your localized experience by remembering your choice of language (e.g., Hindi, English) and your dark mode/light mode theme configuration across browser restarts.",
    icon: Settings,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20"
  },
  {
    title: "Security Validation",
    desc: "Implemented to prevent unauthorized Cross-Site Request Forgery (CSRF). These verify that actions within the nyayasahayak.in dashboard are initiated strictly by the registered user.",
    icon: ShieldCheck,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

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
    <div className="max-w-5xl mx-auto space-y-10 pb-20 px-4 text-left">
      <motion.div 
        initial={{ opacity: 0, y: -10 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <PageHeader
          title="Cookie Usage Protocol"
          description="Institutional transparency regarding localized data tracking and session memory at nyayasahayak.in."
        />
      </motion.div>

      {/* Hero Transparency Card */}
      <motion.div variants={itemVariants} initial="hidden" animate="visible">
        <Card className="border-none ring-1 ring-primary/10 shadow-2xl rounded-[2.5rem] overflow-hidden bg-card/40 backdrop-blur-xl relative">
          <div className="absolute top-0 right-0 p-16 opacity-[0.03]">
            <Cookie className="h-64 w-64" />
          </div>
          <CardContent className="p-8 sm:p-16 relative z-10 text-left">
            <div className="flex items-center gap-3 text-primary mb-6">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Info className="h-6 w-6" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Protocol Transparency</span>
            </div>
            <div className="space-y-6 max-w-3xl">
              <h2 className="text-3xl sm:text-6xl font-black tracking-tighter leading-none">
                Minimalist Tracking for <span className="text-primary italic">Maximum Integrity.</span>
              </h2>
              <p className="text-sm sm:text-xl text-muted-foreground font-medium leading-relaxed">
                Nyaya Sahayak utilizes minimalist cookie technology strictly to facilitate secure registry sessions and remember your localized dashboard preferences. We do <span className="text-foreground font-bold">NOT</span> utilize third-party advertising trackers or sell your behavioral data at nyayasahayak.in.
              </p>
            </div>
          </CardContent>
          <div className="h-1.5 w-full bg-gradient-to-r from-primary via-accent to-blue-400"></div>
        </Card>
      </motion.div>

      {/* Detailed Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-6 sm:grid-cols-2"
      >
        {cookieNodes.map((node, idx) => (
          <motion.div key={idx} variants={itemVariants}>
            <Card className={`h-full border-none ring-1 ${node.border} bg-card/30 hover:bg-card/50 transition-all duration-500 group rounded-[2rem] shadow-lg`}>
              <CardContent className="p-8 space-y-5 text-left">
                <div className={`${node.bg} p-4 rounded-2xl w-fit transition-transform group-hover:scale-110 duration-500 shadow-inner`}>
                  <node.icon className={`h-6 w-6 ${node.color}`} />
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-black tracking-tight">{node.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                    {node.desc}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Node Management Section */}
      <motion.div variants={itemVariants} initial="hidden" animate="visible">
        <Card className="border-primary/5 shadow-2xl rounded-[2rem] bg-muted/30 overflow-hidden border">
          <CardHeader className="bg-primary/5 border-b border-primary/5 p-8 text-left">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-white shadow-sm border border-primary/5 text-primary">
                <MousePointer2 className="h-6 w-6" />
              </div>
              <CardTitle className="text-2xl font-black tracking-tight leading-none">User Authority</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-8 sm:p-12 space-y-8 text-left">
            <p className="text-sm sm:text-base text-muted-foreground font-medium leading-relaxed">
              Users of nyayasahayak.in maintain sovereign authority over their browser's security settings. You may deactivate any non-essential cookie protocols via your browser's "Privacy & Security" console. 
            </p>
            <div className="bg-destructive/5 border border-destructive/20 rounded-2xl p-6 flex gap-5 items-start shadow-inner">
              <div className="p-2.5 rounded-xl bg-destructive/10">
                <Lock className="h-6 w-6 text-destructive shrink-0" />
              </div>
              <p className="text-xs sm:text-sm font-bold text-destructive/80 leading-relaxed">
                WARNING: Deactivating "Essential Registry Protocols" will terminate your secure session on nyayasahayak.in and may result in the deactivation of dashboard tools like document generation and case tracking.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
