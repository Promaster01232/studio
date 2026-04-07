
"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <div className="max-w-6xl mx-auto space-y-10 pb-20 px-2 sm:px-6 text-left">
      <motion.div 
        initial={{ opacity: 0, y: -10 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 border-b border-primary/5 pb-8 text-left"
      >
        <PageHeader
          title="Privacy Rules"
          description="A simple guide on how we protect your data at Nyaya Sahayak."
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
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Your Data, Your Rules</span>
            </div>
            <div className="space-y-6 max-w-4xl">
              <h2 className="text-3xl sm:text-6xl font-black tracking-tighter leading-[0.9] uppercase text-foreground">
                Your Data is Your <br />
                <span className="text-primary italic">Sovereign Asset.</span>
              </h2>
              <p className="text-sm sm:text-xl text-muted-foreground font-medium leading-relaxed text-left">
                Nyaya Sahayak follows the **Digital Personal Data Protection Act, 2023.** We never sell your data. We only use it to help you with legal reports.
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
                                <h4 className="text-xl sm:text-2xl font-black tracking-tight text-primary uppercase">1. What information do we collect?</h4>
                            </div>
                            <div className="space-y-8 text-sm sm:text-base text-muted-foreground font-medium leading-relaxed">
                                <p>We collect your basic info like name and phone when you join. When you use our legal tools, we listen to your voice and read your legal documents to help you.</p>
                                
                                <div className="p-8 rounded-[2rem] bg-primary/5 border border-primary/10 space-y-6 shadow-inner text-left">
                                    <p className="font-black text-[10px] uppercase tracking-widest text-primary">Info we take:</p>
                                    <ul className="text-xs space-y-3 list-disc pl-6 opacity-80 font-bold uppercase tracking-tight">
                                        <li>Your Name and Email</li>
                                        <li>Mobile number for safety</li>
                                        <li>Lawyer ID (for experts only)</li>
                                        <li>Photos of legal papers</li>
                                    </ul>
                                </div>

                                <div className="space-y-4 pt-4">
                                    <p className="font-bold text-foreground uppercase tracking-widest text-[10px] border-l-4 border-indigo-500 pl-4">Smart Data Hub</p>
                                    <p>We use smart tools to understand your problem better:</p>
                                    <ul className="space-y-6">
                                        <li className="flex gap-5 p-6 bg-muted/30 rounded-[1.5rem] border border-primary/5">
                                            <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-600 shrink-0 h-fit shadow-sm"><Mic className="h-6 w-6" /></div>
                                            <div className="space-y-1 text-left">
                                                <p className="font-black text-xs uppercase tracking-tight text-foreground">Voice Stories</p>
                                                <p className="text-xs leading-relaxed">We record your voice story to write a report. We delete the sound file within 24 hours after making the report.</p>
                                            </div>
                                        </li>
                                        <li className="flex gap-5 p-6 bg-muted/30 rounded-[1.5rem] border border-primary/5">
                                            <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-600 shrink-0 h-fit shadow-sm"><FileText className="h-6 w-6" /></div>
                                            <div className="space-y-1 text-left">
                                                <p className="font-black text-xs uppercase tracking-tight text-foreground">Legal Papers</p>
                                                <p className="text-xs leading-relaxed">Our AI reads your uploaded papers to check for risks. We don't store these papers forever.</p>
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
                                <h4 className="text-xl sm:text-2xl font-black tracking-tight text-primary uppercase">2. How do we process your information?</h4>
                            </div>
                            <div className="space-y-8 text-sm text-muted-foreground font-medium leading-relaxed">
                                <p>We process your data to help you understand your legal rights. Here is how:</p>
                                <div className="grid gap-6 sm:grid-cols-2 text-left">
                                    <div className="p-8 rounded-[2.5rem] border border-primary/5 bg-primary/[0.02] space-y-4 shadow-sm">
                                        <CheckCircle2 className="h-6 w-6 text-primary" />
                                        <p className="font-black text-sm uppercase tracking-widest text-foreground">Safe Cloud Storage</p>
                                        <p className="text-xs opacity-70 leading-relaxed">Your data is kept in highly secure cloud nodes (Firebase) with strong encryption to keep hackers away.</p>
                                    </div>
                                    <div className="p-8 rounded-[2.5rem] border border-primary/5 bg-primary/[0.02] space-y-4 shadow-sm">
                                        <Cpu className="h-6 w-6 text-primary" />
                                        <p className="font-black text-sm uppercase tracking-widest text-foreground">AI Thinking</p>
                                        <p className="text-xs opacity-70 leading-relaxed">Our AI brain analyzes your story to find the right Indian laws (BNS) and suggests the best next steps.</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Section 3 */}
                        <section id="section-3" className="space-y-8 scroll-mt-10 text-left">
                            <div className="flex items-center gap-4">
                                <div className="p-4 rounded-2xl bg-amber-500/10 text-amber-500 shadow-sm"><Scale className="h-7 w-7" /></div>
                                <h4 className="text-xl sm:text-2xl font-black tracking-tight text-primary uppercase">3. What legal bases do we rely on?</h4>
                            </div>
                            <div className="space-y-8 text-sm text-muted-foreground font-medium leading-relaxed text-left">
                                <p>We follow the **Indian DPDP Act.** We use your data because:</p>
                                <ul className="space-y-4">
                                    <li className="flex gap-4 p-6 bg-amber-500/[0.03] border border-amber-500/10 rounded-2xl">
                                        <div className="p-2 rounded-lg bg-white dark:bg-black/20 h-fit shadow-sm"><CheckCircle2 className="h-4 w-4 text-amber-600" /></div>
                                        <p className="text-xs"><strong>Your Consent:</strong> You clicked 'Agree' and asked us to help you with AI.</p>
                                    </li>
                                    <li className="flex gap-4 p-6 bg-amber-500/[0.03] border border-amber-500/10 rounded-2xl">
                                        <div className="p-2 rounded-lg bg-white dark:bg-black/20 h-fit shadow-sm"><Gavel className="h-4 w-4 text-amber-600" /></div>
                                        <p className="text-xs"><strong>Law Safety:</strong> We might share data if requested by the Indian police or courts for your safety.</p>
                                    </li>
                                </ul>
                            </div>
                        </section>

                        {/* Section 4 */}
                        <section id="section-4" className="space-y-8 scroll-mt-10 text-left">
                            <div className="flex items-center gap-4">
                                <div className="p-4 rounded-2xl bg-cyan-500/10 text-cyan-500 shadow-sm"><Share2 className="h-7 w-7" /></div>
                                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">4. When and with whom do we share info?</h3>
                            </div>
                            <div className="space-y-8 text-sm sm:text-base text-muted-foreground font-medium leading-relaxed">
                                <p>We never sell your data. We only send it to our AI brain partner:</p>
                                <ul className="space-y-6">
                                    <li className="flex gap-6 p-8 bg-cyan-500/[0.03] border border-cyan-500/10 rounded-[2.5rem] shadow-xl">
                                        <div className="p-4 rounded-2xl bg-white dark:bg-black/20 shadow-md h-fit"><Bot className="h-8 w-8 text-cyan-600" /></div>
                                        <div className="space-y-2 text-left">
                                            <p className="font-black text-sm uppercase text-foreground">Google Cloud AI</p>
                                            <p className="text-xs leading-relaxed font-medium opacity-70">We send your story to Google Cloud AI so it can generate your report. Google is not allowed to use your data to train its own AI models.</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </section>

                        {/* Section 5 */}
                        <section id="section-5" className="space-y-8 scroll-mt-10 text-left">
                            <div className="flex items-center gap-4">
                                <div className="p-4 rounded-2xl bg-indigo-500/10 text-indigo-500 shadow-sm"><Globe className="h-7 w-7" /></div>
                                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">5. Stance on third-party websites</h3>
                            </div>
                            <div className="space-y-6 text-sm sm:text-base text-muted-foreground font-medium leading-loose">
                                <p>We have links to sites like eCourts. We are not responsible for what happens there. Always check the privacy rules of other sites.</p>
                            </div>
                        </section>

                        {/* Section 6 */}
                        <section id="section-6" className="space-y-10 scroll-mt-10 text-left">
                            <div className="flex items-center gap-4">
                                <div className="p-4 rounded-2xl bg-cyan-500/10 text-cyan-500 shadow-sm"><Bot className="h-7 w-7" /></div>
                                <h4 className="text-xl sm:text-2xl font-black tracking-tight text-primary uppercase">6. Artificial Intelligence products</h4>
                            </div>
                            <div className="space-y-8 text-sm text-muted-foreground font-medium leading-relaxed">
                                <div className="p-10 bg-cyan-500/[0.03] rounded-[3rem] border border-cyan-500/10 space-y-8 relative overflow-hidden group shadow-2xl text-left">
                                    <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-1000">
                                        <Bot className="h-64 w-64" />
                                    </div>
                                    <div className="relative z-10 space-y-8">
                                        <div className="flex items-center gap-3 text-cyan-600">
                                            <Sparkles className="h-5 w-5 animate-pulse" />
                                            <span className="font-black text-xs uppercase tracking-[0.3em]">Nyaya Mitra AI</span>
                                        </div>
                                        <p className="text-base sm:text-lg leading-relaxed">Our AI is very smart but keeps your data private:</p>
                                        <div className="grid sm:grid-cols-2 gap-6 pt-4 text-left">
                                            <div className="p-6 bg-background/80 backdrop-blur-md rounded-2xl border border-cyan-500/10 text-[11px] leading-relaxed shadow-inner">
                                                <Zap className="h-4 w-4 text-cyan-500 mb-2" />
                                                <strong className="block mb-1 text-foreground">No Learning:</strong> 
                                                The AI does not learn from your personal stories or legal secrets.
                                            </div>
                                            <div className="p-6 bg-background/80 backdrop-blur-md rounded-2xl border border-cyan-500/10 text-[11px] leading-relaxed shadow-inner">
                                                <Clock className="h-4 w-4 text-cyan-500 mb-2" />
                                                <strong className="block mb-1 text-foreground">Auto-Erase:</strong> 
                                                AI forgets your inputs right after the legal report is done.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Section 7 */}
                        <section id="section-7" className="space-y-8 scroll-mt-10 text-left">
                            <div className="flex items-center gap-4">
                                <div className="p-4 rounded-2xl bg-primary/10 text-primary shadow-sm"><UserCheck className="h-7 w-7" /></div>
                                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">7. Handling social logins</h3>
                            </div>
                            <div className="space-y-6 text-sm sm:text-base text-muted-foreground font-medium leading-relaxed text-left">
                                <p>If you use Google to log in, we only get your basic info like name, email, and photo to create your account.</p>
                            </div>
                        </section>

                        {/* Section 8 */}
                        <section id="section-8" className="space-y-8 scroll-mt-10 text-left">
                            <div className="flex items-center gap-4">
                                <div className="p-4 rounded-2xl bg-amber-500/10 text-amber-500 shadow-sm"><Clock className="h-7 w-7" /></div>
                                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">8. Data retention period</h3>
                            </div>
                            <div className="space-y-8 text-sm sm:text-base text-muted-foreground font-medium leading-relaxed">
                                <p>We keep your info only while you use the app. If you delete your account, we delete all your data within 30 days.</p>
                            </div>
                        </section>

                        {/* Section 9 */}
                        <section id="section-9" className="space-y-8 scroll-mt-10 text-left">
                            <div className="flex items-center gap-4">
                                <div className="p-4 rounded-2xl bg-rose-500/10 text-rose-500 shadow-sm"><ShieldAlert className="h-7 w-7" /></div>
                                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">9. Collection from minors</h3>
                            </div>
                            <div className="space-y-6 text-sm sm:text-base text-muted-foreground font-medium leading-relaxed">
                                <p>This app is for adults over 18. If a child uses it, we will delete their data as soon as we find out.</p>
                            </div>
                        </section>

                        {/* Section 10 */}
                        <section id="section-10" className="space-y-8 scroll-mt-10 text-left">
                            <div className="flex items-center gap-4">
                                <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-500 shadow-sm"><UserCheck className="h-7 w-7" /></div>
                                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">10. Your privacy rights</h3>
                            </div>
                            <div className="space-y-6 text-sm sm:text-base text-muted-foreground font-medium leading-relaxed">
                                <p>You are the boss of your data. You can:</p>
                                <ul className="grid gap-6 sm:grid-cols-2 list-none p-0 text-left">
                                    {[
                                        "Ask for a copy of all your data.",
                                        "Tell us to fix any mistakes in your info.",
                                        "Choose to delete everything anytime.",
                                        "Ask us to stop using AI for your case."
                                    ].map((right, i) => (
                                        <li key={i} className="p-5 border rounded-2xl bg-muted/10 font-bold text-[10px] uppercase tracking-tight flex items-center gap-4 shadow-sm">
                                            <CheckCircle2 className="h-5 w-5 text-primary" />
                                            {right}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </section>

                        {/* Section 11 */}
                        <section id="section-11" className="space-y-8 scroll-mt-10 text-left">
                            <div className="flex items-center gap-4">
                                <div className="p-4 rounded-2xl bg-muted/30 shadow-sm"><Search className="h-7 w-7" /></div>
                                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">11. Do-Not-Track features</h3>
                            </div>
                            <div className="space-y-6 text-sm sm:text-base text-muted-foreground font-medium leading-relaxed">
                                <p>We don't follow you on other websites. We only care about helping you inside this app.</p>
                            </div>
                        </section>

                        {/* Section 12 */}
                        <section id="section-12" className="space-y-8 scroll-mt-10 text-left">
                            <div className="flex items-center gap-4">
                                <div className="p-4 rounded-2xl bg-amber-500/10 text-amber-500 shadow-sm"><Globe className="h-7 w-7" /></div>
                                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">12. US State privacy rights</h3>
                            </div>
                            <div className="space-y-8 text-sm sm:text-base text-muted-foreground font-medium leading-relaxed">
                                <p>We follow US laws (like in California) for users from those states too.</p>
                            </div>
                        </section>

                        {/* Section 13 */}
                        <section id="section-13" className="space-y-10 scroll-mt-10 text-left">
                            <div className="flex items-center gap-4">
                                <div className="p-4 rounded-2xl bg-orange-500/10 text-orange-500 shadow-sm"><Scale className="h-7 w-7" /></div>
                                <h4 className="text-xl sm:text-2xl font-black tracking-tight text-primary uppercase">13. Indian resident rights (DPDP Act)</h4>
                            </div>
                            <div className="space-y-8 text-sm text-muted-foreground font-medium leading-relaxed">
                                <p>As an Indian citizen, you have strong rights under the **DPDP Act, 2023**:</p>
                                <ul className="grid gap-6 sm:grid-cols-2 list-none p-0 text-left">
                                    {[
                                        "Ask for a full report of what data we have.",
                                        "Fix any wrong info in your registry profile.",
                                        "Email nyayasahayakhelp@gmail.com for any complaints.",
                                        "Name a family member to manage your data if you can't.",
                                        "Delete all your history and voice transcripts forever.",
                                        "Request a machine-readable copy of your data."
                                    ].map((right, i) => (
                                        <li key={i} className="p-5 border rounded-2xl bg-muted/10 font-black text-[10px] uppercase tracking-tight flex items-center gap-4 shadow-sm hover:bg-orange-500/[0.03] transition-all group">
                                            <CheckCircle2 className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                                            {right}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </section>

                        {/* Section 14 */}
                        <section id="section-14" className="space-y-8 scroll-mt-10 text-left">
                            <div className="flex items-center gap-4">
                                <div className="p-4 rounded-2xl bg-muted shadow-sm"><RefreshCw className="h-7 w-7" /></div>
                                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">14. Updates to this notice</h3>
                            </div>
                            <div className="space-y-6 text-sm sm:text-base text-muted-foreground font-medium leading-relaxed">
                                <p>If we change these rules, we will tell you on your dashboard. Please read them from time to time.</p>
                            </div>
                        </section>

                        {/* Section 15 */}
                        <section id="section-15" className="space-y-8 scroll-mt-10 text-left">
                            <div className="flex items-center gap-4">
                                <div className="p-4 rounded-2xl bg-blue-500/10 text-blue-500 shadow-sm"><BellRing className="h-7 w-7" /></div>
                                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">15. Contact us</h3>
                            </div>
                            <div className="space-y-6 text-left">
                                <p className="text-sm text-muted-foreground leading-relaxed font-medium">If you have any questions, email us at:</p>
                                <Card className="p-6 bg-primary/5 border border-primary/10 rounded-2xl w-fit">
                                    <p className="text-[10px] font-black uppercase text-primary mb-1">Help Desk Email</p>
                                    <p className="text-sm font-black lowercase">nyayasahayakhelp@gmail.com</p>
                                </Card>
                            </div>
                        </section>

                        {/* Section 16 */}
                        <section id="section-16" className="space-y-8 scroll-mt-10 text-left">
                            <div className="flex items-center gap-4">
                                <div className="p-4 rounded-2xl bg-red-500/10 text-red-500 shadow-sm"><Trash2 className="h-7 w-7" /></div>
                                <h4 className="text-xl sm:text-2xl font-black tracking-tight text-primary uppercase">16. Review or delete data</h4>
                            </div>
                            <div className="space-y-6 text-left">
                                <p className="text-sm text-muted-foreground leading-relaxed font-medium">You can delete everything anytime. Associated data will be purged from all nodes within 30 days.</p>
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

      <div className="text-center pt-8 opacity-30">
          <p className="text-[9px] font-black uppercase tracking-[0.6em] text-muted-foreground">NYAYASAHAYAK.IN // JUSTICE FOR BHARAT // <History className="inline h-3 w-3" /> 2025</p>
      </div>
    </div>
  );
}
