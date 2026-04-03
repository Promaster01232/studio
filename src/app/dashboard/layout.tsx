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
import { LogOut, Loader2, Search, Bell, ShieldAlert, Activity, Zap, User } from "lucide-react";
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
import { FloatingHub } from "@/components/floating-hub";

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
            "sticky top-0 z-[40] flex h-14 sm:h-16 items-center gap-4 border-b px-4 sm:px-8 transition-all",
            "bg-background/90 backdrop-blur-xl"
        )}>
            <div className="flex items-center gap-3 md:hidden">
                <SidebarTrigger className="h-9 w-9 rounded-xl hover:bg-primary/5 border border-primary/5" />
                <Logo className="h-8 w-8 p-0 shadow-none border-none bg-transparent" priority={true} />
            </div>
            
            <div className="flex-1 flex items-center justify-end md:justify-start">
                {!userProfile?.isBlocked && (
                    <SearchDialog>
                        <div className="w-full max-w-md cursor-pointer group transition-all">
                            <div className="hidden md:flex items-center w-full pl-10 pr-12 h-10 font-bold text-[10px] uppercase tracking-widest text-muted-foreground/50 rounded-xl bg-muted/20 border border-primary/5 group-hover:border-primary/20 transition-all relative text-left">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                <span>Forensic search...</span>
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
                )}
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
                {isLimited && (
                    <Button asChild size="sm" className="hidden lg:flex h-9 px-5 rounded-xl bg-primary text-white font-black text-[9px] uppercase tracking-widest gap-2 shadow-lg active:scale-95 transition-all">
                        <Link href="/dashboard/billing">
                            <Zap className="h-3 w-3" />
                            Upgrade
                        </Link>
                    </Button>
                )}

                <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-xl bg-primary/5 border border-primary/10">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-primary/80">{isAdmin ? "Root" : "System"} Node</span>
                </div>

                {!userProfile?.isBlocked && userProfile && (
                    <>
                        <SosDialog>
                            <Button variant="destructive" size="sm" className="font-black gap-2 px-3 h-9 sm:h-10 text-[9px] rounded-xl shadow-lg active:scale-95 transition-all">
                                <ShieldAlert className="h-4 w-4" />
                                <span className="hidden xs:inline tracking-wider">SOS</span>
                            </Button>
                        </SosDialog>
                        
                        <div className="flex items-center gap-2 border-l border-primary/10 pl-3 ml-1">
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-9 w-9 sm:h-10 sm:w-10 text-muted-foreground hover:text-primary rounded-xl relative group border border-transparent hover:border-primary/5"
                                asChild
                            >
                                <Link href="/dashboard/notifications">
                                    <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                                    {unreadCount > 0 && (
                                        <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-background" />
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
  // Unwrap dynamic props for Next.js 15 compliance
  use(props.params);

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
        profileUnsubscribeRef.current = onSnapshot(userDocRef, 
            (userDoc) => {
                if (userDoc.exists()) {
                  setUserProfile(userDoc.data());
                } else {
                  if (pathname !== '/create-profile' && pathname !== '/login' && pathname !== '/register') {
                    router.replace('/create-profile');
                  }
                }
                setProfileLoading(false);
            },
            (err) => {
                console.warn("[FIREBASE] Profile snapshot denied.", err.message);
                setProfileLoading(false);
            }
        );

        const notifRef = collection(firestore, "notifications");
        const q = query(notifRef, where("userId", "==", user.uid), where("isRead", "==", false));
        notifUnsubscribeRef.current = onSnapshot(q, 
            (snap) => setUnreadCount(snap.size),
            (err) => console.warn("[FIREBASE] Notifications snapshot denied.", err.message)
        );

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
      <Sidebar collapsible="icon" className="border-r border-primary/5 glass">
        <SidebarHeader className="p-5 mb-1 border-b border-primary/5">
          <Link href="/dashboard" className="flex items-center gap-3 transition-all hover:opacity-80 active:scale-95 group-data-[collapsible=icon]:justify-center group">
            <Logo className="h-8 w-8 border-none shadow-none p-0 bg-transparent" priority={true} />
            <div className="flex flex-col group-data-[state=collapsed]:hidden text-left min-w-0">
              <span className="text-lg font-black font-headline tracking-tighter text-foreground leading-none">
                  Nyaya Sahayak
              </span>
              <span className="text-[6px] font-bold uppercase tracking-[0.3em] text-muted-foreground/40 leading-none mt-1 truncate">
                  Forensic OS
              </span>
            </div>
          </Link>
        </SidebarHeader>
        <SidebarContent className="pt-2 px-2">
          <SidebarNav isAdmin={isAdmin} />
          {isLimited && !profileLoading && (
            <div className="px-3 py-6 group-data-[collapsible=icon]:hidden">
                <Card className="bg-primary/5 border-primary/5 rounded-2xl overflow-hidden shadow-sm">
                    <div className="p-5 space-y-4 text-left">
                        <div className="flex items-center gap-2">
                            <Zap className="h-3.5 w-3.5 text-primary" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-primary">Upgrade Node</span>
                        </div>
                        <p className="text-[9px] font-medium text-muted-foreground leading-relaxed">Unlock advanced forensic scans and terminals.</p>
                        <Button asChild size="sm" className="w-full h-9 font-black text-[9px] uppercase tracking-widest rounded-xl shadow-lg text-center">
                            <Link href="/dashboard/billing">Sync Expansion</Link>
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
                <Button variant="ghost" className="w-full justify-start items-center gap-3 p-2 h-auto text-left group data-[state=collapsed]:w-10 data-[state=collapsed]:justify-center hover:bg-primary/5 rounded-xl transition-all">
                  <Avatar className="h-9 w-9 border border-background shadow-md rounded-lg">
                      <AvatarImage src={userProfile.photoURL} className="object-cover" />
                      <AvatarFallback className="font-black bg-primary/5 text-primary text-xs">{userProfile.firstName?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 truncate group-data-[state=collapsed]:hidden text-left">
                    <div className="font-black text-xs truncate tracking-tight text-foreground leading-tight uppercase">{userProfile.firstName}</div>
                    <div className="text-[8px] text-muted-foreground truncate font-bold uppercase tracking-widest mt-0.5">{userProfile.userType}</div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="end" className="w-64 mb-4 ml-4 p-3 rounded-2xl shadow-3xl glass border-primary/10">
                <DropdownMenuLabel className="px-2 pb-2 text-left font-black uppercase text-[9px] tracking-widest text-muted-foreground/50">Registry Dossier</DropdownMenuLabel>
                <DropdownMenuItem asChild className="rounded-lg h-10 font-bold text-[10px] uppercase tracking-widest gap-3 mb-1 cursor-pointer">
                    <Link href="/dashboard/profile"><User className="h-4 w-4 text-primary opacity-60" /> My Identity</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-2 opacity-5" />
                <DropdownMenuRadioGroup value={theme} onValueChange={(v) => setTheme(v as 'light' | 'dark')}>
                    <DropdownMenuRadioItem value="light" className="rounded-lg h-10 font-bold text-[10px] uppercase tracking-widest gap-3 cursor-pointer">Light Protocol</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="dark" className="rounded-lg h-10 font-bold text-[10px] uppercase tracking-widest gap-3 cursor-pointer">Dark Protocol</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
                <DropdownMenuSeparator className="my-2 opacity-5" />
                <DropdownMenuItem onClick={handleLogout} className="rounded-lg h-12 font-black text-[10px] uppercase tracking-widest text-destructive focus:text-destructive focus:bg-destructive/5 gap-3 cursor-pointer transition-all">
                    <LogOut className="h-4 w-4" /> Terminate Node
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
             <Button asChild className="w-full rounded-xl h-12 font-black tracking-widest uppercase text-[10px] shadow-lg">
                <Link href="/login">Initialize</Link>
             </Button>
          )}
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="bg-background relative overflow-hidden">
        <Header userProfile={userProfile} unreadCount={unreadCount} isAdmin={isAdmin} />
        <main className="flex-1 overflow-y-auto custom-scrollbar relative">
            <AnimatePresence mode="wait">
                {showContent ? (
                    <motion.div key="dashboard-content" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.2 }} className="p-4 sm:p-8 min-h-[calc(100vh-64px)] flex flex-col">
                        <div className="flex-1">{props.children}</div>
                        <Footer />
                    </motion.div>
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <Loader2 className="h-10 w-10 animate-spin text-primary opacity-10" />
                    </div>
                )}
            </AnimatePresence>
        </main>
        <FloatingHub />
      </SidebarInset>
    </SidebarProvider>
  );
}
