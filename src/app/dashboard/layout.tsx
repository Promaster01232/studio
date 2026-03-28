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
import { LogOut, SunMoon, Loader2, User, Search, Bell, ShieldAlert, ShieldX, Sparkles, Activity } from "lucide-react";
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
import { doc, onSnapshot, updateDoc, collection, query, where } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { cn } from "@/lib/utils";
import { SosDialog } from "@/components/sos-dialog";
import { SearchDialog } from "@/components/search-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ADMIN_EMAILS = [
  'enterspaceindia@gmail.com', 
  'piyushkumarsingh23323@gmail.com',
  'piyushkumrsingh23323@gmail.com',
  'piyushkumrsingh23399@gmail.com'
];

function Header({ userProfile, unreadCount }: { userProfile: any, unreadCount: number }) {
    return (
        <header className={cn(
            "sticky top-0 z-[40] flex h-16 items-center gap-4 border-b px-4 sm:px-8 transition-all",
            "bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60"
        )}>
            <div className="flex items-center gap-3 md:hidden">
                <SidebarTrigger className="h-10 w-10 rounded-xl hover:bg-primary/5 active:scale-95 transition-all" />
                <Logo className="h-8 w-8" />
            </div>
            
            <div className="flex-1 flex items-center justify-end md:justify-start">
                {!userProfile?.isBlocked && (
                    <SearchDialog>
                        <div className="w-full max-w-md cursor-pointer group active:scale-[0.99] transition-transform">
                            <div className="hidden md:flex items-center w-full pl-10 pr-16 h-11 font-black text-[10px] uppercase tracking-widest text-muted-foreground/60 rounded-xl bg-muted/40 border border-primary/5 group-hover:border-primary/20 group-hover:bg-muted/60 transition-all shadow-sm relative">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                <span className="tracking-[0.1em]">Forensic search hub...</span>
                                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                    <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[9px] font-black text-muted-foreground opacity-100 shadow-sm">
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

            <div className="flex items-center gap-3">
                <div className="hidden lg:flex items-center gap-2 mr-2 px-3 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-left">
                    <Activity className="h-3 w-3 text-green-500 animate-pulse" />
                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-primary/60">System: Active</span>
                </div>

                {!userProfile?.isBlocked && (
                    <>
                        <SosDialog>
                            <Button variant="destructive" size="sm" className="font-black gap-2 animate-pulse px-5 h-11 text-[9px] rounded-xl shadow-xl shadow-destructive/20 active:scale-95 transition-all">
                                <ShieldAlert className="h-4 w-4" />
                                <span className="hidden sm:inline tracking-[0.2em] uppercase">Emergency SOS</span>
                            </Button>
                        </SosDialog>
                        
                        <div className="flex items-center gap-2 border-l pl-4 ml-1">
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-11 w-11 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-xl transition-all active:scale-95 relative group"
                                asChild
                            >
                                <Link href="/dashboard/notifications">
                                    <Bell className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                                    {unreadCount > 0 && (
                                        <motion.span 
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute top-2.5 right-2.5 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-background shadow-sm"
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
  const [isNavigating, setIsNavigating] = useState(false);
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
    // Every time pathname changes, show navigation loader for a smooth institutional transition
    setIsNavigating(true);
    const timer = setTimeout(() => setIsNavigating(false), 600);
    return () => clearTimeout(timer);
  }, [pathname]);

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
              const data = userDoc.data() as any;
              setUserProfile(data);
              
              // Throttled sync to avoid resource exhaustion
              if (data.emailVerified !== user.emailVerified) {
                  updateDoc(userDocRef, { emailVerified: user.emailVerified }).catch(() => {});
              }
            } else {
              if (pathname !== '/create-profile' && pathname !== '/login' && pathname !== '/register') {
                router.replace('/create-profile');
              }
            }
            setProfileLoading(false);
        }, (error) => {
            console.warn("Registry sync paused:", error.message);
            setProfileLoading(false);
        });

        const notifRef = collection(firestore, "notifications");
        const q = query(notifRef, where("userId", "==", user.uid), where("isRead", "==", false));
        notifUnsubscribeRef.current = onSnapshot(q, (snap) => {
            setUnreadCount(snap.size);
        }, (error) => {
            console.warn("Notification listener error:", error);
            setUnreadCount(0);
        });

      } else {
        setProfileLoading(false);
        setUserProfile(null);
        setUnreadCount(0);
        if (!['/login', '/register', '/', '/about', '/terms', '/privacy', '/cookie-policy', '/disclaimer', '/contact'].includes(pathname)) {
            router.replace('/login');
        }
      }
    });

    return () => {
        unsubscribeAuth();
        if (profileUnsubscribeRef.current) profileUnsubscribeRef.current();
        if (notifUnsubscribeRef.current) notifUnsubscribeRef.current();
    };
  }, [auth, firestore, router, pathname]);

  const handleLogout = async () => {
    if (profileUnsubscribeRef.current) profileUnsubscribeRef.current();
    if (notifUnsubscribeRef.current) notifUnsubscribeRef.current();
    await signOut(auth);
    router.replace('/login');
  };

  const showContent = isMounted && (!profileLoading || pathname === '/create-profile');
  const isSuspended = userProfile?.isBlocked === true;
  const isAdmin = userProfile?.email && (ADMIN_EMAILS.includes(userProfile.email.toLowerCase()) || !!userProfile?.isAdmin);

  if (showContent && isSuspended) {
      return (
        <div className="flex h-screen items-center justify-center bg-background p-4 relative overflow-hidden text-left">
            <div className="absolute inset-0 bg-destructive/5 -z-10 animate-pulse"></div>
            <Card className="max-w-md w-full glass shadow-2xl overflow-hidden rounded-[2.5rem]">
                <div className="bg-destructive/10 p-10 flex justify-center border-b border-destructive/10">
                    <ShieldX className="h-24 w-24 text-destructive animate-bounce" />
                </div>
                <CardHeader className="text-center pt-8">
                    <div className="flex items-center justify-center gap-2 text-destructive mb-2">
                        <ShieldAlert className="h-4 w-4" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Security Alert</span>
                    </div>
                    <CardTitle className="text-3xl font-black tracking-tighter text-destructive leading-none text-center">
                        Statutory Suspension
                    </CardTitle>
                    <CardDescription className="text-sm font-medium pt-4 text-muted-foreground leading-relaxed px-4 text-center">
                        Your account has been deactivated by the system administrator. Registry privileges suspended.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pb-10 px-8 text-center">
                    <div className="p-4 bg-muted/50 rounded-2xl flex items-start gap-3 border border-border">
                        <p className="text-[11px] font-medium text-left leading-relaxed text-muted-foreground italic">
                            Protocol: Contact <span className="font-bold text-primary">nyayasahayakhelp@gmail.com</span> for audit.
                        </p>
                    </div>
                    <Button onClick={handleLogout} variant="outline" className="w-full h-14 font-black text-xs uppercase tracking-widest rounded-2xl border-primary/10 hover:bg-primary/5 transition-all text-center">
                        <LogOut className="mr-3 h-4 w-4" /> Terminate Session
                    </Button>
                </CardContent>
            </Card>
        </div>
      );
  }

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" className="border-r border-border glass bg-white/50 dark:bg-zinc-950/50">
        <SidebarHeader className="p-6 overflow-hidden">
          <Link href="/dashboard" className="flex items-center gap-4 transition-all hover:scale-105 active:scale-95 group-data-[collapsible=icon]:justify-center group">
            <div className="relative">
                <div className="absolute -inset-2 rounded-full bg-gradient-to-tr from-primary/20 via-accent/20 to-blue-400/20 blur-md animate-pulse group-data-[collapsible=icon]:hidden"></div>
                <div className="relative p-1 rounded-full bg-gradient-to-tr from-primary via-accent to-blue-400">
                  <div className="bg-white rounded-full p-1.5 shadow-lg relative z-10">
                    <Logo className="h-7 w-7 border-none shadow-none p-0" />
                  </div>
                </div>
            </div>
            <div className="flex flex-col group-data-[collapsible=icon]:hidden text-left">
              <span className="text-xl font-black font-headline tracking-tighter bg-gradient-to-r from-primary via-accent to-blue-400 bg-clip-text text-transparent animate-animated-gradient bg-[200%_auto] truncate">
                  Nyaya Sahayak
              </span>
              <span className="text-[8px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 leading-none mt-0.5">Forensic Terminal</span>
            </div>
          </Link>
        </SidebarHeader>
        <SidebarContent className="pt-2">
          <SidebarNav isAdmin={isAdmin} />
        </SidebarContent>
        <SidebarFooter className="p-4">
           {profileLoading ? (
            <div className="flex items-center gap-3 p-3">
              <Skeleton className="h-10 w-10 rounded-2xl" />
              <div className="flex-1 space-y-2 text-left">
                 <Skeleton className="h-3 w-20" />
                 <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ) : userProfile ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start items-center gap-3 p-2 h-auto text-left group data-[state=collapsed]:w-10 data-[state=collapsed]:justify-center hover:bg-primary/5 rounded-2xl transition-all">
                  <div className="relative">
                      {userProfile.photoURL ? (
                        <Avatar className="h-10 w-10 border-2 border-background shadow-lg transition-transform group-hover:scale-105 rounded-xl">
                            <AvatarImage src={userProfile.photoURL} alt={userProfile.firstName} className="object-cover" />
                        </Avatar>
                      ) : (
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-sm">
                            <User className="h-5 w-5" />
                        </div>
                      )}
                      <div className="absolute -bottom-0.5 -right-0.5 bg-green-500 h-3 w-3 rounded-full border-2 border-background shadow-sm group-data-[collapsible=icon]:hidden"></div>
                  </div>
                  <div className="flex-1 truncate group-data-[state=collapsed]:hidden text-left">
                    <div className="font-black text-sm truncate tracking-tighter text-foreground leading-tight">{userProfile.firstName} {userProfile.lastName}</div>
                    <div className="text-[10px] text-muted-foreground truncate font-bold opacity-60 uppercase tracking-widest">{userProfile.userType}</div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="end" className="w-64 mb-4 ml-4 p-3 rounded-[1.5rem] shadow-3xl border-primary/5 glass animate-in slide-in-from-left-2 duration-300">
                <DropdownMenuLabel className="px-2 pb-2">
                    <div className="flex items-center gap-2 text-primary mb-1 text-left">
                        <Sparkles className="h-3 w-3" />
                        <span className="text-[9px] font-black uppercase tracking-[0.2em]">Registry Dossier</span>
                    </div>
                </DropdownMenuLabel>
                
                <DropdownMenuItem asChild className="rounded-xl h-11 font-bold text-xs gap-3 mb-1 cursor-pointer hover:bg-primary/5 text-left">
                    <Link href="/dashboard/profile">
                        <User className="h-4 w-4 opacity-40" /> My Registry Profile
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="my-2 opacity-5" />
                
                <DropdownMenuLabel className="px-2 pb-2 text-left">
                    <div className="flex items-center gap-2 text-primary mb-1">
                        <Sparkles className="h-3 w-3" />
                        <span className="text-[9px] font-black uppercase tracking-[0.2em]">Appearance</span>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuRadioGroup value={theme} onValueChange={(v) => setTheme(v as 'light' | 'dark')}>
                    <DropdownMenuRadioItem value="light" className="rounded-xl h-11 font-bold text-xs gap-3 cursor-pointer text-left">
                        <SunMoon className="h-4 w-4 opacity-40" /> Light Protocol
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="dark" className="rounded-xl h-11 font-bold text-xs gap-3 cursor-pointer text-left">
                        <SunMoon className="h-4 w-4 opacity-40" /> Dark Protocol
                    </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
                
                <DropdownMenuSeparator className="my-2 opacity-5" />
                
                <DropdownMenuItem onClick={handleLogout} className="rounded-xl h-12 font-black text-[10px] uppercase tracking-widest text-destructive focus:bg-destructive/10 focus:text-destructive gap-3 active:scale-95 transition-all cursor-pointer text-left">
                    <LogOut className="h-4 w-4" />
                    <span>Terminate Session</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
             <div className="p-2">
                <Button asChild className="w-full rounded-2xl h-12 font-black tracking-widest uppercase text-xs shadow-xl shadow-primary/20 active:scale-95 transition-all text-center">
                    <Link href="/login">Initialize Sign In</Link>
                </Button>
             </div>
          )}
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="bg-background relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none -z-10"></div>
        
        <div className="flex flex-col h-screen overflow-hidden">
          <Header userProfile={userProfile} unreadCount={unreadCount} />
          <main className="flex-1 overflow-y-auto custom-scrollbar relative">
            <AnimatePresence>
                {isNavigating && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-[100] bg-background/60 backdrop-blur-md flex items-center justify-center"
                    >
                        <div className="flex flex-col items-center gap-6">
                            <div className="relative">
                                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 4, ease: "linear" }} className="p-12 rounded-full border-2 border-dashed border-primary/20" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Logo className="h-12 w-12" />
                                </div>
                            </div>
                            <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10">
                                <Activity className="h-3 w-3 text-primary animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Neural Synchronization...</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="p-4 sm:p-10 min-h-[calc(100vh-64px)] flex flex-col">
                <AnimatePresence mode="wait">
                    {showContent ? (
                        <motion.div 
                            key={pathname}
                            initial={{ opacity: 0, scale: 0.99, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 1.01, y: -10 }}
                            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                            className="flex-1 flex flex-col"
                        >
                            <div className="flex-1">
                                {children}
                            </div>
                            <Footer />
                        </motion.div>
                    ) : (
                        <div className="flex flex-1 items-center justify-center">
                            <div className="flex flex-col items-center gap-8">
                                <div className="relative">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                                        className="absolute -inset-12 border border-primary/5 rounded-full"
                                    />
                                    <div className="relative p-1 rounded-full bg-gradient-to-tr from-primary via-accent to-blue-400">
                                        <div className="bg-white rounded-full p-2 shadow-2xl">
                                            <Logo className="h-12 w-12 border-none shadow-none p-0" />
                                        </div>
                                    </div>
                                    <motion.div
                                        animate={{
                                            scale: [1, 1.2, 1],
                                            opacity: [0.5, 0.2, 0.5],
                                        }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="absolute inset-0 bg-primary/20 rounded-full blur-xl -z-10"
                                    />
                                </div>
                                <div className="flex flex-col items-center gap-3">
                                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 shadow-sm text-left">
                                        <Activity className="h-3 w-3 text-primary animate-pulse" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Synchronization</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 text-left">
                                        <Loader2 className="h-3 w-3 animate-spin" />
                                        <span>Authenticating Hub Access...</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
