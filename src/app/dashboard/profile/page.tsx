import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";

export default function ProfilePage() {
  return (
    <div>
      <PageHeader
        title="Profile & Settings"
        description="Manage your preferences and personal information."
      />
      <Card className="flex flex-col items-center justify-center text-center py-20">
        <CardHeader>
            <div className="mx-auto bg-primary/10 p-4 rounded-full">
                <User className="h-12 w-12 text-primary" />
            </div>
          <CardTitle className="mt-4 font-headline">Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground max-w-md">
            This section will allow you to change your language, manage notification settings, and control your data privacy.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
