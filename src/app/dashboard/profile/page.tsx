
"use client";

import { useState, useEffect, useRef } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, Trash2, KeyRound, ShieldCheck, Moon, Edit, Loader2, User, Camera, X, ImageUp, ShieldAlert, MailCheck, AlertTriangle, BadgeCheck, CheckCircle2, UserCheck, Fingerprint, Zap, QrCode, Cpu, MoreHorizontal, Sparkles, Globe, Download } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { useAuth, useFirestore, useDatabase } from '@/firebase';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { ref, set, update, remove } from 'firebase/database';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { signOut, deleteUser, sendEmailVerification } from 'firebase/auth';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
import { Logo } from '@/components/logo';
import { cn } from '@/lib/utils';
import { jsPDF } from "jspdf";

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
}

const ADMIN_EMAILS = [
  'enterspaceindia@gmail.com', 
  'piyushkumarsingh23323@gmail.com',
  'piyushkumrsingh23323@gmail.com',
  'piyushkumrsingh23399@gmail.com'
];

export function DigitalIDCard({ user, photoURL }: { user: UserProfile | null, photoURL: string }) {
    if (!user) return null;

    const systemID = `NS-${user.uid.substring(0, 4).toUpperCase()}-${user.uid.substring(user.uid.length - 4).toUpperCase()}`;
    const isVerified = user.emailVerified || user.securityStatus === 'verified';

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-md mx-auto aspect-[1.6/1] rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden shadow-2xl group active:scale-[0.98] transition-transform cursor-pointer"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-[#0D1B2A] to-zinc-900 transition-all duration-700 group-hover:bg-primary/10"></div>
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                <div className="h-full w-full bg-[radial-gradient(circle_at_50%_50%,rgba(0,100,255,0.1)_0%,transparent_100%)]"></div>
            </div>
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                <Cpu className="h-24 w-24 sm:h-40 sm:w-40" />
            </div>

            <div className="relative h-full w-full p-4 sm:p-6 flex flex-col justify-between text-white border border-white/10 rounded-[1.5rem] sm:rounded-[2rem]">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="relative p-0.5 sm:p-1 rounded-xl bg-gradient-to-tr from-primary via-accent to-blue-400">
                            <div className="bg-[#0D1B2A] rounded-xl p-1 sm:p-1.5 backdrop-blur-md">
                                <Logo className="h-5 w-5 sm:h-6 sm:w-6 border-none p-0 bg-transparent shadow-none" imageClassName="brightness-0 invert" />
                            </div>
                        </div>
                        <div className="text-left">
                            <h3 className="text-[9px] sm:text-[11px] font-black tracking-[0.1em] uppercase bg-gradient-to-r from-white via-primary to-accent bg-clip-text text-transparent leading-none">
                                Nyaya Sahayak
                            </h3>
                            <p className="text-[6px] sm:text-[7px] font-black text-primary/60 uppercase tracking-[0.2em] mt-1">Official Registry Node</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-end">
                        <div className="p-1 sm:p-1.5 bg-white rounded-lg shadow-[0_0_15px_rgba(255,255,255,0.2)] group-hover:shadow-primary/40 transition-all duration-500">
                            <QrCode className="h-6 w-6 sm:h-10 sm:w-10 text-black" />
                        </div>
                        <span className="text-[5px] sm:text-[6px] font-mono text-white/20 mt-1 uppercase tracking-tighter">SECURE-BLOCK-ALPHA</span>
                    </div>
                </div>

                <div className="flex gap-3 sm:gap-5 items-center">
                    <div className="relative">
                        <div className="absolute -inset-1 rounded-xl sm:rounded-2xl bg-primary/20 animate-pulse group-hover:scale-110 transition-transform"></div>
                        {photoURL ? (
                            <Avatar className="h-14 w-14 sm:h-20 sm:w-20 border-2 border-white/20 rounded-xl sm:rounded-2xl shadow-xl relative z-10">
                                <AvatarImage src={photoURL} className="object-cover" />
                            </Avatar>
                        ) : (
                            <div className="h-14 w-14 sm:h-20 sm:w-20 rounded-xl sm:rounded-2xl bg-white/5 flex items-center justify-center border-2 border-white/10 shadow-xl relative z-10">
                                <User className="h-6 w-6 sm:h-8 sm:w-8 opacity-20" />
                            </div>
                        )}
                        {isVerified && (
                            <div className="absolute -bottom-1 -right-1 bg-primary text-white p-0.5 sm:p-1 rounded-full border-2 border-[#0D1B2A] shadow-lg z-20">
                                <ShieldCheck className="h-2 w-2 sm:h-3 sm:w-3" />
                            </div>
                        )}
                    </div>
                    
                    <div className="flex-1 text-left min-w-0">
                        <h2 className="text-sm sm:text-xl font-black tracking-tight leading-tight truncate">
                            {user.firstName} {user.lastName}
                        </h2>
                        <div className="flex items-center gap-1.5 sm:gap-2 mt-1">
                            <Badge variant="outline" className="bg-white/5 border-white/10 text-[7px] sm:text-[8px] font-black uppercase tracking-widest px-1.5 sm:px-2 text-white/80 h-4 sm:h-5">
                                {user.userType}
                            </Badge>
                            <span className="text-[8px] sm:text-[9px] font-black font-mono text-primary tracking-wider uppercase bg-primary/10 px-1.5 sm:px-2 py-0.5 rounded-md border border-primary/20 shadow-sm">{systemID}</span>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-end border-t border-white/5 pt-3 sm:pt-4">
                    <div className="flex gap-3 sm:gap-4">
                        <div className="space-y-0.5">
                            <p className="text-[5px] sm:text-[6px] font-black text-white/30 uppercase tracking-[0.2em]">Security Clearance</p>
                            <div className="flex items-center gap-1">
                                <div className={cn("h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full shadow-[0_0_8px_currentColor]", isVerified ? "bg-green-500 animate-ping" : "bg-red-500")}></div>
                                <p className={cn("text-[7px] sm:text-[8px] font-bold uppercase tracking-widest", isVerified ? "text-green-500" : "text-red-500")}>
                                    {isVerified ? "Authorized Node" : "Pending Audit"}
                                </p>
                            </div>
                        </div>
                        <div className="space-y-0.5">
                            <p className="text-[5px] sm:text-[6px] font-black text-white/30 uppercase tracking-[0.2em]">Node Registry</p>
                            <p className="text-[7px] sm:text-[8px] font-bold uppercase tracking-widest text-white/60">
                                {new Date().getFullYear()} RE-SYNC
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                        <Globe className="h-2 w-2 sm:h-3 sm:w-3 text-primary animate-pulse" />
                        <span className="text-[6px] sm:text-[7px] font-black uppercase tracking-[0.2em]">nyayasahayak.in</span>
                    </div>
                </div>
            </div>
        </motion.div>
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

  const hasChanges = userProfile ? (
    firstName !== userProfile.firstName ||
    lastName !== userProfile.lastName ||
    mobileNumber !== (userProfile.mobileNumber || '') ||
    photoURL !== (userProfile.photoURL || '')
  ) : false;

  useEffect(() => {
    setIsMounted(true);
    if (auth.currentUser) {
      const userDocRef = doc(firestore, "users", auth.currentUser.uid);
      getDoc(userDocRef).then(userDoc => {
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
    } else {
      router.push('/login');
    }
  }, [auth, firestore, router]);

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
            setUserProfile(prev => prev ? { ...prev, securityStatus: 'verified' } : null);
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
      setDoc(doc(firestore, "users", auth.currentUser.uid), { photoURL: newPhotoURL }, { merge: true })
        .then(() => {
            toast({ title: "Registry Updated", description: "Identity photo synchronized." });
            setUserProfile(prev => prev ? { ...prev, photoURL: newPhotoURL } : null);
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
      toast({ variant: 'destructive', title: 'Capture Denied', description: 'Enable camera nodes in browser protocols.' });
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
        setUserProfile(updatedProfile);
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
        toast({ variant: "destructive", title: "Node Immutable", description: "Root administration nodes cannot be purged." });
        return;
    }
    setSaving(true);
    const user = auth.currentUser;
    try {
      await deleteDoc(doc(firestore, "users", user.uid));
      remove(ref(rtdb, `users/${user.uid}`)).catch(() => {});
      await deleteUser(user);
      toast({ title: "Registry Purged", description: "All identity records have been permanently erased." });
      router.replace('/');
    } catch (error: any) {
      toast({ variant: "destructive", title: "Purge Failed", description: "Recent authentication required." });
    } finally {
      if (auth.currentUser) setSaving(false);
    }
  };

  const handleDownloadID = () => {
    if (!userProfile) return;
    try {
        const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: [85.6, 54] });
        const systemID = `NS-${userProfile.uid.substring(0, 4).toUpperCase()}-${userProfile.uid.substring(userProfile.uid.length - 4).toUpperCase()}`;
        
        doc.setFillColor(13, 27, 42);
        doc.rect(0, 0, 85.6, 54, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(10);
        doc.text("NYAYA SAHAYAK", 10, 10);
        
        doc.setFontSize(6);
        doc.setTextColor(100, 100, 100);
        doc.text("OFFICIAL REGISTRY NODE", 10, 14);
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(12);
        doc.text(`${userProfile.firstName} ${userProfile.lastName}`, 10, 30);
        
        doc.setFontSize(8);
        doc.setTextColor(59, 130, 246);
        doc.text(userProfile.userType.toUpperCase(), 10, 36);
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(7);
        doc.text(systemID, 10, 42);
        
        doc.setFontSize(5);
        doc.text("nyayasahayak.in", 65, 50);
        
        doc.save(`${userProfile.firstName}-Nyaya-ID.pdf`);
        toast({ title: "Download Initialized", description: "Your Institutional ID has been generated." });
    } catch (err) {
        toast({ variant: "destructive", title: "Export Failed", description: "Could not generate identity PDF." });
    }
  };

  if (loading) return <div className="flex h-full items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-primary opacity-20" /></div>;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10 max-w-6xl mx-auto pb-20 px-2 sm:px-0">
        <PageHeader
            title="Registry Dossier"
            description="Manage your secure identity nodes and institutional platform configurations."
        />

        <div className="grid lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-4 space-y-6">
                <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1 flex items-center gap-2">
                        <ShieldCheck className="h-3 w-3 text-primary" /> Institutional Identity Card
                    </Label>
                    <div className="space-y-4">
                        <DigitalIDCard user={userProfile} photoURL={photoURL} />
                        <Button 
                            onClick={handleDownloadID}
                            className="w-full h-12 rounded-2xl font-black text-[10px] uppercase tracking-widest gap-3 shadow-xl shadow-primary/20 active:scale-95 transition-all"
                        >
                            <Download className="h-4 w-4" /> Download Official ID
                        </Button>
                    </div>
                </div>

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
                                <Button size="icon" variant="secondary" className="rounded-xl h-9 w-9 sm:h-10 sm:w-10 shadow-2xl border border-primary/10 hover:bg-primary hover:text-white transition-all" onClick={startCamera}>
                                    <Camera className="h-4 w-4" />
                                </Button>
                                <Button size="icon" variant="secondary" className="rounded-xl h-9 w-9 sm:h-10 sm:w-10 shadow-2xl border border-primary/10 hover:bg-primary hover:text-white transition-all" onClick={() => fileInputRef.current?.click()}>
                                    <ImageUp className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
                        
                        <div className="space-y-2">
                            <h2 className="text-xl sm:text-2xl font-black tracking-tighter leading-tight truncate px-2">{firstName} {lastName}</h2>
                            <div className="flex flex-col items-center gap-3">
                                {userProfile?.emailVerified ? (
                                    <Badge className="bg-green-500/10 text-green-600 border-green-500/20 py-1 px-4 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                                        <BadgeCheck className="h-3 w-3 mr-2" /> Identity Verified
                                    </Badge>
                                ) : userProfile?.securityStatus === 'verified' ? (
                                    <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20 py-1 px-4 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
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
                                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] opacity-40">System Node: {userProfile?.userType}</span>
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
                            <Link href="/privacy">
                                <KeyRound className="mr-3 h-4 w-4 opacity-40" />
                                <span className="text-xs">Security Protocols</span>
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
                
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
                                    <Trash2 className="mr-3 h-4 w-4" />
                                    Purge Registry Record
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="glass border-destructive/20 rounded-[2rem] p-8 max-w-md">
                                <AlertDialogHeader>
                                    <div className="p-4 rounded-full bg-destructive/10 w-fit mx-auto mb-4"><ShieldAlert className="h-10 w-10 text-destructive" /></div>
                                    <AlertDialogTitle className="font-black text-2xl tracking-tighter text-center">Confirm Permanent Purge</AlertDialogTitle>
                                    <AlertDialogDescription className="text-center text-sm font-medium leading-relaxed">
                                        This protocol is irreversible. All forensic records, case narrations, and identity data will be permanently erased.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter className="flex-col sm:flex-row gap-3 mt-6">
                                    <AlertDialogCancel className="font-bold h-12 rounded-xl flex-1">Abort</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive text-white hover:bg-destructive/90 font-black h-12 rounded-xl flex-1 uppercase tracking-widest text-xs">Execute Purge</AlertDialogAction>
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
                            <CardTitle className="text-2xl sm:text-3xl font-black tracking-tight leading-none">Identity Nodes</CardTitle>
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
                                className="w-full sm:w-auto h-14 px-12 font-black uppercase tracking-widest text-xs shadow-2xl shadow-primary/20 rounded-2xl active:scale-95 transition-all"
                            >
                                {saving ? <Loader2 className="mr-3 h-5 w-5 animate-spin" /> : <Edit className="mr-3 h-4 w-4" />}
                                Synchronize Registry
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <AnimatePresence>
                    {!userProfile?.emailVerified && (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                            <Card className="border-amber-500/20 bg-amber-500/5 rounded-[2.5rem] shadow-xl overflow-hidden relative">
                                <div className="absolute top-0 right-0 p-8 opacity-[0.05]">
                                    <MailCheck className="h-32 w-32 text-amber-600" />
                                </div>
                                <CardHeader className="p-8 sm:p-10 pb-4">
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
                          <Camera className="mr-3 h-6 w-6" /> Capture Node
                      </Button>
                  </div>
              </div>
          </DialogContent>
      </Dialog>
    </motion.div>
  );
}
