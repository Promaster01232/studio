"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth, useFirestore } from "@/firebase";
import { doc, onSnapshot, updateDoc, collection, addDoc, serverTimestamp, query, where } from "firebase/firestore";
import { CheckCircle2, Zap, ShieldCheck, Loader2, CreditCard, Crown, History, AlertTriangle, Mail, Clock, Activity, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError, type SecurityRuleContext } from "@/firebase/errors";
import { Logo } from "@/components/logo";

const plans = [
    {
        id: 'free',
        name: 'Citizen basic',
        price: '₹0',
        amount: 0,
        desc: 'Standard identity enrollment.',
        credits: '5 Forensic credits',
        features: ['Voice narration (5x)', 'Document audit (5x)', 'Basic case analytics', 'Public directory access'],
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
        credits: '20 Forensic credits',
        features: ['Voice narration (20x)', 'Document audit (20x)', 'Extended case tracker', 'Priority AI access'],
        color: 'text-blue-500',
        bg: 'bg-blue-500/5',
        border: 'border-blue-500/20',
        badge: 'Popular choice',
        icon: Zap
    },
    {
        id: 'unlimited_monthly',
        name: 'Unlimited monthly',
        price: '₹599',
        amount: 599,
        desc: 'Continuous institutional access.',
        credits: 'Absolute clearance',
        features: ['Unlimited AI forensic scans', 'Unlimited document audits', 'Full case strategy hub', 'Verified connect access', 'Priority neural support'],
        color: 'text-primary',
        bg: 'bg-primary/5',
        border: 'border-primary/20',
        badge: 'Professional tier',
        icon: Crown
    },
    {
        id: 'unlimited_yearly',
        name: 'Institutional annual',
        price: '₹4,999',
        amount: 4999,
        desc: 'Permanent statutory authority.',
        credits: 'Absolute clearance',
        features: ['Everything in unlimited', 'Advanced contract hub', 'Custom PDF export protocol', 'Root system access', 'Institutional branding'],
        color: 'text-amber-600',
        bg: 'bg-amber-500/5',
        border: 'border-amber-500/20',
        badge: 'Elite hub',
        icon: ShieldCheck
    }
];

