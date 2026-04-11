
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BrainCircuit, 
  FileText, 
  ShieldCheck, 
  Scale, 
  Cpu, 
  Sparkles,
  Target,
  Globe,
  Award,
  UserCheck,
  Activity,
  Zap
} from "lucide-react";
import { motion } from "framer-motion";
import { Logo } from "@/components/logo";

const features = [
  {
    title: "Case analysis",
    desc: "Our AI engine processes complex legal narratives in milliseconds, providing precise summaries and procedural guidance.",
    icon: BrainCircuit,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    title: "Procedural roadmap",
    desc: "AI-optimized legal navigation paths that dynamically guide citizens through the complexities of the judicial system.",
    icon: Scale,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    title: "Document drafting",
    desc: "Master legal communication with AI-driven notice generation and sophisticated document structural drafting.",
    icon: FileText,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
  },
  {
    title: "Verified directory",
    desc: "Access a verified registry of legal professionals, ensuring identity authenticity through multi-stage manual audits.",
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
    bio: "As the visionary and primary architect, Hardy Pie engineered the core logic and high-fidelity interfaces that power our ecosystem. With a commitment to technical excellence and precision engineering, he has dedicated thousands of hours to refining the citizen journey.",
    icon: Cpu
  },
  {
    name: "Piyush Singh",
    role: "CEO & Co-founder",
    initials: "PS",
    bio: "As the CEO and Co-founder, Piyush Singh steers the strategic trajectory of Nyaya Sahayak. His leadership is focused on institutional growth, strategic partnerships, and the democratization of elite legal tools.",
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
      className="max-w-6xl mx-auto space-y-16 sm:space-y-24 pb-20 px-4 sm:px-6 text-left"
    >
      <motion.div variants={itemVariants} className="text-center space-y-4">
        <div className="flex justify-center mb-6">
            <Logo className="h-24 w-24 sm:h-32 sm:w-32 shadow-2xl" priority={true} />
        </div>
        <div className="space-y-2">
            <div className="flex items-center justify-center gap-3 text-primary mb-2">
                <Sparkles className="h-5 w-5 animate-pulse" />
                <span className="text-[10px] font-bold">Official portal</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-foreground text-center font-headline">
              Our <span className="text-primary italic">mission</span>
            </h1>
            <p className="text-sm sm:text-xl text-muted-foreground font-medium max-w-2xl mx-auto">The pinnacle of AI-driven legal empowerment, created by IdeaSpark.</p>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="border-none shadow-[0_50px_100px_rgba(0,0,0,0.1)] rounded-[3rem] overflow-hidden bg-card/40 backdrop-blur-xl relative">
          <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none">
            <Globe className="h-64 w-64" />
          </div>
          <CardContent className="p-10 sm:p-20 space-y-12 relative z-10 text-left">
            <div className="flex items-center gap-4 text-primary">
              <div className="p-3 rounded-2xl bg-primary/10 shadow-inner">
                <Target className="h-6 w-6 animate-pulse" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-widest">Institutional mandate</span>
            </div>
            <div className="space-y-8 max-w-4xl">
              <h2 className="text-4xl sm:text-7xl font-black tracking-tighter leading-[0.9] text-foreground font-headline">
                Democratizing <br />
                <span className="text-primary italic">legal intelligence.</span>
              </h2>
              <p className="text-lg sm:text-2xl text-muted-foreground font-medium leading-relaxed">
                Nyaya Sahayak is built on the belief that every citizen deserves <span className="text-foreground font-bold">accessible legal assistance.</span> Our mission is to bridge the gap between complex judicial protocols and citizen needs through precision AI engineering, delivering automated document drafting and personalized roadmaps that empower users to navigate the law with confidence.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-primary/5 border border-primary/10">
                <Zap className="h-4 w-4 text-primary" />
                <span className="text-[10px] font-bold text-primary">Ai powered</span>
              </div>
              <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-green-500/5 border border-green-500/10">
                <UserCheck className="h-4 w-4 text-green-600" />
                <span className="text-[10px] font-bold text-green-600">Statutory trust</span>
              </div>
              <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-blue-500/5 border border-blue-500/10">
                <Activity className="h-4 w-4 text-blue-600" />
                <span className="text-[10px] font-bold text-blue-600">Always ready</span>
              </div>
            </div>
          </CardContent>
          <div className="h-2 w-full bg-gradient-to-r from-[#FF9933] via-[#000080] to-[#128807]"></div>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, idx) => (
          <motion.div key={idx} variants={itemVariants}>
            <Card className="h-full border-primary/5 bg-card/20 hover:border-primary/20 transition-all duration-500 group hover:shadow-3xl rounded-[2.5rem] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                <feature.icon className="h-24 w-24" />
              </div>
              <CardContent className="p-10 space-y-8 text-left relative z-10">
                <div className={`${feature.bg} p-5 rounded-2xl w-fit transition-transform group-hover:scale-110 group-hover:rotate-3 duration-700 shadow-xl`}>
                  <feature.icon className={`h-8 w-8 ${feature.color}`} />
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-black tracking-tighter text-white leading-tight font-headline">{feature.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-medium">
                    {feature.desc}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div variants={itemVariants} className="space-y-16">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-primary mb-1">
            <Activity className="h-4 w-4 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Platform core</span>
          </div>
          <h3 className="text-4xl sm:text-6xl font-black tracking-tighter text-foreground font-headline">Meet the <span className="text-primary">leadership</span></h3>
          <p className="text-sm sm:text-xl text-muted-foreground font-medium max-w-2xl mx-auto">The visionaries behind the engine, dedicated to legal excellence across Bharat.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 sm:gap-16">
          {leadership.map((leader, i) => (
            <motion.div key={i} variants={itemVariants}>
              <Card className="border-none shadow-2xl bg-card/30 rounded-[3rem] overflow-hidden group hover:shadow-3xl transition-all duration-700 h-full flex flex-col relative text-left">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                    <leader.icon className="h-32 w-32" />
                </div>
                <CardHeader className="flex flex-row items-center gap-8 bg-muted/20 border-b border-primary/5 p-10 sm:p-12 relative z-10 text-left">
                  <div className="relative">
                      <div className="absolute -inset-3 rounded-3xl bg-primary/10 animate-pulse group-hover:scale-110 transition-transform"></div>
                      <div className="h-24 w-24 border-4 border-background shadow-2xl rounded-3xl relative z-10 transition-all group-hover:rotate-3 bg-white flex items-center justify-center">
                        <leader.icon className="h-12 w-12 text-primary" />
                      </div>
                  </div>
                  <div className="text-left space-y-2">
                    <CardTitle className="font-black tracking-tighter text-3xl sm:text-4xl text-foreground font-headline">{leader.name}</CardTitle>
                    <Badge variant="secondary" className="text-[10px] font-bold text-primary py-1 px-4 rounded-full bg-primary/5 border-primary/10">{leader.role}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-10 sm:p-12 text-left flex-1 flex flex-col justify-center relative z-10">
                  <p className="text-base sm:text-lg text-muted-foreground font-medium leading-relaxed">
                    {leader.bio}
                  </p>
                </CardContent>
                <div className="h-1.5 w-full bg-primary/10"></div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="text-center pt-20 border-t border-primary/5">
          <div className="max-w-3xl mx-auto space-y-10">
              <Award className="h-16 w-16 text-primary/20 mx-auto animate-bounce" />
              <p className="text-2xl sm:text-4xl font-black text-foreground tracking-tighter leading-tight italic font-headline">
                  "Engineering dignity through precise <span className="text-primary">legal intelligence.</span> We don't just provide answers; we build procedural paths to justice."
              </p>
          </div>
      </motion.div>
    </motion.div>
  );
}
