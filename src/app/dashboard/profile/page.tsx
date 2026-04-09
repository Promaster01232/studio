
"use client";

import { useState, useEffect, useRef } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  LogOut, 
  KeyRound, 
  ShieldCheck, 
  Edit, 
  Loader2, 
  Camera, 
  ImageUp, 
  BadgeCheck, 
  Zap, 
  QrCode,
  Activity,
  Globe,
  Download,
  Lightbulb
} from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { useAuth, useFirestore, useDatabase } from '@/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { ref, update } from 'firebase/database';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { signOut } from 'firebase/auth';
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
}

const ADMIN_EMAILS = [
  'enterspaceindia@gmail.com', 
  'piyushkumrsingh23399@gmail.com',
  'nyayasahayakhelp@gmail.com'
];

function EliteCertificateNode({ profile }: { profile: UserProfile }) {
    const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
    const { toast } = useToast();

    const downloadCertificate = async () => {
        try {
            const doc = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: 'a4'
            });

            doc.setFillColor(255, 255, 255);
            doc.rect(0, 0, 297, 210, 'F');
            doc.setFillColor(255, 153, 51);
            doc.rect(5, 5, 287, 5, 'F');
            doc.setFillColor(18, 136, 7);
            doc.rect(5, 200, 287, 5, 'F');
            doc.setDrawColor(0, 0, 128);
            doc.rect(12, 12, 273, 186);

            const logoImg = new Image();
            logoImg.src = '/Logo.png';
            await new Promise((resolve) => { logoImg.onload = resolve; });
            doc.addImage(logoImg, 'PNG', 133.5, 20, 30, 30);

            doc.setFont("helvetica", "bold");
            doc.setFontSize(10);
            doc.setTextColor(153, 75, 0);
            doc.text("INSTITUTIONAL STATUTORY AUTHORITY", 148.5, 58, { align: 'center' });
            doc.setFontSize(32);
            doc.setTextColor(0, 0, 0);
            doc.text("CERTIFICATE OF CLEARANCE", 148.5, 75, { align: 'center' });
            doc.setFontSize(16);
            doc.text("This document formally confirms that", 148.5, 95, { align: 'center' });
            doc.setFontSize(36);
            doc.setTextColor(153, 75, 0);
            doc.text(`${profile.firstName} ${profile.lastName}`.toUpperCase(), 148.5, 115, { align: 'center' });
            doc.setFontSize(14);
            doc.setTextColor(100, 100, 100);
            const desc = `is fully authorized to perform all statutory operations on the Nyaya Sahayak platform. Every forensic AI module and drafting terminal is synchronized and ready for 100% performance. This node has passed all institutional audits.`;
            doc.text(doc.splitTextToSize(desc, 220), 148.5, 135, { align: 'center' });

            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);
            doc.text(`Registry ID: NS-REG-${profile.uid.substring(0, 12).toUpperCase()}`, 25, 170);
            doc.text(`Verification Date: ${today}`, 25, 178);
            doc.text(`Support: nyayasahayakhelp@gmail.com`, 25, 186);
            doc.text(`Web: https://nyayasahayak.in`, 25, 194);

            doc.setFont("helvetica", "bolditalic");
            doc.setFontSize(22);
            doc.text("Hardy Pie", 230, 175, { align: 'center' });
            doc.line(200, 178, 260, 178);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(9);
            doc.text("HARDY PIE", 230, 183, { align: 'center' });
            doc.text("Owner & Chief Architect", 230, 188, { align: 'center' });

            doc.save(`Nyaya-Sahayak-Clearance-${profile.firstName}.pdf`);
            toast({ title: "Certificate Downloaded" });
        } catch (e) {
            toast({ variant: "destructive", title: "Export Failed" });
        }
    };

    return (
        <Card className="border-[6px] sm:border-[12px] border-primary/5 bg-white dark:bg-zinc-950 p-6 sm:p-16 rounded-[2rem] sm:rounded-[3rem] shadow-3xl relative overflow-hidden text-center">
            <div className="relative z-10 space-y-8 sm:space-y-12">
                <header className="space-y-4 sm:space-y-6">
                    <div className="flex justify-center">
                        <Logo className="h-16 w-16 sm:h-24 sm:w-24 p-0 shadow-none border-none bg-transparent" priority={true} />
                    </div>
                    <div className="space-y-2 px-2">
                        <h2 className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.3em] sm:tracking-[0.5em] text-primary">Institutional Statutory Authority</h2>
                        <h1 className="text-2xl sm:text-5xl font-black font-headline tracking-tighter text-foreground uppercase leading-tight sm:leading-none">Certificate of <br className="sm:hidden"/> <span className="text-primary italic">Clearance Upgrade</span></h1>
                        <p className="text-[8px] sm:text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest pt-1 sm:pt-2">Web Registry: https://nyayasahayak.in</p>
                    </div>
                </header>
                <div className="space-y-6 sm:space-y-8 max-w-2xl mx-auto text-center px-2">
                    <p className="text-xs sm:text-base font-medium text-muted-foreground leading-relaxed">
                        This document formally confirms that the account identified as <span className="text-foreground font-black uppercase tracking-tight">{profile.firstName} {profile.lastName}</span> is fully authorized to perform all statutory operations on this platform. Every forensic AI module and drafting terminal is synchronized and ready for 100% performance.
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12 pt-4 sm:pt-8 items-end text-left sm:text-left">
                    <div className="space-y-4 sm:space-y-6 order-2 sm:order-1">
                        <div className="space-y-1">
                            <p className="text-[7px] sm:text-[8px] font-black uppercase tracking-widest text-muted-foreground">Registry ID</p>
                            <p className="text-[9px] sm:text-[10px] font-mono font-bold text-primary">NS-REG-{profile.uid.substring(0, 8).toUpperCase()}</p>
                        </div>
                        <div className="pt-1 sm:pt-2 flex items-center gap-3">
                            <div className="p-1.5 sm:p-2 rounded-lg bg-primary/5 border border-primary/10">
                                <Lightbulb className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                            </div>
                            <div>
                                <p className="text-[7px] sm:text-[8px] font-black uppercase tracking-widest text-primary">Developed by IdeaSpark</p>
                            </div>
                        </div>
                    </div>
                    <div className="relative pt-6 sm:pt-10 text-center sm:text-right min-w-[180px] sm:min-w-[220px] order-1 sm:order-2">
                        <p className="font-['Brush_Script_MT',_cursive] text-3xl sm:text-4xl text-primary/90 italic tracking-tighter">Hardy Pie</p>
                        <div className="h-[1.5px] w-full bg-foreground/30 rounded-full" />
                        <p className="text-[9px] sm:text-10 font-black uppercase tracking-widest text-foreground mt-2">Hardy Pie</p>
                        <p className="text-[7px] sm:text-[8px] font-bold text-muted-foreground uppercase mt-1">Owner & Chief Architect</p>
                    </div>
                </div>
                <Button onClick={downloadCertificate} className="w-full sm:w-auto rounded-xl h-12 sm:h-14 px-6 sm:px-10 font-black uppercase tracking-widest text-[10px] sm:text-xs shadow-2xl shadow-primary/20 transition-all active:scale-95">
                    <Download className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 w-5" /> Export Statutory Record (PDF)
                </Button>
            </div>
        </Card>
    );
}

