import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, FileText, Calendar, Gavel } from "lucide-react";

const cases = [
  {
    id: "CASE001",
    title: "Property Dispute vs. Sharma Builders",
    type: "Civil",
    status: "Evidence Stage",
    nextHearing: "2024-08-15",
    timeline: [
      { date: "2024-07-20", event: "Final arguments heard.", icon: Gavel },
      { date: "2024-06-10", event: "Evidence submitted by plaintiff.", icon: FileText },
      { date: "2024-05-05", event: "Charges framed.", icon: Gavel },
      { date: "2024-04-01", event: "First hearing completed.", icon: Calendar },
      { date: "2024-03-15", event: "Petition filed.", icon: FileText },
    ],
  },
  {
    id: "CASE002",
    title: "Cheque Bounce Notice to RK Enterprises",
    type: "Criminal",
    status: "Notice Sent",
    nextHearing: "2024-09-02",
    timeline: [
      { date: "2024-07-25", event: "Legal notice sent via registered post.", icon: FileText },
      { date: "2024-07-22", event: "Drafted legal notice for cheque bounce.", icon: FileText },
    ],
  },
];

export default function MyCasesPage() {
  return (
    <div>
      <PageHeader
        title="My Cases"
        description="Track all your ongoing legal matters and important dates."
      >
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Case
        </Button>
      </PageHeader>
      
      <div className="space-y-8">
        {cases.map((caseItem) => (
          <Card key={caseItem.id}>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                <div>
                  <CardTitle className="font-headline">{caseItem.title}</CardTitle>
                  <CardDescription>Case ID: {caseItem.id}</CardDescription>
                </div>
                <div className="flex gap-2 items-center">
                   <Badge variant={caseItem.type === 'Civil' ? 'default' : 'destructive'} className="bg-primary/10 text-primary">{caseItem.type}</Badge>
                   <Badge variant="secondary">{caseItem.status}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-6 p-4 border-l-4 border-accent bg-accent/10 rounded-r-md">
                <p className="font-semibold text-accent-foreground">Next Hearing Date</p>
                <p className="text-lg font-bold text-accent-foreground">{new Date(caseItem.nextHearing).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>

              <h3 className="font-semibold mb-4 font-headline">Case Timeline</h3>
              <div className="relative pl-6">
                <div className="absolute left-0 top-0 h-full w-0.5 bg-border -translate-x-1/2 ml-3"></div>
                {caseItem.timeline.map((event, index) => (
                  <div key={index} className="relative mb-6">
                    <div className="absolute left-0 top-1 w-6 h-6 bg-background rounded-full flex items-center justify-center -translate-x-1/2">
                      <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                         <event.icon className="h-3 w-3 text-primary-foreground" />
                      </div>
                    </div>
                    <div className="pl-8">
                      <p className="font-semibold">{event.event}</p>
                      <p className="text-sm text-muted-foreground">{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
