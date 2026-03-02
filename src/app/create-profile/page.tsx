"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useFirestore, useDatabase } from "@/firebase";
import { doc, setDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { ref, set, update } from "firebase/database";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AdvocateProfileForm } from "@/components/advocate-profile-form";
import { validateUserDetails } from "@/ai/flows/validate-user-details";

const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  mobileNumber: z.string().min(10, "A valid mobile number is required."),
  userType: z.enum(["citizen", "lawyer", "businessman", "student"], {
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
  const [showAdvocateDialog, setShowAdvocateDialog] = useState(false);
  const [pendingUserData, setPendingUserData] = useState<ProfileFormValues | null>(null);


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

  const handleAdvocateProfileSaved = async () => {
    if (!pendingUserData || !auth.currentUser) return;
    
    setLoading(true);
    const userProfile = {
      uid: auth.currentUser.uid,
      photoURL: auth.currentUser.photoURL || '',
      ...pendingUserData,
      createdAt: serverTimestamp(),
    };
    
    const userDocRef = doc(firestore, "users", auth.currentUser.uid);

    try {
        await setDoc(userDocRef, userProfile);
        
        // Save to RTDB with error handling to prevent PERMISSION_DENIED crash
        set(ref(rtdb, `users/${auth.currentUser.uid}`), {
            ...userProfile,
            createdAt: Date.now()
        }).catch(err => {
            console.warn("RTDB sync skipped. Profile saved to Firestore successfully.", err);
        });
        
        setShowAdvocateDialog(false);
        toast({
          title: "Registration complete",
          description: "Welcome to the Nyaya Sahayak community.",
        });
        router.push("/dashboard/lawyer-connect");
    } catch (serverError: any) {
        const permissionError = new FirestorePermissionError({
          path: userDocRef.path,
          operation: 'create',
          requestResourceData: userProfile,
        }, serverError);
        errorEmitter.emit('permission-error', permissionError);
    } finally {
        setLoading(false);
    }
  };

  const handleSkipAdvocate = async () => {
    if (!pendingUserData || !auth.currentUser) return;
    
    setLoading(true);
    // Mandatory categorization: Skip means Citizen
    const userProfile = {
      uid: auth.currentUser.uid,
      photoURL: auth.currentUser.photoURL || '',
      ...pendingUserData,
      userType: 'citizen' as const, // Force to citizen as they skipped documentation
      createdAt: serverTimestamp(),
    };
    
    const userDocRef = doc(firestore, "users", auth.currentUser.uid);

    try {
        await setDoc(userDocRef, userProfile);
        
        // Parallel sync to RTDB
        set(ref(rtdb, `users/${auth.currentUser.uid}`), {
            ...userProfile,
            createdAt: Date.now()
        }).catch(e => {});

        setShowAdvocateDialog(false);
        toast({
          title: "Profile created",
          description: "Registered as Citizen. You can complete advocate verification later.",
        });
        router.push("/dashboard");
    } catch (err) {
        console.error("Failed to save skipped profile:", err);
    } finally {
        setLoading(false);
    }
  };

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
      // AI Validation
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
          description: validation.reason || "The provided details appear to be invalid. Please provide genuine information.",
        });
        setLoading(false);
        return;
      }

      if (data.userType === 'lawyer') {
          setPendingUserData(data);
          setShowAdvocateDialog(true);
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

      await setDoc(userDocRef, userProfile);
      
      // Parallel sync to RTDB with silent error handling
      set(ref(rtdb, `users/${auth.currentUser.uid}`), {
          ...userProfile,
          createdAt: Date.now()
      }).catch(err => {
          console.warn("RTDB sync issue:", err.message);
      });

      toast({
        title: "Profile created",
        description: "Welcome to Nyaya Sahayak.",
      });
      router.push("/dashboard");
    } catch (serverError: any) {
        if (serverError instanceof Error && !('context' in serverError)) {
            // Not a FirestorePermissionError, handle normally
            console.error("Profile creation error:", serverError);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to create profile. Please try again.",
            });
        } else {
            // Standard error handled by emitter elsewhere if needed, 
            // but for simplicity here we just re-emit if it's our specific error
            errorEmitter.emit('permission-error', serverError);
        }
    } finally {
        setLoading(false);
    }
  };
  
  if (authLoading) {
      return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      );
  }

  return (
    <>
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Create your profile</CardTitle>
          <CardDescription>
            Welcome! Just a few more details to get you started.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First name</FormLabel>
                      <FormControl>
                        <Input placeholder="Rajesh" {...field} />
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
                      <FormLabel>Last name</FormLabel>
                      <FormControl>
                        <Input placeholder="Kumar" {...field} />
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
                    <FormLabel>Email address</FormLabel>
                    <FormControl>
                      <Input placeholder="rajesh.k@example.com" {...field} disabled />
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
                    <FormLabel>Mobile number</FormLabel>
                    <FormControl>
                      <Input placeholder="+91 12345 67890" {...field} />
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
                    <FormLabel>I am a...</FormLabel>
                    <Select onValueChange={(val) => {
                        field.onChange(val);
                    }} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="citizen">Citizen</SelectItem>
                        <SelectItem value="lawyer">Advocate</SelectItem>
                        <SelectItem value="businessman">Business person</SelectItem>
                        <SelectItem value="student">Law student</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? <Loader2 className="animate-spin" /> : (form.watch('userType') === 'lawyer' ? "Complete advocate setup" : "Save profile & continue")}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Dialog open={showAdvocateDialog} onOpenChange={(open) => {
          setShowAdvocateDialog(open);
          if (!open && pendingUserData) {
              handleSkipAdvocate();
          }
      }}>
          <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                    <DialogTitle>Complete advocate profile</DialogTitle>
                    <DialogDescription>Provide your professional details to be listed on Lawyer Connect. If you skip, you will be categorized as a Citizen.</DialogDescription>
              </DialogHeader>
              <AdvocateProfileForm 
                onSave={handleAdvocateProfileSaved}
                onSkip={handleSkipAdvocate}
                userProfile={{
                    firstName: pendingUserData?.firstName || form.getValues('firstName'),
                    lastName: pendingUserData?.lastName || form.getValues('lastName'),
                    email: pendingUserData?.email || form.getValues('email'),
                    photoURL: auth.currentUser?.photoURL || ''
                }}
              />
          </DialogContent>
      </Dialog>
    </>
  );
}
