import { Card } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight, Mic, Gauge, FileSearch, FileText, Shield, Gavel, FolderKanban, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
    {
      icon: <Mic className="h-8 w-8 text-primary" />,
      title: "Voice-Based Input",
      description: "Narrate your legal issue and get an instant AI summary.",
      href: "/dashboard/narrate",
    },
    {
      icon: <Gauge className="h-8 w-8 text-primary" />,
      title: "Case Strength Analyzer",
      description: "Get an AI-powered assessment of how strong your case is.",
      href: "/dashboard/strength-analyzer",
    },
    {
      icon: <FileSearch className="h-8 w-8 text-primary" />,
      title: "Document Intelligence",
      description: "Upload any legal document to understand its content, risks and deadlines.",
      href: "/dashboard/document-intelligence",
    },
    {
        icon: <FileText className="h-8 w-8 text-primary" />,
        title: "Document Generator",
        description: "Instantly create legal documents like complaints and notices.",
        href: "/dashboard/document-generator",
    },
    {
        icon: <Shield className="h-8 w-8 text-primary" />,
        title: "Police & Court Guides",
        description: "Know your rights and the correct procedures.",
        href: "/dashboard/police-guide",
    },
    {
        icon: <Gavel className="h-8 w-8 text-primary" />,
        title: "Lawyer Connect",
        description: "Find and consult with verified lawyers near you.",
        href: "/dashboard/lawyer-connect",
    },
    {
        icon: <FolderKanban className="h-8 w-8 text-primary" />,
        title: "My Cases",
        description: "Track all your ongoing legal matters and important dates.",
        href: "/dashboard/my-cases",
    },
    {
        icon: <BookOpen className="h-8 w-8 text-primary" />,
        title: "Legal Knowledge Hub",
        description: "Learn your rights and understand common legal topics.",
        href: "/dashboard/learn",
    },
];

export default function DashboardHomePage() {
  return (
    <div className="flex flex-col h-full relative">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {features.map((feature) => (
          <Link key={feature.href} href={feature.href} className="block group">
            <Card className="p-6 h-full flex flex-col justify-between transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-1.5 group-hover:border-primary/30">
              <div>
                {feature.icon}
                <h3 className="text-xl font-bold text-foreground mt-4">{feature.title}</h3>
                <p className="text-muted-foreground mt-2 text-base">{feature.description}</p>
              </div>
              <div className="mt-6 flex items-center justify-between font-semibold text-primary">
                <span>Explore</span>
                <ArrowRight className="transition-transform group-hover:translate-x-1" />
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <Button variant="destructive" size="icon" className="rounded-full h-16 w-16 fixed bottom-8 right-8 shadow-2xl z-10 flex items-center justify-center">
        <span className="font-bold text-2xl">N</span>
        <span className="absolute top-1.5 right-1.5 flex h-3 w-3">
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
        </span>
      </Button>
    </div>
  );
}
