
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useFirestore, useAuth, useDatabase } from "@/firebase";
import { collection, doc, getDoc, onSnapshot, updateDoc, query, where, getDocs, writeBatch, orderBy, limit } from "firebase/firestore";
import { ref, remove, update } from "firebase/database";
import { sendPasswordResetEmail, onAuthStateChanged } from "firebase/auth";
import { 
  ShieldCheck, 
  Loader2, 
  Search, 
  ShieldAlert, 
  BadgeCheck, 
  MoreHorizontal,
  Trash2,
  Activity,
  KeyRound,
  Zap,
  RefreshCw,
  Lock,
  Database,
  Cloud,
  CreditCard,
  History,
  TrendingUp,
  Receipt
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
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface UserRecord {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  userType: string;
  photoURL?: string;
  isAdmin?: boolean;
  isBlocked?: boolean;
  securityStatus?: 'verified' | 'suspicious' | 'flagged' | 'pending_audit';
  createdAt?: any;
  mobileNumber?: string;
  aiUsageCount?: number;
  subscriptionType?: string;
}

interface TransactionRecord {
    id: string;
    userId: string;
    userEmail: string;
    userName: string;
    planId: string;
    amount: number;
    paymentId: string;
    createdAt: any;
    status: string;
}

const ADMIN_EMAILS = [
  'enterspaceindia@gmail.com', 
  'piyushkumarsingh23323@gmail.com',
  'piyushkumrsingh23323@gmail.com',
  'piyushkumrsingh23399@gmail.com',
  'nyayasahayakhelp@gmail.com'
];

export default function ManagementConsolePage() {
  const firestore = useFirestore();
  const rtdb = useDatabase();
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);
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
            toast({ variant: "destructive", title: "Access Denied", description: "Admin credentials required." });
            router.replace('/dashboard');
            return;
        }

        // Users Listener
        const usersCol = collection(firestore, "users");
        const unsubscribeSnapshot = onSnapshot(usersCol, (snapshot) => {
            setIsLive(!snapshot.metadata.fromCache);
            const list = snapshot.docs.map(doc => ({ ...doc.data(), uid: doc.id } as UserRecord));
            setUsers(list.sort((a, b) => {
                const dateA = a.createdAt?.toMillis ? a.createdAt.toMillis() : Number(a.createdAt || 0);
                const dateB = b.createdAt?.toMillis ? b.createdAt.toMillis() : Number(b.createdAt || 0);
                return dateB - dateA;
            }));
            setLoading(false);
        });

        // Transactions Listener
        const transCol = collection(firestore, "transactions");
        const qTrans = query(transCol, orderBy("createdAt", "desc"), limit(50));
        const unsubscribeTrans = onSnapshot(qTrans, (snapshot) => {
            const list = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as TransactionRecord));
            setTransactions(list);
        });

        return () => {
            unsubscribeSnapshot();
            unsubscribeTrans();
        }
    });

    return () => unsubAuth();
  }, [firestore, auth, router, toast]);

  const handleToggleStatus = async (user: UserRecord, isBlocked: boolean) => {
    if (ADMIN_EMAILS.includes(user.email.toLowerCase())) {
        toast({ variant: "destructive", title: "Protection Active", description: "Root authority nodes cannot be suspended." });
        return;
    }

    setProcessingUid(user.uid);
    const userRef = doc(firestore, "users", user.uid);
    try {
        await updateDoc(userRef, { isBlocked });
        await update(ref(rtdb, `users/${user.uid}`), { isBlocked });
        toast({ title: isBlocked ? "Node Suspended" : "Node Activated" });
    } catch (err) {
        toast({ variant: "destructive", title: "Update Refused" });
    } finally {
        setProcessingUid(null);
    }
  };

  const handleVerifyUser = async (user: UserRecord) => {
      setProcessingUid(user.uid);
      try {
          const verification = await verifyEmailAuthenticity({ email: user.email });
          await updateDoc(doc(firestore, "users", user.uid), { 
              securityStatus: verification.isAuthentic ? 'verified' : 'suspicious'
          });
          toast({ title: "Forensic Audit Complete", description: verification.isAuthentic ? "Node cleared." : "Node flagged." });
      } catch (error) {
          toast({ variant: "destructive", title: "Audit Error" });
      } finally {
          setProcessingUid(null);
      }
  };

  const handleExecutePurge = async () => {
    if (!userToPurge) return;
    
    if (ADMIN_EMAILS.includes(userToPurge.email.toLowerCase())) {
        toast({ variant: "destructive", title: "Protection Active", description: "Root authority nodes are immutable." });
        setUserToPurge(null);
        return;
    }

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

        toast({ title: "Forensic Purge Complete", description: "Identity, transmissions, and alerts erased permanently." });
    } catch (error) {
        console.error("Purge Error:", error);
        toast({ variant: "destructive", title: "Purge Refused", description: "System authority check failed." });
    } finally {
        setProcessingUid(null);
        setUserToPurge(null);
    }
  };

  const filteredUsers = users.filter(u => 
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
      total: users.length,
      verified: users.filter(u => u.securityStatus === 'verified').length,
      unlimited: users.filter(u => u.subscriptionType?.includes('unlimited') || ADMIN_EMAILS.includes(u.email.toLowerCase())).length,
      flagged: users.filter(u => u.isBlocked).length,
      totalRevenue: transactions.reduce((acc, curr) => acc + curr.amount, 0)
  };

  if (loading) return (
    <div className="flex flex-col h-[70vh] items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary opacity-20" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/40 animate-pulse">Establishing Live Sync...</p>
    </div>
  );

  return (
    <div className="max-w-7xl auto space-y-8 pb-20 px-2 sm:px-6 text-left">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-primary/5 pb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary mb-1">
            <RefreshCw className="h-4 w-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Live Firebase Hub</span>
          </div>
          <h1 className="text-3xl font-black tracking-tighter font-headline text-foreground uppercase">Management Console</h1>
          <p className="text-sm text-muted-foreground font-medium">Real-time statutory oversight of the citizen registry and transaction ledger.</p>
        </div>
        <div className="flex flex-wrap gap-3">
            <div className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl border shadow-inner transition-all",
                isLive ? "bg-green-500/5 border-green-500/10 text-green-600" : "bg-amber-500/5 border-amber-500/10 text-amber-600"
            )}>
                <Cloud className="h-3 w-3" />
                <span className="text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                    <div className={cn("h-1.5 w-1.5 rounded-full animate-pulse", isLive ? "bg-green-500" : "bg-amber-500")} />
                    {isLive ? "Sync: Direct" : "Sync: Cache"}
                </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/5 border border-primary/10">
                <Activity className="h-3 w-3 text-primary animate-pulse" />
                <span className="text-[9px] font-black uppercase text-primary tracking-widest">{stats.total} Nodes Active</span>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
              { label: "Total Registry", value: stats.total, icon: Database, color: "text-blue-500" },
              { label: "AI Verified", value: stats.verified, icon: ShieldCheck, color: "text-emerald-500" },
              { label: "Elite Access", value: stats.unlimited, icon: Zap, color: "text-amber-500" },
              { label: "Blocked Nodes", value: stats.flagged, icon: ShieldAlert, color: "text-red-500" },
              { label: "Total Revenue", value: `₹${stats.totalRevenue.toLocaleString('en-IN')}`, icon: TrendingUp, color: "text-green-600" }
          ].map((stat, i) => (
              <Card key={i} className="glass border-primary/5 p-4 rounded-2xl shadow-sm text-left">
                  <div className="flex items-center justify-between mb-2">
                      <stat.icon className={cn("h-4 w-4 opacity-40", stat.color)} />
                      <span className="text-[10px] font-black uppercase tracking-widest opacity-30">STAT</span>
                  </div>
                  <p className="text-2xl font-black tracking-tighter">{stat.value}</p>
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-1">{stat.label}</p>
              </Card>
          ))}
      </div>

      <Tabs defaultValue="users" className="w-full">
          <TabsList className="h-12 bg-muted/20 p-1 rounded-xl mb-6">
              <TabsTrigger value="users" className="font-bold text-xs uppercase tracking-widest px-8">Citizen Registry</TabsTrigger>
              <TabsTrigger value="transactions" className="font-bold text-xs uppercase tracking-widest px-8">Transaction Ledger</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card className="border-primary/5 shadow-2xl rounded-[2.5rem] overflow-hidden bg-card text-left">
                <CardHeader className="bg-muted/5 border-b border-primary/5 px-6 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="text-left w-full">
                            <CardTitle className="font-headline font-black text-xl tracking-tight text-primary">Citizen Registry Dossier</CardTitle>
                            <CardDescription className="text-[10px] font-bold uppercase tracking-widest opacity-60">Verified Firestore Mirror. Root nodes protected by statutory protocol.</CardDescription>
                        </div>
                        <div className="relative group w-full md:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <Input 
                                placeholder="Search identity records..." 
                                className="pl-9 h-11 w-full bg-background border-primary/10 rounded-xl text-xs font-bold focus:border-primary shadow-sm" 
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
                                    <TableHead className="font-black text-[10px] uppercase tracking-widest text-center h-12">Usage</TableHead>
                                    <TableHead className="font-black text-[10px] uppercase tracking-widest text-center h-12">Status</TableHead>
                                    <TableHead className="font-black text-[10px] uppercase tracking-widest text-center h-12">Forensic Audit</TableHead>
                                    <TableHead className="font-black text-[10px] uppercase tracking-widest text-right pr-6 h-12">Controls</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <AnimatePresence mode="popLayout">
                                    {filteredUsers.length > 0 ? filteredUsers.map((user) => {
                                        const isActive = user.isBlocked === false || user.isBlocked === undefined;
                                        const isProtected = ADMIN_EMAILS.includes(user.email.toLowerCase());
                                        return (
                                            <motion.tr 
                                                layout
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                key={user.uid} 
                                                className={cn("hover:bg-muted/5 border-b border-primary/5 transition-colors", !isActive && "bg-red-500/5")}
                                            >
                                                <TableCell className="pl-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-10 w-10 border border-primary/10 rounded-xl shadow-sm">
                                                            <AvatarImage src={user.photoURL} className="object-cover" />
                                                            <AvatarFallback className="font-black bg-primary/5 text-primary">{user.firstName?.charAt(0)}</AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex flex-col text-left">
                                                            <div className="flex items-center gap-1.5">
                                                                <span className="font-bold text-sm tracking-tight">{user.firstName} {user.lastName}</span>
                                                                {isProtected && <BadgeCheck className="h-3.5 w-3.5 text-blue-500" />}
                                                            </div>
                                                            <span className="text-[10px] text-muted-foreground font-medium lowercase">{user.email}</span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Badge variant="secondary" className="font-black text-[8px] uppercase bg-primary/5 text-primary border-primary/10">
                                                        {isProtected ? 'INSTITUTIONAL ANNUAL' : (user.subscriptionType || 'FREE').replace('_', ' ')}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <div className="flex flex-col items-center">
                                                        <span className="font-mono font-black text-xs text-primary">{user.aiUsageCount || 0}</span>
                                                        <span className="text-[8px] font-bold text-muted-foreground uppercase opacity-40">Ops</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Switch 
                                                        checked={isActive} 
                                                        onCheckedChange={(checked) => handleToggleStatus(user, !checked)}
                                                        disabled={processingUid === user.uid || isProtected}
                                                        className="data-[state=checked]:bg-primary"
                                                    />
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {user.securityStatus === 'verified' || isProtected ? (
                                                        <div className="flex items-center justify-center gap-1.5 text-blue-600">
                                                            <ShieldCheck className="h-3 w-3" />
                                                            <span className="text-[8px] font-black uppercase">Cleared</span>
                                                        </div>
                                                    ) : (
                                                        <Button size="sm" variant="ghost" className="h-7 px-3 text-[8px] font-black uppercase text-primary border border-primary/10 rounded-full hover:bg-primary/5" onClick={() => handleVerifyUser(user)} disabled={processingUid === user.uid}>
                                                            Run Audit
                                                        </Button>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right pr-6">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <button className="h-9 w-9 rounded-xl hover:bg-muted flex items-center justify-center transition-all" disabled={processingUid === user.uid}>
                                                                {processingUid === user.uid ? <Loader2 className="h-4 w-4 animate-spin text-primary" /> : <MoreHorizontal className="h-4 w-4 text-muted-foreground" />}
                                                            </button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-52 p-2 rounded-2xl shadow-2xl glass border-primary/10">
                                                            <DropdownMenuLabel className="text-[9px] font-black uppercase tracking-widest opacity-40 px-3">System Protocol</DropdownMenuLabel>
                                                            <DropdownMenuItem onClick={() => sendPasswordResetEmail(auth, user.email).then(() => toast({ title: "Reset Dispatched" }))} className="rounded-xl font-bold text-xs h-10 px-3 cursor-pointer gap-3" disabled={isProtected}>
                                                                <KeyRound className="h-4 w-4 opacity-40" /> Reset Credentials
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator className="opacity-5" />
                                                            <DropdownMenuItem 
                                                                className={cn("rounded-xl font-bold text-xs h-10 px-3 cursor-pointer text-destructive focus:text-destructive", isProtected && "opacity-50")}
                                                                onClick={() => !isProtected && setUserToPurge(user)}
                                                                disabled={isProtected}
                                                            >
                                                                {isProtected ? <Lock className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
                                                                Purge Registry Node
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </motion.tr>
                                        );
                                    }) : (
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-32 text-center text-muted-foreground font-bold uppercase tracking-widest opacity-40">
                                                No matching Firestore documents.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </AnimatePresence>
                            </TableBody>
                        </Table>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions">
            <Card className="border-primary/5 shadow-2xl rounded-[2.5rem] overflow-hidden bg-card text-left">
                <CardHeader className="bg-muted/5 border-b border-primary/5 px-6 py-6">
                    <CardTitle className="font-headline font-black text-xl tracking-tight text-green-600">Statutory Transaction Ledger</CardTitle>
                    <CardDescription className="text-[10px] font-bold uppercase tracking-widest opacity-60">Live feed of all statutory upgrades and revenue capture events.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <ScrollArea className="w-full">
                        <Table className="min-w-[1000px]">
                            <TableHeader className="bg-muted/20">
                                <TableRow>
                                    <TableHead className="font-black text-[10px] uppercase tracking-widest pl-6 h-12">Timestamp</TableHead>
                                    <TableHead className="font-black text-[10px] uppercase tracking-widest h-12">Citizen Identity</TableHead>
                                    <TableHead className="font-black text-[10px] uppercase tracking-widest h-12">Clearance Node</TableHead>
                                    <TableHead className="font-black text-[10px] uppercase tracking-widest text-center h-12">Value (₹)</TableHead>
                                    <TableHead className="font-black text-[10px] uppercase tracking-widest text-center h-12">Statutory Status</TableHead>
                                    <TableHead className="font-black text-[10px] uppercase tracking-widest text-right pr-6 h-12">TxID (RXP)</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {transactions.length > 0 ? transactions.map((tx) => (
                                    <TableRow key={tx.id} className="hover:bg-muted/5 border-b border-primary/5 transition-colors">
                                        <TableCell className="pl-6 py-4">
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground">
                                                <History className="h-3 w-3" />
                                                {tx.createdAt ? formatDistanceToNow(tx.createdAt.toDate(), { addSuffix: true }) : 'Syncing...'}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-xs">{tx.userName}</span>
                                                <span className="text-[10px] opacity-60">{tx.userEmail}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="font-black text-[8px] uppercase tracking-widest border-primary/20 text-primary bg-primary/5">
                                                {tx.planId.replace('_', ' ')}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-center font-mono font-black text-xs">
                                            ₹{tx.amount.toLocaleString('en-IN')}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex items-center justify-center gap-1.5 text-green-600 font-black text-[8px] uppercase tracking-widest bg-green-500/10 px-2 py-1 rounded-full w-fit mx-auto border border-green-500/20">
                                                <ShieldCheck className="h-2.5 w-2.5" />
                                                {tx.status}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right pr-6 font-mono text-[9px] opacity-40 uppercase">
                                            {tx.paymentId}
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-32 text-center text-muted-foreground font-bold uppercase tracking-widest opacity-40">
                                            Registry Ledger Clear.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                </CardContent>
            </Card>
          </TabsContent>
      </Tabs>

      <AlertDialog open={!!userToPurge} onOpenChange={(open) => !open && setUserToPurge(null)}>
          <AlertDialogContent className="rounded-[2.5rem] p-8 border-none shadow-2xl glass text-left">
              <AlertDialogHeader className="text-left">
                  <div className="p-4 rounded-full bg-destructive/10 w-fit mx-auto mb-4"><ShieldAlert className="h-10 w-10 text-destructive animate-pulse" /></div>
                  <AlertDialogTitle className="font-black text-2xl tracking-tighter text-center">Confirm Statutory Purge</AlertDialogTitle>
                  <AlertDialogDescription className="text-center text-sm font-medium leading-relaxed">
                      Terminal deactivation of node <strong>{userToPurge?.firstName}</strong>. This atomic forensic erasure will remove all profile data and associated transmissions. Irreversible.
                  </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <AlertDialogCancel className="font-bold h-12 rounded-xl flex-1 border-primary/10">Abort</AlertDialogCancel>
                  <AlertDialogAction onClick={handleExecutePurge} className="bg-destructive text-white hover:bg-destructive/90 font-black h-12 rounded-xl flex-1 uppercase tracking-widest text-[10px]">Execute Purge</AlertDialogAction>
              </div>
          </AlertDialogContent>
      </AlertDialog>

      <div className="pt-12 text-center opacity-30">
          <p className="text-[8px] font-black uppercase tracking-[0.6em] text-muted-foreground">NYAYASAHAYAK.IN // FIREBASE REAL-TIME MIRROR // ALPHA-4</p>
      </div>
    </div>
  );
}