const VALID_COUPONS: Record<string, number> = {
    "NYAYA50": 0.25,
    "IDEASPARK20": 0.2,
    "PROBONO": 1.0,
    "WELCOME10": 0.1,
    "ABCD12": 0.15,
    "PIYUSH11": 0.99 
};

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
    
    const [couponInput, setCouponInput] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState<{ code: string, discount: number } | null>(null);

    useEffect(() => {
        if (!auth.currentUser) {
            setLoading(false);
            return;
        }
        
        const userId = auth.currentUser.uid;
        const userDocRef = doc(firestore, "users", userId);
        
        const unsub = onSnapshot(userDocRef, 
            (doc) => {
                setProfile(doc.data());
                setLoading(false);
            },
            async (err) => {
                const permissionError = new FirestorePermissionError({
                    path: userDocRef.path,
                    operation: 'get',
                } satisfies SecurityRuleContext, err);
                errorEmitter.emit('permission-error', permissionError);
                setLoading(false);
            }
        );

        const transCol = collection(firestore, "transactions");
        const q = query(
            transCol, 
            where("userId", "==", userId),
            where("status", "==", "CAPTURED")
        );
        
        const unsubTrans = onSnapshot(q, 
            (snap) => {
                const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
                list.sort((a: any, b: any) => {
                    const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.createdAt || 0);
                    const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.createdAt || 0);
                    return Number(timeB) - Number(timeA);
                });
                setUserTransactions(list);
            },
            async (err) => {
                const permissionError = new FirestorePermissionError({
                    path: transCol.path,
                    operation: 'list',
                } satisfies SecurityRuleContext, err);
                errorEmitter.emit('permission-error', permissionError);
                setUserTransactions([]);
            }
        );

        return () => { unsub(); unsubTrans(); };
    }, [auth, firestore]);

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleApplyCoupon = () => {
        const code = couponInput.toUpperCase().trim();
        if (VALID_COUPONS[code] !== undefined) {
            setAppliedCoupon({ code, discount: VALID_COUPONS[code] });
            toast({ title: "Coupon applied", description: `Protocol active: ${code === 'PIYUSH11' ? '₹1 special tier' : (VALID_COUPONS[code] * 100) + '% discount'}.` });
        } else {
            toast({ variant: "destructive", title: "Invalid code", description: "Coupon not found in registry." });
        }
    };

    const handleUpgrade = async (planId: string) => {
        if (planId === profile?.subscriptionType) return;
        const plan = plans.find(p => p.id === planId);
        if (!plan || plan.amount === 0) return;

        const res = await loadRazorpay();
        if (!res) {
            toast({ variant: "destructive", title: "Gateway failure", description: "Could not connect to payment hub." });
            return;
        }

        const discount = appliedCoupon ? appliedCoupon.discount : 0;
        let finalAmount = Math.max(0, Math.round(plan.amount * (1 - discount)));
        
        if (appliedCoupon?.code === 'PIYUSH11') {
            finalAmount = 1;
        }

        setProcessingId(planId);

        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_live_SY4T9oT2oLGhiS",
            amount: finalAmount * 100, 
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

                    const transactionData = {
                        userId: auth.currentUser!.uid,
                        userEmail: profile?.email,
                        userName: `${profile?.firstName} ${profile?.lastName}`,
                        planId: planId,
                        amount: finalAmount,
                        paymentId: paymentId,
                        createdAt: serverTimestamp(),
                        expiryDate: expiryDate.toISOString(),
                        status: 'CAPTURED',
                        couponCode: appliedCoupon?.code || null
                    };

                    await addDoc(collection(firestore, "transactions"), transactionData);
                    await updateDoc(userRef, { 
                        subscriptionType: planId,
                        aiUsageCount: 0,
                        clearanceExpiry: expiryDate.toISOString(),
                        lastPaymentId: paymentId
                    });

                    toast({ title: "Clearance upgraded", description: "Identity updated in registry." });
                    setProcessingId(null);
                    router.refresh();
                } catch (err) {
                    setSyncError({ paymentId, plan: plan.name });
                    setProcessingId(null);
                }
            },
            prefill: { name: `${profile?.firstName} ${profile?.lastName}`, email: profile?.email },
            theme: { color: "#2563eb" },
            modal: { ondismiss: () => setProcessingId(null) }
        };

        try {
            const rzp = new (window as any).Razorpay(options);
            rzp.open();
        } catch (error) { setProcessingId(null); }
    };

    if (loading) return <div className="flex h-[70vh] items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-primary opacity-20" /></div>;

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-20 px-4 sm:px-0 text-left">
            <div className="flex items-center justify-between border-b-4 border-foreground pb-4">
                <div className="flex items-center gap-4">
                    <div className="p-4 border-2 border-foreground rounded-2xl bg-foreground/5 shadow-sm">
                        <CreditCard className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-left">
                        <h1 className="text-2xl sm:text-4xl font-black font-headline tracking-tighter leading-none uppercase">Statutory clearance</h1>
                    </div>
                </div>
            </div>

            <div className="max-w-md ml-0 space-y-4 pb-8">
                <div className="flex items-center gap-2 mb-2 text-primary">
                    <Zap className="h-4 w-4" />
                    <Label className="text-[10px] font-black uppercase tracking-[0.3em]">Promo registry entry</Label>
                </div>
                <div className="flex gap-3">
                    <Input 
                        placeholder="Enter coupon (e.g. NYAYA50)" 
                        value={couponInput} 
                        onChange={(e) => setCouponInput(e.target.value)}
                        className="h-12 glass border-primary/10 font-bold uppercase rounded-xl px-5"
                    />
                    <Button 
                        onClick={handleApplyCoupon}
                        className="h-12 px-8 font-black uppercase text-[10px] tracking-widest rounded-xl shadow-lg active:scale-95"
                    >
                        Apply
                    </Button>
                </div>
                {appliedCoupon && (
                    <motion.p initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-[10px] font-bold text-green-600 uppercase tracking-widest flex items-center gap-2">
                        <CheckCircle2 className="h-3 w-3" /> Protocol active: {appliedCoupon.code} {appliedCoupon.code === 'PIYUSH11' ? '(₹1 special)' : `(${(appliedCoupon.discount * 100)}% discount)`}
                    </motion.p>
                )}
            </div>

            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
                {plans.map((plan) => {
                    const isActive = profile?.subscriptionType === plan.id;
                    const isProcessing = processingId === plan.id;
                    const discount = appliedCoupon ? appliedCoupon.discount : 0;
                    
                    let displayPrice = plan.amount === 0 ? 0 : Math.max(0, Math.round(plan.amount * (1 - discount)));
                    if (appliedCoupon?.code === 'PIYUSH11' && plan.amount > 0) {
                        displayPrice = 1;
                    }
                    
                    return (
                        <Card key={plan.id} className={cn(
                            "h-full flex flex-col glass rounded-[2.5rem] border-primary/10 group transition-all duration-500 hover:shadow-2xl overflow-hidden relative",
                            isActive && "ring-2 ring-primary shadow-primary/10"
                        )}>
                            <div className={cn("absolute top-0 left-0 w-1.5 bottom-0 transition-all", isActive ? "bg-primary" : "bg-primary/10 group-hover:bg-primary/40")} />
                            <CardHeader className="p-8 pb-4 text-left ml-1.5">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-black tracking-tight uppercase leading-tight">{plan.name}</h3>
                                    {plan.badge && <Badge className="bg-primary/10 text-primary border-primary/20 text-[8px] font-black uppercase px-2">{plan.badge}</Badge>}
                                </div>
                                <div className="pt-2 flex items-baseline gap-2">
                                    <span className="text-4xl font-black">₹{displayPrice}</span>
                                    {plan.amount > displayPrice && (
                                        <span className="text-sm text-muted-foreground line-through opacity-40">₹{plan.amount}</span>
                                    )}
                                </div>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-2 opacity-60">{plan.desc}</p>
                            </CardHeader>
                            <CardContent className="p-8 pt-4 flex-grow space-y-6 text-left ml-1.5">
                                <div className="space-y-3">
                                    {plan.features.map((f, i) => (
                                        <div key={i} className="flex items-start gap-3">
                                            <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0 mt-0.5" />
                                            <span className="text-[11px] font-medium text-muted-foreground">{f}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                            <CardFooter className="p-8 pt-0 ml-1.5">
                                <Button onClick={() => handleUpgrade(plan.id)} disabled={isActive || isProcessing} className="w-full h-12 font-black uppercase text-[10px] rounded-xl shadow-lg active:scale-95 group-hover:shadow-primary/20">
                                    {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : isActive ? "Active tier" : "Initialize upgrade"}
                                </Button>
                            </CardFooter>
                        </Card>
                    );
                })}
            </div>

            <section className="pt-16 space-y-8 text-left">
                <div className="flex items-center justify-between border-b-4 border-foreground pb-4">
                    <div className="flex items-center gap-4">
                        <div className="p-4 border-2 border-foreground rounded-2xl bg-foreground/5 shadow-sm">
                            <History className="h-6 w-6 text-primary" />
                        </div>
                        <div className="text-left">
                            <h2 className="text-2xl sm:text-4xl font-black font-headline tracking-tighter leading-none uppercase">Success only ledger</h2>
                        </div>
                    </div>
                    <Badge variant="secondary" className="font-black text-[8px] uppercase tracking-widest bg-primary/5 text-primary/60 border-primary/10">Statutory record</Badge>
                </div>
                
                <Card className="glass shadow-2xl rounded-[2.5rem] overflow-hidden border-primary/10">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-muted/30 border-b border-primary/10">
                                <tr>
                                    <th className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">Timestamp</th>
                                    <th className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">Clearance tier</th>
                                    <th className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground text-center">Authorization</th>
                                    <th className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">Value</th>
                                    <th className="px-8 py-5 text-right text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground pr-12">TXID</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-primary/5">
                                {userTransactions.length > 0 ? userTransactions.map((tx) => (
                                    <tr key={tx.id} className="hover:bg-primary/5 transition-colors group">
                                        <td className="px-8 py-5">
                                            <p className="text-[10px] font-bold text-muted-foreground flex items-center gap-2">
                                                <Clock className="h-3 w-3 opacity-40 group-hover:text-primary transition-colors" />
                                                {tx.createdAt ? formatDistanceToNow(tx.createdAt.toDate ? tx.createdAt.toDate() : new Date(tx.createdAt), { addSuffix: true }) : 'Syncing...'}
                                            </p>
                                        </td>
                                        <td className="px-8 py-5">
                                            <Badge variant="outline" className="font-black text-[8px] uppercase border-primary/20 text-primary bg-primary/5 px-3 py-1">
                                                {tx.planId?.replace('_', ' ') || 'Statutory upgrade'}
                                            </Badge>
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <div className="flex items-center justify-center gap-1.5 text-green-600 font-black text-[8px] uppercase tracking-widest">
                                                <CheckCircle2 className="h-3.5 w-3.5" /> CAPTURED
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <p className="font-mono font-black text-sm tracking-tight text-foreground">₹{(tx.amount || 0).toLocaleString('en-IN')}</p>
                                        </td>
                                        <td className="px-8 py-5 text-right pr-12">
                                            <p className="font-mono text-[9px] opacity-40 select-all tracking-wider">{tx.paymentId}</p>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center gap-4 opacity-30">
                                                <Activity className="h-12 w-12 text-muted-foreground" />
                                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground">Registry clear. Awaiting statutory captures.</p>
                                            </div>
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
