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
      { href: "/dashboard/police-guide", icon: Shield, label: "Police Guide", tooltip: "Police Guide" },
      { href: "/dashboard/lawyer-connect", icon: Gavel, label: "Find a Lawyer", tooltip: "Find a Lawyer" },
      { href: "/dashboard/learn", icon: BookOpen, label: "Learn Law", tooltip: "Learn Law" },
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
                  <Link href={subItem.href} passHref legacyBehavior>
                    <SidebarMenuButton
                      as="a"
                      isActive={pathname === subItem.href}
                      tooltip={{ children: subItem.tooltip }}
                    >
                      <subItem.icon />
                      <span>{subItem.label}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ) : (
          <SidebarMenu key={index}>
            <SidebarMenuItem>
              <Link href={item.href!} passHref legacyBehavior>
                <SidebarMenuButton
                  as="a"
                  isActive={pathname === item.href}
                  tooltip={{ children: item.tooltip }}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        )
      )}
    </>
  );
}
