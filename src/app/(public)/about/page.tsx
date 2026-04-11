
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  ShieldCheck, 
  Scale, 
  Cpu, 
  Sparkles,
  Target,
  Globe,
  Award,
  UserCheck,
  Activity,
  Zap,
  CheckCircle2,
  ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";
import { Logo } from "@/components/logo";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
      className="max-w-7xl mx-auto space-y-20 pb-32 px-4 sm:px-6 text-left relative"
    >
      {/* Top Navigation Node */}
      <motion.div variants={itemVariants} className="flex items-center">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-sm font-medium text-white/40 hover:text-white transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to home</span>
        </Link>
      </motion.div>

      {/* Hero Section */}
      <section className="text-center space-y-10 py-10 relative">
        <div className="absolute inset-0 bg-primary/5 blur-[120px] rounded-full opacity-20 -z-10" />
        
        <motion.div variants={itemVariants} className="flex flex-col items-center gap-8">
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
            About Nyaya Sahayak
          </Badge>
          
          <h1 className="text-4xl sm:text-8xl font-black tracking-tighter leading-[0.9] text-white font-headline">
            Legal answers for <br /> <span className="text-primary italic">Every Indian.</span>
          </h1>
          
          <p className="text-sm sm:text-xl text-white/40 font-medium max-w-3xl mx-auto leading-relaxed">
            Nyaya Sahayak helps citizens get immediate clarity on their legal problems and rights. Lawyers use it to speed up forensic research. Over 3 lakh+ citizens have already initialized their nodes.
          </p>
        </motion.div>
      </section>

      {/* Differentiation Section */}
      <div className="grid lg:grid-cols-2 gap-12 items-center pt-10">
        <motion.div variants={itemVariants}>
          <Card className="border-none shadow-3xl rounded-[3rem] overflow-hidden bg-[#161b22] relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-50" />
            <CardContent className="p-12 sm:p-20 relative z-10 text-left space-y-10">
              <div className="bg-primary/10 p-5 rounded-2xl w-fit shadow-xl border border-primary/10">
                <Scale className="h-10 w-10 text-primary" />
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl sm:text-5xl font-black tracking-tighter text-white uppercase leading-none">Our <br /> <span className="text-primary italic">story</span></h2>
                <p className="text-sm sm:text-base text-white/60 leading-loose font-medium">
                  We started with a single mandate: to make the complexities of the Indian Judicial System accessible to every citizen. Through precision AI engineering, we've built a terminal that transforms legal narratives into actionable statutory roadmaps.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-10 px-4">
          <div className="space-y-4">
            <h3 className="text-3xl font-black tracking-tighter text-white">What makes it different</h3>
            <p className="text-white/40 text-sm sm:text-base leading-relaxed font-medium">
              Nyaya Sahayak isn't a generic chatbot with a legal skin. It's an elite forensic node trained on Indian-specific statutory data: BNS, IPC, CrPC, BSA, the Constitution, and thousands of Supreme Court precedents.
            </p>
          </div>

          <div className="space-y-6">
            {[
              { title: "Statutory Precision", desc: "Trained on latest BNS 2023 and BSA 2023 acts.", icon: Zap },
              { title: "Institutional Neutrality", desc: "Maintains absolute accuracy and objectivity in reports.", icon: ShieldCheck },
              { title: "Multilingual Ingress", desc: "Understand the law in Hindi, English, and regional dialects.", icon: Globe }
            ].map((item, i) => (
              <div key={i} className="flex gap-5 items-start">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-primary shrink-0">
                  <item.icon className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-black text-white">{item.title}</h4>
                  <p className="text-xs text-white/40 font-medium">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Mission Node */}
      <motion.div variants={itemVariants} className="pt-20">
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
          </CardContent>
          <div className="h-2 w-full bg-gradient-to-r from-[#FF9933] via-[#000080] to-[#128807]"></div>
        </Card>
      </motion.div>

      {/* Leadership Hub */}
      <motion.div variants={itemVariants} className="space-y-16 pt-20">
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
                <CardContent className="p-10 sm:p-12 text-left flex-1 flex flex-col justify-center relative z-10">
                  <div className="flex items-center gap-6 mb-8">
                    <div className="relative">
                        <div className="absolute -inset-3 rounded-2xl bg-primary/10 animate-pulse group-hover:scale-110 transition-transform"></div>
                        <div className="h-20 w-20 border-4 border-background shadow-2xl rounded-2xl relative z-10 transition-all group-hover:rotate-3 bg-white flex items-center justify-center">
                          <leader.icon className="h-10 w-10 text-primary" />
                        </div>
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-black tracking-tighter text-2xl text-foreground">{leader.name}</h4>
                      <Badge variant="secondary" className="text-[9px] font-bold text-primary py-0.5 px-3 rounded-full bg-primary/5 border border-primary/10 uppercase tracking-widest">{leader.role}</Badge>
                    </div>
                  </div>
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
