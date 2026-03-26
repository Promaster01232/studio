
"use client";

import { useParams, notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, BookOpen, Clock, Globe, ShieldCheck, Share2, Printer, Sparkles, Landmark } from "lucide-react";
import { topics } from "../data";
import { useLanguage } from "@/components/language-provider";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

export default function LearnTopicDetailPage() {
    const params = useParams<{ slug: string }>();
    const { language } = useLanguage();

    const topic = topics.find((t) => t.slug === params.slug);

    const localizedContent = useMemo(() => {
        if (!topic) return "";
        const parts = topic.content.split("--- **हिन्दी में:** ---");
        if (language === 'hi' && parts.length > 1) {
            return parts[1].trim();
        }
        return parts[0].trim();
    }, [topic, language]);

    if (!topic) {
        notFound();
    }

    const wordCount = topic.content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);

    return (
        <div className="max-w-5xl mx-auto pb-20 space-y-8 text-left">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <Button variant="ghost" size="sm" className="rounded-xl font-bold hover:bg-primary/5 group" asChild>
                    <Link href="/dashboard/learn">
                        <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" /> Back to Knowledge Hub
                    </Link>
                </Button>
                <div className="flex gap-2">
                    <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl border-primary/10 hover:bg-primary/5">
                        <Share2 className="h-4 w-4 text-primary" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl border-primary/10 hover:bg-primary/5">
                        <Printer className="h-4 w-4 text-primary" />
                    </Button>
                </div>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="glass shadow-2xl rounded-[2.5rem] border-primary/5 overflow-hidden">
                    <CardHeader className="p-8 sm:p-12 bg-primary/5 border-b border-primary/10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                            <Landmark className="h-48 w-48" />
                        </div>
                        <div className="relative z-10 space-y-6">
                            <div className="flex flex-wrap items-center gap-3">
                                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 px-4 py-1 rounded-full font-black text-[10px] uppercase tracking-widest">Institutional Module</Badge>
                                <div className="flex items-center gap-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                                    <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {readingTime} Min Audit</span>
                                    <span className="flex items-center gap-1.5"><Globe className="h-3.5 w-3.5" /> Global Access</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h1 className="text-3xl sm:text-6xl font-black font-headline tracking-tighter leading-tight text-foreground">
                                    {topic.title}
                                </h1>
                                <p className="text-lg sm:text-xl text-primary font-bold tracking-tight italic opacity-80">
                                    Official Legal Forensic Registry Node
                                </p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 sm:p-12">
                        <div className="flex flex-col lg:flex-row gap-12">
                            <div className="flex-1 space-y-10">
                                <div className="p-6 bg-primary/5 rounded-3xl border border-primary/10 shadow-inner text-left">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-primary/10 p-2.5 rounded-xl text-primary">
                                            <Sparkles className="h-5 w-5 animate-pulse" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-primary">Module Executive Summary</p>
                                            <p className="text-sm font-bold text-foreground/80 leading-relaxed italic">
                                                {topic.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="prose dark:prose-invert prose-sm sm:prose-base max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-p:font-medium prose-p:leading-relaxed prose-li:font-medium text-foreground/90">
                                    <div className="whitespace-pre-line leading-loose text-base font-medium">
                                        {localizedContent}
                                    </div>
                                    
                                    <div className="mt-16 pt-12 border-t border-primary/5">
                                        <h3 className="text-2xl font-black tracking-tight mb-6 flex items-center gap-3">
                                            <ShieldCheck className="h-6 w-6 text-green-600" />
                                            Compliance Acknowledgment
                                        </h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed font-medium mb-8">
                                            The information provided in this module is for navigational and institutional education purposes on **nyayasahayak.in**. While audited for forensic accuracy, users are mandated to consult with our **Verified Advocate Registry** for specific litigation strategies.
                                        </p>
                                        <Button asChild className="h-14 px-10 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 active:scale-95 transition-all">
                                            <Link href="/dashboard/lawyer-connect">Connect with Verified Advocate</Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <aside className="lg:w-80 shrink-0 space-y-6">
                                <Card className="p-6 rounded-3xl bg-muted/20 border-primary/5 shadow-sm">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Module Statistics</h4>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between border-b border-primary/5 pb-2">
                                            <span className="text-[10px] font-bold text-muted-foreground">Word Count</span>
                                            <span className="text-xs font-black font-mono">{wordCount}</span>
                                        </div>
                                        <div className="flex items-center justify-between border-b border-primary/5 pb-2">
                                            <span className="text-[10px] font-bold text-muted-foreground">Registry ID</span>
                                            <span className="text-xs font-black font-mono">NODE-{topic.slug.toUpperCase().substring(0, 4)}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-bold text-muted-foreground">Language</span>
                                            <Badge variant="outline" className="h-5 px-2 text-[8px] font-black uppercase">{language === 'hi' ? 'Hindi' : 'English'}</Badge>
                                        </div>
                                    </div>
                                </Card>

                                <Card className="p-6 rounded-3xl bg-primary/5 border-primary/10 shadow-lg relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-10">
                                        <BookOpen className="h-12 w-12 text-primary" />
                                    </div>
                                    <div className="relative z-10 space-y-4">
                                        <h4 className="font-black text-lg tracking-tight leading-none">Need specific assistance?</h4>
                                        <p className="text-[11px] text-muted-foreground leading-relaxed font-medium">
                                            Our AI Forensic Audit node can deconstruct your specific case narration in real-time.
                                        </p>
                                        <Button asChild variant="default" className="w-full h-11 rounded-xl font-bold text-[10px] uppercase tracking-widest">
                                            <Link href="/dashboard/narrate">Initialize Narrator</Link>
                                        </Button>
                                    </div>
                                </Card>
                            </aside>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            <div className="text-center pt-8">
                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/40">Knowledge Node Session Active // Secure Registry Sync</p>
            </div>
        </div>
    );
}
