"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth, useFirestore, useDatabase } from "@/firebase";
import { 
  createUserWithEmailAndPassword, 
  onAuthStateChanged, 
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
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

const GoogleIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

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
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
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
        toast({ variant: "destructive", title: "Invalid mobile number", description: "Please provide a valid 10-digit Indian mobile number." });
        return;
    }

    if (password !== confirmPassword) {
      toast({ variant: "destructive", title: "Passwords mismatch", description: "Verification failed." });
      return;
    }

    setLoading(true);
    setIsValidating(true);

    try {
      let securityStatus = 'verified';
      try {
        const emailValidation = await verifyEmailAuthenticity({ email: trimmedEmail });
        if (!emailValidation.isAuthentic) {
          securityStatus = 'flagged_for_review';
          console.warn("[SECURITY] Identity flagged:", emailValidation.reason);
        }
        setEmailStatus('valid');
      } catch (aiError) {
        setEmailStatus('pending');
        securityStatus = 'pending_audit';
      }
      
      setIsValidating(false);

      const userCredential = await createUserWithEmailAndPassword(auth, trimmedEmail, password);
      const user = userCredential.user;

      if (!user) throw new Error("Identity generation failed.");

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

      toast({ title: "Registration synchronized", description: "Welcome to your Nyaya Sahayak terminal." });
      router.push("/dashboard");

    } catch (error: any) {
      console.error("Enrollment failed:", error);
      let errorMsg = "Identity initialization refused. Please try again.";
      if (error.code === 'auth/email-already-in-use') errorMsg = "This email is already registered.";
      
      toast({ variant: "destructive", title: "Enrollment failure", description: errorMsg });
      setLoading(false);
      setIsValidating(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!acceptedTerms) {
        toast({ 
            variant: "destructive", 
            title: "Protocol refused", 
            description: "Please acknowledge the system terms before initializing authorization." 
        });
        return;
    }
    
    setIsGoogleLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error("Google access error:", error);
      toast({
        variant: "destructive",
        title: "Google access failed",
        description: "Authentication system busy or restricted. Please try again.",
      });
      setIsGoogleLoading(false);
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
                <span className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground mt-1">Institutional hub</span>
              </div>
          </div>
          
          <div className="space-y-1 mb-8 text-left">
            <h2 className="text-3xl sm:text-4xl font-black font-headline tracking-tighter text-foreground uppercase leading-tight">Enrollment</h2>
            <p className="text-sm text-muted-foreground font-medium">Initialize your secure statutory terminal.</p>
          </div>
          
          <div className="grid gap-5">
              <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2 text-left">
                    <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Given name</Label>
                    <Input placeholder="Rajesh" value={firstName} onChange={(e) => setFirstName(e.target.value)} disabled={loading} className="h-12 font-bold rounded-xl border-primary/10 focus:border-primary" />
                  </div>
                  <div className="grid gap-2 text-left">
                    <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Surname</Label>
                    <Input placeholder="Kumar" value={lastName} onChange={(e) => setLastName(e.target.value)} disabled={loading} className="h-12 font-bold rounded-xl border-primary/10 focus:border-primary" />
                  </div>
              </div>
              
              <div className="grid gap-2 text-left">
                  <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center justify-between ml-1">
                    <span>Registry email</span>
                    {isValidating && <span className="text-[8px] text-primary font-black animate-pulse uppercase tracking-wider">AI auditing...</span>}
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
                  <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Mobile access</Label>
                  <div className="relative">
                    <Input type="tel" placeholder="+91 98765 43210" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} disabled={loading} className="h-12 font-bold pl-12 rounded-xl border-primary/10 focus:border-primary" />
                    <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary opacity-40" />
                  </div>
              </div>

              <div className="grid gap-2 text-left">
                  <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Statutory role</Label>
                  <Select value={userType} onValueChange={setUserType} disabled={loading}>
                      <SelectTrigger className="h-12 font-bold rounded-xl border-primary/10 focus:border-primary">
                          <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl glass">
                          <SelectItem value="citizen" className="font-bold">Citizen</SelectItem>
                          <SelectItem value="businessman" className="font-bold">Business / MSME</SelectItem>
                          <SelectItem value="student" className="font-bold">Law student</SelectItem>
                      </SelectContent>
                  </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2 text-left">
                      <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Access key</Label>
                      <div className="relative">
                          <Input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} className="h-12 font-bold pr-12 rounded-xl border-primary/10 focus:border-primary" />
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
                      </div>
                  </div>
                  <div className="grid gap-2 text-left">
                      <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Confirm key</Label>
                      <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={loading} className="h-12 font-bold rounded-xl border-primary/10 focus:border-primary" />
                  </div>
              </div>

              <div className="flex items-start space-x-3 text-left p-4 rounded-2xl bg-primary/5 border border-primary/10 mt-2">
                  <Checkbox id="terms" checked={acceptedTerms} onCheckedChange={(c) => setAcceptedTerms(c as boolean)} className="data-[state=checked]:bg-primary mt-1 border-primary/30" />
                  <Label htmlFor="terms" className="text-[10px] font-bold text-muted-foreground leading-relaxed cursor-pointer">I acknowledge the statutory protocols, user agreement, and <Link href="/privacy" className="text-primary hover:underline font-black">Privacy policy</Link> of Nyaya Sahayak.</Label>
              </div>

              <Button className="w-full h-14 font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-primary/20 active:scale-95 transition-all mt-4 rounded-xl group relative overflow-hidden" onClick={handleRegister} disabled={loading || !acceptedTerms}>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  {loading ? <Loader2 className="animate-spin h-5 w-5 mr-3" /> : <ShieldCheck className="h-5 w-5 mr-3" />}
                  {loading ? "Initializing..." : "Activate registry terminal"}
              </Button>

              <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-primary/10" /></div>
                  <div className="relative flex justify-center text-[9px] font-black uppercase tracking-[0.4em]">
                      <span className="bg-background px-4 text-muted-foreground/40">Secure ingress</span>
                  </div>
              </div>

              <Button 
                variant="outline" 
                className="w-full font-black text-[10px] uppercase tracking-widest h-14 border-primary/10 hover:border-primary/20 hover:bg-primary/5 shadow-sm active:scale-[0.98] transition-all group rounded-xl" 
                onClick={handleGoogleLogin} 
                disabled={loading || isGoogleLoading || !acceptedTerms}
              >
                  {isGoogleLoading ? (
                    <Loader2 className="mr-3 h-5 w-5 animate-spin text-primary" />
                  ) : (
                    <div className="mr-3 transition-transform group-hover:scale-110">
                      <GoogleIcon />
                    </div>
                  )}
                  {isGoogleLoading ? "Synchronizing..." : "Continue with google"}
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
            <div className="space-y-3 text-center">
                <h3 className="text-2xl font-black font-headline tracking-tighter uppercase text-foreground leading-tight">Identity <br /> enrollment</h3>
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest max-w-[240px] mx-auto leading-relaxed">Secure your digital presence within the Nyaya Sahayak legal ecosystem.</p>
            </div>
            <div className="flex items-center justify-center gap-4 pt-4">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-background border border-primary/10 shadow-sm">
                    <Zap className="h-3 w-3 text-primary animate-pulse" />
                    <span className="text-[8px] font-black uppercase tracking-widest">System active</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-background border border-primary/10 shadow-sm">
                    <Lock className="h-3 w-3 text-primary" />
                    <span className="text-[8px] font-black uppercase tracking-widest">Encrypted</span>
                </div>
            </div>
        </div>
        <div className="absolute bottom-8 text-[9px] font-black uppercase tracking-[0.5em] text-muted-foreground/30">NYAYASAHAYAK.IN // TRANSIENCE REGISTRY</div>
      </div>
    </Card>
  );
}
