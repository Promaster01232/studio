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
import { Loader2, Eye, EyeOff, ShieldCheck, MailCheck, AlertCircle, CheckCircle2, Sparkles, Smartphone, Scale } from "lucide-react";
import { Logo } from "@/components/logo";
import { motion, AnimatePresence } from "framer-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { verifyEmailAuthenticity } from "@/ai/flows/verify-email-authenticity";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

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
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  
  const [isValidating, setIsValidating] = useState(false);
  const [emailStatus, setEmailStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [validationError, setValidationError] = useState("");

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

    try {
      setIsValidating(true);

      // Forensic Audit Protocol: Only validate email authenticity
      const emailValidation = await verifyEmailAuthenticity({ email });
      if (!emailValidation.isAuthentic) {
        setEmailStatus('invalid');
        setValidationError(emailValidation.reason || "AI detected suspicious email pattern.");
        setIsValidating(false);
        setLoading(false);
        return;
      }
      setEmailStatus('valid');
      setIsValidating(false);

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await sendEmailVerification(user).catch(err => {
          console.warn("Auto-verification email failed:", err.message);
      });

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
        isBlocked: false,
        createdAt: serverTimestamp(),
      };

      await setDoc(doc(firestore, "users", user.uid), userProfile);
      
      set(ref(rtdb, `users/${user.uid}`), {
          ...userProfile,
          createdAt: Date.now()
      }).catch(err => console.warn("RTDB sync skipped."));

      toast({
          title: "Registry Enrollment Active",
          description: "Welcome! A verification link has been dispatched to your inbox.",
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
        title: "Enrollment failed",
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
          AI-authenticated email enrollment.
          </motion.p>
          <CardContent className="p-0">
              <motion.div variants={itemVariants} className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2 text-left">
                  <Label htmlFor="first-name" className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">First name</Label>
                  <Input id="first-name" placeholder="Rajesh" required value={firstName} onChange={(e) => setFirstName(e.target.value)} disabled={loading} className="h-11 font-bold bg-background" />
                  </div>
                  <div className="grid gap-2 text-left">
                  <Label htmlFor="last-name" className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Last name</Label>
                  <Input id="last-name" placeholder="Kumar" required value={lastName} onChange={(e) => setLastName(e.target.value)} disabled={loading} className="h-11 font-bold bg-background" />
                  </div>
              </div>
              
              <div className="grid gap-2 text-left">
                  <Label htmlFor="email" className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest flex items-center justify-between">
                    <span>Email ID</span>
                    <AnimatePresence>
                        {isValidating && (
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

              <div className="grid gap-2 text-left">
                  <Label htmlFor="mobile-number" className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                    Mobile Number
                  </Label>
                  <Input
                      id="mobile-number"
                      type="tel"
                      placeholder="+91 98765 43210"
                      required
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      disabled={loading}
                      className="h-11 font-bold bg-background"
                  />
              </div>

              {validationError && (
                  <motion.p initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-[10px] font-black text-red-600 bg-red-500/10 p-2 rounded-lg border border-red-500/20">
                      AI FORENSIC ALERT: {validationError}
                  </motion.p>
              )}

              <div className="grid gap-2 text-left">
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
                  <div className="grid gap-2 text-left">
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
                  <div className="grid gap-2 text-left">
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

              <div className="flex items-start space-x-3 text-left p-3 rounded-xl bg-primary/5 border border-primary/10 transition-all hover:bg-primary/10 mt-2">
                  <Checkbox 
                      id="register-terms" 
                      checked={acceptedTerms} 
                      onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                      className="mt-1 border-primary/30 data-[state=checked]:bg-primary"
                  />
                  <div className="grid gap-1 leading-none">
                      <Label
                          htmlFor="register-terms"
                          className="text-[10px] font-bold text-muted-foreground leading-snug cursor-pointer"
                      >
                          I acknowledge the <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-primary hover:underline">Privacy Protocol</Link>.
                      </Label>
                  </div>
              </div>

              <Button type="submit" className="w-full h-12 font-bold shadow-xl shadow-primary/20 active:scale-95 transition-all mt-4" onClick={handleRegister} disabled={loading || !acceptedTerms}>
                  {loading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="animate-spin h-5 w-5" />
                        {isValidating ? "AI SCANNING..." : "ENROLLING IDENTITY..."}
                      </span>
                  ) : (
                      <span className="flex items-center gap-2">
                        <ShieldCheck className="h-5 w-5" /> COMPLETE REGISTRATION
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
      <div className="hidden md:flex flex-col items-center justify-center relative bg-muted/30 border-l border-primary/5 overflow-hidden">
        <div className="p-12 text-center space-y-6 relative z-10">
            <div className="bg-primary/5 p-8 rounded-full inline-block animate-pulse">
                <Scale className="h-24 w-24 text-primary opacity-40" />
            </div>
            <div className="space-y-2">
                <h3 className="text-2xl font-black tracking-tighter">Identity Enrollment</h3>
                <p className="text-sm text-muted-foreground font-medium max-w-[280px]">Secure your digital presence within the Nyaya Sahayak ecosystem.</p>
            </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50"></div>
        <div className="absolute bottom-8 left-8 text-[10px] font-black uppercase tracking-widest opacity-20">Nyaya Sahayak Terminal // NS-REGISTRY</div>
      </div>
    </Card>
  );
}
