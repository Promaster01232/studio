"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { guides } from "../data";

export default function GuideDetailPage({ params, searchParams }: { 
  params: Promise<{ slug: string }>,
  searchParams: Promise<any>
}) {
    // Unwrap dynamic props for Next.js 15 compliance
    const { slug } = use(params);
    use(searchParams);

    const guide = guides.find((g) => g.slug === slug);

    if (!guide) {
        notFound();
    }

    return (
        <div className="space-y-6 text-left">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
                <Button variant="ghost" size="sm" className="rounded-xl font-bold hover:bg-primary/5 group" asChild>
                    <Link href="/dashboard/police-guide">
                        <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" /> Back to Guides
                    </Link>
                </Button>
                <div className="flex-1">
                    <h1 className="text-3xl font-black font-headline tracking-tighter leading-tight">{guide.title}</h1>
                    <p className="mt-1 text-sm text-muted-foreground font-medium">{guide.description}</p>
                </div>
            </div>

            <Card className="glass border-primary/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <CardContent className="prose dark:prose-invert max-w-none p-8 sm:p-12 text-left">
                    <div className="space-y-6">
                        <div className="p-6 bg-primary/5 rounded-2xl border border-primary/10">
                            <p className="text-sm sm:text-base font-medium leading-relaxed italic text-foreground/80">"{guide.content}"</p>
                        </div>
                        
                        <h2 className="text-2xl font-black tracking-tight">Statutory Requirements</h2>
                        <p className="text-sm sm:text-base font-medium leading-relaxed">
                            This section provides a detailed breakdown of the protocol. The process is engineered to ensure citizen rights are protected under current judicial amendments.
                        </p>
                        <ul className="grid sm:grid-cols-2 gap-4 list-none p-0">
                            <li className="flex items-center gap-3 p-4 rounded-xl bg-muted/30 border border-primary/5">
                                <div className="h-2 w-2 rounded-full bg-primary"></div>
                                <span className="text-xs font-bold uppercase tracking-wide">Document Verification</span>
                            </li>
                            <li className="flex items-center gap-3 p-4 rounded-xl bg-muted/30 border border-primary/5">
                                <div className="h-2 w-2 rounded-full bg-primary"></div>
                                <span className="text-xs font-bold uppercase tracking-wide">Jurisdictional Filing</span>
                            </li>
                            <li className="flex items-center gap-3 p-4 rounded-xl bg-muted/30 border border-primary/5">
                                <div className="h-2 w-2 rounded-full bg-primary"></div>
                                <span className="text-xs font-bold uppercase tracking-wide">Legal Privilege Knowledge</span>
                            </li>
                            <li className="flex items-center gap-3 p-4 rounded-xl bg-muted/30 border border-primary/5">
                                <div className="h-2 w-2 rounded-full bg-primary"></div>
                                <span className="text-xs font-bold uppercase tracking-wide">Redressal Mechanisms</span>
                            </li>
                        </ul>
                        
                        <h2 className="text-2xl font-black tracking-tight">Further Procedural Steps</h2>
                        <p className="text-sm sm:text-base font-medium leading-relaxed">
                            After deconstructing the basics, we recommend connecting with our <Link href="/dashboard/lawyer-connect" className="text-primary font-bold hover:underline">Verified Advocate Registry</Link> for personalized forensic strategy.
                        </p>
                    </div>
                </CardContent>
            </Card>
            
            <div className="text-center pt-10 opacity-30">
                <p className="text-[9px] font-black uppercase tracking-[0.5em] text-muted-foreground">NYAYASAHAYAK.IN // GUIDE NODE {slug?.toUpperCase()}</p>
            </div>
        </div>
    );
}
