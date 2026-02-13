import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";
import { Logo } from "@/components/logo";

export default function WelcomePage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md overflow-hidden">
        <CardContent className="flex flex-col items-center p-8 text-center">
          <div className="relative mb-6 flex h-24 w-24 items-center justify-center">
            <div className="absolute -inset-2 rounded-full bg-primary/10 animate-pulse [animation-duration:4s] [animation-delay:1s]"></div>
             <div className="absolute -inset-4 rounded-full bg-primary/10 animate-pulse [animation-duration:4s]"></div>
            <Logo />
          </div>

          <h1 className="text-4xl font-bold font-headline mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-animated-gradient bg-[200%_auto]">
            Nyaya Sahayak
          </h1>

          <p className="mb-8 text-muted-foreground">
            Your AI-powered legal assistant for a modern world. Clarity and confidence in navigating the legal system.
          </p>
          
          <Button asChild size="lg" className="group w-full shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300">
            <Link href="/login">
              Get Started <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
           <p className="mt-8 text-xs text-muted-foreground">
            To provide the best experience, some features may request browser permissions, such as microphone access for voice-based input.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
