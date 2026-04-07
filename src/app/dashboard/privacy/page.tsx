
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
  History,
  Trash2,
  Clock,
  Scale,
  BellRing,
  Globe,
  Bot,
  Sparkles,
  Zap,
  Activity,
  Mic,
  RotateCcw,
  Search,
  FileText,
  AlertTriangle,
  Smartphone,
  ShieldAlert,
  Server,
  Share2,
  FileSearch
} from "lucide-react";
import { motion } from "framer-motion";
import { Logo } from "@/components/logo";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const summaryPoints = [
  {
    title: "Forensic Collection",
    desc: "Exhaustive collection of voice frequency data, legal instruments (PDF/OCR), and identity markers for neural audit.",
    icon: Database,
    color: "text-blue-500",
    bg: "bg-blue-500/10"
  },
  {
    title: "Zero-Training AI",
    desc: "Your private case data is processed in ephemeral buffers and is NEVER used to train foundation models.",
    icon: Lock,
    color: "text-purple-500",
    bg: "bg-purple-500/10"
  },
  {
    title: "Statutory Sovereignty",
    desc: "Total control over your registry node, including the right to request summaries or execute irreversible erasure.",
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

export default function PrivacyPage() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20 px-2 sm:px-6 text-left">
      <motion.div 
        initial={{ opacity: 0, y: -10 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 border-b border-primary/5 pb-8 text-left"
      >
        <PageHeader
          title="Privacy Protocol"
          description="Institutional Transparency Node: Detailed guidelines on forensic data handling and statutory compliance for Nyaya Sahayak."
        />
        <Badge variant="outline" className="font-black text-[9px] uppercase tracking-widest bg-primary/5 text-primary border-primary/10 px-4 py-1.5 rounded-full">Secure Registry Node</Badge>
      </motion.div>

      {/* Hero Security Card */}
      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
        <Card className="border-none ring-1 ring-primary/10 shadow-3xl rounded-[3rem] overflow-hidden bg-card/40 backdrop-blur-xl relative text-left">
          <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none grayscale">
            <Logo className="h-64 w-64" />
          </div>
          <CardContent className="p-8 sm:p-16 relative z-10 text-left space-y-6">
            <div className="flex items-center gap-3 text-primary mb-2">
              <div className="bg-primary/10 p-2.5 rounded-xl shadow-inner">
                <Fingerprint className="h-6 w-6" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Institutional Data Mandate</span>
            </div>
            <div className="space-y-6 max-w-4xl">
              <h2 className="text-3xl sm:text-6xl font-black tracking-tighter leading-[0.9] uppercase text-foreground">
                Your Data is Your <br />
                <span className="text-primary italic">Sovereign Asset.</span>
              </h2>
              <p className="text-sm sm:text-xl text-muted-foreground font-medium leading-relaxed text-left">
                Nyaya Sahayak operates on a <span className="text-foreground font-bold">Zero-Sale Commitment.</span> We do not monetize citizen data nodes. This protocol is engineered to ensure 100% statutory transparency and global compliance.
              </p>
            </div>
          </CardContent>
          <div className="h-2 w-full bg-gradient-to-r from-primary via-accent to-blue-400"></div>
        </Card>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid gap-6 sm:grid-cols-3 text-left">
        {summaryPoints.map((point, idx) => (
          <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
            <Card className="h-full border-primary/5 bg-card/30 hover:bg-card/50 transition-all duration-500 rounded-[2rem] shadow-lg group">
              <CardContent className="p-8 space-y-4 text-left">
                <div className={cn(point.bg, "p-3 rounded-xl w-fit shadow-xl transition-transform group-hover:scale-110", point.color)}>
                  <point.icon className="h-5 w-5" />
                </div>
                <h3 className="text-xs font-black tracking-tight uppercase leading-tight text-left">{point.title}</h3>
                <p className="text-[11px] text-muted-foreground leading-relaxed font-medium text-left">
                  {point.desc}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Full Document Area */}
      <div className="pt-10 text-left">
        <Card className="border-primary/5 bg-muted/10 rounded-[3rem] overflow-hidden">
            <div className="grid lg:grid-cols-12">
                <aside className="lg:col-span-4 bg-primary/5 p-8 border-r border-primary/5 hidden lg:block sticky top-0 h-fit text-left">
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
                <div className="lg:col-span-8 p-8 sm:p-12 h-[750px] overflow-y-auto custom-scrollbar bg-background/50 text-left">
                    <div className="space-y-32 text-left pb-20">
                        
                        {/* Section 1 */}
                        <section id="section-1" className="space-y-8 scroll-mt-10 text-left">
                            <div className="flex items-center gap-4">
                                <div className="p-4 rounded-2xl bg-blue-500/10 text-blue-500 shadow-sm"><Database className="h-7 w-7" /></div>
                                <h4 className="text-xl sm:text-2xl font-black tracking-tight text-primary uppercase">1. WHAT INFORMATION DO WE COLLECT?</h4>
                            </div>
                            <div className="space-y-8 text-sm sm:text-base text-muted-foreground font-medium leading-relaxed">
                                <p>Personal information you disclose to us at Nyaya Sahayak is collected with the highest standard of statutory integrity. We collect personal information that you voluntarily provide to us when you register on the terminal, express an interest in obtaining forensic intelligence, or when you participate in community transmissions.</p>
                                
                                <div className="p-8 rounded-[2rem] bg-primary/5 border border-primary/10 space-y-6 shadow-inner text-left">
                                    <p className="font-black text-[10px] uppercase tracking-widest text-primary">Identity Registry Nodes:</p>
                                    <ul className="text-xs space-y-3 list-disc pl-6 opacity-80 font-bold uppercase tracking-tight">
                                        <li>Legal Names and Institutional Identifiers</li>
                                        <li>Verified Email Nodes and Mobile Contact Links</li>
                                        <li>Professional Credentials (for Advocate Directory Ingress)</li>
                                        <li>Authentication Hashes (Bcrypt Salted)</li>
                                    </ul>
                                </div>

                                <div className="space-y-4 pt-4">
                                    <p className="font-bold text-foreground uppercase tracking-widest text-[10px] border-l-4 border-indigo-500 pl-4">Forensic AI Case Data Ingress</p>
                                    <p>To provide high-fidelity legal intelligence, we process the following data nodes using advanced neural ingestion:</p>
                                    <ul className="space-y-6">
                                        <li className="flex gap-5 p-6 bg-muted/30 rounded-[1.5rem] border border-primary/5">
                                            <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-600 shrink-0 h-fit shadow-sm"><Mic className="h-6 w-6" /></div>
                                            <div className="space-y-1 text-left">
                                                <p className="font-black text-xs uppercase tracking-tight text-foreground">Voice Narration & Biometric Frequency</p>
                                                <p className="text-xs leading-relaxed">Audio frequency data transmitted for forensic transcription and case mapping. These recordings are converted to textual dossiers and subsequently purged from neural processing buffers within 24 hours of report generation.</p>
                                            </div>
                                        </li>
                                        <li className="flex gap-5 p-6 bg-muted/30 rounded-[1.5rem] border border-primary/5">
                                            <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-600 shrink-0 h-fit shadow-sm"><FileText className="h-6 w-6" /></div>
                                            <div className="space-y-1 text-left">
                                                <p className="font-black text-xs uppercase tracking-tight text-foreground">Statutory Instruments (OCR)</p>
                                                <p className="text-xs leading-relaxed">Legal documents processed through OCR nodes to identify risks, unfavourable clauses, and critical judicial deadlines. Data is tokenized for neural analysis and never stored in raw form.</p>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* Section 2 */}
                        <section id="section-2" className="space-y-8 scroll-mt-10 text-left">
                            <div className="flex items-center gap-4">
                                <div className="p-4 rounded-2xl bg-indigo-500/10 text-indigo-500 shadow-sm"><Server className="h-7 w-7" /></div>
                                <h4 className="text-xl sm:text-2xl font-black tracking-tight text-primary uppercase">2. HOW DO WE PROCESS YOUR INFORMATION?</h4>
                            </div>
                            <div className="space-y-8 text-sm text-muted-foreground font-medium leading-relaxed">
                                <p>Nyaya Sahayak utilizes a multi-stage processing pipeline to transform raw data into statutory intelligence. Our processing flows are strictly reserved for institutional purposes:</p>
                                <div className="grid gap-6 sm:grid-cols-2 text-left">
                                    <div className="p-8 rounded-[2.5rem] border border-primary/5 bg-primary/[0.02] space-y-4 shadow-sm">
                                        <CheckCircle2 className="h-6 w-6 text-primary" />
                                        <p className="font-black text-sm uppercase tracking-widest text-foreground">Secure Storage Nodes</p>
                                        <p className="text-xs opacity-70 leading-relaxed">Your profile and case metadata are stored in highly secure, encrypted Firebase Cloud nodes. These nodes are distributed across global Tier-4 data centers with 99.99% durability guarantees.</p>
                                    </div>
                                    <div className="p-8 rounded-[2.5rem] border border-primary/5 bg-primary/[0.02] space-y-4 shadow-sm">
                                        <Cpu className="h-6 w-6 text-primary" />
                                        <p className="font-black text-sm uppercase tracking-widest text-foreground">Neural Case Summarization</p>
                                        <p className="text-xs opacity-70 leading-relaxed">Converting voice narrations into structured legal reports with BNS section references and jurisdictional guidance based on Indian judicial standards.</p>
                                    </div>
                                </div>
                                <p>Telemetry data is stripped of all PII (Personally Identifiable Information) before being ingested by our performance auditing systems to ensure terminal stability.</p>
                            </div>
                        </section>

                        {/* Section 4 */}
                        <section id="section-4" className="space-y-8 scroll-mt-10 text-left">
                            <div className="flex items-center gap-4">
                                <div className="p-4 rounded-2xl bg-cyan-500/10 text-cyan-500 shadow-sm"><Share2 className="h-7 w-7" /></div>
                                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">4. WHEN AND WITH WHOM DO WE SHARE INFO?</h3>
                            </div>
                            <div className="space-y-8 text-sm sm:text-base text-muted-foreground font-medium leading-relaxed">
                                <p>Nyaya Sahayak operates on a strict **Zero-Sale Node.** We do NOT sell citizen data to third-party brokers. We only transmit data to verified sub-processors necessary for terminal operation:</p>
                                <ul className="space-y-6">
                                    <li className="flex gap-6 p-8 bg-cyan-500/[0.03] border border-cyan-500/10 rounded-[2.5rem] shadow-xl">
                                        <div className="p-4 rounded-2xl bg-white dark:bg-black/20 shadow-md h-fit"><Bot className="h-8 w-8 text-cyan-600" /></div>
                                        <div className="space-y-2 text-left">
                                            <p className="font-black text-sm uppercase text-foreground">AI Neural Sub-processors (Google Cloud AI)</p>
                                            <p className="text-xs leading-relaxed font-medium opacity-70">We transmit case narratives and document nodes to Google Cloud AI hubs for forensic analysis. This transmission occurs within a secure TLS 1.3 tunnel. Google does not utilize this data to train foundation models.</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-6 p-8 bg-cyan-500/[0.03] border border-cyan-500/10 rounded-[2.5rem] shadow-xl">
                                        <div className="p-4 rounded-2xl bg-white dark:bg-black/20 shadow-md h-fit"><Database className="h-8 w-8 text-cyan-600" /></div>
                                        <div className="space-y-2 text-left">
                                            <p className="font-black text-sm uppercase text-foreground">Statutory Cloud Infrastructure (Firebase)</p>
                                            <p className="text-xs leading-relaxed font-medium opacity-70">Persistent identity nodes and tracked case metadata are stored in Firebase. This infrastructure is protected by Enterprise-grade security policies and AES-256 at-rest encryption.</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </section>

                        {/* Section 6 */}
                        <section id="section-6" className="space-y-10 scroll-mt-10 text-left">
                            <div className="flex items-center gap-4">
                                <div className="p-4 rounded-2xl bg-cyan-500/10 text-cyan-500 shadow-sm"><Bot className="h-7 w-7" /></div>
                                <h4 className="text-xl sm:text-2xl font-black tracking-tight text-primary uppercase">6. DO WE OFFER ARTIFICIAL INTELLIGENCE-BASED PRODUCTS?</h4>
                            </div>
                            <div className="space-y-8 text-sm text-muted-foreground font-medium leading-relaxed">
                                <div className="p-10 bg-cyan-500/[0.03] rounded-[3rem] border border-cyan-500/10 space-y-8 relative overflow-hidden group shadow-2xl text-left">
                                    <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-1000">
                                        <Bot className="h-64 w-64" />
                                    </div>
                                    <div className="relative z-10 space-y-8">
                                        <div className="flex items-center gap-3 text-cyan-600">
                                            <Sparkles className="h-5 w-5 animate-pulse" />
                                            <span className="font-black text-xs uppercase tracking-[0.3em]">Neural Security Protocol</span>
                                        </div>
                                        <p className="text-base sm:text-lg leading-relaxed">Nyaya Sahayak utilizes the <strong>Nyaya Mitra</strong> neural engine. This processing is strictly ephemeral for forensic audit tools:</p>
                                        <div className="grid sm:grid-cols-2 gap-6 pt-4 text-left">
                                            <div className="p-6 bg-background/80 backdrop-blur-md rounded-2xl border border-cyan-500/10 text-[11px] leading-relaxed shadow-inner">
                                                <Zap className="h-4 w-4 text-cyan-500 mb-2" />
                                                <strong className="block mb-1 text-foreground">Zero-Training Guarantee:</strong> 
                                                Your uploaded case files and audio narrations are NOT used to train foundation AI models.
                                            </div>
                                            <div className="p-6 bg-background/80 backdrop-blur-md rounded-2xl border border-cyan-500/10 text-[11px] leading-relaxed shadow-inner">
                                                <Clock className="h-4 w-4 text-cyan-500 mb-2" />
                                                <strong className="block mb-1 text-foreground">Automated Purge Cycle:</strong> 
                                                Data nodes are erased from neural buffers immediately after the statutory report generation cycle.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Section 13 */}
                        <section id="section-13" className="space-y-10 scroll-mt-10 text-left">
                            <div className="flex items-center gap-4">
                                <div className="p-4 rounded-2xl bg-orange-500/10 text-orange-500 shadow-sm"><Scale className="h-7 w-7" /></div>
                                <h4 className="text-xl sm:text-2xl font-black tracking-tight text-primary uppercase">13. DO INDIAN RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?</h4>
                            </div>
                            <div className="space-y-8 text-sm text-muted-foreground font-medium leading-relaxed">
                                <p>Under the <strong>Digital Personal Data Protection Act, 2023 (DPDP Act)</strong>, Indian residents (Data Principals) have the following sovereign rights at the Nyaya Sahayak terminal:</p>
                                <ul className="grid gap-6 sm:grid-cols-2 list-none p-0 text-left">
                                    {[
                                        "Obtain a comprehensive summary of personal data currently being processed.",
                                        "Request rectification, completion, and erasure of all registry records.",
                                        "Access grievance redressal via our official Grievance Node at nyayasahayakhelp@gmail.com.",
                                        "Nominate individuals to manage your digital node in event of death/incapacity.",
                                        "Withdraw consent for neural processing nodes at any time.",
                                        "Request a machine-readable copy of your personal data nodes."
                                    ].map((right, i) => (
                                        <li key={i} className="p-5 border rounded-2xl bg-muted/10 font-black text-[10px] uppercase tracking-tight flex items-center gap-4 shadow-sm hover:bg-orange-500/[0.03] transition-all group">
                                            <CheckCircle2 className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                                            {right}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </section>

                        {/* Section 16 */}
                        <section id="section-16" className="space-y-8 scroll-mt-10 text-left">
                            <div className="flex items-center gap-4">
                                <div className="p-4 rounded-2xl bg-red-500/10 text-red-500 shadow-sm"><Trash2 className="h-7 w-7" /></div>
                                <h4 className="text-xl sm:text-2xl font-black tracking-tight text-primary uppercase">16. REVIEW OR DELETE DATA</h4>
                            </div>
                            <div className="space-y-6 text-left">
                                <p className="text-sm text-muted-foreground leading-relaxed font-medium">Users maintain sovereign authority over their registry nodes. You can initiate a <strong>"Total Registry Erasure"</strong> through your profile terminal settings. Associated data will be purged from all production nodes within 30 statutory days.</p>
                                <div className="bg-destructive/5 border border-destructive/20 p-8 rounded-[2rem] flex gap-6 items-start shadow-inner relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-5"><ShieldAlert className="h-20 w-20 text-destructive" /></div>
                                    <ShieldAlert className="h-8 w-8 text-destructive shrink-0 mt-1" />
                                    <p className="text-[11px] font-bold text-destructive/80 uppercase leading-relaxed tracking-tight">
                                        WARNING: EXECUTING "TOTAL REGISTRY ERASURE" IS IRREVERSIBLE AND WILL RESULT IN THE IMMEDIATE DECOMMISSIONING OF ALL SAVED FORENSIC AUDITS.
                                    </p>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </Card>
      </div>

      <div className="text-center pt-8 opacity-30">
          <p className="text-[9px] font-black uppercase tracking-[0.6em] text-muted-foreground">NYAYASAHAYAK.IN // MEMORY PROTOCOL // 2025</p>
      </div>
    </div>
  );
}
