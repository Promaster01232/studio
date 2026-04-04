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
    title: "AI Tools",
    icon: BrainCircuit,
    isFeature: true,
    items: [
      { href: "/dashboard/narrate", icon: Mic, label: "Record Case" },
      { href: "/dashboard/document-intelligence", icon: FileSearch, label: "Analyze Document" },
      { href: "/dashboard/document-generator", icon: FileText, label: "Draft Documents" },
      { href: "/dashboard/bond-generator", icon: FileSignature, label: "Generate Bonds" },
      { href: "/dashboard/strength-analyzer", icon: BrainCircuit, label: "Case Strength" },
      { href: "/dashboard/court-assistant", icon: Gavel, label: "Court Assistant" },
    ],
  },
  {
    title: "Resources",
    icon: Library,
    items: [
      { href: "/dashboard/my-cases", icon: FolderKanban, label: "My Cases", isFeature: true },
      { href: "/dashboard/ngo-legal-aid", icon: HeartHandshake, label: "Legal Aid" },
      { href: "/dashboard/learn", icon: Library, label: "Knowledge Base" },
      { href: "/dashboard/police-guide", icon: Shield, label: "Guides" },
      { href: "/dashboard/research-analytics", icon: Newspaper, label: "Feed" },
    ],
  },
  {
    title: "Business",
    icon: Landmark,
    isFeature: true,
    items: [
      { href: "/dashboard/business-msme", icon: Briefcase, label: "MSME Support" },
      { href: "/dashboard/finances-billing", icon: Landmark, label: "Fees & Billing" },
    ],
  },
  {
    title: "Legal Protocols",
    icon: Scale,
    items: [
      { href: "/dashboard/terms", icon: FileText, label: "Terms & Conditions" },
      { href: "/dashboard/privacy", icon: ShieldCheck, label: "Privacy Protocol" },
      { href: "/dashboard/refund-policy", icon: CreditCard, label: "Refund Policy" },
      { href: "/dashboard/cookie-policy", icon: Cookie, label: "Cookie Policy" },
      { href: "/dashboard/disclaimer", icon: ShieldAlert, label: "Legal Disclaimer" },
    ],
  },
  {
    title: "Account",
    icon: CircleUserRound,
    items: [
      { href: "/dashboard/profile", icon: CircleUserRound, label: "Profile", isFeature: true },
      { href: "/dashboard/billing", icon: CreditCard, label: "Billing", isFeature: true },
      { href: "/dashboard/support", icon: LifeBuoy, label: "Support" },
    ],
  },
  {
    title: "Admin",
    icon: Settings,
    isAdminOnly: true,
    items: [
      { href: "/dashboard/management-console", icon: Shield, label: "Control Panel" },
      { href: "/dashboard/advocate-verification", icon: Gavel, label: "Advocate Audit" },
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
                  <span className="font-bold">{item.title}</span>
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
                  <span className="font-bold flex-1 text-left">{item.title}</span>
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
                          <span className="text-sm font-medium flex-1">{subItem.label}</span>
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
