import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Scale, FileText, Gavel, Shield, BookOpen, Search, Milestone } from "lucide-react";
import { Logo } from "@/components/logo";

const features = [
  {
    icon: <Search className="h-8 w-8 text-primary" />,
    title: "Understand Your Problem",
    description: "Get a simple explanation of your legal issue, relevant laws, and next steps.",
  },
  {
    icon: <Milestone className="h-8 w-8 text-primary" />,
    title: "Analyze Case Strength",
    description: "Our AI evaluates your case's strengths and weaknesses to guide your decisions.",
  },
  {
    icon: <FileText className="h-8 w-8 text-primary" />,
    title: "Draft Legal Documents",
    description: "Instantly generate complaints, notices, and applications in simple or legal English.",
  },
  {
    icon: <Shield className="h-8 w-8 text-primary" />,
    title: "Know Your Rights",
    description: "Access easy-to-understand guides on police and court procedures.",
  },
  {
    icon: <Gavel className="h-8 w-8 text-primary" />,
    title: "Connect with Lawyers",
    description: "Find and consult with verified lawyers near you for a fixed fee.",
  },
  {
    icon: <BookOpen className="h-8 w-8 text-primary" />,
    title: "Track Your Case",
    description: "Stay updated with hearing dates, document checklists, and reminders.",
  },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Logo />
        <Button asChild>
          <Link href="/dashboard">Launch App</Link>
        </Button>
      </header>
      <main className="flex-1">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 text-center">
          <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tighter mb-4">
            Justice for the Common Man
          </h1>
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground mb-8">
            AI Nyaya Mitra helps you understand the law, take the right action, and get the justice you deserve.
          </p>
          <Button size="lg" asChild className="font-semibold">
            <Link href="/dashboard">Get Started for Free</Link>
          </Button>
        </section>

        <section id="features" className="bg-card py-20 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-headline text-3xl md:text-4xl font-bold">A Digital Friend for Your Legal Journey</h2>
              <p className="max-w-2xl mx-auto text-muted-foreground mt-4">
                From understanding a complex notice to drafting a complaint, AI Nyaya Mitra simplifies every step.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="text-center border-2 hover:border-primary hover:shadow-lg transition-all">
                  <CardHeader className="items-center">
                    {feature.icon}
                    <CardTitle className="font-headline mt-4">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} AI Nyaya Mitra. All Rights Reserved.</p>
        <p className="text-sm mt-2">Disclaimer: This is a legal information tool, not legal advice. Always consult a qualified lawyer for your specific situation.</p>
      </footer>
    </div>
  );
}
