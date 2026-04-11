"use client";

import { useState, useEffect } from "react";
import { useAuth, useFirestore } from "@/firebase";
import { doc, onSnapshot, updateDoc, collection, addDoc, serverTimestamp, query, where } from "firebase/firestore";
import { 
  CheckCircle2, 
  Zap, 
  Crown, 
  Star, 
  Loader2, 
  Activity, 
  Info,
  ChevronRight,
  ShieldCheck,
  CreditCard,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError, type SecurityRuleContext } from "@/firebase/errors";
import { formatDistanceToNow } from "date-fns";

const plansData = [
  {
    id: "free",
    name: "free",
    icon: Zap,
    desc: "trial & light users",
    monthlyPrice: 0,
    annualPrice: 0,
    features: {
      queries: "100",
      limit: "10 per day",
      output: "~40,000 words"
    },
    color: "text-gray-400",
    bg: "bg-gray-500/10"
  },
  {
    id: "plus",
    name: "plus",
    icon: Crown,
    desc: "regular & serious users",
    monthlyPrice: 499,
    annualPrice: 3990,
    originalAnnualPrice: 4788,
    monthlyEquivalent: "333",
    features: {
      queries: "200",
      limit: "no daily limit",
      output: "~1,50,000 words"
    },
    color: "text-amber-500",
    bg: "bg-amber-500/10"
  },
  {
    id: "premium",
    name: "premium",
    icon: Star,
    desc: "power / professional users",
    monthlyPrice: 899,
    annualPrice: 6990,
    originalAnnualPrice: 8388,
    monthlyEquivalent: "583",
    popular: true,
    features: {
      queries: "unlimited",
      limit: "no daily limit",
      output: "unlimited words"
    },
    color: "text-amber-500",
    bg: "bg-amber-500/10"
  }
];

