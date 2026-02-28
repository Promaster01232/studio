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
import { Download, Share2, Printer, Loader2, Languages, FileText, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { jsPDF } from "jspdf";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

const initialState: DocumentGeneratorState = {
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

export default function DocumentGeneratorPage() {
  const [state, formAction] = useActionState(generateDocumentAction, initialState);
  const [documentType, setDocumentType] = useState("Legal Notice");
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
                    @media print {
                        body { padding: 0; }
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
          description: "Your document is ready for download.",
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
        title="Document Generator"
        description="Draft professional legal documents in seconds using AI assistance."
      />
      
      <Card className="border-primary/10 shadow-xl overflow-hidden">
        <CardHeader className="bg-primary/5 border-b border-primary/10">
          <CardTitle className="text-xl">Document Setup</CardTitle>
          <CardDescription>Fill in the details below to generate your legal document.</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form action={formAction} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="documentType">Document Type</Label>
                <Select name="documentType" required value={documentType} onValueChange={setDocumentType}>
                  <SelectTrigger id="documentType" className="bg-background">
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
            {documentType === 'Legal Notice' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    <FormSectionTitle>Sender&apos;s Details</FormSectionTitle>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="senderName">Sender Name</Label>
                            <Input id="senderName" name="senderName" placeholder="Full name of the sender" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="senderMobile">Sender Mobile No. (Optional)</Label>
                            <Input id="senderMobile" name="senderMobile" placeholder="Mobile number of the sender" />
                        </div>
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
                </motion.div>
            )}

            { (documentType === 'Police Complaint' || documentType === 'FIR Application') && (
                 <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
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
                     <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="incidentDate">Date & Time of Incident</Label>
                            <Input id="incidentDate" name="incidentDate" type="datetime-local" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="incidentPlace">Place of Incident</Label>
                            <Input id="incidentPlace" name="incidentPlace" placeholder="Location where the incident occurred" required />
                        </div>
                     </div>
                    <div className="space-y-2">
                        <Label htmlFor="caseDetails">Description of Incident</Label>
                        <Textarea id="caseDetails" name="caseDetails" placeholder="Describe in detail what happened." rows={8} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="accusedDetails">Accused Person(s) (if known)</Label>
                        <Input id="accusedDetails" name="accusedDetails" placeholder="Name and details of the person(s) you are complaining against" />
                    </div>
                 </motion.div>
            )}

            { documentType === 'Consumer Complaint' && (
                 <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
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
                 </motion.div>
            )}

            { documentType === 'RTI Application' && (
                 <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
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
                 </motion.div>
            )}

            <Button type="submit" disabled={state.status === "loading"} className="w-full h-12 text-lg shadow-lg shadow-primary/20 transition-all active:scale-95">
              {state.status === "loading" ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  AI Drafting in Progress...
                </>
              ): (
                <>
                  <FileText className="mr-2 h-5 w-5" />
                  Generate Document
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
                            <CardTitle className="text-2xl">Generated {documentType}</CardTitle>
                            <CardDescription className="text-primary-foreground/80">Review your drafted document below.</CardDescription>
                        </div>
                        {state.status === 'success' && state.data && (
                        <div className="flex flex-wrap items-center gap-2">
                            <Button variant="secondary" size="sm" onClick={() => handleDownloadPdf(state.data!.document, `Generated ${documentType}`)} className="shadow-md">
                                <Download className="mr-2 h-4 w-4" /> PDF
                            </Button>
                            <Button variant="secondary" size="sm" onClick={() => handleShare(state.data!.document, `Generated ${documentType}`)} className="shadow-md">
                                <Share2 className="mr-2 h-4 w-4" /> Share
                            </Button>
                            <Button variant="secondary" size="sm" onClick={() => handlePrint(state.data!.document, `Generated ${documentType}`)} className="shadow-md">
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
