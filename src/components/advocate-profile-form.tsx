
"use client";

import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { saveAdvocate } from "@/lib/advocates-data";
import { useAuth } from "@/firebase";
import { Loader2, ShieldCheck } from "lucide-react";

const practiceAreas = [
    "Family Law", "Criminal Law", "Civil Law", "Corporate Law", "Cyber Law",
    "Real Estate", "Intellectual Property", "Tax Law", "Immigration Law"
];

const courts = [
    "Supreme Court", "High Court", "District Court", "Tribunals"
];

interface AdvocateProfileFormProps {
    onSave: () => void;
    userProfile: {
        firstName: string;
        lastName: string;
        email: string;
        photoURL?: string;
    } | null;
}

export function AdvocateProfileForm({ onSave, userProfile }: AdvocateProfileFormProps) {
    const { toast } = useToast();
    const auth = useAuth();
    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const courtsOfPractice = formData.getAll('courts');

        const name = formData.get('fullName') as string;
        const barId = formData.get('barId') as string;
        const experience = formData.get('experience') as string;
        const position = formData.get('position') as string;
        const specialization = formData.get('specialization') as string;
        const bio = formData.get('bio') as string;
        const courtName = formData.get('courtName') as string;
        const courtAddress = formData.get('courtAddress') as string;
        
        if (!name || !barId || !experience || !position || !specialization || !bio || !courtName || !courtAddress || courtsOfPractice.length === 0) {
             toast({
                variant: "destructive",
                title: "Information Required",
                description: "Bina pura detail fill kiye save nahin hoga. Please fill all fields.",
            });
            return;
        }
        
        setIsSaving(true);

        const advocateName = name || `${userProfile?.firstName} ${userProfile?.lastName}`;
        const advocateImage = userProfile?.photoURL ? 
            { id: `advocate${auth.currentUser?.uid}`, imageUrl: userProfile.photoURL, imageHint: 'person portrait' } :
            { id: `advocate${Date.now()}`, imageUrl: `https://picsum.photos/seed/${Date.now()}/200/200`, imageHint: 'person portrait' };


        const newAdvocate = {
            name: advocateName,
            specialty: specialization,
            rating: (Math.random() * (5 - 4.5) + 4.5).toFixed(1),
            reviews: Math.floor(Math.random() * 50),
            image: advocateImage,
            about: bio,
            experience: `${experience} years of experience as ${position}.`,
            contact: {
                phone: "Verified",
                email: userProfile?.email || "Verified"
            },
            barId: barId,
            courtName: courtName,
            courtAddress: courtAddress,
        };

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            saveAdvocate(newAdvocate);
            onSave();
        } catch (error) {
            console.error("Failed to save profile:", error);
            toast({
                variant: "destructive",
                title: "Save Failed",
                description: "Could not save your profile. Please try again.",
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <form className="space-y-6 max-h-[75vh] overflow-y-auto p-1 pr-2" onSubmit={handleSubmit}>
            <div className="bg-primary/5 p-4 rounded-lg border border-primary/10 flex items-start gap-3 mb-4">
                <ShieldCheck className="h-5 w-5 text-primary mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                    Complete these professional details to be listed in our directory. Verified advocates receive 3x more consultation requests.
                </p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="fullName">Full Name (as on Bar ID)</Label>
                <Input id="fullName" name="fullName" placeholder="e.g., Rajesh Kumar" required defaultValue={`${userProfile?.firstName || ''} ${userProfile?.lastName || ''}`} />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="barId">Bar Council ID</Label>
                    <Input id="barId" name="barId" placeholder="MAH/1234/2010" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="experience">Years of Experience</Label>
                    <Input id="experience" name="experience" type="number" placeholder="10" required />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="specialization">Primary Specialization</Label>
                 <Select name="specialization" required>
                    <SelectTrigger id="specialization">
                        <SelectValue placeholder="Select your practice area" />
                    </SelectTrigger>
                    <SelectContent>
                        {practiceAreas.map(area => <SelectItem key={area} value={area}>{area}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label htmlFor="position">Current Position / Title</Label>
                <Input id="position" name="position" placeholder="e.g., Senior Partner or Independent Practitioner" required />
            </div>

            <div className="space-y-2">
                <Label>Courts of Practice</Label>
                <div className="grid grid-cols-2 gap-2 pt-1">
                    {courts.map(court => (
                        <div key={court} className="flex items-center space-x-2 border p-2 rounded-md hover:bg-muted/50 transition-colors">
                            <Checkbox id={`court-${court}`} name="courts" value={court} />
                            <label htmlFor={`court-${court}`} className="text-sm font-medium cursor-pointer flex-1">{court}</label>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="space-y-2">
                <Label htmlFor="bio">Professional Bio</Label>
                <Textarea id="bio" name="bio" placeholder="Describe your legal expertise, notable cases, and consultation approach..." rows={5} required />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="courtName">Primary Court Location</Label>
                    <Input id="courtName" name="courtName" placeholder="e.g., Bombay High Court" required />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="courtAddress">City / Address</Label>
                    <Input id="courtAddress" name="courtAddress" placeholder="e.g., Mumbai, Maharashtra" required />
                </div>
            </div>

            <div className="pt-4 sticky bottom-0 bg-background pb-2">
                <Button type="submit" disabled={isSaving} className="w-full shadow-lg shadow-primary/20">
                    {isSaving ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Verifying & Saving...
                        </>
                    ) : "Save & Complete Setup"}
                </Button>
            </div>
        </form>
    );
}
