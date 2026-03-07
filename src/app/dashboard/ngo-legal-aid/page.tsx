
"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Users, Scale, MessageSquare } from "lucide-react";
import Link from "next/link";

const ngos = [
  {
    name: "Lok Adhikar Sewa Kendra",
    category: "Legal Aid for All",
    description: "Provides free legal assistance to communities. Connect for help with family law, labor disputes, and more.",
    icon: Shield,
  },
  {
    name: "Nyay Jyoti Foundation",
    category: "Women's Rights",
    description: "Dedicated to assisting with women's rights. Offers support for family law and legal empowerment.",
    icon: Users,
  },
  {
    name: "Plea Sathi Foundation",
    category: "Women's & Child Litigation",
    description: "Dedicated to protecting PILs and rights of children. Offers support in cases of public welfare.",
    icon: Scale,
  },
];

export default function NgoLegalAidPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="NGO & Legal Aid"
        description="Connect with organizations and legal aid providers offering free support."
      />
      
      <div className="space-y-4">
        {ngos.map((ngo, index) => (
          <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardContent className="p-4 sm:p-6">
                <div className="flex gap-4 items-start sm:items-center">
                    <div className="bg-primary/10 p-3 rounded-lg mt-1 sm:mt-0">
                        <ngo.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold font-headline">{ngo.name}</h3>
                        <p className="text-sm text-primary font-medium">{ngo.category}</p>
                        <p className="text-muted-foreground mt-2 text-sm">{ngo.description}</p>
                         <Link href="#" className="text-sm font-semibold text-primary hover:underline mt-2 inline-block">
                            Learn More
                        </Link>
                    </div>
                </div>
            </CardContent>
          </Card>
        ))}

        <Card className="overflow-hidden hover:shadow-lg transition-shadow bg-primary/5 border-primary/10">
             <CardContent className="p-4 sm:p-6">
                <div className="flex gap-4 items-start sm:items-center">
                    <div className="bg-primary/10 p-3 rounded-lg mt-1 sm:mt-0">
                        <MessageSquare className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold font-headline">Need Urgent Assistance?</h3>
                        <p className="text-sm text-primary font-medium">Free Legal Consultation</p>
                        <p className="text-muted-foreground mt-2 text-sm">Our AI assistant can help guide you through the process of connecting with these organizations.</p>
                        <Button asChild className="mt-4 w-full sm:w-auto">
                            <Link href="/dashboard/support">Contact Support</Link>
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
