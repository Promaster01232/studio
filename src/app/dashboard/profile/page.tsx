
"use client";

import { useState, useEffect, useRef } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  LogOut, 
  Trash2, 
  KeyRound, 
  ShieldCheck, 
  Moon, 
  Edit, 
  Loader2, 
  User, 
  Camera, 
  X, 
  ImageUp, 
  ShieldAlert, 
  MailCheck, 
  AlertTriangle, 
  BadgeCheck, 
  UserCheck, 
  Fingerprint, 
  Zap, 
  Cpu, 
  QrCode,
  ArrowRight,
  Activity,
  Globe,
  CreditCard,
  Lock,
  Crown,
  FileText,
  Award,
  Sparkles,
  Download,
  CalendarClock,
  History
} from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { useAuth, useFirestore, useDatabase } from '@/firebase';
import { doc, getDoc, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { ref, set, update, remove } from 'firebase/database';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { signOut, deleteUser, sendEmailVerification } from 'firebase/auth';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { verifyEmailAuthenticity } from "@/ai/flows/verify-email-authenticity";
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Logo } from "@/components/logo";

type UserProfile = {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  userType: string;
  photoURL?: string;
  securityStatus?: string;
  emailVerified?: boolean;
  subscriptionType?: string;
  aiUsageCount?: number;
  clearanceExpiry?: string;
  lastPaymentId?: string;
}

const ADMIN_EMAILS = [
  'enterspaceindia@gmail.com', 
  'piyushkumarsingh23323@gmail.com',
  'piyushkumrsingh23323@gmail.com',
  'piyushkumrsingh23399@gmail.com',
  'nyayasahayakhelp@gmail.com'
];

function EliteCertificateNode({ profile }: { profile: UserProfile }) {
    const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
    const expiry = profile.clearanceExpiry ? new Date(profile.clearanceExpiry) : new Date();
    if (!profile.clearanceExpiry) expiry.setFullYear(expiry.getFullYear() + 1);
    const expiryDate = expiry.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });

    return (
        <Card className="border-[12px] border-primary/5 bg-white dark:bg-zinc-950 p-8 sm:p-16 rounded-[3rem] shadow-3xl relative overflow-hidden text-center">
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-full h-full border-[1px] border-primary rounded-full scale-150" />
                <div className="absolute bottom-[-10%] right-[-10%] w-full h-full border-[1px] border-primary rounded-full scale-150" />
            </div>
            
            <div className="relative z-10 space-y-12">
                <header className="space-y-6">
                    <div className="flex justify-center">
                        <div className="relative">
                            <div className="absolute -inset-4 bg-primary/10 rounded-full animate-pulse blur-xl" />
                            <Logo className="h-20 w-20 relative z-10 p-0 shadow-none border-none bg-transparent" priority />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">Institutional Statutory Authority</h2>
                        <h1 className="text-3xl sm:text-5xl font-black font-headline tracking-tighter text-foreground uppercase leading-none">Certificate of <br/> <span className="text-primary italic">Elite Clearance</span></h1>
                    </div>
                </header>

                <div className="space-y-8 max-w-2xl mx-auto text-center">
                    <p className="text-sm sm:text-base font-medium text-muted-foreground leading-relaxed">
                        This document formally certifies that the node identified as <span className="text-foreground font-black uppercase tracking-tight">{profile.firstName} {profile.lastName}</span> has been granted the status of <span className="text-primary font-black uppercase tracking-tight">Institutional Annual Clearance</span> within the Nyaya Sahayak neural legal ecosystem.
                    </p>
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground/80 leading-relaxed italic">
                        Subject to the Terms of Protocol and Forensic Security Standards of Bharat. Access to absolute neural auditing and high-fidelity drafting terminals is authorized effective immediately.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 pt-8 items-end">
                    <div className="text-left space-y-6">
                        <div className="space-y-1">
                            <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Issue Date</p>
                            <p className="text-xs font-bold text-foreground">{today}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Registry ID</p>
                            <p className="text-[10px] font-mono font-bold text-primary">NS-CERT-{profile.uid.substring(0, 8).toUpperCase()}</p>
                        </div>
                        <div className="pt-2">
                            <p className="text-[8px] font-bold text-muted-foreground opacity-40 uppercase">Valid Until: {expiryDate}</p>
                        </div>
                    </div>
                    
                    <div className="flex flex-col items-center sm:items-end gap-6 relative">
                        {/* Official Seal / Mohar */}
                        <div className="absolute -left-4 sm:left-auto sm:-right-4 -top-12 pointer-events-none">
                            <motion.div 
                                animate={{ rotate: 360 }}
                                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                                className="relative h-28 w-28 sm:h-36 sm:w-36 rounded-full border-4 border-dashed border-primary/20 flex items-center justify-center"
                            >
                                <div className="absolute inset-3 rounded-full border-2 border-primary/10 shadow-inner" />
                                <div className="text-center space-y-0.5 relative z-10">
                                    <div className="bg-white/80 dark:bg-zinc-950/80 p-1 rounded-md backdrop-blur-sm">
                                        <p className="text-[7px] font-black text-primary uppercase tracking-tighter">IDEASPARK</p>
                                        <ShieldCheck className="h-5 w-5 text-primary/60 mx-auto" />
                                        <p className="text-[6px] font-bold text-primary/40 uppercase tracking-[0.3em]">OFFICIAL SEAL</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Signature Node */}
                        <div className="relative pt-10 text-center sm:text-right min-w-[220px]">
                            <div className="mb-[-15px] relative z-10">
                                <motion.p 
                                    initial={{ opacity: 0, pathLength: 0 }}
                                    animate={{ opacity: 1, pathLength: 1 }}
                                    className="font-['Brush_Script_MT',_cursive] text-4xl sm:text-5xl text-primary/90 italic tracking-tighter select-none drop-shadow-sm"
                                >
                                    Hardy Pie
                                </motion.p>
                            </div>
                            <div className="h-[1.5px] w-full bg-foreground/30 rounded-full" />
                            <div className="pt-3">
                                <p className="text-[10px] font-black uppercase tracking-widest text-foreground leading-none">Hardy Pie</p>
                                <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-[0.3em] mt-1.5">Founder & Chief Architect</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-[-20px] left-[-20px] w-32 h-32 bg-primary/5 rounded-full blur-2xl" />
            <div className="absolute top-10 right-10 opacity-5">
                <ShieldCheck className="h-48 w-48 text-primary" />
            </div>
        </Card>
    );
}

