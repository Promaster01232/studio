"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useFirestore, useDatabase, useAuth } from "@/firebase";
import { collection, doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { ref, update } from "firebase/database";
import { Users, ShieldCheck, Loader2, Search, Filter, Ban, UserCheck, Gavel, BadgeCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
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
    if (!auth.currentUser) {
        router.push('/login');
        return;
    }

    const checkAdmin = async () => {
        const adminDoc = await getDoc(doc(firestore, "users", auth.currentUser!.uid));
        const adminData = adminDoc.data() as any;
        const isSuperAdmin = adminData?.email === 'enterspaceindia@gmail.com' || !!adminData?.isAdmin;

        if (!isSuperAdmin) {
            toast({ variant: "destructive", title: "Access Denied", description: "Administrative privileges required." });
            router.push('/dashboard');
            return;
        }

        const usersCol = collection(firestore, "users");
        const unsub = onSnapshot(usersCol, (snapshot) => {
            const list = snapshot.docs.map(doc => ({ ...doc.data(), uid: doc.id } as UserRecord));
            setUsers(list.sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0)));
            setLoading(false);
        }, async (err) => {
            const permissionError = new FirestorePermissionError({ path: usersCol.path, operation: 'list' }, err);
            errorEmitter.emit('permission-error', permissionError);
        });

        return () => unsub();
    };

    checkAdmin();
  }, [firestore, auth, router, toast]);

  const toggleUserBlock = async (user: UserRecord) => {
    if (user.email === 'enterspaceindia@gmail.com') {
        toast({ variant: "destructive", title: "Action Forbidden" });
        return;
    }

    setProcessingUid(user.uid);
    const newBlockedStatus = !user.isBlocked;
    const userRef = doc(firestore, "users", user.uid);
    
    updateDoc(userRef, { isBlocked: newBlockedStatus })
        .catch(async (serverError) => {
            const permissionError = new FirestorePermissionError({
                path: userRef.path,
                operation: 'update',
                requestResourceData: { isBlocked: newBlockedStatus },
            } satisfies SecurityRuleContext, serverError);
            errorEmitter.emit('permission-error', permissionError);
        });

    update(ref(rtdb, `users/${user.uid}`), { isBlocked: newBlockedStatus }).catch(e => {});
    if (user.userType === 'lawyer') {
        update(ref(rtdb, `advocates/${user.uid}`), { isBlocked: newBlockedStatus }).catch(e => {});
    }

    toast({ title: newBlockedStatus ? "Account Suspended" : "Account Restored" });
    setProcessingUid(null);
  };

  const filteredUsers = users.filter(user => 
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div className="flex h-[70vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <PageHeader
        title="Management Console"
        description="Unified interface for system oversight and real-time account access control."
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-primary/5 bg-primary/5 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-primary">Total Members</CardDescription>
            <CardTitle className="text-3xl font-black font-headline flex items-center justify-between">
              {users.length}
              <Users className="h-5 w-5 text-primary/40" />
            </CardTitle>
          </CardHeader>
          <CardContent><p className="text-xs text-muted-foreground font-medium">Active citizens and legal professionals</p></CardContent>
        </Card>
        <Card className="border-primary/5 bg-primary/5 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-primary">System Role</CardDescription>
            <CardTitle className="text-3xl font-black font-headline flex items-center justify-between">
              Administrator
              <ShieldCheck className="h-5 w-5 text-primary/40" />
            </CardTitle>
          </CardHeader>
          <CardContent><p className="text-xs text-muted-foreground font-medium">Full oversight authority enabled</p></CardContent>
        </Card>
      </div>

      <Card className="border-primary/5 shadow-2xl rounded-2xl overflow-hidden bg-card/40 backdrop-blur-md">
        <CardHeader className="border-b border-primary/5 bg-muted/30 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <CardTitle className="font-headline font-black text-xl tracking-tight text-primary">Full User Registry</CardTitle>
              <CardDescription className="font-medium text-xs">Manage individual account access platform-wide.</CardDescription>
            </div>
            <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input 
                  placeholder="Filter name or email..." 
                  className="pl-9 h-11 w-full md:w-72 bg-background/50 font-bold text-sm border-primary/10 focus:border-primary rounded-xl" 
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
                        <TableHead className="font-bold text-[11px] uppercase tracking-wider pl-6">User Identity</TableHead>
                        <TableHead className="font-bold text-[11px] uppercase tracking-wider text-center">Role</TableHead>
                        <TableHead className="font-bold text-[11px] uppercase tracking-wider text-right pr-6">Access Control</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredUsers.map((user) => (
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
                            <TableCell className="text-center">
                                <Badge variant="outline" className="capitalize text-[10px] font-bold border-primary/10 bg-primary/5 text-primary px-3 rounded-lg">
                                    {user.userType}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right pr-6">
                                <Button 
                                    variant={user.isBlocked ? "outline" : "destructive"} 
                                    size="sm" 
                                    className={cn("h-9 px-4 font-bold text-[10px] rounded-xl active:scale-95 transition-all shadow-sm", !user.isBlocked && "bg-destructive hover:bg-destructive/90")}
                                    onClick={() => toggleUserBlock(user)}
                                    disabled={processingUid === user.uid || user.email === 'enterspaceindia@gmail.com'}
                                >
                                    {processingUid === user.uid ? <Loader2 className="h-3 w-3 animate-spin" /> : user.isBlocked ? <><UserCheck className="mr-2 h-3.5 w-3.5" /> Restore</> : <><Ban className="mr-2 h-3.5 w-3.5" /> Suspend</>}
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}
