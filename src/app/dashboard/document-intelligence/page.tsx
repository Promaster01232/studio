"use client";

import { useActionState, useRef, useState } from "react";
import { understandDocumentAction, type DocumentIntelligenceState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FileUp, Bot, AlertTriangle, CalendarClock, ListChecks, Bomb, Languages, FileText, ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { AudioAssistant } from "@/components/audio-assistant";

const initialState: DocumentIntelligenceState = {
  status: "idle",
  data: null,
  error: null,
};

export default function DocumentIntelligencePage() {
  const [state, formAction] = useActionState(understandDocumentAction, initialState);
  const [fileName, setFileName] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-20">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <PageHeader
          title="Document Audit Node"
          description="Institutional-grade AI intelligence for legal document risk assessment and clause extraction."
        />
      </motion.div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-5 space-y-6"
        >
          <Card className="glass shadow-2xl overflow-hidden rounded-[2rem] border-primary/5">
            <CardHeader className="bg-primary/5 border-b border-primary/10 p-8">
              <div className="flex items-center gap-3 mb-2">
                  <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                    <FileUp className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-2xl font-black tracking-tight leading-none">Ingestion Terminal</CardTitle>
              </div>
              <CardDescription className="text-xs font-medium opacity-70">Secured forensic upload node.</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <form action={formAction} className="space-y-8">
                <div className="space-y-4">
                  <Label htmlFor="document" className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">Document Registry</Label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-primary/5 rounded-2xl transition-all group-hover:bg-primary/10 border border-primary/10 group-hover:border-primary/30 pointer-events-none"></div>
                    <Input 
                      id="document" 
                      name="document" 
                      type="file" 
                      required 
                      onChange={handleFileChange}
                      ref={fileInputRef}
                      accept=".pdf,.doc,.docx,image/*"
                      className="h-24 opacity-0 cursor-pointer relative z-10"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 pointer-events-none">
                        <FileText className="h-8 w-8 text-primary opacity-40 group-hover:scale-110 transition-transform duration-500" />
                        <p className="text-[11px] font-bold text-muted-foreground group-hover:text-primary transition-colors">
                            {fileName ? fileName : "Drag & drop or browse file"}
                        </p>
                    </div>
                  </div>
                  {fileName && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-3 p-3 bg-green-500/5 rounded-xl border border-green-500/10">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <p className="text-[11px] font-bold text-green-600 truncate flex-1">{fileName}</p>
                        <button type="button" onClick={() => { setFileName(""); if(fileInputRef.current) fileInputRef.current.value=""; }} className="text-muted-foreground hover:text-destructive transition-colors">
                            <Bot className="h-3 w-3" />
                        </button>
                    </motion.div>
                  )}
                </div>

                <div className="space-y-4">
                  <Label htmlFor="language" className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1 flex items-center gap-2">
                    <Languages className="h-3 w-3" /> Audit Language
                  </Label>
                  <Select name="language" defaultValue={selectedLanguage} onValueChange={setSelectedLanguage} required>
                    <SelectTrigger id="language" className="h-12 glass border-primary/5 font-bold rounded-xl active:scale-95 transition-all">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass border-primary/5 rounded-[1.5rem]">
                      <SelectItem value="English" className="font-bold rounded-lg">English Protocol</SelectItem>
                      <SelectItem value="Hindi" className="font-bold rounded-lg">Hindi Protocol</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" disabled={state.status === "loading"} className="w-full h-14 text-sm font-black uppercase tracking-widest shadow-2xl shadow-primary/20 transition-all active:scale-95 rounded-2xl group">
                  {state.status === "loading" ? (
                    <>
                        <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                        Forensic Scan Active...
                    </>
                  ) : (
                    <>
                        <ShieldCheck className="mr-3 h-5 w-5 transition-transform group-hover:scale-110" />
                        Initialize Audit
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <Card className="bg-primary/5 border-primary/10 rounded-3xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-[0.05]">
                  <ShieldCheck className="h-20 w-20" />
              </div>
              <div className="flex gap-4 relative z-10">
                  <div className="p-3 rounded-2xl bg-white/50 dark:bg-black/50 shadow-sm border border-primary/5 shrink-0 h-fit">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                      <p className="text-xs font-black text-primary uppercase tracking-widest">Accuracy Protocol</p>
                      <p className="text-[11px] text-muted-foreground leading-relaxed font-medium">
                          Our neural engine is optimized for 99.8% forensic accuracy in clause extraction and risk identification.
                      </p>
                  </div>
              </div>
          </Card>
        </motion.div>

        <motion.div 
            initial={{ opacity: 0, x: 30 }} 
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-7"
        >
          <Card className="glass shadow-2xl min-h-[600px] flex flex-col rounded-[2.5rem] overflow-hidden border-primary/5">
            <CardHeader className="bg-primary/5 border-b border-primary/10 flex flex-row items-center justify-between p-8 sm:p-10">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-primary mb-1">
                    <Bot className="h-4 w-4" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">AI Intelligence Node</span>
                </div>
                <CardTitle className="text-2xl font-black tracking-tight leading-none">Analysis Registry</CardTitle>
              </div>
              {state.status === 'success' && state.data && (
                <AudioAssistant 
                  text={`${state.data.summary}. Legal risks identified: ${state.data.legalRisks}. Time-sensitive deadlines: ${state.data.deadlines}. Recommended actions: ${state.data.requiredActions}. Potential consequences: ${state.data.consequences}`} 
                  language={selectedLanguage} 
                />
              )}
            </CardHeader>
            <CardContent className="p-8 sm:p-10 flex-1">
              <AnimatePresence mode="wait">
                {state.status === 'loading' && (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center h-full py-20 text-center gap-8"
                    >
                        <div className="relative">
                            <motion.div 
                                animate={{ rotate: 360 }} 
                                transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                                className="p-12 rounded-full border-4 border-dashed border-primary/20"
                            >
                                <Bot className="h-16 w-16 text-primary/40" />
                            </motion.div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="h-4 w-4 bg-primary rounded-full animate-ping"></div>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <p className="font-black text-2xl tracking-tighter">Deconstructing Clauses...</p>
                            <p className="text-sm text-muted-foreground font-medium max-w-[280px] mx-auto leading-relaxed">Performing deep-layer forensic audit and statutory risk mapping.</p>
                        </div>
                    </motion.div>
                )}

                {state.status === "error" && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                        <Alert variant="destructive" className="border-destructive/20 bg-destructive/5 rounded-3xl p-6">
                            <AlertTriangle className="h-6 w-6 mr-4" />
                            <div className="space-y-1">
                                <AlertTitle className="font-black uppercase tracking-widest text-xs">Node Critical Failure</AlertTitle>
                                <AlertDescription className="text-sm font-medium leading-relaxed opacity-80">{state.error}</AlertDescription>
                            </div>
                        </Alert>
                    </motion.div>
                )}

                {state.status === "success" && state.data && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pb-10">
                        <div className="p-6 bg-primary/5 rounded-[2rem] border border-primary/10 shadow-inner group transition-all hover:bg-primary/10">
                            <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-4 flex items-center gap-3">
                                <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></div>
                                Executive Summary
                            </h3>
                            <p className="text-sm sm:text-base text-foreground font-bold leading-relaxed">{state.data.summary}</p>
                        </div>
                        
                        <div className="grid sm:grid-cols-2 gap-6">
                            <Card className="bg-red-500/5 rounded-3xl border-red-500/10 p-6 hover:bg-red-500/10 transition-all duration-500">
                                <h3 className="text-[10px] font-black text-red-600 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                                    <AlertTriangle className="h-4 w-4" /> Forensic Risks
                                </h3>
                                <p className="text-xs text-muted-foreground font-bold leading-relaxed">{state.data.legalRisks}</p>
                            </Card>
                            <Card className="bg-amber-500/5 rounded-3xl border-amber-500/10 p-6 hover:bg-amber-500/10 transition-all duration-500">
                                <h3 className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                                    <CalendarClock className="h-4 w-4" /> Critical Timelines
                                </h3>
                                <p className="text-xs text-muted-foreground font-bold leading-relaxed">{state.data.deadlines}</p>
                            </Card>
                        </div>

                        <div className="p-6 bg-background rounded-3xl border border-primary/10 shadow-sm transition-all hover:shadow-xl hover:shadow-primary/5">
                            <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                <ListChecks className="h-4 w-4" /> Recommended Strategy
                            </h3>
                            <p className="text-xs text-muted-foreground font-bold leading-relaxed whitespace-pre-line">{state.data.requiredActions}</p>
                        </div>

                        <div className="p-6 bg-destructive/5 rounded-3xl border border-destructive/10">
                            <h3 className="text-[10px] font-black text-destructive uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                <Bomb className="h-4 w-4" /> Procedural Consequences
                            </h3>
                            <p className="text-xs text-muted-foreground font-bold leading-relaxed">{state.data.consequences}</p>
                        </div>
                    </motion.div>
                )}

                {state.status === 'idle' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-full py-20 text-center gap-6 opacity-40">
                        <div className="p-8 rounded-[2rem] bg-muted/50 border-2 border-dashed border-primary/10">
                            <FileUp className="h-16 w-16 text-muted-foreground" />
                        </div>
                        <div className="space-y-2">
                            <p className="font-black text-xl tracking-tighter">Awaiting Ingestion</p>
                            <p className="text-xs text-muted-foreground font-medium max-w-[280px] mx-auto leading-relaxed">
                                Upload an institutional legal document to initialize the neural forensic scanning protocol.
                            </p>
                        </div>
                    </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}