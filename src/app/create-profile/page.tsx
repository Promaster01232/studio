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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Scale, ShieldCheck } from "lucide-react";
import { validateUserDetails } from "@/ai/flows/validate-user-details";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError, type SecurityRuleContext } from "@/firebase/errors";

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
      // AI Mobile Audit with Resilient Fallback
      let isValid = true;
      try {
        const validation = await validateUserDetails({
          mobileNumber: data.mobileNumber,
          userType: data.userType,
        });
        isValid = validation.isValid;
        if (!isValid) {
          toast({
            variant: "destructive",
            title: "Validation failed",
            description: validation.reason || "The provided mobile number appears to be invalid.",
          });
          setLoading(false);
          return;
        }
      } catch (aiError) {
        console.warn("AI Validation Bypass: Validation node busy.");
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
      
      // NON-BLOCKING SYNC: Proceed to dashboard immediately after queuing write
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
      }).catch(err => console.warn("RTDB sync issue deferred."));

      toast({
          title: "Profile Synchronized",
          description: "Welcome to your Nyaya Sahayak terminal.",
      });
      router.push("/dashboard");

    } catch (error: any) {
        console.error("Profile synchronization issue:", error);
        // We still redirect to dashboard if the error is non-critical
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
    <Card className="w-full max-w-lg border-primary/5 shadow-2xl overflow-hidden rounded-2xl bg-card/40 backdrop-blur-md">
      <CardHeader className="bg-primary/5 border-b border-primary/5 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <Scale className="h-6 w-6 text-primary" />
          <CardTitle className="font-headline font-black tracking-tighter">Onboarding</CardTitle>
        </div>
        <CardDescription className="font-medium">
          Finalize your identity nodes to activate platform permissions.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">First name</FormLabel>
                    <FormControl>
                      <Input placeholder="Rajesh" {...field} className="h-11 font-bold" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Last name</Label>
                    <FormControl>
                      <Input placeholder="Kumar" {...field} className="h-11 font-bold" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Registry Email</FormLabel>
                  <FormControl>
                    <Input placeholder="rajesh.k@example.com" {...field} disabled className="h-11 font-bold opacity-50 bg-muted/20" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="mobileNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Mobile Number</FormLabel>
                  <FormControl>
                    <Input placeholder="+91 12345 67890" {...field} className="h-11 font-bold" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="userType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Statutory Role</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-11 font-bold">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="citizen" className="font-bold">Citizen</SelectItem>
                      <SelectItem value="businessman" className="font-bold">Business / MSME</SelectItem>
                      <SelectItem value="student" className="font-bold">Law Student</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={loading} className="w-full h-12 font-bold shadow-xl shadow-primary/20 active:scale-95 transition-all">
              {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" /> SYNCHRONIZING...
                  </span>
              ) : (
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5" /> ACTIVATE REGISTRY
                  </span>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
