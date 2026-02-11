
"use client";

import { useParams, notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { topics } from "../data";
import { useLanguage } from "@/components/language-provider";
import { useMemo } from "react";

export default function LearnTopicDetailPage() {
    const params = useParams();
    const slug = params.slug;
    const { language } = useLanguage();

    const topic = topics.find((t) => t.slug === slug);

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

    return (
        <div>
            <div className="flex items-center gap-4 mb-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/dashboard/learn">
                        <ArrowLeft />
                        <span className="sr-only">Back to Legal Knowledge Hub</span>
                    </Link>
                </Button>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold font-headline tracking-tight">{topic.title}</h1>
                    <p className="mt-1 text-muted-foreground">{topic.description}</p>
                </div>
            </div>

            <Card>
                <CardContent className="prose dark:prose-invert max-w-none p-6">
                   <div className="whitespace-pre-line">{localizedContent}</div>
                </CardContent>
            </Card>
        </div>
    );
}
