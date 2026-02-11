import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileSignature } from "lucide-react";

export default function BondGeneratorPage() {
  return (
    <div>
      <PageHeader
        title="Bond Generator"
        description="Generate various types of legal bonds."
      />
      <Card className="flex flex-col items-center justify-center text-center py-20">
        <CardHeader>
            <div className="mx-auto bg-primary/10 p-4 rounded-full">
                <FileSignature className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="mt-4 font-headline">Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground max-w-md">
            This feature to generate legal bonds is currently under development. Stay tuned!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
