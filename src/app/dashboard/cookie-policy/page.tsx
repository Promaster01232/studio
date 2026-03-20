"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Cookie, Shield, Activity, Settings } from "lucide-react";

export default function CookiePolicyPage() {
  const cookieTypes = [
    { name: "Essential Node Session", icon: Shield, desc: "Required for secure authentication registry and node persistence." },
    { name: "Forensic Performance", icon: Activity, desc: "Used to monitor system stability and AI node response times." },
    { name: "User Preferences", icon: Settings, desc: "Stores your dark mode and language preferences across browser sessions." }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <PageHeader
        title="Cookie Protocol"
        description="Transparency regarding local data nodes and tracking modules."
      />

      <Card className="border-primary/5 bg-primary/5 rounded-2xl p-8">
        <div className="flex items-center gap-4 mb-6">
          <Cookie className="h-8 w-8 text-primary animate-pulse" />
          <div>
            <h2 className="text-xl font-black tracking-tight">Institutional Transparency</h2>
            <p className="text-sm text-muted-foreground font-medium">We use minimalist tracking to ensure protocol integrity.</p>
          </div>
        </div>
        <div className="grid gap-4">
          {cookieTypes.map((type, i) => (
            <div key={i} className="bg-background/50 p-4 rounded-xl border border-primary/5 flex items-center gap-4">
              <type.icon className="h-5 w-5 text-primary/60 shrink-0" />
              <div className="space-y-0.5">
                <p className="font-bold text-sm">{type.name}</p>
                <p className="text-xs text-muted-foreground font-medium">{type.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="border-primary/5 shadow-md">
        <CardContent className="p-6">
          <h3 className="font-black text-lg mb-2">Protocol Management</h3>
          <p className="text-sm text-muted-foreground leading-relaxed font-medium">
            Users may revoke cookie consent via their browser security nodes at any time. Note that blocking Essential Session cookies will deactivate secure access to the Nyaya Sahayak dashboard.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
