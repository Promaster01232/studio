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
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { ref, set } from "firebase/database";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Eye, EyeOff, ShieldCheck, User, Mail, Lock, Smartphone, Zap } from "lucide-react";
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
        } else {
            // Already handled by Dashboard Layout but redundant check is good
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
        toast({ variant: "destructive", title: "Invalid mobile number", description: "Please provide a valid 10-digit indian mobile number." });
        return;
    }

    if (password !== confirmPassword) {
      toast({ variant: "destructive", title: "Passwords mismatch", description: "Verification failed." });
      return;
    }

    if (!acceptedTerms) {
        toast({ variant: "destructive", title: "Protocol required", description: "Please acknowledge the statutory terms to continue."});
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
      }).catch(() => {});

      toast({ title: "Registration synchronized", description: "Welcome to your Nyaya Sahayak terminal." });
      router.replace("/dashboard");

    } catch (error: any) {
      setLoading(false);
      setIsValidating(false);
      let errorMsg = "Identity initialization refused. Please try again.";
      
      if (error.code === 'auth/email-already-in-use') {
          errorMsg = "This email is already registered in the system registry.";
      } else if (error.code === 'auth/invalid-email') {
          errorMsg = "The provided email format is invalid.";
      } else if (error.code === 'auth/weak-password') {
          errorMsg = "The access key is too weak. Use a stronger sequence.";
      }
      
      toast({ variant: "destructive", title: "Enrollment failure", description: errorMsg });
    }
  };

  const handleGoogleLogin = async () => {
    if (!acceptedTerms) {
        toast({ variant: "destructive", title: "Protocol required", description: "Please acknowledge the statutory terms to continue."});
        return;
    }
    setIsGoogleLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Google access failed",
        description: "Authentication system busy or restricted. Please try again.",
      });
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f8fafc] p-4 font-body text-left">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-[540px]"
      >
        <Card className="bg-white border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[1.5rem] p-8 sm:p-12">
          <div className="flex flex-col items-center text-center space-y-6 mb-10">
            <div className="flex flex-col items-center gap-2">
              <Logo className="h-12 w-12 text-[#1e3a5f]" priority={true} />
              <div className="space-y-1">
                <h1 className="text-2xl font-black tracking-tight text-[#1e3a5f] leading-none">
                  Nyaya Sahayak
                </h1>
                <p className="text-[10px] font-medium text-slate-400 tracking-wide">
                  Legal intelligence for india
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-[#1e3a5f] tracking-tight">
                Enroll to Nyaya Sahayak
              </h2>
              <p className="text-sm text-slate-400 font-medium">
                Initialize your secure statutory terminal
              </p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2 text-left">
                  <Label htmlFor="firstName" className="text-sm font-bold text-[#1e3a5f]">Given name</Label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1e3a5f] transition-colors">
                      <User className="h-4 w-4" />
                    </div>
                    <Input id="firstName" placeholder="Rajesh" value={firstName} onChange={(e) => setFirstName(e.target.value)} disabled={loading} className="h-12 pl-11 bg-white border-slate-200 rounded-xl font-medium" />
                  </div>
                </div>
                <div className="space-y-2 text-left">
                  <Label htmlFor="lastName" className="text-sm font-bold text-[#1e3a5f]">Surname</Label>
                  <Input id="lastName" placeholder="Kumar" value={lastName} onChange={(e) => setLastName(e.target.value)} disabled={loading} className="h-12 bg-white border-slate-200 rounded-xl font-medium" />
                </div>
              </div>

              <div className="space-y-2 text-left">
                <Label htmlFor="email" className="text-sm font-bold text-[#1e3a5f] flex justify-between">
                  Registry email
                  {isValidating && <span className="text-[10px] text-[#1e3a5f] font-bold animate-pulse">Ai auditing...</span>}
                </Label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1e3a5f] transition-colors">
                    <Mail className="h-4 w-4" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setEmailStatus('idle'); }}
                    disabled={loading}
                    className={cn("h-12 pl-11 bg-white border-slate-200 rounded-xl font-medium", emailStatus === 'valid' && "border-green-500/50")}
                  />
                </div>
              </div>

              <div className="space-y-2 text-left">
                <Label htmlFor="mobile" className="text-sm font-bold text-[#1e3a5f]">Mobile access</Label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1e3a5f] transition-colors">
                    <Smartphone className="h-4 w-4" />
                  </div>
                  <Input id="mobile" placeholder="+91 98765 43210" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} disabled={loading} className="h-12 pl-11 bg-white border-slate-200 rounded-xl font-medium" />
                </div>
              </div>

              <div className="space-y-2 text-left">
                <Label className="text-sm font-bold text-[#1e3a5f]">Statutory role</Label>
                <Select value={userType} onValueChange={setUserType} disabled={loading}>
                  <SelectTrigger className="h-12 bg-white border-slate-200 rounded-xl font-medium text-left">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="citizen" className="font-medium">Citizen</SelectItem>
                    <SelectItem value="businessman" className="font-medium">Business / Msme</SelectItem>
                    <SelectItem value="student" className="font-medium">Law student</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2 text-left">
                  <Label className="text-sm font-bold text-[#1e3a5f]">Access key</Label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1e3a5f] transition-colors">
                      <Lock className="h-4 w-4" />
                    </div>
                    <Input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} className="h-12 pl-11 pr-12 bg-white border-slate-200 rounded-xl font-medium" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#1e3a5f] transition-colors">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2 text-left">
                  <Label className="text-sm font-bold text-[#1e3a5f]">Confirm key</Label>
                  <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={loading} className="h-12 bg-white border-slate-200 rounded-xl font-medium" />
                </div>
              </div>

              <div className="flex items-start space-x-3 text-left p-4 rounded-xl bg-slate-50 border border-slate-100">
                <Checkbox id="terms" checked={acceptedTerms} onCheckedChange={(c) => setAcceptedTerms(c as boolean)} className="mt-1" />
                <Label htmlFor="terms" className="text-xs font-medium text-slate-500 leading-relaxed cursor-pointer">
                  I acknowledge the statutory protocols and <Link href="/privacy" className="text-[#1e3a5f] hover:underline font-bold">Privacy policy</Link> of Nyaya Sahayak.
                </Label>
              </div>

              <div className="space-y-4">
                <Button 
                  onClick={handleRegister} 
                  disabled={loading || !acceptedTerms}
                  className="w-full h-12 bg-[#1e3a5f] hover:bg-[#162d4a] text-white font-bold text-sm rounded-xl shadow-lg active:scale-[0.98] transition-all"
                >
                  {loading ? <Loader2 className="animate-spin h-5 w-5 mr-3" /> : <ShieldCheck className="h-5 w-5 mr-3" />}
                  Activate account
                </Button>

                <Button 
                  type="button"
                  variant="outline" 
                  onClick={handleGoogleLogin} 
                  disabled={isGoogleLoading || !acceptedTerms}
                  className="w-full h-12 border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-sm rounded-xl active:scale-[0.98] transition-all gap-3"
                >
                  {isGoogleLoading ? <Loader2 className="animate-spin h-5 w-5" /> : <GoogleIcon />}
                  Continue with google
                </Button>
              </div>
            </div>
          </div>
        </Card>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-400 font-medium">
            Already in registry?{" "}
            <Link href="/login" className="text-[#1e3a5f] hover:underline font-bold ml-1">Sign in hub</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
