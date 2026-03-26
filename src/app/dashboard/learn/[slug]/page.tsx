
"use client";

import { useParams, notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, BookOpen, Clock, Globe, ShieldCheck, Share2, Printer, Sparkles, Landmark, FileText, Download, Bookmark, Zap, Scale } from "lucide-react";
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
        // Always prioritize forensic English depth as requested by user
        return parts[0].trim();
    }, [topic]);

    if (!topic) {
        notFound();
    }

    const wordCount = topic.content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);

    return (
        <div className="max-w-6xl mx-auto pb-20 space-y-10 text-left px-2 sm:px-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-primary/5 pb-6">
                <Button variant="ghost" size="sm" className="rounded-xl font-bold hover:bg-primary/5 group" asChild>
                    <Link href="/dashboard/learn">
                        <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" /> Back to Hub Registry
                    </Link>
                </Button>
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" className="h-10 rounded-xl border-primary/10 hover:bg-primary/5 gap-2 font-bold text-[10px] uppercase">
                        <Download className="h-3.5 w-3.5 text-primary" /> Export Audit
                    </Button>
                    <div className="h-6 w-px bg-primary/10"></div>
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl border-primary/5 hover:bg-primary/5">
                        <Share2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl border-primary/5 hover:bg-primary/5">
                        <Bookmark className="h-4 w-4 text-muted-foreground" />
                    </Button>
                </div>
            </div>

            <motion.div initial={{ opacity: 0, scale: 0.99 }} animate={{ opacity: 1, scale: 1 }}>
                <Card className="glass shadow-[0_50px_100px_rgba(0,0,0,0.1)] rounded-[3rem] border-primary/5 overflow-hidden">
                    <CardHeader className="p-8 sm:p-16 bg-primary/5 border-b border-primary/10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-16 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-700">
                            <Landmark className="h-64 w-64" />
                        </div>
                        <div className="relative z-10 space-y-8 max-w-4xl">
                            <div className="flex flex-wrap items-center gap-4">
                                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 px-5 py-1 rounded-full font-black text-[10px] uppercase tracking-widest shadow-inner">
                                    Forensic Study Node
                                </Badge>
                                <div className="flex items-center gap-6 text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest">
                                    <span className="flex items-center gap-2 bg-background/50 px-3 py-1.5 rounded-lg border border-primary/5"><Clock className="h-3.5 w-3.5 text-primary" /> {readingTime} Min Audit</span>
                                    <span className="flex items-center gap-2 bg-background/50 px-3 py-1.5 rounded-lg border border-primary/5"><Globe className="h-3.5 w-3.5 text-primary" /> Worldwide Access</span>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <h1 className="text-4xl sm:text-7xl font-black font-headline tracking-tighter leading-none text-foreground bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text">
                                    {topic.title}
                                </h1>
                                <p className="text-xl sm:text-2xl text-primary font-bold tracking-tight italic opacity-80">
                                    Institutional Statutory Registry // NS-NODE-{topic.slug.toUpperCase().substring(0, 4)}
                                </p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 sm:p-16">
                        <div className="flex flex-col gap-16">
                            <div className="flex-1 space-y-12">
                                <div className="p-8 bg-primary/5 rounded-[2.5rem] border border-primary/10 shadow-inner text-left relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-4 opacity-[0.05]">
                                        <Sparkles className="h-12 w-12 text-primary" />
                                    </div>
                                    <div className="flex items-start gap-6 relative z-10">
                                        <div className="bg-primary/10 p-3 rounded-2xl text-primary shrink-0 shadow-sm border border-primary/20">
                                            <Zap className="h-6 w-6 animate-pulse" />
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Executive Summary Node</p>
                                            <p className="text-base sm:text-lg font-bold text-foreground/80 leading-relaxed italic">
                                                {topic.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="prose dark:prose-invert prose-sm sm:prose-lg max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-p:font-medium prose-p:leading-relaxed prose-p:text-foreground/80 prose-li:font-medium text-foreground/90 selection:bg-primary/10">
                                    <div className="whitespace-pre-line leading-loose text-base sm:text-lg font-medium">
                                        {localizedContent}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            <div className="text-center pt-12 opacity-40">
                <p className="text-[9px] font-black uppercase tracking-[0.5em] text-muted-foreground mb-2">Knowledge Session Active // Secure Registry Sync Node</p>
                <p className="text-[10px] font-bold italic">nyayasahayak.in - The Future of Justice is Neural.</p>
            </div>
        </div>
    );
}
