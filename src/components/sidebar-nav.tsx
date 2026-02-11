"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  Home,
  Briefcase,
  CircleUserRound,
  Mic,
  HelpCircle,
  FileSearch,
  FileText,
  FileSignature,
  Shield,
  BarChart2,
  Users,
  HeartHandshake,
  Github,
  Gavel,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", icon: Home, label: "Dashboard", tooltip: "Dashboard" },
  { href: "/dashboard/my-cases", icon: Briefcase, label: "Case Tracker", tooltip: "Case Tracker" },
  { href: "/dashboard/profile", icon: CircleUserRound, label: "My Profile", tooltip: "My Profile" },
  {
    group: "AI Tools",
    items: [
      { href: "/dashboard/narrate", icon: Mic, label: "Speak Your Problem", tooltip: "Speak Your Problem" },
      { href: "/dashboard/strength-analyzer", icon: HelpCircle, label: "Case Strength Analyzer", tooltip: "Case Strength Analyzer" },
      { href: "/dashboard/document-intelligence", icon: FileSearch, label: "Document Intelligence", tooltip: "Document Intelligence" },
      { href: "/dashboard/document-generator", icon: FileText, label: "Complaint Generator", tooltip: "Complaint Generator" },
      { href: "/dashboard/bond-generator", icon: FileSignature, label: "Bond Generator", tooltip: "Bond Generator" },
      { href: "/dashboard/court-assistant", icon: Gavel, label: "Court Room Tools", tooltip: "Court Room Tools" },
    ],
  },
  {
    group: "Resources",
    items: [
      { href: "/dashboard/police-guide", icon: Shield, label: "Police & Court Guides", tooltip: "Police & Court Guides" },
      { href: "/dashboard/learn", icon: BarChart2, label: "Legal Knowledge Hub", tooltip: "Legal Knowledge Hub" },
      { href: "/dashboard/lawyer-connect", icon: Users, label: "Lawyer Connect", tooltip: "Lawyer Connect" },
      { href: "/dashboard/ngo-legal-aid", icon: HeartHandshake, label: "NGO & Legal Aid", tooltip: "NGO & Legal Aid" },
      { href: "/dashboard/github", icon: Github, label: "GitHub", tooltip: "GitHub" },
    ],
  },
  {
    group: "Specialized",
    items: [
        { href: "/dashboard/business-msme", icon: Briefcase, label: "Business & MSME Tools", tooltip: "Business & MSME Tools" },
    ]
  }
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <>
      {navItems.map((item, index) =>
        item.group ? (
          <SidebarGroup key={index}>
            <SidebarGroupLabel>{item.group}</SidebarGroupLabel>
            <SidebarMenu>
              {item.items.map((subItem) => (
                <SidebarMenuItem key={subItem.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === subItem.href}
                      tooltip={{ children: subItem.tooltip }}
                    >
                      <Link href={subItem.href}>
                        <subItem.icon />
                        <span>{subItem.label}</span>
                      </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ) : (
          <SidebarMenu key={index}>
            <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={{ children: item.tooltip }}
                >
                  <Link href={item.href!}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        )
      )}
    </>
  );
}
