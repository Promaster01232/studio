
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
  UserCheck, 
  AlertTriangle, 
  ShieldAlert, 
  Sparkles, 
  ShieldX, 
  CheckCircle, 
  Gavel, 
  BadgeCheck, 
  Clock, 
  Eye, 
  Briefcase, 
  GraduationCap,
  MoreHorizontal,
  Mail,
  UserPlus,
  Send,
  MessageSquare,
  FileText,
  Trash2,
  ChevronDown,
  Calendar,
  Phone,
  ShieldHalf,
  Info
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
}

function UserDetailsModal({ user, trigger }: { user: UserRecord, trigger?: React.ReactNode }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-muted active:scale-90 transition-all">
                        <Eye className="h-5 w-5" />
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl bg-white p-0 overflow-hidden rounded-[2rem] border-none shadow-2xl">
                <div className="bg-primary/5 p-8 border-b border-primary/10">
                    <div className="flex items-center gap-6">
                        <Avatar className="h-24 w-24 border-4 border-white shadow-xl">
                            <AvatarImage src={user.photoURL} />
                            <AvatarFallback className="font-black text-2xl bg-primary/10 text-primary">{user.firstName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <h2 className="text-3xl font-black tracking-tighter text-[#1a1a1a]">{user.firstName} {user.lastName}</h2>
                                {user.securityStatus === 'verified' && <BadgeCheck className="h-6 w-6 text-primary" />}
                            </div>
                            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4 text-primary" /> {user.userType} Registry
                            </p>
                        </div>
                    </div>
                </div>
                <ScrollArea className="max-h-[60vh] p-8">
                    <div className="space-y-8">
                        <div className="grid sm:grid-cols-2 gap-6">
                            <div className="p-5 rounded-2xl bg-muted/20 border-2 border-transparent flex flex-col gap-1">
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                                    <Mail className="h-3.5 w-3.5" /> Primary Email
                                </p>
                                <p className="font-bold text-sm text-[#1a1a1a]">{user.email}</p>
                            </div>
                            <div className="p-5 rounded-2xl bg-muted/20 border-2 border-transparent flex flex-col gap-1">
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                                    <Phone className="h-3.5 w-3.5" /> Mobile Number
                                </p>
                                <p className="font-bold text-sm text-[#1a1a1a]">{user.mobileNumber || "Not Provided"}</p>
                            </div>
                            <div className="p-5 rounded-2xl bg-muted/20 border-2 border-transparent flex flex-col gap-1">
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                                    <Calendar className="h-3.5 w-3.5" /> Joined Date
                                </p>
                                <p className="font-bold text-sm text-[#1a1a1a]">
                                    {user.createdAt ? (user.createdAt.toDate ? user.createdAt.toDate().toLocaleDateString() : new Date(user.createdAt).toLocaleDateString()) : "Legacy User"}
                                </p>
                            </div>
                            <div className="p-5 rounded-2xl bg-muted/20 border-2 border-transparent flex flex-col gap-1">
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                                    <ShieldHalf className="h-3.5 w-3.5" /> Security Status
                                </p>
                                <div className="mt-1">
                                    {user.securityStatus === 'suspicious' ? (
                                        <Badge className="bg-red-500 text-white font-black text-[9px] uppercase tracking-wider">Incorrect Entry</Badge>
                                    ) : user.securityStatus === 'verified' ? (
                                        <Badge className="bg-green-500 text-white font-black text-[9px] uppercase tracking-wider">Identity Confirmed</Badge>
                                    ) : (
                                        <Badge variant="secondary" className="font-black text-[9px] uppercase tracking-wider opacity-60">Pending Jach</Badge>
                                    )}
                                </div>
                            </div>
                        </div>

                        {user.flagReason && (
                            <div className="p-6 rounded-2xl bg-red-50 border-2 border-red-100 flex flex-col gap-3">
                                <div className="flex items-center gap-2 text-red-600">
                                    <AlertTriangle className="h-5 w-5" />
                                    <p className="text-xs font-black uppercase tracking-widest">AI Forensic Flags</p>
                                </div>
                                <p className="text-sm font-medium text-red-800 leading-relaxed italic">
                                    "{user.flagReason}"
                                </p>
                            </div>
                        )}

                        <div className="space-y-4">
                            <h3 className="text-xs font-black text-[#1a1a1a] uppercase tracking-[0.3em] px-1">System Permissions</h3>
                            <div className="grid grid-cols-1 gap-3">
                                <div className="flex items-center justify-between p-4 rounded-xl border-2 border-primary/5 hover:border-primary/10 transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                                            <Gavel className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-[#1a1a1a]">Legal Tool Access</p>
                                            <p className="text-[10px] font-bold text-muted-foreground">Standard citizen package enabled</p>
                                        </div>
                                    </div>
                                    <div className="h-2.5 w-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                                </div>
                                <div className="flex items-center justify-between p-4 rounded-xl border-2 border-primary/5 hover:border-primary/10 transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                                            <ShieldAlert className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-[#1a1a1a]">Account Standing</p>
                                            <p className="text-[10px] font-bold text-muted-foreground">{user.isBlocked ? "Suspended by Admin" : "Active & Healthy"}</p>
                                        </div>
                                    </div>
                                    <div className={cn("h-2.5 w-2.5 rounded-full shadow-lg", user.isBlocked ? "bg-red-500 shadow-red-500/50" : "bg-green-500 shadow-green-500/50")}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </ScrollArea>
                <div className="p-8 border-t border-primary/5 flex justify-end gap-3 bg-muted/5">
                    <Button variant="outline" className="rounded-xl h-12 px-8 font-black text-xs uppercase tracking-widest border-2 border-primary/10">Close Dossier</Button>
                    <Button className="rounded-xl h-12 px-8 font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20">Send Direct Message</Button>
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

        const adminDoc = await getDoc(doc(firestore, "users", user.uid));
        const adminData = adminDoc.data() as any;
        const isSuperAdmin = adminData?.email === 'enterspaceindia@gmail.com' || !!adminData?.isAdmin;

        if (!isSuperAdmin) {
            toast({ variant: "destructive", title: "Access Denied" });
            router.push('/dashboard');
            return;
        }

        // Listen for users
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

        // Listen for advocate applications
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
        toast({ title: newStatus ? "Account Suspended" : "Account Restored" });
    } catch (e) {
        toast({ variant: "destructive", title: "Action Failed" });
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
          toast({ title: "Advocate Approved", description: `${adv.name} is now active.` });
      } catch (error: any) {
          toast({ variant: "destructive", title: "Approval Failed" });
      } finally {
          setProcessingUid(null);
      }
  };

  const runSecurityAudit = async () => {
      setIsAuditing(true);
      setAuditProgress("Forensic audit in progress...");
      let flagged = 0;

      for (const user of users) {
          if (user.isAdmin || user.email === 'enterspaceindia@gmail.com') continue;
          setAuditProgress(`Scanning: ${user.email}`);
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
                      flagReason: validation.reason || "AI Forensics: Bot pattern detected."
                  });
                  flagged++;
              }
          } catch (e) {}
      }

      setIsAuditing(false);
      setAuditProgress("");
      toast({ title: "Audit Complete", description: `Detected ${flagged} incorrect entries.` });
  };

  const purgeIncorrectData = async () => {
      const suspicious = users.filter(u => u.securityStatus === 'suspicious');
      if (suspicious.length === 0) {
          toast({ title: "Registry Clean", description: "No incorrect data found." });
          return;
      }

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
      toast({ title: "Forensic Purge Complete", description: "Suspicious data permanently removed." });
  };

  const massActivateVerified = async () => {
      const pending = users.filter(u => !u.isBlocked && u.securityStatus !== 'suspicious');
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
      toast({ title: "Bulk Activation Complete", description: "Legitimate users are now confirmed." });
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
    <div className="min-h-full bg-white -m-4 md:-m-6 lg:-m-8 p-4 md:p-8 lg:p-10 space-y-10">
      {/* Design Header */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tighter font-headline text-[#1a1a1a]">System Management</h1>
          <p className="text-sm text-muted-foreground font-medium max-w-xl">
            Centralized command for registry integrity and professional approvals. All jach (inspection) metrics are real-time.
          </p>
        </div>
        
        {/* Design Action Grid */}
        <div className="flex flex-wrap gap-3">
            <Button onClick={runSecurityAudit} disabled={isAuditing} variant="outline" className="bg-white hover:bg-muted text-[#1a1a1a] font-bold h-12 px-6 border-2 border-primary/10 rounded-xl shadow-sm transition-all active:scale-95">
                {isAuditing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4 text-primary" />}
                Integrity Scan
            </Button>
            <Button onClick={purgeIncorrectData} disabled={isAuditing} className="bg-[#ef4444] hover:bg-[#dc2626] text-white font-bold h-12 px-6 rounded-xl shadow-lg shadow-red-500/20 active:scale-95 transition-all">
                <ShieldX className="mr-2 h-4 w-4" />
                Purge Fake Data
            </Button>
            <Button onClick={massActivateVerified} disabled={isAuditing} className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold h-12 px-6 rounded-xl shadow-lg shadow-blue-500/20 active:scale-95 transition-all">
                <ShieldCheck className="mr-2 h-4 w-4" />
                Verify AI-Approved
            </Button>
        </div>
      </div>

      {auditProgress && (
          <div className="bg-primary/5 border-2 border-primary/10 p-4 rounded-2xl flex items-center gap-4 animate-pulse">
              <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
              <p className="text-sm font-bold text-primary uppercase tracking-widest">{auditProgress}</p>
          </div>
      )}

      <Tabs defaultValue="registry" className="space-y-8">
        <TabsList className="bg-muted/30 p-1.5 rounded-2xl border-2 border-primary/5 w-fit">
            <TabsTrigger value="registry" className="rounded-xl px-8 h-11 font-black data-[state=active]:bg-white data-[state=active]:shadow-xl data-[state=active]:text-primary transition-all">Identity Registry</TabsTrigger>
            <TabsTrigger value="advocates" className="rounded-xl px-8 h-11 font-black data-[state=active]:bg-white data-[state=active]:shadow-xl data-[state=active]:text-primary transition-all">
                Advocate Review
                {pendingAdvocates.length > 0 && <Badge className="ml-3 bg-primary text-white h-6 px-2.5 rounded-full">{pendingAdvocates.length}</Badge>}
            </TabsTrigger>
        </TabsList>

        <TabsContent value="registry" className="mt-0">
            <Card className="border-2 border-primary/5 shadow-2xl rounded-[2.5rem] overflow-hidden bg-white">
                <CardHeader className="bg-muted/10 border-b border-primary/5 p-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="space-y-1">
                            <CardTitle className="font-headline font-black text-2xl tracking-tight text-[#1a1a1a]">Member Registry</CardTitle>
                            <CardDescription className="text-sm font-medium">Accounts detected are listed for administrative jach.</CardDescription>
                        </div>
                        <div className="relative group w-full md:w-96">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <Input 
                                placeholder="Filter registry..." 
                                className="pl-12 h-12 w-full bg-muted/20 font-bold border-2 border-transparent focus:border-primary rounded-2xl transition-all" 
                                value={searchQuery}
                                onChange={(e) => setSearchSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-muted/20">
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="font-black text-[11px] text-muted-foreground uppercase tracking-[0.2em] pl-10 h-16">Identity</TableHead>
                                <TableHead className="font-black text-[11px] text-muted-foreground uppercase tracking-[0.2em] text-center">Security Jach</TableHead>
                                <TableHead className="font-black text-[11px] text-muted-foreground uppercase tracking-[0.2em] text-center">Status</TableHead>
                                <TableHead className="font-black text-[11px] text-muted-foreground uppercase tracking-[0.2em] text-right pr-10">Controls</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.map((user) => (
                                <TableRow key={user.uid} className={cn("hover:bg-muted/5 transition-colors border-b border-primary/5", user.securityStatus === 'suspicious' && "bg-red-50/30")}>
                                    <TableCell className="pl-10 py-6">
                                        <div className="flex items-center gap-4">
                                            <Avatar className="h-12 w-12 border-2 border-white shadow-xl">
                                                <AvatarImage src={user.photoURL} />
                                                <AvatarFallback className="font-black text-primary bg-primary/5">{user.firstName.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <span className="font-black text-base tracking-tight text-[#1a1a1a]">{user.firstName} {user.lastName}</span>
                                                <span className="text-xs text-muted-foreground font-bold opacity-70">{user.email}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex flex-col items-center gap-1">
                                            {user.securityStatus === 'suspicious' ? (
                                                <Badge className="bg-red-500 text-white font-black text-[10px] uppercase rounded-lg px-3 py-1.5">Incorrect Entry</Badge>
                                            ) : user.securityStatus === 'verified' ? (
                                                <Badge className="bg-green-500 text-white font-black text-[10px] uppercase rounded-lg px-3 py-1.5">Genuine Identity</Badge>
                                            ) : (
                                                <Badge variant="secondary" className="bg-muted text-muted-foreground font-black text-[10px] uppercase rounded-lg px-3 py-1.5 opacity-50">Forensic Audit</Badge>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {user.securityStatus === 'verified' ? (
                                            <span className="text-[11px] font-black text-green-600 uppercase tracking-widest">Confirmed</span>
                                        ) : (
                                            <span className="text-[11px] font-black text-[#ef4444] uppercase tracking-widest bg-red-50 px-3 py-1 rounded-full">NOT VERIFYED ALL</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right pr-10">
                                        <div className="flex items-center justify-end gap-3">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-muted active:scale-90 transition-all">
                                                        <MoreHorizontal className="h-5 w-5" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl shadow-2xl border-2 border-primary/5 bg-white">
                                                    <DropdownMenuLabel className="font-black text-[10px] uppercase tracking-widest opacity-50 px-3">Identity Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem asChild className="rounded-xl font-bold h-11 px-3">
                                                        <UserDetailsModal user={user} trigger={
                                                            <button className="flex items-center w-full outline-none">
                                                                <Eye className="mr-3 h-4 w-4" /> View Details
                                                            </button>
                                                        } />
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="rounded-xl font-bold h-11 px-3"><Mail className="mr-3 h-4 w-4" /> Send Email</DropdownMenuItem>
                                                    <DropdownMenuItem className="rounded-xl font-bold h-11 px-3"><MessageSquare className="mr-3 h-4 w-4" /> Message</DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="rounded-xl font-bold h-11 px-3 text-red-600 focus:text-red-600 focus:bg-red-50"><Trash2 className="mr-3 h-4 w-4" /> Flag Content</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                            
                                            <Button 
                                                className={cn(
                                                    "h-10 px-6 font-black text-[11px] uppercase tracking-wider rounded-xl active:scale-95 transition-all shadow-sm",
                                                    user.isBlocked ? "bg-white border-2 border-primary/10 text-primary hover:bg-primary/5" : "bg-[#ef4444] hover:bg-[#dc2626] text-white"
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
                    <div className="p-8 bg-muted/5 border-t border-primary/5">
                        <Button variant="outline" className="font-black text-xs uppercase tracking-widest border-2 border-dashed border-primary/20 bg-white hover:bg-primary hover:text-white h-12 px-8 rounded-2xl transition-all">
                            <UserPlus className="mr-3 h-4 w-4" />
                            Add New Member
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="advocates">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {advocates.length > 0 ? advocates.map((adv) => {
                    const isProcessing = processingUid === adv.uid;
                    return (
                        <Card key={adv.uid} className={cn("group overflow-hidden border-2 border-primary/5 shadow-xl transition-all duration-500 hover:shadow-2xl rounded-[2.5rem] bg-white", adv.isApproved && "border-green-500/20")}>
                            <div className="p-8 space-y-6">
                                <div className="flex items-start justify-between">
                                    <div className="relative">
                                        <Avatar className="h-20 w-20 border-4 border-white shadow-2xl rounded-3xl">
                                            <AvatarFallback className="font-black text-2xl bg-primary text-white">{adv.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        {adv.isApproved && (
                                            <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-1.5 rounded-xl shadow-lg">
                                                <CheckCircle className="h-4 w-4" />
                                            </div>
                                        )}
                                    </div>
                                    {adv.isApproved ? (
                                        <Badge className="bg-green-500 text-white font-black text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-xl">Live Profile</Badge>
                                    ) : (
                                        <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 font-black text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-xl">Pending Review</Badge>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-2xl font-black tracking-tighter text-[#1a1a1a]">{adv.name}</h3>
                                    <p className="text-xs font-black text-primary uppercase tracking-[0.2em]">{adv.specialty}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-6 pt-4 border-t border-primary/5">
                                    <div className="space-y-1.5">
                                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2"><GraduationCap className="h-3.5 w-3.5 text-primary" /> Bar ID</p>
                                        <p className="text-sm font-black text-[#1a1a1a] truncate">{adv.barId}</p>
                                    </div>
                                    <div className="space-y-1.5">
                                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-primary" /> Location</p>
                                        <p className="text-sm font-black text-[#1a1a1a] truncate">{adv.courtName}</p>
                                    </div>
                                </div>
                                {adv.certificateName && (
                                    <div className="p-4 rounded-2xl bg-muted/20 border-2 border-transparent group-hover:border-primary/10 flex items-center gap-4 transition-all">
                                        <div className="h-10 w-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary">
                                            <FileText className="h-5 w-5" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">Attached Cert</p>
                                            <p className="text-xs font-bold truncate text-[#1a1a1a]">{adv.certificateName}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="p-6 bg-muted/10 border-t border-primary/5 flex gap-3">
                                {!adv.isApproved && (
                                    <Button 
                                        className="flex-1 h-12 font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 active:scale-95 transition-all bg-primary text-white rounded-2xl"
                                        onClick={() => approveAdvocate(adv)}
                                        disabled={isProcessing}
                                    >
                                        {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify & Activate"}
                                    </Button>
                                )}
                                <Button variant="outline" size="icon" className="h-12 w-12 border-2 border-primary/10 hover:bg-white hover:border-primary rounded-2xl transition-all shadow-sm">
                                    <Eye className="h-5 w-5 text-[#1a1a1a]" />
                                </Button>
                            </div>
                        </Card>
                    );
                }) : (
                    <div className="col-span-full py-40 text-center bg-muted/5 rounded-[3rem] border-4 border-dashed border-primary/5">
                        <div className="h-20 w-20 bg-white rounded-3xl shadow-xl mx-auto mb-8 flex items-center justify-center text-primary/20">
                            <Gavel className="h-10 w-10" />
                        </div>
                        <h3 className="text-2xl font-black font-headline tracking-tighter text-[#1a1a1a]">Queue is Clear</h3>
                        <p className="text-muted-foreground max-w-sm mx-auto mt-3 text-sm font-medium">New professional applications will appear here for forensic inspection.</p>
                    </div>
                )}
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
