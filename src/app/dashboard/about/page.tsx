
"use client";

import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  ShieldCheck, 
  Zap, 
  Activity,
  Gavel,
  Scale,
  FileText,
  Users,
  Target,
  Globe
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

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
      className="max-w-5xl mx-auto space-y-12 pb-16 px-4 sm:px-6 text-left"
    >
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-border/10 pb-8">
        <PageHeader
          title="About Nyaya Sahayak"
          description="Institutional policy and statutory mandate registry."
        />
        <Button variant="ghost" size="sm" className="rounded-xl font-bold hover:bg-primary/5 group h-10 px-6 border border-primary/5 text-primary text-[10px] uppercase tracking-widest" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" /> Back to Terminal
          </Link>
        </Button>
      </motion.div>

      {/* Mandate Section */}
      <section className="space-y-10">
        <motion.div variants={itemVariants} className="space-y-8 max-w-4xl">
          <div className="flex items-center gap-3 text-primary">
            <Target className="h-5 w-5" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Institutional Mandate</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tighter leading-tight uppercase text-foreground">
            Democratizing <span className="text-primary">Legal Intelligence.</span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground font-medium leading-relaxed">
            Nyaya Sahayak is built on the belief that every citizen deserves accessible legal assistance. Our mission is to bridge the gap between complex judicial protocols and citizen needs through precision AI engineering, delivering automated document drafting and personalized roadmaps that empower users to navigate the law with confidence.
          </p>
        </motion.div>
      </section>

      <Separator className="bg-border/5" />

      {/* Capabilities Ledger */}
      <section className="space-y-12">
        <div className="flex items-center gap-4">
          <div className="h-1.5 w-12 bg-primary rounded-full" />
          <h3 className="text-xl font-black uppercase tracking-tighter">Capabilities Registry</h3>
        </div>

        <div className="grid sm:grid-cols-2 gap-10">
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
            <motion.div key={i} variants={itemVariants} className="space-y-4 text-left p-8 rounded-[2rem] bg-muted/20 border border-border/10 shadow-inner group hover:bg-primary/[0.02] transition-colors">
              <div className="p-3 rounded-xl bg-primary/10 w-fit group-hover:scale-110 transition-transform">
                <item.icon className="h-5 w-5 text-primary" />
              </div>
              <h4 className="text-xl font-black tracking-tight">{item.title}</h4>
              <p className="text-xs sm:text-sm font-medium text-muted-foreground leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <Separator className="bg-border/5" />

      {/* Platform Core Leadership */}
      <section className="space-y-12">
        <div className="flex items-center gap-4">
          <div className="h-1.5 w-12 bg-primary rounded-full" />
          <div className="space-y-1">
            <h3 className="text-xl font-black uppercase tracking-tighter">Platform Core</h3>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Meet the Leadership</p>
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
            <motion.div key={i} variants={itemVariants} className="space-y-6">
              <div className="space-y-1">
                <h4 className="text-2xl font-black tracking-tight text-foreground">{leader.name}</h4>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">{leader.role}</p>
              </div>
              <p className="text-sm font-medium text-muted-foreground leading-relaxed max-w-md">
                {leader.bio}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}
