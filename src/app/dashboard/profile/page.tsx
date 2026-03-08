"use client";

import { useState, useEffect, useRef } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, Trash2, KeyRound, ShieldCheck, Moon, Edit, Loader2, User, Camera, X, ImageUp, ShieldAlert, MailCheck, AlertTriangle, BadgeCheck } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth, useFirestore, useDatabase } from '@/firebase';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { ref, set, update, remove } from 'firebase/database';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { signOut, deleteUser, sendEmailVerification } from 'firebase/auth';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
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
import { motion } from 'framer-motion';
import { verifyEmailAuthenticity } from "@/ai/flows/verify-email-authenticity";

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

  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Computed state for changes
  const hasChanges = userProfile ? (
    firstName !== userProfile.firstName ||
    lastName !== userProfile.lastName ||
    mobileNumber !== (userProfile.mobileNumber || '') ||
    photoURL !== (userProfile.photoURL || '')
  ) : false;


  useEffect(() => {
    setIsMounted(true);
    if (auth.currentUser) {
      setLoading(true);
      const userDocRef = doc(firestore, "users", auth.currentUser.uid);
      getDoc(userDocRef).then(userDoc => {
        if (userDoc.exists()) {
          const data = userDoc.data() as UserProfile;
          setUserProfile(data);
          setFirstName(data.firstName);
          setLastName(data.lastName);
          setEmail(data.email);
          setMobileNumber(data.mobileNumber || '');
          if (data.photoURL) {
            setPhotoURL(data.photoURL);
          }
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
          toast({
              title: "Verification email sent",
              description: "Please check your inbox and follow the link to verify your identity.",
          });
      } catch (error: any) {
          toast({
              variant: "destructive",
              title: "Error",
              description: error.message || "Failed to send verification email.",
          });
      } finally {
          setIsResending(false);
      }
  };

  const handleVerifySelf = async () => {
    if (!userProfile || isVerifying) return;
    setIsVerifying(true);
    toast({ title: "AI Forensic Analysis", description: "Verifying account registration pattern..." });

    try {
        const verification = await verifyEmailAuthenticity({
            email: userProfile.email,
            firstName: userProfile.firstName,
            lastName: userProfile.lastName
        });

        if (verification.isAuthentic) {
            const userRef = doc(firestore, "users", userProfile.uid);
            await setDoc(userRef, { 
                securityStatus: 'verified', 
                flagReason: "",
                isBlocked: false 
            }, { merge: true });
            
            setUserProfile(prev => prev ? { ...prev, securityStatus: 'verified' } : null);
            toast({ 
                title: "Forensic Check Passed", 
                description: `AI confirmed registration authenticity. Verified Badge still requires clicking the link in your email.` 
            });
        } else {
            const userRef = doc(firestore, "users", userProfile.uid);
            await setDoc(userRef, { 
                securityStatus: 'suspicious',
                flagReason: verification.reason || "AI detected suspicious identity patterns."
            }, { merge: true });
            
            setUserProfile(prev => prev ? { ...prev, securityStatus: 'suspicious' } : null);
            toast({ 
                variant: "destructive", 
                title: "Forensic Audit Failed", 
                description: verification.reason || "The account registration pattern looks incorrect." 
            });
        }
    } catch (error: any) {
        console.error("Verification error:", error);
        toast({ variant: "destructive", title: "Process Error", description: "Could not complete AI audit." });
    } finally {
        setIsVerifying(false);
    }
  };

  const updateUserPhoto = (newPhotoURL: string) => {
      if (!auth.currentUser || !userProfile) return;
      
      const updateData = { photoURL: newPhotoURL };
      
      // Update Firestore
      const userDocRef = doc(firestore, "users", auth.currentUser.uid);
      setDoc(userDocRef, updateData, { merge: true })
        .then(() => {
            toast({ title: "Photo updated", description: "Your profile picture has been saved." });
            setUserProfile(prev => prev ? { ...prev, photoURL: newPhotoURL } : null);
        })
        .catch(err => console.error("Failed to sync photo to Firestore:", err));

      // Update RTDB
      update(ref(rtdb, `users/${auth.currentUser.uid}`), updateData)
        .catch(err => console.warn("RTDB photo sync skipped:", err.message));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Please select an image smaller than 2MB.",
        });
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
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error: any) {
      console.error('Error accessing camera:', error);
      setHasCameraPermission(false);
      let msg = 'Please enable camera permissions in your browser settings to use this feature.';
      if (error.name === 'NotFoundError') {
          msg = 'No camera device found on this machine.';
      }
      toast({
        variant: 'destructive',
        title: error.name === 'NotFoundError' ? 'Camera not found' : 'Camera access denied',
        description: msg,
      });
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/png');
        setPhotoURL(dataUrl);
        updateUserPhoto(dataUrl);
        stopCamera();
      }
    }
  };

  const handleSaveChanges = () => {
    if (!auth.currentUser || !userProfile) return;

    setSaving(true);
    
    const updatedProfile: UserProfile = {
        ...userProfile,
        firstName,
        lastName,
        email,
        mobileNumber,
        photoURL,
    };

    const userDocRef = doc(firestore, "users", auth.currentUser.uid);

    setDoc(userDocRef, updatedProfile, { merge: true })
      .then(() => {
        set(ref(rtdb, `users/${auth.currentUser.uid}`), updatedProfile).catch(() => {});
        setUserProfile(updatedProfile);
        toast({ title: 'Profile updated', description: 'Your personal details have been saved.' });
      })
      .catch((serverError) => {
          const permissionError = new FirestorePermissionError({
            path: userDocRef.path,
            operation: 'update',
            requestResourceData: updatedProfile,
          }, serverError);
          errorEmitter.emit('permission-error', permissionError);
      })
      .finally(() => {
        setSaving(false);
      });
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const handleDeleteAccount = async () => {
    if (!auth.currentUser) return;
    if (ADMIN_EMAILS.includes(email.toLowerCase())) {
        toast({ variant: "destructive", title: "Action Blocked", description: "Root Admin account cannot be deleted." });
        return;
    }
    
    setSaving(true);
    const user = auth.currentUser;
    const userDocRef = doc(firestore, "users", user.uid);

    try {
      await deleteDoc(userDocRef);
      remove(ref(rtdb, `users/${user.uid}`)).catch(() => {});
      await deleteUser(user);
      
      toast({
        title: "Account deleted",
        description: "Your account and all associated data have been permanently removed.",
      });
      router.replace('/');
    } catch (error: any) {
      if (error.code === 'auth/requires-recent-login') {
        toast({
          variant: "destructive",
          title: "Security action required",
          description: "Please log out and sign back in before deleting your account.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete account.",
        });
      }
    } finally {
      if (auth.currentUser) setSaving(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      },
    },
  };

  const isSuperAdmin = ADMIN_EMAILS.includes(email.toLowerCase());

  if (loading) {
      return (
          <div className="flex h-full items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
      );
  }

  return (
    <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6 sm:space-y-8 max-w-5xl mx-auto pb-10"
    >
        <motion.div variants={itemVariants}>
            <PageHeader
                title="My Profile"
                description="Manage your account settings and personal information."
            />
        </motion.div>

        <motion.div variants={itemVariants}>
            <Card className="border-primary/5 overflow-hidden bg-card/40 backdrop-blur-md rounded-2xl shadow-xl">
                <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
                {photoURL ? (
                    <div className="relative group shrink-0">
                        <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-2 border-background shadow-2xl transition-transform active:scale-95 group-hover:scale-105 duration-300">
                            <AvatarImage src={photoURL} alt={`${firstName} ${lastName}`} className="object-cover" />
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <Button size="icon" variant="secondary" className="rounded-full h-8 w-8 shadow-xl border border-primary/10 hover:bg-primary hover:text-white" onClick={startCamera}>
                                <Camera className="h-3.5 w-3.5" />
                            </Button>
                            <Button size="icon" variant="secondary" className="rounded-full h-8 w-8 shadow-xl border border-primary/10 hover:bg-primary hover:text-white" onClick={() => fileInputRef.current?.click()}>
                                <ImageUp className="h-3.5 w-3.5" />
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="shrink-0 flex flex-row gap-3">
                        <Button variant="outline" className="h-16 w-16 sm:h-20 sm:w-20 rounded-full border-2 border-dashed border-primary/20 flex flex-col gap-1 items-center justify-center text-muted-foreground hover:bg-primary/5 hover:border-primary/40 transition-all duration-300 shadow-inner group" onClick={startCamera}>
                            <Camera className="h-5 w-5 sm:h-6 sm:w-6 group-hover:scale-110 transition-transform" />
                            <span className="text-[8px] sm:text-[9px] font-bold opacity-60 leading-none">Camera</span>
                        </Button>
                        <Button variant="outline" className="h-16 w-16 sm:h-20 sm:w-20 rounded-full border-2 border-dashed border-primary/20 flex flex-col gap-1 items-center justify-center text-muted-foreground hover:bg-primary/5 hover:border-primary/40 transition-all duration-300 shadow-inner group" onClick={() => fileInputRef.current?.click()}>
                            <ImageUp className="h-5 w-5 sm:h-6 sm:w-6 group-hover:scale-110 transition-transform" />
                            <span className="text-[8px] sm:text-[9px] font-bold opacity-60 leading-none">Device</span>
                        </Button>
                    </div>
                )}
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
                <div className="flex-1 text-center sm:text-left space-y-1.5 min-w-0 w-full">
                    <div className="flex flex-col sm:flex-row items-center gap-2">
                        <h2 className="text-xl sm:text-2xl font-black font-headline tracking-tighter text-foreground truncate">{firstName} {lastName}</h2>
                        <div className="flex items-center gap-2">
                            {userProfile?.emailVerified ? (
                                <BadgeCheck className="h-4 w-4 text-primary shrink-0" />
                            ) : (
                                <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="h-7 px-3 text-[9px] font-black uppercase tracking-tight text-red-500 border-red-200 hover:bg-red-500/10 hover:text-red-600 rounded-full animate-pulse"
                                    onClick={handleVerifySelf}
                                    disabled={isVerifying}
                                >
                                    {isVerifying ? <Loader2 className="h-2.5 w-2.5 animate-spin mr-1" /> : <ShieldCheck className="h-2.5 w-2.5 mr-1" />}
                                    Forensic Audit
                                </Button>
                            )}
                        </div>
                    </div>
                    {userProfile?.userType && (
                        <div className="flex items-center gap-1.5 px-3 py-0.5 bg-primary/5 rounded-full border border-primary/10 w-fit mx-auto sm:mx-0">
                            <span className="text-[10px] font-bold text-primary capitalize">{userProfile.userType}</span>
                        </div>
                    )}
                    <p className="text-xs sm:text-sm text-muted-foreground font-medium truncate opacity-80">{email}</p>
                </div>
                </CardContent>
            </Card>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2 space-y-6">
                <motion.div variants={itemVariants}>
                    <Card className="shadow-lg border-primary/5 rounded-2xl overflow-hidden bg-card">
                        <CardHeader className="pb-4 bg-muted/30">
                            <CardTitle className="font-headline font-black text-lg flex items-center gap-2 tracking-tight text-left">
                                <User className="h-4 w-4 text-primary" /> Personal details
                            </CardTitle>
                            <CardDescription className="text-xs font-medium text-left">Your account information.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-6 text-left">
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                <Label htmlFor="firstName" className="text-[11px] font-bold text-muted-foreground">First name</Label>
                                <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="bg-background h-11 text-sm font-semibold" />
                                </div>
                                <div className="space-y-2">
                                <Label htmlFor="lastName" className="text-[11px] font-bold text-muted-foreground">Last name</Label>
                                <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} className="bg-background h-11 text-sm font-semibold" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone" className="text-[11px] font-bold text-muted-foreground">Mobile number</Label>
                                <Input id="phone" type="tel" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} className="bg-background h-11 text-sm font-semibold" />
                            </div>
                            <div className="flex justify-end pt-2">
                                <Button 
                                    onClick={handleSaveChanges} 
                                    disabled={saving || !hasChanges} 
                                    size="sm" 
                                    className="w-full sm:w-auto shadow-lg shadow-primary/10 h-11 px-10 font-bold active:scale-95 transition-all"
                                >
                                    {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                    Update details
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {!userProfile?.emailVerified && (
                    <motion.div variants={itemVariants}>
                        <Card className="border-amber-500/20 bg-amber-500/5 rounded-2xl overflow-hidden">
                            <CardHeader className="pb-2 text-left">
                                <CardTitle className="text-amber-600 font-headline font-black text-lg flex items-center gap-2">
                                    <MailCheck className="h-5 w-5" /> Identity Link Verification
                                </CardTitle>
                                <CardDescription className="text-amber-600/80 font-medium text-xs">
                                    Please verify your email to unlock the trusted identity badge.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-2 pb-6 text-left">
                                <Button 
                                    onClick={handleSendVerification}
                                    disabled={isResending}
                                    variant="outline" 
                                    className="border-amber-500/20 text-amber-600 hover:bg-amber-500/10 font-bold h-11 px-6 rounded-xl"
                                >
                                    {isResending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                    Resend Verification Link
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </div>

            <div className="space-y-6">
                <motion.div variants={itemVariants}>
                    <Card className="shadow-lg border-primary/5 rounded-2xl text-left bg-card">
                        <CardHeader className="pb-4">
                            <CardTitle className="font-headline font-black text-lg tracking-tight">Preferences</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="flex items-center justify-between p-3 rounded-xl hover:bg-muted transition-colors border border-transparent hover:border-primary/10 cursor-pointer" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                                <div className="flex items-center gap-3">
                                    <div className="bg-muted p-2 rounded-lg"><Moon className="h-4 w-4 text-muted-foreground" /></div>
                                    <span className="font-bold text-[12px]">Dark mode</span>
                                </div>
                                <Switch
                                    checked={theme === 'dark'}
                                    onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                                />
                            </div>
                            <Button variant="outline" size="sm" className="w-full justify-start font-bold border-primary/5 h-11 px-4 hover:bg-primary/5 hover:text-primary transition-all rounded-xl active:scale-95">
                                <KeyRound className="mr-3 h-4 w-4 text-muted-foreground" />
                                <span>Security & privacy</span>
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <Card className="border-destructive/10 bg-destructive/5 shadow-lg rounded-2xl text-left">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-destructive font-headline font-black text-lg tracking-tight">Account Control</CardTitle>
                            <CardDescription className="text-[10px] font-bold text-destructive/60 uppercase tracking-widest">Permanent Actions</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Button variant="outline" size="sm" className="w-full justify-start hover:bg-destructive/10 text-foreground border-destructive/5 h-11 px-4 font-bold rounded-xl active:scale-95 transition-all" onClick={handleLogout}>
                                <LogOut className="mr-3 h-4 w-4 text-muted-foreground" /> 
                                <span>Logout Session</span>
                            </Button>
                            
                            {isSuperAdmin ? (
                                <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 mt-2">
                                    <div className="flex items-start gap-3">
                                        <ShieldAlert className="h-5 w-5 text-destructive shrink-0" />
                                        <p className="text-[10px] font-black uppercase text-destructive tracking-widest leading-relaxed">
                                            Root Account Locked: System management nodes are immutable.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" size="sm" className="w-full justify-start font-bold h-11 px-4 rounded-xl active:scale-95 transition-all">
                                        <Trash2 className="mr-3 h-4 w-4" />
                                        <span>Delete My Account</span>
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="max-w-[90vw] sm:max-w-lg bg-card">
                                    <AlertDialogHeader>
                                    <AlertDialogTitle className="font-black tracking-tight text-destructive">Confirm Permanent Deletion</AlertDialogTitle>
                                    <AlertDialogDescription className="font-medium text-xs sm:text-sm text-muted-foreground">
                                        This action is irreversible. Your account and all associated legal records will be permanently erased from Nyaya Sahayak.
                                    </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                                    <AlertDialogCancel className="font-bold h-11 px-6 w-full sm:w-auto">Keep My Account</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDeleteAccount} disabled={saving} className="bg-destructive text-destructive-foreground hover:bg-destructive/90 font-bold h-11 px-6 w-full sm:w-auto">
                                        {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin mr-2" /> : <Trash2 className="mr-2 h-4 w-4" />}
                                        Yes, Purge Everything
                                    </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                                </AlertDialog>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>

      <Dialog open={isCameraOpen} onOpenChange={(open) => !open && stopCamera()}>
          <DialogContent className="sm:max-w-md p-0 overflow-hidden sm:rounded-2xl border-none shadow-2xl h-[100dvh] sm:h-auto bg-black">
              <DialogHeader className="sr-only">
                  <DialogTitle>Capture profile photo</DialogTitle>
                  <DialogDescription>Use your camera to take a profile picture.</DialogDescription>
              </DialogHeader>
              <div className="relative h-full sm:aspect-square group">
                  <video 
                    ref={videoRef} 
                    className="h-full w-full object-cover transition-opacity" 
                    autoPlay 
                    muted 
                    playsInline
                  />
                  {!hasCameraPermission && (
                    <div className="absolute inset-0 flex items-center justify-center p-8 text-center bg-zinc-900">
                        <div className="space-y-4">
                            <div className="bg-white/10 p-4 rounded-full w-fit mx-auto"><Camera className="h-12 w-12 text-white/50" /></div>
                            <p className="text-sm font-black text-white tracking-tight">Camera access required</p>
                            <p className="text-xs text-white/60 max-w-[200px] mx-auto font-medium">Please allow camera permissions.</p>
                        </div>
                    </div>
                  )}
                  <div className="absolute inset-0 pointer-events-none border-[30px] sm:border-[50px] border-black/40 group-hover:border-black/20 transition-all duration-700">
                      <div className="h-full w-full border-2 border-white/20 rounded-full shadow-[0_0_0_9999px_rgba(0,0,0,0.4)]"></div>
                  </div>
                  <canvas ref={canvasRef} className="hidden" />
                  
                  <div className="absolute top-4 right-4 sm:hidden">
                      <Button variant="ghost" size="icon" className="text-white bg-black/20 rounded-full h-10 w-10" onClick={stopCamera}>
                          <X className="h-6 w-6" />
                      </Button>
                  </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent sm:relative sm:bg-background sm:from-transparent">
                  <div className="flex gap-3 max-w-sm mx-auto sm:max-w-none">
                      <Button variant="secondary" onClick={stopCamera} className="flex-1 font-bold h-12 hidden sm:flex active:scale-95 transition-all">Cancel</Button>
                      <Button onClick={capturePhoto} className="flex-1 h-12 font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all bg-primary text-white" disabled={!hasCameraPermission}>
                          <Camera className="mr-2 h-5 w-5" /> Capture
                      </Button>
                  </div>
              </div>
          </DialogContent>
      </Dialog>
    </motion.div>
  );
}
