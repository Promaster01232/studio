
"use client";

import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto py-20 px-6 text-left selection:bg-primary/20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-12"
      >
        <div className="space-y-8 text-left">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tighter text-foreground font-headline">
            Terms Of Service
          </h1>
          
          <div className="space-y-2 text-sm sm:text-base font-bold text-muted-foreground uppercase tracking-widest">
            <p>Effective Date: <span className="text-primary">12/04/2026</span></p>
            <p>Last Updated: <span className="text-primary">12/04/2026</span></p>
          </div>

          <div className="space-y-6 text-lg text-foreground/80 font-medium leading-relaxed max-w-3xl">
            <p>
              Welcome To Nyaya Sahayak, Accessible At <Link href="https://nyayasahayak.in" className="text-primary font-bold hover:underline">https://nyayasahayak.in</Link>. These Terms Of Service Govern Your Access To And Use Of The Nyaya Sahayak Website, Applications, Dashboards, And Related Services (Collectively, The "Platform").
            </p>
            <p>
              By Accessing Or Using Nyaya Sahayak, You Confirm That You Have Read, Understood, And Agreed To Be Bound By These Terms. If You Do Not Agree, You Must Not Use The Platform.
            </p>
          </div>
        </div>

        <Separator className="bg-border/10" />

        <div className="space-y-16 pt-4 text-left">
          <section className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">1. About Nyaya Sahayak</h2>
            <div className="space-y-4 text-muted-foreground font-medium text-sm sm:text-base leading-relaxed">
              <p>Nyaya Sahayak Is An AI-Powered Legal Information Platform Designed To Help Users Understand Indian Laws, Legal Procedures, And General Legal Concepts. The Platform Provides General Legal Information Only And Does Not Provide Legal Advice.</p>
              <p>Nyaya Sahayak Is Not A Law Firm, Does Not Provide Professional Legal Services, And Does Not Replace Consultation With A Qualified Advocate.</p>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">2. Acceptance And Eligibility</h2>
            <div className="space-y-4 text-muted-foreground font-medium text-sm sm:text-base leading-relaxed">
              <p>By Using Nyaya Sahayak At <Link href="https://nyayasahayak.in" className="text-primary hover:underline">https://nyayasahayak.in</Link>, You Represent That:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>You Are At Least 18 Years Old, Or Using The Platform Under Supervision Of A Legal Guardian.</li>
                <li>You Have The Legal Capacity To Enter Into These Terms.</li>
                <li>You Will Use The Platform Only For Lawful Purposes.</li>
              </ul>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">3. Scope Of Services</h2>
            <div className="space-y-4 text-muted-foreground font-medium text-sm sm:text-base leading-relaxed">
              <p>Nyaya Sahayak Provides, Among Other Features:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>AI-Powered Legal Information Chat Based On Indian Law</li>
                <li>Document Upload, Storage, And Analysis (PDF, DOC, DOCX, Etc.)</li>
                <li>OCR For Scanned Documents</li>
                <li>Chat History, Notes, Collections, And Organizational Tools</li>
                <li>Free And Paid Subscription Plans With Usage Limits</li>
              </ul>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">4. No Legal Advice & No Lawyer–Client Relationship</h2>
            <div className="p-8 rounded-[2rem] bg-destructive/5 border border-destructive/10 space-y-4 text-left">
              <p className="font-black text-destructive uppercase tracking-widest text-sm">Important Disclaimer:</p>
              <ul className="list-disc pl-5 space-y-3 text-muted-foreground font-medium text-sm sm:text-base">
                <li>Information Provided By Nyaya Sahayak Is General Legal Information, Not Legal Advice.</li>
                <li>No Lawyer–Client Relationship Is Created Between You And Nyaya Sahayak, Its Founders, Developers, Or Any Contributors.</li>
                <li>AI-Generated Responses May Be Incomplete, Outdated, Or Inaccurate.</li>
                <li>Reliance On Any Information Provided At <Link href="https://nyayasahayak.in" className="text-primary hover:underline">https://nyayasahayak.in</Link> Is Entirely At Your Own Risk.</li>
              </ul>
            </div>
          </section>

          <section className="space-y-6 pb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">5. Contact Information</h2>
            <div className="p-8 rounded-[2rem] bg-muted/20 border border-border/10 space-y-4 text-left">
              <p className="text-foreground/80 font-medium">For Questions Or Statutory Notices, Contact Us At:</p>
              <div className="flex flex-col gap-2">
                <a href="mailto:nyayasahayakhelp@gmail.com" className="text-2xl font-black text-primary hover:underline transition-all">nyayasahayakhelp@gmail.com</a>
                <p className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest">Nyaya Sahayak // Statutory Registry</p>
              </div>
            </div>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
