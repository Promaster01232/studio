import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BookOpen, ShoppingCart, Factory, Shield, Home, Users, ArrowRight, Car } from "lucide-react";

const topics = [
  {
    title: "Fundamental Rights",
    description: "Understand the basic rights guaranteed to every citizen by the Constitution of India.",
    icon: BookOpen,
    href: "#",
  },
  {
    title: "Consumer Rights",
    description: "Learn about your rights as a consumer and how to file complaints against faulty products or services.",
    icon: ShoppingCart,
    href: "#",
  },
  {
    title: "Labour Laws",
    description: "Know your rights as an employee, including wages, working hours, and conditions of service.",
    icon: Factory,
    href: "#",
  },
  {
    title: "Motor Vehicle Laws",
    description: "Understand traffic rules, your rights during traffic stops, and procedures for accidents and insurance claims.",
    icon: Car,
    href: "#",
  },
  {
    title: "Cyber Crime",
    description: "Learn how to protect yourself from online fraud, harassment, and other cyber crimes.",
    icon: Shield,
    href: "#",
  },
  {
    title: "Family Law",
    description: "Information on marriage, divorce, child custody, and adoption laws in India.",
    icon: Users,
    href: "#",
  },
];


export default function LearnPage() {
  return (
    <div>
      <PageHeader
        title="Legal Knowledge Hub"
        description="Learn your rights and stay informed through our curated articles and guides."
      />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {topics.map((topic, index) => (
          <Card key={index} className="flex flex-col group overflow-hidden transition-shadow hover:shadow-xl">
            <CardContent className="p-6 flex flex-col flex-grow">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <topic.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold font-headline">{topic.title}</h3>
              </div>
              <p className="text-muted-foreground text-sm flex-grow mb-6">{topic.description}</p>
              
              <Button asChild variant="secondary" className="w-full mt-auto">
                <Link href={topic.href} className="justify-between">
                  <span>Learn More</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
