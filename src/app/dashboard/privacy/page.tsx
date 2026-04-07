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
  Trash2,
  ListRestart,
  Scale,
  Globe,
  BellRing,
  Clock,
  ExternalLink,
  ShieldAlert,
  History,
  Bot,
  Zap,
  Activity
} from "lucide-react";
import { motion } from "framer-motion";
import { Logo } from "@/components/logo";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const summaryPoints = [
  {
    title: "Forensic Collection",
    desc: "We collect legal data nodes like voice narration, PDFs, and identity markers for AI auditing.",
    icon: Database,
    color: "text-blue-500",
    bg: "bg-blue-500/10"
  },
  {
    title: "Zero Sale Protocol",
    desc: "We strictly avoid selling citizen data nodes. We are not an advertising platform; we are a legal terminal.",
    icon: Lock,
    color: "text-purple-500",
    bg: "bg-purple-500/10"
  },
  {
    title: "Neural Safety",
    desc: "Your data is processed in isolated AI execution environments and purged from buffers post-audit.",
    icon: Cpu,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10"
  }
];

const toc = [
  { id: "section-1", title: "1. What information do we collect?" },
  { id: "section-2", title: "2. How do we process your information?" },
  { id: "section-3", title: "3. What legal bases do we rely on?" },
  { id: "section-4", title: "4. When and with whom do we share info?" },
  { id: "section-5", title: "5. Stance on third-party websites" },
  { id: "section-6", title: "6. Artificial Intelligence products" },
  { id: "section-7", title: "7. Handling social logins" },
  { id: "section-8", title: "8. Data retention period" },
  { id: "section-9", title: "9. Collection from minors" },
  { id: "section-10", title: "10. Your privacy rights" },
  { id: "section-11", title: "11. Do-Not-Track features" },
  { id: "section-12", title: "12. US State privacy rights" },
  { id: "section-13", title: "13. Indian resident rights (DPDP Act)" },
  { id: "section-14", title: "14. Updates to this notice" },
  { id: "section-15", title: "15. Contact us" },
  { id: "section-16", title: "16. Review or delete your data" }
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
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
                Nyaya Sahayak operates on a <span className="text-foreground font-bold">Zero-Sale Commitment.</span> We do not monetize citizen data nodes. This protocol is engineered to ensure 100% statutory transparency and global compliance.
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
            <Card className="h-full border-primary/5 bg-card/30 hover:bg-card/50 transition-all duration-500 rounded-[2rem] shadow-lg group">
              <CardContent className="p-8 space-y-4 text-left">
                <div className={cn(point.bg, "p-3 rounded-xl w-fit shadow-xl transition-transform group-hover:scale-110", point.color)}>
                  <point.icon className="h-5 w-5" />
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
                <aside className="lg:col-span-4 bg-primary/5 p-8 border-r border-primary/5 hidden lg:block sticky top-0 h-fit">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-6 flex items-center gap-2">
                        <Info className="h-4 w-4" /> Quick Index
                    </h3>
                    <div className="space-y-2">
                        {toc.map((item, i) => (
                            <button 
                                key={i} 
                                onClick={() => scrollToSection(item.id)}
                                className="flex items-center gap-2 p-2 rounded-lg hover:bg-white dark:hover:bg-black transition-all w-full text-left group"
                            >
                                <ChevronRight className="h-3 w-3 text-primary/40 group-hover:translate-x-1 transition-all" />
                                <span className="text-[10px] font-bold text-muted-foreground group-hover:text-primary transition-colors truncate">{item.title}</span>
                            </button>
                        ))}
                    </div>
                </aside>
                <div className="lg:col-span-8 p-8 sm:p-12 h-[700px] overflow-y-auto custom-scrollbar bg-background/50">
                    <div className="space-y-24 text-left pb-20">
                        
                        {/* Section 1 */}
                        <section id="section-1" className="space-y-6 scroll-mt-10">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500 shadow-sm"><Database className="h-6 w-6" /></div>
                                <h4 className="text-xl font-black tracking-tight text-primary uppercase">1. WHAT INFORMATION DO WE COLLECT?</h4>
                            </div>
                            <div className="space-y-6 text-sm text-muted-foreground font-medium leading-relaxed">
                                <div className="space-y-3">
                                    <p className="font-bold text-foreground uppercase tracking-widest text-[10px] border-l-2 border-primary pl-3">Personal information you disclose to us</p>
                                    <p>We collect personal information that you voluntarily provide to us when you enroll in the Nyaya Sahayak terminal, express an interest in obtaining forensic legal audits, or otherwise communicate with our node.</p>
                                </div>
                                
                                <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 space-y-4">
                                    <p className="font-black text-[10px] uppercase tracking-widest text-primary">Identity Registry Nodes:</p>
                                    <ul className="text-xs space-y-2 list-disc pl-4 opacity-80">
                                        <li>Legal Names and Institutional Identifiers</li>
                                        <li>Verified Email Nodes and Mobile Contact Links</li>
                                        <li>Professional Credentials (for Advocate Directory Ingress)</li>
                                        <li>Authentication Hashes (Passwords)</li>
                                    </ul>
                                </div>

                                <div className="space-y-3 pt-4">
                                    <p className="font-bold text-foreground uppercase tracking-widest text-[10px] border-l-2 border-indigo-500 pl-3">Forensic AI Case Data</p>
                                    <p>To provide high-fidelity legal intelligence, we process the following data nodes:</p>
                                    <ul className="space-y-3">
                                        <li className="flex gap-3 p-3 bg-muted/20 rounded-xl">
                                            <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0"></div>
                                            <span><strong>Voice Narration:</strong> Audio frequency data transmitted for forensic transcription and case mapping.</span>
                                        </li>
                                        <li className="flex gap-3 p-3 bg-muted/20 rounded-xl">
                                            <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0"></div>
                                            <span><strong>Statutory Instruments:</strong> PDFs and images processed through OCR nodes to identify clauses and risks.</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* Section 6 */}
                        <section id="section-6" className="space-y-6 scroll-mt-10">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-500 shadow-sm"><Cpu className="h-6 w-6" /></div>
                                <h4 className="text-xl font-black tracking-tight text-primary uppercase">6. ARTIFICIAL INTELLIGENCE PRODUCTS</h4>
                            </div>
                            <div className="space-y-6 text-sm text-muted-foreground font-medium leading-relaxed">
                                <div className="p-8 bg-cyan-500/[0.03] rounded-[2.5rem] border border-cyan-500/10 space-y-6 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-700">
                                        <Bot className="h-40 w-40" />
                                    </div>
                                    <div className="flex items-center gap-3 text-cyan-600">
                                        <Sparkles className="h-4 w-4 animate-pulse" />
                                        <span className="font-black text-[9px] uppercase tracking-[0.3em]">Neural Security Protocol</span>
                                    </div>
                                    <p>Nyaya Sahayak utilize the <strong>Nyaya Mitra</strong> neural engine powered by Google Gemini. This processing is strictly ephemeral for forensic audit tools:</p>
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div className="p-4 bg-background/50 rounded-xl border border-cyan-500/10 text-[11px] leading-relaxed">
                                            <strong>Zero-Training:</strong> Your uploaded case files and audio narrations are NOT used to train foundation AI models.
                                        </div>
                                        <div className="p-4 bg-background/50 rounded-xl border border-cyan-500/10 text-[11px] leading-relaxed">
                                            <strong>Automated Purge:</strong> Data nodes are erased from neural processing buffers immediately after the report generation cycle.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Section 13 */}
                        <section id="section-13" className="space-y-6 scroll-mt-10">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-2xl bg-orange-500/10 text-orange-500 shadow-sm"><Scale className="h-6 w-6" /></div>
                                <h4 className="text-xl font-black tracking-tight text-primary uppercase">13. INDIAN RESIDENTS RIGHTS (DPDP ACT)</h4>
                            </div>
                            <div className="space-y-6 text-sm text-muted-foreground font-medium leading-relaxed">
                                <p>Under the <strong>Digital Personal Data Protection Act, 2023 (DPDP Act)</strong>, Indian residents (Data Principals) have the following rights at the Nyaya Sahayak terminal:</p>
                                <ul className="grid gap-4 sm:grid-cols-2 list-none p-0">
                                    {[
                                        "Obtain a summary of data being processed.",
                                        "Request correction and erasure of registry records.",
                                        "Access grievance redressal via our Grievance Officer.",
                                        "Nominate individuals to manage your node in incapacity.",
                                        "Withdraw consent for neural processing nodes."
                                    ].map((right, i) => (
                                        <li key={i} className="p-4 border rounded-xl bg-muted/10 font-black text-[9px] uppercase tracking-tight flex items-center gap-3 shadow-sm hover:bg-orange-500/[0.02] transition-colors group">
                                            <CheckCircle2 className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
                                            {right}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </section>

                        {/* Section 15 */}
                        <section id="section-15" className="space-y-8 pt-10 border-t border-primary/5 scroll-mt-10">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500 shadow-sm"><BellRing className="h-6 w-6" /></div>
                                <h4 className="text-xl font-black tracking-tight uppercase">15. HOW CAN YOU CONTACT US?</h4>
                            </div>
                            <div className="grid gap-8 sm:grid-cols-2">
                                <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 space-y-4">
                                    <div className="flex items-center gap-2 text-primary">
                                        <Mail className="h-4 w-4" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Audit Registry Node</span>
                                    </div>
                                    <p className="text-xs font-black select-all">nyayasahayakhelp@gmail.com</p>
                                </div>
                                <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 space-y-4">
                                    <div className="flex items-center gap-2 text-primary">
                                        <MapPin className="h-4 w-4" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Statutory Node Address</span>
                                    </div>
                                    <p className="text-[11px] font-bold leading-relaxed">
                                        Nyaya Sahayak Terminal<br />
                                        Bariya Chowk, Daltonganj<br />
                                        Jharkhand 822101, India
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Section 16 */}
                        <section id="section-16" className="space-y-6 scroll-mt-10">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-2xl bg-red-500/10 text-red-500 shadow-sm"><Trash2 className="h-6 w-6" /></div>
                                <h4 className="text-xl font-black tracking-tight text-primary uppercase">16. REVIEW OR DELETE DATA</h4>
                            </div>
                            <div className="space-y-4">
                                <p className="text-sm text-muted-foreground leading-relaxed">Users maintain sovereign authority over their registry nodes. You can initiate a <strong>"Total Registry Erasure"</strong> through your profile terminal settings. Associated data will be purged from production nodes within 30 statutory days.</p>
                                <div className="bg-destructive/5 border border-destructive/10 p-4 rounded-xl flex gap-4 items-start shadow-inner">
                                    <ShieldAlert className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                                    <p className="text-[10px] font-bold text-destructive/80 uppercase leading-relaxed tracking-tight">
                                        WARNING: Executing "Total Registry Erasure" is irreversible and will result in the immediate decommissioning of all saved forensic audits and case trackers.
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
