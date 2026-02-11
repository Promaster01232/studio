import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";

export default function WelcomePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-transparent p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardContent className="flex flex-col items-center p-8 text-center">
          <div className="mb-6 rounded-full bg-primary/10 p-4">
            <BookOpen className="h-10 w-10 text-primary" />
          </div>
          <h1 className="mb-4 text-3xl font-bold font-headline tracking-tight">
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
          <Button asChild size="lg">
            <Link href="/login">
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
