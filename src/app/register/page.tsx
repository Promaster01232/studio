"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth, useFirestore } from "@/firebase";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Logo } from "@/components/logo";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function RegisterPage() {
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const heroImage = PlaceHolderImages.find(img => img.id === 'login-hero');

  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !mobileNumber || !password || !confirmPassword) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all fields.",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords do not match",
        description: "Please make sure your passwords match.",
      });
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await sendEmailVerification(user);

      const userProfile = {
        uid: user.uid,
        firstName,
        lastName,
        email,
        mobileNumber,
        userType: "citizen",
      };

      await setDoc(doc(firestore, "users", user.uid), userProfile);

      toast({
        title: "Account Created!",
        description: "A verification email has been sent. Please check your inbox and verify your account to log in.",
      });
      router.push("/login");

    } catch (error: any) {
      console.error("Registration error:", error);
      let errorMessage = "An unknown error occurred. Please try again.";
      if (error.code === 'auth/email-already-in-use') {
          errorMessage = "This email is already in use. Please login instead.";
      } else if (error.code === 'auth/weak-password') {
          errorMessage = "The password is too weak. Please use at least 6 characters.";
      }
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl grid md:grid-cols-2 overflow-hidden p-0">
      <div className="p-8 flex flex-col justify-center">
        <div className="flex items-center gap-3 mb-6">
            <Logo />
            <h1 className="text-2xl font-bold font-headline">Nyaya Sahayak</h1>
        </div>
        <h2 className="text-3xl font-bold">Create an Account</h2>
        <p className="text-muted-foreground mt-2 mb-8">
          Enter your information to create an account.
        </p>
        <CardContent className="p-0">
            <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                <Label htmlFor="first-name">First name</Label>
                <Input id="first-name" placeholder="Max" required value={firstName} onChange={(e) => setFirstName(e.target.value)} disabled={loading} />
                </div>
                <div className="grid gap-2">
                <Label htmlFor="last-name">Last name</Label>
                <Input id="last-name" placeholder="Robinson" required value={lastName} onChange={(e) => setLastName(e.target.value)} disabled={loading} />
                </div>
            </div>
            <div className="grid gap-2">
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
            <div className="grid gap-2">
                <Label htmlFor="mobile-number">Mobile Number</Label>
                <Input
                id="mobile-number"
                type="tel"
                placeholder="Your mobile number"
                required
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                disabled={loading}
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input id="confirm-password" type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={loading} />
                </div>
            </div>
            <Button type="submit" className="w-full" onClick={handleRegister} disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : "Create an account"}
            </Button>
            </div>
            <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline">
                Sign in
            </Link>
            </div>
        </CardContent>
      </div>
      <div className="hidden md:block relative">
        {heroImage && (
            <Image 
                src={heroImage.imageUrl}
                alt={heroImage.description}
                fill
                className="object-cover"
                data-ai-hint={heroImage.imageHint}
            />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent"></div>
      </div>
    </Card>
  );
}
