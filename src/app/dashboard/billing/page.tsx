
"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth, useFirestore } from "@/firebase";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { CheckCircle2, Zap, ShieldCheck, Loader2, CreditCard, Sparkles, Activity, Star, Crown, ArrowRight, History, BadgeCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Script from "next/script";

const plans = [
    {
        id: 'free',
        name: 'Citizen Basic',
        price: '₹0',
        amount: 0,
        desc: 'Standard identity enrollment.',
        credits: '5 Forensic Credits',
        features: ['Voice Narration (5x)', 'Document Audit (5x)', 'Case Analytics', 'Basic Directory Access'],
        color: 'text-muted-foreground',
        bg: 'bg-muted/10',
        border: 'border-muted/20'
    },
    {
        id: 'pro_20',
        name: 'Professional 20',
        price: '₹99',
        amount: 99,
        desc: 'Essential statutory expansion.',
        credits: '20 Forensic Credits',
        features: ['Voice Narration (20x)', 'Document Audit (20x)', 'Extended Case Tracker', 'Priority AI Nodes'],
        color: 'text-blue-500',
        bg: 'bg-blue-500/5',
        border: 'border-blue-500/20',
        badge: 'Popular Choice'
    },
    {
        id: 'unlimited_monthly',
        name: 'Unlimited Monthly',
        price: '₹599',
        amount: 599,
        desc: 'Continuous institutional access.',
        credits: 'Absolute Clearance',
        features: ['Unlimited AI Forensic Scans', 'Unlimited Document Audits', 'Full Case Strategy Hub', 'Verified Connect Ingress'],
        color: 'text-primary',
        bg: 'bg-primary/5',
        border: 'border-primary/20',
        badge: 'Best Value'
    },
    {
        id: 'unlimited_yearly',
        name: 'Institutional Annual',
        price: '₹4,999',
        amount: 4999,
        desc: 'Permanent statutory authority.',
        credits: 'Absolute Clearance',
        features: ['Everything in Unlimited', 'Advanced Contract Node', 'Custom PDF Export Protocol', 'Root System Access'],
        color: 'text-amber-600',
        bg: 'bg-amber-500/5',
        border: 'border-amber-500/20',
        badge: 'Elite Node'
    }
];