function DigitalIdentityCard({ profile, isAdmin }: { profile: UserProfile, isAdmin: boolean }) {
    const systemId = isAdmin ? `NS-ROOT-AUTH-99` : `NS-REG-${profile.uid.substring(0, 4).toUpperCase()}-${profile.uid.substring(profile.uid.length - 4).toUpperCase()}`;
    return (
        <div className="relative w-full aspect-[1.586/1] rounded-[1.5rem] overflow-hidden shadow-2xl group transition-all hover:scale-[1.02] active:scale-[0.98] text-left">
            <div className={cn(
                "absolute inset-0 bg-gradient-to-br transition-all duration-700",
                isAdmin ? "from-amber-600 via-amber-500 to-amber-800" : "from-[#1a1a1a] via-[#333333] to-[#000000]"
            )}></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
            
            <div className="absolute inset-0 opacity-30 pointer-events-none">
                <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-primary/20 blur-[80px] animate-pulse" />
                <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-primary/10 blur-[80px] animate-pulse" />
            </div>

            <div className="absolute top-0 right-0 p-4 opacity-5">
                <Logo className="h-40 w-40 shadow-none" priority={false} />
            </div>
            
            <div className="relative h-full flex flex-col p-6 text-white">
                <div className="flex justify-between items-start mb-auto">
                    <div className="flex items-center gap-3">
                        <div className="bg-white rounded-full p-1 shadow-xl group-hover:scale-110 transition-transform">
                            <Logo className="h-8 w-8 shadow-none p-0 border-none bg-transparent" priority={false} />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-black text-xs tracking-tighter leading-none">NYAYA SAHAYAK</span>
                            <span className="text-[7px] font-bold uppercase tracking-[0.3em] text-primary/80">{isAdmin ? "Root Authority Node" : "Forensic Terminal"}</span>
                        </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-xl px-3 py-1.5 rounded-xl border border-white/10 shadow-lg">
                        <span className="text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                            {isAdmin ? "System Root" : "Registry Verified"}
                        </span>
                    </div>
                </div>

                <div className="flex gap-5 items-end mb-4">
                    <div className="relative shrink-0 group/av">
                        <div className="absolute -inset-2 bg-primary/20 rounded-2xl blur-md opacity-0 group-hover/av:opacity-100 transition-opacity" />
                        <Avatar className="h-20 w-20 border-2 border-white/20 rounded-2xl shadow-2xl relative z-10 transition-transform group-hover:scale-105">
                            <AvatarImage src={profile.photoURL} className="object-cover" />
                            <AvatarFallback className="bg-white/10 text-white font-black text-xl">{profile.firstName?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 bg-green-500 h-4 w-4 rounded-full border-2 border-[#1a1a1a] shadow-xl z-20"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-black text-lg sm:text-xl tracking-tight truncate uppercase leading-none">{profile.firstName} {profile.lastName}</h3>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-primary leading-none">{isAdmin ? "Institutional Admin" : profile.userType}</p>
                        <div className="flex items-center gap-2 pt-1">
                            <p className="text-[11px] font-mono font-bold tracking-wider opacity-60">{systemId}</p>
                            <BadgeCheck className="h-3 w-3 text-blue-400" />
                        </div>
                    </div>
                    <div className="bg-white/95 p-2 rounded-xl shadow-2xl shrink-0 group-hover:scale-110 transition-transform">
                        <QrCode className="h-10 w-10 text-black" />
                    </div>
                </div>
                
                <div className="pt-4 border-t border-white/10 flex justify-between items-center bg-white/5 -mx-6 px-6 mt-2">
                    <div className="space-y-0.5">
                        <p className="text-[7px] font-bold uppercase opacity-40 tracking-widest">Digital Registry Email</p>
                        <p className="text-[9px] font-bold truncate max-w-[140px] sm:max-w-[200px] text-white/80">{profile.email}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[7px] font-bold uppercase opacity-40 tracking-widest">Clearance Node</p>
                        <p className={cn(
                            "text-[9px] font-black uppercase tracking-tighter",
                            isAdmin ? "text-amber-400" : "text-green-400"
                        )}>{isAdmin ? "Absolute Statutory Hub" : "Identity Ingress Level 4"}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ProfilePage() {
  const { theme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  const auth = useAuth();
  const firestore = useFirestore();
  const rtdb = useDatabase();
  const router = useRouter();
  const { toast } = useToast();
  
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsMounted(true);
    if (auth.currentUser) {
      const userDocRef = doc(firestore, "users", auth.currentUser.uid);
      const unsub = onSnapshot(userDocRef, (userDoc) => {
        if (userDoc.exists()) {
          const data = userDoc.data() as UserProfile;
          setUserProfile(data);
          setFirstName(data.firstName);
          setLastName(data.lastName);
          setEmail(data.email);
          setMobileNumber(data.mobileNumber || '');
          if (data.photoURL) setPhotoURL(data.photoURL);
        } else {
            router.push('/create-profile');
        }
        setLoading(false);
      });
      return () => unsub();
    } else {
      router.push('/login');
    }
  }, [auth, firestore, router]);

  const hasChanges = userProfile ? (
    firstName !== userProfile.firstName ||
    lastName !== userProfile.lastName ||
    mobileNumber !== (userProfile.mobileNumber || '') ||
    photoURL !== (userProfile.photoURL || '')
  ) : false;

  const handleSendVerification = async () => {
      if (!auth.currentUser) return;
      setIsResending(true);
      try {
          await sendEmailVerification(auth.currentUser);
          toast({ title: "Verification email sent", description: "Identity link dispatched to your inbox." });
      } catch (error: any) {
          toast({ variant: "destructive", title: "Transmission Failed", description: error.message });
      } finally {
          setIsResending(false);
      }
  };

  const handleVerifySelf = async () => {
    if (!userProfile || isVerifying) return;
    setIsVerifying(true);
    try {
        const verification = await verifyEmailAuthenticity({ email: userProfile.email });
        if (verification.isAuthentic) {
            const userRef = doc(firestore, "users", userProfile.uid);
            await setDoc(userRef, { securityStatus: 'verified', flagReason: "", isBlocked: false }, { merge: true });
            toast({ title: "Audit Passed", description: `Forensic identity confirmed.` });
        } else {
            toast({ variant: "destructive", title: "Security Flag Active", description: verification.reason || "Pattern mismatch detected." });
        }
    } catch (error) {
        toast({ variant: "destructive", title: "Audit Error", description: "Could not complete forensic check." });
    } finally {
        setIsVerifying(false);
    }
  };

  const updateUserPhoto = (newPhotoURL: string) => {
      if (!auth.currentUser || !userProfile) return;
      const userRef = doc(firestore, "users", auth.currentUser.uid);
      setDoc(userRef, { photoURL: newPhotoURL }, { merge: true })
        .then(() => {
            toast({ title: "Registry Updated", description: "Identity photo synchronized." });
        });
      update(ref(rtdb, `users/${auth.currentUser.uid}`), { photoURL: newPhotoURL }).catch(() => {});
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({ variant: "destructive", title: "Registry Rejection", description: "File size exceeds 2MB limit." });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setPhotoURL(dataUrl);
        updateUserPhoto(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setHasCameraPermission(true);
      setIsCameraOpen(true);
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (error) {
      setHasCameraPermission(false);
      toast({ variant: 'destructive', title: 'Capture Denied', description: 'Enable camera node in browser protocols.' });
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
      const dataUrl = canvas.toDataURL('image/png');
      setPhotoURL(dataUrl);
      updateUserPhoto(dataUrl);
      stopCamera();
    }
  };

  const handleSaveChanges = () => {
    if (!auth.currentUser || !userProfile) return;
    setSaving(true);
    const updatedProfile: UserProfile = { ...userProfile, firstName, lastName, email, mobileNumber, photoURL };
    const userDocRef = doc(firestore, "users", auth.currentUser.uid);
    
    setDoc(userDocRef, updatedProfile, { merge: true })
      .then(() => {
        set(ref(rtdb, `users/${auth.currentUser?.uid}`), updatedProfile).catch(() => {});
        toast({ title: 'Registry Synchronized', description: 'Personal dossier updated successfully.' });
      })
      .finally(() => setSaving(false));
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const handleDeleteAccount = async () => {
    if (!auth.currentUser) return;
    if (ADMIN_EMAILS.includes(email.toLowerCase())) {
        toast({ variant: "destructive", title: "Immutable Protocol", description: "Root administration nodes cannot be purged from the registry." });
        return;
    }
    setSaving(true);
    const user = auth.currentUser;
    const userDocRef = doc(firestore, "users", user.uid);

    deleteDoc(userDocRef)
        .then(async () => {
            remove(ref(rtdb, `users/${user.uid}`)).catch(() => {});
            await deleteUser(user);
            toast({ title: "Registry Purged", description: "All identity records have been permanently erased." });
            router.replace('/');
        })
        .catch((err) => {
            toast({ variant: "destructive", title: "Purge Refused", description: "Unauthorized session access or root protection active." });
        })
        .finally(() => {
            if (auth.currentUser) setSaving(false);
        });
  };

  if (loading) return <div className="flex h-full items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-primary opacity-20" /></div>;

  const isAdmin = email && ADMIN_EMAILS.includes(email.toLowerCase());
  const isLimited = !userProfile?.subscriptionType?.includes('unlimited') && !isAdmin;
  const isElite = (userProfile?.subscriptionType?.includes('unlimited') || isAdmin);
  const isProtected = isAdmin;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10 max-w-6xl mx-auto pb-20 px-2 sm:px-0 text-left">
        <PageHeader
            title="Registry Dossier"
            description="Manage your secure identity and institutional platform configurations on nyayasahayak.in."
        />

        <div className="grid lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-4 space-y-6">
                <Card className="glass shadow-2xl rounded-[2.5rem] overflow-hidden border-primary/5">
                    <div className="bg-primary/5 p-8 sm:p-10 flex flex-col items-center text-center">
                        <div className="relative group mb-6">
                            <div className="absolute -inset-4 rounded-[2rem] bg-primary/10 animate-pulse"></div>
                            {photoURL ? (
                                <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-background shadow-2xl rounded-[1.5rem] sm:rounded-[2rem] relative z-10 transition-all">
                                    <AvatarImage src={photoURL} className="object-cover" />
                                </Avatar>
                            ) : (
                                <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-[1.5rem] sm:rounded-[2rem] bg-white dark:bg-zinc-900 flex items-center justify-center text-primary border-4 border-background shadow-2xl relative z-10">
                                    <User className="h-10 w-10 sm:h-12 sm:w-12 opacity-20" />
                                </div>
                            )}
                            <div className="absolute -bottom-2 -right-2 flex gap-2 z-20">
                                <button className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-white dark:bg-zinc-800 shadow-2xl flex items-center justify-center border border-primary/10 hover:bg-primary hover:text-white transition-all" onClick={startCamera}>
                                    <Camera className="h-4 w-4" />
                                </button>
                                <button className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-white dark:bg-zinc-800 shadow-2xl flex items-center justify-center border border-primary/10 hover:bg-primary hover:text-white transition-all" onClick={() => fileInputRef.current?.click()}>
                                    <ImageUp className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                        <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
                        
                        <div className="space-y-2 max-w-full px-2">
                            <h2 className="text-xl sm:text-2xl font-black tracking-tighter leading-tight truncate">{firstName} {lastName}</h2>
                            <div className="flex flex-col items-center gap-3">
                                {userProfile?.emailVerified || isAdmin ? (
                                    <Badge className="bg-green-500/10 text-green-600 border-green-500/20 py-1 px-4 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                                        <BadgeCheck className="h-3 w-3 mr-2" /> Identity Verified
                                    </Badge>
                                ) : userProfile?.securityStatus === 'verified' ? (
                                    <Badge className="bg-blue-500/10 text-blue-600 border-green-500/20 py-1 px-4 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                                        <ShieldCheck className="h-3 w-3 mr-2" /> AI Authenticated
                                    </Badge>
                                ) : (
                                    <Button 
                                        size="sm" 
                                        variant="outline" 
                                        className="h-9 px-4 text-[10px] font-black uppercase tracking-widest text-red-500 border-red-200 hover:bg-red-500/10 rounded-xl animate-pulse"
                                        onClick={handleVerifySelf}
                                        disabled={isVerifying}
                                    >
                                        {isVerifying ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : <ShieldCheck className="h-3 w-3 mr-2" />}
                                        Run Forensic Scan
                                    </Button>
                                )}
                                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] opacity-40">System Protocol: {isAdmin ? "Root Administrator" : userProfile?.userType}</span>
                            </div>
                        </div>
                    </div>
                    <CardContent className="p-6 sm:p-8 space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-primary/5">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-background shadow-sm border border-primary/5">
                                    <Moon className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <span className="text-xs font-bold">Dark Protocol</span>
                            </div>
                            <Switch checked={theme === 'dark'} onCheckedChange={(c) => setTheme(c ? 'dark' : 'light')} />
                        </div>
                        <Button variant="outline" className="w-full h-12 justify-start font-bold border-primary/5 rounded-2xl hover:bg-primary/5 transition-all" asChild>
                            <Link href="/dashboard/privacy">
                                <KeyRound className="mr-3 h-4 w-4 opacity-40" />
                                <span className="text-xs">Security Protocols</span>
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                {userProfile && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-3">
                        <div className="flex items-center justify-between px-4">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Digital Credential</h3>
                            <Link href="#" className="text-[9px] font-black text-primary uppercase hover:underline">Share Registry</Link>
                        </div>
                        <DigitalIdentityCard profile={userProfile} isAdmin={isAdmin || false} />
                    </motion.div>
                )}
                
                <Card className="border-destructive/10 bg-destructive/5 shadow-xl rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden">
                    <CardHeader className="p-6 sm:p-8 pb-4">
                        <CardTitle className="text-destructive font-black text-lg tracking-tight flex items-center gap-2">
                            <ShieldAlert className="h-5 w-5" /> Account Disposal
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 sm:p-8 pt-0 space-y-3">
                        <Button variant="outline" className="w-full h-12 justify-start hover:bg-destructive/10 text-foreground border-destructive/5 rounded-2xl font-bold transition-all" onClick={handleLogout}>
                            <LogOut className="mr-3 h-4 w-4 opacity-40" /> 
                            <span className="text-xs">Terminate Session</span>
                        </Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" className="w-full h-12 justify-start font-black text-xs uppercase tracking-widest rounded-2xl active:scale-95 transition-all shadow-lg shadow-destructive/20">
                                    {isProtected ? <Lock className="mr-3 h-4 w-4" /> : <Trash2 className="mr-3 h-4 w-4" />}
                                    Purge Registry Record
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="glass border-destructive/20 rounded-[2rem] p-8 max-w-md">
                                <AlertDialogHeader>
                                    <div className="p-4 rounded-full bg-destructive/10 w-fit mx-auto mb-4">
                                        {isProtected ? <ShieldCheck className="h-10 w-10 text-primary animate-pulse" /> : <ShieldAlert className="h-10 w-10 text-destructive" />}
                                    </div>
                                    <AlertDialogTitle className="font-black text-2xl tracking-tighter text-center">
                                        {isProtected ? "Node Protected" : "Confirm Permanent Purge"}
                                    </AlertDialogTitle>
                                    <AlertDialogDescription className="text-center text-sm font-medium leading-relaxed">
                                        {isProtected ? "Institutional root accounts are protected by immutable security protocols and cannot be purged via this terminal." : "This protocol is irreversible. All forensic records, case narrations, and identity data will be permanently erased from the registry."}
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter className="flex-col sm:flex-row gap-3 mt-6">
                                    <AlertDialogCancel className="font-bold h-12 rounded-xl flex-1 border-primary/10">Abort Protocol</AlertDialogCancel>
                                    {!isProtected && (
                                        <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive text-white hover:bg-destructive/90 font-black h-12 rounded-xl flex-1 uppercase tracking-widest text-xs">Execute Purge</AlertDialogAction>
                                    )}
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </CardContent>
                </Card>
            </div>

            <div className="lg:col-span-8 space-y-8">
                <Card className="glass shadow-2xl rounded-[2.5rem] border-primary/5 overflow-hidden">
                    <CardHeader className="p-8 sm:p-10 bg-primary/5 border-b border-primary/10 flex flex-row items-center justify-between">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-primary">
                                <Zap className="h-3 w-3" />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Registry Information</span>
                            </div>
                            <CardTitle className="text-2xl sm:text-3xl font-black tracking-tight leading-none">Identity Protocols</CardTitle>
                        </div>
                        <UserCheck className="h-8 w-8 text-primary opacity-20" />
                    </CardHeader>
                    <CardContent className="p-8 sm:p-10 space-y-8">
                        <div className="grid sm:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <Label htmlFor="firstName" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Given Name</Label>
                                <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="h-14 glass border-primary/10 rounded-2xl font-bold text-base px-5 focus:border-primary transition-all" />
                            </div>
                            <div className="space-y-3">
                                <Label htmlFor="lastName" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Family Name</Label>
                                <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} className="h-14 glass border-primary/10 rounded-2xl font-bold text-base px-5 focus:border-primary transition-all" />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Institutional Email</Label>
                            <Input id="email" value={email} disabled className="h-14 glass border-primary/10 rounded-2xl font-bold text-base px-5 opacity-50" />
                        </div>
                        <div className="space-y-3">
                            <Label htmlFor="phone" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Contact Node (Mobile)</Label>
                            <div className="relative">
                                <Input id="phone" type="tel" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} className="h-14 glass border-primary/10 rounded-2xl font-bold text-base px-5 focus:border-primary transition-all" />
                                <Fingerprint className="absolute right-5 top-1/2 -translate-y-1/2 h-5 w-5 opacity-20 text-primary" />
                            </div>
                        </div>
                        
                        <div className="flex justify-end pt-4">
                            <Button 
                                onClick={handleSaveChanges} 
                                disabled={saving || !hasChanges} 
                                className="w-full sm:w-auto h-14 px-12 font-black uppercase tracking-widest text-xs shadow-2xl shadow-primary/20 rounded-2xl active:scale-[0.98] transition-all"
                            >
                                {saving ? <Loader2 className="mr-3 h-5 w-5 animate-spin" /> : <Edit className="mr-3 h-4 w-4" />}
                                Synchronize Registry
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <AnimatePresence>
                    {isElite && userProfile && (
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            <div className="flex items-center justify-between px-4">
                                <div className="flex items-center gap-3">
                                    <Award className="h-5 w-5 text-amber-500" />
                                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-foreground">Institutional Authorization Certificate</h3>
                                </div>
                                <Button variant="ghost" size="sm" className="h-8 px-4 rounded-xl font-black text-[9px] uppercase tracking-widest gap-2">
                                    <Download className="h-3 w-3" /> Export Statutory Record
                                </Button>
                            </div>
                            <EliteCertificateNode profile={userProfile} />
                        </motion.div>
                    )}
                </AnimatePresence>

                <Card className="glass shadow-2xl rounded-[2.5rem] border-primary/5 overflow-hidden">
                    <CardHeader className="p-8 sm:p-10 bg-muted/5 border-b border-primary/5 flex flex-row items-center justify-between">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-primary">
                                <CreditCard className="h-4 w-4" />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Statutory Clearance</span>
                            </div>
                            <CardTitle className="text-2xl font-black tracking-tight leading-none uppercase">Subscription Hub</CardTitle>
                        </div>
                        <Badge variant="secondary" className={cn(
                            "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm",
                            isAdmin ? "bg-amber-500/10 text-amber-600 border-amber-500/20" : "bg-primary/10 text-primary border-primary/20"
                        )}>
                            {isAdmin ? 'INSTITUTIONAL ANNUAL' : (userProfile?.subscriptionType?.replace('_', ' ') || 'Free Tier')}
                        </Badge>
                    </CardHeader>
                    <CardContent className="p-8 sm:p-10">
                        <div className="grid md:grid-cols-2 gap-10">
                            <div className="space-y-6 text-left">
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">AI Forensic Usage</p>
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden shadow-inner">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: isLimited ? `${Math.min(100, ((userProfile?.aiUsageCount || 0) / (userProfile?.subscriptionType === 'pro_20' ? 20 : 5)) * 100)}%` : "100%" }}
                                                className={cn("h-full", isAdmin ? "bg-amber-500" : "bg-primary")}
                                            />
                                        </div>
                                        <span className="font-mono font-black text-sm tracking-tighter">
                                            {userProfile?.aiUsageCount || 0} / {isLimited ? (userProfile?.subscriptionType === 'pro_20' ? 20 : 5) : '∞'}
                                        </span>
                                    </div>
                                </div>
                                
                                {userProfile?.clearanceExpiry && !isAdmin && (
                                    <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex items-center gap-4">
                                        <CalendarClock className="h-5 w-5 text-amber-600" />
                                        <div>
                                            <p className="text-[9px] font-black uppercase text-amber-600">Statutory Validity</p>
                                            <p className="text-sm font-bold text-foreground">
                                                Active until {new Date(userProfile.clearanceExpiry).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 space-y-1">
                                    <p className="text-[9px] font-black uppercase text-primary">{isAdmin ? "Root Access" : "Current Clearance"}</p>
                                    <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                                        {isAdmin ? "You possess absolute institutional authority over all neural nodes." : isLimited ? "Your node is currently operating on a restricted credit protocol." : "You possess absolute institutional clearance for all neural nodes."}
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col justify-center gap-4">
                                {isLimited ? (
                                    <>
                                        <Button asChild className="h-14 font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-primary/20 rounded-2xl active:scale-95 transition-all">
                                            <Link href="/dashboard/billing">
                                                <Zap className="mr-3 h-4 w-4 animate-pulse" />
                                                Initialize Upgrade
                                            </Link>
                                        </Button>
                                        <p className="text-[9px] font-bold text-center text-muted-foreground uppercase tracking-widest opacity-40">Next Reset: Dynamic Synchronization</p>
                                    </>
                                ) : (
                                    <div className="p-6 rounded-2xl border-2 border-dashed border-primary/20 flex flex-col items-center text-center gap-3">
                                        {isAdmin ? <Crown className="h-10 w-10 text-amber-600 opacity-40" /> : <ShieldCheck className="h-10 w-10 text-primary opacity-20" />}
                                        <p className="text-xs font-black uppercase tracking-widest text-primary">{isAdmin ? "Maximum Authority Node" : "Maximum Clearance Active"}</p>
                                        {userProfile?.lastPaymentId && (
                                            <p className="text-[8px] font-mono text-muted-foreground mt-2 opacity-40 uppercase">TxID: {userProfile.lastPaymentId}</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <AnimatePresence>
                    {!userProfile?.emailVerified && !isAdmin && (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                            <Card className="border-amber-500/20 bg-amber-500/5 rounded-[2.5rem] shadow-xl overflow-hidden relative">
                                <div className="absolute top-0 right-0 p-8 opacity-[0.05]">
                                    <MailCheck className="h-32 w-32 text-amber-600" />
                                </div>
                                <CardHeader className="p-8 sm:p-10 pb-4 text-left">
                                    <div className="flex items-center gap-2 text-amber-600 mb-2">
                                        <AlertTriangle className="h-4 w-4 animate-pulse" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Security Mandate</span>
                                    </div>
                                    <CardTitle className="text-2xl font-black tracking-tight leading-none text-amber-700">Identity Link Pending</CardTitle>
                                    <CardDescription className="text-amber-700/70 font-medium pt-2 max-w-sm">
                                        Your institutional email is currently unverified. Complete the link protocol to unlock full forensic permissions.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-8 sm:p-10 pt-0 flex flex-col sm:flex-row items-center gap-6">
                                    <Button 
                                        onClick={handleSendVerification}
                                        disabled={isResending}
                                        className="bg-amber-600 hover:bg-amber-700 text-white font-black h-14 px-8 rounded-2xl w-full sm:w-auto uppercase tracking-widest text-xs shadow-xl shadow-amber-600/20 active:scale-95 transition-all"
                                    >
                                        {isResending ? <Loader2 className="mr-3 h-5 w-5 animate-spin" /> : <MailCheck className="mr-3 h-5 w-5" />}
                                        Dispatch Identity Link
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>

      <Dialog open={isCameraOpen} onOpenChange={(open) => !open && stopCamera()}>
          <DialogContent className="p-0 overflow-hidden sm:rounded-[2.5rem] border-none shadow-[0_50px_100px_rgba(0,0,0,0.5)] h-[100dvh] sm:h-auto bg-black max-w-2xl">
              <div className="relative h-full aspect-video sm:aspect-square group bg-zinc-900">
                  <video ref={videoRef} className="h-full w-full object-cover" autoPlay muted playsInline />
                  <canvas ref={canvasRef} className="hidden" />
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                      <div className="w-[80%] h-[80%] border-2 border-white/20 rounded-[2rem] sm:rounded-[3rem] relative">
                          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-xl sm:rounded-tl-2xl"></div>
                          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-xl sm:rounded-tr-2xl"></div>
                          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-xl sm:rounded-bl-2xl"></div>
                          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-xl sm:rounded-br-2xl"></div>
                      </div>
                  </div>
                  <div className="absolute top-6 right-6">
                      <Button variant="ghost" size="icon" className="text-white bg-black/40 backdrop-blur-md rounded-xl h-12 w-12 hover:bg-white/20" onClick={stopCamera}>
                          <X className="h-6 w-6" />
                      </Button>
                  </div>
                  <div className="absolute bottom-8 left-0 right-0 flex justify-center px-8">
                      <Button onClick={capturePhoto} className="h-16 w-full max-w-xs font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/40 rounded-2xl bg-primary text-white hover:scale-105 active:scale-95 transition-all">
                          <Camera className="mr-3 h-6 w-6" /> Capture Identity
                      </Button>
                  </div>
              </div>
          </DialogContent>
      </Dialog>
    </motion.div>
  );
}
