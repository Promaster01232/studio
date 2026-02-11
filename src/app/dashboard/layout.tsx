
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
import { Search, Bell, ShieldAlert, MessageSquare, User, LogOut, SunMoon, Languages, Loader2 } from "lucide-react";
import { Logo } from "@/components/logo";
import { ReactNode, useEffect, useState } from "react";
import { SidebarNav } from "@/components/sidebar-nav";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Link from "next/link";
import { SosDialog } from "@/components/sos-dialog";
import { SearchDialog } from "@/components/search-dialog";
import { usePathname, useRouter } from "next/navigation";
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
import { useAuth, useFirestore } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";

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
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<{firstName: string, lastName: string, email: string} | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (auth === null || firestore === null) {
      // Firebase is still initializing
      return;
    }
    
    if (!auth.currentUser) {
      // Not logged in, redirect
      if(pathname !== '/login' && pathname !== '/create-profile') {
        router.push('/login');
      }
      setProfileLoading(false);
      return;
    }

    const userDocRef = doc(firestore, "users", auth.currentUser.uid);
    getDoc(userDocRef).then(userDoc => {
      if (userDoc.exists()) {
        setUserProfile(userDoc.data() as {firstName: string; lastName: string; email: string});
      } else {
        // Logged in but no profile, redirect to create one
        if (pathname !== '/create-profile') {
            router.push('/create-profile');
        }
      }
      setProfileLoading(false);
    });

  }, [auth, firestore, router, pathname]);

  const handleLogout = async () => {
    if (auth) {
        await signOut(auth);
        router.push('/login');
    }
  };

  const getAvatarFallback = () => {
      if (!userProfile) return "";
      const firstNameInitial = userProfile.firstName ? userProfile.firstName.charAt(0) : "";
      const lastNameInitial = userProfile.lastName ? userProfile.lastName.charAt(0) : "";
      return `${firstNameInitial}${lastNameInitial}`;
  }
  
  const showContent = isMounted && (!profileLoading || pathname === '/create-profile');

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
              {showContent && userProfile ? (
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
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-2">
                      <div className="font-semibold p-2">Messages</div>
                      <div className="space-y-1 text-center p-4 text-sm text-muted-foreground">
                        No recent messages.
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
                              <AvatarFallback>{getAvatarFallback()}</AvatarFallback>
                          </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>
                          <div className="font-semibold">{userProfile.firstName} {userProfile.lastName}</div>
                          <div className="text-xs text-muted-foreground">{userProfile.email}</div>
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
                      <DropdownMenuItem onClick={handleLogout}>
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
          {showContent ? children : (
            <div className="flex flex-1 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
