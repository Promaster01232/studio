"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useFirestore, useDatabase, useAuth } from "@/firebase";
import { collection, query, getDocs, doc, getDoc, orderBy } from "firebase/firestore";
import { ref, get } from "firebase/database";
import { Users, ShieldCheck, Gavel, Loader2, Search, Filter, BadgeCheck, CalendarDays } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface UserRecord {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  userType: string;
  photoURL?: string;
  isAdmin?: boolean;
  createdAt?: any; // Firestore Timestamp
}

interface AdvocateRecord {
  uid: string;
  name: string;
  barId: string;
  specialty: string;
  isVerified: boolean;
  courtName: string;
}

export default function ManagementConsolePage() {
  const firestore = useFirestore();
  const rtdb = useDatabase();
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [advocates, setAdvocates] = useState<Record<string, AdvocateRecord>>({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (!auth.currentUser) {
          router.push('/login');
          return;
      }

      setLoading(true);
      try {
        // Verify Admin Status
        const adminDoc = await getDoc(doc(firestore, "users", auth.currentUser.uid));
        const adminData = adminDoc.data() as UserRecord;
        
        const isSuperAdmin = adminData?.email === 'enterspaceindia@gmail.com' || !!adminData?.isAdmin;

        if (!isSuperAdmin) {
            toast({
                variant: "destructive",
                title: "Access Denied",
                description: "You do not have permission to view the Management Console."
            });
            router.push('/dashboard');
            return;
        }

        // Fetch Users from Firestore sorted by join date
        const usersCol = collection(firestore, "users");
        const usersQuery = query(usersCol, orderBy("createdAt", "desc"));
        const usersSnapshot = await getDocs(usersQuery);
        const usersList = usersSnapshot.docs.map(doc => ({
            ...doc.data(),
            uid: doc.id
        } as UserRecord));
        setUsers(usersList);

        // Fetch Advocate verification details from RTDB with error handling
        try {
            const advocatesRef = ref(rtdb, "advocates");
            const advocatesSnapshot = await get(advocatesRef);
            if (advocatesSnapshot.exists()) {
              setAdvocates(advocatesSnapshot.val());
            }
        } catch (rtdbError: any) {
            console.warn("RTDB fetch skipped: Check your Realtime Database Security Rules.", rtdbError.message);
        }
      } catch (error) {
        console.error("Management Console fetch error:", error);
        toast({
            variant: "destructive",
            title: "Fetch Error",
            description: "Failed to load management data. Please refresh and try again."
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [firestore, rtdb, auth, router, toast]);

  const filteredUsers = users.filter(user => 
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    totalUsers: users.length,
    totalAdvocates: Math.max(Object.keys(advocates).length, users.filter(u => u.userType === 'lawyer').length),
    verifiedAdvocates: Object.values(advocates).filter(a => a.isVerified).length,
  };

  const formatJoinDate = (timestamp: any) => {
      if (!timestamp) return "Unknown";
      try {
          // Handle Firestore Timestamp or standard Date
          const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
          return format(date, "MMM dd, yyyy");
      } catch (e) {
          return "Invalid Date";
      }
  };

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <PageHeader
        title="Management Console"
        description="Professional registry and system oversight interface for authorized personnel."
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
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-primary">Professional Registry</CardDescription>
            <CardTitle className="text-3xl font-black font-headline flex items-center justify-between">
              {stats.totalAdvocates}
              <Gavel className="h-5 w-5 text-primary/40" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground font-medium">Advocates listed in Lawyer Connect</p>
          </CardContent>
        </Card>
        <Card className="border-primary/5 bg-primary/5 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-primary">Trust Score</CardDescription>
            <CardTitle className="text-3xl font-black font-headline flex items-center justify-between">
              {stats.verifiedAdvocates}
              <ShieldCheck className="h-5 w-5 text-green-500/40" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground font-medium">AI-authenticated professional profiles</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-primary/5 shadow-xl rounded-2xl overflow-hidden">
        <CardHeader className="border-b bg-muted/30">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="font-headline font-black text-xl tracking-tight">Joined User Registry</CardTitle>
              <CardDescription className="font-medium text-xs">Chronological list of all platform members.</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search members..." 
                  className="pl-9 h-10 w-full md:w-64 bg-background/50 font-medium text-sm" 
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
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/20">
              <TableRow>
                <TableHead className="font-bold text-[11px] text-muted-foreground pl-6">Member Identity</TableHead>
                <TableHead className="font-bold text-[11px] text-muted-foreground">Type</TableHead>
                <TableHead className="font-bold text-[11px] text-muted-foreground">Professional Status</TableHead>
                <TableHead className="font-bold text-[11px] text-muted-foreground">Member Since</TableHead>
                <TableHead className="font-bold text-[11px] text-muted-foreground text-right pr-6">System UID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length > 0 ? filteredUsers.map((user) => {
                const adv = advocates[user.uid];
                return (
                  <TableRow key={user.uid} className="hover:bg-muted/10 transition-colors">
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
                        <span className="text-[10px] font-bold text-muted-foreground/40 italic">Not Applicable</span>
                      )}
                    </TableCell>
                    <TableCell>
                        <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground">
                            <CalendarDays className="h-3 w-3 opacity-40" />
                            {formatJoinDate(user.createdAt)}
                        </div>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <code className="text-[9px] font-mono bg-muted p-1 rounded-sm text-muted-foreground">{user.uid.slice(0, 8)}...</code>
                    </TableCell>
                  </TableRow>
                );
              }) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground font-medium">
                    No members match your current filter.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
