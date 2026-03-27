
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
import { Download, Share2, Printer, Loader2, Languages, FileSignature, CheckCircle2, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { jsPDF } from "jspdf";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const initialState: BondGeneratorState = {
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

export default function BondGeneratorPage() {
  const [state, formAction] = useActionState(generateBondAction, initialState);
  const [bondType, setBondType] = useState("Bail Bond");
  const { toast } = useToast();

  const handlePrint = (content: string, title: string) => {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    const doc = iframe.contentWindow?.document;
    if (!doc) { document.body.removeChild(iframe); return; }
    doc.open();
    doc.write(`<html><head><title>${title}</title><style>body { font-family: sans-serif; padding: 40px; line-height: 1.6; } pre { white-space: pre-wrap; font-size: 12pt; }</style></head><body><h1>${title}</h1><pre>${content}</pre></body></html>`);
    doc.close();
    setTimeout(() => { iframe.contentWindow?.focus(); iframe.contentWindow?.print(); document.body.removeChild(iframe); }, 500);
  };

  const handleDownloadPdf = (content: string, title: string) => {
    try {
      const doc = new jsPDF();
      doc.setFont("helvetica", "bold");
      doc.text(title.toUpperCase(), 105, 20, { align: 'center' });
      doc.setFontSize(10);
      const lines = doc.splitTextToSize(content, 170);
      doc.text(lines, 20, 35);
      doc.save(`${title.replace(/[\s/]/g, '-')}.pdf`);
      toast({ title: "Success", description: "Bond document ready." });
    } catch (e) { toast({ variant: "destructive", title: "Failed", description: "PDF generation error." }); }
  };

  return (
    <div className="space-y-10 max-w-5xl mx-auto pb-20 px-2 sm:px-0">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-primary/5 pb-8">
        <PageHeader
          title="Bond Generator"
          description="Generate legally sound bonds and affidavits instantly with AI assistance."
        />
        <Button variant="ghost" size="sm" className="rounded-xl font-bold hover:bg-primary/5 group h-10 px-6 border border-primary/5 text-primary text-[10px] uppercase tracking-widest" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" /> Back to Terminal
          </Link>
        </Button>
      </motion.div>
      
      <Card className="glass shadow-2xl overflow-hidden rounded-[2.5rem] border-primary/5">
        <CardHeader className="bg-primary/5 border-b border-primary/5 p-8">
          <CardTitle className="text-xl font-black uppercase tracking-tight">Bond Setup: {bondType}</CardTitle>
          <CardDescription className="text-[10px] font-bold uppercase tracking-widest opacity-60">Initialize statutory conditions for your official bond node.</CardDescription>
        </CardHeader>
        <CardContent className="p-8 sm:p-10">
          <form action={formAction} className="space-y-8 text-left">
            <div className="grid sm:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label htmlFor="bondType" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Statutory Type</Label>
                <Select name="bondType" required value={bondType} onValueChange={setBondType}>
                  <SelectTrigger id="bondType" className="h-12 glass border-primary/5 font-bold rounded-2xl">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="glass border-primary/5 rounded-[1.5rem]">
                    <SelectItem value="Bail Bond" className="font-bold">Bail Bond</SelectItem>
                    <SelectItem value="Personal Bond" className="font-bold">Personal Bond</SelectItem>
                    <SelectItem value="Indemnity Bond" className="font-bold">Indemnity Bond</SelectItem>
                    <SelectItem value="Surety Bond" className="font-bold">Surety Bond</SelectItem>
                    <SelectItem value="Performance Bond" className="font-bold">Performance Bond</SelectItem>
                    <SelectItem value="Mortgage Bond" className="font-bold">Mortgage Bond</SelectItem>
                    <SelectItem value="Employment Bond" className="font-bold">Employment Bond</SelectItem>
                    <SelectItem value="Affidavit" className="font-bold">Affidavit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label htmlFor="language" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1 flex items-center gap-2"><Languages className="h-3 w-3" /> Dialect Registry</Label>
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

            {(bondType === 'Bail Bond' || bondType === 'Personal Bond') && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <FormSectionTitle>Case & Court Registry</FormSectionTitle>
                    <div className="grid md:grid-cols-2 gap-6">
                        <Input name="caseNumber" placeholder="FIR / Case No." required className="h-12 glass font-bold" />
                        <Input name="courtName" placeholder="Full Court Name" required className="h-12 glass font-bold" />
                    </div>
                    <Input name="bondAmount" placeholder="Bond Amount (in words/figures)" required className="h-12 glass font-bold" />
                    <FormSectionTitle>Accused Identity Node</FormSectionTitle>
                    <Input name="accusedName" placeholder="Full Name of Accused" required className="h-12 glass font-bold" />
                    <Textarea name="accusedAddress" placeholder="Full Address of Accused" required className="glass rounded-2xl font-medium text-sm p-6" />
                </motion.div>
            )}

            <Button type="submit" disabled={state.status === "loading"} className="w-full h-16 text-xs font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/20 transition-all active:scale-95 rounded-[1.5rem]">
              {state.status === "loading" ? (
                <><Loader2 className="mr-3 h-5 w-5 animate-spin" /> AI Generating Bond...</>
              ): (
                <><FileSignature className="mr-3 h-5 w-5" /> Initialize Bond Generation</>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
        
      <AnimatePresence>
        {state.status === 'success' && state.data && (
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
                <Card className="glass border-primary shadow-2xl overflow-hidden rounded-[2.5rem] mt-10">
                    <CardHeader className="bg-primary text-primary-foreground p-8">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                            <div className="text-left">
                                <CardTitle className="text-2xl font-black uppercase tracking-tight">Bond Node Ready</CardTitle>
                                <CardDescription className="text-primary-foreground/80 font-bold text-[10px] uppercase tracking-widest mt-1">Registry: {bondType}</CardDescription>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Button variant="secondary" size="sm" onClick={() => handleDownloadPdf(state.data!.document, `Generated ${bondType}`)} className="h-9 px-4 rounded-xl font-bold text-[10px] uppercase">
                                    <Download className="mr-2 h-3.5 w-3.5" /> PDF
                                </Button>
                                <Button variant="secondary" size="sm" onClick={() => handlePrint(state.data!.document, `Generated ${bondType}`)} className="h-9 px-4 rounded-xl font-bold text-[10px] uppercase">
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
