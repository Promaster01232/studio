"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  FileText, 
  ShieldCheck, 
  AlertTriangle, 
  Scale, 
  Mail, 
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

const termSections = [
  {
    title: "1. Acceptance of Protocol",
    icon: ShieldCheck,
    content: "By accessing the Nyaya Sahayak digital node at nyayasahayak.in, you explicitly agree to be bound by these Terms of Service. If you do not accept every clause of this institutional agreement, you must immediately terminate your registry session and disconnect from all dashboard modules."
  },
  {
    title: "2. The AI Intelligence Mandate",
    icon: Bot,
    content: "Nyaya Sahayak utilizes probabilistic AI nodes to provide forensic legal intelligence. You acknowledge that AI outputs—including case summaries, document drafts, and strength assessments—are generated via neural processing and do not constitute 'Legal Advice' as defined by statutory regulations. All outputs are for informational and navigational purposes only."
  },
  {
    title: "3. Human Review Requirement",
    icon: Gavel,
    content: "CRITICAL: Any legal document generated via nyayasahayak.in (including Legal Notices, FIR Applications, or Bonds) must be reviewed, edited, and finalized by a qualified human advocate before service or filing in any judicial complex. Reliance on raw AI output for official filing is strictly prohibited."
  },
  {
    title: "4. Registry Identity & Security",
    icon: Fingerprint,
    content: "Users must provide 100% authentic data during the Citizen Registry enrollment. Submission of fraudulent Bar IDs, false contact details, or deceptive narrations will trigger an immediate and permanent Node Deactivation on nyayasahayak.in. You are solely responsible for maintaining the security of your authentication registry."
  },
  {
    title: "5. Lawyer Connect Ecosystem",
    icon: Globe,
    content: "The Advocate Registry is a directory of independent legal professionals. Nyaya Sahayak facilitates connection nodes but does not employ or endorse specific advocates. Any attorney-client relationship formed via this hub is strictly between the user and the professional; nyayasahayak.in is not a party to such agreements."
  },
  {
    title: "6. Forensic Data Usage",
    icon: Lock,
    content: "Your data is processed according to our Privacy Protocol. We utilize AES-256 encryption for data at rest. You maintain sovereign authority over your data nodes, including the right to trigger a 'Registry Purge' to permanently erase all associated case logs and document history from nyayasahayak.in."
  },
  {
    title: "7. Prohibited Node Activities",
    icon: Ban,
    content: "Users are prohibited from: (a) Attempting to reverse-engineer AI logic; (b) Submitting malicious code to the registry; (c) Using the 'Narrate' tool to harass or defame individuals; (d) Automating data extraction from the eCourts search node via unauthorized bots on nyayasahayak.in."
  },
  {
    title: "8. Limitation of Institutional Liability",
    icon: Scale,
    content: "IdeaSpark and the Nyaya Sahayak institutional nodes are not liable for any direct or indirect damages resulting from the use of this platform. This includes, but is not limited to, legal outcomes, lost data, or errors in judicial procedure navigation provided by the AI assistant at nyayasahayak.in."
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
    <div className="max-w-5xl mx-auto space-y-10 pb-20 px-2 sm:px-6 text-left">
      <motion.div 
        initial={{ opacity: 0, y: -10 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <PageHeader
          title="Institutional Terms of Service"
          description="Official protocols governing the usage of Nyaya Sahayak digital nodes on nyayasahayak.in."
        />
      </motion.div>

      {/* Main Terms Container */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-10"
      >
        <Card className="border-primary/10 shadow-2xl rounded-[2.5rem] overflow-hidden bg-card/40 backdrop-blur-md border-none ring-1 ring-primary/10">
          <CardHeader className="bg-primary/5 border-b border-primary/5 p-8 sm:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-[0.02]">
                <Cpu className="h-40 w-40" />
            </div>
            <div className="flex items-center gap-5 relative z-10 text-left">
              <div className="bg-primary/10 p-4 rounded-[1.5rem] shrink-0 shadow-inner ring-1 ring-primary/20">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <div className="text-left min-w-0">
                <CardTitle className="text-2xl sm:text-4xl font-black tracking-tighter truncate leading-tight">System Access Agreement</CardTitle>
                <CardDescription className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 flex items-center gap-2">
                    <Zap className="h-3 w-3" /> Version 4.2.0-Forensic // March 2024
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 sm:p-12 space-y-12">
            
            {/* Warning Callout */}
            <motion.div 
              variants={itemVariants}
              className="bg-destructive/5 border border-destructive/20 rounded-[2rem] p-6 sm:p-8 flex gap-5 items-start text-left shadow-inner"
            >
              <div className="p-3 rounded-2xl bg-destructive/10">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <p className="text-xs sm:text-base font-bold text-destructive/80 leading-relaxed">
                NOTICE: Nyaya Sahayak is an AI-driven legal intelligence platform. It does NOT provide official legal advice. Every document generated on nyayasahayak.in MUST be reviewed, edited, and finalized by a qualified human advocate.
              </p>
            </motion.div>

            <div className="grid gap-10">
              {termSections.map((section, index) => (
                <motion.div key={index} variants={itemVariants} className="flex gap-6 group text-left">
                  <div className="bg-muted/50 p-4 h-14 w-14 rounded-[1.2rem] flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm border border-primary/5 ring-1 ring-primary/5">
                    <section.icon className="h-6 w-6" />
                  </div>
                  <div className="space-y-2 flex-1 text-left">
                    <h4 className="font-black text-lg sm:text-xl tracking-tight group-hover:text-primary transition-colors">{section.title}</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed">
                      {section.content}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
          <div className="h-1.5 w-full bg-gradient-to-r from-primary via-accent to-blue-400"></div>
        </Card>

        {/* Footer Acknowledgement */}
        <motion.div variants={itemVariants} className="text-center space-y-4 pt-4 px-4">
          <div className="flex items-center justify-center gap-2 text-muted-foreground/40 font-black uppercase tracking-[0.2em] text-[9px] sm:text-[10px]">
            <History className="h-3 w-3" /> Agreement Persistence: Active
          </div>
          <p className="text-[9px] sm:text-[11px] text-muted-foreground/60 font-medium max-w-2xl mx-auto leading-relaxed italic">
            "By utilizing the nyayasahayak.in dashboard, you confirm your understanding that judicial proceedings are inherently complex and that AI intelligence serves as a supplementary navigational node, not a final procedural authority."
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
