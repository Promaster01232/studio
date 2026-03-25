"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useFirestore, useDatabase, useAuth } from "@/firebase";
import { collection, doc, getDoc, onSnapshot, updateDoc, deleteDoc } from "firebase/firestore";
import { ref, remove, update } from "firebase/database";
import { 
  Users, 
  ShieldCheck, 
  Loader2, 
  Search, 
  AlertTriangle, 
  ShieldAlert, 
  Sparkles, 
  BadgeCheck, 
  Eye, 
  MoreHorizontal,
  Mail,
  UserPlus,
  Trash2,
  Calendar,
  Phone,
  ShieldHalf,
  UserCheck,
  UserMinus,
  RotateCcw,
  CheckCircle2,
  Activity,
  QrCode,
  Fingerprint,
  Cpu
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { onAuthStateChanged } from "firebase/auth";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError, type SecurityRuleContext } from "@/firebase/errors";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { verifyEmailAuthenticity } from "@/ai/flows/verify-email-authenticity";
import { Logo } from "@/components/logo";
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
  flaggedAt?: any;
  flagReason?: string;
  createdAt?: any;
  mobileNumber?: string;
  emailVerified?: boolean;
}

const ADMIN_EMAILS = [
  'enterspaceindia@gmail.com', 
  'piyushkumarsingh23323@gmail.com',
  'piyushkumrsingh23323@gmail.com',
  'piyushkumrsingh23399@gmail.com'
];

