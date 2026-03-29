
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
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { ref, set } from "firebase/database";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Eye, EyeOff, ShieldCheck, AlertCircle, CheckCircle2, Scale } from "lucide-react";
import { Logo } from "@/components/logo";
import { motion } from "framer-motion";
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
    const cleanMobile = mobileNumber.trim();
    
    if (!cleanFirstName || !cleanLastName || !trimmedEmail || !cleanMobile || !password || !confirmPassword) {
      toast({ variant: "destructive", title: "Information missing", description: "All fields are required for enrollment." });
      return;
    }

    if (password !== confirmPassword) {
      toast({ variant: "destructive", title: "Passwords mismatch", description: "Verification failed." });
      return;
    }

    setLoading(true);
    setIsValidating(true);

    try {
      // AI Email Audit with Resilient Fallback
      let securityStatus = 'verified';
      try {
        const emailValidation = await verifyEmailAuthenticity({ email: trimmedEmail });
        if (!emailValidation.isAuthentic) {
          setEmailStatus('invalid');
          setIsValidating(false);
          setLoading(false);
          toast({ variant: "destructive", title: "Suspicious Email", description: emailValidation.reason });
          return;
        }
        setEmailStatus('valid');
      } catch (aiError) {
        console.warn("AI Validation node busy, proceeding with pending audit.");
        setEmailStatus('pending');
        securityStatus = 'pending_audit';
      }
      
      setIsValidating(false);

      // Auth Node Creation
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

      // Persistent Sync
      await setDoc(doc(firestore, "users", user.uid), userProfile);
      await set(ref(rtdb, `users/${user.uid}`), {
          ...userProfile,
          createdAt: Date.now()
      });

      toast({ title: "Registry Enrollment Complete", description: "Welcome to Nyaya Sahayak terminal." });
      router.push("/dashboard");

    } catch (error: any) {
      console.error("Enrollment failed:", error);
      let errorMsg = "Enrollment refused by system.";
      if (error.code === 'auth/email-already-in-use') errorMsg = "This email is already in the registry.";
      if (error.code === 'auth/weak-password') errorMsg = "Password protocol insufficient.";
      
      toast({ variant: "destructive", title: "Enrollment Failure", description: errorMsg });
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
      >
          <div className="flex items-center gap-3 mb-6">
              <Logo className="h-12 w-12" />
              <h1 className="text-2xl font-black font-headline tracking-tighter bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  Nyaya Sahayak
              </h1>
          </div>
          <h2 className="text-3xl font-black tracking-tighter">Citizen Registry</h2>
          <p className="text-muted-foreground mt-2 mb-8 font-medium">Direct institutional enrollment protocol.</p>
          
          <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2 text-left">
                    <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">First name</Label>
                    <Input placeholder="Rajesh" value={firstName} onChange={(e) => setFirstName(e.target.value)} disabled={loading} className="h-11 font-bold" />
                  </div>
                  <div className="grid gap-2 text-left">
                    <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Last name</Label>
                    <Input placeholder="Kumar" value={lastName} onChange={(e) => setLastName(e.target.value)} disabled={loading} className="h-11 font-bold" />
                  </div>
              </div>
              
              <div className="grid gap-2 text-left">
                  <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest flex items-center justify-between">
                    <span>Email Address</span>
                    {isValidating && <span className="text-[9px] text-primary font-black animate-pulse uppercase">AI SCANNING...</span>}
                  </Label>
                  <div className="relative">
                    <Input
                        type="email"
                        placeholder="m@example.com"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setEmailStatus('idle'); }}
                        disabled={loading}
                        className={cn("h-11 font-bold", emailStatus === 'valid' && "border-green-500/50", emailStatus === 'invalid' && "border-red-500/50")}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {emailStatus === 'valid' && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                        {emailStatus === 'invalid' && <AlertCircle className="h-4 w-4 text-red-600" />}
                    </div>
                  </div>
              </div>

              <div className="grid gap-2 text-left">
                  <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Mobile Number</Label>
                  <Input type="tel" placeholder="+91 98765 43210" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} disabled={loading} className="h-11 font-bold" />
              </div>

              <div className="grid gap-2 text-left">
                  <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Platform Role</Label>
                  <Select value={userType} onValueChange={setUserType} disabled={loading}>
                      <SelectTrigger className="h-11 font-bold">
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
                      <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Password</Label>
                      <div className="relative">
                          <Input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} className="h-11 font-bold pr-10" />
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
                      </div>
                  </div>
                  <div className="grid gap-2 text-left">
                      <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Confirm</Label>
                      <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={loading} className="h-11 font-bold" />
                  </div>
              </div>

              <div className="flex items-start space-x-3 text-left p-3 rounded-xl bg-primary/5 border border-primary/10 mt-2">
                  <Checkbox id="terms" checked={acceptedTerms} onCheckedChange={(c) => setAcceptedTerms(c as boolean)} className="data-[state=checked]:bg-primary mt-1" />
                  <Label htmlFor="terms" className="text-[10px] font-bold text-muted-foreground leading-snug cursor-pointer">I acknowledge the statutory protocols and privacy policy of nyayasahayak.in.</Label>
              </div>

              <Button className="w-full h-12 font-bold shadow-xl shadow-primary/20 active:scale-95 transition-all mt-4" onClick={handleRegister} disabled={loading || !acceptedTerms}>
                  {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <ShieldCheck className="h-5 w-5 mr-2" />}
                  {loading ? "ENROLLING..." : "COMPLETE ENROLLMENT"}
              </Button>
          </div>
          
          <div className="mt-6 text-center text-sm font-medium">Already in registry? <Link href="/login" className="font-bold text-primary hover:underline">Sign in</Link></div>
      </motion.div>
      <div className="hidden md:flex flex-col items-center justify-center bg-muted/30 border-l border-primary/5">
        <Scale className="h-24 w-24 text-primary opacity-40 animate-pulse" />
        <h3 className="text-2xl font-black tracking-tighter mt-6">Identity Enrollment</h3>
        <p className="text-sm text-muted-foreground font-medium max-w-[280px] text-center px-8">Secure your digital presence within the Nyaya Sahayak ecosystem.</p>
      </div>
    </Card>
  );
}
