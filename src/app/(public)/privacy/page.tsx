"use client";

import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-6 text-left selection:bg-primary/20">
      <div className="space-y-8 text-left">
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tighter text-foreground font-headline uppercase leading-none">
            Privacy Policy
          </h1>
          <div className="space-y-1 text-sm font-bold text-muted-foreground uppercase tracking-widest">
            <p>Effective Date: <span className="text-primary">12/04/2026</span></p>
            <p>Last Updated: <span className="text-primary">12/04/2026</span></p>
          </div>
        </div>

        <div className="space-y-6 text-lg text-foreground/80 font-medium leading-relaxed max-w-3xl">
          <p>
            Nyaya Sahayak ("Nyaya Sahayak", "We", "Our", Or "Us") Is Committed To Protecting Your Privacy. This Privacy Policy Explains How We Collect, Use, Store, And Protect Your Information When You Access Or Use Our Website At <Link href="https://nyayasahayak.in" className="text-primary font-bold hover:underline">https://nyayasahayak.in</Link>, Applications, Dashboards, And Services (Collectively, The "Platform").
          </p>
          <p>
            By Using Nyaya Sahayak, You Agree To The Collection And Use Of Information In Accordance With This Privacy Policy.
          </p>
        </div>
      </div>

      <Separator className="bg-border/10 my-10" />

      <div className="space-y-12 text-left">
        <section className="space-y-4">
          <h2 className="text-2xl font-black text-foreground tracking-tight uppercase">1. Information We Collect</h2>
          <p className="text-muted-foreground leading-relaxed font-medium">We Collect Information To Provide, Operate, Improve, And Secure The Platform At <Link href="https://nyayasahayak.in" className="text-primary hover:underline">https://nyayasahayak.in</Link>.</p>
          <div className="pl-4 border-l-2 border-primary/20 space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-foreground">1.1 Information You Provide Directly</h3>
              <ul className="list-disc pl-5 space-y-2 text-muted-foreground font-medium text-sm">
                <li>Email Address (For Account Creation, Login, And Communication)</li>
                <li>Name Or Profile Details (If Provided)</li>
                <li>Documents, Text, Or Files Uploaded By You</li>
                <li>Chat Messages, Prompts, And Responses</li>
                <li>Feedback, Support Requests, Or Communications With Us</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-black text-foreground tracking-tight uppercase">2. How We Use Your Information</h2>
          <ul className="list-disc pl-5 space-y-3 text-muted-foreground font-medium text-sm">
            <li>To Provide And Operate Nyaya Sahayak Services At <Link href="https://nyayasahayak.in" className="text-primary hover:underline">https://nyayasahayak.in</Link></li>
            <li>To Authenticate Users And Manage Accounts</li>
            <li>To Enable AI-Powered Legal Information Features</li>
            <li>To Process Documents, OCR, And File Analysis</li>
            <li>To Manage Usage Limits, Credits, And Subscriptions</li>
            <li>To Detect And Prevent Misuse, Fraud, Or Security Issues</li>
          </ul>
          <p className="font-black text-primary uppercase text-sm tracking-widest">We Do Not Sell Your Personal Data.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-black text-foreground tracking-tight uppercase">3. AI Processing & User Content</h2>
          <div className="space-y-4 text-muted-foreground font-medium text-sm leading-relaxed">
            <p>Nyaya Sahayak Uses AI Systems To Generate Responses And Analyze Uploaded Content At <Link href="https://nyayasahayak.in" className="text-primary hover:underline">https://nyayasahayak.in</Link>.</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Chat Messages And Uploaded Documents Are Processed To Provide Responses.</li>
              <li>Your Content Is Not Used To Create A Lawyer-Client Relationship.</li>
              <li>You Remain The Owner Of Your Uploaded Content.</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-black text-foreground tracking-tight uppercase">4. Data Security</h2>
          <p className="text-muted-foreground font-medium text-sm leading-relaxed">
            We Implement Technical And Organizational Measures To Protect Your Data At <Link href="https://nyayasahayak.in" className="text-primary hover:underline">https://nyayasahayak.in</Link>, Including Secure Authentication Mechanisms And Encrypted Data Transmission Via TLS 1.3.
          </p>
        </section>

        <section className="space-y-6 pb-10">
          <h2 className="text-2xl font-black text-foreground tracking-tight uppercase">5. Contact Us</h2>
          <div className="p-8 rounded-[2rem] bg-muted/20 border border-border/10 space-y-4 text-left">
            <p className="text-foreground/80 font-medium">If You Have Questions Regarding This Privacy Policy Or Your Data, Please Contact Us At:</p>
            <div className="flex flex-col gap-2">
              <a href="mailto:nyayasahayakhelp@gmail.com" className="text-xl font-black text-primary hover:underline transition-all lowercase">nyayasahayakhelp@gmail.com</a>
              <Link href="/contact" className="text-xs font-bold text-muted-foreground/40 hover:text-foreground uppercase tracking-widest transition-colors">Visit Contact Page</Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}