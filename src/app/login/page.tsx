"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Loader2, Eye, EyeOff, Scale, ShieldCheck, QrCode, KeyRound, Copy, CheckCircle2, Search, ArrowRight, Sparkles, Lock, Activity } from "lucide-react";
import { useAuth, useFirestore } from "@/firebase";
import { 
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  onAuthStateChanged
} from "firebase/auth";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/logo";
import { motion, AnimatePresence } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

function ProtocolRestorationDialog() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [generatedLink, setGeneratedLink] = useState<string | null>(null);
    const { toast } = useToast();
    const auth = useAuth();

    const handleRestore = async () => {
        if (!email) {
            toast({ variant: "destructive", title: "Missing Email" });
            return;
        }

        setLoading(true);
        try {
            await sendPasswordResetEmail(auth, email.trim());
            toast({ title: "Protocol Initiated", description: "Reset link dispatched to your inbox." });
            setGeneratedLink("CHECK_EMAIL");
        } catch (error: any) {
            toast({ variant: "destructive", title: "Restoration Error", description: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <button className="ml-auto inline-block text-[10px] font-black uppercase tracking-widest text-primary hover:underline bg-transparent border-none p-0 cursor-pointer transition-all">
                    Restore key?
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md rounded-[2rem] p-8 text-left border-none shadow-2xl glass">
                <DialogHeader className="mb-6 border-none text-left">
                    <div className="flex items-center gap-2 text-primary mb-2">
                        <KeyRound className="h-4 w-4" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Identity Recovery</span>
                    </div>
                    <DialogTitle className="text-2xl font-black tracking-tighter uppercase">Restore credentials</DialogTitle>
                    <DialogDescription className="text-xs font-medium">
                        Enter your institutional email to receive a secure restoration link.
                    </DialogDescription>
                </DialogHeader>

                {!generatedLink ? (
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Registry email</Label>
                            <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="m@example.com" className="h-12 font-bold rounded-xl border-primary/10 focus:border-primary" />
                        </div>
                        <Button onClick={handleRestore} disabled={loading} className="w-full h-12 font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20 rounded-xl active:scale-95 transition-all">
                            {loading ? <Loader2 className="animate-spin h-4 w-4" /> : "Dispatch restore link"}
                        </Button>
                    </div>
                ) : (
                    <div className="text-center py-6 space-y-4">
                        <div className="bg-primary/5 p-8 rounded-[2rem] border border-primary/10 shadow-inner">
                            <CheckCircle2 className="h-12 w-12 text-primary mx-auto mb-4" />
                            <p className="font-black text-sm uppercase tracking-tight">Restoration link dispatched.</p>
                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-2 opacity-60">Check inbox.</p>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}

const GoogleIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export default function LoginPage() {
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const isLoading = isEmailLoading || isGoogleLoading;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
            const userDocRef = doc(firestore, "users", user.uid);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                router.replace('/dashboard');
            } else {
                router.replace('/create-profile');
            }
        } catch (e) {
            console.error("Auth redirect error:", e);
        }
      }
    });
    return () => unsubscribe();
  }, [auth, firestore, router]);

  const handleLogin = async () => {
    if (!identifier || !password) {
        toast({ variant: "destructive", title: "Information missing", description: "Please enter both credentials."});
        return;
    }
    setIsEmailLoading(true);
    try {
        let loginEmail = identifier.trim().toLowerCase();
        
        if (!loginEmail.includes('@')) {
            const cleanMobile = loginEmail.replace(/\s+/g, '').replace(/^\+91/, '');
            const usersRef = collection(firestore, "users");
            const q = query(usersRef, where("mobileNumber", "in", [cleanMobile, "+91" + cleanMobile]));
            const querySnapshot = await getDocs(q);
            
            if (querySnapshot.empty) {
                toast({ 
                    variant: "destructive", 
                    title: "Not Found", 
                    description: "Mobile number is not registered." 
                });
                setIsEmailLoading(false);
                return;
            }
            loginEmail = querySnapshot.docs[0].data().email;
        }

        await signInWithEmailAndPassword(auth, loginEmail, password);
    } catch (error: any) {
        let message = "Invalid email or password.";
        if (error.code === 'auth/invalid-credential') message = "Authentication failed. Check your credentials.";
        
        toast({ 
            variant: "destructive", 
            title: "Access Denied", 
            description: message 
        });
        setIsEmailLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setAcceptedTerms(true); // Frictionless Google ingress
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
    <Card className="w-full max-w-4xl grid md:grid-cols-2 overflow-hidden p-0 shadow-2xl rounded-[2rem] border-primary/5 bg-card text-left">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="p-8 sm:p-12 flex flex-col justify-center"
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
        
        <div className="space-y-1 mb-10 text-left">
            <h2 className="text-3xl sm:text-4xl font-black font-headline tracking-tighter text-foreground leading-tight">Authorizing</h2>
            <p className="text-sm text-muted-foreground font-medium">Access your secure institutional terminal.</p>
        </div>

        <div className="grid gap-6">
            <div className="space-y-5">
                <div className="space-y-3">
                    <Label htmlFor="identifier" className="font-black text-muted-foreground text-[10px] uppercase tracking-[0.2em] ml-1">Identity (email/mobile)</Label>
                    <Input
                        id="identifier"
                        type="text"
                        placeholder="Registry identity"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        disabled={isLoading}
                        className="font-bold h-12 rounded-xl border-primary/10 focus:border-primary px-5"
                    />
                </div>
                <div className="space-y-3">
                    <div className="flex items-center">
                        <Label htmlFor="password" className="font-black text-muted-foreground text-[10px] uppercase tracking-[0.2em] ml-1">Access key</Label>
                        <ProtocolRestorationDialog />
                    </div>
                    <div className="relative">
                        <Input 
                            id="password" 
                            type={showPassword ? "text" : "password"} 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                            className="font-bold h-12 pr-12 rounded-xl border-primary/10 focus:border-primary px-5"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                        >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                </div>

                <div className="flex items-start space-x-3 text-left p-4 rounded-2xl bg-primary/5 border border-primary/10">
                    <Checkbox 
                        id="login-terms" 
                        checked={acceptedTerms} 
                        onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                        className="mt-1 border-primary/30 data-[state=checked]:bg-primary"
                    />
                    <div className="grid gap-1">
                        <Label htmlFor="login-terms" className="text-[10px] font-bold text-muted-foreground leading-relaxed cursor-pointer">
                            I acknowledge the institutional protocols and <Link href="/privacy" className="text-primary hover:underline font-black">Privacy policy</Link>.
                        </Label>
                    </div>
                </div>

                <div className="grid gap-4">
                    <Button className="w-full font-black uppercase tracking-[0.2em] h-14 shadow-2xl shadow-primary/20 active:scale-95 transition-all rounded-xl text-[10px] group relative overflow-hidden" onClick={handleLogin} disabled={isLoading || !acceptedTerms}>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                        {isEmailLoading ? <Loader2 className="animate-spin h-5 w-5 mr-3" /> : <ShieldCheck className="h-5 w-5 mr-3" />}
                        {isEmailLoading ? "Authorizing..." : "Initialize terminal"}
                    </Button>

                    <Button 
                      variant="outline" 
                      className="w-full font-black text-[10px] uppercase tracking-widest h-14 border-primary/10 hover:border-primary/20 hover:bg-primary/5 shadow-sm active:scale-[0.98] transition-all group rounded-xl" 
                      onClick={handleGoogleLogin} 
                      disabled={isGoogleLoading}
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
            </div>
        </div>
        
        <div className="mt-8 text-center text-xs font-bold text-muted-foreground">
            New to registry?{" "}
            <Link href="/register" className="font-black text-primary hover:underline uppercase tracking-widest ml-1">Enroll node</Link>
        </div>
      </motion.div>
      
      <div className="hidden md:flex flex-col items-center justify-center relative bg-muted/30 border-l border-primary/5 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none grayscale flex items-center justify-center">
            <Logo className="h-96 w-96" priority={true} />
        </div>
        <div className="p-12 text-center space-y-8 relative z-10">
            <div className="bg-primary/5 p-10 rounded-[2.5rem] inline-block animate-pulse shadow-inner border border-primary/5">
                <Scale className="h-24 w-24 text-primary opacity-40" />
            </div>
            <div className="space-y-3 text-center">
                <h3 className="text-2xl font-black font-headline tracking-tighter uppercase text-foreground leading-tight">Statutory <br /> Ingress</h3>
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest max-w-[240px] mx-auto leading-relaxed">Mathematically precise legal assistant for Indian citizens.</p>
            </div>
            <div className="flex items-center justify-center gap-4 pt-4">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-background border border-primary/10 shadow-sm">
                    <Activity className="h-3 w-3 text-primary animate-pulse" />
                    <span className="text-[8px] font-black uppercase tracking-widest">System ready</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-background border border-primary/10 shadow-sm">
                    <Lock className="h-3 w-3 text-primary" />
                    <span className="text-[8px] font-black uppercase tracking-widest">TLS 1.3 Active</span>
                </div>
            </div>
        </div>
        <div className="absolute bottom-8 left-8 text-[9px] font-black uppercase tracking-[0.5em] text-muted-foreground/30 text-left">NYAYASAHAYAK.IN // TERMINAL ACCESS</div>
      </div>
    </Card>
  );
}