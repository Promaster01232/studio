"use client";

import { useFormState } from "react-dom";
import { generateDocumentAction, type DocumentGeneratorState } from "./actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Download, Share2, Printer } from "lucide-react";

const initialState: DocumentGeneratorState = {
  status: "idle",
  data: null,
  error: null,
};

export default function DocumentGeneratorPage() {
  const [state, formAction] = useFormState(generateDocumentAction, initialState);

  return (
    <div>
      <PageHeader
        title="Complaint & Application Generator"
        description="Instantly create legal documents by providing a few key details."
      />
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Document Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={formAction} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="documentType">Document Type</Label>
                  <Select name="documentType" required>
                    <SelectTrigger id="documentType">
                      <SelectValue placeholder="Select a document type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Police Complaint">Police Complaint</SelectItem>
                      <SelectItem value="FIR Application">FIR Application</SelectItem>
                      <SelectItem value="Legal Notice">Legal Notice</SelectItem>
                      <SelectItem value="Consumer Complaint">Consumer Complaint</SelectItem>
                      <SelectItem value="RTI Application">RTI Application</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select name="language" defaultValue="Simple English" required>
                    <SelectTrigger id="language">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Simple English">Simple English</SelectItem>
                      <SelectItem value="Legal English">Legal English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="details">Case Details</Label>
                  <Textarea id="details" name="details" placeholder="Provide all necessary facts, names, dates, and locations for the document." rows={10} required />
                </div>
                <Button type="submit" disabled={state.status === "loading"} className="w-full">
                  {state.status === "loading" ? "Generating..." : "Generate Document"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Generated Document</CardTitle>
                {state.status === "success" && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm"><Download className="mr-2 h-4 w-4" /> PDF</Button>
                    <Button variant="outline" size="sm"><Share2 className="mr-2 h-4 w-4" /> Share</Button>
                    <Button variant="outline" size="sm"><Printer className="mr-2 h-4 w-4" /> Print</Button>
                  </div>
                )}
              </div>
              <CardDescription>Review the document below. You can copy the text or use the actions above.</CardDescription>
            </CardHeader>
            <CardContent>
              {state.status === 'loading' && <p className="text-muted-foreground">Generating your document, please wait...</p>}
              {state.status === "error" && (
                <Alert variant="destructive">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{state.error}</AlertDescription>
                </Alert>
              )}
              {state.status === 'success' && state.data && (
                <div className="prose dark:prose-invert prose-sm max-w-none p-4 border rounded-md bg-background h-[60vh] overflow-y-auto">
                    <pre className="whitespace-pre-wrap font-body text-foreground">{state.data.document}</pre>
                </div>
              )}
               {state.status === 'idle' && <p className="text-center text-muted-foreground py-20">Your generated document will appear here.</p>}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
