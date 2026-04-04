"use client";

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import {
  Home,
  Briefcase,
  CircleUserRound,
  Library,
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
  ChevronRight,
  Settings,
  CreditCard,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const navigationItems = [
  {
    title: "main",
    icon: Home,
    href: "/dashboard",
    items: [],
  },
  {
    title: "ai legal tools",
    icon: BrainCircuit,
    items: [
      { href: "/dashboard/narrate", icon: Mic, label: "voice record case" },
      { href: "/dashboard/document-intelligence", icon: FileSearch, label: "document analysis" },
      { href: "/dashboard/document-generator", icon: FileText, label: "document generator" },
      { href: "/dashboard/bond-generator", icon: FileSignature, label: "bond generator" },
      { href: "/dashboard/strength-analyzer", icon: BrainCircuit, label: "case strength" },
      { href: "/dashboard/court-assistant", icon: Gavel, label: "court assistant" },
    ],
  },
  {
    title: "resources & help",
    icon: Library,
    items: [
      { href: "/dashboard/my-cases", icon: FolderKanban, label: "case management" },
      { href: "/dashboard/ngo-legal-aid", icon: HeartHandshake, label: "ngo & legal aid" },
      { href: "/dashboard/learn", icon: Library, label: "legal knowledge hub" },
      { href: "/dashboard/police-guide", icon: Shield, label: "police & court guides" },
      { href: "/dashboard/research-analytics", icon: Newspaper, label: "news & community" },
    ],
  },
  {
    title: "finances",
    icon: Landmark,
    items: [
      { href: "/dashboard/business-msme", icon: Briefcase, label: "business & msme" },
      { href: "/dashboard/finances-billing", icon: Landmark, label: "fees & billing" },
    ],
  },
  {
    title: "account",
    icon: CreditCard,
    items: [
      { href: "/dashboard/billing", icon: CreditCard, label: "upgrade & credits" },
    ],
  },
  {
    title: "admin",
    icon: Settings,
    isAdminOnly: true,
    items: [
      { href: "/dashboard/management-console", icon: Shield, label: "admin console" },
    ],
  },
  {
    title: "general",
    icon: CircleUserRound,
    items: [
      { href: "/dashboard/profile", icon: CircleUserRound, label: "my profile" },
      { href: "/dashboard/support", icon: LifeBuoy, label: "support" },
    ],
  },
];

export function SidebarNav({ isAdmin = false }: { isAdmin?: boolean }) {
  const pathname = usePathname();

  const isSubItemActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + "/");
  };

  const isGroupActive = (items: { href: string }[]) => {
    return items.some((item) => isSubItemActive(item.href));
  };

  const filteredItems = navigationItems.filter(item => !item.isAdminOnly || isAdmin);

  return (
    <SidebarMenu className="gap-2 px-2 py-4">
      {filteredItems.map((item) => {
        const hasSubItems = item.items.length > 0;
        const isActive = item.href ? pathname === item.href : isGroupActive(item.items);

        if (!hasSubItems) {
          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={isActive}
                tooltip={item.title}
                className="h-11 px-4"
              >
                <Link href={item.href!}>
                  <item.icon className="h-5 w-5" />
                  <span className="font-black lowercase first-letter:uppercase">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        }

        return (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  isActive={isActive}
                  tooltip={item.title}
                  className="h-11 px-4 hover:bg-primary/5"
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-black flex-1 lowercase first-letter:uppercase text-left">{item.title}</span>
                  <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub className="ml-4 mt-1 border-l-2 border-primary/10 gap-1 pl-2">
                  {item.items.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.label}>
                      <SidebarMenuSubButton
                        asChild
                        isActive={isSubItemActive(subItem.href)}
                        className="h-9 px-3 rounded-md transition-all hover:bg-primary/10"
                      >
                        <Link href={subItem.href} className="flex items-center gap-3">
                          <subItem.icon className="h-4 w-4 opacity-70" />
                          <span className="text-sm font-medium lowercase first-letter:uppercase">{subItem.label}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        );
      })}
    </SidebarMenu>
  );
}
