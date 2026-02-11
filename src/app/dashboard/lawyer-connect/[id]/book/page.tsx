"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Phone, Video } from "lucide-react";
import Link from "next/link";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { notFound } from "next/navigation";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

// Mock data, same as in lawyer-connect/[id]/page.tsx
const lawyers = [
    {
      id: 1,
      name: "Anjali Sharma",
      specialty: "Family Law",
      rating: 4.8,
      reviews: 1903,
      image: PlaceHolderImages.find(img => img.id === 'lawyer2'),
      about: "Anjali Sharma is a dedicated family law attorney with over 10 years of experience. She specializes in divorce, child custody, and adoption cases, providing compassionate and expert legal counsel to her clients. Anjali is committed to achieving the best possible outcomes for the families she represents.",
      experience: "Throughout her career, Anjali has successfully handled hundreds of complex family law cases. She is a skilled negotiator and a formidable presence in the courtroom. Her expertise also includes mediation and collaborative law, offering clients alternative dispute resolution options.",
      contact: {
        phone: "+91 98765 43210",
        email: "anjali.sharma@example.com"
      }
    },
    {
      id: 2,
      name: "Siddharth Rao",
      specialty: "Cyber Law",
      rating: 4.8,
      reviews: 1500,
      image: PlaceHolderImages.find(img => img.id === 'lawyer1'),
      about: "Siddharth Rao is a leading expert in cyber law and data privacy. He advises startups and multinational corporations on navigating the complexities of technology-related legal issues. He has a passion for digital rights and is a frequent speaker at tech law conferences.",
      experience: "With a background in software engineering, Siddharth brings a unique technical perspective to his legal practice. He has been instrumental in shaping data protection policies for several large tech companies and has a proven track record in handling high-stakes cybercrime litigation.",
      contact: {
        phone: "+91 98765 11111",
        email: "siddharth.rao@example.com"
      }
    },
    {
      id: 3,
      name: "Priya Singh",
      specialty: "Civil Law",
      rating: 5.0,
      reviews: 893,
      image: PlaceHolderImages.find(img => img.id === 'lawyer5'),
      about: "Priya Singh is a highly-rated civil litigation lawyer known for her meticulous preparation and client-focused approach. She handles a wide range of civil disputes, including property matters, contract breaches, and tort claims.",
      experience: "Priya has an impressive record of securing favorable settlements and court verdicts for her clients. She is praised for her ability to simplify complex legal arguments and for her unwavering commitment to justice.",
       contact: {
        phone: "+91 98765 22222",
        email: "priya.singh@example.com"
      }
    },
    {
      id: 4,
      name: "Rajesh Kumar",
      specialty: "Crypto Law",
      rating: 4.7,
      reviews: 1354,
      image: PlaceHolderImages.find(img => img.id === 'lawyer3'),
      about: "Rajesh Kumar is at the forefront of the evolving field of cryptocurrency and blockchain law. He assists clients with regulatory compliance, ICOs, and disputes related to digital assets.",
      experience: "As one of the early legal experts in the crypto space in India, Rajesh has a deep understanding of the technology and its legal implications. He has helped numerous blockchain startups launch successfully while navigating the uncertain regulatory landscape.",
      contact: {
        phone: "+91 98765 33333",
        email: "rajesh.kumar@example.com"
      }
    },
    {
      id: 5,
      name: "Sunita Reddy",
      specialty: "Real Estate",
      rating: 4.9,
      reviews: 1101,
      image: PlaceHolderImages.find(img => img.id === 'lawyer2'),
      about: "Sunita Reddy is a specialist in real estate law, handling everything from residential transactions to large-scale commercial development projects. Her clients value her sharp negotiation skills and attention to detail.",
      experience: "Sunita has over 15 years of experience in real estate law. She has a comprehensive understanding of property regulations, zoning laws, and title issues, ensuring smooth and secure transactions for her clients.",
      contact: {
        phone: "+91 98765 44444",
        email: "sunita.reddy@example.com"
      }
    },
    {
      id: 6,
      name: "Amit Verma",
      specialty: "Corporate Law",
      rating: 4.6,
      reviews: 750,
      image: PlaceHolderImages.find(img => img.id === 'lawyer6'),
      about: "Amit Verma provides strategic legal advice to businesses of all sizes. His practice focuses on corporate governance, mergers & acquisitions, and commercial contracts.",
      experience: "Amit has worked with both domestic and international clients, helping them structure deals and manage corporate legal risks. He is known for his business-oriented approach to legal problem-solving.",
      contact: {
        phone: "+91 98765 55555",
        email: "amit.verma@example.com"
      }
    },
];

const timeSlots = [
    "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "02:00 PM", "02:30 PM", "03:00 PM"
];

export default function BookConsultationPage({ params }: { params: { id: string } }) {
  const lawyer = lawyers.find(l => l.id.toString() === params.id);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | undefined>();
  const [consultationType, setConsultationType] = useState("Video Call");
  
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
            <div className="grid grid-cols-3 gap-2 mt-4">
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
