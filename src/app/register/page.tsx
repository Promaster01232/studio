"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth, useFirestore, useDatabase } from "@/firebase";
import { createUserWithEmailAndPassword, onAuthStateChanged, sendEmailVerification } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { ref, set } from "firebase/database";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Eye, EyeOff, ShieldCheck, MailCheck, AlertCircle, CheckCircle2, Sparkles, Smartphone } from "lucide-react";
import { Logo } from "@/components/logo";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { motion, AnimatePresence } from "framer-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { validateUserDetails } from "@/ai/flows/validate-user-details";
import { verifyEmailAuthenticity } from "@/ai/flows/verify-email-authenticity";
import { cn } from "@/lib/utils";

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
  
  // AI Validation States
  const [isValidating, setIsValidating] = useState(false);
  const [emailStatus, setEmailStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [mobileStatus, setMobileStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [validationError, setValidationError] = useState("");

  const heroImage = PlaceHolderImages.find(img => img.id === 'login-hero');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace('/dashboard');
      }
    });
    return () => unsubscribe();
  }, [auth, router]);

  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !mobileNumber || !password || !confirmPassword) {
      toast({
        variant: "destructive",
        title: "Information missing",
        description: "Please fill in all required fields.",
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
    setValidationError("");
    setEmailStatus('idle');
    setMobileStatus('idle');

    try {
      setIsValidating(true);

      // 1. AI Email Authenticity Check
      const emailValidation = await verifyEmailAuthenticity({ email });
      if (!emailValidation.isAuthentic) {
        setEmailStatus('invalid');
        setValidationError(emailValidation.reason || "AI detected suspicious email pattern.");
        setIsValidating(false);
        setLoading(false);
        return;
      }
      setEmailStatus('valid');

      // 2. AI Mobile & Details Validation (Indian Mobile Check)
      const detailsValidation = await validateUserDetails({
        firstName,
        lastName,
        mobileNumber,
        userType
      });

      if (!detailsValidation.isValid) {
        setMobileStatus('invalid');
        setValidationError(detailsValidation.reason || "Mobile number or details flagged by AI.");
        setIsValidating(false);
        setLoading(false);
        return;
      }
      setMobileStatus('valid');
      setIsValidating(false);

      // 3. Firebase Registration
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // 4. Trigger verification link
      await sendEmailVerification(user).catch(err => {
          console.warn("Auto-verification email failed to send:", err.message);
      });

      // 5. Registry Synchronization
      const userProfile = {
        uid: user.uid,
        firstName,
        lastName,
        email,
        mobileNumber,
        userType,
        photoURL: user.photoURL || '',
        securityStatus: 'verified',
        emailVerified: user.emailVerified,
        createdAt: serverTimestamp(),
      };

      await setDoc(doc(firestore, "users", user.uid), userProfile);
      
      set(ref(rtdb, `users/${user.uid}`), {
          ...userProfile,
          createdAt: Date.now()
      }).catch(err => console.warn("RTDB sync issues.", err.message));

      toast({
          title: "Registry Active",
          description: "Welcome! A verification link has been sent to your email.",
      });
      router.push("/dashboard");

    } catch (error: any) {
      let errorMessage = "An unknown error occurred. Please try again.";
      if (error.code === 'auth/email-already-in-use') {
          errorMessage = "This email is already registered.";
      } else if (error.code === 'auth/weak-password') {
          errorMessage = "Password is too weak.";
      }

      toast({
        variant: "destructive",
        title: "Registration failed",
        description: errorMessage,
      });
      setLoading(false);
      setIsValidating(false);
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
    <Card className="w-full max-w-4xl grid md:grid-cols-2 overflow-hidden p-0 shadow-2xl border-primary/5 rounded-2xl bg-card">
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
          <motion.h2 variants={itemVariants} className="text-3xl font-black tracking-tighter">Citizen Registry</motion.h2>
          <motion.p variants={itemVariants} className="text-muted-foreground mt-2 mb-8 font-medium">
          AI-authenticated legal access.
          </motion.p>
          <CardContent className="p-0">
              <motion.div variants={itemVariants} className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                  <Label htmlFor="first-name" className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">First name</Label>
                  <Input id="first-name" placeholder="Rajesh" required value={firstName} onChange={(e) => setFirstName(e.target.value)} disabled={loading} className="h-11 font-bold bg-background" />
                  </div>
                  <div className="grid gap-2">
                  <Label htmlFor="last-name" className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Last name</Label>
                  <Input id="last-name" placeholder="Kumar" required value={lastName} onChange={(e) => setLastName(e.target.value)} disabled={loading} className="h-11 font-bold bg-background" />
                  </div>
              </div>
              
              <div className="grid gap-2">
                  <Label htmlFor="email" className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest flex items-center justify-between">
                    <span>Email address</span>
                    <AnimatePresence>
                        {isValidating && email && (
                            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-[9px] text-primary flex items-center gap-1 font-black">
                                <Loader2 className="h-2.5 w-2.5 animate-spin" /> AI SCANNING
                            </motion.span>
                        )}
                    </AnimatePresence>
                  </Label>
                  <div className="relative">
                    <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        required
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setEmailStatus('idle');
                        }}
                        disabled={loading}
                        className={cn(
                            "h-11 font-bold bg-background pr-10 transition-colors",
                            emailStatus === 'valid' && "border-green-500/50 bg-green-500/5",
                            emailStatus === 'invalid' && "border-red-500/50 bg-red-500/5"
                        )}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {emailStatus === 'valid' && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                        {emailStatus === 'invalid' && <AlertCircle className="h-4 w-4 text-red-600" />}
                        {emailStatus === 'idle' && !isValidating && email && <Sparkles className="h-4 w-4 text-primary opacity-20" />}
                    </div>
                  </div>
              </div>

              <div className="grid gap-2">
                  <Label htmlFor="mobile-number" className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest flex items-center justify-between">
                    <span>Indian Mobile Number</span>
                    <AnimatePresence>
                        {isValidating && mobileNumber && (
                            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-[9px] text-primary flex items-center gap-1 font-black">
                                <Smartphone className="h-2.5 w-2.5 animate-pulse" /> FORMAT AUDIT
                            </motion.span>
                        )}
                    </AnimatePresence>
                  </Label>
                  <div className="relative">
                    <Input
                        id="mobile-number"
                        type="tel"
                        placeholder="+91 98765 43210"
                        required
                        value={mobileNumber}
                        onChange={(e) => {
                            setMobileNumber(e.target.value);
                            setMobileStatus('idle');
                        }}
                        disabled={loading}
                        className={cn(
                            "h-11 font-bold bg-background pr-10 transition-colors",
                            mobileStatus === 'valid' && "border-green-500/50 bg-green-500/5",
                            mobileStatus === 'invalid' && "border-red-500/50 bg-red-500/5"
                        )}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {mobileStatus === 'valid' && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                        {mobileStatus === 'invalid' && <AlertCircle className="h-4 w-4 text-red-600" />}
                    </div>
                  </div>
              </div>

              {validationError && (
                  <motion.p initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-[10px] font-black text-red-600 bg-red-500/10 p-2 rounded-lg border border-red-500/20">
                      FORENSIC ALERT: {validationError}
                  </motion.p>
              )}

              <div className="grid gap-2">
                  <Label htmlFor="userType" className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Platform Role</Label>
                  <Select value={userType} onValueChange={setUserType} disabled={loading}>
                      <SelectTrigger id="userType" className="h-11 font-bold bg-background">
                          <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                          <SelectItem value="citizen" className="font-bold">Citizen</SelectItem>
                          <SelectItem value="businessman" className="font-bold">Business / MSME</SelectItem>
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
                              className="h-11 font-bold pr-10 bg-background" 
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
                              className="h-11 font-bold pr-10 bg-background" 
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
                  {loading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="animate-spin h-5 w-5" />
                        {isValidating ? "FORENSIC AUDIT..." : "CREATING NODE..."}
                      </span>
                  ) : (
                      <span className="flex items-center gap-2">
                        <ShieldCheck className="h-5 w-5" /> VALIDATE & SIGN UP
                      </span>
                  )}
              </Button>
              </motion.div>
              <motion.div variants={itemVariants} className="mt-6 text-center text-sm font-medium">
              Already in registry?{" "}
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
  );
}
