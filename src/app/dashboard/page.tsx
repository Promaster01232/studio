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
} from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
    {
      icon: <Briefcase className="h-8 w-8" />,
      title: "Case Tracker",
      description: "Track all your ongoing legal matters and important dates.",
      href: "/dashboard/my-cases",
      gradient: "bg-gradient-to-br from-teal-500 to-cyan-500",
    },
    {
      icon: <CircleUserRound className="h-8 w-8" />,
      title: "My Profile",
      description: "Manage your profile and settings.",
      href: "/dashboard/profile",
      gradient: "bg-gradient-to-br from-orange-500 to-amber-500",
    },
    {
      icon: <Mic className="h-8 w-8" />,
      title: "Speak Your Problem",
      description: "Narrate your legal issue and get an instant AI summary.",
      href: "/dashboard/narrate",
      gradient: "bg-gradient-to-br from-emerald-500 to-teal-500",
    },
    {
      icon: <HelpCircle className="h-8 w-8" />,
      title: "Case Strength Analyzer",
      description: "Get an AI-powered assessment of how strong your case is.",
      href: "/dashboard/strength-analyzer",
    },
    {
      icon: <FileSearch className="h-8 w-8" />,
      title: "Document Intelligence",
      description: "Upload any legal document to understand its content, risks and deadlines.",
      href: "/dashboard/document-intelligence",
    },
    {
        icon: <FileText className="h-8 w-8" />,
        title: "Complaint Generator",
        description: "Instantly create legal documents like complaints and notices.",
        href: "/dashboard/document-generator",
    },
    {
        icon: <FileSignature className="h-8 w-8" />,
        title: "Bond Generator",
        description: "Generate various types of legal bonds.",
        href: "/dashboard/bond-generator",
    },
    {
        icon: <Shield className="h-8 w-8" />,
        title: "Police & Court Guides",
        description: "Know your rights and the correct procedures.",
        href: "/dashboard/police-guide",
    },
    {
        icon: <BarChart2 className="h-8 w-8" />,
        title: "Legal Knowledge Hub",
        description: "Learn your rights and understand common legal topics.",
        href: "/dashboard/learn",
    },
    {
        icon: <Users className="h-8 w-8" />,
        title: "Lawyer Connect",
        description: "Find and consult with verified lawyers near you.",
        href: "/dashboard/lawyer-connect",
    },
    {
        icon: <HeartHandshake className="h-8 w-8" />,
        title: "NGO & Legal Aid",
        description: "Connect with NGOs and legal aid providers.",
        href: "/dashboard/ngo-legal-aid",
    },
    {
        icon: <Briefcase className="h-8 w-8" />,
        title: "Business & MSME Tools",
        description: "Specialized legal tools for businesses and MSMEs.",
        href: "/dashboard/business-msme",
    },
];

export default function DashboardHomePage() {
  return (
    <div className="flex flex-col h-full relative">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <Link href="/dashboard" className="block group">
            <Card className="p-6 h-full flex flex-col justify-between transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-1.5 border-transparent bg-gradient-to-br from-fuchsia-600 to-violet-600 text-primary-foreground">
              <div>
                <Home className="h-8 w-8" />
                <h3 className="text-xl font-bold mt-4">Dashboard</h3>
                <p className="opacity-80 mt-2 text-base">Overview of all your legal activities.</p>
              </div>
              <div className="mt-6 flex items-center justify-between font-semibold">
                <span>View Dashboard</span>
                <ArrowRight className="transition-transform group-hover:translate-x-1" />
              </div>
            </Card>
          </Link>
        {features.map((feature) => (
          <Link key={feature.href} href={feature.href} className="block group">
            <Card className={cn(
                "p-6 h-full flex flex-col justify-between transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-1.5",
                (feature as any).gradient 
                    ? `${(feature as any).gradient} text-primary-foreground border-transparent` 
                    : "bg-card group-hover:border-primary/30"
            )}>
              <div className={cn((feature as any).gradient && "text-primary-foreground")}>
                <div className={cn("h-8 w-8", !(feature as any).gradient && "text-primary")}>
                    {feature.icon}
                </div>
                <h3 className="text-xl font-bold mt-4">{feature.title}</h3>
                <p className={cn("mt-2 text-base", (feature as any).gradient ? "opacity-80" : "text-muted-foreground")}>{feature.description}</p>
              </div>
              <div className={cn(
                  "mt-6 flex items-center justify-between font-semibold", 
                  (feature as any).gradient ? "text-primary-foreground" : "text-primary"
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
