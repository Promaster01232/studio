"use client";

import { useActionState, useState } from "react";
import { generateDocumentAction, type DocumentGeneratorState } from "./actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Download, Share2, Printer, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";

const initialState: DocumentGeneratorState = {
  status: "idle",
  data: null,
  error: null,
};

const FormSectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h3 className="text-lg font-semibold mt-6 mb-4 pt-4 border-t">{children}</h3>
);

export default function DocumentGeneratorPage() {
  const [state, formAction] = useActionState(generateDocumentAction, initialState);
  const [documentType, setDocumentType] = useState("Legal Notice");

  return (
    <div className="space-y-8">
      <PageHeader
        title="Document Generator"
        description="Draft legal documents instantly."
      />
      
      <Card>
        <CardHeader>
          <CardTitle>Details for {documentType}</CardTitle>
          <CardDescription>Fill in the details to generate your legal document.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="documentType">Document Type</Label>
              <Select name="documentType" required value={documentType} onValueChange={setDocumentType}>
                <SelectTrigger id="documentType">
                  <SelectValue placeholder="Select a document type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Legal Notice">Legal Notice</SelectItem>
                  <SelectItem value="Police Complaint">Police Complaint</SelectItem>
                  <SelectItem value="FIR Application">FIR Application</SelectItem>
                  <SelectItem value="Consumer Complaint">Consumer Complaint</SelectItem>
                  <SelectItem value="RTI Application">RTI Application</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Conditional Fields */}
            {documentType === 'Legal Notice' && (
                <>
                    <FormSectionTitle>Sender&apos;s Details</FormSectionTitle>
                    <div className="space-y-2">
                        <Label htmlFor="senderName">Sender Name</Label>
                        <Input id="senderName" name="senderName" placeholder="Full name of the sender" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="senderMobile">Sender Mobile No. (Optional)</Label>
                        <Input id="senderMobile" name="senderMobile" placeholder="Mobile number of the sender" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="senderAddress">Sender Address</Label>
                        <Textarea id="senderAddress" name="senderAddress" placeholder="Full address of the sender" required />
                    </div>
                    <FormSectionTitle>Recipient&apos;s Details</FormSectionTitle>
                     <div className="space-y-2">
                        <Label htmlFor="recipientName">Recipient Name</Label>
                        <Input id="recipientName" name="recipientName" placeholder="Full name of the recipient" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="recipientAddress">Recipient Address</Label>
                        <Textarea id="recipientAddress" name="recipientAddress" placeholder="Full address of the recipient" required />
                    </div>
                     <FormSectionTitle>Notice Details</FormSectionTitle>
                     <div className="space-y-2">
                        <Label htmlFor="caseDetails">Facts of the Case</Label>
                        <Textarea id="caseDetails" name="caseDetails" placeholder="Describe the facts and circumstances leading to this notice." rows={5} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="remedySought">Relief Claimed</Label>
                        <Textarea id="remedySought" name="remedySought" placeholder="What action do you want the recipient to take? (e.g., payment of money, apology, etc.)" rows={3} required />
                    </div>
                </>
            )}

            { (documentType === 'Police Complaint' || documentType === 'FIR Application') && (
                 <>
                    <FormSectionTitle>Complainant&apos;s Details</FormSectionTitle>
                    <div className="space-y-2">
                        <Label htmlFor="complainantName">Complainant Name</Label>
                        <Input id="complainantName" name="complainantName" placeholder="Your full name" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="complainantAddress">Complainant Address</Label>
                        <Textarea id="complainantAddress" name="complainantAddress" placeholder="Your full address" required />
                    </div>
                     <FormSectionTitle>Incident Details</FormSectionTitle>
                     <div className="space-y-2">
                        <Label htmlFor="incidentDate">Date & Time of Incident</Label>
                        <Input id="incidentDate" name="incidentDate" placeholder="e.g., 24th July 2024, around 10:00 PM" required />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="incidentPlace">Place of Incident</Label>
                        <Input id="incidentPlace" name="incidentPlace" placeholder="Location where the incident occurred" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="caseDetails">Description of Incident</Label>
                        <Textarea id="caseDetails" name="caseDetails" placeholder="Describe in detail what happened." rows={8} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="accusedDetails">Accused Person(s) (if known)</Label>
                        <Input id="accusedDetails" name="accusedDetails" placeholder="Name and details of the person(s) you are complaining against" />
                    </div>
                 </>
            )}

            { documentType === 'Consumer Complaint' && (
                 <>
                    <FormSectionTitle>Complainant&apos;s Details</FormSectionTitle>
                    <div className="space-y-2">
                        <Label htmlFor="complainantName">Complainant Name</Label>
                        <Input id="complainantName" name="complainantName" placeholder="Your full name" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="complainantAddress">Complainant Address</Label>
                        <Textarea id="complainantAddress" name="complainantAddress" placeholder="Your full address" required />
                    </div>
                     <FormSectionTitle>Opposite Party&apos;s Details</FormSectionTitle>
                     <div className="space-y-2">
                        <Label htmlFor="sellerName">Seller/Company Name</Label>
                        <Input id="sellerName" name="sellerName" placeholder="Name of the business or person you bought from" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="sellerAddress">Seller/Company Address</Label>
                        <Textarea id="sellerAddress" name="sellerAddress" placeholder="Full address of the seller or company" required />
                    </div>
                     <FormSectionTitle>Complaint Details</FormSectionTitle>
                     <div className="space-y-2">
                        <Label htmlFor="productDetails">Product/Service Details</Label>
                        <Input id="productDetails" name="productDetails" placeholder="e.g., Brand name, model, service type, date of purchase" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="caseDetails">Nature of Complaint</Label>
                        <Textarea id="caseDetails" name="caseDetails" placeholder="Describe the defect in the product or deficiency in service." rows={5} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="remedySought">Relief Sought</Label>
                        <Textarea id="remedySought" name="remedySought" placeholder="e.g., Refund, replacement, compensation" rows={3} required />
                    </div>
                 </>
            )}

            { documentType === 'RTI Application' && (
                 <>
                    <FormSectionTitle>Applicant&apos;s Details</FormSectionTitle>
                    <div className="space-y-2">
                        <Label htmlFor="applicantName">Applicant Name</Label>
                        <Input id="applicantName" name="applicantName" placeholder="Your full name" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="applicantAddress">Applicant Address</Label>
                        <Textarea id="applicantAddress" name="applicantAddress" placeholder="Your full address" required />
                    </div>
                     <FormSectionTitle>Authority Details</FormSectionTitle>
                     <div className="space-y-2">
                        <Label htmlFor="pioName">Public Information Officer (PIO)</Label>
                        <Input id="pioName" name="pioName" placeholder="Name of PIO (if known)" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="departmentAddress">Department/Office Address</Label>
                        <Textarea id="departmentAddress" name="departmentAddress" placeholder="Full address of the government department" required />
                    </div>
                     <FormSectionTitle>Information Requested</FormSectionTitle>
                     <div className="space-y-2">
                        <Label htmlFor="caseDetails">Details of Information Required</Label>
                        <Textarea id="caseDetails" name="caseDetails" placeholder="List the specific questions or information you are seeking in a clear, point-wise format." rows={10} required />
                    </div>
                 </>
            )}

            <Button type="submit" disabled={state.status === "loading"} className="w-full md:w-auto">
              {state.status === "loading" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ): "Generate Document" }
            </Button>
          </form>
        </CardContent>
      </Card>
        
      
      {state.status !== 'idle' && (
        <Card>
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
              {state.status === 'loading' && <p className="text-muted-foreground text-center py-10">Generating your document, please wait...</p>}
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
            </CardContent>
        </Card>
      )}
    </div>
  );
}
