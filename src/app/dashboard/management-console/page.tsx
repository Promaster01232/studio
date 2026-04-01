"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
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
  PlusCircle
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
                <DialogHeader className="border-none mb-6">
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

                    <div className="space-y-4">
                        <div className="grid gap-4">
                            <div className="flex items-start gap-3">
                                <div className="p-2 rounded-lg bg-muted shadow-inner"><User className="h-3.5 w-3.5 text-muted-foreground" /></div>
                                <div className="text-left">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Citizen Identity</p>
                                    <p className="text-xs font-bold">{tx.userName}</p>
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

export default function ManagementConsolePage() {
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

        onSnapshot(collection(firestore, "users"), (snapshot) => {
            const list = snapshot.docs.map(doc => ({ ...doc.data(), uid: doc.id } as UserRecord));
            setUsers(list.sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0)));
            setLoading(false);
        });

        // Strictly query for CAPTURED (Success) transactions only
        const transRef = collection(firestore, "transactions");
        const qTrans = query(transRef, where("status", "==", "CAPTURED"));
        onSnapshot(qTrans, (snapshot) => {
            const list = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as TransactionRecord));
            setTransactions(list.sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0)));
        });
    });
    return () => unsubAuth();
  }, [firestore, auth, router, toast]);

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
      <PageHeader title="Management Console" description="Statutory oversight of the citizen registry and transaction ledger." />

      <Tabs defaultValue="users" className="w-full">
          <TabsList className="h-12 bg-muted/20 p-1 rounded-xl mb-6">
              <TabsTrigger value="users" className="font-bold text-xs uppercase tracking-widest px-8">Citizen Registry</TabsTrigger>
              <TabsTrigger value="transactions" className="font-bold text-xs uppercase tracking-widest px-8">Verified Ledger</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card className="border-primary/5 shadow-2xl rounded-[2.5rem] overflow-hidden bg-card text-left">
                <CardHeader className="bg-muted/5 border-b border-primary/5 px-6 py-6 flex flex-row items-center justify-between">
                    <CardTitle className="font-black text-xl text-primary">Citizen Registry Dossier</CardTitle>
                    <Input placeholder="Search..." className="w-64 h-10 rounded-xl" value={searchQuery} onChange={(e) => setSearchSearchQuery(e.target.value)} />
                </CardHeader>
                <CardContent className="p-0">
                    <ScrollArea className="w-full">
                        <Table className="min-w-[1000px]">
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="font-black text-[10px] uppercase pl-6 h-12">User Identity</TableHead>
                                    <TableHead className="font-black text-[10px] uppercase text-center h-12">Tier</TableHead>
                                    <TableHead className="font-black text-[10px] uppercase text-center h-12">Status</TableHead>
                                    <TableHead className="font-black text-[10px] uppercase text-right pr-6 h-12">Controls</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUsers.map((user) => {
                                    const isProtected = ADMIN_EMAILS.includes(user.email.toLowerCase());
                                    return (
                                        <TableRow key={user.uid} className="hover:bg-muted/5 border-b border-primary/5">
                                            <TableCell className="pl-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-10 w-10 border border-primary/10 rounded-xl">
                                                        <AvatarImage src={user.photoURL} className="object-cover" />
                                                        <AvatarFallback>{user.firstName?.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col text-left">
                                                        <span className="font-bold text-sm tracking-tight">{user.firstName} {user.lastName}</span>
                                                        <span className="text-[10px] text-muted-foreground lowercase">{user.email}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant="secondary" className="font-black text-[8px] uppercase">{user.subscriptionType || 'FREE'}</Badge>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Switch checked={!user.isBlocked} onCheckedChange={(c) => handleToggleStatus(user, !c)} disabled={isProtected} />
                                            </TableCell>
                                            <TableCell className="text-right pr-6">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild><button className="h-9 w-9 rounded-xl hover:bg-muted flex items-center justify-center transition-all"><MoreHorizontal className="h-4 w-4" /></button></DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-52 p-2 rounded-xl glass border-primary/10">
                                                        <DropdownMenuItem onClick={() => setUserToPurge(user)} className="text-destructive" disabled={isProtected}><Trash2 className="h-4 w-4 mr-2" /> Purge Registry</DropdownMenuItem>
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
                <CardHeader className="bg-muted/5 border-b border-primary/5 px-6 py-6">
                    <CardTitle className="font-black text-xl text-green-600">Verified Statutory Ledger</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <ScrollArea className="w-full">
                        <Table className="min-w-[1000px]">
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="font-black text-[10px] uppercase pl-6 h-12">Timestamp</TableHead>
                                    <TableHead className="font-black text-[10px] uppercase text-center h-12">Authorization Status</TableHead>
                                    <TableHead className="font-black text-[10px] uppercase text-center h-12">Value (₹)</TableHead>
                                    <TableHead className="font-black text-[10px] uppercase text-right pr-6 h-12">Audit</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {transactions.length > 0 ? transactions.map((tx) => (
                                    <TableRow key={tx.id} className="hover:bg-muted/5 border-b border-primary/5">
                                        <TableCell className="pl-6 py-4 text-[10px] font-bold text-muted-foreground">{tx.createdAt ? format(tx.createdAt.toDate(), 'PP p') : 'Syncing...'}</TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex items-center justify-center gap-2 text-green-600">
                                                <CheckCircle2 className="h-3.5 w-3.5" />
                                                <span className="font-black text-[9px] uppercase tracking-widest">Payment Success</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center font-mono font-black text-xs">₹{(tx.amount || 0).toLocaleString('en-IN')}</TableCell>
                                        <TableCell className="text-right pr-6"><TransactionDetailDialog tx={tx} /></TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-32 text-center text-muted-foreground font-medium text-xs opacity-40">Registry clear. No successful captures found.</TableCell>
                                    </TableRow>
                                )}
                            </tbody>
                        </table>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                </CardContent>
            </Card>
          </TabsContent>
      </Tabs>

      <AlertDialog open={!!userToPurge} onOpenChange={(o) => !o && setUserToPurge(null)}>
          <AlertDialogContent className="rounded-[2.5rem] p-8 border-none shadow-2xl glass text-left">
              <AlertDialogHeader>
                  <AlertDialogTitle className="font-black text-2xl tracking-tighter">Confirm Statutory Purge</AlertDialogTitle>
                  <AlertDialogDescription className="text-sm font-medium">Irreversible erasure of node {userToPurge?.firstName}.</AlertDialogDescription>
              </AlertDialogHeader>
              <div className="flex gap-3 mt-6">
                  <AlertDialogCancel className="font-bold h-12 rounded-xl flex-1">Abort</AlertDialogCancel>
                  <Button onClick={async () => {
                      if (userToPurge) {
                        await deleteDoc(doc(firestore, "users", userToPurge.uid));
                        await remove(ref(rtdb, `users/${userToPurge.uid}`));
                        setUserToPurge(null);
                        toast({ title: "Purge Complete" });
                      }
                  }} variant="destructive" className="font-black h-12 rounded-xl flex-1 uppercase">Execute Purge</Button>
              </div>
          </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
