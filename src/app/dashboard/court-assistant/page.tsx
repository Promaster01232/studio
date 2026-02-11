"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Gavel, FileText, Video, Upload, Lock, Unlock } from "lucide-react";
import { Label } from "@/components/ui/label";

const hearings = [
    {
        title: "Supreme-Court - Case 2023-001 (Final Hearing)",
        subtitle: "Courtroom 5",
        icon: FileText,
        reminder: true,
    },
    {
        title: "Client Meeting (Case 2023-156)",
        subtitle: "Video-Call",
        icon: Video,
        reminder: true,
    },
];

const evidence = [
    {
        name: "Document_A_Exhibit_1.pdf",
        details: "20.1MB - 20/01/2024",
        status: "Encrypted",
    },
    {
        name: "Witness_Statement_Rajesh.aac",
        details: "12.5MB - 12/08/2023",
        status: "Encrypted",
    },
    {
        name: "CCTV_Footage_Oct_1.mp4",
        details: "54.3MB - 01/10/2023",
        status: "Open",
    },
];

export default function CourtAssistantPage() {
    return (
        <div className="space-y-6">
            <header className="flex items-center gap-3 py-2">
                <div className="bg-primary/10 p-2 rounded-lg">
                    <Gavel className="h-6 w-6 text-primary"/>
                </div>
                <h1 className="text-2xl font-bold font-headline">Virtual Court Assistant</h1>
            </header>

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle>Hearing Planner</CardTitle>
                            <div className="text-sm text-muted-foreground mt-1">
                                <p>October 14, 2024</p>
                                <p>10:00 AM</p>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-3">
                    {hearings.map((hearing, index) => (
                        <div key={index} className="flex items-center gap-4 p-4 rounded-lg border bg-background">
                            <hearing.icon className="h-6 w-6 text-primary" />
                            <div className="flex-1">
                                <p className="font-semibold">{hearing.title}</p>
                                <p className="text-sm text-muted-foreground">{hearing.subtitle}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Label htmlFor={`reminder-${index}`} className="text-sm text-muted-foreground">Set Reminder</Label>
                                <Switch id={`reminder-${index}`} defaultChecked={hearing.reminder} />
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Evidence Vault</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Button className="w-full" size="lg">
                        <Upload className="mr-2 h-4 w-4" />
                        Upload New Evidence
                    </Button>
                    <div className="space-y-3">
                        {evidence.map((item, index) => (
                             <div key={index} className="flex items-center gap-4 p-4 rounded-lg border bg-background">
                                <FileText className="h-6 w-6 text-muted-foreground" />
                                <div className="flex-1">
                                    <p className="font-semibold">{item.name}</p>
                                    <p className="text-xs text-muted-foreground">{item.details}</p>
                                </div>
                                <div className="flex items-center gap-2 text-sm font-medium">
                                    {item.status === 'Encrypted' ? (
                                        <>
                                            <Lock className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-muted-foreground">Encrypted</span>
                                        </>
                                    ) : (
                                        <>
                                            <Unlock className="h-4 w-4 text-green-600" />
                                            <span className="text-green-600">Open All</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
