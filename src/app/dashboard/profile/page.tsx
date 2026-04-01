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
  BadgeCheck, 
  Zap, 
  Cpu, 
  QrCode,
  Activity,
  Globe,
  CreditCard,
  Award,
  Download,
  Lightbulb,
  Mail,
} from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { useAuth, useFirestore, useDatabase } from '@/firebase';
import { doc, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { ref, update, remove } from 'firebase/database';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { signOut, deleteUser } from 'firebase/auth';
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
import { motion } from 'framer-motion';
import { verifyEmailAuthenticity } from "@/ai/flows/verify-email-authenticity";
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Logo } from "@/components/logo";
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
  subscriptionType?: string;
  aiUsageCount?: number;
  clearanceExpiry?: string;
  lastPaymentId?: string;
}

const ADMIN_EMAILS = [
  'enterspaceindia@gmail.com', 
  'piyushkumrsingh23399@gmail.com',
  'nyayasahayakhelp@gmail.com'
];

function EliteCertificateNode({ profile }: { profile: UserProfile }) {
    const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
    const expiry = profile.clearanceExpiry ? new Date(profile.clearanceExpiry) : new Date();
    if (!profile.clearanceExpiry) expiry.setFullYear(expiry.getFullYear() + 1);
    const expiryDate = expiry.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
    const { toast } = useToast();

    const downloadCertificate = async () => {
        try {
            const doc = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: 'a4'
            });

            // 1. Background & Borders (Colorful Tricolor Aesthetic)
            doc.setFillColor(255, 255, 255);
            doc.rect(0, 0, 297, 210, 'F');
            
            // Saffron Top Border
            doc.setFillColor(255, 153, 51);
            doc.rect(5, 5, 287, 5, 'F');
            
            // Green Bottom Border
            doc.setFillColor(18, 136, 7);
            doc.rect(5, 200, 287, 5, 'F');

            // Side Navy Borders
            doc.setFillColor(0, 0, 128);
            doc.rect(5, 5, 5, 200, 'F');
            doc.rect(287, 5, 5, 200, 'F');

            // Decorative Inner Border
            doc.setDrawColor(0, 0, 128);
            doc.setLineWidth(0.5);
            doc.rect(12, 12, 273, 186);

            // 2. Main Logo Node
            const logoImg = new Image();
            logoImg.src = '/Logo.png';
            await new Promise((resolve) => { logoImg.onload = resolve; });
            doc.addImage(logoImg, 'PNG', 133.5, 20, 30, 30);

            // 3. Header Text
            doc.setFont("helvetica", "bold");
            doc.setFontSize(10);
            doc.setTextColor(153, 75, 0);
            doc.text("INSTITUTIONAL STATUTORY AUTHORITY", 148.5, 58, { align: 'center' });

            doc.setFontSize(32);
            doc.setTextColor(0, 0, 0);
            doc.text("CERTIFICATE OF CLEARANCE", 148.5, 75, { align: 'center' });

            // 4. Recipient Node
            doc.setFontSize(16);
            doc.text("This document formally certifies that", 148.5, 95, { align: 'center' });
            
            doc.setFontSize(36);
            doc.setTextColor(153, 75, 0);
            doc.text(`${profile.firstName} ${profile.lastName}`.toUpperCase(), 148.5, 115, { align: 'center' });

            // 5. Body Text
            doc.setFontSize(14);
            doc.setTextColor(100, 100, 100);
            const desc = `has been granted an Upgraded Statutory Node within the Nyaya Sahayak neural legal ecosystem. Subject to the Terms of Protocol and Forensic Security Standards of Bharat. Access to advanced neural auditing terminals is authorized.`;
            const splitDesc = doc.splitTextToSize(desc, 220);
            doc.text(splitDesc, 148.5, 135, { align: 'center' });

            // 6. Metadata Registry
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);
            doc.text(`Registry Node ID: NS-REG-${profile.uid.substring(0, 12).toUpperCase()}`, 25, 170);
            doc.text(`Verification Date: ${today}`, 25, 178);
            doc.text(`Valid Until: ${expiryDate}`, 25, 186);
            doc.text(`Web: https://nyayasahayak.in`, 25, 194);

            // 7. Signature & Ownership
            doc.setFont("helvetica", "bolditalic");
            doc.setFontSize(22);
            doc.setTextColor(153, 75, 0);
            doc.text("Hardy Pie", 230, 175, { align: 'center' });
            doc.line(200, 178, 260, 178);
            
            doc.setFont("helvetica", "bold");
            doc.setFontSize(9);
            doc.setTextColor(0, 0, 0);
            doc.text("HARDY PIE", 230, 183, { align: 'center' });
            doc.setFontSize(8);
            doc.setTextColor(100, 100, 100);
            doc.text("Owner & Chief Architect", 230, 188, { align: 'center' });

            // 8. IdeaSpark Footer
            doc.setFillColor(240, 240, 240);
            doc.rect(110, 175, 77, 15, 'F');
            doc.setFont("helvetica", "bold");
            doc.setFontSize(9);
            doc.setTextColor(0, 0, 0);
            doc.text("DEVELOPED BY IDEASPARK", 148.5, 182, { align: 'center' });
            doc.setFontSize(7);
            doc.setTextColor(153, 75, 0);
            doc.text("nyayasahayakhelp@gmail.com", 148.5, 187, { align: 'center' });

            doc.save(`Nyaya-Sahayak-Clearance-${profile.firstName}.pdf`);
            toast({ title: "Certificate Downloaded", description: "Your statutory record is ready for institutional presentation." });
        } catch (e) {
            console.error(e);
            toast({ variant: "destructive", title: "Export Failed", description: "PDF generation encountered a node error." });
        }
    };

    return (
        <Card className="border-[12px] border-primary/5 bg-white dark:bg-zinc-950 p-8 sm:p-16 rounded-[3rem] shadow-3xl relative overflow-hidden text-center">
            {/* Design Watermarks */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none text-left">
                <div className="absolute top-[-10%] left-[-10%] w-full h-full border-[1px] border-primary rounded-full scale-150" />
                <div className="absolute bottom-[-10%] right-[-10%] w-full h-full border-[1px] border-primary rounded-full scale-150" />
            </div>
            
            <div className="relative z-10 space-y-12">
                <header className="space-y-6">
                    <div className="flex justify-center">
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-primary/10 rounded-full animate-pulse blur-xl" />
                            <Logo className="h-24 w-24 relative z-10 p-0 shadow-none border-none bg-transparent" priority />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">Institutional Statutory Authority</h2>
                        <h1 className="text-3xl sm:text-5xl font-black font-headline tracking-tighter text-foreground uppercase leading-none">Certificate of <br/> <span className="text-primary italic">Clearance Upgrade</span></h1>
                        <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest pt-2">Web Registry: https://nyayasahayak.in</p>
                    </div>
                </header>

                <div className="space-y-8 max-w-2xl mx-auto text-center">
                    <p className="text-sm sm:text-base font-medium text-muted-foreground leading-relaxed">
                        This document formally certifies that the node identified as <span className="text-foreground font-black uppercase tracking-tight">{profile.firstName} {profile.lastName}</span> has been granted an <span className="text-primary font-black uppercase tracking-tight">Upgraded Statutory Node</span> within the Nyaya Sahayak neural legal ecosystem.
                    </p>
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground/80 leading-relaxed italic">
                        Subject to the Terms of Protocol and Forensic Security Standards of Bharat. Access to advanced neural auditing and statutory drafting terminals is authorized.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 pt-8 items-end">
                    <div className="text-left space-y-6">
                        <div className="space-y-1">
                            <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Verification Date</p>
                            <p className="text-xs font-bold text-foreground">{today}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Registry Node ID</p>
                            <p className="text-[10px] font-mono font-bold text-primary">NS-REG-{profile.uid.substring(0, 8).toUpperCase()}</p>
                        </div>
                        <div className="pt-2 flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/5 border border-primary/10">
                                <Lightbulb className="h-4 w-4 text-primary" />
                            </div>
                            <div className="text-left">
                                <p className="text-[8px] font-black uppercase tracking-widest text-primary">Developed by IdeaSpark</p>
                                <p className="text-[7px] font-bold text-muted-foreground opacity-40 uppercase">Institutional Technology</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex flex-col items-center sm:items-end gap-6 relative">
                        {/* Rotating Official Seal */}
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

                        {/* Signature Terminal */}
                        <div className="relative pt-10 text-center sm:text-right min-w-[220px]">
                            <div className="mb-[-15px] relative z-10">
                                <p className="font-['Brush_Script_MT',_cursive] text-4xl sm:text-5xl text-primary/90 italic tracking-tighter select-none drop-shadow-sm">
                                    Hardy Pie
                                </p>
                            </div>
                            <div className="h-[1.5px] w-full bg-foreground/30 rounded-full" />
                            <div className="pt-3">
                                <p className="text-10 font-black uppercase tracking-widest text-foreground leading-none">Hardy Pie</p>
                                <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-[0.3em] mt-1.5">Owner & Chief Architect</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="pt-10 flex flex-col sm:flex-row items-center justify-center gap-6">
                    <Button onClick={downloadCertificate} className="rounded-xl h-14 px-10 font-black uppercase tracking-widest text-xs shadow-2xl shadow-primary/20 active:scale-95 transition-all group overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                        <Download className="mr-3 h-5 w-5" /> Export Statutory Record (PDF)
                    </Button>
                    <div className="text-left space-y-1 opacity-60">
                        <p className="text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                            <Mail className="h-3 w-3 text-primary" /> nyayasahayakhelp@gmail.com
                        </p>
                        <p className="text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                            <Globe className="h-3 w-3 text-primary" /> nyayasahayak.in
                        </p>
                    </div>
                </div>
            </div>
        </Card>
    );
}

