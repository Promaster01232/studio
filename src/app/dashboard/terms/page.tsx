"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, UserCheck, AlertTriangle, Scale } from "lucide-react";

export default function TermsPage() {
  const protocols = [
    {
      label: "User Eligibility",
      icon: UserCheck,
      desc: "Registry enrollment is limited to authentic individuals and verified businesses. Fraudulent identity patterns will trigger automatic forensic deactivation."
    },
    {
      label: "AI Limitation Disclosure",
      icon: AlertTriangle,
      desc: "AI-generated summaries and assessments are for informational intelligence only. They do not constitute official legal advice from a qualified human advocate."
    },
    {
      label: "Service Usage",
      icon: Scale,
      desc: "Users agree to utilize the dashboard modules strictly for legal purposes. Harassment or system registry abuse results in immediate revocation of access nodes."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <PageHeader
        title="Terms of Service"
        description="Official usage protocols for the Nyaya Sahayak digital node."
      />

      <Card className="border-primary/5 shadow-xl rounded-2xl overflow-hidden bg-card">
        <CardContent className="p-0">
          <div className="bg-primary/5 p-6 border-b border-primary/5 flex items-center gap-3">
            <FileText className="h-5 w-5 text-primary" />
            <h3 className="font-black text-lg tracking-tight">System Access Agreement</h3>
          </div>
          <div className="p-8 space-y-8">
            {protocols.map((p, i) => (
              <div key={i} className="flex gap-6 group">
                <div className="bg-muted p-3 h-12 w-12 rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <p.icon className="h-5 w-5" />
                </div>
                <div className="space-y-1 flex-1">
                  <h4 className="font-bold text-base">{p.label}</h4>
                  <p className="text-sm text-muted-foreground font-medium leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
          Agreement version: v2.4.0-Forensic // Last Node Update: March 2024
        </p>
      </div>
    </div>
  );
}
