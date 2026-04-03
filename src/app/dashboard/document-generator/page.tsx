"use client";

import { useActionState, useState, useEffect, use } from "react";
import { generateDocumentAction, type DocumentGeneratorState } from "./actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Download, 
  Printer, 
  Loader2, 
  Languages, 
  FileText, 
  ArrowLeft,
  Edit3,
  Save,
  Globe,
  Clock,
  ShieldCheck,
  Zap,
  PlusCircle,
  FileCheck
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { jsPDF } from "jspdf";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";

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

export default function DocumentGeneratorPage(props: { params: Promise<any>, searchParams: Promise<any> }) {
  // Unwrap dynamic props for Next.js 15 compliance
  use(props.params);
  use(props.searchParams);

  const [state, formAction] = useActionState(generateDocumentAction, initialState);
  const [documentType, setDocumentType] = useState("Legal Notice");
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("Simple English");
  const { toast } = useToast();

  useEffect(() => {
    if (state.status === 'success' && state.data) {
      setEditedContent(state.data.document);
      setIsEditing(false);
    }
  }, [state.status, state.data]);

  const handlePrint = (content: string, title: string) => {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    const doc = iframe.contentWindow?.document;
    if (!doc) { document.body.removeChild(iframe); return; }
    doc.open();
    doc.write(`
        <html>
            <head>
                <title>${title}</title>
                <style>
                    body { font-family: 'Times New Roman', serif; padding: 50px; line-height: 1.8; color: #000; }
                    h1 { text-align: center; text-transform: uppercase; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 40px; font-size: 18pt; }
                    pre { white-space: pre-wrap; font-size: 12pt; word-wrap: break-word; }
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

  const handleDownloadPdf = (content: string, title: string) => {
    try {
      const doc = new jsPDF();
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text(title.toUpperCase(), 105, 20, { align: 'center' });
      doc.setLineWidth(0.5);
      doc.line(20, 25, 190, 25);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      const lines = doc.splitTextToSize(content, 170);
      doc.text(lines, 20, 40);
      
      doc.save(`${title.replace(/[\s/]/g, '-')}.pdf`);
      toast({ title: "Statutory PDF Ready", description: "Document saved to local storage." });
    } catch (e) { 
        toast({ variant: "destructive", title: "Export Failed", description: "PDF generation engine encountered an error." }); 
    }
  };

  const handleSave = () => {
      setIsEditing(false);
      toast({ title: "Draft Synchronized", description: "Changes saved to active registry session." });
  };

  const handleReset = () => {
      window.location.reload();
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20 px-4 sm:px-0 text-left">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-primary/5 pb-6">
        <PageHeader
          title="Drafting Terminal"
          description="Draft professional legal instruments in seconds using high-fidelity AI assistance."
        />
        <Button variant="ghost" size="sm" className="rounded-xl font-bold hover:bg-primary/5 group h-10 px-6 border border-primary/5 text-primary text-[10px] uppercase tracking-widest" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" /> Back to Terminal
          </Link>
        </Button>
      </motion.div>
      
      <AnimatePresence mode="wait">
        {state.status !== 'success' ? (
          <motion.div 
            key="input-form"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-4xl mx-auto"
          >
            <Card className="glass shadow-2xl overflow-hidden rounded-[2.5rem] border-primary/5">
              <CardHeader className="bg-primary/5 border-b border-primary/5 p-8 text-left">
                <div className="flex items-center gap-3 mb-2 text-primary">
                    <Zap className="h-5 w-5" />
                    <CardTitle className="text-xl font-black uppercase tracking-tight">Instrument Setup</CardTitle>
                </div>
                <CardDescription className="text-[10px] font-bold uppercase tracking-widest opacity-60">Fill in the identity nodes to generate your legal draft.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 sm:p-10">
                <form action={formAction} className="space-y-8 text-left">
                  <div className="grid sm:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label htmlFor="documentType" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Instrument Type</Label>
                      <Select name="documentType" required value={documentType} onValueChange={setDocumentType}>
                        <SelectTrigger id="documentType" className="h-12 glass border-primary/5 font-bold rounded-xl">
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
                      <Select name="language" defaultValue={selectedLanguage} onValueChange={setSelectedLanguage} required>
                        <SelectTrigger id="language" className="h-12 glass border-primary/5 font-bold rounded-xl">
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

                  <div className="space-y-6">
                      <FormSectionTitle>Statutory Registry Nodes</FormSectionTitle>
                      <div className="grid sm:grid-cols-2 gap-6">
                          <div className="space-y-3 text-left">
                              <Label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Sender/Complainant Name</Label>
                              <Input name="senderName" placeholder="Full name of party" required className="h-12 glass font-bold rounded-xl" />
                          </div>
                          <div className="space-y-3 text-left">
                              <Label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Instrument Address</Label>
                              <Input name="senderAddress" placeholder="Full official address..." required className="h-12 glass font-bold rounded-xl" />
                          </div>
                      </div>
                      <div className="space-y-3 text-left">
                          <Label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Case Forensic Narrative</Label>
                          <Textarea name="caseDetails" placeholder="Elaborate on the facts and circumstances..." rows={6} required className="glass rounded-xl font-medium text-sm p-6 shadow-inner" />
                      </div>
                  </div>

                  <Button type="submit" disabled={state.status === "loading"} className="w-full h-16 text-xs font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/20 transition-all active:scale-95 rounded-[1.5rem]">
                    {state.status === "loading" ? (
                      <><Loader2 className="mr-3 h-5 w-5 animate-spin" /> Neural Ingress Active...</>
                    ): (
                      <><FileText className="mr-3 h-5 w-5" /> Initialize Statutory Draft</>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div 
            key="success-report"
            initial={{ opacity: 0, y: 40 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="space-y-8"
          >
            <Card className="glass border-primary shadow-3xl overflow-hidden rounded-[3rem] relative">
                {/* Background Watermark */}
                <div className="absolute inset-0 p-12 opacity-[0.02] pointer-events-none grayscale flex items-center justify-center">
                    <Logo className="h-[600px] w-[600px] border-none p-0" priority={false} />
                </div>

                <CardHeader className="bg-primary text-primary-foreground p-8 sm:p-12 relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                        <div className="text-left space-y-4">
                            <div className="flex flex-wrap items-center gap-3">
                                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20">
                                    <FileCheck className="h-4 w-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Official AI Report Node Active</span>
                                </div>
                                <Badge variant="outline" className="text-[9px] font-black uppercase tracking-[0.2em] border-white/20 text-white/80">NS-DRAFT-STAT-4.2</Badge>
                            </div>
                            <div className="space-y-1">
                                <CardTitle className="text-3xl sm:text-5xl font-black uppercase tracking-tighter leading-none">Draft Node <span className="italic opacity-80">Ready.</span></CardTitle>
                                <p className="text-[10px] font-bold text-white/60 uppercase tracking-[0.3em] flex items-center gap-2">
                                    <Globe className="h-3 w-3" /> Registry: {documentType} // Forensic Dialect Node
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 shrink-0">
                            <Button 
                                variant="secondary" 
                                size="sm" 
                                onClick={handleReset}
                                className="h-11 px-6 rounded-xl font-black text-[10px] uppercase tracking-widest gap-2 shadow-lg"
                            >
                                <PlusCircle className="h-4 w-4" /> New Draft
                            </Button>
                            <Button 
                                variant="secondary" 
                                size="sm" 
                                onClick={() => isEditing ? handleSave() : setIsEditing(true)} 
                                className="h-11 px-6 rounded-xl font-black text-[10px] uppercase tracking-widest gap-2 shadow-lg"
                            >
                                {isEditing ? <><Save className="h-4 w-4" /> Save Registry</> : <><Edit3 className="h-4 w-4" /> Protocol Edit</>}
                            </Button>
                            <Button 
                                variant="secondary" 
                                size="sm" 
                                onClick={() => handleDownloadPdf(editedContent, `Draft ${documentType}`)} 
                                className="h-11 px-6 rounded-xl font-black text-[10px] uppercase tracking-widest gap-2 shadow-lg"
                            >
                                <Download className="h-4 w-4" /> Statutory PDF
                            </Button>
                            <Button 
                                variant="secondary" 
                                size="sm" 
                                onClick={() => handlePrint(editedContent, `Draft ${documentType}`)} 
                                className="h-11 px-6 rounded-xl font-black text-[10px] uppercase tracking-widest gap-2 shadow-lg"
                            >
                                <Printer className="h-4 w-4" /> Print
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                
                <CardContent className="p-8 sm:p-12 relative z-10">
                    <div className="bg-muted/20 rounded-[2.5rem] p-1 border border-primary/5 shadow-inner">
                        <div className="bg-white dark:bg-zinc-950 rounded-[2.2rem] shadow-2xl p-10 sm:p-16 min-h-[80vh] text-left border-2 border-primary/10">
                            <div className="max-w-4xl mx-auto space-y-10">
                                <div className="flex justify-between items-start border-b-2 border-primary/10 pb-8 mb-8">
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-black uppercase text-primary/40 tracking-widest leading-none">Draft Node Ingress</p>
                                        <p className="text-xs font-mono font-bold text-primary">NS-DRAFT-{Math.random().toString(36).substring(7).toUpperCase()}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[9px] font-black uppercase text-muted-foreground/40 tracking-widest leading-none">Audit Timestamp</p>
                                        <p className="text-xs font-bold flex items-center justify-end gap-2 mt-1">
                                            <Clock className="h-3 w-3 text-primary" /> {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </p>
                                    </div>
                                </div>

                                {isEditing ? (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                                        <div className="flex items-center gap-2 text-primary mb-4">
                                            <Edit3 className="h-4 w-4" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Workspace Protocol Active</span>
                                        </div>
                                        <Textarea 
                                            value={editedContent}
                                            onChange={(e) => setEditedContent(e.target.value)}
                                            className="w-full min-h-[70vh] font-body text-base sm:text-lg leading-relaxed border-none focus-visible:ring-0 p-0 resize-none bg-transparent"
                                            placeholder="Begin manual statutory refinements..."
                                        />
                                    </motion.div>
                                ) : (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="prose dark:prose-invert max-w-none">
                                        <pre className="whitespace-pre-wrap font-body text-foreground leading-relaxed text-sm sm:text-lg text-left selection:bg-primary/10">
                                            {editedContent}
                                        </pre>
                                    </motion.div>
                                )}

                                <div className="pt-16 mt-16 border-t-2 border-primary/10 flex flex-col sm:flex-row items-center justify-between gap-8 opacity-40">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-2xl bg-primary/5 text-primary">
                                            <ShieldCheck className="h-6 w-6" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-[10px] font-black uppercase tracking-widest">Statutory Security</p>
                                            <p className="text-[9px] font-bold">This node is protected under attorney-client transience.</p>
                                        </div>
                                    </div>
                                    <p className="text-[9px] font-black uppercase tracking-[0.5em]">NYAYASAHAYAK.IN // TERMINAL NS-DRAFT</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
                <div className="h-2 w-full bg-gradient-to-r from-primary via-accent to-blue-400"></div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
