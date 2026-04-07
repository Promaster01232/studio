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
  ListRestart,
  Trash2,
  Clock,
  ExternalLink,
  Scale,
  BellRing,
  Globe,
  UserCheck,
  Eye,
  ShieldAlert,
  History,
  FileText,
  User,
  Bot,
  Sparkles,
  Zap,
  Activity
} from "lucide-react";
import { motion } from "framer-motion";
import { Logo } from "@/components/logo";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const summaryPoints = [
  {
    title: "Forensic Data Collection",
    desc: "We collect high-fidelity info like voice recordings, legal PDFs, and names, plus technical metadata like IP nodes.",
    icon: Database,
    color: "text-blue-500",
    bg: "bg-blue-500/10"
  },
  {
    title: "Zero Sensitive Processing",
    desc: "We strictly avoid processing sensitive nodes like religious beliefs, biometric genetic data, or sexual orientation.",
    icon: Lock,
    color: "text-purple-500",
    bg: "bg-purple-500/10"
  },
  {
    title: "Neural Security Node",
    desc: "Your data is processed in ephemeral AI buffers, protected by AES-256 encryption and zero-trust protocols.",
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
      className="max-w-5xl mx-auto space-y-12 pb-32 px-4 sm:px-6 text-left"
    >
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 border-b border-primary/5 pb-8">
        <PageHeader
          title="Privacy Protocol"
          description="Institutional Transparency Node: Detailed guidelines on forensic data handling and statutory compliance for Nyaya Sahayak."
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
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Institutional Data Commitment</span>
            </div>
            <p className="text-sm sm:text-lg text-muted-foreground font-medium leading-relaxed max-w-3xl">
              This Privacy Notice for <span className="text-foreground font-bold">Nyaya Sahayak</span> ("we," "us," or "our"), describes how and why we might access, collect, store, use, and/or share ("process") your personal information when you utilize our forensic AI services at <span className="text-primary font-bold">nyayasahayak.in</span>.
            </p>
            <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 flex items-start gap-4 shadow-inner">
                <Info className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <p className="text-xs font-medium text-muted-foreground italic leading-relaxed">
                    "If you do not agree with our institutional policies and neural processing practices, please disconnect from the Services immediately. Questions? Contact our Grievance Desk at nyayasahayakhelp@gmail.com."
                </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Summary Section */}
      <section className="space-y-8">
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
      </motion.div>

      {/* Full Document Sections */}
      <div className="space-y-32 pt-16 border-t border-primary/5">
        
        {/* Section 1 */}
        <section id="section-1" className="space-y-8 scroll-mt-24">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-blue-500/10 text-blue-500 shadow-sm"><Database className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">1. WHAT INFORMATION DO WE COLLECT?</h3>
            </div>
            <div className="space-y-8 text-sm sm:text-base text-muted-foreground font-medium leading-relaxed">
                <div className="space-y-4">
                    <p className="font-black text-foreground uppercase tracking-widest text-xs border-l-4 border-primary pl-4">Personal information you disclose to us</p>
                    <p>We collect personal information that you voluntarily provide to us when you register on the Nyaya Sahayak terminal, express an interest in obtaining forensic legal audits, or otherwise communicate with our node. This includes identity markers necessary for statutory verification within the Indian judicial ecosystem.</p>
                    
                    <div className="grid sm:grid-cols-2 gap-6 pt-4">
                        <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 space-y-3 shadow-inner">
                            <p className="font-black text-[10px] uppercase tracking-widest text-primary">Identity Node Registry</p>
                            <ul className="text-xs space-y-2 list-disc pl-4 opacity-80">
                                <li>Legal Given Names and Surnames</li>
                                <li>Verified Institutional Email Addresses</li>
                                <li>Mobile Communication Nodes (Verified via OTP)</li>
                                <li>Professional Credentials (for Advocate Registry Ingress)</li>
                                <li>Authentication Hash Tokens (Bcrypt Encrypted)</li>
                            </ul>
                        </div>
                        <div className="p-6 rounded-2xl bg-blue-500/5 border border-blue-500/10 space-y-3 shadow-inner">
                            <p className="font-black text-[10px] uppercase tracking-widest text-blue-600">Professional Ingress (Advocates)</p>
                            <p className="text-[11px] leading-relaxed">For legal professionals seeking verification, we collect high-resolution scans of Bar Council ID cards, enrollment certificates, and practice area metadata for manual forensic verification by our root administration node.</p>
                        </div>
                    </div>
                </div>
                
                <div className="space-y-4 pt-6">
                    <p className="font-black text-foreground uppercase tracking-widest text-xs border-l-4 border-indigo-500 pl-4">Forensic Case Data (AI Processing Ingress)</p>
                    <p>Nyaya Sahayak processes high-fidelity legal data nodes to provide AI-driven analysis. This data is handled with ephemeral priority and zero-persistence protocols where applicable:</p>
                    <ul className="space-y-4">
                        <li className="flex gap-4 p-6 rounded-2xl bg-muted/30 border border-primary/5">
                            <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-600 shrink-0 h-fit"><Mic className="h-5 w-5" /></div>
                            <div className="space-y-1">
                                <p className="font-black text-xs uppercase tracking-tight text-foreground">Voice Recordings & Biometric Frequency</p>
                                <p className="text-xs">We collect audio frequency data transmitted during the "Tell Your Story" session. This data is converted to text for forensic audit and then purged from neural buffers.</p>
                            </div>
                        </li>
                        <li className="flex gap-4 p-6 rounded-2xl bg-muted/30 border border-primary/5">
                            <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-600 shrink-0 h-fit"><FileText className="h-5 w-5" /></div>
                            <div className="space-y-1">
                                <p className="font-black text-xs uppercase tracking-tight text-foreground">Statutory Instruments (PDF/OCR)</p>
                                <p className="text-xs">We process uploaded legal documents (Legal Notices, FIRs, Contracts) through OCR neural nodes to identify latent risks, unfavorable clauses, and critical statutory deadlines.</p>
                            </div>
                        </li>
                        <li className="flex gap-4 p-6 rounded-2xl bg-muted/30 border border-primary/5">
                            <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-600 shrink-0 h-fit"><Scale className="h-5 w-5" /></div>
                            <div className="space-y-1">
                                <p className="font-black text-xs uppercase tracking-tight text-foreground">Case Narratives & BNS Mapping</p>
                                <p className="text-xs">Textual descriptions of legal disputes are processed to generate success probability matrices and map facts to the relevant Bharatiya Nyaya Sanhita (BNS) sections.</p>
                            </div>
                        </li>
                    </ul>
                </div>

                <div className="space-y-4 pt-6">
                    <p className="font-black text-foreground uppercase tracking-widest text-xs border-l-4 border-emerald-500 pl-4">Information automatically collected</p>
                    <p>We automatically log device telemetry when you navigate nyayasahayak.in. This includes IP ingress nodes, browser engine IDs, and session duration data needed to maintain system integrity and prevent DDOS attacks on the neural hub.</p>
                </div>
            </div>
        </section>

        {/* Section 2 */}
        <section id="section-2" className="space-y-8 scroll-mt-24">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-indigo-500/10 text-indigo-500 shadow-sm"><ListRestart className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">2. HOW DO WE PROCESS YOUR INFORMATION?</h3>
            </div>
            <div className="space-y-8 text-sm sm:text-base text-muted-foreground font-medium leading-relaxed">
                <p>We process your data nodes to provide, improve, and administer our forensic AI services. Our primary processing flows are engineered for precision and statutory accuracy:</p>
                <div className="grid gap-6 sm:grid-cols-2">
                    <div className="p-8 rounded-[2.5rem] border border-primary/5 bg-primary/[0.02] space-y-4 transition-all hover:shadow-xl hover:bg-primary/[0.04]">
                        <CheckCircle2 className="h-6 w-6 text-primary" />
                        <p className="font-black text-sm uppercase tracking-widest text-foreground">Neural Case Summarization</p>
                        <p className="text-xs opacity-70 leading-relaxed">Converting voice narrations into structured legal reports with BNS section references and jurisdictional guidance for citizens.</p>
                    </div>
                    <div className="p-8 rounded-[2.5rem] border border-primary/5 bg-primary/[0.02] space-y-4 transition-all hover:shadow-xl hover:bg-primary/[0.04]">
                        <CheckCircle2 className="h-6 w-6 text-primary" />
                        <p className="font-black text-sm uppercase tracking-widest text-foreground">Statutory Risk Auditing</p>
                        <p className="text-xs opacity-70 leading-relaxed">Scanning legal documents for hidden unfavorable clauses, upcoming deadlines, and procedural inconsistencies using proprietary AI nodes.</p>
                    </div>
                    <div className="p-8 rounded-[2.5rem] border border-primary/5 bg-primary/[0.02] space-y-4 transition-all hover:shadow-xl hover:bg-primary/[0.04]">
                        <CheckCircle2 className="h-6 w-6 text-primary" />
                        <p className="font-black text-sm uppercase tracking-widest text-foreground">Identity Node Authentication</p>
                        <p className="text-xs opacity-70 leading-relaxed">Facilitating secure login and registry management via Firebase Auth nodes and institutional credential audits for verified professionals.</p>
                    </div>
                    <div className="p-8 rounded-[2.5rem] border border-primary/5 bg-primary/[0.02] space-y-4 transition-all hover:shadow-xl hover:bg-primary/[0.04]">
                        <CheckCircle2 className="h-6 w-6 text-primary" />
                        <p className="font-black text-sm uppercase tracking-widest text-foreground">Spam & Abuse Prevention</p>
                        <p className="text-xs opacity-70 leading-relaxed">Analyzing usage patterns to protect the neural hub from malicious activity and ensuring the high availability of AI resources.</p>
                    </div>
                </div>
                <div className="p-6 rounded-2xl bg-muted/30 border-l-4 border-primary">
                    <p className="text-xs font-bold text-foreground uppercase tracking-widest mb-2">Anonymous Posts Protocol:</p>
                    <p className="text-xs leading-relaxed italic">"If you utilize the 'Post Anonymously' feature in the community hub, your user ID is still associated with the post internally. Even anonymous transmissions are traceable internally for security, moderation, and statutory legal compliance."</p>
                </div>
            </div>
        </section>

        {/* Section 3 */}
        <section id="section-3" className="space-y-8 scroll-mt-24">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-amber-500/10 text-amber-500 shadow-sm"><Scale className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">3. WHAT LEGAL BASES DO WE RELY ON?</h3>
            </div>
            <div className="space-y-6 text-sm sm:text-base text-muted-foreground font-medium leading-relaxed">
                <p>Nyaya Sahayak processes personal information only when we have a valid statutory reason (legal basis) under applicable law, including the India DPDP Act and GDPR. These include:</p>
                <ul className="space-y-4">
                    <li className="flex gap-4 p-4 rounded-xl bg-muted/20">
                        <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0"></div>
                        <span><strong>Consent:</strong> When you provide clear authorization for a specific processing node (e.g., uploading a case file for AI analysis).</span>
                    </li>
                    <li className="flex gap-4 p-4 rounded-xl bg-muted/20">
                        <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0"></div>
                        <span><strong>Legal Obligations:</strong> When processing is necessary for compliance with statutory laws, court orders, or police investigative protocols.</span>
                    </li>
                    <li className="flex gap-4 p-4 rounded-xl bg-muted/20">
                        <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0"></div>
                        <span><strong>Legitimate Interests:</strong> For the security, operation, and optimization of the AI forensic platform.</span>
                    </li>
                </ul>
            </div>
        </section>

        {/* Section 6 */}
        <section id="section-6" className="space-y-8 scroll-mt-24">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-cyan-500/10 text-cyan-500 shadow-sm"><Cpu className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">6. DO WE OFFER ARTIFICIAL INTELLIGENCE-BASED PRODUCTS?</h3>
            </div>
            <div className="space-y-8 text-sm sm:text-base text-muted-foreground font-medium leading-relaxed">
                <div className="p-8 bg-cyan-500/[0.03] rounded-[3rem] border border-cyan-500/10 relative overflow-hidden group shadow-2xl">
                    <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-1000">
                        <Bot className="h-64 w-64" />
                    </div>
                    <div className="relative z-10 space-y-6">
                        <div className="flex items-center gap-3 text-cyan-600">
                            <Sparkles className="h-5 w-5 animate-pulse" />
                            <span className="font-black text-xs uppercase tracking-[0.3em]">The Nyaya Mitra Engine</span>
                        </div>
                        <p>Nyaya Sahayak utilizes advanced neural nodes powered by Google Cloud AI and specialized LLM configurations. These "AI Products" are designed to provide automated legal assistance while maintaining the highest tiers of data transience and citizen privacy.</p>
                        
                        <div className="space-y-4 pt-4">
                            <p className="font-bold text-foreground text-xs uppercase tracking-widest border-b border-cyan-500/20 pb-2">Neural Security Commitment:</p>
                            <div className="grid sm:grid-cols-2 gap-6">
                                <div className="p-6 bg-white dark:bg-black/20 rounded-2xl border border-cyan-500/10 text-xs flex gap-4 shadow-sm">
                                    <ShieldCheck className="h-6 w-6 text-cyan-500 shrink-0" />
                                    <div className="space-y-1">
                                        <p className="font-black uppercase tracking-tight">Non-Training Clause</p>
                                        <p className="opacity-70 leading-relaxed">We do NOT use your private case audio, document uploads, or personal narratives to train foundation AI models or third-party datasets.</p>
                                    </div>
                                </div>
                                <div className="p-6 bg-white dark:bg-black/20 rounded-2xl border border-cyan-500/10 text-xs flex gap-4 shadow-sm">
                                    <ShieldCheck className="h-6 w-6 text-cyan-500 shrink-0" />
                                    <div className="space-y-1">
                                        <p className="font-black uppercase tracking-tight">Ephemeral Buffers</p>
                                        <p className="opacity-70 leading-relaxed">Input data is processed in isolated execution environments and purged from neural processing buffers immediately after the statutory report is generated.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Section 13 */}
        <section id="section-13" className="space-y-8 scroll-mt-24">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-orange-500/10 text-orange-500 shadow-sm"><Scale className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">13. DO INDIAN RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?</h3>
            </div>
            <div className="space-y-8 text-sm sm:text-base text-muted-foreground font-medium leading-relaxed">
                <p>Yes, as a "Data Principal" under the <strong>Digital Personal Data Protection Act, 2023 (DPDP Act)</strong>, you are granted extensive sovereign authority over your digital registry nodes at Nyaya Sahayak:</p>
                <div className="grid gap-4 sm:grid-cols-2">
                    {[
                        { title: "Right to Summary", desc: "Obtain a complete registry log of personal data and processing activities undertaken by the platform." },
                        { title: "Right to Correction", desc: "Request rectification of inaccurate identity markers, incomplete credentials, or outdated forensic files." },
                        { title: "Grievance Redressal", desc: "Access direct resolution via our Grievance Officer node at nyayasahayakhelp@gmail.com." },
                        { title: "Nomination Authority", desc: "Appoint another individual to exercise your data rights in the event of death or incapacity." },
                        { title: "Withdrawal of Consent", desc: "Terminate neural processing authorization at any time, resulting in immediate node deactivation." },
                        { title: "Right to Erasure", desc: "Trigger a 'Total Registry Purge' from all production nodes and backup statutory archives." }
                    ].map((right, i) => (
                        <div key={i} className="p-6 border rounded-2xl bg-orange-500/[0.02] border-orange-500/10 flex items-start gap-4 transition-all hover:bg-orange-500/[0.05] group shadow-sm">
                            <div className="p-2 rounded-lg bg-orange-500/10 text-orange-600 transition-transform group-hover:scale-110 shadow-sm">
                                <CheckCircle2 className="h-4 w-4" />
                            </div>
                            <div className="space-y-1">
                                <p className="font-black text-xs uppercase tracking-tight text-foreground">{right.title}</p>
                                <p className="text-[11px] opacity-70 leading-relaxed font-medium">{right.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="p-6 bg-orange-500/5 border border-orange-500/10 rounded-2xl italic text-xs font-medium text-muted-foreground text-center">
                    "Exercise these statutory rights by transmitting a formal request to our Grievance Node at nyayasahayakhelp@gmail.com."
                </div>
            </div>
        </section>

        {/* Section 15 */}
        <section id="section-15" className="space-y-10 pt-16 border-t border-primary/5 scroll-mt-24">
            <div className="flex flex-col md:flex-row gap-12">
                <div className="flex-1 space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="p-4 rounded-2xl bg-blue-500/10 text-blue-500 shadow-sm"><BellRing className="h-7 w-7" /></div>
                        <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">15. HOW CAN YOU CONTACT US?</h3>
                    </div>
                    <p className="text-sm sm:text-base leading-loose">For data subject access requests, grievance reporting, or statutory inquiries, utilize the following official institutional channels of Nyaya Sahayak:</p>
                </div>
                <div className="w-full md:w-[400px]">
                    <Card className="p-8 sm:p-10 bg-primary/5 border-primary/10 rounded-[2.5rem] shadow-3xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
                            <Logo className="h-32 w-32" />
                        </div>
                        <div className="space-y-8 relative z-10">
                            <div className="flex items-start gap-5">
                                <div className="p-3 rounded-xl bg-primary text-white shadow-lg shadow-primary/20"><MapPin className="h-5 w-5" /></div>
                                <div className="space-y-1.5 text-left">
                                    <p className="text-[10px] font-black uppercase text-primary tracking-[0.3em]">Statutory Node Address</p>
                                    <p className="text-xs font-bold leading-relaxed text-foreground/80">
                                        Nyaya Sahayak Terminal<br />
                                        Bariya Chowk, Daltonganj<br />
                                        Jharkhand 822101, India
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-5">
                                <div className="p-3 rounded-xl bg-primary text-white shadow-lg shadow-primary/20"><Mail className="h-5 w-5" /></div>
                                <div className="space-y-1.5 text-left">
                                    <p className="text-[10px] font-black uppercase text-primary tracking-[0.3em]">Institutional Digital Hub</p>
                                    <p className="text-xs font-black text-foreground hover:underline select-all">nyayasahayakhelp@gmail.com</p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </section>

        {/* Section 16 */}
        <section id="section-16" className="space-y-8 scroll-mt-24">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-red-500/10 text-red-500 shadow-sm"><Trash2 className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">16. REVIEW OR DELETE YOUR DATA</h3>
            </div>
            <div className="space-y-6 text-sm sm:text-base text-muted-foreground font-medium leading-loose">
                <p>Users maintain sovereign authority over their registry nodes. You can initiate a <strong>"Total Registry Erasure"</strong> through your profile terminal settings or by transmitting a formal email to our data fiduciary node at nyayasahayakhelp@gmail.com.</p>
                <div className="p-8 bg-destructive/5 border border-destructive/10 rounded-[2rem] shadow-inner relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-[0.05]"><ShieldAlert className="h-20 w-20 text-destructive" /></div>
                    <p className="text-xs font-black text-destructive flex items-center gap-3 mb-4 uppercase tracking-tighter">
                        <ShieldAlert className="h-5 w-5" /> Irreversible Purge Protocol
                    </p>
                    <p className="text-[11px] opacity-80 leading-relaxed font-bold uppercase tracking-tight">
                        ALL ASSOCIATED IDENTITY MARKERS, FORENSIC REPORTS, VOICE RECORDINGS, AND TRANSACTION LOGS WILL BE PERMANENTLY ERASED FROM ALL PRODUCTION NODES WITHIN 30 STATUTORY DAYS.
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
