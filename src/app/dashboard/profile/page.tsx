
"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, Trash2, KeyRound, ShieldCheck, Moon, Edit, Loader2, Gavel, MapPin, BadgeCheck, Briefcase, Camera, Upload, X, RefreshCw } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTheme } from '@/components/theme-provider';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth, useFirestore } from '@/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { signOut } from 'firebase/auth';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AdvocateProfileForm } from '@/components/advocate-profile-form';
import { getAdvocates, type Lawyer } from '@/lib/advocates-data';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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
  const [userType, setUserType] = useState('citizen');
  const [photoURL, setPhotoURL] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
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
          setUserType(data.userType);
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

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPhotoURL(result);
        // Automatically save if photo URL changes
        if (userProfile) {
            updateUserPhoto(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const updateUserPhoto = (newPhotoURL: string) => {
      if (!auth.currentUser || !userProfile) return;
      const userDocRef = doc(firestore, "users", auth.currentUser.uid);
      setDoc(userDocRef, { photoURL: newPhotoURL }, { merge: true })
        .then(() => {
            toast({ title: "Photo Updated", description: "Your profile picture has been saved." });
        })
        .catch(err => console.error("Failed to sync photo:", err));
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
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
    // Refresh local details
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

    if (userType === 'lawyer' && !fromAdvocateFlow && userProfile.userType !== 'lawyer') {
        setShowAdvocateDialog(true);
        return;
    }

    setSaving(true);
    
    const userDocRef = doc(firestore, "users", auth.currentUser.uid);
    
    const updatedProfile: UserProfile = {
        ...userProfile,
        firstName,
        lastName,
        email,
        mobileNumber,
        userType,
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
                description="Manage your account settings and personal information."
            />
             <Card>
                <CardContent className="p-6 flex flex-col sm:flex-row items-center gap-6">
                    <Skeleton className="h-24 w-24 rounded-full" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-4 w-64" />
                    </div>
                    <Skeleton className="h-10 w-24" />
                </CardContent>
            </Card>
            <div className="grid lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Personal Details</CardTitle>
                            <CardDescription>Update your personal information here.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <div className="flex justify-end">
                                <Skeleton className="h-10 w-24" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
                 <div className="space-y-8">
                    <Card><CardHeader><CardTitle>Account Settings</CardTitle></CardHeader><CardContent className="space-y-6"><Skeleton className="h-6 w-full" /><Skeleton className="h-6 w-full" /><Skeleton className="h-10 w-full" /></CardContent></Card>
                    <Card className="border-destructive bg-destructive/5"><CardHeader><CardTitle className="text-destructive">Danger Zone</CardTitle></CardHeader><CardContent className="space-y-4"><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /></CardContent></Card>
                 </div>
            </div>
        </div>
      )
  }

  return (
    <>
        <div className="space-y-8">
        <PageHeader
            title="My Profile"
            description="Manage your account settings and personal information."
        />

        <Card className="border-primary/10 overflow-hidden">
            <CardContent className="p-6 flex flex-col sm:flex-row items-center gap-6">
            <div className="relative group">
                <Avatar className="h-28 w-28 border-4 border-white dark:border-zinc-900 shadow-xl transition-transform group-hover:scale-[1.02]">
                <AvatarImage src={photoURL} alt={`${firstName} ${lastName}`} className="object-cover" />
                <AvatarFallback className="bg-primary/5 text-primary text-2xl font-bold">{`${firstName.charAt(0)}${lastName.charAt(0)}`}</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 flex gap-1">
                    <Button size="icon" variant="secondary" className="rounded-full h-10 w-10 shadow-lg border border-primary/10 hover:bg-primary hover:text-white transition-colors" onClick={handleAvatarClick} title="Upload Photo">
                        <Upload className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="secondary" className="rounded-full h-10 w-10 shadow-lg border border-primary/10 hover:bg-primary hover:text-white transition-colors" onClick={startCamera} title="Take Photo">
                        <Camera className="h-4 w-4" />
                    </Button>
                </div>
                <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} accept="image/*" />
            </div>
            <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <h2 className="text-3xl font-black font-headline tracking-tight">{firstName} {lastName}</h2>
                    {userType === 'lawyer' && <BadgeCheck className="h-6 w-6 text-primary hidden sm:block" />}
                </div>
                <p className="text-muted-foreground font-medium">{email}</p>
                <div className="mt-2 flex flex-wrap justify-center sm:justify-start gap-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black tracking-widest uppercase bg-primary/10 text-primary">
                        {userType}
                    </span>
                </div>
            </div>
            </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-8">
                {/* Personal Details Card */}
                <Card>
                <CardHeader>
                    <CardTitle>Personal Details</CardTitle>
                    <CardDescription>Update your personal information here.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                        </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" type="tel" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="userType">I am a</Label>
                        <Select name="userType" value={userType} onValueChange={(val) => {
                            setUserType(val);
                            if (val === 'lawyer' && userProfile?.userType !== 'lawyer') {
                                setShowAdvocateDialog(true);
                            }
                        }}>
                            <SelectTrigger id="userType">
                            <SelectValue placeholder="Select your role" />
                            </SelectTrigger>
                            <SelectContent>
                            <SelectItem value="citizen">Citizen</SelectItem>
                            <SelectItem value="lawyer">Advocate</SelectItem>
                            <SelectItem value="businessman">Business Person</SelectItem>
                            <SelectItem value="student">Law Student</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    </div>
                    <div className="flex justify-end pt-4">
                        <Button onClick={() => handleSaveChanges()} disabled={saving} className="shadow-lg shadow-primary/20 h-11 px-8 font-bold">
                            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                            {userType === 'lawyer' && userProfile?.userType !== 'lawyer' ? "Setup Advocate Profile" : "Save Changes"}
                        </Button>
                    </div>
                </CardContent>
                </Card>
                
                {userType === 'lawyer' && (
                    <Card className="border-primary/20 bg-primary/5">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Gavel className="h-5 w-5 text-primary" />
                                Advocate Status & Credentials
                            </CardTitle>
                            <CardDescription>Professional information listed in the Lawyer Connect directory.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {advocateDetails ? (
                                <div className="grid sm:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <BadgeCheck className="h-5 w-5 text-primary mt-0.5" />
                                            <div>
                                                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Bar Council ID</p>
                                                <p className="font-mono font-bold text-sm">{advocateDetails.barId}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <Briefcase className="h-5 w-5 text-primary mt-0.5" />
                                            <div>
                                                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Experience</p>
                                                <p className="font-semibold text-sm">{advocateDetails.experience}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <MapPin className="h-5 w-5 text-primary mt-0.5" />
                                            <div>
                                                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Primary Court</p>
                                                <p className="font-semibold text-sm">{advocateDetails.courtName}</p>
                                                <p className="text-xs text-muted-foreground">{advocateDetails.courtAddress}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <Gavel className="h-5 w-5 text-primary mt-0.5" />
                                            <div>
                                                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Specialization</p>
                                                <p className="font-semibold text-sm">{advocateDetails.specialty}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="sm:col-span-2 pt-4 border-t border-primary/10">
                                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Professional Bio</p>
                                        <p className="text-sm text-muted-foreground leading-relaxed italic">&ldquo;{advocateDetails.about}&rdquo;</p>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground italic">You haven't completed your professional profile yet. Clients won't be able to find you in the directory.</p>
                            )}
                            
                            <div className="pt-2">
                                <Button onClick={() => setShowAdvocateDialog(true)} variant={advocateDetails ? "outline" : "default"} className="w-full sm:w-auto font-bold border-primary/20">
                                    <Edit className="mr-2 h-4 w-4" />
                                    {advocateDetails ? "Edit Professional Details" : "Complete Advocate Setup"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            <div className="space-y-8">
                {/* Account Settings Card */}
                <Card>
                <CardHeader>
                    <CardTitle>Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                    <Label htmlFor="dark-mode" className="flex items-center gap-3 cursor-pointer">
                        <Moon className="h-5 w-5 text-muted-foreground" />
                        <span>Dark Mode</span>
                    </Label>
                    <Switch
                        id="dark-mode"
                        checked={theme === 'dark'}
                        onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                    />
                    </div>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="two-factor" className="flex items-center gap-3 cursor-pointer">
                            <ShieldCheck className="h-5 w-5 text-muted-foreground" />
                            <span>Two-Factor Auth</span>
                        </Label>
                    <Switch id="two-factor" />
                    </div>
                    <Button variant="outline" className="w-full justify-start font-medium border-primary/10">
                        <KeyRound className="mr-3 h-5 w-5 text-muted-foreground" />
                        <span>Change Password</span>
                    </Button>
                </CardContent>
                </Card>

                {/* Danger Zone */}
                <Card className="border-destructive/20 bg-destructive/5">
                    <CardHeader>
                        <CardTitle className="text-destructive">Account Management</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button variant="outline" className="w-full justify-start hover:bg-destructive/10 text-foreground border-destructive/10" onClick={handleLogout}>
                            <LogOut className="mr-3 h-5 w-5 text-muted-foreground" /> 
                            <span>Logout</span>
                        </Button>
                        <Button variant="destructive" className="w-full justify-start font-bold">
                            <Trash2 className="mr-3 h-5 w-5" />
                            <span>Delete Account</span>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
        </div>

        {/* Advocate Edit Dialog */}
        <Dialog open={showAdvocateDialog} onOpenChange={(open) => {
            if (!open && userType === 'lawyer' && userProfile?.userType !== 'lawyer' && !advocateDetails) {
                toast({ title: "Profile Required", description: "You must complete your advocate details to use this role." });
                return;
            }
            setShowAdvocateDialog(open);
        }}>
            <DialogContent className="sm:max-w-2xl" onPointerDownOutside={(e) => {
                if (userType === 'lawyer' && userProfile?.userType !== 'lawyer' && !advocateDetails) e.preventDefault();
            }}>
                <DialogHeader>
                    <DialogTitle>Update Professional Credentials</DialogTitle>
                    <DialogDescription>Your details are verified against Bar Council records to ensure trust in our directory.</DialogDescription>
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
            </DialogContent>
      </Dialog>

      {/* Camera Capture Dialog */}
      <Dialog open={isCameraOpen} onOpenChange={(open) => !open && stopCamera()}>
          <DialogContent className="sm:max-w-md">
              <DialogHeader>
                  <DialogTitle>Take Profile Picture</DialogTitle>
                  <DialogDescription>Position yourself in the center of the frame.</DialogDescription>
              </DialogHeader>
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-black">
                  <video 
                    ref={videoRef} 
                    className="h-full w-full object-cover" 
                    autoPlay 
                    muted 
                    playsInline
                  />
                  { !hasCameraPermission && (
                    <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
                        <div className="space-y-4">
                            <Camera className="h-12 w-12 text-muted-foreground mx-auto" />
                            <p className="text-sm text-white">Camera access is required to take a photo.</p>
                        </div>
                    </div>
                  )}
                  <canvas ref={canvasRef} className="hidden" />
              </div>
              <DialogFooter className="flex-row sm:justify-center gap-2">
                  <Button variant="outline" onClick={stopCamera} className="flex-1">Cancel</Button>
                  <Button onClick={capturePhoto} className="flex-1" disabled={!hasCameraPermission}>
                      <Camera className="mr-2 h-4 w-4" /> Capture
                  </Button>
              </DialogFooter>
          </DialogContent>
      </Dialog>
    </>
  );
}
