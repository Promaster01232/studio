
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
          description="A simple guide on how we protect your data at Nyaya Sahayak."
        />
        <Badge variant="outline" className="font-black text-[9px] uppercase tracking-widest bg-primary/5 text-primary border-primary/10 px-4 py-1.5 rounded-full">Protocol 2025</Badge>
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
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Your Data, Your Rules</span>
          </div>
          <p className="text-sm sm:text-lg text-muted-foreground font-medium leading-relaxed max-w-3xl text-left">
            This page explains how <span className="text-foreground font-bold">Nyaya Sahayak</span> takes care of your information. We want to be very clear about what we do with your data when you use our website <span className="text-primary font-bold">nyayasahayak.in</span>.
          </p>
          <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 flex items-start gap-4 shadow-inner text-left">
              <Info className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <p className="text-xs font-medium text-muted-foreground italic leading-relaxed">
                  "If you don't agree with these rules, please stop using the app. If you have questions, email us at nyayasahayakhelp@gmail.com."
              </p>
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
        <section id="section-1" className="space-y-8 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-blue-500/10 text-blue-500 shadow-sm"><Database className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">1. What information do we collect?</h3>
            </div>
            <div className="space-y-8 text-sm sm:text-base text-muted-foreground font-medium leading-relaxed">
                <p>We only collect information that you give us. When you sign up or use our legal tools, we need some basic details to help you correctly.</p>
                
                <div className="p-8 rounded-[2.5rem] bg-primary/5 border border-primary/10 space-y-6 shadow-inner text-left">
                    <p className="font-black text-xs uppercase tracking-widest text-primary border-b border-primary/10 pb-2">Information you give us:</p>
                    <div className="grid sm:grid-cols-2 gap-8">
                        <ul className="text-xs space-y-3 list-disc pl-6 font-bold uppercase tracking-tight opacity-80">
                            <li>Your Full Name</li>
                            <li>Your Email Address</li>
                            <li>Your Mobile Number (with OTP check)</li>
                            <li>Your Lawyer ID (if you are a lawyer)</li>
                        </ul>
                        <ul className="text-xs space-y-3 list-disc pl-6 font-bold uppercase tracking-tight opacity-80">
                            <li>Your Password (safely hidden)</li>
                            <li>Whether you are a Student or Citizen</li>
                            <li>Payment details (for premium tools)</li>
                            <li>Your Profile Photo</li>
                        </ul>
                    </div>
                </div>

                <div className="space-y-6 pt-6">
                    <div className="flex items-center gap-3">
                        <div className="h-4 w-1 bg-indigo-500 rounded-full" />
                        <p className="font-black text-foreground uppercase tracking-widest text-xs">Special Legal Data</p>
                    </div>
                    <p>To help you with your legal problems, we collect some special data:</p>
                    <ul className="space-y-6">
                        <li className="flex gap-5 p-8 rounded-[2.5rem] bg-muted/30 border border-primary/5 shadow-sm transition-all hover:bg-primary/[0.02]">
                            <div className="p-4 rounded-2xl bg-indigo-500/10 text-indigo-600 shrink-0 h-fit shadow-inner"><Mic className="h-6 w-6" /></div>
                            <div className="space-y-2 text-left">
                                <p className="font-black text-sm uppercase tracking-tight text-foreground">Your Voice Story</p>
                                <p className="text-xs leading-relaxed opacity-80 font-medium">When you use the "Speak Your Story" button, we record your voice. Our AI listens to it to understand your problem. We delete the sound file within 24 hours after making your report.</p>
                            </div>
                        </li>
                        <li className="flex gap-5 p-8 rounded-[2.5rem] bg-muted/30 border border-primary/5 shadow-sm transition-all hover:bg-primary/[0.02]">
                            <div className="p-4 rounded-2xl bg-indigo-500/10 text-indigo-600 shrink-0 h-fit shadow-inner"><FileText className="h-6 w-6" /></div>
                            <div className="space-y-2 text-left">
                                <p className="font-black text-sm uppercase tracking-tight text-foreground">Your Legal Papers</p>
                                <p className="text-xs leading-relaxed opacity-80 font-medium">When you upload a legal document, our AI reads it to find risks or dates. We don't store these papers forever; they are processed and cleared quickly.</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </section>

        {/* Section 2 */}
        <section id="section-2" className="space-y-8 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-indigo-500/10 text-indigo-500 shadow-sm"><Server className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">2. How do we process your information?</h3>
            </div>
            <div className="space-y-8 text-sm sm:text-base text-muted-foreground font-medium leading-relaxed">
                <p>We use your data only to run the app and help you with legal advice. Here is exactly what we do:</p>
                
                <div className="p-8 bg-indigo-500/[0.02] rounded-[3rem] border border-indigo-500/10 space-y-10 shadow-2xl text-left">
                    <div className="grid sm:grid-cols-2 gap-10">
                        <div className="space-y-4">
                            <div className="p-3 rounded-xl bg-white dark:bg-black/20 w-fit shadow-md"><Bot className="h-6 w-6 text-indigo-600" /></div>
                            <h4 className="font-black text-sm uppercase tracking-widest text-foreground">AI Analysis</h4>
                            <p className="text-xs leading-loose opacity-70">Our AI reads your story and tells you which sections of the new Indian laws (BNS) apply to you. This helps you understand your case better.</p>
                        </div>
                        <div className="space-y-4">
                            <div className="p-3 rounded-xl bg-white dark:bg-black/20 w-fit shadow-md"><ShieldCheck className="h-6 w-6 text-indigo-600" /></div>
                            <h4 className="font-black text-sm uppercase tracking-widest text-foreground">Identity Check</h4>
                            <p className="text-xs leading-loose opacity-70">We check lawyer IDs to make sure only real experts are in our directory. We use your phone and email to keep your account safe from hackers.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Section 3 */}
        <section id="section-3" className="space-y-8 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-amber-500/10 text-amber-500 shadow-sm"><Scale className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">3. What legal bases do we rely on?</h3>
            </div>
            <div className="space-y-8 text-sm sm:text-base text-muted-foreground font-medium leading-relaxed text-left">
                <p>In India, we follow the **Digital Personal Data Protection (DPDP) Act, 2023.** We only use your data because:</p>
                <ul className="space-y-4">
                    <li className="flex gap-4 p-6 bg-amber-500/[0.03] border border-amber-500/10 rounded-2xl">
                        <div className="p-2 rounded-lg bg-white dark:bg-black/20 h-fit shadow-sm"><CheckCircle2 className="h-4 w-4 text-amber-600" /></div>
                        <p className="text-xs"><strong>You Said Yes:</strong> You gave us permission by clicking 'Agree' and using our tools.</p>
                    </li>
                    <li className="flex gap-4 p-6 bg-amber-500/[0.03] border border-amber-500/10 rounded-2xl">
                        <div className="p-2 rounded-lg bg-white dark:bg-black/20 h-fit shadow-sm"><Gavel className="h-4 w-4 text-amber-600" /></div>
                        <p className="text-xs"><strong>Law Requirements:</strong> Sometimes the government or courts might ask for info to prevent crime.</p>
                    </li>
                </ul>
            </div>
        </section>

        {/* Section 4 */}
        <section id="section-4" className="space-y-8 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-cyan-500/10 text-cyan-500 shadow-sm"><Share2 className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">4. When and with whom do we share info?</h3>
            </div>
            <div className="space-y-8 text-sm sm:text-base text-muted-foreground font-medium leading-relaxed">
                <p>We **never sell** your data to anyone. We only share it with trusted partners who help us run the app:</p>
                <div className="p-8 border rounded-[2rem] bg-cyan-500/[0.02] border-cyan-500/10 space-y-6">
                    <div className="flex gap-4 items-start">
                        <Bot className="h-6 w-6 text-cyan-600 shrink-0" />
                        <div className="space-y-1">
                            <p className="font-black text-xs uppercase text-foreground">AI Partners (Google Cloud)</p>
                            <p className="text-xs">Your stories are sent to Google's secure AI systems so they can help us write your reports. Google is not allowed to use your secrets to teach its AI.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Section 5 */}
        <section id="section-5" className="space-y-8 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-indigo-500/10 text-indigo-500 shadow-sm"><Globe className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">5. Stance on third-party websites</h3>
            </div>
            <div className="space-y-6 text-sm sm:text-base text-muted-foreground font-medium leading-loose">
                <p>Our app has links to government sites like eCourts. We don't control those sites. If you click on them, please read their own privacy rules.</p>
                <div className="p-8 bg-indigo-500/[0.02] border border-indigo-500/10 rounded-[2.5rem] flex gap-6 items-start">
                    <ExternalLink className="h-8 w-8 text-indigo-600 shrink-0" />
                    <div className="space-y-2">
                        <p className="text-xs font-bold text-foreground">Stay Alert</p>
                        <p className="text-xs">When you go to a different website, we cannot protect your data there. Be careful about what you share on external pages.</p>
                    </div>
                </div>
            </div>
        </section>

        {/* Section 6 */}
        <section id="section-6" className="space-y-10 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-cyan-500/10 text-cyan-500 shadow-sm"><Bot className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">6. Artificial Intelligence products</h3>
            </div>
            <div className="space-y-8 text-sm text-muted-foreground font-medium leading-relaxed">
                <div className="p-10 bg-cyan-500/[0.03] rounded-[3rem] border border-cyan-500/10 relative overflow-hidden group shadow-2xl text-left">
                    <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-1000">
                        <Bot className="h-64 w-64" />
                    </div>
                    <div className="relative z-10 space-y-8">
                        <div className="flex items-center gap-3 text-cyan-600">
                            <Sparkles className="h-5 w-5 animate-pulse" />
                            <span className="font-black text-xs uppercase tracking-[0.3em]">Nyaya Mitra AI Engine</span>
                        </div>
                        <p className="text-base sm:text-lg leading-relaxed max-w-4xl">Our app uses a very smart AI to help you. We follow strict safety rules:</p>
                        
                        <div className="grid sm:grid-cols-2 gap-8 pt-4 text-left">
                            <Card className="p-8 bg-background/80 backdrop-blur-md rounded-[2rem] border border-cyan-500/10 space-y-4 shadow-inner">
                                <div className="flex items-center gap-3 text-cyan-600">
                                    <ShieldCheck className="h-5 w-5" />
                                    <p className="font-black text-[10px] uppercase tracking-widest">No Teaching AI</p>
                                </div>
                                <p className="text-xs leading-loose opacity-70">We never use your private stories to train our AI models. Your problems stay your own business.</p>
                            </Card>
                            <Card className="p-8 bg-background/80 backdrop-blur-md rounded-[2rem] border border-cyan-500/10 space-y-4 shadow-inner">
                                <div className="flex items-center gap-3 text-cyan-600">
                                    <Clock className="h-5 w-5" />
                                    <p className="font-black text-[10px] uppercase tracking-widest">Fast Delete</p>
                                </div>
                                <p className="text-xs leading-loose opacity-70">As soon as your legal report is ready, the AI forgets the details of your story. We don't keep raw voice files.</p>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Section 7 */}
        <section id="section-7" className="space-y-8 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-primary/10 text-primary shadow-sm"><UserCheck className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">7. Handling social logins</h3>
            </div>
            <div className="space-y-6 text-sm sm:text-base text-muted-foreground font-medium leading-relaxed text-left">
                <p>If you use Google to log in, we only take your name, email, and profile picture to make it easy for you to enter the app.</p>
                <div className="p-8 rounded-[2rem] bg-muted/20 border border-primary/5 space-y-4">
                    <p className="text-xs font-bold text-foreground">What we get:</p>
                    <ul className="grid grid-cols-2 gap-4 list-disc pl-6 text-[11px] uppercase tracking-tight font-black opacity-60">
                        <li>Your Name</li>
                        <li>Verified Email</li>
                        <li>Profile Photo</li>
                        <li>Unique User ID</li>
                    </ul>
                </div>
            </div>
        </section>

        {/* Section 8 */}
        <section id="section-8" className="space-y-8 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-amber-500/10 text-amber-500 shadow-sm"><Clock className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">8. Data retention period</h3>
            </div>
            <div className="space-y-8 text-sm sm:text-base text-muted-foreground font-medium leading-relaxed">
                <p>We keep your data only as long as you have an account with us. We follow these rules:</p>
                <div className="grid sm:grid-cols-2 gap-6 text-left">
                    <div className="p-8 rounded-[2rem] border border-primary/5 bg-primary/[0.02] shadow-sm space-y-4">
                        <p className="font-black text-sm uppercase tracking-widest text-foreground">While Active</p>
                        <p className="text-xs opacity-70 leading-relaxed">Your profile and saved reports are kept while your account is open so you can see them anytime.</p>
                    </div>
                    <div className="p-8 rounded-[2rem] border border-primary/5 bg-primary/[0.02] shadow-sm space-y-4">
                        <p className="font-black text-sm uppercase tracking-widest text-foreground">When you leave</p>
                        <p className="text-xs opacity-70 leading-relaxed">If you delete your account, everything is permanently removed within 30 days.</p>
                    </div>
                </div>
            </div>
        </section>

        {/* Section 9 */}
        <section id="section-9" className="space-y-8 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-rose-500/10 text-rose-500 shadow-sm"><ShieldAlert className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">9. Collection from minors</h3>
            </div>
            <div className="space-y-6 text-sm sm:text-base text-muted-foreground font-medium leading-relaxed">
                <p>Nyaya Sahayak is only for adults (18 years or older). We do not knowingly take data from children.</p>
                <div className="p-6 bg-rose-500/5 border border-rose-500/10 rounded-2xl italic text-xs">
                    "Law students under 18 must use the app with parent permission."
                </div>
            </div>
        </section>

        {/* Section 10 */}
        <section id="section-10" className="space-y-8 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-500 shadow-sm"><UserCheck className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">10. Your privacy rights</h3>
            </div>
            <div className="space-y-6 text-sm sm:text-base text-muted-foreground font-medium leading-relaxed">
                <p>You are in charge of your data. You can do the following at any time:</p>
                <div className="grid gap-4 sm:grid-cols-2">
                    {[
                        { t: "Change Details", d: "You can update your name or phone number in your profile." },
                        { t: "Delete Everything", d: "You can click 'Delete Account' to remove all your records." },
                        { t: "Ask for Copy", d: "You can ask us for a copy of all the info we have about you." },
                        { t: "Stop AI Hub", d: "You can tell us to stop using AI for your case anytime." }
                    ].map((r, i) => (
                        <div key={i} className="p-6 rounded-2xl border border-primary/5 bg-background shadow-sm text-left">
                            <p className="font-black text-[10px] uppercase text-primary mb-1">{r.t}</p>
                            <p className="text-xs opacity-70">{r.d}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* Section 11 */}
        <section id="section-11" className="space-y-8 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-muted/30 shadow-sm"><Search className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">11. Do-Not-Track features</h3>
            </div>
            <div className="space-y-6 text-sm sm:text-base text-muted-foreground font-medium leading-relaxed">
                <p>Our app does not track your behavior on other websites. We don't use ads that follow you around.</p>
            </div>
        </section>

        {/* Section 12 */}
        <section id="section-12" className="space-y-8 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-amber-500/10 text-amber-500 shadow-sm"><Globe className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">12. US State privacy rights</h3>
            </div>
            <div className="space-y-8 text-sm sm:text-base text-muted-foreground font-medium leading-relaxed">
                <p>If you live in the US (like California), you have special rights. We follow those rules too.</p>
                <div className="overflow-x-auto rounded-3xl border border-primary/10 shadow-inner">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-primary/5 font-black uppercase tracking-widest">
                            <tr>
                                <th className="p-4">Category</th>
                                <th className="p-4">What we take</th>
                                <th className="p-4">How long kept</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-primary/5 font-bold">
                            <tr><td className="p-4">A. Identifiers</td><td className="p-4">Name, Email</td><td className="p-4">Account Life</td></tr>
                            <tr><td className="p-4">F. Web Activity</td><td className="p-4">Clicks in app</td><td className="p-4">24 Months</td></tr>
                            <tr><td className="p-4">H. Voice/Sensory</td><td className="p-4">Voice Records</td><td className="p-4">24H (Raw)</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </section>

        {/* Section 13 */}
        <section id="section-13" className="space-y-10 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-orange-500/10 text-orange-500 shadow-sm"><Scale className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">13. Indian resident rights (DPDP Act)</h3>
            </div>
            <div className="space-y-8 text-sm sm:text-base text-muted-foreground font-medium leading-relaxed">
                <p>As an Indian citizen, you are protected by the **Digital Personal Data Protection Act, 2023.** You have these strong rights:</p>
                <div className="grid gap-6 sm:grid-cols-2 text-left">
                    {[
                        { title: "Ask for Summary", desc: "You can ask for a full list of all your data we have and what we did with it." },
                        { title: "Fix Mistakes", desc: "If we have your wrong name or wrong data, you can tell us to fix it instantly." },
                        { title: "Complaint Box", desc: "If you are unhappy, email our help desk at nyayasahayakhelp@gmail.com." },
                        { title: "Nominate Person", desc: "You can choose a family member to manage your data if you are unable to." },
                        { title: "Full Delete", desc: "You can tell us to erase all your history and transcripts forever." },
                        { title: "Say No Anytime", desc: "You can stop giving us permission, and we will stop using your data immediately." }
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

        {/* Section 14 */}
        <section id="section-14" className="space-y-8 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-muted shadow-sm"><RefreshCw className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">14. Updates to this notice</h3>
            </div>
            <div className="space-y-6 text-sm sm:text-base text-muted-foreground font-medium leading-relaxed">
                <p>Sometimes we change these rules. We will show a notice on your dashboard if we make big changes. Please check this page sometimes.</p>
            </div>
        </section>

        {/* Section 15 */}
        <section id="section-15" className="space-y-10 pt-16 border-t border-primary/5 scroll-mt-24 text-left">
            <div className="flex flex-col md:flex-row gap-12 text-left">
                <div className="flex-1 space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="p-4 rounded-2xl bg-blue-500/10 text-blue-500 shadow-sm"><BellRing className="h-7 w-7" /></div>
                        <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">15. Contact us</h3>
                    </div>
                    <p className="text-sm sm:text-base leading-loose">If you have any questions or want to delete your data, please reach out to us:</p>
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
                                    <p className="text-[10px] font-black uppercase text-primary tracking-[0.3em]">Our Office</p>
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
                                    <p className="text-[10px] font-black uppercase text-primary tracking-[0.3em]">Our Email</p>
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
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">16. Review or delete your data</h3>
            </div>
            <div className="space-y-6 text-sm sm:text-base text-muted-foreground font-medium leading-loose text-left">
                <p>You can tell us to delete everything. Just go to your Profile settings or email us at nyayasahayakhelp@gmail.com.</p>
                <div className="p-8 bg-destructive/5 border border-destructive/20 rounded-[2rem] shadow-inner relative overflow-hidden text-left group">
                    <div className="absolute top-0 right-0 p-4 opacity-[0.05] group-hover:scale-110 transition-transform"><ShieldAlert className="h-24 w-24 text-destructive" /></div>
                    <p className="text-xs font-black text-destructive flex items-center gap-3 mb-4 uppercase tracking-tighter">
                        <ShieldAlert className="h-5 w-5" /> Final Delete Rule
                    </p>
                    <p className="text-[11px] opacity-80 leading-relaxed font-bold uppercase tracking-tight max-w-2xl">
                        EVERYTHING—INCLUDING YOUR NAME, VOICE STORIES, AND LEGAL REPORTS—WILL BE PERMANENTLY ERASED IN 30 DAYS. THIS CANNOT BE UNDONE.
                    </p>
                </div>
            </div>
        </section>

      </div>

      <div className="text-center pt-20 pb-10 opacity-30">
          <p className="text-[9px] font-black uppercase tracking-[0.6em] text-muted-foreground">NYAYASAHAYAK.IN // JUSTICE FOR BHARAT // <History className="inline h-3 w-3" /> 2025</p>
      </div>
    </motion.div>
  );
}
