"use client";

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import {
  Home,
  Mic,
  FileSearch,
  FileText,
  FileSignature,
  BrainCircuit,
  Gavel,
  ShieldCheck,
  Scale,
  Zap,
  FileCheck,
  FolderSearch,
  HandHelping,
  Library,
  Newspaper,
  Users,
  Building,
  ReceiptText,
  User,
  CreditCard,
  Headset,
  ShieldAlert,
  UserPlus
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { cn } from "@/lib/utils";

interface NavItem {
  title: string;
  icon: any;
  href: string;
  isElite?: boolean;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    label: "Home",
    items: [
      { title: "Dashboard", icon: Home, href: "/dashboard" },
    ]
  },
  {
    label: "AI Tools",
    items: [
      { title: "Record Voice", icon: Mic, href: "/dashboard/narrate" },
      { title: "Scan Documents", icon: FileSearch, href: "/dashboard/document-intelligence" },
      { title: "Write Documents", icon: FileText, href: "/dashboard/document-generator" },
      { title: "Create Bonds", icon: FileSignature, href: "/dashboard/bond-generator" },
      { title: "Check Chance", icon: BrainCircuit, href: "/dashboard/strength-analyzer" },
      { title: "Court Helper", icon: Gavel, href: "/dashboard/court-assistant" },
      // Elite Features (Activated upon upgrade)
      { title: "Check Evidence", icon: ShieldCheck, href: "/dashboard/evidence-audit", isElite: true },
      { title: "Bail Helper", icon: Scale, href: "/dashboard/bail-estimator", isElite: true },
      { title: "Law Linker", icon: Zap, href: "/dashboard/statutory-linker", isElite: true },
      { title: "Check Contract", icon: FileCheck, href: "/dashboard/contract-auditor", isElite: true },
    ]
  },
  {
    label: "Case Hub",
    items: [
      { title: "My Cases", icon: FolderSearch, href: "/dashboard/my-cases" },
      { title: "Free Help", icon: HandHelping, href: "/dashboard/ngo-legal-aid" },
      { title: "Learn Law", icon: Library, href: "/dashboard/learn" },
      { title: "Help Guides", icon: Newspaper, href: "/dashboard/police-guide" },
      { title: "Community", icon: Users, href: "/dashboard/research-analytics" },
    ]
  },
  {
    label: "For Business",
    items: [
      { title: "Business Hub", icon: Building, href: "/dashboard/business-msme" },
      { title: "Legal Fees", icon: ReceiptText, href: "/dashboard/finances-billing" },
    ]
  },
  {
    label: "Account",
    items: [
      { title: "My Profile", icon: User, href: "/dashboard/profile" },
      { title: "My Plan", icon: CreditCard, href: "/dashboard/billing" },
      { title: "Contact Help", icon: Headset, href: "/dashboard/support" },
    ]
  }
];

const adminItems = [
  { title: "Users", icon: ShieldAlert, href: "/dashboard/management-console" },
  { title: "Verify Professionals", icon: UserPlus, href: "/dashboard/advocate-verification" },
];

export function SidebarNav({ isAdmin = false, isElite = false }: { isAdmin?: boolean, isElite?: boolean }) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    return pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
  };

  return (
    <div className="space-y-4 text-left">
      {navGroups.map((group) => {
        // Institutional Filter: Hide elite modules from non-upgraded citizens
        const visibleItems = group.items.filter(item => !item.isElite || isElite);
        
        if (visibleItems.length === 0) return null;

        return (
          <SidebarGroup key={group.label} className="p-0 text-left">
            <SidebarGroupLabel className="px-4 text-[9px] font-bold tracking-tight text-primary/40 mb-1 text-left uppercase">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent className="text-left">
              <SidebarMenu className="gap-0.5 px-2 text-left">
                {visibleItems.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={active}
                        tooltip={item.title}
                        className={cn(
                          "h-9 px-3 transition-colors rounded-lg group/btn text-left",
                          active 
                            ? "bg-primary text-primary-foreground shadow-sm font-bold" 
                            : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
                        )}
                      >
                        <Link href={item.href} className="flex items-center gap-3 text-left">
                          <item.icon className={cn(
                            "h-4 w-4 shrink-0",
                            active ? "text-primary-foreground" : "text-muted-foreground group-hover/btn:text-primary"
                          )} />
                          <span className="text-[11px] font-bold tracking-tight truncate text-left">
                            {item.title}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        );
      })}

      {isAdmin && (
        <SidebarGroup className="p-0 border-t border-border/5 pt-4 mt-4 text-left">
          <SidebarGroupLabel className="px-4 text-[9px] font-bold tracking-tight text-red-500/60 mb-1 text-left uppercase">
            Admin Registry
          </SidebarGroupLabel>
          <SidebarGroupContent className="text-left">
            <SidebarMenu className="gap-0.5 px-2 text-left">
              {adminItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      className={cn(
                        "h-9 px-3 transition-colors rounded-lg text-left",
                        active 
                          ? "bg-red-600 text-white shadow-sm" 
                          : "text-muted-foreground hover:bg-red-500/5 hover:text-red-600"
                      )}
                    >
                      <Link href={item.href} className="flex items-center gap-3 text-left">
                        <item.icon className="h-4 w-4" />
                        <span className="text-[11px] font-bold tracking-tight text-left">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      )}
    </div>
  );
}