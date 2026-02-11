"use client";

import { useActionState, useEffect, useState } from "react";
import { analyzeCaseStrengthAction, type CaseStrengthState } from "./actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Lightbulb, Loader2, ShieldAlert, Sparkles } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const initialState: CaseStrengthState = {
  status: "idle",
  data: null,
  error: null,
};

export default function StrengthAnalyzerPage() {
  const [state, formAction] = useActionState(analyzeCaseStrengthAction, initialState);
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
        description="Describe your case to get an AI-powered strength assessment."
      />
      <Card>
        <CardHeader>
          <CardTitle>Case Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="caseDescription">Case Description</Label>
              <Textarea id="caseDescription" name="caseDescription" placeholder="Provide a detailed description of your case, including all relevant information, people involved, dates, and any available evidence." rows={8} required />
            </div>
            
            <div className="space-y-2">
                <Label htmlFor="language">Response Language</Label>
                <Select name="language" defaultValue="English" required>
                <SelectTrigger id="language">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Hindi">Hindi</SelectItem>
                </SelectContent>
                </Select>
            </div>

            <Button type="submit" disabled={state.status === 'loading'} className="w-full md:w-auto">
              {state.status === 'loading' ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Assessing...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Assess Strength
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      {state.status === 'loading' && (
        <Card className="mt-8">
            <CardContent className="py-20 text-center">
                <p className="text-muted-foreground">Assessing case strength, please wait...</p>
            </CardContent>
        </Card>
      )}

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

      {state.status === 'idle' && (
         <Card className="mt-8">
            <CardContent className="py-20 text-center">
                <p className="text-muted-foreground">Your case strength analysis will appear here.</p>
            </CardContent>
        </Card>
      )}

    </div>
  );
}
