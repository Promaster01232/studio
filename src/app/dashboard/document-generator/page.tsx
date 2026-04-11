"use client";

import { useActionState, useState, useEffect, useRef } from "react";
import { generateDocumentAction, type DocumentGeneratorState } from "./actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Download, 
  Printer, 
  Loader2, 
  Languages, 
  FileText, 
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
  Smartphone
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { jsPDF } from "jspdf";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";

const initialState: DocumentGeneratorState = {
  status: "idle",
  data: null,
  error: null,
};

const FormSectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h3 className="text-[10px] font-black tracking-tight text-primary mt-10 mb-6 flex items-center gap-2 text-left">
        <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
        {children}
    </h3>
);

export default function DocumentGeneratorPage() {
  const [state, formAction] = useActionState(generateDocumentAction, initialState);
  const [documentType, setDocumentType] = useState("Legal notice");
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
        toast({ variant: "destructive", title: "Export failed", description: "Pdf generation engine encountered an error." }); 
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
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl mx-auto"
      >
        <Card className="bg-[#161b22] shadow-2xl overflow-hidden rounded-[3rem] border-white/5">
          <CardHeader className="bg-white/5 border-b border-white/5 p-8 text-left">
            <div className="flex items-center gap-3 mb-2 text-primary">
                <Zap className="h-5 w-5" />
                <CardTitle className="text-xl font-black tracking-tight text-left">Draft setup</CardTitle>
            </div>
            <CardDescription className="text-[10px] font-bold opacity-60">Specify the parameters for your professional statutory instrument.</CardDescription>
          </CardHeader>
          <CardContent className="p-8 sm:p-12">
            <form action={formAction} className="space-y-12 text-left">
              <div className="grid sm:grid-cols-2 gap-10">
                <div className="space-y-4 text-left">
                  <Label htmlFor="documentType" className="text-[10px] font-bold text-gray-500 ml-1">Instrument type</Label>
                  <Select name="documentType" required value={documentType} onValueChange={setDocumentType}>
                    <SelectTrigger id="documentType" className="h-14 bg-white/5 border-white/5 font-bold rounded-2xl active:scale-95 transition-all text-left">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#161b22] border-white/5 rounded-xl">
                      <SelectItem value="Legal notice" className="font-bold">Legal notice</SelectItem>
                      <SelectItem value="Police complaint" className="font-bold">Police complaint</SelectItem>
                      <SelectItem value="Fir application" className="font-bold">Fir application</SelectItem>
                      <SelectItem value="Consumer complaint" className="font-bold">Consumer complaint</SelectItem>
                      <SelectItem value="Rti application" className="font-bold">Rti application</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-4 text-left">
                  <Label htmlFor="language" className="text-[10px] font-bold text-gray-500 ml-1 flex items-center gap-2"><Languages className="h-3.5 w-3.5 text-primary" /> Dialect protocol</Label>
                  <Select name="language" defaultValue={selectedLanguage} onValueChange={setSelectedLanguage} required>
                    <SelectTrigger id="language" className="h-14 bg-white/5 border-white/5 font-bold rounded-2xl active:scale-95 transition-all text-left">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#161b22] border-white/5 rounded-xl">
                      <SelectItem value="Simple English" className="font-bold">Simple english</SelectItem>
                      <SelectItem value="Legal English" className="font-bold">Legal english</SelectItem>
                      <SelectItem value="Hindi" className="font-bold">Hindi (Official)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-10">
                  <div className="space-y-8">
                      <FormSectionTitle>Author registry</FormSectionTitle>
                      <div className="grid sm:grid-cols-2 gap-8">
                          <div className="space-y-3 text-left">
                              <Label className="text-[9px] font-bold opacity-40 ml-1">Full legal name</Label>
                              <div className="relative">
                                  <User className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-primary opacity-40" />
                                  <Input name="senderName" placeholder="e.g., Rajesh Kumar" required className="h-12 bg-white/5 border-white/5 font-bold pl-12 rounded-xl" />
                              </div>
                          </div>
                          <div className="space-y-3 text-left">
                              <Label className="text-[9px] font-bold opacity-40 ml-1">Permanent address</Label>
                              <div className="relative">
                                  <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-primary opacity-40" />
                                  <Input name="senderAddress" placeholder="Full residential address..." required className="h-12 bg-white/5 border-white/5 font-bold pl-12 rounded-xl" />
                              </div>
                          </div>
                      </div>
                      {documentType === 'Legal notice' && (
                          <div className="space-y-3 text-left max-w-sm">
                              <Label className="text-[9px] font-bold opacity-40 ml-1">Verified mobile</Label>
                              <div className="relative">
                                  <Smartphone className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-primary opacity-40" />
                                  <Input name="senderMobile" placeholder="e.g., +91 98765 43210" className="h-12 bg-white/5 border-white/5 font-bold pl-12 rounded-xl" />
                              </div>
                          </div>
                      )}
                  </div>

                  <div className="space-y-8">
                      <FormSectionTitle>Opponent ingress</FormSectionTitle>
                      <div className="grid sm:grid-cols-2 gap-8">
                          <div className="space-y-3 text-left">
                              <Label className="text-[9px] font-bold opacity-40 ml-1">Entity name</Label>
                              <Input name="recipientName" placeholder="Person or enterprise" required={documentType !== 'Police complaint' && documentType !== 'Fir application'} className="h-12 bg-white/5 border-white/5 font-bold rounded-xl px-5" />
                          </div>
                          <div className="space-y-3 text-left">
                              <Label className="text-[9px] font-bold opacity-40 ml-1">Official address</Label>
                              <Input name="recipientAddress" placeholder="Full address..." required className="h-12 bg-white/5 border-white/5 font-bold rounded-xl px-5" />
                          </div>
                      </div>
                  </div>

                  { (documentType === 'Police complaint' || documentType === 'Fir application') && (
                      <div className="space-y-8">
                          <FormSectionTitle>Incident registry</FormSectionTitle>
                          <div className="grid sm:grid-cols-2 gap-8">
                              <div className="space-y-3 text-left">
                                  <Label className="text-[9px] font-bold opacity-40 ml-1">Timestamp</Label>
                                  <div className="relative">
                                      <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-primary opacity-40" />
                                      <Input name="incidentDate" type="datetime-local" required className="h-12 bg-white/5 border-white/5 font-bold pl-12 rounded-xl" />
                                  </div>
                              </div>
                              <div className="space-y-3 text-left">
                                  <Label className="text-[9px] font-bold opacity-40 ml-1">Precise location</Label>
                                  <Input name="incidentPlace" placeholder="Location point" required className="h-12 bg-white/5 border-white/5 font-bold rounded-xl px-5" />
                              </div>
                          </div>
                          <div className="space-y-3 text-left">
                              <Label className="text-[9px] font-bold opacity-40 ml-1">Accused identifiers</Label>
                              <Input name="accusedDetails" placeholder="Provide names or physical descriptions" className="h-12 bg-white/5 border-white/5 font-bold rounded-xl px-5" />
                          </div>
                      </div>
                  )}

                  <div className="space-y-8">
                      <FormSectionTitle>Case narration</FormSectionTitle>
                      <div className="space-y-6">
                          <div className="space-y-3 text-left">
                              <Label className="text-[9px] font-bold opacity-40 ml-1">Chronological facts</Label>
                              <Textarea name="caseDetails" placeholder="Provide a detailed sequence of events..." rows={6} required className="bg-white/5 border-white/5 rounded-[2rem] font-medium text-base p-8 shadow-inner min-h-[180px] transition-all focus:border-primary" />
                          </div>
                          { documentType !== 'Rti application' && (
                              <div className="space-y-3 text-left">
                                  <Label className="text-[9px] font-bold opacity-40 ml-1">Requested relief</Label>
                                  <div className="relative">
                                      <AlertTriangle className="absolute left-6 top-8 h-4 w-4 text-primary opacity-40" />
                                      <Textarea name="remedySought" placeholder="What statutory action do you seek from the opponent?" required className="bg-white/5 border-white/5 rounded-[2rem] font-medium text-base p-8 pl-14 shadow-inner min-h-[120px] transition-all focus:border-primary" />
                                  </div>
                              </div>
                          )}
                      </div>
                  </div>
              </div>

              <Button type="submit" disabled={state.status === 'loading'} className="w-full h-16 text-xs font-bold shadow-2xl shadow-primary/20 transition-all active:scale-95 rounded-[2rem] mt-8 group overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                {state.status === 'loading' ? (
                    <><Loader2 className="mr-3 h-5 w-5 animate-spin" /> Synthesizing draft...</>
                ) : (
                    <><FileText className="mr-3 h-5 w-5" /> Generate statutory draft</>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      <div ref={reportRef} className="space-y-8 scroll-mt-20">
        <div className="flex flex-col items-center gap-4 mb-4">
            <ChevronDown className="h-8 w-8 text-primary animate-bounce opacity-20" />
            <Badge variant="outline" className="font-bold text-[10px] bg-primary/5 px-6 py-2 rounded-full border-primary/10 shadow-sm">Report entry</Badge>
        </div>

        <Card className="bg-[#161b22] border-white/5 shadow-3xl rounded-[3rem] overflow-hidden relative min-h-[600px] flex flex-col">
            <div className="absolute inset-0 p-12 opacity-[0.02] pointer-events-none grayscale flex items-center justify-center">
                <Logo className="h-[600px] w-[600px] border-none p-0 bg-transparent shadow-none" priority={false} />
            </div>

            <CardHeader className={cn(
                "p-8 sm:p-12 relative z-10 transition-colors duration-700 border-b border-white/5",
                state.status === 'success' ? "bg-primary text-primary-foreground" : "bg-white/5 text-white"
            )}>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 text-left">
                    <div className="space-y-6 text-left flex-1 min-w-0">
                        <div className="flex items-center gap-4">
                            <div className={cn(
                                "flex items-center gap-3 px-4 py-1.5 rounded-full border shadow-sm",
                                state.status === 'success' ? "bg-white/10 border-white/20" : "bg-black/20 border-white/5"
                            )}>
                                <FileCheck className={cn("h-4 w-4", state.status === 'success' ? "text-white" : "text-primary")} />
                                <span className={cn("text-[10px] font-bold", state.status === 'success' ? "text-white" : "text-primary")}>
                                    {state.status === 'success' ? "Draft synthesized" : "System standby"}
                                </span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <CardTitle className="text-xl sm:text-3xl font-black font-headline leading-none">
                                {state.status === 'success' ? "Professional draft ready" : "Awaiting registry setup"}
                            </CardTitle>
                            <div className={cn(
                                "text-[11px] font-medium flex items-center gap-3",
                                state.status === 'success' ? "text-white/70" : "text-gray-500"
                            )}>
                                <ShieldCheck className="h-4 w-4" /> End-to-end statutory encryption active
                            </div>
                        </div>
                    </div>
                    
                    {state.status === 'success' && (
                        <div className="flex flex-wrap items-center gap-4 shrink-0">
                            <Button 
                                variant="secondary" 
                                size="sm" 
                                onClick={handleReset}
                                className="h-12 px-8 rounded-2xl font-bold text-xs gap-3 shadow-2xl active:scale-95"
                            >
                                <PlusCircle className="h-4 w-4" /> New draft
                            </Button>
                            <Button 
                                variant="secondary" 
                                size="sm" 
                                onClick={() => isEditing ? handleSave() : setIsEditing(true)} 
                                className="h-12 px-8 rounded-2xl font-bold text-xs gap-3 shadow-2xl active:scale-95"
                            >
                                {isEditing ? <><Save className="h-4 w-4" /> Save record</> : <><Edit3 className="h-4 w-4" /> Edit record</>}
                            </Button>
                            <Button 
                                variant="secondary" 
                                size="sm" 
                                onClick={() => handleDownloadPdf(editedContent, `Draft ${documentType}`)} 
                                className="h-12 px-8 rounded-2xl font-bold text-xs gap-3 shadow-2xl active:scale-95"
                            >
                                <Download className="h-4 w-4" /> Save Pdf
                            </Button>
                            <Button 
                                variant="secondary" 
                                size="sm" 
                                onClick={() => handlePrint(editedContent, `Draft ${documentType}`)} 
                                className="h-12 px-8 rounded-2xl font-bold text-xs gap-3 shadow-2xl active:scale-95"
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
                                <p className="font-black text-3xl tracking-tighter text-white">Drafting instrument...</p>
                                <p className="text-[10px] font-bold text-gray-500 animate-pulse">Running document engine...</p>
                            </div>
                        </motion.div>
                    ) : state.status === 'success' && state.data ? (
                        <motion.div 
                            key="report-content"
                            initial={{ opacity: 0, y: 20 }} 
                            animate={{ opacity: 1, y: 0 }}
                            className="h-full"
                        >
                            <div className="bg-white/5 rounded-[3rem] p-1.5 border border-white/5 shadow-inner">
                                <div className="bg-[#050505] rounded-[2.8rem] shadow-2xl p-10 sm:p-20 min-h-[80vh] text-left border-2 border-white/5 relative overflow-hidden">
                                    <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                                        <Logo className="h-[400px] w-[400px] border-none shadow-none bg-transparent" priority={false} />
                                    </div>
                                    
                                    <div className="max-w-4xl mx-auto space-y-12 relative z-10">
                                        <div className="flex justify-between items-start border-b-2 border-white/5 pb-10 mb-10">
                                            <div className="space-y-2 text-left">
                                                <p className="text-[9px] font-bold text-primary/40 tracking-widest leading-none">Draft identification</p>
                                                <p className="text-xs font-mono font-bold text-primary">NS-DRAFT-{Math.random().toString(36).substring(7).toUpperCase()}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[9px] font-bold text-gray-500/40 tracking-widest leading-none">Audit timestamp</p>
                                                <p className="text-xs font-bold flex items-center justify-end gap-2 mt-2 text-white">
                                                    <Clock className="h-3.5 w-3.5 text-primary" /> {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </p>
                                            </div>
                                        </div>

                                        {isEditing ? (
                                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 text-left">
                                                <div className="flex items-center gap-3 text-primary mb-6">
                                                    <Edit3 className="h-5 w-5" />
                                                    <span className="text-[10px] font-bold">Registry workspace active</span>
                                                </div>
                                                <Textarea 
                                                    value={editedContent}
                                                    onChange={(e) => setEditedContent(e.target.value)}
                                                    className="w-full min-h-[70vh] font-body text-base sm:text-lg leading-loose border-none focus-visible:ring-0 p-0 resize-none bg-transparent text-white"
                                                    placeholder="Start manual statutory refinements..."
                                                />
                                            </motion.div>
                                        ) : (
                                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="prose dark:prose-invert max-w-none text-left">
                                                <pre className="whitespace-pre-wrap font-body text-white/90 leading-relaxed text-sm sm:text-lg text-left selection:bg-primary/10">
                                                    {editedContent}
                                                </pre>
                                            </motion.div>
                                        )}

                                        <div className="pt-16 mt-16 border-t-2 border-white/5 flex flex-col sm:flex-row items-center justify-between gap-10 opacity-40">
                                            <div className="flex items-center gap-5">
                                                <div className="p-4 rounded-2xl bg-white/5 text-white shadow-inner">
                                                    <ShieldCheck className="h-7 w-7" />
                                                </div>
                                                <div className="text-left">
                                                    <p className="text-[11px] font-bold">Institutional security</p>
                                                    <p className="text-[10px] font-bold">This instrument is protected under attorney-client privilege.</p>
                                                </div>
                                            </div>
                                            <p className="text-[10px] font-bold tracking-[0.6em] text-white">Nyayasahayak.in // Draft-hub</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
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
                                <div className="p-12 rounded-[3rem] bg-white/5 border border-white/5 relative z-10 transition-transform group-hover:scale-110 duration-700">
                                    <FileSearch className="h-24 w-24 text-primary opacity-20 group-hover:opacity-40 transition-opacity" />
                                </div>
                            </div>
                            <div className="space-y-6 max-w-md px-8 text-center">
                                <h3 className="font-black text-2xl tracking-tighter text-white leading-none">Terminal idle</h3>
                                <p className="text-[11px] text-gray-500 font-bold leading-relaxed italic opacity-40">
                                    Provide instrument setup parameters to start your neural statutory draft.
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
