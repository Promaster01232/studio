
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
  FileLock, 
  UserCheck, 
  Scale, 
  Bell,
  Fingerprint,
  Mic,
  FileText
} from "lucide-react";
import { motion } from "framer-motion";

const policySections = [
  {
    title: "Data Collection Nodes",
    desc: "We capture specific forensic inputs to fuel our AI nodes. This includes your voice narrations (processed as transient audio), legal documents (analyzed via secure OCR), and registry identity data (email and mobile number).",
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
    desc: "All traffic is tunneled through TLS 1.3 protocol. Sensitive data nodes, including your personal 'My Cases' tracker, are encrypted at rest using industry-standard AES-256 algorithms within our institutional vault.",
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
    desc: "You maintain absolute authority over your digital footprint. The 'Registry Purge' node in your profile settings allows for the instant, permanent deletion of all associated documents, summaries, and chat logs.",
    icon: Key,
    color: "text-rose-500",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20"
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
      className="max-w-5xl mx-auto space-y-12 pb-20 px-2 sm:px-0"
    >
      <motion.div variants={itemVariants}>
        <PageHeader
          title="Privacy Protocol"
          description="Institutional commitment to data sovereignty, forensic security, and zero-trust architecture."
        />
      </motion.div>

      {/* Hero Security Card */}
      <motion.div variants={itemVariants}>
        <Card className="border-none ring-1 ring-primary/10 shadow-2xl rounded-3xl overflow-hidden bg-gradient-to-br from-card/80 to-background/40 backdrop-blur-xl">
          <div className="absolute top-0 right-0 p-12 opacity-[0.03]">
            <ShieldCheck className="h-64 w-64" />
          </div>
          <CardContent className="p-8 sm:p-12 relative z-10">
            <div className="flex items-center gap-3 text-primary mb-6">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Fingerprint className="h-6 w-6" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Institutional Grade Security</span>
            </div>
            <div className="space-y-6 max-w-3xl">
              <h2 className="text-3xl sm:text-5xl font-black tracking-tighter leading-none">
                Your Data is Your <span className="text-primary italic">Sovereign Asset.</span>
              </h2>
              <p className="text-sm sm:text-lg text-muted-foreground font-medium leading-relaxed">
                Nyaya Sahayak operates on a <span className="text-foreground font-bold">Zero-Sale Commitment.</span> Unlike traditional platforms, we do not monetize user data. Our revenue nodes are driven by institutional efficiency, ensuring your legal narratives remain strictly confidential and cryptographically secure.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/5 border border-green-500/10">
                  <Mic className="h-4 w-4 text-green-600" />
                  <span className="text-[10px] font-black uppercase text-green-600">Audio Encrypted</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/5 border border-blue-500/10">
                  <FileText className="h-4 w-4 text-blue-600" />
                  <span className="text-[10px] font-black uppercase text-blue-600">OCR Sandboxed</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/5 border border-purple-500/10">
                  <UserCheck className="h-4 w-4 text-purple-600" />
                  <span className="text-[10px] font-black uppercase text-purple-600">Identity Galled</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Detailed Policy Nodes */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {policySections.map((section, idx) => (
          <motion.div key={idx} variants={itemVariants}>
            <Card className={`h-full border-none ring-1 ${section.border} bg-card/30 hover:bg-card/50 transition-all duration-500 group rounded-2xl`}>
              <CardContent className="p-6 space-y-4 text-left">
                <div className={`${section.bg} p-3 rounded-xl w-fit transition-transform group-hover:scale-110 duration-500`}>
                  <section.icon className={`h-6 w-6 ${section.color}`} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-black tracking-tight">{section.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                    {section.desc}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
        
        {/* Contact/Support Node */}
        <motion.div variants={itemVariants}>
          <Card className="h-full border-none ring-1 ring-primary/20 bg-primary/5 rounded-2xl flex flex-col justify-center items-center p-6 text-center group transition-all hover:bg-primary/10">
            <Bell className="h-10 w-10 text-primary mb-4 animate-bounce" />
            <h3 className="font-black text-lg tracking-tight mb-2">Policy Updates</h3>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed mb-4">
              We notify all registry nodes 30 days prior to protocol amendments.
            </p>
            <div className="h-px w-12 bg-primary/20 mb-4" />
            <p className="text-xs font-black text-primary">nyayasahayakhelp@gmail.com</p>
          </Card>
        </motion.div>
      </div>

      {/* Legal Mandate Footer */}
      <motion.div variants={itemVariants} className="pt-12 text-left border-t border-primary/5">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="space-y-4 flex-1">
            <div className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-primary" />
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Compliance Mandate</h4>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed font-medium">
              This Privacy Protocol is engineered to comply with global digital safety standards and regional data protection acts (including the Digital Personal Data Protection Act, 2023). By utilizing Nyaya Sahayak nodes, you acknowledge and consent to the forensic processing logic described herein.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 shrink-0">
            <div className="space-y-1">
              <p className="text-[9px] font-black uppercase text-muted-foreground opacity-40 tracking-widest">Version</p>
              <p className="text-xs font-bold">v4.2.0-Alpha</p>
            </div>
            <div className="space-y-1">
              <p className="text-[9px] font-black uppercase text-muted-foreground opacity-40 tracking-widest">Node ID</p>
              <p className="text-xs font-bold">NS-PRIV-SEC</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
