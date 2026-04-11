
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Loader2, Eye, EyeOff, Mail, Lock, ChevronLeft, ShieldCheck } from "lucide-react";
import { useAuth, useFirestore } from "@/firebase";
import { 
  signInWithEmailAndPassword,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/logo";
import { motion } from "framer-motion";

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
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
        toast({ variant: "destructive", title: "Information missing", description: "Please enter both credentials."});
        return;
    }
    setIsLoading(true);
    try {
        await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
    } catch (error: any) {
        let message = "Invalid email or password.";
        if (error.code === 'auth/invalid-credential') message = "Authentication failed. Check your credentials.";
        
        toast({ 
            variant: "destructive", 
            title: "Access denied", 
            description: message 
        });
        setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
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
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f8fafc] p-4 font-body">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-[440px]"
      >
        <Card className="bg-white border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[1.5rem] p-8 sm:p-12">
          <div className="flex flex-col items-center text-center space-y-6 mb-10">
            <div className="flex flex-col items-center gap-2">
              <Logo className="h-12 w-12 text-[#1e3a5f]" priority={true} />
              <div className="space-y-1">
                <h1 className="text-2xl font-black tracking-tight text-[#1e3a5f] leading-none">
                  Nyayguru
                </h1>
                <p className="text-[10px] font-medium text-slate-400 tracking-wide">
                  Legal intelligence for india
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-[#1e3a5f] tracking-tight">
                Welcome to nyayguru
              </h2>
              <p className="text-sm text-slate-400 font-medium">
                Sign in or create your account
              </p>
            </div>
          </div>

          <div className="space-y-8">
            <button className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-[#1e3a5f] transition-colors">
              <ChevronLeft className="h-3.5 w-3.5" />
              Back to passwordless
            </button>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2 text-left">
                  <Label htmlFor="email" className="text-sm font-bold text-[#1e3a5f]">Email</Label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1e3a5f] transition-colors">
                      <Mail className="h-4 w-4" />
                    </div>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading || isGoogleLoading}
                      className="h-12 pl-11 bg-white border-slate-200 rounded-xl focus:ring-offset-0 focus:ring-1 focus:ring-[#1e3a5f] focus:border-[#1e3a5f] font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2 text-left">
                  <Label htmlFor="password" className="text-sm font-bold text-[#1e3a5f]">Password</Label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1e3a5f] transition-colors">
                      <Lock className="h-4 w-4" />
                    </div>
                    <Input 
                      id="password" 
                      type={showPassword ? "text" : "password"} 
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading || isGoogleLoading}
                      className="h-12 pl-11 pr-12 bg-white border-slate-200 rounded-xl focus:ring-offset-0 focus:ring-1 focus:ring-[#1e3a5f] focus:border-[#1e3a5f] font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#1e3a5f] transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <div className="flex justify-end">
                    <button type="button" className="text-xs font-medium text-slate-400 hover:text-[#1e3a5f] transition-colors">
                      Forgot password?
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Button 
                  type="submit" 
                  disabled={isLoading || isGoogleLoading} 
                  className="w-full h-12 bg-[#1e3a5f] hover:bg-[#162d4a] text-white font-bold text-sm rounded-xl shadow-lg active:scale-[0.98] transition-all"
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin h-5 w-5" />
                  ) : (
                    "Continue"
                  )}
                </Button>

                <Button 
                  type="button"
                  variant="outline" 
                  onClick={handleGoogleLogin} 
                  disabled={isLoading || isGoogleLoading}
                  className="w-full h-12 border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-sm rounded-xl active:scale-[0.98] transition-all gap-3"
                >
                  {isGoogleLoading ? <Loader2 className="animate-spin h-5 w-5" /> : <GoogleIcon />}
                  Continue with google
                </Button>
              </div>
            </form>
          </div>
        </Card>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-400 font-medium">
            New to registry?{" "}
            <Link href="/register" className="text-[#1e3a5f] hover:underline font-bold ml-1">Enroll account</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
