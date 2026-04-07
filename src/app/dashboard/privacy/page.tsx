"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ShieldCheck, 
  Lock, 
  Database, 
  Cpu, 
  Fingerprint,
  Info,
  ChevronRight,
  Mail,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";
import { Logo } from "@/components/logo";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const summaryPoints = [
  {
    title: "Data Collection",
    desc: "We collect info you give us like name and email, and technical data like IP address when you visit.",
    icon: Database,
    color: "text-blue-500",
    bg: "bg-blue-500/10"
  },
  {
    title: "No Sensitive Data",
    desc: "We do NOT process sensitive info like religious beliefs or sexual orientation.",
    icon: Lock,
    color: "text-purple-500",
    bg: "bg-purple-500/10"
  },
  {
    title: "AI Security",
    desc: "Your data is used by AI nodes to help you, protected by high-grade encryption.",
    icon: Cpu,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10"
  }
];

const toc = [
  "1. What information do we collect?",
  "2. How do we process your information?",
  "3. What legal bases do we rely on?",
  "4. When and with whom do we share info?",
  "5. Stance on third-party websites",
  "6. Artificial Intelligence products",
  "7. Handling social logins",
  "8. Data retention period",
  "9. Collection from minors",
  "10. Your privacy rights",
  "11. Do-Not-Track features",
  "12. US State privacy rights",
  "13. Indian resident rights (DPDP Act)",
  "14. Updates to this notice",
  "15. Contact us",
  "16. Review or delete your data"
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
};

