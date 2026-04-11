"use client";

import { useState, useEffect } from "react";
import { useAuth, useFirestore } from "@/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { 
  CheckCircle2, 
  Zap, 
  Crown, 
  Star, 
  Loader2, 
  ShieldCheck,
  ZapIcon,
  Layers,
  Trophy,
  Activity,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError, type SecurityRuleContext } from "@/firebase/errors";

const plansData = [
  {
    id: "free",
    name: "Citizen basic",
    price: "0",
    desc: "Standard identity enrollment.",
    features: ["Voice narration (5x)", "Document audit (5x)", "Basic case analytics", "Public directory access"],
    icon: ZapIcon,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20"
  },
  {
    id: "pro_20",
    name: "Professional 20",
    price: "99",
    desc: "Essential statutory expansion.",
    features: ["Voice narration (20x)", "Document audit (20x)", "Extended case tracker", "Priority Ai ingress"],
    badge: "Popular choice",
    icon: Crown,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20"
  },
  {
    id: "unlimited_monthly",
    name: "Unlimited monthly",
    price: "599",
    desc: "Continuous institutional access.",
    features: ["Unlimited Ai forensic scans", "Unlimited document audits", "Full case strategy hub", "Verified connect ingress", "Priority neural support"],
    badge: "Professional tier",
    icon: Layers,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20"
  },
  {
    id: "unlimited_yearly",
    name: "Institutional annual",
    price: "4999",
    desc: "Permanent statutory authority.",
    features: ["Everything in unlimited", "Advanced contract node", "Custom Pdf export protocol", "Root system access", "Institutional branding"],
    badge: "Elite node",
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

  const handleUpgrade = (planId: string) => {
    if (planId === "free" && !profile?.subscriptionType) {
        toast({ title: "Current plan", description: "You are already using the basic registry tier." });
        return;
    }
    setProcessingId(planId);
    setTimeout(() => {
      toast({
        title: "Redirecting to gateway",
        description: "Connecting to secure razorpay node..."
      });
      setProcessingId(null);
    }, 800);
  };

  const handleApplyCoupon = () => {
      if (!coupon) return;
      setApplying(true);
      setTimeout(() => {
          setApplying(false);
          toast({ variant: "destructive", title: "Invalid protocol", description: "This coupon code has expired or is invalid." });
      }, 1000);
  };

  if (loading) return (
    <div className="flex h-[70vh] items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin text-primary opacity-20" />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-32 px-4 sm:px-6 text-left">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1 text-left">
            <h1 className="text-3xl sm:text-4xl font-black font-headline tracking-tighter">Plans & pricing</h1>
            <p className="text-sm text-muted-foreground font-medium">Select your institutional clearance level.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-72">
                <Input 
                    value={coupon} 
                    onChange={e => setCoupon(e.target.value)} 
                    placeholder="Enter coupon (e.g. nyaya50)" 
                    className="h-12 bg-white dark:bg-zinc-900 border-primary/10 font-bold pr-24 rounded-xl"
                />
                <Button 
                    size="sm" 
                    onClick={handleApplyCoupon}
                    disabled={applying || !coupon}
                    className="absolute right-1.5 top-1.5 h-9 px-4 font-black text-[9px] uppercase tracking-widest rounded-lg shadow-lg"
                >
                    {applying ? <Loader2 className="h-3 w-3 animate-spin" /> : "Apply"}
                </Button>
            </div>
        </div>
      </div>

      <motion.div 
        initial="hidden"
        animate="visible"
        variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
        }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch"
      >
        {plansData.map((plan) => {
          const isActive = profile?.subscriptionType === plan.id || (plan.id === 'free' && !profile?.subscriptionType);
          const isProcessing = processingId === plan.id;
          
          return (
            <motion.div 
                key={plan.id}
                variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
                }}
                className="relative group h-full"
            >
              <Card className={cn(
                "h-full flex flex-col transition-all duration-500 rounded-[2.5rem] overflow-hidden border-primary/5 shadow-2xl hover:shadow-[0_30px_60px_rgba(0,0,0,0.1)] hover:-translate-y-1 bg-white dark:bg-zinc-900",
                plan.badge && "border-primary/20 ring-1 ring-primary/5"
              )}>
                {plan.badge && (
                    <div className="absolute top-6 right-6 z-20">
                        <Badge className="bg-primary/10 text-primary border-primary/20 font-black text-[8px] uppercase tracking-tighter px-2.5 py-1 rounded-lg">
                            {plan.badge}
                        </Badge>
                    </div>
                )}

                <CardHeader className="p-8 sm:p-10 pb-0 text-left space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-xl sm:text-2xl font-black font-headline tracking-tighter uppercase leading-none">{plan.name}</h3>
                    <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-black tracking-tight">₹{plan.price}</span>
                        {plan.id !== 'free' && <span className="text-xs font-bold text-muted-foreground">/period</span>}
                    </div>
                  </div>
                  <p className="text-[11px] font-bold text-muted-foreground leading-relaxed uppercase tracking-tighter min-h-[32px]">
                    {plan.desc}
                  </p>
                </CardHeader>

                <CardContent className="p-8 sm:p-10 flex-grow text-left space-y-6">
                  <div className="h-px w-full bg-primary/5" />
                  <ul className="space-y-4">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-[11px] sm:text-xs font-medium text-foreground/80 leading-tight">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="p-8 sm:p-10 pt-0">
                  <Button 
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={isActive || isProcessing}
                    className={cn(
                      "w-full h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 shadow-xl",
                      isActive ? "bg-muted text-muted-foreground cursor-default" : "bg-primary text-primary-foreground shadow-primary/20"
                    )}
                  >
                    {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : isActive ? "Active clearance" : "Initialize upgrade"}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="pt-12 text-center opacity-30">
          <div className="flex items-center justify-center gap-6 mb-4">
              <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  <span className="text-[9px] font-black uppercase tracking-widest">Secure gateway sync</span>
              </div>
              <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  <span className="text-[9px] font-black uppercase tracking-widest">Institutional ledger active</span>
              </div>
          </div>
          <p className="text-[9px] font-black uppercase tracking-[0.5em] text-muted-foreground">NYAYASAHAYAK.IN // FINANCIAL PROTOCOL</p>
      </div>
    </div>
  );
}
