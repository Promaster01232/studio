"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Loader2, Eye, EyeOff, Scale, ShieldCheck, QrCode, KeyRound, Copy, CheckCircle2, Search, ArrowRight, Sparkles } from "lucide-react";
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
                <button className="ml-auto inline-block text-[11px] font-bold text-primary hover:underline bg-transparent border-none p-0 cursor-pointer">
                    Forgot password?
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md rounded-2xl p-8 text-left">
                <DialogHeader className="mb-6 border-none text-left">
                    <div className="flex items-center gap-2 text-primary mb-2">
                        <KeyRound className="h-4 w-4" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Identity Recovery</span>
                    </div>
                    <DialogTitle className="text-2xl font-bold tracking-tight">Restore Credentials</DialogTitle>
                    <DialogDescription className="text-xs font-medium">
                        Enter your institutional email to receive a secure restoration link.
                    </DialogDescription>
                </DialogHeader>

                {!generatedLink ? (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Registry Email</Label>
                            <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="m@example.com" className="h-11 font-bold" />
                        </div>
                        <Button onClick={handleRestore} disabled={loading} className="w-full h-12 font-bold text-xs uppercase tracking-widest shadow-xl shadow-primary/20">
                            {loading ? <Loader2 className="animate-spin h-4 w-4" /> : "Dispatch Restore Link"}
                        </Button>
                    </div>
                ) : (
                    <div className="text-center py-6 space-y-4">
                        <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10">
                            <CheckCircle2 className="h-12 w-12 text-primary mx-auto mb-4" />
                            <p className="font-bold text-sm">Restoration link dispatched.</p>
                            <p className="text-[10px] text-muted-foreground font-medium mt-1">Please check your inbox and spam folders.</p>
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
            title: "Login failed", 
            description: message 
        });
        setIsEmailLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!acceptedTerms) {
        toast({ 
            variant: "destructive", 
            title: "Protocol Refused", 
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
      console.error("Google Access Error:", error);
      toast({
        variant: "destructive",
        title: "Google Access Failed",
        description: "Authentication node busy or restricted. Please try again.",
      });
      setIsGoogleLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl grid md:grid-cols-2 overflow-hidden p-0 shadow-2xl rounded-2xl border-primary/5 bg-card text-left">
      <div className="p-8 sm:p-12 flex flex-col justify-center">
        <div className="flex items-center gap-3 mb-6">
            <Logo className="h-12 w-12" />
            <h1 className="text-3xl font-bold tracking-tight text-primary">
                Nyaya Sahayak
            </h1>
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Welcome Back</h2>
        <p className="text-muted-foreground mt-2 mb-8 font-medium">
            Access your secure institutional hub.
        </p>

        <div className="grid gap-4">
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="identifier" className="font-bold opacity-70 text-[11px] uppercase tracking-widest">Email or Mobile Number</Label>
                    <Input
                        id="identifier"
                        type="text"
                        placeholder="Enter Registered Email or Mobile"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        disabled={isLoading}
                        className="font-bold h-11"
                    />
                </div>
                <div className="space-y-2">
                    <div className="flex items-center">
                        <Label htmlFor="password" className="font-bold opacity-70 text-[11px] uppercase tracking-widest">Password</Label>
                        <ProtocolRestorationDialog />
                    </div>
                    <div className="relative">
                        <Input 
                            id="password" 
                            type={showPassword ? "text" : "password"} 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                            className="font-bold h-11 pr-10"
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

                <div className="flex items-start space-x-3 text-left p-3 rounded-xl bg-primary/5 border border-primary/10">
                    <Checkbox 
                        id="login-terms" 
                        checked={acceptedTerms} 
                        onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                        className="mt-1 border-primary/30 data-[state=checked]:bg-primary"
                    />
                    <div className="grid gap-1">
                        <Label htmlFor="login-terms" className="text-[10px] font-bold text-muted-foreground leading-snug cursor-pointer">
                            I acknowledge the system protocols and <Link href="/terms" className="text-primary hover:underline">Privacy Policy</Link>.
                        </Label>
                    </div>
                </div>

                <Button className="w-full font-bold h-12 shadow-lg shadow-primary/20 active:scale-95 transition-all" onClick={handleLogin} disabled={isLoading || !acceptedTerms}>
                    {isEmailLoading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
                    {isEmailLoading ? "Authorizing..." : "Login"}
                </Button>
            </div>
            
            <div className="relative py-4">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-primary/10" /></div>
                <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-widest">
                    <span className="bg-background px-4 text-muted-foreground/40">Secure Access</span>
                </div>
            </div>

            <Button 
              variant="outline" 
              className="w-full font-bold text-[10px] uppercase tracking-widest h-12 border-primary/10 hover:border-primary/20 hover:bg-primary/5 shadow-sm active:scale-[0.98] transition-all group" 
              onClick={handleGoogleLogin} 
              disabled={isLoading || !acceptedTerms}
            >
                {isGoogleLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin text-primary" />
                ) : (
                  <div className="mr-3 transition-transform group-hover:scale-110">
                    <GoogleIcon />
                  </div>
                )}
                {isGoogleLoading ? "Synchronizing..." : "Continue with Google"}
            </Button>
        </div>
        
        <div className="mt-6 text-center text-sm font-medium">
            New to registry?{" "}
            <Link href="/register" className="font-bold text-primary hover:underline">Register Node</Link>
        </div>
      </div>
      
      <div className="hidden md:flex flex-col items-center justify-center relative bg-muted/30 border-l border-primary/5 overflow-hidden">
        <div className="p-12 text-center space-y-6 relative z-10">
            <div className="bg-primary/5 p-8 rounded-full inline-block animate-pulse">
                <Scale className="h-24 w-24 text-primary opacity-40" />
            </div>
            <div className="space-y-2">
                <h3 className="text-2xl font-bold tracking-tight text-foreground">Statutory Ingress</h3>
                <p className="text-sm text-muted-foreground font-medium max-w-[280px]">Mathematically precise legal assistant for Indian citizens.</p>
            </div>
        </div>
        <div className="absolute bottom-8 left-8 text-[10px] font-black uppercase tracking-widest opacity-20 text-left">Nyaya Sahayak // ACCESS</div>
      </div>
    </Card>
  );
}
