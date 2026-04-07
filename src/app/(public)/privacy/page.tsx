
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
    desc: "Your private case data is processed in ephemeral buffers and is NEVER used to train public foundation models.",
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
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-5xl mx-auto space-y-12 pb-32 px-4 sm:px-6 text-left"
    >
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 border-b border-primary/5 pb-8 text-left">
        <PageHeader
          title="Privacy Protocol"
          description="Institutional Transparency Dossier: Detailed guidelines on forensic data handling and statutory compliance for Nyaya Sahayak."
        />
        <Badge variant="outline" className="font-black text-[9px] uppercase tracking-widest bg-primary/5 text-primary border-primary/10 px-4 py-1.5 rounded-full">Protocol NS-PRIV-2025</Badge>
      </div>

      <Card className="border-none ring-1 ring-primary/10 shadow-3xl rounded-[2.5rem] overflow-hidden bg-card/40 backdrop-blur-xl relative">
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none grayscale">
          <Logo className="h-64 w-64" />
        </div>
        <CardContent className="p-8 sm:p-12 relative z-10 text-left space-y-6">
          <div className="flex items-center gap-3 text-primary mb-2">
            <div className="bg-primary/10 p-2.5 rounded-xl shadow-inner">
              <Fingerprint className="h-6 w-6" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Data Sovereignty Mandate</span>
          </div>
          <p className="text-sm sm:text-lg text-muted-foreground font-medium leading-relaxed max-w-3xl text-left">
            This Privacy Notice for <span className="text-foreground font-bold">Nyaya Sahayak</span> ("we," "us," or "our"), provides an exhaustive deconstruction of how we access, collect, store, and process your personal information nodes at <span className="text-primary font-bold">nyayasahayak.in</span>.
          </p>
          <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 flex items-start gap-4 shadow-inner text-left">
              <Info className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <p className="text-xs font-medium text-muted-foreground italic leading-relaxed">
                  "If you do not agree with our neural processing practices and statutory protocols, please disconnect from the terminal immediately. Questions? Contact our Grievance Node at nyayasahayakhelp@gmail.com."
              </p>
          </div>
        </CardContent>
      </Card>

      <section className="space-y-8 text-left">
        <div className="flex items-center gap-3">
            <div className="h-1 w-8 bg-primary rounded-full" />
            <h2 className="text-xl font-black uppercase tracking-tighter">Forensic Summary Nodes</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
            {summaryPoints.map((point, idx) => (
                <Card key={idx} className="border-primary/5 bg-muted/20 rounded-[2rem] hover:bg-primary/[0.02] transition-all group">
                    <CardContent className="p-8 space-y-4">
                        <div className={cn("p-3 rounded-xl w-fit shadow-sm transition-transform group-hover:scale-110", point.bg, point.color)}>
                            <point.icon className="h-5 w-5" />
                        </div>
                        <h3 className="font-black text-xs uppercase tracking-widest text-left">{point.title}</h3>
                        <p className="text-[11px] font-medium text-muted-foreground leading-relaxed text-left">{point.desc}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
      </section>

      <div className="space-y-6 text-left">
        <div className="flex items-center gap-3">
            <div className="h-1 w-8 bg-primary rounded-full" />
            <h2 className="text-xl font-black uppercase tracking-tighter">Statutory Table of Contents</h2>
        </div>
        <Card className="border-primary/5 bg-background shadow-inner rounded-[2rem] p-8 sm:p-10">
            <div className="grid sm:grid-cols-2 gap-x-12 gap-y-4">
                {toc.map((item, idx) => (
                    <button 
                        key={idx} 
                        onClick={() => scrollToSection(item.id)}
                        className="flex items-center gap-3 group text-left transition-colors hover:text-primary"
                    >
                        <ChevronRight className="h-3 w-3 text-primary/40 group-hover:translate-x-1 transition-transform" />
                        <span className="text-[11px] font-bold uppercase tracking-tight opacity-70 group-hover:opacity-100">{item.title}</span>
                    </button>
                ))}
            </div>
        </Card>
      </div>

      <div className="space-y-32 pt-16 border-t border-primary/5">
        
        {/* Section 1 */}
        <section id="section-1" className="space-y-8 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-blue-500/10 text-blue-500 shadow-sm"><Database className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">1. WHAT INFORMATION DO WE COLLECT?</h3>
            </div>
            <div className="space-y-8 text-sm sm:text-base text-muted-foreground font-medium leading-relaxed">
                <p>Personal information you disclose to us at Nyaya Sahayak is collected with the highest standard of statutory integrity. We collect personal information that you voluntarily provide to us when you register on the terminal, express an interest in obtaining forensic intelligence, or when you participate in community transmissions.</p>
                
                <div className="p-8 rounded-[2.5rem] bg-primary/5 border border-primary/10 space-y-6 shadow-inner text-left">
                    <p className="font-black text-xs uppercase tracking-widest text-primary border-b border-primary/10 pb-2">Institutional Identity Nodes:</p>
                    <div className="grid sm:grid-cols-2 gap-8">
                        <ul className="text-xs space-y-3 list-disc pl-6 font-bold uppercase tracking-tight opacity-80">
                            <li>Legal Names and Surnames</li>
                            <li>Verified Email Addresses (SMTP Handshaked)</li>
                            <li>Mobile Communication Nodes (OTP Authenticated)</li>
                            <li>Professional Bar Council Credentials (for Advocates)</li>
                        </ul>
                        <ul className="text-xs space-y-3 list-disc pl-6 font-bold uppercase tracking-tight opacity-80">
                            <li>Salted & Hashed Authentication Keys</li>
                            <li>Citizen Type (Individual, Corporate, or Academic)</li>
                            <li>Institutional Billing Metadata (Razorpay TXIDs)</li>
                            <li>Encrypted Profile Image Data</li>
                        </ul>
                    </div>
                </div>

                <div className="space-y-6 pt-6">
                    <div className="flex items-center gap-3">
                        <div className="h-4 w-1 bg-indigo-500 rounded-full" />
                        <p className="font-black text-foreground uppercase tracking-widest text-xs">Forensic Case Node Ingress</p>
                    </div>
                    <p>To deliver elite-grade legal intelligence, we process high-fidelity data nodes that involve specific neural ingestion protocols:</p>
                    <ul className="space-y-6">
                        <li className="flex gap-5 p-8 rounded-[2.5rem] bg-muted/30 border border-primary/5 shadow-sm transition-all hover:bg-primary/[0.02]">
                            <div className="p-4 rounded-2xl bg-indigo-500/10 text-indigo-600 shrink-0 h-fit shadow-inner"><Mic className="h-6 w-6" /></div>
                            <div className="space-y-2 text-left">
                                <p className="font-black text-sm uppercase tracking-tight text-foreground">Biometric Voice Narration</p>
                                <p className="text-xs leading-relaxed opacity-80 font-medium">When using the "Tell Your Story" terminal, we collect audio frequency data. This data is converted into textual dossiers for forensic audit. We do not store the original audio files long-term; they are purged from neural processing buffers within 24 hours of the report generation.</p>
                            </div>
                        </li>
                        <li className="flex gap-5 p-8 rounded-[2.5rem] bg-muted/30 border border-primary/5 shadow-sm transition-all hover:bg-primary/[0.02]">
                            <div className="p-4 rounded-2xl bg-indigo-500/10 text-indigo-600 shrink-0 h-fit shadow-inner"><FileText className="h-6 w-6" /></div>
                            <div className="space-y-2 text-left">
                                <p className="font-black text-sm uppercase tracking-tight text-foreground">Statutory Instruments (PDF/OCR)</p>
                                <p className="text-xs leading-relaxed opacity-80 font-medium">Documents uploaded for "Forensic Audit" are scanned using Optical Character Recognition (OCR). We extract legal clauses, timestamps, and statutory risks. This data is tokenized for neural analysis and is subject to the same transience protocols as voice data.</p>
                            </div>
                        </li>
                    </ul>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="h-4 w-1 bg-blue-500 rounded-full" />
                        <p className="font-black text-foreground uppercase tracking-widest text-xs">Automatically Collected Metadata</p>
                    </div>
                    <p>We automatically collect terminal metadata to ensure secure session operation and maintain the integrity of the forensic engine:</p>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <Card className="p-6 bg-muted/20 border-primary/5 text-xs space-y-2">
                            <p className="font-black uppercase tracking-widest text-primary">Terminal Identifiers</p>
                            <p className="opacity-70">IP addresses, browser characteristics, and OS identifiers are collected to detect unauthorized ingress attempts and maintain high-performance TLS 1.3 encryption.</p>
                        </Card>
                        <Card className="p-6 bg-muted/20 border-primary/5 text-xs space-y-2">
                            <p className="font-black uppercase tracking-widest text-primary">Regional Mapping</p>
                            <p className="opacity-70">Country and city-level geolocation is mapped to ensure compliance with regional Indian High Court jurisdictions and the DPDP Act 2023.</p>
                        </Card>
                    </div>
                </div>
            </div>
        </section>

        {/* Section 2 */}
        <section id="section-2" className="space-y-8 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-indigo-500/10 text-indigo-500 shadow-sm"><Server className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">2. HOW DO WE PROCESS YOUR INFORMATION?</h3>
            </div>
            <div className="space-y-8 text-sm sm:text-base text-muted-foreground font-medium leading-relaxed">
                <p>Nyaya Sahayak utilizes a multi-stage processing pipeline to transform raw data into statutory intelligence. Our processing flows are strictly reserved for institutional purposes:</p>
                
                <div className="p-8 bg-indigo-500/[0.02] rounded-[3rem] border border-indigo-500/10 space-y-10 shadow-2xl text-left">
                    <div className="grid sm:grid-cols-2 gap-10">
                        <div className="space-y-4">
                            <div className="p-3 rounded-xl bg-white dark:bg-black/20 w-fit shadow-md"><Bot className="h-6 w-6 text-indigo-600" /></div>
                            <h4 className="font-black text-sm uppercase tracking-widest text-foreground">Forensic Case Analysis</h4>
                            <p className="text-xs leading-loose opacity-70">We deconstruct your narratives into legal nodes, identifying potential Bharatiya Nyaya Sanhita (BNS) sections and procedural roadmaps. This processing is probabilistic and intended for informational guidance.</p>
                        </div>
                        <div className="space-y-4">
                            <div className="p-3 rounded-xl bg-white dark:bg-black/20 w-fit shadow-md"><ShieldCheck className="h-6 w-6 text-indigo-600" /></div>
                            <h4 className="font-black text-sm uppercase tracking-widest text-foreground">Identity & Trust Management</h4>
                            <p className="text-xs leading-loose opacity-70">Advocate credentials are manually and neurally audited to ensure 100% authenticity in our professional registry. We process your data to verify your status as a "Data Principal" under statutory law.</p>
                        </div>
                    </div>
                    <div className="pt-8 border-t border-indigo-500/10 text-left">
                        <p className="font-black text-[10px] uppercase tracking-widest text-indigo-600 mb-4">Statutory Processing Purposes:</p>
                        <ul className="grid sm:grid-cols-3 gap-4 list-none p-0">
                            <li className="flex items-center gap-3 p-4 rounded-xl bg-white/50 dark:bg-black/50 border border-indigo-500/10 text-[10px] font-bold uppercase tracking-tight">
                                <CheckCircle2 className="h-4 w-4 text-green-600" /> Account Facilitation
                            </li>
                            <li className="flex items-center gap-3 p-4 rounded-xl bg-white/50 dark:bg-black/50 border border-indigo-500/10 text-[10px] font-bold uppercase tracking-tight">
                                <CheckCircle2 className="h-4 w-4 text-green-600" /> AI Report Generation
                            </li>
                            <li className="flex items-center gap-3 p-4 rounded-xl bg-white/50 dark:bg-black/50 border border-indigo-500/10 text-[10px) font-bold uppercase tracking-tight">
                                <CheckCircle2 className="h-4 w-4 text-green-600" /> Fraud Neutralization
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>

        {/* Section 3 */}
        <section id="section-3" className="space-y-8 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-amber-500/10 text-amber-500 shadow-sm"><Scale className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">3. WHAT LEGAL BASES DO WE RELY ON?</h3>
            </div>
            <div className="space-y-8 text-sm sm:text-base text-muted-foreground font-medium leading-relaxed">
                <p>We process your data strictly under valid legal bases as defined by global and regional statutory frameworks (GDPR, India DPDP Act 2023):</p>
                <div className="grid gap-6 sm:grid-cols-2 text-left">
                    <Card className="p-8 rounded-[2rem] border-primary/5 bg-primary/[0.02] shadow-sm space-y-4">
                        <h4 className="font-black text-xs uppercase tracking-widest text-primary">Explicit Consent</h4>
                        <p className="text-[11px] opacity-70 leading-relaxed">By clicking "Initialize Node" during registration or tool usage, you provide affirmative consent for neural processing. You maintain the right to withdraw this consent via your terminal profile.</p>
                    </Card>
                    <Card className="p-8 rounded-[2rem] border-primary/5 bg-primary/[0.02] shadow-sm space-y-4">
                        <h4 className="font-black text-xs uppercase tracking-widest text-primary">Statutory Obligations</h4>
                        <p className="text-[11px] opacity-70 leading-relaxed">Processing required to comply with Indian judicial requests, prevent financial fraud, or ensure national security standards in high-fidelity legal communications.</p>
                    </Card>
                </div>
            </div>
        </section>

        {/* Section 4 */}
        <section id="section-4" className="space-y-8 scroll-mt-24 text-left">
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
                            <p className="text-xs leading-relaxed font-medium opacity-70">We transmit case narratives and document nodes to Google Cloud AI hubs for high-performance forensic analysis. This transmission occurs within a secure TLS 1.3 tunnel. Google does not utilize this data to train foundation models; it is processed in an isolated, multi-tenant vault.</p>
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
        <section id="section-6" className="space-y-10 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-cyan-500/10 text-cyan-500 shadow-sm"><Bot className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">6. DO WE OFFER ARTIFICIAL INTELLIGENCE-BASED PRODUCTS?</h3>
            </div>
            <div className="space-y-8 text-sm text-muted-foreground font-medium leading-relaxed">
                <div className="p-10 bg-cyan-500/[0.03] rounded-[3rem] border border-cyan-500/10 relative overflow-hidden group shadow-2xl text-left">
                    <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-1000">
                        <Bot className="h-64 w-64" />
                    </div>
                    <div className="relative z-10 space-y-8">
                        <div className="flex items-center gap-3 text-cyan-600">
                            <Sparkles className="h-5 w-5 animate-pulse" />
                            <span className="font-black text-xs uppercase tracking-[0.3em]">The Nyaya Mitra Engine</span>
                        </div>
                        <p className="text-base sm:text-lg leading-relaxed max-w-4xl">Nyaya Sahayak utilizes the **Nyaya Mitra** neural engine to provide automated legal assistance. Our commitment to AI safety is absolute and governed by institutional security protocols:</p>
                        
                        <div className="grid sm:grid-cols-2 gap-8 pt-4 text-left">
                            <Card className="p-8 bg-background/80 backdrop-blur-md rounded-[2rem] border border-cyan-500/10 space-y-4 shadow-inner">
                                <div className="flex items-center gap-3 text-cyan-600">
                                    <ShieldCheck className="h-5 w-5" />
                                    <p className="font-black text-[10px] uppercase tracking-widest">Non-Training Clause</p>
                                </div>
                                <p className="text-xs leading-loose opacity-70">We explicitly instruct our AI sub-processors NOT to ingest your private narrations or legal documents for training public models. Your legal problems are your sovereign property.</p>
                            </Card>
                            <Card className="p-8 bg-background/80 backdrop-blur-md rounded-[2rem] border border-cyan-500/10 space-y-4 shadow-inner">
                                <div className="flex items-center gap-3 text-cyan-600">
                                    <Clock className="h-5 w-5" />
                                    <p className="font-black text-[10px] uppercase tracking-widest">Ephemeral Buffers</p>
                                </div>
                                <p className="text-xs leading-loose opacity-70">Input data is purged from neural memory nodes immediately after the statutory report is generated. We do not maintain a permanent "memory" of your specific case details within the neural engine itself.</p>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Section 8 */}
        <section id="section-8" className="space-y-8 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-amber-500/10 text-amber-500 shadow-sm"><Clock className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">8. DATA RETENTION PERIOD</h3>
            </div>
            <div className="space-y-8 text-sm sm:text-base text-muted-foreground font-medium leading-relaxed">
                <p>We retain your information strictly for as long as necessary to fulfill the institutional purposes outlined in this dossier:</p>
                <div className="grid sm:grid-cols-2 gap-6 text-left">
                    <div className="p-8 rounded-[2rem] border border-primary/5 bg-primary/[0.02] shadow-sm space-y-4">
                        <p className="font-black text-sm uppercase tracking-widest text-foreground">Registry Session Duration</p>
                        <p className="text-xs opacity-70 leading-relaxed">Identity nodes and basic case metadata are retained for the duration of your active account. This ensures your tracker remains synchronized across browser restarts.</p>
                    </div>
                    <div className="p-8 rounded-[2rem] border border-primary/5 bg-primary/[0.02] shadow-sm space-y-4">
                        <p className="font-black text-sm uppercase tracking-widest text-foreground">Forensic Purge Node</p>
                        <p className="text-xs opacity-70 leading-relaxed">Upon account termination, all associated data nodes are marked for "Registry Erasure" and are permanently purged from all production clusters within 30 statutory days.</p>
                    </div>
                </div>
            </div>
        </section>

        {/* Section 13 */}
        <section id="section-13" className="space-y-10 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-orange-500/10 text-orange-500 shadow-sm"><Scale className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">13. DO INDIAN RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?</h3>
            </div>
            <div className="space-y-8 text-sm sm:text-base text-muted-foreground font-medium leading-relaxed">
                <p>As a resident of India, you are recognized as a "Data Principal" under the **Digital Personal Data Protection Act, 2023 (DPDP Act).** Nyaya Sahayak grants you extensive sovereign authority over your digital registry nodes:</p>
                <div className="grid gap-6 sm:grid-cols-2 text-left">
                    {[
                        { title: "Right to Summary", desc: "Obtain a complete registry log of personal data being processed and the specific neural audit activities undertaken." },
                        { title: "Right to Correction", desc: "Request immediate rectification of inaccurate identity markers, incomplete credentials, or outdated forensic files." },
                        { title: "Grievance Redressal", desc: "Access direct resolution via our Grievance Officer node at nyayasahayakhelp@gmail.com for any statutory discrepancy." },
                        { title: "Nomination Authority", desc: "Appoint another citizen node to exercise your data rights in the event of death or legal incapacity." },
                        { title: "Right to Erasure", desc: "Initiate a complete 'Registry Purge' to permanently erase all case history and identity data from the platform." },
                        { title: "Consent Withdrawal", desc: "Revoke your neural processing mandate at any time, resulting in immediate disconnection of AI terminals." }
                    ].map((right, i) => (
                        <div key={i} className="p-6 border rounded-2xl bg-orange-500/[0.02] border-orange-500/10 flex items-start gap-4 shadow-sm text-left group hover:bg-orange-500/5 transition-all">
                            <div className="p-2.5 rounded-lg bg-orange-500/10 text-orange-600 shadow-sm group-hover:scale-110 transition-transform">
                                <CheckCircle2 className="h-4 w-4" />
                            </div>
                            <div className="space-y-1">
                                <p className="font-black text-xs uppercase tracking-tight text-foreground">{right.title}</p>
                                <p className="text-[11px] opacity-70 leading-relaxed font-medium">{right.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* Section 15 */}
        <section id="section-15" className="space-y-10 pt-16 border-t border-primary/5 scroll-mt-24 text-left">
            <div className="flex flex-col md:flex-row gap-12 text-left">
                <div className="flex-1 space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="p-4 rounded-2xl bg-blue-500/10 text-blue-500 shadow-sm"><BellRing className="h-7 w-7" /></div>
                        <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">15. HOW CAN YOU CONTACT US?</h3>
                    </div>
                    <p className="text-sm sm:text-base leading-loose">For data access requests, grievance reporting, or statutory inquiries, utilize the official institutional channels of Nyaya Sahayak:</p>
                </div>
                <div className="w-full md:w-[400px]">
                    <Card className="p-8 sm:p-10 bg-primary/5 border-primary/10 rounded-[2.5rem] shadow-3xl relative overflow-hidden group text-left">
                        <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
                            <Logo className="h-32 w-32" />
                        </div>
                        <div className="space-y-8 relative z-10">
                            <div className="flex items-start gap-5">
                                <div className="p-3 rounded-xl bg-primary text-white shadow-lg shadow-primary/20"><MapPin className="h-5 w-5" /></div>
                                <div className="space-y-1.5 text-left">
                                    <p className="text-[10px] font-black uppercase text-primary tracking-[0.3em]">Statutory Node Address</p>
                                    <p className="text-xs font-bold leading-relaxed text-foreground/80 uppercase">
                                        Nyaya Sahayak Terminal<br />
                                        Bariya Chowk, Daltonganj<br />
                                        Jharkhand 822101, India
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-5">
                                <div className="p-3 rounded-xl bg-primary text-white shadow-lg shadow-primary/20"><Mail className="h-5 w-5" /></div>
                                <div className="space-y-1.5 text-left">
                                    <p className="text-[10px] font-black uppercase text-primary tracking-[0.3em]">Digital Ingress Hub</p>
                                    <p className="text-xs font-black text-foreground hover:underline select-all lowercase">nyayasahayakhelp@gmail.com</p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </section>

        {/* Section 16 */}
        <section id="section-16" className="space-y-8 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-red-500/10 text-red-500 shadow-sm"><Trash2 className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">16. REVIEW OR DELETE YOUR DATA</h3>
            </div>
            <div className="space-y-6 text-sm sm:text-base text-muted-foreground font-medium leading-loose text-left">
                <p>Citizens maintain sovereign authority over their registry nodes. You can initiate a **"Total Registry Erasure"** through your profile terminal settings or by transmitting a formal email to our data fiduciary node at nyayasahayakhelp@gmail.com.</p>
                <div className="p-8 bg-destructive/5 border border-destructive/20 rounded-[2rem] shadow-inner relative overflow-hidden text-left group">
                    <div className="absolute top-0 right-0 p-4 opacity-[0.05] group-hover:scale-110 transition-transform"><ShieldAlert className="h-24 w-24 text-destructive" /></div>
                    <p className="text-xs font-black text-destructive flex items-center gap-3 mb-4 uppercase tracking-tighter">
                        <ShieldAlert className="h-5 w-5" /> Irreversible Purge Protocol
                    </p>
                    <p className="text-[11px] opacity-80 leading-relaxed font-bold uppercase tracking-tight max-w-2xl">
                        ALL ASSOCIATED IDENTITY MARKERS, FORENSIC REPORTS, BIOMETRIC VOICE DOSSIERS, AND TRANSACTION LOGS WILL BE PERMANENTLY ERASED FROM ALL PRODUCTION NODES WITHIN 30 STATUTORY DAYS. THIS ACTION CANNOT BE UNDONE.
                    </p>
                </div>
            </div>
        </section>

      </div>

      <div className="text-center pt-20 pb-10 opacity-30">
          <p className="text-[9px] font-black uppercase tracking-[0.6em] text-muted-foreground">NYAYASAHAYAK.IN // THE FUTURE OF JUSTICE IS NEURAL // <History className="inline h-3 w-3" /> 2025</p>
      </div>
    </motion.div>
  );
}
