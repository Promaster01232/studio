
"use client";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ShieldCheck, 
  Zap, 
  Activity,
  ArrowLeft,
  Gavel,
  Scale,
  FileText,
  Users,
  Target
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
  hidden: { y: 10, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20
    },
  },
};

export default function AboutPage() {
  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-4xl mx-auto space-y-16 pb-32 px-6 text-left selection:bg-primary/20"
    >
      {/* Top Navigation Node */}
      <motion.div variants={itemVariants} className="flex items-center pt-10">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-primary transition-colors group uppercase tracking-widest"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
          <span>Back to registry</span>
        </Link>
      </motion.div>

      {/* Header Section */}
      <section className="space-y-10">
        <motion.div variants={itemVariants} className="space-y-6">
          <h1 className="text-4xl sm:text-7xl font-black tracking-tighter leading-[0.9] text-foreground font-headline uppercase">
            About <br /> <span className="text-primary italic">Nyaya Sahayak.</span>
          </h1>
        </motion.div>

        <Separator className="bg-border/10" />

        <motion.div variants={itemVariants} className="space-y-8 max-w-3xl">
          <div className="flex items-center gap-3 text-primary">
            <Target className="h-5 w-5" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Institutional Mandate</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Democratizing <span className="text-primary italic">Legal Intelligence.</span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground font-medium leading-relaxed">
            Nyaya Sahayak is built on the belief that every citizen deserves accessible legal assistance. Our mission is to bridge the gap between complex judicial protocols and citizen needs through precision AI engineering, delivering automated document drafting and personalized roadmaps that empower users to navigate the law with confidence.
          </p>
        </motion.div>
      </section>

      {/* Core Capabilities Registry */}
      <section className="space-y-12">
        <div className="flex items-center gap-4">
          <div className="h-1.5 w-12 bg-primary rounded-full" />
          <h3 className="text-xl font-black uppercase tracking-tighter">Core Capabilities</h3>
        </div>

        <div className="grid gap-10">
          {[
            {
              title: "Case Analysis",
              desc: "Our AI engine processes complex legal narratives in milliseconds, providing precise summaries and procedural guidance.",
              icon: Gavel
            },
            {
              title: "Procedural Roadmap",
              desc: "AI-optimized legal navigation paths that dynamically guide citizens through the complexities of the judicial system.",
              icon: Scale
            },
            {
              title: "Document Drafting",
              desc: "Master legal communication with AI-driven notice generation and sophisticated document structural drafting.",
              icon: FileText
            },
            {
              title: "Verified Directory",
              desc: "Access a verified registry of legal professionals, ensuring identity authenticity through multi-stage manual audits.",
              icon: Users
            }
          ].map((item, i) => (
            <motion.div key={i} variants={itemVariants} className="flex gap-8 group">
              <div className="p-4 rounded-2xl bg-muted/30 border border-border/10 h-fit shrink-0 transition-transform group-hover:scale-110">
                <item.icon className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-2">
                <h4 className="text-xl font-black tracking-tight">{item.title}</h4>
                <p className="text-muted-foreground font-medium leading-relaxed max-w-2xl">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Leadership Node */}
      <section className="space-y-12 pt-10">
        <div className="flex items-center gap-4">
          <div className="h-1.5 w-12 bg-primary rounded-full" />
          <div className="space-y-1">
            <h3 className="text-xl font-black uppercase tracking-tighter">Platform Core</h3>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Meet the Leadership</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {[
            {
              name: "Hardy Pie",
              role: "Founder & Architect",
              bio: "As the visionary and primary architect, Hardy Pie engineered the core logic and high-fidelity interfaces that power our ecosystem. With a commitment to technical excellence and precision engineering, he has dedicated thousands of hours to refining the citizen journey."
            },
            {
              name: "Piyush Singh",
              role: "CEO & Co-founder",
              bio: "As the CEO and Co-founder, Piyush Singh steers the strategic trajectory of Nyaya Sahayak. His leadership is focused on institutional growth, strategic partnerships, and the democratization of elite legal tools."
            }
          ].map((leader, i) => (
            <motion.div key={i} variants={itemVariants} className="space-y-6 p-8 rounded-[2rem] bg-muted/20 border border-border/10 shadow-inner group hover:bg-primary/[0.02] transition-colors">
              <div className="space-y-1">
                <h4 className="text-2xl font-black tracking-tight group-hover:text-primary transition-colors">{leader.name}</h4>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">{leader.role}</p>
              </div>
              <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                {leader.bio}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      <motion.div variants={itemVariants} className="pt-20 text-center opacity-30">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground">NYAYASAHAYAK.IN // INSTITUTIONAL SOURCE</p>
      </motion.div>
    </motion.div>
  );
}
