
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
                        <div className="flex flex-col lg:flex-row gap-16">
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
                                    
                                    <div className="mt-20 pt-16 border-t border-primary/5 bg-primary/5 rounded-[3rem] p-10 sm:p-16 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-12 opacity-[0.03]">
                                            <Scale className="h-40 w-40" />
                                        </div>
                                        <div className="relative z-10 text-center sm:text-left space-y-8">
                                            <div className="space-y-4">
                                                <h3 className="text-3xl font-black tracking-tighter flex items-center justify-center sm:justify-start gap-4">
                                                    <ShieldCheck className="h-8 w-8 text-green-600 animate-bounce" />
                                                    Compliance Mandate
                                                </h3>
                                                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-medium max-w-3xl">
                                                    The information provided in this module is for institutional education and navigational purposes on **nyayasahayak.in**. While audited for forensic accuracy, judicial amendments are dynamic. Users are mandated to connect with our **Verified Advocate Registry** for personalized litigation strategy.
                                                </p>
                                            </div>
                                            <div className="flex flex-col sm:flex-row gap-4">
                                                <Button asChild size="lg" className="h-16 px-10 rounded-[1.5rem] font-black uppercase tracking-widest text-xs shadow-2xl shadow-primary/20 active:scale-95 transition-all">
                                                    <Link href="/dashboard/lawyer-connect">Connect with Verified Advocate</Link>
                                                </Button>
                                                <Button variant="outline" asChild size="lg" className="h-16 px-10 rounded-[1.5rem] font-black uppercase tracking-widest text-xs border-primary/10 glass hover:bg-primary/5 active:scale-95 transition-all">
                                                    <Link href="/dashboard/narrate">Initialize Case Narrator</Link>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <aside className="lg:w-96 shrink-0 space-y-8">
                                <Card className="p-8 rounded-[2.5rem] glass border-primary/10 shadow-xl sticky top-24">
                                    <div className="flex items-center gap-3 text-primary mb-8">
                                        <FileText className="h-5 w-5" />
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em]">Module Dossier</h4>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="space-y-1">
                                            <span className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-widest">Word Count</span>
                                            <p className="text-xl font-black font-mono tracking-tighter text-foreground">{wordCount.toLocaleString()}</p>
                                        </div>
                                        <div className="h-px bg-primary/5"></div>
                                        <div className="space-y-1">
                                            <span className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-widest">Institutional ID</span>
                                            <p className="text-sm font-black font-mono tracking-widest text-primary">NS-RE-00{readingTime}</p>
                                        </div>
                                        <div className="h-px bg-primary/5"></div>
                                        <div className="space-y-1">
                                            <span className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-widest">Clearance Level</span>
                                            <p className="text-sm font-black uppercase tracking-widest text-green-600 flex items-center gap-2">
                                                <ShieldCheck className="h-3.5 w-3.5" /> Registry Access
                                            </p>
                                        </div>
                                        <div className="h-px bg-primary/5"></div>
                                        <div className="space-y-4 pt-4">
                                            <p className="text-[10px] font-bold text-muted-foreground/60 leading-relaxed italic">
                                                "Precision AI for statutory comprehension. Ensure 100% clarity before procedural initialization."
                                            </p>
                                            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 w-fit">
                                                <Zap className="h-3 w-3 text-primary animate-pulse" />
                                                <span className="text-[8px] font-black uppercase tracking-widest">Live Registry Sync</span>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </aside>
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
