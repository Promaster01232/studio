import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

export default function LearnPage() {
  return (
    <div>
      <PageHeader
        title="Legal Knowledge Hub"
        description="Learn your rights and understand common legal topics."
      />
      <Card className="flex flex-col items-center justify-center text-center py-20">
        <CardHeader>
            <div className="mx-auto bg-primary/10 p-4 rounded-full">
                <BookOpen className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="mt-4 font-headline">Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground max-w-md">
            We are building a comprehensive library of short articles, FAQs, and voice explainers to help you understand your rights. Stay tuned!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
