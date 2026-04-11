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
import { 
  LogOut, 
  Loader2, 
  Search, 
  Zap, 
  Moon, 
  Globe, 
  ChevronRight,
  Settings,
  LayoutDashboard,
  Crown,
  User as UserIcon
} from "lucide-react";
import { Logo } from "@/components/logo";
import { ReactNode, useEffect, useState, useRef } from "react";
import { SidebarNav } from "@/components/sidebar-nav";
import { Footer } from "@/components/footer";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "@/components/theme-provider";
import { useAuth, useFirestore } from "@/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { cn } from "@/lib/utils";
import { SearchDialog } from "@/components/search-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { onSnapshot, doc } from "firebase/firestore";
import { FloatingHub } from "@/components/floating-hub";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

function Header({ userProfile }: { userProfile: any }) {
    const { theme, setTheme } = useTheme();
    const auth = useAuth();
    const router = useRouter();
    
    const handleLogout = async () => {
        await signOut(auth);
        router.push("/login");
    };

    const isAdmin = userProfile?.email && (ADMIN_EMAILS.includes(userProfile.email.toLowerCase()) || !!userProfile?.isAdmin);
    const planLabel = isAdmin ? "Root" : (userProfile?.subscriptionType === 'free' || !userProfile?.subscriptionType ? "Free" : "Pro");

    return (
        <header className={cn(
            "sticky top-0 z-[40] flex h-16 items-center gap-4 border-b px-4 sm:px-6 transition-all",
            "bg-[#0a0a0a] border-white/5"
        )}>
            <div className="flex items-center gap-3 md:hidden">
                <SidebarTrigger className="h-9 w-9 rounded-xl hover:bg-primary/5 border border-primary/5 text-white" />
            </div>
            
            <div className="flex-1 flex items-center justify-end md:justify-start">
                <SearchDialog>
                    <div className="w-full max-w-md cursor-pointer group transition-all">
                        <div className="hidden md:flex items-center w-full pl-10 pr-12 h-10 font-bold text-[11px] tracking-tight text-gray-500 rounded-xl bg-white/5 border border-white/5 group-hover:border-primary/20 transition-all relative text-left lowercase">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 group-hover:text-primary transition-colors" />
                            <span>search chats, docs, notes... (ctrl+k)</span>
                        </div>
                        <div className="md:hidden">
                            <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl border-white/5 bg-white/5">
                                <Search className="h-4 w-4 text-gray-500" />
                            </Button>
                        </div>
                    </div>
                </SearchDialog>
            </div>

            <div className="flex items-center gap-4 sm:gap-6">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5">
                    <Zap className="h-3.5 w-3.5 text-primary" />
                    <span className="text-[10px] font-black text-gray-300 tracking-tighter lowercase">100 left</span>
                </div>

                <div className="flex items-center gap-4 text-gray-400">
                    <button className="flex items-center gap-1.5 hover:text-white transition-colors">
                        <Globe className="h-4 w-4" />
                        <span className="text-[10px] font-black lowercase">en</span>
                    </button>
                    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="hover:text-white transition-colors">
                        <Moon className="h-4 w-4" />
                    </button>
                </div>

                {!userProfile ? (
                    <Button asChild size="sm" className="h-9 px-5 font-black text-[10px] rounded-xl shadow-lg active:scale-95 transition-all lowercase">
                        <Link href="/login">sign in</Link>
                    </Button>
                ) : (
                    <div className="flex items-center gap-2 border-l border-white/10 pl-4">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="outline-none active:scale-95 transition-transform">
                                    <Avatar className="h-8 w-8 border-2 border-primary/20 shadow-sm cursor-pointer">
                                        <AvatarImage src={userProfile.photoURL} className="object-cover" />
                                        <AvatarFallback className="font-black bg-[#e91e63] text-white text-[10px]">
                                            {userProfile.firstName?.charAt(0)?.toLowerCase() || "p"}
                                        </AvatarFallback>
                                    </Avatar>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-64 p-2 rounded-2xl shadow-2xl glass border-white/10 mt-2">
                                <div className="p-4 space-y-1">
                                    <p className="font-black text-sm tracking-tight text-foreground">
                                        {userProfile.firstName} {userProfile.lastName}
                                    </p>
                                    <p className="text-[10px] font-medium text-muted-foreground truncate">
                                        {userProfile.email}
                                    </p>
                                </div>
                                <DropdownMenuSeparator className="bg-white/5" />
                                <div className="p-2">
                                    <DropdownMenuItem className="rounded-xl h-10 px-3 flex items-center justify-between group focus:bg-primary/10 cursor-pointer">
                                        <div className="flex items-center gap-3">
                                            <Crown className="h-4 w-4 text-primary" />
                                            <span className="text-xs font-bold text-foreground">Plan</span>
                                        </div>
                                        <span className="text-[10px] font-black uppercase text-primary/60">{planLabel}</span>
                                    </DropdownMenuItem>
                                    
                                    <DropdownMenuSeparator className="bg-white/5 my-1" />
                                    
                                    <DropdownMenuItem asChild className="rounded-xl h-10 px-3 focus:bg-primary/10 cursor-pointer">
                                        <Link href="/dashboard" className="flex items-center gap-3 w-full">
                                            <LayoutDashboard className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                            <span className="text-xs font-bold text-foreground">Dashboard</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    
                                    <DropdownMenuItem asChild className="rounded-xl h-10 px-3 focus:bg-primary/10 cursor-pointer">
                                        <Link href="/dashboard/profile" className="flex items-center gap-3 w-full">
                                            <Settings className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                            <span className="text-xs font-bold text-foreground">Settings</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    
                                    <DropdownMenuSeparator className="bg-white/5 my-1" />
                                    
                                    <DropdownMenuItem 
                                        onClick={handleLogout}
                                        className="rounded-xl h-10 px-3 focus:bg-destructive/10 cursor-pointer group"
                                    >
                                        <div className="flex items-center gap-3 w-full text-destructive">
                                            <LogOut className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                                            <span className="text-xs font-black uppercase tracking-widest">Log out</span>
                                        </div>
                                    </DropdownMenuItem>
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )}
            </div>
        </header>
    );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
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

  const isAdmin = userProfile?.email && (ADMIN_EMAILS.includes(userProfile.email.toLowerCase()) || !!userProfile?.isAdmin);
  const isElite = isAdmin || userProfile?.subscriptionType?.startsWith('unlimited');

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" className="border-r border-white/5 bg-[#0a0a0a]">
        <SidebarHeader className="p-6 mb-2">
          <Link href="/dashboard" className="flex items-center gap-3 group transition-all">
            <div className="p-1 rounded-lg bg-primary/10">
                <Logo className="h-8 w-8 border-none shadow-none p-0 bg-transparent" priority={true} />
            </div>
            <div className="flex flex-col group-data-[state=collapsed]:hidden text-left min-w-0">
              <span className="text-xl font-black font-headline tracking-tighter text-white leading-none lowercase">
                  nyayguru
              </span>
              <span className="text-[8px] font-bold text-primary/60 tracking-widest mt-1 lowercase">legal intelligence</span>
            </div>
          </Link>
        </SidebarHeader>
        <SidebarContent className="pt-2 px-2">
          <SidebarNav isAdmin={isAdmin} isElite={isElite} />
        </SidebarContent>
        <SidebarFooter className="p-4 border-t border-white/5">
           <Button 
             variant="ghost" 
             onClick={() => router.push('/dashboard')}
             className="w-full justify-start items-center gap-3 h-11 text-gray-500 hover:text-white hover:bg-white/5 rounded-xl transition-all"
           >
             <ChevronRight className="h-4 w-4 rotate-180" />
             <span className="font-black text-[11px] tracking-tight group-data-[state=collapsed]:hidden lowercase">collapse</span>
           </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="bg-[#050505] relative overflow-hidden">
        <Header userProfile={userProfile} />
        <main className="flex-1 overflow-y-auto custom-scrollbar relative">
            <AnimatePresence mode="wait">
                {isMounted && (!profileLoading || pathname === '/create-profile') ? (
                    <motion.div key="dashboard-content" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.2 }} className="p-4 sm:p-8 min-h-[calc(100vh-64px)] flex flex-col">
                        <div className="flex-1">{children}</div>
                        <Footer />
                    </motion.div>
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <Loader2 className="h-10 w-10 animate-spin text-primary opacity-20" />
                    </div>
                )}
            </AnimatePresence>
        </main>
        <FloatingHub />
      </SidebarInset>
    </SidebarProvider>
  );
}
