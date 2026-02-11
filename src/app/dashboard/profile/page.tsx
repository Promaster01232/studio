
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LogOut, Trash2, KeyRound, ShieldCheck, Moon, Edit, Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTheme } from '@/components/theme-provider';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth, useFirestore } from '@/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { signOut } from 'firebase/auth';

type UserProfile = {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  userType: string;
}

export default function ProfilePage() {
  const { theme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [userType, setUserType] = useState('citizen');


  useEffect(() => {
    setIsMounted(true);
    if (auth?.currentUser && firestore) {
      setLoading(true);
      const userDocRef = doc(firestore, "users", auth.currentUser.uid);
      getDoc(userDocRef).then(userDoc => {
        if (userDoc.exists()) {
          const data = userDoc.data() as UserProfile;
          setUserProfile(data);
          setFirstName(data.firstName);
          setLastName(data.lastName);
          setEmail(data.email);
          setUserType(data.userType);
        } else {
            router.push('/create-profile');
        }
        setLoading(false);
      });
    } else if (auth === null) {
      // loading
    } else {
      router.push('/login');
    }
  }, [auth, firestore, router]);

  const handleSaveChanges = async () => {
    if (!auth?.currentUser || !firestore || !userProfile) return;
    setSaving(true);
    const userDocRef = doc(firestore, "users", auth.currentUser.uid);
    try {
        await setDoc(userDocRef, {
            firstName,
            lastName,
            email,
            userType,
        }, { merge: true });
        toast({ title: 'Profile Updated', description: 'Your changes have been saved.' });
    } catch (e) {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to update profile.' });
        console.error(e);
    } finally {
        setSaving(false);
    }
  };

  const handleLogout = async () => {
    if (auth) {
        await signOut(auth);
        router.push('/login');
    }
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
    <div className="space-y-8">
      <PageHeader
        title="My Profile"
        description="Manage your account settings and personal information."
      />

      {/* User Info Card */}
      <Card>
        <CardContent className="p-6 flex flex-col sm:flex-row items-center gap-6">
          <Avatar className="h-24 w-24 border-2 border-primary">
            <AvatarFallback>{`${firstName.charAt(0)}${lastName.charAt(0)}`}</AvatarFallback>
          </Avatar>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-2xl font-bold font-headline">{firstName} {lastName}</h2>
            <p className="text-muted-foreground">{email}</p>
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
                    <Input id="phone" type="tel" value={userProfile?.phoneNumber || ''} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="userType">I am a</Label>
                    <Select name="userType" value={userType} onValueChange={setUserType}>
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
                <div className="flex justify-end">
                    <Button onClick={handleSaveChanges} disabled={saving}>
                        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                        Save Changes
                    </Button>
                </div>
              </CardContent>
            </Card>
            
            {userType === 'lawyer' && (
                <Card>
                    <CardHeader>
                        <CardTitle>Advocate Profile</CardTitle>
                        <CardDescription>Manage your public-facing advocate profile for the Lawyer Connect directory.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                            Complete your professional details to get listed and connect with potential clients.
                        </p>
                        <Button asChild>
                            <Link href="/dashboard/advocate-profile">
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Advocate Profile
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>

        <div className="space-y-8">
            {/* Account Settings Card */}
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
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
                 <Button variant="outline" className="w-full justify-start">
                    <KeyRound className="mr-3 h-5 w-5 text-muted-foreground" />
                    <span>Change Password</span>
                 </Button>
              </CardContent>
            </Card>

             {/* Danger Zone */}
            <Card className="border-destructive bg-destructive/5">
                <CardHeader>
                    <CardTitle className="text-destructive">Danger Zone</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                     <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
                        <LogOut className="mr-3 h-5 w-5 text-muted-foreground" /> 
                        <span>Logout</span>
                    </Button>
                    <Button variant="destructive" className="w-full justify-start">
                        <Trash2 className="mr-3 h-5 w-5" />
                        <span>Delete Account</span>
                    </Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
