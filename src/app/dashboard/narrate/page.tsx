"use client";

import { useFormState } from "react-dom";
import { summarizeCaseAction, type CaseSummaryState } from "./actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, Send, Bot, FileText, Scale, Landmark, StepForward } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const initialState: CaseSummaryState = {
  status: "idle",
  data: null,
  error: null,
};

export default function NarrateProblemPage() {
  const [state, formAction] = useFormState(summarizeCaseAction, initialState);

  return (
    <div>
      <PageHeader
        title="Understand Your Legal Problem"
        description="Describe your situation below, and our AI will provide a simplified summary and initial guidance."
      />

      <Card className="mb-8">
        <CardContent className="p-4">
          <form action={formAction} className="space-y-4">
            <Textarea
              name="problemDescription"
              placeholder="Start describing your legal problem here. For example: 'My tenant has not paid rent for 3 months...' or 'I was sold a defective product...'"
              rows={8}
              required
              className="text-base"
            />
            <div className="flex justify-between items-center">
              <Button type="button" variant="outline">
                <Mic className="mr-2 h-4 w-4" />
                Speak Your Problem
              </Button>
              <Button type="submit" disabled={state.status === "loading"}>
                {state.status === "loading" ? "Analyzing..." : "Analyze Problem"}
                <Send className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      
      {state.status === "error" && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      {state.status === "success" && state.data && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><Bot className="mr-2" /> AI Case Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{state.data.caseSummary}</p>
            </CardContent>
          </Card>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center"><Scale className="mr-2" /> Case Type</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold">{state.data.caseType}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center"><FileText className="mr-2" /> Relevant Laws</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{state.data.relevantLaws}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center"><Landmark className="mr-2" /> Jurisdiction</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{state.data.jurisdiction}</p>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><StepForward className="mr-2" /> Next Actions</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-muted-foreground whitespace-pre-line">{state.data.nextActions}</div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
