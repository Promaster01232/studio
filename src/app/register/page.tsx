
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth, useFirestore, useDatabase } from "@/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { ref, set, update } from "firebase/database";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Eye, EyeOff, Scale, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/logo";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { motion } from "framer-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AdvocateProfileForm } from '@/components/advocate-profile-form';
import { validateUserDetails } from "@/ai/flows/validate-user-details";

export default function RegisterPage() {
  const auth = useAuth();
  const firestore = useFirestore();
  const rtdb = useDatabase();
  const router = useRouter();
  const { toast } = useToast();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userType, setUserType] = useState("citizen");
  const [loading, setLoading] = useState(false);
  const [showAdvocateDialog, setShowAdvocateDialog] = useState(false);

  const heroImage = PlaceHolderImages.find(img => img.id === 'login-hero');

  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !mobileNumber || !password || !confirmPassword) {
      toast({
        variant: "destructive",
        title: "Information missing",
        description: "Please fill in all required fields to create your account.",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords mismatch",
        description: "Please ensure your passwords are identical.",
      });
      return;
    }

    setLoading(true);

    try {
      // AI Validation of details
      const validation = await validateUserDetails({
        firstName,
        lastName,
        email,
        mobileNumber,
        userType
      });

      if (!validation.isValid) {
        toast({
          variant: "destructive",
          title: "Account validation failed",
          description: validation.reason || "The details provided appear to be invalid. Please provide genuine information.",
        });
        setLoading(false);
        return;
      }

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
        securityStatus: 'verified',
        createdAt: serverTimestamp(),
      };

      // Save to Firestore
      await setDoc(doc(firestore, "users", user.uid), userProfile);
      
      // Sync to RTDB
      set(ref(rtdb, `users/${user.uid}`), {
          ...userProfile,
          createdAt: Date.now()
      }).catch(err => console.warn("RTDB sync skipped.", err.message));

      // MANDATORY: If lawyer, enforce professional setup before proceeding
      if (userType === 'lawyer') {
          setShowAdvocateDialog(true);
      } else {
        toast({
            title: "Welcome aboard",
            description: "Your account is active. Explore our legal tools.",
        });
        router.push("/dashboard");
      }

    } catch (error: any) {
      let errorMessage = "An unknown error occurred. Please try again.";
      if (error.code === 'auth/email-already-in-use') {
          errorMessage = "This email address is already registered.";
      } else if (error.code === 'auth/weak-password') {
          errorMessage = "The password is too weak.";
      }

      toast({
        variant: "destructive",
        title: "Registration failed",
        description: errorMessage,
      });
      setLoading(false);
    }
  };
  
  const handleAdvocateProfileSaved = () => {
    setShowAdvocateDialog(false);
    setLoading(false);
    toast({
        title: "Submission complete",
        description: "Your professional details are awaiting manual admin approval. Your profile is currently inactive.",
    });
    router.push('/dashboard');
  };

  const handleSkipAdvocate = async () => {
    if (!auth.currentUser) return;
    
    setLoading(true);
    const user = auth.currentUser;
    // Downgrade to citizen if professional setup is skipped
    try {
        await updateDoc(doc(firestore, "users", user.uid), { userType: 'citizen' });
        await update(ref(rtdb, `users/${user.uid}`), { userType: 'citizen' }).catch(e => {});
        
        setShowAdvocateDialog(false);
        setLoading(false);
        toast({
            title: "Citizen Profile Activated",
            description: "Professional setup skipped. You have been registered as a Citizen.",
        });
        router.push("/dashboard");
    } catch (err) {
        console.error("Failed to skip advocate setup:", err);
        setLoading(false);
    }
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
        <Card className="w-full max-w-4xl grid md:grid-cols-2 overflow-hidden p-0 shadow-2xl border-primary/5 rounded-2xl">
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
            <motion.h2 variants={itemVariants} className="text-3xl font-black tracking-tighter">Join the community</motion.h2>
            <motion.p variants={itemVariants} className="text-muted-foreground mt-2 mb-8 font-medium">
            Select your role to unlock specialized legal tools.
            </motion.p>
            <CardContent className="p-0">
                <motion.div variants={itemVariants} className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                    <Label htmlFor="first-name" className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">First name</Label>
                    <Input id="first-name" placeholder="Rajesh" required value={firstName} onChange={(e) => setFirstName(e.target.value)} disabled={loading} className="h-11 font-bold" />
                    </div>
                    <div className="grid gap-2">
                    <Label htmlFor="last-name" className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Last name</Label>
                    <Input id="last-name" placeholder="Kumar" required value={lastName} onChange={(e) => setLastName(e.target.value)} disabled={loading} className="h-11 font-bold" />
                    </div>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="email" className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Email address</Label>
                    <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="h-11 font-bold"
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="mobile-number" className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Mobile number</Label>
                    <Input
                    id="mobile-number"
                    type="tel"
                    placeholder="+91 12345 67890"
                    required
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    disabled={loading}
                    className="h-11 font-bold"
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="userType" className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">I am registering as a...</Label>
                    <Select value={userType} onValueChange={setUserType} disabled={loading}>
                        <SelectTrigger id="userType" className="h-11 font-bold">
                            <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="citizen" className="font-bold">General Citizen</SelectItem>
                            <SelectItem value="lawyer" className="font-bold">Legal Professional (Advocate)</SelectItem>
                            <SelectItem value="businessman" className="font-bold">Business Owner / MSME</SelectItem>
                            <SelectItem value="student" className="font-bold">Law Student</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="password" title="password" className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Password</Label>
                        <div className="relative">
                            <Input 
                                id="password" 
                                type={showPassword ? "text" : "password"} 
                                required 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                disabled={loading} 
                                className="h-11 font-bold pr-10" 
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="confirm-password" title="confirm-password" className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Confirm</Label>
                        <div className="relative">
                            <Input 
                                id="confirm-password" 
                                type={showConfirmPassword ? "text" : "password"} 
                                required 
                                value={confirmPassword} 
                                onChange={(e) => setConfirmPassword(e.target.value)} 
                                disabled={loading} 
                                className="h-11 font-bold pr-10" 
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>
                </div>
                <Button type="submit" className="w-full h-12 font-bold shadow-xl shadow-primary/20 active:scale-95 transition-all mt-4" onClick={handleRegister} disabled={loading}>
                    {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Complete Registration"}
                </Button>
                </motion.div>
                <motion.div variants={itemVariants} className="mt-6 text-center text-sm font-medium">
                Already have an account?{" "}
                <Link href="/login" className="font-bold text-primary hover:underline">
                    Sign in here
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
            // Mandatory documentation check
            if (!open) {
                handleSkipAdvocate();
            }
        }}>
            <DialogContent className="sm:max-w-2xl p-0 overflow-hidden rounded-2xl" onPointerDownOutside={(e) => e.preventDefault()}>
                <div className="bg-primary/5 p-6 border-b border-primary/5">
                    <div className="flex items-center gap-3 mb-2">
                        <ShieldCheck className="h-6 w-6 text-primary" />
                        <DialogTitle className="font-headline font-black text-xl tracking-tight leading-none">Professional Onboarding</DialogTitle>
                    </div>
                    <DialogDescription className="font-medium text-[11px] leading-relaxed">
                        To activate your Lawyer profile, you must provide your professional details. All submissions require manual admin approval before appearing in the directory.
                    </DialogDescription>
                </div>
                <div className="p-6">
                    <AdvocateProfileForm 
                        onSave={handleAdvocateProfileSaved}
                        onSkip={handleSkipAdvocate}
                        userProfile={{
                            firstName,
                            lastName,
                            email,
                            photoURL: auth.currentUser?.photoURL || ''
                        }}
                    />
                </div>
            </DialogContent>
        </Dialog>
    </>
  );
}
