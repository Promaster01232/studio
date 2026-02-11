"use client";

import { useFormState } from "react-dom";
import { generateBondAction, type BondGeneratorState } from "./actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Download, Share2, Printer, Loader2 } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

const initialState: BondGeneratorState = {
  status: "idle",
  data: null,
  error: null,
};

const FormSectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h3 className="text-lg font-semibold mt-6 mb-4 pt-4 border-t">{children}</h3>
);

export default function BondGeneratorPage() {
  const [state, formAction] = useFormState(generateBondAction, initialState);
  const [bondType, setBondType] = useState("Bail Bond");

  return (
    <div className="space-y-8">
      <PageHeader
        title="Bond Generator"
        description="Generate various types of legal bonds instantly."
      />
      
      <Card>
        <CardHeader>
          <CardTitle>Details for {bondType}</CardTitle>
          <CardDescription>Fill in the details to generate your legal bond.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="bondType">Bond Type</Label>
              <Select name="bondType" required value={bondType} onValueChange={setBondType}>
                <SelectTrigger id="bondType">
                  <SelectValue placeholder="Select a bond type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bail Bond">Bail Bond</SelectItem>
                  <SelectItem value="Indemnity Bond">Indemnity Bond</SelectItem>
                  <SelectItem value="Surety Bond">Surety Bond</SelectItem>
                  <SelectItem value="Affidavit">Affidavit</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Conditional Fields */}
            {bondType === 'Bail Bond' && (
                <>
                    <FormSectionTitle>Case &amp; Court Details</FormSectionTitle>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="caseNumber">Case / FIR No.</Label>
                            <Input id="caseNumber" name="caseNumber" placeholder="e.g., FIR No. 123/2024" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="courtName">Court Name</Label>
                            <Input id="courtName" name="courtName" placeholder="e.g., The Court of Metropolitan Magistrate, Delhi" required />
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="bondAmount">Bond Amount (in words and figures)</Label>
                        <Input id="bondAmount" name="bondAmount" placeholder="e.g., Rs. 50,000/- (Rupees Fifty Thousand Only)" required />
                    </div>

                    <FormSectionTitle>Accused Person&apos;s Details</FormSectionTitle>
                    <div className="space-y-2">
                        <Label htmlFor="accusedName">Name of Accused</Label>
                        <Input id="accusedName" name="accusedName" placeholder="Full name of the accused" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="accusedAddress">Address of Accused</Label>
                        <Textarea id="accusedAddress" name="accusedAddress" placeholder="Full address of the accused" required />
                    </div>

                    <FormSectionTitle>Surety&apos;s Details</FormSectionTitle>
                     <div className="space-y-2">
                        <Label htmlFor="suretyName">Name of Surety</Label>
                        <Input id="suretyName" name="suretyName" placeholder="Full name of the surety" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="suretyAddress">Address of Surety</Label>
                        <Textarea id="suretyAddress" name="suretyAddress" placeholder="Full address of the surety" required />
                    </div>
                </>
            )}

            {bondType === 'Indemnity Bond' && (
                 <>
                    <FormSectionTitle>Indemnifier&apos;s Details (Who is giving the indemnity)</FormSectionTitle>
                    <div className="space-y-2">
                        <Label htmlFor="indemnifierName">Indemnifier Name</Label>
                        <Input id="indemnifierName" name="indemnifierName" placeholder="Your full name" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="indemnifierAddress">Indemnifier Address</Label>
                        <Textarea id="indemnifierAddress" name="indemnifierAddress" placeholder="Your full address" required />
                    </div>
                     <FormSectionTitle>Indemnity Holder&apos;s Details (Who is being indemnified)</FormSectionTitle>
                     <div className="space-y-2">
                        <Label htmlFor="indemnityHolderName">Indemnity Holder Name</Label>
                        <Input id="indemnityHolderName" name="indemnityHolderName" placeholder="Name of person/company being protected from loss" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="indemnityHolderAddress">Indemnity Holder Address</Label>
                        <Textarea id="indemnityHolderAddress" name="indemnityHolderAddress" placeholder="Full address of the indemnity holder" required />
                    </div>
                     <FormSectionTitle>Bond Details</FormSectionTitle>
                     <div className="space-y-2">
                        <Label htmlFor="indemnityDetails">Purpose of Indemnity</Label>
                        <Textarea id="indemnityDetails" name="indemnityDetails" placeholder="Describe the action/transaction for which this indemnity is being provided (e.g., loss of a share certificate)." rows={5} required />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="bondAmount">Indemnity Amount (if any)</Label>
                        <Input id="bondAmount" name="bondAmount" placeholder="e.g., Rs. 1,00,000/- (Rupees One Lakh Only)" />
                    </div>
                 </>
            )}

            { bondType === 'Surety Bond' && (
                 <>
                    <FormSectionTitle>Principal&apos;s Details (Person who needs the bond)</FormSectionTitle>
                    <div className="space-y-2">
                        <Label htmlFor="principalName">Principal Name</Label>
                        <Input id="principalName" name="principalName" placeholder="Full name of the person performing an obligation" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="principalAddress">Principal Address</Label>
                        <Textarea id="principalAddress" name="principalAddress" placeholder="Full address of the principal" required />
                    </div>
                     <FormSectionTitle>Obligee&apos;s Details (Person/Entity to whom the bond is given)</FormSectionTitle>
                     <div className="space-y-2">
                        <Label htmlFor="obligeeName">Obligee Name</Label>
                        <Input id="obligeeName" name="obligeeName" placeholder="Name of the person, company, or government agency" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="obligeeAddress">Obligee Address</Label>
                        <Textarea id="obligeeAddress" name="obligeeAddress" placeholder="Full address of the obligee" required />
                    </div>
                    <FormSectionTitle>Surety&apos;s Details (Person guaranteeing the obligation)</FormSectionTitle>
                     <div className="space-y-2">
                        <Label htmlFor="suretyName">Surety Name</Label>
                        <Input id="suretyName" name="suretyName" placeholder="Full name of the surety" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="suretyAddress">Surety Address</Label>
                        <Textarea id="suretyAddress" name="suretyAddress" placeholder="Full address of the surety" required />
                    </div>
                     <FormSectionTitle>Bond Details</FormSectionTitle>
                     <div className="space-y-2">
                        <Label htmlFor="bondPurpose">Purpose of the Bond</Label>
                        <Textarea id="bondPurpose" name="bondPurpose" placeholder="Describe the obligation being guaranteed by the surety (e.g., performance of a contract, payment of a debt)." rows={5} required />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="bondAmount">Bond Amount</Label>
                        <Input id="bondAmount" name="bondAmount" placeholder="e.g., Rs. 5,00,000/- (Rupees Five Lakh Only)" required />
                    </div>
                 </>
            )}

            { bondType === 'Affidavit' && (
                 <>
                    <FormSectionTitle>Deponent&apos;s Details (Person making the statement)</FormSectionTitle>
                    <div className="space-y-2">
                        <Label htmlFor="deponentName">Deponent Name</Label>
                        <Input id="deponentName" name="deponentName" placeholder="Your full name" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="deponentAddress">Deponent Address</Label>
                        <Textarea id="deponentAddress" name="deponentAddress" placeholder="Your full address" required />
                    </div>
                     <FormSectionTitle>Affidavit Details</FormSectionTitle>
                     <div className="space-y-2">
                        <Label htmlFor="statementOfFacts">Statement of Facts</Label>
                        <Textarea id="statementOfFacts" name="statementOfFacts" placeholder="State the facts you are swearing to, in a clear, point-wise format. Begin with 'I, [Your Name], son/daughter of [Father's Name], aged [Age], resident of [Address], do hereby solemnly affirm and declare as under:'" rows={10} required />
                    </div>
                    <FormSectionTitle>Verification</FormSectionTitle>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="verificationPlace">Place of Verification</Label>
                            <Input id="verificationPlace" name="verificationPlace" placeholder="e.g., Delhi" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="verificationDate">Date of Verification</Label>
                            <Input id="verificationDate" name="verificationDate" placeholder="e.g., 25th July 2024" required />
                        </div>
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
