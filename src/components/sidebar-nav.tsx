
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
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", icon: Home, label: "Dashboard", tooltip: "Dashboard" },
  { href: "/dashboard/my-cases", icon: Briefcase, label: "Case Management", tooltip: "Case Management" },
  { href: "/dashboard/profile", icon: CircleUserRound, label: "My Profile", tooltip: "My Profile" },
  { href: "/dashboard/learn", icon: Library, label: "Resources", tooltip: "Resources" },
  { href: "/dashboard/strength-analyzer", icon: BrainCircuit, label: "AI Tools", tooltip: "AI Tools" },
  { href: "/dashboard/lawyer-connect", icon: Users, label: "Lawyer Connect", tooltip: "Lawyer Connect" },
];


export function SidebarNav() {
  const pathname = usePathname();

  const checkActive = (href: string) => {
    if (href === '/dashboard') {
        return pathname === href;
    }
    if (href === '/dashboard/strength-analyzer') {
        const aiToolsPaths = [
            "/dashboard/strength-analyzer",
            "/dashboard/narrate",
            "/dashboard/document-intelligence",
            "/dashboard/document-generator",
            "/dashboard/bond-generator",
            "/dashboard/court-assistant",
        ];
        return aiToolsPaths.some(p => pathname.startsWith(p));
    }
    return pathname.startsWith(href);
  };

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              asChild
              isActive={checkActive(item.href)}
              tooltip={{ children: item.tooltip }}
            >
              <Link href={item.href}>
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 group-data-[active=true]:h-6 bg-sidebar-primary rounded-r-full transition-all duration-300"></div>
                <item.icon />
                <span>{item.label}</span>
              </Link>
            </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
