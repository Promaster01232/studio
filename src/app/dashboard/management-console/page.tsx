"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useFirestore, useAuth, useDatabase } from "@/firebase";
import { collection, doc, getDoc, onSnapshot, updateDoc, deleteDoc, query, where } from "firebase/firestore";
import { ref, remove, update } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import { 
  ShieldCheck, 
  Loader2, 
  Search, 
  Trash2, 
  MoreHorizontal,
  Receipt,
  Eye,
  Calendar,
  History,
  CheckCircle2,
  User,
  PlusCircle,
  Activity,
  Zap,
  Clock
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface UserRecord {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  userType: string;
  photoURL?: string;
  isAdmin?: boolean;
  isBlocked?: boolean;
  createdAt?: any;
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
  'piyushkumrsingh23399@gmail.com',
  'nyayasahayakhelp@gmail.com'
];

function TransactionDetailDialog({ tx }: { tx: TransactionRecord }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <button className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary transition-all flex items-center justify-center">
                    <Eye className="h-4 w-4" />
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md rounded-[2.5rem] border-none shadow-2xl glass p-8 text-left">
                <DialogHeader className="border-none mb-6 text-left">
                    <div className="flex items-center gap-3 mb-2 text-primary">
                        <Receipt className="h-5 w-5" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Forensic Ledger Audit</span>
                    </div>
                    <DialogTitle className="text-2xl font-black tracking-tighter">Transaction Protocol</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    <div className="p-6 rounded-2xl border space-y-4 shadow-inner bg-green-500/5 border-green-500/10">
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black uppercase text-muted-foreground opacity-60">Status</span>
                            <span className="text-sm font-black text-green-600 uppercase tracking-widest">SUCCESS</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black uppercase text-muted-foreground opacity-60">Value</span>
                            <span className="text-lg font-black tracking-tight">₹{(tx.amount || 0).toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black uppercase text-muted-foreground opacity-60">Clearance Node</span>
                            <Badge variant="outline" className="font-bold text-[10px] uppercase tracking-widest border-primary/20">{tx.planId?.replace('_', ' ') || 'N/A'}</Badge>
                        </div>
                    </div>

                    <div className="space-y-4 text-left">
                        <div className="grid gap-4">
                            <div className="flex items-start gap-3">
                                <div className="p-2 rounded-lg bg-muted shadow-inner"><User className="h-3.5 w-3.5 text-muted-foreground" /></div>
                                <div className="text-left">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Citizen Identity</p>
                                    <p className="text-xs font-bold">Identity Masked for Privacy</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="p-2 rounded-lg bg-muted shadow-inner"><Calendar className="h-3.5 w-3.5 text-muted-foreground" /></div>
                                <div className="text-left">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Timestamp</p>
                                    <p className="text-xs font-bold">{tx.createdAt ? format(tx.createdAt.toDate(), 'PPP p') : 'N/A'}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="p-2 rounded-lg bg-muted shadow-inner"><History className="h-3.5 w-3.5 text-muted-foreground" /></div>
                                <div className="text-left">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">TXID Registry</p>
                                    <p className="text-[10px] font-mono font-bold break-all opacity-80">{tx.paymentId}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default function ManagementConsolePage(props: { params: Promise<any>, searchParams: Promise<any> }) {
  const _params = use(props.params); 
  const _searchParams = use(props.searchParams);

  const firestore = useFirestore();
  const rtdb = useDatabase();
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchSearchQuery] = useState("");
  const [userToPurge, setUserToPurge] = useState<UserRecord | null>(null);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (user) => {
        if (!user) { router.replace('/login'); return; }
        const adminDoc = await getDoc(doc(firestore, "users", user.uid));
        const adminData = adminDoc.data() as any;
        if (!ADMIN_EMAILS.includes(user.email?.toLowerCase() || '') && !adminData?.isAdmin) {
            toast({ variant: "destructive", title: "Access Denied" });
            router.replace('/dashboard');
            return;
        }

        const unsubUsers = onSnapshot(collection(firestore, "users"), (snapshot) => {
            const list = snapshot.docs.map(doc => ({ ...doc.data(), uid: doc.id } as UserRecord));
            setUsers(list.sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0)));
            setLoading(false);
        });

        const transRef = collection(firestore, "transactions");
        const qTrans = query(transRef, where("status", "==", "CAPTURED"));
        const unsubTrans = onSnapshot(qTrans, (snapshot) => {
            const list = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as TransactionRecord));
            setTransactions(list.sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0)));
        });

        return () => { unsubUsers(); unsubTrans(); };
    });
    return () => unsubAuth();
  }, [firestore, auth, router, toast, rtdb]);

  const handleToggleStatus = async (user: UserRecord, isBlocked: boolean) => {
    if (ADMIN_EMAILS.includes(user.email.toLowerCase())) return;
    try {
        await updateDoc(doc(firestore, "users", user.uid), { isBlocked });
        await update(ref(rtdb, `users/${user.uid}`), { isBlocked });
        toast({ title: isBlocked ? "Node Suspended" : "Node Activated" });
    } catch (e) {}
  };

  const filteredUsers = users.filter(u => 
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div className="flex h-[70vh] items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-primary opacity-20" /></div>;

  return (
    <div className="max-w-7xl auto space-y-8 pb-20 px-4 sm:px-6 text-left">
      <PageHeader title="Management Console" description="Statutory oversight of the citizen registry and success-only transaction ledger." />

      <Tabs defaultValue="users" className="w-full">
          <TabsList className="h-12 bg-muted/20 p-1 rounded-xl mb-6">
              <TabsTrigger value="users" className="font-bold text-xs uppercase tracking-widest px-8">Citizen Registry</TabsTrigger>
              <TabsTrigger value="transactions" className="font-bold text-xs uppercase tracking-widest px-8">Verified Ledger</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card className="border-primary/5 shadow-2xl rounded-[2.5rem] overflow-hidden bg-card text-left">
                <CardHeader className="bg-muted/5 border-b border-primary/5 px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="space-y-1 text-left">
                        <CardTitle className="font-black text-xl text-primary uppercase tracking-tight">Citizen Registry Dossier</CardTitle>
                        <CardDescription className="text-[10px] font-bold uppercase tracking-widest opacity-60">Identity nodes active in system.</CardDescription>
                    </div>
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input placeholder="Search identity..." className="w-64 h-11 rounded-xl pl-10 font-bold border-primary/5 shadow-none" value={searchQuery} onChange={(e) => setSearchSearchQuery(e.target.value)} />
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <ScrollArea className="w-full">
                        <Table className="min-w-[1000px]">
                            <TableHeader className="bg-muted/20">
                                <TableRow>
                                    <TableHead className="font-black text-[10px] uppercase tracking-widest pl-6 h-12">User Identity</TableHead>
                                    <TableHead className="font-black text-[10px] uppercase tracking-widest text-center h-12">Tier</TableHead>
                                    <TableHead className="font-black text-[10px] uppercase tracking-widest text-center h-12">Node Status</TableHead>
                                    <TableHead className="font-black text-[10px] uppercase tracking-widest text-right pr-6 h-12">Controls</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUsers.map((user) => {
                                    const isProtected = ADMIN_EMAILS.includes(user.email.toLowerCase());
                                    return (
                                        <TableRow key={user.uid} className="hover:bg-muted/5 border-b border-primary/5 transition-colors">
                                            <TableCell className="pl-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-10 w-10 border border-primary/10 rounded-xl shadow-sm">
                                                        <AvatarImage src={user.photoURL} className="object-cover" />
                                                        <AvatarFallback className="font-black bg-primary/5 text-primary">{user.firstName?.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col text-left">
                                                        <span className="font-black text-sm tracking-tight">{user.firstName} {user.lastName}</span>
                                                        <span className="text-[10px] text-muted-foreground font-medium lowercase">{user.email}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant="secondary" className="font-black text-[8px] uppercase tracking-widest px-3 py-1 bg-primary/5 text-primary border-primary/10">{user.subscriptionType || 'FREE'}</Badge>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <div className="flex items-center justify-center">
                                                    <Switch checked={!user.isBlocked} onCheckedChange={(c) => handleToggleStatus(user, !c)} disabled={isProtected} className="data-[state=checked]:bg-green-500" />
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right pr-6">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild><button className="h-9 w-9 rounded-xl hover:bg-muted flex items-center justify-center transition-all active:scale-90"><MoreHorizontal className="h-4 w-4" /></button></DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-52 p-2 rounded-xl glass border-primary/10 shadow-2xl">
                                                        <DropdownMenuItem onClick={() => setUserToPurge(user)} className="rounded-lg h-10 font-bold text-xs cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10 gap-2.5">
                                                            <Trash2 className="h-4 w-4" /> <span>Purge Node Registry</span>
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
          </TabsContent>

          <TabsContent value="transactions">
            <Card className="border-primary/5 shadow-2xl rounded-[2.5rem] overflow-hidden bg-card text-left">
                <CardHeader className="bg-muted/5 border-b border-primary/5 px-6 py-6 flex items-center justify-between">
                    <div className="space-y-1 text-left">
                        <CardTitle className="font-black text-xl text-green-600 uppercase tracking-tight">Verified Statutory Ledger</CardTitle>
                        <CardDescription className="text-[10px] font-bold uppercase tracking-widest opacity-60">Success-only financial captures.</CardDescription>
                    </div>
                    <Badge className="bg-green-500/10 text-green-600 border-green-500/20 font-black text-[8px] uppercase tracking-widest px-4 py-1.5 rounded-full">Success Protocol Active</Badge>
                </CardHeader>
                <CardContent className="p-0">
                    <ScrollArea className="w-full">
                        <Table className="min-w-[1000px]">
                            <TableHeader className="bg-muted/20">
                                <TableRow>
                                    <TableHead className="font-black text-[10px] uppercase tracking-widest pl-6 h-12">Timestamp</TableHead>
                                    <TableHead className="font-black text-[10px] uppercase tracking-widest text-center h-12">Authorization Status</TableHead>
                                    <TableHead className="font-black text-[10px] uppercase tracking-widest text-center h-12">Value (₹)</TableHead>
                                    <TableHead className="font-black text-[10px] uppercase tracking-widest text-right pr-6 h-12">Forensic Audit</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {transactions.length > 0 ? transactions.map((tx) => (
                                    <TableRow key={tx.id} className="hover:bg-muted/5 border-b border-primary/5 transition-colors">
                                        <TableCell className="pl-6 py-4">
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground">
                                                <Clock className="h-3 w-3 opacity-40" />
                                                {tx.createdAt ? format(tx.createdAt.toDate(), 'PP p') : 'Syncing...'}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex items-center justify-center gap-2 text-green-600 px-4 py-1.5 rounded-full bg-green-500/5 border border-green-500/10 w-fit mx-auto">
                                                <CheckCircle2 className="h-3.5 w-3.5" />
                                                <span className="font-black text-[9px] uppercase tracking-widest">Payment Success</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <p className="font-mono font-black text-xs text-foreground">₹{(tx.amount || 0).toLocaleString('en-IN')}</p>
                                        </TableCell>
                                        <TableCell className="text-right pr-6">
                                            <TransactionDetailDialog tx={tx} />
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-48 text-center">
                                            <div className="flex flex-col items-center gap-4 opacity-40">
                                                <Activity className="h-12 w-12 text-muted-foreground" />
                                                <p className="font-black text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Registry clear // No successful captures recorded.</p>
                                            </div>
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

      <AlertDialog open={!!userToPurge} onOpenChange={(o) => !o && setUserToPurge(null)}>
          <AlertDialogContent className="rounded-[2.5rem] p-10 border-none shadow-2xl glass text-left">
              <AlertDialogHeader>
                  <div className="bg-destructive/10 p-4 rounded-2xl w-fit mb-4">
                    <Trash2 className="h-8 w-8 text-destructive" />
                  </div>
                  <AlertDialogTitle className="font-black text-3xl tracking-tighter uppercase leading-none">Confirm Statutory Purge</AlertDialogTitle>
                  <AlertDialogDescription className="text-sm font-medium pt-4 leading-relaxed">
                      You are about to execute an irreversible erasure of the node belonging to <span className="text-foreground font-black">{userToPurge?.firstName} {userToPurge?.lastName}</span>. All registry records will be purged from both Firestore and the Real-time Database.
                  </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="flex gap-4 mt-10">
                  <AlertDialogCancel className="font-bold h-14 rounded-2xl flex-1 border-primary/10 hover:bg-primary/5 transition-all">Abort Protocol</AlertDialogCancel>
                  <Button onClick={async () => {
                      if (userToPurge) {
                        await deleteDoc(doc(firestore, "users", userToPurge.uid));
                        await remove(ref(rtdb, `users/${userToPurge.uid}`));
                        setUserToPurge(null);
                        toast({ title: "Node Purged", description: "Registry data erased successfully." });
                      }
                  }} variant="destructive" className="font-black h-14 rounded-2xl flex-1 uppercase tracking-widest text-xs shadow-xl shadow-destructive/20 active:scale-95 transition-all text-center">
                      <Trash2 className="mr-2 h-4 w-4" /> Execute Purge
                  </Button>
              </div>
          </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
