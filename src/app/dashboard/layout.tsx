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
import { LogOut, Loader2, Search, Bell, ShieldAlert, Activity, Zap, User, Command } from "lucide-react";
import { Logo } from "@/components/logo";
import { ReactNode, useEffect, useState, useRef, use } from "react";
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
            "sticky top-0 z-[40] flex h-16 sm:h-20 items-center gap-4 border-b px-4 sm:px-10 transition-all",
            "bg-background/80 backdrop-blur-3xl supports-[backdrop-filter]:bg-background/60"
        )}>
            <div className="flex items-center gap-3 md:hidden">
                <SidebarTrigger className="h-10 w-10 rounded-2xl hover:bg-primary/5 active:scale-95 transition-all shadow-sm border border-primary/5" />
                <Logo className="h-9 w-9 p-0 shadow-none border-none bg-transparent" priority={true} />
            </div>
            
            <div className="flex-1 flex items-center justify-end md:justify-start">
                {!userProfile?.isBlocked && (
                    <SearchDialog>
                        <div className="w-full max-w-lg cursor-pointer group active:scale-[0.99] transition-transform">
                            <div className="hidden md:flex items-center w-full pl-12 pr-20 h-12 font-black text-[11px] uppercase tracking-widest text-muted-foreground/60 rounded-2xl bg-muted/30 border border-primary/5 group-hover:border-primary/20 group-hover:bg-muted/50 transition-all shadow-inner relative text-left">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                <span className="tracking-[0.1em]">Execute Forensic Search...</span>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                                    <kbd className="pointer-none inline-flex h-6 select-none items-center gap-1.5 rounded-lg border bg-background px-2 font-mono text-[10px] font-black text-muted-foreground opacity-100 shadow-sm">
                                        <Command className="h-3 w-3" />K
                                    </kbd>
                                </div>
                            </div>
                            <div className="md:hidden">
                                <Button variant="outline" size="icon" className="h-10 w-10 rounded-2xl border-primary/5 bg-muted/30 active:scale-95 transition-all">
                                    <Search className="h-5 w-5 text-muted-foreground" />
                                </Button>
                            </div>
                        </div>
                    </SearchDialog>
                )}
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
                {isLimited && (
                    <Button asChild size="sm" className="hidden lg:flex h-11 px-6 rounded-2xl bg-primary text-white font-black text-[10px] uppercase tracking-widest gap-2 active:scale-95 transition-all shadow-xl shadow-primary/20 group overflow-hidden relative">
                        <Link href="/dashboard/billing">
                            <span className="relative z-10 flex items-center gap-2">
                                <Zap className="h-4 w-4 animate-pulse" />
                                Upgrade Clearance
                            </span>
                            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        </Link>
                    </Button>
                )}

                <div className="hidden lg:flex items-center gap-3 px-4 py-2 rounded-2xl bg-primary/5 border border-primary/10 text-left shadow-inner">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/80">{isAdmin ? "Root Protocol: Active" : "System Node: Active"}</span>
                </div>

                {!userProfile?.isBlocked && userProfile && (
                    <>
                        <SosDialog>
                            <Button variant="destructive" size="sm" className="font-black gap-2 animate-pulse px-3 sm:px-6 h-10 sm:h-12 text-[9px] sm:text-[10px] rounded-2xl shadow-xl shadow-destructive/30 active:scale-95 transition-all">
                                <ShieldAlert className="h-4 w-4 sm:h-5 sm:w-5" />
                                <span className="hidden xs:inline tracking-[0.2em] uppercase leading-none">SOS</span>
                            </Button>
                        </SosDialog>
                        
                        <div className="flex items-center gap-2 sm:gap-3 border-l border-primary/10 pl-2 sm:pl-6 ml-1 sm:ml-2">
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-2xl transition-all active:scale-95 relative group shadow-sm border border-primary/5"
                                asChild
                            >
                                <Link href="/dashboard/notifications">
                                    <Bell className="h-5 w-5 sm:h-6 sm:w-6 group-hover:rotate-12 transition-transform" />
                                    {unreadCount > 0 && (
                                        <motion.span 
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 h-2.5 w-2.5 sm:h-3 sm:w-3 bg-red-500 rounded-full border-2 border-background shadow-lg"
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

export default function DashboardLayout(props: { children: ReactNode, params: Promise<any> }) {
  const _params = use(props.params);
  const { children } = props;
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
      <Sidebar collapsible="icon" className="border-r border-primary/5 glass bg-white/50 dark:bg-zinc-950/50">
        <SidebarHeader className="p-8 overflow-hidden">
          <Link href="/dashboard" className="flex items-center gap-5 transition-all hover:scale-105 active:scale-95 group-data-[collapsible=icon]:justify-center group">
            <Logo className="h-10 w-10 border-none shadow-none p-0 bg-transparent" priority={true} />
            <div className="flex flex-col group-data-[collapsible=icon]:hidden text-left">
              <span className="text-2xl font-black font-headline tracking-tighter bg-gradient-to-r from-primary via-accent to-blue-400 bg-clip-text text-transparent truncate">
                  Nyaya Sahayak
              </span>
              <span className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 leading-none mt-1">Forensic Operating System</span>
            </div>
          </Link>
        </SidebarHeader>
        <SidebarContent className="pt-4 px-2">
          <SidebarNav isAdmin={isAdmin} />
          {isLimited && !profileLoading && (
            <div className="px-4 py-8 group-data-[collapsible=icon]:hidden">
                <Card className="bg-primary/5 border-primary/10 rounded-[2rem] overflow-hidden group/upgrade hover:border-primary/30 transition-all shadow-2xl shadow-primary/5">
                    <div className="p-6 space-y-5 text-left">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                <Zap className="h-4 w-4 animate-pulse" />
                            </div>
                            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">Upgrade Node</span>
                        </div>
                        <p className="text-[11px] font-medium text-muted-foreground leading-relaxed">Unlock unlimited forensic scans and institutional drafting terminals.</p>
                        <Button asChild size="sm" className="w-full h-11 font-black text-[10px] uppercase tracking-widest rounded-xl shadow-xl shadow-primary/30 text-center">
                            <Link href="/dashboard/billing">Sync Expansion</Link>
                        </Button>
                    </div>
                </Card>
            </div>
          )}
        </SidebarContent>
        <SidebarFooter className="p-6">
           {profileLoading ? <Skeleton className="h-12 w-full rounded-[1.2rem]" /> : userProfile ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start items-center gap-4 p-2.5 h-auto text-left group data-[state=collapsed]:w-12 data-[state=collapsed]:justify-center hover:bg-primary/5 rounded-[1.5rem] transition-all border border-transparent hover:border-primary/10 shadow-sm">
                  <div className="relative">
                      <Avatar className="h-11 w-11 border-2 border-background shadow-xl transition-all group-hover:scale-105 rounded-xl">
                          <AvatarImage src={userProfile.photoURL} className="object-cover" />
                          <AvatarFallback className="font-black bg-primary/10 text-primary">{userProfile.firstName?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-0.5 -right-0.5 bg-green-500 h-3.5 w-3.5 rounded-full border-2 border-background shadow-lg group-data-[collapsible=icon]:hidden"></div>
                  </div>
                  <div className="flex-1 truncate group-data-[state=collapsed]:hidden text-left">
                    <div className="font-black text-[13px] truncate tracking-tight text-foreground leading-tight uppercase">{userProfile.firstName} {userProfile.lastName}</div>
                    <div className="text-[9px] text-muted-foreground truncate font-black opacity-60 uppercase tracking-widest mt-0.5">{userProfile.userType}</div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="end" className="w-72 mb-6 ml-6 p-4 rounded-[2.5rem] shadow-3xl glass border-primary/10">
                <DropdownMenuLabel className="px-3 pb-3 text-left font-black uppercase text-[10px] tracking-widest text-muted-foreground/60">Registry Dossier</DropdownMenuLabel>
                <DropdownMenuItem asChild className="rounded-xl h-12 font-black text-[11px] uppercase tracking-widest gap-4 mb-1 cursor-pointer hover:bg-primary/5 transition-all">
                    <Link href="/dashboard/profile"><User className="h-5 w-5 text-primary opacity-60" /> My Identity</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-3 opacity-10" />
                <DropdownMenuRadioGroup value={theme} onValueChange={(v) => setTheme(v as 'light' | 'dark')}>
                    <DropdownMenuRadioItem value="light" className="rounded-xl h-12 font-black text-[11px] uppercase tracking-widest gap-4 cursor-pointer">Light Protocol</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="dark" className="rounded-xl h-12 font-black text-[11px] uppercase tracking-widest gap-4 cursor-pointer">Dark Protocol</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
                <DropdownMenuSeparator className="my-3 opacity-10" />
                <DropdownMenuItem onClick={handleLogout} className="rounded-xl h-14 font-black text-[11px] uppercase tracking-[0.2em] text-destructive focus:bg-destructive/10 focus:text-destructive gap-4 cursor-pointer transition-all">
                    <LogOut className="h-5 w-5" /> Terminate Node
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
             <Button asChild className="w-full rounded-[1.5rem] h-14 font-black tracking-widest uppercase text-xs shadow-xl shadow-primary/20">
                <Link href="/login">Initialize Session</Link>
             </Button>
          )}
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="bg-background relative overflow-hidden">
        <Header userProfile={userProfile} unreadCount={unreadCount} isAdmin={isAdmin} />
        <main className="flex-1 overflow-y-auto custom-scrollbar relative">
            <AnimatePresence mode="wait">
                {showContent ? (
                    <motion.div key="dashboard-content" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="p-4 sm:p-12 min-h-[calc(100vh-80px)] flex flex-col">
                        <div className="flex-1">{children}</div>
                        <Footer />
                    </motion.div>
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <div className="flex flex-col items-center gap-6 opacity-20">
                            <Loader2 className="h-12 w-12 animate-spin text-primary" />
                            <p className="font-black text-[10px] uppercase tracking-[0.5em]">Synchronizing Registry...</p>
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}