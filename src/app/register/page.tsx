"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth, useFirestore, useDatabase } from "@/firebase";
import { 
  createUserWithEmailAndPassword, 
  onAuthStateChanged, 
  updateProfile,
  sendEmailVerification
} from "firebase/auth";
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { ref, set } from "firebase/database";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Eye, EyeOff, ShieldCheck, AlertCircle, CheckCircle2, Sparkles, Scale, Info } from "lucide-react";
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
  const [emailStatus, setEmailStatus] = useState<'idle' | 'valid' | 'invalid' | 'pending'>('idle');
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const checkProfile = async () => {
            const docRef = doc(firestore, "users", user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                router.replace('/dashboard');
            }
        };
        checkProfile();
      }
    });
    return () => unsubscribe();
  }, [auth, firestore, router]);

  const handleRegister = async () => {
    const trimmedEmail = email.trim().toLowerCase();
    
    if (!firstName || !lastName || !trimmedEmail || !mobileNumber || !password || !confirmPassword) {
      toast({
        variant: "destructive",
        title: "Information missing",
        description: "Please fill all required fields to initialize the registry node.",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords mismatch",
        description: "Credentials must be identical for statutory security.",
      });
      return;
    }

    setLoading(true);
    setValidationError("");
    setIsValidating(true);

    try {
      // 1. AI Email Audit with Resilient Fallback
      let securityStatus = 'verified';
      try {
        const emailValidation = await verifyEmailAuthenticity({ email: trimmedEmail });
        if (!emailValidation.isAuthentic) {
          setEmailStatus('invalid');
          setValidationError(emailValidation.reason || "Suspicious email pattern detected.");
          setIsValidating(false);
          setLoading(false);
          return;
        }
        setEmailStatus('valid');
      } catch (aiError) {
        console.warn("AI Validation Node Latency - Proceeding with manual audit status.");
        setEmailStatus('pending');
        securityStatus = 'pending_audit';
      }
      
      setIsValidating(false);

      // 2. Auth Node Creation
      const userCredential = await createUserWithEmailAndPassword(auth, trimmedEmail, password);
      const user = userCredential.user;

      if (!user) throw new Error("Identity node generation failed.");

      // 3. Metadata & Profile Synchronization
      await updateProfile(user, { displayName: `${firstName} ${lastName}` });

      const userProfile = {
        uid: user.uid,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: trimmedEmail,
        mobileNumber: mobileNumber.trim(),
        userType,
        photoURL: user.photoURL || '',
        securityStatus: securityStatus,
        emailVerified: user.emailVerified,
        isBlocked: false,
        aiUsageCount: 0,
        subscriptionType: 'free',
        createdAt: serverTimestamp(),
      };

      // Atomic Registry Update (Firestore + RTDB)
      const userDocRef = doc(firestore, "users", user.uid);
      await setDoc(userDocRef, userProfile);
      
      const rtdbRef = ref(rtdb, `users/${user.uid}`);
      await set(rtdbRef, {
          ...userProfile,
          createdAt: Date.now()
      }).catch(err => console.warn("RTDB synchronization delayed:", err.message));

      toast({
          title: "Registry Enrollment Complete",
          description: "Welcome to Nyaya Sahayak. Accessing your terminal...",
      });
      
      router.push("/dashboard");

    } catch (error: any) {
      console.error("Enrollment Failure Dossier:", error);
      
      let errorMessage = "A protocol error occurred. Please try again.";
      if (error.code === 'auth/email-already-in-use') {
          errorMessage = "This email is already registered. Please sign in.";
      } else if (error.code === 'auth/weak-password') {
          errorMessage = "Password does not meet complexity requirements.";
      } else if (error.code === 'auth/network-request-failed') {
          errorMessage = "Network latency detected. Please check your downlink.";
      }

      toast({
        variant: "destructive",
        title: "Enrollment Failure",
        description: errorMessage,
      });
      setLoading(false);
      setIsValidating(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl grid md:grid-cols-2 overflow-hidden p-0 shadow-2xl border-primary/5 rounded-2xl bg-card">
      <motion.div 
          className="p-8 sm:p-12 flex flex-col justify-center"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
      >
          <div className="flex items-center gap-3 mb-6">
              <Logo className="h-12 w-12" />
              <h1 className="text-2xl font-black font-headline tracking-tighter bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  Nyaya Sahayak
              </h1>
          </div>
          <h2 className="text-3xl font-black tracking-tighter">Citizen Registry</h2>
          <p className="text-muted-foreground mt-2 mb-8 font-medium">
            AI-authenticated institutional enrollment.
          </p>
          
          <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2 text-left">
                    <Label htmlFor="first-name" className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">First name</Label>
                    <Input id="first-name" placeholder="Rajesh" value={firstName} onChange={(e) => setFirstName(e.target.value)} disabled={loading} className="h-11 font-bold bg-background" />
                  </div>
                  <div className="grid gap-2 text-left">
                    <Label htmlFor="last-name" className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Last name</Label>
                    <Input id="last-name" placeholder="Kumar" value={lastName} onChange={(e) => setLastName(e.target.value)} disabled={loading} className="h-11 font-bold bg-background" />
                  </div>
              </div>
              
              <div className="grid gap-2 text-left">
                  <Label htmlFor="email" className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest flex items-center justify-between">
                    <span>Email Address</span>
                    {isValidating && (
                        <span className="text-[9px] text-primary flex items-center gap-1 font-black">
                            <Loader2 className="h-2.5 w-2.5 animate-spin" /> AI SCANNING
                        </span>
                    )}
                  </Label>
                  <div className="relative">
                    <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
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
                        {emailStatus === 'pending' && <Loader2 className="h-4 w-4 text-amber-600 animate-spin" />}
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
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      disabled={loading}
                      className="h-11 font-bold bg-background"
                  />
              </div>

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
                      <Label htmlFor="password" className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Password</Label>
                      <div className="relative">
                          <Input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} className="h-11 font-bold pr-10 bg-background" />
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                      </div>
                  </div>
                  <div className="grid gap-2 text-left">
                      <Label htmlFor="confirm-password" className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Confirm</Label>
                      <div className="relative">
                          <Input id="confirm-password" type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={loading} className="h-11 font-bold pr-10 bg-background" />
                          <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                      </div>
                  </div>
              </div>

              <div className="flex items-start space-x-3 text-left p-3 rounded-xl bg-primary/5 border border-primary/10 mt-2">
                  <Checkbox 
                      id="register-terms" 
                      checked={acceptedTerms} 
                      onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                      className="mt-1 border-primary/30 data-[state=checked]:bg-primary"
                  />
                  <div className="grid gap-1 leading-none">
                      <Label htmlFor="register-terms" className="text-[10px] font-bold text-muted-foreground leading-snug cursor-pointer">
                          I acknowledge the <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-primary hover:underline">Privacy Protocol</Link> of nyayasahayak.in.
                      </Label>
                  </div>
              </div>

              <Button className="w-full h-12 font-bold shadow-xl shadow-primary/20 active:scale-95 transition-all mt-4" onClick={handleRegister} disabled={loading || !acceptedTerms}>
                  {loading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="animate-spin h-5 w-5" />
                        {isValidating ? "AI SCANNING..." : "ENROLLING..."}
                      </span>
                  ) : (
                      <span className="flex items-center gap-2">
                        <ShieldCheck className="h-5 w-5" /> COMPLETE ENROLLMENT
                      </span>
                  )}
              </Button>
          </div>
          
          <div className="mt-6 text-center text-sm font-medium">
              Already in registry?{" "}
              <Link href="/login" className="font-bold text-primary hover:underline">
                  Sign in here
              </Link>
          </div>
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
        <div className="absolute bottom-8 left-8 text-[10px] font-black uppercase tracking-widest opacity-20">Nyaya Sahayak Terminal // REGISTRY</div>
      </div>
    </Card>
  );
}
