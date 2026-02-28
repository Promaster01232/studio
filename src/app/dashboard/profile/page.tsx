"use client";

import { useState, useEffect, useRef } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, Trash2, KeyRound, ShieldCheck, Moon, Edit, Loader2, Gavel, MapPin, BadgeCheck, Briefcase, Camera, X, User } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth, useFirestore } from '@/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { signOut } from 'firebase/auth';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AdvocateProfileForm } from '@/components/advocate-profile-form';
import { getAdvocates, type Lawyer } from '@/lib/advocates-data';

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

  if (loading || !isMounted) {
      return (
        <div className="space-y-8">
            <PageHeader
                title="My Profile"
                description="Manage your account settings."
            />
             <Card>
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
    <>
        <div className="space-y-6 sm:space-y-8 max-w-5xl mx-auto">
        <PageHeader
            title="My Profile"
            description="Manage your account settings and personal information."
        />

        <Card className="border-primary/10 overflow-hidden bg-card/50 backdrop-blur-sm">
            <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
            {photoURL ? (
                <div className="relative group shrink-0">
                    <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-white dark:border-zinc-900 shadow-2xl transition-transform active:scale-95">
                        <AvatarImage src={photoURL} alt={`${firstName} ${lastName}`} className="object-cover" />
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1">
                        <Button size="icon" variant="secondary" className="rounded-full h-8 w-8 sm:h-10 sm:w-10 shadow-xl border border-primary/10 hover:bg-primary hover:text-white transition-all" onClick={startCamera}>
                            <Camera className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="shrink-0">
                    <Button variant="outline" className="h-20 w-20 sm:h-24 sm:w-24 rounded-full border-2 border-dashed border-primary/20 flex flex-col gap-1 items-center justify-center text-muted-foreground hover:bg-primary/5 transition-all" onClick={startCamera}>
                        <Camera className="h-6 w-6 sm:h-8 sm:w-8" />
                        <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest">Add Photo</span>
                    </Button>
                </div>
            )}
            <div className="flex-1 text-center sm:text-left space-y-1">
                <h2 className="text-2xl sm:text-4xl font-black font-headline tracking-tighter text-foreground truncate">{firstName} {lastName}</h2>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 rounded-full border border-primary/20 w-fit mx-auto sm:mx-0">
                    <span className="text-[9px] font-black uppercase tracking-widest text-primary">{userProfile?.userType}</span>
                </div>
                <p className="text-xs sm:text-base text-muted-foreground font-medium truncate">{email}</p>
            </div>
            </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8 items-start">
            <div className="lg:col-span-2 space-y-6 sm:space-y-8">
                <Card className="shadow-lg border-primary/5">
                <CardHeader className="pb-4">
                    <CardTitle className="font-headline font-bold text-lg sm:text-xl">Personal Details</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">Update your information here.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">First Name</Label>
                        <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="bg-background h-11" />
                        </div>
                        <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Last Name</Label>
                        <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} className="bg-background h-11" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Phone Number</Label>
                        <Input id="phone" type="tel" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} className="bg-background h-11" />
                    </div>
                    <div className="flex justify-end pt-4">
                        <Button onClick={() => handleSaveChanges()} disabled={saving} className="w-full sm:w-auto shadow-xl shadow-primary/20 h-11 sm:h-12 px-10 font-bold active:scale-95 transition-all">
                            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                            Save Changes
                        </Button>
                    </div>
                </CardContent>
                </Card>
                
                {userProfile?.userType === 'lawyer' && (
                    <Card className="border-primary/20 bg-primary/5 shadow-inner overflow-hidden">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-2 font-headline font-bold text-lg sm:text-xl">
                                <Gavel className="h-5 w-5 text-primary" />
                                Advocate Credentials
                            </CardTitle>
                            <CardDescription className="text-xs">Professional information listed in the directory.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {advocateDetails ? (
                                <div className="grid sm:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <div className="bg-primary/10 p-2 rounded-lg"><BadgeCheck className="h-4 w-4 text-primary" /></div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Bar ID</p>
                                                <p className="font-mono font-bold text-sm text-foreground">{advocateDetails.barId}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="bg-primary/10 p-2 rounded-lg"><Briefcase className="h-4 w-4 text-primary" /></div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Experience</p>
                                                <p className="font-bold text-sm text-foreground">{advocateDetails.experience}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <div className="bg-primary/10 p-2 rounded-lg"><MapPin className="h-4 w-4 text-primary" /></div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Court Location</p>
                                                <p className="font-bold text-sm text-foreground leading-tight">{advocateDetails.courtName}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="bg-primary/10 p-2 rounded-lg"><Gavel className="h-4 w-4 text-primary" /></div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Specialization</p>
                                                <p className="font-bold text-sm text-foreground">{advocateDetails.specialty}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground italic">You haven't completed your professional profile yet.</p>
                            )}
                            
                            <div className="pt-2">
                                <Button onClick={() => setShowAdvocateDialog(true)} variant={advocateDetails ? "outline" : "default"} className="w-full sm:w-auto font-bold border-primary/20 h-11 px-6 shadow-lg shadow-primary/5 active:scale-95 transition-all">
                                    <Edit className="mr-2 h-4 w-4" />
                                    {advocateDetails ? "Edit Professional Profile" : "Complete Advocate Setup"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            <div className="space-y-6 sm:space-y-8">
                <Card className="shadow-lg border-primary/5">
                <CardHeader className="pb-4">
                    <CardTitle className="font-headline font-bold text-lg">Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors border border-transparent hover:border-primary/10">
                        <Label htmlFor="dark-mode" className="flex items-center gap-3 cursor-pointer flex-1 py-1">
                            <div className="bg-muted p-2 rounded-lg"><Moon className="h-4 w-4 text-muted-foreground" /></div>
                            <span className="font-medium text-sm">Dark Mode</span>
                        </Label>
                        <Switch
                            id="dark-mode"
                            checked={theme === 'dark'}
                            onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                        />
                    </div>
                    <Button variant="outline" className="w-full justify-start font-bold border-primary/10 h-11 px-4 hover:bg-primary/5 hover:text-primary transition-all active:scale-[0.98]">
                        <KeyRound className="mr-3 h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Security & Privacy</span>
                    </Button>
                </CardContent>
                </Card>

                <Card className="border-destructive/20 bg-destructive/5 shadow-lg">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-destructive font-headline font-bold text-lg">Account</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Button variant="outline" className="w-full justify-start hover:bg-destructive/10 text-foreground border-destructive/10 h-11 px-4 font-bold active:scale-[0.98]" onClick={handleLogout}>
                            <LogOut className="mr-3 h-4 w-4 text-muted-foreground" /> 
                            <span className="text-sm">Logout</span>
                        </Button>
                        <Button variant="destructive" className="w-full justify-start font-black h-11 px-4 tracking-tight uppercase text-[10px] active:scale-[0.98]">
                            <Trash2 className="mr-3 h-4 w-4" />
                            <span>Delete My Account</span>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
        </div>

        <Dialog open={showAdvocateDialog} onOpenChange={(open) => {
            if (!open && userProfile?.userType === 'lawyer' && !advocateDetails) {
                toast({ title: "Profile Required", description: "You must complete your advocate details to use this role." });
                return;
            }
            setShowAdvocateDialog(open);
        }}>
            <DialogContent className="sm:max-w-2xl p-0 overflow-hidden sm:rounded-2xl" onPointerDownOutside={(e) => {
                if (userProfile?.userType === 'lawyer' && !advocateDetails) e.preventDefault();
            }}>
                <div className="p-6 sm:p-8">
                    <DialogHeader className="mb-6">
                        <DialogTitle className="text-xl sm:text-2xl">Professional Credentials</DialogTitle>
                        <DialogDescription className="text-xs sm:text-sm">Your details are verified against Bar Council records.</DialogDescription>
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
          <DialogContent className="sm:max-w-md p-0 overflow-hidden sm:rounded-2xl border-none shadow-2xl h-[100dvh] sm:h-auto">
              <div className="relative h-full sm:aspect-square bg-black group">
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
                            <p className="text-sm font-bold text-white tracking-tight">Camera Access Required</p>
                            <p className="text-xs text-white/60 max-w-[200px] mx-auto">Please allow camera permissions in your browser settings.</p>
                        </div>
                    </div>
                  )}
                  <div className="absolute inset-0 pointer-events-none border-[20px] sm:border-[40px] border-black/20 group-hover:border-black/10 transition-all duration-500">
                      <div className="h-full w-full border-2 border-white/30 rounded-full"></div>
                  </div>
                  <canvas ref={canvasRef} className="hidden" />
                  
                  <div className="absolute top-4 right-4 sm:hidden">
                      <Button variant="ghost" size="icon" className="text-white bg-black/20 rounded-full h-10 w-10" onClick={stopCamera}>
                          <X className="h-6 w-6" />
                      </Button>
                  </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent sm:relative sm:bg-background sm:from-transparent">
                  <div className="flex gap-3 max-w-sm mx-auto sm:max-w-none">
                      <Button variant="secondary" onClick={stopCamera} className="flex-1 font-bold text-xs sm:text-sm h-11 sm:h-12 hidden sm:flex">Cancel</Button>
                      <Button onClick={capturePhoto} className="flex-1 h-12 sm:h-12 text-xs sm:text-lg font-black shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all" disabled={!hasCameraPermission}>
                          <Camera className="mr-2 h-5 w-5" /> CAPTURE PHOTO
                      </Button>
                  </div>
              </div>
          </DialogContent>
      </Dialog>
    </>
  );
}
