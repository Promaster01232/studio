
"use client";

import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Mail, Phone, MapPin, Lightbulb } from "lucide-react";

export default function ContactUsPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      <PageHeader
        title="Contact Us"
        description="We'd love to hear from you. Get in touch with our team for support or feedback."
      />
      
      <Card className="border-primary/5 shadow-xl rounded-2xl overflow-hidden bg-card/40 backdrop-blur-md">
        <CardHeader className="bg-primary/5 border-b border-primary/5">
          <CardTitle className="font-headline font-black text-xl tracking-tight">Contact Information</CardTitle>
          <CardDescription className="font-medium text-xs">
            Direct channels for urgent assistance.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 pt-8 text-left">
          <div className="flex items-start gap-5 group">
            <div className="bg-primary/10 p-4 rounded-2xl group-hover:bg-primary group-hover:text-white transition-all duration-300">
              <Mail className="h-6 w-6 text-primary group-hover:text-white" />
            </div>
            <div className="text-left">
              <h3 className="font-black text-sm uppercase tracking-widest text-primary mb-1">Email Support</h3>
              <p className="font-bold text-lg tracking-tight">nyayasahayakhelp@gmail.com</p>
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
