
"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth, useFirestore } from "@/firebase";
import { doc, onSnapshot, updateDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { CheckCircle2, Zap, ShieldCheck, Loader2, CreditCard, Sparkles, Activity, Star, Crown, ArrowRight, History, BadgeCheck, ShieldAlert, FileSignature, Globe, Layers, TicketPercent, XCircle, Mail, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Script from "next/script";
import { useRouter } from "next/navigation";

const plans = [
    {
        id: 'free',
        name: 'Citizen Basic',
        price: '₹0',
        amount: 0,
        desc: 'Standard identity enrollment.',
        credits: '5 Forensic Credits',
        features: ['Voice Narration (5x)', 'Document Audit (5x)', 'Basic Case Analytics', 'Public Directory Access'],
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
        features: ['Voice Narration (20x)', 'Document Audit (20x)', 'Extended Case Tracker', 'Priority AI Ingress'],
        color: 'text-blue-500',
        bg: 'bg-blue-500/5',
        border: 'border-blue-500/20',
        badge: 'Popular Choice',
        icon: Zap
    },
    {
        id: 'unlimited_monthly',
        name: 'Unlimited Monthly',
        price: '₹599',
        amount: 599,
        desc: 'Continuous institutional access.',
        credits: 'Absolute Clearance',
        features: ['Unlimited AI Forensic Scans', 'Unlimited Document Audits', 'Full Case Strategy Hub', 'Verified Connect Ingress', 'Priority Neural Support'],
        color: 'text-primary',
        bg: 'bg-primary/5',
        border: 'border-primary/20',
        badge: 'Professional Tier',
        icon: Crown
    },
    {
        id: 'unlimited_yearly',
        name: 'Institutional Annual',
        price: '₹4,999',
        amount: 4999,
        desc: 'Permanent statutory authority.',
        credits: 'Absolute Clearance',
        features: ['Everything in Unlimited', 'Advanced Contract Node', 'Custom PDF Export Protocol', 'Root System Access', 'Institutional Branding'],
        color: 'text-amber-600',
        bg: 'bg-amber-500/5',
        border: 'border-amber-500/20',
        badge: 'Elite Node',
        icon: ShieldCheck
    }
];

export default function BillingPage() {
    const auth = useAuth();
    const firestore = useFirestore();
    const router = useRouter();
    const { toast } = useToast();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [syncError, setSyncError] = useState<{ paymentId: string, plan: string } | null>(null);
    
    // Coupon States
    const [couponCode, setCouponCode] = useState("");
    const [appliedDiscount, setAppliedDiscount] = useState<{ code: string, percent?: number, fixedAmount?: number, planId: string } | null>(null);
    const [couponError, setCouponError] = useState<string | null>(null);

    useEffect(() => {
        if (!auth.currentUser) return;
        const unsub = onSnapshot(doc(firestore, "users", auth.currentUser.uid), (doc) => {
            setProfile(doc.data());
            setLoading(false);
        });
        return () => unsub();
    }, [auth, firestore]);

    const validateCoupon = () => {
        setCouponError(null);
        const code = couponCode.trim().toUpperCase();
        
        if (code === 'NYAYA62') {
            setAppliedDiscount({ code, percent: 95, planId: 'unlimited_monthly' });
            toast({ title: "95% Discount Applied", description: "Valid for Unlimited Monthly clearance." });
        } else if (code === 'HARDY0') {
            setAppliedDiscount({ code, percent: 99.5, planId: 'unlimited_yearly' });
            toast({ title: "99.5% Discount Applied", description: "Valid for Institutional Annual node." });
        } else if (code === 'PIE') {
            setAppliedDiscount({ code, percent: 35, planId: 'unlimited_yearly' });
            toast({ title: "35% Discount Applied", description: "Valid for Institutional Annual node." });
        } else if (code === 'PIYUSH11') {
            setAppliedDiscount({ code, fixedAmount: 1, planId: 'unlimited_yearly' });
            toast({ title: "Special Registry Code Applied", description: "Institutional Annual clearance recalibrated to ₹1." });
        } else {
            setCouponError("Invalid or expired registry code.");
            setAppliedDiscount(null);
        }
    };

    const handleUpgrade = async (planId: string) => {
        if (planId === profile?.subscriptionType) return;
        
        const plan = plans.find(p => p.id === planId);
        if (!plan || plan.amount === 0) return;

        setProcessingId(planId);

        let finalAmount = plan.amount;
        if (appliedDiscount && appliedDiscount.planId === planId) {
            if (appliedDiscount.fixedAmount !== undefined) {
                finalAmount = appliedDiscount.fixedAmount;
            } else if (appliedDiscount.percent !== undefined) {
                finalAmount = plan.amount * (1 - appliedDiscount.percent / 100);
            }
        }

        const options = {
            key: "rzp_live_SWZcLhmqajCvPv",
            amount: Math.round(finalAmount * 100), 
            currency: "INR",
            name: "Nyaya Sahayak",
            description: `Clearance Upgrade: ${plan.name} ${appliedDiscount ? `(${appliedDiscount.code})` : ''}`,
            image: "/Logo.png",
            handler: async function (response: any) {
                const paymentId = response.razorpay_payment_id;
                try {
                    const userRef = doc(firestore, "users", auth.currentUser!.uid);
                    
                    const now = new Date();
                    let expiryDate = new Date();
                    if (planId.includes('monthly')) expiryDate.setDate(now.getDate() + 30);
                    else if (planId.includes('yearly')) expiryDate.setFullYear(now.getFullYear() + 1);
                    else expiryDate.setDate(now.getDate() + 365);

                    // Atomic write: Payment data + Subscription
                    await updateDoc(userRef, { 
                        subscriptionType: planId,
                        aiUsageCount: 0,
                        clearanceExpiry: expiryDate.toISOString(),
                        lastPaymentId: paymentId
                    });

                    await addDoc(collection(firestore, "transactions"), {
                        userId: auth.currentUser!.uid,
                        userEmail: profile?.email,
                        userName: `${profile?.firstName} ${profile?.lastName}`,
                        planId: planId,
                        amount: finalAmount,
                        paymentId: paymentId,
                        orderId: response.razorpay_order_id,
                        createdAt: serverTimestamp(),
                        expiryDate: expiryDate.toISOString(),
                        status: 'CAPTURED'
                    });

                    toast({ title: "Clearance Level Upgraded", description: "Your institutional node has been recalibrated." });
                    setProcessingId(null);
                    router.refresh();
                    setTimeout(() => router.push('/dashboard/profile'), 1000);
                } catch (err) {
                    console.error("Critical Sync Error:", err);
                    // Subscription failed but payment captured - show specialized help UI
                    setSyncError({ paymentId, plan: plan.name });
                    setProcessingId(null);
                }
            },
            prefill: {
                name: `${profile?.firstName} ${profile?.lastName}`,
                email: profile?.email,
                contact: profile?.mobileNumber
            },
            theme: { color: "#994B00" },
            modal: { ondismiss: () => setProcessingId(null) }
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

    if (syncError) {
        return (
            <div className="max-w-2xl mx-auto py-20 px-4">
                <Card className="border-amber-500/20 bg-amber-500/5 shadow-2xl rounded-[2.5rem] overflow-hidden text-left">
                    <div className="bg-amber-500/10 p-10 flex justify-center border-b border-amber-500/10">
                        <AlertTriangle className="h-20 w-20 text-amber-600 animate-pulse" />
                    </div>
                    <CardHeader className="p-8 sm:p-10 text-center">
                        <div className="flex items-center justify-center gap-2 text-amber-600 mb-2">
                            <ShieldAlert className="h-4 w-4" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Critical Synchronization Event</span>
                        </div>
                        <CardTitle className="text-3xl font-black font-headline tracking-tighter">Capture Successful, Node Pending</CardTitle>
                        <CardDescription className="text-sm font-medium pt-4 text-muted-foreground leading-relaxed px-4">
                            Your payment for <span className="text-foreground font-bold">{syncError.plan}</span> was captured, but an internal node error occurred during registry synchronization.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="px-8 pb-10 space-y-6">
                        <div className="p-6 rounded-2xl bg-white dark:bg-black/40 border border-amber-500/10 shadow-inner">
                            <p className="text-[9px] font-black uppercase text-muted-foreground opacity-60 mb-2">Transaction Reference (TXID)</p>
                            <p className="font-mono font-black text-amber-600 select-all">{syncError.paymentId}</p>
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-xs font-black uppercase tracking-widest text-foreground">Next Protocol Steps:</h4>
                            <ul className="space-y-3 text-xs text-muted-foreground font-medium">
                                <li className="flex gap-3">
                                    <div className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                                    Email the TXID above to <span className="text-primary font-bold">nyayasahayakhelp@gmail.com</span>.
                                </li>
                                <li className="flex gap-3">
                                    <div className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                                    Our support node will manually authorize your clearance within 24 business hours.
                                </li>
                            </ul>
                        </div>
                        <Button variant="outline" className="w-full h-12 font-bold rounded-xl" onClick={() => window.location.reload()}>
                            Restart Terminal
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const currentPlan = profile?.subscriptionType || 'free';
    const currentUsage = profile?.aiUsageCount || 0;

    return (
        <div className="max-w-7xl mx-auto space-y-10 pb-20 px-2 sm:px-0 text-left">
            <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
            
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-primary/5 pb-8">
                <PageHeader
                    title="Billing & Statutory Clearance"
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
                        <p className="text-xl font-black tracking-tighter text-primary uppercase">{(currentPlan || 'free').replace('_', ' ')}</p>
                    </div>
                </div>
            </div>

            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="max-w-md mx-auto border-dashed border-2 border-primary/20 bg-primary/5 rounded-[1.5rem] overflow-hidden">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <TicketPercent className="h-5 w-5 text-primary" />
                            <h3 className="text-sm font-black uppercase tracking-widest">Protocol Promo Code</h3>
                        </div>
                        <div className="flex gap-2">
                            <Input 
                                placeholder="Enter code" 
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value)}
                                className="h-11 font-bold bg-background border-primary/10 uppercase"
                            />
                            <Button onClick={validateCoupon} className="h-11 px-6 font-black uppercase text-[10px] tracking-widest rounded-xl">
                                Apply
                            </Button>
                        </div>
                        <AnimatePresence>
                            {couponError && (
                                <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-[10px] font-bold text-red-500 mt-2 flex items-center gap-1.5">
                                    <XCircle className="h-3 w-3" /> {couponError}
                                </motion.p>
                            )}
                            {appliedDiscount && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-3 p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                                    <p className="text-[10px] font-black text-green-600 uppercase tracking-widest flex items-center gap-2">
                                        <CheckCircle2 className="h-3.5 w-3.5" /> Code Active: {appliedDiscount.code}
                                    </p>
                                    <p className="text-[9px] font-bold text-green-600/70 mt-0.5">
                                        {appliedDiscount.fixedAmount !== undefined ? `Price adjusted to ₹${appliedDiscount.fixedAmount}` : `${appliedDiscount.percent}% discount`} will be applied at checkout for {appliedDiscount.planId.replace('_', ' ')}.
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </CardContent>
                </Card>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                {plans.map((plan, idx) => {
                    const isActive = currentPlan === plan.id;
                    const isProcessing = processingId === plan.id;
                    const PlanIcon = plan.icon || Activity;
                    
                    const isDiscounted = appliedDiscount && appliedDiscount.planId === plan.id;
                    let discountedAmount = plan.amount;
                    if (isDiscounted) {
                        if (appliedDiscount!.fixedAmount !== undefined) discountedAmount = appliedDiscount!.fixedAmount;
                        else if (appliedDiscount!.percent !== undefined) discountedAmount = plan.amount * (1 - appliedDiscount!.percent / 100);
                    }

                    return (
                        <motion.div
                            key={plan.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <Card className={cn(
                                "h-full flex flex-col glass relative overflow-hidden transition-all duration-500 rounded-[2.5rem] border-primary/5 group",
                                isActive && "ring-2 ring-primary border-primary/20 shadow-2xl shadow-primary/10"
                            )}>
                                {plan.badge && (
                                    <div className="absolute top-6 right-6">
                                        <BadgeCheck className={cn("h-6 w-6 opacity-40 transition-transform group-hover:scale-110", plan.color)} />
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
                                        <div className="flex items-center gap-3">
                                            <div className={cn("p-2 rounded-lg bg-background shadow-sm border border-primary/5", plan.color)}>
                                                <PlanIcon className="h-4 w-4" />
                                            </div>
                                            <h3 className="text-xl font-black tracking-tight leading-none">{plan.name}</h3>
                                        </div>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pt-2">{plan.desc}</p>
                                    </div>
                                    <div className="pt-6">
                                        <div className="flex items-baseline gap-2">
                                            <span className={cn("text-4xl font-black tracking-tighter", isDiscounted && "text-green-600")}>
                                                ₹{discountedAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                                            </span>
                                            {isDiscounted && (
                                                <span className="text-sm font-bold text-muted-foreground line-through opacity-40">
                                                    {plan.price}
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-xs font-bold text-muted-foreground ml-1 opacity-60">{plan.id.includes('unlimited') ? '/ cycle' : 'once'}</span>
                                    </div>
                                </CardHeader>

                                <CardContent className="p-8 pt-4 flex-grow space-y-6">
                                    <div className={cn("p-4 rounded-2xl flex items-center gap-3 shadow-inner", plan.bg)}>
                                        <Zap className={cn("h-4 w-4", plan.color)} />
                                        <span className={cn("text-[11px] font-black uppercase tracking-widest", plan.color)}>{plan.credits}</span>
                                    </div>
                                    <div className="space-y-3">
                                        {plan.features.map((f, i) => (
                                            <div key={i} className="flex items-start gap-3 group/feat">
                                                <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0 mt-0.5 group-hover/feat:scale-110 transition-transform" />
                                                <span className="text-[11px] font-medium text-muted-foreground leading-snug group-hover/feat:text-foreground transition-colors">{f}</span>
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
                            <Globe className="h-5 w-5" />
                        </div>
                        <div className="text-left">
                            <p className="text-[10px] font-black uppercase text-blue-600 tracking-widest leading-none">UPI & QR Ready</p>
                            <p className="text-[9px] font-bold text-muted-foreground mt-1">Digital India Ingress</p>
                        </div>
                    </div>
                </div>
                <p className="text-[9px] font-black uppercase tracking-[0.5em] text-muted-foreground/40">NYAYASAHAYAK.IN // BILLING NODE v4.2</p>
            </div>
        </div>
    );
}
