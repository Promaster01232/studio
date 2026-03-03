
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useFirestore, useDatabase, useAuth } from "@/firebase";
import { collection, doc, getDoc, onSnapshot, updateDoc, serverTimestamp, deleteDoc } from "firebase/firestore";
import { ref, update, onValue, remove } from "firebase/database";
import { 
  Users, 
  ShieldCheck, 
  Loader2, 
  Search, 
  Ban, 
  AlertTriangle, 
  ShieldAlert, 
  Sparkles, 
  ShieldX, 
  CheckCircle, 
  Gavel, 
  BadgeCheck, 
  Eye, 
  MoreHorizontal,
  Mail,
  UserPlus,
  MessageSquare,
  Trash2,
  Calendar,
  Phone,
  ShieldHalf,
  MapPin,
  ChevronRight,
  Filter
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { validateUserDetails } from "@/ai/flows/validate-user-details";
import { onAuthStateChanged } from "firebase/auth";
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
}

interface AdvocateRecord {
  uid: string;
  name: string;
  barId: string;
  specialty: string;
  isVerified: boolean;
  isApproved: boolean;
  courtName: string;
  about?: string;
  experience?: string;
  position?: string;
  courts?: string[];
  certificateName?: string;
  isBlocked?: boolean;
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
            <DialogContent className="sm:max-w-2xl p-0 overflow-hidden rounded-2xl border-none shadow-2xl bg-white">
                <DialogHeader className="p-6 bg-primary/5 border-b">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16 border-2 border-white shadow-lg">
                            <AvatarImage src={user.photoURL} />
                            <AvatarFallback className="font-bold text-lg bg-primary/10 text-primary">{user.firstName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="flex items-center gap-2">
                                <DialogTitle className="text-xl font-black tracking-tight">{user.firstName} {user.lastName}</DialogTitle>
                                {user.securityStatus === 'verified' && <BadgeCheck className="h-5 w-5 text-primary" />}
                            </div>
                            <DialogDescription className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 mt-0.5">
                                <ShieldCheck className="h-3.5 w-3.5 text-primary" /> {user.userType} Account
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>
                <ScrollArea className="max-h-[60vh] p-6">
                    <div className="space-y-6">
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-muted/30 border border-primary/5 space-y-1">
                                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                                    <Mail className="h-3 w-3" /> Email
                                </p>
                                <p className="font-bold text-xs truncate">{user.email}</p>
                            </div>
                            <div className="p-4 rounded-xl bg-muted/30 border border-primary/5 space-y-1">
                                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                                    <Phone className="h-3 w-3" /> Mobile
                                </p>
                                <p className="font-bold text-xs">{user.mobileNumber || "Not Provided"}</p>
                            </div>
                            <div className="p-4 rounded-xl bg-muted/30 border border-primary/5 space-y-1">
                                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                                    <Calendar className="h-3 w-3" /> Registration
                                </p>
                                <p className="font-bold text-xs">
                                    {user.createdAt ? (user.createdAt.toDate ? user.createdAt.toDate().toLocaleDateString() : new Date(user.createdAt).toLocaleDateString()) : "Legacy"}
                                </p>
                            </div>
                            <div className="p-4 rounded-xl bg-muted/30 border border-primary/5 space-y-1">
                                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                                    <ShieldHalf className="h-3 w-3" /> Status
                                </p>
                                <div className="mt-0.5">
                                    {user.securityStatus === 'verified' ? (
                                        <Badge className="bg-green-500/10 text-green-600 border-green-500/20 text-[9px] font-black uppercase">Identity Verified</Badge>
                                    ) : (
                                        <Badge variant="outline" className="text-red-500 border-red-200 text-[9px] font-black uppercase">Not Verified</Badge>
                                    )}
                                </div>
                            </div>
                        </div>

                        {user.flagReason && (
                            <div className="p-4 rounded-xl bg-red-50 border border-red-100 space-y-2">
                                <div className="flex items-center gap-2 text-red-600">
                                    <AlertTriangle className="h-4 w-4" />
                                    <p className="text-[10px] font-black uppercase tracking-wider">AI Security Flag</p>
                                </div>
                                <p className="text-xs font-medium text-red-800 leading-relaxed italic">
                                    "{user.flagReason}"
                                </p>
                            </div>
                        )}
                    </div>
                </ScrollArea>
                <div className="p-6 border-t flex justify-end gap-3 bg-muted/10">
                    <DialogTrigger asChild>
                        <Button variant="outline" className="font-bold text-xs h-10 px-6 rounded-lg">Close Dossier</Button>
                    </DialogTrigger>
                    <Button className="font-bold text-xs h-10 px-6 rounded-lg shadow-lg shadow-primary/20">Message User</Button>
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
  const [advocates, setAdvocates] = useState<AdvocateRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchSearchQuery] = useState("");
  const [processingUid, setProcessingUid] = useState<string | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditProgress, setAuditProgress] = useState("");

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (user) => {
        if (!user) {
            router.push('/login');
            return;
        }

        const isSuperAdmin = user.email === 'enterspaceindia@gmail.com';
        
        // Parallel check for DB admin flag
        const adminDoc = await getDoc(doc(firestore, "users", user.uid));
        const adminData = adminDoc.data() as any;
        const hasAdminFlag = !!adminData?.isAdmin;

        if (!isSuperAdmin && !hasAdminFlag) {
            toast({ variant: "destructive", title: "Access Denied" });
            router.push('/dashboard');
            return;
        }

        // Setup Listeners
        const usersCol = collection(firestore, "users");
        const unsubUsers = onSnapshot(usersCol, (snapshot) => {
            const list = snapshot.docs.map(doc => ({ ...doc.data(), uid: doc.id } as UserRecord));
            setUsers(list.sort((a, b) => {
                const dateA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : Number(a.createdAt || 0);
                const dateB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : Number(b.createdAt || 0);
                return dateB - dateA;
            }));
            setLoading(false);
        });

        const advocatesRef = ref(rtdb, "advocates");
        const unsubAdvocates = onValue(advocatesRef, (snap) => {
            if (snap.exists()) {
                setAdvocates(Object.values(snap.val()) as AdvocateRecord[]);
            } else {
                setAdvocates([]);
            }
        });

        return () => {
            unsubUsers();
            unsubAdvocates();
        };
    });

    return () => unsubAuth();
  }, [firestore, rtdb, auth, router, toast]);

  const toggleUserBlock = async (user: UserRecord) => {
    if (user.email === 'enterspaceindia@gmail.com') return;
    setProcessingUid(user.uid);
    const newStatus = !user.isBlocked;
    try {
        await updateDoc(doc(firestore, "users", user.uid), { isBlocked: newStatus });
        await update(ref(rtdb, `users/${user.uid}`), { isBlocked: newStatus });
        if (user.userType === 'lawyer') {
            await update(ref(rtdb, `advocates/${user.uid}`), { isBlocked: newStatus });
        }
        toast({ title: newStatus ? "Suspended" : "Restored", description: `${user.firstName}'s access updated.` });
    } catch (e) {
        toast({ variant: "destructive", title: "Action Failed" });
    } finally {
        setProcessingUid(null);
    }
  };

  const handleDeleteUser = async (user: UserRecord) => {
    if (user.email === 'enterspaceindia@gmail.com') {
        toast({ variant: "destructive", title: "Cannot delete system root" });
        return;
    }
    
    if (!window.confirm(`PERMANENT DELETE: This will remove ALL information for ${user.firstName} ${user.lastName} from Firestore, RTDB and Advocate Directory. Proceed?`)) return;

    setProcessingUid(user.uid);
    try {
        // Step 1: Remove from Firestore
        await deleteDoc(doc(firestore, "users", user.uid));
        
        // Step 2: Remove from Realtime Database (User Node)
        await remove(ref(rtdb, `users/${user.uid}`)).catch(e => console.warn("RTDB User Node cleanup skipped"));
        
        // Step 3: Remove from Realtime Database (Advocate Registry if applicable)
        await remove(ref(rtdb, `advocates/${user.uid}`)).catch(e => console.warn("RTDB Advocate Registry cleanup skipped"));
        
        toast({ 
            title: "Database Purged", 
            description: "All user information has been permanently removed from the system." 
        });
    } catch (error: any) {
        console.error("Purge Error:", error);
        toast({ variant: "destructive", title: "Purge Failed", description: "Database connection error." });
    } finally {
        setProcessingUid(null);
    }
  };

  const approveAdvocate = async (adv: AdvocateRecord) => {
      setProcessingUid(adv.uid);
      try {
          await update(ref(rtdb, `advocates/${adv.uid}`), { isApproved: true, isVerified: true });
          const userRef = doc(firestore, "users", adv.uid);
          await updateDoc(userRef, { securityStatus: 'verified', isBlocked: false });
          await update(ref(rtdb, `users/${adv.uid}`), { isBlocked: false });
          toast({ title: "Professional Activated", description: `${adv.name} is now live in the directory.` });
      } catch (error: any) {
          toast({ variant: "destructive", title: "Activation Failed" });
      } finally {
          setProcessingUid(null);
      }
  };

  const runSecurityAudit = async () => {
      setIsAuditing(true);
      setAuditProgress("Initializing forensic audit...");
      let flagged = 0;

      for (const user of users) {
          if (user.isAdmin || user.email === 'enterspaceindia@gmail.com') continue;
          setAuditProgress(`Inspecting: ${user.email}`);
          try {
              const validation = await validateUserDetails({
                  firstName: user.firstName,
                  lastName: user.lastName,
                  email: user.email,
                  mobileNumber: user.mobileNumber || '',
                  userType: user.userType
              });

              if (!validation.isValid) {
                  await updateDoc(doc(firestore, "users", user.uid), {
                      securityStatus: 'suspicious',
                      flaggedAt: serverTimestamp(),
                      flagReason: validation.reason || "Pattern mismatch."
                  });
                  flagged++;
              }
          } catch (e) {}
      }

      setIsAuditing(false);
      setAuditProgress("");
      toast({ title: "Audit Complete", description: `Marked ${flagged} suspicious entries.` });
  };

  const purgeIncorrectData = async () => {
      const suspicious = users.filter(u => u.securityStatus === 'suspicious');
      if (suspicious.length === 0) {
          toast({ title: "Registry Clean", description: "No incorrect data found." });
          return;
      }

      if (!window.confirm(`Purge ${suspicious.length} incorrect entries? This will delete ALL their information from the database.`)) return;

      setIsAuditing(true);
      setAuditProgress(`Purging ${suspicious.length} records...`);

      for (const user of suspicious) {
          try {
              await deleteDoc(doc(firestore, "users", user.uid));
              await remove(ref(rtdb, `users/${user.uid}`));
              await remove(ref(rtdb, `advocates/${user.uid}`));
          } catch (e) {}
      }

      setIsAuditing(false);
      setAuditProgress("");
      toast({ title: "Purge Complete", description: "All incorrect entries removed from database." });
  };

  const massActivateVerified = async () => {
      const pending = users.filter(u => !u.isBlocked && u.securityStatus !== 'suspicious' && u.securityStatus !== 'verified');
      if (pending.length === 0) return;

      setIsAuditing(true);
      setAuditProgress(`Activating ${pending.length} genuine accounts...`);

      for (const user of pending) {
          try {
              await updateDoc(doc(firestore, "users", user.uid), { securityStatus: 'verified' });
          } catch (e) {}
      }

      setIsAuditing(false);
      setAuditProgress("");
      toast({ title: "Bulk Activation Complete" });
  };

  const filteredUsers = users.filter(u => 
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingAdvocates = advocates.filter(a => !a.isApproved);

  if (loading) {
    return <div className="flex h-[70vh] items-center justify-center bg-white"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 px-4 sm:px-6 lg:px-8 pb-12 bg-white min-h-full">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-primary/5 pb-8">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight font-headline text-[#1a1a1a]">System Management</h1>
          <p className="text-sm text-muted-foreground font-medium">Platform-wide registry integrity and professional controls.</p>
        </div>
        
        <div className="flex flex-wrap gap-2 sm:gap-3">
            <Button onClick={runSecurityAudit} disabled={isAuditing} variant="outline" className="flex-1 sm:flex-none h-11 px-6 border-primary/10 rounded-xl font-bold transition-all active:scale-95 shadow-sm bg-white hover:bg-primary/5">
                {isAuditing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4 text-primary" />}
                <span className="text-[11px] uppercase tracking-wider">Integrity Scan</span>
            </Button>
            <Button onClick={purgeIncorrectData} disabled={isAuditing} className="flex-1 sm:flex-none bg-red-500 hover:bg-red-600 text-white h-11 px-6 rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-red-500/20">
                <ShieldX className="mr-2 h-4 w-4" />
                <span className="text-[11px] uppercase tracking-wider">Purge Fake Data</span>
            </Button>
            <Button onClick={massActivateVerified} disabled={isAuditing} className="flex-1 sm:flex-none bg-primary text-white h-11 px-6 rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-primary/20">
                <ShieldCheck className="mr-2 h-4 w-4" />
                <span className="text-[11px] uppercase tracking-wider">Verify AI-Approved</span>
            </Button>
        </div>
      </div>

      {auditProgress && (
          <div className="bg-primary/5 border border-primary/10 p-4 rounded-xl flex items-center gap-3 animate-pulse shadow-inner">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{auditProgress}</p>
          </div>
      )}

      <Tabs defaultValue="registry" className="space-y-6">
        <TabsList className="bg-muted/30 p-1 rounded-xl border border-primary/5 w-fit">
            <TabsTrigger value="registry" className="rounded-lg px-8 h-10 font-bold text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary">Identity Registry</TabsTrigger>
            <TabsTrigger value="advocates" className="rounded-lg px-8 h-10 font-bold text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary">
                Advocate Review
                {pendingAdvocates.length > 0 && <span className="ml-2 bg-primary text-white h-4 px-1.5 rounded-full text-[9px] flex items-center justify-center">{pendingAdvocates.length}</span>}
            </TabsTrigger>
        </TabsList>

        <TabsContent value="registry" className="mt-0">
            <Card className="border border-primary/5 shadow-xl rounded-2xl overflow-hidden bg-white">
                <CardHeader className="bg-muted/5 border-b border-primary/5 px-6 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="space-y-0.5">
                            <CardTitle className="font-headline font-black text-xl tracking-tight">Member Registry</CardTitle>
                            <CardDescription className="text-xs font-medium">Verify and manage all platform identities.</CardDescription>
                        </div>
                        <div className="relative group w-full md:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <Input 
                                placeholder="Search registry..." 
                                className="pl-9 h-11 w-full bg-background border-primary/10 focus:border-primary rounded-xl text-xs font-bold" 
                                value={searchQuery}
                                onChange={(e) => setSearchSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <ScrollArea className="w-full">
                        <Table className="min-w-[800px] md:min-w-full">
                            <TableHeader className="bg-muted/20">
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="font-black text-[10px] text-muted-foreground uppercase tracking-widest pl-6 h-12">Identity</TableHead>
                                    <TableHead className="font-black text-[10px] text-muted-foreground uppercase tracking-widest text-center h-12">Security Jach</TableHead>
                                    <TableHead className="font-black text-[10px] text-muted-foreground uppercase tracking-widest text-center h-12">Status</TableHead>
                                    <TableHead className="font-black text-[10px] text-muted-foreground uppercase tracking-widest text-right pr-6 h-12">Controls</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUsers.map((user) => (
                                    <TableRow key={user.uid} className={cn("hover:bg-muted/5 transition-colors border-b border-primary/5", user.securityStatus === 'suspicious' && "bg-red-50/30")}>
                                        <TableCell className="pl-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-10 w-10 border border-primary/10 shadow-sm">
                                                    <AvatarImage src={user.photoURL} className="object-cover" />
                                                    <AvatarFallback className="font-bold text-primary bg-primary/5">{user.firstName.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col min-w-0">
                                                    <span className="font-bold text-sm tracking-tight truncate">{user.firstName} {user.lastName}</span>
                                                    <span className="text-[10px] text-muted-foreground font-medium truncate opacity-70">{user.email}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex flex-col items-center justify-center gap-1">
                                                {user.securityStatus === 'suspicious' ? (
                                                    <Badge className="bg-red-500 text-white font-black text-[8px] uppercase tracking-wider h-5 rounded-md px-2">Incorrect Entry</Badge>
                                                ) : user.securityStatus === 'verified' ? (
                                                    <Badge className="bg-green-500 text-white font-black text-[8px] uppercase tracking-wider h-5 rounded-md px-2">Genuine Identity</Badge>
                                                ) : (
                                                    <Badge variant="secondary" className="font-black text-[8px] uppercase tracking-wider h-5 rounded-md px-2 opacity-60">Pending Audit</Badge>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {user.securityStatus === 'verified' ? (
                                                <div className="flex items-center justify-center gap-1 text-green-600">
                                                    <CheckCircle className="h-3 w-3" />
                                                    <span className="text-[9px] font-black uppercase tracking-widest">Confirmed</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-center gap-1.5">
                                                    <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                                                    <span className="text-[10px] font-black uppercase text-red-500 tracking-tight">NOT VERIFIED ALL</span>
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right pr-6">
                                            <div className="flex items-center justify-end gap-2">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg hover:bg-muted active:scale-90 transition-all border border-transparent hover:border-primary/10">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl shadow-2xl border border-primary/5 bg-white">
                                                        <DropdownMenuLabel className="font-black text-[9px] uppercase tracking-widest opacity-50 px-3 py-2">Identity Dossier</DropdownMenuLabel>
                                                        
                                                        <UserDetailsModal user={user} trigger={
                                                            <button className="flex w-full cursor-default select-none items-center rounded-lg px-3 py-2 text-xs font-bold outline-none transition-colors hover:bg-muted active:bg-muted/80">
                                                                <Eye className="mr-3 h-4 w-4 text-muted-foreground" /> View Full Profile
                                                            </button>
                                                        } />
                                                        
                                                        <DropdownMenuItem className="rounded-lg font-bold text-xs h-10 px-3 cursor-pointer"><Mail className="mr-3 h-4 w-4 text-muted-foreground" /> Send Email</DropdownMenuItem>
                                                        <DropdownMenuItem className="rounded-lg font-bold text-xs h-10 px-3 cursor-pointer"><MessageSquare className="mr-3 h-4 w-4 text-muted-foreground" /> Platform Message</DropdownMenuItem>
                                                        <DropdownMenuSeparator className="my-2" />
                                                        <DropdownMenuItem 
                                                            onClick={() => handleDeleteUser(user)}
                                                            className="rounded-lg font-bold text-xs h-10 px-3 text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                                                        >
                                                            <Trash2 className="mr-3 h-4 w-4" /> DELETE ALL INFORMATION
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                                
                                                <Button 
                                                    className={cn(
                                                        "h-9 px-5 font-black text-[10px] uppercase tracking-wider rounded-lg active:scale-95 transition-all shadow-sm",
                                                        user.isBlocked ? "bg-white border border-primary/10 text-primary hover:bg-primary/5" : "bg-red-500 hover:bg-red-600 text-white"
                                                    )}
                                                    onClick={() => toggleUserBlock(user)}
                                                    disabled={processingUid === user.uid || user.email === 'enterspaceindia@gmail.com'}
                                                >
                                                    {processingUid === user.uid ? <Loader2 className="h-3 w-3 animate-spin" /> : user.isBlocked ? "Restore" : "Suspend"}
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                    <div className="p-6 bg-muted/5 border-t border-primary/5">
                        <Button variant="outline" className="font-black text-[10px] uppercase tracking-widest border border-dashed border-primary/20 bg-white hover:bg-primary/5 h-11 px-8 rounded-xl w-full sm:w-auto shadow-sm active:scale-95 transition-all">
                            <UserPlus className="mr-2 h-4 w-4" />
                            Add New Member To Registry
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="advocates" className="mt-0">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {advocates.length > 0 ? advocates.map((adv) => {
                    const isProcessing = processingUid === adv.uid;
                    return (
                        <Card key={adv.uid} className={cn("group overflow-hidden border border-primary/5 shadow-lg transition-all duration-300 hover:shadow-2xl rounded-2xl bg-white", adv.isApproved && "border-green-500/20")}>
                            <div className="p-6 space-y-5">
                                <div className="flex items-start justify-between">
                                    <div className="relative">
                                        <Avatar className="h-16 w-16 border-2 border-white shadow-xl rounded-2xl overflow-hidden">
                                            <AvatarImage src={users.find(u => u.uid === adv.uid)?.photoURL} className="object-cover" />
                                            <AvatarFallback className="font-black text-xl bg-primary text-white">{adv.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        {adv.isApproved && (
                                            <div className="absolute -bottom-1.5 -right-1.5 bg-green-500 text-white p-1.5 rounded-lg shadow-lg">
                                                <CheckCircle className="h-3.5 w-3.5" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col items-end gap-1.5">
                                        {adv.isApproved ? (
                                            <Badge className="bg-green-500 text-white font-black text-[8px] uppercase tracking-widest px-2.5 py-1 rounded-md">Live Profile</Badge>
                                        ) : (
                                            <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 font-black text-[8px] uppercase tracking-widest px-2.5 py-1 rounded-md border border-amber-500/20">Pending Review</Badge>
                                        )}
                                        {adv.isBlocked && (
                                            <Badge className="bg-red-500 text-white font-black text-[8px] uppercase tracking-widest px-2.5 py-1 rounded-md shadow-sm">Suspended</Badge>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-xl font-black tracking-tight text-[#1a1a1a] truncate group-hover:text-primary transition-colors">{adv.name}</h3>
                                    <p className="text-[10px] font-black text-primary uppercase tracking-widest">{adv.specialty}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4 pt-5 border-t border-primary/5">
                                    <div className="space-y-1">
                                        <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1.5"><Gavel className="h-3.5 w-3.5" /> Bar ID</p>
                                        <p className="text-xs font-bold truncate text-[#1a1a1a]">{adv.barId}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> Location</p>
                                        <p className="text-xs font-bold truncate text-[#1a1a1a]">{adv.courtName}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 bg-muted/10 border-t border-primary/5 flex gap-3">
                                {!adv.isApproved && (
                                    <Button 
                                        className="flex-1 h-10 font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/10 active:scale-95 transition-all bg-primary text-white rounded-xl"
                                        onClick={() => approveAdvocate(adv)}
                                        disabled={isProcessing}
                                    >
                                        {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify & Activate"}
                                    </Button>
                                )}
                                <Button variant="outline" size="icon" className="h-10 w-10 border-primary/10 hover:bg-white rounded-xl transition-all shadow-sm active:scale-90" asChild>
                                    <a href={`/dashboard/lawyer-connect/${adv.uid}`} target="_blank">
                                        <ChevronRight className="h-5 w-5" />
                                    </a>
                                </Button>
                            </div>
                        </Card>
                    );
                }) : (
                    <div className="col-span-full py-24 text-center bg-muted/5 rounded-3xl border-2 border-dashed border-primary/5">
                        <div className="h-20 w-20 bg-white rounded-2xl shadow-xl mx-auto mb-8 flex items-center justify-center text-primary/20 border border-primary/5">
                            <Gavel className="h-10 w-10" />
                        </div>
                        <h3 className="text-2xl font-black font-headline tracking-tighter text-[#1a1a1a]">Queue is Clear</h3>
                        <p className="text-muted-foreground max-w-xs mx-auto mt-3 text-xs font-medium leading-relaxed">No new professional applications awaiting verification at this time.</p>
                    </div>
                )}
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
