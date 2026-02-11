"use client";

import { useParams, notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { guides } from "../data";

export default function GuideDetailPage() {
    const params = useParams();
    const slug = params.slug;

    const guide = guides.find((g) => g.slug === slug);

    if (!guide) {
        notFound();
    }

    return (
        <div>
            <div className="flex items-center gap-4 mb-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/dashboard/police-guide">
                        <ArrowLeft />
                        <span className="sr-only">Back to Guides</span>
                    </Link>
                </Button>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold font-headline tracking-tight">{guide.title}</h1>
                    <p className="mt-1 text-muted-foreground">{guide.description}</p>
                </div>
            </div>

            <Card>
                <CardContent className="prose dark:prose-invert max-w-none p-6">
                    <p>{guide.content}</p>
                    {/* Placeholder for more detailed content */}
                    <h2>What You Need to Know</h2>
                    <p>
                        This section will provide a detailed breakdown of the topic. For now, here is some placeholder text. The process is designed to be straightforward, but it's essential to follow each step carefully to ensure your rights are protected and your case proceeds smoothly.
                    </p>
                    <ul>
                        <li>Gather all necessary documents.</li>
                        <li>Understand the jurisdiction and where to file.</li>
                        <li>Know your rights during the process.</li>
                        <li>What to do if you encounter resistance.</li>
                    </ul>
                    <h2>Further Steps</h2>
                    <p>
                        After understanding the basics, you might want to consult with a legal professional. You can use our Lawyer Connect feature to find a verified lawyer who specializes in this area. This will provide you with personalized advice tailored to your specific situation.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
