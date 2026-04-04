"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useFirestore, useDatabase } from "@/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { ref, set } from "firebase/database";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ShieldCheck, User, Smartphone, Globe, Activity } from "lucide-react";
import { validateUserDetails } from "@/ai/flows/validate-user-details";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError, type SecurityRuleContext } from "@/firebase/errors";
import { Logo } from "@/components/logo";

const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  mobileNumber: z.string().min(10, "A valid mobile number is required."),
  userType: z.enum(["citizen", "businessman", "student"], {
    required_error: "You need to select a role.",
  }),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function CreateProfilePage() {
  const auth = useAuth();
  const firestore = useFirestore();
  const rtdb = useDatabase();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      mobileNumber: "",
      userType: "citizen",
    },
  });

  useEffect(() => {
    if (auth.currentUser) {
      const displayName = auth.currentUser.displayName || "";
      const email = auth.currentUser.email || "";
      form.reset({
        firstName: displayName.split(" ")[0] || "",
        lastName: displayName.split(" ").slice(1).join(" ") || "",
        email: email,
        mobileNumber: auth.currentUser.phoneNumber || "",
        userType: "citizen",
      });
      setAuthLoading(false);
    } else {
        if (typeof window !== 'undefined') {
            router.replace('/login');
        }
    }
  }, [auth.currentUser, form, router]);

  const onSubmit = async (data: ProfileFormValues) => {
    if (!auth.currentUser) {
      toast({
        variant: "destructive",
        title: "Session Expired",
        description: "Please log in again to complete your profile.",
      });
      router.push("/login");
      return;
    }

    setLoading(true);

    try {
      try {
        const validation = await validateUserDetails({
          mobileNumber: data.mobileNumber,
          userType: data.userType,
        });
        if (!validation.isValid) {
          console.warn("[SECURITY] Mobile audit flag:", validation.reason);
        }
      } catch (aiError) {
        console.warn("AI Validation Bypass: Validation node busy. Proceeding with statutory waiver.");
      }

      const userProfile = {
        uid: auth.currentUser.uid,
        photoURL: auth.currentUser.photoURL || '',
        ...data,
        isBlocked: false,
        aiUsageCount: 0,
        subscriptionType: 'free',
        createdAt: serverTimestamp(),
      };
      
      const userDocRef = doc(firestore, "users", auth.currentUser.uid);
      
      setDoc(userDocRef, userProfile).catch(async (serverError) => {
          const permissionError = new FirestorePermissionError({
              path: userDocRef.path,
              operation: 'create',
              requestResourceData: userProfile,
          } satisfies SecurityRuleContext, serverError);
          errorEmitter.emit('permission-error', permissionError);
      });
      
      set(ref(rtdb, `users/${auth.currentUser.uid}`), {
          ...userProfile,
          createdAt: Date.now()
      }).catch(err => console.warn("RTDB sync deferred."));

      toast({
          title: "Identity Synchronized",
          description: "Welcome to your Nyaya Sahayak terminal.",
      });
      router.push("/dashboard");

    } catch (error: any) {
        console.error("Profile synchronization issue:", error);
        router.push("/dashboard");
    }
  };
  
  if (authLoading) {
      return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <Loader2 className="h-8 w-8 animate-spin text-primary opacity-20" />
        </div>
      );
  }

  return (
    <div className="w-full max-w-4xl grid md:grid-cols-2 overflow-hidden shadow-2xl rounded-[2.5rem] border border-primary/5 bg-card text-left">
      <div className="hidden md:flex flex-col items-center justify-center bg-primary/5 p-12 relative overflow-hidden border-r border-primary/5">
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none grayscale flex items-center justify-center">
            <Logo className="h-[500px] w-[500px]" priority={true} />
        </div>
        <div className="relative z-10 space-y-10 text-center">
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] shadow-2xl border border-primary/10 inline-block group">
                <Logo className="h-24 w-24 group-hover:scale-110 transition-transform duration-700" priority={true} />
            </div>
            <div className="space-y-3">
                <h2 className="text-3xl font-black font-headline tracking-tighter uppercase leading-tight">Identity <br /> Calibration</h2>
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest leading-relaxed max-w-[240px] mx-auto">Finalizing your institutional access nodes for elite AI assistance.</p>
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white/50 dark:bg-black/50 border border-primary/10 shadow-sm">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Secure session Active</span>
                </div>
                <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white/50 dark:bg-black/50 border border-primary/10 shadow-sm">
                    <Activity className="h-4 w-4 text-green-600 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Network Synchronized</span>
                </div>
            </div>
        </div>
      </div>

      <div className="p-8 sm:p-16 flex flex-col justify-center">
        <div className="space-y-1 mb-10">
            <h1 className="text-3xl font-black font-headline tracking-tighter uppercase text-foreground leading-none">Onboarding</h1>
            <p className="text-sm text-muted-foreground font-medium">Map your personal registry nodes.</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid sm:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Given Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input placeholder="Rajesh" {...field} className="h-12 font-bold rounded-xl border-primary/10 focus:border-primary pl-11" />
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary opacity-40" />
                      </div>
                    </FormControl>
                    <FormMessage className="text-[10px] font-bold" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Surname</FormLabel>
                    <FormControl>
                      <Input placeholder="Kumar" {...field} className="h-12 font-bold rounded-xl border-primary/10 focus:border-primary" />
                    </FormControl>
                    <FormMessage className="text-[10px] font-bold" />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Registry Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                        <Input placeholder="rajesh.k@example.com" {...field} disabled className="h-12 font-bold opacity-50 bg-muted/20 rounded-xl pl-11" />
                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary opacity-40" />
                    </div>
                  </FormControl>
                  <FormMessage className="text-[10px] font-bold" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="mobileNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Mobile Node</Label>
                  <FormControl>
                    <div className="relative">
                        <Input placeholder="+91 12345 67890" {...field} className="h-12 font-bold rounded-xl border-primary/10 focus:border-primary pl-11" />
                        <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary opacity-40" />
                    </div>
                  </FormControl>
                  <FormMessage className="text-[10px] font-bold" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="userType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Statutory Role</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12 font-bold rounded-xl border-primary/10 focus:border-primary">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-xl glass">
                      <SelectItem value="citizen" className="font-bold">Citizen Node</SelectItem>
                      <SelectItem value="businessman" className="font-bold">Business / MSME</SelectItem>
                      <SelectItem value="student" className="font-bold">Law Student</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-[10px] font-bold" />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={loading} className="w-full h-16 font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-primary/20 active:scale-95 transition-all rounded-xl group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              {loading ? (
                  <span className="flex items-center gap-3">
                    <Loader2 className="h-5 w-5 animate-spin" /> SYNCHRONIZING NODE...
                  </span>
              ) : (
                  <span className="flex items-center gap-3">
                    <ShieldCheck className="h-5 w-5" /> ACTIVATE REGISTRY
                  </span>
              )}
            </Button>
          </form>
        </Form>
        <div className="mt-10 text-center opacity-30">
            <p className="text-[9px] font-black uppercase tracking-[0.5em] text-muted-foreground">NYAYASAHAYAK.IN // CALIBRATION NODE</p>
        </div>
      </div>
    </div>
  );
}
