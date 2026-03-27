
"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useFirestore, useDatabase, useAuth } from "@/firebase";
import { collection, doc, getDoc, onSnapshot, updateDoc, deleteDoc, writeBatch, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, remove, update } from "firebase/database";
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
  UserCheck,
  RotateCcw,
  Activity,
  Cpu,
  Eraser,
  Lock,
  QrCode
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
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { verifyEmailAuthenticity } from "@/ai/flows/verify-email-authenticity";
import { motion } from "framer-motion";
import { Logo } from "@/components/logo";

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

function DigitalIdentityCard({ profile }: { profile: UserRecord }) {
    const systemId = `NS-${profile.uid.substring(0, 4).toUpperCase()}-${profile.uid.substring(profile.uid.length - 4).toUpperCase()}`;
    return (
        <div className="relative w-full aspect-[1.586/1] rounded-[1.5rem] overflow-hidden shadow-2xl text-left">
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-blue-600"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
            
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Logo className="h-24 w-24 border-none shadow-none p-0" />
            </div>
            
            <div className="relative h-full flex flex-col p-5 text-white">
                <div className="flex justify-between items-start mb-auto">
                    <div className="flex items-center gap-2">
                        <Logo className="h-6 w-6 border-none shadow-none bg-white p-1" />
                        <div className="flex flex-col">
                            <span className="font-black text-[8px] tracking-tighter leading-none">NYAYA SAHAYAK</span>
                            <span className="text-[5px] font-bold uppercase tracking-[0.2em] opacity-60">Forensic Terminal</span>
                        </div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10">
                        <span className="text-[6px] font-black uppercase tracking-widest">Registry Record</span>
                    </div>
                </div>

                <div className="flex gap-3 items-end mb-3">
                    <Avatar className="h-14 w-14 border-2 border-white/20 rounded-xl shadow-lg shrink-0">
                        <AvatarImage src={profile.photoURL} className="object-cover" />
                        <AvatarFallback className="bg-white/10 text-white font-black text-xs">{profile.firstName?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-0.5 min-w-0">
                        <h3 className="font-black text-xs sm:text-sm tracking-tight truncate uppercase leading-none">{profile.firstName} {profile.lastName}</h3>
                        <p className="text-[7px] font-bold uppercase tracking-widest opacity-70 leading-none">{profile.userType}</p>
                        <p className="text-[9px] font-mono font-bold tracking-wider pt-1">{systemId}</p>
                    </div>
                    <div className="bg-white p-1 rounded-lg shadow-xl shrink-0">
                        <QrCode className="h-8 w-8 text-black" />
                    </div>
                </div>
                
                <div className="pt-2 border-t border-white/10 flex justify-between items-center">
                    <div className="space-y-0.5">
                        <p className="text-[5px] font-bold uppercase opacity-40">Registry Email</p>
                        <p className="text-[7px] font-bold truncate max-w-[140px]">{profile.email}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[5px] font-bold uppercase opacity-40">Oversight Status</p>
                        <p className="text-[7px] font-black uppercase tracking-tighter text-blue-200">Admin Audit Active</p>
                    </div>
                </div>
            </div>
        </div>
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
            <DialogContent className="sm:max-w-2xl p-0 overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] border-none shadow-2xl bg-card">
                <div className="p-6 sm:p-8">
                    <DialogHeader className="mb-6 border-none text-left">
                        <div className="flex items-center gap-2 text-primary mb-2">
                            <ShieldCheck className="h-4 w-4" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Official Registry Preview</span>
                        </div>
                        <DialogTitle className="text-xl font-black">User Dossier: {user.firstName} {user.lastName}</DialogTitle>
                        <DialogDescription className="font-medium text-xs">Detailed view of registry identity and forensic records.</DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-8">
                        <div className="grid sm:grid-cols-2 gap-8 items-start">
                            <DigitalIdentityCard profile={user} />
                            
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30 border border-primary/5">
                                    <Avatar className="h-16 w-16 border-2 border-background shadow-lg rounded-xl shrink-0">
                                        <AvatarImage src={user.photoURL} className="object-cover" />
                                        <AvatarFallback className="text-xl font-black bg-primary/5 text-primary">{user.firstName.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="space-y-1">
                                        <Badge variant="outline" className="font-black text-[8px] uppercase tracking-widest text-primary border-primary/20">{user.userType}</Badge>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Status: {user.isBlocked ? 'Suspended' : 'Active'}</p>
                                    </div>
                                </div>
                                <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 text-left">
                                    <p className="text-[9px] font-black text-primary uppercase tracking-widest mb-1">Institutional Context</p>
                                    <p className="text-[10px] font-medium text-muted-foreground leading-relaxed">
                                        Identity synchronized with centralized registry. Manual audit status: CLEAR.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <ScrollArea className="max-h-[30vh] px-4">
                            <div className="space-y-6 pb-4 text-left">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="p-4 rounded-2xl bg-muted/30 border border-primary/5 space-y-1">
                                        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                                            <Mail className="h-3 w-3" /> Registry Email
                                        </p>
                                        <p className="font-bold text-xs truncate">{user.email}</p>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-muted/30 border border-primary/5 space-y-1">
                                        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                                            <Phone className="h-3 w-3" /> Contact
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
  const [userToPurge, setUserToPurge] = useState<UserRecord | null>(null);
  const [isMassPurging, setIsMassPurging] = useState(false);
  
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
                    const dateA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : Number(a.createdAt || 0);
                    const dateB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : Number(b.createdAt || 0);
                    return dateB - dateA;
                }));
                setLoading(false);
            },
            (serverError) => {
                const permissionError = new FirestorePermissionError({
                    path: usersCol.path,
                    operation: 'list',
                } satisfies SecurityRuleContext, serverError);
                errorEmitter.emit('permission-error', permissionError);
                setLoading(false);
            }
        );
    });

    return () => {
        unsubAuth();
        if (unsubscribeRef.current) unsubscribeRef.current();
    };
  }, [firestore, auth, router, toast]);

  const handleToggleStatus = (user: UserRecord, isInactive: boolean) => {
    setProcessingUid(user.uid);
    const updateData = { isBlocked: isInactive };
    const userRef = doc(firestore, "users", user.uid);

    updateDoc(userRef, updateData)
        .then(() => {
            update(ref(rtdb, `users/${user.uid}`), updateData).catch(() => {});
            toast({ title: isInactive ? "User Suspended" : "User Activated" });
        })
        .catch(async (serverError) => {
            const permissionError = new FirestorePermissionError({
                path: userRef.path,
                operation: 'update',
                requestResourceData: updateData,
            } satisfies SecurityRuleContext, serverError);
            errorEmitter.emit('permission-error', permissionError);
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

          const userRef = doc(firestore, "users", user.uid);
          updateDoc(userRef, updateData as any)
            .catch(async (serverError) => {
                const permissionError = new FirestorePermissionError({
                    path: userRef.path,
                    operation: 'update',
                    requestResourceData: updateData,
                } satisfies SecurityRuleContext, serverError);
                errorEmitter.emit('permission-error', permissionError);
            });
          toast({ title: verification.isAuthentic ? "User Authenticated" : "Forensic Audit Failed" });
      } catch (error) {
          toast({ variant: "destructive", title: "Process Error" });
      } finally {
          setProcessingUid(null);
      }
  };

  const handleSendAdminMessage = async (targetUser: UserRecord) => {
      const msg = prompt(`Initialize institutional alert for ${targetUser.firstName}:`);
      if (!msg) return;

      const notifData = {
          userId: targetUser.uid,
          type: 'admin_message',
          title: 'Institutional Alert',
          description: msg,
          isRead: false,
          createdAt: serverTimestamp()
      };

      const notifCol = collection(firestore, "notifications");
      addDoc(notifCol, notifData)
        .then(() => {
            toast({ title: "Alert Dispatched", description: "The citizen has been notified." });
        })
        .catch(async (serverError) => {
            const permissionError = new FirestorePermissionError({
                path: notifCol.path,
                operation: 'create',
                requestResourceData: notifData,
            } satisfies SecurityRuleContext, serverError);
            errorEmitter.emit('permission-error', permissionError);
        });
  };

  const handleExecutePurge = async () => {
    if (!userToPurge) return;
    const user = userToPurge;
    
    if (ADMIN_EMAILS.includes(user.email.toLowerCase()) || user.isAdmin) {
        toast({ 
            variant: "destructive", 
            title: "Action Prohibited", 
            description: "Administrative accounts are immutable and cannot be purged from the registry." 
        });
        setUserToPurge(null);
        return;
    }
    
    setProcessingUid(user.uid);
    const userRef = doc(firestore, "users", user.uid);
    
    deleteDoc(userRef)
        .then(() => {
            remove(ref(rtdb, `users/${user.uid}`)).catch(() => {});
            toast({ title: "Registry Record Purged", description: `Record for ${user.firstName} erased permanently.` });
        })
        .catch(async (serverError) => {
            const permissionError = new FirestorePermissionError({
                path: userRef.path,
                operation: 'delete',
            } satisfies SecurityRuleContext, serverError);
            errorEmitter.emit('permission-error', permissionError);
        })
        .finally(() => {
            setProcessingUid(null);
            setUserToPurge(null);
        });
  };

  const handleMassPurgeCitizens = async () => {
      setIsMassPurging(true);
      try {
          const batch = writeBatch(firestore);
          const citizens = users.filter(u => u.userType === 'citizen' && !ADMIN_EMAILS.includes(u.email.toLowerCase()) && !u.isAdmin);
          
          citizens.forEach(u => {
              batch.delete(doc(firestore, "users", u.uid));
              remove(ref(rtdb, `users/${u.uid}`)).catch(() => {});
          });

          await batch.commit().catch(async (serverError) => {
              const permissionError = new FirestorePermissionError({
                  path: '/users',
                  operation: 'delete',
              } satisfies SecurityRuleContext, serverError);
              errorEmitter.emit('permission-error', permissionError);
          });
          toast({ title: "Mass Purge Complete", description: `${citizens.length} citizen records erased.` });
      } catch (error) {
          toast({ variant: "destructive", title: "Mass Purge Failed" });
      } finally {
          setIsMassPurging(false);
      }
  }

  const filteredUsers = users.filter(u => 
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div className="flex h-[70vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 px-2 sm:px-6 pb-12 text-left">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-primary/5 pb-8">
        <div className="space-y-1 text-left">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tighter font-headline text-foreground">Registry Management</h1>
          <p className="text-xs sm:text-sm text-muted-foreground font-medium">Institutional oversight of nyayasahayak.in records and identity data.</p>
        </div>
        <div className="flex gap-2 sm:gap-3">
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="outline" className="h-10 sm:h-11 px-4 sm:px-6 border-destructive/20 text-destructive rounded-xl font-bold bg-destructive/5 text-[10px] sm:text-xs">
                        <Eraser className="mr-2 h-3 w-3 sm:h-4 sm:w-4" /> Mass Purge Citizens
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-[2.5rem] p-8 border-none shadow-2xl glass">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="font-black text-2xl tracking-tighter text-center">Execute Mass Decommission?</AlertDialogTitle>
                        <AlertDialogDescription className="text-center text-sm font-medium">
                            This will permanently delete ALL non-admin citizen accounts from the registry. This action is terminal.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-6 gap-3 text-left">
                        <AlertDialogCancel className="font-bold h-12 rounded-xl flex-1">Abort</AlertDialogCancel>
                        <AlertDialogAction onClick={handleMassPurgeCitizens} className="bg-destructive text-white font-black h-12 rounded-xl flex-1 uppercase tracking-widest text-[10px]">Confirm Mass Purge</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <Button className="bg-primary text-white h-10 sm:h-11 px-4 sm:px-6 rounded-xl font-bold shadow-lg shadow-primary/20 text-[10px] sm:text-xs">
                <UserPlus className="mr-2 h-3 w-3 sm:h-4 sm:w-4" /> Manual Entry
            </Button>
        </div>
      </div>

      <Card className="border border-primary/5 shadow-xl rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden bg-card">
          <CardHeader className="bg-muted/5 border-b border-primary/5 px-4 sm:px-6 py-6">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="text-left w-full">
                      <CardTitle className="font-headline font-black text-lg sm:text-xl tracking-tight">Identity Registry</CardTitle>
                      <CardDescription className="text-[10px] sm:text-xs font-medium mt-1">Forensic security and account status oversight.</CardDescription>
                  </div>
                  <div className="relative group w-full md:w-80">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input 
                          placeholder="Filter name or email..." 
                          className="pl-9 h-10 sm:h-11 w-full bg-background border-primary/10 rounded-xl text-[10px] sm:text-xs font-bold" 
                          value={searchQuery}
                          onChange={(e) => setSearchSearchQuery(e.target.value)}
                      />
                  </div>
              </div>
          </CardHeader>
          <CardContent className="p-0">
              <ScrollArea className="w-full text-left">
                  <Table className="min-w-[900px]">
                      <TableHeader className="bg-muted/20">
                          <TableRow>
                              <TableHead className="font-black text-[9px] sm:text-[10px] uppercase tracking-widest pl-6 h-12">User Identity</TableHead>
                              <TableHead className="font-black text-[9px] sm:text-[10px] uppercase tracking-widest text-center h-12">Role</TableHead>
                              <TableHead className="font-black text-[9px] sm:text-[10px] uppercase tracking-widest text-center h-12">Status</TableHead>
                              <TableHead className="font-black text-[9px] sm:text-[10px] uppercase tracking-widest text-center h-12">Verification</TableHead>
                              <TableHead className="font-black text-[9px] sm:text-[10px] uppercase tracking-widest text-right pr-6 h-12">Controls</TableHead>
                          </TableRow>
                      </TableHeader>
                      <TableBody>
                          {filteredUsers.map((user) => {
                              const isActive = user.isBlocked === false || user.isBlocked === undefined;
                              const isProtected = ADMIN_EMAILS.includes(user.email.toLowerCase()) || user.isAdmin;
                              return (
                                <TableRow key={user.uid} className={cn("hover:bg-muted/5 border-b border-primary/5 transition-colors", !isActive && "bg-red-500/5")}>
                                    <TableCell className="pl-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10 border border-primary/10">
                                                <AvatarImage src={user.photoURL} className="object-cover" />
                                                <AvatarFallback className="font-bold text-primary bg-primary/5">{user.firstName.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col text-left">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-xs sm:text-sm tracking-tight">{user.firstName} {user.lastName}</span>
                                                    {isProtected && <BadgeCheck className="h-3 w-3 text-primary" />}
                                                </div>
                                                <span className="text-[9px] sm:text-[10px] text-muted-foreground font-medium">{user.email}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant="outline" className="font-black text-[8px] uppercase border-primary/20 text-primary">{user.userType}</Badge>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <span className={cn("text-[8px] sm:text-[9px] font-black uppercase", isActive ? "text-green-600" : "text-red-500")}>
                                                {isActive ? "Active" : "Suspended"}
                                            </span>
                                            <Switch 
                                                checked={isActive} 
                                                onCheckedChange={(checked) => handleToggleStatus(user, !checked)}
                                                disabled={processingUid === user.uid || isProtected}
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
                                                    Verify
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
                                                    <DropdownMenuItem onClick={() => handleSendAdminMessage(user)} className="rounded-lg font-bold text-xs h-10 px-3 cursor-pointer gap-3"><Mail className="mr-3 h-4 w-4" /> Message Citizen</DropdownMenuItem>
                                                    <DropdownMenuItem className="rounded-lg font-bold text-xs h-10 px-3 cursor-pointer gap-3"><RotateCcw className="mr-3 h-4 w-4" /> Reset Protocol</DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem 
                                                        className={cn("rounded-lg font-bold text-xs h-10 px-3 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10", isProtected && "opacity-50 cursor-not-allowed")}
                                                        onClick={() => !isProtected && setUserToPurge(user)}
                                                        disabled={processingUid === user.uid || isProtected}
                                                    >
                                                        {isProtected ? <Lock className="mr-3 h-4 w-4" /> : <Trash2 className="mr-3 h-4 w-4" />}
                                                        Purge Registry Record
                                                    </DropdownMenuItem>
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

      <AlertDialog open={!!userToPurge} onOpenChange={(open) => !open && setUserToPurge(null)}>
          <AlertDialogContent className="rounded-[2.5rem] p-8 border-none shadow-2xl glass">
              <AlertDialogHeader>
                  <div className="p-4 rounded-full bg-destructive/10 w-fit mx-auto mb-4">
                      <ShieldAlert className="h-10 w-10 text-destructive animate-pulse" />
                  </div>
                  <AlertDialogTitle className="font-black text-2xl tracking-tighter text-center">Confirm Institutional Purge</AlertDialogTitle>
                  <AlertDialogDescription className="text-center text-sm font-medium leading-relaxed">
                      This protocol will permanently erase <strong>{userToPurge?.firstName} {userToPurge?.lastName}</strong> from the registry. This action is terminal and irreversible.
                  </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex-col sm:flex-row gap-3 mt-6 text-left">
                  <AlertDialogCancel className="font-bold h-12 rounded-xl flex-1 border-primary/10">Abort Protocol</AlertDialogCancel>
                  <AlertDialogAction onClick={handleExecutePurge} className="bg-destructive text-white hover:bg-destructive/90 font-black h-12 rounded-xl flex-1 uppercase tracking-widest text-[10px] shadow-lg shadow-destructive/20">Execute Purge</AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
