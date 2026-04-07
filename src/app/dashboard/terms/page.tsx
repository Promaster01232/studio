"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  UserPlus
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
          title="Institutional Terms of Service"
          description="Last updated: June 23, 2025 // Official Protocol for nyayasahayak.in"
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
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Official Legal Terms</span>
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tighter leading-tight text-foreground uppercase">Agreement to our <br /><span className="text-primary italic">Legal Terms</span></h2>
            <p className="text-sm sm:text-lg text-muted-foreground font-medium leading-relaxed max-w-4xl">
              We are <span className="text-foreground font-bold">Nyaya Sahayak</span> ("Company," "we," "us," or "our"). We operate the website <span className="text-primary font-bold">https://nyayasahayak.in</span>, as well as any other related products and services that refer or link to these legal terms (the "Legal Terms") (collectively, the "Services").
            </p>
            <div className="p-8 rounded-[2rem] bg-destructive/5 border border-destructive/10 space-y-4 shadow-inner">
              <p className="text-sm font-black text-destructive uppercase tracking-widest flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" /> Binding Protocol
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                By accessing the Services, you confirm that you have read, understood, and agreed to be bound by all of these Legal Terms. <span className="text-foreground font-bold uppercase underline">If you do not agree with all of these terms, you are prohibited from using the services and must disconnect immediately.</span>
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
                <p>The information provided when using the Services is not intended for distribution to or use by any person or entity in any jurisdiction or country where such distribution or use would be contrary to law or regulation or which would subject us to any registration requirement within such jurisdiction or country.</p>
                <p>The Services are tailored for the Indian Judicial System and may not comply with industry-specific regulations in other regions (e.g., US HIPAA, FISMA). If your interactions would be subjected to such laws, you may not use the Services.</p>
            </div>
        </section>

        {/* Section 2 */}
        <section id="section-2" className="space-y-8 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-indigo-500/10 text-indigo-500 shadow-sm"><Cpu className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">2. Intellectual Property Rights</h3>
            </div>
            <div className="space-y-6 text-sm text-muted-foreground font-medium leading-relaxed">
                <p>We are the owner or the licensee of all intellectual property rights in our Services, including all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics (collectively, the "Content"), as well as the trademarks, service marks, and logos (the "Marks").</p>
                <div className="p-8 bg-muted/30 rounded-[2rem] border border-primary/5 space-y-4">
                    <p className="font-black text-xs uppercase tracking-widest text-foreground">Usage License:</p>
                    <p className="text-xs leading-relaxed opacity-80">Subject to your compliance, we grant you a non-exclusive, non-transferable, revocable license to access the Services and download/print a copy of any portion of the Content for your personal, non-commercial use only.</p>
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
                <p>By using the Services, you represent and warrant that: (1) all registration information you submit will be true, accurate, current, and complete; (2) you will maintain the accuracy of such information; (3) you have the legal capacity to agree to these terms; (4) you are not under the age of 13; (5) you will not access the Services through automated or non-human means; and (6) your use will not violate any applicable law.</p>
            </div>
        </section>

        {/* Section 4 */}
        <section id="section-4" className="space-y-8 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-cyan-500/10 text-cyan-500 shadow-sm"><Lock className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">4. User Registration</h3>
            </div>
            <div className="space-y-6 text-sm text-muted-foreground font-medium leading-relaxed">
                <p>You may be required to register to use the Services. You agree to keep your password confidential and will be responsible for all use of your account and password. We reserve the right to remove or change a username you select if we determine it is inappropriate.</p>
            </div>
        </section>

        {/* Section 5 */}
        <section id="section-5" className="space-y-8 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-rose-500/10 text-rose-500 shadow-sm"><Ban className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">5. Prohibited Activities</h3>
            </div>
            <div className="space-y-6 text-sm text-muted-foreground font-medium leading-relaxed">
                <p>You may not access or use the Services for any purpose other than that for which we make the Services available. As a user, you agree not to:</p>
                <ul className="grid sm:grid-cols-2 gap-4 list-disc pl-6 text-xs font-bold uppercase tracking-tight opacity-80">
                    <li>Systematically retrieve data to create a database.</li>
                    <li>Trick, defraud, or mislead us or other users.</li>
                    <li>Circumvent or disable security features.</li>
                    <li>Upload viruses or malicious code.</li>
                    <li>Harass, annoy, or threaten our employees.</li>
                    <li>Use the system for unauthorized commercial endeavors.</li>
                </ul>
            </div>
        </section>

        {/* Section 6 & 7 */}
        <section id="section-6" className="space-y-8 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-indigo-500/10 text-indigo-500 shadow-sm"><MessageSquare className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">6. Contributions & Licensing</h3>
            </div>
            <div className="space-y-6 text-sm text-muted-foreground font-medium leading-relaxed">
                <p>The Services may invite you to participate in community transmissions (Posts). By posting Contributions, you grant us an unrestricted, irrevocable, perpetual, royalty-free license to use, copy, and distribute such Contributions for any purpose.</p>
                <p>You retain full ownership of your original contributions, but we are not liable for any statements or representations in your Contributions provided in any area on the Services.</p>
            </div>
        </section>

        {/* Section 11 */}
        <section id="section-11" className="space-y-8 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-muted/30 shadow-sm text-foreground"><Settings className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">11. Services Management</h3>
            </div>
            <div className="space-y-6 text-sm text-muted-foreground font-medium leading-relaxed">
                <p>We reserve the right to monitor the Services for violations and take appropriate legal action. For posts made using the <strong>"Post Anonymously"</strong> feature, we reserve the right to revoke anonymity and disclose user identity in response to a legal investigation or court order.</p>
            </div>
        </section>

        {/* Section 16 & 17 */}
        <section id="section-16" className="space-y-8 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-primary/10 text-primary shadow-sm"><Landmark className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">16. Governing Law & Disputes</h3>
            </div>
            <div className="space-y-10 text-sm text-muted-foreground font-medium leading-relaxed">
                <div className="p-8 bg-primary/[0.02] rounded-[2.5rem] border border-primary/10 space-y-6 shadow-xl">
                    <p className="font-black text-sm uppercase text-foreground">Jurisdictional Node:</p>
                    <p>These Legal Terms shall be governed by and defined following the laws of <strong>India</strong>. Nyaya Sahayak and yourself irrevocably consent that the courts of India shall have exclusive jurisdiction to resolve any dispute.</p>
                    <div className="pt-4 border-t border-primary/5">
                        <p className="font-bold text-xs uppercase text-primary mb-2">Binding Arbitration:</p>
                        <p className="text-xs italic leading-loose">Any dispute arising out of these terms shall be referred to and finally resolved by the International Commercial Arbitration Court. The seat of arbitration shall be India, and the language shall be English.</p>
                    </div>
                </div>
            </div>
        </section>

        {/* Section 19 & 20 */}
        <section id="section-19" className="space-y-8 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-destructive/10 text-destructive shadow-sm"><ShieldAlert className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">19. Disclaimer & Liability</h3>
            </div>
            <div className="space-y-8 text-sm text-muted-foreground font-medium leading-relaxed">
                <div className="p-8 bg-destructive/5 rounded-[2.5rem] border border-destructive/10 space-y-6">
                    <p className="font-black text-base text-destructive uppercase tracking-tight">AS-IS Provision:</p>
                    <p>THE SERVICES ARE PROVIDED ON AN AS-IS AND AS-AVAILABLE BASIS. YOU AGREE THAT YOUR USE OF THE SERVICES WILL BE AT YOUR SOLE RISK. WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, IN CONNECTION WITH THE SERVICES AND YOUR USE THEREOF.</p>
                    <p className="font-bold text-xs text-foreground uppercase border-t border-destructive/10 pt-4">Limit of Indemnity:</p>
                    <p className="text-xs">IN NO EVENT WILL WE BE LIABLE TO YOU FOR ANY DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES. OUR TOTAL LIABILITY TO YOU FOR ANY CAUSE WHATSOEVER WILL AT ALL TIMES BE LIMITED TO $50.00 USD.</p>
                </div>
            </div>
        </section>

        {/* Section 26 - Case Data & AI */}
        <section id="section-26" className="space-y-10 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-indigo-500/10 text-indigo-500 shadow-sm"><Bot className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">26. Case Data & AI Outputs</h3>
            </div>
            <div className="space-y-8 text-sm text-muted-foreground font-medium leading-relaxed">
                <p>Citizens maintain sovereignty over the case narratives they post. However, by submitting data to the Nyaya Mitra neural engine, you grant us a non-exclusive license to process and share such content strictly within the platform's diagnostic framework.</p>
                <div className="p-8 border rounded-[2rem] bg-indigo-500/[0.02] border-indigo-500/10 italic text-xs leading-loose">
                    "AI outputs—including case summaries and document drafts—are generated via probabilistic neural processing and do not constitute 'Legal Advice' as defined by statutory regulations."
                </div>
            </div>
        </section>

        {/* Section 28 - No Guarantee */}
        <section id="section-28" className="space-y-10 scroll-mt-24 text-left">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-amber-500/10 text-amber-500 shadow-sm"><CheckCircle2 className="h-7 w-7" /></div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase">28. No Legal Outcome Guarantee</h3>
            </div>
            <div className="space-y-8 text-sm text-muted-foreground font-medium leading-relaxed">
                <p>Nyaya Sahayak provides a platform for diagnostic research and procedural navigation. We do NOT guarantee judicial success, specific bail outcomes, or any legal result from the information shared or generated on this site.</p>
            </div>
        </section>

        {/* Section 30 - Contact Us */}
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

      <div className="text-center pt-24 pb-12 opacity-30">
          <p className="text-[9px] font-black uppercase tracking-[0.6em] text-muted-foreground">NYAYASAHAYAK.IN // JUSTICE FOR BHARAT // <History className="inline h-3 w-3" /> 2025</p>
      </div>
    </div>
  );
}
