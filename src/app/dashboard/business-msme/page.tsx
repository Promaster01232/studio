
"use client";

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Building, FileText, ListChecks, Loader2, ArrowLeft, ShieldCheck, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { motion } from "framer-motion";

const complianceItems = [
    { id: "gst", label: "GST Registration & Filing" },
    { id: "pf", label: "Provident Fund (PF) Registration" },
    { id: "esi", label: "ESI Registration" },
    { id: "trade-license", label: "Trade License" },
    { id: "shops-act", label: "Shops and Establishment Act Registration" },
    { id: "msme-reg", label: "MSME/Udyam Registration" },
];

export default function BusinessMsmePage() {
    const [businessType, setBusinessType] = useState("sole-proprietorship");
    const [ndaParty1, setNdaParty1] = useState("");
    const [ndaParty2, setNdaParty2] = useState("");
    const [loadingSteps, setLoadingSteps] = useState(false);
    const [loadingNda, setLoadingNda] = useState(false);
    const [loadingChecklist, setLoadingChecklist] = useState(false);
    const { toast } = useToast();

    const handleGetSteps = () => {
        setLoadingSteps(true);
        setTimeout(() => {
            setLoadingSteps(false);
            toast({ title: "Guidance Generated", description: `Registration steps for ${businessType} are ready.` });
        }, 1500);
    };

    const handleGenerateNda = () => {
        if (!ndaParty1 || !ndaParty2) {
            toast({ variant: "destructive", title: "Missing Parties", description: "Please enter both party names." });
            return;
        }
        setLoadingNda(true);
        setTimeout(() => {
            setLoadingNda(false);
            toast({ title: "NDA Drafted", description: "Your basic NDA has been generated." });
        }, 2000);
    };

    const handleSaveChecklist = () => {
        setLoadingChecklist(true);
        setTimeout(() => {
            setLoadingChecklist(false);
            toast({ title: "Progress Saved", description: "Your compliance checklist has been updated." });
        }, 1000);
    };

    return (
        <div className="space-y-10 max-w-7xl mx-auto pb-20 px-2 sm:px-0">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-primary/5 pb-8">
                <PageHeader
                    title="Business & MSME Portal"
                    description="Specialized statutory tools for corporate and small enterprise compliance."
                />
                <Button variant="ghost" size="sm" className="rounded-xl font-bold hover:bg-primary/5 group h-10 px-6 border border-primary/5 text-primary text-[10px] uppercase tracking-widest" asChild>
                    <Link href="/dashboard">
                        <ArrowLeft className="mr-2 h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" /> Back to Terminal
                    </Link>
                </Button>
            </motion.div>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-7 space-y-8">
                    <Card className="glass shadow-2xl rounded-[2rem] border-primary/5 overflow-hidden">
                        <CardHeader className="bg-primary/5 border-b border-primary/5 p-8 text-left">
                            <div className="flex items-center gap-3 text-primary mb-2">
                                <Building className="h-5 w-5" />
                                <CardTitle className="text-xl font-black uppercase tracking-tight">Entity Registration Assist</CardTitle>
                            </div>
                            <CardDescription className="text-[10px] font-bold uppercase tracking-widest opacity-60">Initialize the navigational roadmap for business formation.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6 text-left">
                            <div className="space-y-3">
                                <Label htmlFor="business-type" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Statutory Structure</Label>
                                <Select value={businessType} onValueChange={setBusinessType}>
                                    <SelectTrigger id="business-type" className="h-12 glass border-primary/5 font-bold rounded-xl">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="glass border-primary/5 rounded-[1.5rem]">
                                        <SelectItem value="sole-proprietorship" className="font-bold">Sole Proprietorship</SelectItem>
                                        <SelectItem value="partnership" className="font-bold">Partnership Firm</SelectItem>
                                        <SelectItem value="llp" className="font-bold">LLP (Limited Liability Partnership)</SelectItem>
                                        <SelectItem value="pvt-ltd" className="font-bold">Private Limited Company</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                             <Button className="w-full h-14 font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-primary/20 rounded-2xl transition-all active:scale-95" onClick={handleGetSteps} disabled={loadingSteps}>
                                {loadingSteps ? <Loader2 className="h-4 w-4 animate-spin mr-3" /> : <Zap className="h-4 w-4 mr-3" />}
                                Generate Registration Roadmap
                             </Button>
                        </CardContent>
                    </Card>

                     <Card className="glass shadow-2xl rounded-[2rem] border-primary/5 overflow-hidden">
                        <CardHeader className="bg-primary/5 border-b border-primary/5 p-8 text-left">
                            <div className="flex items-center gap-3 text-primary mb-2">
                                <FileText className="h-5 w-5" />
                                <CardTitle className="text-xl font-black uppercase tracking-tight">Contractual Node: NDA</CardTitle>
                            </div>
                            <CardDescription className="text-[10px] font-bold uppercase tracking-widest opacity-60">Generate non-disclosure instruments for sensitive data protection.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6 text-left">
                             <div className="grid sm:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Disclosing Node</Label>
                                    <Input value={ndaParty1} onChange={e => setNdaParty1(e.target.value)} placeholder="e.g., Enterprise Name" className="h-12 glass border-primary/5 font-bold px-4" />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Receiving Node</Label>
                                    <Input value={ndaParty2} onChange={e => setNdaParty2(e.target.value)} placeholder="e.g., Personnel Name" className="h-12 glass border-primary/5 font-bold px-4" />
                                </div>
                            </div>
                            <Button className="w-full h-14 font-black uppercase tracking-[0.2em] text-xs border border-primary/10 hover:bg-primary/5 text-primary rounded-2xl transition-all active:scale-95" variant="outline" onClick={handleGenerateNda} disabled={loadingNda}>
                                {loadingNda ? <Loader2 className="h-4 w-4 animate-spin mr-3" /> : <FileText className="h-4 w-4 mr-3" />}
                                Initialize NDA Draft
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-5">
                    <Card className="glass shadow-2xl rounded-[2.5rem] border-primary/5 overflow-hidden sticky top-24">
                        <CardHeader className="bg-primary/5 border-b border-primary/10 p-8 text-left">
                            <div className="flex items-center gap-3 text-primary mb-2">
                                <ListChecks className="h-5 w-5" />
                                <CardTitle className="text-xl font-black uppercase tracking-tight">Statutory Audit Check</CardTitle>
                            </div>
                            <CardDescription className="text-[10px] font-bold uppercase tracking-widest opacity-60">Monitor mandatory institutional compliances.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6 text-left">
                            <div className="space-y-3">
                                {complianceItems.map(item => (
                                    <div key={item.id} className="flex items-center space-x-4 p-4 rounded-2xl border border-primary/5 bg-background/50 hover:bg-primary/5 transition-all group cursor-pointer">
                                        <Checkbox id={item.id} className="border-primary/20 data-[state=checked]:bg-primary h-5 w-5 rounded-lg" />
                                        <Label htmlFor={item.id} className="flex-1 cursor-pointer font-bold text-xs group-hover:text-primary transition-colors">
                                            {item.label}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                             <Button className="w-full h-14 font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-primary/20 bg-primary text-white rounded-2xl mt-4 transition-all active:scale-95" onClick={handleSaveChecklist} disabled={loadingChecklist}>
                                {loadingChecklist ? <Loader2 className="h-4 w-4 animate-spin mr-3" /> : <ShieldCheck className="h-4 w-4 mr-3" />}
                                Synchronize Registry
                             </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
