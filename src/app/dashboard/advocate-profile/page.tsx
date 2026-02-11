"use client";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const practiceAreas = [
    "Family Law", "Criminal Law", "Civil Law", "Corporate Law", "Cyber Law",
    "Real Estate", "Intellectual Property", "Tax Law", "Immigration Law"
];

const courts = [
    "Supreme Court", "High Court", "District Court", "Tribunals"
];

export default function AdvocateProfilePage() {
    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4 mb-4">
                 <Button variant="outline" size="icon" asChild>
                    <Link href="/dashboard/profile">
                        <ArrowLeft />
                        <span className="sr-only">Back to Profile</span>
                    </Link>
                </Button>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold font-headline tracking-tight">Advocate Profile</h1>
                    <p className="mt-1 text-muted-foreground">Complete your details to be listed on Lawyer Connect.</p>
                </div>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Professional Information</CardTitle>
                    <CardDescription>This information will be displayed on your public profile.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="barId">Bar Council ID</Label>
                            <Input id="barId" name="barId" placeholder="e.g., MAH/1234/2010" required />
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="experience">Years of Experience</Label>
                                <Input id="experience" name="experience" type="number" placeholder="e.g., 10" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="position">Position / Title</Label>
                                <Input id="position" name="position" placeholder="e.g., Senior Advocate" required />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Courts of Practice</Label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                                {courts.map(court => (
                                    <div key={court} className="flex items-center space-x-2">
                                        <Checkbox id={`court-${court}`} />
                                        <label
                                            htmlFor={`court-${court}`}
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            {court}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="specialization">Primary Specialization</Label>
                             <Select name="specialization" required>
                                <SelectTrigger id="specialization">
                                    <SelectValue placeholder="Select your main practice area" />
                                </SelectTrigger>
                                <SelectContent>
                                    {practiceAreas.map(area => <SelectItem key={area} value={area}>{area}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="bio">Professional Bio</Label>
                            <Textarea id="bio" name="bio" placeholder="Write a short summary about your experience, expertise, and approach..." rows={6} required />
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="courtName">Court Name</Label>
                                <Input id="courtName" name="courtName" placeholder="e.g., Bombay High Court" />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="courtAddress">Court Address</Label>
                                <Input id="courtAddress" name="courtAddress" placeholder="Full address of the primary court" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="idProof">ID Proof</Label>
                            <Input id="idProof" name="idProof" type="file" />
                            <p className="text-xs text-muted-foreground">Upload a copy of your Bar Council ID or other valid legal identification.</p>
                        </div>

                        <div className="flex justify-end">
                            <Button type="submit">Save Advocate Profile</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
