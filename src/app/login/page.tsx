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
    const [systemId, setSystemId] = useState("");
    const [loading, setLoading] = useState(false);
    const [generatedLink, setGeneratedLink] = useState<string | null>(null);
    const { toast } = useToast();
    const firestore = useFirestore();
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
                    <DialogTitle className="text-2xl font-black tracking-tighter">Restore Credentials</DialogTitle>
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
                        <Button onClick={handleRestore} disabled={loading} className="w-full h-12 font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20">
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

export default function LoginPage() {
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDocRef = doc(firestore, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
            router.replace('/dashboard');
        } else {
            router.replace('/create-profile');
        }
      }
    });
    return () => unsubscribe();
  }, [auth, firestore, router]);

  const handleEmailLogin = async () => {
    if (!email || !password) {
        toast({ variant: "destructive", title: "Information missing", description: "Please enter both credentials."});
        return;
    }
    setLoading(true);
    try {
        await signInWithEmailAndPassword(auth, email.trim(), password);
        // Redirection handled by onAuthStateChanged
    } catch (error: any) {
        let message = "Invalid email or password.";
        if (error.code === 'auth/invalid-credential') message = "Authentication failed. Check your credentials.";
        
        toast({ 
            variant: "destructive", 
            title: "Login failed", 
            description: message 
        });
        setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Google Access Failed",
        description: "Authentication node busy. Please try again.",
      });
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl grid md:grid-cols-2 overflow-hidden p-0 shadow-2xl rounded-2xl border-primary/5 bg-card text-left">
      <div className="p-8 sm:p-12 flex flex-col justify-center">
        <div className="flex items-center gap-3 mb-6">
            <Logo className="h-12 w-12" />
            <h1 className="text-2xl font-black font-headline tracking-tighter bg-gradient-to-r from-primary via-accent to-blue-400 bg-clip-text text-transparent">
                Nyaya Sahayak
            </h1>
        </div>
        <h2 className="text-3xl font-black tracking-tighter">Welcome Back</h2>
        <p className="text-muted-foreground mt-2 mb-8 font-medium">
            Access your secure institutional hub.
        </p>

        <div className="grid gap-4">
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email" className="font-bold opacity-70 text-[11px] uppercase tracking-widest">Email address</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
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
                            disabled={loading}
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

                <Button className="w-full font-bold h-12 shadow-lg shadow-primary/20 active:scale-95 transition-all" onClick={handleEmailLogin} disabled={loading || !acceptedTerms}>
                    {loading ? <Loader2 className="animate-spin" /> : "Initialize Login"}
                </Button>
            </div>
            
            <div className="relative my-2">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                <div className="relative flex justify-center text-[11px] font-bold">
                    <span className="bg-background px-2 text-muted-foreground uppercase tracking-widest">Or access via</span>
                </div>
            </div>

            <Button variant="outline" className="w-full font-bold h-12 border-primary/10 hover:border-primary/30" onClick={handleGoogleLogin} disabled={loading || !acceptedTerms}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Scale className="mr-2 h-4 w-4 text-primary" />}
                Google Authorization
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
                <h3 className="text-2xl font-black tracking-tighter">Statutory Ingress</h3>
                <p className="text-sm text-muted-foreground font-medium max-w-[280px]">Mathematically precise legal assistant for Indian citizens.</p>
            </div>
        </div>
        <div className="absolute bottom-8 left-8 text-[10px] font-black uppercase tracking-widest opacity-20">Nyaya Sahayak Node // ACCESS</div>
      </div>
    </Card>
  );
}
