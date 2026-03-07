
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useFirestore, useDatabase, useAuth } from "@/firebase";
import { collection, doc, getDoc, onSnapshot, updateDoc, deleteDoc } from "firebase/firestore";
import { ref, remove } from "firebase/database";
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
  RotateCcw
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { verifyEmailAuthenticity } from "@/ai/flows/verify-email-authenticity";

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
            <DialogContent className="sm:max-w-2xl p-0 overflow-hidden rounded-2xl border-none shadow-2xl bg-white">
                <div className="bg-primary/5 p-6 border-b">
                    <DialogHeader className="border-none pb-0 mb-0 text-left">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12 sm:h-16 sm:w-16 border-2 border-white shadow-lg">
                                <AvatarImage src={user.photoURL} className="object-cover" />
                                <AvatarFallback className="font-bold text-lg bg-primary/10 text-primary">{user.firstName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                    <DialogTitle className="text-lg sm:text-xl font-black tracking-tight truncate">{user.firstName} {user.lastName}</DialogTitle>
                                    {user.emailVerified && <BadgeCheck className="h-4 w-4 sm:h-5 sm:w-5 text-primary shrink-0" />}
                                </div>
                                <DialogDescription className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 mt-0.5">
                                    <ShieldCheck className="h-3 w-3 text-primary" /> {user.userType} Account Dossier
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                </div>
                <ScrollArea className="max-h-[60vh] p-4 sm:p-6">
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-muted/30 border border-primary/5 space-y-1">
                                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                                    <Mail className="h-3 w-3" /> Email Address
                                </p>
                                <p className="font-bold text-xs truncate">{user.email}</p>
                            </div>
                            <div className="p-4 rounded-xl bg-muted/30 border border-primary/5 space-y-1">
                                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                                    <Phone className="h-3 w-3" /> Mobile Number
                                </p>
                                <p className="font-bold text-xs">{user.mobileNumber || "Not Provided"}</p>
                            </div>
                            <div className="p-4 rounded-xl bg-muted/30 border border-primary/5 space-y-1">
                                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                                    <Calendar className="h-3 w-3" /> Registration Date
                                </p>
                                <p className="font-bold text-xs">
                                    {user.createdAt ? (user.createdAt.toDate ? user.createdAt.toDate().toLocaleDateString() : new Date(user.createdAt).toLocaleDateString()) : "Legacy Record"}
                                </p>
                            </div>
                            <div className="p-4 rounded-xl bg-muted/30 border border-primary/5 space-y-1">
                                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                                    <ShieldHalf className="h-3 w-3" /> Verification Status
                                </p>
                                <div className="mt-0.5">
                                    {user.emailVerified ? (
                                        <Badge className="bg-green-500/10 text-green-600 border-green-500/20 text-[9px] font-black uppercase">Email Link Verified</Badge>
                                    ) : (
                                        <Badge variant="outline" className="text-red-500 border-red-200 text-[9px] font-black uppercase">Awaiting Email Check</Badge>
                                    )}
                                </div>
                            </div>
                        </div>

                        {user.flagReason && (
                            <div className="p-4 rounded-xl bg-red-50 border border-red-100 space-y-2">
                                <div className="flex items-center gap-2 text-red-600">
                                    <AlertTriangle className="h-4 w-4" />
                                    <p className="text-[10px] font-black uppercase tracking-wider">AI Forensic Security Flag</p>
                                </div>
                                <p className="text-xs font-medium text-red-800 leading-relaxed italic">
                                    "{user.flagReason}"
                                </p>
                            </div>
                        )}
                    </div>
                </ScrollArea>
                <div className="p-4 sm:p-6 border-t flex flex-col sm:flex-row justify-end gap-3 bg-muted/10">
                    <DialogTrigger asChild>
                        <Button variant="outline" className="font-bold text-xs h-10 rounded-lg shadow-sm w-full sm:w-auto">Close Dossier</Button>
                    </DialogTrigger>
                    <Button className="font-bold text-xs h-10 rounded-lg shadow-lg shadow-primary/20 w-full sm:w-auto">Official Message</Button>
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

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (user) => {
        if (!user) {
            router.push('/login');
            return;
        }

        const isSuperAdmin = ADMIN_EMAILS.includes(user.email?.toLowerCase() || '');
        const adminDoc = await getDoc(doc(firestore, "users", user.uid));
        const adminData = adminDoc.data() as any;
        const hasAdminFlag = !!adminData?.isAdmin;

        if (!isSuperAdmin && !hasAdminFlag) {
            toast({ variant: "destructive", title: "Access Denied" });
            router.push('/dashboard');
            return;
        }

        const usersCol = collection(firestore, "users");
        const unsubUsers = onSnapshot(usersCol, (snapshot) => {
            const list = snapshot.docs.map(doc => ({ ...doc.data(), uid: doc.id } as UserRecord));
            setUsers(list.sort((a, b) => {
                const dateA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : Number(a.createdAt || 0);
                const dateB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : Number(b.createdAt || 0);
                return dateB - dateA;
            }));
            setLoading(false);
        }, (serverError) => {
            if (!auth.currentUser) return;
            const permissionError = new FirestorePermissionError({
                path: usersCol.path,
                operation: 'list',
            } satisfies SecurityRuleContext, serverError);
            errorEmitter.emit('permission-error', permissionError);
            setLoading(false);
        });

        return () => {
            unsubUsers();
        };
    });

    return () => unsubAuth();
  }, [firestore, auth, router, toast]);

  const handleToggleStatus = async (user: UserRecord, isInactive: boolean) => {
    if (ADMIN_EMAILS.includes(user.email.toLowerCase())) {
        toast({ variant: "destructive", title: "Root Account Locked", description: "Admin status cannot be modified." });
        return;
    }
    
    setProcessingUid(user.uid);
    const userRef = doc(firestore, "users", user.uid);
    
    try {
        await updateDoc(userRef, { isBlocked: isInactive });
        toast({ 
            title: isInactive ? "User Suspended" : "User Restored", 
            description: `${user.firstName}'s access has been ${isInactive ? 'disabled' : 'enabled'}.` 
        });
    } catch (error: any) {
        toast({ variant: "destructive", title: "Update Failed" });
    } finally {
        setProcessingUid(null);
    }
  };

  const handleVerifyUser = async (user: UserRecord) => {
      setProcessingUid(user.uid);
      toast({ title: "AI Forensic Analysis", description: "Verifying identity authenticity..." });

      try {
          const verification = await verifyEmailAuthenticity({
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName
          });

          if (verification.isAuthentic) {
              const userRef = doc(firestore, "users", user.uid);
              await updateDoc(userRef, { 
                  securityStatus: 'verified', 
                  flagReason: "",
                  isBlocked: false 
              });
              
              toast({ title: "User Authenticated" });
          } else {
              const userRef = doc(firestore, "users", user.uid);
              await updateDoc(userRef, { 
                  securityStatus: 'suspicious',
                  flagReason: verification.reason || "AI detected suspicious identity patterns."
              });
              toast({ variant: "destructive", title: "Verification Failed" });
          }
      } catch (error: any) {
          toast({ variant: "destructive", title: "Process Error" });
      } finally {
          setProcessingUid(null);
      }
  };

  const handleDeleteUser = async (user: UserRecord) => {
    if (ADMIN_EMAILS.includes(user.email.toLowerCase())) {
        toast({ variant: "destructive", title: "Root Account Immutable" });
        return;
    }
    
    if (!window.confirm(`PERMANENT DELETION: Are you sure you want to completely erase all data for ${user.firstName} ${user.lastName}? This action is irreversible. All verified and unverified data will be removed.`)) return;

    setProcessingUid(user.uid);
    const userRef = doc(firestore, "users", user.uid);
    
    try {
        await deleteDoc(userRef);
        remove(ref(rtdb, `users/${user.uid}`)).catch(() => {});
        toast({ title: "Account Purged", description: "All associated records have been wiped." });
    } catch (error: any) {
        toast({ variant: "destructive", title: "Deletion Failed" });
    } finally {
        setProcessingUid(null);
    }
  };

  const filteredUsers = users.filter(u => 
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
      total: users.length,
      active: users.filter(u => !u.isBlocked).length,
      blocked: users.filter(u => u.isBlocked).length,
      suspicious: users.filter(u => !u.emailVerified && !ADMIN_EMAILS.includes(u.email.toLowerCase())).length,
  };

  if (loading) {
    return <div className="flex h-[70vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 px-4 sm:px-6 lg:px-8 pb-12">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-primary/5 pb-8">
        <div className="space-y-1 text-left">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight font-headline text-[#1a1a1a]">System Registry Console</h1>
          <p className="text-xs sm:text-sm text-muted-foreground font-medium">Comprehensive control over user access and forensic security.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full lg:w-auto">
            <Button variant="outline" className="h-11 px-6 border-primary/10 rounded-xl font-bold bg-white active:scale-95 transition-all">
                <Sparkles className="mr-2 h-4 w-4 text-primary" />
                <span className="text-[10px] uppercase tracking-wider">Identity Audit</span>
            </Button>
            <Button className="bg-primary text-white h-11 px-6 rounded-xl font-bold shadow-lg shadow-primary/20 active:scale-95 transition-all">
                <UserPlus className="mr-2 h-4 w-4" />
                <span className="text-[10px] uppercase tracking-wider">Manual Entry</span>
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card className="border-primary/5 shadow-sm bg-muted/5 rounded-2xl">
              <CardHeader className="p-3 sm:p-4 pb-1">
                  <CardDescription className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Registry</CardDescription>
                  <CardTitle className="text-xl sm:text-2xl font-black">{stats.total}</CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 pt-0">
                  <div className="flex items-center gap-1.5 text-primary">
                      <Users className="h-3 w-3" />
                      <span className="text-[8px] sm:text-[9px] font-bold">Platform Nodes</span>
                  </div>
              </CardContent>
          </Card>
          <Card className="border-primary/5 shadow-sm bg-green-50/30 rounded-2xl">
              <CardHeader className="p-3 sm:p-4 pb-1">
                  <CardDescription className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-green-600">Active Citizens</CardDescription>
                  <CardTitle className="text-xl sm:text-2xl font-black text-green-700">{stats.active}</CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 pt-0">
                  <div className="flex items-center gap-1.5 text-green-600">
                      <UserCheck className="h-3 w-3" />
                      <span className="text-[8px] sm:text-[9px] font-bold">Unrestricted</span>
                  </div>
              </CardContent>
          </Card>
          <Card className="border-primary/5 shadow-sm bg-red-50/30 rounded-2xl">
              <CardHeader className="p-3 sm:p-4 pb-1">
                  <CardDescription className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-red-600">Suspended Nodes</CardDescription>
                  <CardTitle className="text-xl sm:text-2xl font-black text-red-700">{stats.blocked}</CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 pt-0">
                  <div className="flex items-center gap-1.5 text-red-600">
                      <UserMinus className="h-3 w-3" />
                      <span className="text-[8px] sm:text-[9px] font-bold">Revoked</span>
                  </div>
              </CardContent>
          </Card>
          <Card className="border-primary/5 shadow-sm bg-amber-50/30 rounded-2xl">
              <CardHeader className="p-3 sm:p-4 pb-1">
                  <CardDescription className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-amber-600">Awaiting Inspection</CardDescription>
                  <CardTitle className="text-xl sm:text-2xl font-black text-amber-700">{stats.suspicious}</CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 pt-0">
                  <div className="flex items-center gap-1.5 text-amber-600">
                      <ShieldAlert className="h-3 w-3" />
                      <span className="text-[8px] sm:text-[9px] font-bold">Forensic Audit Required</span>
                  </div>
              </CardContent>
          </Card>
      </div>

      <Card className="border border-primary/5 shadow-xl rounded-2xl overflow-hidden bg-white">
          <CardHeader className="bg-muted/5 border-b border-primary/5 px-4 sm:px-6 py-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="text-left">
                      <CardTitle className="font-headline font-black text-xl tracking-tight leading-none">Identity Registry</CardTitle>
                      <CardDescription className="text-[10px] sm:text-xs font-medium mt-1.5">Real-time control over all registered citizen accounts.</CardDescription>
                  </div>
                  <div className="relative group w-full md:w-80">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input 
                          placeholder="Filter name or email..." 
                          className="pl-9 h-11 w-full bg-background border-primary/10 rounded-xl text-xs font-bold focus:border-primary transition-all" 
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
                              <TableHead className="font-black text-[10px] uppercase tracking-widest text-center h-12">Account Status</TableHead>
                              <TableHead className="font-black text-[10px] uppercase tracking-widest text-center h-12">Verification</TableHead>
                              <TableHead className="font-black text-[10px] uppercase tracking-widest text-right pr-6 h-12">Controls</TableHead>
                          </TableRow>
                      </TableHeader>
                      <TableBody>
                          {filteredUsers.length > 0 ? filteredUsers.map((user) => {
                              const isRoot = ADMIN_EMAILS.includes(user.email.toLowerCase());
                              const isProcessing = processingUid === user.uid;
                              
                              return (
                                <TableRow key={user.uid} className={cn("hover:bg-muted/5 border-b border-primary/5 transition-colors", user.isBlocked && "bg-red-50/10")}>
                                    <TableCell className="pl-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10 border border-primary/10">
                                                <AvatarImage src={user.photoURL} className="object-cover" />
                                                <AvatarFallback className="font-bold text-primary bg-primary/5">{user.firstName.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col min-w-0 text-left">
                                                <span className="font-bold text-sm tracking-tight truncate">{user.firstName} {user.lastName}</span>
                                                <span className="text-[10px] text-muted-foreground font-medium truncate">{user.email}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant="outline" className="font-black text-[8px] uppercase tracking-wider h-5 rounded-md px-2 border-primary/20 text-primary">{user.userType}</Badge>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex flex-col items-center gap-1.5">
                                            <div className="flex items-center gap-2">
                                                <span className={cn("text-[9px] font-black uppercase tracking-tight", user.isBlocked ? "text-red-500" : "text-green-600")}>
                                                    {user.isBlocked ? "Suspended" : "Active"}
                                                </span>
                                                <Switch 
                                                    checked={!user.isBlocked} 
                                                    onCheckedChange={(checked) => handleToggleStatus(user, !checked)}
                                                    disabled={isProcessing || isRoot}
                                                    className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500"
                                                />
                                            </div>
                                            {isProcessing && <Loader2 className="h-2 w-2 animate-spin text-primary" />}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {user.emailVerified ? (
                                            <div className="flex items-center justify-center gap-1.5 text-green-600">
                                                <BadgeCheck className="h-4 w-4" />
                                                <span className="text-[9px] font-black uppercase">Identity Verified</span>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center gap-1.5">
                                                <span className="text-[9px] font-black uppercase text-red-500 tracking-tight animate-pulse">Not Verified</span>
                                                {!isRoot && (
                                                    <Button 
                                                        size="sm" 
                                                        variant="ghost" 
                                                        className="h-6 px-3 text-[8px] font-black uppercase text-primary border border-primary/10 rounded-full hover:bg-primary hover:text-white transition-all"
                                                        onClick={() => handleVerifyUser(user)}
                                                        disabled={isProcessing}
                                                    >
                                                        {isProcessing ? <Loader2 className="h-2.5 w-2.5 animate-spin" /> : "Verify Identity"}
                                                    </Button>
                                                )}
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right pr-6">
                                        <div className="flex items-center justify-end gap-2">
                                            <UserDetailsModal user={user} />
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg hover:bg-muted transition-all">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl shadow-2xl border border-primary/5 bg-white">
                                                    <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground pb-2">Administrative Tools</DropdownMenuLabel>
                                                    <DropdownMenuItem className="rounded-lg font-bold text-xs h-10 px-3 cursor-pointer"><Mail className="mr-3 h-4 w-4" /> Message Citizen</DropdownMenuItem>
                                                    <DropdownMenuItem className="rounded-lg font-bold text-xs h-10 px-3 cursor-pointer"><RotateCcw className="mr-3 h-4 w-4" /> Reset Workspace</DropdownMenuItem>
                                                    {!isRoot && (
                                                        <>
                                                            <DropdownMenuSeparator className="my-2" />
                                                            <DropdownMenuItem 
                                                                onClick={() => handleDeleteUser(user)}
                                                                className="rounded-lg font-bold text-xs h-10 px-3 text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                                                            >
                                                                <Trash2 className="mr-3 h-4 w-4" /> Delete Account
                                                            </DropdownMenuItem>
                                                        </>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </TableCell>
                                </TableRow>
                              );
                          }) : (
                              <TableRow>
                                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground font-bold">No identity records matched your search query.</TableCell>
                              </TableRow>
                          )}
                      </TableBody>
                  </Table>
              </ScrollArea>
          </CardContent>
      </Card>
    </div>
  );
}
