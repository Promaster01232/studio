
"use client";

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CheckCircle2, Clock, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function FinancesBillingPage() {
    const [complexity, setComplexity] = useState([30]);
    const [stampState, setStampState] = useState("Maharashtra");
    const [transactionValue, setTransactionValue] = useState("5200000");
    const [registrationFees, setRegistrationFees] = useState(260000);
    const [loadingCalc, setLoadingCalc] = useState(false);
    const [loadingStamp, setLoadingStamp] = useState(false);
    const [loadingInvoice, setLoadingInvoice] = useState(false);
    const { toast } = useToast();

    const calculateFees = () => {
        setLoadingStamp(true);
        setTimeout(() => {
            const value = parseFloat(transactionValue);
            if(!isNaN(value)) {
                setRegistrationFees(value * 0.05);
            }
            setLoadingStamp(false);
            toast({ title: "Calculation Complete" });
        }, 1000);
    };

    const handleEstimate = () => {
        setLoadingCalc(true);
        setTimeout(() => {
            setLoadingCalc(false);
            toast({ title: "Estimate Updated" });
        }, 1200);
    };

    const handleNewInvoice = () => {
        setLoadingInvoice(true);
        setTimeout(() => {
            setLoadingInvoice(false);
            toast({ title: "Invoice Engine Ready", description: "Redirecting to draft workspace..." });
        }, 1500);
    };

    const feeRangeLower = (complexity[0] * 100 + 5000);
    const feeRangeUpper = (complexity[0] * 150 + 15000);

    return (
        <div className="space-y-8">
            <PageHeader
                title="Finances & Billing"
                description="Manage legal expenses, estimates, and official stamp duty calculations."
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Legal Fee Estimator</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2 text-left">
                            <Label htmlFor="case-type">Case Type</Label>
                            <Select name="case-type" defaultValue="family">
                                <SelectTrigger id="case-type"><SelectValue/></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="family">Family Law, Criminal, Civil</SelectItem>
                                    <SelectItem value="criminal">Criminal Law</SelectItem>
                                    <SelectItem value="civil">Civil Law</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2 text-left">
                            <Label>Complexity Level</Label>
                            <Slider value={complexity} onValueChange={setComplexity} max={100} step={1} />
                            <div className="flex justify-between text-xs text-muted-foreground font-bold">
                                <span>Low</span><span>High</span>
                            </div>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-muted">
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Estimated Range</p>
                            <p className="text-2xl font-black">₹{feeRangeLower.toLocaleString('en-IN')} - ₹{feeRangeUpper.toLocaleString('en-IN')}</p>
                        </div>
                        <Button className="w-full h-11 font-bold" onClick={handleEstimate} disabled={loadingCalc}>
                            {loadingCalc ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            Calculate Estimated Fee
                        </Button>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Invoice & Billing</CardTitle>
                        <div className="flex gap-2 pt-2">
                            <Button className="h-9 font-bold" onClick={handleNewInvoice} disabled={loadingInvoice}>
                                {loadingInvoice ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : null}
                                New Invoice
                            </Button>
                            <Button variant="outline" className="h-9 font-bold">Past Invoices</Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex justify-between items-center p-3 rounded-xl border bg-muted/10">
                            <div className="text-left">
                                <p className="font-bold text-sm">Invoice #2024-001</p>
                                <p className="text-[10px] text-muted-foreground font-bold">Reference: Property Consultation</p>
                            </div>
                            <div className="text-right">
                                <p className="font-black text-sm">₹7,500</p>
                                <div className="flex items-center justify-end gap-1.5 text-green-600">
                                    <CheckCircle2 className="h-3 w-3"/>
                                    <span className="text-[10px] font-black uppercase">Paid</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-xl border bg-muted/10">
                            <div className="text-left">
                                <p className="font-bold text-sm">Invoice #2024-002</p>
                                <p className="text-[10px] text-muted-foreground font-bold">Reference: Document Review</p>
                            </div>
                            <div className="text-right">
                                <p className="font-black text-sm">₹12,500</p>
                                <div className="flex items-center justify-end gap-1.5 text-yellow-600">
                                    <Clock className="h-3 w-3"/>
                                    <span className="text-[10px] font-black uppercase">Pending</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-5">
                    <CardHeader>
                        <CardTitle>Stamp Duty Calculator</CardTitle>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
                        <div className="space-y-2 text-left">
                            <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">State/Region</Label>
                            <RadioGroup value={stampState} onValueChange={setStampState} className="grid grid-cols-1 gap-2">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Delhi" id="delhi" /><Label htmlFor="delhi" className="font-bold">Delhi</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Maharashtra" id="maharashtra" /><Label htmlFor="maharashtra" className="font-bold">Maharashtra</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Karnataka" id="karnataka" /><Label htmlFor="karnataka" className="font-bold">Karnataka</Label>
                                </div>
                            </RadioGroup>
                        </div>
                        <div className="space-y-2 text-left">
                            <Label htmlFor="document-type" className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Document Type</Label>
                            <Select name="document-type" defaultValue="rent-agreement">
                                <SelectTrigger id="document-type" className="h-11 font-bold"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="rent-agreement" className="font-bold">Rent Agreement</SelectItem>
                                    <SelectItem value="sale-deed" className="font-bold">Sale Deed</SelectItem>
                                    <SelectItem value="gift-deed" className="font-bold">Gift Deed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2 text-left">
                            <Label htmlFor="transaction-value" className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Transaction Value (₹)</Label>
                            <Input id="transaction-value" value={transactionValue} onChange={(e) => setTransactionValue(e.target.value)} placeholder="e.g., 5000000" className="h-11 font-bold" />
                        </div>
                        <div className="flex flex-col gap-4">
                            <Button onClick={calculateFees} className="w-full h-11 font-bold shadow-lg shadow-primary/20" disabled={loadingStamp}>
                                {loadingStamp ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                Calculate Duty
                            </Button>
                            <div className="text-center p-4 rounded-xl bg-primary/5 border border-primary/10 flex-grow flex flex-col justify-center">
                                <p className="text-[10px] font-black text-primary uppercase tracking-tighter">Registration Fees</p>
                                <p className="text-2xl font-black">₹{registrationFees.toLocaleString('en-IN')}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
