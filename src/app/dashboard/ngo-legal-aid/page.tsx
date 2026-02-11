import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HeartHandshake } from "lucide-react";

export default function NgoLegalAidPage() {
  return (
    <div>
      <PageHeader
        title="NGO & Legal Aid"
        description="Connect with NGOs and legal aid providers."
      />
      <Card className="flex flex-col items-center justify-center text-center py-20">
        <CardHeader>
            <div className="mx-auto bg-primary/10 p-4 rounded-full">
                <HeartHandshake className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="mt-4 font-headline">Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground max-w-md">
            A directory of NGOs and legal aid services is being compiled and will be available here soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
