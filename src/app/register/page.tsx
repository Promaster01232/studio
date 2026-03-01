"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth, useFirestore } from "@/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Logo } from "@/components/logo";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { motion } from "framer-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AdvocateProfileForm } from '@/components/advocate-profile-form';

export default function RegisterPage() {
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState("citizen");
  const [loading, setLoading] = useState(false);
  const [showAdvocateDialog, setShowAdvocateDialog] = useState(false);

  const heroImage = PlaceHolderImages.find(img => img.id === 'login-hero');

  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !mobileNumber || !password || !confirmPassword) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all fields.",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords do not match",
        description: "Please make sure your passwords match.",
      });
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const userProfile = {
        uid: user.uid,
        firstName,
        lastName,
        email,
        mobileNumber,
        userType,
        photoURL: user.photoURL || '',
      };

      await setDoc(doc(firestore, "users", user.uid), userProfile);

      if (userType === 'lawyer') {
          setShowAdvocateDialog(true);
      } else {
        toast({
            title: "Account Created!",
            description: "Welcome to Nyaya Sahayak. You are now logged in.",
        });
        router.push("/dashboard");
      }

    } catch (error: any) {
      console.error("Registration error:", error);
      let errorMessage = "An unknown error occurred. Please try again.";
      if (error.code === 'auth/email-already-in-use') {
          errorMessage = "This email is already in use. Please login instead.";
      } else if (error.code === 'auth/weak-password') {
          errorMessage = "The password is too weak. Please use at least 6 characters.";
      }
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: errorMessage,
      });
      setLoading(false);
    }
  };
  
  const handleAdvocateProfileSaved = () => {
    setShowAdvocateDialog(false);
    setLoading(false);
    toast({
        title: "Registration Complete!",
        description: "Your advocate profile has been created and listed. Welcome aboard!",
    });
    router.push('/dashboard/lawyer-connect');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <>
        <Card className="w-full max-w-4xl grid md:grid-cols-2 overflow-hidden p-0 shadow-2xl">
        <motion.div 
            className="p-8 sm:p-12 flex flex-col justify-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={itemVariants} className="flex items-center gap-3 mb-6">
                <Logo className="h-12 w-12" />
                <h1 className="text-2xl font-black font-headline tracking-tighter bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-animated-gradient bg-[200%_auto]">
                    Nyaya Sahayak
                </h1>
            </motion.div>
            <motion.h2 variants={itemVariants} className="text-3xl font-bold tracking-tight">Create an Account</motion.h2>
            <motion.p variants={itemVariants} className="text-muted-foreground mt-2 mb-8">
            Join the Nyaya Sahayak community today.
            </motion.p>
            <CardContent className="p-0">
                <motion.div variants={itemVariants} className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                    <Label htmlFor="first-name">First name</Label>
                    <Input id="first-name" placeholder="Max" required value={firstName} onChange={(e) => setFirstName(e.target.value)} disabled={loading} />
                    </div>
                    <div className="grid gap-2">
                    <Label htmlFor="last-name">Last name</Label>
                    <Input id="last-name" placeholder="Robinson" required value={lastName} onChange={(e) => setLastName(e.target.value)} disabled={loading} />
                    </div>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="mobile-number">Mobile Number</Label>
                    <Input
                    id="mobile-number"
                    type="tel"
                    placeholder="Your mobile number"
                    required
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    disabled={loading}
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="userType">I am a...</Label>
                    <Select value={userType} onValueChange={setUserType} disabled={loading}>
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
                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="confirm-password">Confirm Password</Label>
                        <Input id="confirm-password" type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={loading} />
                    </div>
                </div>
                <Button type="submit" className="w-full h-11" onClick={handleRegister} disabled={loading}>
                    {loading ? <Loader2 className="animate-spin" /> : "Create an account"}
                </Button>
                </motion.div>
                <motion.div variants={itemVariants} className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link href="/login" className="font-semibold text-primary hover:underline">
                    Sign in
                </Link>
                </motion.div>
            </CardContent>
        </motion.div>
        <div className="hidden md:block relative">
            <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent"></div>
            {heroImage && (
                <Image 
                    src={heroImage.imageUrl}
                    alt={heroImage.description}
                    fill
                    className="object-cover"
                    data-ai-hint={heroImage.imageHint}
                    priority
                />
            )}
        </div>
        </Card>

        <Dialog open={showAdvocateDialog} onOpenChange={(open) => {
            // Only allow closing if they've saved, as requested
            if (!open) {
                toast({ title: "Incomplete Profile", description: "Advocates must complete their profile to proceed." });
            }
        }}>
            <DialogContent className="sm:max-w-2xl" onPointerDownOutside={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle>Complete Advocate Profile</DialogTitle>
                    <DialogDescription>
                        As an Advocate, you must provide your professional details to be listed in our verified directory.
                    </DialogDescription>
                </DialogHeader>
                <AdvocateProfileForm 
                    onSave={handleAdvocateProfileSaved}
                    userProfile={{
                        firstName,
                        lastName,
                        email,
                        photoURL: auth.currentUser?.photoURL || ''
                    }}
                />
            </DialogContent>
        </Dialog>
    </>
  );
}
