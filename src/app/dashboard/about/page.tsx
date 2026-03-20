
"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  BrainCircuit, 
  Map, 
  PenTool, 
  BarChart3, 
  GraduationCap, 
  Cpu, 
  ShieldCheck, 
  Lightbulb,
  CheckCircle2,
  Sparkles
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const features = [
  {
    title: "Instant Doubt Resolver",
    desc: "Our neural engine processes complex academic queries in milliseconds, providing mathematically flawless and concise explanations.",
    icon: BrainCircuit,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    title: "Precision Roadmap Node",
    desc: "AI-optimized learning paths that dynamically adjust to your performance, ensuring maximum knowledge retention and velocity.",
    icon: Map,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    title: "Neural Writing Lab",
    desc: "Master the art of composition with AI-driven article summarization and sophisticated essay structural outlining.",
    icon: PenTool,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
  },
  {
    title: "Enterprise Analytics",
    desc: "Visualize your academic trajectory with world-class cloud metrics, rank predictions, and topic mastery tracking.",
    icon: BarChart3,
    color: "text-green-600",
    bg: "bg-green-600/10",
  }
];

const leadership = [
  {
    name: "Hardy Pie",
    role: "Founder and Owner",
    initials: "HP",
    bio: "As the visionary and primary architect of Gyan Sarathi, Hardy Pie engineered the core neural logic and high-fidelity interfaces that power our ecosystem. With a commitment to technical excellence and precision engineering, he has dedicated thousands of hours to refining the student journey, ensuring every node provides a flawless and empowering experience.",
    avatar: "https://picsum.photos/seed/hp/200/200"
  },
  {
    name: "Piyush Singh",
    role: "CEO & Co-founder",
    initials: "PS",
    bio: "As the CEO and Co-founder, Piyush Singh steers the strategic trajectory of Gyan Sarathi. His leadership is focused on institutional growth, global partnerships, and the democratization of elite learning tools. By aligning our neural capabilities with real-world academic needs, he ensures that Gyan Sarathi remains the global gold standard for student empowerment.",
    avatar: "https://picsum.photos/seed/ps/200/200"
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
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <PageHeader
          title="About Gyan Sarathi"
          description="The pinnacle of AI-driven academic empowerment, created by IdeaSpark."
        />
        <Button variant="ghost" size="sm" className="rounded-xl font-bold hover:bg-primary/5 group" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" /> Go Back
          </Link>
        </Button>
      </motion.div>

      {/* Mission Section */}
      <motion.div variants={itemVariants}>
        <Card className="border-primary/5 shadow-2xl rounded-3xl overflow-hidden bg-card/40 backdrop-blur-md relative border-none ring-1 ring-primary/10">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <GraduationCap className="h-40 w-40" />
          </div>
          <CardContent className="p-8 sm:p-12 space-y-8 relative z-10">
            <div className="flex items-center gap-2 text-primary">
              <Sparkles className="h-5 w-5 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Our Academic Mission</span>
            </div>
            <div className="space-y-4 max-w-4xl text-left">
              <h2 className="text-3xl sm:text-5xl font-black tracking-tighter leading-tight">
                Democratizing <span className="text-primary italic">Elite Education.</span>
              </h2>
              <p className="text-sm sm:text-lg text-muted-foreground font-medium leading-relaxed">
                Gyan Sarathi is built on the belief that every student deserves <span className="text-foreground font-bold">elite-grade academic assistance.</span> Our mission is to democratize education through precision AI engineering, delivering mathematically perfect doubt resolution and personalized study roadmaps that empower students to navigate complex curricula with absolute confidence.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 pt-4">
              <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/10 px-4 py-1 rounded-full font-bold">Precision AI</Badge>
              <Badge variant="secondary" className="bg-green-500/5 text-green-600 border-green-500/10 px-4 py-1 rounded-full font-bold">Knowledge Mastery</Badge>
              <Badge variant="secondary" className="bg-indigo-500/5 text-indigo-600 border-indigo-500/10 px-4 py-1 rounded-full font-bold">Global Access</Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Feature Capabilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, idx) => (
          <motion.div key={idx} variants={itemVariants}>
            <Card className="h-full border-primary/5 bg-card/20 hover:border-primary/20 transition-all duration-300 group hover:shadow-xl rounded-2xl">
              <CardContent className="p-6 space-y-4 text-left">
                <div className={`${feature.bg} p-3 rounded-2xl w-fit transition-transform group-hover:scale-110 duration-500`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-black tracking-tight">{feature.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                    {feature.desc}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Leadership Section */}
      <motion.div variants={itemVariants} className="space-y-8">
        <div className="text-left border-l-4 border-primary pl-6 py-2">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-1">Institutional Core</h2>
          <h3 className="text-3xl font-black tracking-tighter">Meet the Leadership</h3>
          <p className="text-sm text-muted-foreground font-medium mt-1">The visionaries behind the neural engine, dedicated to academic excellence.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {leadership.map((leader, i) => (
            <motion.div key={i} variants={itemVariants}>
              <Card className="border-primary/5 bg-card/30 rounded-3xl overflow-hidden group hover:shadow-2xl transition-all duration-500">
                <CardHeader className="flex flex-row items-center gap-5 bg-muted/20 border-b border-primary/5 p-6">
                  <Avatar className="h-16 w-16 border-2 border-background shadow-lg rounded-2xl">
                    <AvatarImage src={leader.avatar} className="object-cover" />
                    <AvatarFallback className="font-black text-xl bg-primary/10 text-primary">{leader.initials}</AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <CardTitle className="font-black tracking-tight text-xl">{leader.name}</CardTitle>
                    <CardDescription className="text-xs font-bold text-primary uppercase tracking-widest">{leader.role}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="p-6 text-left">
                  <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed">
                    {leader.bio}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Institutional Source */}
      <motion.div variants={itemVariants} className="pt-12 text-center">
        <div className="flex flex-col items-center gap-6">
          <div className="bg-primary/5 p-6 rounded-full border border-primary/10 animate-background-pan">
            <Cpu className="h-10 w-10 text-primary opacity-60" />
          </div>
          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground">
              Institutional Source // Created by IdeaSpark
            </p>
            <p className="text-sm italic font-medium text-primary">"Experience the Pinnacle of AI Education. Start your precision journey today."</p>
          </div>
          <div className="pt-6 border-t border-primary/5 w-full max-w-xs">
            <p className="text-[9px] font-black uppercase tracking-widest opacity-40">System ID: GS-NODE-ALPHA</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
