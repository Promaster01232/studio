
"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FileText, 
  ShieldCheck, 
  AlertTriangle, 
  Scale, 
  History, 
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
  { id: "section-1", title: "1. Our Services" },
  { id: "section-2", title: "2. Intellectual Property Rights" },
  { id: "section-3", title: "3. User Representations" },
  { id: "section-4", title: "4. User Registration" },
  { id: "section-5", title: "5. Prohibited Activities" },
  { id: "section-6", title: "6. User Generated Contributions" },
  { id: "section-7", title: "7. Contribution License" },
  { id: "section-8", title: "8. Guidelines for Reviews" },
  { id: "section-9", title: "9. Social Media" },
  { id: "section-10", title: "10. Advertisers" },
  { id: "section-11", title: "11. Services Management" },
  { id: "section-12", title: "12. Privacy Policy" },
  { id: "section-13", title: "13. Copyright Infringements" },
  { id: "section-14", title: "14. Term and Termination" },
  { id: "section-15", title: "15. Modifications and Interruptions" },
  { id: "section-16", title: "16. Governing Law" },
  { id: "section-17", title: "17. Dispute Resolution" },
  { id: "section-18", title: "18. Corrections" },
  { id: "section-19", title: "19. Disclaimer" },
  { id: "section-20", title: "20. Limitations of Liability" },
  { id: "section-21", title: "21. Indemnification" },
  { id: "section-22", title: "22. User Data" },
  { id: "section-23", title: "23. Electronic Communications" },
  { id: "section-24", title: "24. California Users" },
  { id: "section-25", title: "25. Miscellaneous" },
  { id: "section-26", title: "26. Case Data & AI Outputs" },
  { id: "section-27", title: "27. Institutional Architecture" },
  { id: "section-28", title: "28. No Legal Outcome Guarantee" },
  { id: "section-29", title: "29. Community Respect Clause" },
  { id: "section-30", title: "30. Contact Us" }
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
          title="Statutory Terms"
          description="Institutional Protocol & User Agreement for the Nyaya Sahayak Ecosystem."
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
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Official Binding Agreement</span>
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tighter leading-tight text-foreground uppercase">Agreement to our <br /><span className="text-primary italic">Legal Terms</span></h2>
            <p className="text-sm sm:text-lg text-muted-foreground font-medium leading-relaxed max-w-4xl">
              We are <span className="text-foreground font-bold">Nyaya Sahayak</span>, operated by Hardy Pie ("Company," "we," "us," or "our"). We provide high-fidelity AI legal assistance and forensic document auditing via <span className="text-primary font-bold">https://nyayasahayak.in</span>.
            </p>
            <div className="p-8 rounded-[2rem] bg-destructive/5 border border-destructive/10 space-y-4 shadow-inner">
              <p className="text-sm font-black text-destructive uppercase tracking-widest flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" /> Binding Mandate
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                By initializing a session on our dashboard, you confirm that you have read, understood, and agreed to be bound by all of these Legal Terms. <span className="text-foreground font-bold uppercase underline">If you do not agree with any clause, you must disconnect from the terminal immediately.</span>
              </p>
            </div>
          </div>
        </CardContent>
        <div className="h-2 w-full bg-gradient-to-r from-primary via-accent to-blue-400"></div>
      </Card>

      <section className="space-y-6 text-left">
        <div className="flex items-center gap-3">
            <div className="h-1 w-8 bg-primary rounded-full" />
            <h2 className="text-xl font-black uppercase tracking-tighter">Table of Contents</h2>
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
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">1. Our Services</h3>
            </div>
            <div className="space-y-6 text-sm sm:text-base text-muted-foreground font-medium leading-relaxed">
                <p>Nyaya Sahayak provides an institutional-grade platform for AI-powered legal assistance, forensic document auditing, and statutory case mapping within the Indian Judicial System. Our services include automated document generation, voice-to-legal transcription, and case strength probability modeling.</p>
                <p>The information provided is primarily tailored for the statutes of Bharat and is not intended for distribution in any jurisdiction where such use would violate local regulations or subject us to unauthorized registration requirements.</p>
            </div>
        </section>

        <section id="section-2" className="space-y-8 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-indigo-500/10 text-indigo-500 shadow-sm"><Cpu className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">2. Intellectual Property Rights</h3>
            </div>
            <div className="space-y-6 text-sm text-muted-foreground font-medium leading-relaxed">
                <p>We are the sole owner or the authorized licensee of all intellectual property rights in our Services, including source code, neural weights, forensic algorithms, database structures, and website designs (collectively, the "Content"), as well as our trademarks and logos (the "Marks").</p>
                <div className="p-8 bg-muted/30 rounded-[2rem] border border-primary/5 space-y-4">
                    <p className="font-black text-xs uppercase tracking-widest text-foreground">Usage License:</p>
                    <p className="text-xs leading-relaxed opacity-80">We grant you a non-exclusive, revocable license to access the terminal and download reports for your personal, non-commercial use. Any unauthorized reproduction, scraping, or commercial exploitation constitutes a terminal breach of these terms.</p>
                </div>
            </div>
        </section>

        <section id="section-3" className="space-y-8 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-amber-500/10 text-amber-500 shadow-sm"><UserCheck className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">3. User Representations</h3>
            </div>
            <div className="space-y-6 text-sm text-muted-foreground font-medium leading-relaxed">
                <p>By initializing your node, you represent that: (1) all registry information you submit is true and accurate; (2) you will maintain the integrity of this data; (3) you have the legal capacity to agree to these protocols; (4) you are not a minor without guardian supervision; and (5) your use will not violate any statutory law of India.</p>
            </div>
        </section>

        <section id="section-4" className="space-y-8 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-cyan-500/10 text-cyan-500 shadow-sm"><Lock className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">4. User Registration</h3>
            </div>
            <div className="space-y-6 text-sm text-muted-foreground font-medium leading-relaxed">
                <p>You may be required to register to use the forensic terminals. You agree to keep your access key (password) confidential and are responsible for all activities occurring under your registry node. We reserve the right to reclaim usernames that are found to be inappropriate or in violation of institutional standards.</p>
            </div>
        </section>

        <section id="section-5" className="space-y-8 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-rose-500/10 text-rose-500 shadow-sm"><Ban className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">5. Prohibited Activities</h3>
            </div>
            <div className="space-y-6 text-sm text-muted-foreground font-medium leading-relaxed">
                <p>You may not access or use the Services for any unauthorized purpose. Prohibited activities include: (1) systematically retrieving data to compile a competitor database; (2) attempting to trick or defraud the neural engine; (3) circumventing security nodes; (4) uploading malicious code; and (5) using the system for automated spam or misinformation campaigns.</p>
            </div>
        </section>

        <section id="section-6" className="space-y-8 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-indigo-500/10 text-indigo-500 shadow-sm"><MessageSquare className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">6. User Generated Contributions</h3>
            </div>
            <div className="space-y-6 text-sm text-muted-foreground font-medium leading-relaxed">
                <p>The platform invites you to participate in community transmissions (Posts). Any content you transmit may be treated as non-confidential. You represent that your contributions do not infringe on third-party rights and are not obscene, libelous, or in violation of Indian IT laws.</p>
            </div>
        </section>

        <section id="section-7" className="space-y-8 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-primary/10 text-primary shadow-sm"><FileSignature className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">7. Contribution License</h3>
            </div>
            <div className="space-y-6 text-sm text-muted-foreground font-medium leading-relaxed">
                <p>By posting Contributions, you grant us an unrestricted, perpetual, worldwide, and royalty-free license to host, copy, and distribute such content. You retain ownership of your original thoughts, but we maintain the right to display them within the community registry for institutional growth.</p>
            </div>
        </section>

        <section id="section-8" className="space-y-8 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-amber-500/10 text-amber-500 shadow-sm"><Star className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">8. Guidelines for Reviews</h3>
            </div>
            <div className="space-y-6 text-sm text-muted-foreground font-medium leading-relaxed">
                <p>Reviews of advocates must be based on firsthand statutory interactions. Reviews containing profanity, hateful language, or competitor-driven bias will be purged from the registry without notice.</p>
            </div>
        </section>

        <section id="section-9" className="space-y-8 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-blue-500/10 text-blue-500 shadow-sm"><Smartphone className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">9. Social Media</h3>
            </div>
            <div className="space-y-6 text-sm text-muted-foreground font-medium leading-relaxed">
                <p>You may initialize your node using third-party logins (e.g., Google). We retrieve specific identity markers strictly to facilitate authentication. Your relationship with these providers is governed by their respective terms.</p>
            </div>
        </section>

        <section id="section-10" className="space-y-8 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-muted/30 text-foreground shadow-sm"><Zap className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">10. Advertisers</h3>
            </div>
            <div className="space-y-6 text-sm text-muted-foreground font-medium leading-relaxed">
                <p>We allow limited advertisements in specific terminal areas. We provide the space for these nodes but maintain no liability for third-party products or their external compliance.</p>
            </div>
        </section>

        <section id="section-11" className="space-y-8 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-primary/10 text-primary shadow-sm"><Settings className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">11. Services Management</h3>
            </div>
            <div className="space-y-6 text-sm text-muted-foreground font-medium leading-relaxed">
                <p>We reserve the right to monitor the Services for violations and take statutory action against anyone who breaches these terms. For anonymous posts, we reserve the right to revoke masking in response to a legal investigation or court order.</p>
            </div>
        </section>

        <section id="section-12" className="space-y-8 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-500 shadow-sm"><ShieldCheck className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">12. Privacy Policy</h3>
            </div>
            <div className="space-y-6 text-sm text-muted-foreground font-medium leading-relaxed">
                <p>Your data is protected under our Privacy Protocol, which is incorporated into these terms. By using the terminal, you agree to the forensic processing of your data as described in the protocol node.</p>
            </div>
        </section>

        <section id="section-13" className="space-y-8 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-destructive/10 text-destructive shadow-sm"><ShieldAlert className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">13. Copyright Infringements</h3>
            </div>
            <div className="space-y-6 text-sm text-muted-foreground font-medium leading-relaxed">
                <p>We respect the intellectual property of others. If you believe any material on the platform infringes your copyright, please transmit a formal notification to our designated agent at nyayasahayakhelp@gmail.com.</p>
            </div>
        </section>

        <section id="section-14" className="space-y-8 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-muted/30 text-foreground shadow-sm"><Activity className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">14. Term and Termination</h3>
            </div>
            <div className="space-y-6 text-sm text-muted-foreground font-medium leading-relaxed">
                <p>These terms remain in effect while you use the terminal. We reserve the right to terminate your node without warning for breach of protocol or any applicable Indian regulation.</p>
            </div>
        </section>

        <section id="section-15" className="space-y-8 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-amber-500/10 text-amber-500 shadow-sm"><RefreshCw className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">15. Modifications and Interruptions</h3>
            </div>
            <div className="space-y-6 text-sm text-muted-foreground font-medium leading-relaxed">
                <p>We reserve the right to update terminal content or pricing at our sole discretion. We do not guarantee 100% uptime and are not liable for session delays caused by maintenance or network latency.</p>
            </div>
        </section>

        <section id="section-16" className="space-y-8 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-primary/10 text-primary shadow-sm"><Landmark className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">16. Governing Law</h3>
            </div>
            <div className="space-y-6 text-sm text-muted-foreground font-medium leading-relaxed">
                <p>These Legal Terms shall be governed by and defined following the laws of <strong>India</strong>. You irrevocably consent that the courts of India shall have exclusive jurisdiction to resolve any dispute.</p>
            </div>
        </section>

        <section id="section-17" className="space-y-8 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-indigo-500/10 text-indigo-500 shadow-sm"><Gavel className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">17. Dispute Resolution</h3>
            </div>
            <div className="space-y-6 text-sm text-muted-foreground font-medium leading-relaxed">
                <p>Parties agree to attempt informal negotiations for at least 30 days before initiating arbitration. Any final dispute shall be resolved via binding arbitration in India under the rules of the International Commercial Arbitration Court.</p>
            </div>
        </section>

        <section id="section-18" className="space-y-8 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-muted/30 text-foreground shadow-sm"><Info className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">18. Corrections</h3>
                <Badge className="bg-primary/10 text-primary uppercase text-[8px] font-black">Audit Node</Badge>
            </div>
            <div className="space-y-6 text-sm text-muted-foreground font-medium leading-relaxed">
                <p>There may be information on the terminal that contains typographical errors or omissions. We reserve the right to correct any inaccuracies and update information at any time without prior notice.</p>
            </div>
        </section>

        <section id="section-19" className="space-y-8 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-destructive/10 text-destructive shadow-sm"><ShieldAlert className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">19. Disclaimer</h3>
            </div>
            <div className="space-y-6 text-sm text-muted-foreground font-medium leading-relaxed">
                <p className="font-black uppercase tracking-tight text-destructive">The platform is provided on an "AS-IS" and "AS-AVAILABLE" basis.</p>
                <p>We provide forensic intelligence and procedural roadmaps, not legal advice. The AI Nyaya Mitra Assistant is NOT a substitute for human legal strategy.</p>
            </div>
        </section>

        <section id="section-20" className="space-y-8 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-blue-500/10 text-blue-500 shadow-sm"><Scale className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">20. Limitations of Liability</h3>
            </div>
            <div className="space-y-6 text-sm text-muted-foreground font-medium leading-relaxed">
                <p>In no event will we be liable for any direct, indirect, or consequential damages resulting from your reliance on AI analysis. Our total liability for any cause whatsoever will at all times be limited to $50.00 USD.</p>
            </div>
        </section>

        <section id="section-21" className="space-y-8 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-primary/10 text-primary shadow-sm"><ShieldCheck className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">21. Indemnification</h3>
            </div>
            <div className="space-y-6 text-sm text-muted-foreground font-medium leading-relaxed">
                <p>You agree to defend and hold us harmless, including our subsidiaries, affiliates, and all of our respective officers, agents, partners, and employees, from and against any loss, damage, liability, claim, or demand, including reasonable attorneys’ fees and expenses, made by any third party due to or arising out of: (1) your Contributions; (2) use of the Services; (3) breach of these Legal Terms; (4) any breach of your representations and warranties set forth in these Legal Terms; (5) your violation of the rights of a third party, including but not limited to intellectual property rights; or (6) any overt harmful act toward any other user of the Services with whom you connected via the Services. </p>
            </div>
        </section>

        <section id="section-22" className="space-y-8 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-indigo-500/10 text-indigo-500 shadow-sm"><Database className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">22. User Data</h3>
            </div>
            <div className="space-y-6 text-sm text-muted-foreground font-medium leading-relaxed">
                <p>We maintain certain data transmitted to the terminal for forensic auditing. Although we perform regular backups, you are solely responsible for the content of your transmissions. We are not liable for any data corruption resulting from user-side latency.</p>
            </div>
        </section>

        <section id="section-23" className="space-y-8 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-cyan-500/10 text-cyan-500 shadow-sm"><Mail className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">23. Electronic Communications</h3>
            </div>
            <div className="space-y-6 text-sm text-muted-foreground font-medium leading-relaxed">
                <p>Visiting the terminal or sending emails constitutes electronic communications. You consent to receive statutory notices, agreements, and disclosures electronically via your registry email node.</p>
            </div>
        </section>

        <section id="section-24" className="space-y-8 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-muted/30 text-foreground shadow-sm"><MapPin className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">24. California Users</h3>
            </div>
            <div className="space-y-6 text-sm text-muted-foreground font-medium leading-relaxed">
                <p>Residents of California may contact the Complaint Assistance Unit of the Division of Consumer Services at the address specified in our full statutory document for specific consumer rights inquiries.</p>
            </div>
        </section>

        <section id="section-25" className="space-y-8 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-primary/10 text-primary shadow-sm"><Layers className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">25. Miscellaneous</h3>
            </div>
            <div className="space-y-6 text-sm text-muted-foreground font-medium leading-relaxed">
                <p>These terms constitute the entire understanding between you and the institutional provider. Our failure to enforce any right does not operate as a waiver of such statutory provision.</p>
            </div>
        </section>

        <section id="section-26" className="space-y-10 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-indigo-500/10 text-indigo-500 shadow-sm"><Bot className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">26. Case Data & AI Outputs</h3>
            </div>
            <div className="space-y-8 text-sm text-muted-foreground font-medium leading-relaxed">
                <p>Citizens maintain sovereignty over the case narratives they transmit. However, by submitting data to the Nyaya Mitra neural engine, you grant us a non-exclusive license to process and display such content within the diagnostic framework.</p>
                <div className="p-8 border rounded-[2rem] bg-indigo-500/[0.02] border-indigo-500/10 italic text-xs leading-loose shadow-inner">
                    "AI outputs—including case summaries and document drafts—are generated via probabilistic neural processing and do not constitute 'Legal Advice' as defined by statutory regulations."
                </div>
            </div>
        </section>

        <section id="section-27" className="space-y-10 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-amber-500/10 text-amber-500 shadow-sm"><Cpu className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">27. Institutional Architecture</h3>
            </div>
            <div className="space-y-8 text-sm text-muted-foreground font-medium leading-relaxed">
                <p>Nyaya Sahayak is an elite forensic node designed and developed by IdeaSpark. The visionary architect Hardy Pie maintains the root logic of this ecosystem to ensure 100% statutory transparency for the citizens of Bharat.</p>
            </div>
        </section>

        <section id="section-28" className="space-y-10 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-rose-500/10 text-rose-500 shadow-sm"><CheckCircle2 className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">28. No Legal Outcome Guarantee</h3>
            </div>
            <div className="space-y-8 text-sm text-muted-foreground font-medium leading-relaxed">
                <p>Nyaya Sahayak provides a platform for forensic research and procedural navigation. We do NOT guarantee judicial success, specific bail outcomes, or any business/legal funding results from the information shared or generated on this site.</p>
            </div>
        </section>

        <section id="section-29" className="space-y-10 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-500 shadow-sm"><UserPlus className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">29. Community Respect Clause</h3>
            </div>
            <div className="space-y-8 text-sm text-muted-foreground font-medium leading-relaxed">
                <p>Users of the community stream are expected to maintain professional decorum. Constructive forensic feedback is welcome; however, trolling, institutional toxicity, or personal attacks on other citizen nodes will result in immediate registry termination.</p>
            </div>
        </section>

        <section id="section-30" className="space-y-12 pt-16 border-t border-primary/5 scroll-mt-24 text-left">
            <div className="flex flex-col md:flex-row gap-16 text-left">
                <div className="flex-1 space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="p-4 rounded-2xl bg-blue-500/10 text-blue-500 shadow-sm"><Mail className="h-7 w-7" /></div>
                        <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">30. Contact Us</h3>
                    </div>
                    <p className="text-sm sm:text-lg leading-loose">To resolve a complaint regarding the Services or to receive further information regarding usage protocols, utilize our official institutional channels:</p>
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
                                    <p className="text-[10px] font-black uppercase text-primary tracking-[0.4em]">Statutory Node</p>
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
                                    <p className="text-[10px] font-black uppercase text-primary tracking-[0.4em]">Institutional Desk</p>
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
