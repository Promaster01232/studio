"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { BookOpen } from "lucide-react";

const GoogleIcon = () => (
    <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
      <path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512 111.3 512 0 400.7 0 264.1 0 127.5 111.3 16 244 16c73.4 0 134.3 29.3 181.4 73.2L376.3 149C342.3 118.3 298.3 96 244 96c-87.5 0-159.9 71.2-159.9 158.9 0 87.7 72.4 158.9 159.9 158.9 94.1 0 148.2-64.5 152.9-106.1H244v-91.4h244v91.4z"></path>
    </svg>
);

const AppleIcon = () => (
    <svg className="mr-2 h-5 w-5" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="apple" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
        <path fill="currentColor" d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C39.2 140.1 0 184.2 0 241.7c0 63.6 58.6 114.5 119.5 114.5 31.6 0 54.5-17.6 88.5-17.6 33.9 0 65.1 19.3 96.4 19.3 64.9 0 120.3-49.8 120.3-113.4.1-37.4-23.7-65.7-55.5-81.7zM245.2 107.5c13-13.8 20.9-31.5 20.9-50.6 0-17.2-10.7-32.9-28.5-32.9-21.3 0-35.5 15.1-45.7 31.1-12.7 20-20.9 43.1-20.9 66.2 0 21.3 10.7 37.1 28.5 37.1 20.1 0 36.6-16.2 45.7-31z"></path>
    </svg>
);

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-sm">
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
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Input id="email" type="email" placeholder="Email" required className="bg-muted/50 border-0" />
                    </div>
                    <div className="space-y-2">
                        <Input id="password" type="password" placeholder="Password" required className="bg-muted/50 border-0" />
                    </div>
                </div>

                <Button className="w-full font-semibold">LOG IN</Button>
                
                <div className="flex items-center justify-between text-sm">
                    <Link href="#" className="font-medium text-primary hover:underline">
                        Forgot Password?
                    </Link>
                    <Link href="/dashboard" className="text-muted-foreground hover:underline text-xs">
                        Skip for now →
                    </Link>
                </div>

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

                <div className="space-y-3">
                    <Button variant="outline" className="w-full">
                        <GoogleIcon />
                        Continue with Google
                    </Button>
                    <Button variant="outline" className="w-full">
                        <AppleIcon />
                        Continue with Apple
                    </Button>
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
