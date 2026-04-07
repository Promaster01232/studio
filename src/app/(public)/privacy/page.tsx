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
  ShieldAlert
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
          description="Institutional Transparency Node: Detailed guidelines on forensic data handling and statutory compliance for Nyaya Sahayak."
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
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Institutional Data Commitment</span>
          </div>
          <p className="text-sm sm:text-lg text-muted-foreground font-medium leading-relaxed max-w-3xl text-left">
            This Privacy Notice for <span className="text-foreground font-bold">Nyaya Sahayak</span> ("we," "us," or "our"), describes how and why we might access, collect, store, use, and/or share ("process") your personal information when you utilize our forensic AI services at <span className="text-primary font-bold">nyayasahayak.in</span>.
          </p>
          <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 flex items-start gap-4 shadow-inner text-left">
              <Info className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <p className="text-xs font-medium text-muted-foreground italic leading-relaxed">
                  "If you do not agree with our institutional policies and neural processing practices, please disconnect from the Services immediately. Questions? Contact our Grievance Desk at nyayasahayakhelp@gmail.com."
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
      </div>

      <div className="space-y-32 pt-16 border-t border-primary/5">
        
        {/* Section 1 */}
        <section id="section-1" className="space-y-8 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-blue-500/10 text-blue-500 shadow-sm"><Database className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">1. WHAT INFORMATION DO WE COLLECT?</h3>
            </div>
            <div className="space-y-8 text-sm sm:text-base text-muted-foreground font-medium leading-relaxed">
                <p>Personal information you disclose to us at Nyaya Sahayak is collected with the highest standard of statutory integrity. We collect personal information that you voluntarily provide to us when you register on the Services, express an interest in obtaining information about us or our products, or when you participate in activities on the Services.</p>
                
                <p className="font-bold text-foreground text-left">The personal information we collect depends on the context of your interactions with us and the Services, the choices you make, and the products and features you use. This include:</p>

                <div className="grid sm:grid-cols-2 gap-6 text-left">
                    <Card className="p-6 bg-primary/5 border-primary/10 rounded-2xl">
                        <p className="font-black text-[10px] uppercase tracking-widest text-primary mb-4">Identity Node Registry</p>
                        <ul className="text-xs space-y-2 list-disc pl-4 opacity-80">
                            <li>Legal Given Names and Surnames</li>
                            <li>Verified Email Addresses for secure transmissions</li>
                            <li>Mobile Communication Nodes (OTP Verified)</li>
                            <li>Professional Credentials (Bar IDs for Advocates)</li>
                            <li>Encrypted Authentication Tokens</li>
                        </ul>
                    </Card>
                    <Card className="p-6 bg-blue-500/5 border-blue-500/10 rounded-2xl">
                        <p className="font-black text-[10px] uppercase tracking-widest text-blue-600 mb-4">Automatically Collected metadata</p>
                        <p className="text-[11px]">We automatically collect IP addresses, browser characteristics, and OS identifiers to maintain terminal security and detect unauthorized ingress attempts. This includes geolocation data at the city level to ensure regional statutory compliance.</p>
                    </Card>
                </div>

                <div className="space-y-4 pt-6">
                    <p className="font-black text-foreground uppercase tracking-widest text-xs border-l-4 border-indigo-500 pl-4">Forensic AI Case Data</p>
                    <p>Nyaya Sahayak processes complex legal data nodes to provide AI-driven analysis. This data is handled with ephemeral priority:</p>
                    <ul className="space-y-4">
                        <li className="flex gap-4 p-6 rounded-2xl bg-muted/30 border border-primary/5">
                            <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-600 shrink-0 h-fit"><Mic className="h-5 w-5" /></div>
                            <div className="space-y-1">
                                <p className="font-black text-xs uppercase tracking-tight text-foreground">Voice Recordings & Biometric Frequency</p>
                                <p className="text-xs">We collect audio data transmitted during "Tell Your Story" sessions. This data is converted to text for forensic audit and then purged from neural buffers after the report is generated. We do not store original audio nodes long-term.</p>
                            </div>
                        </li>
                        <li className="flex gap-4 p-6 rounded-2xl bg-muted/30 border border-primary/5">
                            <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-600 shrink-0 h-fit"><FileText className="h-5 w-5" /></div>
                            <div className="space-y-1">
                                <p className="font-black text-xs uppercase tracking-tight text-foreground">Statutory Instruments (PDF/OCR)</p>
                                <p className="text-xs">Uploaded legal documents are scanned via OCR neural nodes to identify risks and deadlines. These nodes operate in an isolated vault environment and are subject to immediate transience protocols.</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </section>

        {/* Section 2 */}
        <section id="section-2" className="space-y-8 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-indigo-500/10 text-indigo-500 shadow-sm"><RotateCcw className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">2. HOW DO WE PROCESS YOUR INFORMATION?</h3>
            </div>
            <div className="space-y-8 text-sm sm:text-base text-muted-foreground font-medium leading-relaxed">
                <p>We process your data nodes to provide, improve, and administer our forensic AI services. Our primary processing flows are engineered for precision and statutory accuracy:</p>
                <div className="grid gap-6 sm:grid-cols-2 text-left">
                    <div className="p-8 rounded-[2.5rem] border border-primary/5 bg-primary/[0.02] space-y-4 shadow-sm">
                        <CheckCircle2 className="h-6 w-6 text-primary" />
                        <p className="font-black text-sm uppercase tracking-widest text-foreground">Neural Case Summarization</p>
                        <p className="text-xs opacity-70 leading-relaxed">Converting voice narrations into structured legal reports with BNS section references and jurisdictional guidance based on Indian judicial standards.</p>
                    </div>
                    <div className="p-8 rounded-[2.5rem] border border-primary/5 bg-primary/[0.02] space-y-4 shadow-sm">
                        <CheckCircle2 className="h-6 w-6 text-primary" />
                        <p className="font-black text-sm uppercase tracking-widest text-foreground">Statutory Risk Auditing</p>
                        <p className="text-xs opacity-70 leading-relaxed">Scanning legal documents for hidden unfavorable clauses, upcoming deadlines, and procedural inconsistencies using high-fidelity neural patterns.</p>
                    </div>
                </div>
                <p>We also process data to facilitate account security, prevent unauthorized access (TLS 1.3 monitoring), and provide customer support via our institutional help desk. We may process anonymized telemetry to improve AI model accuracy without identifying the individual citizen node.</p>
            </div>
        </section>

        {/* Section 3 */}
        <section id="section-3" className="space-y-8 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-500 shadow-sm"><Scale className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">3. WHAT LEGAL BASES DO WE RELY ON?</h3>
            </div>
            <div className="space-y-6 text-sm text-muted-foreground font-medium leading-relaxed">
                <p>We only process your personal information when we have a valid statutory reason to do so under applicable law. These bases include:</p>
                <ul className="space-y-4 pl-4 list-disc">
                    <li><strong>Consent:</strong> Explicit authorization provided by you for specific forensic audits or directory listings. You may withdraw this consent at any time.</li>
                    <li><strong>Contract:</strong> Fulfillment of our Terms of Service to provide AI tools, legal guidance, and case management features.</li>
                    <li><strong>Legal Obligation:</strong> Compliance with the laws of India, including the IT Act and the Digital Personal Data Protection (DPDP) Act 2023.</li>
                    <li><strong>Vital Interests:</strong> Emergency situations where data processing is critical for personal safety or public welfare (e.g., SOS signal activation).</li>
                </ul>
            </div>
        </section>

        {/* Section 6 */}
        <section id="section-6" className="space-y-8 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-cyan-500/10 text-cyan-500 shadow-sm"><Bot className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">6. DO WE OFFER ARTIFICIAL INTELLIGENCE-BASED PRODUCTS?</h3>
            </div>
            <div className="space-y-8 text-sm text-muted-foreground font-medium leading-relaxed">
                <div className="p-8 bg-cyan-500/[0.03] rounded-[3rem] border border-cyan-500/10 relative overflow-hidden group shadow-2xl text-left">
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
                                <div className="p-6 bg-white dark:bg-black/20 rounded-2xl border border-cyan-500/10 text-xs flex gap-4 shadow-sm text-left">
                                    <ShieldCheck className="h-6 w-6 text-cyan-500 shrink-0" />
                                    <div className="space-y-1">
                                        <p className="font-black uppercase tracking-tight">Non-Training Clause</p>
                                        <p className="opacity-70 leading-relaxed">We do NOT use your private case audio, document uploads, or personal narratives to train foundation AI models or third-party datasets. Your data is your sovereign asset.</p>
                                    </div>
                                </div>
                                <div className="p-6 bg-white dark:bg-black/20 rounded-2xl border border-cyan-500/10 text-xs flex gap-4 shadow-sm text-left">
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

        {/* Section 12 */}
        <section id="section-12" className="space-y-8 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-amber-500/10 text-amber-500 shadow-sm"><Globe className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">12. DO UNITED STATES RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?</h3>
            </div>
            <div className="space-y-8 text-sm sm:text-base text-muted-foreground font-medium leading-relaxed">
                <p>Residents of California, Colorado, Connecticut, and other US states possess sovereign rights regarding their data nodes. We comply with the CCPA/CPRA frameworks:</p>
                <div className="p-8 rounded-[2rem] bg-amber-500/5 border border-amber-500/10 shadow-inner">
                    <p className="font-black text-[10px] uppercase tracking-widest text-amber-600 mb-4">Statutory Rights Node:</p>
                    <div className="grid gap-4 sm:grid-cols-2 text-left">
                        {[
                            { t: "Right to Know", d: "Request disclosure of the specific categories of data processed by our AI nodes." },
                            { t: "Right to Delete", d: "Trigger an immediate erasure request for all personal identity markers in our registry." },
                            { t: "Right to Opt-Out", d: "Deactivate the processing of your data for targeted forensic analytics or automated profiling." },
                            { t: "Right to Non-Discrimination", d: "Exercising your rights will not result in degraded terminal performance." }
                        ].map((right, i) => (
                            <div key={i} className="flex gap-3">
                                <div className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                                <div className="space-y-1">
                                    <p className="font-black text-xs uppercase tracking-tight text-foreground">{right.t}</p>
                                    <p className="text-[11px] opacity-70 leading-relaxed">{right.d}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>

        {/* Section 13 */}
        <section id="section-13" className="space-y-8 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-orange-500/10 text-orange-500 shadow-sm"><Scale className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">13. DO INDIAN RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?</h3>
            </div>
            <div className="space-y-8 text-sm sm:text-base text-muted-foreground font-medium leading-relaxed">
                <p>As a "Data Principal" under the <strong>Digital Personal Data Protection Act, 2023 (DPDP Act)</strong>, you are granted extensive sovereign authority over your digital registry nodes:</p>
                <div className="grid gap-4 sm:grid-cols-2 text-left">
                    {[
                        { title: "Right to Summary", desc: "Obtain a complete registry log of personal data and processing activities undertaken by the platform." },
                        { title: "Right to Correction", desc: "Request rectification of inaccurate identity markers, incomplete credentials, or outdated forensic files." },
                        { title: "Grievance Redressal", desc: "Access direct resolution via our Grievance Officer node at nyayasahayakhelp@gmail.com." },
                        { title: "Nomination Authority", desc: "Appoint another individual to exercise your data rights in the event of death or incapacity." }
                    ].map((right, i) => (
                        <div key={i} className="p-6 border rounded-2xl bg-orange-500/[0.02] border-orange-500/10 flex items-start gap-4 shadow-sm text-left">
                            <div className="p-2 rounded-lg bg-orange-500/10 text-orange-600 shadow-sm">
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
        <section id="section-16" className="space-y-8 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-red-500/10 text-red-500 shadow-sm"><Trash2 className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">16. REVIEW OR DELETE YOUR DATA</h3>
            </div>
            <div className="space-y-6 text-sm sm:text-base text-muted-foreground font-medium leading-loose text-left">
                <p>Users maintain sovereign authority over their registry nodes. You can initiate a <strong>"Total Registry Erasure"</strong> through your profile terminal settings or by transmitting a formal email to our data fiduciary node at nyayasahayakhelp@gmail.com.</p>
                <div className="p-8 bg-destructive/5 border border-destructive/20 rounded-[2rem] shadow-inner relative overflow-hidden text-left">
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
