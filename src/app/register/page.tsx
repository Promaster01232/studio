"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth, useFirestore, useDatabase } from "@/firebase";
import { 
  createUserWithEmailAndPassword, 
  onAuthStateChanged, 
  updateProfile
} from "firebase/auth";
import { doc, setDoc, serverTimestamp, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { ref, set } from "firebase/database";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Eye, EyeOff, ShieldCheck, AlertCircle, CheckCircle2, Scale, Smartphone, Lock, Zap } from "lucide-react";
import { Logo } from "@/components/logo";
import { motion } from "framer-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { verifyEmailAuthenticity } from "@/ai/flows/verify-email-authenticity";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError, type SecurityRuleContext } from "@/firebase/errors";

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
  const [userType, setUserType] = useState("citizen");
  const [loading, setLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  
  const [isValidating, setIsValidating] = useState(false);
  const [emailStatus, setEmailStatus] = useState<'idle' | 'valid' | 'invalid' | 'pending'>('idle');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(firestore, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            router.replace('/dashboard');
        }
      }
    });
    return () => unsubscribe();
  }, [auth, firestore, router]);

  const handleRegister = async () => {
    const trimmedEmail = email.trim().toLowerCase();
    const cleanFirstName = firstName.trim();
    const cleanLastName = lastName.trim();
    const cleanMobile = mobileNumber.trim().replace(/\s+/g, '');
    
    const mobileRegex = /^(\+91)?([6-9]\d{9})$/;

    if (!cleanFirstName || !cleanLastName || !trimmedEmail || !cleanMobile || !password || !confirmPassword) {
      toast({ variant: "destructive", title: "Information missing", description: "All fields are required for enrollment." });
      return;
    }

    if (!mobileRegex.test(cleanMobile)) {
        toast({ variant: "destructive", title: "Invalid Mobile Number", description: "Please provide a valid 10-digit Indian mobile number." });
        return;
    }

    if (password !== confirmPassword) {
      toast({ variant: "destructive", title: "Passwords mismatch", description: "Verification failed." });
      return;
    }

    setLoading(true);
    setIsValidating(true);

    try {
      // 1. RESILIENT IDENTITY AUDIT: Non-blocking AI check
      let securityStatus = 'verified';
      try {
        const emailValidation = await verifyEmailAuthenticity({ email: trimmedEmail });
        if (!emailValidation.isAuthentic) {
          // If explicitly suspicious, we still allow but flag for secondary audit
          securityStatus = 'flagged_for_review';
          console.warn("[SECURITY] Identity node flagged:", emailValidation.reason);
        }
        setEmailStatus('valid');
      } catch (aiError) {
        // AI saturated? Switch to Institutional Waiver
        setEmailStatus('pending');
        securityStatus = 'pending_audit';
      }
      
      setIsValidating(false);

      // 2. Auth Node Initialization
      const userCredential = await createUserWithEmailAndPassword(auth, trimmedEmail, password);
      const user = userCredential.user;

      if (!user) throw new Error("Identity node generation failed.");

      await updateProfile(user, { displayName: `${cleanFirstName} ${cleanLastName}` });

      const userProfile = {
        uid: user.uid,
        firstName: cleanFirstName,
        lastName: cleanLastName,
        email: trimmedEmail,
        mobileNumber: cleanMobile,
        userType,
        photoURL: user.photoURL || '',
        securityStatus: securityStatus,
        emailVerified: user.emailVerified,
        isBlocked: false,
        aiUsageCount: 0,
        subscriptionType: 'free',
        createdAt: serverTimestamp(),
      };

      // 3. BACKGROUND SYNC: Proceed to dashboard immediately
      const userDocRef = doc(firestore, "users", user.uid);
      setDoc(userDocRef, userProfile).catch(async (serverError) => {
          const permissionError = new FirestorePermissionError({
              path: userDocRef.path,
              operation: 'create',
              requestResourceData: userProfile,
          } satisfies SecurityRuleContext, serverError);
          errorEmitter.emit('permission-error', permissionError);
      });

      set(ref(rtdb, `users/${user.uid}`), {
          ...userProfile,
          createdAt: Date.now()
      }).catch(() => console.warn("[RTDB] Identity sync deferred."));

      toast({ title: "Registration Synchronized", description: "Welcome to your Nyaya Sahayak terminal." });
      router.push("/dashboard");

    } catch (error: any) {
      console.error("Enrollment failed:", error);
      let errorMsg = "Identity node initialization refused. Please try again.";
      if (error.code === 'auth/email-already-in-use') errorMsg = "This email node is already registered.";
      
      toast({ variant: "destructive", title: "Enrollment Failure", description: errorMsg });
      setLoading(false);
      setIsValidating(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl grid md:grid-cols-2 overflow-hidden p-0 shadow-2xl border-primary/5 rounded-[2rem] bg-card text-left">
      <motion.div 
          className="p-8 sm:p-12 flex flex-col justify-center"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
      >
          <div className="flex items-center gap-3 mb-8">
              <Logo className="h-12 w-12" priority={true} />
              <div className="flex flex-col">
                <h1 className="text-2xl font-black tracking-tight text-primary leading-none">
                    Nyaya Sahayak
                </h1>
                <span className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground mt-1">Institutional Hub</span>
              </div>
          </div>
          
          <div className="space-y-1 mb-8">
            <h2 className="text-3xl font-black font-headline tracking-tighter text-foreground uppercase">Enrollment</h2>
            <p className="text-sm text-muted-foreground font-medium">Initialize your secure statutory node.</p>
          </div>
          
          <div className="grid gap-5">
              <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2 text-left">
                    <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Given Name</Label>
                    <Input placeholder="Rajesh" value={firstName} onChange={(e) => setFirstName(e.target.value)} disabled={loading} className="h-12 font-bold rounded-xl border-primary/10 focus:border-primary" />
                  </div>
                  <div className="grid gap-2 text-left">
                    <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Surname</Label>
                    <Input placeholder="Kumar" value={lastName} onChange={(e) => setLastName(e.target.value)} disabled={loading} className="h-12 font-bold rounded-xl border-primary/10 focus:border-primary" />
                  </div>
              </div>
              
              <div className="grid gap-2 text-left">
                  <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center justify-between ml-1">
                    <span>Registry Email</span>
                    {isValidating && <span className="text-[8px] text-primary font-black animate-pulse uppercase tracking-wider">AI Auditing Node...</span>}
                  </Label>
                  <div className="relative">
                    <Input
                        type="email"
                        placeholder="m@example.com"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setEmailStatus('idle'); }}
                        disabled={loading}
                        className={cn("h-12 font-bold rounded-xl border-primary/10 focus:border-primary", emailStatus === 'valid' && "border-green-500/50", emailStatus === 'invalid' && "border-red-500/50")}
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        {emailStatus === 'valid' && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                        {emailStatus === 'invalid' && <AlertCircle className="h-4 w-4 text-red-600" />}
                    </div>
                  </div>
              </div>

              <div className="grid gap-2 text-left">
                  <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Mobile Node</Label>
                  <div className="relative">
                    <Input type="tel" placeholder="+91 98765 43210" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} disabled={loading} className="h-12 font-bold pl-12 rounded-xl border-primary/10 focus:border-primary" />
                    <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary opacity-40" />
                  </div>
              </div>

              <div className="grid gap-2 text-left">
                  <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Statutory Role</Label>
                  <Select value={userType} onValueChange={setUserType} disabled={loading}>
                      <SelectTrigger className="h-12 font-bold rounded-xl border-primary/10 focus:border-primary">
                          <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl glass">
                          <SelectItem value="citizen" className="font-bold">Citizen Node</SelectItem>
                          <SelectItem value="businessman" className="font-bold">Business / MSME</SelectItem>
                          <SelectItem value="student" className="font-bold">Law Student</SelectItem>
                      </SelectContent>
                  </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2 text-left">
                      <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Access Key</Label>
                      <div className="relative">
                          <Input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} className="h-12 font-bold pr-12 rounded-xl border-primary/10 focus:border-primary" />
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
                      </div>
                  </div>
                  <div className="grid gap-2 text-left">
                      <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Confirm Key</Label>
                      <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={loading} className="h-12 font-bold rounded-xl border-primary/10 focus:border-primary" />
                  </div>
              </div>

              <div className="flex items-start space-x-3 text-left p-4 rounded-2xl bg-primary/5 border border-primary/10 mt-2">
                  <Checkbox id="terms" checked={acceptedTerms} onCheckedChange={(c) => setAcceptedTerms(c as boolean)} className="data-[state=checked]:bg-primary mt-1 border-primary/30" />
                  <Label htmlFor="terms" className="text-[10px] font-bold text-muted-foreground leading-relaxed cursor-pointer">I acknowledge the statutory protocols, user agreement, and <Link href="/privacy" className="text-primary hover:underline font-black">Privacy Policy</Link> of Nyaya Sahayak.</Label>
              </div>

              <Button className="w-full h-14 font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-primary/20 active:scale-95 transition-all mt-4 rounded-xl group relative overflow-hidden" onClick={handleRegister} disabled={loading || !acceptedTerms}>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  {loading ? <Loader2 className="animate-spin h-5 w-5 mr-3" /> : <ShieldCheck className="h-5 w-5 mr-3" />}
                  {loading ? "INITIALIZING NODE..." : "ACTIVATE REGISTRY NODE"}
              </Button>
          </div>
          
          <div className="mt-8 text-center text-xs font-bold text-muted-foreground">
              Already in registry? <Link href="/login" className="font-black text-primary hover:underline uppercase tracking-widest ml-1">Sign in terminal</Link>
          </div>
      </motion.div>
      <div className="hidden md:flex flex-col items-center justify-center bg-muted/30 border-l border-primary/5 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none grayscale flex items-center justify-center">
            <Logo className="h-96 w-96" priority={true} />
        </div>
        <div className="p-12 text-center space-y-8 relative z-10">
            <div className="bg-primary/5 p-10 rounded-[2.5rem] inline-block shadow-inner border border-primary/5 group">
                <Scale className="h-24 w-24 text-primary opacity-40 group-hover:opacity-100 transition-opacity duration-700" />
            </div>
            <div className="space-y-3">
                <h3 className="text-2xl font-black font-headline tracking-tighter uppercase text-foreground leading-tight">Identity <br /> Enrollment</h3>
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest max-w-[240px] mx-auto leading-relaxed">Secure your digital presence within the Nyaya Sahayak legal ecosystem.</p>
            </div>
            <div className="flex items-center justify-center gap-4 pt-4">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-background border border-primary/10 shadow-sm">
                    <Zap className="h-3 w-3 text-primary animate-pulse" />
                    <span className="text-[8px] font-black uppercase tracking-widest">Active Node</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-background border border-primary/10 shadow-sm">
                    <Lock className="h-3 w-3 text-primary" />
                    <span className="text-[8px] font-black uppercase tracking-widest">Encrypted</span>
                </div>
            </div>
        </div>
        <div className="absolute bottom-8 text-[9px] font-black uppercase tracking-[0.5em] text-muted-foreground/30">NYAYASAHAYAK.IN // TRANSience REGISTRY</div>
      </div>
    </Card>
  );
}