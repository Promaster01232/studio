import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Mic,
  FileText,
  Upload,
  BarChart2,
  FilePlus2,
  Gavel,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const mainActions = [
  {
    href: "/dashboard/narrate",
    icon: Mic,
    title: "Speak Your Problem",
    description: "Tell us your issue in your own voice.",
    bgColor: "bg-red-100 dark:bg-red-900/30",
    iconColor: "text-red-600 dark:text-red-400",
  },
  {
    href: "/dashboard/narrate",
    icon: FileText,
    title: "Type Your Problem",
    description: "Write down the details of your legal problem.",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    href: "/dashboard/document-intelligence",
    icon: Upload,
    title: "Upload Document",
    description: "Scan a notice, FIR, or contract for AI analysis.",
    bgColor: "bg-green-100 dark:bg-green-900/30",
    iconColor: "text-green-600 dark:text-green-400",
  },
];

const quickButtons = [
    {
        href: "/dashboard/strength-analyzer",
        icon: BarChart2,
        title: "Check Case Strength",
        description: "Get an AI-based analysis of your case.",
    },
    {
        href: "/dashboard/document-generator",
        icon: FilePlus2,
        title: "Draft a Complaint",
        description: "Instantly create legal documents.",
    },
    {
        href: "/dashboard/lawyer-connect",
        icon: Gavel,
        title: "Find a Lawyer",
        description: "Connect with verified legal experts.",
    }
]

export default function DashboardHomePage() {
  return (
    <div>
      <section className="mb-12">
        <h2 className="text-2xl font-bold font-headline mb-4">How can we help you today?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mainActions.map((action) => (
            <Link href={action.href} key={action.title}>
              <Card className="h-full flex flex-col justify-center items-center text-center p-6 hover:shadow-lg hover:-translate-y-1 transition-all">
                <div
                  className={`mb-4 rounded-full p-4 ${action.bgColor}`}
                >
                  <action.icon className={`h-8 w-8 ${action.iconColor}`} />
                </div>
                <CardTitle className="font-semibold text-lg">{action.title}</CardTitle>
                <CardDescription className="mt-1">{action.description}</CardDescription>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold font-headline mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickButtons.map((button) => (
                 <Link href={button.href} key={button.title} className="block">
                    <Card className="group hover:bg-primary/5 transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-base font-medium font-headline">{button.title}</CardTitle>
                             <button.icon className="h-5 w-5 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">{button.description}</p>
                            <div className="flex items-center pt-2 text-sm font-semibold text-primary">
                                <span>Go to module</span>
                                <ArrowRight className="ml-2 h-4 w-4 transform transition-transform group-hover:translate-x-1" />
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            ))}
        </div>
      </section>
    </div>
  );
}
