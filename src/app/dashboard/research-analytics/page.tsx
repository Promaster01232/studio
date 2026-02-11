
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, BarChartHorizontal, FileText } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Progress } from "@/components/ui/progress";

const judge = {
    name: "Hon. Justice R. Sharma",
    avatar: PlaceHolderImages.find(img => img.id === 'lawyer4'), // Using a placeholder
    stats: {
        civil: 60,
        criminal: 40,
        decisionTime: "180 Days",
        bias: "Pro-Petitioner (Civil)",
    }
};

const newsFeed = [
    {
        id: 1,
        title: "Supreme Court Upholds Environmental Regulations in Landmark Case",
        source: "The Legal Times",
        date: "2h ago",
    },
    {
        id: 2,
        title: "High Court Issues New Guidelines for Digital Evidence",
        source: "Indian Law Journal",
        date: "1d ago",
    },
    {
        id: 3,
        title: "Plea Challenging Sedition Law Admitted in Supreme Court",
        source: "Bar & Bench",
        date: "3d ago",
    },
    {
        id: 4,
        title: "New Consumer Protection Rules Notified, E-Commerce to be Impacted",
        source: "Live Law",
        date: "4d ago",
    }
];

export default function ResearchAnalyticsPage() {
    return (
        <div className="space-y-8">
            <PageHeader
                title="Research & Analytics"
                description="Access judicial analytics and stay updated with legal news."
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <Card>
                    <CardHeader>
                        <CardTitle>Judicial Analytics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search Judge by Name or Court" className="pl-10" />
                        </div>
                        <Card className="bg-background">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-4">
                                    {judge.avatar && (
                                        <Avatar className="h-14 w-14 border">
                                            <AvatarImage src={judge.avatar.imageUrl} alt={judge.name} data-ai-hint={judge.avatar.imageHint || ''}/>
                                            <AvatarFallback>{judge.name.split(' ').pop()?.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                    )}
                                    <div className="flex-1">
                                        <p className="font-semibold">{judge.name}</p>
                                        <p className="text-sm text-muted-foreground">Supreme Court</p>
                                    </div>
                                    <BarChartHorizontal className="h-6 w-6 text-primary" />
                                </div>
                                <div className="mt-4 space-y-3 text-sm">
                                    <div>
                                        <div className="flex justify-between mb-1">
                                            <span className="font-medium text-muted-foreground">Case Type Distribution</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <Progress value={judge.stats.civil} className="h-2" />
                                            <span className="text-xs font-semibold whitespace-nowrap">{judge.stats.civil}% Civil / {judge.stats.criminal}% Criminal</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center pt-2">
                                        <span className="text-muted-foreground">Avg. Decision Time:</span>
                                        <span className="font-semibold">{judge.stats.decisionTime}</span>
                                    </div>
                                     <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground">Identified Bias:</span>
                                        <span className="font-semibold">{judge.stats.bias}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Legal News Feed</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {newsFeed.map((item) => (
                                <div key={item.id} className="flex items-start gap-4 border-b pb-4 last:border-b-0 last:pb-0">
                                    <div className="bg-muted p-3 rounded-lg mt-1">
                                        <FileText className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold leading-snug hover:text-primary cursor-pointer">{item.title}</p>
                                        <p className="text-xs text-muted-foreground mt-1">{item.source} &bull; {item.date}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
