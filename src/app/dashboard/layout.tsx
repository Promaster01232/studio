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
  const isChatPage = false; // This will be dynamic in a real app

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
        {!isChatPage && (
          <header className="flex h-16 shrink-0 items-center justify-between border-b bg-transparent px-4 md:px-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <Logo />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="icon" className="rounded-full">
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
              </Button>
            </div>
          </header>
        )}
        <main className="h-[calc(100vh-4rem)] flex flex-col overflow-y-auto bg-transparent data-[chat=true]:h-screen data-[chat=true]:p-0 p-4 md:p-6 lg:p-8" data-chat={isChatPage}>
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
