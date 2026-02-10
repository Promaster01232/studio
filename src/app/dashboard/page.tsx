import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Users, FileText, Mic, Paperclip } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function DashboardHomePage() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto -mx-4 -mt-4 px-4 pt-4 md:-mx-6 md:-mt-6 md:px-6 md:pt-6 lg:-mx-8 lg:-mt-8 lg:px-8 lg:pt-8">
        {/* Hero Section */}
        <section className="mb-6 rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 p-6 md:p-8 text-white shadow-2xl shadow-blue-900/20">
          <h1 className="text-3xl md:text-4xl font-bold font-headline mb-2">
            Legal Empowerment at Your Fingertips
          </h1>
          <p className="text-md md:text-lg text-blue-200 mb-6">
            Welcome back, User. Your AI-powered legal assistant is ready to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg">
              <Link href="/dashboard/lawyer-connect">
                <Users className="mr-2" /> Find a Lawyer
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-blue-300 text-blue-100 hover:bg-white/10 hover:text-white">
              <Link href="/dashboard/document-generator">
                <FileText className="mr-2" /> Generate a Document
              </Link>
            </Button>
          </div>
        </section>

        {/* Daily Legal Fact */}
        <section className="mb-6">
          <Card className="bg-sky-100 dark:bg-sky-900/30 border-sky-200 dark:border-sky-800">
            <CardHeader className="flex-row items-center gap-4 pb-2">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-sky-500 text-white flex-shrink-0">
                <span className="font-bold text-3xl font-serif -mt-2 transform -rotate-6">“</span>
              </div>
              <div>
                <CardTitle className="text-sky-900 dark:text-sky-100 font-headline text-lg">Daily Legal Fact</CardTitle>
                <CardDescription className="text-sky-700 dark:text-sky-300">A small dose of legal knowledge.</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <blockquote className="text-md text-sky-800 dark:text-sky-200">
                "Under the Motor Vehicles Act, a policeman cannot take your vehicle's key without your permission."
              </blockquote>
              <p className="text-right text-sm text-sky-600 dark:text-sky-400 mt-2">- Motor Vehicles Act, 1988</p>
            </CardContent>
          </Card>
        </section>
      </div>

      {/* Input Section */}
      <section className="shrink-0 bg-background py-2 -mx-4 -mb-4 px-4 md:-mx-6 md:-mb-6 md:px-6 lg:-mx-8 lg:-mb-8 lg:px-8 border-t">
         <div className="max-w-3xl mx-auto">
             <Card className="p-2 shadow-lg border-2 border-primary/20">
                <div className="flex items-center gap-2">
                    <Input type="text" placeholder="Narrate your problem or ask a question..." className="flex-1 bg-transparent focus:outline-none px-2 border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-base" />
                    <Button size="icon" variant="ghost" className="text-muted-foreground">
                        <Paperclip />
                    </Button>
                    <Button size="icon" className="rounded-lg">
                        <Mic />
                    </Button>
                </div>
            </Card>
        </div>
      </section>
    </div>
  );
}