export default function PrivacyPage() {
  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-5xl mx-auto space-y-10 pb-20 px-2 sm:px-6 text-left"
    >
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 border-b border-primary/5 pb-8">
        <PageHeader
          title="Privacy Protocol"
          description="Detailed statutory guidelines on how we process and safeguard your information within the nyayasahayak.in terminal."
        />
        <Badge variant="outline" className="font-black text-[9px] uppercase tracking-widest bg-primary/5 text-primary border-primary/10 px-4 py-1.5 rounded-full">Secure Registry Node</Badge>
      </motion.div>

      {/* Hero Security Card */}
      <motion.div variants={itemVariants}>
        <Card className="border-none ring-1 ring-primary/10 shadow-3xl rounded-[3rem] overflow-hidden bg-card/40 backdrop-blur-xl relative">
          <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none grayscale">
            <Logo className="h-64 w-64" />
          </div>
          <CardContent className="p-8 sm:p-12 relative z-10 text-left space-y-6">
            <div className="flex items-center gap-3 text-primary mb-2">
              <div className="bg-primary/10 p-2.5 rounded-xl shadow-inner">
                <Fingerprint className="h-6 w-6" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Institutional Data Mandate</span>
            </div>
            <div className="space-y-6 max-w-4xl">
              <h2 className="text-3xl sm:text-5xl font-black tracking-tighter leading-[0.9] uppercase text-foreground">
                Your Data is Your <br />
                <span className="text-primary italic">Sovereign Asset.</span>
              </h2>
              <p className="text-sm sm:text-xl text-muted-foreground font-medium leading-relaxed">
                Nyaya Sahayak operates on a <span className="text-foreground font-bold">Zero-Sale Commitment.</span> We do not monetize user data. This protocol is designed to ensure 100% statutory transparency and compliance with global standards.
              </p>
            </div>
          </CardContent>
          <div className="h-2 w-full bg-gradient-to-r from-primary via-accent to-blue-400"></div>
        </Card>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid gap-6 sm:grid-cols-3">
        {summaryPoints.map((point, idx) => (
          <motion.div key={idx} variants={itemVariants}>
            <Card className="h-full border-primary/5 bg-card/30 hover:bg-card/50 transition-all duration-500 rounded-[2rem] shadow-lg">
              <CardContent className="p-8 space-y-4 text-left">
                <div className={cn(point.bg, "p-3 rounded-xl w-fit shadow-xl")}>
                  <point.icon className={cn(point.color, "h-5 w-5")} />
                </div>
                <h3 className="text-xs font-black tracking-tight uppercase leading-tight">{point.title}</h3>
                <p className="text-[11px] text-muted-foreground leading-relaxed font-medium">
                  {point.desc}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Full Document Area */}
      <motion.div variants={itemVariants} className="pt-10">
        <Card className="border-primary/5 bg-muted/10 rounded-[3rem] overflow-hidden">
            <div className="grid lg:grid-cols-12">
                <aside className="lg:col-span-4 bg-primary/5 p-8 border-r border-primary/5">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-6 flex items-center gap-2">
                        <Info className="h-4 w-4" /> Quick Index
                    </h3>
                    <div className="space-y-2">
                        {toc.map((item, i) => (
                            <div key={i} className="flex items-center gap-2 p-2 rounded-lg hover:bg-white dark:hover:bg-black transition-all cursor-pointer group">
                                <ChevronRight className="h-3 w-3 text-primary/40 group-hover:translate-x-1 transition-all" />
                                <span className="text-[10px] font-bold text-muted-foreground group-hover:text-primary transition-colors truncate">{item}</span>
                            </div>
                        ))}
                    </div>
                </aside>
                <div className="lg:col-span-8 p-8 sm:p-12 h-[600px] overflow-y-auto custom-scrollbar bg-background/50">
                    <div className="space-y-12 text-left">
                        <section className="space-y-4">
                            <h4 className="text-xl font-black tracking-tight text-primary">1. WHAT INFORMATION DO WE COLLECT?</h4>
                            <p className="text-sm text-muted-foreground leading-loose">We collect personal information that you voluntarily provide to us when you register on Nyaya Sahayak, express an interest in obtaining information about us or our products and Services, when you participate in activities on the Services, or otherwise when you contact us. This includes: names, email addresses, usernames, passwords, and contact preferences.</p>
                        </section>

                        <section className="space-y-4">
                            <h4 className="text-xl font-black tracking-tight text-primary">6. ARTIFICIAL INTELLIGENCE PRODUCTS</h4>
                            <p className="text-sm text-muted-foreground leading-loose">As part of our Services, Nyaya Sahayak offers features powered by artificial intelligence (AI). We provide these through providers like Google Cloud AI. Your input and output data will be shared with these providers strictly to enable bot functionality, governed by this Privacy Notice.</p>
                        </section>

                        <section className="space-y-6">
                            <h4 className="text-xl font-black tracking-tight text-primary">12. DO UNITED STATES RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?</h4>
                            <div className="space-y-6 text-sm text-muted-foreground leading-loose">
                                <p>If you are a resident of California, Colorado, Connecticut, Delaware, Florida, Indiana, Iowa, Kentucky, Maryland, Minnesota, Montana, Nebraska, New Hampshire, New Jersey, Oregon, Rhode Island, Tennessee, Texas, Utah, or Virginia, you may have specific rights regarding your personal data.</p>
                                
                                <div className="overflow-x-auto rounded-xl border border-primary/10 bg-background/50">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-primary/5">
                                            <tr>
                                                <th className="p-3 font-black uppercase text-[9px]">Category</th>
                                                <th className="p-3 font-black uppercase text-[9px]">Examples</th>
                                                <th className="p-3 font-black uppercase text-[9px]">Collected</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-primary/5">
                                            {[
                                                { cat: "A. Identifiers", ex: "Real name, alias, postal address, phone, unique ID, IP, email", coll: "YES" },
                                                { cat: "B. Personal Info", ex: "Name, contact info, education, employment, financial info", coll: "YES" },
                                                { cat: "F. Internet Activity", ex: "Browsing history, search history, online behavior", coll: "YES" },
                                                { cat: "G. Geolocation", ex: "Device location", coll: "YES" },
                                                { cat: "H. Audio/Sensory", ex: "Images and audio, video recordings", coll: "YES" },
                                                { cat: "K. Inferences", ex: "Inferences drawn to create profile preferences", coll: "YES" }
                                            ].map((row, i) => (
                                                <tr key={i}>
                                                    <td className="p-3 text-[10px] font-bold text-foreground">{row.cat}</td>
                                                    <td className="p-3 text-[10px]">{row.ex}</td>
                                                    <td className="p-3 text-[10px] font-black text-primary">{row.coll}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="space-y-3">
                                    <p className="font-black text-foreground uppercase tracking-widest text-[9px]">Your Rights</p>
                                    <ul className="grid gap-2 list-none p-0">
                                        {[
                                            "Right to know whether or not we are processing your personal data",
                                            "Right to access your personal data",
                                            "Right to correct inaccuracies in your personal data",
                                            "Right to request the deletion of your personal data",
                                            "Right to non-discrimination for exercising your rights",
                                            "Right to opt out of the sale of personal data or profiling"
                                        ].map((r, i) => (
                                            <li key={i} className="flex items-start gap-2">
                                                <CheckCircle2 className="h-3.5 w-3.5 text-primary mt-0.5" />
                                                <span className="text-[11px] font-medium">{r}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h4 className="text-xl font-black tracking-tight text-primary">13. INDIAN RESIDENTS RIGHTS (DPDP ACT)</h4>
                            <div className="space-y-4 text-sm text-muted-foreground leading-loose">
                                <p>Under the DPDP Act 2023, Indian residents have the right to:</p>
                                <ul className="space-y-3">
                                    {[
                                        "Obtain a summary of personal data being processed.",
                                        "Request correction, completion, and erasure of data.",
                                        "Have grievances redressed by our Grievance Officer.",
                                        "Nominate another individual to exercise your rights in event of death.",
                                        "Withdraw your consent at any time."
                                    ].map((li, i) => (
                                        <li key={i} className="flex gap-3 items-start">
                                            <CheckCircle2 className="h-4 w-4 text-primary mt-1 shrink-0" />
                                            <span className="text-xs font-bold uppercase tracking-tight">{li}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </section>

                        <section className="space-y-6 pt-10 border-t border-primary/5">
                            <h4 className="text-xl font-black tracking-tight">15. HOW CAN YOU CONTACT US?</h4>
                            <div className="grid gap-6 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-primary">
                                        <Mail className="h-4 w-4" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Support Email</span>
                                    </div>
                                    <p className="text-xs font-bold">nyayasahayakhelp@gmail.com</p>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-primary">
                                        <MapPin className="h-4 w-4" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Mailing Address</span>
                                    </div>
                                    <p className="text-xs font-bold leading-relaxed">
                                        Nyaya Sahayak Terminal<br />
                                        Bariya Chowk, Daltonganj<br />
                                        Jharkhand 822101, India
                                    </p>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </Card>
      </motion.div>

      <div className="text-center pt-8 opacity-30">
          <p className="text-[9px] font-black uppercase tracking-[0.6em] text-muted-foreground">NYAYASAHAYAK.IN // MEMORY PROTOCOL // 2025</p>
      </div>
    </motion.div>
  );
}
