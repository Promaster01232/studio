
"use client";

import { useActionState, useRef, useState } from "react";
import { understandDocumentAction, type DocumentIntelligenceState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FileUp, Bot, AlertTriangle, CalendarClock, ListChecks, Bomb, Languages, FileText } from "lucide-react";
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
    <div className="space-y-8 max-w-6xl mx-auto">
      <PageHeader
        title="Document Intelligence"
        description="Upload a legal document to have AI explain it in simple terms, identifying risks and required actions."
      />

      <div className="grid md:grid-cols-2 gap-8 items-start">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Card className="border-primary/10 shadow-xl overflow-hidden rounded-2xl">
            <CardHeader className="bg-primary/5 border-b border-primary/5">
              <CardTitle className="text-xl font-bold tracking-tight">Upload Your Document</CardTitle>
              <CardDescription className="font-medium">Supports PDF, DOCX, and image files.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form action={formAction} className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="document" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Document File</Label>
                  <div className="relative group">
                    <Input 
                      id="document" 
                      name="document" 
                      type="file" 
                      required 
                      onChange={handleFileChange}
                      ref={fileInputRef}
                      accept=".pdf,.doc,.docx,image/*"
                      className="h-12 bg-background border-primary/10 focus:border-primary cursor-pointer font-bold"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                        <FileText className="h-5 w-5" />
                    </div>
                  </div>
                  {fileName && (
                    <div className="flex items-center gap-2 p-2 bg-primary/5 rounded-lg border border-primary/10">
                        <FileUp className="h-3.5 w-3.5 text-primary" />
                        <p className="text-[11px] font-bold text-primary truncate">{fileName}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="language" className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    <Languages className="h-3.5 w-3.5" /> Response Language
                  </Label>
                  <Select name="language" defaultValue={selectedLanguage} onValueChange={setSelectedLanguage} required>
                    <SelectTrigger id="language" className="h-11 bg-background border-primary/10 font-bold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="English" className="font-bold">English</SelectItem>
                      <SelectItem value="Hindi" className="font-bold">Hindi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" disabled={state.status === "loading"} className="w-full h-12 text-lg font-bold shadow-lg shadow-primary/20 transition-all active:scale-95">
                  {state.status === "loading" ? (
                    <>
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                            <FileUp className="mr-2 h-5 w-5" />
                        </motion.div>
                        Analyzing Document...
                    </>
                  ) : (
                    <>
                        <Bot className="mr-2 h-5 w-5" />
                        Upload and Analyze
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <Card className="border-primary/10 shadow-xl min-h-[500px] flex flex-col rounded-2xl overflow-hidden bg-card/40 backdrop-blur-md">
            <CardHeader className="bg-primary/5 border-b border-primary/5 flex flex-row items-center justify-between space-y-0">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2 text-xl font-bold tracking-tight">
                  <Bot className="h-5 w-5 text-primary" /> AI Analysis
                </CardTitle>
                <CardDescription className="font-medium">The explanation will appear below.</CardDescription>
              </div>
              {state.status === 'success' && state.data && (
                <AudioAssistant 
                  text={`${state.data.summary}. Legal risks: ${state.data.legalRisks}. Deadlines: ${state.data.deadlines}. Required actions: ${state.data.requiredActions}. Consequences: ${state.data.consequences}`} 
                  language={selectedLanguage} 
                />
              )}
            </CardHeader>
            <CardContent className="p-6 flex-1">
              <AnimatePresence mode="wait">
                {state.status === 'loading' && (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center h-full py-20 text-center gap-4"
                    >
                        <motion.div 
                            animate={{ scale: [1, 1.1, 1] }} 
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="bg-primary/10 p-6 rounded-full"
                        >
                            <Bot className="h-12 w-12 text-primary" />
                        </motion.div>
                        <div className="space-y-1">
                            <p className="font-bold text-lg tracking-tight">Processing your document...</p>
                            <p className="text-sm text-muted-foreground font-medium">Extracting clauses and analyzing legal risks.</p>
                        </div>
                    </motion.div>
                )}

                {state.status === "error" && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                        <Alert variant="destructive" className="border-destructive/20 bg-destructive/5 rounded-xl">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle className="font-bold">Analysis failed</AlertTitle>
                            <AlertDescription className="text-xs font-medium">{state.error}</AlertDescription>
                        </Alert>
                    </motion.div>
                )}

                {state.status === "success" && state.data && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                        <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 group transition-all hover:bg-primary/10">
                            <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-2 flex items-center gap-2">
                                <FileText className="h-3.5 w-3.5" /> Simple summary
                            </h3>
                            <p className="text-sm text-foreground font-medium leading-relaxed">{state.data.summary}</p>
                        </div>
                        
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="p-4 bg-red-500/5 rounded-xl border border-red-500/10 transition-all hover:bg-red-500/10">
                                <h3 className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <AlertTriangle className="h-3.5 w-3.5" /> Legal risks
                                </h3>
                                <p className="text-xs text-muted-foreground font-bold leading-tight">{state.data.legalRisks}</p>
                            </div>
                            <div className="p-4 bg-amber-500/5 rounded-xl border border-amber-500/10 transition-all hover:bg-amber-500/10">
                                <h3 className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <CalendarClock className="h-3.5 w-3.5" /> Deadlines
                                </h3>
                                <p className="text-xs text-muted-foreground font-bold leading-tight">{state.data.deadlines}</p>
                            </div>
                        </div>

                        <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 transition-all hover:bg-primary/10">
                            <h3 className="text-[10px] font-black text-primary uppercase tracking-widest mb-2 flex items-center gap-2">
                                <ListChecks className="h-3.5 w-3.5" /> Required actions
                            </h3>
                            <p className="text-xs text-muted-foreground font-bold leading-tight">{state.data.requiredActions}</p>
                        </div>

                        <div className="p-4 bg-destructive/5 rounded-xl border border-destructive/10 transition-all hover:bg-destructive/10">
                            <h3 className="text-[10px] font-black text-destructive uppercase tracking-widest mb-2 flex items-center gap-2">
                                <Bomb className="h-3.5 w-3.5" /> Consequences of ignoring
                            </h3>
                            <p className="text-xs text-muted-foreground font-bold leading-tight">{state.data.consequences}</p>
                        </div>
                    </motion.div>
                )}

                {state.status === 'idle' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-full py-20 text-center gap-4">
                        <div className="bg-muted p-6 rounded-full">
                            <FileUp className="h-12 w-12 text-muted-foreground opacity-20" />
                        </div>
                        <div className="space-y-1">
                            <p className="font-bold text-lg tracking-tight opacity-40">Ready for analysis</p>
                            <p className="text-sm text-muted-foreground font-medium max-w-[250px] mx-auto">Upload a document on the left to see the AI analysis results here.</p>
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
