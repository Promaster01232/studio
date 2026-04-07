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
  RefreshCw,
  Layers
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
    <div className="max-w-6xl mx-auto space-y-10 pb-24 px-2 sm:px-6 text-left">
      <motion.div 
        initial={{ opacity: 0, y: -10 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 border-b border-primary/5 pb-8 text-left"
      >
        <PageHeader
          title="Institutional Terms"
          description="Mandatory statutory agreement for authorized Nyaya Sahayak terminal users."
        />
        <Badge variant="outline" className="font-black text-[9px] uppercase tracking-widest bg-primary/5 text-primary border-primary/10 px-4 py-1.5 rounded-full shadow-sm">Agreement Node 2025</Badge>
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
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Official Binding Terms</span>
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tighter leading-tight text-foreground uppercase">Agreement to our <br /><span className="text-primary italic">Legal Terms</span></h2>
            <p className="text-sm sm:text-lg text-muted-foreground font-medium leading-relaxed max-w-4xl">
              We are <span className="text-foreground font-bold">Nyaya Sahayak</span>, the institutional provider of AI-driven legal forensics. These Legal Terms constitute a legally binding agreement concerning your access to our forensic terminals.
            </p>
            <div className="p-8 rounded-[2rem] bg-destructive/5 border border-destructive/10 space-y-4 shadow-inner">
              <p className="text-sm font-black text-destructive uppercase tracking-widest flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" /> Binding Protocol
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Utilization of dashboard tools implies total acceptance. <span className="text-foreground font-bold uppercase underline">If you do not agree with all of these terms, you are prohibited from using the services and must disconnect immediately.</span>
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
        
        {/* Section 1 */}
        <section id="section-1" className="space-y-8 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-blue-500/10 text-blue-500 shadow-sm"><Globe className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">1. Our Services</h3>
            </div>
            <div className="space-y-6 text-sm sm:text-base text-muted-foreground font-medium leading-relaxed">
                <p>The information provided when using the Services is tailored for the Indian Judicial System. Users accessing from other jurisdictions are solely responsible for compliance with their respective local statutory frameworks.</p>
                <p>Our tools do not replace human legal advocacy. They are designed to provide procedural roadmaps and forensic insights based on the Bharatiya Nyaya Sanhita (BNS) and other relevant Indian laws.</p>
            </div>
        </section>

        {/* Section 2 */}
        <section id="section-2" className="space-y-8 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-indigo-500/10 text-indigo-500 shadow-sm"><Cpu className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">2. Intellectual Property Rights</h3>
            </div>
            <div className="space-y-6 text-sm text-muted-foreground font-medium leading-relaxed">
                <p>Nyaya Sahayak maintains absolute ownership of all institutional code, neural weight configurations, and forensic document structures provided within the dashboard.</p>
                <div className="p-8 bg-muted/30 rounded-[2rem] border border-primary/5 space-y-4">
                    <p className="font-black text-xs uppercase tracking-widest text-foreground">Usage Node License:</p>
                    <p className="text-xs leading-relaxed opacity-80">You are granted a revocable, non-transferable license to generate and download legal drafts for your personal use. Any unauthorized scraping or commercial resale of AI outputs is a terminal violation.</p>
                </div>
            </div>
        </section>

        {/* Section 3 */}
        <section id="section-3" className="space-y-8 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-amber-500/10 text-amber-500 shadow-sm"><UserCheck className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">3. User Representations</h3>
            </div>
            <div className="space-y-6 text-sm text-muted-foreground font-medium leading-relaxed">
                <p>By utilizing the terminal, you represent that: (1) all registry nodes you provide are accurate; (2) you have the statutory capacity to use the system; (3) you are not under the age of 13; and (4) your use does not violate any national security standard of Bharat.</p>
            </div>
        </section>

        {/* Section 4 */}
        <section id="section-4" className="space-y-8 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-cyan-500/10 text-cyan-500 shadow-sm"><Lock className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">4. User Registration</h3>
            </div>
            <div className="space-y-6 text-sm text-muted-foreground font-medium leading-relaxed">
                <p>User registration requires a unique identity node. You agree to keep your access key confidential and are liable for all actions occurring under your registry profile. We reserve the right to revoke usernames that violate institutional decorum.</p>
            </div>
        </section>

        {/* Section 5 */}
        <section id="section-5" className="space-y-8 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-rose-500/10 text-rose-500 shadow-sm"><Ban className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">5. Prohibited Activities</h3>
            </div>
            <div className="space-y-6 text-sm text-muted-foreground font-medium leading-relaxed">
                <p>Prohibited activities include: (1) systematic data extraction for competitor use; (2) attempting to defraud the AI co-pilot; (3) bypassing security nodes; (4) Harassing institutional agents; and (5) using the terminal for unauthorized commercial enterprises.</p>
            </div>
        </section>

        {/* Section 6 */}
        <section id="section-6" className="space-y-8 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-indigo-500/10 text-indigo-500 shadow-sm"><MessageSquare className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">6. User Generated Contributions</h3>
            </div>
            <div className="space-y-6 text-sm text-muted-foreground font-medium leading-relaxed">
                <p>Community stream posts (Contributions) must adhere to professional standards. You are responsible for ensuring your posts do not infringe on third-party IP or violate Indian cyber laws.</p>
            </div>
        </section>

        {/* Section 7 */}
        <section id="section-7" className="space-y-8 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-primary/10 text-primary shadow-sm"><FileSignature className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">7. Contribution License</h3>
            </div>
            <div className="space-y-6 text-sm text-muted-foreground font-medium leading-relaxed">
                <p>By posting to the registry, you grant us an unrestricted license to use and distribute such content. You retain ownership, but we maintain the right to archive and display the node for community benefit.</p>
            </div>
        </section>

        {/* Section 8 */}
        <section id="section-8" className="space-y-8 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-amber-500/10 text-amber-500 shadow-sm"><Star className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">8. Guidelines for Reviews</h3>
            </div>
            <div className="space-y-6 text-sm text-muted-foreground font-medium leading-relaxed">
                <p>Advocate reviews must be based on genuine interactions. Reviews containing profanity or competitor bias will be purged from the registry without notice.</p>
            </div>
        </section>

        {/* Section 9 */}
        <section id="section-9" className="space-y-8 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-blue-500/10 text-blue-500 shadow-sm"><Smartphone className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">9. Social Media</h3>
            </div>
            <div className="space-y-6 text-sm text-muted-foreground font-medium leading-relaxed">
                <p>Node initialization via third-party accounts (Google) retrieves identifiers strictly for synchronization. We are not responsible for the privacy practices of these external providers.</p>
            </div>
        </section>

        {/* Section 10 */}
        <section id="section-10" className="space-y-8 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-muted/30 text-foreground shadow-sm"><Zap className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">10. Advertisers</h3>
            </div>
            <div className="space-y-6 text-sm text-muted-foreground font-medium leading-relaxed">
                <p>Limited advertising nodes may be present. We maintain no liability for third-party products advertised on the terminal.</p>
            </div>
        </section>

        {/* Section 11 */}
        <section id="section-11" className="space-y-8 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-primary/10 text-primary shadow-sm"><Settings className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">11. Services Management</h3>
            </div>
            <div className="space-y-6 text-sm text-muted-foreground font-medium leading-relaxed">
                <p>We reserve the right to monitor the terminal for protocol violations. Anonymous posts are subject to de-masking in response to a legal investigation or court order.</p>
            </div>
        </section>

        {/* Section 12 */}
        <section id="section-12" className="space-y-8 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-500 shadow-sm"><ShieldCheck className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">12. Privacy Policy</h3>
            </div>
            <div className="space-y-6 text-sm text-muted-foreground font-medium leading-relaxed">
                <p>Terminal usage is governed by our Privacy Protocol. By using the terminal, you agree to the forensic processing of your data as described in the protocol node.</p>
            </div>
        </section>

        {/* Section 13 */}
        <section id="section-13" className="space-y-8 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-destructive/10 text-destructive shadow-sm"><ShieldAlert className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">13. Copyright Infringements</h3>
            </div>
            <div className="space-y-6 text-sm text-muted-foreground font-medium leading-relaxed">
                <p>Material infringing on copyrights will be removed from the registry upon valid notification to nyayasahayakhelp@gmail.com.</p>
            </div>
        </section>

        {/* Section 14 */}
        <section id="section-14" className="space-y-8 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-muted/30 text-foreground shadow-sm"><Activity className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">14. Term and Termination</h3>
            </div>
            <div className="space-y-6 text-sm text-muted-foreground font-medium leading-relaxed">
                <p>These terms remain active during your use of the Services. We reserve the right to terminate your node for any breach of protocol without prior warning.</p>
            </div>
        </section>

        {/* Section 15 */}
        <section id="section-15" className="space-y-8 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-amber-500/10 text-amber-500 shadow-sm"><RefreshCw className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">15. Modifications and Interruptions</h3>
            </div>
            <div className="space-y-6 text-sm text-muted-foreground font-medium leading-relaxed">
                <p>We reserve the right to update terminal content or pricing nodes. We do not guarantee 100% uptime and are not liable for session delays caused by maintenance or network latency.</p>
            </div>
        </section>

        {/* Section 16 */}
        <section id="section-16" className="space-y-8 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-primary/10 text-primary shadow-sm"><Landmark className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">16. Governing Law</h3>
            </div>
            <div className="space-y-6 text-sm text-muted-foreground font-medium leading-relaxed">
                <p>These terms are governed by the laws of <strong>India</strong>. Any disputes shall be subject to the exclusive jurisdiction of the courts of Bharat.</p>
            </div>
        </section>

        {/* Section 17 */}
        <section id="section-17" className="space-y-8 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-indigo-500/10 text-indigo-500 shadow-sm"><Gavel className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">17. Dispute Resolution</h3>
            </div>
            <div className="space-y-6 text-sm text-muted-foreground font-medium leading-relaxed">
                <p>Parties agree to attempts at informal negotiation for at least 30 days. Final disputes shall be resolved via binding arbitration within India.</p>
            </div>
        </section>

        {/* Section 18 */}
        <section id="section-18" className="space-y-8 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-muted/30 text-foreground shadow-sm"><Info className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">18. Corrections</h3>
            </div>
            <div className="space-y-6 text-sm text-muted-foreground font-medium leading-relaxed">
                <p>We reserve the right to correct any typographical errors or inaccuracies in terminal content at any time without prior notice.</p>
            </div>
        </section>

        {/* Section 19 */}
        <section id="section-19" className="space-y-8 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-destructive/10 text-destructive shadow-sm"><ShieldAlert className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">19. Disclaimer</h3>
            </div>
            <div className="space-y-6 text-sm text-muted-foreground font-medium leading-relaxed">
                <p className="font-black uppercase tracking-tight text-destructive">THE PLATFORM IS PROVIDED AS-IS.</p>
                <p>We provide forensic intelligence and procedural roadmaps, not legal advice. The AI Assistant is NOT a substitute for human legal strategy.</p>
            </div>
        </section>

        {/* Section 20 */}
        <section id="section-20" className="space-y-8 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-blue-500/10 text-blue-500 shadow-sm"><Scale className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">20. Limitations of Liability</h3>
            </div>
            <div className="space-y-6 text-sm text-muted-foreground font-medium leading-relaxed">
                <p>In no event will we be liable for any damages resulting from your reliance on AI analysis. Our total liability is limited to $50.00 USD.</p>
            </div>
        </section>

        {/* Section 21 */}
        <section id="section-21" className="space-y-8 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-primary/10 text-primary shadow-sm"><ShieldCheck className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">21. Indemnification</h3>
            </div>
            <div className="space-y-6 text-sm text-muted-foreground font-medium leading-relaxed">
                <p>You agree to hold us harmless from any demand made by any third party due to your contributions or your misuse of terminal services.</p>
            </div>
        </section>

        {/* Section 22 */}
        <section id="section-22" className="space-y-8 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-indigo-500/10 text-indigo-500 shadow-sm"><Database className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">22. User Data</h3>
            </div>
            <div className="space-y-6 text-sm text-muted-foreground font-medium leading-relaxed">
                <p>We maintain data transmitted to the terminal for forensic auditing. You are solely responsible for the content of your transmissions.</p>
            </div>
        </section>

        {/* Section 23 */}
        <section id="section-23" className="space-y-8 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-cyan-500/10 text-cyan-500 shadow-sm"><Mail className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">23. Electronic Communications</h3>
            </div>
            <div className="space-y-6 text-sm text-muted-foreground font-medium leading-relaxed">
                <p>Visiting the terminal constitutes electronic communications. You consent to receive statutory notices electronically via your registry email.</p>
            </div>
        </section>

        {/* Section 24 */}
        <section id="section-24" className="space-y-8 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-muted/30 text-foreground shadow-sm"><MapPin className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">24. California Users</h3>
            </div>
            <div className="space-y-6 text-sm text-muted-foreground font-medium leading-relaxed">
                <p>Residents of California may contact state consumer assistance units for specific rights inquiries as outlined in our full protocol.</p>
            </div>
        </section>

        {/* Section 25 */}
        <section id="section-25" className="space-y-8 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-primary/10 text-primary shadow-sm"><Layers className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">25. Miscellaneous</h3>
            </div>
            <div className="space-y-6 text-sm text-muted-foreground font-medium leading-relaxed">
                <p>These terms constitute the entire understanding between you and the institutional provider. Provisions are severable and do not affect remaining nodes.</p>
            </div>
        </section>

        {/* Section 26 */}
        <section id="section-26" className="space-y-10 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-indigo-500/10 text-indigo-500 shadow-sm"><Bot className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">26. Case Data & AI Outputs</h3>
            </div>
            <div className="space-y-8 text-sm text-muted-foreground font-medium leading-relaxed">
                <p>AI outputs—including case summaries and document drafts—are generated via probabilistic neural processing and do not constitute 'Legal Advice'.</p>
            </div>
        </section>

        {/* Section 27 */}
        <section id="section-27" className="space-y-10 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-amber-500/10 text-amber-500 shadow-sm"><Cpu className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">27. Institutional Architecture</h3>
            </div>
            <div className="space-y-8 text-sm text-muted-foreground font-medium leading-relaxed">
                <p>Nyaya Sahayak is developed by IdeaSpark. Root authority Hardy Pie maintains the logical nodes of this ecosystem for statutory transparency.</p>
            </div>
        </section>

        {/* Section 28 */}
        <section id="section-28" className="space-y-10 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-rose-500/10 text-rose-500 shadow-sm"><CheckCircle2 className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">28. No Legal Outcome Guarantee</h3>
            </div>
            <div className="space-y-8 text-sm text-muted-foreground font-medium leading-relaxed">
                <p>We do NOT guarantee judicial success, specific bail outcomes, or any legal result from information generated on this terminal.</p>
            </div>
        </section>

        {/* Section 29 */}
        <section id="section-29" className="space-y-10 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-500 shadow-sm"><UserPlus className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">29. Community Respect Clause</h3>
            </div>
            <div className="space-y-8 text-sm text-muted-foreground font-medium leading-relaxed">
                <p>Maintain professional decorum in community streams. Trolling or toxicity results in immediate registry termination.</p>
            </div>
        </section>

        {/* Section 30 */}
        <section id="section-30" className="space-y-12 pt-16 border-t border-primary/5 scroll-mt-24 text-left">
            <div className="flex flex-col md:flex-row gap-16 text-left">
                <div className="flex-1 space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="p-4 rounded-2xl bg-blue-500/10 text-blue-500 shadow-sm"><Mail className="h-7 w-7" /></div>
                        <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">30. Contact Us</h3>
                    </div>
                    <p className="text-sm sm:text-lg leading-loose">To resolve a complaint or receive further usage protocols, utilize our official institutional channels:</p>
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

      <div className="text-center pt-24 pb-12 opacity-30">
          <p className="text-[9px] font-black uppercase tracking-[0.6em] text-muted-foreground">NYAYASAHAYAK.IN // JUSTICE FOR BHARAT // <History className="inline h-3 w-3" /> 2025</p>
      </div>
    </div>
  );
}
