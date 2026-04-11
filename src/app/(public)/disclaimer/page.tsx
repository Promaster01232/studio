
"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Gavel, 
  Scale, 
  Info, 
  ShieldAlert, 
  BrainCircuit, 
  Landmark, 
  Users, 
  History, 
  Fingerprint, 
  Zap
} from "lucide-react";
import { motion } from "framer-motion";
import { Logo } from "@/components/logo";
import { Badge } from "@/components/ui/badge";

const disclaimerSteps = [
  {
    title: "AI Probabilistic Nature",
    desc: "Nyaya Sahayak utilizes probabilistic LLM systems. Outputs are generated via neural processing and may contain hallucinated sections or outdated legal citations. Accuracy verification rests with the user.",
    icon: BrainCircuit,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20"
  },
  {
    title: "No Attorney-Client Registry",
    desc: "Utilization of these tools does NOT create an attorney-client relationship. Information is for navigational purposes only. Direct advice is available through our Verified Advocate Registry.",
    icon: Users,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20"
  },
  {
    title: "Jurisdictional Limitations",
    desc: "Intelligence tools are primarily trained on the Indian Judicial System. Use for foreign jurisdictions is not recommended and is done at the user's sole risk.",
    icon: Landmark,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20"
  },
  {
    title: "Institutional Immunity",
    desc: "IdeaSpark and Nyaya Sahayak are not liable for legal outcomes, financial losses, or procedural failures resulting from reliance on AI data. Users are responsible for all official filings.",
    icon: ShieldAlert,
    color: "text-destructive",
    bg: "bg-destructive/10",
    border: "border-destructive/20"
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

export default function DisclaimerPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20 px-4 text-left">
      <motion.div 
        initial={{ opacity: 0, y: -10 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 border-b border-primary/5 pb-8"
      >
        <PageHeader
          title="Legal Disclaimer & AI Mandate"
          description="Mandatory institutional disclosure regarding AI intelligence and human advocacy at nyayasahayak.in."
        />
        <Badge variant="outline" className="font-black text-[9px] uppercase tracking-widest bg-primary/5 text-primary border-primary/10 px-4 py-1.5 rounded-full">Critical Disclosure</Badge>
      </motion.div>

      <div className="grid gap-8 sm:grid-cols-2">
        <motion.div variants={itemVariants} initial="hidden" animate="visible">
          <Card className="border-none ring-1 ring-destructive/20 bg-destructive/5 rounded-[2.5rem] overflow-hidden shadow-2xl h-full relative">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                <ShieldAlert className="h-32 w-32" />
            </div>
            <CardContent className="p-8 sm:p-12 space-y-6 text-left relative z-10">
              <div className="flex items-center gap-4 text-destructive">
                <div className="bg-destructive/10 p-3 rounded-2xl shadow-inner">
                  <Gavel className="h-8 w-8" />
                </div>
                <h3 className="font-black uppercase tracking-tighter text-2xl leading-none">Non-Official Hub</h3>
              </div>
              <p className="text-sm sm:text-base font-black leading-relaxed text-destructive/80 uppercase tracking-tight">
                The AI Nyaya Mitra Assistant is <span className="underline decoration-2 underline-offset-4">NOT</span> a law firm or government entity. We provide forensic intelligence and procedural roadmaps, not legal advice.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} initial="hidden" animate="visible">
          <Card className="border-none ring-1 ring-amber-500/20 bg-amber-500/5 rounded-[2.5rem] overflow-hidden shadow-2xl h-full relative">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                <Zap className="h-32 w-32" />
            </div>
            <CardContent className="p-8 sm:p-12 space-y-6 text-left relative z-10">
              <div className="flex items-center gap-4 text-amber-600">
                <div className="bg-amber-500/10 p-3 rounded-2xl shadow-inner">
                  <Scale className="h-8 w-8" />
                </div>
                <h3 className="font-black uppercase tracking-tighter text-2xl leading-none">Human Mandate</h3>
              </div>
              <p className="text-sm sm:text-base font-black leading-relaxed text-amber-600/80 uppercase tracking-tight">
                All documents generated by AI <span className="underline decoration-2 underline-offset-4">MUST</span> be reviewed, edited, and finalized by a qualified human advocate before service or filing in any court.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {disclaimerNodes.map((step, idx) => (
          <motion.div key={idx} variants={itemVariants} initial="hidden" animate="visible">
            <Card className={`h-full border-none ring-1 ${step.border} bg-card/30 hover:bg-card/50 transition-all duration-500 group rounded-[2.5rem] shadow-lg`}>
              <CardContent className="p-8 space-y-6 text-left">
                <div className={`${step.bg} p-4 rounded-2xl w-fit shadow-xl group-hover:scale-110 transition-transform duration-500`}>
                  <step.icon className={`h-6 w-6 ${step.color}`} />
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-black tracking-tight uppercase leading-tight">{step.title}</h3>
                  <p className="text-[11px] text-muted-foreground leading-relaxed font-medium">
                    {step.desc}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div variants={itemVariants} initial="hidden" animate="visible">
        <Card className="border-none ring-1 ring-primary/10 shadow-3xl rounded-[3rem] overflow-hidden bg-card/40 backdrop-blur-xl relative">
          <div className="absolute top-0 right-0 p-16 opacity-[0.02] pointer-events-none grayscale">
            <Fingerprint className="h-64 w-64" />
          </div>
          <CardHeader className="p-8 sm:p-12 pb-0 border-none text-left">
            <div className="flex items-center gap-3 text-primary mb-4">
              <div className="bg-primary/10 p-2.5 rounded-xl shadow-inner">
                <Info className="h-6 w-6" />
              </div>
              <CardTitle className="text-2xl sm:text-4xl font-black tracking-tight uppercase leading-none">Full Disclosure Agreement</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-8 sm:p-12 pt-6 space-y-8 text-left relative z-10">
            <div className="space-y-8 text-sm sm:text-base text-muted-foreground font-medium leading-relaxed max-w-4xl">
              <p>
                By utilizing dashboard modules on nyayasahayak.in, you acknowledge that the system operates on probabilistic AI. Our mission is to democratize legal information, not replace human strategy required for litigation.
              </p>
              <p>
                Institutional systems serve as <span className="font-bold text-foreground">navigational facilitators.</span> Connect with our <span className="font-bold text-primary italic">Verified Advocate Registry</span> for personalized strategy. Only a human professional provides the empathy and foresight required for justice.
              </p>
            </div>
          </CardContent>
          <div className="h-2 w-full bg-gradient-to-r from-primary via-accent to-blue-400"></div>
        </Card>
      </motion.div>
    </div>
  );
}
