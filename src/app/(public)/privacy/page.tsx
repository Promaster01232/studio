"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ShieldCheck, 
  Lock, 
  EyeOff, 
  Key, 
  Database, 
  Cpu, 
  UserCheck, 
  Activity, 
  Fingerprint,
  Mic,
  FileText,
  Zap,
  Info
} from "lucide-react";
import { motion } from "framer-motion";

const policySections = [
  {
    title: "Data Collection Nodes",
    desc: "At nyayasahayak.in, we capture specific forensic inputs to fuel our AI nodes. This includes your voice narrations (processed as transient audio), legal documents (analyzed via secure OCR), and registry identity data (email and mobile number).",
    icon: Database,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20"
  },
  {
    title: "AI Processing Logic",
    desc: "Your data is utilized strictly for real-time forensic analysis. Nyaya Sahayak does NOT use your personal legal documents or private narrations to train global LLM models. Every analysis session is isolated and stateless.",
    icon: Cpu,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20"
  },
  {
    title: "Encryption Standards",
    desc: "All traffic on nyayasahayak.in is tunneled through TLS 1.3 protocol. Sensitive data nodes, including your personal 'My Cases' tracker, are encrypted at rest using industry-standard AES-256 algorithms within our institutional vault.",
    icon: Lock,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20"
  },
  {
    title: "Registry Transparency",
    desc: "Your identity remains galled from public view. Only when you explicitly initiate a 'Connect' request with a verified advocate is your contact dossier shared. We maintain a zero-knowledge policy for unauthorized third parties.",
    icon: EyeOff,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20"
  },
  {
    title: "User Sovereignty",
    desc: "You maintain absolute authority over your digital footprint. The 'Registry Purge' node in your profile settings allows for the instant, permanent deletion of all associated documents, summaries, and chat logs from our ecosystem.",
    icon: Key,
    color: "text-rose-500",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20"
  },
  {
    title: "Forensic Integrity",
    desc: "We utilize multi-stage identity audits to ensure all users in our Advocate Registry are legitimate legal professionals. This ensures the integrity of the institutional connection nodes on nyayasahayak.in.",
    icon: ShieldCheck,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/20"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    },
  },
};

export default function PrivacyPage() {
  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-5xl mx-auto space-y-12 pb-20 px-4 sm:px-6 text-left"
    >
      <motion.div variants={itemVariants}>
        <PageHeader
          title="Privacy & Security Protocol"
          description="Institutional commitment to data sovereignty, forensic security, and zero-trust architecture at nyayasahayak.in."
        />
      </motion.div>

      {/* Hero Security Card */}
      <motion.div variants={itemVariants}>
        <Card className="border-none ring-1 ring-primary/10 shadow-2xl rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-card/80 to-background/40 backdrop-blur-xl relative">
          <div className="absolute top-0 right-0 p-12 opacity-[0.03]">
            <ShieldCheck className="h-64 w-64" />
          </div>
          <CardContent className="p-8 sm:p-16 relative z-10">
            <div className="flex items-center gap-3 text-primary mb-6">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Fingerprint className="h-6 w-6" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Institutional Grade Security</span>
            </div>
            <div className="space-y-6 max-w-3xl">
              <h2 className="text-3xl sm:text-6xl font-black tracking-tighter leading-none">
                Your Data is Your <span className="text-primary italic">Sovereign Asset.</span>
              </h2>
              <p className="text-sm sm:text-xl text-muted-foreground font-medium leading-relaxed">
                Nyaya Sahayak operates on a <span className="text-foreground font-bold">Zero-Sale Commitment.</span> Unlike traditional platforms, we do not monetize user data. Our revenue nodes are driven by institutional efficiency, ensuring your legal narratives remain confidential.
              </p>
              <div className="flex flex-wrap gap-4 pt-6">
                <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-green-500/5 border border-green-500/10 shadow-inner">
                  <Activity className="h-4 w-4 text-green-600 animate-pulse" />
                  <span className="text-[10px] font-black uppercase text-green-600 tracking-widest">TLS 1.3 Active</span>
                </div>
                <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-blue-500/5 border border-blue-500/10 shadow-inner">
                  <Zap className="h-4 w-4 text-blue-600" />
                  <span className="text-[10px] font-black uppercase text-blue-600 tracking-widest">AES-256 REST</span>
                </div>
                <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-purple-500/5 border border-purple-500/10 shadow-inner">
                  <UserCheck className="h-4 w-4 text-purple-600" />
                  <span className="text-[10px] font-black uppercase text-purple-600 tracking-widest">Isolated Nodes</span>
                </div>
              </div>
            </div>
          </CardContent>
          <div className="h-1.5 w-full bg-gradient-to-r from-primary via-accent to-blue-400"></div>
        </Card>
      </motion.div>

      {/* Detailed Policy Nodes */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {policySections.map((section, idx) => (
          <motion.div key={idx} variants={itemVariants}>
            <Card className={`h-full border-none ring-1 ${section.border} bg-card/30 hover:bg-card/50 transition-all duration-500 group rounded-[2rem] shadow-lg`}>
              <CardContent className="p-8 space-y-5 text-left">
                <div className={`${section.bg} p-4 rounded-2xl w-fit transition-transform group-hover:scale-110 duration-500 shadow-inner`}>
                  <section.icon className={`h-6 w-6 ${section.color}`} />
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-black tracking-tight">{section.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                    {section.desc}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Compliance Mandate */}
      <motion.div variants={itemVariants} className="pt-12 border-t border-primary/5">
        <Card className="border-none bg-muted/30 rounded-[2rem] overflow-hidden">
            <CardContent className="p-8 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                <div className="p-4 rounded-[1.5rem] bg-background shadow-xl border border-primary/5">
                    <ShieldCheck className="h-12 w-12 text-primary" />
                </div>
                <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-center md:justify-start gap-2 text-primary mb-1">
                        <Info className="h-4 w-4" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Compliance Protocol</span>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed">
                        This Privacy Protocol is engineered to comply with global digital safety standards and regional data protection acts, including the Digital Personal Data Protection Act (DPDP), 2023. By utilizing nyayasahayak.in nodes, you acknowledge and consent to the forensic processing logic described herein.
                    </p>
                </div>
            </CardContent>
        </Card>
      </motion.div>

      <div className="text-center pt-8 opacity-30">
          <p className="text-[9px] font-black uppercase tracking-[0.6em] text-muted-foreground">NYAYASAHAYAK.IN // PRIVACY PROTOCOL NS-PRIV-001</p>
      </div>
    </motion.div>
  );
}
