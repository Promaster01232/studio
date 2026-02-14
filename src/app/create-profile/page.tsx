"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useFirestore } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";
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
        // This handles the case where the provider is ready but there is no user
        if (typeof window !== 'undefined') {
            router.replace('/login');
        }
    }
  }, [auth.currentUser, form, router]);

  if (authLoading) {
      return (
        <Card className="w-full max-w-lg">
            <CardHeader>
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2"><Skeleton className="h-6 w-24" /><Skeleton className="h-10 w-full" /></div>
                    <div className="space-y-2"><Skeleton className="h-6 w-24" /><Skeleton className="h-10 w-full" /></div>
                </div>
                <div className="space-y-2"><Skeleton className="h-6 w-24" /><Skeleton className="h-10 w-full" /></div>
                <div className="space-y-2"><Skeleton className="h-6 w-24" /><Skeleton className="h-10 w-full" /></div>
                <Skeleton className="h-10 w-full" />
            </CardContent>
        </Card>
      );
  }

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
      const userProfile = {
        uid: auth.currentUser.uid,
        ...data,
      };

      await setDoc(doc(firestore, "users", auth.currentUser.uid), userProfile);

      toast({
        title: "Profile Created!",
        description: "Welcome to Nyaya Sahayak.",
      });
      
      if (data.userType === 'lawyer') {
          toast({
              title: "Next Step: Advocate Profile",
              description: "Please complete your advocate profile to be listed.",
          });
          router.push("/dashboard/advocate-profile");
      } else {
          router.push("/dashboard");
      }
    } catch (error) {
      console.error("Failed to create profile:", error);
      toast({
        variant: "destructive",
        title: "Profile Creation Failed",
        description: "Could not save your profile. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Create Your Profile</CardTitle>
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
                    <FormLabel>First Name</FormLabel>
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
                    <FormLabel>Last Name</FormLabel>
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
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="rajesh.k@example.com" {...field} />
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
                  <FormLabel>Mobile Number</FormLabel>
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="citizen">Citizen</SelectItem>
                      <SelectItem value="lawyer">Advocate</SelectItem>
                      <SelectItem value="businessman">Business Person</SelectItem>
                      <SelectItem value="student">Law Student</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? <Loader2 className="animate-spin" /> : "Save Profile & Continue"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
