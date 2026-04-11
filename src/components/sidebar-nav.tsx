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
  UserPlus,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const navGroups = [
  {
    label: "home",
    items: [
      { title: "dashboard", icon: Home, href: "/dashboard" },
    ]
  },
  {
    label: "ai tools",
    items: [
      { title: "record voice", icon: Mic, href: "/dashboard/narrate" },
      { title: "scan documents", icon: FileSearch, href: "/dashboard/document-intelligence" },
      { title: "write documents", icon: FileText, href: "/dashboard/document-generator" },
      { title: "create bonds", icon: FileSignature, href: "/dashboard/bond-generator" },
      { title: "check chance", icon: BrainCircuit, href: "/dashboard/strength-analyzer" },
      { title: "court helper", icon: Gavel, href: "/dashboard/court-assistant" },
      { title: "check evidence", icon: ShieldCheck, href: "/dashboard/evidence-audit" },
      { title: "bail helper", icon: Scale, href: "/dashboard/bail-estimator" },
      { title: "law linker", icon: Zap, href: "/dashboard/statutory-linker" },
      { title: "check contract", icon: FileCheck, href: "/dashboard/contract-auditor" },
    ]
  },
  {
    label: "case hub",
    items: [
      { title: "my cases", icon: FolderSearch, href: "/dashboard/my-cases" },
      { title: "free help", icon: HandHelping, href: "/dashboard/ngo-legal-aid" },
      { title: "learn law", icon: Library, href: "/dashboard/learn" },
      { title: "help guides", icon: Newspaper, href: "/dashboard/police-guide" },
      { title: "community", icon: Users, href: "/dashboard/research-analytics" },
    ]
  },
  {
    label: "for business",
    items: [
      { title: "business hub", icon: Building, href: "/dashboard/business-msme" },
      { title: "legal fees", icon: ReceiptText, href: "/dashboard/finances-billing" },
    ]
  },
  {
    label: "account",
    items: [
      { title: "my profile", icon: User, href: "/dashboard/profile" },
      { title: "my plan", icon: CreditCard, href: "/dashboard/billing" },
      { title: "contact help", icon: Headset, href: "/dashboard/support" },
    ]
  }
];

const adminItems = [
  { title: "users", icon: ShieldAlert, href: "/dashboard/management-console" },
  { title: "verify pros", icon: UserPlus, href: "/dashboard/advocate-verification" },
];

export function SidebarNav({ isAdmin = false, isElite = false }: { isAdmin?: boolean, isElite?: boolean }) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    return pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
  };

  return (
    <div className="space-y-6">
      {navGroups.map((group) => (
        <SidebarGroup key={group.label} className="p-0">
          <SidebarGroupLabel className="px-4 text-[9px] font-black uppercase tracking-[0.3em] text-primary/40 mb-2 lowercase">
            {group.label}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1 px-2">
              {group.items.map((item) => {
                const active = isActive(item.href);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      tooltip={item.title}
                      className={cn(
                        "h-10 px-3 transition-all duration-300 rounded-xl group/btn",
                        active 
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 font-black" 
                          : "text-gray-400 hover:bg-white/5 hover:text-white"
                      )}
                    >
                      <Link href={item.href}>
                        <item.icon className={cn(
                          "h-4 w-4 shrink-0 transition-transform group-hover/btn:scale-110",
                          active ? "text-primary-foreground" : "text-gray-500 group-hover/btn:text-primary"
                        )} />
                        <span className="text-[11px] font-bold tracking-tight truncate lowercase">
                          {item.title}
                        </span>
                        {active && (
                          <motion.div 
                            layoutId="active-pill"
                            className="ml-auto h-1 w-1 rounded-full bg-white"
                          />
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}

      {isAdmin && (
        <SidebarGroup className="p-0 border-t border-white/5 pt-6 mt-6">
          <SidebarGroupLabel className="px-4 text-[9px] font-black uppercase tracking-[0.3em] text-red-500/60 mb-2 lowercase">
            admin registry
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1 px-2">
              {adminItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      className={cn(
                        "h-10 px-3 transition-all duration-300 rounded-xl",
                        active 
                          ? "bg-red-600 text-white shadow-lg shadow-red-600/20" 
                          : "text-gray-400 hover:bg-red-500/5 hover:text-red-400"
                      )}
                    >
                      <Link href={item.href}>
                        <item.icon className="h-4 w-4" />
                        <span className="text-[11px] font-black lowercase tracking-tight">{item.title}</span>
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
