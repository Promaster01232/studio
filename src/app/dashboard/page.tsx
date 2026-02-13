
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Mic,
  MessageSquare,
  FileSearch,
  FileText,
  FileSignature,
  Users,
  BrainCircuit,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PlaceHolderImages } from "@/lib/placeholder-images";

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
]

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
]

const SectionTitle = ({children}: {children: React.ReactNode}) => (
    <h2 className="text-2xl font-bold tracking-tight text-foreground/90">{children}</h2>
)


export default function DashboardHomePage() {
  const [text, setText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const fullText = 'Welcome to Nyaya Sahayak';
  
  const TypingCaret = () => <span className="ml-1 animate-pulse text-primary">|</span>;

  useEffect(() => {
    if (isTyping) {
      if (text.length < fullText.length) {
        const timeoutId = setTimeout(() => {
          setText(fullText.slice(0, text.length + 1));
        }, 80); // Typing speed
        return () => clearTimeout(timeoutId);
      } else {
        // After typing is done, wait a moment before removing the caret
        const finalPause = setTimeout(() => setIsTyping(false), 1000); 
        return () => clearTimeout(finalPause);
      }
    }
  }, [text, isTyping]);


  return (
    <div className="flex flex-col h-full relative space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
                <h1 className="text-3xl font-bold font-headline tracking-tight h-10 flex items-center">
                    {text}
                    {isTyping && <TypingCaret />}
                </h1>
                <p className="text-muted-foreground mt-1">Your AI-powered legal co-pilot.</p>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="outline" asChild><Link href="/dashboard/lawyer-connect">Find a Lawyer</Link></Button>
                 <Button>Ask AI Assistant</Button>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Access */}
          <div className="space-y-6">
              <SectionTitle>Quick Access</SectionTitle>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Card className="hover:border-primary/50 transition-colors">
                      <CardContent className="p-6">
                          <Link href="/dashboard/narrate" className="flex items-center gap-4 group">
                              <div className="p-3 rounded-lg bg-primary/10">
                                  <Mic className="h-6 w-6 text-primary" />
                              </div>
                              <div className="flex-1">
                                  <h3 className="font-bold text-lg">Speak Your Problem</h3>
                                  <p className="text-sm text-muted-foreground">Narrate your legal issue for an AI summary.</p>
                              </div>
                          </Link>
                      </CardContent>
                  </Card>
                    <Card className="hover:border-primary/50 transition-colors">
                      <CardContent className="p-6">
                          <Link href="/dashboard/lawyer-connect" className="flex items-center gap-4 group">
                              <div className="p-3 rounded-lg bg-primary/10">
                                  <MessageSquare className="h-6 w-6 text-primary" />
                              </div>
                              <div className="flex-1">
                                  <h3 className="font-bold text-lg">AI Legal Chat</h3>
                                  <p className="text-sm text-muted-foreground">Get answers to your legal questions.</p>
                              </div>
                          </Link>
                      </CardContent>
                  </Card>
              </div>
          </div>
          {/* AI Tools */}
           <div className="space-y-6">
              <SectionTitle>AI Toolkit</SectionTitle>
              <div className="grid grid-cols-2 gap-4">
                  {aiFeatures.map(feature => (
                      <Link key={feature.href} href={feature.href} className="block group">
                          <Card className="h-full p-4 flex flex-col items-start hover:border-primary/50 transition-colors">
                              <div className="p-2 rounded-lg bg-primary/10 mb-3">
                                <feature.icon className="h-5 w-5 text-primary" />
                              </div>
                              <h3 className="font-bold text-sm">{feature.title}</h3>
                              <p className="text-xs text-muted-foreground mt-1">{feature.description}</p>
                          </Card>
                      </Link>
                  ))}
              </div>
          </div>
        </div>
    </div>
  );
}
