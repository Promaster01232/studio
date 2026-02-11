import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export default function WelcomePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-indigo-100/20 to-background p-4 dark:via-indigo-900/10">
      <Card className="w-full max-w-md shadow-lg bg-card/60 backdrop-blur-sm border-primary/20 overflow-hidden">
        <CardContent className="flex flex-col items-center p-8 text-center">
          <div className="relative mb-6">
            <div className="absolute -inset-2 rounded-full bg-primary/10 animate-pulse [animation-duration:4s]"></div>
            <Image src="https://storage.googleapis.com/project-os-screenshot/1770932454559/image.png" alt="Nyaya Sahayak Logo" width={596} height={524} className="h-36 w-auto relative dark:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
          </div>

          <h1 className="text-4xl font-bold font-headline mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-animated-gradient bg-[200%_auto]">
            Nyaya Sahayak
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
