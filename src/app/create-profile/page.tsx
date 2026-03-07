
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
import { Loader2, Scale } from "lucide-react";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError, type SecurityRuleContext } from "@/firebase/errors";
import { validateUserDetails } from "@/ai/flows/validate-user-details";

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
        title: "Error",
        description: "Authentication session expired. Please log in again.",
      });
      router.push("/login");
      return;
    }

    setLoading(true);

    try {
      const validation = await validateUserDetails({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        mobileNumber: data.mobileNumber,
        userType: data.userType,
      });

      if (!validation.isValid) {
        toast({
          variant: "destructive",
          title: "Validation failed",
          description: validation.reason || "The provided details appear to be invalid.",
        });
        setLoading(false);
        return;
      }

      const userProfile = {
        uid: auth.currentUser.uid,
        photoURL: auth.currentUser.photoURL || '',
        ...data,
        createdAt: serverTimestamp(),
      };
      
      const userDocRef = doc(firestore, "users", auth.currentUser.uid);

      setDoc(userDocRef, userProfile)
        .then(() => {
            set(ref(rtdb, `users/${auth.currentUser!.uid}`), {
                ...userProfile,
                createdAt: Date.now()
            }).catch(err => {
                console.warn("RTDB registry issue:", err.message);
            });

            toast({
                title: "Profile active",
                description: "Welcome to Nyaya Sahayak.",
            });
            router.push("/dashboard");
        })
        .catch(async (serverError) => {
            const permissionError = new FirestorePermissionError({
                path: userDocRef.path,
                operation: 'create',
                requestResourceData: userProfile,
            } satisfies SecurityRuleContext, serverError);
            errorEmitter.emit('permission-error', permissionError);
        })
        .finally(() => {
            setLoading(false);
        });

    } catch (error: any) {
        console.error("Validation error:", error);
        toast({ variant: "destructive", title: "Error", description: "Could not validate registration details." });
        setLoading(false);
    }
  };
  
  if (authLoading) {
      return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
          Let's customize your experience based on your role.
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
                    <FormLabel className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Last name</FormLabel>
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
                  <FormLabel className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Email address</FormLabel>
                  <FormControl>
                    <Input placeholder="rajesh.k@example.com" {...field} disabled className="h-11 font-bold opacity-50" />
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
                  <FormLabel className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Mobile number</FormLabel>
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
                  <FormLabel className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Select Platform Role</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-11 font-bold">
                        <SelectValue placeholder="Select your role" />
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
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Activate My Account"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
