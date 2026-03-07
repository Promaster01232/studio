
"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Lightbulb, Loader2, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ContactUsPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = () => {
    if (!name || !email || !subject || !message) {
      toast({
        variant: "destructive",
        title: "Incomplete Form",
        description: "Please fill out all the fields before sending.",
      });
      return;
    }

    setLoading(true);
    
    // Simulate API delay before opening mailto
    setTimeout(() => {
        const mailtoLink = `mailto:enterspaceindia@gmail.com?subject=${encodeURIComponent(
          subject
        )}&body=${encodeURIComponent(
          `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
        )}`;
        window.location.href = mailtoLink;

        toast({
          title: "Thank You for Your Feedback!",
          description: "Your message has been prepared in your email client.",
        });

        // Clear the form
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
        setLoading(false);
    }, 1200);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      <PageHeader
        title="Contact Us"
        description="We'd love to hear from you. Get in touch with our team for support or feedback."
      />
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="border-primary/5 shadow-xl rounded-2xl overflow-hidden bg-card/40 backdrop-blur-md">
          <CardHeader className="bg-primary/5 border-b border-primary/5">
            <CardTitle className="font-headline font-black text-xl tracking-tight">Send us a Message</CardTitle>
            <CardDescription className="font-medium text-xs">
              Have a question or feedback? Fill out the form below.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-8">
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2 text-left">
                  <Label htmlFor="name" className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Name</Label>
                  <Input id="name" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} className="h-11 font-bold" />
                </div>
                <div className="space-y-2 text-left">
                  <Label htmlFor="email" className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Email</Label>
                  <Input id="email" type="email" placeholder="Your Email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-11 font-bold" />
                </div>
              </div>
              <div className="space-y-2 text-left">
                <Label htmlFor="subject" className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Subject</Label>
                <Input id="subject" placeholder="Message Subject" value={subject} onChange={(e) => setSubject(e.target.value)} className="h-11 font-bold" />
              </div>
              <div className="space-y-2 text-left">
                <Label htmlFor="message" className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Message</Label>
                <Textarea id="message" placeholder="Your message..." rows={5} value={message} onChange={(e) => setMessage(e.target.value)} className="font-medium text-sm resize-none" />
              </div>
              <Button type="button" className="w-full h-12 font-bold shadow-lg shadow-primary/20 active:scale-95 transition-all mt-2" onClick={handleSendMessage} disabled={loading}>
                {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                Send Message
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-primary/5 shadow-xl rounded-2xl overflow-hidden bg-card/40 backdrop-blur-md">
          <CardHeader className="bg-primary/5 border-b border-primary/5">
            <CardTitle className="font-headline font-black text-xl tracking-tight">Contact Information</CardTitle>
            <CardDescription className="font-medium text-xs">
              Direct channels for urgent assistance.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 pt-8">
            <div className="flex items-start gap-5 group">
              <div className="bg-primary/10 p-4 rounded-2xl group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <Mail className="h-6 w-6 text-primary group-hover:text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-black text-sm uppercase tracking-widest text-primary mb-1">Email Support</h3>
                <p className="font-bold text-lg tracking-tight">enterspaceindia@gmail.com</p>
              </div>
            </div>
             <div className="flex items-start gap-5 group">
              <div className="bg-primary/10 p-4 rounded-2xl group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <Phone className="h-6 w-6 text-primary group-hover:text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-black text-sm uppercase tracking-widest text-primary mb-1">Phone Helpline</h3>
                <p className="font-bold text-lg tracking-tight">+91 123 456 7890</p>
              </div>
            </div>
             <div className="flex items-start gap-5 group">
              <div className="bg-primary/10 p-4 rounded-2xl group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <MapPin className="h-6 w-6 text-primary group-hover:text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-black text-sm uppercase tracking-widest text-primary mb-1">Office Address</h3>
                <p className="font-medium text-muted-foreground leading-relaxed">123 Legal Lane, Justice City,<br />110001, New Delhi, India</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

       <div className="text-center pt-12">
        <Link href="https://ideasparkweb.com" target="_blank" rel="noopener noreferrer" className="inline-block group">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2 group-hover:text-primary transition-colors">
              Designed & Developed by
            </p>
            <div className="flex items-center justify-center gap-2 transition-transform group-hover:scale-105 duration-300">
                <Lightbulb className="h-7 w-7 text-primary fill-primary/10" />
                <h2 className="text-2xl font-black font-headline text-primary tracking-tighter">
                    IdeaSpark
                </h2>
            </div>
        </Link>
      </div>
    </div>
  );
}
