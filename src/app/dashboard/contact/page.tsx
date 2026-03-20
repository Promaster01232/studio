
"use client";

import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Lightbulb } from "lucide-react";
import { motion } from "framer-motion";

export default function ContactUsPage() {
  return (
    <div className="space-y-12 max-w-3xl mx-auto pb-20 pt-4 px-4 sm:px-0">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-primary/5 shadow-2xl rounded-3xl overflow-hidden bg-card/40 backdrop-blur-md text-center py-12 px-6 sm:px-12">
          <CardContent className="space-y-10 p-0">
            {/* Top Icon */}
            <div className="flex justify-center">
              <div className="bg-primary/10 p-5 rounded-2xl">
                <Mail className="h-10 w-10 text-primary" />
              </div>
            </div>

            {/* Header Section */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl font-black font-headline tracking-tighter text-foreground">
                Contact Us
              </h1>
              <p className="text-xl font-bold text-primary/80">
                We'd love to hear from you!
              </p>
            </div>

            {/* Description Paragraph */}
            <p className="text-muted-foreground font-medium text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
              Whether you have a question about features, need assistance, have business inquiries, or just want to share feedback, please feel free to reach out.
            </p>

            {/* Specific Inquiry Section */}
            <div className="space-y-4 pt-4">
              <h3 className="text-xl font-black tracking-tight text-foreground/90">
                General Inquiries, Support & Feedback
              </h3>
              <div className="space-y-3">
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                  For all inquiries, please email us at:
                </p>
                <a 
                  href="mailto:nyayasahayakhelp@gmail.com" 
                  className="flex items-center justify-center gap-3 text-lg sm:text-2xl font-black text-primary hover:opacity-80 transition-opacity"
                >
                  <Mail className="h-6 w-6 sm:h-7 sm:w-7" />
                  <span className="underline underline-offset-4 decoration-primary/30">nyayasahayakhelp@gmail.com</span>
                </a>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px w-full max-w-xs bg-primary/10 mx-auto pt-4" />

            {/* Response Time Node */}
            <p className="text-[11px] sm:text-xs font-bold text-muted-foreground/60 italic">
              We aim to respond to all inquiries within 24-48 business hours.
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Developer Signature */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center"
      >
        <Link href="https://ideasparkweb.com" target="_blank" rel="noopener noreferrer" className="inline-block group">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2 group-hover:text-primary transition-colors">
              Designed & Developed by
            </p>
            <div className="flex items-center justify-center gap-2 transition-transform group-hover:scale-105 duration-300">
                <Lightbulb className="h-7 w-7 text-primary fill-primary/10" />
                <h2 className="text-2xl font-black font-headline text-primary tracking-tighter">
                    IdeaSpark
                </h2>
            </div>
        </Link>
      </motion.div>
    </div>
  );
}
