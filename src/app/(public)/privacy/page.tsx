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
      className="max-w-5xl mx-auto space-y-12 pb-32 px-4 sm:px-6 text-left"
    >
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 border-b border-primary/5 pb-8">
        <PageHeader
          title="Privacy Policy"
          description="Last updated: June 23, 2025. This notice explains how we handle your information at Nyaya Sahayak."
        />
        <Badge variant="outline" className="font-black text-[9px] uppercase tracking-widest bg-primary/5 text-primary border-primary/10 px-4 py-1.5 rounded-full">Protocol NS-PRIV-2025</Badge>
      </motion.div>

      {/* Intro Card */}
      <motion.div variants={itemVariants}>
        <Card className="border-none ring-1 ring-primary/10 shadow-3xl rounded-[2.5rem] overflow-hidden bg-card/40 backdrop-blur-xl relative">
          <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none grayscale">
            <Logo className="h-64 w-64" />
          </div>
          <CardContent className="p-8 sm:p-12 relative z-10 text-left space-y-6">
            <div className="flex items-center gap-3 text-primary mb-2">
              <div className="bg-primary/10 p-2.5 rounded-xl shadow-inner">
                <Fingerprint className="h-6 w-6" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Our Commitment</span>
            </div>
            <p className="text-sm sm:text-lg text-muted-foreground font-medium leading-relaxed max-w-3xl">
              This Privacy Notice for <span className="text-foreground font-bold">Nyaya Sahayak</span> ("we," "us," or "our"), describes how and why we might access, collect, store, use, and/or share ("process") your personal information when you use our services at <span className="text-primary font-bold">nyayasahayak.in</span>.
            </p>
            <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 flex items-start gap-4">
                <Info className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <p className="text-xs font-medium text-muted-foreground italic">
                    "If you do not agree with our policies and practices, please do not use our Services. Questions? Contact us at nyayasahayakhelp@gmail.com."
                </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Summary Section */}
      <section className="space-y-8">
        <div className="flex items-center gap-3">
            <div className="h-1 w-8 bg-primary rounded-full" />
            <h2 className="text-xl font-black uppercase tracking-tighter">Key Summary Points</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
            {summaryPoints.map((point, idx) => (
                <Card key={idx} className="border-primary/5 bg-muted/20 rounded-[2rem] hover:bg-primary/[0.02] transition-all">
                    <CardContent className="p-8 space-y-4">
                        <div className={cn("p-3 rounded-xl w-fit shadow-sm", point.bg, point.color)}>
                            <point.icon className="h-5 w-5" />
                        </div>
                        <h3 className="font-black text-xs uppercase tracking-widest">{point.title}</h3>
                        <p className="text-[11px] font-medium text-muted-foreground leading-relaxed">{point.desc}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
      </section>

      {/* Table of Contents */}
      <motion.div variants={itemVariants} className="space-y-6">
        <div className="flex items-center gap-3">
            <div className="h-1 w-8 bg-primary rounded-full" />
            <h2 className="text-xl font-black uppercase tracking-tighter">Table of Contents</h2>
        </div>
        <Card className="border-primary/5 bg-background shadow-inner rounded-[2rem] p-8">
            <div className="grid sm:grid-cols-2 gap-x-12 gap-y-3">
                {toc.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 group cursor-pointer hover:text-primary transition-colors">
                        <ChevronRight className="h-3 w-3 text-primary/40 group-hover:translate-x-1 transition-transform" />
                        <span className="text-[11px] font-bold uppercase tracking-tight opacity-70">{item}</span>
                    </div>
                ))}
            </div>
        </Card>
      </motion.div>

      {/* Full Document Sections */}
      <div className="space-y-16 pt-10 border-t border-primary/5">
        
        <section className="space-y-6">
            <h3 className="text-2xl font-black tracking-tight text-primary">1. WHAT INFORMATION DO WE COLLECT?</h3>
            <div className="space-y-4 text-sm sm:text-base text-muted-foreground font-medium leading-loose">
                <p className="font-black text-foreground uppercase tracking-widest text-[10px]">Personal information you disclose to us</p>
                <p>We collect personal information that you voluntarily provide to us when you register on Nyaya Sahayak, express an interest in obtaining information about us or our products and Services, when you participate in activities on the Services, or otherwise when you contact us.</p>
                <p>The personal information we collect may include: names, email addresses, usernames, passwords, and contact preferences.</p>
                
                <p className="font-black text-foreground uppercase tracking-widest text-[10px] pt-4">Information automatically collected</p>
                <p>We automatically collect certain information when you visit, use, or navigate nyayasahayak.in. This includes device and usage information, such as your IP address, browser and device characteristics, operating system, language preferences, and referral URLs. This data is primarily used for the security and operation of our Services.</p>
            </div>
        </section>

        <section className="space-y-6">
            <h3 className="text-2xl font-black tracking-tight text-primary">6. DO WE OFFER ARTIFICIAL INTELLIGENCE-BASED PRODUCTS?</h3>
            <div className="space-y-4 text-sm sm:text-base text-muted-foreground font-medium leading-loose">
                <p>Nyaya Sahayak offers products, features, or tools powered by artificial intelligence (collectively, "AI Products"). These tools are designed to enhance your experience and provide you with innovative solutions.</p>
                <div className="p-6 bg-primary/5 rounded-[2rem] border border-primary/10">
                    <p className="font-bold text-foreground mb-3">Use of AI Technologies</p>
                    <p>We provide the AI Products through third-party service providers, including Google Cloud AI. Your input and output data will be shared with and processed by these providers strictly to enable bot functionality, governed by this Privacy Notice.</p>
                </div>
            </div>
        </section>

        <section className="space-y-6">
            <h3 className="text-2xl font-black tracking-tight text-primary">12. DO UNITED STATES RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?</h3>
            <div className="space-y-6 text-sm sm:text-base text-muted-foreground font-medium leading-loose">
                <p>If you are a resident of California, Colorado, Connecticut, Delaware, Florida, Indiana, Iowa, Kentucky, Maryland, Minnesota, Montana, Nebraska, New Hampshire, New Jersey, Oregon, Rhode Island, Tennessee, Texas, Utah, or Virginia, you may have specific rights regarding your personal information.</p>
                
                <div className="overflow-x-auto rounded-2xl border border-primary/10 bg-muted/20">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-primary/5">
                                <th className="p-4 font-black uppercase text-[10px]">Category</th>
                                <th className="p-4 font-black uppercase text-[10px]">Examples</th>
                                <th className="p-4 font-black uppercase text-[10px]">Collected</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-primary/5">
                            {[
                                { cat: "A. Identifiers", ex: "Real name, alias, postal address, phone, unique ID, IP, email, account name", coll: "YES" },
                                { cat: "B. Personal Info (CA statute)", ex: "Name, contact info, education, employment, financial info", coll: "YES" },
                                { cat: "F. Internet Activity", ex: "Browsing history, search history, online behavior, site interactions", coll: "YES" },
                                { cat: "G. Geolocation Data", ex: "Device location", coll: "YES" },
                                { cat: "H. Audio/Sensory", ex: "Images and audio, video or call recordings created for business", coll: "YES" },
                                { cat: "K. Inferences", ex: "Inferences drawn to create a profile about preferences/characteristics", coll: "YES" }
                            ].map((row, i) => (
                                <tr key={i} className="hover:bg-primary/[0.02]">
                                    <td className="p-4 text-[11px] font-bold text-foreground">{row.cat}</td>
                                    <td className="p-4 text-[11px]">{row.ex}</td>
                                    <td className="p-4 text-[11px] font-black text-primary">{row.coll}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="space-y-4">
                    <p className="font-black text-foreground uppercase tracking-widest text-[10px] pt-4">Your Rights Under US State Law</p>
                    <ul className="grid gap-4 sm:grid-cols-2 list-none p-0">
                        {[
                            "Right to know if we process your data",
                            "Right to access your personal data",
                            "Right to correct inaccuracies",
                            "Right to request deletion",
                            "Right to obtain a copy of shared data",
                            "Right to opt out of targeted advertising"
                        ].map((right, i) => (
                            <li key={i} className="p-4 border rounded-xl bg-background font-bold text-[11px] uppercase tracking-tight flex items-center gap-3">
                                <CheckCircle2 className="h-4 w-4 text-primary" />
                                {right}
                            </li>
                        ))}
                    </ul>
                </div>
                
                <p className="text-xs italic bg-amber-500/5 p-4 rounded-xl border border-amber-500/10">
                    California "Shine The Light" Law: California residents may request once a year, free of charge, information about categories of personal information we disclosed to third parties for direct marketing.
                </p>
            </div>
        </section>

        <section className="space-y-6">
            <h3 className="text-2xl font-black tracking-tight text-primary">13. DO INDIAN RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?</h3>
            <div className="space-y-4 text-sm sm:text-base text-muted-foreground font-medium leading-loose">
                <p>Yes, if you are a resident of India, you are granted specific rights under the <span className="text-foreground font-bold">Digital Personal Data Protection Act, 2023 (DPDP Act)</span>.</p>
                <ul className="grid gap-4 sm:grid-cols-2 list-none p-0">
                    {[
                        "Obtain a summary of personal data being processed.",
                        "Request correction, completion, and erasure of data.",
                        "Have grievances redressed by our Grievance Officer.",
                        "Nominate an individual to exercise your rights in case of death.",
                        "Withdraw your consent at any time."
                    ].map((right, i) => (
                        <li key={i} className="p-4 border rounded-xl bg-muted/10 font-bold text-xs uppercase tracking-tight">{right}</li>
                    ))}
                </ul>
            </div>
        </section>

        <section className="space-y-8 pt-10 border-t border-primary/5">
            <div className="flex flex-col md:flex-row gap-10">
                <div className="flex-1 space-y-4">
                    <h3 className="text-2xl font-black tracking-tight">15. HOW CAN YOU CONTACT US?</h3>
                    <p className="text-sm text-muted-foreground leading-loose">If you have questions or comments about this notice, you may email us at nyayasahayakhelp@gmail.com or contact us by post.</p>
                </div>
                <div className="w-full md:w-96 space-y-4">
                    <Card className="p-8 bg-primary/5 border-primary/10 rounded-[2rem] shadow-inner text-left">
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <MapPin className="h-5 w-5 text-primary mt-1 shrink-0" />
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase text-primary tracking-widest">Statutory Address</p>
                                    <p className="text-xs font-bold leading-relaxed">
                                        Nyaya Sahayak Terminal<br />
                                        Bariya Chowk, Daltonganj<br />
                                        Jharkhand 822101, India
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <Mail className="h-5 w-5 text-primary mt-1 shrink-0" />
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase text-primary tracking-widest">Digital Hub</p>
                                    <p className="text-xs font-bold">nyayasahayakhelp@gmail.com</p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </section>

      </div>

      <div className="text-center pt-12 opacity-30">
          <p className="text-[9px] font-black uppercase tracking-[0.6em] text-muted-foreground">NYAYASAHAYAK.IN // TRANSIENCE REGISTRY // 2025</p>
      </div>
    </motion.div>
  );
}
