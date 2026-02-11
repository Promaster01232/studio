import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { guides } from "./data";

export default function PoliceGuidePage() {
  return (
    <div>
      <PageHeader
        title="Police & Court Guides"
        description="Your comprehensive guide to navigating police and court procedures."
      />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {guides.map((guide, index) => (
          <Link key={index} href={`/dashboard/police-guide/${guide.slug}`} className="block group">
             <Card className={cn(
                "h-full flex flex-col justify-between transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-1 border-transparent text-primary-foreground overflow-hidden",
                guide.gradient 
            )}>
                <div className="p-6 pb-0 flex-grow">
                    <div className="bg-white/20 p-3 rounded-lg w-fit">
                        <guide.icon className="h-7 w-7" />
                    </div>
                    <h3 className="text-xl font-bold mt-4 font-headline">{guide.title}</h3>
                    <p className="opacity-80 mt-2 text-sm">{guide.description}</p>
                </div>
                <div className="p-6 pt-2">
                     <div className={cn("mt-4 flex items-center font-semibold text-sm bg-white/20 rounded-full px-4 py-2 w-fit group-hover:bg-white/30 transition-colors", guide.gradient.includes("text-black") && "bg-black/10 group-hover:bg-black/20")}>
                        <span>Explore</span>
                        <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </div>
                </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
