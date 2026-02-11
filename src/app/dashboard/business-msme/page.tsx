import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase } from "lucide-react";

export default function BusinessMsmePage() {
  return (
    <div>
      <PageHeader
        title="Business & MSME Tools"
        description="Specialized legal tools for businesses and MSMEs."
      />
      <Card className="flex flex-col items-center justify-center text-center py-20">
        <CardHeader>
            <div className="mx-auto bg-primary/10 p-4 rounded-full">
                <Briefcase className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="mt-4 font-headline">Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground max-w-md">
            We are developing a suite of tools tailored for business and MSME legal needs. This section will be available soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
