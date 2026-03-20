"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Scale, 
  ShieldCheck, 
  Cpu, 
  Globe, 
  Fingerprint, 
  Zap, 
  Database, 
  Users,
  CheckCircle2,
  Lock
} from "lucide-react";
import { motion } from "framer-motion";

const pillars = [
  {
    title: "Forensic AI Core",
    desc: "Utilizing advanced LLM nodes to provide real-time document intelligence and case strength assessment with mathematical precision.",
    icon: Cpu,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    title: "Citizen Empowerment",
    desc: "Democratizing legal information across 5+ regional languages, ensuring every citizen has a digital roadmap to justice.",
    icon: Globe,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    title: "Professional Synergy",
    desc: "Bridging the gap between AI intelligence and human advocacy through a strictly verified registry of legal professionals.",
    icon: Users,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
  },
  {
    title: "Data Sovereignty",
    desc: "Implementing AES-256 encryption nodes to ensure that every narration and document remains under absolute user control.",
    icon: Lock,
    color: "text-green-600",
    bg: "bg-green-600/10",
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
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

export default function AboutPage() {
  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-6xl mx-auto space-y-12 pb-20 px-2 sm:px-0"
    >
      <motion.div variants={itemVariants}>
        <PageHeader
          title="Institutional Identity"
          description="Understanding the architectural vision and forensic mission behind the Nyaya Sahayak legal ecosystem."
        />
      </motion.div>

      {/* Hero Mission Section */}
      <motion.div variants={itemVariants}>
        <Card className="border-primary/5 shadow-2xl rounded-3xl overflow-hidden bg-card/40 backdrop-blur-md relative">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Fingerprint className="h-40 w-40" />
          </div>
          <CardContent className="p-8 sm:p-12 space-y-8 relative z-10">
            <div className="flex items-center gap-2 text-primary">
              <Zap className="h-5 w-5 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">The Strategic Mandate</span>
            </div>
            <div className="space-y-4 max-w-3xl">
              <h2 className="text-3xl sm:text-5xl font-black tracking-tighter leading-none">
                The Pinnacle of <span className="text-primary italic">Digital Justice.</span>
              </h2>
              <p className="text-sm sm:text-lg text-muted-foreground font-medium leading-relaxed">
                Nyaya Sahayak is not merely an application; it is a specialized <span className="text-foreground font-bold">Institutional Node</span> designed to bridge the structural gap between complex judicial protocols and everyday citizen needs. By integrating forensic AI verification with human expertise, we create a ecosystem of absolute trust and procedural clarity.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 pt-4">
              <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/10 px-4 py-1 rounded-full font-bold">Verified Node</Badge>
              <Badge variant="secondary" className="bg-green-500/5 text-green-600 border-green-500/10 px-4 py-1 rounded-full font-bold">Secure Registry</Badge>
              <Badge variant="secondary" className="bg-indigo-500/5 text-indigo-600 border-indigo-500/10 px-4 py-1 rounded-full font-bold">AI Forensics</Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Strategic Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {pillars.map((pillar, idx) => (
          <motion.div key={idx} variants={itemVariants}>
            <Card className="h-full border-primary/5 bg-card/20 hover:border-primary/20 transition-all duration-300 group hover:shadow-xl">
              <CardContent className="p-6 space-y-4">
                <div className={`${pillar.bg} p-3 rounded-2xl w-fit transition-transform group-hover:scale-110 duration-500`}>
                  <pillar.icon className={`h-6 w-6 ${pillar.color}`} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-black tracking-tight">{pillar.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                    {pillar.desc}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Deep Vision Section */}
      <motion.div variants={itemVariants} className="grid lg:grid-cols-3 gap-8 items-center">
        <div className="lg:col-span-2 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 rounded-full border border-primary/10">
            <Scale className="h-3.5 w-3.5 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-widest text-primary">System Philosophy</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tighter">Engineered for Transparency.</h2>
          <div className="space-y-4 text-sm sm:text-base text-muted-foreground font-medium leading-relaxed">
            <p>
              Our foundation rests on the principles of technological empowerment. We believe that justice should be <span className="text-foreground font-bold">predictable, accessible, and efficient.</span> Every tool in our dashboard is a module in a larger machine aimed at reducing legal friction for individuals and MSMEs alike.
            </p>
            <p>
              Whether it is through the automated generation of legal notices or the simulated cross-examination questions, our nodes provide citizens with the intelligence required to navigate the legal system with confidence and dignity.
            </p>
          </div>
        </div>
        <Card className="bg-primary shadow-2xl shadow-primary/20 rounded-3xl overflow-hidden border-none text-primary-foreground">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-black uppercase tracking-widest opacity-60">Node Integrity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              {[
                "100% Data Sovereignty",
                "Verified Professional Hub",
                "Multi-Lingual NLP Core",
                "Forensic Document Audit"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-accent shrink-0" />
                  <span className="font-bold tracking-tight text-sm">{item}</span>
                </div>
              ))}
            </div>
            <div className="pt-6 border-t border-white/10">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Identity Registry</p>
              <p className="text-xl font-black tracking-tighter mt-1">NS-NODE-001</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Trust Footer */}
      <motion.div variants={itemVariants} className="pt-12 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="bg-muted p-4 rounded-full">
            <ShieldCheck className="h-10 w-10 text-primary opacity-40" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground">
            Operational Excellence // Secure Registry Control
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
