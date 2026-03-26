"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  BrainCircuit, 
  Gavel, 
  FileText, 
  ShieldCheck, 
  Scale, 
  Cpu, 
  Sparkles,
  Target,
  Globe,
  Award
} from "lucide-react";
import { motion } from "framer-motion";
import { Logo } from "@/components/logo";

const features = [
  {
    title: "Forensic Case Auditor",
    desc: "Our neural engine processes complex legal narratives in milliseconds, providing mathematically precise forensic reports and summaries.",
    icon: BrainCircuit,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    title: "Procedural Roadmap",
    desc: "AI-optimized legal navigation paths that dynamically guide citizens through the complexities of the Indian judicial system.",
    icon: Scale,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    title: "Legal Drafting Node",
    desc: "Master the art of legal communication with AI-driven notice generation and sophisticated bond structural drafting.",
    icon: FileText,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
  },
  {
    title: "Registry Intelligence",
    desc: "Access a strictly verified registry of legal professionals, ensuring identity authenticity through multi-stage forensic audits.",
    icon: ShieldCheck,
    color: "text-green-600",
    bg: "bg-green-600/10",
  }
];

const leadership = [
  {
    name: "Hardy Pie",
    role: "Founder & Architect",
    initials: "HP",
    bio: "As the visionary and primary architect of Nyaya Sahayak, Hardy Pie engineered the core forensic logic and high-fidelity interfaces that power our ecosystem. With a commitment to technical excellence and precision engineering, he has dedicated thousands of hours to refining the citizen journey.",
    icon: Cpu
  },
  {
    name: "Piyush Singh",
    role: "CEO & Co-founder",
    initials: "PS",
    bio: "As the CEO and Co-founder, Piyush Singh steers the strategic trajectory of Nyaya Sahayak. His leadership is focused on institutional growth, strategic partnerships, and the democratization of elite legal tools, ensuring that Nyaya Sahayak remains the global gold standard.",
    icon: ShieldCheck
  }
];

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
      className="max-w-6xl mx-auto space-y-16 sm:space-y-24 pb-20 px-4 sm:px-6"
    >
      <motion.div variants={itemVariants} className="text-center space-y-4">
        <div className="flex justify-center mb-6">
            <Logo className="h-20 w-20 sm:h-24 sm:w-24 shadow-2xl" />
        </div>
        <PageHeader
          title="About Nyaya Sahayak"
          description="The pinnacle of AI-driven legal empowerment, created by IdeaSpark."
        />
      </motion.div>

      {/* Mission Section */}
      <motion.div variants={itemVariants}>
        <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-card/40 backdrop-blur-xl relative">
          <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none">
            <Globe className="h-64 w-64" />
          </div>
          <CardContent className="p-8 sm:p-16 space-y-10 relative z-10 text-left">
            <div className="flex items-center gap-3 text-primary">
              <div className="p-2 rounded-xl bg-primary/10">
                <Target className="h-5 w-5 animate-pulse" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Our Statutory Mandate</span>
            </div>
            <div className="space-y-6 max-w-4xl">
              <h2 className="text-3xl sm:text-6xl font-black tracking-tighter leading-none">
                Democratizing <span className="text-primary italic">Legal Intelligence.</span>
              </h2>
              <p className="text-sm sm:text-xl text-muted-foreground font-medium leading-relaxed">
                Nyaya Sahayak is built on the belief that every citizen deserves <span className="text-foreground font-bold">elite-grade legal assistance.</span> Our mission is to bridge the gap between complex judicial protocols and citizen needs through precision AI engineering, delivering forensic document audits and personalized roadmaps that empower users to navigate the law with absolute confidence.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 px-5 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest">AI Forensics</Badge>
              <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/20 px-5 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest">Procedural Clarity</Badge>
              <Badge variant="secondary" className="bg-indigo-500/10 text-indigo-600 border-indigo-500/20 px-5 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest">Institutional Trust</Badge>
            </div>
          </CardContent>
          <div className="h-1.5 w-full bg-gradient-to-r from-primary via-accent to-blue-400"></div>
        </Card>
      </motion.div>

      {/* Feature Capabilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, idx) => (
          <motion.div key={idx} variants={itemVariants}>
            <Card className="h-full border-primary/5 bg-card/20 hover:border-primary/20 transition-all duration-500 group hover:shadow-2xl rounded-[2rem]">
              <CardContent className="p-8 space-y-6 text-left">
                <div className={`${feature.bg} p-4 rounded-2xl w-fit transition-transform group-hover:scale-110 duration-700 shadow-inner`}>
                  <feature.icon className={`h-7 w-7 ${feature.color}`} />
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-black tracking-tight">{feature.title}</h3>
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
      <motion.div variants={itemVariants} className="space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">Institutional Core</h2>
          <h3 className="text-3xl sm:text-5xl font-black tracking-tighter">Meet the Leadership</h3>
          <p className="text-sm text-muted-foreground font-medium">The visionaries behind the forensic engine, dedicated to legal excellence.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 sm:gap-12">
          {leadership.map((leader, i) => (
            <motion.div key={i} variants={itemVariants}>
              <Card className="border-none shadow-xl bg-card/30 rounded-[2.5rem] overflow-hidden group hover:shadow-2xl transition-all duration-700 h-full flex flex-col">
                <CardHeader className="flex flex-row items-center gap-6 bg-muted/20 border-b border-primary/5 p-8 sm:p-10">
                  <div className="relative">
                      <div className="absolute -inset-2 rounded-2xl bg-primary/10 animate-pulse"></div>
                      <Avatar className="h-20 w-20 border-2 border-background shadow-xl rounded-2xl relative z-10 transition-transform group-hover:rotate-2">
                        <AvatarFallback className="font-black text-2xl bg-primary/5 text-primary">
                          <leader.icon className="h-10 w-10" />
                        </AvatarFallback>
                      </Avatar>
                  </div>
                  <div className="text-left space-y-1">
                    <CardTitle className="font-black tracking-tighter text-2xl">{leader.name}</CardTitle>
                    <Badge variant="secondary" className="text-[9px] font-black text-primary uppercase tracking-widest py-0.5 px-3 rounded-full">{leader.role}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-8 sm:p-10 text-left flex-1 flex flex-col justify-center">
                  <p className="text-sm sm:text-base text-muted-foreground font-medium leading-relaxed">
                    {leader.bio}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Trust Quote */}
      <motion.div variants={itemVariants} className="text-center pt-10 border-t border-primary/5">
          <div className="max-w-2xl mx-auto space-y-6">
              <Award className="h-10 w-10 text-primary/20 mx-auto" />
              <p className="text-xl sm:text-2xl font-bold text-primary italic leading-relaxed">
                  "Engineering Dignity through Precise Neural Legal Intelligence. We don't just provide answers; we build procedural paths to justice."
              </p>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40">Nyaya Sahayak // Institutional Node NS-ALPHA</p>
          </div>
      </motion.div>
    </motion.div>
  );
}
