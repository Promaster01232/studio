
"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useFirestore, useAuth, useDatabase } from "@/firebase";
import { collection, doc, getDoc, onSnapshot, updateDoc, deleteDoc, query, where, getDocs, writeBatch } from "firebase/firestore";
import { ref, remove, update } from "firebase/database";
import { sendPasswordResetEmail, onAuthStateChanged } from "firebase/auth";
import { 
  ShieldCheck, 
  Loader2, 
  Search, 
  AlertTriangle, 
  ShieldAlert, 
  BadgeCheck, 
  MoreHorizontal,
  Mail,
  UserPlus,
  Trash2,
  Activity,
  KeyRound,
  UserCheck,
  Zap,
  MailCheck,
  RefreshCw,
  Lock
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { verifyEmailAuthenticity } from "@/ai/flows/verify-email-authenticity";
import { motion } from "framer-motion";

interface UserRecord {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  userType: string;
  photoURL?: string;
  isAdmin?: boolean;
  isBlocked?: boolean;
  securityStatus?: 'verified' | 'suspicious' | 'flagged';
  createdAt?: any;
  mobileNumber?: string;
  aiUsageCount?: number;
  subscriptionType?: string;
}

const ADMIN_EMAILS = [
  'enterspaceindia@gmail.com', 
  'piyushkumarsingh23323@gmail.com',
  'piyushkumrsingh23323@gmail.com',
  'piyushkumrsingh23399@gmail.com'
];

export default function ManagementConsolePage() {
  const firestore = useFirestore();
  const rtdb = useDatabase();
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchSearchQuery] = useState("");
  const [processingUid, setProcessingUid] = useState<string | null>(null);
  const [userToPurge, setUserToPurge] = useState<UserRecord | null>(null);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (user) => {
        if (!user) {
            router.replace('/login');
            return;
        }

        const adminDoc = await getDoc(doc(firestore, "users", user.uid));
        const adminData = adminDoc.data() as any;
        const isAuthorized = ADMIN_EMAILS.includes(user.email?.toLowerCase() || '') || !!adminData?.isAdmin;

        if (!isAuthorized) {
            toast({ variant: "destructive", title: "Access Denied" });
            router.replace('/dashboard');
            return;
        }

        // Live Real-Time Mirror from Firebase Firestore
        const usersCol = collection(firestore, "users");
        return onSnapshot(usersCol, (snapshot) => {
            const list = snapshot.docs.map(doc => ({ ...doc.data(), uid: doc.id } as UserRecord));
            setUsers(list.sort((a, b) => {
                const dateA = a.createdAt?.toMillis ? a.createdAt.toMillis() : Number(a.createdAt || 0);
                const dateB = b.createdAt?.toMillis ? b.createdAt.toMillis() : Number(b.createdAt || 0);
                return dateB - dateA;
            }));
            setLoading(false);
        });
    });

    return () => unsubAuth();
  }, [firestore, auth, router, toast]);

  const handleToggleStatus = (user: UserRecord, isInactive: boolean) => {
    setProcessingUid(user.uid);
    const userRef = doc(firestore, "users", user.uid);
    updateDoc(userRef, { isBlocked: isInactive })
        .then(() => {
            update(ref(rtdb, `users/${user.uid}`), { isBlocked: isInactive }).catch(() => {});
            toast({ title: isInactive ? "Node Suspended" : "Node Activated" });
        })
        .finally(() => setProcessingUid(null));
  };

  const handleVerifyUser = async (user: UserRecord) => {
      setProcessingUid(user.uid);
      try {
          const verification = await verifyEmailAuthenticity({ email: user.email });
          await updateDoc(doc(firestore, "users", user.uid), { 
              securityStatus: verification.isAuthentic ? 'verified' : 'suspicious'
          });
          toast({ title: "Forensic Audit Complete" });
      } catch (error) {
          toast({ variant: "destructive", title: "Audit Error" });
      } finally {
          setProcessingUid(null);
      }
  };

  const handleExecutePurge = async () => {
    if (!userToPurge) return;
    setProcessingUid(userToPurge.uid);
    
    try {
        const batch = writeBatch(firestore);
        batch.delete(doc(firestore, "users", userToPurge.uid));
        
        const postsRef = collection(firestore, "posts");
        const postsQuery = query(postsRef, where("authorUid", "==", userToPurge.uid));
        const postsSnap = await getDocs(postsQuery);
        postsSnap.docs.forEach(d => batch.delete(d.ref));
        
        const notifRef = collection(firestore, "notifications");
        const notifQuery = query(notifRef, where("userId", "==", userToPurge.uid));
        const notifSnap = await getDocs(notifQuery);
        notifSnap.docs.forEach(d => batch.delete(d.ref));

        await batch.commit();
        await remove(ref(rtdb, `users/${userToPurge.uid}`)).catch(() => {});
        await remove(ref(rtdb, `advocates/${userToPurge.uid}`)).catch(() => {});

        toast({ title: "Forensic Purge Complete", description: "All records erased from Firebase." });
    } catch (error) {
        toast({ variant: "destructive", title: "Purge Refused" });
    } finally {
        setProcessingUid(null);
        setUserToPurge(null);
    }
  };

  const filteredUsers = users.filter(u => 
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div className="flex h-[70vh] items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-primary opacity-20" /></div>;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 px-2 sm:px-6 text-left">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-primary/5 pb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary mb-1">
            <RefreshCw className="h-4 w-4 animate-spin-slow" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Live Firebase Mirror</span>
          </div>
          <h1 className="text-3xl font-black tracking-tighter font-headline text-foreground uppercase">Management Console</h1>
          <p className="text-sm text-muted-foreground font-medium">Real-time oversight of institutional records directly from Firebase.</p>
        </div>
        <div className="flex gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/5 border border-green-500/10">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-[10px] font-black uppercase text-green-600 tracking-widest">Firebase Sync Active</span>
            </div>
        </div>
      </div>

      <Card className="border-primary/5 shadow-2xl rounded-[2rem] overflow-hidden bg-card text-left">
          <CardHeader className="bg-muted/5 border-b border-primary/5 px-6 py-6">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="text-left w-full">
                      <CardTitle className="font-headline font-black text-xl tracking-tight">Citizen Registry Dossier</CardTitle>
                      <CardDescription className="text-xs font-medium mt-1">Direct synchronization with Firestore nodes.</CardDescription>
                  </div>
                  <div className="relative group w-full md:w-80">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary" />
                      <Input 
                          placeholder="Search live registry..." 
                          className="pl-9 h-11 w-full bg-background border-primary/10 rounded-xl text-xs font-bold" 
                          value={searchQuery}
                          onChange={(e) => setSearchSearchQuery(e.target.value)}
                      />
                  </div>
              </div>
          </CardHeader>
          <CardContent className="p-0">
              <ScrollArea className="w-full">
                  <Table className="min-w-[1000px]">
                      <TableHeader className="bg-muted/20">
                          <TableRow>
                              <TableHead className="font-black text-[10px] uppercase tracking-widest pl-6 h-12">User Identity</TableHead>
                              <TableHead className="font-black text-[10px] uppercase tracking-widest text-center h-12">Tier</TableHead>
                              <TableHead className="font-black text-[10px] uppercase tracking-widest text-center h-12">AI Usage</TableHead>
                              <TableHead className="font-black text-[10px] uppercase tracking-widest text-center h-12">Status</TableHead>
                              <TableHead className="font-black text-[10px] uppercase tracking-widest text-center h-12">Forensic Audit</TableHead>
                              <TableHead className="font-black text-[10px] uppercase tracking-widest text-right pr-6 h-12">Controls</TableHead>
                          </TableRow>
                      </TableHeader>
                      <TableBody>
                          {filteredUsers.map((user) => {
                              const isActive = user.isBlocked === false || user.isBlocked === undefined;
                              const isProtected = ADMIN_EMAILS.includes(user.email.toLowerCase());
                              return (
                                <TableRow key={user.uid} className={cn("hover:bg-muted/5 border-b border-primary/5", !isActive && "bg-red-500/5")}>
                                    <TableCell className="pl-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10 border border-primary/10 rounded-xl">
                                                <AvatarImage src={user.photoURL} className="object-cover" />
                                                <AvatarFallback className="font-black bg-primary/5 text-primary">{user.firstName?.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col text-left">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="font-bold text-sm tracking-tight">{user.firstName} {user.lastName}</span>
                                                    {isProtected && <BadgeCheck className="h-3.5 w-3.5 text-blue-500" />}
                                                </div>
                                                <span className="text-[10px] text-muted-foreground font-medium">{user.email}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant="secondary" className="font-black text-[8px] uppercase bg-primary/5 text-primary">
                                            {(user.subscriptionType || 'FREE').replace('_', ' ')}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <span className="font-mono font-black text-xs text-primary">{user.aiUsageCount || 0} ops</span>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Switch 
                                            checked={isActive} 
                                            onCheckedChange={(checked) => handleToggleStatus(user, !checked)}
                                            disabled={processingUid === user.uid || isProtected}
                                        />
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {user.securityStatus === 'verified' ? (
                                            <Badge className="bg-blue-500/10 text-blue-600 text-[8px] font-black uppercase">Cleared</Badge>
                                        ) : (
                                            <Button size="sm" variant="ghost" className="h-7 px-3 text-[8px] font-black uppercase text-primary border border-primary/10 rounded-full" onClick={() => handleVerifyUser(user)} disabled={processingUid === user.uid}>
                                                Run Audit
                                            </Button>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right pr-6">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-muted" disabled={processingUid === user.uid}>
                                                    {processingUid === user.uid ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreHorizontal className="h-4 w-4" />}
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-52 p-2 rounded-2xl shadow-2xl glass border-primary/10">
                                                <DropdownMenuLabel className="text-[9px] font-black uppercase tracking-widest opacity-40 px-3">Registry Protocols</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => sendPasswordResetEmail(auth, user.email).then(() => toast({ title: "Reset Dispatched" }))} className="rounded-xl font-bold text-xs h-10 px-3 cursor-pointer gap-3">
                                                    <KeyRound className="h-4 w-4 opacity-40" /> Reset Password
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator className="opacity-5" />
                                                <DropdownMenuItem 
                                                    className={cn("rounded-xl font-bold text-xs h-10 px-3 cursor-pointer text-destructive focus:text-destructive", isProtected && "opacity-50")}
                                                    onClick={() => !isProtected && setUserToPurge(user)}
                                                    disabled={isProtected}
                                                >
                                                    {isProtected ? <Lock className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
                                                    Purge Node
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                              );
                          })}
                      </TableBody>
                  </Table>
                  <ScrollBar orientation="horizontal" />
              </ScrollArea>
          </CardContent>
      </Card>

      <AlertDialog open={!!userToPurge} onOpenChange={(open) => !open && setUserToPurge(null)}>
          <AlertDialogContent className="rounded-[2.5rem] p-8 border-none shadow-2xl glass text-left">
              <AlertDialogHeader className="text-left">
                  <div className="p-4 rounded-full bg-destructive/10 w-fit mx-auto mb-4"><ShieldAlert className="h-10 w-10 text-destructive animate-pulse" /></div>
                  <AlertDialogTitle className="font-black text-2xl tracking-tighter text-center">Confirm Permanent Purge</AlertDialogTitle>
                  <AlertDialogDescription className="text-center text-sm font-medium leading-relaxed">
                      Terminal deactivation of node <strong>{userToPurge?.firstName}</strong>. This forensic erasure will remove all profile data, posts, and registry logs from Firebase Firestore and Real-time Database.
                  </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <AlertDialogCancel className="font-bold h-12 rounded-xl flex-1">Abort</AlertDialogCancel>
                  <AlertDialogAction onClick={handleExecutePurge} className="bg-destructive text-white hover:bg-destructive/90 font-black h-12 rounded-xl flex-1 uppercase tracking-widest text-[10px]">Execute Purge</AlertDialogAction>
              </div>
          </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
