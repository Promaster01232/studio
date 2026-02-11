
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Loader2, CheckCircle } from "lucide-react";
import { useAuth, useFirestore } from "@/firebase";
import { 
  RecaptchaVerifier, 
  signInWithPhoneNumber, 
  type ConfirmationResult,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

// This is to extend the window object for recaptcha
declare global {
    interface Window {
        recaptchaVerifier: RecaptchaVerifier;
        confirmationResult: ConfirmationResult;
    }
}

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
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const loginHeroImage = PlaceHolderImages.find(img => img.id === 'login-hero');

  useEffect(() => {
    if (!auth) return;
    
    if (!window.recaptchaVerifier) {
      const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': () => {
          // reCAPTCHA solved.
        }
      });
      window.recaptchaVerifier = verifier;
    }
    
    return () => {
        // window.recaptchaVerifier?.clear();
    };
  }, [auth]);

  const handlePhoneLogin = async () => {
    if (!auth || !phone) {
        toast({ variant: "destructive", title: "Error", description: "Please enter a phone number."});
        return;
    }
    setLoading(true);
    setAuthError(null);
    try {
        const verifier = window.recaptchaVerifier;
        
        const fullPhoneNumber = `+91${phone.trim()}`;
        
        const confirmationResult = await signInWithPhoneNumber(auth, fullPhoneNumber, verifier);
        window.confirmationResult = confirmationResult;
        setOtpSent(true);
        toast({ title: "OTP Sent", description: "An OTP has been sent to your phone."});
    } catch (error: any) {
        console.error("Phone auth error:", error);
        toast({ variant: "destructive", title: "Error sending OTP", description: error.message });
    } finally {
        setLoading(false);
    }
  };

  const handleOtpVerify = async () => {
    if (!otp) {
        toast({ variant: "destructive", title: "Error", description: "Please enter the OTP."});
        return;
    }
    setLoading(true);
    setAuthError(null);
    try {
        const result = await window.confirmationResult.confirm(otp);
        const user = result.user;

        if (!firestore) {
            throw new Error("Firestore not available");
        }

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
        console.error("OTP verification error:", error);
        toast({ variant: "destructive", title: "Invalid OTP", description: "The OTP you entered is incorrect. Please try again."});
        setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: GoogleAuthProvider | OAuthProvider) => {
    if (!auth || !firestore) return;
    setLoading(true);
    setAuthError(null);

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
          setAuthError(
              `To enable social sign-in, please add this domain to your Firebase project's authorized domains:\n\n${domain}\n\nYou can do this in the Firebase Console under:\nAuthentication > Settings > Authorized domains.`
          );
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
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
       <div id="recaptcha-container"></div>
      {/* Left side */}
      <div className="hidden md:flex flex-col justify-center bg-cyan-50 dark:bg-cyan-900/20 p-12 relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-4xl lg:text-5xl font-bold font-headline mb-4 text-gray-800 dark:text-gray-200">Simplifying Legal Aid</h1>
          <div className="w-24 h-1.5 bg-primary mb-8"></div>
          <ul className="space-y-4 text-lg text-gray-700 dark:text-gray-300">
            <li className="flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-primary" />
              <span>AI-Powered Consultations</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-primary" />
              <span>Document Generation</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-primary" />
              <span>Case Tracking</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-primary" />
              <span>Expert Legal Network</span>
            </li>
          </ul>
        </div>
        {loginHeroImage && (
            <div className="absolute -bottom-8 -right-8 w-80 h-80 lg:w-[28rem] lg:h-[28rem]">
            <Image
              src={loginHeroImage.imageUrl}
              alt={loginHeroImage.description}
              data-ai-hint={loginHeroImage.imageHint}
              fill
              className="object-contain"
            />
          </div>
        )}
      </div>

      {/* Right side */}
      <div className="flex items-center justify-center bg-gray-50 dark:bg-background p-4">
        <div className="w-full max-w-sm space-y-6">
            <div className="flex flex-col items-center text-center">
                <Image src="https://storage.googleapis.com/project-os-screenshot/1770932454559/image.png" alt="Nyaya Sahayak Logo" width={596} height={524} className="h-24 w-auto mb-2 dark:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
                <p className="font-semibold text-muted-foreground tracking-widest">
                    YOUR AI LEGAL ASSISTANT
                </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow-lg">
                {authError && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertTitle>Configuration Required</AlertTitle>
                        <AlertDescription className="whitespace-pre-wrap text-xs">{authError}</AlertDescription>
                    </Alert>
                )}
                {!otpSent ? (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <span className="text-muted-foreground sm:text-sm">+91</span>
                                </div>
                                <Input 
                                    id="phone" 
                                    type="tel" 
                                    placeholder="xxxxxxxxxx" 
                                    required 
                                    className="bg-muted/30 pl-12"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    disabled={loading}
                                />
                            </div>
                        </div>
                        <Button className="w-full font-semibold bg-gradient-to-r from-primary to-blue-500 hover:opacity-90 text-white" onClick={handlePhoneLogin} disabled={loading}>
                            {loading && !otpSent ? <Loader2 className="animate-spin"/> : "Send OTP"}
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                         <div className="space-y-2">
                            <Label htmlFor="otp">Enter OTP</Label>
                            <Input 
                                id="otp" 
                                type="text" 
                                placeholder="6-digit code" 
                                required 
                                className="bg-muted/30"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <Button className="w-full font-semibold bg-gradient-to-r from-primary to-blue-500 hover:opacity-90 text-white" onClick={handleOtpVerify} disabled={loading}>
                             {loading ? <Loader2 className="animate-spin"/> : "Verify OTP & Continue"}
                        </Button>
                        <Button variant="link" size="sm" onClick={() => setOtpSent(false)} disabled={loading}>Back</Button>
                    </div>
                )}
                
                <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">
                        OR
                        </span>
                    </div>
                </div>

                <div className="space-y-2">
                    <Button variant="outline" className="w-full font-semibold bg-[#EA4335] hover:bg-[#D93F31] text-white border-none" onClick={handleGoogleLogin} disabled={loading}>
                        <GoogleIcon className="mr-2 h-4 w-4" />
                        Continue with Google
                    </Button>
                    <Button variant="outline" className="w-full font-semibold bg-black hover:bg-gray-800 text-white border-none" onClick={handleAppleLogin} disabled={loading}>
                        <AppleIcon className="mr-2 h-4 w-4 fill-current" />
                        Continue with Apple
                    </Button>
                </div>
            </div>

            <p className="mt-6 text-center text-xs text-muted-foreground px-8">
                By continuing, you agree to our{' '}
                <Link href="#" className="underline underline-offset-4 hover:text-primary">
                    Terms of Service
                </Link>
                {' '}and{' '}
                <Link href="#" className="underline underline-offset-4 hover:text-primary">
                    Privacy Policy
                </Link>
                .
            </p>
        </div>
      </div>
    </div>
  );
}
