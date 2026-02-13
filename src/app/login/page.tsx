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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
        <title>Google</title>
        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.05 1.05-2.36 1.62-4.38 1.62-3.82 0-6.94-3.1-6.94-6.94s3.12-6.94 6.94-6.94c2.2 0 3.59.88 4.41 1.66l2.32-2.32C17.46 2.76 15.22 1.5 12.48 1.5c-5.73 0-10.44 4.6-10.44 10.44s4.71 10.44 10.44 10.44c5.9 0 10.12-3.97 10.12-10.12 0-.75-.08-1.47-.2-2.18z"/>
    </svg>
);

const AppleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
        <title>Apple</title>
        <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.048-3.833 1.2-4.822 3.024-2.145 3.934-.623 9.72 1.638 12.96.995 1.39 2.16 3.104 3.766 3.104 1.554 0 2.064-1.025 3.935-1.025s2.31.995 3.88.995c1.638 0 2.722-1.68 3.68-3.05.96-1.343 1.42-2.636 1.45-2.71-.05-.02-3.3-1.22-3.32-5.062-.02-3.41 2.56-4.942 2.71-5.11-.73-.92-1.84-1.45-2.97-1.5-.78-.05-1.53.16-2.21.48-.65.29-1.27.78-1.73.78zM15.42 4.394c.903-1.163 1.5-2.662 1.32-4.394-.02.02-.02.02 0 0-1.554.08-3.23.95-4.22 2.163-.83.996-1.612 2.495-1.4 4.09.02-.02.02-.02 0 0 1.637-.02 3.3-1.01 4.3-1.86z"/>
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

  const handleEmailLogin = async () => {
    if (!auth || !email || !password) {
        toast({ variant: "destructive", title: "Error", description: "Please enter both email and password."});
        return;
    }
    setLoading(true);
    setDomainError(null);
    try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        const user = result.user;

        if (!firestore) throw new Error("Firestore not available");
        
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
    if (!auth || !firestore) return;
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
  const handleAppleLogin = () => handleSocialLogin(new OAuthProvider('apple.com'));

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {domainError && (
            <Alert variant="destructive" className="mb-4">
                <AlertTitle>Configuration Required</AlertTitle>
                <AlertDescription className="text-xs space-y-2">
                  <p>To enable social sign-in, please add this domain to your Firebase project's authorized domains:</p>
                  <p className="font-mono bg-black/20 p-2 rounded-md text-destructive-foreground break-all">{domainError}</p>
                  <Button asChild size="sm" className="mt-2 w-full !bg-destructive-foreground !text-destructive">
                      <a href="https://console.firebase.google.com/project/ai-naya-shahayak/authentication/settings" target="_blank" rel="noopener noreferrer">
                          Open Firebase Auth Settings
                      </a>
                  </Button>
                </AlertDescription>
            </Alert>
        )}
        
        <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link href="#" className="ml-auto inline-block text-sm underline">
                  Forgot your password?
                </Link>
              </div>
              <Input 
                id="password" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
            <Button type="submit" className="w-full" onClick={handleEmailLogin} disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : "Login"}
            </Button>
        </div>
        
        <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                Or continue with
                </span>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" className="w-full" onClick={handleGoogleLogin} disabled={loading}>
                <GoogleIcon className="mr-2 h-4 w-4" />
                Google
            </Button>
            <Button variant="outline" className="w-full" onClick={handleAppleLogin} disabled={loading}>
                <AppleIcon className="mr-2 h-4 w-4 fill-current" />
                Apple
            </Button>
        </div>
         <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
