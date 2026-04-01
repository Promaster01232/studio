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
import { LogOut, Loader2, Search, Bell, ShieldAlert, Activity, Zap, CreditCard, Crown, ShieldCheck, User } from "lucide-react";
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
import { AnimatePresence, motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { collection, query, where, onSnapshot, doc } from "firebase/firestore";

const ADMIN_EMAILS = [
  'enterspaceindia@gmail.com', 
  'piyushkumrsingh23399@gmail.com',
  'nyayasahayakhelp@gmail.com'
];

const PUBLIC_DASHBOARD_ROUTES = ['/dashboard', '/dashboard/research-analytics'];

function Header({ userProfile, unreadCount, isAdmin }: { userProfile: any, unreadCount: number, isAdmin: boolean }) {
    const isElite = isAdmin || userProfile?.subscriptionType?.includes('unlimited');
    const isLimited = userProfile && !isElite;
    
    return (
        <header className={cn(
            "sticky top-0 z-[40] flex h-16 items-center gap-4 border-b px-4 sm:px-8 transition-all",
            "bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60"
        )}>
            <div className="flex items-center gap-2 md:hidden">
                <SidebarTrigger className="h-10 w-10 rounded-xl hover:bg-primary/5 active:scale-95 transition-all" />
                <Logo className="h-10 w-10 p-0 shadow-none border-none bg-transparent" priority={true} />
            </div>
            
            <div className="flex-1 flex items-center justify-end md:justify-start">
                {!userProfile?.isBlocked && (
                    <SearchDialog>
                        <div className="w-full max-w-md cursor-pointer group active:scale-[0.99] transition-transform">
                            <div className="hidden md:flex items-center w-full pl-10 pr-16 h-11 font-black text-[10px] uppercase tracking-widest text-muted-foreground/60 rounded-xl bg-muted/40 border border-primary/5 group-hover:border-primary/20 group-hover:bg-muted/60 transition-all shadow-sm relative">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                <span className="tracking-[0.1em]">Forensic search hub...</span>
                                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                    <kbd className="pointer-none inline-flex h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[9px] font-black text-muted-foreground opacity-100 shadow-sm">
                                        <span className="text-[10px]">⌘</span>K
                                    </kbd>
                                </div>
                            </div>
                            <div className="md:hidden">
                                <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-primary/5 bg-muted/40 active:scale-95 transition-all">
                                    <Search className="h-4 w-4 text-muted-foreground" />
                                </Button>
                            </div>
                        </div>
                    </SearchDialog>
                )}
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
                {isLimited && (
                    <Button asChild size="sm" variant="outline" className="hidden lg:flex h-10 px-5 rounded-xl border-primary/20 text-primary hover:bg-primary/5 font-black text-[9px] uppercase tracking-widest gap-2 active:scale-95 transition-all group overflow-hidden relative">
                        <Link href="/dashboard/billing">
                            <span className="relative z-10 flex items-center gap-2">
                                <Zap className="h-3.5 w-3.5 animate-pulse" />
                                Upgrade Clearance
                            </span>
                            <div className="absolute inset-0 bg-primary/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        </Link>
                    </Button>
                )}

                <div className="hidden lg:flex items-center gap-2 mr-2 px-3 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-left">
                    <Activity className="h-3 w-3 text-green-500 animate-pulse" />
                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-primary/60">{isAdmin ? "Root Protocol: Active" : "System: Active"}</span>
                </div>

                {!userProfile?.isBlocked && userProfile && (
                    <>
                        <SosDialog>
                            <Button variant="destructive" size="sm" className="font-black gap-2 animate-pulse px-3 sm:px-5 h-10 sm:h-11 text-[8px] sm:text-[9px] rounded-xl shadow-xl shadow-destructive/20 active:scale-95 transition-all">
                                <ShieldAlert className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                <span className="hidden xs:inline tracking-[0.2em] uppercase">SOS</span>
                            </Button>
                        </SosDialog>
                        
                        <div className="flex items-center gap-1 sm:gap-2 border-l pl-2 sm:pl-4 ml-1">
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-10 w-10 sm:h-11 sm:w-11 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-xl transition-all active:scale-95 relative group"
                                asChild
                            >
                                <Link href="/dashboard/notifications">
                                    <Bell className="h-4.5 w-4.5 sm:h-5 sm:w-5 group-hover:rotate-12 transition-transform" />
                                    {unreadCount > 0 && (
                                        <motion.span 
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute top-2.5 right-2.5 h-2 w-2 sm:h-2.5 sm:w-2.5 bg-red-500 rounded-full border-2 border-background shadow-sm"
                                        />
                                    )}
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
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  
  const [userProfile, setUserProfile] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  
  const profileUnsubscribeRef = useRef<(() => void) | null>(null);
  const notifUnsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (profileUnsubscribeRef.current) {
        profileUnsubscribeRef.current();
        profileUnsubscribeRef.current = null;
      }
      if (notifUnsubscribeRef.current) {
        notifUnsubscribeRef.current();
        notifUnsubscribeRef.current = null;
      }

      if (user) {
        const userDocRef = doc(firestore, "users", user.uid);
        profileUnsubscribeRef.current = onSnapshot(userDocRef, (userDoc) => {
            if (userDoc.exists()) {
              setUserProfile(userDoc.data());
            } else {
              if (pathname !== '/create-profile' && pathname !== '/login' && pathname !== '/register') {
                router.replace('/create-profile');
              }
            }
            setProfileLoading(false);
        });

        const notifRef = collection(firestore, "notifications");
        const q = query(notifRef, where("userId", "==", user.uid), where("isRead", "==", false));
        notifUnsubscribeRef.current = onSnapshot(q, (snap) => setUnreadCount(snap.size));

      } else {
        setProfileLoading(false);
        setUserProfile(null);
        setUnreadCount(0);
        if (!PUBLIC_DASHBOARD_ROUTES.includes(pathname)) router.replace('/login');
      }
    });

    return () => {
        unsubscribeAuth();
        if (profileUnsubscribeRef.current) profileUnsubscribeRef.current();
        if (notifUnsubscribeRef.current) notifUnsubscribeRef.current();
    };
  }, [auth, firestore, pathname, router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.replace('/login');
  };

  const showContent = isMounted && (!profileLoading || pathname === '/create-profile');
  const isAdmin = userProfile?.email && (ADMIN_EMAILS.includes(userProfile.email.toLowerCase()) || !!userProfile?.isAdmin);
  const isLimited = userProfile && !(isAdmin || userProfile?.subscriptionType?.includes('unlimited'));

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" className="border-r border-border glass bg-white/50 dark:bg-zinc-950/50">
        <SidebarHeader className="p-6 overflow-hidden">
          <Link href="/dashboard" className="flex items-center gap-4 transition-all hover:scale-105 active:scale-95 group-data-[collapsible=icon]:justify-center group">
            <Logo className="h-7 w-7 border-none shadow-none p-0" priority={true} />
            <div className="flex flex-col group-data-[collapsible=icon]:hidden text-left">
              <span className="text-xl font-black font-headline tracking-tighter bg-gradient-to-r from-primary via-accent to-blue-400 bg-clip-text text-transparent truncate">
                  Nyaya Sahayak
              </span>
              <span className="text-[8px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 leading-none mt-0.5">Forensic Terminal</span>
            </div>
          </Link>
        </SidebarHeader>
        <SidebarContent className="pt-2">
          <SidebarNav isAdmin={isAdmin} />
          {isLimited && !profileLoading && (
            <div className="px-4 py-6 group-data-[collapsible=icon]:hidden">
                <Card className="bg-primary/5 border-primary/10 rounded-[1.5rem] overflow-hidden group/upgrade hover:border-primary/30 transition-all shadow-lg">
                    <div className="p-5 space-y-4 text-left">
                        <div className="flex items-center gap-3">
                            <Zap className="h-4 w-4 text-primary animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Expansion</span>
                        </div>
                        <p className="text-[10px] font-medium text-muted-foreground leading-relaxed">Unlock unlimited forensic scans and institutional tools.</p>
                        <Button asChild size="sm" className="w-full h-10 font-black text-[9px] uppercase tracking-widest rounded-xl shadow-lg shadow-primary/30">
                            <Link href="/dashboard/billing">Upgrade Clearance</Link>
                        </Button>
                    </div>
                </Card>
            </div>
          )}
        </SidebarContent>
        <SidebarFooter className="p-4">
           {profileLoading ? <Skeleton className="h-10 w-full rounded-2xl" /> : userProfile ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start items-center gap-3 p-2 h-auto text-left group data-[state=collapsed]:w-10 data-[state=collapsed]:justify-center hover:bg-primary/5 rounded-2xl transition-all">
                  <div className="relative">
                      <Avatar className="h-10 w-10 border-2 border-background shadow-lg transition-transform group-hover:scale-105 rounded-xl">
                          <AvatarImage src={userProfile.photoURL} className="object-cover" />
                          <AvatarFallback className="font-black bg-primary/10 text-primary">{userProfile.firstName?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-0.5 -right-0.5 bg-green-500 h-3 w-3 rounded-full border-2 border-background shadow-sm group-data-[collapsible=icon]:hidden"></div>
                  </div>
                  <div className="flex-1 truncate group-data-[state=collapsed]:hidden text-left">
                    <div className="font-black text-sm truncate tracking-tighter text-foreground leading-tight">{userProfile.firstName} {userProfile.lastName}</div>
                    <div className="text-[10px] text-muted-foreground truncate font-bold opacity-60 uppercase tracking-widest">{userProfile.userType}</div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="end" className="w-64 mb-4 ml-4 p-3 rounded-[1.5rem] shadow-2xl glass border-primary/5">
                <DropdownMenuLabel className="px-2 pb-2 text-left">Registry Dossier</DropdownMenuLabel>
                <DropdownMenuItem asChild className="rounded-xl h-11 font-bold text-xs gap-3 mb-1 cursor-pointer">
                    <Link href="/dashboard/profile"><User className="h-4 w-4 opacity-40" /> My Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-2 opacity-5" />
                <DropdownMenuRadioGroup value={theme} onValueChange={(v) => setTheme(v as 'light' | 'dark')}>
                    <DropdownMenuRadioItem value="light" className="rounded-xl h-11 font-bold text-xs gap-3 cursor-pointer">Light Protocol</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="dark" className="rounded-xl h-11 font-bold text-xs gap-3 cursor-pointer">Dark Protocol</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
                <DropdownMenuSeparator className="my-2 opacity-5" />
                <DropdownMenuItem onClick={handleLogout} className="rounded-xl h-12 font-black text-[10px] uppercase tracking-widest text-destructive focus:bg-destructive/10 focus:text-destructive gap-3 cursor-pointer">
                    <LogOut className="h-4 w-4" /> Terminate Session
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
             <Button asChild className="w-full rounded-2xl h-12 font-black tracking-widest uppercase text-xs">
                <Link href="/login">Sign In</Link>
             </Button>
          )}
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="bg-background relative overflow-hidden">
        <Header userProfile={userProfile} unreadCount={unreadCount} isAdmin={isAdmin} />
        <main className="flex-1 overflow-y-auto custom-scrollbar relative">
            <AnimatePresence mode="wait">
                {showContent ? (
                    <motion.div key="dashboard-content" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.1 }} className="p-4 sm:p-10 min-h-[calc(100vh-64px)] flex flex-col">
                        <div className="flex-1">{children}</div>
                        <Footer />
                    </motion.div>
                ) : (
                    <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary opacity-20" /></div>
                )}
            </AnimatePresence>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
