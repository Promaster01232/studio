
"use client";

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  Home,
  Briefcase,
  CircleUserRound,
  Library,
  Users,
  BrainCircuit,
  Mic,
  FileSearch,
  FileText,
  FileSignature,
  Gavel,
  FolderKanban,
  HeartHandshake,
  Shield,
  Newspaper,
  Landmark,
  LifeBuoy,
  Mail,
  Github,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
    { href: "/dashboard", icon: Home, label: "Dashboard", tooltip: "Dashboard" },
    { href: "/dashboard/my-cases", icon: FolderKanban, label: "Case Management", tooltip: "Case Management" },
    { href: "/dashboard/narrate", icon: Mic, label: "Narrate Problem", tooltip: "Narrate Problem" },
    { href: "/dashboard/document-intelligence", icon: FileSearch, label: "Document Intelligence", tooltip: "Document Intelligence" },
    { href: "/dashboard/document-generator", icon: FileText, label: "Document Generator", tooltip: "Document Generator" },
    { href: "/dashboard/bond-generator", icon: FileSignature, label: "Bond Generator", tooltip: "Bond Generator" },
    { href: "/dashboard/strength-analyzer", icon: BrainCircuit, label: "Case Strength Analyzer", tooltip: "Case Strength Analyzer" },
    { href: "/dashboard/court-assistant", icon: Gavel, label: "Court Assistant", tooltip: "Court Assistant" },
    { href: "/dashboard/lawyer-connect", icon: Users, label: "Lawyer Connect", tooltip: "Lawyer Connect" },
    { href: "/dashboard/ngo-legal-aid", icon: HeartHandshake, label: "NGO & Legal Aid", tooltip: "NGO & Legal Aid" },
    { href: "/dashboard/learn", icon: Library, label: "Legal Knowledge Hub", tooltip: "Legal Knowledge Hub" },
    { href: "/dashboard/police-guide", icon: Shield, label: "Police & Court Guides", tooltip: "Police & Court Guides" },
    { href: "/dashboard/research-analytics", icon: Newspaper, label: "News & Analytics", tooltip: "News & Analytics" },
    { href: "/dashboard/business-msme", icon: Briefcase, label: "Business & MSME", tooltip: "Business & MSME" },
    { href: "/dashboard/finances-billing", icon: Landmark, label: "Finances & Billing", tooltip: "Finances & Billing" },
    { href: "/dashboard/profile", icon: CircleUserRound, label: "My Profile", tooltip: "My Profile" },
    { href: "/dashboard/support", icon: LifeBuoy, label: "Support", tooltip: "Support" },
    { href: "/dashboard/contact", icon: Mail, label: "Contact Us", tooltip: "Contact Us" },
    { href: "/dashboard/github", icon: Github, label: "GitHub", tooltip: "GitHub" },
];


export function SidebarNav() {
  const pathname = usePathname();

  const checkActive = (href: string) => {
    if (href === '/dashboard') {
        return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              asChild
              isActive={checkActive(item.href)}
              tooltip={{ children: item.tooltip }}
            >
              <Link href={item.href}>
                <item.icon />
                <span>{item.label}</span>
              </Link>
            </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
