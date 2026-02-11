import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search, FolderSearch } from "lucide-react";

export default function MyCasesPage() {
  const cases: any[] = []; // Empty array to show the empty state

  return (
    <div>
      <PageHeader
        title="Case Tracker"
        description="Manually add and track your cases."
      >
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Case
        </Button>
      </PageHeader>
      
      <Card>
        <CardHeader>
           <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by case title, number, or CNR..." className="pl-10" />
          </div>
        </CardHeader>
        <CardContent>
          {cases.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-20">
                <div className="mx-auto bg-muted p-4 rounded-full">
                    <FolderSearch className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="mt-6 text-xl font-semibold">No Cases Found</h3>
                <p className="mt-2 text-muted-foreground max-w-sm">
                    You haven&apos;t added any cases yet. Click &quot;Add New Case&quot; to get started.
                </p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Case items would be mapped here */}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
