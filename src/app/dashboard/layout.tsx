import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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
  User,
  Settings,
  LogOut,
  Mic,
} from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { ReactNode } from "react";
import { SidebarNav } from "@/components/sidebar-nav";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarContent>
          <SidebarNav />
        </SidebarContent>
        <SidebarFooter>
          <div className="flex items-center gap-3">
             <Avatar className="size-8">
                <AvatarImage src="https://picsum.photos/seed/user/40/40" data-ai-hint="person face" alt="User" />
                <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="flex flex-col overflow-hidden">
                <span className="truncate text-sm font-medium text-sidebar-foreground">Piyush Kumar</span>
                <span className="truncate text-xs text-sidebar-foreground/70">Citizen</span>
            </div>
            <Button variant="ghost" size="icon" className="ml-auto text-sidebar-foreground/70 hover:text-sidebar-foreground">
                <LogOut />
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 items-center justify-between border-b bg-card px-4 md:px-6">
            <SidebarTrigger className="md:hidden" />
            <div className="hidden md:block">
              <h1 className="font-headline text-xl font-semibold">Welcome to AI Nyaya Mitra</h1>
            </div>
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon">
                    <Settings className="h-5 w-5" />
                    <span className="sr-only">Settings</span>
                </Button>
                <Avatar className="h-9 w-9">
                    <AvatarImage src="https://picsum.photos/seed/user/40/40" data-ai-hint="person face" alt="User" />
                    <AvatarFallback>U</AvatarFallback>
                </Avatar>
            </div>
        </header>
        <main className="flex-1 p-4 md:p-8">
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
