"use client";

import { useState, useEffect } from "react";
import { useAuth, useFirestore } from "@/firebase";
import { doc, onSnapshot, setDoc, serverTimestamp, collection, addDoc } from "firebase/firestore";
import { 
  CheckCircle2, 
  Zap, 
  Crown, 
  Loader2, 
  ShieldCheck,
  ZapIcon,
  Layers,
  Trophy,
  Activity,
  Ticket
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError, type SecurityRuleContext } from "@/firebase/errors";

const plansData = [
  {
    id: "free",
    name: "Citizen Basic",
    price: 0,
    desc: "Standard identity enrollment.",
    features: ["Voice Narration (5x)", "Document Audit (5x)", "Basic Case Analytics", "Public Directory Access"],
    icon: ZapIcon,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20"
  },
  {
    id: "pro_20",
    name: "Professional 20",
    price: 99,
    desc: "Essential statutory expansion.",
    features: ["Voice Narration (20x)", "Document Audit (20x)", "Extended Case Tracker", "Priority AI Ingress"],
    badge: "Popular Choice",
    icon: Crown,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20"
  },
  {
    id: "unlimited_monthly",
    name: "Unlimited Monthly",
    price: 599,
    desc: "Continuous institutional access.",
    features: ["Unlimited AI Forensic Scans", "Unlimited Document Audits", "Full Case Strategy Hub", "Verified Connect Ingress", "Priority Neural Support"],
    badge: "Professional Tier",
    icon: Layers,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20"
  },
  {
    id: "unlimited_yearly",
    name: "Institutional Annual",
    price: 4999,
    desc: "Permanent statutory authority.",
    features: ["Everything In Unlimited", "Advanced Contract Hub", "Custom PDF Export Protocol", "Root System Access", "Institutional Branding"],
    badge: "Elite Hub",
    icon: Trophy,
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20"
  }
];

