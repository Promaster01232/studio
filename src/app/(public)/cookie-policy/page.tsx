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
  History as HistoryIcon,
  Info,
  ExternalLink,
  Mail,
  Zap
} from "lucide-react";
import { motion } from "framer-motion";
import { Logo } from "@/components/logo";
import { Badge } from "@/components/ui/badge";

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
    <div className="max-w-6xl mx-auto space-y-10 pb-20 px-4 text-left">
      <motion.div 
        initial={{ opacity: 0, y: -10 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 border-b border-primary/5 pb-8"
      >
        <PageHeader
          title="Cookie Policy"
          description="Institutional protocol regarding digital memory and session tracking at Nyaya Sahayak."
        />
        <Badge variant="outline" className="font-black text-[9px] uppercase tracking-widest bg-primary/5 text-primary border-primary/10 px-4 py-1.5 rounded-full">Protocol 2025</Badge>
      </motion.div>

      <motion.div variants={itemVariants} initial="hidden" animate="visible">
        <Card className="border-none ring-1 ring-primary/10 shadow-3xl rounded-[3rem] overflow-hidden bg-card/40 backdrop-blur-xl relative">
          <div className="absolute top-0 right-0 p-16 opacity-[0.03] pointer-events-none grayscale">
            <Logo className="h-64 w-64" />
          </div>
          <CardContent className="p-8 sm:p-16 relative z-10 text-left space-y-8">
            <div className="flex items-center gap-3 text-primary mb-6">
              <div className="bg-primary/10 p-2.5 rounded-xl shadow-inner">
                <Info className="h-6 w-6" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Last updated: June 23, 2025</span>
            </div>
            <div className="space-y-6 max-w-4xl">
              <h2 className="text-3xl sm:text-6xl font-black tracking-tighter leading-[0.9] uppercase">
                1. What Are <br />
                <span className="text-primary italic">Cookies?</span>
              </h2>
              <p className="text-sm sm:text-xl text-muted-foreground font-medium leading-relaxed">
                Cookies are small text files placed on your computer or mobile device when you visit <span className="text-foreground font-bold">nyayasahayak.in</span>. They ensure the terminal works efficiently and provide essential data for system optimization.
              </p>
            </div>
          </CardContent>
          <div className="h-2 w-full bg-gradient-to-r from-primary via-accent to-blue-400"></div>
        </Card>
      </motion.div>

      <section className="space-y-8">
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

      <motion.div variants={itemVariants} initial="hidden" animate="visible">
        <Card className="border-none ring-1 ring-primary/10 shadow-3xl rounded-[3rem] overflow-hidden bg-primary/5 relative text-left">
          <CardContent className="p-8 sm:p-12 space-y-8 relative z-10 text-left">
            <h3 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
                <ExternalLink className="h-6 w-6 text-primary" />
                3. Third-Party Cookies (Advertising)
            </h3>
            <div className="space-y-6 text-sm sm:text-base text-muted-foreground font-medium leading-relaxed">
                <p>
                    We use third-party advertising services, such as <span className="text-foreground font-bold">Google AdSense</span>, to serve relevant statutory news and institutional content. These companies may use generalized metadata about your visits to provide advertisements about legal services of interest to you.
                </p>
                <div className="p-6 rounded-2xl bg-background border border-primary/5 space-y-4 shadow-inner">
                    <p className="font-bold text-foreground">Opt-Out Protocol:</p>
                    <p className="text-xs">
                        You may opt out of personalized advertising by visiting Google's Ads Settings or utilizing the industry-standard opt-out nodes at www.aboutads.info/choices.
                    </p>
                </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <section className="grid gap-8 sm:grid-cols-2">
          <Card className="rounded-[2.5rem] border-primary/5 bg-muted/30 p-8 sm:p-10 space-y-6 text-left">
              <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
                  <MousePointer2 className="h-5 w-5 text-primary" />
                  4. Your Choices
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed">
                  You maintain sovereign authority over your cookies. You can delete all files already on your computer and set most browsers to prevent them from being placed via your console settings.
              </p>
          </Card>
          <Card className="rounded-[2.5rem] border-primary/5 bg-muted/30 p-8 sm:p-10 space-y-6 text-left">
              <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
                  <HistoryIcon className="h-5 w-5 text-primary" />
                  5. Policy Changes
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed">
                  We update this protocol periodically to reflect technological amendments. Any modifications will be broadcasted on this terminal immediately upon synchronization.
              </p>
          </Card>
      </section>

      <motion.div variants={itemVariants} initial="hidden" animate="visible" className="pt-10">
        <Card className="border-none shadow-2xl rounded-[3rem] bg-card/40 backdrop-blur-xl p-8 sm:p-12 text-center">
            <div className="max-w-xl mx-auto space-y-8">
                <div className="p-4 bg-primary/10 rounded-2xl w-fit mx-auto">
                    <Mail className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-3xl font-black tracking-tighter uppercase">6. Contact Us</h3>
                    <p className="text-sm text-muted-foreground font-bold">Statutory Inquiry Desk</p>
                </div>
                <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10">
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Email Protocol</p>
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
