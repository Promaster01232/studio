
"use client";

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarInset,
  SidebarFooter,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LogOut, Loader2, Search, ShieldAlert, Zap, User, LogIn, Lock, Activity, ChevronRight, ShieldX } from "lucide-react";
import { Logo } from "@/components/logo";
import { ReactNode, useEffect, useState, useRef } from "react";
import { SidebarNav } from "@/components/sidebar-nav";
import { Footer } from "@/components/footer";
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
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/theme-provider";
import { useAuth, useFirestore } from "@/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { cn } from "@/lib/utils";
import { SosDialog } from "@/components/sos-dialog";
import { SearchDialog } from "@/components/search-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { onSnapshot, doc } from "firebase/firestore";
import { FloatingHub } from "@/components/floating-hub";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError, type SecurityRuleContext } from "@/firebase/errors";

const ADMIN_EMAILS = [
  'enterspaceindia@gmail.com', 
  'piyushkumrsingh23399@gmail.com',
  'nyayasahayakhelp@gmail.com'
];

const PUBLIC_DASHBOARD_ROUTES = [
  '/dashboard',
  '/dashboard/research-analytics',
  '/dashboard/learn',
  '/dashboard/police-guide',
  '/dashboard/about',
  '/dashboard/terms',
  '/dashboard/privacy',
  '/dashboard/cookie-policy',
  '/dashboard/disclaimer',
  '/dashboard/contact',
];

