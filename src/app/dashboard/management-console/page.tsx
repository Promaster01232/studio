"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useFirestore, useDatabase, useAuth } from "@/firebase";
import { collection, doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { ref, onValue, update } from "firebase/database";
import { Users, ShieldCheck, Gavel, Loader2, Search, Filter, BadgeCheck, CalendarDays, Ban, CheckCircle, Clock, Eye, Info, Briefcase, MapPin, GraduationCap, UserCheck, ShieldAlert } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError, type SecurityRuleContext } from "@/firebase/errors";

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
}

interface AdvocateRecord {
  uid: string;
  name: string;
  barId: string;
  specialty: string;
  isVerified: boolean;
  isApproved: boolean;
  isBlocked?: boolean;
  courtName: string;
  about?: string;
  experience?: string;
  position?: string;
  courts?: string[];
  certificateName?: string;
}

function AdvocateDetailsModal({ adv, onApprove, isProcessing }: { adv: AdvocateRecord, onApprove: (adv: AdvocateRecord) => void, isProcessing: boolean }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:bg-primary/10">
                    <Eye className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Gavel className="h-5 w-5 text-primary" />
                        Professional Credentials: {adv.name}
                    </DialogTitle>
                    <DialogDescription>Review full professional details submitted for verification.</DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-[60vh] pr-4">
                    <div className="space-y-6 py-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="p-3 rounded-xl bg-muted/30 border space-y-1">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                                    <GraduationCap className="h-3 w-3" /> Bar Council ID
                                </p>
                                <p className="font-bold text-sm">{adv.barId}</p>
                            </div>
                            <div className="p-3 rounded-xl bg-muted/30 border space-y-1">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                                    <Briefcase className="h-3 w-3" /> Practice Area
                                </p>
                                <p className="font-bold text-sm">{adv.specialty}</p>
                            </div>
                            <div className="p-3 rounded-xl bg-muted/30 border space-y-1">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                                    <MapPin className="h-3 w-3" /> Primary Court
                                </p>
                                <p className="font-bold text-sm">{adv.courtName}</p>
                            </div>
                            <div className="p-3 rounded-xl bg-muted/30 border space-y-1">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                                    <Clock className="h-3 w-3" /> Total Experience
                                </p>
                                <p className="font-bold text-sm">{adv.experience || 'Not specified'}</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h4 className="text-xs font-bold text-primary uppercase tracking-widest px-1">Professional Bio</h4>
                            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                                <p className="text-sm leading-relaxed whitespace-pre-line font-medium text-foreground/80">
                                    {adv.about || "No bio provided."}
                                </p>
                            </div>
                        </div>

                        {adv.courts && adv.courts.length > 0 && (
                            <div className="space-y-2">
                                <h4 className="text-xs font-bold text-primary uppercase tracking-widest px-1">Authorized Courts</h4>
                                <div className="flex flex-wrap gap-2">
                                    {adv.courts.map(c => (
                                        <Badge key={c} variant="secondary" className="bg-background border font-bold text-[10px] py-1">{c}</Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {adv.certificateName && (
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-green-500/5 border border-green-500/10">
                                <ShieldCheck className="h-5 w-5 text-green-600" />
                                <div className="flex-1">
                                    <p className="text-[10px] font-bold text-green-600 uppercase tracking-tight">AI-Authenticated Attachment</p>
                                    <p className="text-xs font-medium truncate">{adv.certificateName}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>
                <div className="flex justify-end gap-3 pt-4 border-t">
                    {!adv.isApproved && (
                        <Button 
                            className="bg-primary text-white font-bold h-11 px-8 active:scale-95 transition-all shadow-lg shadow-primary/20"
                            onClick={() => onApprove(adv)}
                            disabled={isProcessing}
                        >
                            {isProcessing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                            Approve Listing
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

function ManagementConsoleContent() {
  const firestore = useFirestore();
  const rtdb = useDatabase();
  const auth = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [advocates, setAdvocates] = useState<Record<string, AdvocateRecord>>({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchSearchQuery] = useState("");
  const [processingUid, setProcessingUid] = useState<string | null>(null);

  const activeTab = searchParams.get("tab") || "users";

  const handleTabChange = (val: string) => {
      const params = new URLSearchParams(searchParams);
      params.set("tab", val);
      router.push(`?${params.toString()}`);
  };

  useEffect(() => {
    if (!auth.currentUser) {
        router.push('/login');
        return;
    }

    let isSubscribed = true;

    const checkAdminAndSetupListeners = async () => {
        try {
            const adminDoc = await getDoc(doc(firestore, "users", auth.currentUser!.uid));
            const adminData = adminDoc.data() as UserRecord;
            const isSuperAdmin = adminData?.email === 'enterspaceindia@gmail.com' || !!adminData?.isAdmin;

            if (!isSuperAdmin) {
                if (isSubscribed) {
                    toast({
                        variant: "destructive",
                        title: "Access Denied",
                        description: "You do not have permission to view the Management Console."
                    });
                    router.push('/dashboard');
                }
                return;
            }

            // Setup real-time listeners only if confirmed admin
            const usersCol = collection(firestore, "users");
            const unsubscribeUsers = onSnapshot(usersCol, (snapshot) => {
                const usersList = snapshot.docs.map(doc => ({
                    ...doc.data(),
                    uid: doc.id
                } as UserRecord));
                
                const sorted = usersList.sort((a, b) => {
                    const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.createdAt || 0);
                    const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.createdAt || 0);
                    return Number(timeB) - Number(timeA);
                });
                
                if (isSubscribed) {
                    setUsers(sorted);
                    setLoading(false);
                }
            }, async (serverError) => {
                const permissionError = new FirestorePermissionError({
                    path: usersCol.path,
                    operation: 'list',
                } satisfies SecurityRuleContext, serverError);
                errorEmitter.emit('permission-error', permissionError);
            });

            const advocatesRef = ref(rtdb, "advocates");
            const unsubscribeAdvocates = onValue(advocatesRef, (snapshot) => {
                if (snapshot.exists() && isSubscribed) {
                    setAdvocates(snapshot.val());
                }
            });

            return () => {
                unsubscribeUsers();
                unsubscribeAdvocates();
            };
        } catch (err) {
            console.error("Management Console Initialization Error:", err);
            if (isSubscribed) setLoading(false);
        }
    };

    const cleanupPromise = checkAdminAndSetupListeners();

    return () => {
        isSubscribed = false;
        cleanupPromise.then(cleanup => cleanup?.());
    };
  }, [firestore, rtdb, auth, router, toast]);

  const toggleUserBlock = async (user: UserRecord) => {
    if (user.email === 'enterspaceindia@gmail.com') {
        toast({ variant: "destructive", title: "Action Forbidden", description: "Super Admin cannot be suspended." });
        return;
    }

    setProcessingUid(user.uid);
    const newBlockedStatus = !user.isBlocked;
    const userRef = doc(firestore, "users", user.uid);
    
    // 1. Update Firestore (Primary Source of Truth for Blocking)
    updateDoc(userRef, { isBlocked: newBlockedStatus })
        .catch(async (serverError) => {
            const permissionError = new FirestorePermissionError({
                path: userRef.path,
                operation: 'update',
                requestResourceData: { isBlocked: newBlockedStatus },
            } satisfies SecurityRuleContext, serverError);
            errorEmitter.emit('permission-error', permissionError);
        });

    // 2. Synchronize to RTDB (For live directory filtering)
    update(ref(rtdb, `users/${user.uid}`), { isBlocked: newBlockedStatus }).catch(err => {
        console.warn("RTDB user suspension sync skipped:", err.message);
    });
    
    if (user.userType === 'lawyer') {
        update(ref(rtdb, `advocates/${user.uid}`), { isBlocked: newBlockedStatus }).catch(err => {
            console.warn("RTDB advocate suspension sync skipped:", err.message);
        });
    }

    toast({
        title: newBlockedStatus ? "Account Suspended" : "Account Restored",
        description: `${user.firstName} ${user.lastName}'s access has been updated successfully.`
    });
    setProcessingUid(null);
  };

  const approveAdvocate = async (adv: AdvocateRecord) => {
      setProcessingUid(adv.uid);
      try {
          await update(ref(rtdb, `advocates/${adv.uid}`), { isApproved: true });
          toast({
              title: "Advocate Approved",
              description: `${adv.name} is now listed in the public directory.`,
          });
      } catch (error: any) {
          toast({ variant: "destructive", title: "Approval Failed", description: "Insufficient permissions to approve professional credentials." });
      } finally {
          setProcessingUid(null);
      }
  };

  const filteredUsers = users.filter(user => 
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingAdvocates = Object.values(advocates).filter(adv => !adv.isApproved);

  const stats = {
    totalUsers: users.length,
    totalAdvocates: Object.keys(advocates).length,
    pendingApprovals: pendingAdvocates.length,
  };

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const renderTable = (userList: UserRecord[], showOnlyPending: boolean = false) => (
    <div className="rounded-xl border border-primary/5 overflow-hidden">
        <Table>
            <TableHeader className="bg-muted/20">
                <TableRow>
                <TableHead className="font-bold text-[11px] text-muted-foreground pl-6 uppercase tracking-wider h-12">User Identity</TableHead>
                <TableHead className="font-bold text-[11px] text-muted-foreground uppercase tracking-wider text-center h-12">Role</TableHead>
                <TableHead className="font-bold text-[11px] text-muted-foreground uppercase tracking-wider h-12">Professional Status</TableHead>
                <TableHead className="font-bold text-[11px] text-muted-foreground uppercase tracking-wider text-center h-12">Approval</TableHead>
                <TableHead className="font-bold text-[11px] text-muted-foreground text-right pr-6 uppercase tracking-wider h-12">Account Access</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {userList.length > 0 ? userList.map((user) => {
                const adv = advocates[user.uid];
                if (showOnlyPending && (!adv || adv.isApproved)) return null;
                
                const isProcessing = processingUid === user.uid;
                return (
                    <TableRow key={user.uid} className={cn("hover:bg-muted/5 transition-colors border-b border-primary/5", user.isBlocked && "bg-destructive/5 opacity-80")}>
                    <TableCell className="pl-6 py-4">
                        <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border border-primary/10 shadow-sm">
                            <AvatarImage src={user.photoURL} className="object-cover" />
                            <AvatarFallback className="font-bold text-primary bg-primary/5">{user.firstName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className={cn("font-bold text-sm tracking-tight", user.isBlocked && "line-through text-muted-foreground")}>{user.firstName} {user.lastName}</span>
                            <span className="text-[10px] text-muted-foreground font-medium">{user.email}</span>
                        </div>
                        </div>
                    </TableCell>
                    <TableCell className="text-center py-4">
                        <Badge variant="outline" className="capitalize text-[10px] font-bold border-primary/10 bg-primary/5 text-primary px-3 rounded-lg">
                        {user.userType}
                        </Badge>
                    </TableCell>
                    <TableCell className="py-4">
                        {adv ? (
                        <div className="flex items-center gap-3">
                            <div className="flex flex-col gap-0.5">
                                <div className="flex items-center gap-2">
                                    <span className="text-[11px] font-bold text-foreground truncate max-w-[120px]">{adv.specialty}</span>
                                    {adv.isVerified && <BadgeCheck className="h-3.5 w-3.5 text-blue-500" />}
                                </div>
                                <span className="text-[9px] font-bold text-muted-foreground opacity-60">Bar ID: {adv.barId}</span>
                            </div>
                            <AdvocateDetailsModal adv={adv} onApprove={approveAdvocate} isProcessing={isProcessing} />
                        </div>
                        ) : user.userType === 'lawyer' ? (
                        <div className="flex flex-col gap-0.5">
                            <span className="text-[10px] font-bold text-amber-600 flex items-center gap-1">
                                <Clock className="h-3 w-3" /> Detail Pending
                            </span>
                            <span className="text-[9px] text-muted-foreground font-medium italic">Incomplete profile</span>
                        </div>
                        ) : (
                        <span className="text-[10px] font-bold text-muted-foreground/40 italic">Citizen Profile</span>
                        )}
                    </TableCell>
                    <TableCell className="text-center py-4">
                        {adv ? (
                            adv.isApproved ? (
                                <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/20 text-[9px] font-black uppercase tracking-tighter">Approved</Badge>
                            ) : (
                                <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="h-7 px-3 bg-amber-500/10 text-amber-600 border-amber-500/20 text-[9px] font-black uppercase tracking-tighter hover:bg-amber-500 hover:text-white transition-all"
                                    onClick={() => approveAdvocate(adv)}
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? <Loader2 className="h-3 w-3 animate-spin" /> : "Verify & Approve"}
                                </Button>
                            )
                        ) : (
                            <span className="text-[9px] font-bold text-muted-foreground/40">—</span>
                        )}
                    </TableCell>
                    <TableCell className="text-right pr-6 py-4">
                        <Button 
                        variant={user.isBlocked ? "outline" : "destructive"} 
                        size="sm" 
                        className={cn(
                            "h-9 px-4 font-bold text-[10px] rounded-xl active:scale-95 transition-all shadow-sm",
                            !user.isBlocked && "bg-destructive hover:bg-destructive/90 shadow-destructive/20"
                        )}
                        onClick={() => toggleUserBlock(user)}
                        disabled={isProcessing || user.email === 'enterspaceindia@gmail.com'}
                        >
                        {isProcessing ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                        ) : user.isBlocked ? (
                            <><UserCheck className="mr-2 h-3.5 w-3.5" /> Restore Account</>
                        ) : (
                            <><Ban className="mr-2 h-3.5 w-3.5" /> Suspend Account</>
                        )}
                        </Button>
                    </TableCell>
                    </TableRow>
                );
                }) : (
                <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center text-muted-foreground font-medium">
                    No matching members found in registry.
                    </TableCell>
                </TableRow>
                )}
            </TableBody>
        </Table>
    </div>
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <PageHeader
        title="Management Console"
        description="Unified interface for system oversight, professional verification, and real-time account access control."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-primary/5 bg-primary/5 shadow-sm overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Users className="h-20 w-20" />
          </div>
          <CardHeader className="pb-2 relative z-10">
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-primary">Active Base</CardDescription>
            <CardTitle className="text-3xl font-black font-headline flex items-center justify-between">
              {stats.totalUsers}
              <Users className="h-5 w-5 text-primary/40" />
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <p className="text-xs text-muted-foreground font-medium">Total registered citizens & professionals</p>
          </CardContent>
        </Card>
        <Card className="border-primary/5 bg-primary/5 shadow-sm overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Gavel className="h-20 w-20" />
          </div>
          <CardHeader className="pb-2 relative z-10">
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-primary">Professionals</CardDescription>
            <CardTitle className="text-3xl font-black font-headline flex items-center justify-between">
              {stats.totalAdvocates}
              <Gavel className="h-5 w-5 text-primary/40" />
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <p className="text-xs text-muted-foreground font-medium">Advocates with configured profiles</p>
          </CardContent>
        </Card>
        <Card className={cn("border-primary/5 shadow-sm overflow-hidden relative transition-colors duration-500", stats.pendingApprovals > 0 ? "bg-amber-500/10" : "bg-primary/5")}>
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <ShieldAlert className="h-20 w-20" />
          </div>
          <CardHeader className="pb-2 relative z-10">
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-primary">Vetting Queue</CardDescription>
            <CardTitle className={cn("text-3xl font-black font-headline flex items-center justify-between", stats.pendingApprovals > 0 ? "text-amber-600" : "")}>
              {stats.pendingApprovals}
              <Clock className={cn("h-5 w-5", stats.pendingApprovals > 0 ? "text-amber-500/40 animate-pulse" : "text-primary/40")} />
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <p className="text-xs text-muted-foreground font-medium">Applications awaiting manual approval</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-primary/5 shadow-2xl rounded-2xl overflow-hidden bg-card/40 backdrop-blur-md">
        <CardHeader className="border-b border-primary/5 bg-muted/30 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <CardTitle className="font-headline font-black text-xl tracking-tight text-primary">Platform Control Hub</CardTitle>
              <CardDescription className="font-medium text-xs">Manage individual account access and verify professional credentials.</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input 
                  placeholder="Filter name or email..." 
                  className="pl-9 h-11 w-full md:w-72 bg-background/50 font-bold text-sm border-primary/10 focus:border-primary rounded-xl" 
                  value={searchQuery}
                  onChange={(e) => setSearchSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon" className="h-11 w-11 border-primary/10 rounded-xl bg-background/50">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md mb-8 bg-muted/50 p-1 rounded-xl">
                <TabsTrigger value="users" className="font-black text-xs uppercase tracking-widest rounded-lg data-[state=active]:shadow-lg">Full User Registry</TabsTrigger>
                <TabsTrigger value="verification" className="font-black text-xs uppercase tracking-widest rounded-lg flex items-center gap-2 data-[state=active]:shadow-lg">
                    Verification Queue
                    {stats.pendingApprovals > 0 && <Badge variant="destructive" className="h-5 min-w-5 p-0 flex items-center justify-center text-[9px] font-black animate-pulse rounded-full">{stats.pendingApprovals}</Badge>}
                </TabsTrigger>
            </TabsList>
            
            <TabsContent value="users" className="mt-0 outline-none">
                {renderTable(filteredUsers)}
            </TabsContent>
            
            <TabsContent value="verification" className="mt-0 outline-none">
                {renderTable(filteredUsers.filter(u => u.userType === 'lawyer'), true)}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ManagementConsolePage() {
    return (
        <Suspense fallback={
            <div className="flex h-[70vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        }>
            <ManagementConsoleContent />
        </Suspense>
    );
}