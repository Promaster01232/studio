"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Scale, ShieldCheck, Cpu, Globe } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <PageHeader
        title="Institutional Node"
        description="Learn about the mission and technology behind the Nyaya Sahayak legal ecosystem."
      />

      <div className="grid gap-6 sm:grid-cols-2">
        <Card className="border-primary/5 bg-primary/5">
          <CardContent className="p-6 space-y-4">
            <div className="bg-primary/10 p-3 rounded-xl w-fit">
              <Cpu className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-black tracking-tight">AI Forensic Core</h3>
            <p className="text-sm text-muted-foreground leading-relaxed font-medium">
              We leverage advanced LLM nodes to provide real-time legal document intelligence and case strength assessment with mathematical precision.
            </p>
          </CardContent>
        </Card>
        <Card className="border-primary/5 bg-accent/5">
          <CardContent className="p-6 space-y-4">
            <div className="bg-accent/10 p-3 rounded-xl w-fit">
              <Globe className="h-6 w-6 text-accent" />
            </div>
            <h3 className="text-lg font-black tracking-tight">Global Accessibility</h3>
            <p className="text-sm text-muted-foreground leading-relaxed font-medium">
              Our mission is to democratize legal information across multiple languages, ensuring every citizen has a digital roadmap to justice.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-primary/5 shadow-xl rounded-2xl overflow-hidden bg-card">
        <CardContent className="p-8 sm:p-12 space-y-6">
          <div className="flex items-center gap-2 text-primary">
            <Scale className="h-5 w-5" />
            <span className="text-[10px] font-black uppercase tracking-widest">Our Mandate</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tighter">The Pinnacle of Digital Justice</h2>
          <div className="prose dark:prose-invert prose-sm max-w-none text-muted-foreground font-medium leading-relaxed space-y-4">
            <p>
              Nyaya Sahayak is not just an application; it is a specialized institutional node designed to bridge the gap between complex legal protocols and everyday citizen needs. By integrating forensic AI verification with a verified registry of professionals, we create a ecosystem of trust and clarity.
            </p>
            <p>
              Founded on the principles of transparency and technological empowerment, we believe that justice should be predictable, accessible, and efficient. Every tool in our dashboard is a module in a larger machine aimed at reducing legal friction for individuals and businesses alike.
            </p>
          </div>
          <div className="pt-6 border-t border-primary/5 flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-green-600" />
            <span className="text-xs font-bold">Verified Institutional Entity</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
