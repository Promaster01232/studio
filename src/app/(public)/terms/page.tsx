"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  FileText, 
  ShieldCheck, 
  AlertTriangle, 
  Scale, 
  History, 
  Fingerprint, 
  Gavel, 
  Bot, 
  Globe,
  Ban,
  Lock,
  Cpu,
  Zap
} from "lucide-react";
import { motion } from "framer-motion";
import { Logo } from "@/components/logo";
import { Badge } from "@/components/ui/badge";

const termSections = [
  {
    title: "1. Acceptance of Protocol",
    icon: ShieldCheck,
    content: "By accessing the Nyaya Sahayak node at nyayasahayak.in, you agree to be bound by these Terms of Service. Failure to accept every clause requires immediate termination of your session and disconnection from all terminals."
  },
  {
    title: "2. The AI Intelligence Mandate",
    icon: Bot,
    content: "Nyaya Sahayak utilizes probabilistic AI nodes. AI outputs—including case summaries and document drafts—are generated via neural processing and do not constitute 'Legal Advice' as defined by statutory regulations."
  },
  {
    title: "3. Human Review Requirement",
    icon: Gavel,
    content: "CRITICAL: Any legal document generated via nyayasahayak.in must be reviewed, edited, and finalized by a qualified human advocate before filing. Reliance on raw AI output for official filing is strictly prohibited."
  },
  {
    title: "4. Registry Identity & Security",
    icon: Fingerprint,
    content: "Users must provide 100% authentic data during enrollment. Submission of fraudulent Bar IDs or deceptive narrations will trigger immediate Node Deactivation. You are responsible for your authentication registry."
  },
  {
    title: "5. Lawyer Connect Ecosystem",
    icon: Globe,
    content: "The Advocate Registry is a directory of independent professionals. Nyaya Sahayak facilitates connection nodes but does not employ specific advocates. Attorney-client relationships are strictly private."
  },
  {
    title: "6. Forensic Data Usage",
    icon: Lock,
    content: "Your data is processed according to our Privacy Protocol using AES-256 encryption. You maintain sovereign authority over your data, including the right to trigger a 'Registry Purge' at any time."
  },
  {
    title: "7. Prohibited Node Activities",
    icon: Ban,
    content: "Users are prohibited from reverse-engineering AI logic, submitting malicious code, or automating data extraction via unauthorized bots on the nyayasahayak.in dashboard."
  },
  {
    title: "8. Limitation of Liability",
    icon: Scale,
    content: "IdeaSpark and Nyaya Sahayak nodes are not liable for any damages resulting from platform use, including legal outcomes, lost data, or errors in judicial procedure navigation."
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
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

export default function TermsPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20 px-4 sm:px-6 text-left">
      <motion.div 
        initial={{ opacity: 0, y: -10 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 border-b border-primary/5 pb-8"
      >
        <PageHeader
          title="Institutional Terms of Service"
          description="Official protocols governing the usage of Nyaya Sahayak digital nodes on nyayasahayak.in."
        />
        <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-black text-[9px] uppercase tracking-widest bg-primary/5 text-primary border-primary/10 px-4 py-1.5 rounded-full">System Access Agreement</Badge>
        </div>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-10"
      >
        <Card className="border-primary/10 shadow-3xl rounded-[3rem] overflow-hidden bg-card/40 backdrop-blur-md relative">
          <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none grayscale">
              <Logo className="h-64 w-64" />
          </div>
          
          <CardHeader className="bg-primary/5 border-b border-primary/5 p-8 sm:p-12 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10 text-center sm:text-left">
              <div className="bg-primary p-5 rounded-[1.5rem] shrink-0 shadow-2xl shadow-primary/20 ring-4 ring-white/10">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <div className="space-y-1">
                <CardTitle className="text-3xl sm:text-5xl font-black tracking-tighter uppercase leading-tight">Access Protocol</CardTitle>
                <CardDescription className="text-[10px] font-black uppercase tracking-[0.3em] text-primary flex items-center justify-center sm:justify-start gap-2">
                    <Zap className="h-3.5 w-3.5 animate-pulse" /> Version 4.2.0-Forensic // March 2024
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-8 sm:p-16 space-y-16">
            
            {/* Warning Callout */}
            <motion.div 
              variants={itemVariants}
              className="bg-destructive/5 border border-destructive/20 rounded-[2.5rem] p-8 sm:p-10 flex flex-col sm:flex-row gap-6 items-start text-left shadow-inner relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-[0.05]">
                <ShieldCheck className="h-20 w-20 text-destructive" />
              </div>
              <div className="p-4 rounded-2xl bg-destructive/10 shrink-0">
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
              <p className="text-sm sm:text-lg font-black text-destructive/80 leading-relaxed uppercase tracking-tight">
                Nyaya Sahayak is an AI legal intelligence platform. It does NOT provide official legal advice. Every document generated MUST be reviewed by a human advocate.
              </p>
            </motion.div>

            <div className="grid gap-12 sm:grid-cols-2">
              {termSections.map((section, index) => (
                <motion.div key={index} variants={itemVariants} className="flex gap-6 group text-left">
                  <div className="bg-muted/50 p-4 h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-inner border border-primary/5">
                    <section.icon className="h-6 w-6" />
                  </div>
                  <div className="space-y-3 flex-1 text-left">
                    <h4 className="font-black text-xl tracking-tight group-hover:text-primary transition-colors uppercase">{section.title}</h4>
                    <p className="text-[11px] sm:text-xs text-muted-foreground font-medium leading-relaxed">
                      {section.content}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
          <div className="h-2 w-full bg-gradient-to-r from-primary via-accent to-blue-400"></div>
        </Card>

        {/* Footer Acknowledgement */}
        <motion.div variants={itemVariants} className="text-center space-y-4 pt-4 px-4">
          <div className="flex items-center justify-center gap-2 text-muted-foreground/40 font-black uppercase tracking-[0.2em] text-[10px]">
            <History className="h-3 w-3" /> Agreement Persistence: Active
          </div>
          <p className="text-[10px] sm:text-xs text-muted-foreground/60 font-bold max-w-3xl mx-auto leading-relaxed italic uppercase tracking-tighter">
            "By utilizing the nyayasahayak.in dashboard, you confirm your understanding that judicial proceedings are inherently complex and that AI serves as a navigational node, not a final procedural authority."
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}