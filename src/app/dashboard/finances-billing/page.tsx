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
import { CheckCircle2, Clock } from "lucide-react";

export default function FinancesBillingPage() {
    const [complexity, setComplexity] = useState([30]);
    const [stampState, setStampState] = useState("Maharashtra");
    const [transactionValue, setTransactionValue] = useState("5200000");
    const [registrationFees, setRegistrationFees] = useState(260000);

    const calculateFees = () => {
        const value = parseFloat(transactionValue);
        if(!isNaN(value)) {
            setRegistrationFees(value * 0.05); // Dummy 5% calculation
        }
    };

    const feeRangeLower = (complexity[0] * 100 + 5000);
    const feeRangeUpper = (complexity[0] * 150 + 15000);

    return (
        <div className="space-y-8">
            <PageHeader
                title="Finances & Billing"
                description="Specialized tools for legal professionals."
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                {/* Column 1: Legal Fee Estimator */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Legal Fee Estimator</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
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
                        <div className="space-y-2">
                            <Label>Complexity Level</Label>
                            <Slider value={complexity} onValueChange={setComplexity} max={100} step={1} />
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>Low</span><span>High</span>
                            </div>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-muted">
                            <p className="text-sm text-muted-foreground">Estimated Range</p>
                            <p className="text-3xl font-bold">${feeRangeLower.toLocaleString()} - ${feeRangeUpper.toLocaleString()}</p>
                        </div>
                        <Button className="w-full">Calculate Estimated Fee</Button>
                    </CardContent>
                </Card>

                {/* Column 2: Invoice & Billing */}
                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Invoice & Billing</CardTitle>
                        <div className="flex gap-2 pt-2">
                            <Button>Generate New Invoice</Button>
                            <Button variant="outline">View Past Invoices</Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex justify-between items-center p-3 rounded-md border">
                            <div>
                                <p className="font-semibold">Invoice #2024-001</p>
                                <p className="text-sm text-muted-foreground">Client: Rajesh Kumar</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold">$7,500</p>
                                <div className="flex items-center justify-end gap-1.5 text-green-600">
                                    <CheckCircle2 className="h-4 w-4"/>
                                    <span className="text-sm font-medium">Paid</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-md border">
                            <div>
                                <p className="font-semibold">Invoice #2024-002</p>
                                <p className="text-sm text-muted-foreground">Client: Priya Singh</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold">$12,500</p>
                                <div className="flex items-center justify-end gap-1.5 text-yellow-600">
                                    <Clock className="h-4 w-4"/>
                                    <span className="text-sm font-medium">Pending</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Full-width card for Stamp Duty Calculator */}
                <Card className="lg:col-span-5">
                    <CardHeader>
                        <CardTitle>Stamp Duty Calculator</CardTitle>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
                        <div className="space-y-2">
                            <Label>State/Region</Label>
                            <RadioGroup value={stampState} onValueChange={setStampState} className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Delhi" id="delhi" /><Label htmlFor="delhi">Delhi</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Maharashtra" id="maharashtra" /><Label htmlFor="maharashtra">Maharashtra</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Karnataka" id="karnataka" /><Label htmlFor="karnataka">Karnataka</Label>
                                </div>
                            </RadioGroup>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="document-type">Document Type</Label>
                            <Select name="document-type" defaultValue="rent-agreement">
                                <SelectTrigger id="document-type"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="rent-agreement">Rent Agreement</SelectItem>
                                    <SelectItem value="sale-deed">Sale Deed</SelectItem>
                                    <SelectItem value="gift-deed">Gift Deed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="transaction-value">Transaction Value</Label>
                            <Input id="transaction-value" value={transactionValue} onChange={(e) => setTransactionValue(e.target.value)} placeholder="e.g., 5000000" />
                        </div>
                        <div className="flex flex-col gap-4">
                            <Button onClick={calculateFees} className="w-full">Calculate</Button>
                            <div className="text-center p-4 rounded-lg bg-muted flex-grow flex flex-col justify-center">
                                <p className="text-sm text-muted-foreground">Registration Fees</p>
                                <p className="text-2xl font-bold">₹{registrationFees.toLocaleString('en-IN')}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
