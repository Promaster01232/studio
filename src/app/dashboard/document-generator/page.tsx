"use client";

import { useActionState, useState, useEffect, useRef } from "react";
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
  FileCheck,
  User,
  MapPin,
  Calendar,
  AlertTriangle,
  Activity,
  FileSearch,
  ChevronDown,
  Smartphone,
  Cpu,
  X,
  FileSignature
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
    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mt-10 mb-6 flex items-center gap-2 text-left">
        <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
        {children}
    </h3>
);

export default function DocumentGeneratorPage() {
  const [state, formAction] = useActionState(generateDocumentAction, initialState);
  const [documentType, setDocumentType] = useState("Legal Notice");
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("Simple English");
  const { toast } = useToast();
  
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.status === 'success' && state.data) {
      setEditedContent(state.data.document);
      setIsEditing(false);
      setTimeout(() => {
        reportRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
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
                    pre { white-space: pre-wrap; font-family: 'Times New Roman', serif; font-size: 12pt; word-wrap: break-word; }
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
      toast({ title: "Draft ready", description: "Document saved to local storage." });
    } catch (e) { 
        toast({ variant: "destructive", title: "Export failed", description: "PDF generation engine encountered an error." }); 
    }
  };

  const handleSave = () => {
      setIsEditing(false);
      toast({ title: "Draft saved", description: "Changes saved to active registry session." });
  };

  const handleReset = () => {
      window.location.reload();
  };

  return (
    <div className="space-y-12 max-w-7xl mx-auto pb-32 px-4 sm:px-6 text-left">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row items-center justify-between border-b-4 border-foreground pb-4 mb-10 gap-6">
        <div className="flex items-center gap-4">
            <div className="p-4 border-2 border-foreground rounded-2xl bg-foreground/5 shadow-sm">
                <FileSignature className="h-6 w-6 text-primary" />
            </div>
            <div className="text-left">
                <h1 className="text-2xl sm:text-4xl font-black font-headline tracking-tighter leading-none">Write papers</h1>
            </div>
        </div>
        <Button variant="outline" size="sm" className="rounded-full font-black text-[10px] uppercase tracking-widest h-10 px-6 border-foreground/20 hover:bg-foreground hover:text-background transition-all" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-3.5 w-3.5" /> Back to hub
          </Link>
        </Button>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl mx-auto"
      >
        <Card className="glass shadow-2xl overflow-hidden rounded-[3rem] border-primary/5 bg-card">
          <CardHeader className="bg-primary/5 border-b border-primary/10 p-8 text-left">
            <div className="flex items-center gap-3 mb-2 text-primary">
                <Zap className="h-5 w-5" />
                <CardTitle className="text-xl font-black uppercase tracking-tight text-left">Setup file</CardTitle>
            </div>
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest opacity-60">Specify the parameters for your professional instrument.</CardDescription>
          </CardHeader>
          <CardContent className="p-8 sm:p-12">
            <form action={formAction} className="space-y-12 text-left">
              <div className="grid sm:grid-cols-2 gap-10">
                <div className="space-y-4 text-left">
                  <Label htmlFor="documentType" className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">Statutory type</Label>
                  <Select name="documentType" required value={documentType} onValueChange={setDocumentType}>
                    <SelectTrigger id="documentType" className="h-14 glass border-primary/5 font-black uppercase text-[10px] rounded-2xl active:scale-95 transition-all">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="glass border-primary/5 rounded-[1.5rem]">
                      <SelectItem value="Legal Notice" className="font-black uppercase text-[10px]">Legal notice</SelectItem>
                      <SelectItem value="Police Complaint" className="font-black uppercase text-[10px]">Police complaint</SelectItem>
                      <SelectItem value="FIR Application" className="font-black uppercase text-[10px]">FIR application</SelectItem>
                      <SelectItem value="Consumer Complaint" className="font-black uppercase text-[10px]">Consumer complaint</SelectItem>
                      <SelectItem value="RTI Application" className="font-black uppercase text-[10px]">RTI application</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-4 text-left">
                  <Label htmlFor="language" className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1 flex items-center gap-2"><Languages className="h-3.5 w-3.5 text-primary" /> Dialect registry</Label>
                  <Select name="language" defaultValue={selectedLanguage} onValueChange={setSelectedLanguage} required>
                    <SelectTrigger id="language" className="h-14 glass border-primary/5 font-black uppercase text-[10px] rounded-2xl active:scale-95 transition-all">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass border-primary/5 rounded-[1.5rem]">
                      <SelectItem value="Simple English" className="font-black uppercase text-[10px]">Simple English</SelectItem>
                      <SelectItem value="Legal English" className="font-black uppercase text-[10px]">Legal English</SelectItem>
                      <SelectItem value="Hindi" className="font-black uppercase text-[10px]">Hindi (Official)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-10">
                  <div className="space-y-8">
                      <FormSectionTitle>Author info</FormSectionTitle>
                      <div className="grid sm:grid-cols-2 gap-8">
                          <div className="space-y-3 text-left">
                              <Label className="text-[9px] font-black uppercase tracking-widest opacity-40 ml-1">Full legal name</Label>
                              <div className="relative">
                                  <User className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-primary opacity-40" />
                                  <Input name="senderName" placeholder="e.g., Rajesh Kumar" required className="h-12 glass font-bold pl-12 rounded-xl" />
                              </div>
                          </div>
                          <div className="space-y-3 text-left">
                              <Label className="text-[9px] font-black uppercase tracking-widest opacity-40 ml-1">Residential address</Label>
                              <div className="relative">
                                  <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-primary opacity-40" />
                                  <Input name="senderAddress" placeholder="Full address..." required className="h-12 glass font-bold pl-12 rounded-xl" />
                              </div>
                          </div>
                      </div>
                      {documentType === 'Legal Notice' && (
                          <div className="space-y-3 text-left max-w-sm">
                              <Label className="text-[9px] font-black uppercase tracking-widest opacity-40 ml-1">Verified mobile</Label>
                              <div className="relative">
                                  <Smartphone className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-primary opacity-40" />
                                  <Input name="senderMobile" placeholder="e.g., +91 98765 43210" className="h-12 glass font-bold pl-12 rounded-xl" />
                              </div>
                          </div>
                      )}
                  </div>

                  <div className="space-y-8">
                      <FormSectionTitle>Opponent info</FormSectionTitle>
                      <div className="grid sm:grid-cols-2 gap-8">
                          <div className="space-y-3 text-left">
                              <Label className="text-[9px] font-black uppercase tracking-widest opacity-40 ml-1">Entity name</Label>
                              <Input name="recipientName" placeholder="Person or enterprise" required={documentType !== 'Police Complaint' && documentType !== 'FIR Application'} className="h-12 glass font-bold rounded-xl px-5" />
                          </div>
                          <div className="space-y-3 text-left">
                              <Label className="text-[9px] font-black uppercase tracking-widest opacity-40 ml-1">Official address</Label>
                              <Input name="recipientAddress" placeholder="Full address..." required className="h-12 glass font-bold rounded-xl px-5" />
                          </div>
                      </div>
                  </div>

                  { (documentType === 'Police Complaint' || documentType === 'FIR Application') && (
                      <div className="space-y-8">
                          <FormSectionTitle>Incident registry</FormSectionTitle>
                          <div className="grid sm:grid-cols-2 gap-8">
                              <div className="space-y-3 text-left">
                                  <Label className="text-[9px] font-black uppercase tracking-widest opacity-40 ml-1">Timestamp</Label>
                                  <div className="relative">
                                      <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-primary opacity-40" />
                                      <Input name="incidentDate" type="datetime-local" required className="h-12 glass font-bold pl-12 rounded-xl" />
                                  </div>
                              </div>
                              <div className="space-y-3 text-left">
                                  <Label className="text-[9px] font-black uppercase tracking-widest opacity-40 ml-1">Location point</Label>
                                  <Input name="incidentPlace" placeholder="Precise location" required className="h-12 glass font-bold rounded-xl px-5" />
                              </div>
                          </div>
                          <div className="space-y-3 text-left">
                              <Label className="text-[9px] font-black uppercase tracking-widest opacity-40 ml-1">Accused identifiers (if known)</Label>
                              <Input name="accusedDetails" placeholder="Provide names or descriptions" className="h-12 glass font-bold rounded-xl px-5" />
                          </div>
                      </div>
                  )}

                  <div className="space-y-8">
                      <FormSectionTitle>Case narration</FormSectionTitle>
                      <div className="space-y-6">
                          <div className="space-y-3 text-left">
                              <Label className="text-[9px] font-black uppercase tracking-widest opacity-40 ml-1">Detailed events</Label>
                              <Textarea name="caseDetails" placeholder="Provide a chronological sequence of facts..." rows={6} required className="glass rounded-[2rem] font-medium text-base p-8 shadow-inner min-h-[180px] transition-all focus:border-primary" />
                          </div>
                          { documentType !== 'RTI Application' && (
                              <div className="space-y-3 text-left">
                                  <Label className="text-[9px] font-black uppercase tracking-widest opacity-40 ml-1">Requested remedy</Label>
                                  <div className="relative">
                                      <AlertTriangle className="absolute left-6 top-8 h-4 w-4 text-primary opacity-40" />
                                      <Textarea name="remedySought" placeholder="What statutory action is required from the opponent?" required className="glass rounded-[2rem] font-medium text-base p-8 pl-14 shadow-inner min-h-[120px] transition-all focus:border-primary" />
                                  </div>
                              </div>
                          )}
                      </div>
                  </div>
              </div>

              <Button type="submit" disabled={state.status === 'loading'} className="w-full h-16 text-[11px] font-black uppercase tracking-[0.4em] shadow-2xl shadow-primary/20 transition-all active:scale-95 rounded-[2rem] mt-8 group overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                {state.status === 'loading' ? (
                    <><Loader2 className="mr-3 h-5 w-5 animate-spin" /> Analyzing requirements...</>
                ) : (
                    <><FileText className="mr-3 h-5 w-5" /> Execute draft generation</>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      <div ref={reportRef} className="space-y-8 scroll-mt-20">
        <div className="flex flex-col items-center gap-4 mb-4">
            <ChevronDown className="h-8 w-8 text-primary animate-bounce opacity-20" />
            <Badge variant="outline" className="font-black text-[10px] uppercase tracking-widest bg-primary/5 text-primary border-primary/10 px-6 py-2 rounded-full">Report entry</Badge>
        </div>

        <Card className="glass border-primary/20 shadow-3xl overflow-hidden rounded-[3rem] relative min-h-[600px] flex flex-col bg-card">
            <div className="absolute inset-0 p-12 opacity-[0.02] pointer-events-none grayscale flex items-center justify-center">
                <Logo className="h-[600px] w-[600px] border-none p-0" priority={false} />
            </div>

            <CardHeader className={cn(
                "p-8 sm:p-12 relative z-10 transition-colors duration-700 border-b border-primary/10",
                state.status === 'success' ? "bg-primary text-primary-foreground" : "bg-muted/30 text-foreground"
            )}>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 text-left">
                    <div className="space-y-6 text-left flex-1 min-w-0">
                        <div className="flex items-center gap-4">
                            <div className={cn(
                                "flex items-center gap-3 px-4 py-1.5 rounded-full border shadow-sm",
                                state.status === 'success' ? "bg-white/10 border-white/20" : "bg-background border-primary/5"
                            )}>
                                <FileCheck className={cn("h-4 w-4", state.status === 'success' ? "text-white" : "text-primary")} />
                                <span className={cn("text-[10px] font-bold uppercase", state.status === 'success' ? "text-white" : "text-primary")}>
                                    {state.status === 'success' ? "Draft synthesized" : "Awaiting entry"}
                                </span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <CardTitle className="text-xl sm:text-3xl font-black font-headline leading-none uppercase">
                                {state.status === 'success' ? "Professional draft ready" : "Awaiting registry info"}
                            </CardTitle>
                            <div className={cn(
                                "text-[11px] font-medium flex items-center gap-3",
                                state.status === 'success' ? "text-white/70" : "text-muted-foreground"
                            )}>
                                <ShieldCheck className="h-4 w-4" /> End-to-end encrypted session
                            </div>
                        </div>
                    </div>
                    
                    {state.status === 'success' && (
                        <div className="flex flex-wrap items-center gap-4 shrink-0">
                            <Button 
                                variant="secondary" 
                                size="sm" 
                                onClick={handleReset}
                                className="h-12 px-8 rounded-2xl font-black text-[10px] uppercase tracking-widest gap-3 shadow-2xl active:scale-95"
                            >
                                <PlusCircle className="h-4 w-4" /> New draft
                            </Button>
                            <Button 
                                variant="secondary" 
                                size="sm" 
                                onClick={() => isEditing ? handleSave() : setIsEditing(true)} 
                                className="h-12 px-8 rounded-2xl font-black text-[10px] uppercase tracking-widest gap-3 shadow-2xl active:scale-95"
                            >
                                {isEditing ? <><Save className="h-4 w-4" /> Save registry</> : <><Edit3 className="h-4 w-4" /> Edit draft</>}
                            </Button>
                            <Button 
                                variant="secondary" 
                                size="sm" 
                                onClick={() => handleDownloadPdf(editedContent, `Draft ${documentType}`)} 
                                className="h-12 px-8 rounded-2xl font-black text-[10px] uppercase tracking-widest gap-3 shadow-2xl active:scale-95"
                            >
                                <Download className="h-4 w-4" /> Save PDF
                            </Button>
                            <Button 
                                variant="secondary" 
                                size="sm" 
                                onClick={() => handlePrint(editedContent, `Draft ${documentType}`)} 
                                className="h-12 px-8 rounded-2xl font-black text-[10px] uppercase tracking-widest gap-3 shadow-2xl active:scale-95"
                            >
                                <Printer className="h-4 w-4" /> Print
                            </Button>
                        </div>
                    )}
                </div>
            </CardHeader>
            
            <CardContent className="p-10 sm:p-16 flex-1 relative z-10">
                <AnimatePresence mode="wait">
                    {state.status === 'loading' ? (
                        <motion.div 
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center h-full py-24 text-center gap-12"
                        >
                            <div className="relative w-fit mx-auto">
                                <Loader2 className="h-24 w-24 animate-spin text-primary opacity-20" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Activity className="h-10 w-10 text-primary animate-pulse" />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <p className="font-black text-3xl tracking-tighter uppercase text-foreground">Drafting instrument...</p>
                                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground animate-pulse">Running document system...</p>
                            </div>
                        </motion.div>
                    ) : state.status === 'success' && state.data ? (
                        <motion.div 
                            key="report-content"
                            initial={{ opacity: 0, y: 20 }} 
                            animate={{ opacity: 1, y: 0 }}
                            className="h-full"
                        >
                            <div className="bg-muted/20 rounded-[3rem] p-1.5 border border-primary/5 shadow-inner">
                                <div className="bg-white dark:bg-zinc-950 rounded-[2.8rem] shadow-2xl p-10 sm:p-20 min-h-[80vh] text-left border-2 border-primary/10 relative overflow-hidden">
                                    <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                                        <Logo className="h-[400px] w-[400px] border-none shadow-none" priority={false} />
                                    </div>
                                    
                                    <div className="max-w-4xl mx-auto space-y-12 relative z-10">
                                        <div className="flex justify-between items-start border-b-2 border-primary/10 pb-10 mb-10">
                                            <div className="space-y-2 text-left">
                                                <p className="text-[9px] font-black uppercase text-primary/40 tracking-widest leading-none">Draft identification</p>
                                                <p className="text-xs font-mono font-bold text-primary">NS-DRAFT-{Math.random().toString(36).substring(7).toUpperCase()}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[9px] font-black uppercase text-muted-foreground/40 tracking-widest leading-none">Audit timestamp</p>
                                                <p className="text-xs font-bold flex items-center justify-end gap-2 mt-2">
                                                    <Clock className="h-3.5 w-3.5 text-primary" /> {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </p>
                                            </div>
                                        </div>

                                        {isEditing ? (
                                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 text-left">
                                                <div className="flex items-center gap-3 text-primary mb-6">
                                                    <Edit3 className="h-5 w-5" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Registry workspace active</span>
                                                </div>
                                                <Textarea 
                                                    value={editedContent}
                                                    onChange={(e) => setEditedContent(e.target.value)}
                                                    className="w-full min-h-[70vh] font-body text-base sm:text-lg leading-loose border-none focus-visible:ring-0 p-0 resize-none bg-transparent"
                                                    placeholder="Start manual statutory refinements..."
                                                />
                                            </motion.div>
                                        ) : (
                                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="prose dark:prose-invert max-w-none text-left">
                                                <pre className="whitespace-pre-wrap font-body text-foreground leading-relaxed text-sm sm:text-lg text-left selection:bg-primary/10">
                                                    {editedContent}
                                                </pre>
                                            </motion.div>
                                        )}

                                        <div className="pt-16 mt-16 border-t-2 border-primary/10 flex flex-col sm:flex-row items-center justify-between gap-10 opacity-40">
                                            <div className="flex items-center gap-5">
                                                <div className="p-4 rounded-2xl bg-primary/5 text-primary shadow-inner">
                                                    <ShieldCheck className="h-7 w-7" />
                                                </div>
                                                <div className="text-left">
                                                    <p className="text-[11px] font-black uppercase tracking-widest">Institutional security</p>
                                                    <p className="text-[10px] font-bold">This instrument is protected under attorney-client privilege.</p>
                                                </div>
                                            </div>
                                            <p className="text-[10px] font-black uppercase tracking-[0.6em]">NYAYASAHAYAK.IN // DRAFT-OS</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ) : state.status === 'error' ? (
                        <motion.div key="error" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center py-24 text-center gap-8">
                            <div className="p-6 rounded-[2rem] bg-destructive/10 text-destructive shadow-inner">
                                <AlertTriangle className="h-12 w-12" />
                            </div>
                            <div className="space-y-3 text-center">
                                <h3 className="text-2xl font-black uppercase tracking-tight text-destructive">Synthesis error</h3>
                                <p className="text-sm font-medium text-muted-foreground leading-relaxed max-w-md mx-auto px-6">
                                    {state.error}
                                </p>
                            </div>
                            <Button onClick={handleReset} variant="outline" className="rounded-xl font-bold h-12 px-12 border-destructive/20 text-destructive hover:bg-destructive/5 active:scale-95 transition-all">
                                <X className="mr-2 h-4 w-4" /> Clear protocol
                            </Button>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="idle" 
                            initial={{ opacity: 0, scale: 0.95 }} 
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center justify-center py-40 text-center gap-12"
                        >
                            <div className="relative">
                                <div className="absolute -inset-8 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
                                <div className="p-12 rounded-[3rem] bg-muted/30 border border-primary/5 relative z-10 transition-transform group-hover:scale-110 duration-700">
                                    <FileSearch className="h-24 w-24 text-primary opacity-20 group-hover:opacity-40 transition-opacity" />
                                </div>
                            </div>
                            <div className="space-y-6 max-w-md px-8 text-center">
                                <h3 className="font-black text-4xl tracking-tighter uppercase text-foreground leading-none">Terminal idle</h3>
                                <p className="text-[11px] text-muted-foreground font-black uppercase tracking-[0.3em] leading-relaxed italic opacity-40">
                                    Provide instrument setup to start your neural draft.
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </CardContent>
            <div className="h-3 w-full bg-gradient-to-r from-primary via-accent to-blue-400"></div>
        </Card>
      </div>
    </div>
  );
}