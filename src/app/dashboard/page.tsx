
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Mic,
  MessageSquare,
  FileSearch,
  FileText,
  FileSignature,
  Users,
  BrainCircuit,
  Library,
  HeartHandshake,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { motion, useInView } from "framer-motion";

const MotionWrapper = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  );
};


const aiFeatures = [
    {
      href: "/dashboard/strength-analyzer",
      icon: BrainCircuit,
      title: "Case Strength Analyzer",
      description: "Get an AI-powered assessment of how strong your case is.",
    },
    {
      href: "/dashboard/document-intelligence",
      icon: FileSearch,
      title: "Document Intelligence",
      description: "Upload any legal document to understand its content and risks.",
    },
    {
      href: "/dashboard/document-generator",
      icon: FileText,
      title: "Document Generator",
      description: "Instantly create legal documents like complaints and notices.",
    },
    {
      href: "/dashboard/bond-generator",
      icon: FileSignature,
      title: "Bond Generator",
      description: "Generate various types of legal bonds for your needs.",
    },
];

const newsItems = [
    {
        id: 1,
        title: "Supreme Court Upholds Environmental Regulations in Landmark Case",
        image: PlaceHolderImages.find(img => img.id === 'news1'),
    },
     {
        id: 2,
        title: "High Court Issues New Guidelines for Digital Evidence",
        image: PlaceHolderImages.find(img => img.id === 'news2'),
    },
    {
        id: 3,
        title: "Plea Challenging Sedition Law Admitted in Supreme Court",
        image: PlaceHolderImages.find(img => img.id === 'news3'),
    }
];

const resources = [
    {
        href: "/dashboard/lawyer-connect",
        icon: Users,
        title: "Lawyer Connect",
        description: "Find and connect with verified legal professionals.",
    },
    {
        href: "/dashboard/learn",
        icon: Library,
        title: "Legal Knowledge Hub",
        description: "Browse articles and guides to understand your rights.",
    },
    {
        href: "/dashboard/ngo-legal-aid",
        icon: HeartHandshake,
        title: "NGO & Legal Aid",
        description: "Connect with organizations offering legal support.",
    },
];


const SectionTitle = ({children}: {children: React.ReactNode}) => (
    <h2 className="text-lg sm:text-xl md:text-2xl font-black tracking-tighter text-foreground/90">{children}</h2>
)


