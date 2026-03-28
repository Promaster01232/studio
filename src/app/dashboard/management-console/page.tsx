"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useFirestore, useDatabase, useAuth } from "@/firebase";
import { collection, doc, getDoc, onSnapshot, updateDoc, deleteDoc, query, where, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, remove, update } from "firebase/database";
import { sendPasswordResetEmail, onAuthStateChanged } from "firebase/auth";
import { 
  ShieldCheck, 
  Loader2, 
  Search, 
  AlertTriangle, 
  ShieldAlert, 
  BadgeCheck, 
  Eye, 
  MoreHorizontal,
  Mail,
  UserPlus,
  Trash2,
  Phone,
  Activity,
  Cpu,
  Lock,
  QrCode,
  KeyRound,
  UserCheck,
  Zap,
  TrendingUp,
  MailCheck,
  Send,
  X,
  FileText
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogHeader, 
  AlertDialogTitle, 
} from "@/components/ui/alert-dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { verifyEmailAuthenticity } from "@/ai/flows/verify-email-authenticity";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/logo";
import { sendVerificationEmailAction } from "@/app/register/email-action";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

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

function EmailDispatchDialog({ 
    user, 
    type, 
    open, 
    onOpenChange, 
    onDispatch 
}: { 
    user: UserRecord | null, 
    type: 'reset' | 'verify' | null, 
    open: boolean, 
    onOpenChange: (open: boolean) => void,
    onDispatch: (subject: string, body: string) => Promise<void>
}) {
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");
    const [isDispatching, setIsDispatching] = useState(false);

    useEffect(() => {
        if (user && type) {
            if (type === 'reset') {
                setSubject(`[Nyaya Sahayak] Password Restoration Protocol: ${user.firstName}`);
                setBody(`Greetings ${user.firstName},\n\nWe have initialized a Password Restoration Protocol for your institutional registry node on nyayasahayak.in.\n\nAn official security link is attached below. Use this link to reset your credentials within the next 60 minutes.\n\nPROTOCOL LINK: [Official Security Link Included Automatically]\n\nIf you did not initiate this request, please contact technical support immediately.\n\nStatutory regards,\nNyaya Sahayak Registry Terminal`);
            } else {
                const code = Math.floor(100000 + Math.random() * 900000).toString();
                setSubject(`[Nyaya Sahayak] Identity Verification Node: ${user.firstName}`);
                setBody(`Greetings ${user.firstName},\n\nTo ensure 100% forensic integrity of the Citizen Registry, we require you to verify your identity node.\n\nYour 6-digit forensic verification code is: ${code}\n\nEnter this code in your dashboard to activate full platform permissions.\n\nStatutory regards,\nNyaya Sahayak Registry Terminal`);
            }
        }
    }, [user, type, open]);

    const handleSend = async () => {
        setIsDispatching(true);
        try {
            await onDispatch(subject, body);
            onOpenChange(false);
        } finally {
            setIsDispatching(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl p-0 overflow-hidden rounded-[2rem] border-none shadow-3xl bg-card text-left">
                <div className="p-8">
                    <DialogHeader className="mb-8 border-none text-left">
                        <div className="flex items-center gap-3 text-primary mb-2">
                            <Mail className="h-5 w-5" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Communication Node</span>
                        </div>
                        <DialogTitle className="text-2xl font-black tracking-tighter">
                            {type === 'reset' ? 'Password Restoration Dispatch' : 'Identity Verification Dispatch'}
                        </DialogTitle>
                        <DialogDescription className="font-medium text-xs">
                            Customize the institutional transmission for citizen: <span className="text-foreground font-bold">{user?.email}</span>
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Registry Subject</Label>
                            <Input 
                                value={subject} 
                                onChange={e => setSubject(e.target.value)} 
                                className="h-12 font-bold bg-muted/20 border-primary/5 focus:border-primary"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Statutory Body</Label>
                            <Textarea 
                                value={body} 
                                onChange={e => setBody(e.target.value)} 
                                rows={10}
                                className="resize-none font-medium text-sm leading-relaxed p-6 rounded-2xl bg-muted/20 border-primary/5 focus:border-primary shadow-inner"
                            />
                        </div>
                    </div>
                </div>
                <div className="p-6 border-t bg-muted/5 flex justify-between items-center gap-4">
                    <div className="flex items-center gap-2 text-primary opacity-40">
                        <ShieldCheck className="h-4 w-4" />
                        <span className="text-[9px] font-black uppercase tracking-widest">Secured Node</span>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="ghost" onClick={() => onOpenChange(false)} className="rounded-xl font-bold h-11 px-6">Cancel</Button>
                        <Button 
                            onClick={handleSend} 
                            disabled={isDispatching}
                            className="bg-primary text-white font-black uppercase tracking-[0.2em] text-[10px] h-11 px-8 rounded-xl shadow-xl shadow-primary/20 active:scale-95 transition-all"
                        >
                            {isDispatching ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                            Execute Transmission
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function DigitalIdentityCard({ profile }: { profile: UserRecord }) {
    const systemId = `NS-REG-${profile.uid.substring(0, 4).toUpperCase()}-${profile.uid.substring(profile.uid.length - 4).toUpperCase()}`;
    return (
        <div className="relative w-full aspect-[1.586/1] rounded-[1.5rem] overflow-hidden shadow-2xl text-left">
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-blue-600"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
            
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Logo className="h-24 w-24 border-none shadow-none p-0" />
            </div>
            
            <div className="relative h-full flex flex-col p-5 text-white">
                <div className="flex justify-between items-start mb-auto">
                    <div className="flex items-center gap-2">
                        <div className="bg-white rounded-full p-1 shadow-xl">
                            <Logo className="h-6 w-6 border-none shadow-none p-0" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-black text-[8px] tracking-tighter leading-none">NYAYA SAHAYAK</span>
                            <span className="text-[5px] font-bold uppercase tracking-[0.2em] opacity-60">Forensic Terminal</span>
                        </div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10">
                        <span className="text-[6px] font-black uppercase tracking-widest">Registry Record</span>
                    </div>
                </div>

                <div className="flex gap-3 items-end mb-3">
                    <Avatar className="h-14 w-14 border-2 border-white/20 rounded-xl shadow-lg shrink-0">
                        <AvatarImage src={profile.photoURL} className="object-cover" />
                        <AvatarFallback className="bg-white/10 text-white font-black text-xs">{profile.firstName?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-0.5 min-w-0">
                        <h3 className="font-black text-xs sm:text-sm tracking-tight truncate uppercase leading-none">{profile.firstName} {profile.lastName}</h3>
                        <p className="text-[7px] font-bold uppercase tracking-widest opacity-70 leading-none">{profile.userType}</p>
                        <p className="text-[9px] font-mono font-bold tracking-wider pt-1">{systemId}</p>
                    </div>
                    <div className="bg-white p-1 rounded-lg shadow-xl shrink-0">
                        <QrCode className="h-8 w-8 text-black" />
                    </div>
                </div>
                
                <div className="pt-2 border-t border-white/10 flex justify-between items-center">
                    <div className="space-y-0.5">
                        <p className="text-[5px] font-bold uppercase opacity-40">Registry Email</p>
                        <p className="text-[7px] font-bold truncate max-w-[140px]">{profile.email}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[5px] font-bold uppercase opacity-40">Oversight Status</p>
                        <p className="text-[7px] font-black uppercase tracking-tighter text-blue-200">Admin Audit Active</p>
                    </div>
                </div>
            </div>
        </div>
    );
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
            <DialogContent className="sm:max-w-2xl p-0 overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] border-none shadow-2xl bg-card text-left">
                <div className="p-6 sm:p-8">
                    <DialogHeader className="mb-6 border-none text-left">
                        <div className="flex items-center gap-2 text-primary mb-2">
                            <ShieldCheck className="h-4 w-4" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Official Registry Preview</span>
                        </div>
                        <DialogTitle className="text-xl font-black">User Dossier: {user.firstName} {user.lastName}</DialogTitle>
                        <DialogDescription className="font-medium text-xs">Detailed view of registry identity and forensic records.</DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-8">
                        <div className="grid sm:grid-cols-2 gap-8 items-start">
                            <DigitalIdentityCard profile={user} />
                            
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30 border border-primary/5">
                                    <Avatar className="h-16 w-16 border-2 border-background shadow-lg rounded-xl shrink-0">
                                        <AvatarImage src={user.photoURL} className="object-cover" />
                                        <AvatarFallback className="text-xl font-black bg-primary/5 text-primary">{user.firstName.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="space-y-1">
                                        <Badge variant="outline" className="font-black text-[8px] uppercase tracking-widest text-primary border-primary/20">{user.userType}</Badge>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Status: {user.isBlocked ? 'Suspended' : 'Active'}</p>
                                    </div>
                                </div>
                                <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 text-left">
                                    <p className="text-[9px] font-black text-primary uppercase tracking-widest mb-1">Institutional Context</p>
                                    <p className="text-[10px] font-medium text-muted-foreground leading-relaxed">
                                        Identity synchronized with centralized registry. Manual audit status: CLEAR.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <ScrollArea className="max-h-[30vh] px-4">
                            <div className="space-y-6 pb-4 text-left">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="p-4 rounded-2xl bg-muted/30 border border-primary/5 space-y-1">
                                        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                                            <Mail className="h-3 w-3" /> Registry Email
                                        </p>
                                        <p className="font-bold text-xs truncate">{user.email}</p>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-muted/30 border border-primary/5 space-y-1">
                                        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                                            <Phone className="h-3 w-3" /> Contact
                                        </p>
                                        <p className="font-bold text-xs">{user.mobileNumber || "Not Provided"}</p>
                                    </div>
                                </div>

                                {user.flagReason && (
                                    <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/10 space-y-2">
                                        <div className="flex items-center gap-2 text-red-600">
                                            <AlertTriangle className="h-4 w-4" />
                                            <p className="text-[10px] font-black uppercase tracking-wider">Forensic Flag</p>
                                        </div>
                                        <p className="text-xs font-medium text-red-600 leading-relaxed italic">
                                            "{user.flagReason}"
                                        </p>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </div>
                </div>
                <div className="p-6 border-t flex justify-end gap-3 bg-muted/5">
                    <DialogTrigger asChild>
                        <Button variant="outline" className="font-bold text-xs h-11 rounded-xl px-8">Close Dossier</Button>
                    </DialogTrigger>
                    <Button className="font-bold text-xs h-11 rounded-xl px-8 shadow-lg shadow-primary/20">Official Message</Button>
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
  const [userToPurge, setUserToPurge] = useState<UserRecord | null>(null);
  
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [modalTargetUser, setModalTargetUser] = useState<UserRecord | null>(null);
  const [modalType, setModalType] = useState<'reset' | 'verify' | null>(null);

  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (user) => {
        if (unsubscribeRef.current) {
            unsubscribeRef.current();
            unsubscribeRef.current = null;
        }

        if (!user) {
            router.replace('/login');
            return;
        }

        const adminDoc = await getDoc(doc(firestore, "users", user.uid));
        const adminData = adminDoc.data() as any;
        const isAuthorized = ADMIN_EMAILS.includes(user.email?.toLowerCase() || '') || !!adminData?.isAdmin;

        if (!isAuthorized) {
            toast({ variant: "destructive", title: "Access Denied" });
            router.replace('/dashboard');
            return;
        }

        const usersCol = collection(firestore, "users");
        unsubscribeRef.current = onSnapshot(usersCol, 
            (snapshot) => {
                const list = snapshot.docs.map(doc => ({ ...doc.data(), uid: doc.id } as UserRecord));
                setUsers(list.sort((a, b) => {
                    const dateA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : Number(a.createdAt || 0);
                    const dateB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : Number(b.createdAt || 0);
                    return dateB - dateA;
                }));
                setLoading(false);
            },
            (serverError) => {
                console.error("Registry list error:", serverError);
                setLoading(false);
            }
        );
    });

    return () => {
        unsubAuth();
        if (unsubscribeRef.current) unsubscribeRef.current();
    };
  }, [firestore, auth, router, toast]);

  const handleOpenEmailEditor = (user: UserRecord, type: 'reset' | 'verify') => {
      setModalTargetUser(user);
      setModalType(type);
      setEmailModalOpen(true);
  };

  const handleDispatchEmail = async (subject: string, body: string) => {
      if (!modalTargetUser || !modalType) return;
      
      setProcessingUid(modalTargetUser.uid);
      try {
          if (modalType === 'reset') {
              await sendPasswordResetEmail(auth, modalTargetUser.email);
              toast({ title: "Restoration Dispatch Complete", description: `Official Firebase link sent to ${modalTargetUser.email}.` });
          } else {
              const codeMatch = body.match(/\d{6}/);
              const code = codeMatch ? codeMatch[0] : "123456";
              await sendVerificationEmailAction(modalTargetUser.email, code);
              toast({ title: "Verification Node Active", description: `Forensic code ${code} dispatched to ${modalTargetUser.email}.` });
          }
      } catch (error: any) {
          toast({ variant: "destructive", title: "Transmission Failed", description: error.message });
      } finally {
          setProcessingUid(null);
      }
  };

  const handleToggleStatus = (user: UserRecord, isInactive: boolean) => {
    setProcessingUid(user.uid);
    const updateData = { isBlocked: isInactive };
    const userRef = doc(firestore, "users", user.uid);

    updateDoc(userRef, updateData)
        .then(() => {
            update(ref(rtdb, `users/${user.uid}`), updateData).catch(() => {});
            toast({ title: isInactive ? "Account Suspended" : "Account Re-activated" });
        })
        .catch(async (serverError) => {
            toast({ variant: "destructive", title: "Action Refused", description: "Registry permissions insufficient." });
        })
        .finally(() => setProcessingUid(null));
  };

  const handleVerifyUser = async (user: UserRecord) => {
      setProcessingUid(user.uid);
      try {
          const verification = await verifyEmailAuthenticity({ email: user.email });
          const updateData = verification.isAuthentic 
            ? { securityStatus: 'verified', flagReason: "", isBlocked: false } 
            : { securityStatus: 'suspicious', flagReason: verification.reason || "Suspicious identity patterns detected." };

          const userRef = doc(firestore, "users", user.uid);
          await updateDoc(userRef, updateData as any);
          toast({ title: verification.isAuthentic ? "Citizen Authenticated" : "Audit Flagged" });
      } catch (error) {
          toast({ variant: "destructive", title: "Forensic Audit Error" });
      } finally {
          setProcessingUid(null);
      }
  };

  const handleExecutePurge = async () => {
    if (!userToPurge) return;
    const user = userToPurge;
    
    if (ADMIN_EMAILS.includes(user.email.toLowerCase())) {
        toast({ variant: "destructive", title: "Action Prohibited", description: "Institutional root accounts are immutable." });
        setUserToPurge(null);
        return;
    }
    
    setProcessingUid(user.uid);
    const userRef = doc(firestore, "users", user.uid);
    
    deleteDoc(userRef)
        .then(() => {
            remove(ref(rtdb, `users/${user.uid}`)).catch(() => {});
            toast({ title: "Registry Purged", description: `Dossier for ${user.firstName} erased permanently.` });
        })
        .catch(async (serverError) => {
            toast({ variant: "destructive", title: "Action Denied", description: "Terminal permissions insufficient." });
        })
        .finally(() => {
            setProcessingUid(null);
            setUserToPurge(null);
        });
  };

  const filteredUsers = users.filter(u => 
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
      total: users.length,
      verified: users.filter(u => u.securityStatus === 'verified').length,
      flagged: users.filter(u => u.securityStatus === 'flagged' || u.securityStatus === 'suspicious').length,
      pending: users.filter(u => !u.securityStatus).length
  };

  if (loading) {
    return <div className="flex h-[70vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 px-2 sm:px-6 pb-12 text-left">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-primary/5 pb-8">
        <div className="space-y-1 text-left">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tighter font-headline text-foreground">Registry Management Terminal</h1>
          <p className="text-xs sm:text-sm text-muted-foreground font-medium">Institutional oversight of nyayasahayak.in records and identity data.</p>
        </div>
        <div className="flex gap-2 sm:gap-3">
            <Button className="bg-primary text-white h-10 sm:h-11 px-4 sm:px-6 rounded-xl font-bold shadow-lg shadow-primary/20 text-[10px] sm:text-xs">
                <UserPlus className="mr-2 h-3 w-3 sm:h-4 w-4" /> Manual Entry
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
              { label: "Total Nodes", value: stats.total, icon: Activity, color: "text-blue-500", bg: "bg-blue-500/10" },
              { label: "Verified", value: stats.verified, icon: UserCheck, color: "text-green-600", bg: "bg-green-600/10" },
              { label: "Audit Flags", value: stats.flagged, icon: AlertTriangle, color: "text-red-500", bg: "bg-red-500/10" },
              { label: "New Ingress", value: stats.pending, icon: TrendingUp, color: "text-amber-600", bg: "bg-amber-600/10" }
          ].map((stat, i) => (
              <Card key={i} className="border-primary/5 shadow-md rounded-2xl overflow-hidden glass group transition-all hover:scale-[1.02]">
                  <CardContent className="p-5 flex items-center gap-4">
                      <div className={cn("p-3 rounded-xl transition-transform group-hover:scale-110 shadow-sm", stat.bg, stat.color)}>
                          <stat.icon className="h-5 w-5" />
                      </div>
                      <div className="text-left">
                          <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-60 leading-none mb-1">{stat.label}</p>
                          <p className="text-2xl font-black tracking-tighter">{stat.value}</p>
                      </div>
                  </CardContent>
              </Card>
          ))}
      </div>

      <Card className="border border-primary/5 shadow-xl rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden bg-card text-left">
          <CardHeader className="bg-muted/5 border-b border-primary/5 px-4 sm:px-6 py-6 text-left">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="text-left w-full">
                      <CardTitle className="font-headline font-black text-lg sm:text-xl tracking-tight">Identity Registry Report</CardTitle>
                      <CardDescription className="text-[10px] sm:text-xs font-medium mt-1">Forensic security and account status oversight.</CardDescription>
                  </div>
                  <div className="relative group w-full md:w-80">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input 
                          placeholder="Filter name or email..." 
                          className="pl-9 h-10 sm:h-11 w-full bg-background border-primary/10 rounded-xl text-[10px] sm:text-xs font-bold" 
                          value={searchQuery}
                          onChange={(e) => setSearchSearchQuery(e.target.value)}
                      />
                  </div>
              </div>
          </CardHeader>
          <CardContent className="p-0">
              <ScrollArea className="w-full text-left">
                  <Table className="min-w-[1000px]">
                      <TableHeader className="bg-muted/20">
                          <TableRow>
                              <TableHead className="font-black text-[9px] sm:text-[10px] uppercase tracking-widest pl-6 h-12">User Identity</TableHead>
                              <TableHead className="font-black text-[9px] sm:text-[10px] uppercase tracking-widest text-center h-12">Role</TableHead>
                              <TableHead className="font-black text-[9px] sm:text-[10px] uppercase tracking-widest text-center h-12">Status</TableHead>
                              <TableHead className="font-black text-[9px] sm:text-[10px] uppercase tracking-widest text-center h-12">Security Audit</TableHead>
                              <TableHead className="font-black text-[9px] sm:text-[10px] uppercase tracking-widest text-right pr-6 h-12">Command Protocol</TableHead>
                          </TableRow>
                      </TableHeader>
                      <TableBody>
                          {filteredUsers.map((user) => {
                              const isActive = user.isBlocked === false || user.isBlocked === undefined;
                              const isProtected = ADMIN_EMAILS.includes(user.email.toLowerCase());
                              return (
                                <TableRow key={user.uid} className={cn("hover:bg-muted/5 border-b border-primary/5 transition-colors", !isActive && "bg-red-500/5")}>
                                    <TableCell className="pl-6 py-4">
                                        <div className="flex items-center gap-3 text-left">
                                            <Avatar className="h-10 w-10 border border-primary/10">
                                                <AvatarImage src={user.photoURL} className="object-cover" />
                                                <AvatarFallback className="font-bold text-primary bg-primary/5">{user.firstName.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-xs sm:text-sm tracking-tight">{user.firstName} {user.lastName}</span>
                                                    {isProtected && <BadgeCheck className="h-3 w-3 text-primary" />}
                                                </div>
                                                <span className="text-[9px] sm:text-[10px] text-muted-foreground font-medium">{user.email}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant="outline" className="font-black text-[8px] uppercase border-primary/20 text-primary">{user.userType}</Badge>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <span className={cn("text-[8px] sm:text-[9px] font-black uppercase", isActive ? "text-green-600" : "text-red-500")}>
                                                {isActive ? "Active" : "Suspended"}
                                            </span>
                                            <Switch 
                                                checked={isActive} 
                                                onCheckedChange={(checked) => handleToggleStatus(user, !checked)}
                                                disabled={processingUid === user.uid || isProtected}
                                                className="data-[state=checked]:bg-green-500"
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex flex-col items-center gap-1">
                                            {user.securityStatus === 'verified' ? (
                                                <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20 text-[8px] font-black uppercase">Verified</Badge>
                                            ) : (
                                                <Button size="sm" variant="ghost" className="h-6 px-2 text-[8px] font-black uppercase text-primary border border-primary/10 rounded-full" onClick={() => handleVerifyUser(user)} disabled={processingUid === user.uid}>
                                                    Initialize Audit
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right pr-6">
                                        <div className="flex items-center justify-end gap-2">
                                            <UserDetailsModal user={user} />
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg hover:bg-muted" disabled={processingUid === user.uid}>
                                                        {processingUid === user.uid ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreHorizontal className="h-4 w-4" />}
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-60 p-2 rounded-xl shadow-2xl glass border-primary/10">
                                                    <DropdownMenuLabel className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 px-3">Registry Controls</DropdownMenuLabel>
                                                    <DropdownMenuItem onSelect={() => handleOpenEmailEditor(user, 'reset')} className="rounded-lg font-bold text-[10px] h-10 px-3 cursor-pointer gap-3 text-left">
                                                        <KeyRound className="h-4 w-4 opacity-40" /> Dispatch Reset Link
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onSelect={() => handleOpenEmailEditor(user, 'verify')} className="rounded-lg font-bold text-[10px] h-10 px-3 cursor-pointer gap-3 text-left">
                                                        <MailCheck className="h-4 w-4 opacity-40" /> Dispatch Verification
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator className="opacity-5" />
                                                    <DropdownMenuItem 
                                                        className={cn("rounded-lg font-bold text-[10px] h-10 px-3 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10 gap-3 text-left", isProtected && "opacity-50 cursor-not-allowed")}
                                                        onClick={() => !isProtected && setUserToPurge(user)}
                                                        disabled={processingUid === user.uid || isProtected}
                                                    >
                                                        {isProtected ? <Lock className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
                                                        Purge Registry Record
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </TableCell>
                                </TableRow>
                              );
                          })}
                      </TableBody>
                  </Table>
                  <ScrollBar orientation="horizontal" />
              </ScrollArea>
          </CardContent>
      </Card>

      <EmailDispatchDialog 
        user={modalTargetUser}
        type={modalType}
        open={emailModalOpen}
        onOpenChange={setEmailModalOpen}
        onDispatch={handleDispatchEmail}
      />

      <AlertDialog open={!!userToPurge} onOpenChange={(open) => !open && setUserToPurge(null)}>
          <AlertDialogContent className="rounded-[2.5rem] p-8 border-none shadow-2xl glass text-left">
              <AlertDialogHeader className="text-left">
                  <div className="p-4 rounded-full bg-destructive/10 w-fit mx-auto mb-4"><ShieldAlert className="h-10 w-10 text-destructive animate-pulse" /></div>
                  <AlertDialogTitle className="font-black text-2xl tracking-tighter text-center">Confirm Purge Protocol</AlertDialogTitle>
                  <AlertDialogDescription className="text-center text-sm font-medium leading-relaxed">
                      This protocol will permanently erase <strong>{userToPurge?.firstName} {userToPurge?.lastName}</strong> from the registry. This action is terminal and irreversible.
                  </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <AlertDialogCancel className="font-bold h-12 rounded-xl flex-1 border-primary/10">Abort Protocol</AlertDialogCancel>
                  <AlertDialogAction onClick={handleExecutePurge} className="bg-destructive text-white hover:bg-destructive/90 font-black h-12 rounded-xl flex-1 uppercase tracking-widest text-[10px] shadow-lg shadow-destructive/20">Execute Purge</AlertDialogAction>
              </div>
          </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
