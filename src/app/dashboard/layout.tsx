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
import { LogOut, SunMoon, Loader2, User, Search, Bell, ShieldAlert, ShieldX, Sparkles, Cpu } from "lucide-react";
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
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { cn } from "@/lib/utils";
import { SosDialog } from "@/components/sos-dialog";
import { SearchDialog } from "@/components/search-dialog";
import { AnimatePresence, motion } from "framer-motion";

function Header({ userProfile }: { userProfile: any }) {
    return (
        <header className={cn(
            "sticky top-0 z-[40] flex h-16 items-center gap-4 border-b px-4 sm:px-6 transition-all",
            "bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60"
        )}>
            <div className="flex items-center gap-3 md:hidden">
                <SidebarTrigger className="h-10 w-10 rounded-xl hover:bg-primary/5 active:scale-95 transition-all" />
                <Logo className="h-8 w-8" />
            </div>
            
            <div className="flex-1 flex items-center justify-end md:justify-start">
                {!userProfile?.isBlocked && (
                    <SearchDialog>
                        <div className="w-full max-w-sm">
                            <div className="relative w-full hidden md:block group cursor-pointer active:scale-[0.99] transition-transform">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                <div className="pl-10 pr-16 h-10 flex items-center font-bold text-[11px] text-muted-foreground/60 rounded-xl bg-muted/40 border border-primary/5 group-hover:border-primary/20 group-hover:bg-muted/60 transition-all shadow-sm">
                                    Search tools, cases, guides...
                                </div>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                    <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 shadow-sm">
                                        <span className="text-xs">⌘</span>K
                                    </kbd>
                                </div>
                            </div>
                            <Button variant="outline" size="icon" className="md:hidden h-10 w-10 rounded-xl border-primary/5 bg-muted/40 active:scale-95 transition-all">
                                <Search className="h-4 w-4 text-muted-foreground" />
                            </Button>
                        </div>
                    </SearchDialog>
                )}
            </div>

            <div className="flex items-center gap-2">
                {!userProfile?.isBlocked && (
                    <>
                        <SosDialog>
                            <Button variant="destructive" size="sm" className="font-black gap-2 animate-pulse px-4 h-10 text-[10px] rounded-xl shadow-lg shadow-destructive/20 active:scale-95 transition-all">
                                <ShieldAlert className="h-4 w-4" />
                                <span className="hidden sm:inline tracking-widest">EMERGENCY SOS</span>
                            </Button>
                        </SosDialog>
                        
                        <div className="flex items-center gap-1 border-l pl-3 ml-1">
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-10 w-10 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-xl transition-all active:scale-95"
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
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (profileUnsubscribeRef.current) {
        profileUnsubscribeRef.current();
        profileUnsubscribeRef.current = null;
      }

      if (user) {
        setProfileLoading(true);
        const userDocRef = doc(firestore, "users", user.uid);
        
        await updateDoc(userDocRef, { emailVerified: user.emailVerified }).catch(() => {});

        profileUnsubscribeRef.current = onSnapshot(userDocRef, (userDoc) => {
            if (userDoc.exists()) {
              setUserProfile(userDoc.data() as any);
            } else {
              if (pathname !== '/create-profile' && pathname !== '/login' && pathname !== '/register') {
                router.replace('/create-profile');
              }
            }
            setProfileLoading(false);
        }, () => {
            setProfileLoading(false);
        });
      } else {
        setProfileLoading(false);
        setUserProfile(null);
        if (!['/login', '/register', '/'].includes(pathname)) {
            router.replace('/login');
        }
      }
    });

    return () => {
        unsubscribeAuth();
        if (profileUnsubscribeRef.current) profileUnsubscribeRef.current();
    };
  }, [auth, firestore, router, pathname]);

  const handleLogout = async () => {
    if (profileUnsubscribeRef.current) profileUnsubscribeRef.current();
    await signOut(auth);
    router.replace('/login');
  };

  const showContent = isMounted && (!profileLoading || pathname === '/create-profile');
  const isSuspended = userProfile?.isBlocked === true;
  const isAdmin = userProfile?.email === 'enterspaceindia@gmail.com' || !!userProfile?.isAdmin;

  if (showContent && isSuspended) {
      return (
        <div className="flex h-screen items-center justify-center bg-background p-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-destructive/5 -z-10 animate-pulse"></div>
            <Card className="max-w-md w-full glass shadow-2xl overflow-hidden rounded-[2rem]">
                <div className="bg-destructive/10 p-10 flex justify-center border-b border-destructive/10">
                    <ShieldX className="h-24 w-24 text-destructive animate-bounce" />
                </div>
                <CardHeader className="text-center pt-8">
                    <div className="flex items-center justify-center gap-2 text-destructive mb-2">
                        <ShieldAlert className="h-4 w-4" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Security Alert</span>
                    </div>
                    <CardTitle className="text-3xl font-black tracking-tighter text-destructive leading-none">
                        Access Revoked
                    </CardTitle>
                    <CardDescription className="text-sm font-medium pt-4 text-muted-foreground leading-relaxed px-4">
                        Your account has been deactivated by the system administrator. Node privileges and data access have been suspended.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pb-10 px-8">
                    <div className="p-4 bg-muted/50 rounded-2xl flex items-start gap-3 border border-border">
                        <p className="text-[11px] font-medium text-left leading-relaxed text-muted-foreground italic">
                            Protocol: Contact <span className="font-bold text-primary">nyayasahayakhelp@gmail.com</span> for a formal restoration audit.
                        </p>
                    </div>
                    <Button onClick={handleLogout} variant="outline" className="w-full h-12 font-bold rounded-2xl border-primary/10 hover:bg-primary/5 transition-all">
                        <LogOut className="mr-3 h-4 w-4" /> Terminate Session
                    </Button>
                </CardContent>
            </Card>
        </div>
      );
  }

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" className="border-r border-border glass bg-white/50 dark:bg-black/20">
        <SidebarHeader className="p-6 overflow-hidden">
          <Link href="/dashboard" className="flex items-center gap-4 transition-all hover:scale-105 active:scale-95 group-data-[collapsible=icon]:justify-center group">
            <div className="relative">
                <div className="absolute -inset-2 rounded-full bg-gradient-to-tr from-primary/20 via-accent/20 to-blue-400/20 blur-md animate-pulse group-data-[collapsible=icon]:hidden"></div>
                <div className="relative p-1 rounded-full bg-gradient-to-tr from-primary via-accent to-blue-400">
                  <Logo className="h-10 w-10 shadow-lg relative z-10 border-none bg-white rounded-full p-1.5" />
                </div>
            </div>
            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
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
              <div className="flex-1 space-y-2">
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
                  <div className="flex-1 truncate group-data-[state=collapsed]:hidden">
                    <div className="font-black text-sm truncate tracking-tighter text-foreground leading-tight">{userProfile.firstName} {userProfile.lastName}</div>
                    <div className="text-[10px] text-muted-foreground truncate font-bold opacity-60 uppercase tracking-widest">{userProfile.userType}</div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="end" className="w-64 mb-4 ml-4 p-3 rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] border-primary/5 glass animate-in slide-in-from-left-2 duration-300">
                <DropdownMenuLabel className="px-2 pb-2">
                    <div className="flex items-center gap-2 text-primary mb-1">
                        <Sparkles className="h-3 w-3" />
                        <span className="text-[9px] font-black uppercase tracking-[0.2em]">Appearance Node</span>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuRadioGroup value={theme} onValueChange={(v) => setTheme(v as 'light' | 'dark')}>
                    <DropdownMenuRadioItem value="light" className="rounded-xl h-10 font-bold text-xs gap-3">
                        <SunMoon className="h-4 w-4 opacity-40" /> Light Protocol
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="dark" className="rounded-xl h-10 font-bold text-xs gap-3">
                        <SunMoon className="h-4 w-4 opacity-40" /> Dark Protocol
                    </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
                <DropdownMenuSeparator className="my-2 opacity-5" />
                <DropdownMenuItem onClick={handleLogout} className="rounded-xl h-11 font-black text-xs text-destructive focus:bg-destructive/10 focus:text-destructive gap-3 active:scale-95 transition-all cursor-pointer">
                    <LogOut className="h-4 w-4" />
                    <span className="tracking-widest uppercase">Terminate Session</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
             <div className="p-2">
                <Button asChild className="w-full rounded-2xl h-12 font-black tracking-widest uppercase text-xs shadow-xl shadow-primary/20 active:scale-95 transition-all">
                    <Link href="/login">Initialize Sign In</Link>
                </Button>
             </div>
          )}
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="bg-background relative overflow-hidden">
        {/* Universal Ambient Overlay */}
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none -z-10"></div>
        
        <div className="flex flex-col h-screen overflow-hidden">
          <Header userProfile={userProfile} />
          <main className="flex-1 overflow-y-auto">
            <div className="p-4 sm:p-6 md:p-8 lg:p-10 min-h-[calc(100vh-64px)] flex flex-col">
                <AnimatePresence mode="wait">
                    {showContent ? (
                        <motion.div 
                            key={pathname}
                            initial={{ opacity: 0, scale: 0.99, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 1.01, y: -10 }}
                            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                            className="flex-1 flex flex-col"
                        >
                            <div className="flex-1">
                                {children}
                            </div>
                            <Footer />
                        </motion.div>
                    ) : (
                        <div className="flex flex-1 items-center justify-center">
                            <div className="relative">
                                <Loader2 className="h-12 w-12 animate-spin text-primary opacity-20" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Logo className="h-6 v-6 opacity-40 animate-pulse" />
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
