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
  Lock
} from "lucide-react";
import { motion } from "framer-motion";

const termSections = [
  {
    title: "1. Acceptance of Protocol",
    icon: ShieldCheck,
    content: "By accessing the Nyaya Sahayak digital node, you explicitly agree to be bound by these Terms of Service. If you do not accept every clause of this institutional agreement, you must immediately terminate your registry session and disconnect from all dashboard modules."
  },
  {
    title: "2. The AI Intelligence Mandate",
    icon: Bot,
    content: "Nyaya Sahayak utilizes probabilistic AI nodes to provide forensic legal intelligence. You acknowledge that AI outputs—including case summaries, document drafts, and strength assessments—are generated via neural processing and do not constitute 'Legal Advice' as defined by statutory regulations. All outputs are for informational and navigational purposes only."
  },
  {
    title: "3. Human Review Requirement",
    icon: Gavel,
    content: "CRITICAL: Any legal document generated via our 'Drafting Node' (including Legal Notices, FIR Applications, or Bonds) must be reviewed, edited, and finalized by a qualified human advocate before service or filing in any judicial complex. Reliance on raw AI output for official filing is strictly prohibited."
  },
  {
    title: "4. Registry Identity & Security",
    icon: Fingerprint,
    content: "Users must provide 100% authentic data during the Citizen Registry enrollment. Submission of fraudulent Bar IDs, false contact details, or deceptive narrations will trigger an immediate and permanent Node Deactivation. You are solely responsible for maintaining the security of your authentication registry."
  },
  {
    title: "5. Lawyer Connect Ecosystem",
    icon: Globe,
    content: "The Advocate Registry is a directory of independent legal professionals. Nyaya Sahayak facilitates connection nodes but does not employ or endorse specific advocates. Any attorney-client relationship formed via this hub is strictly between the user and the professional; Nyaya Sahayak is not a party to such agreements."
  },
  {
    title: "6. Forensic Data Usage",
    icon: Lock,
    content: "Your data is processed according to our Privacy Protocol. We utilize AES-256 encryption for data at rest. You maintain sovereign authority over your data nodes, including the right to trigger a 'Registry Purge' to permanently erase all associated case logs and document history."
  },
  {
    title: "7. Prohibited Node Activities",
    icon: Ban,
    content: "Users are prohibited from: (a) Attempting to reverse-engineer AI logic; (b) Submitting malicious code to the registry; (c) Using the 'Narrate' tool to harass or defame individuals; (d) Automating data extraction from the eCourts search node via unauthorized bots."
  },
  {
    title: "8. Limitation of Institutional Liability",
    icon: Scale,
    content: "IdeaSpark and the Nyaya Sahayak institutional nodes are not liable for any direct or indirect damages resulting from the use of this platform. This includes, but is not limited to, legal outcomes, lost data, or errors in judicial procedure navigation provided by the AI assistant."
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
    <div className="max-w-5xl mx-auto space-y-8 sm:space-y-10 pb-20 px-2 sm:px-0">
      <motion.div 
        initial={{ opacity: 0, y: -10 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <PageHeader
          title="Terms of Service"
          description="Official institutional protocols governing the usage of Nyaya Sahayak digital nodes."
        />
      </motion.div>

      {/* Main Terms Container */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        <Card className="border-primary/10 shadow-2xl rounded-3xl overflow-hidden bg-card/40 backdrop-blur-md border-none ring-1 ring-primary/10">
          <CardHeader className="bg-primary/5 border-b border-primary/5 p-5 sm:p-8">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-2.5 sm:p-3 rounded-2xl shrink-0">
                <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <div className="text-left min-w-0">
                <CardTitle className="text-lg sm:text-2xl font-black tracking-tight truncate">System Access Agreement</CardTitle>
                <CardDescription className="text-[9px] sm:text-xs font-bold uppercase tracking-widest opacity-60">Version 4.2.0-Forensic // March 2024</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-10 space-y-10 sm:space-y-12">
            
            {/* Warning Callout */}
            <motion.div 
              variants={itemVariants}
              className="bg-destructive/5 border border-destructive/20 rounded-2xl p-4 sm:p-6 flex gap-3 sm:gap-4 items-start text-left"
            >
              <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-destructive shrink-0 mt-0.5" />
              <p className="text-[10px] sm:text-sm font-bold text-destructive/80 leading-relaxed">
                NOTICE: Nyaya Sahayak is an AI-driven legal intelligence platform. It does NOT provide official legal advice. Every document generated here MUST be reviewed by a human professional.
              </p>
            </motion.div>

            <div className="grid gap-8 sm:grid-gap-10">
              {termSections.map((section, index) => (
                <motion.div key={index} variants={itemVariants} className="flex gap-4 sm:gap-6 group text-left">
                  <div className="bg-muted p-2.5 sm:p-3 h-10 w-10 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm border border-primary/5">
                    <section.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <div className="space-y-1 sm:space-y-2 flex-1">
                    <h4 className="font-black text-sm sm:text-lg tracking-tight group-hover:text-primary transition-colors">{section.title}</h4>
                    <p className="text-[11px] sm:text-sm text-muted-foreground font-medium leading-relaxed">
                      {section.content}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Official Contact Node */}
            <motion.div variants={itemVariants} className="pt-10 border-t border-primary/10">
              <div className="bg-primary/5 rounded-2xl p-5 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
                <div className="space-y-1">
                  <div className="flex items-center justify-center sm:justify-start gap-2 text-primary font-black uppercase tracking-widest text-[9px] sm:text-[10px]">
                    <Mail className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> Institutional Support
                  </div>
                  <h3 className="font-black text-lg sm:text-xl tracking-tight">Questions about protocols?</h3>
                  <p className="text-[11px] sm:text-xs text-muted-foreground font-medium">Our legal-tech team is available for clarification.</p>
                </div>
                <a 
                  href="mailto:nyayasahayakhelp@gmail.com" 
                  className="bg-primary text-white px-6 sm:px-8 h-11 sm:h-12 rounded-xl flex items-center justify-center font-bold text-xs sm:text-sm shadow-lg shadow-primary/20 active:scale-95 transition-all w-full sm:w-auto"
                >
                  nyayasahayakhelp@gmail.com
                </a>
              </div>
            </motion.div>
          </CardContent>
        </Card>

        {/* Footer Acknowledgement */}
        <motion.div variants={itemVariants} className="text-center space-y-4 pt-4 px-4">
          <div className="flex items-center justify-center gap-2 text-muted-foreground/40 font-black uppercase tracking-[0.2em] text-[9px] sm:text-[10px]">
            <History className="h-3 w-3" /> Agreement Persistence: Active
          </div>
          <p className="text-[9px] sm:text-[10px] text-muted-foreground/60 font-medium max-w-2xl mx-auto leading-relaxed italic">
            "By utilizing the Nyaya Sahayak dashboard, you confirm your understanding that judicial proceedings are inherently complex and that AI intelligence serves as a supplementary navigational node, not a final procedural authority."
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