function DigitalIDCard({ user }: { user: UserRecord }) {
    const systemID = `NS-${user.uid.substring(0, 4).toUpperCase()}-${user.uid.substring(user.uid.length - 4).toUpperCase()}`;
    const isVerified = user.emailVerified || user.securityStatus === 'verified';

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full aspect-[1.6/1] rounded-[2rem] overflow-hidden shadow-2xl group"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-[#0D1B2A] to-zinc-900"></div>
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
            </div>
            <div className="absolute top-0 right-0 p-4 opacity-5">
                <Cpu className="h-40 w-40" />
            </div>

            <div className="relative h-full w-full p-6 flex flex-col justify-between text-white border border-white/10 rounded-[2rem]">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                        <div className="relative p-1 rounded-xl bg-gradient-to-tr from-primary via-accent to-blue-400 p-[1px]">
                            <div className="bg-[#0D1B2A] rounded-xl p-1.5 backdrop-blur-md">
                                <Logo className="h-6 w-6 border-none p-0 bg-transparent shadow-none" imageClassName="brightness-0 invert" />
                            </div>
                        </div>
                        <div className="text-left">
                            <h3 className="text-[11px] font-black tracking-[0.1em] uppercase bg-gradient-to-r from-white via-primary to-accent bg-clip-text text-transparent leading-none">
                                Nyaya Sahayak
                            </h3>
                            <p className="text-[7px] font-black text-primary/60 uppercase tracking-[0.2em] mt-1">Official Registry Node</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-end">
                        <div className="p-1.5 bg-white rounded-lg shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                            <QrCode className="h-10 w-10 text-black" />
                        </div>
                        <span className="text-[6px] font-mono text-white/20 mt-1">SECURE-BLOCK-ALPHA</span>
                    </div>
                </div>

                <div className="flex gap-5 items-center">
                    <div className="relative">
                        <div className="absolute -inset-1.5 rounded-2xl bg-primary/20 animate-pulse"></div>
                        <Avatar className="h-20 w-20 border-2 border-white/20 rounded-2xl shadow-xl relative z-10">
                            <AvatarImage src={user.photoURL} className="object-cover" />
                            <AvatarFallback className="font-black bg-primary/10 text-primary">{user.firstName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {isVerified && (
                            <div className="absolute -bottom-1 -right-1 bg-primary text-white p-1 rounded-full border-2 border-[#0D1B2A] shadow-lg z-20">
                                <ShieldCheck className="h-3 w-3" />
                            </div>
                        )}
                    </div>
                    
                    <div className="flex-1 text-left min-w-0">
                        <h2 className="text-xl font-black tracking-tight leading-tight truncate">
                            {user.firstName} {user.lastName}
                        </h2>
                        <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="bg-white/5 border-white/10 text-[8px] font-black uppercase tracking-widest px-2 text-white/80 h-5">
                                {user.userType}
                            </Badge>
                            <span className="text-[9px] font-black font-mono text-primary tracking-wider uppercase bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">{systemID}</span>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-end border-t border-white/5 pt-4">
                    <div className="flex gap-4">
                        <div className="space-y-0.5">
                            <p className="text-[6px] font-black text-white/30 uppercase tracking-[0.2em]">Security Clearance</p>
                            <div className="flex items-center gap-1">
                                <div className={cn("h-1.5 w-1.5 rounded-full", isVerified ? "bg-green-500 animate-ping" : "bg-red-500")}></div>
                                <p className={cn("text-[8px] font-bold uppercase tracking-widest", isVerified ? "text-green-500" : "text-red-500")}>
                                    {isVerified ? "Authorized Node" : "Pending Audit"}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                        <Fingerprint className="h-3 w-3 text-primary animate-pulse" />
                        <span className="text-[7px] font-black uppercase tracking-[0.2em]">Biometric Node</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

function UserDetailsModal({ user, trigger }: { user: UserRecord, trigger?: React.ReactNode }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                {trigger || (
                    <button className="h-9 w-9 rounded-lg hover:bg-muted flex items-center justify-center transition-all">
                        <Eye className="h-4 w-4" />
                    </button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl p-0 overflow-hidden rounded-[2.5rem] border-none shadow-2xl bg-card">
                <div className="p-6 sm:p-8">
                    <DialogHeader className="mb-6 border-none">
                        <div className="flex items-center gap-2 text-primary mb-2">
                            <ShieldCheck className="h-4 w-4" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Official Registry Preview</span>
                        </div>
                        <DialogTitle className="sr-only">User Dossier: {user.firstName} {user.lastName}</DialogTitle>
                        <DialogDescription className="sr-only">Detailed view of user identity card and forensic records.</DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-8">
                        <div className="px-2">
                            <DigitalIDCard user={user} />
                        </div>

                        <ScrollArea className="max-h-[40vh] px-4">
                            <div className="space-y-6 pb-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="p-4 rounded-2xl bg-muted/30 border border-primary/5 space-y-1">
                                        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                                            <Mail className="h-3 w-3" /> Registry Email
                                        </p>
                                        <p className="font-bold text-xs truncate">{user.email}</p>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-muted/30 border border-primary/5 space-y-1">
                                        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                                            <Phone className="h-3 w-3" /> Contact Node
                                        </p>
                                        <p className="font-bold text-xs">{user.mobileNumber || "Not Provided"}</p>
                                    </div>
                                </div>

                                {user.flagReason && (
                                    <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/10 space-y-2">
                                        <div className="flex items-center gap-2 text-red-600">
                                            <AlertTriangle className="h-4 w-4" />
                                            <p className="text-[10px] font-black uppercase tracking-wider">Forensic Flag</p>
                                        </div>
                                        <p className="text-xs font-medium text-red-600 leading-relaxed italic">
                                            "{user.flagReason}"
                                        </p>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </div>
                </div>
                <div className="p-6 border-t flex justify-end gap-3 bg-muted/5">
                    <DialogTrigger asChild>
                        <Button variant="outline" className="font-bold text-xs h-11 rounded-xl px-8">Close Dossier</Button>
                    </DialogTrigger>
                    <Button className="font-bold text-xs h-11 rounded-xl px-8 shadow-lg shadow-primary/20">Official Message</Button>
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
        unsubscribeRef.current = onSnapshot(usersCol, (snapshot) => {
            const list = snapshot.docs.map(doc => ({ ...doc.data(), uid: doc.id } as UserRecord));
            setUsers(list.sort((a, b) => {
                const dateA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : Number(a.createdAt || 0);
                const dateB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : Number(b.createdAt || 0);
                return dateB - dateA;
            }));
            setLoading(false);
        });
    });

    return () => {
        unsubAuth();
        if (unsubscribeRef.current) unsubscribeRef.current();
    };
  }, [firestore, auth, router, toast]);

  const handleToggleStatus = (user: UserRecord, isInactive: boolean) => {
    if (ADMIN_EMAILS.includes(user.email.toLowerCase())) {
        toast({ variant: "destructive", title: "Root Account Locked" });
        return;
    }
    
    setProcessingUid(user.uid);
    updateDoc(doc(firestore, "users", user.uid), { isBlocked: isInactive })
        .then(() => {
            update(ref(rtdb, `users/${user.uid}`), { isBlocked: isInactive }).catch(() => {});
            toast({ title: isInactive ? "User Suspended" : "User Activated" });
        })
        .finally(() => setProcessingUid(null));
  };

  const handleVerifyUser = async (user: UserRecord) => {
      setProcessingUid(user.uid);
      try {
          const verification = await verifyEmailAuthenticity({ email: user.email });
          const updateData = verification.isAuthentic 
            ? { securityStatus: 'verified', flagReason: "", isBlocked: false } 
            : { securityStatus: 'suspicious', flagReason: verification.reason || "Suspicious identity patterns." };

          await updateDoc(doc(firestore, "users", user.uid), updateData as any);
          toast({ title: verification.isAuthentic ? "User Authenticated" : "Forensic Audit Failed" });
      } catch (error) {
          toast({ variant: "destructive", title: "Process Error" });
      } finally {
          setProcessingUid(null);
      }
  };

  const filteredUsers = users.filter(u => 
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div className="flex h-[70vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 px-2 sm:px-6 pb-12">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-primary/5 pb-8">
        <div className="space-y-1 text-left">
          <h1 className="text-3xl font-black tracking-tighter font-headline text-foreground">Registry Management</h1>
          <p className="text-sm text-muted-foreground font-medium">Institutional oversight of platform nodes and identity records.</p>
        </div>
        <div className="flex gap-3">
            <Button variant="outline" className="h-11 px-6 border-primary/10 rounded-xl font-bold bg-background">
                <Sparkles className="mr-2 h-4 w-4 text-primary" /> Registry Audit
            </Button>
            <Button className="bg-primary text-white h-11 px-6 rounded-xl font-bold shadow-lg shadow-primary/20">
                <UserPlus className="mr-2 h-4 w-4" /> Manual Entry
            </Button>
        </div>
      </div>

      <Card className="border border-primary/5 shadow-xl rounded-[2rem] overflow-hidden bg-card">
          <CardHeader className="bg-muted/5 border-b border-primary/5 px-6 py-6">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="text-left w-full">
                      <CardTitle className="font-headline font-black text-xl tracking-tight">Identity Registry</CardTitle>
                      <CardDescription className="text-xs font-medium mt-1">Forensic security and account status oversight.</CardDescription>
                  </div>
                  <div className="relative group w-full md:w-80">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input 
                          placeholder="Filter name or email..." 
                          className="pl-9 h-11 w-full bg-background border-primary/10 rounded-xl text-xs font-bold" 
                          value={searchQuery}
                          onChange={(e) => setSearchSearchQuery(e.target.value)}
                      />
                  </div>
              </div>
          </CardHeader>
          <CardContent className="p-0">
              <ScrollArea className="w-full">
                  <Table className="min-w-[900px]">
                      <TableHeader className="bg-muted/20">
                          <TableRow>
                              <TableHead className="font-black text-[10px] uppercase tracking-widest pl-6 h-12">User Identity</TableHead>
                              <TableHead className="font-black text-[10px] uppercase tracking-widest text-center h-12">Role</TableHead>
                              <TableHead className="font-black text-[10px] uppercase tracking-widest text-center h-12">Status</TableHead>
                              <TableHead className="font-black text-[10px] uppercase tracking-widest text-center h-12">Verification</TableHead>
                              <TableHead className="font-black text-[10px] uppercase tracking-widest text-right pr-6 h-12">Controls</TableHead>
                          </TableRow>
                      </TableHeader>
                      <TableBody>
                          {filteredUsers.map((user) => {
                              const isRoot = ADMIN_EMAILS.includes(user.email.toLowerCase());
                              const isActive = user.isBlocked === false || user.isBlocked === undefined;
                              return (
                                <TableRow key={user.uid} className={cn("hover:bg-muted/5 border-b border-primary/5 transition-colors", !isActive && "bg-red-500/5")}>
                                    <TableCell className="pl-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10 border border-primary/10">
                                                <AvatarImage src={user.photoURL} className="object-cover" />
                                                <AvatarFallback className="font-bold text-primary bg-primary/5">{user.firstName.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col text-left">
                                                <span className="font-bold text-sm tracking-tight">{user.firstName} {user.lastName}</span>
                                                <span className="text-[10px] text-muted-foreground font-medium">{user.email}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant="outline" className="font-black text-[8px] uppercase border-primary/20 text-primary">{user.userType}</Badge>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <span className={cn("text-[9px] font-black uppercase", isActive ? "text-green-600" : "text-red-500")}>
                                                {isActive ? "Active" : "Suspended"}
                                            </span>
                                            <Switch 
                                                checked={isActive} 
                                                onCheckedChange={(checked) => handleToggleStatus(user, !checked)}
                                                disabled={isRoot || processingUid === user.uid}
                                                className="data-[state=checked]:bg-green-500"
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex flex-col items-center gap-1">
                                            {user.securityStatus === 'verified' ? (
                                                <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20 text-[8px] font-black uppercase">AI Verified</Badge>
                                            ) : (
                                                <Button size="sm" variant="ghost" className="h-6 px-2 text-[8px] font-black uppercase text-primary border border-primary/10 rounded-full" onClick={() => handleVerifyUser(user)} disabled={processingUid === user.uid}>
                                                    Verify Node
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right pr-6">
                                        <div className="flex items-center justify-end gap-2">
                                            <UserDetailsModal user={user} />
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg hover:bg-muted">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl">
                                                    <DropdownMenuItem className="rounded-lg font-bold text-xs h-10 px-3 cursor-pointer"><Mail className="mr-3 h-4 w-4" /> Message Citizen</DropdownMenuItem>
                                                    <DropdownMenuItem className="rounded-lg font-bold text-xs h-10 px-3 cursor-pointer"><RotateCcw className="mr-3 h-4 w-4" /> Reset Node</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
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
    </div>
  );
}
