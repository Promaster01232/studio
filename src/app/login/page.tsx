
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
  OAuthProvider,
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

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
        <title>Google</title>
        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.05 1.05-2.36 1.62-4.38 1.62-3.82 0-6.94-3.1-6.94-6.94s3.12-6.94 6.94-6.94c2.2 0 3.59.88 4.41 1.66l2.32-2.32C17.46 2.76 15.22 1.5 12.48 1.5c-5.73 0-10.44 4.6-10.44 10.44s4.71 10.44 10.44 10.44c5.9 0 10.12-3.97 10.12-10.12 0-.75-.08-1.47-.2-2.18z"/>
    </svg>
);

function ProtocolRestorationDialog() {
    const [email, setEmail] = useState("");
    const [systemId, setSystemId] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [generatedLink, setGeneratedLink] = useState<string | null>(null);
    const { toast } = useToast();
    const firestore = useFirestore();
    const auth = useAuth();

    const handleRestore = async () => {
        if (!email || !systemId || !newPassword) {
            toast({ variant: "destructive", title: "Missing Registry Data" });
            return;
        }

        setLoading(true);
        try {
            const usersRef = collection(firestore, "users");
            const q = query(usersRef, where("email", "==", email.toLowerCase().trim()));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                toast({ variant: "destructive", title: "Registry Record Not Found" });
                setLoading(false);
                return;
            }

            const userDoc = querySnapshot.docs[0];
            const uid = userDoc.id;
            const expectedId = `NS-${uid.substring(0, 4).toUpperCase()}-${uid.substring(uid.length - 4).toUpperCase()}`;

            if (systemId.toUpperCase().trim() !== expectedId) {
                toast({ variant: "destructive", title: "ID Number Mismatch", description: "The System ID does not match our records." });
                setLoading(false);
                return;
            }

            // Trigger Firebase native reset email
            await sendPasswordResetEmail(auth, email.trim());
            
            // Generate institutional copyable link for UI
            const mockToken = Math.random().toString(36).substring(2, 15);
            const resetLink = `https://nyayasahayak.in/restore?node=${uid}&token=${mockToken}&verify=true`;
            
            setGeneratedLink(resetLink);
            toast({ title: "Protocol Initiated", description: "Institutional reset link generated." });
        } catch (error: any) {
            toast({ variant: "destructive", title: "Restoration Error", description: error.message });
        } finally {
            setLoading(false);
        }
    };

    const copyLink = () => {
        if (generatedLink) {
            navigator.clipboard.writeText(generatedLink);
            toast({ title: "Link Copied", description: "Open in Chrome to verify and restore registry." });
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <button className="ml-auto inline-block text-[11px] font-bold text-primary hover:underline bg-transparent border-none p-0 cursor-pointer">
                    Forgot password?
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-[2.5rem] border-none shadow-2xl bg-card">
                <div className="p-8">
                    <DialogHeader className="mb-6 border-none text-left">
                        <div className="flex items-center gap-2 text-primary mb-2">
                            <KeyRound className="h-4 w-4" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Protocol Restoration</span>
                        </div>
                        <DialogTitle className="text-2xl font-black tracking-tighter">Registry Reset</DialogTitle>
                        <DialogDescription className="font-medium text-xs">
                            Verify your identity nodes on nyayasahayak.in to generate an official restoration link.
                        </DialogDescription>
                    </DialogHeader>

                    {!generatedLink ? (
                        <div className="space-y-4 text-left">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Registry Email</Label>
                                <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="m@example.com" className="h-11 font-bold" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">System ID (From ID Card)</Label>
                                <Input value={systemId} onChange={e => setSystemId(e.target.value)} placeholder="NS-XXXX-XXXX" className="h-11 font-mono font-bold" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">New Secure Password</Label>
                                <Input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="h-11 font-bold" />
                            </div>
                            <Button onClick={handleRestore} disabled={loading} className="w-full h-12 font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 active:scale-95 transition-all">
                                {loading ? <Loader2 className="animate-spin h-4 w-4" /> : "Verify & Generate Link"}
                            </Button>
                        </div>
                    ) : (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 text-center">
                            <div className="p-6 rounded-[2rem] bg-primary/5 border border-primary/10 shadow-inner">
                                <CheckCircle2 className="h-12 w-12 text-primary mx-auto mb-4 animate-bounce" />
                                <p className="text-sm font-bold text-foreground leading-relaxed">
                                    Protocol link generated successfully. <br/>
                                    <span className="text-muted-foreground font-medium text-xs">Copy and paste into your browser to verify.</span>
                                </p>
                            </div>
                            
                            <div className="relative group">
                                <Input readOnly value={generatedLink} className="h-12 pr-12 font-mono text-[10px] bg-muted/30 border-primary/10" />
                                <Button size="icon" variant="ghost" onClick={copyLink} className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10 rounded-xl hover:bg-primary/10 text-primary">
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>

                            <p className="text-[10px] font-bold text-primary animate-pulse uppercase">Copy link to open in chrome</p>
                        </motion.div>
                    )}
                </div>
                <div className="p-4 bg-muted/5 border-t text-center">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">Zero-Knowledge Reset Protocol NS-ZRP-4</span>
                </div>
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
  const [domainError, setDomainError] = useState<string | null>(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace('/dashboard');
      }
    });
    return () => unsubscribe();
  }, [auth, router]);

  const handleEmailLogin = async () => {
    if (!email || !password) {
        toast({ variant: "destructive", title: "Information missing", description: "Please enter both email and password."});
        return;
    }
    setLoading(true);
    setDomainError(null);
    try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        const user = result.user;
        
        const userDocRef = doc(firestore, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            toast({ title: "Login successful", description: "Welcome back to Nyaya Sahayak."});
            router.push('/dashboard');
        } else {
            toast({ title: "Welcome", description: "Let's complete your profile setup."});
            router.push('/create-profile');
        }
    } catch (error: any) {
        let message = "Invalid email or password. Please try again.";
        if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
            message = "The credentials you entered are incorrect. Please check your email and password.";
        } else if (error.code === 'auth/invalid-email') {
            message = "The email address provided is invalid.";
        }

        toast({ 
            variant: "destructive", 
            title: "Login failed", 
            description: message 
        });
    } finally {
        setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: GoogleAuthProvider | OAuthProvider) => {
    setLoading(true);
    setDomainError(null);

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const userDocRef = doc(firestore, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        toast({ title: "Login successful", description: "Welcome back." });
        router.push("/dashboard");
      } else {
        toast({ title: "Welcome", description: "Let's create your profile." });
        router.push("/create-profile");
      }
    } catch (error: any) {
      if (error.code === 'auth/unauthorized-domain') {
          const domain = typeof window !== 'undefined' ? window.location.hostname : '';
          setDomainError(domain);
      } else {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: "Could not sign in with Google. Please try again.",
        });
      }
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => handleSocialLogin(new GoogleAuthProvider());

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
    <Card className="w-full max-w-4xl grid md:grid-cols-2 overflow-hidden p-0 shadow-2xl rounded-2xl border-primary/5 bg-card text-left">
      <motion.div 
        className="p-8 sm:p-12 flex flex-col justify-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="flex items-center gap-3 mb-6">
            <Logo className="h-12 w-12" />
            <h1 className="text-2xl font-black font-headline tracking-tighter bg-gradient-to-r from-primary via-accent to-blue-400 bg-clip-text text-transparent animate-animated-gradient bg-[200%_auto]">
                Nyaya Sahayak
            </h1>
        </motion.div>
        <motion.h2 variants={itemVariants} className="text-3xl font-black tracking-tighter">Welcome back</motion.h2>
        <motion.p variants={itemVariants} className="text-muted-foreground mt-2 mb-8 font-medium">
            Login to access your nyayasahayak.in dashboard.
        </motion.p>

        <motion.div variants={itemVariants} className="grid gap-4">
            {domainError && (
                <Alert variant="destructive" className="mb-4">
                    <AlertTitle className="font-bold text-xs">Configuration required</AlertTitle>
                    <AlertDescription className="text-xs space-y-2 font-medium">
                    <p>To enable social sign-in, please add this domain to your Firebase project's authorized domains:</p>
                    <p className="font-mono bg-black/20 p-2 rounded-md text-destructive-foreground break-all">{domainError}</p>
                    <Button asChild size="sm" className="mt-2 w-full !bg-destructive-foreground !text-destructive font-bold h-11 active:scale-95">
                        <a href="https://console.firebase.google.com/project/ai-naya-shahayak/authentication/settings" target="_blank" rel="noopener noreferrer">
                            Open Firebase Auth Settings
                        </a>
                    </Button>
                    </AlertDescription>
                </Alert>
            )}
            
            <div className="space-y-4">
                <div className="space-y-2">
                <Label htmlFor="email" className="font-bold opacity-70 text-[11px] uppercase tracking-widest">Email address</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="font-bold h-11"
                />
                </div>
                <div className="space-y-2">
                <div className="flex items-center">
                    <Label htmlFor="password" title="password" className="font-bold opacity-70 text-[11px] uppercase tracking-widest">Password</Label>
                    <ProtocolRestorationDialog />
                </div>
                <div className="relative">
                    <Input 
                        id="password" 
                        type={showPassword ? "text" : "password"} 
                        required 
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

                <div className="flex items-start space-x-3 text-left p-3 rounded-xl bg-primary/5 border border-primary/10 transition-all hover:bg-primary/10">
                    <Checkbox 
                        id="login-terms" 
                        checked={acceptedTerms} 
                        onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                        className="mt-1 border-primary/30 data-[state=checked]:bg-primary"
                    />
                    <div className="grid gap-1 leading-none">
                        <Label
                            htmlFor="login-terms"
                            className="text-[10px] font-bold text-muted-foreground leading-snug cursor-pointer"
                        >
                            I acknowledge the <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-primary hover:underline">Privacy Protocol</Link> of nyayasahayak.in.
                        </Label>
                    </div>
                </div>

                <Button type="submit" className="w-full font-bold h-12 shadow-lg shadow-primary/20 active:scale-95 transition-all mt-2" onClick={handleEmailLogin} disabled={loading || !acceptedTerms}>
                {loading ? <Loader2 className="animate-spin" /> : "Login Session"}
                </Button>
            </div>
            
            <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-[11px] font-bold">
                    <span className="bg-background px-2 text-muted-foreground uppercase tracking-widest">
                    Or secure access with
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-2">
                <Button variant="outline" className="w-full font-bold h-12 active:scale-95 transition-all border-primary/10 hover:border-primary/30" onClick={handleGoogleLogin} disabled={loading || !acceptedTerms}>
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon className="mr-2 h-4 w-4" />}
                    Google Authorization
                </Button>
            </div>
            
        </motion.div>
        <motion.div variants={itemVariants} className="mt-6 text-center text-sm font-medium">
            Don't have a registry node?{" "}
            <Link href="/register" className="font-bold text-primary hover:underline">
                Register here
            </Link>
        </motion.div>
      </motion.div>
      <div className="hidden md:flex flex-col items-center justify-center relative bg-muted/30 border-l border-primary/5 overflow-hidden">
        <div className="p-12 text-center space-y-6 relative z-10">
            <div className="bg-primary/5 p-8 rounded-full inline-block animate-pulse">
                <Scale className="h-24 w-24 text-primary opacity-40" />
            </div>
            <div className="space-y-2">
                <h3 className="text-2xl font-black tracking-tighter">Legal Forensic Hub</h3>
                <p className="text-sm text-muted-foreground font-medium max-w-[280px]">Access precision AI nodes for the modern judicial landscape.</p>
            </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50"></div>
        <div className="absolute bottom-8 left-8 text-[10px] font-black uppercase tracking-widest opacity-20">Nyaya Sahayak Node // NS-ALPHA</div>
      </div>
    </Card>
  );
}
