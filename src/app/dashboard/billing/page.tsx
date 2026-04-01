"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth, useFirestore } from "@/firebase";
import { doc, onSnapshot, updateDoc, collection, addDoc, serverTimestamp, query, where } from "firebase/firestore";
import { CheckCircle2, Zap, ShieldCheck, Loader2, CreditCard, Crown, History, AlertTriangle, Mail, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";

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
    const [userTransactions, setUserTransactions] = useState<any[]>([]);

    useEffect(() => {
        if (!auth.currentUser) return;
        const unsub = onSnapshot(doc(firestore, "users", auth.currentUser.uid), (doc) => {
            setProfile(doc.data());
            setLoading(false);
        });

        // Strictly query for CAPTURED (Success) transactions only
        const transRef = collection(firestore, "transactions");
        const q = query(
            transRef, 
            where("userId", "==", auth.currentUser.uid),
            where("status", "==", "CAPTURED")
        );
        
        const unsubTrans = onSnapshot(q, (snap) => {
            const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            list.sort((a: any, b: any) => {
                const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.createdAt || 0);
                const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.createdAt || 0);
                return Number(timeB) - Number(timeA);
            });
            setUserTransactions(list);
        });

        return () => { unsub(); unsubTrans(); };
    }, [auth, firestore]);

    const handleUpgrade = async (planId: string) => {
        if (planId === profile?.subscriptionType) return;
        const plan = plans.find(p => p.id === planId);
        if (!plan || plan.amount === 0) return;

        setProcessingId(planId);

        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_live_SY4T9oT2oLGhiS",
            amount: Math.round(plan.amount * 100), 
            currency: "INR",
            name: "Nyaya Sahayak",
            description: `Upgrade: ${plan.name}`,
            image: "/Logo.png",
            handler: async function (response: any) {
                const paymentId = response.razorpay_payment_id;
                try {
                    const userRef = doc(firestore, "users", auth.currentUser!.uid);
                    const now = new Date();
                    let expiryDate = new Date();
                    if (planId.includes('monthly')) expiryDate.setDate(now.getDate() + 30);
                    else expiryDate.setFullYear(now.getFullYear() + 1);

                    // Strictly record ONLY captured transactions
                    await addDoc(collection(firestore, "transactions"), {
                        userId: auth.currentUser!.uid,
                        userEmail: profile?.email,
                        userName: `${profile?.firstName} ${profile?.lastName}`,
                        planId: planId,
                        amount: plan.amount,
                        paymentId: paymentId,
                        createdAt: serverTimestamp(),
                        expiryDate: expiryDate.toISOString(),
                        status: 'CAPTURED'
                    });

                    await updateDoc(userRef, { 
                        subscriptionType: planId,
                        aiUsageCount: 0,
                        clearanceExpiry: expiryDate.toISOString(),
                        lastPaymentId: paymentId
                    });

                    toast({ title: "Clearance Upgraded", description: "Terminal recalibrated." });
                    setProcessingId(null);
                    router.refresh();
                } catch (err) {
                    setSyncError({ paymentId, plan: plan.name });
                    setProcessingId(null);
                }
            },
            prefill: { name: `${profile?.firstName} ${profile?.lastName}`, email: profile?.email },
            theme: { color: "#994B00" },
            modal: { 
                ondismiss: () => setProcessingId(null) 
            }
        };

        try {
            const rzp = new (window as any).Razorpay(options);
            rzp.open();
        } catch (error) { setProcessingId(null); }
    };

    if (loading) return <div className="flex h-[70vh] items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-primary opacity-20" /></div>;

    if (syncError) {
        return (
            <div className="max-w-2xl mx-auto py-20 px-4 text-left">
                <Card className="border-amber-500/20 bg-amber-500/5 shadow-2xl rounded-[2.5rem] overflow-hidden">
                    <CardHeader className="p-8 sm:p-10 text-center">
                        <AlertTriangle className="h-20 w-20 text-amber-600 mx-auto mb-6" />
                        <CardTitle className="text-3xl font-black font-headline tracking-tighter uppercase">Sync Pending</CardTitle>
                        <CardDescription className="text-sm font-medium pt-4 text-muted-foreground leading-relaxed px-4">
                            Payment captured, but profile sync failed. Contact support with TXID: {syncError.paymentId}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="px-8 pb-10">
                        <Button className="w-full h-14 font-black uppercase tracking-widest text-[10px] rounded-xl shadow-xl" asChild>
                            <a href={`mailto:nyayasahayakhelp@gmail.com?subject=Sync Error ${syncError.paymentId}`}>
                                <Mail className="mr-2 h-4 w-4" /> Resolve via Email
                            </a>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-10 pb-20 px-4 sm:px-0 text-left">
            <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
            <PageHeader title="Statutory Clearance" description="Monitor forensic credits and manage clearance nodes." />

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                {plans.map((plan) => {
                    const isActive = profile?.subscriptionType === plan.id;
                    const isProcessing = processingId === plan.id;
                    return (
                        <Card key={plan.id} className={cn("h-full flex flex-col glass rounded-[2.5rem] border-primary/5", isActive && "ring-2 ring-primary")}>
                            <CardHeader className="p-8 pb-4 text-left">
                                <h3 className="text-xl font-black tracking-tight">{plan.name}</h3>
                                <div className="pt-6"><span className="text-4xl font-black">₹{plan.amount}</span></div>
                            </CardHeader>
                            <CardContent className="p-8 pt-4 flex-grow space-y-6 text-left">
                                <div className="space-y-3">
                                    {plan.features.map((f, i) => (
                                        <div key={i} className="flex items-start gap-3">
                                            <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0 mt-0.5" />
                                            <span className="text-[11px] font-medium text-muted-foreground">{f}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                            <CardFooter className="p-8 pt-0">
                                <Button onClick={() => handleUpgrade(plan.id)} disabled={isActive || isProcessing} className="w-full h-12 font-black uppercase text-[10px] rounded-xl shadow-lg">
                                    {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : isActive ? "Active Tier" : "Initialize Upgrade"}
                                </Button>
                            </CardFooter>
                        </Card>
                    );
                })}
            </div>

            <section className="pt-16 space-y-8 text-left">
                <div className="flex items-center justify-between border-b border-primary/5 pb-4">
                    <div className="flex items-center gap-3">
                        <History className="h-5 w-5 text-primary" />
                        <h2 className="text-xl font-black font-headline tracking-tighter uppercase leading-none">Verified Capture Ledger</h2>
                    </div>
                    <Badge variant="secondary" className="font-black text-[8px] uppercase tracking-widest bg-primary/5 text-primary/60 border-primary/10">Success Protocol Only</Badge>
                </div>
                <Card className="glass shadow-2xl rounded-[2.5rem] overflow-hidden border-primary/5">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-muted/30 border-b border-primary/5">
                                <tr>
                                    <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground">Timestamp</th>
                                    <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground">Clearance Node</th>
                                    <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground text-center">Status</th>
                                    <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground">Value</th>
                                    <th className="px-6 py-4 text-right text-[9px] font-black uppercase tracking-widest text-muted-foreground pr-10">TXID</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-primary/5">
                                {userTransactions.length > 0 ? userTransactions.map((tx) => (
                                    <tr key={tx.id} className="hover:bg-primary/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="text-[10px] font-bold text-muted-foreground flex items-center gap-2">
                                                <Clock className="h-3 w-3 opacity-40" />
                                                {tx.createdAt ? formatDistanceToNow(tx.createdAt.toDate ? tx.createdAt.toDate() : new Date(tx.createdAt), { addSuffix: true }) : 'Syncing...'}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant="outline" className="font-black text-[8px] uppercase border-primary/20 text-primary bg-primary/5">
                                                {tx.planId?.replace('_', ' ') || 'Statutory Upgrade'}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-1.5 text-green-600 font-black text-[8px] uppercase tracking-widest">
                                                <CheckCircle2 className="h-3 w-3" /> SUCCESS
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-mono font-black text-xs">₹{(tx.amount || 0).toLocaleString('en-IN')}</p>
                                        </td>
                                        <td className="px-6 py-4 text-right pr-10">
                                            <p className="font-mono text-[9px] opacity-40 select-all">{tx.paymentId}</p>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-16 text-center text-muted-foreground font-medium text-xs opacity-40 italic">
                                            Registry clear. Only successful captures are recorded.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </section>
        </div>
    );
}
