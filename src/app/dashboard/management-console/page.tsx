"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useFirestore, useDatabase, useAuth } from "@/firebase";
import { collection, doc, getDoc, onSnapshot, updateDoc, deleteDoc, query, orderBy } from "firebase/firestore";
import { ref, update, remove } from "firebase/database";
import { 
  Users, 
  ShieldCheck, 
  Loader2, 
  Search, 
  Ban, 
  AlertTriangle, 
  ShieldAlert, 
  Sparkles, 
  CheckCircle, 
  Gavel, 
  BadgeCheck, 
  Eye, 
  MoreHorizontal,
  Mail,
  UserPlus,
  Trash2,
  Calendar,
  Phone,
  ShieldHalf,
  MapPin,
  UserCheck,
  UserMinus,
  FileText,
  Clock,
  Briefcase,
  GraduationCap
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { verifyEmailAuthenticity } from "@/ai/flows/verify-email-authenticity";
import Image from "next/image";

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
  certificateDataUri?: string;
  isBlocked?: boolean;
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
                                    {(user.securityStatus === 'verified' || ADMIN_EMAILS.includes(user.email)) && <BadgeCheck className="h-4 w-4 sm:h-5 sm:w-5 text-primary shrink-0" />}
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
                                    {user.securityStatus === 'verified' || ADMIN_EMAILS.includes(user.email) ? (
                                        <Badge className="bg-green-500/10 text-green-600 border-green-500/20 text-[9px] font-black uppercase">Identity Verified</Badge>
                                    ) : (
                                        <Badge variant="outline" className="text-red-500 border-red-200 text-[9px] font-black uppercase">Awaiting Inspection</Badge>
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

function AdvocateDetailsModal({ adv, onApprove, isProcessing }: { adv: AdvocateRecord, onApprove: (adv: AdvocateRecord) => void, isProcessing: boolean }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:bg-primary/10">
                    <Eye className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col p-0 overflow-hidden rounded-2xl border-none shadow-2xl bg-white">
                <div className="bg-primary/5 p-6 border-b border-primary/5 shrink-0">
                    <DialogHeader>
                        <div className="flex items-center gap-3">
                            <div className="bg-primary p-2 rounded-xl text-white shadow-lg">
                                <Gavel className="h-5 w-5" />
                            </div>
                            <div className="text-left">
                                <DialogTitle className="font-headline font-black text-xl tracking-tight leading-none">Professional Audit: {adv.name}</DialogTitle>
                                <DialogDescription className="text-[10px] font-medium text-muted-foreground mt-1.5">Manual verification of Bar records and identity.</DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                </div>
                
                <ScrollArea className="flex-1">
                    <div className="p-6 space-y-8">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div className="p-3 rounded-xl bg-muted/30 border border-primary/5 space-y-1">
                                <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                                    <GraduationCap className="h-3 w-3" /> Bar ID
                                </p>
                                <p className="font-bold text-xs truncate">{adv.barId}</p>
                            </div>
                            <div className="p-3 rounded-xl bg-muted/30 border border-primary/5 space-y-1">
                                <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                                    <Briefcase className="h-3 w-3" /> Specialty
                                </p>
                                <p className="font-bold text-xs truncate">{adv.specialty}</p>
                            </div>
                            <div className="p-3 rounded-xl bg-muted/30 border border-primary/5 space-y-1">
                                <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                                    <MapPin className="h-3 w-3" /> Court
                                </p>
                                <p className="font-bold text-xs truncate">{adv.courtName}</p>
                            </div>
                            <div className="p-3 rounded-xl bg-muted/30 border border-primary/5 space-y-1">
                                <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                                    <Clock className="h-3 w-3" /> Exp.
                                </p>
                                <p className="font-bold text-xs truncate">{adv.experience?.split(' ')[0] || 'N/A'}</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h4 className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-2">
                                <FileText className="h-3.5 w-3.5" /> Bar Council Certificate Attachment
                            </h4>
                            {adv.certificateDataUri ? (
                                <div className="relative group aspect-auto min-h-[300px] bg-black/5 rounded-2xl overflow-hidden border-2 border-dashed border-primary/20">
                                    <Image 
                                        src={adv.certificateDataUri} 
                                        alt="Enrollment Certificate" 
                                        width={800} 
                                        height={1200} 
                                        className="w-full h-auto object-contain"
                                    />
                                    <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none flex items-center justify-center">
                                        <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-2xl border border-primary/20 scale-95 group-hover:scale-100 transition-transform">
                                            <p className="text-[10px] font-black text-primary uppercase tracking-widest">Manual Audit Required</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="py-20 text-center bg-muted/20 rounded-2xl border-2 border-dashed border-primary/5">
                                    <AlertTriangle className="h-8 w-8 text-muted-foreground/30 mx-auto mb-3" />
                                    <p className="text-xs font-bold text-muted-foreground">No certificate attachment found in registry.</p>
                                </div>
                            )}
                        </div>

                        {adv.about && (
                            <div className="space-y-2">
                                <h4 className="text-[10px] font-black text-primary uppercase tracking-widest">Professional Bio</h4>
                                <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                                    <p className="text-xs leading-relaxed font-medium text-foreground/80 whitespace-pre-line">
                                        {adv.about}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>

                <div className="p-6 border-t bg-muted/10 shrink-0">
                    <div className="flex gap-3">
                        <DialogTrigger asChild>
                            <Button variant="outline" className="flex-1 font-bold h-12 rounded-xl active:scale-95 transition-all text-xs">Close</Button>
                        </DialogTrigger>
                        {!adv.isApproved && (
                            <Button 
                                className="flex-[2] bg-primary text-white font-black text-[10px] uppercase tracking-widest h-12 rounded-xl shadow-xl shadow-primary/20 active:scale-95 transition-all"
                                onClick={() => onApprove(adv)}
                                disabled={isProcessing}
                            >
                                {isProcessing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <ShieldCheck className="h-4 w-4 mr-2" />}
                                Verify & Activate Listing
                            </Button>
                        )}
                    </div>
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

        // Setup User Listener from Firestore
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

        // Setup Advocate Listener from Firestore (Primary Registry for manual audit)
        const advocatesCol = collection(firestore, "advocates");
        const advQuery = query(advocatesCol, orderBy("name", "asc"));
        const unsubAdvocates = onSnapshot(advQuery, (snapshot) => {
            const list = snapshot.docs.map(doc => ({ ...doc.data(), uid: doc.id } as AdvocateRecord));
            setAdvocates(list);
        }, (serverError) => {
            if (!auth.currentUser) return;
            const permissionError = new FirestorePermissionError({
                path: advocatesCol.path,
                operation: 'list',
            } satisfies SecurityRuleContext, serverError);
            errorEmitter.emit('permission-error', permissionError);
        });

        return () => {
            unsubUsers();
            unsubAdvocates();
        };
    });

    return () => unsubAuth();
  }, [firestore, auth, router, toast]);

  const toggleUserBlock = async (user: UserRecord) => {
    if (ADMIN_EMAILS.includes(user.email.toLowerCase())) {
        toast({ variant: "destructive", title: "Root Account Immutable", description: "Admin cannot be blocked." });
        return;
    }
    setProcessingUid(user.uid);
    const newStatus = !user.isBlocked;
    
    const userRef = doc(firestore, "users", user.uid);
    updateDoc(userRef, { isBlocked: newStatus })
        .catch(async (serverError) => {
            const permissionError = new FirestorePermissionError({
                path: userRef.path,
                operation: 'update',
                requestResourceData: { isBlocked: newStatus },
            } satisfies SecurityRuleContext, serverError);
            errorEmitter.emit('permission-error', permissionError);
        });

    toast({ title: newStatus ? "Identity Suspended" : "Identity Restored" });
    setProcessingUid(null);
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
              
              toast({ 
                  title: "User Verified", 
                  description: `AI confirmed authenticity with ${verification.confidenceScore}% confidence.` 
              });
          } else {
              const userRef = doc(firestore, "users", user.uid);
              await updateDoc(userRef, { 
                  securityStatus: 'suspicious',
                  flagReason: verification.reason || "AI detected suspicious identity patterns."
              });
              toast({ 
                  variant: "destructive", 
                  title: "Verification Failed", 
                  description: verification.reason || "The identity appears to be incorrect or fake." 
              });
          }
      } catch (error: any) {
          console.error("Verification error:", error);
          toast({ variant: "destructive", title: "Process Error", description: "Could not complete AI verification." });
      } finally {
          setProcessingUid(null);
      }
  };

  const handleDeleteUser = async (user: UserRecord) => {
    if (ADMIN_EMAILS.includes(user.email.toLowerCase())) {
        toast({ variant: "destructive", title: "System Root Immutable", description: "Admin account cannot be deleted." });
        return;
    }
    
    if (!window.confirm(`FORENSIC PURGE: Permanently delete all records for ${user.firstName} ${user.lastName}?`)) return;

    setProcessingUid(user.uid);
    const userRef = doc(firestore, "users", user.uid);
    const advocateRef = doc(firestore, "advocates", user.uid);
    
    await deleteDoc(userRef).catch(() => {});
    await deleteDoc(advocateRef).catch(() => {});
    
    // Also remove from RTDB
    remove(ref(rtdb, `users/${user.uid}`)).catch(() => {});
    remove(ref(rtdb, `advocates/${user.uid}`)).catch(() => {});
    
    toast({ title: "Account Purged Successfully" });
    setProcessingUid(null);
  };

  const approveAdvocate = async (adv: AdvocateRecord) => {
      setProcessingUid(adv.uid);
      try {
          // Update Firestore
          const advRef = doc(firestore, "advocates", adv.uid);
          await updateDoc(advRef, { 
              isApproved: true, 
              isVerified: true 
          });
          
          const userRef = doc(firestore, "users", adv.uid);
          await updateDoc(userRef, { 
              securityStatus: 'verified', 
              isBlocked: false 
          });

          // Sync to RTDB
          await update(ref(rtdb, `advocates/${adv.uid}`), { 
              isApproved: true, 
              isVerified: true 
          });
          
          toast({ title: "Professional Profile Activated Publicly" });
      } catch (error: any) {
          toast({ variant: "destructive", title: "Activation Failed" });
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
      suspicious: users.filter(u => u.securityStatus !== 'verified' && !ADMIN_EMAILS.includes(u.email.toLowerCase())).length,
  };

  if (loading) {
    return <div className="flex h-[70vh] items-center justify-center bg-white"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 px-4 sm:px-6 lg:px-8 pb-12 bg-white min-h-full">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-primary/5 pb-8">
        <div className="space-y-1 text-left">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight font-headline text-[#1a1a1a]">System Registry Console</h1>
          <p className="text-xs sm:text-sm text-muted-foreground font-medium">Platform enrollment oversight and manual professional certificate audits.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full lg:w-auto">
            <Button variant="outline" className="h-11 px-6 border-primary/10 rounded-xl font-bold bg-white hover:bg-primary/5 transition-all shadow-sm">
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
          <Card className="border-primary/5 shadow-sm bg-muted/5 rounded-2xl overflow-hidden">
              <CardHeader className="p-3 sm:p-4 pb-1 text-left">
                  <CardDescription className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-muted-foreground truncate">Total Registry</CardDescription>
                  <CardTitle className="text-xl sm:text-2xl font-black">{stats.total}</CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 pt-0">
                  <div className="flex items-center gap-1.5 text-primary">
                      <Users className="h-3 w-3" />
                      <span className="text-[8px] sm:text-[9px] font-bold">Platform Nodes</span>
                  </div>
              </CardContent>
          </Card>
          <Card className="border-primary/5 shadow-sm bg-green-50/30 rounded-2xl overflow-hidden">
              <CardHeader className="p-3 sm:p-4 pb-1 text-left">
                  <CardDescription className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-green-600 truncate">Active Citizens</CardDescription>
                  <CardTitle className="text-xl sm:text-2xl font-black text-green-700">{stats.active}</CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 pt-0">
                  <div className="flex items-center gap-1.5 text-green-600">
                      <UserCheck className="h-3 w-3" />
                      <span className="text-[8px] sm:text-[9px] font-bold">Unrestricted</span>
                  </div>
              </CardContent>
          </Card>
          <Card className="border-primary/5 shadow-sm bg-red-50/30 rounded-2xl overflow-hidden">
              <CardHeader className="p-3 sm:p-4 pb-1 text-left">
                  <CardDescription className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-red-600 truncate">Suspended Nodes</CardDescription>
                  <CardTitle className="text-xl sm:text-2xl font-black text-red-700">{stats.blocked}</CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 pt-0">
                  <div className="flex items-center gap-1.5 text-red-600">
                      <UserMinus className="h-3 w-3" />
                      <span className="text-[8px] sm:text-[9px] font-bold">Revoked</span>
                  </div>
              </CardContent>
          </Card>
          <Card className="border-primary/5 shadow-sm bg-amber-50/30 rounded-2xl overflow-hidden">
              <CardHeader className="p-3 sm:p-4 pb-1 text-left">
                  <CardDescription className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-amber-600 truncate">Pending Audit</CardDescription>
                  <CardTitle className="text-xl sm:text-2xl font-black text-amber-700">{stats.suspicious}</CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 pt-0">
                  <div className="flex items-center gap-1.5 text-amber-600">
                      <ShieldAlert className="h-3 w-3" />
                      <span className="text-[8px] sm:text-[9px] font-bold">Manual Review</span>
                  </div>
              </CardContent>
          </Card>
      </div>

      <Tabs defaultValue="registry" className="space-y-6">
        <div className="overflow-x-auto pb-1">
            <TabsList className="bg-muted/30 p-1 rounded-xl border border-primary/5 inline-flex min-w-full sm:min-w-0">
                <TabsTrigger value="registry" className="rounded-lg px-4 sm:px-8 h-10 font-bold text-[10px] sm:text-xs data-[state=active]:shadow-lg">Member Registry</TabsTrigger>
                <TabsTrigger value="advocates" className="rounded-lg px-4 sm:px-8 h-10 font-bold text-[10px] sm:text-xs flex gap-2 items-center data-[state=active]:shadow-lg">
                    Advocate Registry (Verification)
                    {advocates.filter(a => !a.isApproved).length > 0 && <span className="bg-primary text-white h-4 px-1.5 rounded-full text-[9px] font-black">{advocates.filter(a => !a.isApproved).length}</span>}
                </TabsTrigger>
            </TabsList>
        </div>

        <TabsContent value="registry" className="mt-0">
            <Card className="border border-primary/5 shadow-xl rounded-2xl overflow-hidden bg-white">
                <CardHeader className="bg-muted/5 border-b border-primary/5 px-4 sm:px-6 py-6 text-left">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <CardTitle className="font-headline font-black text-xl tracking-tight leading-none">Identity Registry</CardTitle>
                            <CardDescription className="text-[10px] sm:text-xs font-medium mt-1.5">Real-time inspection of all enrolled platform accounts.</CardDescription>
                        </div>
                        <div className="relative group w-full md:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <Input 
                                placeholder="Search by name or email..." 
                                className="pl-9 h-11 w-full bg-background border-primary/10 focus:border-primary rounded-xl text-xs font-bold" 
                                value={searchQuery}
                                onChange={(e) => setSearchSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <ScrollArea className="w-full">
                        <Table className="min-w-[800px]">
                            <TableHeader className="bg-muted/20">
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="font-black text-[10px] text-muted-foreground uppercase tracking-widest pl-6 h-12">Identity</TableHead>
                                    <TableHead className="font-black text-[10px] text-muted-foreground uppercase tracking-widest text-center h-12">Role</TableHead>
                                    <TableHead className="font-black text-[10px] text-muted-foreground uppercase tracking-widest text-center h-12">Security Status</TableHead>
                                    <TableHead className="font-black text-[10px] text-muted-foreground uppercase tracking-widest text-right pr-6 h-12">Controls</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                                    <TableRow key={user.uid} className={cn("hover:bg-muted/5 transition-colors border-b border-primary/5", user.securityStatus !== 'verified' && !ADMIN_EMAILS.includes(user.email.toLowerCase()) && "bg-amber-50/10")}>
                                        <TableCell className="pl-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-10 w-10 border border-primary/10 shadow-sm">
                                                    <AvatarImage src={user.photoURL} className="object-cover" />
                                                    <AvatarFallback className="font-bold text-primary bg-primary/5">{user.firstName.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col min-w-0 text-left">
                                                    <span className="font-bold text-sm tracking-tight truncate">{user.firstName} {user.lastName}</span>
                                                    <span className="text-[10px] text-muted-foreground font-medium truncate opacity-70">{user.email}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant="outline" className="font-black text-[8px] uppercase tracking-wider h-5 rounded-md px-2 border-primary/20 text-primary">{user.userType}</Badge>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {user.securityStatus === 'verified' || ADMIN_EMAILS.includes(user.email.toLowerCase()) ? (
                                                <Badge className="bg-green-500 text-white font-black text-[8px] uppercase tracking-wider h-5 rounded-md px-2">Verified</Badge>
                                            ) : (
                                                <div className="flex flex-col items-center gap-1.5">
                                                    <div className="flex items-center justify-center gap-1.5">
                                                        <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                                                        <span className="text-[9px] font-black uppercase text-red-500 tracking-tight">NOT VERIFIED</span>
                                                    </div>
                                                    <Button 
                                                        size="sm" 
                                                        variant="ghost" 
                                                        className="h-6 px-3 text-[8px] font-black uppercase tracking-tight text-primary hover:bg-primary/5 rounded-full border border-primary/10"
                                                        onClick={() => handleVerifyUser(user)}
                                                        disabled={processingUid === user.uid}
                                                    >
                                                        {processingUid === user.uid ? <Loader2 className="h-2.5 w-2.5 animate-spin" /> : <ShieldCheck className="h-2.5 w-2.5 mr-1" />}
                                                        Click to Verify
                                                    </Button>
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right pr-6">
                                            <div className="flex items-center justify-end gap-2">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg hover:bg-muted border border-transparent hover:border-primary/10 transition-all">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl shadow-2xl border border-primary/5 bg-white">
                                                        <DropdownMenuLabel className="font-black text-[9px] uppercase tracking-widest opacity-50 px-3 py-2">Registry Control</DropdownMenuLabel>
                                                        
                                                        <UserDetailsModal user={user} trigger={
                                                            <button className="flex w-full cursor-default select-none items-center rounded-lg px-3 py-2.5 text-xs font-bold outline-none transition-colors hover:bg-muted active:bg-muted/80 text-left">
                                                                <Eye className="mr-3 h-4 w-4 text-muted-foreground" /> View Profile
                                                            </button>
                                                        } />
                                                        
                                                        <DropdownMenuItem className="rounded-lg font-bold text-xs h-10 px-3 cursor-pointer"><Mail className="mr-3 h-4 w-4 text-muted-foreground" /> Send Message</DropdownMenuItem>
                                                        
                                                        {!ADMIN_EMAILS.includes(user.email.toLowerCase()) && (
                                                            <>
                                                                <DropdownMenuSeparator className="my-2" />
                                                                <DropdownMenuItem 
                                                                    onClick={() => handleDeleteUser(user)}
                                                                    className="rounded-lg font-bold text-[10px] h-10 px-3 text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer uppercase tracking-tight"
                                                                >
                                                                    <Trash2 className="mr-3 h-4 w-4" /> Delete account
                                                                </DropdownMenuItem>
                                                            </>
                                                        )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                                
                                                <Button 
                                                    className={cn(
                                                        "h-9 px-5 font-black text-[10px] uppercase tracking-wider rounded-lg active:scale-95 transition-all shadow-sm",
                                                        user.isBlocked ? "bg-white border border-primary/10 text-primary hover:bg-primary/5" : "bg-red-500 hover:bg-red-600 text-white"
                                                    )}
                                                    onClick={() => toggleUserBlock(user)}
                                                    disabled={processingUid === user.uid || ADMIN_EMAILS.includes(user.email.toLowerCase())}
                                                >
                                                    {processingUid === user.uid ? <Loader2 className="h-3 w-3 animate-spin" /> : user.isBlocked ? "Restore" : "Suspend"}
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-32 text-center text-muted-foreground font-bold">No identity records found.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="advocates" className="mt-0">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {advocates.length > 0 ? advocates.map((adv) => {
                    const isProcessing = processingUid === adv.uid;
                    const user = users.find(u => u.uid === adv.uid);
                    return (
                        <Card key={adv.uid} className={cn("group overflow-hidden border border-primary/5 shadow-lg transition-all duration-300 hover:shadow-2xl rounded-2xl bg-white", adv.isApproved && "border-green-500/20")}>
                            <div className="p-6 space-y-5 text-left">
                                <div className="flex items-start justify-between">
                                    <div className="relative">
                                        <Avatar className="h-16 w-16 border-2 border-white shadow-xl rounded-2xl overflow-hidden">
                                            <AvatarImage src={user?.photoURL} className="object-cover" />
                                            <AvatarFallback className="font-black text-xl bg-primary text-white">{adv.name?.charAt(0) || user?.firstName?.charAt(0) || "A"}</AvatarFallback>
                                        </Avatar>
                                        {(adv.isApproved || ADMIN_EMAILS.includes(user?.email?.toLowerCase() || '')) && (
                                            <div className="absolute -bottom-1.5 -right-1.5 bg-green-500 text-white p-1.5 rounded-lg shadow-lg">
                                                <CheckCircle className="h-3.5 w-3.5" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col items-end gap-1.5">
                                        {adv.isApproved || ADMIN_EMAILS.includes(user?.email?.toLowerCase() || '') ? (
                                            <Badge className="bg-green-500 text-white font-black text-[8px] uppercase tracking-widest px-2.5 py-1 rounded-md">Verified & Public</Badge>
                                        ) : (
                                            <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 font-black text-[8px] uppercase tracking-widest px-2.5 py-1 rounded-md border border-amber-500/20">Pending Manual Review</Badge>
                                        )}
                                        {user?.isBlocked && (
                                            <Badge className="bg-red-500 text-white font-black text-[8px] uppercase tracking-widest px-2.5 py-1 rounded-md shadow-sm">Suspended</Badge>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-xl font-black tracking-tight text-[#1a1a1a] truncate group-hover:text-primary transition-colors">{adv.name || `${user?.firstName} ${user?.lastName}`}</h3>
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
                                <AdvocateDetailsModal adv={adv} onApprove={approveAdvocate} isProcessing={isProcessing} />
                                {!adv.isApproved && !ADMIN_EMAILS.includes(user?.email?.toLowerCase() || '') && (
                                    <Button 
                                        className="flex-1 h-10 font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/10 active:scale-95 transition-all bg-primary text-white rounded-xl"
                                        onClick={() => approveAdvocate(adv)}
                                        disabled={isProcessing}
                                    >
                                        {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify & Activate"}
                                    </Button>
                                )}
                            </div>
                        </Card>
                    );
                }) : (
                    <div className="col-span-full py-24 text-center bg-muted/5 rounded-3xl border-2 border-dashed border-primary/5 mx-2">
                        <div className="h-20 w-20 bg-white rounded-2xl shadow-xl mx-auto mb-8 flex items-center justify-center text-primary/20 border border-primary/5">
                            <Gavel className="h-10 w-10" />
                        </div>
                        <h3 className="text-2xl font-black font-headline tracking-tighter text-[#1a1a1a]">esme advocate verification hoga</h3>
                        <p className="text-muted-foreground max-xs mx-auto mt-3 text-xs font-medium leading-relaxed px-4">sara advocate ka dital eha show hoga. All professional submissions await manual inspection here before activation.</p>
                    </div>
                )}
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
