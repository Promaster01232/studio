"use client";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PrivacyDashboardPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 pb-20 px-4 text-left selection:bg-primary/20">
      <div className="space-y-8">
        <div className="flex items-center justify-between border-b border-white/5 pb-6">
          <Button variant="ghost" size="sm" className="rounded-xl font-bold hover:bg-white/5 group h-10 px-6 border border-white/5 text-white text-[10px] uppercase tracking-widest" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" /> Back to Dashboard
            </Link>
          </Button>
        </div>

        <div className="space-y-6 pt-4">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tighter text-white font-headline uppercase leading-none">
            Privacy Policy
          </h1>
          
          <div className="space-y-1 text-sm font-bold text-white/60 uppercase tracking-widest">
            <p>Effective Date: <span className="text-primary">12/04/2026</span></p>
            <p>Last Updated: <span className="text-primary">12/04/2026</span></p>
          </div>

          <div className="space-y-6 text-lg text-white/80 font-medium leading-relaxed max-w-3xl">
            <p>
              Nyaya Sahayak (&ldquo;Nyaya Sahayak&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, store, and protect your information when you access or use our website at <Link href="https://nyayasahayak.in" className="text-primary font-bold hover:underline">https://nyayasahayak.in</Link>, applications, dashboards, and services (collectively, the &ldquo;Platform&rdquo;).
            </p>
            <p>
              By using Nyaya Sahayak, you agree to the collection and use of information in accordance with this Privacy Policy.
            </p>
          </div>
        </div>

        <Separator className="bg-white/10 my-10" />

        <div className="space-y-12 pt-4">
          <section className="space-y-4">
            <h2 className="text-2xl font-black text-white tracking-tight uppercase">1. Information We Collect</h2>
            <p className="text-white/60 leading-relaxed font-medium">We collect information to provide, operate, improve, and secure the Platform at <Link href="https://nyayasahayak.in" className="text-primary hover:underline">https://nyayasahayak.in</Link>.</p>
            
            <div className="pl-4 border-l-2 border-primary/20 space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white">1.1 Information You Provide Directly</h3>
                <ul className="list-disc pl-5 space-y-2 text-white/60 font-medium text-sm">
                  <li>Email address (for account creation, login, and communication)</li>
                  <li>Name or profile details (if provided)</li>
                  <li>Documents, text, or files uploaded by you</li>
                  <li>Chat messages, prompts, and responses</li>
                  <li>Feedback, support requests, or communications with us</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-white tracking-tight uppercase">2. How We Use Your Information</h2>
            <ul className="list-disc pl-5 space-y-3 text-white/60 font-medium text-sm">
              <li>To provide and operate Nyaya Sahayak services at <Link href="https://nyayasahayak.in" className="text-primary hover:underline">https://nyayasahayak.in</Link></li>
              <li>To authenticate users and manage accounts</li>
              <li>To enable AI-powered legal information features</li>
              <li>To process documents, OCR, and file analysis</li>
              <li>To manage usage limits, credits, and subscriptions</li>
              <li>To improve accuracy, performance, and reliability of the Platform</li>
            </ul>
            <p className="font-black text-primary uppercase text-sm tracking-widest">We Do Not Sell Your Personal Data.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-white tracking-tight uppercase">3. AI Processing & User Content</h2>
            <div className="space-y-4 text-white/60 font-medium text-sm leading-relaxed">
              <p>Nyaya Sahayak uses AI systems to generate responses and analyze uploaded content at <Link href="https://nyayasahayak.in" className="text-primary hover:underline">https://nyayasahayak.in</Link>.</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Chat messages and uploaded documents are processed to provide responses and features.</li>
                <li>Your content is not used to create a lawyer-client relationship.</li>
                <li>You remain the owner of your uploaded content.</li>
              </ul>
            </div>
          </section>

          <section className="space-y-6 pb-10">
            <h2 className="text-2xl font-black text-white tracking-tight uppercase">4. Contact Us</h2>
            <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 space-y-4">
              <p className="text-white/80 font-medium">For statutory inquiries regarding your data principal rights, please contact our fiduciary desk:</p>
              <div className="flex flex-col gap-2">
                <a href="mailto:nyayasahayakhelp@gmail.com" className="text-2xl font-black text-primary hover:underline transition-all lowercase">nyayasahayakhelp@gmail.com</a>
                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Nyaya Sahayak // Privacy Protocol</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}