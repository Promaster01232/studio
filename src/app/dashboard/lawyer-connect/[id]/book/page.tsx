
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Phone, Video } from "lucide-react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { getAdvocates, type Lawyer } from "@/lib/advocates-data";
import { Skeleton } from "@/components/ui/skeleton";

const timeSlots = [
    "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "02:00 PM", "02:30 PM", "03:00 PM"
];

export default function BookConsultationPage() {
  const params = useParams<{ id: string }>();
  const [lawyer, setLawyer] = useState<Lawyer | undefined>();
  const [loading, setLoading] = useState(true);

  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | undefined>();
  const [consultationType, setConsultationType] = useState("Video Call");
  
  useEffect(() => {
    const advocates = getAdvocates();
    const foundLawyer = advocates.find(l => l.id.toString() === params.id);
    setLawyer(foundLawyer);
    setLoading(false);
  }, [params.id]);

  if (loading) {
    return (
        <div className="space-y-6">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-96 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-12 w-full" />
        </div>
    )
  }

  if (!lawyer) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
            <Link href={`/dashboard/lawyer-connect/${lawyer.id}`}>
                <ArrowLeft />
                <span className="sr-only">Back</span>
            </Link>
        </Button>
        <h1 className="text-xl font-semibold">Book Consultation</h1>
      </div>
      
      <Card>
        <CardContent className="p-4">
            <div className="flex items-center gap-4">
                {lawyer.image && (
                    <Avatar className="h-16 w-16 border">
                        <AvatarImage src={lawyer.image.imageUrl} alt={lawyer.name} data-ai-hint={lawyer.image.imageHint} />
                        <AvatarFallback>{lawyer.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                )}
                <div className="flex-1">
                    <p className="font-bold text-lg">{lawyer.name}</p>
                    <p className="text-sm text-muted-foreground">{lawyer.specialty}</p>
                    <p className="text-sm font-bold">{lawyer.rating}</p>
                </div>
                <div className="flex gap-2">
                    <Button size="icon" variant="outline">
                        <Phone />
                    </Button>
                     <Button size="icon">
                        <Video />
                    </Button>
                </div>
            </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle className="text-lg">Select Date & Time</CardTitle>
        </CardHeader>
        <CardContent>
            <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="p-0 rounded-md"
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4">
                {timeSlots.map(time => (
                    <Button key={time} variant={selectedTime === time ? "default" : "outline"} onClick={() => setSelectedTime(time)}>
                        {time}
                    </Button>
                ))}
            </div>
        </CardContent>
      </Card>

      <Card>
          <CardHeader>
              <CardTitle className="text-lg">Consultation Type</CardTitle>
          </CardHeader>
          <CardContent>
              <RadioGroup value={consultationType} onValueChange={setConsultationType} className="grid grid-cols-2 gap-4">
                  <div>
                    <RadioGroupItem value="Video Call" id="video" className="peer sr-only" />
                    <Label htmlFor="video" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                        Video Call
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="In-Person Meeting" id="in-person" className="peer sr-only" />
                    <Label htmlFor="in-person" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                        In-Person Meeting
                    </Label>
                  </div>
              </RadioGroup>
          </CardContent>
      </Card>

      <Card>
          <CardHeader>
              <CardTitle className="text-lg">Duration</CardTitle>
          </CardHeader>
          <CardContent>
             <p className="text-muted-foreground">30 minutes</p>
          </CardContent>
      </Card>

      <Button className="w-full" size="lg">Confirm Booking</Button>

    </div>
  );
}
