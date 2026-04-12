
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
      className="max-w-4xl mx-auto space-y-12 pb-16 px-6 text-left selection:bg-primary/20"
    >
      {/* Top Navigation Point */}
      <motion.div variants={itemVariants} className="flex items-center pt-10">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-primary transition-colors group tracking-widest"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
          <span>Back To Home</span>
        </Link>
      </motion.div>

      {/* Header Section */}
      <section className="space-y-10">
        <motion.div variants={itemVariants} className="space-y-6">
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tighter leading-tight text-foreground font-headline">
            About Nyaya Sahayak.
          </h1>
        </motion.div>

        <Separator className="bg-border/10" />

        <motion.div variants={itemVariants} className="space-y-8 max-w-3xl">
          <div className="flex items-center gap-3 text-primary">
            <Target className="h-5 w-5" />
            <span className="text-[10px] font-bold tracking-widest uppercase">Institutional Mandate</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-bold tracking-tight leading-tight">
            Democratizing Legal Intelligence.
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground font-medium leading-relaxed">
            Nyaya Sahayak Is Built On The Belief That Every Citizen Deserves Accessible Legal Assistance. Our Mission Is To Bridge The Gap Between Complex Judicial Protocols And Citizen Needs Through Precision AI Engineering, Delivering Automated Document Drafting And Personalized Roadmaps That Empower Users To Navigate The Law With Confidence.
          </p>
        </motion.div>
      </section>

      {/* Core Capabilities Registry */}
      <section className="space-y-12">
        <div className="flex items-center gap-4">
          <div className="h-1.5 w-12 bg-primary rounded-full" />
          <h3 className="text-xl font-bold tracking-tighter">Core Capabilities</h3>
        </div>

        <div className="grid gap-10">
          {[
            {
              title: "Case Analysis",
              desc: "Our AI Engine Processes Complex Legal Narratives In Milliseconds, Providing Precise Summaries And Procedural Guidance.",
              icon: Gavel
            },
            {
              title: "Procedural Roadmap",
              desc: "AI-Optimized Legal Navigation Paths That Dynamically Guide Citizens Through The Complexities Of The Judicial System.",
              icon: Scale
            },
            {
              title: "Document Drafting",
              desc: "Master Legal Communication With AI-Driven Notice Generation And Sophisticated Document Structural Drafting.",
              icon: FileText
            },
            {
              title: "Verified Directory",
              desc: "Access A Verified Registry Of Legal Professionals, Ensuring Identity Authenticity Through Multi-Stage Manual Audits.",
              icon: Users
            }
          ].map((item, i) => (
            <motion.div key={i} variants={itemVariants} className="flex gap-8 group">
              <div className="p-4 rounded-2xl bg-muted/30 border border-border/10 h-fit shrink-0 transition-transform group-hover:scale-110">
                <item.icon className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-2">
                <h4 className="text-xl font-bold tracking-tight">{item.title}</h4>
                <p className="text-muted-foreground font-medium leading-relaxed max-w-2xl">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Leadership Point */}
      <section className="space-y-12 pt-10">
        <div className="flex items-center gap-4">
          <div className="h-1.5 w-12 bg-primary rounded-full" />
          <div className="space-y-1">
            <h3 className="text-xl font-bold tracking-tighter">Platform Core</h3>
            <p className="text-xs font-bold text-muted-foreground tracking-widest uppercase">Meet The Leadership</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {[
            {
              name: "Hardy Pie",
              role: "Founder & Architect",
              bio: "As The Visionary And Primary Architect, Hardy Pie Engineered The Core Logic And High-Fidelity Interfaces That Power Our Ecosystem. With A Commitment To Technical Excellence And Precision Engineering, He Has Dedicated Thousands Of Hours To Refining The Citizen Journey."
            },
            {
              name: "Piyush Singh",
              role: "CEO & Co-founder",
              bio: "As The CEO And Co-Founder, Piyush Singh Steers The Strategic Trajectory Of Nyaya Sahayak. His Leadership Is Focused On Institutional Growth, Strategic Partnerships, And The Democratization Of Elite Legal Tools."
            }
          ].map((leader, i) => (
            <motion.div key={i} variants={itemVariants} className="space-y-6 p-8 rounded-[2rem] bg-muted/20 border border-border/10 shadow-inner group hover:bg-primary/[0.02] transition-colors">
              <div className="space-y-1">
                <h4 className="text-2xl font-bold tracking-tight group-hover:text-primary transition-colors">{leader.name}</h4>
                <p className="text-[10px] font-bold tracking-[0.3em] text-primary uppercase">{leader.role}</p>
              </div>
              <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                {leader.bio}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}
