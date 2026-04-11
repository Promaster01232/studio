
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
  Server,
  Share2,
  FileText,
  AlertTriangle,
  Smartphone,
  ShieldAlert,
  Search,
  FileSearch,
  ExternalLink,
  UserCheck,
  Gavel,
  RefreshCw
} from "lucide-react";
import { motion } from "framer-motion";
import { Logo } from "@/components/logo";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const summaryPoints = [
  {
    title: "Simple Collection",
    desc: "We only take what is needed: your name, phone, voice recordings of problems, and photos of legal papers.",
    icon: Database,
    color: "text-blue-500",
    bg: "bg-blue-500/10"
  },
  {
    title: "Secure AI",
    desc: "Our AI helps you but doesn't keep your secrets. Your data is never used to train other AI models.",
    icon: Lock,
    color: "text-purple-500",
    bg: "bg-purple-500/10"
  },
  {
    title: "You Are The Boss",
    desc: "You have full control. You can ask for your data copy or delete everything permanently anytime.",
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
          title="Privacy Rules"
          description="Last updated: February 24, 2025 // Official Statutory Notice"
        />
        <Badge variant="outline" className="font-black text-[9px] uppercase tracking-widest bg-primary/5 text-primary border-primary/10 px-4 py-1.5 rounded-full">Protocol 2025</Badge>
      </div>

      <Card className="border-none ring-1 ring-primary/10 shadow-3xl rounded-[2.5rem] overflow-hidden bg-card/40 backdrop-blur-xl relative">
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none grayscale">
          <Logo className="h-64 w-64" />
        </div>
        <CardContent className="p-8 sm:p-12 relative z-10 text-left space-y-8">
          <div className="flex items-center gap-3 text-primary mb-2">
            <div className="bg-primary/10 p-2.5 rounded-xl shadow-inner">
              <Fingerprint className="h-6 w-6" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Official Disclosure Protocol</span>
          </div>
          
          <div className="space-y-6">
            <p className="text-sm sm:text-lg text-muted-foreground font-medium leading-relaxed max-w-4xl">
              This Privacy Notice for <span className="text-foreground font-bold">Nyaya Sahayak</span> ("we," "us," or "our"), describes how and why we might access, collect, store, use, and/or share ("process") your personal information when you use our services ("Services"), including when you:
            </p>
            <ul className="space-y-4 text-xs sm:text-sm font-bold uppercase tracking-tight text-muted-foreground opacity-80 list-none pl-0">
              <li className="flex items-center gap-3">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span>Visit our website at <span className="text-primary">https://nyayasahayak.in</span> or any website of ours that links to this Privacy Notice</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span>Engage with us in other related ways, including any sales, marketing, or events</span>
              </li>
            </ul>
            <div className="p-8 rounded-[2rem] bg-primary/5 border border-primary/10 space-y-4 shadow-inner">
              <p className="text-sm font-bold text-foreground">Questions or concerns?</p>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Reading this Privacy Notice will help you understand your privacy rights and choices. We are responsible for making decisions about how your personal information is processed. If you do not agree with our policies and practices, please do not use our Services. If you still have any questions or concerns, please contact us at <span className="text-primary font-black">nyayasahayakhelp@gmail.com</span>.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <section className="space-y-8 text-left">
        <div className="flex items-center gap-3">
            <div className="h-1 w-8 bg-primary rounded-full" />
            <h2 className="text-xl font-black uppercase tracking-tighter">Quick Summary</h2>
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
        <section id="section-1" className="space-y-10 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-blue-500/10 text-blue-500 shadow-sm"><Database className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">1. What information do we collect?</h3>
            </div>
            <div className="space-y-10 text-sm sm:text-base text-muted-foreground font-medium leading-relaxed">
                <p>Personal information you disclose to us at <span className="text-foreground font-bold">Nyaya Sahayak</span> is collected with the highest standard of statutory integrity. We collect personal information that you voluntarily provide to us when you register on the terminal, express an interest in obtaining forensic intelligence, or when you participate in community transmissions.</p>
                
                <div className="space-y-6">
                    <p className="font-black text-xs uppercase tracking-widest text-primary border-b border-primary/10 pb-2">Institutional Identity Data Points:</p>
                    <div className="grid sm:grid-cols-2 gap-8">
                        <ul className="text-xs space-y-3 list-disc pl-6 font-bold uppercase tracking-tight opacity-80">
                            <li>Legal Names and Surnames</li>
                            <li>Verified Email Addresses (SMTP Handshaked)</li>
                            <li>Mobile Communication Points (OTP Authenticated)</li>
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
                        <p className="font-black text-foreground uppercase tracking-widest text-xs">Forensic Case Data Hub</p>
                    </div>
                    <p>To deliver elite-grade legal intelligence, we process high-fidelity data that involve specific neural ingestion protocols:</p>
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
            </div>
        </section>

        {/* Section 2 */}
        <section id="section-2" className="space-y-10 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-indigo-500/10 text-indigo-500 shadow-sm"><Server className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">2. How do we process your information?</h3>
            </div>
            <div className="space-y-10 text-sm sm:text-base text-muted-foreground font-medium leading-relaxed">
                <p>Nyaya Sahayak utilizes a multi-stage processing pipeline to transform raw data into statutory intelligence. Our processing flows are strictly reserved for institutional purposes:</p>
                
                <div className="p-10 bg-indigo-500/[0.02] rounded-[3rem] border border-indigo-500/10 space-y-12 shadow-2xl text-left">
                    <div className="grid sm:grid-cols-2 gap-12">
                        <div className="space-y-4">
                            <div className="p-3 rounded-xl bg-white dark:bg-black/20 w-fit shadow-md"><Bot className="h-6 w-6 text-indigo-600" /></div>
                            <h4 className="font-black text-sm uppercase tracking-widest text-foreground">Forensic Case Analysis</h4>
                            <p className="text-xs leading-loose opacity-70">We deconstruct your narratives into legal data, identifying potential Bharatiya Nyaya Sanhita (BNS) sections and procedural roadmaps. This processing is probabilistic and intended for informational guidance.</p>
                        </div>
                        <div className="space-y-4">
                            <div className="p-3 rounded-xl bg-white dark:bg-black/20 w-fit shadow-md"><ShieldCheck className="h-6 w-6 text-indigo-600" /></div>
                            <h4 className="font-black text-sm uppercase tracking-widest text-foreground">Identity & Trust Management</h4>
                            <p className="text-xs leading-loose opacity-70">Advocate credentials are manually and neurally audited to ensure 100% authenticity in our professional registry. We process your data to verify your status as a "Data Principal" under statutory law.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Section 3 */}
        <section id="section-3" className="space-y-10 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-amber-500/10 text-amber-500 shadow-sm"><Scale className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">3. What legal bases do we rely on?</h3>
            </div>
            <div className="space-y-10 text-sm sm:text-base text-muted-foreground font-medium leading-relaxed text-left">
                <p>We process your information only when we have a valid statutory reason (legal basis) to do so. In the Indian context, this is governed by the Digital Personal Data Protection Act, 2023. Key bases include:</p>
                <ul className="space-y-6">
                    <li className="flex gap-6 p-8 bg-amber-500/[0.03] border border-amber-500/10 rounded-[2.5rem]">
                        <div className="p-3 rounded-xl bg-white dark:bg-black/20 h-fit shadow-sm"><CheckCircle2 className="h-5 w-5 text-amber-600" /></div>
                        <div className="space-y-2">
                            <p className="font-black text-sm uppercase text-foreground">Affirmative Consent</p>
                            <p className="text-xs leading-relaxed">You have explicitly authorized the neural ingestion of your case data via the terminal interface. This consent can be withdrawn through your registry settings at any time.</p>
                        </div>
                    </li>
                    <li className="flex gap-6 p-8 bg-amber-500/[0.03] border border-amber-500/10 rounded-[2.5rem]">
                        <div className="p-3 rounded-xl bg-white dark:bg-black/20 h-fit shadow-sm"><Gavel className="h-5 w-5 text-amber-600" /></div>
                        <div className="space-y-2">
                            <p className="font-black text-sm uppercase text-foreground">Statutory Necessity</p>
                            <p className="text-xs leading-relaxed">Processing required to comply with Indian judicial requests, resolve billing disputes, or ensure national security standards in community transmissions.</p>
                        </div>
                    </li>
                </ul>
            </div>
        </section>

        {/* Section 4 */}
        <section id="section-4" className="space-y-10 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-cyan-500/10 text-cyan-500 shadow-sm"><Share2 className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">4. When and with whom do we share info?</h3>
            </div>
            <div className="space-y-10 text-sm sm:text-base text-muted-foreground font-medium leading-relaxed">
                <p>Nyaya Sahayak maintains a strict <span className="text-foreground font-bold underline decoration-2 decoration-cyan-500">Zero-Sale Protocol</span>. We do not sell citizen data to marketing brokers. Transmissions occur only with verified sub-processors required for operation:</p>
                <div className="p-10 border rounded-[3rem] bg-cyan-500/[0.02] border-cyan-500/10 space-y-8 shadow-2xl">
                    <div className="flex gap-6 items-start">
                        <div className="p-4 rounded-2xl bg-white dark:bg-black/20 shadow-md"><Bot className="h-8 w-8 text-cyan-600" /></div>
                        <div className="space-y-2">
                            <p className="font-black text-sm uppercase text-foreground">Neural Sub-processors (Google Cloud AI)</p>
                            <p className="text-xs leading-relaxed">Case narratives are transmitted to secure Google Cloud AI systems for forensic analysis. This transmission is encrypted via TLS 1.3. Google is contractually prohibited from utilizing this data to train foundation models.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Section 5 */}
        <section id="section-5" className="space-y-10 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-indigo-500/10 text-indigo-500 shadow-sm"><Globe className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">5. Stance on third-party websites</h3>
            </div>
            <div className="space-y-8 text-sm sm:text-base text-muted-foreground font-medium leading-loose">
                <p>The Nyaya Sahayak terminal contains navigational links to official judicial portals (e.g., eCourts), High Court registries, and Advocate external profiles. These are External Systems.</p>
                <div className="p-8 bg-indigo-500/[0.02] border border-indigo-500/10 rounded-[2.5rem] flex gap-6 items-start shadow-inner">
                    <ExternalLink className="h-8 w-8 text-indigo-600 shrink-0" />
                    <div className="space-y-2">
                        <p className="text-xs font-bold text-foreground">Jurisdictional Boundary</p>
                        <p className="text-xs leading-relaxed">We are not responsible for the privacy practices of official government portals or third-party advocate websites. Your interaction with these systems is governed by their respective statutory notices.</p>
                    </div>
                </div>
            </div>
        </section>

        {/* Section 6 */}
        <section id="section-6" className="space-y-12 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-cyan-500/10 text-cyan-500 shadow-sm"><Bot className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">6. Artificial Intelligence products</h3>
            </div>
            <div className="space-y-10 text-sm text-muted-foreground font-medium leading-relaxed">
                <div className="p-10 bg-cyan-500/[0.03] rounded-[3rem] border border-cyan-500/10 relative overflow-hidden group shadow-2xl text-left">
                    <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-1000">
                        <Bot className="h-64 w-64" />
                    </div>
                    <div className="relative z-10 space-y-10">
                        <div className="flex items-center gap-3 text-cyan-600">
                            <Sparkles className="h-5 w-5 animate-pulse" />
                            <span className="font-black text-[10px] uppercase tracking-[0.4em]">Nyaya Mitra Engine v4.2</span>
                        </div>
                        <p className="text-base sm:text-lg leading-relaxed max-w-4xl">Our platform utilizes high-fidelity neural networks to provide automated legal assistance. This processing is governed by strict safety protocols:</p>
                        
                        <div className="grid sm:grid-cols-2 gap-10 pt-4 text-left">
                            <Card className="p-8 bg-background/80 backdrop-blur-md rounded-[2rem] border border-cyan-500/10 space-y-4 shadow-inner">
                                <div className="flex items-center gap-3 text-cyan-600">
                                    <ShieldCheck className="h-5 w-5" />
                                    <p className="font-black text-[10px] uppercase tracking-widest">Zero-Training Clause</p>
                                </div>
                                <p className="text-xs leading-loose opacity-70">We explicitly instruct our AI sub-processors NOT to ingest your private narrations or legal documents for training public models. Your legal problems are your sovereign property.</p>
                            </Card>
                            <Card className="p-8 bg-background/80 backdrop-blur-md rounded-[2rem] border border-cyan-500/10 space-y-4 shadow-inner">
                                <div className="flex items-center gap-3 text-cyan-600">
                                    <Clock className="h-5 w-5" />
                                    <p className="font-black text-[10px] uppercase tracking-widest">Ephemeral Buffers</p>
                                </div>
                                <p className="text-xs leading-loose opacity-70">Input data is purged from neural memory systems immediately after the statutory report is generated. We do not maintain a permanent "memory" of your specific case details within the neural engine.</p>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Section 7 */}
        <section id="section-7" className="space-y-10 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-primary/10 text-primary shadow-sm"><UserCheck className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">7. Handling social logins</h3>
            </div>
            <div className="space-y-8 text-sm sm:text-base text-muted-foreground font-medium leading-relaxed text-left">
                <p>Citizens may initialize their registry account using third-party credentials (e.g., Google). This ingress retrieves specific identity markers to facilitate secure authentication:</p>
                <div className="p-10 rounded-[2.5rem] bg-muted/20 border border-primary/5 space-y-6 shadow-sm">
                    <p className="text-xs font-bold text-foreground uppercase tracking-widest">Data Ingress Points:</p>
                    <ul className="grid grid-cols-2 gap-6 list-disc pl-6 text-[11px] uppercase tracking-tight font-black opacity-60">
                        <li>Public Profile URL</li>
                        <li>SMTP Verified Email</li>
                        <li>Avatar Metadata</li>
                        <li>Display Name Registry</li>
                    </ul>
                </div>
            </div>
        </section>

        {/* Section 8 */}
        <section id="section-8" className="space-y-10 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-amber-500/10 text-amber-500 shadow-sm"><Clock className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">8. Data retention period</h3>
            </div>
            <div className="space-y-10 text-sm sm:text-base text-muted-foreground font-medium leading-relaxed">
                <p>We retain your information strictly for as long as necessary to fulfill the institutional purposes outlined in this dossier:</p>
                <div className="grid sm:grid-cols-2 gap-8 text-left">
                    <div className="p-8 rounded-[2.5rem] border border-primary/5 bg-primary/[0.02] shadow-xl space-y-4">
                        <p className="font-black text-sm uppercase tracking-widest text-foreground">Registry Session Duration</p>
                        <p className="text-xs opacity-70 leading-relaxed">Identity markers and case metadata are retained for the duration of your active account to ensure cross-browser synchronization.</p>
                    </div>
                    <div className="p-8 rounded-[2.5rem] border border-primary/5 bg-primary/[0.02] shadow-xl space-y-4">
                        <p className="font-black text-sm uppercase tracking-widest text-foreground">Forensic Purge Cycle</p>
                        <p className="text-xs opacity-70 leading-relaxed">Upon account termination, all associated data is permanently purged from production clusters within 30 statutory days.</p>
                    </div>
                </div>
            </div>
        </section>

        {/* Section 9 */}
        <section id="section-9" className="space-y-10 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-rose-500/10 text-rose-500 shadow-sm"><ShieldAlert className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">9. Collection from minors</h3>
            </div>
            <div className="space-y-8 text-sm sm:text-base text-muted-foreground font-medium leading-relaxed">
                <p>Nyaya Sahayak is an institutional platform intended for adult citizens (18+). We do not knowingly solicit data from minors.</p>
                <div className="p-8 bg-rose-500/5 border border-rose-500/10 rounded-[2rem] italic text-xs leading-loose shadow-inner">
                    "Law student accounts require verification of university credentials to ensure statutory compliance with age-gated access protocols."
                </div>
            </div>
        </section>

        {/* Section 10 */}
        <section id="section-10" className="space-y-10 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-500 shadow-sm"><UserCheck className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">10. Your privacy rights</h3>
            </div>
            <div className="space-y-10 text-sm sm:text-base text-muted-foreground font-medium leading-relaxed">
                <p>Depending on your geographic registry (EEA, UK, Canada, India), you have extensive authority over your data:</p>
                <div className="grid gap-6 sm:grid-cols-2 text-left">
                    {[
                        { t: "Right to Rectification", d: "Instantly update inaccurate identity markers via the profile terminal." },
                        { t: "Right to Erasure", d: "Execute a total registry purge of all forensic reports and transcripts." },
                        { t: "Right to Object", d: "Withdraw your neural processing mandate at any time." },
                        { t: "Right to Summary", d: "Request a machine-readable audit of your case history." }
                    ].map((r, i) => (
                        <div key={i} className="p-8 rounded-[2rem] border border-primary/5 bg-background shadow-xl text-left hover:bg-emerald-500/[0.02] transition-colors group">
                            <p className="font-black text-[10px] uppercase text-primary mb-2 group-hover:text-emerald-600 transition-colors">{r.t}</p>
                            <p className="text-[11px] opacity-70 leading-relaxed font-bold">{r.d}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* Section 11 */}
        <section id="section-11" className="space-y-10 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-muted/30 shadow-sm"><Search className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">11. Do-Not-Track features</h3>
            </div>
            <div className="space-y-8 text-sm sm:text-base text-muted-foreground font-medium leading-relaxed">
                <p>Standard web browser DNT signals are not currently mapped to an industry-wide protocol. We do not respond to DNT signals as our dashboard does not utilize behavioral tracking for marketing purposes.</p>
            </div>
        </section>

        {/* Section 12 */}
        <section id="section-12" className="space-y-10 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-amber-500/10 text-amber-500 shadow-sm"><Globe className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">12. US State privacy rights</h3>
            </div>
            <div className="space-y-10 text-sm sm:text-base text-muted-foreground font-medium leading-relaxed">
                <p>Residents of California (CCPA), Virginia (VCDPA), and other US states have specific rights regarding the Category Matrix below:</p>
                <div className="overflow-x-auto rounded-[2rem] border border-primary/10 shadow-2xl">
                    <table className="w-full text-left text-[10px] sm:text-xs">
                        <thead className="bg-primary/5 font-black uppercase tracking-widest text-primary">
                            <tr>
                                <th className="p-6">Category</th>
                                <th className="p-6">Collected Data</th>
                                <th className="p-6">Retention</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-primary/5 font-bold">
                            <tr><td className="p-6">A. Identifiers</td><td className="p-6">Names, Emails, IP</td><td className="p-6 uppercase">Account Life</td></tr>
                            <tr><td className="p-6">F. Network Activity</td><td className="p-6">Search History, Clicks</td><td className="p-6 uppercase">24 Months</td></tr>
                            <tr><td className="p-6">H. Audio/Sensory</td><td className="p-6">Voice Records, PDFs</td><td className="p-6 uppercase">24H (Raw)</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </section>

        {/* Section 13 */}
        <section id="section-13" className="space-y-12 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-orange-500/10 text-orange-500 shadow-sm"><Scale className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">13. Indian resident rights (DPDP Act)</h3>
            </div>
            <div className="space-y-10 text-sm sm:text-base text-muted-foreground font-medium leading-relaxed">
                <p>As a resident of India, you are recognized as a "Data Principal" under the <span className="text-foreground font-bold">Digital Personal Data Protection Act, 2023 (DPDP Act).</span> Nyaya Sahayak grants you extensive sovereign authority over your digital registry profile:</p>
                <div className="grid gap-8 sm:grid-cols-2 text-left">
                    {[
                        { title: "Right to Summary", desc: "Obtain a complete registry log of personal data and specific neural audit activities undertaken." },
                        { title: "Right to Correction", desc: "Request immediate rectification of inaccurate identity markers or incomplete credentials." },
                        { title: "Grievance Redressal", desc: "Access direct resolution via our Grievance Officer at nyayasahayakhelp@gmail.com." },
                        { title: "Nomination Authority", desc: "Appoint another citizen to exercise your data rights in the event of death or legal incapacity." },
                        { title: "Right to Erasure", desc: "Initiate a complete 'Registry Purge' to permanently erase all case history and identity data." },
                        { title: "Consent Withdrawal", desc: "Revoke your neural processing mandate at any time, resulting in immediate terminal disconnection." }
                    ].map((right, i) => (
                        <div key={i} className="p-8 border rounded-[2.5rem] bg-orange-500/[0.02] border-orange-500/10 flex items-start gap-6 shadow-sm hover:bg-orange-500/[0.05] transition-all group">
                            <div className="p-3 rounded-xl bg-orange-500/10 text-orange-600 shadow-inner group-hover:scale-110 transition-transform">
                                <CheckCircle2 className="h-5 w-5" />
                            </div>
                            <div className="space-y-2">
                                <p className="font-black text-xs uppercase tracking-tight text-foreground">{right.title}</p>
                                <p className="text-[11px] opacity-70 leading-relaxed font-bold">{right.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* Section 14 */}
        <section id="section-14" className="space-y-10 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-muted shadow-sm"><RefreshCw className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">14. Updates to this notice</h3>
            </div>
            <div className="space-y-8 text-sm sm:text-base text-muted-foreground font-medium leading-relaxed">
                <p>We update this protocol as necessary to remain compliant with legislative amendments. The "Revised" date at the header reflects the latest synchronization. Material changes will be broadcasted via the dashboard notification center.</p>
            </div>
        </section>

        {/* Section 15 */}
        <section id="section-15" className="space-y-12 pt-16 border-t border-primary/5 scroll-mt-24 text-left">
            <div className="flex flex-col md:flex-row gap-16 text-left">
                <div className="flex-1 space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="p-4 rounded-2xl bg-blue-500/10 text-blue-500 shadow-sm"><BellRing className="h-7 w-7" /></div>
                        <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">15. Contact us</h3>
                    </div>
                    <p className="text-sm sm:text-lg leading-loose">For data access requests, grievance reporting, or statutory inquiries, utilize the official institutional channels of Nyaya Sahayak:</p>
                </div>
                <div className="w-full md:w-[450px]">
                    <Card className="p-10 bg-primary/5 border-primary/10 rounded-[3rem] shadow-3xl relative overflow-hidden group text-left">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
                            <Logo className="h-40 w-48" />
                        </div>
                        <div className="space-y-10 relative z-10">
                            <div className="flex items-start gap-6">
                                <div className="p-4 rounded-2xl bg-primary text-white shadow-xl shadow-primary/20"><MapPin className="h-6 w-6" /></div>
                                <div className="space-y-2 text-left">
                                    <p className="text-[10px] font-black uppercase text-primary tracking-[0.4em]">Official Address</p>
                                    <p className="text-xs font-black leading-relaxed text-foreground/80 uppercase">
                                        Nyaya Sahayak Terminal<br />
                                        Bariya Chowk, Daltonganj<br />
                                        Jharkhand 822101, India
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-6">
                                <div className="p-4 rounded-2xl bg-primary text-white shadow-xl shadow-primary/20"><Mail className="h-6 w-6" /></div>
                                <div className="space-y-2 text-left">
                                    <p className="text-[10px] font-black uppercase text-primary tracking-[0.4em]">Digital Desk</p>
                                    <p className="text-xs font-black text-foreground hover:underline select-all lowercase">nyayasahayakhelp@gmail.com</p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </section>

        {/* Section 16 */}
        <section id="section-16" className="space-y-10 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-red-500/10 text-red-500 shadow-sm"><Trash2 className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">16. Review or delete your data</h3>
            </div>
            <div className="space-y-10 text-sm sm:text-base text-muted-foreground font-medium leading-loose text-left">
                <p>Citizens maintain sovereign authority over their registry entry. You can initiate a <span className="text-foreground font-bold underline">"Total Registry Erasure"</span> through your profile terminal settings or by transmitting a formal email to our data fiduciary hub at <span className="text-primary font-black">nyayasahayakhelp@gmail.com</span>.</p>
                <div className="p-10 bg-destructive/5 border border-destructive/20 rounded-[3rem] shadow-inner relative overflow-hidden text-left group">
                    <div className="absolute top-0 right-0 p-6 opacity-[0.05] group-hover:scale-110 transition-transform"><ShieldAlert className="h-32 w-32 text-destructive" /></div>
                    <p className="text-xs font-black text-destructive flex items-center gap-4 mb-6 uppercase tracking-tighter">
                        <ShieldAlert className="h-6 w-6" /> Irreversible Purge Protocol
                    </p>
                    <p className="text-[11px] sm:text-xs opacity-80 leading-relaxed font-black uppercase tracking-tight max-w-3xl">
                        EVERYTHING—INCLUDING YOUR LEGAL IDENTITY MARKERS, FORENSIC REPORTS, BIOMETRIC VOICE DOSSIERS, AND TRANSACTION LOGS—WILL BE PERMANENTLY ERASED WITHIN 30 STATUTORY DAYS. THIS ACTION IS FINAL AND CANNOT BE UNDONE.
                    </p>
                </div>
            </div>
        </section>

      </div>
    </motion.div>
  );
}
