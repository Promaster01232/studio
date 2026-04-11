
"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { 
  FileText, 
  ShieldCheck, 
  AlertTriangle, 
  Scale, 
  History as LucideHistory, 
  Fingerprint, 
  Gavel, 
  Bot, 
  Globe,
  Ban,
  Lock,
  Cpu,
  Zap,
  Activity,
  CheckCircle2,
  Settings,
  Info,
  ChevronRight,
  ShieldAlert,
  UserCheck,
  Smartphone,
  Trash2,
  Mail,
  MapPin,
  CreditCard,
  MessageSquare,
  Landmark,
  UserPlus,
  FileSignature,
  Star,
  Layers,
  RefreshCw,
  Database
} from "lucide-react";
import { motion } from "framer-motion";
import { Logo } from "@/components/logo";
import { Badge } from "@/components/ui/badge";

const toc = [
  { id: "section-1", title: "1. Our services" },
  { id: "section-2", title: "2. Intellectual property rights" },
  { id: "section-3", title: "3. User representations" },
  { id: "section-4", title: "4. User registration" },
  { id: "section-5", title: "5. Prohibited activities" },
  { id: "section-6", title: "6. User generated contributions" },
  { id: "section-7", title: "7. Contribution license" },
  { id: "section-16", title: "16. Governing law" },
  { id: "section-19", title: "19. Disclaimer" },
  { id: "section-30", title: "30. Contact us" }
];