export default function BillingPage() {
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [applying, setApplying] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    if (!auth.currentUser) {
      setLoading(false);
      return;
    }
    
    const userId = auth.currentUser.uid;
    const userDocRef = doc(firestore, "users", userId);
    
    const unsub = onSnapshot(userDocRef, 
      (doc) => {
        if (doc.exists()) {
          setProfile(doc.data());
        }
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

    return () => unsub();
  }, [auth, firestore]);

  const getDiscountedPrice = (planId: string, originalPrice: number) => {
    if (!appliedCoupon) return originalPrice;
    
    if (appliedCoupon === 'PIYUSH11') {
      return originalPrice > 0 ? 1 : 0;
    }
    
    if (appliedCoupon === 'NYAYASER') {
      if (planId === 'unlimited_yearly') {
        return Math.floor(originalPrice * 0.7); // 30% off
      }
      if (planId === 'pro_20' || planId === 'unlimited_monthly') {
        return Math.floor(originalPrice * 0.8); // 20% off
      }
    }
    
    return originalPrice;
  };

  const handlePaymentSuccess = async (planId: string, paymentId: string, amount: number) => {
    if (!auth.currentUser) return;
    
    const userDocRef = doc(firestore, "users", auth.currentUser.uid);
    const transCol = collection(firestore, "transactions");

    const transactionData = {
        userId: auth.currentUser.uid,
        userEmail: auth.currentUser.email,
        userName: `${profile?.firstName} ${profile?.lastName}`,
        planId: planId,
        amount: amount,
        paymentId: paymentId,
        createdAt: serverTimestamp(),
        status: "CAPTURED",
        couponUsed: appliedCoupon || null
    };

    setDoc(userDocRef, { 
      subscriptionType: planId,
      updatedAt: serverTimestamp() 
    }, { merge: true })
        .catch(async (err) => {
            const permissionError = new FirestorePermissionError({
                path: userDocRef.path,
                operation: 'update',
                requestResourceData: { subscriptionType: planId },
            } satisfies SecurityRuleContext, err);
            errorEmitter.emit('permission-error', permissionError);
        });

    addDoc(transCol, transactionData)
        .catch(async (err) => {
            const permissionError = new FirestorePermissionError({
                path: transCol.path,
                operation: 'create',
                requestResourceData: transactionData,
            } satisfies SecurityRuleContext, err);
            errorEmitter.emit('permission-error', permissionError);
        });

    toast({ title: "Payment Successful", description: `Your account has been upgraded to ${planId.replace('_', ' ')} clearance.` });
  };

  const handleUpgrade = (planId: string) => {
    if (planId === "free" && (!profile?.subscriptionType || profile?.subscriptionType === 'free')) {
        toast({ title: "Current Plan", description: "You are already using the standard citizen tier." });
        return;
    }

    const plan = plansData.find(p => p.id === planId);
    if (!plan) return;

    const finalPrice = getDiscountedPrice(planId, plan.price);
    setProcessingId(planId);

    const options = {
      key: "rzp_test_NyayaSahayakKey",
      amount: finalPrice * 100,
      currency: "INR",
      name: "Nyaya Sahayak",
      description: `Upgrade to ${plan.name}`,
      image: "/Logo.png",
      handler: function (response: any) {
        handlePaymentSuccess(planId, response.razorpay_payment_id, finalPrice);
        setProcessingId(null);
      },
      prefill: {
        name: `${profile?.firstName} ${profile?.lastName}`,
        email: profile?.email,
        contact: profile?.mobileNumber
      },
      theme: {
        color: "#ca8a04"
      },
      modal: {
        ondismiss: function() {
          setProcessingId(null);
        }
      }
    };

    if ((window as any).Razorpay) {
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
    } else {
        toast({ variant: "destructive", title: "Gateway Error", description: "The secure payment hub is temporarily unreachable." });
        setProcessingId(null);
    }
  };

  const handleApplyCoupon = () => {
      const code = coupon.trim().toUpperCase();
      if (!code) return;
      
      setApplying(true);
      setTimeout(() => {
          setApplying(false);
          if (code === 'PIYUSH11' || code === 'NYAYASER') {
              setAppliedCoupon(code);
              toast({ title: "Protocol Activated", description: `The coupon code ${code} has been applied to the registry.` });
          } else {
              toast({ variant: "destructive", title: "Invalid Protocol", description: "This coupon code is not recognized by the system." });
          }
      }, 800);
  };

  const handleRemoveCoupon = () => {
      setAppliedCoupon(null);
      setCoupon("");
      toast({ title: "Protocol Removed", description: "Prices have been reset to statutory standard." });
  };

  if (loading) return (
    <div className="flex h-[60vh] items-center justify-center">
      <Activity className="h-10 w-10 text-primary opacity-20" />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 px-2 sm:px-4 text-left">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-border/5 pb-6">
        <div className="space-y-1 text-left">
            <h1 className="text-2xl font-black tracking-tight">Statutory Plans & Pricing</h1>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Select your institutional clearance level for elite AI assistance.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            {appliedCoupon ? (
                <div className="flex items-center gap-2 bg-green-500/5 border border-green-500/20 px-4 py-2 rounded-xl">
                    <Ticket className="h-4 w-4 text-green-600" />
                    <span className="text-[10px] font-black uppercase text-green-600">Active: {appliedCoupon}</span>
                    <button onClick={handleRemoveCoupon} className="ml-2 text-muted-foreground hover:text-destructive transition-colors">
                        <Zap className="h-3 w-3 fill-current rotate-180" />
                    </button>
                </div>
            ) : (
                <div className="relative flex-1 md:w-64">
                    <Input 
                        value={coupon} 
                        onChange={e => setCoupon(e.target.value)} 
                        placeholder="Enter Promo Code" 
                        className="h-10 bg-background border-border/10 font-bold pr-20 rounded-xl text-xs"
                    />
                    <Button 
                        size="sm" 
                        onClick={handleApplyCoupon}
                        disabled={applying || !coupon}
                        className="absolute right-1 top-1 h-8 px-4 font-black text-[9px] uppercase tracking-widest rounded-lg"
                    >
                        {applying ? "..." : "Apply"}
                    </Button>
                </div>
            )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
        {plansData.map((plan) => {
          const isActive = profile?.subscriptionType === plan.id || (plan.id === 'free' && (!profile?.subscriptionType || profile?.subscriptionType === 'free'));
          const isProcessing = processingId === plan.id;
          const originalPrice = plan.price;
          const currentPrice = getDiscountedPrice(plan.id, originalPrice);
          const hasDiscount = appliedCoupon && originalPrice > 0 && currentPrice < originalPrice;
          
          return (
            <Card key={plan.id} className={cn(
              "h-full flex flex-col rounded-[1.5rem] overflow-hidden border-border/10 shadow-sm bg-card transition-all",
              plan.badge && "border-primary/20 ring-1 ring-primary/5",
              isActive && "opacity-80"
            )}>
              {plan.badge && (
                  <div className="p-4 pb-0 flex justify-end">
                      <Badge className="bg-primary/10 text-primary border-primary/20 font-black text-[8px] uppercase px-3 py-1 rounded-lg">
                          {plan.badge}
                      </Badge>
                  </div>
              )}

              <CardHeader className="p-6 text-left space-y-3">
                <h3 className="text-xl font-black tracking-tight uppercase leading-none">{plan.name}</h3>
                <div className="flex flex-col">
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black tracking-tighter">₹{currentPrice}</span>
                        {plan.id !== 'free' && <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">/ Period</span>}
                    </div>
                    {hasDiscount && (
                        <p className="text-[10px] font-bold text-muted-foreground line-through opacity-40">Statutory: ₹{originalPrice}</p>
                    )}
                </div>
                <p className="text-[10px] font-bold text-muted-foreground leading-relaxed uppercase opacity-60">
                  {plan.desc}
                </p>
              </CardHeader>

              <CardContent className="p-6 flex-grow text-left space-y-5 pt-0">
                <div className="h-px w-full bg-border/5" />
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-[10px] font-medium text-foreground/80 leading-tight">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="p-6 pt-0">
                <Button 
                  onClick={() => handleUpgrade(plan.id)}
                  disabled={isActive || isProcessing}
                  className={cn(
                    "w-full h-12 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 shadow-sm",
                    isActive ? "bg-muted text-muted-foreground cursor-default shadow-none" : "bg-primary text-primary-foreground shadow-primary/20"
                  )}
                >
                  {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : isActive ? "Active Clearance" : "Initialize Upgrade"}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      <div className="pt-12 text-center opacity-30">
          <div className="flex items-center justify-center gap-6 mb-4">
              <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  <span className="text-[9px] font-black uppercase tracking-widest">Secure Gateway Sync</span>
              </div>
              <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  <span className="text-[9px] font-black uppercase tracking-widest">Institutional Ledger</span>
              </div>
          </div>
          <p className="text-[9px] font-black uppercase tracking-[0.6em] text-muted-foreground">NYAYASAHAYAK.IN // FINANCIAL PROTOCOL // 2026</p>
      </div>
    </div>
  );
}