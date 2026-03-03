
"use client";

import { useState, useEffect, use } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Phone, Video, ShieldCheck, Clock, Calendar as CalendarIcon, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { type Lawyer } from "@/lib/advocates-data";
import { Skeleton } from "@/components/ui/skeleton";
import { useDatabase } from "@/firebase";
import { ref, onValue } from "firebase/database";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

const timeSlots = [
    "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "02:00 PM", "02:30 PM", "03:00 PM"
];

export default function BookConsultationPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const rtdb = useDatabase();
  const { toast } = useToast();
  
  const [lawyer, setLawyer] = useState<Lawyer | undefined>();
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | undefined>();
  const [consultationType, setConsultationType] = useState("Video Call");
  
  useEffect(() => {
    const advocateRef = ref(rtdb, `advocates/${unwrappedParams.id}`);
    
    const unsubscribe = onValue(advocateRef, (snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val() as Lawyer;
            // SECURITY: Strict filter for public access
            if (data.isApproved) {
                setLawyer(data);
            } else {
                setLawyer(undefined);
            }
        }
        setLoading(false);
    });

    return () => unsubscribe();
  }, [unwrappedParams.id, rtdb]);

  const handleBook = () => {
      if (!selectedTime) {
          toast({ variant: "destructive", title: "Time Required", description: "Please select a consultation time slot." });
          return;
      }
      setBooking(true);
      setTimeout(() => {
          setBooking(false);
          toast({ title: "Booking Confirmed", description: `Consultation with ${lawyer?.name} scheduled for ${date?.toLocaleDateString()} at ${selectedTime}.` });
      }, 1500);
  };

  if (loading) {
    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-24 w-full rounded-2xl" />
            <Skeleton className="h-96 w-full rounded-2xl" />
        </div>
    )
  }

  if (!lawyer) {
    notFound();
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-12">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" className="rounded-xl font-bold hover:bg-primary/5" asChild>
            <Link href={`/dashboard/lawyer-connect/${lawyer.uid || lawyer.id}`}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Profile
            </Link>
        </Button>
      </div>
      
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="overflow-hidden border-primary/5 shadow-xl bg-card/40 backdrop-blur-md rounded-2xl">
            <CardContent className="p-6">
                <div className="flex items-center gap-6">
                    <Avatar className="h-20 w-20 border-2 border-background shadow-lg rounded-2xl">
                        {lawyer.image && <AvatarImage src={lawyer.image.imageUrl} alt={lawyer.name} className="object-cover" />}
                        <AvatarFallback className="font-black text-xl">{lawyer.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <h1 className="font-black text-2xl tracking-tighter truncate">{lawyer.name}</h1>
                            <ShieldCheck className="h-5 w-5 text-blue-500 shrink-0" />
                        </div>
                        <p className="text-sm font-bold text-primary tracking-tight">{lawyer.specialty}</p>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1 opacity-60">Verified Legal Pro</p>
                    </div>
                </div>
            </CardContent>
        </Card>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-6">
            <Card className="border-primary/5 shadow-xl rounded-2xl overflow-hidden">
                <CardHeader className="bg-muted/30 border-b border-primary/5 pb-4">
                    <CardTitle className="text-base font-black flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-primary" />
                        Select Date
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="p-3"
                    />
                </CardContent>
            </Card>

            <Card className="border-primary/5 shadow-xl rounded-2xl overflow-hidden">
                <CardHeader className="bg-muted/30 border-b border-primary/5 pb-4">
                    <CardTitle className="text-base font-black flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        Available Slots
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                    <div className="grid grid-cols-2 gap-2">
                        {timeSlots.map(time => (
                            <Button 
                                key={time} 
                                variant={selectedTime === time ? "default" : "outline"} 
                                onClick={() => setSelectedTime(time)}
                                className={cn(
                                    "h-10 font-bold text-xs rounded-xl transition-all active:scale-95 shadow-sm",
                                    selectedTime === time ? "shadow-primary/20" : "border-primary/5 hover:border-primary/20"
                                )}
                            >
                                {time}
                            </Button>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>

        <div className="space-y-6">
            <Card className="border-primary/5 shadow-xl rounded-2xl overflow-hidden">
                <CardHeader className="bg-muted/30 border-b border-primary/5 pb-4">
                    <CardTitle className="text-base font-black flex items-center gap-2">
                        <Video className="h-4 w-4 text-primary" />
                        Consultation Mode
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                    <RadioGroup value={consultationType} onValueChange={setConsultationType} className="grid grid-cols-1 gap-3">
                        <div className="relative">
                            <RadioGroupItem value="Video Call" id="video" className="peer sr-only" />
                            <Label htmlFor="video" className="flex items-center gap-3 rounded-xl border-2 border-primary/5 bg-background/50 p-4 hover:bg-primary/5 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 transition-all cursor-pointer">
                                <Video className="h-5 w-5 text-primary" />
                                <div className="flex-1">
                                    <p className="text-sm font-black tracking-tight leading-none">Video Call</p>
                                    <p className="text-[10px] font-bold text-muted-foreground mt-1">Direct via Nyaya Sahayak Secure Hub</p>
                                </div>
                            </Label>
                        </div>
                        <div className="relative">
                            <RadioGroupItem value="In-Person Meeting" id="in-person" className="peer sr-only" />
                            <Label htmlFor="in-person" className="flex items-center gap-3 rounded-xl border-2 border-primary/5 bg-background/50 p-4 hover:bg-primary/5 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 transition-all cursor-pointer">
                                <Phone className="h-5 w-5 text-primary" />
                                <div className="flex-1">
                                    <p className="text-sm font-black tracking-tight leading-none">Voice Call</p>
                                    <p className="text-[10px] font-bold text-muted-foreground mt-1">High-fidelity audio consultation</p>
                                </div>
                            </Label>
                        </div>
                    </RadioGroup>
                </CardContent>
            </Card>

            <Card className="border-primary/5 shadow-xl rounded-2xl overflow-hidden bg-primary/5">
                <CardHeader className="pb-4">
                    <CardTitle className="text-base font-black tracking-tight">Booking Summary</CardTitle>
                    <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Confidential Legal Session</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between items-center text-xs font-bold border-b border-primary/10 pb-2">
                        <span className="text-muted-foreground uppercase tracking-widest text-[9px]">Duration</span>
                        <span>30 Minutes</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-bold">
                        <span className="text-muted-foreground uppercase tracking-widest text-[9px]">Platform Fee</span>
                        <span className="text-green-600">Free Trial Session</span>
                    </div>
                    <Button 
                        className="w-full h-12 font-black text-sm shadow-xl shadow-primary/20 rounded-xl active:scale-95 transition-all mt-4" 
                        onClick={handleBook}
                        disabled={booking}
                    >
                        {booking ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Confirm Secure Booking <CheckCircle2 className="ml-2 h-4 w-4" /></>}
                    </Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
