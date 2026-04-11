
"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { 
  CreditCard, 
  ShieldCheck, 
  RotateCcw, 
  Clock, 
  Info, 
  Mail,
  Scale,
  Zap,
  Activity,
  ArrowLeft
} from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";

const policySections = [
  {
    id: "section-1",
    title: "1. Nature of services",
    content: "Nyaya Sahayak provides digital, on-demand AI-based services, including access to legal information tools, AI chat features, and usage credits. These services are considered 'consumed' once a forensic operation is executed."
  },
  {
    id: "section-2",
    title: "2. Interpretation and definitions",
    content: "The words whose initial letters are capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural."
  },
  {
    id: "section-3",
    title: "3. Your order cancellation rights",
    content: "You are entitled to cancel your order within 7 days without giving any reason for doing so. The deadline for cancelling an order is 7 days from the date on which you received the goods or access to the digital node."
  },
  {
    id: "section-4",
    title: "4. AI and payment protection",
    content: "1. AI operational failure: If our AI engine fails to answer your question or complete a task despite deducting credits, we refund you.\n2. Payment gateway error: If your payment fails, double payments occur, or payment is captured but service is not started, we refund you.\n3. Incorrect report: If the AI gives a fundamentally wrong report or misses clear laws, you can claim a refund for manual audit."
  },
  {
    id: "section-5",
    title: "5. Conditions for returns",
    content: "In order for the goods to be eligible for a return, please make sure that: the goods were purchased in the last 7 days and they are in the original packaging. Personalized supply of goods or digital content that deteriorates rapidly are not suitable for return."
  },
  {
    id: "section-6",
    title: "6. Returning goods",
    content: "You are responsible for the cost and risk of returning the goods to us. We recommend an insured and trackable mail service. We are unable to issue a refund without actual receipt of the goods or proof of received return delivery."
  },
  {
    id: "section-7",
    title: "7. Contact us",
    content: "If you have any questions about our returns and refunds policy, please contact us at nyayasahayakhelp@gmail.com or via our official phone terminal at 6299827864."
  }
];

export default function RefundPolicyPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-32 px-4 sm:px-6 text-left">
      <motion.div 
        initial={{ opacity: 0, y: -10 }} 
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 border-b border-white/5 pb-8"
      >
        <div className="space-y-4">
            <Link 
              href="/" 
              className="flex items-center gap-2 text-sm font-medium text-white/40 hover:text-white transition-colors group mb-6"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              <span>Back to home</span>
            </Link>
            <PageHeader
              title="Refund & cancellation policy"
              description="Official institutional protocol governing payments made for subscriptions and credits at Nyaya Sahayak."
            />
        </div>
        <Badge variant="outline" className="font-black text-[9px] uppercase tracking-widest bg-primary/5 text-primary border-primary/10 px-4 py-1.5 rounded-full">Protocol 2026</Badge>
      </motion.div>

      <div className="space-y-12">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <div className="flex flex-col gap-2">
            <p className="text-sm font-bold text-white">Effective date: <span className="text-primary">04-02-2023</span></p>
            <p className="text-sm font-bold text-white">Last updated: <span className="text-primary">04-02-2026</span></p>
          </div>
          <p className="text-lg text-white/60 font-medium leading-relaxed max-w-3xl">
            This refund & cancellation policy governs payments made for subscriptions, credits, and paid services on <span className="text-white font-bold">Nyaya Sahayak</span> (https://nyayasahayak.in). By purchasing or subscribing to any paid plan, you agree to the terms of this policy.
          </p>
          <div className="h-px w-full bg-white/5" />
        </motion.div>

        <div className="space-y-20">
          {policySections.map((section, idx) => (
            <motion.section 
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-black tracking-tighter text-white font-headline">
                {section.title}
              </h2>
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-lg text-white/40 font-medium leading-loose whitespace-pre-line">
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
        className="pt-20 border-t border-white/5"
      >
        <Card className="bg-[#161b22] border-white/5 rounded-[3rem] p-10 sm:p-16 flex flex-col md:flex-row items-center justify-between gap-10 overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-110 transition-transform duration-1000 pointer-events-none">
            <RotateCcw className="h-64 w-64" />
          </div>
          <div className="space-y-6 text-left relative z-10 max-w-xl">
            <div className="flex items-center gap-3 text-primary">
              <div className="p-2 rounded-lg bg-primary/10">
                <ShieldCheck className="h-5 w-5 animate-pulse" />
              </div>
              <span className="text-[10px] font-bold text-primary uppercase">Statutory trust</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white leading-none tracking-tighter">Refund <br /> <span className="text-primary italic">Inquiry node.</span></h2>
            <p className="text-sm sm:text-lg text-gray-400 font-medium leading-relaxed">
              If your claim meets our institutional requirements, please transmit your transaction ID to our fiduciary desk for immediate restoration.
            </p>
            <Button size="lg" className="rounded-xl font-bold h-12 px-8" asChild>
              <a href="mailto:nyayasahayakhelp@gmail.com">Initialize support email</a>
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full md:w-auto relative z-10">
            {[
              { label: "Secure sync", icon: Activity },
              { label: "Fiduciary audit", icon: ShieldCheck },
              { label: "Ledger active", icon: Clock },
              { label: "Verified ingress", icon: CreditCard }
            ].map((n, i) => (
              <div key={i} className="p-6 rounded-3xl bg-white/5 border border-white/5 flex flex-col items-center gap-3 text-center w-32 sm:w-40">
                <n.icon className="h-6 w-6 text-primary opacity-40" />
                <span className="text-[10px] font-bold text-white/60">{n.label}</span>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
