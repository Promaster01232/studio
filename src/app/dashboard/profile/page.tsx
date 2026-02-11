"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { LogOut, Trash2, KeyRound, ShieldCheck, Moon, Edit } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const user = {
    name: 'Rajesh Kumar',
    email: 'rajesh.k@nyaaysathi.com',
    avatar: PlaceHolderImages.find(img => img.id === 'lawyer1'),
};

const cases = [
    { id: '2023-001', title: 'Mehra v. Sharma', status: 'In Progress' },
    { id: '2023-114', title: 'State v. Gupta', status: 'Hearing' },
    { id: '2024-005', title: 'Builders Inc. v. Residents', status: 'Evidence' },
]

export default function ProfilePage() {
  const [userType, setUserType] = useState("citizen");

  return (
    <div className="space-y-8">
      <PageHeader
        title="My Profile"
        description="Manage your account settings and personal information."
      />

      {/* User Info Card */}
      <Card>
        <CardContent className="p-6 flex flex-col sm:flex-row items-center gap-6">
          {user.avatar && (
            <Avatar className="h-24 w-24 border-2 border-primary">
              <AvatarImage src={user.avatar.imageUrl} alt={user.name} data-ai-hint={user.avatar.imageHint} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
          )}
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-2xl font-bold font-headline">{user.name}</h2>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
          <Button>Edit Profile</Button>
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
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" defaultValue={user.name} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" defaultValue={user.email} />
                    </div>
                </div>
                 <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" placeholder="+91 98765 43210" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="userType">I am a</Label>
                    <Select name="userType" value={userType} onValueChange={setUserType}>
                        <SelectTrigger id="userType">
                        <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="citizen">Citizen</SelectItem>
                        <SelectItem value="advocate">Advocate</SelectItem>
                        <SelectItem value="businessman">Business Person</SelectItem>
                        <SelectItem value="student">Law Student</SelectItem>
                        </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end">
                    <Button>Save Changes</Button>
                </div>
              </CardContent>
            </Card>

            {userType === 'advocate' && (
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

            {/* My Cases */}
            <Card>
                <CardHeader>
                    <CardTitle>My Cases</CardTitle>
                    <CardDescription>Overview of your legal matters.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {cases.map((c) => (
                            <div key={c.id} className="flex items-center justify-between p-3 rounded-md border bg-muted/30">
                                <div>
                                    <p className="font-semibold">{c.title}</p>
                                    <p className="text-sm text-muted-foreground">Case ID: {c.id}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium text-sm text-primary">{c.status}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
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
                  <Switch id="dark-mode" />
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
                     <Button variant="outline" className="w-full justify-start">
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
