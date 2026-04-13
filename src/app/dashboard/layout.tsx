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
  Search, 
  Moon, 
  LayoutDashboard,
  Crown,
  Activity,
  Zap,
  ArrowRight
} from "lucide-react";
import { Logo } from "@/components/logo";
import { ReactNode, useEffect, useState, useRef } from "react";
import { SidebarNav } from "@/components/sidebar-nav";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "@/components/theme-provider";
import { useAuth, useFirestore } from "@/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { cn } from "@/lib/utils";
import { SearchDialog } from "@/components/search-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { onSnapshot, doc } from "firebase/firestore";
import { FloatingHub } from "@/components/floating-hub";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SosDialog } from "@/components/sos-dialog";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError, type SecurityRuleContext } from "@/firebase/errors";

const ADMIN_EMAILS = [
  'enterspaceindia@gmail.com', 
  'piyushkumrsingh23399@gmail.com',
  'nyayasahayakhelp@gmail.com'
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
    const isFree = !userProfile?.subscriptionType || userProfile?.subscriptionType === 'free';
    const planLabel = isAdmin ? "Root Authority" : (isFree ? "Citizen Basic" : "Professional Access");

    return (
        <header className={cn(
            "sticky top-0 z-[40] flex h-12 items-center gap-4 border-b px-4 sm:px-6 transition-all",
            "bg-background/80 backdrop-blur-md border-border/10"
        )}>
            <div className="flex items-center gap-3 md:hidden">
                <SidebarTrigger className="h-8 w-8 rounded-lg hover:bg-primary/5 border border-primary/5 text-foreground" />
            </div>
            
            <div className="flex-1 flex items-center justify-end md:justify-start">
                <SearchDialog>
                    <div className="w-full max-w-md cursor-pointer group transition-all">
                        <div className="hidden md:flex items-center w-full pl-9 pr-10 h-8 font-bold text-[9px] tracking-tight text-muted-foreground rounded-lg bg-muted/30 border border-border/10 group-hover:border-primary/20 transition-all relative text-left">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                            <span>Search Registry... (ctrl+k)</span>
                        </div>
                        <div className="md:hidden">
                            <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg border-border/10 bg-muted/30">
                                <Search className="h-3.5 w-3.5 text-muted-foreground" />
                            </Button>
                        </div>
                    </div>
                </SearchDialog>
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
                {isFree && !isAdmin && (
                    <Button asChild size="sm" className="h-8 px-4 rounded-lg bg-primary text-primary-foreground font-black text-[9px] uppercase tracking-widest gap-2 shadow-lg shadow-primary/20 hidden sm:flex">
                        <Link href="/dashboard/billing">
                            <Zap className="h-3 w-3 fill-current" />
                            Upgrade Plan
                        </Link>
                    </Button>
                )}

                <SosDialog>
                    <Button variant="outline" size="sm" className="h-7 px-3 rounded-full border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-500 font-bold text-[8px] uppercase tracking-widest gap-1.5 shadow-none hover:shadow-none">
                        <div className="h-1 w-1 rounded-full bg-red-500" />
                        Emergency
                    </Button>
                </SosDialog>

                <div className="flex items-center gap-3 text-muted-foreground">
                    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="hover:text-primary transition-colors">
                        <Moon className="h-3.5 w-3.5" />
                    </button>
                </div>

                {userProfile && (
                    <div className="flex items-center gap-2 border-l border-border/10 pl-3">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="outline-none active:scale-95 transition-transform">
                                    <Avatar className="h-7 w-7 border border-primary/20 shadow-sm cursor-pointer">
                                        <AvatarImage src={userProfile.photoURL} className="object-cover" />
                                        <AvatarFallback className="font-bold bg-primary text-primary-foreground text-[9px]">
                                            {userProfile.firstName?.charAt(0)?.toLowerCase() || "p"}
                                        </AvatarFallback>
                                    </Avatar>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 p-1.5 rounded-xl shadow-xl glass border-border/10 mt-2">
                                <div className="p-3 space-y-0.5 text-left">
                                    <p className="font-bold text-xs tracking-tight text-foreground">
                                        {userProfile.firstName} {userProfile.lastName}
                                    </p>
                                    <p className="text-[9px] font-medium text-muted-foreground truncate">
                                        {userProfile.email}
                                    </p>
                                </div>
                                <DropdownMenuSeparator className="bg-border/5" />
                                <div className="p-1">
                                    <DropdownMenuItem className="rounded-lg h-9 px-2 flex items-center justify-between group focus:bg-primary/10 cursor-pointer">
                                        <div className="flex items-center gap-2">
                                            <Crown className="h-3.5 w-3.5 text-primary" />
                                            <span className="text-[11px] font-bold text-foreground">Clearance</span>
                                        </div>
                                        <span className="text-[9px] font-bold text-primary/60">{planLabel}</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="bg-border/5 my-1" />
                                    <DropdownMenuItem asChild className="rounded-lg h-9 px-2 focus:bg-primary/10 cursor-pointer">
                                        <Link href="/dashboard" className="flex items-center gap-2 w-full">
                                            <LayoutDashboard className="h-3.5 w-3.5 text-muted-foreground" />
                                            <span className="text-[11px] font-bold text-foreground">Terminal Home</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="bg-border/5 my-1" />
                                    <DropdownMenuItem 
                                        onClick={handleLogout}
                                        className="rounded-lg h-9 px-2 focus:bg-destructive/10 cursor-pointer group"
                                    >
                                        <div className="flex items-center gap-2 w-full text-destructive">
                                            <LogOut className="h-3.5 w-3.5" />
                                            <span className="text-[11px] font-bold uppercase tracking-widest">Terminate Session</span>
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
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  
  const [userProfile, setUserProfile] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  
  const profileUnsubscribeRef = useRef<(() => void) | null>(null);

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
                const permissionError = new FirestorePermissionError({
                    path: userDocRef.path,
                    operation: 'get',
                } satisfies SecurityRuleContext, err);
                errorEmitter.emit('permission-error', permissionError);
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
            if (pathname.startsWith('/dashboard')) {
                router.replace('/login');
            }
        } else if (!userProfile && pathname !== '/create-profile' && !pathname.startsWith('/login') && !pathname.startsWith('/register')) {
            router.replace('/create-profile');
        }
    }
  }, [auth.currentUser, profileLoading, pathname, router, userProfile]);

  const isAdmin = userProfile?.email && (ADMIN_EMAILS.includes(userProfile.email.toLowerCase()) || !!userProfile?.isAdmin);
  const isFree = !userProfile?.subscriptionType || userProfile?.subscriptionType === 'free';

  if (profileLoading || (!auth.currentUser && pathname.startsWith('/dashboard'))) {
      return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <div className="relative">
                <Activity className="h-10 w-10 text-primary opacity-20" />
            </div>
        </div>
      );
  }

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" className="border-r border-border/10 bg-sidebar">
        <SidebarHeader className="p-4 mb-1">
          <Link href="/dashboard" className="flex items-center gap-3">
            <Logo className="h-7 w-7 border-none shadow-none p-0 bg-transparent" priority={true} />
            <div className="flex flex-col group-data-[state=collapsed]:hidden text-left min-w-0">
              <span className="text-lg font-black font-headline tracking-tighter text-foreground leading-none">
                  Nyaya Sahayak
              </span>
              <span className="text-[7px] font-bold text-primary/60 tracking-widest mt-0.5">Legal Intelligence</span>
            </div>
          </Link>
        </SidebarHeader>
        <SidebarContent className="pt-1 px-2">
          <SidebarNav isAdmin={isAdmin} isElite={!isFree || isAdmin} />
        </SidebarContent>
        <SidebarFooter className="p-3 border-t border-border/10">
             {isFree && !isAdmin && (
                 <div className="mb-2 group-data-[state=collapsed]:hidden">
                     <Button asChild className="w-full h-9 rounded-xl bg-primary text-primary-foreground font-black text-[9px] uppercase tracking-widest shadow-lg shadow-primary/20">
                         <Link href="/dashboard/billing">Upgrade Hub</Link>
                     </Button>
                 </div>
             )}
             {userProfile && (
                 <Link href="/dashboard/profile">
                   <div 
                     className="w-full h-12 flex items-center gap-3 px-2 hover:bg-muted/50 rounded-lg transition-all group"
                   >
                     <Avatar className="h-8 w-8 border border-primary/20 shadow-sm shrink-0 rounded-lg">
                       <AvatarImage src={userProfile.photoURL} className="object-cover" />
                       <AvatarFallback className="font-black bg-primary text-primary-foreground text-[9px]">
                         {userProfile.firstName?.charAt(0)}
                       </AvatarFallback>
                     </Avatar>
                     <div className="flex flex-col items-start overflow-hidden group-data-[state=collapsed]:hidden">
                       <span className="text-[10px] font-black text-foreground truncate w-full">
                         {userProfile.firstName} {userProfile.lastName}
                       </span>
                       <span className="text-[8px] font-bold text-muted-foreground truncate w-full">
                         Registry Point Active
                       </span>
                     </div>
                   </div>
                 </Link>
             )}
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="bg-background relative overflow-hidden">
        <Header userProfile={userProfile} />
        <main className="flex-1 overflow-y-auto custom-scrollbar relative">
            <div className="p-4 sm:p-6 min-h-[calc(100vh-48px)] flex flex-col">
                <div className="flex-1">{children}</div>
            </div>
        </main>
        <FloatingHub />
      </SidebarInset>
    </SidebarProvider>
  );
}
