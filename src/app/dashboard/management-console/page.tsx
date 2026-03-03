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
import { Users, ShieldCheck, Loader2, Search, Ban, UserCheck, AlertTriangle, ShieldAlert, Sparkles, ShieldX, CheckCircle, Gavel, BadgeCheck, Clock, Eye, Briefcase, GraduationCap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { validateUserDetails } from "@/ai/flows/validate-user-details";
import { onAuthStateChanged } from "firebase/auth";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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
            setUsers(list.sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0)));
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
          // 1. Approve professional listing
          await update(ref(rtdb, `advocates/${adv.uid}`), { isApproved: true, isVerified: true });
          
          // 2. Activate central identity (Proper Sync)
          const userRef = doc(firestore, "users", adv.uid);
          await updateDoc(userRef, { 
              securityStatus: 'verified',
              isBlocked: false 
          });
          
          await update(ref(rtdb, `users/${adv.uid}`), { isBlocked: false });

          toast({ title: "Advocate Approved", description: `${adv.name}'s identity and listing are now active.` });
      } catch (error: any) {
          toast({ variant: "destructive", title: "Approval Failed" });
      } finally {
          setProcessingUid(null);
      }
  };

  const runSecurityAudit = async () => {
      setIsAuditing(true);
      setAuditProgress("Starting forensic scan...");
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
                      flagReason: validation.reason || "AI Security Audit: Incorrect identity patterns detected."
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
          toast({ title: "Registry Clean", description: "No incorrect entries identified." });
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
      toast({ title: "Database Purged", description: "Incorrect entries permanently removed." });
  };

  const massActivateVerified = async () => {
      const pending = users.filter(u => !u.isBlocked && u.securityStatus !== 'suspicious');
      if (pending.length === 0) return;

      setIsAuditing(true);
      setAuditProgress(`Activating ${pending.length} verified accounts...`);

      for (const user of pending) {
          try {
              await updateDoc(doc(firestore, "users", user.uid), { securityStatus: 'verified' });
          } catch (e) {}
      }

      setIsAuditing(false);
      setAuditProgress("");
      toast({ title: "Identities Restored", description: "Legitimate users are now active." });
  };

  const filteredUsers = users.filter(u => 
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingAdvocates = advocates.filter(a => !a.isApproved);

  if (loading) {
    return <div className="flex h-[70vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader
            title="System Management"
            description="Centralized command for registry integrity and professional approvals."
        />
        <div className="flex flex-wrap gap-2">
            <Button onClick={runSecurityAudit} disabled={isAuditing} variant="outline" className="font-bold border-primary/20 h-11">
                {isAuditing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4 text-primary" />}
                Integrity Scan
            </Button>
            <Button onClick={purgeIncorrectData} disabled={isAuditing} variant="destructive" className="font-bold h-11">
                <ShieldX className="mr-2 h-4 w-4" />
                Purge Fake Data
            </Button>
            <Button onClick={massActivateVerified} disabled={isAuditing} className="font-bold h-11 shadow-lg shadow-primary/20">
                <ShieldCheck className="mr-2 h-4 w-4" />
                Verify AI-Approved
            </Button>
        </div>
      </div>

      {auditProgress && (
          <div className="bg-primary/10 border border-primary/20 p-3 rounded-xl flex items-center gap-3 animate-pulse">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <p className="text-xs font-bold text-primary uppercase tracking-widest">{auditProgress}</p>
          </div>
      )}

      <Tabs defaultValue="registry" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-md bg-muted/50 p-1 rounded-xl">
            <TabsTrigger value="registry" className="rounded-lg font-bold">Identity Registry</TabsTrigger>
            <TabsTrigger value="advocates" className="rounded-lg font-bold">
                Advocate Review
                {pendingAdvocates.length > 0 && <Badge className="ml-2 bg-primary text-white h-5 px-1.5">{pendingAdvocates.length}</Badge>}
            </TabsTrigger>
        </TabsList>

        <TabsContent value="registry">
            <Card className="border-primary/5 shadow-2xl rounded-2xl overflow-hidden bg-card/40 backdrop-blur-md">
                <CardHeader className="bg-muted/30 border-b border-primary/5 p-6">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="space-y-1">
                            <CardTitle className="font-headline font-black text-xl tracking-tight text-primary">Member Monitor</CardTitle>
                            <CardDescription className="text-xs font-medium italic text-muted-foreground">Accounts not finalized are labeled "not verifyed all".</CardDescription>
                        </div>
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <Input 
                                placeholder="Filter registry..." 
                                className="pl-9 h-11 w-full md:w-72 bg-background/50 font-bold border-primary/10 rounded-xl" 
                                value={searchQuery}
                                onChange={(e) => setSearchSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-muted/20">
                            <TableRow>
                                <TableHead className="font-bold text-[11px] uppercase tracking-wider pl-6">Identity</TableHead>
                                <TableHead className="font-bold text-[11px] uppercase tracking-wider text-center">Security Jach</TableHead>
                                <TableHead className="font-bold text-[11px] uppercase tracking-wider text-center">Status</TableHead>
                                <TableHead className="font-bold text-[11px] uppercase tracking-wider text-right pr-6">Controls</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.map((user) => (
                                <TableRow key={user.uid} className={cn("hover:bg-muted/5 transition-colors", user.securityStatus === 'suspicious' && "bg-destructive/5")}>
                                    <TableCell className="pl-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10 border border-primary/10 shadow-sm">
                                                <AvatarImage src={user.photoURL} />
                                                <AvatarFallback className="font-bold text-primary bg-primary/5">{user.firstName.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-sm tracking-tight">{user.firstName} {user.lastName}</span>
                                                <span className="text-[10px] text-muted-foreground font-medium">{user.email}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {user.securityStatus === 'suspicious' ? (
                                            <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-[9px] font-black uppercase">Incorrect Entry</Badge>
                                        ) : user.securityStatus === 'verified' ? (
                                            <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20 text-[9px] font-black uppercase">Genuine</Badge>
                                        ) : (
                                            <Badge variant="secondary" className="text-[9px] font-black uppercase opacity-50">Pending Audit</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {user.securityStatus === 'verified' ? (
                                            <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20 text-[9px] font-black uppercase">Confirmed</Badge>
                                        ) : (
                                            <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/20 text-[9px] font-black uppercase">not verifyed all</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right pr-6">
                                        <Button 
                                            variant={user.isBlocked ? "outline" : "destructive"} 
                                            size="sm" 
                                            className="h-9 px-4 font-bold text-[10px] rounded-xl active:scale-95 transition-all"
                                            onClick={() => toggleUserBlock(user)}
                                            disabled={processingUid === user.uid || user.email === 'enterspaceindia@gmail.com'}
                                        >
                                            {processingUid === user.uid ? <Loader2 className="h-3 w-3 animate-spin" /> : user.isBlocked ? "Restore" : "Suspend"}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="advocates">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {advocates.length > 0 ? advocates.map((adv) => {
                    const isProcessing = processingUid === adv.uid;
                    return (
                        <Card key={adv.uid} className={cn("overflow-hidden border-primary/10 shadow-xl transition-all hover:border-primary/30", adv.isApproved && "bg-green-500/5")}>
                            <CardHeader className="pb-4 bg-muted/20 border-b border-primary/5">
                                <div className="flex items-center justify-between">
                                    <Avatar className="h-12 w-12 border-2 border-background shadow-lg">
                                        <AvatarFallback className="font-bold bg-primary text-white">{adv.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    {adv.isApproved ? (
                                        <Badge className="bg-green-500 text-white font-black text-[9px] uppercase tracking-tighter">Listed & Active</Badge>
                                    ) : (
                                        <Badge variant="secondary" className="text-amber-600 bg-amber-500/10 font-black text-[9px] uppercase tracking-tighter">Awaiting Review</Badge>
                                    )}
                                </div>
                                <div className="pt-4 space-y-1">
                                    <CardTitle className="text-lg font-black tracking-tight">{adv.name}</CardTitle>
                                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest">{adv.specialty}</p>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1"><GraduationCap className="h-3 w-3" /> Bar ID</p>
                                        <p className="text-xs font-bold truncate">{adv.barId}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1"><MapPin className="h-3 w-3" /> Court</p>
                                        <p className="text-xs font-bold truncate">{adv.courtName}</p>
                                    </div>
                                </div>
                                {adv.certificateName && (
                                    <div className="p-3 rounded-lg bg-primary/5 border border-primary/10 flex items-center gap-3">
                                        <ShieldCheck className="h-4 w-4 text-primary" />
                                        <span className="text-[10px] font-bold truncate">{adv.certificateName}</span>
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter className="bg-muted/10 border-t border-primary/5 p-4 flex gap-2">
                                {!adv.isApproved && (
                                    <Button 
                                        className="flex-1 h-10 font-bold shadow-lg shadow-primary/20 active:scale-95 transition-all"
                                        onClick={() => approveAdvocate(adv)}
                                        disabled={isProcessing}
                                    >
                                        {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify & Activate"}
                                    </Button>
                                )}
                                <Button variant="outline" size="icon" className="h-10 w-10 border-primary/10 hover:bg-primary/5">
                                    <Eye className="h-4 w-4 text-primary" />
                                </Button>
                            </CardFooter>
                        </Card>
                    );
                }) : (
                    <div className="col-span-full py-32 text-center bg-muted/5 rounded-3xl border-2 border-dashed border-primary/10">
                        <Gavel className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                        <h3 className="text-xl font-black font-headline tracking-tighter">No Professional Applications</h3>
                        <p className="text-muted-foreground max-w-[250px] mx-auto mt-2 text-xs font-medium">New advocate listings requiring manual jach will appear here.</p>
                    </div>
                )}
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
