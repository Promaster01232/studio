"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useAuth, useFirestore } from "@/firebase";
import { 
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/logo";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { motion } from "framer-motion";

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
        <title>Google</title>
        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.05 1.05-2.36 1.62-4.38 1.62-3.82 0-6.94-3.1-6.94-6.94s3.12-6.94 6.94-6.94c2.2 0 3.59.88 4.41 1.66l2.32-2.32C17.46 2.76 15.22 1.5 12.48 1.5c-5.73 0-10.44 4.6-10.44 10.44s4.71 10.44 10.44 10.44c5.9 0 10.12-3.97 10.12-10.12 0-.75-.08-1.47-.2-2.18z"/>
    </svg>
);

export default function LoginPage() {
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [domainError, setDomainError] = useState<string | null>(null);

  const heroImage = PlaceHolderImages.find(img => img.id === 'login-hero');

  const handleEmailLogin = async () => {
    if (!email || !password) {
        toast({ variant: "destructive", title: "Error", description: "Please enter both email and password."});
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
            toast({ title: "Login Successful!", description: "Welcome back."});
            router.push('/dashboard');
        } else {
            toast({ title: "Welcome!", description: "Let's create your profile."});
            router.push('/create-profile');
        }
    } catch (error: any) {
        console.error("Email auth error:", error);
        toast({ variant: "destructive", title: "Login Failed", description: "Invalid email or password. Please try again." });
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
        toast({ title: "Login Successful!", description: "Welcome back." });
        router.push("/dashboard");
      } else {
        toast({ title: "Welcome!", description: "Let's create your profile." });
        router.push("/create-profile");
      }
    } catch (error: any) {
      if (error.code === 'auth/unauthorized-domain') {
          const domain = typeof window !== 'undefined' ? window.location.hostname : '';
          setDomainError(domain);
      } else {
        console.error("Social login error:", error);
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: "Could not sign in. Please try again.",
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
    <Card className="w-full max-w-4xl grid md:grid-cols-2 overflow-hidden p-0 shadow-2xl rounded-2xl">
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
        <motion.h2 variants={itemVariants} className="text-3xl font-black tracking-tighter">Welcome Back</motion.h2>
        <motion.p variants={itemVariants} className="text-muted-foreground mt-2 mb-8 font-medium">
            Login to access your dashboard.
        </motion.p>

        <motion.div variants={itemVariants} className="grid gap-4">
            {domainError && (
                <Alert variant="destructive" className="mb-4">
                    <AlertTitle className="font-bold text-xs">Configuration Required</AlertTitle>
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
                <Label htmlFor="email" className="font-bold opacity-70">Email</Label>
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
                    <Label htmlFor="password" title="password" className="font-bold opacity-70">Password</Label>
                    <Link href="#" className="ml-auto inline-block text-[11px] font-bold text-primary hover:underline">
                    Forgot password?
                    </Link>
                </div>
                <Input 
                    id="password" 
                    type="password" 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="font-bold h-11"
                />
                </div>
                <Button type="submit" className="w-full font-bold h-12 shadow-lg shadow-primary/20 active:scale-95 transition-all mt-2" onClick={handleEmailLogin} disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : "Login"}
                </Button>
            </div>
            
            <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-[11px] font-bold">
                    <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-2">
                <Button variant="outline" className="w-full font-bold h-12 active:scale-95 transition-all border-primary/10 hover:border-primary/30" onClick={handleGoogleLogin} disabled={loading}>
                    <GoogleIcon className="mr-2 h-4 w-4" />
                    Google
                </Button>
            </div>
            
        </motion.div>
        <motion.div variants={itemVariants} className="mt-6 text-center text-sm font-medium">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-bold text-primary hover:underline">
                Sign up
            </Link>
        </motion.div>
      </motion.div>
      <div className="hidden md:block relative">
        {heroImage && (
            <Image 
                src={heroImage.imageUrl}
                alt={heroImage.description}
                fill
                className="object-cover"
                data-ai-hint={heroImage.imageHint}
                priority
            />
        )}
         <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent"></div>
      </div>
    </Card>
  );
}
