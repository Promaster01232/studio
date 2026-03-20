
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
  Mail
} from "lucide-react";
import { motion } from "framer-motion";

const cookieNodes = [
  {
    title: "Essential Registry Nodes",
    desc: "Critical for the secure operation of the Nyaya Sahayak dashboard. These nodes manage your authentication state and ensure that your registry session remains active during navigation.",
    icon: Lock,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20"
  },
  {
    title: "Forensic Performance Nodes",
    desc: "Used strictly for internal system auditing. These allow us to monitor AI response times, detect dashboard latency, and optimize node processing speeds without identifying individuals.",
    icon: Cpu,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20"
  },
  {
    title: "Preference Memory Nodes",
    desc: "Enhances your localized experience by remembering your choice of language (e.g., Hindi, English) and your dark mode/light mode theme configuration across browser restarts.",
    icon: Settings,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20"
  },
  {
    title: "Security Validation Nodes",
    desc: "Implemented to prevent unauthorized Cross-Site Request Forgery (CSRF). These nodes verify that actions within the dashboard are initiated strictly by the registered user.",
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
    <div className="max-w-5xl mx-auto space-y-8 sm:space-y-12 pb-20 px-4">
      <motion.div 
        initial={{ opacity: 0, y: -10 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <PageHeader
          title="Cookie Protocol"
          description="Institutional transparency regarding localized data tracking and session memory nodes."
        />
      </motion.div>

      {/* Hero Transparency Card */}
      <motion.div variants={itemVariants} initial="hidden" animate="visible">
        <Card className="border-none ring-1 ring-primary/10 shadow-2xl rounded-3xl overflow-hidden bg-card/40 backdrop-blur-xl">
          <div className="absolute top-0 right-0 p-12 opacity-[0.03]">
            <Cookie className="h-64 w-64" />
          </div>
          <CardContent className="p-6 sm:p-12 relative z-10 text-left">
            <div className="flex items-center gap-3 text-primary mb-6">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Info className="h-6 w-6" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Protocol Transparency</span>
            </div>
            <div className="space-y-6 max-w-3xl">
              <h2 className="text-3xl sm:text-5xl font-black tracking-tighter leading-none">
                Minimalist Tracking for <span className="text-primary italic">Maximum Integrity.</span>
              </h2>
              <p className="text-sm sm:text-lg text-muted-foreground font-medium leading-relaxed">
                Nyaya Sahayak utilizes minimalist cookie technology strictly to facilitate secure registry sessions and remember your localized dashboard preferences. We do <span className="text-foreground font-bold">NOT</span> utilize third-party advertising trackers or sell your behavioral data nodes.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Detailed Node Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-6 sm:grid-cols-2"
      >
        {cookieNodes.map((node, idx) => (
          <motion.div key={idx} variants={itemVariants}>
            <Card className={`h-full border-none ring-1 ${node.border} bg-card/30 hover:bg-card/50 transition-all duration-500 group rounded-2xl`}>
              <CardContent className="p-6 space-y-4 text-left">
                <div className={`${node.bg} p-3 rounded-xl w-fit transition-transform group-hover:scale-110 duration-500`}>
                  <node.icon className={`h-6 w-6 ${node.color}`} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-black tracking-tight">{node.title}</h3>
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
        <Card className="border-primary/5 shadow-xl rounded-2xl bg-muted/30 overflow-hidden">
          <CardHeader className="bg-primary/5 border-b border-primary/5 p-6 sm:p-8 text-left">
            <div className="flex items-center gap-3">
              <MousePointer2 className="h-5 w-5 text-primary" />
              <CardTitle className="text-xl font-black tracking-tight">User Authority over Nodes</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6 sm:p-10 space-y-6 text-left">
            <p className="text-sm text-muted-foreground font-medium leading-relaxed">
              Users maintain sovereign authority over their browser's security settings. You may deactivate any non-essential cookie nodes via your browser's "Privacy & Security" console. 
            </p>
            <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-4 flex gap-3 items-start">
              <Lock className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <p className="text-[10px] sm:text-xs font-bold text-destructive/80 leading-relaxed">
                WARNING: Deactivating "Essential Registry Nodes" will terminate your secure session and may result in the deactivation of dashboard tools like document generation and case tracking.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
