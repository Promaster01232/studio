"use client";

import { useActionState, useState, useEffect, useRef, use } from "react";
import { generateBondAction, type BondGeneratorState } from "./actions";
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
  FileSignature, 
  ArrowLeft, 
  FileText,
  Edit3,
  Save,
  Globe,
  Clock,
  ShieldCheck,
  Zap,
  PlusCircle,
  FileCheck,
  Activity,
  FileSearch,
  ChevronDown,
  AlertTriangle
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { jsPDF } from "jspdf";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";

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

export default function BondGeneratorPage(props: { params: Promise<any>, searchParams: Promise<any> }) {
  // Unwrap dynamic props for Next.js 15 compliance
  use(props.params);
  use(props.searchParams);

  const [state, formAction] = useActionState(generateBondAction, initialState);
  const [bondType, setBondType] = useState("Bail Bond");
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("Simple English");
  const { toast } = useToast();
  
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.status === 'success' && state.data) {
      setEditedContent(state.data.document);
      setIsEditing(false);
      // Kinetic Scroll to the report node
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
      toast({ title: "Statutory PDF Ready", description: "Bond document saved to local storage." });
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
    <div className="space-y-8 max-w-7xl mx-auto pb-32 px-4 sm:px-0 text-left">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-primary/5 pb-6">
        <PageHeader
          title="Bond Generator"
          description="Initialize legally sound bonds and affidavits instantly with elite AI assistance."
        />
        <Button variant="ghost" size="sm" className="rounded-xl font-bold hover:bg-primary/5 group h-10 px-6 border border-primary/5 text-primary text-[10px] uppercase tracking-widest" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" /> Back to Terminal
          </Link>
        </Button>
      </motion.div>
      
      {/* SECTION 1: INGRESS FORM */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl mx-auto"
      >
        <Card className="glass shadow-2xl overflow-hidden rounded-[2.5rem] border-primary/5">
          <CardHeader className="bg-primary/5 border-b border-primary/5 p-8 text-left">
            <div className="flex items-center gap-3 mb-2 text-primary">
                <Zap className="h-5 w-5" />
                <CardTitle className="text-xl font-black uppercase tracking-tight">Instrument Setup</CardTitle>
            </div>
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest opacity-60">Initialize statutory conditions for your official bond node.</CardDescription>
          </CardHeader>
          <CardContent className="p-8 sm:p-10">
            <form action={formAction} className="space-y-8 text-left">
              <div className="grid sm:grid-cols-2 gap-8">
                <div className="space-y-3 text-left">
                  <Label htmlFor="bondType" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Statutory Type</Label>
                  <Select name="bondType" required value={bondType} onValueChange={setBondType}>
                    <SelectTrigger id="bondType" className="h-12 glass border-primary/5 font-bold rounded-xl">
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
                <div className="space-y-3 text-left">
                  <Label htmlFor="language" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1 flex items-center gap-2"><Languages className="h-3 w-3" /> Dialect Registry</Label>
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
                  <FormSectionTitle>Case & Identity Matrix</FormSectionTitle>
                  <div className="grid md:grid-cols-2 gap-6">
                      <Input name="caseNumber" placeholder="FIR / Case / Registry No." required className="h-12 glass font-bold rounded-xl" />
                      <Input name="courtName" placeholder="Full Court / Authority Name" required className="h-12 glass font-bold rounded-xl" />
                  </div>
                  <Input name="bondAmount" placeholder="Instrument Value (in words & figures)" required className="h-12 glass font-bold rounded-xl" />
                  <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3 text-left">
                          <Label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Primary Node Name</Label>
                          <Input name="accusedName" placeholder="Full Name of Party" required className="h-12 glass font-bold rounded-xl" />
                      </div>
                      <div className="space-y-3 text-left">
                          <Label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Party Address</Label>
                          <Textarea name="accusedAddress" placeholder="Full permanent address..." required className="glass rounded-xl font-medium text-sm p-4 min-h-[100px]" />
                      </div>
                  </div>
              </div>

              <Button type="submit" disabled={state.status === 'loading'} className="w-full h-16 text-xs font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/20 transition-all active:scale-95 rounded-[1.5rem]">
                {state.status === 'loading' ? (
                    <><Loader2 className="mr-3 h-5 w-5 animate-spin" /> Analyzing Requirements...</>
                ) : (
                    <><FileSignature className="mr-3 h-5 w-5" /> Initialize Bond Generation</>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* SECTION 2: ALWAYS VISIBLE REPORT CARD */}
      <div ref={reportRef} className="space-y-8 scroll-mt-20">
        <div className="flex flex-col items-center gap-4 mb-4">
            <ChevronDown className="h-8 w-8 text-primary animate-bounce opacity-40" />
            <Badge variant="outline" className="font-black text-[9px] uppercase tracking-widest bg-primary/5 text-primary border-primary/10 px-4 py-1.5 rounded-full">Statutory Instrument Node</Badge>
        </div>

        <Card className="glass border-primary/20 shadow-3xl overflow-hidden rounded-[3rem] relative min-h-[600px] flex flex-col">
            <div className="absolute inset-0 p-12 opacity-[0.02] pointer-events-none grayscale flex items-center justify-center">
                <Logo className="h-[600px] w-[600px] border-none p-0" priority={false} />
            </div>

            <CardHeader className={cn(
                "p-8 sm:p-12 relative z-10 transition-colors duration-500",
                state.status === 'success' ? "bg-primary text-primary-foreground" : "bg-primary/5 text-foreground"
            )}>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 text-left">
                    <div className="space-y-4">
                        <div className="flex flex-wrap items-center gap-3">
                            <div className={cn(
                                "flex items-center gap-2 px-3 py-1 rounded-full border",
                                state.status === 'success' ? "bg-white/10 border-white/20" : "bg-primary/10 border-primary/20"
                            )}>
                                <FileCheck className={cn("h-4 w-4", state.status === 'success' ? "text-white" : "text-primary")} />
                                <span className={cn("text-[10px] font-black uppercase tracking-widest", state.status === 'success' ? "text-white" : "text-primary")}>
                                    Official AI Report Node Active
                                </span>
                            </div>
                            <Badge variant="outline" className={cn(
                                "text-[9px] font-black uppercase tracking-[0.2em]",
                                state.status === 'success' ? "border-white/20 text-white/80" : "border-primary/20 text-primary/60"
                            )}>
                                NS-BOND-ST-4.2
                            </Badge>
                        </div>
                        <div className="space-y-1">
                            <CardTitle className="text-3xl sm:text-5xl font-black uppercase tracking-tighter leading-none">
                                {state.status === 'success' ? <><span className="italic opacity-80">Draft Node</span> Ready.</> : "Awaiting Bond Ingress"}
                            </CardTitle>
                            <p className={cn(
                                "text-[10px] font-bold uppercase tracking-[0.3em] flex items-center gap-2",
                                state.status === 'success' ? "text-white/60" : "text-muted-foreground"
                            )}>
                                <Globe className="h-3 w-3" /> Registry: {bondType} // {selectedLanguage} Protocol
                            </p>
                        </div>
                    </div>
                    
                    {state.status === 'success' && (
                        <div className="flex flex-wrap items-center gap-3 shrink-0">
                            <Button 
                                variant="secondary" 
                                size="sm" 
                                onClick={handleReset}
                                className="h-11 px-6 rounded-xl font-black text-[10px] uppercase tracking-widest gap-2 shadow-lg"
                            >
                                <PlusCircle className="h-4 w-4" /> New Bond
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
                                onClick={() => handleDownloadPdf(editedContent, `Generated ${bondType}`)} 
                                className="h-11 px-6 rounded-xl font-black text-[10px] uppercase tracking-widest gap-2 shadow-lg"
                            >
                                <Download className="h-4 w-4" /> Statutory PDF
                            </Button>
                            <Button 
                                variant="secondary" 
                                size="sm" 
                                onClick={() => handlePrint(editedContent, `Generated ${bondType}`)} 
                                className="h-11 px-6 rounded-xl font-black text-[10px] uppercase tracking-widest gap-2 shadow-lg"
                            >
                                <Printer className="h-4 w-4" /> Print
                            </Button>
                        </div>
                    )}
                </div>
            </CardHeader>
            
            <CardContent className="p-8 sm:p-12 flex-1 relative z-10">
                <AnimatePresence mode="wait">
                    {state.status === 'loading' ? (
                        <motion.div 
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center h-full py-20 text-center gap-10"
                        >
                            <div className="relative w-fit mx-auto">
                                <Loader2 className="h-20 w-20 animate-spin text-primary opacity-20" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Activity className="h-8 w-8 text-primary animate-pulse" />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <p className="font-black text-2xl tracking-tighter uppercase">Analyzing Requirements...</p>
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground animate-pulse">Initializing forensic instrument node // BNS-V4.2 Ingress</p>
                            </div>
                        </motion.div>
                    ) : state.status === 'success' && state.data ? (
                        <motion.div 
                            key="report-content"
                            initial={{ opacity: 0, y: 20 }} 
                            animate={{ opacity: 1, y: 0 }}
                            className="h-full"
                        >
                            <div className="bg-muted/20 rounded-[2.5rem] p-1 border border-primary/5 shadow-inner">
                                <div className="bg-white dark:bg-zinc-950 rounded-[2.2rem] shadow-2xl p-10 sm:p-16 min-h-[80vh] text-left border-2 border-primary/10 relative overflow-hidden">
                                    {/* Inner Watermark */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                                        <Logo className="h-[400px] w-[400px] border-none shadow-none" priority={false} />
                                    </div>

                                    <div className="max-w-4xl mx-auto space-y-10 relative z-10">
                                        <div className="flex justify-between items-start border-b-2 border-primary/10 pb-8 mb-8">
                                            <div className="space-y-1">
                                                <p className="text-[9px] font-black uppercase text-primary/40 tracking-widest leading-none">Draft Node Ingress</p>
                                                <p className="text-xs font-mono font-bold text-primary">NS-BOND-{Math.random().toString(36).substring(7).toUpperCase()}</p>
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
                                            <p className="text-[9px] font-black uppercase tracking-[0.5em]">NYAYASAHAYAK.IN // TERMINAL NS-BOND</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ) : state.status === 'error' ? (
                        <motion.div key="error" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center py-20 text-center gap-6">
                            <div className="p-4 rounded-2xl bg-destructive/10 text-destructive shadow-inner">
                                <AlertTriangle className="h-10 w-10" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black uppercase tracking-tight text-destructive">Bond Node Error</h3>
                                <p className="text-sm font-medium text-muted-foreground leading-relaxed max-w-md mx-auto">
                                    {state.error}
                                </p>
                            </div>
                            <Button onClick={handleReset} variant="outline" className="rounded-xl font-bold h-12 px-10 border-destructive/20 text-destructive hover:bg-destructive/5">
                                Clear Protocol
                            </Button>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="idle" 
                            initial={{ opacity: 0, scale: 0.95 }} 
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center justify-center py-32 text-center gap-10"
                        >
                            <div className="relative">
                                <div className="absolute -inset-6 bg-primary/5 rounded-full blur-2xl animate-pulse"></div>
                                <div className="p-10 rounded-[2.5rem] bg-muted/30 border border-primary/5 relative z-10 group-hover:scale-110 transition-transform duration-700">
                                    <FileSearch className="h-20 w-20 text-primary opacity-20" />
                                </div>
                            </div>
                            <div className="space-y-4 max-w-sm px-6">
                                <h3 className="font-black text-3xl tracking-tighter uppercase text-foreground leading-none">Awaiting Ingress</h3>
                                <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-[0.2em] leading-relaxed italic opacity-60">
                                    Initialize the forensic node by providing the statutory details for neural bond generation.
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </CardContent>
            <div className="h-2 w-full bg-gradient-to-r from-primary via-accent to-blue-400"></div>
        </Card>
      </div>
    </div>
  );
}
