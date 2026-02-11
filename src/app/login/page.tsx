
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { BookOpen, Loader2 } from "lucide-react";
import { useAuth, useFirestore } from "@/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber, type ConfirmationResult } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

// This is to extend the window object for recaptcha
declare global {
    interface Window {
        recaptchaVerifier: RecaptchaVerifier;
        confirmationResult: ConfirmationResult;
    }
}


export default function LoginPage() {
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    if (!auth) return;
    if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          'size': 'invisible',
          'callback': () => {
            // reCAPTCHA solved
          }
        });
    }
  }, [auth]);

  const handlePhoneLogin = async () => {
    if (!auth || !phone) {
        toast({ variant: "destructive", title: "Error", description: "Please enter a phone number."});
        return;
    }
    setLoading(true);
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

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-sm">
        <div id="recaptcha-container"></div>
        <div className="mb-6 flex flex-col items-center text-center">
            <div className="mb-4 rounded-full bg-white p-3 shadow-sm">
                <BookOpen className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold font-headline tracking-tight">
                Nyaay Sathi
            </h1>
            <p className="text-muted-foreground">
                Your AI Legal Assistant
            </p>
        </div>
        <Card className="w-full shadow-lg">
            <CardContent className="p-6 space-y-4">
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
                                    className="bg-muted/50 border-0 pl-12"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    disabled={loading}
                                />
                            </div>
                        </div>
                        <Button className="w-full font-semibold" onClick={handlePhoneLogin} disabled={loading}>
                            {loading ? <Loader2 className="animate-spin"/> : "Send OTP"}
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
                                className="bg-muted/50 border-0"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <Button className="w-full font-semibold" onClick={handleOtpVerify} disabled={loading}>
                             {loading ? <Loader2 className="animate-spin"/> : "Verify OTP & Continue"}
                        </Button>
                        <Button variant="link" size="sm" onClick={() => setOtpSent(false)} disabled={loading}>Back</Button>
                    </div>
                )}
                
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">
                        OR
                        </span>
                    </div>
                </div>

                <div className="text-center text-sm">
                    <Link href="/dashboard" className="text-muted-foreground hover:underline text-xs">
                        Skip for now →
                    </Link>
                </div>

            </CardContent>
        </Card>
        <p className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="#" className="font-semibold text-primary hover:underline">
                Sign Up
            </Link>
        </p>
    </div>
  );
}
