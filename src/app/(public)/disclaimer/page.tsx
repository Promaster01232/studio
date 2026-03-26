
"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  AlertTriangle, 
  Gavel, 
  Scale, 
  Info, 
  ShieldAlert, 
  BrainCircuit, 
  Landmark, 
  Users, 
  History, 
  Fingerprint, 
  Mail,
  Zap,
  Cpu
} from "lucide-react";
import { motion } from "framer-motion";

const disclaimerNodes = [
  {
    title: "AI Probabilistic Nature",
    desc: "Our dashboard on nyayasahayak.in utilizes probabilistic LLM nodes. While optimized for forensic accuracy, outputs—including case summaries and document drafts—are generated via neural processing and may contain hallucinated sections or outdated legal citations.",
    icon: BrainCircuit,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20"
  },
  {
    title: "No Attorney-Client Registry",
    desc: "Utilization of nyayasahayak.in tools does NOT create an attorney-client relationship. The information provided is for navigational and educational purposes only. Direct advice is only available through our Verified Advocate Registry.",
    icon: Users,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20"
  },
  {
    title: "Jurisdictional Limitations",
    desc: "The platform's intelligence nodes are primarily trained on the Indian Judicial System. Use of nyayasahayak.in for legal matters in foreign jurisdictions is not recommended and is done at the user's sole risk.",
    icon: Landmark,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20"
  },
  {
    title: "Institutional Immunity",
    desc: "IdeaSpark and nyayasahayak.in are not liable for any legal outcomes, financial losses, or procedural failures resulting from reliance on AI-generated data. Users are responsible for all official filings and legal strategies.",
    icon: ShieldAlert,
    color: "text-destructive",
    bg: "bg-destructive/10",
    border: "border-destructive/20"
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

export default function DisclaimerPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20 px-4 text-left">
      <motion.div 
        initial={{ opacity: 0, y: -10 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <PageHeader
          title="Legal Disclaimer & AI Mandate"
          description="Mandatory institutional disclosure regarding AI intelligence and human advocacy at nyayasahayak.in."
        />
      </motion.div>

      {/* Primary Critical Cards */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-8 sm:grid-cols-2"
      >
        <motion.div variants={itemVariants}>
          <Card className="border-none ring-1 ring-destructive/20 bg-destructive/5 rounded-[2.5rem] overflow-hidden shadow-2xl h-full relative">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                <ShieldAlert className="h-32 w-32" />
            </div>
            <CardContent className="p-8 sm:p-10 space-y-5 text-left relative z-10">
              <div className="flex items-center gap-4 text-destructive">
                <div className="bg-destructive/10 p-3 rounded-2xl shadow-inner">
                  <Gavel className="h-7 w-7" />
                </div>
                <h3 className="font-black uppercase tracking-tighter text-lg leading-none">Non-Official Node</h3>
              </div>
              <p className="text-xs sm:text-base font-bold leading-relaxed text-destructive/80">
                The AI Nyaya Mitra Assistant at nyayasahayak.in is <span className="underline decoration-2 underline-offset-4">NOT</span> a law firm or a government entity. We do not provide official legal advice, only AI-driven forensic intelligence and procedural roadmaps.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border-none ring-1 ring-amber-500/20 bg-amber-500/5 rounded-[2.5rem] overflow-hidden shadow-2xl h-full relative">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                <Zap className="h-32 w-32" />
            </div>
            <CardContent className="p-8 sm:p-10 space-y-5 text-left relative z-10">
              <div className="flex items-center gap-4 text-amber-600">
                <div className="bg-amber-500/10 p-3 rounded-2xl shadow-inner">
                  <Scale className="h-7 w-7" />
                </div>
                <h3 className="font-black uppercase tracking-tighter text-lg leading-none">The Human Mandate</h3>
              </div>
              <p className="text-xs sm:text-base font-bold leading-relaxed text-amber-600/80">
                All documents generated by AI nodes on nyayasahayak.in <span className="underline decoration-2 underline-offset-4">MUST</span> be reviewed, edited, and finalized by a qualified human advocate before service or filing in any official court of law.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Detail Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-6 sm:grid-cols-2"
      >
        {disclaimerNodes.map((node, idx) => (
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

      {/* Full Disclosure Body */}
      <motion.div variants={itemVariants} initial="hidden" animate="visible">
        <Card className="border-none ring-1 ring-primary/10 shadow-2xl rounded-[2.5rem] overflow-hidden bg-card/40 backdrop-blur-xl relative">
          <div className="absolute top-0 right-0 p-16 opacity-[0.02]">
            <Fingerprint className="h-64 w-64" />
          </div>
          <CardHeader className="p-8 sm:p-12 pb-0 border-none text-left">
            <div className="flex items-center gap-3 text-primary mb-4">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Info className="h-6 w-6" />
              </div>
              <CardTitle className="text-2xl sm:text-4xl font-black tracking-tight leading-none">Full Disclosure Agreement</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-8 sm:p-12 pt-6 space-y-8 text-left relative z-10">
            <div className="space-y-8 text-sm sm:text-base text-muted-foreground font-medium leading-relaxed max-w-4xl">
              <p>
                By utilizing any dashboard modules on nyayasahayak.in, you acknowledge that the system operates on probabilistic AI nodes. Our mission is to democratize legal information, not to replace the nuanced strategy required for complex litigation. While we strive for 100% forensic accuracy, discrepancies in relevant laws, sections, or procedural timelines may occur due to the dynamic nature of judicial amendments.
              </p>
              <p>
                Nyaya Sahayak institutional nodes serve as <span className="font-bold text-foreground">navigational facilitators.</span> We highly recommend connecting with our <span className="font-bold text-primary italic">Verified Advocate Registry</span> for personalized consultations. Only a human professional can provide the empathy and strategic foresight required to navigate the intricacies of the law.
              </p>
            </div>
            <div className="pt-10 border-t border-primary/5 flex flex-col sm:flex-row items-center justify-between gap-8">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Institutional ID</p>
                  <p className="text-xs font-bold text-primary font-mono">NS-NODE-ALPHA // SECURE REGISTRY CLEARANCE ACTIVE</p>
                </div>
                <div className="flex items-center gap-2 text-primary font-black text-xs">
                  <Mail className="h-4 w-4" />
                  nyayasahayakhelp@gmail.com
                </div>
            </div>
          </CardContent>
          <div className="h-1.5 w-full bg-gradient-to-r from-primary via-accent to-blue-400"></div>
        </Card>
      </motion.div>

      {/* Persistence Acknowledgment */}
      <motion.div variants={itemVariants} initial="hidden" animate="visible" className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 text-muted-foreground/40 font-black uppercase tracking-[0.2em] text-[9px] sm:text-[10px]">
          <History className="h-3 w-3" /> Agreement Persistence: Active
        </div>
        <p className="text-[9px] sm:text-[11px] text-muted-foreground/60 font-medium max-w-2xl mx-auto leading-relaxed italic px-4">
          "By accessing nyayasahayak.in, you explicitly waive any claims against the developers regarding the performance of AI nodes. Accuracy verification rests entirely with the user and their authorized legal counsel."
        </p>
      </motion.div>
    </div>
  );
}
