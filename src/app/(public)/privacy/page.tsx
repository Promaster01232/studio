
"use client";

import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto py-20 px-6 text-left selection:bg-primary/20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-12"
      >
        {/* Header Section */}
        <div className="space-y-8">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tighter text-white font-headline">
            Privacy Policy
          </h1>
          
          <div className="space-y-2 text-sm sm:text-base font-bold text-white/60 uppercase tracking-widest">
            <p>Effective Date: <span className="text-primary">04-02-2023</span></p>
            <p>Last Updated: <span className="text-primary">09-02-2026</span></p>
          </div>

          <div className="space-y-6 text-lg text-white/80 font-medium leading-relaxed max-w-3xl">
            <p>
              Nyaya Sahayak (&ldquo;Nyaya Sahayak&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, store, and protect your information when you access or use our website, applications, dashboards, and services (collectively, the &ldquo;Platform&rdquo;).
            </p>
            <p>
              By using Nyaya Sahayak, you agree to the collection and use of information in accordance with this Privacy Policy.
            </p>
          </div>
        </div>

        <Separator className="bg-white/10" />

        {/* Content Sections */}
        <div className="space-y-16 pt-4">
          <section className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">1. Information we collect</h2>
            <p className="text-white/60 leading-relaxed font-medium">We collect information to provide, operate, improve, and secure the Platform.</p>
            
            <div className="space-y-8 pl-4 border-l-2 border-primary/20">
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-white">1.1 Information you provide directly</h3>
                <ul className="list-disc pl-5 space-y-2 text-white/60 font-medium text-sm sm:text-base">
                  <li>Email address (for account creation, login, and communication)</li>
                  <li>Name or profile details (if provided)</li>
                  <li>Documents, text, or files uploaded by you</li>
                  <li>Chat messages, prompts, and responses</li>
                  <li>Feedback, support requests, or communications with us</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-bold text-white">1.2 Information collected automatically</h3>
                <ul className="list-disc pl-5 space-y-2 text-white/60 font-medium text-sm sm:text-base">
                  <li>IP address</li>
                  <li>Device type, browser type, and operating system</li>
                  <li>Usage data such as pages visited, features used, time spent, and interactions</li>
                  <li>Session identifiers and authentication metadata</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">2. How we use your information</h2>
            <ul className="list-disc pl-5 space-y-3 text-white/60 font-medium text-sm sm:text-base">
              <li>To provide and operate Nyaya Sahayak services</li>
              <li>To authenticate users and manage accounts</li>
              <li>To enable AI-powered legal information features</li>
              <li>To process documents, OCR, and file analysis</li>
              <li>To manage usage limits, credits, and subscriptions</li>
              <li>To communicate service updates, security notices, or support messages</li>
              <li>To detect and prevent misuse, fraud, or security issues</li>
              <li>To comply with legal and regulatory obligations</li>
            </ul>
            <p className="font-bold text-primary italic">We do not sell your personal data.</p>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">3. AI processing & user content</h2>
            <div className="space-y-4 text-white/60 font-medium text-sm sm:text-base leading-relaxed">
              <p>Nyaya Sahayak uses AI systems to generate responses and analyze uploaded content.</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Chat messages and uploaded documents are processed to provide responses and features.</li>
                <li>Your content is not used to create a lawyer-client relationship.</li>
                <li>We do not use your private documents or chats for public disclosure.</li>
                <li>You remain the owner of your uploaded content.</li>
              </ul>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">4. Data security</h2>
            <p className="text-white/60 font-medium text-sm sm:text-base leading-relaxed">
              We implement reasonable technical and organizational measures to protect your data, including secure authentication mechanisms and encrypted data transmission. However, no system is completely secure. While we strive to protect your data, we cannot guarantee absolute security.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">5. Contact us</h2>
            <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 space-y-4">
              <p className="text-white/80 font-medium">If you have questions, concerns, or requests regarding this Privacy Policy or your data, please contact us at:</p>
              <div className="flex flex-col gap-2">
                <a href="mailto:nyayasahayakhelp@gmail.com" className="text-xl font-black text-primary hover:underline transition-all">nyayasahayakhelp@gmail.com</a>
                <Link href="/contact" className="text-sm font-bold text-white/40 hover:text-white uppercase tracking-widest transition-colors">Visit contact page</Link>
              </div>
            </div>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
