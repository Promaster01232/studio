import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import Link from "next/link";

export default function GitHubPage() {
  return (
    <div>
      <PageHeader
        title="GitHub"
        description="View the source code, contribute, or report issues."
      />
      <Card className="flex flex-col items-center justify-center text-center py-20">
        <CardHeader>
            <div className="mx-auto bg-primary/10 p-4 rounded-full">
                <Github className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="mt-4 font-headline">Open Source</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground max-w-md">
            Nyaay Sathi is an open-source project. We welcome contributions from the community.
          </p>
          <Button asChild>
            <Link href="https://github.com" target="_blank" rel="noopener noreferrer">
              <Github className="mr-2 h-4 w-4" />
              Visit GitHub Repository
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
