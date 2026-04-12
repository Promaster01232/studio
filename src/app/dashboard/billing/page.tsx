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
  Activity
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

  const handlePaymentSuccess = async (planId: string, paymentId: string) => {
    if (!auth.currentUser) return;
    
    const userDocRef = doc(firestore, "users", auth.currentUser.uid);
    const transCol = collection(firestore, "transactions");

    const transactionData = {
        userId: auth.currentUser.uid,
        userEmail: auth.currentUser.email,
        userName: `${profile?.firstName} ${profile?.lastName}`,
        planId: planId,
        amount: plansData.find(p => p.id === planId)?.price || 0,
        paymentId: paymentId,
        createdAt: serverTimestamp(),
        status: "CAPTURED"
    };

    // Update User Subscription
    setDoc(userDocRef, { subscriptionType: planId }, { merge: true })
        .catch(async (err) => {
            const permissionError = new FirestorePermissionError({
                path: userDocRef.path,
                operation: 'update',
                requestResourceData: { subscriptionType: planId },
            } satisfies SecurityRuleContext, err);
            errorEmitter.emit('permission-error', permissionError);
        });

    // Record Transaction
    addDoc(transCol, transactionData)
        .catch(async (err) => {
            const permissionError = new FirestorePermissionError({
                path: transCol.path,
                operation: 'create',
                requestResourceData: transactionData,
            } satisfies SecurityRuleContext, err);
            errorEmitter.emit('permission-error', permissionError);
        });

    toast({ title: "Payment Successful", description: `Your account has been upgraded to ${planId.replace('_', ' ')}.` });
  };

  const handleUpgrade = (planId: string) => {
    if (planId === "free" && (!profile?.subscriptionType || profile?.subscriptionType === 'free')) {
        toast({ title: "Current Plan", description: "You are already using the basic registry tier." });
        return;
    }

    const plan = plansData.find(p => p.id === planId);
    if (!plan) return;

    setProcessingId(planId);

    const options = {
      key: "rzp_test_NyayaSahayakKey", // Placeholder Key
      amount: plan.price * 100,
      currency: "INR",
      name: "Nyaya Sahayak",
      description: `Upgrade to ${plan.name}`,
      image: "/Logo.png",
      handler: function (response: any) {
        handlePaymentSuccess(planId, response.razorpay_payment_id);
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
        toast({ variant: "destructive", title: "Gateway Error", description: "Payment hub is temporarily unreachable." });
        setProcessingId(null);
    }
  };

  const handleApplyCoupon = () => {
      if (!coupon) return;
      setApplying(true);
      setTimeout(() => {
          setApplying(false);
          toast({ variant: "destructive", title: "Invalid Protocol", description: "This coupon code has expired or is invalid." });
      }, 1000);
  };

  if (loading) return (
    <div className="flex h-[70vh] items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin text-primary opacity-20" />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 px-4 sm:px-6 text-left">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1 text-left">
            <h1 className="text-2xl sm:text-3xl font-black font-headline tracking-tighter">Plans & Pricing</h1>
            <p className="text-sm text-muted-foreground font-medium">Select your institutional clearance level.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-72">
                <Input 
                    value={coupon} 
                    onChange={e => setCoupon(e.target.value)} 
                    placeholder="Enter Coupon (e.g. NYAYA50)" 
                    className="h-10 bg-white dark:bg-zinc-900 border-primary/10 font-bold pr-24 rounded-xl"
                />
                <Button 
                    size="sm" 
                    onClick={handleApplyCoupon}
                    disabled={applying || !coupon}
                    className="absolute right-1 top-1 h-8 px-4 font-black text-[9px] uppercase tracking-widest rounded-lg"
                >
                    {applying ? <Loader2 className="h-3 w-3 animate-spin" /> : "Apply"}
                </Button>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
        {plansData.map((plan) => {
          const isActive = profile?.subscriptionType === plan.id || (plan.id === 'free' && (!profile?.subscriptionType || profile?.subscriptionType === 'free'));
          const isProcessing = processingId === plan.id;
          
          return (
            <Card key={plan.id} className={cn(
              "h-full flex flex-col rounded-[2rem] overflow-hidden border-primary/5 shadow-xl bg-white dark:bg-zinc-900",
              plan.badge && "border-primary/20 ring-1 ring-primary/5"
            )}>
              {plan.badge && (
                  <div className="p-4 pb-0 flex justify-end">
                      <Badge className="bg-primary/10 text-primary border-primary/20 font-black text-[8px] uppercase tracking-tighter px-2 py-0.5 rounded-lg">
                          {plan.badge}
                      </Badge>
                  </div>
              )}

              <CardHeader className="p-6 text-left space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-black font-headline tracking-tighter uppercase leading-none">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black tracking-tight">₹{plan.price}</span>
                      {plan.id !== 'free' && <span className="text-[10px] font-bold text-muted-foreground uppercase">/Period</span>}
                  </div>
                </div>
                <p className="text-[10px] font-bold text-muted-foreground leading-relaxed uppercase tracking-tighter">
                  {plan.desc}
                </p>
              </CardHeader>

              <CardContent className="p-6 flex-grow text-left space-y-4 pt-0">
                <div className="h-px w-full bg-primary/5" />
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
                    "w-full h-12 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 shadow-md",
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

      <div className="pt-8 text-center opacity-30">
          <div className="flex items-center justify-center gap-4 mb-2">
              <div className="flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span className="text-[8px] font-black uppercase tracking-widest">Secure Gateway Sync</span>
              </div>
              <div className="flex items-center gap-1.5">
                  <Activity className="h-3.5 w-3.5" />
                  <span className="text-[8px] font-black uppercase tracking-widest">Institutional Ledger Active</span>
              </div>
          </div>
          <p className="text-[8px] font-black uppercase tracking-[0.5em] text-muted-foreground">NYAYASAHAYAK.IN // FINANCIAL PROTOCOL</p>
      </div>
    </div>
  );
}
