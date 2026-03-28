"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useFirestore, useAuth, useDatabase } from "@/firebase";
import { collection, doc, getDoc, onSnapshot, updateDoc, deleteDoc, query, where, getDocs, serverTimestamp, addDoc, writeBatch } from "firebase/firestore";
import { ref, remove, update } from "firebase/database";
import { sendPasswordResetEmail, onAuthStateChanged } from "firebase/auth";
import { 
  ShieldCheck, 
  Loader2, 
  Search, 
  AlertTriangle, 
  ShieldAlert, 
  BadgeCheck, 
  Eye, 
  MoreHorizontal,
  Mail,
  UserPlus,
  Trash2,
  Phone,
  Activity,
  Cpu,
  Lock,
  QrCode,
  KeyRound,
  UserCheck,
  Zap,
  TrendingUp,
  MailCheck,
  Send,
  CreditCard,
  Layers,
  BarChart3
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
} from "@/components/ui/alert-dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { verifyEmailAuthenticity } from "@/ai/flows/verify-email-authenticity";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/logo";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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
  flagReason?: string;
  createdAt?: any;
  mobileNumber?: string;
  emailVerified?: boolean;
  aiUsageCount?: number;
  subscriptionType?: string;
}

const ADMIN_EMAILS = [
  'enterspaceindia@gmail.com', 
  'piyushkumarsingh23323@gmail.com',
  'piyushkumrsingh23323@gmail.com',
  'piyushkumrsingh23399@gmail.com'
];

