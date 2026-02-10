import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Search, Bell, ShieldAlert } from "lucide-react";
import { Logo } from "@/components/logo";
import { ReactNode } from "react";
import { SidebarNav } from "@/components/sidebar-nav";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          {/* Logo is now in the main header */}
        </SidebarHeader>
        <SidebarContent className="pt-10">
          <SidebarNav />
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between border-b bg-background px-4 md:px-6">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <Logo />
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" className="rounded-full">
              <Search className="h-5 w-5 text-muted-foreground" />
              <span className="sr-only">Search</span>
            </Button>
            <Button variant="destructive">
              <ShieldAlert className="mr-2 h-4 w-4" />
              SOS
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full relative">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <span className="sr-only">Notifications</span>
              <span className="absolute top-2 right-2 flex h-2 w-2">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
            </Button>
            <Avatar className="h-9 w-9">
              <AvatarImage src="https://picsum.photos/seed/user/40/40" data-ai-hint="person face" alt="User" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </div>
        </header>
        <main className="h-[calc(100vh-4rem)] flex flex-col overflow-y-auto p-4 md:p-6 lg:p-8 bg-muted/30">
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
