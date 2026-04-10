
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
  Scale,
  ShieldCheck,
  Zap,
  FileCheck,
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
    title: "Home",
    icon: Home,
    href: "/dashboard",
    items: [],
  },
  {
    title: "AI tools",
    icon: BrainCircuit,
    isFeature: true,
    items: [
      { href: "/dashboard/narrate", icon: Mic, label: "Record voice" },
      { href: "/dashboard/document-intelligence", icon: FileSearch, label: "Scan documents" },
      { href: "/dashboard/document-generator", icon: FileText, label: "Write documents" },
      { href: "/dashboard/bond-generator", icon: FileSignature, label: "Create bonds" },
      { href: "/dashboard/strength-analyzer", icon: BrainCircuit, label: "Check chance" },
      { href: "/dashboard/court-assistant", icon: Gavel, label: "Court helper" },
      { href: "/dashboard/evidence-audit", icon: ShieldCheck, label: "Check evidence", isPremium: true },
      { href: "/dashboard/bail-estimator", icon: Scale, label: "Bail helper", isPremium: true },
      { href: "/dashboard/statutory-linker", icon: Zap, label: "Law linker", isPremium: true },
      { href: "/dashboard/contract-auditor", icon: FileCheck, label: "Check contract", isPremium: true },
    ],
  },
  {
    title: "Case hub",
    icon: Library,
    items: [
      { href: "/dashboard/my-cases", icon: FolderKanban, label: "My cases", isFeature: true },
      { href: "/dashboard/ngo-legal-aid", icon: HeartHandshake, label: "Free help" },
      { href: "/dashboard/learn", icon: Library, label: "Learn law" },
      { href: "/dashboard/police-guide", icon: Shield, label: "Help guides" },
      { href: "/dashboard/research-analytics", icon: Newspaper, label: "Community" },
    ],
  },
  {
    title: "For business",
    icon: Landmark,
    isFeature: true,
    items: [
      { href: "/dashboard/business-msme", icon: Briefcase, label: "Business hub" },
      { href: "/dashboard/finances-billing", icon: Landmark, label: "Legal fees" },
    ],
  },
  {
    title: "Account",
    icon: CircleUserRound,
    items: [
      { href: "/dashboard/profile", icon: CircleUserRound, label: "My profile", isFeature: true },
      { href: "/dashboard/billing", icon: CreditCard, label: "My plan", isFeature: true },
      { href: "/dashboard/support", icon: LifeBuoy, label: "Contact help" },
    ],
  },
  {
    title: "Admin",
    icon: Settings,
    isAdminOnly: true,
    items: [
      { href: "/dashboard/management-console", icon: Shield, label: "Users" },
      { href: "/dashboard/advocate-verification", icon: Gavel, label: "Lawyers" },
    ],
  },
];

export function SidebarNav({ isAdmin = false, isElite = false }: { isAdmin?: boolean, isElite?: boolean }) {
  const pathname = usePathname();

  const isSubItemActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + "/");
  };

  const isGroupActive = (items: { href: string }[]) => {
    return items.some((item) => isSubItemActive(item.href));
  };

  const filteredItems = navigationItems
    .filter(item => !item.isAdminOnly || isAdmin)
    .map(item => {
      if (item.title === "AI tools" && !isElite) {
        return {
          ...item,
          items: item.items.filter(sub => !sub.isPremium)
        };
      }
      return item;
    });

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
                  <span className="font-black text-[11px]">{item.title}</span>
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
                  <span className="font-black text-[11px] flex-1 text-left">{item.title}</span>
                  <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub className="ml-4 mt-1 border-l-2 border-primary/10 gap-1 pl-2">
                  {item.items.map((subItem: any) => (
                    <SidebarMenuSubItem key={subItem.label}>
                      <SidebarMenuSubButton
                        asChild
                        isActive={isSubItemActive(subItem.href)}
                        className="h-9 px-3 rounded-md transition-all hover:bg-primary/10"
                      >
                        <Link href={subItem.href} className="flex items-center gap-3">
                          <subItem.icon className="h-4 w-4 opacity-70" />
                          <span className="text-[11px] font-bold tracking-tight flex-1">{subItem.label}</span>
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
