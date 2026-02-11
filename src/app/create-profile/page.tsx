
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
  userType: z.enum(["citizen", "lawyer"], {
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

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      userType: "citizen",
    },
  });

  useEffect(() => {
    if (auth?.currentUser) {
      const displayName = auth.currentUser.displayName || "";
      const email = auth.currentUser.email || "";
      form.reset({
        firstName: displayName.split(" ")[0] || "",
        lastName: displayName.split(" ").slice(1).join(" ") || "",
        email: email,
        userType: "citizen",
      });
    }
  }, [auth, form]);
  
  // This is to handle the case where auth is still loading
  if (auth === null) {
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
                <div className="space-y-2"><Skeleton className="h-6 w-24" /><Skeleton className="h-10 w-full" /></div>
                <Skeleton className="h-10 w-full" />
            </CardContent>
        </Card>
      );
  }

  // If auth has loaded but there is no user, redirect to login
  if (!auth) {
      if (typeof window !== 'undefined') {
          router.replace('/login');
      }
      return null;
  }

  const onSubmit = async (data: ProfileFormValues) => {
    if (!auth?.currentUser || !firestore) {
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
        phoneNumber: auth.currentUser.phoneNumber,
        ...data,
      };

      await setDoc(doc(firestore, "users", auth.currentUser.uid), userProfile);

      toast({
        title: "Profile Created!",
        description: "Welcome to Nyaay Sathi.",
      });
      router.push("/dashboard");
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
            <div className="space-y-2">
                <FormLabel>Phone Number</FormLabel>
                <Input type="tel" value={auth.currentUser?.phoneNumber || ""} disabled />
            </div>

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
                      <SelectItem value="lawyer">Lawyer</SelectItem>
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
