
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { topics } from "./data";

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
              
              <Button asChild variant="secondary" className="w-full mt-auto justify-between">
                <Link href={`/dashboard/learn/${topic.slug}`}>
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
