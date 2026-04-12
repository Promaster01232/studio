
"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { 
  CreditCard, 
  ShieldCheck, 
  RotateCcw, 
  Clock, 
  ArrowLeft,
  Activity
} from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const policySections = [
  {
    id: "section-1",
    title: "1. Nature Of Services",
    content: "Nyaya Sahayak Provides Digital, On-Demand AI-Based Services Via https://nyayasahayak.in, Including Access To Legal Information Tools, AI Chat Features, And Usage Credits. These Services Are Considered 'Consumed' Once A Forensic Operation Is Executed."
  },
  {
    id: "section-2",
    title: "2. Interpretation And Definitions",
    content: "The Words Whose Initial Letters Are Capitalized Have Meanings Defined Under The Following Conditions. These Definitions Apply Regardless Of Singular Or Plural Context."
  },
  {
    id: "section-3",
    title: "3. Your Order Cancellation Rights",
    content: "You Are Entitled To Cancel Your Order Within 7 Days Without Giving Any Reason For Doing So. The Deadline For Cancelling An Order Is 7 Days From The Date On Which You Received Access To The Digital System At https://nyayasahayak.in."
  },
  {
    id: "section-4",
    title: "4. AI And Payment Protection",
    content: "1. AI Operational Failure: If Our AI Engine Fails To Complete A Task Despite Deducting Credits, We Refund You.\n2. Payment Gateway Error: If Your Payment Fails Or Double Payments Occur, We Refund You.\n3. Incorrect Report: If The AI Gives A Fundamentally Wrong Statutory Report, You Can Claim A Refund For Manual Audit."
  },
  {
    id: "section-5",
    title: "5. Conditions For Returns",
    content: "Personalized Supply Of Digital Content Or Consumed Credits Are Not Suitable For Return. Claims Must Be Logged Within 7 Days Of Purchase At https://nyayasahayak.in."
  },
  {
    id: "section-6",
    title: "6. Returning Digital Goods",
    content: "As We Provide Digital Registry Access, We Are Unable To Issue A Refund Without Valid Proof Of The Transaction ID And A Clear Statement Of The Operational Failure Encountered Within The System."
  },
  {
    id: "section-7",
    title: "7. Contact Us",
    content: "If You Have Any Questions About Our Returns And Refunds Policy, Please Contact Us At nyayasahayakhelp@gmail.com Or Via Our Official Phone Terminal At 6299827864."
  }
];

export default function RefundPolicyPublicPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-32 px-4 sm:px-6 text-left selection:bg-primary/20">
      <motion.div 
        initial={{ opacity: 0, y: -10 }} 
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 border-b border-border/10 pb-8"
      >
        <div className="space-y-4 text-left">
            <Link 
              href="/" 
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group mb-6"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              <span>Back To Home</span>
            </Link>
            <PageHeader
              title="Refund & Cancellation Policy"
              description="Official Institutional Protocol Governing Payments Made For Subscriptions And Credits At Nyaya Sahayak."
            />
        </div>
        <Badge variant="outline" className="font-black text-[9px] uppercase tracking-widest bg-primary/5 text-primary border-primary/10 px-4 py-1.5 rounded-full">Protocol 2026</Badge>
      </motion.div>

      <div className="space-y-12 text-left">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <div className="flex flex-col gap-2">
            <p className="text-sm font-bold text-foreground">Effective Date: <span className="text-primary">12/04/2026</span></p>
            <p className="text-sm font-bold text-foreground">Last Updated: <span className="text-primary">12/04/2026</span></p>
          </div>
          <p className="text-lg text-muted-foreground font-medium leading-relaxed max-w-3xl">
            This Refund & Cancellation Policy Governs Payments Made On <Link href="https://nyayasahayak.in" className="text-foreground font-bold hover:underline">Nyaya Sahayak (https://nyayasahayak.in)</Link>. By Purchasing Or Subscribing To Any Paid Plan, You Agree To The Terms Of This Policy.
          </p>
          <div className="h-px w-full bg-border/10" />
        </motion.div>

        <div className="space-y-20">
          {policySections.map((section, idx) => (
            <motion.section 
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="space-y-6 text-left"
            >
              <h2 className="text-3xl font-black tracking-tighter text-foreground font-headline">
                {section.title}
              </h2>
              <div className="max-w-none text-left">
                <p className="text-lg text-muted-foreground font-medium leading-loose whitespace-pre-line">
                  {section.content}
                </p>
              </div>
            </motion.section>
          ))}
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }} 
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="pt-20 border-t border-border/10"
      >
        <Card className="bg-muted/20 border-border/10 rounded-[3rem] p-10 sm:p-16 flex flex-col md:flex-row items-center justify-between gap-10 overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-110 transition-transform duration-1000 pointer-events-none">
            <RotateCcw className="h-64 w-64" />
          </div>
          <div className="space-y-6 text-left relative z-10 max-w-xl">
            <div className="flex items-center gap-3 text-primary">
              <div className="p-2 rounded-lg bg-primary/10">
                <ShieldCheck className="h-5 w-5 animate-pulse" />
              </div>
              <span className="text-[10px] font-bold text-primary uppercase">Statutory Trust</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-foreground leading-none tracking-tighter">Refund <br /> <span className="text-primary">Inquiry Hub.</span></h2>
            <p className="text-sm sm:text-lg text-muted-foreground font-medium leading-relaxed">
              If Your Claim Meets Our Institutional Requirements At https://nyayasahayak.in, Please Transmit Your Transaction ID For Immediate Restoration.
            </p>
            <Button size="lg" className="rounded-xl font-bold h-12 px-8" asChild>
              <a href="mailto:nyayasahayakhelp@gmail.com">Initialize Support Email</a>
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full md:w-auto relative z-10">
            {[
              { label: "Secure Sync", icon: Activity },
              { label: "Fiduciary Audit", icon: ShieldCheck },
              { label: "Ledger Active", icon: Clock },
              { label: "Verified Ingress", icon: CreditCard }
            ].map((n, i) => (
              <div key={i} className="p-6 rounded-3xl bg-background border border-border/10 flex flex-col items-center gap-3 text-center w-32 sm:w-40">
                <n.icon className="h-6 w-6 text-primary opacity-40" />
                <span className="text-[10px] font-bold text-muted-foreground">{n.label}</span>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
