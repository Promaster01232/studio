
"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Cookie, 
  ShieldCheck, 
  Settings, 
  Lock, 
  Activity, 
  MousePointer2, 
  History,
  Info,
  ExternalLink,
  Mail,
  Zap,
  ArrowLeft
} from "lucide-react";
import { motion } from "framer-motion";
import { Logo } from "@/components/logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const cookieTypes = [
  {
    title: "Essential Cookies",
    desc: "Necessary for the website to function. They manage security protocols, privacy settings, and login synchronization. These cannot be switched off.",
    icon: Lock,
    color: "text-blue-500",
    bg: "bg-blue-500/10"
  },
  {
    title: "Performance & Analytics",
    desc: "Allow us to count visits and monitor traffic sources to measure and improve our AI response times and system stability.",
    icon: Activity,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10"
  },
  {
    title: "Functional Cookies",
    desc: "Enable enhanced functionality and personalization, such as remembering your language (Hindi/English) or your theme preferences.",
    icon: Settings,
    color: "text-amber-500",
    bg: "bg-amber-500/10"
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

export default function CookiePolicyPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20 px-2 sm:px-6 text-left">
      <motion.div 
        initial={{ opacity: 0, y: -10 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 border-b border-primary/5 pb-8"
      >
        <PageHeader
          title="Cookie Protocol"
          description="Institutional transparency regarding digital memory and session tracking on the Nyaya Sahayak dashboard."
        />
        <Button variant="ghost" size="sm" className="rounded-xl font-bold hover:bg-primary/5 group h-10 px-6 border border-primary/5 text-primary text-[10px] uppercase tracking-widest" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" /> Back to Dashboard
          </Link>
        </Button>
      </motion.div>

      {/* Hero Transparency Card */}
      <motion.div variants={itemVariants} initial="hidden" animate="visible">
        <Card className="border-none ring-1 ring-primary/10 shadow-3xl rounded-[3rem] overflow-hidden bg-card/40 backdrop-blur-xl relative text-left">
          <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none grayscale">
            <Logo className="h-64 w-64" />
          </div>
          <CardContent className="p-8 sm:p-16 relative z-10 text-left space-y-8">
            <div className="flex items-center gap-3 text-primary mb-2">
              <div className="bg-primary/10 p-2.5 rounded-xl shadow-inner">
                <Info className="h-6 w-6" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Last updated: 12/04/2026</span>
            </div>
            <div className="space-y-6 max-w-4xl">
              <h2 className="text-3xl sm:text-6xl font-black tracking-tighter leading-[0.9] uppercase text-foreground">
                1. What Are <br />
                <span className="text-primary italic">Cookies?</span>
              </h2>
              <p className="text-sm sm:text-xl text-muted-foreground font-medium leading-relaxed text-left">
                Cookies are small text files placed on your device when you interact with the <span className="text-foreground font-bold">Nyaya Sahayak</span> terminal. They ensure your secure session remains active and provide essential technical data for our neural forensic engine.
              </p>
            </div>
          </CardContent>
          <div className="h-2 w-full bg-gradient-to-r from-primary via-accent to-blue-400"></div>
        </Card>
      </motion.div>

      {/* Usage Section */}
      <section className="space-y-8 text-left">
        <div className="flex items-center gap-3">
            <div className="h-1 w-8 bg-primary rounded-full" />
            <h2 className="text-xl font-black uppercase tracking-tighter">2. How We Use Cookies</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
            {cookieTypes.map((type, idx) => (
                <Card key={idx} className="h-full border-none ring-1 ring-primary/5 bg-card/30 rounded-[2.5rem] shadow-lg group hover:ring-primary/20 transition-all">
                    <CardContent className="p-8 space-y-6 text-left">
                        <div className={`${type.bg} p-4 rounded-2xl w-fit transition-transform group-hover:scale-110 duration-500 shadow-xl`}>
                            <type.icon className={`h-6 w-6 ${type.color}`} />
                        </div>
                        <div className="space-y-3">
                            <h3 className="text-xl font-black tracking-tight uppercase leading-tight">{type.title}</h3>
                            <p className="text-[11px] text-muted-foreground leading-relaxed font-medium">
                                {type.desc}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
      </section>

      {/* Advertising Node */}
      <motion.div variants={itemVariants} initial="hidden" animate="visible">
        <Card className="border-none ring-1 ring-primary/10 shadow-3xl rounded-[3rem] overflow-hidden bg-primary/5 relative text-left">
          <CardContent className="p-8 sm:p-12 space-y-8 relative z-10 text-left">
            <h3 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
                <ExternalLink className="h-6 w-6 text-primary" />
                3. Third-Party Cookies (Advertising)
            </h3>
            <div className="space-y-6 text-sm sm:text-base text-muted-foreground font-medium leading-relaxed text-left">
                <p>
                    Nyaya Sahayak utilizes third-party advertising nodes, such as <span className="text-foreground font-bold">Google AdSense</span>, to serve relevant statutory notifications and institutional announcements. These nodes use generalized telemetry to provide advertisements about statutory goods and services of interest to you.
                </p>
                <div className="p-6 rounded-2xl bg-background border border-primary/5 space-y-4 shadow-inner text-left">
                    <p className="font-bold text-foreground">Identity Protection:</p>
                    <p className="text-xs">
                        Google's use of advertising cookies enables it to serve ads based on your visit to this terminal. You may opt out of personalized tracking via your Google Registry Account or at www.aboutads.info/choices.
                    </p>
                </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Grid for Final Clauses */}
      <div className="grid gap-8 sm:grid-cols-2 text-left">
          <Card className="rounded-[2.5rem] border-primary/5 bg-muted/30 p-8 sm:p-10 space-y-6 text-left">
              <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
                  <MousePointer2 className="h-5 w-5 text-primary" />
                  4. Your Choices
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed">
                  You maintain sovereign authority over your cookies. You can control, purge, or block cookies via your browser console settings. Note that disabling "Essential Protocol Nodes" will terminate your secure registry session.
              </p>
          </Card>
          <Card className="rounded-[2.5rem] border-primary/5 bg-muted/30 p-8 sm:p-10 space-y-6 text-left">
              <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
                  <History className="h-5 w-5 text-primary" />
                  5. Protocol Updates
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed">
                  We update this protocol periodically to reflect technological amendments. Modifications are broadcasted on this terminal immediately upon synchronization.
              </p>
          </Card>
      </div>

      {/* Contact Hub */}
      <motion.div variants={itemVariants} initial="hidden" animate="visible" className="pt-10">
        <Card className="border-none shadow-2xl rounded-[3rem] bg-card/40 backdrop-blur-xl p-8 sm:p-12 text-center">
            <div className="max-w-xl mx-auto space-y-8">
                <div className="p-4 bg-primary/10 rounded-2xl w-fit mx-auto">
                    <Mail className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-3xl font-black tracking-tighter uppercase">6. Contact Us</h3>
                    <p className="text-sm text-muted-foreground font-bold">Fiduciary Support Hub</p>
                </div>
                <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10">
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Institutional Desk</p>
                    <p className="text-lg font-black text-foreground hover:underline cursor-pointer select-all lowercase">nyayasahayakhelp@gmail.com</p>
                </div>
            </div>
        </Card>
      </motion.div>

      <div className="text-center pt-8 opacity-30">
          <p className="text-[9px] font-black uppercase tracking-[0.6em] text-muted-foreground">NYAYASAHAYAK.IN // MEMORY PROTOCOL // 2025</p>
      </div>
    </div>
  );
}
