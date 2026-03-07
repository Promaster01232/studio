
"use client";

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Building, FileText, ListChecks, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
            toast({ title: "NDA Drafted", description: "Your basic NDA has been generated and is ready for review." });
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
        <div className="space-y-8">
            <PageHeader
                title="Business & MSME Tools"
                description="Specialized legal tools for businesses and MSMEs."
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Building className="h-5 w-5"/> Business Registration Assistant</CardTitle>
                             <CardDescription>Get guidance on registering your business entity.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="business-type">Select Business Type</Label>
                                <Select value={businessType} onValueChange={setBusinessType}>
                                    <SelectTrigger id="business-type"><SelectValue/></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="sole-proprietorship">Sole Proprietorship</SelectItem>
                                        <SelectItem value="partnership">Partnership Firm</SelectItem>
                                        <SelectItem value="llp">Limited Liability Partnership (LLP)</SelectItem>
                                        <SelectItem value="pvt-ltd">Private Limited Company</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                             <Button className="w-full h-11 font-bold" onClick={handleGetSteps} disabled={loadingSteps}>
                                {loadingSteps ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                Get Registration Steps
                             </Button>
                        </CardContent>
                    </Card>

                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5"/> Basic Contract Generator</CardTitle>
                             <CardDescription>Generate a simple Non-Disclosure Agreement (NDA).</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <div className="space-y-2">
                                <Label htmlFor="nda-party1">Disclosing Party Name</Label>
                                <Input id="nda-party1" value={ndaParty1} onChange={e => setNdaParty1(e.target.value)} placeholder="e.g., ABC Innovations Pvt. Ltd." />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="nda-party2">Receiving Party Name</Label>
                                <Input id="nda-party2" value={ndaParty2} onChange={e => setNdaParty2(e.target.value)} placeholder="e.g., John Doe" />
                            </div>
                            <Button className="w-full h-11 font-bold" variant="secondary" onClick={handleGenerateNda} disabled={loadingNda}>
                                {loadingNda ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                Generate NDA
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><ListChecks className="h-5 w-5" /> Annual Compliance Checklist</CardTitle>
                        <CardDescription>Track mandatory compliances for your business.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">Select items you have completed:</p>
                        <div className="space-y-3">
                            {complianceItems.map(item => (
                                <div key={item.id} className="flex items-center space-x-3 p-3 rounded-md border bg-background hover:bg-muted/50">
                                    <Checkbox id={item.id} />
                                    <Label htmlFor={item.id} className="flex-1 cursor-pointer">
                                        {item.label}
                                    </Label>
                                </div>
                            ))}
                        </div>
                         <Button className="w-full h-11 font-bold mt-4" onClick={handleSaveChecklist} disabled={loadingChecklist}>
                            {loadingChecklist ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            Save Checklist Progress
                         </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
