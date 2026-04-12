
"use client";

import { useActionState, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { simplifyJargonAction, type JargonState } from "./actions";
import { Loader2, Sparkles, Languages, CreditCard, Mail, Clock, ShieldCheck, Zap, AlertTriangle, MessageSquare, Headphones, ShieldAlert, ArrowRight } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import type { Language } from "@/components/language-provider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AudioAssistant } from "@/components/audio-assistant";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

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
        <div className="space-y-10 max-w-5xl mx-auto pb-20 px-2 sm:px-0 text-left selection:bg-primary/20">
            <PageHeader
                title="Support & Accessibility"
                description="Institutional Tools To Make Legal Information And Platform Operations At https://nyayasahayak.in More Accessible."
            />

            <div className="grid lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-7 space-y-8 text-left">
                    <Card className="glass shadow-2xl rounded-[2.5rem] overflow-hidden border-primary/5">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-8 sm:p-10 border-b border-primary/5 bg-primary/5">
                            <div className="space-y-1 text-left">
                                <div className="flex items-center gap-2 text-primary mb-1">
                                    <Sparkles className="h-4 w-4" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">AI Forensics</span>
                                </div>
                                <CardTitle className="text-2xl font-black tracking-tighter uppercase">Jargon Simplifier</CardTitle>
                                <CardDescription className="text-xs font-medium">Explain Complex Legal Terms In Plain Language.</CardDescription>
                            </div>
                            {state.status === 'success' && state.data && (
                                <AudioAssistant 
                                    text={`The Legal Term ${state.data.term} Means ${state.data.explanation}.`} 
                                    language={aiLanguage} 
                                />
                            )}
                        </CardHeader>
                        <CardContent className="p-8 sm:p-10 space-y-6">
                            <form action={formAction} className="space-y-6 text-left">
                                <div className="grid sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="term" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Legal Term</Label>
                                        <Input id="term" name="term" placeholder="e.g., Subpoena" required className="h-12 glass font-bold" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="language" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2"><Languages className="h-3 w-3" /> Audit Language</Label>
                                        <Select name="language" value={aiLanguage} onValueChange={setAiLanguage} required>
                                            <SelectTrigger id="language" className="h-12 glass font-bold rounded-xl text-left">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="glass border-primary/5 rounded-xl">
                                                <SelectItem value="English" className="font-bold">English</SelectItem>
                                                <SelectItem value="Hindi" className="font-bold">Hindi</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <Button type="submit" disabled={state.status === 'loading'} className="w-full h-12 font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 rounded-xl active:scale-95 transition-all">
                                    {state.status === 'loading' ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Zap className="h-4 w-4 mr-2" />}
                                    Execute Simplification
                                </Button>
                            </form>
                            
                            <AnimatePresence mode="wait">
                                {state.status === 'success' && state.data && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-2xl bg-primary/5 border border-primary/10 shadow-inner text-left">
                                        <h3 className="font-black text-lg tracking-tight text-primary mb-1 uppercase">{state.data.term}</h3>
                                        <p className="text-sm font-medium leading-relaxed text-muted-foreground">{state.data.explanation}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </CardContent>
                    </Card>

                    <Card className="glass shadow-2xl rounded-[2.5rem] overflow-hidden border-primary/5">
                        <CardHeader className="p-8 sm:p-10 border-b border-primary/5 bg-muted/10 text-left">
                            <CardTitle className="text-2xl font-black tracking-tighter uppercase">Dialect Protocol</CardTitle>
                            <CardDescription className="text-xs font-medium">Select Your Preferred Interface Language Node For https://nyayasahayak.in.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 sm:p-10">
                            <RadioGroup value={language} onValueChange={(value) => setLanguage(value as Language)} className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {languages.map((lang) => (
                                    <div key={lang.code} className="relative group">
                                        <RadioGroupItem value={lang.code} id={lang.code} className="peer sr-only" />
                                        <Label 
                                            htmlFor={lang.code} 
                                            className="flex items-center justify-center rounded-xl border-2 border-primary/5 bg-background p-4 hover:bg-primary/5 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 transition-all cursor-pointer font-black text-[10px] uppercase tracking-widest shadow-sm"
                                        >
                                            {lang.name}
                                        </Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-5 space-y-8 text-left">
                    <Card className="border-amber-500/20 bg-amber-500/5 shadow-2xl rounded-[2.5rem] overflow-hidden sticky top-24">
                        <CardHeader className="p-8 border-b border-amber-500/10 bg-amber-500/10 text-left">
                            <div className="flex items-center gap-3 text-amber-600 mb-2">
                                <CreditCard className="h-5 w-5" />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Specialized Support</span>
                            </div>
                            <CardTitle className="text-2xl font-black tracking-tighter text-amber-700 uppercase">Billing Ingress</CardTitle>
                            <CardDescription className="text-xs font-medium text-amber-700/70">Assistance For Statutory Clearance At https://nyayasahayak.in.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 space-y-8 text-left">
                            <div className="p-5 rounded-2xl bg-white/50 dark:bg-black/40 border border-amber-500/10 space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 shadow-inner">
                                        <Mail className="h-4 w-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[10px] font-black uppercase text-amber-600 tracking-widest mb-1">Audit Email</p>
                                        <p className="text-sm font-black truncate select-all text-amber-900 dark:text-amber-100">nyayasahayakhelp@gmail.com</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 shadow-inner">
                                        <Clock className="h-4 w-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[10px] font-black uppercase text-amber-600 tracking-widest mb-1">Response Protocol</p>
                                        <p className="text-xs font-bold text-amber-800 dark:text-amber-200 leading-relaxed">Institutional Queries Are Audited Within 24 Business Hours.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-amber-600">
                                    <ShieldCheck className="h-4 w-4" />
                                    <span className="text-[9px] font-black uppercase tracking-widest">Registry Trust Protocol</span>
                                </div>
                                <p className="text-[11px] font-medium text-muted-foreground leading-relaxed italic">
                                    "For Failed Payment Synchronizations At https://nyayasahayak.in, Please Include Your Transaction ID In The Subject Line."
                                </p>
                            </div>

                            <Button asChild className="w-full h-14 bg-amber-600 hover:bg-amber-700 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-xl shadow-amber-600/20 active:scale-95 transition-all">
                                <a href="mailto:nyayasahayakhelp@gmail.com?subject=Billing%20Node%20Query">Initialize Support Link</a>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="glass border-primary/5 rounded-[2rem] overflow-hidden shadow-xl text-left">
                        <CardHeader className="bg-primary/5 border-b border-primary/5 p-6 text-left">
                            <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                                <Headphones className="h-4 w-4 text-primary" /> Accessibility Hub
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4 text-left">
                            <Link href="/dashboard/ngo-legal-aid" className="flex items-center gap-4 p-3 rounded-xl hover:bg-primary/5 transition-all cursor-pointer group border border-transparent hover:border-primary/10">
                                <div className="p-2 rounded-lg bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                    <MessageSquare className="h-4 w-4" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest">Community Aid</p>
                                    <p className="text-xs font-bold text-muted-foreground">NGO Legal Directory</p>
                                </div>
                                <ArrowRight className="h-3 w-3 text-primary opacity-0 group-hover:opacity-100 transition-all" />
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
