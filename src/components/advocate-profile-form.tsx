"use client";

import React, { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { saveAdvocate, type Lawyer } from "@/lib/advocates-data";
import { useAuth, useDatabase } from "@/firebase";
import { ref, set } from "firebase/database";
import { Loader2, ShieldCheck, Gavel, MapPin, Briefcase, GraduationCap, FileUp, X, CheckCircle2, Info, UserMinus, AlertTriangle } from "lucide-react";
import { verifyAdvocateCertificate } from "@/ai/flows/verify-advocate-certificate";

const practiceAreas = [
    "Family Law", "Criminal Law", "Civil Law", "Corporate Law", "Cyber Law",
    "Real Estate", "Intellectual Property", "Tax Law", "Immigration Law"
];

const courtsList = [
    "Supreme Court", "High Court", "District Court", "Tribunals"
];

interface AdvocateProfileFormProps {
    onSave: () => void;
    onSkip?: () => void;
    userProfile: {
        firstName: string;
        lastName: string;
        email: string;
        photoURL?: string;
    } | null;
    initialData?: Lawyer | null;
}

export function AdvocateProfileForm({ onSave, onSkip, userProfile, initialData }: AdvocateProfileFormProps) {
    const { toast } = useToast();
    const auth = useAuth();
    const rtdb = useDatabase();
    const [isSaving, setIsSaving] = useState(false);
    const [certificateName, setCertificateName] = useState<string>(initialData?.certificateName || "");
    const [certificateDataUri, setCertificateDataUri] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setCertificateName(file.name);
            const reader = new FileReader();
            reader.onloadend = () => {
                setCertificateDataUri(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeFile = () => {
        setCertificateName("");
        setCertificateDataUri(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const courtsOfPractice = formData.getAll('courts') as string[];

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
                title: "Information required",
                description: "Please fill all fields to complete your professional listing.",
            });
            return;
        }

        if (!certificateDataUri && !initialData?.certificateName) {
            toast({
                variant: "destructive",
                title: "Certificate required",
                description: "Please upload your Bar Council certificate for AI authentication.",
            });
            return;
        }
        
        setIsSaving(true);

        try {
            // AI Verification of Certificate
            if (certificateDataUri) {
                const verification = await verifyAdvocateCertificate({
                    certificateDataUri,
                    fullName: name,
                    barId: barId
                });

                if (!verification.isAuthentic || !verification.matchesUser) {
                    toast({
                        variant: "destructive",
                        title: "Authentication failed",
                        description: verification.reason || "The uploaded document does not match your professional details. Please provide a clear copy of your Bar ID.",
                    });
                    setIsSaving(false);
                    return;
                }
            }

            const advocateName = name || `${userProfile?.firstName} ${userProfile?.lastName}`;
            const advocateImage = userProfile?.photoURL ? 
                { id: `advocate${auth.currentUser?.uid}`, imageUrl: userProfile.photoURL, imageHint: 'person portrait' } :
                (initialData?.image || null);

            // CRITICAL: isApproved is ALWAYS false for new submissions or updates to Bar ID
            const isBarIdChanged = initialData && initialData.barId !== barId;
            
            const newAdvocate: Omit<Lawyer, 'id'> = {
                uid: auth.currentUser?.uid,
                name: advocateName,
                specialty: specialization,
                rating: initialData?.rating || (Math.random() * (5 - 4.5) + 4.5).toFixed(1),
                reviews: initialData?.reviews || Math.floor(Math.random() * 50),
                image: advocateImage,
                about: bio,
                experience: `${experience} years of experience as ${position}.`,
                rawExperience: experience,
                position: position,
                courts: courtsOfPractice,
                contact: {
                    phone: "Verified",
                    email: userProfile?.email || initialData?.contact?.email || "Verified"
                },
                barId: barId,
                courtName: courtName,
                courtAddress: courtAddress,
                certificateName: certificateName,
                isVerified: true,
                isApproved: isBarIdChanged ? false : (initialData?.isApproved || false), 
            };

            // Save to localStorage (directory simulation)
            saveAdvocate(newAdvocate);
            
            // Save to RTDB (centralized profile)
            if (auth.currentUser) {
                const rtdbPayload = JSON.parse(JSON.stringify({
                    ...newAdvocate,
                    uid: auth.currentUser.uid,
                    updatedAt: Date.now()
                }));

                await set(ref(rtdb, `advocates/${auth.currentUser.uid}`), rtdbPayload).catch(err => {
                    console.warn("RTDB professional sync skipped:", err.message);
                });
            }

            toast({
                title: "Profile submitted for review",
                description: "Your credentials will be manually verified by an administrator. You will be notified once active.",
            });

            onSave();
        } catch (error) {
            console.error("Failed to save profile:", error);
            toast({
                variant: "destructive",
                title: "Save failed",
                description: "Could not save your professional profile. Please try again.",
            });
        } finally {
            setIsSaving(false);
        }
    };

    const getExperienceValue = () => {
        if (initialData?.rawExperience) return initialData.rawExperience;
        if (initialData?.experience) {
            const match = initialData.experience.match(/^\d+/);
            return match ? match[0] : "";
        }
        return "";
    };

    const getPositionValue = () => {
        if (initialData?.position) return initialData.position;
        if (initialData?.experience) {
            const parts = initialData.experience.split(" as ");
            if (parts.length > 1) return parts[1].replace(/\.$/, "");
        }
        return "";
    };

    return (
        <form className="space-y-8 max-h-[70vh] overflow-y-auto p-1 pr-4 custom-scrollbar" onSubmit={handleSubmit}>
            <div className="bg-amber-500/5 p-4 rounded-xl border border-amber-500/20 flex flex-col gap-3 shadow-inner">
                <div className="flex items-start gap-4">
                    <div className="bg-amber-500/10 p-2 rounded-lg">
                        <AlertTriangle className="h-5 w-5 text-amber-600" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-xs font-bold text-amber-600 uppercase tracking-wider">Mandatory Verification</p>
                        <p className="text-[11px] text-muted-foreground leading-relaxed font-medium">
                            Professional details are required to activate a Lawyer profile. New submissions remain inactive until manually approved by the administrator.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid gap-6">
                <div className="space-y-3">
                    <Label htmlFor="fullName" className="text-[11px] font-bold flex items-center gap-2 text-muted-foreground uppercase tracking-widest">
                        <Gavel className="h-4 w-4 text-primary" /> Full Name (as on Bar ID)
                    </Label>
                    <Input id="fullName" name="fullName" placeholder="e.g., Rajesh Kumar" required defaultValue={initialData?.name || `${userProfile?.firstName || ''} ${userProfile?.lastName || ''}`} className="h-11 border-primary/10 focus:border-primary font-bold" />
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <Label htmlFor="barId" className="text-[11px] font-bold flex items-center gap-2 text-muted-foreground uppercase tracking-widest">
                            <GraduationCap className="h-4 w-4 text-primary" /> Bar Council ID
                        </Label>
                        <Input id="barId" name="barId" placeholder="MAH/1234/2010" required defaultValue={initialData?.barId || ""} className="h-11 border-primary/10 font-bold" />
                    </div>
                    <div className="space-y-3">
                        <Label htmlFor="experience" className="text-[11px] font-bold flex items-center gap-2 text-muted-foreground uppercase tracking-widest">
                            <Briefcase className="h-4 w-4 text-primary" /> Years of Experience
                        </Label>
                        <Input id="experience" name="experience" type="number" placeholder="10" required defaultValue={getExperienceValue()} className="h-11 border-primary/10 font-bold" />
                    </div>
                </div>

                <div className="space-y-3">
                    <Label className="text-[11px] font-bold flex items-center gap-2 text-muted-foreground uppercase tracking-widest">
                        <FileUp className="h-4 w-4 text-primary" /> Enrollment Certificate
                    </Label>
                    <div className={`relative border-2 border-dashed rounded-xl p-6 transition-all ${certificateName ? 'bg-primary/5 border-primary/40' : 'hover:border-primary/30 bg-muted/20'}`}>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept=".pdf,image/*"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            disabled={isSaving}
                        />
                        {!certificateName ? (
                            <div className="flex flex-col items-center justify-center text-center gap-2">
                                <div className="p-3 rounded-full bg-background shadow-sm border">
                                    <FileUp className="h-6 w-6 text-muted-foreground" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[11px] font-bold text-foreground">Upload Bar Certificate</p>
                                    <p className="text-[10px] text-muted-foreground font-medium">PDF or Image (Max 5MB)</p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-primary text-primary-foreground">
                                        <CheckCircle2 className="h-5 w-5" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[11px] font-bold truncate max-w-[200px]">{certificateName}</p>
                                        <p className="text-[10px] text-primary font-bold">Awaiting Verification</p>
                                    </div>
                                </div>
                                <button 
                                    type="button" 
                                    className="h-9 w-9 flex items-center justify-center rounded-full text-destructive hover:bg-destructive/10 z-20 active:scale-90"
                                    onClick={removeFile}
                                    disabled={isSaving}
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <Label htmlFor="specialization" className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Primary Specialization</Label>
                        <Select name="specialization" required defaultValue={initialData?.specialty || ""}>
                            <SelectTrigger id="specialization" className="h-11 border-primary/10 font-bold">
                                <SelectValue placeholder="Select practice area" />
                            </SelectTrigger>
                            <SelectContent>
                                {practiceAreas.map(area => <SelectItem key={area} value={area} className="font-bold">{area}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-3">
                        <Label htmlFor="position" className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Current Position</Label>
                        <Input id="position" name="position" placeholder="e.g., Senior Advocate" required defaultValue={getPositionValue()} className="h-11 border-primary/10 font-bold" />
                    </div>
                </div>

                <div className="space-y-4">
                    <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Courts of Practice</Label>
                    <div className="grid grid-cols-2 gap-3">
                        {courtsList.map(court => (
                            <div key={court} className="flex items-center space-x-3 border rounded-xl p-3 hover:bg-primary/5 hover:border-primary/30 transition-all cursor-pointer group shadow-sm bg-card/50">
                                <Checkbox 
                                    id={`court-${court}`} 
                                    name="courts" 
                                    value={court} 
                                    defaultChecked={initialData?.courts?.includes(court)}
                                    className="border-primary/30 data-[state=checked]:bg-primary" 
                                />
                                <label htmlFor={`court-${court}`} className="text-[11px] font-bold cursor-pointer flex-1 group-hover:text-primary transition-colors">{court}</label>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="space-y-3">
                    <Label htmlFor="bio" className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Professional Bio</Label>
                    <Textarea id="bio" name="bio" placeholder="Describe your legal expertise and notable achievements..." rows={4} required defaultValue={initialData?.about || ""} className="resize-none border-primary/10 focus:border-primary font-medium text-sm" />
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <Label htmlFor="courtName" className="text-[11px] font-bold flex items-center gap-2 text-muted-foreground uppercase tracking-widest">
                            <MapPin className="h-4 w-4 text-primary" /> Practice Location
                        </Label>
                        <Input id="courtName" name="courtName" placeholder="e.g., High Court" required defaultValue={initialData?.courtName || ""} className="h-11 border-primary/10 font-bold" />
                    </div>
                    <div className="space-y-3">
                        <Label htmlFor="courtAddress" className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">City / State</Label>
                        <Input id="courtAddress" name="courtAddress" placeholder="e.g., New Delhi" required defaultValue={initialData?.courtAddress || ""} className="h-11 border-primary/10 font-bold" />
                    </div>
                </div>
            </div>

            <div className="pt-6 sticky bottom-0 bg-background/95 backdrop-blur-sm pb-2 mt-4 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] space-y-3">
                <Button type="submit" disabled={isSaving} className="w-full h-12 font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-0.98 transition-all">
                    {isSaving ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            AI Validating Professional Identity...
                        </>
                    ) : (initialData ? "Update & Re-verify Profile" : "Activate Approval Workflow")}
                </Button>
                
                {onSkip && !initialData && (
                    <Button 
                        type="button" 
                        variant="ghost" 
                        onClick={onSkip} 
                        disabled={isSaving} 
                        className="w-full h-10 font-bold text-muted-foreground hover:text-foreground text-[10px] uppercase tracking-wider"
                    >
                        <UserMinus className="mr-2 h-3.5 w-3.5" />
                        Skip & proceed as General Citizen
                    </Button>
                )}
            </div>
        </form>
    );
}
