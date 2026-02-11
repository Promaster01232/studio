
"use client";

import React from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
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
import { saveAdvocate } from "@/lib/advocates-data";

const practiceAreas = [
    "Family Law", "Criminal Law", "Civil Law", "Corporate Law", "Cyber Law",
    "Real Estate", "Intellectual Property", "Tax Law", "Immigration Law"
];

const courts = [
    "Supreme Court", "High Court", "District Court", "Tribunals"
];

export default function AdvocateProfilePage() {
    const { toast } = useToast();
    const router = useRouter();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const courtsOfPractice = formData.getAll('courts');

        // Basic validation
        const name = formData.get('fullName') as string;
        const barId = formData.get('barId') as string;
        const experience = formData.get('experience') as string;
        const position = formData.get('position') as string;
        const specialization = formData.get('specialization') as string;
        const bio = formData.get('bio') as string;
        
        if (!name || !barId || !experience || !position || !specialization || !bio || courtsOfPractice.length === 0) {
             toast({
                variant: "destructive",
                title: "Incomplete Profile",
                description: "Please fill out all required fields, including your name and at least one court of practice.",
            });
            return;
        }

        const newAdvocate = {
            name: name,
            specialty: specialization,
            rating: (Math.random() * (5 - 4) + 4).toFixed(1), // Fake rating
            reviews: Math.floor(Math.random() * 50),
            image: { id: `advocate${Date.now()}`, imageUrl: `https://picsum.photos/seed/${Date.now()}/200/200`, imageHint: 'person portrait' },
            about: bio,
            experience: `Experience: ${experience} years. Position: ${position}. Practices in: ${courtsOfPractice.join(', ')}.`,
            contact: {
                phone: "N/A",
                email: "N/A"
            },
            // Add other form fields
            barId: barId,
            courtName: formData.get('courtName') as string,
            courtAddress: formData.get('courtAddress') as string,
        };

        try {
            saveAdvocate(newAdvocate);
            toast({
                title: "Profile Saved!",
                description: "Your advocate profile has been listed on Lawyer Connect.",
            });
            router.push('/dashboard/lawyer-connect');
        } catch (error) {
            console.error("Failed to save profile:", error);
            toast({
                variant: "destructive",
                title: "Save Failed",
                description: "Could not save your profile. Please try again.",
            });
        }
    };

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
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input id="fullName" name="fullName" placeholder="Your full name as it appears on your Bar ID" required />
                        </div>

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
                            <Label>Courts of Practice (select at least one)</Label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                                {courts.map(court => (
                                    <div key={court} className="flex items-center space-x-2">
                                        <Checkbox id={`court-${court}`} name="courts" value={court} />
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