function EmailDispatchDialog({ 
    user, 
    type, 
    open, 
    onOpenChange, 
    onDispatch 
}: { 
    user: UserRecord | null, 
    type: 'reset' | 'verify' | null, 
    open: boolean, 
    onOpenChange: (open: boolean) => void,
    onDispatch: (subject: string, body: string) => Promise<void>
}) {
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");
    const [isDispatching, setIsDispatching] = useState(false);

    useEffect(() => {
        if (user && type) {
            if (type === 'reset') {
                setSubject(`[Nyaya Sahayak] Password Restoration Protocol: ${user.firstName}`);
                setBody(`Greetings ${user.firstName},\n\nWe have initialized a Password Restoration Protocol for your institutional registry node on nyayasahayak.in.\n\nUse the link below to reset your credentials within the next 60 minutes.\n\n[PROTOCOL LINK INCLUDED AUTOMATICALLY]\n\nStatutory regards,\nNyaya Sahayak Registry Terminal`);
            } else {
                const code = Math.floor(100000 + Math.random() * 900000).toString();
                setSubject(`[Nyaya Sahayak] Identity Verification Node: ${user.firstName}`);
                setBody(`Greetings ${user.firstName},\n\nYour 6-digit forensic verification code is: ${code}\n\nEnter this code in your dashboard to activate full permissions.\n\nStatutory regards,\nNyaya Sahayak Registry Terminal`);
            }
        }
    }, [user, type, open]);

    const handleSend = async () => {
        setIsDispatching(true);
        try {
            await onDispatch(subject, body);
            onOpenChange(false);
        } finally {
            setIsDispatching(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl p-0 overflow-hidden rounded-[2.5rem] border-none shadow-3xl bg-card text-left">
                <div className="p-8">
                    <DialogHeader className="mb-8 border-none text-left">
                        <div className="flex items-center gap-3 text-primary mb-2">
                            <Mail className="h-5 w-5" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Communication Node</span>
                        </div>
                        <DialogTitle className="text-2xl font-black tracking-tighter">
                            {type === 'reset' ? 'Password Restoration Dispatch' : 'Identity Verification Dispatch'}
                        </DialogTitle>
                        <DialogDescription className="font-medium text-xs">
                            Recipient: <span className="text-foreground font-bold">{user?.email}</span>
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Registry Subject</Label>
                            <Input 
                                value={subject} 
                                onChange={e => setSubject(e.target.value)} 
                                className="h-12 font-bold bg-muted/20 border-primary/5 focus:border-primary"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Statutory Body</Label>
                            <Textarea 
                                value={body} 
                                onChange={e => setBody(e.target.value)} 
                                rows={8}
                                className="resize-none font-medium text-sm leading-relaxed p-6 rounded-2xl bg-muted/20 border-primary/5 shadow-inner"
                            />
                        </div>
                    </div>
                </div>
                <div className="p-6 border-t bg-muted/5 flex justify-end gap-3">
                    <Button variant="ghost" onClick={() => onOpenChange(false)} className="rounded-xl font-bold">Cancel</Button>
                    <Button onClick={handleSend} disabled={isDispatching} className="font-black uppercase tracking-[0.2em] text-[10px] h-11 px-8 rounded-xl shadow-xl shadow-primary/20">
                        {isDispatching ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                        Execute Dispatch
                    </Button>
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
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchSearchQuery] = useState("");
  const [processingUid, setProcessingUid] = useState<string | null>(null);
  const [userToPurge, setUserToPurge] = useState<UserRecord | null>(null);
  
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [modalTargetUser, setModalTargetUser] = useState<UserRecord | null>(null);
  const [modalType, setModalType] = useState<'reset' | 'verify' | null>(null);

  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (user) => {
        if (unsubscribeRef.current) {
            unsubscribeRef.current();
            unsubscribeRef.current = null;
        }

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

        const usersCol = collection(firestore, "users");
        unsubscribeRef.current = onSnapshot(usersCol, 
            (snapshot) => {
                const list = snapshot.docs.map(doc => ({ ...doc.data(), uid: doc.id } as UserRecord));
                setUsers(list.sort((a, b) => {
                    const dateA = a.createdAt?.toMillis ? a.createdAt.toMillis() : Number(a.createdAt || 0);
                    const dateB = b.createdAt?.toMillis ? b.createdAt.toMillis() : Number(b.createdAt || 0);
                    return dateB - dateA;
                }));
                setLoading(false);
            },
            (err) => {
                console.error("Registry error:", err);
                setLoading(false);
            }
        );
    });

    return () => {
        unsubAuth();
        if (unsubscribeRef.current) unsubscribeRef.current();
    };
  }, [firestore, auth, router, toast]);

  const handleOpenEmailEditor = (user: UserRecord, type: 'reset' | 'verify') => {
      setModalTargetUser(user);
      setModalType(type);
      setEmailModalOpen(true);
  };

  const handleDispatchEmail = async (subject: string, body: string) => {
      if (!modalTargetUser || !modalType) return;
      setProcessingUid(modalTargetUser.uid);
      try {
          if (modalType === 'reset') {
              await sendPasswordResetEmail(auth, modalTargetUser.email);
              toast({ title: "Restoration Dispatch Complete" });
          } else {
              toast({ title: "Verification Transmission Complete" });
          }
      } catch (error: any) {
          toast({ variant: "destructive", title: "Transmission Failed", description: error.message });
      } finally {
          setProcessingUid(null);
      }
  };

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
          const updateData = { 
              securityStatus: verification.isAuthentic ? 'verified' : 'suspicious',
              flagReason: verification.isAuthentic ? "" : verification.reason || "Suspicious identity node."
          };
          await updateDoc(doc(firestore, "users", user.uid), updateData as any);
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
        
        // 1. Delete user profile doc from Firestore
        batch.delete(doc(firestore, "users", userToPurge.uid));
        
        // 2. Find and delete all posts by this user
        const postsRef = collection(firestore, "posts");
        const postsQuery = query(postsRef, where("authorUid", "==", userToPurge.uid));
        const postsSnap = await getDocs(postsQuery);
        postsSnap.docs.forEach(d => batch.delete(d.ref));
        
        // 3. Find and delete all notifications for this user
        const notifRef = collection(firestore, "notifications");
        const notifQuery = query(notifRef, where("userId", "==", userToPurge.uid));
        const notifSnap = await getDocs(notifQuery);
        notifSnap.docs.forEach(d => batch.delete(d.ref));

        // Execute Firestore atomic batch
        await batch.commit();

        // 4. Delete from RTDB (Real-time sync)
        await remove(ref(rtdb, `users/${userToPurge.uid}`)).catch(() => {});
        await remove(ref(rtdb, `advocates/${userToPurge.uid}`)).catch(() => {});

        toast({ 
            title: "Forensic Purge Complete", 
            description: `Registry node and all associated transmissions for ${userToPurge.firstName} have been erased.` 
        });
    } catch (error: any) {
        console.error("Purge failure:", error);
        toast({ 
            variant: "destructive", 
            title: "Purge Refused", 
            description: "Institutional permissions insufficient or node network failure." 
        });
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
      unlimited: users.filter(u => u.subscriptionType?.includes('unlimited')).length,
      flagged: users.filter(u => u.securityStatus === 'suspicious').length
  };

  if (loading) return <div className="flex h-[70vh] items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-primary opacity-20" /></div>;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 px-2 sm:px-6 text-left">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-primary/5 pb-8">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tighter font-headline text-foreground uppercase">Management Terminal</h1>
          <p className="text-sm text-muted-foreground font-medium">Institutional oversight of nyayasahayak.in records and identity nodes.</p>
        </div>
        <div className="flex gap-3">
            <Button className="h-11 px-6 rounded-xl font-bold shadow-lg shadow-primary/20 text-xs">
                <UserPlus className="mr-2 h-4 w-4" /> Add Registry Node
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
              { label: "Total Nodes", value: stats.total, icon: Activity, color: "text-blue-500", bg: "bg-blue-500/10" },
              { label: "AI Verified", value: stats.verified, icon: UserCheck, color: "text-green-600", bg: "bg-green-600/10" },
              { label: "Elite Clearance", value: stats.unlimited, icon: Zap, color: "text-amber-600", bg: "bg-amber-500/10" },
              { label: "Risk Flags", value: stats.flagged, icon: AlertTriangle, color: "text-red-500", bg: "bg-red-500/10" }
          ].map((stat, i) => (
              <Card key={i} className="border-primary/5 shadow-md rounded-2xl overflow-hidden glass group transition-all hover:scale-[1.02]">
                  <CardContent className="p-5 flex items-center gap-4">
                      <div className={cn("p-3 rounded-xl transition-transform group-hover:scale-110", stat.bg, stat.color)}>
                          <stat.icon className="h-5 w-5" />
                      </div>
                      <div className="text-left">
                          <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-60 leading-none mb-1">{stat.label}</p>
                          <p className="text-2xl font-black tracking-tighter">{stat.value}</p>
                      </div>
                  </CardContent>
              </Card>
          ))}
      </div>

      <Card className="border-primary/5 shadow-2xl rounded-[2rem] overflow-hidden bg-card text-left">
          <CardHeader className="bg-muted/5 border-b border-primary/5 px-6 py-6 text-left">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="text-left w-full">
                      <CardTitle className="font-headline font-black text-xl tracking-tight">Statutory Registry Dossier</CardTitle>
                      <CardDescription className="text-xs font-medium mt-1">Real-time engagement and clearance level oversight.</CardDescription>
                  </div>
                  <div className="relative group w-full md:w-80">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input 
                          placeholder="Filter registry..." 
                          className="pl-9 h-11 w-full bg-background border-primary/10 rounded-xl text-xs font-bold" 
                          value={searchQuery}
                          onChange={(e) => setSearchSearchQuery(e.target.value)}
                      />
                  </div>
              </div>
          </CardHeader>
          <CardContent className="p-0">
              <ScrollArea className="w-full">
                  <Table className="min-w-[1100px]">
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
                              const usage = user.aiUsageCount || 0;
                              const isProtected = ADMIN_EMAILS.includes(user.email.toLowerCase());
                              
                              return (
                                <TableRow key={user.uid} className={cn("hover:bg-muted/5 border-b border-primary/5 transition-colors", !isActive && "bg-red-500/5")}>
                                    <TableCell className="pl-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10 border border-primary/10 rounded-xl">
                                                <AvatarImage src={user.photoURL} className="object-cover" />
                                                <AvatarFallback className="font-black text-primary bg-primary/5">{user.firstName.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col text-left">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="font-bold text-sm tracking-tight">{user.firstName} {user.lastName}</span>
                                                    {isProtected && <BadgeCheck className="h-3.5 w-3.5 text-blue-500" />}
                                                </div>
                                                <span className="text-[10px] text-muted-foreground font-medium truncate max-w-[180px]">{user.email}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant="secondary" className="font-black text-[8px] uppercase bg-primary/5 text-primary border-primary/10">
                                            {(user.subscriptionType || 'FREE').replace('_', ' ')}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex flex-col items-center gap-1">
                                            <span className="font-mono font-black text-xs">{usage} ops</span>
                                            <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
                                                <div className="h-full bg-primary" style={{ width: `${Math.min(100, (usage / 20) * 100)}%` }} />
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <Switch 
                                                checked={isActive} 
                                                onCheckedChange={(checked) => handleToggleStatus(user, !checked)}
                                                disabled={processingUid === user.uid || isProtected}
                                                className="data-[state=checked]:bg-green-500"
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {user.securityStatus === 'verified' ? (
                                            <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20 text-[8px] font-black uppercase">Cleared</Badge>
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
                                            <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl shadow-2xl glass border-primary/10">
                                                <DropdownMenuLabel className="text-[9px] font-black uppercase tracking-widest opacity-40 px-3">Registry Protocols</DropdownMenuLabel>
                                                <DropdownMenuItem onSelect={() => handleOpenEmailEditor(user, 'reset')} className="rounded-xl font-bold text-xs h-10 px-3 cursor-pointer gap-3 text-left">
                                                    <KeyRound className="h-4 w-4 opacity-40" /> Dispatch Reset Link
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onSelect={() => handleOpenEmailEditor(user, 'verify')} className="rounded-xl font-bold text-xs h-10 px-3 cursor-pointer gap-3 text-left">
                                                    <MailCheck className="h-4 w-4 opacity-40" /> Identity Verification
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator className="opacity-5" />
                                                <DropdownMenuItem 
                                                    className={cn("rounded-xl font-bold text-xs h-10 px-3 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10 gap-3 text-left", isProtected && "opacity-50")}
                                                    onClick={() => !isProtected && setUserToPurge(user)}
                                                    disabled={processingUid === user.uid || isProtected}
                                                >
                                                    {isProtected ? <Lock className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
                                                    Purge Node Record
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

      <EmailDispatchDialog 
        user={modalTargetUser}
        type={modalType}
        open={emailModalOpen}
        onOpenChange={setEmailModalOpen}
        onDispatch={handleDispatchEmail}
      />

      <AlertDialog open={!!userToPurge} onOpenChange={(open) => !open && setUserToPurge(null)}>
          <AlertDialogContent className="rounded-[2.5rem] p-8 border-none shadow-2xl glass text-left">
              <AlertDialogHeader className="text-left">
                  <div className="p-4 rounded-full bg-destructive/10 w-fit mx-auto mb-4"><ShieldAlert className="h-10 w-10 text-destructive animate-pulse" /></div>
                  <AlertDialogTitle className="font-black text-2xl tracking-tighter text-center">Confirm Permanent Purge</AlertDialogTitle>
                  <AlertDialogDescription className="text-center text-sm font-medium leading-relaxed">
                      Terminal deactivation of node <strong>{userToPurge?.firstName}</strong>. This forensic erasure is 100% permanent and will remove all profile data, community transmissions, and registry logs.
                  </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <AlertDialogCancel className="font-bold h-12 rounded-xl flex-1 border-primary/10">Abort Protocol</AlertDialogCancel>
                  <AlertDialogAction onClick={handleExecutePurge} className="bg-destructive text-white hover:bg-destructive/90 font-black h-12 rounded-xl flex-1 uppercase tracking-widest text-[10px]">Execute Purge</AlertDialogAction>
              </div>
          </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
