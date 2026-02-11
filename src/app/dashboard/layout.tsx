
'use client';

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
import { Search, Bell, ShieldAlert, MessageSquare, User, LogOut, SunMoon, Languages } from "lucide-react";
import { Logo } from "@/components/logo";
import { ReactNode, useEffect, useState } from "react";
import { SidebarNav } from "@/components/sidebar-nav";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Link from "next/link";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { SosDialog } from "@/components/sos-dialog";
import { SearchDialog } from "@/components/search-dialog";
import { usePathname } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/theme-provider";
import { useLanguage, type Language } from "@/components/language-provider";

const recentChats = [
  {
    id: 1,
    name: "Anjali Sharma",
    message: "The yet a free cow thate ham...",
    image: PlaceHolderImages.find((img) => img.id === "lawyer2"),
    unread: 2,
  },
  {
    id: 2,
    name: "Siddharth Rao",
    message: "You: Youra sharma your ou the...",
    image: PlaceHolderImages.find((img) => img.id === "lawyer1"),
    unread: 0,
  },
  {
    id: 3,
    name: "Priya Singh",
    message: "Wes sce but he may have the...",
    image: PlaceHolderImages.find((img) => img.id === "lawyer5"),
    unread: 1,
  },
];

const user = {
    name: 'Rajesh Kumar',
    email: 'rajesh.k@nyaaysathi.com',
    avatar: PlaceHolderImages.find(img => img.id === 'lawyer1'),
};

const languages: { code: Language, name: string }[] = [
    { code: "en", name: "English" },
    { code: "hi", name: "Hindi" },
    { code: "mr", name: "Marathi" },
    { code: "ta", name: "Tamil" },
    { code: "bn", name: "Bangla" },
];


export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isChatPage = pathname.includes('/chat');
  const [isMounted, setIsMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();

  useEffect(() => {
    setIsMounted(true);
  }, []);


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
              <SidebarTrigger className="h-8 w-8 rounded-md bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent/80" />
              <Logo />
            </div>
            <div className="flex items-center gap-2">
              {isMounted ? (
                <>
                  <SearchDialog>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <Search className="h-5 w-5 text-muted-foreground" />
                      <span className="sr-only">Search</span>
                    </Button>
                  </SearchDialog>
                  <SosDialog>
                    <Button variant="destructive">
                      <ShieldAlert className="mr-0 h-4 w-4 md:mr-2" />
                      <span className="hidden md:inline">SOS</span>
                    </Button>
                  </SosDialog>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full relative"
                      >
                        <MessageSquare className="h-5 w-5 text-muted-foreground" />
                        <span className="sr-only">Messages</span>
                        <span className="absolute top-1 right-1 flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-2">
                      <div className="font-semibold p-2">Messages</div>
                      <div className="space-y-1">
                        {recentChats.map((chat) => (
                          <Link
                            href={`/dashboard/lawyer-connect/${chat.id}/chat`}
                            key={chat.id}
                            className="block"
                          >
                            <div className="flex items-center gap-3 p-2 rounded-md hover:bg-accent cursor-pointer">
                              {chat.image && (
                                <Avatar className="h-10 w-10">
                                  <AvatarImage
                                    src={chat.image.imageUrl}
                                    alt={chat.name}
                                    data-ai-hint={chat.image.imageHint}
                                  />
                                  <AvatarFallback>
                                    {chat.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                              )}
                              <div className="flex-1 overflow-hidden">
                                <div className="font-medium truncate">
                                  {chat.name}
                                </div>
                                <p className="text-xs text-muted-foreground truncate">
                                  {chat.message}
                                </p>
                              </div>
                              {chat.unread > 0 && (
                                <span className="bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                  {chat.unread}
                                </span>
                              )}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full relative"
                  >
                    <Bell className="h-5 w-5 text-muted-foreground" />
                    <span className="sr-only">Notifications</span>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-full">
                          <Avatar className="h-8 w-8">
                              {user.avatar && (
                                <AvatarImage src={user.avatar.imageUrl} alt={user.name} data-ai-hint={user.avatar.imageHint || ''} />
                              )}
                              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>
                          <div className="font-semibold">{user.name}</div>
                          <div className="text-xs text-muted-foreground">{user.email}</div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                          <Link href="/dashboard/profile">
                              <User className="mr-2 h-4 w-4" />
                              <span>Profile</span>
                          </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSub>
                          <DropdownMenuSubTrigger>
                              <SunMoon className="mr-2 h-4 w-4" />
                              <span>Theme</span>
                          </DropdownMenuSubTrigger>
                          <DropdownMenuSubContent>
                              <DropdownMenuRadioGroup value={theme} onValueChange={(v) => setTheme(v as 'light' | 'dark')}>
                                  <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
                                  <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
                              </DropdownMenuRadioGroup>
                          </DropdownMenuSubContent>
                      </DropdownMenuSub>
                      <DropdownMenuSub>
                          <DropdownMenuSubTrigger>
                              <Languages className="mr-2 h-4 w-4" />
                              <span>Language</span>
                          </DropdownMenuSubTrigger>
                          <DropdownMenuSubContent>
                              <DropdownMenuRadioGroup value={language} onValueChange={(value) => setLanguage(value as Language)}>
                                  {languages.map((lang) => (
                                      <DropdownMenuRadioItem key={lang.code} value={lang.code}>{lang.name}</DropdownMenuRadioItem>
                                  ))}
                              </DropdownMenuRadioGroup>
                          </DropdownMenuSubContent>
                      </DropdownMenuSub>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-10 w-20 rounded-md" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </>
              )}
            </div>
          </header>
        )}
        <main
          className="h-[calc(100vh-4rem)] flex flex-col overflow-y-auto bg-transparent data-[chat=true]:h-screen data-[chat=true]:p-0 p-4 md:p-6 lg:p-8"
          data-chat={isChatPage}
        >
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
