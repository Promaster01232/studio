
'use client';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarInset,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, SunMoon, Languages, Loader2, User } from "lucide-react";
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
      setProfileLoading(true);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userDocRef = doc(firestore, "users", user.uid);
        getDoc(userDocRef)
          .then((userDoc) => {
            if (userDoc.exists()) {
              setUserProfile(userDoc.data() as {firstName: string; lastName: string; email: string});
            } else {
              if (pathname !== '/create-profile') {
                router.push('/create-profile');
              }
            }
            setProfileLoading(false);
          })
          .catch((error) => {
            console.error("Error fetching user profile:", error);
            setProfileLoading(false);
          });
      } else {
        // Not logged in, treat as guest
        setProfileLoading(false);
        setUserProfile(null);
      }
    });

    return () => unsubscribe();
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
  
  const showContent = isMounted && (!profileLoading || pathname === '/create-profile' || !auth);

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="p-4">
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
                <Button variant="ghost" className="w-full justify-start items-center gap-3 p-2 h-auto text-left">
                  <Avatar className="h-9 w-9">
                      <AvatarFallback>{getAvatarFallback()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 truncate">
                    <div className="font-semibold text-sm truncate">{userProfile.firstName} {userProfile.lastName}</div>
                    <div className="text-xs text-muted-foreground truncate">{userProfile.email}</div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start" className="w-56 mb-2 ml-2">
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
          ) : (
             <Button asChild className="m-2">
                <Link href="/login">Login / Sign Up</Link>
              </Button>
          )}
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <main
          className="h-screen flex flex-col overflow-y-auto bg-transparent data-[chat=true]:h-screen data-[chat=true]:p-0 p-4 md:p-6 lg:p-8"
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
