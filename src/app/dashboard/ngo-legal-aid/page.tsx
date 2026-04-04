"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  Users, 
  Scale, 
  MessageSquare, 
  ArrowRight, 
  ShieldCheck, 
  Activity, 
  Globe, 
  HeartHandshake,
  ExternalLink,
  ChevronRight,
  HandHelping,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const ngos = [
  {
    name: "Lok Adhikar Sewa Kendra",
    category: "Legal Aid for All",
    description: "Specialized in providing mathematically precise legal assistance to marginalized communities. Connect for help with family law, labor disputes, and BNS compliance.",
    icon: Shield,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    registryId: "NS-AID-001",
    status: "Live"
  },
  {
    name: "Nyay Jyoti Foundation",
    category: "Women's Rights",
    description: "Dedicated to the forensic protection of women's rights across Bharat. Offers strategic support for family law, property inheritance, and institutional empowerment.",
    icon: Users,
    color: "text-rose-500",
    bg: "bg-rose-500/10",
    registryId: "NS-AID-002",
    status: "Live"
  },
  {
    name: "Plea Sathi Foundation",
    category: "Child & Public Welfare",
    description: "Engineering social justice through Public Interest Litigation (PIL). Dedicated to protecting the rights of children and facilitating public welfare restitution.",
    icon: Scale,
    color: "text-emerald-600",
    bg: "bg-emerald-600/10",
    registryId: "NS-AID-003",
    status: "Busy"
  },
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
    transition: { type: "spring", stiffness: 100, damping: 15 }
  },
};

export default function NgoLegalAidPage() {
  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-20 px-2 sm:px-0 text-left">
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 border-b border-primary/5 pb-8"
      >
        <PageHeader
          title="Legal Aid Registry"
          description="Institutional directory of verified NGOs and statutory aid providers offering free support to Bharat's citizens."
        />
        <Badge variant="outline" className="font-black text-[9px] uppercase tracking-widest bg-primary/5 text-primary border-primary/10 px-4 py-1.5 rounded-full">
          Verified Directory Node
        </Badge>
      </motion.div>
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        {ngos.map((ngo, index) => (
          <motion.div key={index} variants={itemVariants}>
            <Card className="h-full flex flex-col glass transition-all duration-500 hover:shadow-3xl hover:border-primary/30 rounded-[2rem] overflow-hidden group">
              <CardHeader className="p-8 pb-4 text-left">
                <div className="flex items-center justify-between mb-6">
                    <div className={cn("p-4 rounded-2xl transition-transform group-hover:scale-110 shadow-lg", ngo.bg, ngo.color)}>
                        <ngo.icon className="h-6 w-6" />
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-background border border-primary/5 shadow-inner">
                            <div className={cn("h-1.5 w-1.5 rounded-full", ngo.status === 'Live' ? "bg-green-500 animate-pulse" : "bg-amber-500")} />
                            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">{ngo.status} Protocol</span>
                        </div>
                        <span className="text-[8px] font-bold text-muted-foreground/40 uppercase tracking-[0.2em]">{ngo.registryId}</span>
                    </div>
                </div>
                <div className="space-y-1">
                    <h3 className="text-xl font-black font-headline tracking-tighter group-hover:text-primary transition-colors truncate">{ngo.name}</h3>
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{ngo.category}</p>
                </div>
              </CardHeader>
              <CardContent className="px-8 pb-8 flex-grow text-left">
                <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed">
                    {ngo.description}
                </p>
              </CardContent>
              <CardFooter className="px-8 py-6 border-t border-primary/5 bg-muted/5">
                <Button variant="ghost" className="w-full justify-between h-10 px-4 rounded-xl font-black text-[10px] uppercase tracking-widest group-hover:bg-primary group-hover:text-white transition-all shadow-sm" asChild>
                    <Link href="#">
                        <span>Initialize Connection</span>
                        <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="pt-10"
      >
        <Card className="overflow-hidden border-none shadow-3xl bg-primary rounded-[2.5rem] relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-accent opacity-90"></div>
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                <Sparkles className="h-64 w-64 text-white" />
            </div>
            <CardContent className="p-10 sm:p-16 flex flex-col lg:flex-row items-center gap-12 relative z-10 text-center lg:text-left">
                <div className="p-8 rounded-[2rem] bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl group-hover:rotate-2 transition-transform">
                    <HandHelping className="h-16 w-16 text-white" />
                </div>
                <div className="flex-1 space-y-6">
                    <div className="space-y-2">
                        <div className="flex items-center justify-center lg:justify-start gap-2 text-white/60">
                            <Activity className="h-4 w-4 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Neural Redressal Hub</span>
                        </div>
                        <h2 className="text-3xl sm:text-5xl font-black tracking-tighter leading-none text-white uppercase">Need Immediate <br /> <span className="italic opacity-80">Statutory Redress?</span></h2>
                    </div>
                    <p className="text-sm sm:text-lg text-white/80 font-medium leading-relaxed max-w-xl">
                        Our AI red flags critical issues and guides you through the exact procedural nodes required to connect with these organizations for free legal consultation.
                    </p>
                    <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-2">
                        <Button className="bg-white text-primary hover:bg-white/90 rounded-2xl font-black uppercase tracking-widest text-[10px] h-14 px-10 shadow-2xl active:scale-95 transition-all" asChild>
                            <Link href="/dashboard/support" className="flex items-center gap-2">
                                Contact Neural Support <ArrowRight className="h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
      </motion.div>

      <div className="pt-16 border-t border-primary/5 flex flex-col sm:flex-row items-center justify-between gap-8 opacity-30">
          <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  <span className="text-[9px] font-black uppercase tracking-widest">Authenticated Registry</span>
              </div>
              <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <span className="text-[9px] font-black uppercase tracking-widest">Statutory Aid Network</span>
              </div>
          </div>
          <p className="text-[9px] font-black uppercase tracking-[0.5em] text-muted-foreground">NYAYASAHAYAK.IN // PROTOCOL AID-OS</p>
      </div>
    </div>
  );
}
