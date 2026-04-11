
"use client";

import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function TermsPage() {
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
            Terms of service
          </h1>
          
          <div className="space-y-2 text-sm sm:text-base font-bold text-white/60 uppercase tracking-widest">
            <p>Effective date: <span className="text-primary">04-02-2023</span></p>
            <p>Last updated: <span className="text-primary">09-02-2026</span></p>
          </div>

          <div className="space-y-6 text-lg text-white/80 font-medium leading-relaxed max-w-3xl">
            <p>
              Welcome to Nyaya Sahayak (accessible at nyayasahayak.in). These Terms of service (&ldquo;Terms&rdquo;) govern your access to and use of the Nyaya Sahayak website, applications, dashboards, and related services (collectively, the &ldquo;Platform&rdquo;).
            </p>
            <p>
              By accessing or using Nyaya Sahayak, you confirm that you have read, understood, and agreed to be bound by these Terms. If you do not agree, you must not use the Platform.
            </p>
          </div>
        </div>

        <Separator className="bg-white/10" />

        {/* Content Sections */}
        <div className="space-y-16 pt-4">
          <section className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">1. About Nyaya Sahayak</h2>
            <div className="space-y-4 text-white/60 font-medium text-sm sm:text-base leading-relaxed">
              <p>Nyaya Sahayak is an AI-powered legal information platform designed to help users understand Indian laws, legal procedures, and general legal concepts. The Platform provides general legal information only and does not provide legal advice.</p>
              <p>Nyaya Sahayak is not a law firm, does not provide professional legal services, and does not replace consultation with a qualified advocate.</p>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">2. Acceptance and eligibility</h2>
            <div className="space-y-4 text-white/60 font-medium text-sm sm:text-base leading-relaxed">
              <p>By using Nyaya Sahayak, you represent that:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>You are at least 18 years old, or using the Platform under supervision of a legal guardian.</li>
                <li>You have the legal capacity to enter into these Terms.</li>
                <li>You will use the Platform only for lawful purposes.</li>
              </ul>
              <p>We reserve the right to refuse or suspend access to anyone at our discretion.</p>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">3. Scope of services</h2>
            <div className="space-y-4 text-white/60 font-medium text-sm sm:text-base leading-relaxed">
              <p>Nyaya Sahayak provides, among other features:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>AI-powered legal information chat based on Indian law</li>
                <li>Document upload, storage, and analysis (PDF, DOC, DOCX, etc.)</li>
                <li>OCR for scanned documents</li>
                <li>Chat history, notes, collections, and organizational tools</li>
                <li>Free and paid subscription plans with usage limits</li>
              </ul>
              <p>Features may vary by plan and may be modified, added, or removed at any time.</p>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">4. No legal advice & no lawyer–client relationship</h2>
            <div className="p-8 rounded-[2rem] bg-destructive/5 border border-destructive/10 space-y-4">
              <p className="font-black text-destructive uppercase tracking-widest text-sm">Important disclaimer:</p>
              <ul className="list-disc pl-5 space-y-3 text-white/60 font-medium text-sm sm:text-base">
                <li>Information provided by Nyaya Sahayak is general legal information, not legal advice.</li>
                <li>No lawyer–client relationship is created between you and Nyaya Sahayak, its founders, developers, or any contributors.</li>
                <li>AI-generated responses may be incomplete, outdated, or inaccurate.</li>
                <li>You must consult a qualified advocate for advice specific to your situation.</li>
                <li>Reliance on any information provided by Nyaya Sahayak is entirely at your own risk.</li>
              </ul>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">5. User accounts & authentication</h2>
            <p className="text-white/60 font-medium text-sm sm:text-base leading-relaxed">
              To access certain features, you may be required to create an account. You agree to provide accurate information, maintain the confidentiality of your credentials, and take responsibility for all activity under your account.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">6. User content & uploaded materials</h2>
            <div className="space-y-4 text-white/60 font-medium text-sm sm:text-base leading-relaxed">
              <p>You retain ownership of documents, text, and files you upload (&ldquo;User Content&rdquo;). By uploading, you grant Nyaya Sahayak a limited license to store and process such content solely to provide services to you.</p>
              <p>You confirm that you have the legal right to upload the content and that it does not violate any third-party rights.</p>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">7. Free and paid plans</h2>
            <p className="text-white/60 font-medium text-sm sm:text-base leading-relaxed">
              Nyaya Sahayak operates on a freemium model. Paid plans unlock additional features and higher limits. Fees are billed in advance and are non-refundable except where required by law.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">8. Prohibited uses</h2>
            <p className="text-white/60 font-medium text-sm sm:text-base leading-relaxed">
              You agree not to use Nyaya Sahayak for unlawful purposes, reverse-engineer AI systems, or upload malicious code. Violations may result in immediate termination of access.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">9. Intellectual property</h2>
            <p className="text-white/60 font-medium text-sm sm:text-base leading-relaxed">
              All platform content, including UI, branding, and AI prompts, is the intellectual property of Nyaya Sahayak. You may not reproduce or exploit any part of the Platform without prior written consent.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">16. Governing law & jurisdiction</h2>
            <div className="space-y-4 text-white/60 font-medium text-sm sm:text-base leading-relaxed">
              <p>These Terms shall be governed by the laws of India.</p>
              <p>Any disputes shall be subject to the exclusive jurisdiction of courts at <span className="text-foreground font-bold">Jaipur, Rajasthan</span>, unless otherwise required by law.</p>
            </div>
          </section>

          <section className="space-y-6 pb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">18. Contact information</h2>
            <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 space-y-4">
              <p className="text-white/80 font-medium">For questions or statutory notices, contact us at:</p>
              <div className="flex flex-col gap-2">
                <a href="mailto:nyayasahayakhelp@gmail.com" className="text-2xl font-black text-primary hover:underline transition-all">nyayasahayakhelp@gmail.com</a>
                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Nyaya Sahayak // Legal Registry</p>
              </div>
            </div>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
