"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useFirestore, useDatabase, useAuth } from "@/firebase";
import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";
import { ref, onValue, update } from "firebase/database";
import { Gavel, Loader2, Search, BadgeCheck, Clock, Eye, Briefcase, MapPin, GraduationCap, CheckCircle, ShieldCheck, ShieldAlert } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
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
  isBlocked?: boolean;
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

export default function AdvocateVerificationPage() {
  const firestore = useFirestore();
  const rtdb = useDatabase();
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const [users, setUsers] = useState<Record<string, UserRecord>>({});
  const [advocates, setAdvocates] = useState<AdvocateRecord[]>([]);
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
            toast({ variant: "destructive", title: "Access Denied" });
            router.push('/dashboard');
            return;
        }

        // Setup User Listener
        const usersCol = collection(firestore, "users");
        const unsubUsers = onSnapshot(usersCol, (snap) => {
            const userMap: Record<string, UserRecord> = {};
            snap.docs.forEach(d => { userMap[d.id] = { ...d.data(), uid: d.id } as UserRecord });
            setUsers(userMap);
        });

        // Setup Advocate Listener
        const advocatesRef = ref(rtdb, "advocates");
        const unsubAdvocates = onValue(advocatesRef, (snap) => {
            if (snap.exists()) {
                const list = Object.values(snap.val()) as AdvocateRecord[];
                setAdvocates(list);
            }
            setLoading(false);
        });

        return () => {
            unsubUsers();
            unsubAdvocates();
        };
    };

    checkAdmin();
  }, [firestore, rtdb, auth, router, toast]);

  const approveAdvocate = async (adv: AdvocateRecord) => {
      setProcessingUid(adv.uid);
      try {
          await update(ref(rtdb, `advocates/${adv.uid}`), { isApproved: true });
          toast({ title: "Advocate Approved", description: `${adv.name} is now live.` });
      } catch (error: any) {
          toast({ variant: "destructive", title: "Approval Failed" });
      } finally {
          setProcessingUid(null);
      }
  };

  const filteredAdvocates = advocates.filter(adv => 
    adv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    adv.barId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingCount = advocates.filter(a => !a.isApproved).length;

  if (loading) {
    return <div className="flex h-[70vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <PageHeader
        title="Advocate Verification"
        description="Review and approve professional credentials for the Lawyer Connect directory."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card className={cn("border-primary/5 shadow-sm overflow-hidden relative", pendingCount > 0 ? "bg-amber-500/10" : "bg-primary/5")}>
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <ShieldAlert className="h-20 w-20" />
          </div>
          <CardHeader className="pb-2 relative z-10">
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-primary">Pending Reviews</CardDescription>
            <CardTitle className={cn("text-3xl font-black font-headline flex items-center justify-between", pendingCount > 0 ? "text-amber-600" : "")}>
              {pendingCount}
              <Clock className={cn("h-5 w-5", pendingCount > 0 ? "text-amber-500/40 animate-pulse" : "text-primary/40")} />
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
              <CardTitle className="font-headline font-black text-xl tracking-tight text-primary">Professional Approval Queue</CardTitle>
              <CardDescription className="font-medium text-xs">AI-authenticated Bar records awaiting final verification.</CardDescription>
            </div>
            <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input 
                  placeholder="Filter name or Bar ID..." 
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
                        <TableHead className="font-bold text-[11px] uppercase tracking-wider pl-6">Professional Identity</TableHead>
                        <TableHead className="font-bold text-[11px] uppercase tracking-wider">Credentials</TableHead>
                        <TableHead className="font-bold text-[11px] uppercase tracking-wider text-center">Status</TableHead>
                        <TableHead className="font-bold text-[11px] uppercase tracking-wider text-right pr-6">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredAdvocates.length > 0 ? filteredAdvocates.map((adv) => {
                        const user = users[adv.uid];
                        const isProcessing = processingUid === adv.uid;
                        return (
                            <TableRow key={adv.uid} className="hover:bg-muted/5 transition-colors border-b border-primary/5">
                                <TableCell className="pl-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-10 w-10 border border-primary/10">
                                            <AvatarImage src={user?.photoURL} className="object-cover" />
                                            <AvatarFallback className="font-bold text-primary bg-primary/5">{adv.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-sm tracking-tight">{adv.name}</span>
                                            <span className="text-[10px] text-muted-foreground font-medium">{user?.email}</span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-0.5">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[11px] font-bold text-foreground">{adv.specialty}</span>
                                            {adv.isVerified && <BadgeCheck className="h-3.5 w-3.5 text-blue-500" />}
                                        </div>
                                        <span className="text-[9px] font-bold text-muted-foreground opacity-60">Bar ID: {adv.barId}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-center">
                                    {adv.isApproved ? (
                                        <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/20 text-[9px] font-black uppercase">Approved</Badge>
                                    ) : (
                                        <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-[9px] font-black uppercase flex items-center gap-1 w-fit mx-auto">
                                            <Clock className="h-2.5 w-2.5" /> Pending
                                        </Badge>
                                    )}
                                </TableCell>
                                <TableCell className="text-right pr-6">
                                    <div className="flex items-center justify-end gap-2">
                                        <AdvocateDetailsModal adv={adv} onApprove={approveAdvocate} isProcessing={isProcessing} />
                                        {!adv.isApproved && (
                                            <Button 
                                                size="sm" 
                                                className="h-8 px-4 font-bold text-[10px] rounded-lg active:scale-95 transition-all shadow-sm"
                                                onClick={() => approveAdvocate(adv)}
                                                disabled={isProcessing}
                                            >
                                                {isProcessing ? <Loader2 className="h-3 w-3 animate-spin" /> : "Approve"}
                                            </Button>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        );
                    }) : (
                        <TableRow>
                            <TableCell colSpan={4} className="h-32 text-center text-muted-foreground font-medium">No professional applications found.</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}
