
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
  Lock,
  Scale,
  ShieldCheck,
  Cookie,
  ShieldAlert,
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
    title: "home",
    icon: Home,
    href: "/dashboard",
    items: [],
  },
  {
    title: "ai tools",
    icon: BrainCircuit,
    isFeature: true,
    items: [
      { href: "/dashboard/narrate", icon: Mic, label: "record voice" },
      { href: "/dashboard/document-intelligence", icon: FileSearch, label: "scan documents" },
      { href: "/dashboard/document-generator", icon: FileText, label: "write documents" },
      { href: "/dashboard/bond-generator", icon: FileSignature, label: "create bonds" },
      { href: "/dashboard/strength-analyzer", icon: BrainCircuit, label: "check chance" },
      { href: "/dashboard/court-assistant", icon: Gavel, label: "court helper" },
      { href: "/dashboard/evidence-audit", icon: ShieldCheck, label: "check evidence" },
      { href: "/dashboard/bail-estimator", icon: Scale, label: "bail helper" },
      { href: "/dashboard/statutory-linker", icon: Zap, label: "law linker" },
      { href: "/dashboard/contract-auditor", icon: FileCheck, label: "check contract" },
    ],
  },
  {
    title: "case hub",
    icon: Library,
    items: [
      { href: "/dashboard/my-cases", icon: FolderKanban, label: "my cases", isFeature: true },
      { href: "/dashboard/ngo-legal-aid", icon: HeartHandshake, label: "free help" },
      { href: "/dashboard/learn", icon: Library, label: "learn law" },
      { href: "/dashboard/police-guide", icon: Shield, label: "help guides" },
      { href: "/dashboard/research-analytics", icon: Newspaper, label: "community" },
    ],
  },
  {
    title: "for business",
    icon: Landmark,
    isFeature: true,
    items: [
      { href: "/dashboard/business-msme", icon: Briefcase, label: "business hub" },
      { href: "/dashboard/finances-billing", icon: Landmark, label: "legal fees" },
    ],
  },
  {
    title: "rules",
    icon: Scale,
    items: [
      { href: "/dashboard/terms", icon: FileText, label: "terms of use" },
      { href: "/dashboard/privacy", icon: ShieldCheck, label: "privacy policy" },
      { href: "/dashboard/refund-policy", icon: CreditCard, label: "refund rules" },
      { href: "/dashboard/cookie-policy", icon: Cookie, label: "cookie policy" },
      { href: "/dashboard/disclaimer", icon: ShieldAlert, label: "disclaimer" },
    ],
  },
  {
    title: "account",
    icon: CircleUserRound,
    items: [
      { href: "/dashboard/profile", icon: CircleUserRound, label: "my profile", isFeature: true },
      { href: "/dashboard/billing", icon: CreditCard, label: "my plan", isFeature: true },
      { href: "/dashboard/support", icon: LifeBuoy, label: "contact help" },
    ],
  },
  {
    title: "admin",
    icon: Settings,
    isAdminOnly: true,
    items: [
      { href: "/dashboard/management-console", icon: Shield, label: "users" },
      { href: "/dashboard/advocate-verification", icon: Gavel, label: "lawyers" },
    ],
  },
];

export function SidebarNav({ isAdmin = false, isGuest = false }: { isAdmin?: boolean, isGuest?: boolean }) {
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
                  {isGuest && item.isFeature && <Lock className="h-3 w-3 opacity-30 mr-2" />}
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
                          {isGuest && subItem.isFeature && <Lock className="h-2.5 w-2.5 opacity-20" />}
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