export default function BillingPage() {
    const auth = useAuth();
    const firestore = useFirestore();
    const { toast } = useToast();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);

    useEffect(() => {
        if (!auth.currentUser) return;
        const unsub = onSnapshot(doc(firestore, "users", auth.currentUser.uid), (doc) => {
            setProfile(doc.data());
            setLoading(false);
        });
        return () => unsub();
    }, [auth, firestore]);

    const handleUpgrade = async (planId: string) => {
        if (planId === profile?.subscriptionType) return;
        
        const plan = plans.find(p => p.id === planId);
        if (!plan || plan.amount === 0) return;

        setProcessingId(planId);

        // Razorpay Live Integration Protocol
        const options = {
            key: "rzp_live_SWZcLhmqajCvPv",
            amount: plan.amount * 100, // Amount in paise
            currency: "INR",
            name: "Nyaya Sahayak",
            description: `Clearance Upgrade: ${plan.name}`,
            image: "/Logo.png",
            handler: async function (response: any) {
                try {
                    const userRef = doc(firestore, "users", auth.currentUser!.uid);
                    await updateDoc(userRef, { 
                        subscriptionType: planId,
                        // Reset usage if unlimited, or keep tracking
                        aiUsageCount: planId.includes('unlimited') ? 0 : (profile?.aiUsageCount || 0)
                    });
                    toast({ title: "Clearance Level Upgraded", description: "Your institutional node has been recalibrated." });
                } catch (err) {
                    toast({ variant: "destructive", title: "Registry Error", description: "Payment successful but node synchronization failed. Contact support." });
                } finally {
                    setProcessingId(null);
                }
            },
            prefill: {
                name: `${profile?.firstName} ${profile?.lastName}`,
                email: profile?.email,
                contact: profile?.mobileNumber
            },
            theme: {
                color: "#994B00" // Institutional Saffron
            },
            modal: {
                ondismiss: function() {
                    setProcessingId(null);
                }
            }
        };

        try {
            const rzp = new (window as any).Razorpay(options);
            rzp.open();
        } catch (error) {
            toast({ variant: "destructive", title: "Payment Interface Error", description: "Could not initialize Razorpay node." });
            setProcessingId(null);
        }
    };

    if (loading) return <div className="flex h-[70vh] items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-primary opacity-20" /></div>;

    const currentPlan = profile?.subscriptionType || 'free';
    const currentUsage = profile?.aiUsageCount || 0;

    return (
        <div className="max-w-7xl mx-auto space-y-10 pb-20 px-2 sm:px-0 text-left">
            <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
            
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-primary/5 pb-8">
                <PageHeader
                    title="Billing & Statutory Usage"
                    description="Monitor your institutional forensic credits and manage clearance levels."
                />
                <div className="flex items-center gap-4 bg-primary/5 px-6 py-3 rounded-2xl border border-primary/10 shadow-inner">
                    <div className="text-left">
                        <p className="text-[9px] font-black uppercase tracking-widest text-primary opacity-60">Current Usage</p>
                        <p className="text-xl font-black tracking-tighter">{currentUsage} Operations</p>
                    </div>
                    <div className="h-8 w-px bg-primary/10"></div>
                    <div className="text-left">
                        <p className="text-[9px] font-black uppercase tracking-widest text-primary opacity-60">Plan Tier</p>
                        <p className="text-xl font-black tracking-tighter text-primary uppercase">{currentPlan.replace('_', ' ')}</p>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                {plans.map((plan, idx) => {
                    const isActive = currentPlan === plan.id;
                    const isProcessing = processingId === plan.id;
                    
                    return (
                        <motion.div
                            key={plan.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <Card className={cn(
                                "h-full flex flex-col glass relative overflow-hidden transition-all duration-500 rounded-[2.5rem] border-primary/5",
                                isActive && "ring-2 ring-primary border-primary/20 shadow-2xl shadow-primary/10"
                            )}>
                                {plan.badge && (
                                    <div className="absolute top-6 right-6">
                                        <BadgeCheck className={cn("h-6 w-6 opacity-40", plan.color)} />
                                    </div>
                                )}
                                
                                <CardHeader className="p-8 pb-4 text-left">
                                    <div className="space-y-1">
                                        {isActive && (
                                            <div className="flex items-center gap-2 text-primary mb-2">
                                                <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                                                <span className="text-[9px] font-black uppercase tracking-widest">Active Clearance</span>
                                            </div>
                                        )}
                                        <h3 className="text-xl font-black tracking-tight leading-none">{plan.name}</h3>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pt-1">{plan.desc}</p>
                                    </div>
                                    <div className="pt-6">
                                        <span className="text-4xl font-black tracking-tighter">{plan.price}</span>
                                        <span className="text-xs font-bold text-muted-foreground ml-2 opacity-60">{plan.id.includes('unlimited') ? '/ cycle' : 'once'}</span>
                                    </div>
                                </CardHeader>

                                <CardContent className="p-8 pt-4 flex-grow space-y-6">
                                    <div className={cn("p-4 rounded-2xl flex items-center gap-3", plan.bg)}>
                                        <Zap className={cn("h-4 w-4", plan.color)} />
                                        <span className={cn("text-[11px] font-black uppercase tracking-widest", plan.color)}>{plan.credits}</span>
                                    </div>
                                    <div className="space-y-3">
                                        {plan.features.map((f, i) => (
                                            <div key={i} className="flex items-start gap-3">
                                                <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0 mt-0.5" />
                                                <span className="text-[11px] font-medium text-muted-foreground leading-snug">{f}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>

                                <CardFooter className="p-8 pt-0">
                                    <Button 
                                        onClick={() => handleUpgrade(plan.id)}
                                        disabled={isActive || isProcessing || processingId !== null}
                                        className={cn(
                                            "w-full h-12 font-black uppercase tracking-widest text-[10px] rounded-xl transition-all",
                                            isActive ? "bg-muted text-muted-foreground cursor-default" : "shadow-lg shadow-primary/20 active:scale-95"
                                        )}
                                    >
                                        {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : isActive ? "Current Tier" : "Initialize Upgrade"}
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>

            <Card className="glass border-primary/5 rounded-[2.5rem] overflow-hidden shadow-xl mt-12">
                <CardHeader className="bg-primary/5 border-b border-primary/5 p-8 text-left">
                    <div className="flex items-center gap-3 text-primary mb-2">
                        <History className="h-5 w-5" />
                        <CardTitle className="text-xl font-black uppercase tracking-tight">Transaction Registry</CardTitle>
                    </div>
                    <CardDescription className="text-[10px] font-bold uppercase tracking-widest opacity-60">Chronological log of institutional payments and credit renewals.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="p-12 text-center opacity-40 space-y-4">
                        <div className="bg-primary/5 p-6 rounded-full w-fit mx-auto">
                            <Activity className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <div className="space-y-1">
                            <p className="font-black text-sm tracking-tight uppercase">Registry synchronized</p>
                            <p className="text-[10px] font-medium italic">"No prior transaction nodes detected for this session."</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="pt-16 border-t border-primary/5 flex flex-col sm:flex-row items-center justify-between gap-8 text-center sm:text-left">
                <div className="flex gap-10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-green-500/10 text-green-600">
                            <ShieldCheck className="h-5 w-5" />
                        </div>
                        <div className="text-left">
                            <p className="text-[10px] font-black uppercase text-green-600 tracking-widest leading-none">Secured Protocol</p>
                            <p className="text-[9px] font-bold text-muted-foreground mt-1">PCI DSS Compliant</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600">
                            <Sparkles className="h-5 w-5" />
                        </div>
                        <div className="text-left">
                            <p className="text-[10px] font-black uppercase text-blue-600 tracking-widest leading-none">Instant Provisioning</p>
                            <p className="text-[9px] font-bold text-muted-foreground mt-1">Direct Neural Sync</p>
                        </div>
                    </div>
                </div>
                <p className="text-[9px] font-black uppercase tracking-[0.5em] text-muted-foreground/40">NYAYASAHAYAK.IN // PAYMENT GATEWAY v1.0</p>
            </div>
        </div>
    );
}
