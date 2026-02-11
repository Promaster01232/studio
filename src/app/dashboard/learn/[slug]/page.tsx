
"use client";

import { useParams, notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { topics } from "../data";

export default function LearnTopicDetailPage() {
    const params = useParams();
    const slug = params.slug;

    const topic = topics.find((t) => t.slug === slug);

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
                    <p>{topic.content}</p>
                    
                    <h2 className="mt-6">What You Need to Know</h2>
                    <p>
                        This section provides a detailed breakdown of {topic.title}. The legal principles are designed to be straightforward, but it's essential to understand the nuances to ensure your rights are protected.
                    </p>
                    <ul>
                        <li>Understand the key definitions and concepts.</li>
                        <li>Know the relevant laws and acts.</li>
                        <li>Learn about the procedures for exercising your rights or seeking remedies.</li>
                        <li>Be aware of common pitfalls and challenges.</li>
                    </ul>
                    <h2>Further Steps</h2>
                    <p>
                        After understanding the basics, you might want to consult with a legal professional for advice tailored to your specific situation. You can use our Lawyer Connect feature to find a verified lawyer who specializes in this area.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
