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
import { Users, ShieldCheck, Gavel, Loader2, Search, Filter, BadgeCheck, CalendarDays, Ban, CheckCircle, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  courtName: string;
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

  useEffect(() => {
    if (!auth.currentUser) {
        router.push('/login');
        return;
    }

    let isSubscribed = true;

    const checkAdmin = async () => {
        try {
            const adminDoc = await getDoc(doc(firestore, "users", auth.currentUser!.uid));
            const adminData = adminDoc.data() as UserRecord;
            const isSuperAdmin = adminData?.email === 'enterspaceindia@gmail.com' || !!adminData?.isAdmin;

            if (!isSuperAdmin && isSubscribed) {
                toast({
                    variant: "destructive",
                    title: "Access Denied",
                    description: "You do not have permission to view the Management Console."
                });
                router.push('/dashboard');
                return false;
            }
            return true;
        } catch (err) {
            console.error("Admin check failed:", err);
            return false;
        }
    };

    const setupListeners = async () => {
        const isAdminUser = await checkAdmin();
        if (!isAdminUser || !isSubscribed) return;

        // Fetch Users from Firestore
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
        });

        // Fetch Advocate verification details from RTDB
        const advocatesRef = ref(rtdb, "advocates");
        const unsubscribeAdvocates = onValue(advocatesRef, (snapshot) => {
            if (snapshot.exists() && isSubscribed) {
                setAdvocates(snapshot.val());
            }
        }, (error) => {
            console.warn("RTDB listener skipped:", error.message);
        });

        return () => {
            unsubscribeUsers();
            unsubscribeAdvocates();
        };
    };

    const cleanupPromise = setupListeners();

    return () => {
        isSubscribed = false;
        cleanupPromise.then(cleanup => cleanup?.());
    };
  }, [firestore, rtdb, auth, router, toast]);

  const toggleUserBlock = async (user: UserRecord) => {
    setProcessingUid(user.uid);
    const newBlockedStatus = !user.isBlocked;
    
    try {
        const userRef = doc(firestore, "users", user.uid);
        await updateDoc(userRef, { isBlocked: newBlockedStatus });

        try {
            await update(ref(rtdb, `users/${user.uid}`), { isBlocked: newBlockedStatus });
        } catch (rtdbError) {
            console.warn("RTDB sync failed during block action.");
        }

        toast({
            title: newBlockedStatus ? "User Suspended" : "User Restored",
            description: `${user.firstName} ${user.lastName}'s access has been updated.`
        });
    } catch (error: any) {
        toast({ variant: "destructive", title: "Action Failed", description: error.message });
    } finally {
        setProcessingUid(null);
    }
  };

  const approveAdvocate = async (adv: AdvocateRecord) => {
      setProcessingUid(adv.uid);
      try {
          // Manual Approval happens in RTDB where the public directory is powered from
          await update(ref(rtdb, `advocates/${adv.uid}`), { isApproved: true });
          toast({
              title: "Advocate Approved",
              description: `${adv.name} is now listed in the public directory.`,
          });
      } catch (error: any) {
          toast({ variant: "destructive", title: "Approval Failed", description: error.message });
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
    <Table>
        <TableHeader className="bg-muted/20">
            <TableRow>
            <TableHead className="font-bold text-[11px] text-muted-foreground pl-6">User Identity</TableHead>
            <TableHead className="font-bold text-[11px] text-muted-foreground">Type</TableHead>
            <TableHead className="font-bold text-[11px] text-muted-foreground">Professional Status</TableHead>
            <TableHead className="font-bold text-[11px] text-muted-foreground">Approval</TableHead>
            <TableHead className="font-bold text-[11px] text-muted-foreground text-right pr-6">Management</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {userList.length > 0 ? userList.map((user) => {
            const adv = advocates[user.uid];
            if (showOnlyPending && (!adv || adv.isApproved)) return null;
            
            const isProcessing = processingUid === user.uid;
            return (
                <TableRow key={user.uid} className={cn("hover:bg-muted/10 transition-colors", user.isBlocked && "bg-destructive/5 opacity-80")}>
                <TableCell className="pl-6">
                    <div className="flex items-center gap-3 py-1">
                    <Avatar className="h-9 w-9 border border-primary/10">
                        <AvatarImage src={user.photoURL} className="object-cover" />
                        <AvatarFallback className="font-bold">{user.firstName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="font-bold text-sm tracking-tight">{user.firstName} {user.lastName}</span>
                        <span className="text-[10px] text-muted-foreground font-medium">{user.email}</span>
                    </div>
                    </div>
                </TableCell>
                <TableCell>
                    <Badge variant="outline" className="capitalize text-[10px] font-bold border-primary/10 bg-primary/5 text-primary px-3 rounded-lg">
                    {user.userType}
                    </Badge>
                </TableCell>
                <TableCell>
                    {adv ? (
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-foreground truncate max-w-[150px]">{adv.specialty}</span>
                        {adv.isVerified && <BadgeCheck className="h-3.5 w-3.5 text-blue-500" />}
                        </div>
                        <span className="text-[9px] font-bold text-muted-foreground opacity-60">Verified Bar ID: {adv.barId}</span>
                    </div>
                    ) : user.userType === 'lawyer' ? (
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-amber-600">Pending Setup</span>
                        <span className="text-[9px] text-muted-foreground font-medium italic">Profile not yet configured</span>
                    </div>
                    ) : (
                    <span className="text-[10px] font-bold text-muted-foreground/40 italic">Not Listed</span>
                    )}
                </TableCell>
                <TableCell>
                    {adv ? (
                        adv.isApproved ? (
                            <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/20 text-[9px] font-black uppercase">Approved</Badge>
                        ) : (
                            <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-7 px-3 bg-amber-500/10 text-amber-600 border-amber-500/20 text-[9px] font-black uppercase hover:bg-amber-500 hover:text-white"
                                onClick={() => approveAdvocate(adv)}
                                disabled={isProcessing}
                            >
                                {isProcessing ? <Loader2 className="h-3 w-3 animate-spin" /> : "Approve Listing"}
                            </Button>
                        )
                    ) : (
                        <span className="text-[9px] font-bold text-muted-foreground/40">N/A</span>
                    )}
                </TableCell>
                <TableCell className="text-right pr-6">
                    <Button 
                    variant={user.isBlocked ? "outline" : "destructive"} 
                    size="sm" 
                    className="h-8 px-4 font-bold text-[10px] rounded-lg active:scale-95 transition-all"
                    onClick={() => toggleUserBlock(user)}
                    disabled={isProcessing || user.email === 'enterspaceindia@gmail.com'}
                    >
                    {isProcessing ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                    ) : user.isBlocked ? (
                        <><CheckCircle className="mr-2 h-3 w-3" /> Unblock</>
                    ) : (
                        <><Ban className="mr-2 h-3 w-3" /> Block</>
                    )}
                    </Button>
                </TableCell>
                </TableRow>
            );
            }) : (
            <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground font-medium">
                No users found matching your criteria.
                </TableCell>
            </TableRow>
            )}
        </TableBody>
    </Table>
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <PageHeader
        title="Management Console"
        description="Unified interface for system oversight and professional verification management."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-primary/5 bg-primary/5 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-primary">Active Base</CardDescription>
            <CardTitle className="text-3xl font-black font-headline flex items-center justify-between">
              {stats.totalUsers}
              <Users className="h-5 w-5 text-primary/40" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground font-medium">Total registered citizens & professionals</p>
          </CardContent>
        </Card>
        <Card className="border-primary/5 bg-primary/5 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-primary">Total Directory</CardDescription>
            <CardTitle className="text-3xl font-black font-headline flex items-center justify-between">
              {stats.totalAdvocates}
              <Gavel className="h-5 w-5 text-primary/40" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground font-medium">Total advocates registered on platform</p>
          </CardContent>
        </Card>
        <Card className={cn("border-primary/5 shadow-sm", stats.pendingApprovals > 0 ? "bg-amber-500/5" : "bg-primary/5")}>
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-primary">Pending Approvals</CardDescription>
            <CardTitle className={cn("text-3xl font-black font-headline flex items-center justify-between", stats.pendingApprovals > 0 ? "text-amber-600" : "")}>
              {stats.pendingApprovals}
              <Clock className={cn("h-5 w-5", stats.pendingApprovals > 0 ? "text-amber-500/40" : "text-primary/40")} />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground font-medium">Advocates awaiting manual verification</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-primary/5 shadow-xl rounded-2xl overflow-hidden">
        <CardHeader className="border-b bg-muted/30">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="font-headline font-black text-xl tracking-tight text-primary">System Oversight</CardTitle>
              <CardDescription className="font-medium text-xs">Manage user access and verify professional credentials.</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search members..." 
                  className="pl-9 h-10 w-full md:w-64 bg-background/50 font-medium text-sm border-primary/10" 
                  value={searchQuery}
                  onChange={(e) => setSearchSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon" className="h-10 w-10 border-primary/10">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs defaultValue={activeTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md mb-6">
                <TabsTrigger value="users" className="font-bold text-xs uppercase tracking-tight">User Registry</TabsTrigger>
                <TabsTrigger value="verification" className="font-bold text-xs uppercase tracking-tight flex items-center gap-2">
                    Verification Queue
                    {stats.pendingApprovals > 0 && <Badge variant="destructive" className="h-4 w-4 p-0 flex items-center justify-center text-[8px] animate-pulse">{stats.pendingApprovals}</Badge>}
                </TabsTrigger>
            </TabsList>
            
            <TabsContent value="users" className="mt-0">
                {renderTable(filteredUsers)}
            </TabsContent>
            
            <TabsContent value="verification" className="mt-0">
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