export default function DashboardHomePage() {
  const [text, setText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const fullText = 'Welcome to Nyaya Sahayak';
  
  const TypingCaret = () => <span className="ml-1 animate-pulse text-primary">|</span>;

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isTyping) {
      if (text.length < fullText.length) {
        timeoutId = setTimeout(() => {
          setText(fullText.slice(0, text.length + 1));
        }, 80); // Typing speed
      } else {
        // Finished typing, pause with caret
        timeoutId = setTimeout(() => setIsTyping(false), 1000);
      }
    } else {
      // Animation finished, restart after a delay
      timeoutId = setTimeout(() => {
        setText('');
        setIsTyping(true);
      }, 3000); // 3-second pause before restart
    }
    
    return () => clearTimeout(timeoutId);
  }, [text, isTyping]);


  return (
    <div className="flex flex-col h-full relative space-y-8 sm:space-y-12 pb-10">
        {/* Welcome Header */}
        <MotionWrapper>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                  <h1 className="text-xl sm:text-2xl md:text-4xl font-black font-headline tracking-tighter min-h-[2.5rem] sm:min-h-[3rem] flex items-center leading-none">
                      {text}
                      {isTyping && <TypingCaret />}
                  </h1>
                  <p className="text-xs sm:text-sm md:text-base text-muted-foreground mt-1 font-medium">Your AI-powered legal co-pilot.</p>
              </div>
              <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="flex-1 sm:flex-none h-10 font-bold text-xs" asChild><Link href="/dashboard/lawyer-connect">Find a Lawyer</Link></Button>
                   <Button size="sm" className="flex-1 sm:flex-none h-10 font-bold shadow-lg shadow-primary/20 text-xs" asChild><Link href="/dashboard/support">Ask AI</Link></Button>
              </div>
          </div>
        </MotionWrapper>

        <div className="space-y-10 sm:space-y-16">
          {/* Quick Access */}
          <div className="space-y-6">
              <MotionWrapper delay={0.1}>
                <SectionTitle>Quick Access</SectionTitle>
              </MotionWrapper>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <MotionWrapper delay={0.2}>
                    <Card className="hover:border-primary/50 transition-all active:scale-[0.98] border-primary/10 shadow-lg">
                        <CardContent className="p-4 sm:p-6">
                            <Link href="/dashboard/narrate" className="flex items-center gap-4 group">
                                <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors shrink-0">
                                    <Mic className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-black text-sm sm:text-lg tracking-tight truncate">Speak Your Problem</h3>
                                    <p className="text-[10px] sm:text-sm text-muted-foreground line-clamp-1 font-medium">Narrate your issue for an AI summary.</p>
                                </div>
                            </Link>
                        </CardContent>
                    </Card>
                  </MotionWrapper>
                  <MotionWrapper delay={0.3}>
                      <Card className="hover:border-primary/50 transition-all active:scale-[0.98] border-primary/10 shadow-lg">
                        <CardContent className="p-4 sm:p-6">
                            <Link href="/dashboard/support" className="flex items-center gap-4 group">
                                <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors shrink-0">
                                    <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-black text-sm sm:text-lg tracking-tight truncate">AI Legal Chat</h3>
                                    <p className="text-[10px] sm:text-sm text-muted-foreground line-clamp-1 font-medium">Get answers to legal questions.</p>
                                </div>
                            </Link>
                        </CardContent>
                    </Card>
                  </MotionWrapper>
              </div>
          </div>
          {/* AI Tools */}
           <div className="space-y-6">
              <MotionWrapper delay={0.4}>
                <SectionTitle>AI Toolkit</SectionTitle>
              </MotionWrapper>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  {aiFeatures.map((feature, index) => (
                    <MotionWrapper key={feature.href} delay={0.5 + index * 0.1}>
                      <Link key={feature.href} href={feature.href} className="block group h-full">
                          <Card className="h-full p-3 sm:p-4 flex flex-col items-start hover:border-primary/50 transition-all active:scale-[0.97] border-primary/5 shadow-md">
                              <div className="p-2 rounded-lg bg-primary/10 mb-2 sm:mb-3 group-hover:bg-primary/20 transition-colors">
                                <feature.icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                              </div>
                              <h3 className="font-black text-[11px] sm:text-sm leading-tight tracking-tight">{feature.title}</h3>
                              <p className="hidden sm:block text-[10px] sm:text-xs text-muted-foreground mt-1.5 line-clamp-2 font-medium">{feature.description}</p>
                          </Card>
                      </Link>
                    </MotionWrapper>
                  ))}
              </div>
          </div>

          {/* Latest News Section */}
          <div className="space-y-6">
            <MotionWrapper delay={0.6}>
              <SectionTitle>Latest Legal News</SectionTitle>
            </MotionWrapper>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {newsItems.map((item, index) => (
                <MotionWrapper key={item.id} delay={0.7 + index * 0.1}>
                  <Link href="/dashboard/research-analytics" className="block group">
                    <Card className="overflow-hidden h-full flex flex-col hover:shadow-xl transition-all duration-300 border-primary/5">
                      {item.image && (
                        <div className="relative aspect-video">
                          <Image
                            src={item.image.imageUrl}
                            alt={item.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                            data-ai-hint={item.image.imageHint}
                          />
                        </div>
                      )}
                      <div className="p-4 flex-grow">
                        <h3 className="font-bold text-sm leading-snug group-hover:text-primary transition-colors tracking-tight">{item.title}</h3>
                      </div>
                    </Card>
                  </Link>
                </MotionWrapper>
              ))}
            </div>
          </div>
          
          {/* Explore Resources Section */}
          <div className="space-y-6">
            <MotionWrapper delay={0.8}>
              <SectionTitle>Explore Resources</SectionTitle>
            </MotionWrapper>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {resources.map((resource, index) => (
                <MotionWrapper key={resource.href} delay={0.9 + index * 0.1}>
                  <Link href={resource.href} className="block group h-full">
                    <Card className="h-full hover:border-primary/50 transition-all active:scale-[0.98] border-primary/5 shadow-lg">
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex flex-row md:flex-col items-center md:items-start gap-4">
                          <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors shrink-0">
                            <resource.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-black text-sm sm:text-lg tracking-tight truncate">{resource.title}</h3>
                            <p className="text-[10px] sm:text-sm text-muted-foreground mt-1 line-clamp-1 md:line-clamp-none font-medium">{resource.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </MotionWrapper>
              ))}
            </div>
          </div>

        </div>
    </div>
  );
}
