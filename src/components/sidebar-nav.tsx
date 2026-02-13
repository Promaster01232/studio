
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
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const mainItems = [
    { href: "/dashboard", icon: Home, label: "Dashboard", tooltip: "Dashboard" }
];

const aiTools = [
    { href: "/dashboard/narrate", icon: Mic, label: "Narrate Problem", tooltip: "Narrate Problem" },
    { href: "/dashboard/document-intelligence", icon: FileSearch, label: "Document Intelligence", tooltip: "Document Intelligence" },
    { href: "/dashboard/document-generator", icon: FileText, label: "Document Generator", tooltip: "Document Generator" },
    { href: "/dashboard/bond-generator", icon: FileSignature, label: "Bond Generator", tooltip: "Bond Generator" },
    { href: "/dashboard/strength-analyzer", icon: BrainCircuit, label: "Case Strength Analyzer", tooltip: "Case Strength Analyzer" },
    { href: "/dashboard/court-assistant", icon: Gavel, label: "Court Assistant", tooltip: "Court Assistant" },
];

const resources = [
    { href: "/dashboard/my-cases", icon: FolderKanban, label: "Case Management", tooltip: "Case Management" },
    { href: "/dashboard/lawyer-connect", icon: Users, label: "Lawyer Connect", tooltip: "Lawyer Connect" },
    { href: "/dashboard/ngo-legal-aid", icon: HeartHandshake, label: "NGO & Legal Aid", tooltip: "NGO & Legal Aid" },
    { href: "/dashboard/learn", icon: Library, label: "Legal Knowledge Hub", tooltip: "Legal Knowledge Hub" },
    { href: "/dashboard/police-guide", icon: Shield, label: "Police & Court Guides", tooltip: "Police & Court Guides" },
    { href: "/dashboard/research-analytics", icon: Newspaper, label: "News & Analytics", tooltip: "News & Analytics" },
];

const professionalTools = [
    { href: "/dashboard/business-msme", icon: Briefcase, label: "Business & MSME", tooltip: "Business & MSME" },
    { href: "/dashboard/finances-billing", icon: Landmark, label: "Finances & Billing", tooltip: "Finances & Billing" },
];

const general = [
    { href: "/dashboard/profile", icon: CircleUserRound, label: "My Profile", tooltip: "My Profile" },
    { href: "/dashboard/support", icon: LifeBuoy, label: "Support", tooltip: "Support" },
];

const MenuSection = ({ title, items, checkActive }: { title: string; items: typeof mainItems; checkActive: (href: string) => boolean }) => (
    <React.Fragment>
        <li className="px-4 mt-4 mb-2 text-xs font-semibold uppercase text-sidebar-foreground/50 tracking-wider group-data-[collapsible=icon]:hidden">
            {title}
        </li>
        {items.map(item => (
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
    </React.Fragment>
);


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
        <MenuSection title="Main" items={mainItems} checkActive={checkActive} />
        <MenuSection title="AI Tools" items={aiTools} checkActive={checkActive} />
        <MenuSection title="Resources" items={resources} checkActive={checkActive} />
        <MenuSection title="Professional" items={professionalTools} checkActive={checkActive} />
        <MenuSection title="General" items={general} checkActive={checkActive} />
    </SidebarMenu>
  );
}
