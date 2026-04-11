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
import { CheckCircle2, Clock, Loader2, ArrowLeft, Landmark, Zap, Scale, ReceiptText, PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

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
            if(!isNaN(value)) setRegistrationFees(value * 0.05);
            setLoadingStamp(false);
            toast({ title: "Calculation Complete" });
        }, 1000);
    };

    const handleEstimate = () => {
        setLoadingCalc(true);
        setTimeout(() => { setLoadingCalc(false); toast({ title: "Estimate Updated" }); }, 1200);
    };

    const handleNewInvoice = () => {
        setLoadingInvoice(true);
        setTimeout(() => { setLoadingInvoice(false); toast({ title: "Invoice Engine Ready" }); }, 1500);
    };

    const feeRangeLower = (complexity[0] * 100 + 5000);
    const feeRangeUpper = (complexity[0] * 150 + 15000);

    return (
        <div className="space-y-10 max-w-7xl mx-auto pb-20 px-2 sm:px-0">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-primary/5 pb-8">
                <PageHeader
                    title="Finances & Billing Registry"
                    description="Institutional oversight of legal expenditures and statutory stamp duty audits."
                />
                <Button variant="ghost" size="sm" className="rounded-xl font-bold hover:bg-primary/5 group h-10 px-6 border border-primary/5 text-primary text-[10px] uppercase tracking-widest" asChild>
                    <Link href="/dashboard">
                        <ArrowLeft className="mr-2 h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" /> Back to Terminal
                    </Link>
                </Button>
            </motion.div>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-5 space-y-8">
                    <Card className="glass shadow-2xl rounded-[2.5rem] overflow-hidden border-primary/5">
                        <CardHeader className="bg-primary/5 border-b border-primary/5 p-8 text-left">
                            <div className="flex items-center gap-3 text-primary mb-2">
                                <Scale className="h-5 w-5" />
                                <CardTitle className="text-xl font-black uppercase tracking-tight">Fee Estimator Node</CardTitle>
                            </div>
                            <CardDescription className="text-[10px] font-bold uppercase tracking-widest opacity-60">Forensic calculation of projected professional fees.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 space-y-8 text-left">
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Case Nature</Label>
                                <Select defaultValue="family">
                                    <SelectTrigger className="h-12 glass border-primary/5 font-bold rounded-xl"><SelectValue/></SelectTrigger>
                                    <SelectContent className="glass border-primary/5 rounded-[1.5rem]">
                                        <SelectItem value="family" className="font-bold">Family / Civil / Criminal</SelectItem>
                                        <SelectItem value="corporate" className="font-bold">Corporate / IP</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between items-end">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Complexity Matrix</Label>
                                    <span className="text-[10px] font-black text-primary uppercase">{complexity[0]}% Factor</span>
                                </div>
                                <Slider value={complexity} onValueChange={setComplexity} max={100} step={1} className="py-4" />
                            </div>
                            <div className="text-center p-6 rounded-[1.5rem] bg-primary/5 border border-primary/10 shadow-inner">
                                <p className="text-[9px] font-black text-primary uppercase tracking-[0.3em] mb-2">Institutional Estimate</p>
                                <p className="text-3xl font-black tracking-tighter">₹{feeRangeLower.toLocaleString('en-IN')} - ₹{feeRangeUpper.toLocaleString('en-IN')}</p>
                            </div>
                            <Button className="w-full h-14 font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-primary/20 rounded-2xl transition-all active:scale-95" onClick={handleEstimate} disabled={loadingCalc}>
                                {loadingCalc ? <Loader2 className="h-4 w-4 animate-spin mr-3" /> : <Zap className="h-4 w-4 mr-3" />}
                                Sync Estimate
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-7 space-y-8">
                    <Card className="glass shadow-2xl rounded-[2.5rem] overflow-hidden border-primary/5">
                        <CardHeader className="bg-primary/5 border-b border-primary/5 p-8 text-left">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 text-primary">
                                    <ReceiptText className="h-5 w-5" />
                                    <CardTitle className="text-xl font-black uppercase tracking-tight">Billing Registry</CardTitle>
                                </div>
                                <Button size="sm" onClick={handleNewInvoice} disabled={loadingInvoice} className="h-9 px-5 rounded-xl font-black text-[9px] uppercase tracking-widest shadow-lg shadow-primary/20">
                                    {loadingInvoice ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : <PlusCircle className="h-3 w-3 mr-2" />}
                                    New Node
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 space-y-4">
                            {[
                                { id: "2024-001", ref: "Property Audit", val: "7,500", status: "Paid", color: "text-green-600", bg: "bg-green-500/5" },
                                { id: "2024-002", ref: "Writ Draft", val: "12,500", status: "Pending", color: "text-amber-600", bg: "bg-amber-500/5" }
                            ].map(inv => (
                                <div key={inv.id} className="flex justify-between items-center p-5 rounded-[1.5rem] border border-primary/5 bg-background/50 hover:bg-primary/5 transition-all group">
                                    <div className="text-left space-y-1">
                                        <p className="font-black text-xs uppercase tracking-tight group-hover:text-primary transition-colors">TX-INV #{inv.id}</p>
                                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest opacity-60">REF: {inv.ref}</p>
                                    </div>
                                    <div className="text-right space-y-1">
                                        <p className="font-black text-sm tracking-tighter">₹{inv.val}</p>
                                        <div className={cn("flex items-center justify-end gap-1.5 font-black uppercase text-[8px] tracking-[0.2em] px-3 py-1 rounded-full", inv.bg, inv.color)}>
                                            {inv.status === 'Paid' ? <CheckCircle2 className="h-2.5 w-2.5"/> : <Clock className="h-2.5 w-2.5"/>}
                                            {inv.status}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="glass shadow-2xl rounded-[2.5rem] overflow-hidden border-primary/5">
                        <CardHeader className="bg-primary/5 border-b border-primary/5 p-8 text-left">
                            <div className="flex items-center gap-3 text-primary mb-2">
                                <Landmark className="h-5 w-5" />
                                <CardTitle className="text-xl font-black uppercase tracking-tight">Statutory Duty Auditor</CardTitle>
                            </div>
                            <CardDescription className="text-[10px] font-bold uppercase tracking-widest opacity-60">Regional stamp duty and registration fee mapping.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 grid md:grid-cols-2 gap-8 text-left">
                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">State Registry</Label>
                                    <RadioGroup value={stampState} onValueChange={setStampState} className="flex flex-wrap gap-3">
                                        {["Delhi", "Maharashtra", "Karnataka"].map(s => (
                                            <div key={s} className="flex items-center space-x-2 bg-muted/20 px-4 py-2 rounded-xl border border-primary/5 hover:bg-primary/5 transition-all cursor-pointer">
                                                <RadioGroupItem value={s} id={s} className="border-primary/20 data-[state=checked]:bg-primary h-4 w-4" />
                                                <Label htmlFor={s} className="font-black text-[10px] uppercase cursor-pointer">{s}</Label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Asset Value (₹)</Label>
                                    <Input value={transactionValue} onChange={(e) => setTransactionValue(e.target.value)} className="h-12 glass border-primary/5 font-black text-lg px-5" />
                                </div>
                            </div>
                            <div className="flex flex-col gap-6 justify-center">
                                <div className="text-center p-8 rounded-[2rem] bg-primary/5 border border-primary/10 shadow-inner flex-grow flex flex-col justify-center">
                                    <p className="text-[9px] font-black text-primary uppercase tracking-[0.4em] mb-3">Calculated Node Fees</p>
                                    <p className="text-4xl font-black tracking-tighter">₹{registrationFees.toLocaleString('en-IN')}</p>
                                </div>
                                <Button onClick={calculateFees} className="w-full h-14 font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-primary/20 rounded-2xl active:scale-95" disabled={loadingStamp}>
                                    {loadingStamp ? <Loader2 className="h-4 w-4 animate-spin mr-3" /> : <Zap className="h-4 w-4 mr-3" />}
                                    Execute Audit
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
