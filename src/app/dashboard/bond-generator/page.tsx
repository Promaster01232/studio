"use client";

import { useActionState, useState } from "react";
import { generateBondAction, type BondGeneratorState } from "./actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Download, Share2, Printer, Loader2, Languages, FileSignature, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { jsPDF } from "jspdf";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

const initialState: BondGeneratorState = {
  status: "idle",
  data: null,
  error: null,
};

const FormSectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h3 className="text-lg font-semibold mt-6 mb-4 pt-4 border-t flex items-center gap-2">
        <CheckCircle2 className="h-4 w-4 text-primary" />
        {children}
    </h3>
);

export default function BondGeneratorPage() {
  const [state, formAction] = useActionState(generateBondAction, initialState);
  const [bondType, setBondType] = useState("Bail Bond");
  const { toast } = useToast();

  const handlePrint = (content: string, title: string) => {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (!doc) {
        document.body.removeChild(iframe);
        return;
    }

    doc.open();
    doc.write(`
        <html>
            <head>
                <title>${title}</title>
                <style>
                    body {
                        font-family: 'Inter', sans-serif;
                        color: #000;
                        padding: 40px;
                        line-height: 1.6;
                    }
                    pre {
                        white-space: pre-wrap;
                        word-wrap: break-word;
                        font-family: inherit;
                        font-size: 12pt;
                    }
                    h1 {
                        text-align: center;
                        border-bottom: 2px solid #000;
                        padding-bottom: 10px;
                        margin-bottom: 30px;
                    }
                </style>
            </head>
            <body>
                <h1>${title}</h1>
                <pre>${content}</pre>
            </body>
        </html>
    `);
    doc.close();
    
    setTimeout(() => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        document.body.removeChild(iframe);
    }, 500);
  };

  const handleShare = async (content: string, title: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: content,
        });
      } catch (error) {
        console.error("Share failed:", error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(content);
        toast({
          title: "Copied to clipboard",
          description: "The document content has been copied to your clipboard.",
        });
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Failed to copy",
          description: "Could not copy document to clipboard.",
        });
      }
    }
  };

  const handleDownloadPdf = (content: string, title: string) => {
    try {
      const doc = new jsPDF();
      
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      const usableWidth = pageWidth - margin * 2;
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text(title.toUpperCase(), pageWidth / 2, 25, { align: 'center' });
      
      doc.setLineWidth(0.5);
      doc.line(margin, 28, pageWidth - margin, 28);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      const lines = doc.splitTextToSize(content, usableWidth);
      doc.text(lines, margin, 40);
      
      doc.save(`${title.replace(/[\s/]/g, '-')}.pdf`);
      
      toast({
          title: "Success",
          description: "Your bond document is ready for download.",
      });
    } catch (error) {
       console.error("Failed to generate PDF:", error);
       toast({
          variant: "destructive",
          title: "PDF Generation Failed",
          description: "There was an error creating the PDF file. Note: Non-latin characters (like Hindi) might not be supported in PDF download yet.",
       });
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <PageHeader
        title="Bond Generator"
        description="Generate legally sound bonds and affidavits instantly with AI assistance."
      />
      
      <Card className="border-primary/10 shadow-xl overflow-hidden">
        <CardHeader className="bg-primary/5 border-b border-primary/10">
          <CardTitle className="text-xl">Bond Setup: {bondType}</CardTitle>
          <CardDescription>Fill in the details to generate your official legal bond.</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form action={formAction} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="bondType">Bond Type</Label>
                <Select name="bondType" required value={bondType} onValueChange={setBondType}>
                  <SelectTrigger id="bondType" className="bg-background">
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
              <div className="space-y-2">
                <Label htmlFor="language" className="flex items-center gap-2"><Languages className="h-4 w-4" /> Document Language</Label>
                <Select name="language" defaultValue="Simple English" required>
                  <SelectTrigger id="language" className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Simple English">Simple English</SelectItem>
                    <SelectItem value="Legal English">Legal English</SelectItem>
                    <SelectItem value="Hindi">Hindi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Conditional Fields */}
            {bondType === 'Bail Bond' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
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
                </motion.div>
            )}

            {bondType === 'Indemnity Bond' && (
                 <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    <FormSectionTitle>Indemnifier&apos;s Details</FormSectionTitle>
                    <div className="space-y-2">
                        <Label htmlFor="indemnifierName">Indemnifier Name</Label>
                        <Input id="indemnifierName" name="indemnifierName" placeholder="Your full name" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="indemnifierAddress">Indemnifier Address</Label>
                        <Textarea id="indemnifierAddress" name="indemnifierAddress" placeholder="Your full address" required />
                    </div>
                     <FormSectionTitle>Indemnity Holder&apos;s Details</FormSectionTitle>
                     <div className="space-y-2">
                        <Label htmlFor="indemnityHolderName">Indemnity Holder Name</Label>
                        <Input id="indemnityHolderName" name="indemnityHolderName" placeholder="Name of person/company being protected" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="indemnityHolderAddress">Indemnity Holder Address</Label>
                        <Textarea id="indemnityHolderAddress" name="indemnityHolderAddress" placeholder="Full address of the holder" required />
                    </div>
                     <FormSectionTitle>Bond Details</FormSectionTitle>
                     <div className="space-y-2">
                        <Label htmlFor="indemnityDetails">Purpose of Indemnity</Label>
                        <Textarea id="indemnityDetails" name="indemnityDetails" placeholder="Describe the action/transaction for which this indemnity is being provided." rows={5} required />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="bondAmount">Indemnity Amount (if any)</Label>
                        <Input id="bondAmount" name="bondAmount" placeholder="e.g., Rs. 1,00,000/- (Rupees One Lakh Only)" />
                    </div>
                 </motion.div>
            )}

            { bondType === 'Surety Bond' && (
                 <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    <FormSectionTitle>Principal&apos;s Details</FormSectionTitle>
                    <div className="space-y-2">
                        <Label htmlFor="principalName">Principal Name</Label>
                        <Input id="principalName" name="principalName" placeholder="Full name of person performing obligation" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="principalAddress">Principal Address</Label>
                        <Textarea id="principalAddress" name="principalAddress" placeholder="Full address of the principal" required />
                    </div>
                     <FormSectionTitle>Obligee&apos;s Details</FormSectionTitle>
                     <div className="space-y-2">
                        <Label htmlFor="obligeeName">Obligee Name</Label>
                        <Input id="obligeeName" name="obligeeName" placeholder="Name of person/agency to whom bond is given" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="obligeeAddress">Obligee Address</Label>
                        <Textarea id="obligeeAddress" name="obligeeAddress" placeholder="Full address of the obligee" required />
                    </div>
                    <FormSectionTitle>Surety&apos;s Details</FormSectionTitle>
                     <div className="space-y-2">
                        <Label htmlFor="suretyName">Surety Name</Label>
                        <Input id="suretyName" name="suretyName" placeholder="Full name of the surety" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="suretyAddress">Address of Surety</Label>
                        <Textarea id="suretyAddress" name="suretyAddress" placeholder="Full address of the surety" required />
                    </div>
                     <FormSectionTitle>Bond Details</FormSectionTitle>
                     <div className="space-y-2">
                        <Label htmlFor="bondPurpose">Purpose of the Bond</Label>
                        <Textarea id="bondPurpose" name="bondPurpose" placeholder="Describe the obligation being guaranteed." rows={5} required />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="bondAmount">Bond Amount</Label>
                        <Input id="bondAmount" name="bondAmount" placeholder="e.g., Rs. 5,00,000/- (Rupees Five Lakh Only)" required />
                    </div>
                 </motion.div>
            )}

            { bondType === 'Affidavit' && (
                 <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    <FormSectionTitle>Deponent&apos;s Details</FormSectionTitle>
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
                        <Textarea id="statementOfFacts" name="statementOfFacts" placeholder="State the facts you are swearing to, in a clear, point-wise format." rows={10} required />
                    </div>
                    <FormSectionTitle>Verification</FormSectionTitle>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="verificationPlace">Place of Verification</Label>
                            <Input id="verificationPlace" name="verificationPlace" placeholder="e.g., Delhi" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="verificationDate">Date of Verification</Label>
                            <Input id="verificationDate" name="verificationDate" type="date" required />
                        </div>
                    </div>
                 </motion.div>
            )}

            <Button type="submit" disabled={state.status === "loading"} className="w-full h-12 text-lg shadow-lg shadow-primary/20 transition-all active:scale-95">
              {state.status === "loading" ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  AI Drafting Bond...
                </>
              ): (
                <>
                  <FileSignature className="mr-2 h-5 w-5" />
                  Generate Bond
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
        
      
      <AnimatePresence>
        {state.status !== 'idle' && (
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
            >
                <Card className="border-primary shadow-2xl overflow-hidden">
                    <CardHeader className="bg-primary text-primary-foreground">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <CardTitle className="text-2xl">Generated {bondType}</CardTitle>
                            <CardDescription className="text-primary-foreground/80">Your legal bond is ready.</CardDescription>
                        </div>
                        {state.status === 'success' && state.data && (
                        <div className="flex flex-wrap items-center gap-2">
                            <Button variant="secondary" size="sm" onClick={() => handleDownloadPdf(state.data!.document, `Generated ${bondType}`)} className="shadow-md">
                                <Download className="mr-2 h-4 w-4" /> PDF
                            </Button>
                            <Button variant="secondary" size="sm" onClick={() => handleShare(state.data!.document, `Generated ${bondType}`)} className="shadow-md">
                                <Share2 className="mr-2 h-4 w-4" /> Share
                            </Button>
                            <Button variant="secondary" size="sm" onClick={() => handlePrint(state.data!.document, `Generated ${bondType}`)} className="shadow-md">
                                <Printer className="mr-2 h-4 w-4" /> Print
                            </Button>
                        </div>
                        )}
                    </div>
                    </CardHeader>
                    <CardContent className="p-6">
                    {state.status === 'loading' && (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Loader2 className="h-12 w-12 animate-spin text-primary" />
                            <p className="text-muted-foreground animate-pulse font-medium">Drafting your document, please wait...</p>
                        </div>
                    )}
                    {state.status === "error" && (
                        <Alert variant="destructive" className="my-6">
                        <AlertTitle>Generation Failed</AlertTitle>
                        <AlertDescription>{state.error}</AlertDescription>
                        </Alert>
                    )}
                    {state.status === 'success' && state.data && (
                        <div className="relative mt-2">
                            <div className="prose dark:prose-invert prose-sm max-w-none p-8 border-2 rounded-xl bg-white dark:bg-zinc-900 shadow-inner min-h-[60vh] overflow-y-auto">
                                <pre className="whitespace-pre-wrap font-body text-foreground leading-relaxed text-base">{state.data.document}</pre>
                            </div>
                            <div className="absolute bottom-4 right-8 text-[10px] text-muted-foreground opacity-50 uppercase tracking-widest pointer-events-none">
                                AI Nyaya Mitra Assistant
                            </div>
                        </div>
                    )}
                    </CardContent>
                </Card>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
