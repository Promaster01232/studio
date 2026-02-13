
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import {
  Mic,
  MessageSquare,
  FileSearch,
  FileText,
  FileSignature,
  Users,
  Scale,
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
      color: "from-purple-500 to-indigo-600",
      shadow: "shadow-purple-500/30"
    },
    {
      href: "/dashboard/document-intelligence",
      icon: FileSearch,
      title: "Document Intelligence",
      description: "Upload any legal document to understand its content and risks.",
      color: "from-orange-500 to-amber-600",
      shadow: "shadow-orange-500/30"
    },
    {
      href: "/dashboard/document-generator",
      icon: FileText,
      title: "Document Generator",
      description: "Instantly create legal documents like complaints and notices.",
      color: "from-green-500 to-emerald-600",
      shadow: "shadow-green-500/30"
    },
    {
      href: "/dashboard/bond-generator",
      icon: FileSignature,
      title: "Bond Generator",
      description: "Generate various types of legal bonds for your needs.",
      color: "from-sky-500 to-blue-600",
      shadow: "shadow-sky-500/30"
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
    <h2 className="text-xl font-bold tracking-tight text-foreground/90">{children}</h2>
)


export default function DashboardHomePage() {
  return (
    <div className="flex flex-col h-full relative">
       <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="xl:col-span-2 space-y-8">
                {/* Welcome Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold font-headline tracking-tight">Welcome to Nyaya Sahayak</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline">Join to Research</Button>
                        <Button variant="outline">Send a Lawyer Request</Button>
                        <Button variant="outline" asChild><Link href="/dashboard/lawyer-connect">Find a Lawyer</Link></Button>
                    </div>
                </div>

                 {/* Speak your mood */}
                <div>
                    <SectionTitle>Speak your Mood</SectionTitle>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        <Card className="bg-muted border-accent/30 hover:border-accent transition-colors duration-300">
                           <CardContent className="p-6">
                                <Link href="/dashboard/narrate" className="flex items-center gap-4 group">
                                    <div className="p-3 rounded-lg bg-background border border-accent/30">
                                        <Mic className="h-6 w-6 text-accent" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold group-hover:text-accent transition-colors">Speak Your Problem</h3>
                                        <p className="text-sm text-muted-foreground">Narrate your legal issue for an AI summary.</p>
                                    </div>
                                </Link>
                           </CardContent>
                        </Card>
                         <Card className="bg-muted border-accent/30 hover:border-accent transition-colors duration-300">
                           <CardContent className="p-6">
                                <Link href="/dashboard/lawyer-connect" className="flex items-center gap-4 group">
                                    <div className="p-3 rounded-lg bg-background border border-accent/30">
                                        <MessageSquare className="h-6 w-6 text-accent" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold group-hover:text-accent transition-colors">Ask Your AI Assistant</h3>
                                        <p className="text-sm text-muted-foreground">Get answers to your legal questions.</p>
                                    </div>
                                </Link>
                           </CardContent>
                        </Card>
                    </div>
                </div>
                
                {/* One-step to Solution */}
                <div>
                     <SectionTitle>One-step to Solution</SectionTitle>
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        {aiFeatures.map(feature => (
                            <Link key={feature.href} href={feature.href} className="block group">
                                <Card className={cn("overflow-hidden text-center p-5 flex flex-col items-center justify-center aspect-square text-white transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-2xl", feature.color, feature.shadow)}>
                                    <feature.icon className="h-8 w-8 mb-2" />
                                    <h3 className="font-bold text-sm">{feature.title}</h3>
                                </Card>
                            </Link>
                        ))}
                     </div>
                </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
                <SectionTitle>Latest Legal News</SectionTitle>
                <div className="space-y-4">
                    {newsItems.map(item => (
                         <Card key={item.id} className="bg-muted overflow-hidden">
                            <Link href="/dashboard/research-analytics" className="flex items-center gap-4 group">
                                {item.image && (
                                    <div className="relative w-24 h-24 shrink-0">
                                        <Image src={item.image.imageUrl} alt={item.title} fill className="object-cover" data-ai-hint={item.image.imageHint} />
                                    </div>
                                )}
                                <div className="p-2 pr-4">
                                    <h3 className="text-sm font-semibold leading-tight group-hover:text-primary transition-colors">{item.title}</h3>
                                </div>
                            </Link>
                        </Card>
                    ))}
                </div>
                <Button variant="outline" className="w-full" asChild><Link href="/dashboard/research-analytics">View All News</Link></Button>
            </div>
       </div>
    </div>
  );
}
