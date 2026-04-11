
"use client";

import { PageHeader } from "@/components/page-header";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, ShieldCheck, Zap, MessageSquare } from "lucide-react";

const faqs = [
  {
    q: "Is my case data kept private?",
    a: "Yes. Every narration and document is encrypted via TLS 1.3. We do not store original audio files long-term, and your data is never used to train public AI models.",
    icon: ShieldCheck
  },
  {
    q: "How accurate is the AI forensic audit?",
    a: "Our AI is highly accurate in identifying statutes and sections. However, it is a probabilistic system. All outputs must be reviewed by a human advocate before being used in court.",
    icon: Zap
  },
  {
    q: "Can I connect with a real lawyer here?",
    a: "Yes. We maintain a Verified Advocate Registry. You can browse verified professionals, review their Bar credentials, and initialize a secure consultation.",
    icon: MessageSquare
  },
  {
    q: "Does it support Hindi and regional languages?",
    a: "Nyaya Sahayak works in English, Hindi, and several other Indian languages for voice narration, chat, and document generation.",
    icon: HelpCircle
  },
  {
    q: "What is the 56-hour transience window?",
    a: "In our community stream, transmissions are only kept for 56 hours. This ensures that legal discussions remain current and prevents the long-term storage of sensitive citizen queries.",
    icon: HelpCircle
  },
  {
    q: "Is this a government portal?",
    a: "No. Nyaya Sahayak is a private institutional platform created by IdeaSpark to assist citizens in navigating the judicial system.",
    icon: ShieldCheck
  }
];

export default function FaqsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-32 px-4 sm:px-6 text-left">
      <motion.div 
        initial={{ opacity: 0, y: -10 }} 
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 border-b border-white/10 pb-8"
      >
        <PageHeader
          title="Frequently asked questions"
          description="Clear institutional answers regarding platform protocols, data security, and AI capabilities."
        />
        <Badge variant="outline" className="font-bold text-[9px] uppercase tracking-widest bg-primary/5 text-primary border-primary/10 px-4 py-1.5 rounded-full">Support Hub</Badge>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }}
        className="space-y-4"
      >
        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border border-white/5 bg-card/40 backdrop-blur-md rounded-2xl overflow-hidden px-6">
              <AccordionTrigger className="hover:no-underline py-6">
                <div className="flex items-center gap-4 text-left">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                    <faq.icon className="h-4 w-4" />
                  </div>
                  <span className="text-sm sm:text-base font-black tracking-tight text-white">{faq.q}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-6 pt-0 text-sm text-muted-foreground font-medium leading-relaxed pl-12">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>

      <div className="text-center pt-8 opacity-30">
          <p className="text-[9px] font-black uppercase tracking-[0.5em] text-muted-foreground">NYAYASAHAYAK.IN // SUPPORT REGISTRY</p>
      </div>
    </div>
  );
}
