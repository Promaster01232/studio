'use client';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarInset,
  SidebarFooter,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, SunMoon, Languages, Loader2, User, Search, Bell, ShieldAlert, AlertTriangle, ShieldX } from "lucide-react";
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
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { cn } from "@/lib/utils";
import { SosDialog } from "@/components/sos-dialog";
import { SearchDialog } from "@/components/search-dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const languages: { code: Language, name: string }[] = [
    { code: "en", name: "English" },
    { code: "hi", name: "Hindi" },
    { code: "mr", name: "Marathi" },
    { code: "ta", name: "Tamil" },
    { code: "bn", name: "Bangla" },
];


function Header({ userProfile }: { userProfile: any }) {
    return (
        <header className={cn(
            "sticky top-0 z-10 flex h-16 items-center gap-2 border-b px-4 md:px-6 transition-all",
            "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        )}>
            <div className="flex items-center gap-2 md:hidden">
                <SidebarTrigger className="h-9 w-9" />
                <Logo className="h-8 w-8" />
            </div>
            
            <div className="flex-1 flex items-center justify-end md:justify-start">
                {!userProfile?.isBlocked && (
                    <SearchDialog>
                        <Button variant="outline" className="w-9 h-9 p-0 md:w-full md:max-w-xs md:px-3 md:justify-start gap-2 text-muted-foreground rounded-full md:rounded-lg">
                            <Search className="h-4 w-4" />
                            <span className="hidden md:inline font-bold text-[11px]">Search...</span>
                        </Button>
                    </SearchDialog>
                )}
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
                {!userProfile?.isBlocked && (
                    <>
                        <SosDialog>
                            <Button variant="destructive" size="sm" className="font-bold gap-1 animate-pulse px-2 sm:px-3 h-9 text-[11px] rounded-full sm:rounded-lg">
                                <ShieldAlert className="h-4 w-4" />
                                <span className="hidden sm:inline">SOS</span>
                            </Button>
                        </SosDialog>
                        
                        <div className="flex items-center gap-0.5 sm:gap-1 border-l pl-1 sm:pl-3 ml-1">
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-9 w-9 text-muted-foreground hover:text-primary rounded-full"
                                asChild
                            >
                                <Link href="/dashboard/notifications">
                                    <Bell className="h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    </>
                )}
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
  const [userProfile, setUserProfile] = useState<{firstName: string, lastName: string, email: string, photoURL?: string, isAdmin?: boolean, isBlocked?: boolean, securityStatus?: string, flaggedAt?: any, emailVerified?: boolean} | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setProfileLoading(true);
        const userDocRef = doc(firestore, "users", user.uid);
        
        // Sync emailVerified status directly from Auth source
        await updateDoc(userDocRef, { emailVerified: user.emailVerified }).catch(e => {
            // Silently skip if document doesn't exist yet (handled in onboarding)
        });

        const unsubProfile = onSnapshot(userDocRef, (userDoc) => {
            if (userDoc.exists()) {
              setUserProfile(userDoc.data() as any);
            } else {
              if (pathname !== '/create-profile' && pathname !== '/login' && pathname !== '/register') {
                router.push('/create-profile');
              }
            }
            setProfileLoading(false);
        }, (error) => {
            console.error("Error fetching user profile:", error);
            setProfileLoading(false);
        });

        return () => unsubProfile();
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

  const isSuspended = userProfile?.isBlocked === true;
  const isAdmin = userProfile?.email === 'enterspaceindia@gmail.com' || !!userProfile?.isAdmin;
  const showContent = isMounted && (!profileLoading || pathname === '/create-profile');

  if (showContent && isSuspended) {
      return (
        <div className="flex h-screen items-center justify-center bg-muted/30 p-4">
            <Card className="max-w-md w-full border-destructive/20 shadow-2xl overflow-hidden bg-card">
                <div className="bg-destructive/10 p-8 flex justify-center border-b border-destructive/10">
                    <ShieldX className="h-20 w-20 text-destructive animate-pulse" />
                </div>
                <CardHeader className="text-center pt-8">
                    <CardTitle className="text-2xl font-black tracking-tight text-destructive flex items-center justify-center gap-2">
                        Access Revoked
                    </CardTitle>
                    <CardDescription className="text-sm font-medium pt-2 text-muted-foreground">
                        Your account has been deactivated by the system administrator. You no longer have access to Nyaya Sahayak tools or data.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pb-8">
                    <div className="p-4 bg-muted/50 rounded-xl flex items-start gap-3 border border-border">
                        <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                        <p className="text-xs font-medium text-left leading-relaxed text-muted-foreground">
                            If you believe this is an error, please contact our administrative team at <span className="font-bold text-primary">enterspaceindia@gmail.com</span> to request a restoration audit.
                        </p>
                    </div>
                    <Button onClick={handleLogout} variant="outline" className="w-full h-12 font-bold rounded-xl active:scale-95 transition-all">
                        <LogOut className="mr-2 h-4 w-4" /> Sign out
                    </Button>
                </CardContent>
            </Card>
        </div>
      );
  }

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" className="border-r border-border">
        <SidebarHeader className="p-4 overflow-hidden">
          <Link href="/dashboard" className="flex items-center gap-3 transition-opacity hover:opacity-80 group-data-[collapsible=icon]:justify-center">
            <Logo className="h-10 w-10" />
            <span className="text-xl font-black font-headline tracking-tighter bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-animated-gradient bg-[200%_auto] truncate group-data-[collapsible=icon]:hidden">
                Nyaya Sahayak
            </span>
          </Link>
        </SidebarHeader>
        <SidebarContent className="pt-0">
          <SidebarNav isAdmin={isAdmin} />
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
                  {userProfile.photoURL ? (
                    <Avatar className="h-9 w-9 border border-primary/10 shadow-sm transition-transform group-hover:scale-105">
                        <AvatarImage src={userProfile.photoURL} alt={userProfile.firstName} className="object-cover" />
                    </Avatar>
                  ) : (
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                        <User className="h-4 w-4" />
                    </div>
                  )}
                  <div className="flex-1 truncate group-data-[state=collapsed]:hidden">
                    <div className="font-bold text-sm truncate tracking-tighter text-foreground">{userProfile.firstName} {userProfile.lastName}</div>
                    <div className="text-[10px] text-muted-foreground truncate font-bold opacity-60">{userProfile.email}</div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="start" className="w-56 mb-2 ml-2 p-2 rounded-2xl shadow-2xl border border-border bg-card">
                <DropdownMenuLabel className="pb-3 pt-2">
                    <div className="font-bold text-base font-headline tracking-tighter text-foreground">{userProfile.firstName} {userProfile.lastName}</div>
                    <div className="text-[10px] text-muted-foreground font-bold truncate opacity-60">{userProfile.email}</div>
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
                    <DropdownMenuSubContent className="rounded-xl p-1 shadow-2xl border border-border bg-card">
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
                    <DropdownMenuSubContent className="rounded-xl p-1 shadow-2xl border border-border bg-card max-h-[300px] overflow-y-auto">
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
             <div className="p-2">
                <Button asChild className="w-full rounded-xl h-11 font-bold shadow-lg shadow-primary/20">
                    <Link href="/login">Sign In</Link>
                </Button>
             </div>
          )}
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="bg-background">
        <div className="flex flex-col h-screen overflow-hidden">
          <Header userProfile={userProfile} />
          <main
            className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8"
          >
            {showContent ? children : (
              <div className="flex flex-1 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}