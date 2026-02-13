import { Card } from "@/components/ui/card";
import Link from "next/link";
import React from "react";
import {
  ArrowRight,
  Mic,
  HelpCircle,
  FileSearch,
  FileText,
  FileSignature,
  Shield,
  Users,
  Briefcase,
  BarChart2,
  HeartHandshake,
  CircleUserRound,
  Home,
  Gavel,
  Landmark,
  Library,
  Accessibility,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    href: "/dashboard",
    icon: Home,
    title: "Dashboard",
    description: "Overview of all your legal activities.",
    gradient: "bg-gradient-to-br from-fuchsia-600 to-violet-600",
  },
  {
    href: "/dashboard/my-cases",
    icon: Briefcase,
    title: "Case Management",
    description: "Track all your ongoing legal matters and important dates.",
  },
  {
    href: "/dashboard/profile",
    icon: CircleUserRound,
    title: "My Profile",
    description: "Manage your profile and settings.",
  },
  {
    href: "/dashboard/narrate",
    icon: Mic,
    title: "Speak Your Problem",
    description: "Narrate your legal issue and get an instant AI summary.",
    gradient: "bg-gradient-to-br from-emerald-500 to-teal-500",
  },
  {
    href: "/dashboard/strength-analyzer",
    icon: HelpCircle,
    title: "Case Strength Analyzer",
    description: "Get an AI-powered assessment of how strong your case is.",
  },
  {
    href: "/dashboard/document-intelligence",
    icon: FileSearch,
    title: "Document Intelligence",
    description: "Upload any legal document to understand its content, risks and deadlines.",
  },
  {
    href: "/dashboard/document-generator",
    icon: FileText,
    title: "Complaint Generator",
    description: "Instantly create legal documents like complaints and notices.",
  },
  {
    href: "/dashboard/bond-generator",
    icon: FileSignature,
    title: "Bond Generator",
    description: "Generate various types of legal bonds.",
  },
  {
    href: "/dashboard/court-assistant",
    icon: Gavel,
    title: "Court Room Tools",
    description: "Real-time transcription and AI assistance during proceedings.",
  },
  {
    href: "/dashboard/police-guide",
    icon: Shield,
    title: "Police & Court Guides",
    description: "Know your rights and the correct procedures.",
  },
  {
    href: "/dashboard/learn",
    icon: BarChart2,
    title: "Legal Knowledge Hub",
    description: "Learn your rights and understand common legal topics.",
  },
  {
    href: "/dashboard/research-analytics",
    icon: Library,
    title: "Research & Analytics",
    description: "Stay updated with legal news and judgments.",
  },
  {
    href: "/dashboard/lawyer-connect",
    icon: Users,
    title: "Lawyer Connect",
    description: "Find and consult with verified lawyers near you.",
  },
  {
    href: "/dashboard/ngo-legal-aid",
    icon: HeartHandshake,
    title: "NGO & Legal Aid",
    description: "Connect with NGOs and legal aid providers.",
  },
  {
    href: "/dashboard/business-msme",
    icon: Briefcase,
    title: "Business & MSME Tools",
    description: "Specialized legal tools for businesses and MSMEs.",
  },
  {
    href: "/dashboard/finances-billing",
    icon: Landmark,
    title: "Finances & Billing",
    description: "Tools for legal professionals to manage fees and billing.",
  },
   {
    href: "/dashboard/support",
    icon: Accessibility,
    title: "Support",
    description: "Get help and manage accessibility settings.",
  },
  {
    href: "/dashboard/contact",
    icon: Mail,
    title: "Contact Us",
    description: "Get in touch with our team for support or feedback.",
  },
];

export default function DashboardHomePage() {
  return (
    <div className="flex flex-col h-full relative">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {features.map((feature) => (
          <Link key={feature.href} href={feature.href} className="block group">
            <Card className={cn(
                "p-6 h-full flex flex-col justify-between transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-1",
                feature.gradient 
                    ? `${feature.gradient} text-primary-foreground border-transparent` 
                    : "bg-card group-hover:border-primary/30"
            )}>
              <div className={cn(feature.gradient && "text-primary-foreground")}>
                <div className={cn("h-8 w-8", !feature.gradient && "text-primary")}>
                    <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mt-4">{feature.title}</h3>
                <p className={cn("mt-1 text-base", feature.gradient ? "opacity-80" : "text-muted-foreground")}>{feature.description}</p>
              </div>
              <div className={cn(
                  "mt-6 flex items-center justify-between font-semibold", 
                  feature.gradient ? "text-primary-foreground" : "text-primary"
              )}>
                <span>Explore</span>
                <ArrowRight className="transition-transform group-hover:translate-x-1" />
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
