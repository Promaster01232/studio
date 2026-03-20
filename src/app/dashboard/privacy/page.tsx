"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldAlert, Lock, EyeOff, Key } from "lucide-react";

export default function PrivacyPage() {
  const sections = [
    {
      title: "Data Encryption Protocol",
      icon: Lock,
      content: "All user narration and documents are processed via TLS 1.3 encryption nodes. Your legal data is encrypted at rest using AES-256 standards within our institutional registry."
    },
    {
      title: "Forensic Identity Protection",
      icon: EyeOff,
      content: "We utilize AI-driven forensic audits to verify account authenticity. Personal identifiers are strictly galled and only shared with verified professionals upon your explicit consent."
    },
    {
      title: "Consent & Deletion",
      icon: Key,
      content: "Users maintain absolute sovereignty over their data. Permanent deletion nodes are available in the profile hub, ensuring all associated records are purged from the system registry instantly."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <PageHeader
        title="Privacy Protocol"
        description="Review our institutional commitment to data sovereignty and forensic security."
      />

      <div className="space-y-6">
        {sections.map((section, index) => (
          <Card key={index} className="border-primary/5 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6 flex items-start gap-5">
              <div className="bg-primary/10 p-3 rounded-2xl shrink-0">
                <section.icon className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="font-black text-lg tracking-tight">{section.title}</h3>
                <p className="text-sm text-muted-foreground font-medium leading-relaxed">{section.content}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-red-500/10 bg-red-500/5 rounded-2xl">
        <CardContent className="p-6 flex items-center gap-4">
          <ShieldAlert className="h-6 w-6 text-red-600 shrink-0" />
          <p className="text-xs font-bold text-red-600/80 leading-relaxed uppercase tracking-wider">
            Critical Note: Nyaya Sahayak nodes do not sell user data to third-party entities. All forensic analysis is performed locally within the secure application sandbox.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