export default function TermsPage() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-24 px-4 sm:px-6 text-left">
      <motion.div 
        initial={{ opacity: 0, y: -10 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 border-b border-primary/5 pb-8 text-left"
      >
        <PageHeader
          title="Statutory terms"
          description="Institutional protocol & user agreement for the Nyaya Sahayak ecosystem."
        />
        <Badge variant="outline" className="font-black text-[9px] uppercase tracking-widest bg-primary/5 text-primary border-primary/10 px-4 py-1.5 rounded-full">Protocol 2025</Badge>
      </motion.div>

      <Card className="border-none ring-1 ring-primary/10 shadow-3xl rounded-[3rem] overflow-hidden bg-card/40 backdrop-blur-xl relative">
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none grayscale">
          <Logo className="h-64 w-64" />
        </div>
        <CardContent className="p-8 sm:p-16 relative z-10 text-left space-y-8">
          <div className="flex items-center gap-3 text-primary mb-2">
            <div className="bg-primary/10 p-2.5 rounded-xl shadow-inner">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Official binding agreement</span>
          </div>
          <div className="space-y-6 text-left">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tighter leading-tight text-foreground uppercase">Agreement to our <br /><span className="text-primary italic">Legal terms</span></h2>
            <p className="text-sm sm:text-lg text-muted-foreground font-medium leading-relaxed max-w-4xl text-left">
              We are <span className="text-foreground font-bold">Nyaya Sahayak</span>, providing high-fidelity AI legal assistance and forensic document auditing via <span className="text-primary font-bold">https://nyayasahayak.in</span>.
            </p>
            <div className="p-8 rounded-[2rem] bg-destructive/5 border border-destructive/10 space-y-4 shadow-inner text-left">
              <p className="text-sm font-black text-destructive uppercase tracking-widest flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" /> Binding mandate
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                By accessing this terminal, you confirm that you have read, understood, and agreed to be bound by all of these Legal Terms. <span className="text-foreground font-bold uppercase underline">If you do not agree with any clause, you must disconnect from the site immediately.</span>
              </p>
            </div>
          </div>
        </CardContent>
        <div className="h-2 w-full bg-gradient-to-r from-primary via-accent to-blue-400"></div>
      </Card>

      <section className="space-y-6 text-left">
        <div className="flex items-center gap-3">
            <div className="h-1 w-8 bg-primary rounded-full" />
            <h2 className="text-xl font-black uppercase tracking-tighter">Table of contents</h2>
        </div>
        <Card className="border-primary/5 bg-background shadow-inner rounded-[2.5rem] p-8 sm:p-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-4">
                {toc.map((item, idx) => (
                    <button 
                        key={idx} 
                        onClick={() => scrollToSection(item.id)}
                        className="flex items-center gap-3 group text-left transition-colors hover:text-primary"
                    >
                        <ChevronRight className="h-3 w-3 text-primary/40 group-hover:translate-x-1 transition-transform" />
                        <span className="text-[10px] font-bold uppercase tracking-tight opacity-70 group-hover:opacity-100 truncate">{item.title}</span>
                    </button>
                ))}
            </div>
        </Card>
      </section>

      <div className="space-y-32 pt-16 border-t border-primary/5">
        
        <section id="section-1" className="space-y-8 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-blue-500/10 text-blue-500 shadow-sm"><Globe className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase text-left">1. Our services</h3>
            </div>
            <div className="space-y-6 text-sm sm:text-base text-muted-foreground font-medium leading-relaxed text-left">
                <p>Nyaya Sahayak provides an institutional-grade platform for AI-powered legal assistance and forensic document auditing within the Indian Judicial System. Our services include automated document generation and case strength probability modeling.</p>
            </div>
        </section>

        <section id="section-16" className="space-y-8 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-primary/10 text-primary shadow-sm"><Landmark className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase text-left">16. Governing law</h3>
            </div>
            <div className="space-y-6 text-sm text-muted-foreground font-medium leading-relaxed text-left">
                <p>These Legal Terms shall be governed by and defined following the laws of <strong>India</strong>. You irrevocably consent that the courts of India shall have exclusive jurisdiction to resolve any dispute.</p>
            </div>
        </section>

        <section id="section-19" className="space-y-8 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-destructive/10 text-destructive shadow-sm"><ShieldAlert className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase text-left">19. Disclaimer</h3>
            </div>
            <div className="space-y-6 text-sm text-muted-foreground font-medium leading-relaxed text-left">
                <p className="font-black uppercase tracking-tight text-destructive">The platform is provided on an "AS-IS" and "AS-AVAILABLE" basis.</p>
                <p>We provide forensic intelligence and procedural roadmaps, not legal advice. The AI Assistant is NOT a substitute for human legal strategy.</p>
            </div>
        </section>

        <section id="section-30" className="space-y-12 pt-16 border-t border-primary/5 scroll-mt-24 text-left">
            <div className="flex flex-col md:flex-row gap-16 text-left">
                <div className="flex-1 space-y-8 text-left">
                    <div className="flex items-center gap-4">
                        <div className="p-4 rounded-2xl bg-blue-500/10 text-blue-500 shadow-sm"><Mail className="h-7 w-7" /></div>
                        <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">30. Contact us</h3>
                    </div>
                    <p className="text-sm sm:text-lg leading-loose text-left">To resolve a complaint regarding the Services or to receive further information regarding usage protocols, utilize our official institutional channels:</p>
                </div>
                <div className="w-full md:w-[450px]">
                    <Card className="p-10 bg-primary/5 border-primary/10 rounded-[3rem] shadow-3xl relative overflow-hidden group text-left">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
                            <Logo className="h-40 w-48" />
                        </div>
                        <div className="space-y-10 relative z-10 text-left">
                            <div className="flex items-start gap-6 text-left">
                                <div className="p-4 rounded-2xl bg-primary text-white shadow-xl shadow-primary/20"><MapPin className="h-6 w-6" /></div>
                                <div className="space-y-2 text-left">
                                    <p className="text-[10px] font-black uppercase text-primary tracking-[0.4em]">Statutory node</p>
                                    <p className="text-xs font-black leading-relaxed text-foreground/80 uppercase">
                                        Nyaya Sahayak Terminal<br />
                                        Jharkhand 822101, India
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-6 text-left">
                                <div className="p-4 rounded-2xl bg-primary text-white shadow-xl shadow-primary/20"><Mail className="h-6 w-6" /></div>
                                <div className="space-y-2 text-left">
                                    <p className="text-[10px] font-black uppercase text-primary tracking-[0.4em]">Institutional desk</p>
                                    <p className="text-xs font-black text-foreground hover:underline select-all lowercase">nyayasahayakhelp@gmail.com</p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </section>

      </div>
    </div>
  );
}