function DigitalIdentityCard({ profile, isAdmin }: { profile: UserProfile, isAdmin: boolean }) {
    const isUpgraded = profile.subscriptionType !== 'free';
    const systemId = isAdmin ? `NS-ROOT-AUTH-99` : `NS-REG-${profile.uid.substring(0, 4).toUpperCase()}-${profile.uid.substring(profile.uid.length - 4).toUpperCase()}`;
    
    return (
        <div className="relative w-full aspect-[1.586/1] rounded-[1.2rem] sm:rounded-[1.5rem] overflow-hidden shadow-2xl group transition-all hover:scale-[1.02] active:scale-0.98 text-left">
            <div className={cn(
                "absolute inset-0 bg-gradient-to-br transition-all duration-700",
                isAdmin || isUpgraded ? "from-amber-600 via-amber-500 to-amber-800" : "from-[#1a1a1a] via-[#333333] to-[#000000]"
            )}></div>
            <div className="relative h-full flex flex-col p-4 sm:p-6 text-white">
                <div className="flex justify-between items-start mb-auto">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <Logo className="h-6 w-6 sm:h-8 sm:w-8 shadow-none p-0 border-none bg-transparent" priority={false} />
                        <div className="flex flex-col">
                            <span className="font-black text-[10px] sm:text-xs tracking-tighter leading-none">NYAYA SAHAYAK</span>
                            <span className="text-[6px] sm:text-[7px] font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] text-primary/80">{isAdmin ? "Root Authority system" : "Forensic Terminal"}</span>
                        </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-xl px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl border border-white/10">
                        <span className="text-[7px] sm:text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 sm:gap-2">
                            <div className="h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full bg-green-500 animate-pulse" />
                            {isAdmin || isUpgraded ? "Elite Registry" : "Citizen Registry"}
                        </span>
                    </div>
                </div>
                <div className="flex gap-3 sm:gap-5 items-end mb-2 sm:mb-4">
                    <Avatar className="h-14 w-14 sm:h-20 sm:w-20 border-2 border-white/20 rounded-xl sm:rounded-2xl shadow-2xl">
                        <AvatarImage src={profile.photoURL} className="object-cover" />
                        <AvatarFallback className="bg-white/10 text-white font-black text-lg sm:text-xl">{profile.firstName?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-black text-sm sm:text-xl tracking-tight truncate uppercase leading-none">{profile.firstName} {profile.lastName}</h3>
                        <p className="text-[7px] font-bold uppercase tracking-widest text-primary leading-none mt-1">{isAdmin ? "Institutional Admin" : profile.userType}</p>
                        <div className="flex items-center gap-1.5 pt-1">
                            <p className="text-[9px] sm:text-[11px] font-mono font-bold tracking-wider opacity-60">{systemId}</p>
                            <BadgeCheck className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-blue-400" />
                        </div>
                    </div>
                    <QrCode className="h-7 w-7 sm:h-10 sm:w-10 text-white/80" />
                </div>
                <div className="pt-2 sm:pt-4 border-t border-white/10 flex justify-between items-center bg-white/5 -mx-4 sm:-mx-6 px-4 sm:px-6 mt-1 sm:mt-2">
                    <div className="space-y-0.5">
                        <p className="text-[6px] sm:text-[7px] font-bold uppercase opacity-40 tracking-widest">Digital Registry Email</p>
                        <p className="text-[8px] sm:text-[9px] font-bold truncate text-white/80 max-w-[120px] sm:max-w-none">{profile.email}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[6px] sm:text-[7px] font-bold uppercase opacity-40 tracking-widest">Clearance system</p>
                        <p className={cn(
                            "text-[8px] sm:text-[9px] font-black uppercase tracking-tighter",
                            isAdmin || isUpgraded ? "text-amber-400" : "text-green-400"
                        )}>{isAdmin ? "Absolute Statutory Hub" : isUpgraded ? "Premium Forensic terminal" : "Standard Identity access"}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ProfilePage() {
  const { theme, setTheme } = useTheme();
  const auth = useAuth();
  const firestore = useFirestore();
  const rtdb = useDatabase();
  const router = useRouter();
  const { toast } = useToast();
  
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [photoURL, setPhotoURL] = useState('');
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (auth.currentUser) {
      const userDocRef = doc(firestore, "users", auth.currentUser.uid);
      const unsub = onSnapshot(userDocRef, (userDoc) => {
        if (userDoc.exists()) {
          const data = userDoc.data() as UserProfile;
          setUserProfile(data);
          setFirstName(data.firstName);
          setLastName(data.lastName);
          setMobileNumber(data.mobileNumber || '');
          if (data.photoURL) setPhotoURL(data.photoURL);
        }
        setLoading(false);
      });
      return () => unsub();
    }
  }, [auth, firestore]);

  const handleVerifySelf = async () => {
    if (!userProfile || isVerifying) return;
    setIsVerifying(true);
    try {
        const v = await verifyEmailAuthenticity({ email: userProfile.email });
        if (v.isAuthentic) {
            await setDoc(doc(firestore, "users", userProfile.uid), { emailVerified: true }, { merge: true });
            toast({ title: "Audit Passed" });
        } else {
            toast({ variant: "destructive", title: "Security Flag", description: v.reason });
        }
    } catch (e) { toast({ variant: "destructive", title: "Audit Error" }); }
    finally { setIsVerifying(false); }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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

  const handleSaveChanges = () => {
    if (!auth.currentUser || !userProfile) return;
    setSaving(true);
    const upd = { ...userProfile, firstName, lastName, mobileNumber };
    setDoc(doc(firestore, "users", auth.currentUser.uid), upd, { merge: true })
      .then(() => {
        update(ref(rtdb, `users/${auth.currentUser?.uid}`), upd);
        toast({ title: 'Registry Synced' });
      })
      .finally(() => setSaving(false));
  };

  if (loading) return <div className="flex h-full items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-primary opacity-20" /></div>;

  const isAdmin = userProfile?.email && ADMIN_EMAILS.includes(userProfile.email.toLowerCase());
  const isUpgraded = userProfile?.subscriptionType !== 'free' || isAdmin;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 sm:space-y-10 max-w-6xl mx-auto pb-20 px-1 sm:px-0 text-left">
        <PageHeader title="Registry Dossier" description="Manage your identity and institutional platform configurations." />
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-10 items-start">
            <div className="w-full lg:w-[380px] space-y-6">
                <Card className="glass shadow-2xl rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden border-primary/5">
                    <div className="bg-primary/5 p-6 sm:p-8 flex flex-col items-center text-center">
                        <div className="relative group mb-4 sm:mb-6">
                            <Avatar className="h-20 w-20 sm:h-32 sm:w-32 border-4 border-background shadow-2xl rounded-[1.2rem] sm:rounded-[2rem]">
                                <AvatarImage src={photoURL} className="object-cover" />
                                <AvatarFallback className="bg-primary/5 text-primary text-xl sm:text-2xl font-black">{firstName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-2 -right-2 flex gap-1.5 sm:gap-2 z-20">
                                <button className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg sm:rounded-xl bg-white dark:bg-zinc-800 shadow-2xl flex items-center justify-center border border-primary/10 hover:bg-primary hover:text-white transition-all" onClick={() => fileInputRef.current?.click()}><Camera className="h-3.5 w-3.5 sm:h-4 sm:w-4" /></button>
                                <button className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg sm:rounded-xl bg-white dark:bg-zinc-800 shadow-2xl flex items-center justify-center border border-primary/10 hover:bg-primary hover:text-white transition-all" onClick={() => fileInputRef.current?.click()}><ImageUp className="h-3.5 w-3.5 sm:h-4 sm:w-4" /></button>
                            </div>
                        </div>
                        <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
                        <h2 className="text-lg sm:text-2xl font-black tracking-tighter">{firstName} {lastName}</h2>
                        <div className="flex flex-col items-center gap-2 sm:gap-3 mt-2">
                            {userProfile?.emailVerified || isAdmin ? (
                                <Badge className="bg-green-500/10 text-green-600 border-green-500/20 py-1 px-3 sm:px-4 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest shadow-sm">
                                    <BadgeCheck className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1.5 sm:mr-2" /> Identity Verified
                                </Badge>
                            ) : (
                                <Button size="sm" variant="outline" className="h-8 sm:h-9 px-3 sm:px-4 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-red-500 border-red-200 rounded-lg sm:rounded-xl" onClick={handleVerifySelf} disabled={isVerifying}>
                                    {isVerifying ? <Loader2 className="h-3 w-3 animate-spin mr-1.5 sm:mr-2" /> : <ShieldCheck className="h-3 w-3 mr-1.5 sm:mr-2" />}
                                    Run Forensic Scan
                                </Button>
                            )}
                        </div>
                    </div>
                    <CardContent className="p-5 sm:p-8 space-y-4 text-left">
                        <div className="flex items-center justify-between p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-muted/30 border border-primary/5">
                            <span className="text-[11px] sm:text-xs font-bold">Dark Protocol</span>
                            <Switch checked={theme === 'dark'} onCheckedChange={(c) => setTheme(c ? 'dark' : 'light')} />
                        </div>
                        <Button variant="outline" className="w-full h-11 sm:h-12 justify-start font-bold border-primary/5 rounded-xl sm:rounded-2xl hover:bg-primary/5 transition-all" asChild>
                            <Link href="/dashboard/privacy"><KeyRound className="mr-2 sm:mr-3 h-4 w-4 opacity-40" /><span className="text-[11px] sm:text-xs">Security Protocols</span></Link>
                        </Button>
                    </CardContent>
                </Card>
                {userProfile && <DigitalIdentityCard profile={userProfile} isAdmin={isAdmin || false} />}
                <Card className="border-destructive/10 bg-destructive/5 shadow-xl rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden p-5 sm:p-8">
                    <Button variant="destructive" className="w-full h-11 sm:h-12 font-black text-[10px] sm:text-xs uppercase tracking-widest rounded-xl sm:rounded-2xl active:scale-95 shadow-lg shadow-destructive/20" onClick={() => signOut(auth).then(() => router.push('/login'))}>
                        <LogOut className="mr-2 sm:mr-3 h-4 w-4" /> Terminate Session
                    </Button>
                </Card>
            </div>
            <div className="flex-1 w-full space-y-6 sm:space-y-8">
                <Card className="glass shadow-2xl rounded-[1.5rem] sm:rounded-[2.5rem] border-primary/5 overflow-hidden">
                    <CardHeader className="p-6 sm:p-10 bg-primary/5 border-b border-primary/10"><CardTitle className="text-xl sm:text-3xl font-black tracking-tight leading-none uppercase">Identity Protocols</CardTitle></CardHeader>
                    <CardContent className="p-6 sm:p-10 space-y-6 sm:space-y-8 text-left">
                        <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
                            <div className="space-y-2 sm:space-y-3">
                                <Label className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Given Name</Label>
                                <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} className="h-12 sm:h-14 glass border-primary/10 rounded-xl sm:rounded-2xl font-bold px-4 sm:px-5" />
                            </div>
                            <div className="space-y-2 sm:space-y-3">
                                <Label className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Family Name</Label>
                                <Input value={lastName} onChange={(e) => setLastName(e.target.value)} className="h-12 sm:h-14 glass border-primary/10 rounded-xl sm:rounded-2xl font-bold px-4 sm:px-5" />
                            </div>
                        </div>
                        <div className="space-y-2 sm:space-y-3">
                            <Label className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Contact access (Mobile)</Label>
                            <Input value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} className="h-12 sm:h-14 glass border-primary/10 rounded-xl sm:rounded-2xl font-bold px-4 sm:px-5" />
                        </div>
                        <div className="flex justify-end pt-2">
                            <Button onClick={handleSaveChanges} disabled={saving} className="w-full sm:w-auto h-12 sm:h-14 px-8 sm:px-12 font-black uppercase tracking-widest text-[10px] sm:text-xs shadow-xl shadow-primary/20 rounded-xl sm:rounded-2xl active:scale-95 transition-all">
                                {saving ? <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" /> : <Edit className="mr-2 h-4 w-4" />} Synchronize Registry
                            </Button>
                        </div>
                    </CardContent>
                </Card>
                {isUpgraded && userProfile && <EliteCertificateNode profile={userProfile} />}
            </div>
        </div>
    </motion.div>
  );
}
