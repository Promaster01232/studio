"use client";

import { useActionState, useRef, useState } from "react";
import { understandDocumentAction, type DocumentIntelligenceState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FileUp, Bot, AlertTriangle, CalendarClock, ListChecks, Bomb } from "lucide-react";

const initialState: DocumentIntelligenceState = {
  status: "idle",
  data: null,
  error: null,
};

export default function DocumentIntelligencePage() {
  const [state, formAction] = useActionState(understandDocumentAction, initialState);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  return (
    <div>
      <PageHeader
        title="Document Intelligence"
        description="Upload a legal document to have AI explain it in simple terms."
      />

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Upload Your Document</CardTitle>
              <CardDescription>Supports PDF, DOCX, and image files.</CardDescription>
            </CardHeader>
            <CardContent>
              <form action={formAction} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="document">Document File</Label>
                  <Input 
                    id="document" 
                    name="document" 
                    type="file" 
                    required 
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    accept=".pdf,.doc,.docx,image/*"
                  />
                  {fileName && <p className="text-sm text-muted-foreground">Selected file: {fileName}</p>}
                </div>
                <Button type="submit" disabled={state.status === "loading"} className="w-full">
                   <FileUp className="mr-2 h-4 w-4" />
                  {state.status === "loading" ? "Analyzing Document..." : "Upload and Analyze"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center"><Bot className="mr-2" /> AI Analysis</CardTitle>
              <CardDescription>The explanation of your document will appear below.</CardDescription>
            </CardHeader>
            <CardContent>
              {state.status === 'loading' && <p className="text-muted-foreground">Analyzing your document, please wait...</p>}
              {state.status === "error" && (
                <Alert variant="destructive">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{state.error}</AlertDescription>
                </Alert>
              )}
              {state.status === "success" && state.data && (
                <div className="space-y-4 text-sm">
                  <div className="p-3 bg-background rounded-lg border">
                    <h3 className="font-semibold mb-1">Simple Summary</h3>
                    <p className="text-muted-foreground">{state.data.summary}</p>
                  </div>
                  <div className="p-3 bg-background rounded-lg border">
                    <h3 className="font-semibold mb-1 flex items-center"><AlertTriangle className="mr-2 text-destructive" /> Legal Risks</h3>
                    <p className="text-muted-foreground">{state.data.legalRisks}</p>
                  </div>
                  <div className="p-3 bg-background rounded-lg border">
                    <h3 className="font-semibold mb-1 flex items-center"><CalendarClock className="mr-2 text-accent-foreground"/> Deadlines</h3>
                    <p className="text-muted-foreground">{state.data.deadlines}</p>
                  </div>
                   <div className="p-3 bg-background rounded-lg border">
                    <h3 className="font-semibold mb-1 flex items-center"><ListChecks className="mr-2 text-primary" /> Required Actions</h3>
                    <p className="text-muted-foreground">{state.data.requiredActions}</p>
                  </div>
                  <div className="p-3 bg-background rounded-lg border">
                    <h3 className="font-semibold mb-1 flex items-center"><Bomb className="mr-2 text-destructive"/> Consequences of Ignoring</h3>
                    <p className="text-muted-foreground">{state.data.consequences}</p>
                  </div>
                </div>
              )}
              {state.status === 'idle' && <p className="text-center text-muted-foreground py-20">Upload a document to see the analysis.</p>}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
