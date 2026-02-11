import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import {
  Shield,
  Gavel,
  Users,
  FileText,
  Search,
  FileStack,
  FileUp,
  Briefcase,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const guides = [
  {
    title: "FIR & Complaints",
    description: "Step-by-step guide to filing a First Information Report.",
    icon: Shield,
    gradient: "bg-gradient-to-br from-cyan-400 to-teal-600",
    href: "#"
  },
  {
    title: "Arrest & Bail Process",
    description: "Your rights and procedures during arrest and applying for bail.",
    icon: Gavel,
    gradient: "bg-gradient-to-br from-orange-400 to-amber-600",
    href: "#"
  },
  {
    title: "Courtroom Decorum",
    description: "Rules of conduct and etiquette inside the courtroom.",
    icon: Users,
    gradient: "bg-gradient-to-br from-rose-400 to-pink-600",
    href: "#"
  },
  {
    title: "Courtroom Warrants",
    description: "Understanding legal documents and warrants inside the court.",
    icon: FileText,
    gradient: "bg-gradient-to-br from-purple-400 to-violet-600",
    href: "#"
  },
  {
    title: "Evidence Guidelines",
    description: "Guidelines for presenting digital and physical evidence.",
    icon: Search,
    gradient: "bg-gradient-to-br from-yellow-300 to-lime-500 text-black",
    href: "#"
  },
  {
    title: "Summons & Warrants",
    description: "Understanding the difference and procedures for summons and warrants.",
    icon: FileStack,
    gradient: "bg-gradient-to-br from-sky-400 to-blue-600",
    href: "#"
  },
  {
    title: "Evidence Submission",
    description: "Guidelines for presenting and submitting evidence correctly in court.",
    icon: FileUp,
    gradient: "bg-gradient-to-br from-emerald-400 to-green-600",
    href: "#"
  },
  {
    title: "Public Prosecutor Role",
    description: "Understanding the role and responsibilities of the state's lawyer.",
    icon: Briefcase,
    gradient: "bg-gradient-to-br from-indigo-400 to-fuchsia-500",
    href: "#"
  }
];


export default function PoliceGuidePage() {
  return (
    <div>
      <PageHeader
        title="Police & Court Guides"
        description="Your comprehensive guide to navigating police and court procedures."
      />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {guides.map((guide, index) => (
          <Link key={index} href={guide.href} className="block group">
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
