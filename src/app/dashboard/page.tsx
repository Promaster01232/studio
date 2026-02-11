import { Card } from "@/components/ui/card";
import Link from "next/link";
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
import { Button } from "@/components/ui/button";

const features = [
    {
      icon: <Briefcase className="h-8 w-8 text-primary" />,
      title: "Case Tracker",
      description: "Track all your ongoing legal matters and important dates.",
      href: "/dashboard/my-cases",
    },
    {
      icon: <CircleUserRound className="h-8 w-8 text-primary" />,
      title: "My Profile",
      description: "Manage your profile and settings.",
      href: "/dashboard/profile",
    },
    {
      icon: <Mic className="h-8 w-8 text-primary" />,
      title: "Speak Your Problem",
      description: "Narrate your legal issue and get an instant AI summary.",
      href: "/dashboard/narrate",
    },
    {
      icon: <HelpCircle className="h-8 w-8 text-primary" />,
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
        title: "Complaint Generator",
        description: "Instantly create legal documents like complaints and notices.",
        href: "/dashboard/document-generator",
    },
    {
        icon: <FileSignature className="h-8 w-8 text-primary" />,
        title: "Bond Generator",
        description: "Generate various types of legal bonds.",
        href: "/dashboard/bond-generator",
    },
    {
        icon: <Shield className="h-8 w-8 text-primary" />,
        title: "Police & Court Guides",
        description: "Know your rights and the correct procedures.",
        href: "/dashboard/police-guide",
    },
    {
        icon: <BarChart2 className="h-8 w-8 text-primary" />,
        title: "Legal Knowledge Hub",
        description: "Learn your rights and understand common legal topics.",
        href: "/dashboard/learn",
    },
    {
        icon: <Users className="h-8 w-8 text-primary" />,
        title: "Lawyer Connect",
        description: "Find and consult with verified lawyers near you.",
        href: "/dashboard/lawyer-connect",
    },
    {
        icon: <HeartHandshake className="h-8 w-8 text-primary" />,
        title: "NGO & Legal Aid",
        description: "Connect with NGOs and legal aid providers.",
        href: "/dashboard/ngo-legal-aid",
    },
    {
        icon: <Briefcase className="h-8 w-8 text-primary" />,
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
            <Card className="p-6 h-full flex flex-col justify-between transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-1.5 group-hover:border-primary/30 bg-primary text-primary-foreground">
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
    </div>
  );
}