function DigitalIdentityCard({ profile, isAdmin }: { profile: UserProfile, isAdmin: boolean }) {
    const isUpgraded = profile.subscriptionType !== 'free';
    const systemId = isAdmin ? `NS-ROOT-AUTH-99` : `NS-REG-${profile.uid.substring(0, 4).toUpperCase()}-${profile.uid.substring(profile.uid.length - 4).toUpperCase()}`;
    
    return (
        <div className="relative w-full aspect-[1.586/1] rounded-[1.5rem] overflow-hidden shadow-2xl group transition-all hover:scale-[1.02] active:scale-0.98 text-left">
            <div className={cn(
                "absolute inset-0 bg-gradient-to-br transition-all duration-700",
                isAdmin || isUpgraded ? "from-amber-600 via-amber-500 to-amber-800" : "from-[#1a1a1a] via-[#333333] to-[#000000]"
            )}></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
            
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
                            {isAdmin || isUpgraded ? "Elite Registry" : "Citizen Registry"}
                        </span>
                    </div>
                </div>

                <div className="flex gap-5 items-end mb-4">
                    <div className="relative shrink-0">
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
                    <div className="bg-white/95 p-2 rounded-xl shadow-2xl shrink-0">
                        <QrCode className="h-10 w-10 text-black" />
                    </div>
                </div>
                
                <div className="pt-4 border-t border-white/10 flex justify-between items-center bg-white/5 -mx-6 px-6 mt-2">
                    <div className="space-y-0.5 text-left">
                        <p className="text-[7px] font-bold uppercase opacity-40 tracking-widest">Digital Registry Email</p>
                        <p className="text-[9px] font-bold truncate text-white/80">{profile.email}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[7px] font-bold uppercase opacity-40 tracking-widest">Clearance Node</p>
                        <p className={cn(
                            "text-[9px] font-black uppercase tracking-tighter",
                            isAdmin || isUpgraded ? "text-amber-400" : "text-green-400"
                        )}>{isAdmin ? "Absolute Statutory Hub" : isUpgraded ? "Premium Forensic Node" : "Standard Identity Ingress"}</p>
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
  const [isCameraOpen, setIsCameraOpen] = useState(false);

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
        }
        setLoading(false);
      });
      return () => unsub();
    }
  }, [auth, firestore]);

  const hasChanges = userProfile ? (
    firstName !== userProfile.firstName ||
    lastName !== userProfile.lastName ||
    mobileNumber !== (userProfile.mobileNumber || '') ||
    photoURL !== (userProfile.photoURL || '')
  ) : false;

  const handleVerifySelf = async () => {
    if (!userProfile || isVerifying) return;
    setIsVerifying(true);
    try {
        const verification = await verifyEmailAuthenticity({ email: userProfile.email });
        if (verification.isAuthentic) {
            await setDoc(doc(firestore, "users", userProfile.uid), { securityStatus: 'verified' }, { merge: true });
            toast({ title: "Audit Passed", description: "Forensic identity confirmed." });
        } else {
            toast({ variant: "destructive", title: "Security Flag", description: verification.reason });
        }
    } catch (error) {
        toast({ variant: "destructive", title: "Audit Error" });
    } finally {
        setIsVerifying(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({ variant: "destructive", title: "File too large", description: "Max 2MB." });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setPhotoURL(dataUrl);
        if (auth.currentUser) {
            setDoc(doc(firestore, "users", auth.currentUser.uid), { photoURL: dataUrl }, { merge: true });
            update(ref(rtdb, `users/${auth.currentUser.uid}`), { photoURL: dataUrl });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setIsCameraOpen(true);
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (error) {
      toast({ variant: 'destructive', title: 'Camera Error' });
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
      if (auth.currentUser) {
          setDoc(doc(firestore, "users", auth.currentUser.uid), { photoURL: dataUrl }, { merge: true });
          update(ref(rtdb, `users/${auth.currentUser.uid}`), { photoURL: dataUrl });
      }
      stopCamera();
    }
  };

  const handleSaveChanges = () => {
    if (!auth.currentUser || !userProfile) return;
    setSaving(true);
    const updatedProfile = { ...userProfile, firstName, lastName, mobileNumber };
    setDoc(doc(firestore, "users", auth.currentUser.uid), updatedProfile, { merge: true })
      .then(() => {
        update(ref(rtdb, `users/${auth.currentUser?.uid}`), updatedProfile);
        toast({ title: 'Registry Synced', description: 'Personal dossier updated.' });
      })
      .finally(() => setSaving(false));
  };

  if (loading) return <div className="flex h-full items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-primary opacity-20" /></div>;

  const isAdmin = email && ADMIN_EMAILS.includes(email.toLowerCase());
  const isUpgraded = userProfile?.subscriptionType !== 'free' || isAdmin;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10 max-w-6xl mx-auto pb-20 px-4 sm:px-0 text-left">
        <PageHeader title="Registry Dossier" description="Manage your identity and institutional platform configurations." />

        <div className="grid lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-4 space-y-6">
                <Card className="glass shadow-2xl rounded-[2.5rem] overflow-hidden border-primary/5">
                    <div className="bg-primary/5 p-8 flex flex-col items-center text-center">
                        <div className="relative group mb-6">
                            <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-background shadow-2xl rounded-[1.5rem] sm:rounded-[2rem] relative z-10 transition-all">
                                <AvatarImage src={photoURL} className="object-cover" />
                                <AvatarFallback className="bg-primary/5 text-primary text-2xl font-black">{firstName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-2 -right-2 flex gap-2 z-20">
                                <button className="h-9 w-9 rounded-xl bg-white dark:bg-zinc-800 shadow-2xl flex items-center justify-center border border-primary/10 hover:bg-primary hover:text-white transition-all" onClick={startCamera}>
                                    <Camera className="h-4 w-4" />
                                </button>
                                <button className="h-9 w-9 rounded-xl bg-white dark:bg-zinc-800 shadow-2xl flex items-center justify-center border border-primary/10 hover:bg-primary hover:text-white transition-all" onClick={() => fileInputRef.current?.click()}>
                                    <ImageUp className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                        <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
                        
                        <div className="space-y-2 max-w-full px-2">
                            <h2 className="text-xl sm:text-2xl font-black tracking-tighter truncate">{firstName} {lastName}</h2>
                            <div className="flex flex-col items-center gap-3">
                                {userProfile?.emailVerified || isAdmin ? (
                                    <Badge className="bg-green-500/10 text-green-600 border-green-500/20 py-1 px-4 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                                        <BadgeCheck className="h-3 w-3 mr-2" /> Identity Verified
                                    </Badge>
                                ) : (
                                    <Button size="sm" variant="outline" className="h-9 px-4 text-[10px] font-black uppercase tracking-widest text-red-500 border-red-200 rounded-xl" onClick={handleVerifySelf} disabled={isVerifying}>
                                        {isVerifying ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : <ShieldCheck className="h-3 w-3 mr-2" />}
                                        Run Forensic Scan
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                    <CardContent className="p-6 sm:p-8 space-y-4 text-left">
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-primary/5">
                            <div className="flex items-center gap-3">
                                <Moon className="h-4 w-4 text-muted-foreground" />
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

                {userProfile && <DigitalIdentityCard profile={userProfile} isAdmin={isAdmin || false} />}
                
                <Card className="border-destructive/10 bg-destructive/5 shadow-xl rounded-[2.5rem] overflow-hidden">
                    <CardHeader className="p-6 sm:p-8 pb-4 text-left">
                        <CardTitle className="text-destructive font-black text-lg flex items-center gap-2">
                            <ShieldAlert className="h-5 w-5" /> Account Removal
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 sm:p-8 pt-0 space-y-3 text-left">
                        <Button variant="outline" className="w-full h-12 justify-start hover:bg-destructive/10 text-foreground border-destructive/5 rounded-2xl font-bold" onClick={() => signOut(auth).then(() => router.push('/login'))}>
                            <LogOut className="mr-3 h-4 w-4 opacity-40" /> 
                            <span className="text-xs">Terminate Session</span>
                        </Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" className="w-full h-12 justify-start font-black text-xs uppercase tracking-widest rounded-2xl active:scale-95 shadow-lg shadow-destructive/20">
                                    <Trash2 className="mr-3 h-4 w-4" /> Purge Registry Record
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="glass border-destructive/20 rounded-[2rem] p-8 max-w-md text-left">
                                <AlertDialogHeader>
                                    <AlertDialogTitle className="font-black text-2xl tracking-tighter text-center">Confirm Permanent Purge</AlertDialogTitle>
                                    <AlertDialogDescription className="text-center text-sm font-medium leading-relaxed">
                                        This protocol is irreversible. All forensic records, case narrations, and identity data will be permanently erased.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter className="flex-col sm:flex-row gap-3 mt-6">
                                    <AlertDialogCancel className="font-bold h-12 rounded-xl flex-1">Abort Protocol</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => {
                                        if(isAdmin) { toast({variant:'destructive', title:'Action Denied'}); return; }
                                        deleteDoc(doc(firestore, "users", auth.currentUser!.uid)).then(() => {
                                            remove(ref(rtdb, `users/${auth.currentUser!.uid}`));
                                            deleteUser(auth.currentUser!).then(() => router.replace('/'));
                                        });
                                    }} className="bg-destructive text-white hover:bg-destructive/90 font-black h-12 rounded-xl flex-1 uppercase tracking-widest text-xs">Execute Purge</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </CardContent>
                </Card>
            </div>

            <div className="lg:col-span-8 space-y-8">
                <Card className="glass shadow-2xl rounded-[2.5rem] border-primary/5 overflow-hidden">
                    <CardHeader className="p-8 sm:p-10 bg-primary/5 border-b border-primary/10">
                        <CardTitle className="text-2xl sm:text-3xl font-black tracking-tight leading-none uppercase">Identity Protocols</CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 sm:p-10 space-y-8 text-left">
                        <div className="grid sm:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Given Name</Label>
                                <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} className="h-14 glass border-primary/10 rounded-2xl font-bold px-5" />
                            </div>
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Family Name</Label>
                                <Input value={lastName} onChange={(e) => setLastName(e.target.value)} className="h-14 glass border-primary/10 rounded-2xl font-bold px-5" />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Institutional Email</Label>
                            <Input value={email} disabled className="h-14 glass border-primary/10 rounded-2xl font-bold px-5 opacity-50" />
                        </div>
                        <div className="space-y-3">
                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Contact Node (Mobile)</Label>
                            <Input value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} className="h-14 glass border-primary/10 rounded-2xl font-bold px-5" />
                        </div>
                        
                        <div className="flex justify-end">
                            <Button onClick={handleSaveChanges} disabled={saving || !hasChanges} className="w-full sm:w-auto h-14 px-12 font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 rounded-2xl active:scale-95 transition-all">
                                {saving ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Edit className="mr-2 h-4 w-4" />}
                                Synchronize Registry
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {isUpgraded && userProfile && (
                    <div className="space-y-8">
                        <div className="flex items-center gap-3 px-4">
                            <Award className="h-5 w-5 text-amber-500" />
                            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-foreground">Institutional Authorization Node</h3>
                        </div>
                        <EliteCertificateNode profile={userProfile} />
                    </div>
                )}

                <Card className="glass shadow-2xl rounded-[2.5rem] border-primary/5 overflow-hidden">
                    <CardHeader className="p-8 sm:p-10 bg-muted/5 border-b border-primary/5 flex flex-row items-center justify-between">
                        <div className="space-y-1 text-left">
                            <div className="flex items-center gap-2 text-primary">
                                <CreditCard className="h-4 w-4" />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Statutory Clearance</span>
                            </div>
                            <CardTitle className="text-2xl font-black tracking-tight leading-none uppercase">Usage Summary</CardTitle>
                        </div>
                        <Badge variant="secondary" className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                            {isAdmin ? 'Institutional Annual' : (userProfile?.subscriptionType?.replace('_', ' ') || 'Free Tier')}
                        </Badge>
                    </CardHeader>
                    <CardContent className="p-8 sm:p-10">
                        <div className="grid md:grid-cols-2 gap-10">
                            <div className="space-y-6 text-left">
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">AI Forensic Usage</p>
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden shadow-inner">
                                            <div className="h-full bg-primary" style={{ width: '100%' }} />
                                        </div>
                                        <span className="font-mono font-black text-sm">∞</span>
                                    </div>
                                </div>
                                <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
                                    <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                                        Registry Freedom Active. Unrestricted neural bandwidth authorized for all nodes.
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col justify-center">
                                <Button asChild className="h-14 font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 rounded-2xl active:scale-95 transition-all">
                                    <Link href="/dashboard/billing">
                                        <Zap className="mr-3 h-4 w-4 animate-pulse" /> Initialize Upgrade
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>

      <Dialog open={isCameraOpen} onOpenChange={(o) => !o && stopCamera()}>
          <DialogContent className="p-0 overflow-hidden sm:rounded-[2.5rem] border-none shadow-2xl bg-black max-w-2xl text-left">
              <div className="relative aspect-video bg-zinc-900">
                  <video ref={videoRef} className="h-full w-full object-cover" autoPlay muted playsInline />
                  <canvas ref={canvasRef} className="hidden" />
                  <div className="absolute top-6 right-6">
                      <Button variant="ghost" size="icon" className="text-white bg-black/40 rounded-xl h-12 w-12" onClick={stopCamera}><X /></Button>
                  </div>
                  <div className="absolute bottom-8 left-0 right-0 flex justify-center px-8">
                      <Button onClick={capturePhoto} className="h-16 w-full max-w-xs font-black uppercase tracking-[0.2em] shadow-2xl rounded-2xl bg-primary text-white"><Camera className="mr-3 h-6 w-6" /> Capture Identity</Button>
                  </div>
              </div>
          </DialogContent>
      </Dialog>
    </motion.div>
  );
}