function Header({ userProfile, isAdmin }: { userProfile: any, isAdmin: boolean }) {
    const isElite = isAdmin || userProfile?.subscriptionType?.startsWith('unlimited');
    const isLimited = userProfile && !isElite;
    
    return (
        <header className={cn(
            "sticky top-0 z-[40] flex h-14 items-center gap-4 border-b px-4 sm:px-6 transition-all",
            "bg-background/90 backdrop-blur-xl"
        )}>
            <div className="flex items-center gap-3 md:hidden">
                <SidebarTrigger className="h-9 w-9 rounded-xl hover:bg-primary/5 border border-primary/5" />
                <Logo className="h-8 w-8 p-0 shadow-none border-none bg-transparent" priority={true} />
            </div>
            
            <div className="flex-1 flex items-center justify-end md:justify-start">
                <SearchDialog>
                    <div className="w-full max-w-md cursor-pointer group transition-all">
                        <div className="hidden md:flex items-center w-full pl-10 pr-12 h-9 font-bold text-[10px] tracking-widest text-muted-foreground/50 rounded-xl bg-muted/20 border border-primary/5 group-hover:border-primary/20 transition-all relative text-left">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            <span>Search registry...</span>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                <kbd className="h-5 rounded border bg-background px-1.5 font-mono text-[9px] font-black text-muted-foreground opacity-100 shadow-sm">
                                    ⌘K
                                </kbd>
                            </div>
                        </div>
                        <div className="md:hidden">
                            <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl border-primary/5 bg-muted/20">
                                <Search className="h-4 w-4 text-muted-foreground" />
                            </Button>
                        </div>
                    </div>
                </SearchDialog>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
                {!userProfile ? (
                    <div className="flex items-center gap-2">
                        <Button asChild variant="ghost" size="sm" className="h-9 px-4 font-bold text-[10px] rounded-xl hover:bg-primary/5">
                            <Link href="/login">Login</Link>
                        </Button>
                        <Button asChild size="sm" className="h-9 px-5 font-black text-[10px] rounded-xl shadow-lg active:scale-95 transition-all">
                            <Link href="/register">
                                <LogIn className="mr-1.5 h-3.5 w-3.5" /> Register
                            </Link>
                        </Button>
                    </div>
                ) : (
                    <>
                        {isLimited && (
                            <Button asChild size="sm" className="hidden lg:flex h-9 px-5 rounded-xl bg-primary text-white font-black text-[9px] gap-2 shadow-lg active:scale-95 transition-all">
                                <Link href="/dashboard/billing">
                                    <Zap className="h-3" />
                                    Upgrade
                                </Link>
                            </Button>
                        )}

                        {!userProfile?.isBlocked && (
                            <>
                                <SosDialog>
                                    <Button variant="destructive" size="sm" className="font-black gap-2 px-3 h-9 text-[9px] rounded-xl shadow-lg active:scale-95 transition-all">
                                        <ShieldAlert className="h-4 w-4" />
                                        <span className="hidden xs:inline tracking-wider">SOS</span>
                                    </Button>
                                </SosDialog>
                                
                                <div className="flex items-center gap-2 border-l border-primary/10 pl-3 ml-1">
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-9 w-9 rounded-xl border border-transparent hover:border-primary/5 hover:bg-primary/5 overflow-hidden p-0"
                                        asChild
                                    >
                                        <Link href="/dashboard/profile">
                                            <Avatar className="h-7 w-7 border border-primary/10 shadow-sm">
                                                <AvatarImage src={userProfile.photoURL} className="object-cover" />
                                                <AvatarFallback className="font-black bg-primary/5 text-primary text-[10px]">
                                                    {userProfile.firstName?.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                        </Link>
                                    </Button>
                                </div>
                            </>
                        )}
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
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  
  const [userProfile, setUserProfile] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  
  const profileUnsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (profileUnsubscribeRef.current) {
        profileUnsubscribeRef.current();
        profileUnsubscribeRef.current = null;
      }

      if (user) {
        const userDocRef = doc(firestore, "users", user.uid);
        profileUnsubscribeRef.current = onSnapshot(userDocRef, 
            (userDoc) => {
                if (userDoc.exists()) {
                  setUserProfile(userDoc.data());
                } else {
                  setUserProfile(null);
                }
                setProfileLoading(false);
            },
            async (err) => {
                console.error("[STATUTORY GUARD] Profile listener denied:", err);
                setProfileLoading(false);
            }
        );
      } else {
        setProfileLoading(false);
        setUserProfile(null);
      }
    });

    return () => {
        unsubscribeAuth();
        if (profileUnsubscribeRef.current) profileUnsubscribeRef.current();
    };
  }, [auth, firestore]);

  useEffect(() => {
    if (!profileLoading) {
        if (!auth.currentUser) {
            const isPublic = PUBLIC_DASHBOARD_ROUTES.includes(pathname) || 
                             pathname.startsWith('/dashboard/learn/') || 
                             pathname.startsWith('/dashboard/police-guide/') ||
                             pathname.startsWith('/dashboard/research-analytics');
            
            const isProtectedFeature = !isPublic || pathname === '/dashboard/profile';
            
            if (isProtectedFeature && pathname.startsWith('/dashboard/')) {
                router.replace('/login');
            }
        } else if (!userProfile && pathname !== '/create-profile' && !pathname.startsWith('/login') && !pathname.startsWith('/register')) {
            router.replace('/create-profile');
        }
    }
  }, [auth.currentUser, profileLoading, pathname, router, userProfile]);

  const handleLogout = async () => {
    await signOut(auth);
    router.replace('/login');
  };

  const showContent = isMounted && (!profileLoading || pathname === '/create-profile');
  const isAdmin = userProfile?.email && (ADMIN_EMAILS.includes(userProfile.email.toLowerCase()) || !!userProfile?.isAdmin);
  const isElite = isAdmin || userProfile?.subscriptionType?.startsWith('unlimited');
  const isUpgraded = isAdmin || (userProfile?.subscriptionType && userProfile.subscriptionType !== 'free');

  if (userProfile?.isBlocked) {
      return (
          <div className="flex h-screen w-full flex-col items-center justify-center bg-background p-6 text-center">
              <div className="bg-destructive/10 p-10 rounded-[3rem] mb-8 border border-destructive/20 shadow-inner">
                  <ShieldX className="h-24 w-24 text-destructive" />
              </div>
              <h1 className="text-4xl font-black font-headline tracking-tighter uppercase mb-4">Access restricted</h1>
              <p className="text-muted-foreground max-md font-medium leading-relaxed mb-10">
                  Your identity has been suspended following a statutory forensic audit. Please contact root authority for restoration protocols.
              </p>
              <div className="flex gap-4">
                  <Button onClick={handleLogout} variant="outline" className="h-12 px-10 font-bold rounded-xl border-primary/10">Terminate session</Button>
                  <Button asChild className="h-12 px-10 font-black text-[10px] tracking-widest rounded-xl shadow-xl shadow-primary/20">
                      <Link href="/dashboard/contact">Contact support</Link>
                  </Button>
              </div>
          </div>
      );
  }

  if (userProfile?.isBlocked) {
      return (
          <div className="flex h-screen w-full flex-col items-center justify-center bg-background p-6 text-center">
              <div className="bg-destructive/10 p-10 rounded-[3rem] mb-8 border border-destructive/20 shadow-inner">
                  <ShieldX className="h-24 w-24 text-destructive" />
              </div>
              <h1 className="text-4xl font-black font-headline tracking-tighter uppercase mb-4">Node Access Restricted</h1>
              <p className="text-muted-foreground max-w-md font-medium leading-relaxed mb-10">
                  Your identity node has been suspended following a statutory forensic audit. Please contact root authority for restoration protocols.
              </p>
              <div className="flex gap-4">
                  <Button onClick={handleLogout} variant="outline" className="h-12 px-10 font-bold rounded-xl border-primary/10">Terminate Session</Button>
                  <Button asChild className="h-12 px-10 font-black uppercase text-[10px] tracking-widest rounded-xl shadow-xl shadow-primary/20">
                      <Link href="/dashboard/contact">Contact Support</Link>
                  </Button>
              </div>
          </div>
      );
  }

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" className="border-r border-primary/5 glass">
        <SidebarHeader className="p-4 mb-1 border-b border-primary/5">
          <Link href="/dashboard" className="flex items-center gap-3 transition-all hover:opacity-80 active:scale-95 group-data-[collapsible=icon]:justify-center group">
            <Logo className="h-8 w-8 border-none shadow-none p-0 bg-transparent" priority={true} />
            <div className="flex flex-col group-data-[state=collapsed]:hidden text-left min-w-0">
              <span className="text-lg font-black font-headline tracking-tighter text-foreground leading-none">
                  Nyaya Sahayak
              </span>
            </div>
          </Link>
        </SidebarHeader>
        <SidebarContent className="pt-2 px-2">
          <SidebarNav isAdmin={isAdmin} isElite={isElite} />
          {!isUpgraded && !profileLoading && (
            <div className="px-3 py-4 group-data-[collapsible=icon]:hidden">
                <Card className="bg-primary/5 border-primary/5 rounded-2xl overflow-hidden shadow-sm">
                    <div className="p-4 space-y-3 text-left">
                        <div className="flex items-center gap-2">
                            <Zap className="h-3.5 w-3.5 text-primary" />
                            <span className="text-[9px] font-black text-primary">Upgrade access</span>
                        </div>
                        <p className="text-[9px] font-medium text-muted-foreground leading-relaxed">Unlock elite forensic tools.</p>
                        <Button asChild size="sm" className="w-full h-8 font-black text-[9px] rounded-xl shadow-lg text-center">
                            <Link href="/dashboard/billing">View plans</Link>
                        </Button>
                    </div>
                </Card>
            </div>
          )}
        </SidebarContent>
        <SidebarFooter className="p-4">
           {profileLoading ? <Skeleton className="h-10 w-full rounded-xl" /> : userProfile ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start items-center gap-3 p-2 h-auto text-left group data-[state=collapsed]:w-10 data-[state=collapsed]:justify-center hover:bg-primary/5 rounded-xl transition-all" silent>
                  <Avatar className="h-8 w-8 border border-background shadow-md rounded-lg">
                      <AvatarImage src={userProfile.photoURL} className="object-cover" />
                      <AvatarFallback className="font-black bg-primary/5 text-primary text-[10px]">{userProfile.firstName?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 truncate group-data-[state=collapsed]:hidden text-left">
                    <div className="font-black text-xs truncate tracking-tight text-foreground leading-tight">{userProfile.firstName}</div>
                    <div className="text-[8px] text-muted-foreground truncate font-bold uppercase mt-0.5">{userProfile.userType}</div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="end" className="w-64 mb-4 ml-4 p-3 rounded-2xl shadow-3xl glass border-primary/10">
                <DropdownMenuLabel className="px-2 pb-2 text-left font-black text-[9px] text-muted-foreground/50">My account</DropdownMenuLabel>
                <DropdownMenuItem asChild className="rounded-lg h-10 font-bold text-[10px] gap-3 mb-1 cursor-pointer">
                    <Link href="/dashboard/profile"><User className="h-4 w-4 text-primary opacity-60" /> Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-2 opacity-5" />
                <DropdownMenuRadioGroup value={theme} onValueChange={(v) => setTheme(v as 'light' | 'dark')}>
                    <DropdownMenuRadioItem value="light" className="rounded-lg h-10 font-bold text-[10px] gap-3 cursor-pointer">Light mode</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="dark" className="rounded-lg h-10 font-bold text-[10px] gap-3 cursor-pointer">Dark mode</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
                <DropdownMenuSeparator className="my-2 opacity-5" />
                <DropdownMenuItem onClick={handleLogout} className="rounded-lg h-12 font-black text-[10px] text-destructive focus:text-destructive focus:bg-destructive/10 gap-3 cursor-pointer transition-all">
                    <LogOut className="h-4 w-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
             <Button asChild className="w-full rounded-xl h-12 font-black tracking-widest text-[10px] shadow-lg">
                <Link href="/login">Sign in</Link>
             </Button>
          )}
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="bg-background relative overflow-hidden">
        <Header userProfile={userProfile} isAdmin={isAdmin} />
        <main className="flex-1 overflow-y-auto custom-scrollbar relative">
            <AnimatePresence mode="wait">
                {showContent ? (
                    <motion.div key="dashboard-content" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.2 }} className="p-2 sm:p-4 min-h-[calc(100vh-64px)] flex flex-col">
                        <div className="flex-1">{children}</div>
                        <Footer />
                    </motion.div>
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <div className="relative">
                            <Loader2 className="h-10 w-10 animate-spin text-primary opacity-10" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Activity className="h-4 w-4 text-primary opacity-20 animate-pulse" />
                            </div>
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </main>
        <FloatingHub />
      </SidebarInset>
    </SidebarProvider>
  );
}
