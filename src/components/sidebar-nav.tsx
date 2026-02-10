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
  MessageSquare,
  BarChart2,
  FileText,
  FileSearch,
  Shield,
  Gavel,
  FolderKanban,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", icon: Home, label: "Home", tooltip: "Home" },
  {
    group: "Case Tools",
    items: [
      { href: "/dashboard/narrate", icon: MessageSquare, label: "Narrate Problem", tooltip: "Narrate Problem" },
      { href: "/dashboard/strength-analyzer", icon: BarChart2, label: "Analyze Strength", tooltip: "Analyze Strength" },
      { href: "/dashboard/document-generator", icon: FileText, label: "Generate Document", tooltip: "Generate Document" },
      { href: "/dashboard/document-intelligence", icon: FileSearch, label: "Understand Document", tooltip: "Understand Document" },
    ],
  },
  {
    group: "Resources",
    items: [
      { href: "/dashboard/police-guide", icon: Shield, label: "Police & Court Guides", tooltip: "Police & Court Guides" },
      { href: "/dashboard/lawyer-connect", icon: Gavel, label: "Lawyer Connect", tooltip: "Lawyer Connect" },
      { href: "/dashboard/learn", icon: BookOpen, label: "Legal Knowledge Hub", tooltip: "Legal Knowledge Hub" },
    ],
  },
  { href: "/dashboard/my-cases", icon: FolderKanban, label: "My Cases", tooltip: "My Cases" },
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