export default function BillingPage() {
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAnnual, setIsAnnual] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [userTransactions, setUserTransactions] = useState<any[]>([]);

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
      }
    );

    return () => { unsub(); unsubTrans(); };
  }, [auth, firestore]);

  const handleUpgrade = async (plan: any) => {
    if (plan.id === profile?.subscriptionType) return;
    if (plan.monthlyPrice === 0) return;

    setProcessingId(plan.id);
    
    // Razorpay Integration logic would go here
    // For now, providing a professional simulated feedback
    setTimeout(() => {
      toast({
        title: "gateway redirecting",
        description: "connecting to razorpay secure node..."
      });
      setProcessingId(null);
    }, 1000);
  };

  if (loading) return (
    <div className="flex h-[70vh] items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin text-primary opacity-20" />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-16 pb-32 px-4 sm:px-6 text-left">
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">plans & pricing</h1>
        <p className="text-gray-500 font-medium">choose the plan that fits your legal research needs</p>
      </div>

      {/* BILLING TOGGLE */}
      <div className="flex items-center justify-center gap-4">
        <span className={cn("text-xs font-bold uppercase tracking-widest transition-colors", !isAnnual ? "text-white" : "text-gray-600")}>monthly</span>
        <Switch 
          checked={isAnnual} 
          onCheckedChange={setIsAnnual} 
          className="data-[state=checked]:bg-primary"
        />
        <div className="flex items-center gap-3">
          <span className={cn("text-xs font-bold uppercase tracking-widest transition-colors", isAnnual ? "text-white" : "text-gray-600")}>annual</span>
          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 text-[9px] font-black uppercase tracking-widest px-2 py-0.5">save 17%</Badge>
        </div>
      </div>

      {/* PRICING CARDS */}
      <div className="grid md:grid-cols-3 gap-8 items-stretch">
        {plansData.map((plan) => {
          const isActive = profile?.subscriptionType === plan.id;
          const isProcessing = processingId === plan.id;
          const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;
          
          return (
            <div key={plan.id} className="relative flex flex-col">
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                  <Badge className="bg-primary text-primary-foreground font-black text-[9px] uppercase tracking-widest px-4 py-1 rounded-lg border-2 border-[#050505]">most popular</Badge>
                </div>
              )}
              
              <Card className={cn(
                "flex-1 bg-[#161b22] border-white/5 rounded-[2.5rem] p-8 flex flex-col text-center transition-all duration-500 hover:border-primary/20",
                plan.popular && "border-primary/40 ring-1 ring-primary/20"
              )}>
                <CardHeader className="p-0 space-y-6 mb-10">
                  <div className={cn("mx-auto p-4 rounded-full", plan.bg, plan.color)}>
                    <plan.icon className="h-8 w-8" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black text-white">{plan.name}</h3>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{plan.desc}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-baseline justify-center gap-1">
                      {isAnnual && plan.originalAnnualPrice && (
                        <span className="text-sm text-gray-600 line-through mr-2">₹{plan.originalAnnualPrice}</span>
                      )}
                      <span className="text-4xl font-black text-white">₹{price}</span>
                      <span className="text-gray-500 font-bold">/{isAnnual ? 'year' : 'month'}</span>
                    </div>
                    {isAnnual && plan.monthlyEquivalent && (
                      <p className="text-[10px] font-bold text-green-500 uppercase tracking-widest">
                        ₹{plan.monthlyEquivalent}/mo · 2 months free
                      </p>
                    )}
                  </div>
                </CardHeader>

                <CardFooter className="p-0 mt-auto">
                  <Button 
                    onClick={() => handleUpgrade(plan)}
                    disabled={isActive || isProcessing}
                    variant={isActive ? "outline" : "default"}
                    className={cn(
                      "w-full h-12 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 shadow-lg",
                      isActive ? "border-primary text-primary bg-primary/5" : "bg-primary text-primary-foreground shadow-primary/20"
                    )}
                  >
                    {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : isActive ? "current plan" : "upgrade now"}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          );
        })}
      </div>

      {/* COMPARISON TABLE */}
      <div className="pt-10 max-w-4xl mx-auto w-full">
        <div className="grid grid-cols-4 gap-4 pb-6 border-b border-white/5 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">
          <div className="col-span-1 flex items-center gap-2">
            <Activity className="h-3.5 w-3.5" /> queries / month
          </div>
          <div className="text-center text-white">100</div>
          <div className="text-center text-white">200</div>
          <div className="text-center text-primary">unlimited</div>
        </div>
        
        <div className="grid grid-cols-4 gap-4 py-6 border-b border-white/5 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">
          <div className="col-span-1">daily query limit</div>
          <div className="text-center text-white">10 per day</div>
          <div className="text-center text-white">no daily limit</div>
          <div className="text-center text-white">no daily limit</div>
        </div>

        <div className="grid grid-cols-4 gap-4 py-6 border-b border-white/5 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">
          <div className="col-span-1">monthly output</div>
          <div className="text-center text-white underline decoration-dotted underline-offset-4">~40,000 words</div>
          <div className="text-center text-white underline decoration-dotted underline-offset-4">~1,50,000 words</div>
          <div className="text-center text-white underline decoration-dotted underline-offset-4">unlimited words</div>
        </div>
      </div>

      {/* TRANSACTION LEDGER */}
      <section className="pt-20 space-y-8">
        <div className="flex items-center gap-4 border-b border-white/5 pb-4">
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <CreditCard className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-xl font-black text-white uppercase tracking-tight">verified ledger</h2>
        </div>
        
        <Card className="bg-[#161b22] border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white/5 border-b border-white/5">
                <tr>
                  <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-gray-500">timestamp</th>
                  <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-gray-500">clearance</th>
                  <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-gray-500 text-center">status</th>
                  <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-gray-500">value</th>
                  <th className="px-8 py-5 text-right text-[9px] font-black uppercase tracking-widest text-gray-500 pr-12">txid</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {userTransactions.length > 0 ? userTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-8 py-5 text-[10px] font-bold text-gray-400">
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3 opacity-40" />
                        {tx.createdAt ? formatDistanceToNow(tx.createdAt.toDate ? tx.createdAt.toDate() : new Date(tx.createdAt), { addSuffix: true }) : 'Syncing...'}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-[8px] font-black uppercase px-2">
                        {tx.planId?.replace('_', ' ') || 'standard'}
                      </Badge>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <div className="flex items-center justify-center gap-1.5 text-green-500 font-black text-[8px] uppercase tracking-widest">
                        <CheckCircle2 className="h-3 w-3" /> captured
                      </div>
                    </td>
                    <td className="px-8 py-5 text-sm font-black text-white">₹{(tx.amount || 0).toLocaleString('en-IN')}</td>
                    <td className="px-8 py-5 text-right pr-12">
                      <p className="font-mono text-[9px] text-gray-600 select-all tracking-wider">{tx.paymentId}</p>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center opacity-30">
                      <div className="flex flex-col items-center gap-4">
                        <Activity className="h-12 w-12 text-gray-500" />
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">registry clear. awaiting captures.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </section>

      <div className="text-center pt-8 opacity-30">
        <p className="text-[9px] font-black uppercase tracking-[0.6em] text-gray-500">NYAYASAHAYAK.IN // FINANCIAL PROTOCOL // 2025</p>
      </div>
    </div>
  );
}
