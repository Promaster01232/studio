"use client";

import { useFormState } from "react-dom";
import { analyzeCaseStrengthAction, type CaseStrengthState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Lightbulb, ListChecks, ShieldAlert } from "lucide-react";
import { useEffect, useState } from "react";

const initialState: CaseStrengthState = {
  status: "idle",
  data: null,
  error: null,
};

export default function StrengthAnalyzerPage() {
  const [state, formAction] = useFormState(analyzeCaseStrengthAction, initialState);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (state.status === "success" && state.data) {
      const timer = setTimeout(() => setProgress(state.data!.strengthScore), 500);
      return () => clearTimeout(timer);
    }
  }, [state]);

  const getStrengthColor = (score: number) => {
    if (score <= 30) return "bg-red-500";
    if (score <= 65) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthText = (score: number) => {
    if (score <= 30) return "Weak";
    if (score <= 65) return "Moderate";
    return "Strong";
  };

  return (
    <div>
      <PageHeader
        title="Case Strength Analyzer"
        description="Fill in the details to get an AI-powered analysis of your case's strength."
      />
      <Card>
        <CardHeader>
          <CardTitle>Case Details</CardTitle>
          <CardDescription>The more details you provide, the more accurate the analysis will be.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="problemNarration">Problem Narration</Label>
              <Textarea id="problemNarration" name="problemNarration" placeholder="Describe the sequence of events in detail." rows={6} required />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="evidenceAvailability">Evidence Availability</Label>
                <Textarea id="evidenceAvailability" name="evidenceAvailability" placeholder="List all available evidence (e.g., photos, documents, witnesses)." required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="jurisdiction">Jurisdiction</Label>
                <Input id="jurisdiction" name="jurisdiction" placeholder="e.g., Police Station Name, City Court" required />
              </div>
            </div>
             <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="relevantLaws">Relevant Laws (Optional)</Label>
                <Input id="relevantLaws" name="relevantLaws" placeholder="e.g., Section 420 IPC" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pastJudgments">Similar Past Judgments (Optional)</Label>
                <Input id="pastJudgments" name="pastJudgments" placeholder="If you know of any similar cases." />
              </div>
            </div>
            <Button type="submit" disabled={state.status === 'loading'} className="w-full md:w-auto">
              {state.status === 'loading' ? 'Analyzing...' : 'Analyze Case Strength'}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      {state.status === "error" && (
        <Alert variant="destructive" className="mt-8">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      {state.status === "success" && state.data && (
        <Card className="mt-8">
            <CardHeader>
                <CardTitle>Analysis Result</CardTitle>
                 <Alert variant="default" className="bg-accent/50 border-accent">
                    <AlertDescription>
                    <strong>Disclaimer:</strong> This is an AI-generated analysis for decision support only and does not constitute legal advice.
                    </AlertDescription>
                </Alert>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="text-center">
                    <p className="text-sm font-medium text-muted-foreground">Overall Case Strength</p>
                    <div className="flex items-center justify-center gap-4 my-2">
                        <span className={`text-3xl font-bold ${getStrengthColor(state.data.strengthScore).replace('bg-', 'text-')}`}>{getStrengthText(state.data.strengthScore)}</span>
                        <span className="text-5xl font-bold font-mono">{state.data.strengthScore}%</span>
                    </div>
                    <Progress value={progress} className="h-3" indicatorClassName={getStrengthColor(state.data.strengthScore)} />
                </div>
                
                <div className="p-4 bg-background rounded-lg border">
                    <h3 className="font-semibold mb-2">Summary</h3>
                    <p className="text-sm text-muted-foreground">{state.data.summary}</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <h3 className="font-semibold flex items-center"><ShieldAlert className="mr-2 text-destructive"/> Risk Indicators</h3>
                        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                            {state.data.riskIndicators.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-semibold flex items-center"><Lightbulb className="mr-2 text-primary"/> Recommended Actions</h3>
                        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                            {state.data.recommendedActions.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                    </div>
                </div>

            </CardContent>
        </Card>
      )}

    </div>
  );
}
