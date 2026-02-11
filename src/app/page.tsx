import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";

export default function WelcomePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-indigo-100/20 to-background p-4 dark:via-indigo-900/10">
      <Card className="w-full max-w-md shadow-lg bg-card/80 backdrop-blur-sm border-primary/10">
        <CardContent className="flex flex-col items-center p-8 text-center">
          <div className="relative mb-8">
             <div className="absolute -inset-2.5 rounded-full bg-primary/20 animate-ping" />
             <div className="relative rounded-full bg-primary/10 p-4">
                <BookOpen className="h-10 w-10 text-primary" />
             </div>
          </div>

          <h1 className="mb-4 text-4xl font-bold font-headline tracking-tight bg-gradient-to-r from-primary via-accent to-primary bg-[200%_auto] bg-clip-text text-transparent animate-animated-gradient">
            Welcome to Nyaay Sathi
          </h1>
          <p className="mb-4 text-muted-foreground">
            Your AI-powered legal assistant. We're here to help you understand
            legal documents, assess your case strength, and navigate the legal
            system with confidence.
          </p>
          <p className="mb-8 text-xs text-muted-foreground">
            To provide the best experience, some features may request browser
            permissions, such as microphone access for voice-based input. Your
            privacy is important to us.
          </p>
          <Button asChild size="lg" className="group shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300">
            <Link href="/login">
              Get Started <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
