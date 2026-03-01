"use client";

import { useState, useEffect, useRef } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, Trash2, KeyRound, ShieldCheck, Moon, Edit, Loader2, Gavel, MapPin, BadgeCheck, Briefcase, Camera, X, User, Sparkles, UserMinus } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth, useFirestore } from '@/firebase';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { signOut, deleteUser } from 'firebase/auth';
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
import { AdvocateProfileForm } from '@/components/advocate-profile-form';
import { getAdvocates, type Lawyer, deleteAdvocate } from '@/lib/advocates-data';
import { motion, AnimatePresence } from 'framer-motion';

type UserProfile = {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  userType: string;
  photoURL?: string;
}

export default function ProfilePage() {
  const { theme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [advocateDetails, setAdvocateDetails] = useState<Lawyer | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAdvocateDialog, setShowAdvocateDialog] = useState(false);
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

          // Fetch professional details if user is a lawyer
          if (data.userType === 'lawyer') {
              const allAdvocates = getAdvocates();
              const found = allAdvocates.find(a => a.contact?.email === data.email);
              if (found) setAdvocateDetails(found);
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

  const updateUserPhoto = (newPhotoURL: string) => {
      if (!auth.currentUser || !userProfile) return;
      const userDocRef = doc(firestore, "users", auth.currentUser.uid);
      setDoc(userDocRef, { photoURL: newPhotoURL }, { merge: true })
        .then(() => {
            toast({ title: "Photo Updated", description: "Your profile picture has been saved." });
            setUserProfile(prev => prev ? { ...prev, photoURL: newPhotoURL } : null);
        })
        .catch(err => console.error("Failed to sync photo:", err));
  };

  const startCamera = async () => {
    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setHasCameraPermission(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setHasCameraPermission(false);
      toast({
        variant: 'destructive',
        title: 'Camera Access Denied',
        description: 'Please enable camera permissions in your browser settings to use this feature.',
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

  const handleAdvocateProfileSaved = () => {
    setShowAdvocateDialog(false);
    const allAdvocates = getAdvocates();
    const found = allAdvocates.find(a => a.contact?.email === email);
    if (found) setAdvocateDetails(found);
    
    handleSaveChanges(true);
    toast({
        title: "Advocate Profile Updated",
        description: "Your professional details have been synchronized.",
    });
  };

  const handleRemoveAdvocateListing = () => {
    if (email) {
        deleteAdvocate(email);
        setAdvocateDetails(null);
        toast({
            title: "Listing Removed",
            description: "Your professional profile has been removed from the directory.",
        });
    }
  };

  const handleSaveChanges = (fromAdvocateFlow = false) => {
    if (!auth.currentUser || !userProfile) return;

    setSaving(true);
    
    const userDocRef = doc(firestore, "users", auth.currentUser.uid);
    
    const updatedProfile: UserProfile = {
        ...userProfile,
        firstName,
        lastName,
        email,
        mobileNumber,
        photoURL,
    };

    setDoc(userDocRef, updatedProfile, { merge: true })
      .then(() => {
        setUserProfile(updatedProfile);
        if (!fromAdvocateFlow) {
            toast({ title: 'Profile Updated', description: 'Your changes have been saved.' });
        }
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
    
    setSaving(true);
    const user = auth.currentUser;
    const userDocRef = doc(firestore, "users", user.uid);

    try {
      // 1. Delete Directory Listing if any
      if (email) deleteAdvocate(email);
      
      // 2. Delete Firestore Data
      await deleteDoc(userDocRef);
      
      // 3. Delete Auth User
      await deleteUser(user);
      
      toast({
        title: "Account Deleted",
        description: "Your account and all associated data have been permanently removed.",
      });
      router.replace('/');
    } catch (error: any) {
      console.error("Deletion error:", error);
      if (error.code === 'auth/requires-recent-login') {
        toast({
          variant: "destructive",
          title: "Security Action Required",
          description: "For security reasons, please log out and sign back in before deleting your account.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete account. Please try again later.",
        });
      }
    } finally {
      // Since deleteUser might redirect, only set saving to false if we stay on page
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

  if (loading || !isMounted) {
      return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <PageHeader
                title="My Profile"
                description="Manage your account settings."
            />
             <Card className="border-primary/5">
                <CardContent className="p-6 flex flex-col sm:flex-row items-center gap-6">
                    <Skeleton className="h-20 w-20 rounded-full" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-4 w-64" />
                    </div>
                </CardContent>
            </Card>
            <div className="grid lg:grid-cols-3 gap-6 items-start">
                <div className="lg:col-span-2 space-y-6">
                    <Card><CardHeader><Skeleton className="h-6 w-32" /></CardHeader><CardContent className="space-y-4"><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /></CardContent></Card>
                </div>
                 <div className="space-y-6">
                    <Card><CardContent className="p-6 space-y-4"><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /></CardContent></Card>
                 </div>
            </div>
        </div>
      )
  }

  return (
    <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6 sm:space-y-8 max-w-5xl mx-auto"
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
                        <div className="absolute -bottom-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <Button size="icon" variant="secondary" className="rounded-full h-9 w-9 shadow-xl border border-primary/10 hover:bg-primary hover:text-white" onClick={startCamera}>
                                <Camera className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="shrink-0">
                        <Button variant="outline" className="h-20 w-20 rounded-full border-2 border-dashed border-primary/20 flex flex-col gap-1 items-center justify-center text-muted-foreground hover:bg-primary/5 hover:border-primary/40 transition-all duration-300 shadow-inner group" onClick={startCamera}>
                            <Camera className="h-6 w-6 group-hover:scale-110 transition-transform" />
                            <span className="text-[10px] font-bold opacity-60">Set Photo</span>
                        </Button>
                    </div>
                )}
                <div className="flex-1 text-center sm:text-left space-y-1 min-w-0">
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                        <h2 className="text-xl sm:text-2xl font-black font-headline tracking-tighter text-foreground truncate">{firstName} {lastName}</h2>
                        <BadgeCheck className="h-4 w-4 text-primary shrink-0" />
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-0.5 bg-primary/5 rounded-full border border-primary/10 w-fit mx-auto sm:mx-0">
                        <span className="text-[10px] font-bold text-primary">{userProfile?.userType}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground font-medium truncate opacity-80">{email}</p>
                </div>
                {photoURL && (
                    <Button variant="ghost" size="sm" className="hidden sm:flex h-11 font-bold opacity-50 hover:opacity-100 active:scale-95" onClick={startCamera}>
                        <Camera className="mr-2 h-4 w-4" /> Change Photo
                    </Button>
                )}
                </CardContent>
            </Card>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2 space-y-6">
                <motion.div variants={itemVariants}>
                    <Card className="shadow-lg border-primary/5 rounded-2xl overflow-hidden">
                        <CardHeader className="pb-4 bg-muted/30">
                            <CardTitle className="font-headline font-black text-lg flex items-center gap-2 tracking-tight">
                                <User className="h-4 w-4 text-primary" /> Personal Details
                            </CardTitle>
                            <CardDescription className="text-xs font-medium">Your verified account information.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-6">
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                <Label htmlFor="firstName" className="text-[11px] font-bold text-muted-foreground">First Name</Label>
                                <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="bg-background/50 h-11 text-sm font-semibold" />
                                </div>
                                <div className="space-y-2">
                                <Label htmlFor="lastName" className="text-[11px] font-bold text-muted-foreground">Last Name</Label>
                                <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} className="bg-background/50 h-11 text-sm font-semibold" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone" className="text-[11px] font-bold text-muted-foreground">Mobile Number</Label>
                                <Input id="phone" type="tel" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} className="bg-background/50 h-11 text-sm font-semibold" />
                            </div>
                            <div className="flex justify-end pt-2">
                                <Button 
                                    onClick={() => handleSaveChanges()} 
                                    disabled={saving || !hasChanges} 
                                    size="sm" 
                                    className="w-full sm:w-auto shadow-lg shadow-primary/10 h-11 px-10 font-bold active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
                                >
                                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Update Details
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
                
                {userProfile?.userType === 'lawyer' && (
                    <motion.div variants={itemVariants}>
                        <Card className="border-primary/10 bg-primary/5 shadow-inner overflow-hidden rounded-2xl">
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center gap-2 font-headline font-black text-lg tracking-tight">
                                    <Gavel className="h-4 w-4 text-primary" />
                                    Advocate Credentials
                                </CardTitle>
                                <CardDescription className="text-xs font-medium">Professional listing details.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {advocateDetails ? (
                                    <div className="grid sm:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div className="flex items-start gap-3">
                                                <div className="bg-primary/10 p-2 rounded-lg"><Briefcase className="h-3.5 w-3.5 text-primary" /></div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-muted-foreground">Experience</p>
                                                    <p className="font-bold text-xs text-foreground leading-tight">{advocateDetails.experience}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <div className="bg-primary/10 p-2 rounded-lg"><Gavel className="h-3.5 w-3.5 text-primary" /></div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-muted-foreground">Specialization</p>
                                                    <p className="font-bold text-xs text-foreground">{advocateDetails.specialty}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex items-start gap-3">
                                                <div className="bg-primary/10 p-2 rounded-lg"><MapPin className="h-3.5 w-3.5 text-primary" /></div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-muted-foreground">Location</p>
                                                    <p className="font-bold text-xs text-foreground leading-tight">{advocateDetails.courtName}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <div className="bg-primary/10 p-2 rounded-lg"><BadgeCheck className="h-3.5 w-3.5 text-primary" /></div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-muted-foreground">Bar Status</p>
                                                    <p className="font-bold text-xs text-foreground">Verified Member</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center py-4 text-center">
                                        <Sparkles className="h-8 w-8 text-primary/20 mb-2" />
                                        <p className="text-xs text-muted-foreground font-bold max-w-[200px]">Complete your professional profile to be listed in the directory.</p>
                                    </div>
                                )}
                                
                                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                                    <Button onClick={() => setShowAdvocateDialog(true)} variant={advocateDetails ? "outline" : "default"} size="sm" className="flex-1 font-bold h-11 px-8 shadow-md border-primary/20 active:scale-95 transition-all">
                                        <Edit className="mr-2 h-4 w-4" />
                                        {advocateDetails ? "Edit Profile" : "Complete Setup"}
                                    </Button>
                                    
                                    {advocateDetails && (
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" size="sm" className="flex-1 text-destructive hover:bg-destructive/10 font-bold h-11 active:scale-95 transition-all">
                                                    <UserMinus className="mr-2 h-4 w-4" />
                                                    Remove Listing
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle className="font-black tracking-tight">Unlist from Directory?</AlertDialogTitle>
                                                    <AlertDialogDescription className="font-medium">
                                                        This will remove your professional profile from the lawyer directory. 
                                                        Your main account and access to legal tools will not be affected.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel className="font-bold h-11 px-6">Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={handleRemoveAdvocateListing} className="bg-destructive text-destructive-foreground hover:bg-destructive/90 font-bold h-11 px-6">
                                                        Confirm Removal
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </div>

            <div className="space-y-6">
                <motion.div variants={itemVariants}>
                    <Card className="shadow-lg border-primary/5 rounded-2xl">
                        <CardHeader className="pb-4">
                            <CardTitle className="font-headline font-black text-lg tracking-tight">Preferences</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors border border-transparent hover:border-primary/10 cursor-pointer" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                                <div className="flex items-center gap-3">
                                    <div className="bg-muted p-2 rounded-lg"><Moon className="h-4 w-4 text-muted-foreground" /></div>
                                    <span className="font-bold text-[12px]">Dark Mode</span>
                                </div>
                                <Switch
                                    checked={theme === 'dark'}
                                    onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                                />
                            </div>
                            <Button variant="outline" size="sm" className="w-full justify-start font-bold border-primary/5 h-11 px-4 hover:bg-primary/5 hover:text-primary transition-all rounded-xl active:scale-95">
                                <KeyRound className="mr-3 h-4 w-4 text-muted-foreground" />
                                <span>Security & Privacy</span>
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <Card className="border-destructive/10 bg-destructive/5 shadow-lg rounded-2xl">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-destructive font-headline font-black text-lg tracking-tight">Account</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Button variant="outline" size="sm" className="w-full justify-start hover:bg-destructive/10 text-foreground border-destructive/5 h-11 px-4 font-bold rounded-xl active:scale-95 transition-all" onClick={handleLogout}>
                                <LogOut className="mr-3 h-4 w-4 text-muted-foreground" /> 
                                <span>Logout</span>
                            </Button>
                            
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm" className="w-full justify-start font-bold h-11 px-4 rounded-xl active:scale-95 transition-all">
                                    <Trash2 className="mr-3 h-4 w-4" />
                                    <span>Delete Account</span>
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="font-black tracking-tight text-destructive">Are you absolutely sure?</AlertDialogTitle>
                                  <AlertDialogDescription className="font-medium">
                                    This action cannot be undone. This will permanently delete your account
                                    and remove your data from our servers. You will not be able to log in again.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="font-bold h-11 px-6">Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive text-destructive-foreground hover:bg-destructive/90 font-bold h-11 px-6">
                                    {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                    Delete Permanently
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>

        <Dialog open={showAdvocateDialog} onOpenChange={(open) => {
            setShowAdvocateDialog(open);
            if (!open && userProfile?.userType === 'lawyer' && !advocateDetails) {
                toast({ title: "Profile Required", description: "You must complete your advocate details to use this role." });
            }
        }}>
            <DialogContent className="sm:max-w-2xl p-0 overflow-hidden sm:rounded-2xl" onPointerDownOutside={(e) => {
                if (userProfile?.userType === 'lawyer' && !advocateDetails) e.preventDefault();
            }}>
                <div className="p-6 sm:p-8">
                    <DialogHeader className="mb-6">
                        <DialogTitle className="text-xl sm:text-2xl font-black tracking-tight">Professional Credentials</DialogTitle>
                        <DialogDescription className="text-xs sm:text-sm font-medium">Your details are verified against Bar Council records.</DialogDescription>
                    </DialogHeader>
                    <AdvocateProfileForm 
                        onSave={handleAdvocateProfileSaved}
                        userProfile={{
                            firstName,
                            lastName,
                            email,
                            photoURL
                        }}
                        initialData={advocateDetails}
                    />
                </div>
            </DialogContent>
      </Dialog>

      <Dialog open={isCameraOpen} onOpenChange={(open) => !open && stopCamera()}>
          <DialogContent className="sm:max-w-md p-0 overflow-hidden sm:rounded-2xl border-none shadow-2xl h-[100dvh] sm:h-auto bg-black">
              <DialogHeader className="sr-only">
                  <DialogTitle>Capture Profile Photo</DialogTitle>
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
                            <p className="text-sm font-black text-white tracking-tight">Camera Access Required</p>
                            <p className="text-xs text-white/60 max-w-[200px] mx-auto font-medium">Please allow camera permissions in your browser settings.</p>
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
                          <Camera className="mr-2 h-5 w-5" /> Capture Photo
                      </Button>
                  </div>
              </div>
          </DialogContent>
      </Dialog>
    </motion.div>
  );
}
