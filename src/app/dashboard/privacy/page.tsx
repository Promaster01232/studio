
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
  History as LucideHistory,
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
    title: "Simple collection",
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
    title: "You are the boss",
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
  { id: "section-6", title: "6. Artificial intelligence products" },
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
          title="Privacy rules"
          description="Institutional transparency protocol for Nyaya Sahayak dashboard"
        />
        <Badge variant="outline" className="font-black text-[9px] uppercase tracking-widest bg-primary/5 text-primary border-primary/10 px-4 py-1.5 rounded-full">Secure registry access</Badge>
      </motion.div>

      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
        <Card className="border-none ring-1 ring-primary/10 shadow-3xl rounded-[3rem] overflow-hidden bg-card/40 backdrop-blur-xl relative text-left">
          <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none grayscale">
            <Logo className="h-64 w-64" />
          </div>
          <CardContent className="p-8 sm:p-16 relative z-10 text-left space-y-8">
            <div className="flex items-center gap-3 text-primary mb-2">
              <div className="bg-primary/10 p-2.5 rounded-xl shadow-inner">
                <Fingerprint className="h-6 w-6" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Official disclosure protocol</span>
            </div>
            <div className="space-y-6">
              <p className="text-sm sm:text-lg text-muted-foreground font-medium leading-relaxed max-w-4xl text-left">
                This Privacy Notice for <span className="text-foreground font-bold">Nyaya Sahayak</span> ("we," "us," or "our"), describes how and why we might access, collect, store, use, and/or share ("process") your personal information when you use our services ("Services").
              </p>
              <div className="p-8 rounded-[2rem] bg-primary/5 border border-primary/10 space-y-4 shadow-inner">
                <p className="text-sm font-bold text-foreground">Official notice for dashboard users</p>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  If you do not agree with our policies and practices, please terminate your registry session. For any inquiries, please contact our fiduciary desk at <span className="text-primary font-black">nyayasahayakhelp@gmail.com</span>.
                </p>
              </div>
            </div>
          </CardContent>
          <div className="h-2 w-full bg-gradient-to-r from-primary via-accent to-blue-400"></div>
        </Card>
      </motion.div>

      <div className="pt-10 text-left">
        <Card className="border-primary/5 bg-muted/10 rounded-[3rem] overflow-hidden">
            <div className="grid lg:grid-cols-12">
                <aside className="lg:col-span-4 bg-primary/5 p-8 border-r border-primary/5 hidden lg:block sticky top-0 h-fit text-left">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-6 flex items-center gap-2">
                        <Info className="h-4 w-4" /> Statutory index
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
                        
                        <section id="section-1" className="space-y-8 scroll-mt-10 text-left">
                            <div className="flex items-center gap-4">
                                <div className="p-4 rounded-2xl bg-blue-500/10 text-blue-500 shadow-sm"><Database className="h-7 w-7" /></div>
                                <h4 className="text-xl sm:text-2xl font-black tracking-tight text-primary uppercase">1. What information do we collect?</h4>
                            </div>
                            <div className="space-y-8 text-sm sm:text-base text-muted-foreground font-medium leading-relaxed">
                                <p>We collect personal information that you voluntarily provide to us when you register on the Nyaya Sahayak terminal or express an interest in obtaining forensic intelligence.</p>
                                
                                <div className="p-8 rounded-[2rem] bg-primary/5 border border-primary/10 space-y-6 shadow-inner text-left">
                                    <p className="font-black text-[10px] uppercase tracking-widest text-primary">Identity ingress</p>
                                    <ul className="text-xs space-y-3 list-disc pl-6 opacity-80 font-bold uppercase tracking-tight">
                                        <li>Full Legal Names</li>
                                        <li>Verified Email nodes</li>
                                        <li>Mobile Communication IDs</li>
                                        <li>Hashed Security Keys</li>
                                    </ul>
                                </div>

                                <div className="space-y-4 pt-4">
                                    <p className="font-bold text-foreground uppercase tracking-widest text-[10px] border-l-4 border-indigo-500 pl-4">Neural data ingress</p>
                                    <ul className="space-y-6">
                                        <li className="flex gap-5 p-6 bg-muted/30 rounded-[1.5rem] border border-primary/5">
                                            <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-600 shrink-0 h-fit shadow-sm"><Mic className="h-6 w-6" /></div>
                                            <div className="space-y-1 text-left">
                                                <p className="font-black text-xs uppercase tracking-tight text-foreground">Voice narration data</p>
                                                <p className="text-xs leading-relaxed">Audio data from the "Tell Your Story" module is converted to text and purged from neural buffers within 24 hours.</p>
                                            </div>
                                        </li>
                                        <li className="flex gap-5 p-6 bg-muted/30 rounded-[1.5rem] border border-primary/5">
                                            <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-600 shrink-0 h-fit shadow-sm"><FileText className="h-6 w-6" /></div>
                                            <div className="space-y-1 text-left">
                                                <p className="font-black text-xs uppercase tracking-tight text-foreground">Statutory OCR data</p>
                                                <p className="text-xs leading-relaxed">Legal documents are tokenized for clause analysis and risk identification. No persistent storage of raw instruments is maintained.</p>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        <section id="section-2" className="space-y-8 scroll-mt-10 text-left">
                            <div className="flex items-center gap-4">
                                <div className="p-4 rounded-2xl bg-indigo-500/10 text-indigo-500 shadow-sm"><Server className="h-7 w-7" /></div>
                                <h4 className="text-xl sm:text-2xl font-black tracking-tight text-primary uppercase">2. How do we process your information?</h4>
                            </div>
                            <div className="space-y-8 text-sm text-muted-foreground font-medium leading-relaxed">
                                <p>We process your data to initialize account access, verify registry identities, and generate probabilistic legal reports.</p>
                            </div>
                        </section>

                        <section id="section-3" className="space-y-8 scroll-mt-10 text-left">
                            <div className="flex items-center gap-4">
                                <div className="p-4 rounded-2xl bg-amber-500/10 text-amber-500 shadow-sm"><Scale className="h-7 w-7" /></div>
                                <h4 className="text-xl sm:text-2xl font-black tracking-tight text-primary uppercase">3. What legal bases do we rely on?</h4>
                            </div>
                            <div className="space-y-8 text-sm text-muted-foreground font-medium leading-relaxed text-left">
                                <p>We process data based on your **Explicit Affirmative Consent** and for the fulfillment of our institutional contract to provide forensic AI tools.</p>
                            </div>
                        </section>

                        <section id="section-4" className="space-y-8 scroll-mt-10 text-left">
                            <div className="flex items-center gap-4">
                                <div className="p-4 rounded-2xl bg-cyan-500/10 text-cyan-500 shadow-sm"><Share2 className="h-7 w-7" /></div>
                                <h4 className="text-xl sm:text-2xl font-black tracking-tight text-primary uppercase">4. When and with whom do we share info?</h4>
                            </div>
                            <div className="space-y-8 text-sm text-muted-foreground font-medium leading-relaxed">
                                <p>Sharing occurs only with authorized sub-processors like **Google Cloud AI** for neural computation. We never sell your personal data nodes.</p>
                            </div>
                        </section>

                        <section id="section-5" className="space-y-8 scroll-mt-10 text-left">
                            <div className="flex items-center gap-4">
                                <div className="p-4 rounded-2xl bg-indigo-500/10 text-indigo-500 shadow-sm"><Globe className="h-7 w-7" /></div>
                                <h4 className="text-xl sm:text-2xl font-black tracking-tight text-primary uppercase">5. Stance on third-party websites</h4>
                            </div>
                            <div className="space-y-10 text-sm text-muted-foreground font-medium leading-relaxed text-left">
                                <p>External links to High Court registries and advocate sites are outside our jurisdictional control. Always check their specific statutory notices.</p>
                            </div>
                        </section>

                        <section id="section-6" className="space-y-10 scroll-mt-10 text-left">
                            <div className="flex items-center gap-4">
                                <div className="p-4 rounded-2xl bg-cyan-500/10 text-cyan-500 shadow-sm"><Bot className="h-7 w-7" /></div>
                                <h4 className="text-xl sm:text-2xl font-black tracking-tight text-primary uppercase">6. Artificial intelligence products</h4>
                            </div>
                            <div className="space-y-8 text-sm text-muted-foreground font-medium leading-relaxed text-left">
                                <div className="p-8 bg-cyan-500/[0.03] rounded-[2.5rem] border border-cyan-500/10 space-y-6">
                                    <div className="flex items-center gap-3 text-cyan-600">
                                        <Sparkles className="h-5 w-5 animate-pulse" />
                                        <span className="font-black text-xs uppercase tracking-widest">Nyaya Mitra AI Engine</span>
                                    </div>
                                    <p className="text-xs leading-relaxed">Input data is purged from neural memory immediately after use. We do not maintain case-specific memory within the engine.</p>
                                </div>
                            </div>
                        </section>

                        <section id="section-7" className="space-y-8 scroll-mt-10 text-left">
                            <div className="flex items-center gap-4">
                                <div className="p-4 rounded-2xl bg-primary/10 text-primary shadow-sm"><UserCheck className="h-7 w-7" /></div>
                                <h4 className="text-xl sm:text-2xl font-black tracking-tight text-primary uppercase">7. Handling social logins</h4>
                            </div>
                            <div className="space-y-8 text-sm font-medium leading-relaxed text-left">
                                <p>Google login retrievals are limited to public identifiers needed for identity synchronization.</p>
                            </div>
                        </section>

                        <section id="section-8" className="space-y-8 scroll-mt-10 text-left">
                            <div className="flex items-center gap-4">
                                <div className="p-4 rounded-2xl bg-amber-500/10 text-amber-500 shadow-sm"><Clock className="h-7 w-7" /></div>
                                <h4 className="text-xl sm:text-2xl font-black tracking-tight text-primary uppercase">8. Data retention period</h4>
                            </div>
                            <div className="space-y-8 text-sm text-muted-foreground font-medium leading-relaxed text-left">
                                <p>Registry records are retained only for the life of your account. Terminated access is erased within 30 days.</p>
                            </div>
                        </section>

                        <section id="section-9" className="space-y-8 scroll-mt-10 text-left">
                            <div className="flex items-center gap-4">
                                <div className="p-4 rounded-2xl bg-rose-500/10 text-rose-500 shadow-sm"><ShieldAlert className="h-7 w-7" /></div>
                                <h4 className="text-xl sm:text-2xl font-black tracking-tight text-primary uppercase">9. Collection from minors</h4>
                            </div>
                            <div className="space-y-8 text-sm text-muted-foreground font-medium leading-relaxed text-left">
                                <p>Platform access is restricted to individuals aged 18 and above. Educational student access requires university-verified credentials.</p>
                            </div>
                        </section>

                        <section id="section-10" className="space-y-8 scroll-mt-10 text-left">
                            <div className="flex items-center gap-4">
                                <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-500 shadow-sm"><UserCheck className="h-7 w-7" /></div>
                                <h4 className="text-xl sm:text-2xl font-black tracking-tight text-primary uppercase">10. Your privacy rights</h4>
                            </div>
                            <div className="space-y-8 text-sm text-muted-foreground font-medium leading-relaxed text-left">
                                <p>You maintain sovereignty over your registry entry. You may request copies, correct mistakes, or purge your data at any time.</p>
                            </div>
                        </section>

                        <section id="section-11" className="space-y-8 scroll-mt-10 text-left">
                            <div className="flex items-center gap-4">
                                <div className="p-4 rounded-2xl bg-muted/30 shadow-sm"><Search className="h-7 w-7" /></div>
                                <h4 className="text-xl sm:text-2xl font-black tracking-tight text-primary uppercase">11. Do-Not-Track features</h4>
                            </div>
                            <div className="space-y-10 text-sm text-muted-foreground font-medium leading-relaxed text-left">
                                <p>We do not utilize behavioral tracking for marketing, rendering DNT signals irrelevant to our core mission.</p>
                            </div>
                        </section>

                        <section id="section-12" className="space-y-8 scroll-mt-10 text-left">
                            <div className="flex items-center gap-4">
                                <div className="p-4 rounded-2xl bg-amber-500/10 text-amber-500 shadow-sm"><Globe className="h-7 w-7" /></div>
                                <h4 className="text-xl sm:text-2xl font-black tracking-tight text-primary uppercase">12. US State privacy rights</h4>
                            </div>
                            <div className="space-y-10 text-sm text-muted-foreground font-medium leading-relaxed text-left">
                                <p>Rights for US residents are maintained in alignment with CCPA and state-specific statutory frameworks.</p>
                            </div>
                        </section>

                        <section id="section-13" className="space-y-10 scroll-mt-10 text-left">
                            <div className="flex items-center gap-4">
                                <div className="p-4 rounded-2xl bg-orange-500/10 text-orange-500 shadow-sm"><Scale className="h-7 w-7" /></div>
                                <h4 className="text-xl sm:text-2xl font-black tracking-tight text-primary uppercase">13. Indian resident rights (DPDP Act)</h4>
                            </div>
                            <div className="space-y-8 text-sm text-muted-foreground font-medium leading-relaxed text-left">
                                <p>As a resident of India, you have statutory rights to summary, correction, grievance redressal, and nomination under the **DPDP Act 2023.**</p>
                            </div>
                        </section>

                        <section id="section-14" className="space-y-8 scroll-mt-10 text-left">
                            <div className="flex items-center gap-4">
                                <div className="p-4 rounded-2xl bg-muted shadow-sm"><RefreshCw className="h-7 w-7" /></div>
                                <h4 className="text-xl sm:text-2xl font-black tracking-tight text-primary uppercase">14. Updates to this notice</h4>
                            </div>
                            <div className="space-y-10 text-sm text-muted-foreground font-medium leading-relaxed text-left">
                                <p>We update this protocol to remain compliant with judicial amendments. Material changes are broadcasted via dashboard alerts.</p>
                            </div>
                        </section>

                        <section id="section-15" className="space-y-8 scroll-mt-10 text-left">
                            <div className="flex items-center gap-4">
                                <div className="p-4 rounded-2xl bg-blue-500/10 text-blue-500 shadow-sm"><BellRing className="h-7 w-7" /></div>
                                <h4 className="text-xl sm:text-2xl font-black tracking-tight text-primary uppercase">15. Contact us</h4>
                            </div>
                            <div className="space-y-6 text-left">
                                <p className="text-sm text-muted-foreground font-medium">For any statutory inquiries, email our fiduciary desk:</p>
                                <Card className="p-6 bg-primary/5 border border-primary/10 rounded-2xl w-fit">
                                    <p className="text-[10px] font-black uppercase text-primary mb-1">Institutional email</p>
                                    <p className="text-sm font-black lowercase">nyayasahayakhelp@gmail.com</p>
                                </Card>
                            </div>
                        </section>

                        <section id="section-16" className="space-y-8 scroll-mt-10 text-left">
                            <div className="flex items-center gap-4">
                                <div className="p-4 rounded-2xl bg-red-500/10 text-red-500 shadow-sm"><Trash2 className="h-7 w-7" /></div>
                                <h4 className="text-xl sm:text-2xl font-black tracking-tight text-primary uppercase">16. Review or delete data</h4>
                            </div>
                            <div className="space-y-10 text-left">
                                <p className="text-sm text-muted-foreground leading-relaxed font-medium">You can delete everything anytime. Associated data will be purged from all systems within 30 days.</p>
                                <div className="bg-destructive/5 border border-destructive/20 p-8 rounded-[2rem] flex gap-6 items-start shadow-inner relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-5"><ShieldAlert className="h-20 w-20 text-destructive" /></div>
                                    <ShieldAlert className="h-8 w-8 text-destructive shrink-0 mt-1" />
                                    <p className="text-[11px] font-bold text-destructive/80 uppercase leading-relaxed tracking-tight">
                                        WARNING: DELETING YOUR DATA IS PERMANENT AND CANNOT BE UNDONE.
                                    </p>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </Card>
      </div>
    </div>
  );
}
