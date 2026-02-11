"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Users, Scale } from "lucide-react";
import Link from "next/link";

const ngos = [
  {
    name: "Lok Adhikar Sewa Kendra",
    category: "Legal Aid for All",
    description: "Provides free legal assistance to communities. Connect with lawyers for family law, labor disputes, and more.",
    icon: Shield,
  },
  {
    name: "Nyay Jyoti Foundation",
    category: "Women's Rights",
    description: "Dedicated to assisting with women's rights. Offers support for family law, and more.",
    icon: Users,
  },
  {
    name: "Plea Sathi Foundation",
    category: "Women's & Child Litigation",
    description: "Dedicated to protecting PILs and rights of children. Offers support in cases of domestic violence, constitutional rights, and public welfare.",
    icon: Scale,
  },
];

const GavelIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      {...props}
    >
      <path d="m14 13-5 5-5-5 5-5 5 5Z"/>
      <path d="m16 16 6 6"/>
      <path d="m3 21 6-6"/>
      <path d="m21 3-6 6"/>
      <path d="M11.5 2.5 2.5 11.5"/>
      <path d="M13 14 5 6"/>
    </svg>
);


export default function NgoLegalAidPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="NGO & Legal Aid"
        description="Connect with NGOs and legal aid providers."
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

        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
             <CardContent className="p-4 sm:p-6">
                <div className="flex gap-4 items-start sm:items-center">
                    <div className="bg-primary/10 p-3 rounded-lg mt-1 sm:mt-0">
                        <GavelIcon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold font-headline">Connect with an NGO</h3>
                        <p className="text-sm text-primary font-medium">Legal Advice</p>
                        <p className="text-muted-foreground mt-2 text-sm">Find a legal aid lawyer to assist you with your case, free of cost.</p>
                        <Button asChild className="mt-4 w-full sm:w-auto">
                            <Link href="/dashboard/lawyer-connect">Find a Legal Aid Lawyer</Link>
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
