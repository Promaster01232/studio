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
import { Download, Share2, Printer, Loader2, Languages, FileText, CheckCircle2, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { jsPDF } from "jspdf";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const initialState: DocumentGeneratorState = {
  status: "idle",
  data: null,
  error: null,
};

const FormSectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mt-8 mb-4 flex items-center gap-2">
        <div className="h-1 w-1 rounded-full bg-primary animate-pulse" />
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
                    body { font-family: sans-serif; color: #000; padding: 40px; line-height: 1.6; }
                    pre { white-space: pre-wrap; word-wrap: break-word; font-size: 12pt; }
                    h1 { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 30px; }
                </style>
            </head>
            <body><h1>${title}</h1><pre>${content}</pre></body>
        </html>
    `);
    doc.close();
    setTimeout(() => { iframe.contentWindow?.focus(); iframe.contentWindow?.print(); document.body.removeChild(iframe); }, 500);
  };

  const handleShare = async (content: string, title: string) => {
    if (navigator.share) {
      try { await navigator.share({ title, text: content }); } catch (e) {}
    } else {
      try {
        await navigator.clipboard.writeText(content);
        toast({ title: "Copied to clipboard", description: "Document content saved." });
      } catch (err) {}
    }
  };

  const handleDownloadPdf = (content: string, title: string) => {
    try {
      const doc = new jsPDF();
      doc.setFont("helvetica", "bold");
      doc.text(title.toUpperCase(), 105, 20, { align: 'center' });
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      const lines = doc.splitTextToSize(content, 170);
      doc.text(lines, 20, 35);
      doc.save(`${title.replace(/[\s/]/g, '-')}.pdf`);
      toast({ title: "Success", description: "PDF ready for download." });
    } catch (error) {
       toast({ variant: "destructive", title: "PDF Failed", description: "Error creating file." });
    }
  };

  return (
    <div className="space-y-10 max-w-5xl mx-auto pb-20 px-2 sm:px-0 text-left">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-primary/5 pb-8">
        <PageHeader
          title="Document Generator"
          description="Draft professional legal instruments in seconds using AI assistance."
        />
        <Button variant="ghost" size="sm" className="rounded-xl font-bold hover:bg-primary/5 group h-10 px-6 border border-primary/5 text-primary text-[10px] uppercase tracking-widest" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" /> Back to Terminal
          </Link>
        </Button>
      </motion.div>
      
      <Card className="glass shadow-2xl overflow-hidden rounded-[2.5rem] border-primary/5">
        <CardHeader className="bg-primary/5 border-b border-primary/5 p-8">
          <CardTitle className="text-xl font-black uppercase tracking-tight">Document Setup: {documentType}</CardTitle>
          <CardDescription className="text-[10px] font-bold uppercase tracking-widest opacity-60">Fill in the identity nodes to generate your legal draft.</CardDescription>
        </CardHeader>
        <CardContent className="p-8 sm:p-10">
          <form action={formAction} className="space-y-8 text-left">
            <div className="grid sm:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label htmlFor="documentType" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Instrument Type</Label>
                <Select name="documentType" required value={documentType} onValueChange={setDocumentType}>
                  <SelectTrigger id="documentType" className="h-12 glass border-primary/5 font-bold rounded-2xl">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="glass border-primary/5 rounded-[1.5rem]">
                    <SelectItem value="Legal Notice" className="font-bold">Legal Notice</SelectItem>
                    <SelectItem value="Police Complaint" className="font-bold">Police Complaint</SelectItem>
                    <SelectItem value="FIR Application" className="font-bold">FIR Application</SelectItem>
                    <SelectItem value="Consumer Complaint" className="font-bold">Consumer Complaint</SelectItem>
                    <SelectItem value="RTI Application" className="font-bold">RTI Application</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label htmlFor="language" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1 flex items-center gap-2"><Languages className="h-3 w-3" /> Dialect Node</Label>
                <Select name="language" defaultValue="Simple English" required>
                  <SelectTrigger id="language" className="h-12 glass border-primary/5 font-bold rounded-2xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass border-primary/5 rounded-[1.5rem]">
                    <SelectItem value="Simple English" className="font-bold">Simple English</SelectItem>
                    <SelectItem value="Legal English" className="font-bold">Legal English</SelectItem>
                    <SelectItem value="Hindi" className="font-bold">Hindi (Official)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {documentType === 'Legal Notice' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <FormSectionTitle>Sender Registry</FormSectionTitle>
                    <div className="grid sm:grid-cols-2 gap-6">
                        <Input name="senderName" placeholder="Full name of sender" required className="h-12 glass font-bold" />
                        <Input name="senderMobile" placeholder="Contact number" className="h-12 glass font-bold" />
                    </div>
                    <Textarea name="senderAddress" placeholder="Full residential/official address" required className="glass rounded-2xl font-medium text-sm" />
                    <FormSectionTitle>Recipient Registry</FormSectionTitle>
                    <Input name="recipientName" placeholder="Full name of recipient" required className="h-12 glass font-bold" />
                    <Textarea name="recipientAddress" placeholder="Recipient official address" required className="glass rounded-2xl font-medium text-sm" />
                    <FormSectionTitle>Case Forensic Data</FormSectionTitle>
                    <Textarea name="caseDetails" placeholder="State the facts and circumstances leading to this notice..." rows={5} required className="glass rounded-2xl font-medium text-sm p-6" />
                    <Textarea name="remedySought" placeholder="Specify the relief claimed (e.g., payment, apology)..." rows={3} required className="glass rounded-2xl font-medium text-sm p-6" />
                </motion.div>
            )}

            {(documentType === 'Police Complaint' || documentType === 'FIR Application') && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <FormSectionTitle>Complainant Registry</FormSectionTitle>
                    <Input name="complainantName" placeholder="Your full name" required className="h-12 glass font-bold" />
                    <Textarea name="complainantAddress" placeholder="Full permanent address" required className="glass rounded-2xl" />
                    <FormSectionTitle>Incident Matrix</FormSectionTitle>
                    <div className="grid sm:grid-cols-2 gap-6">
                        <Input name="incidentDate" type="datetime-local" required className="h-12 glass font-bold" />
                        <Input name="incidentPlace" placeholder="Precise location" required className="h-12 glass font-bold" />
                    </div>
                    <Textarea name="caseDetails" placeholder="Detailed chronological description of incident..." rows={8} required className="glass rounded-[2rem] p-6" />
                    <Input name="accusedDetails" placeholder="Accused Identity (if known)" className="h-12 glass font-bold" />
                 </motion.div>
            )}

            <Button type="submit" disabled={state.status === "loading"} className="w-full h-16 text-xs font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/20 transition-all active:scale-95 rounded-[1.5rem]">
              {state.status === "loading" ? (
                <>
                  <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                  AI Drafting In Progress...
                </>
              ): (
                <>
                  <FileText className="mr-3 h-5 w-5" />
                  Initialize Statutory Draft
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
        
      <AnimatePresence>
        {state.status === 'success' && state.data && (
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="glass border-primary shadow-2xl overflow-hidden rounded-[2.5rem] mt-10">
                    <CardHeader className="bg-primary text-primary-foreground p-8">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                            <div className="text-left">
                                <div className="flex items-center gap-2 mb-1">
                                    <FileText className="h-5 w-5" />
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Official AI Report Node Active</span>
                                </div>
                                <CardTitle className="text-2xl font-black uppercase tracking-tight">Draft Node Ready</CardTitle>
                                <CardDescription className="text-primary-foreground/80 font-bold text-[10px] uppercase tracking-widest mt-1">Instrument: {documentType}</CardDescription>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <Button variant="secondary" size="sm" onClick={() => handleDownloadPdf(state.data!.document, `Draft ${documentType}`)} className="h-9 px-4 rounded-xl font-bold text-[10px] uppercase">
                                    <Download className="mr-2 h-3.5 w-3.5" /> PDF
                                </Button>
                                <Button variant="secondary" size="sm" onClick={() => handleShare(state.data!.document, `Draft ${documentType}`)} className="h-9 px-4 rounded-xl font-bold text-[10px] uppercase">
                                    <Share2 className="mr-2 h-3.5 w-3.5" /> Share
                                </Button>
                                <Button variant="secondary" size="sm" onClick={() => handlePrint(state.data!.document, `Draft ${documentType}`)} className="h-9 px-4 rounded-xl font-black text-[10px] uppercase">
                                    <Printer className="mr-2 h-3.5 w-3.5" /> Print
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 sm:p-12">
                        <div className="prose dark:prose-invert max-w-none p-10 border-2 border-primary/10 rounded-[2rem] bg-white dark:bg-zinc-950 shadow-inner min-h-[60vh] text-left">
                            <pre className="whitespace-pre-wrap font-body text-foreground leading-relaxed text-sm sm:text-base">{state.data.document}</pre>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}