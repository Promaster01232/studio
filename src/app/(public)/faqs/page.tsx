
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
import { HelpCircle, ShieldCheck, Zap, MessageSquare, Activity, ShieldAlert, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "Is my case data kept private?",
    a: "Yes. Every narration and document is encrypted via TLS 1.3. We do not store original audio files long-term, and your data is never used to train public AI models.",
    icon: ShieldCheck,
    color: "text-blue-500",
    bg: "bg-blue-500/10"
  },
  {
    q: "How accurate is the AI forensic audit?",
    a: "Our AI is highly accurate in identifying statutes and sections. However, it is a probabilistic system. All outputs must be reviewed by a human advocate before being used in court.",
    icon: Zap,
    color: "text-amber-500",
    bg: "bg-amber-500/10"
  },
  {
    q: "Can I connect with a real lawyer here?",
    a: "Yes. We maintain a Verified Advocate Registry. You can browse verified professionals, review their Bar credentials, and initialize a secure consultation.",
    icon: MessageSquare,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10"
  },
  {
    q: "Does it support Hindi and regional languages?",
    a: "Nyaya Sahayak works in English, Hindi, and several other Indian languages for voice narration, chat, and document generation.",
    icon: Globe,
    color: "text-cyan-500",
    bg: "bg-cyan-500/10"
  },
  {
    q: "What is the 56-hour transience window?",
    a: "In our community stream, transmissions are only kept for 56 hours. This ensures that legal discussions remain current and prevents the long-term storage of sensitive citizen queries.",
    icon: Activity,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10"
  },
  {
    q: "Is this a government portal?",
    a: "No. Nyaya Sahayak is a private institutional platform created by IdeaSpark to assist citizens in navigating the judicial system.",
    icon: ShieldAlert,
    color: "text-rose-500",
    bg: "bg-rose-500/10"
  }
];

export default function FaqsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-32 px-4 sm:px-6 text-left">
      <motion.div 
        initial={{ opacity: 0, y: -10 }} 
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 border-b border-white/5 pb-8"
      >
        <div className="space-y-4">
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 px-4 py-1 rounded-full text-[10px] font-bold">
                Support hub
            </Badge>
            <PageHeader
              title="Frequently asked questions"
              description="Clear institutional answers regarding platform protocols, data security, and AI capabilities."
            />
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }}
        className="space-y-4"
      >
        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, i) => (
            <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
            >
                <AccordionItem 
                    value={`item-${i}`} 
                    className="border border-white/5 bg-[#161b22] backdrop-blur-md rounded-[1.5rem] overflow-hidden px-6 transition-all hover:border-primary/20 group"
                >
                    <AccordionTrigger className="hover:no-underline py-6">
                        <div className="flex items-center gap-4 text-left">
                            <div className={cn("p-2.5 rounded-xl transition-transform group-hover:scale-110 duration-500 shadow-lg", faq.bg, faq.color)}>
                                <faq.icon className="h-4 w-4" />
                            </div>
                            <span className="text-sm sm:text-base font-black tracking-tight text-white group-hover:text-primary transition-colors">
                                {faq.q}
                            </span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-6 pt-0 text-sm text-gray-400 font-medium leading-relaxed pl-12">
                        <div className="max-w-2xl">
                            {faq.a}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </motion.div>

      <div className="text-center pt-12 opacity-20">
          <p className="text-[9px] font-bold tracking-[0.6em] text-white uppercase">Nyayasahayak.in // Institutional registry</p>
      </div>
    </div>
  );
}
