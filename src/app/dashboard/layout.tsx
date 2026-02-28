
'use client';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarInset,
  SidebarFooter,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, SunMoon, Languages, Loader2, User, Search, Bell, MessageSquare, ShieldAlert } from "lucide-react";
import { Logo } from "@/components/logo";
import { ReactNode, useEffect, useState } from "react";
import { SidebarNav } from "@/components/sidebar-nav";
import Link from "next/link";
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
import { onAuthStateChanged, signOut } from "firebase/auth";
import { cn } from "@/lib/utils";
import { SosDialog } from "@/components/sos-dialog";
import { SearchDialog } from "@/components/search-dialog";
import { ChatListDialog } from "@/components/chat-list-dialog";
import { useToast } from "@/hooks/use-toast";

const languages: { code: Language, name: string }[] = [
    { code: "en", name: "English" },
    { code: "hi", name: "Hindi" },
    { code: "mr", name: "Marathi" },
    { code: "ta", name: "Tamil" },
    { code: "bn", name: "Bangla" },
];


function Header() {
    const { state } = useSidebar();
    const { toast } = useToast();
    
    return (
        <header className={cn(
            "sticky top-0 z-10 flex h-16 items-center gap-4 border-b px-6 transition-all",
            "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        )}>
            <div className="flex items-center gap-2 md:hidden">
                <SidebarTrigger />
                <Logo />
            </div>
            <div className={cn(
                "hidden md:flex items-center gap-2 transition-all duration-200 ease-in-out",
                state === 'expanded' && "opacity-0 -translate-x-4"
                )}>
                <SidebarTrigger />
            </div>
            <div className="flex-1">
                <SearchDialog>
                    <Button variant="outline" className="w-full max-w-xs justify-start gap-2 text-muted-foreground">
                        <Search className="h-4 w-4" />
                        Search...
                    </Button>
                </SearchDialog>
            </div>
            <div className="flex items-center gap-3">
                <SosDialog>
                    <Button variant="destructive" size="sm" className="font-bold gap-2 animate-pulse hidden sm:flex">
                        <ShieldAlert className="h-4 w-4" />
                        SOS
                    </Button>
                </SosDialog>
                
                <div className="flex items-center gap-1 border-l pl-3 ml-1">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-muted-foreground hover:text-primary"
                        onClick={() => toast({ title: "Notifications", description: "You have no new notifications." })}
                    >
                        <Bell className="h-5 w-5" />
                    </Button>

                    <ChatListDialog>
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                            <MessageSquare className="h-5 w-5" />
                        </Button>
                    </ChatListDialog>
                </div>
            </div>
        </header>
    );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<{firstName: string, lastName: string, email: string, photoURL?: string} | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setProfileLoading(true);
        const userDocRef = doc(firestore, "users", user.uid);
        getDoc(userDocRef)
          .then((userDoc) => {
            if (userDoc.exists()) {
              setUserProfile(userDoc.data() as {firstName: string; lastName: string; email: string; photoURL?: string});
            } else {
              if (pathname !== '/create-profile' && pathname !== '/login' && pathname !== '/register') {
                router.push('/create-profile');
              }
            }
          })
          .catch((error) => {
            console.error("Error fetching user profile:", error);
          })
          .finally(() => {
            setProfileLoading(false);
          });
      } else {
        setProfileLoading(false);
        setUserProfile(null);
      }
    });

    return () => unsubscribe();
  }, [auth, firestore, router, pathname]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const showContent = isMounted && (!profileLoading || pathname === '/create-profile');

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarContent className="pt-0">
          <SidebarNav />
        </SidebarContent>
        <SidebarFooter>
           {profileLoading ? (
            <div className="flex items-center gap-3 p-2">
              <Skeleton className="h-9 w-9 rounded-full" />
              <div className="flex-1 space-y-1">
                 <Skeleton className="h-3 w-20" />
                 <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ) : userProfile ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start items-center gap-3 p-2 h-auto text-left group data-[state=collapsed]:w-10 data-[state=collapsed]:justify-center hover:bg-primary/5 rounded-xl transition-all">
                  <Avatar className="h-9 w-9 border border-primary/10 shadow-sm transition-transform group-hover:scale-105">
                      <AvatarImage src={userProfile.photoURL} alt={userProfile.firstName} className="object-cover" />
                      <AvatarFallback className="bg-primary/5 text-primary flex items-center justify-center">
                          <User className="h-4 w-4" />
                      </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 truncate group-data-[state=collapsed]:hidden">
                    <div className="font-bold text-sm truncate tracking-tight text-foreground">{userProfile.firstName} {userProfile.lastName}</div>
                    <div className="text-[10px] text-muted-foreground truncate uppercase font-black tracking-widest">{userProfile.email}</div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="start" className="w-56 mb-2 ml-2 p-2 rounded-2xl shadow-2xl border-primary/5">
                <DropdownMenuLabel className="pb-3 pt-2">
                    <div className="font-black text-base font-headline tracking-tighter text-foreground">{userProfile.firstName} {userProfile.lastName}</div>
                    <div className="text-[10px] text-muted-foreground uppercase font-black tracking-widest truncate">{userProfile.email}</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="mb-2" />
                <DropdownMenuItem asChild className="rounded-xl h-10 font-bold focus:bg-primary/5 focus:text-primary mb-1">
                    <Link href="/dashboard/profile">
                        <User className="mr-3 h-4 w-4" />
                        <span>My Profile</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="rounded-xl h-10 font-bold focus:bg-primary/5 focus:text-primary mb-1">
                        <SunMoon className="mr-3 h-4 w-4" />
                        <span>Appearance</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent className="rounded-xl p-1 shadow-2xl border-primary/5">
                        <DropdownMenuRadioGroup value={theme} onValueChange={(v) => setTheme(v as 'light' | 'dark')}>
                            <DropdownMenuRadioItem value="light" className="rounded-lg h-9 font-bold">Light</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="dark" className="rounded-lg h-9 font-bold">Dark</DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                    </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="rounded-xl h-10 font-bold focus:bg-primary/5 focus:text-primary mb-1">
                        <Languages className="mr-3 h-4 w-4" />
                        <span>Language</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent className="rounded-xl p-1 shadow-2xl border-primary/5 max-h-[300px] overflow-y-auto">
                        <DropdownMenuRadioGroup value={language} onValueChange={(value) => setLanguage(value as Language)}>
                            {languages.map((lang) => (
                                <DropdownMenuRadioItem key={lang.code} value={lang.code} className="rounded-lg h-9 font-bold">{lang.name}</DropdownMenuRadioItem>
                            ))}
                        </DropdownMenuRadioGroup>
                    </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuSeparator className="my-2" />
                <DropdownMenuItem onClick={handleLogout} className="rounded-xl h-10 font-bold text-destructive focus:bg-destructive/5 focus:text-destructive">
                    <LogOut className="mr-3 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
             <Button asChild className="m-2 rounded-xl h-11 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20">
                <Link href="/login">Sign In / Register</Link>
              </Button>
          )}
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col h-screen">
          <Header />
          <main
            className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8"
          >
            {showContent ? children : (
              <div className="flex flex-1 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            )}
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
