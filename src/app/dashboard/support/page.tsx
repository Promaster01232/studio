"use client";

import { useActionState, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { simplifyJargonAction, type JargonState } from "./actions";
import { Loader2, Sparkles, Languages } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useLanguage } from "@/components/language-provider";
import type { Language } from "@/components/language-provider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const initialState: JargonState = {
    status: 'idle',
    data: null,
    error: null,
};

const languages: { code: Language, name: string }[] = [
    { code: "en", name: "English" },
    { code: "hi", name: "Hindi" },
    { code: "mr", name: "Marathi" },
    { code: "ta", name: "Tamil" },
    { code: "bn", name: "Bangla" },
];


export default function SupportPage() {
    const [state, formAction] = useActionState(simplifyJargonAction, initialState);
    const { language, setLanguage } = useLanguage();
    const [aiLanguage, setAiLanguage] = useState("English");

    return (
        <div className="space-y-8">
            <PageHeader
                title="Support & Accessibility"
                description="Tools to make legal information more accessible."
            />

            <Card>
                <CardHeader>
                    <CardTitle>Jargon Simplifier</CardTitle>
                    <CardDescription>Enter a legal term to get a simple explanation.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={formAction} className="space-y-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="term">Legal Term</Label>
                            <Input id="term" name="term" placeholder="e.g., Subpoena" required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="language" className="flex items-center gap-2"><Languages className="h-4 w-4" /> Response Language</Label>
                            <Select name="language" value={aiLanguage} onValueChange={setAiLanguage} required>
                              <SelectTrigger id="language">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="English">English</SelectItem>
                                <SelectItem value="Hindi">Hindi</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <Button type="submit" disabled={state.status === 'loading'} className="w-full sm:w-auto">
                            {state.status === 'loading' ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
                            Simplify Term
                        </Button>
                    </form>
                    
                    {state.status === 'loading' && <p className="mt-4 text-sm text-muted-foreground">Simplifying...</p>}

                    {state.status === 'error' && (
                        <Alert variant="destructive" className="mt-4">
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{state.error}</AlertDescription>
                        </Alert>
                    )}

                    {state.status === 'success' && state.data && (
                         <div className="mt-4 p-4 border rounded-md bg-muted">
                            <h3 className="font-semibold text-lg">{state.data.term}</h3>
                            <p className="text-muted-foreground">{state.data.explanation}</p>
                        </div>
                    )}
                     {state.status === 'idle' && (
                         <div className="mt-4 p-4 border rounded-md bg-muted/50">
                            <h3 className="font-semibold text-lg">Subpoena</h3>
                            <p className="text-muted-foreground">An order to appear in court.</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Multi-Lingual Support</CardTitle>
                    <CardDescription>Select your preferred language for the application interface.</CardDescription>
                </CardHeader>
                <CardContent>
                    <RadioGroup value={language} onValueChange={(value) => setLanguage(value as Language)} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                        {languages.map((lang) => (
                             <div key={lang.code}>
                                <RadioGroupItem value={lang.code} id={lang.code} className="peer sr-only" />
                                <Label 
                                    htmlFor={lang.code} 
                                    className="flex items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                >
                                    {lang.name}
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                </CardContent>
            </Card>
        </div>
    );
}
