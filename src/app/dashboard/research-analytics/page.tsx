
"use client";

import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Share2, Bookmark } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useToast } from "@/hooks/use-toast";

const newsFeed = [
    {
        id: 1,
        author: "The Legal Times",
        authorAvatar: PlaceHolderImages.find(img => img.id === 'lawyer4'),
        date: "2h ago",
        title: "Supreme Court Upholds Environmental Regulations in Landmark Case",
        content: "In a significant ruling, the Supreme Court has upheld stringent environmental regulations, emphasizing the state's duty to protect natural resources over industrial interests. The verdict is expected to have wide-ranging implications for ongoing and future infrastructure projects.",
        image: PlaceHolderImages.find(img => img.id === 'news1'),
        likes: 125,
        comments: 12,
    },
    {
        id: 2,
        author: "Indian Law Journal",
        authorAvatar: PlaceHolderImages.find(img => img.id === 'lawyer5'),
        date: "1d ago",
        title: "High Court Issues New Guidelines for Digital Evidence",
        content: "The High Court has issued a comprehensive set of guidelines for the collection, preservation, and presentation of digital evidence in court. The move aims to standardize procedures and prevent tampering with electronic records, a growing concern in criminal and civil litigation.",
        image: PlaceHolderImages.find(img => img.id === 'news2'),
        likes: 340,
        comments: 45,
    },
    {
        id: 3,
        author: "Bar & Bench",
        authorAvatar: PlaceHolderImages.find(img => img.id === 'lawyer1'),
        date: "3d ago",
        title: "Plea Challenging Sedition Law Admitted in Supreme Court",
        content: "The Supreme Court has agreed to hear a fresh plea challenging the constitutional validity of the sedition law. The petitioners argue that the law is a colonial-era relic used to stifle dissent and free speech, and have called for its complete repeal.",
        image: PlaceHolderImages.find(img => img.id === 'news3'),
        likes: 890,
        comments: 152,
    },
    {
        id: 4,
        author: "Live Law",
        authorAvatar: PlaceHolderImages.find(img => img.id === 'lawyer2'),
        date: "4d ago",
        title: "New Consumer Protection Rules Notified, E-Commerce to be Impacted",
        content: "The government has notified new rules under the Consumer Protection Act, which will significantly impact e-commerce platforms. The rules introduce stricter norms for flash sales, and enhance liability for sellers, aiming to better protect online shoppers.",
        image: PlaceHolderImages.find(img => img.id === 'news4'),
        likes: 412,
        comments: 68,
    }
];

export default function ResearchAnalyticsPage() {
    const { toast } = useToast();

    const handleAction = (action: string) => {
        toast({
            title: `Post ${action.toLowerCase()}ed!`,
            description: "This is for demonstration purposes.",
        });
    };

    return (
        <div className="space-y-8">
            <PageHeader
                title="Legal News & Updates"
                description="Stay informed with the latest legal news and notifications."
            />

            <div className="max-w-3xl mx-auto space-y-6">
                {newsFeed.map((item) => (
                    <Card key={item.id} className="overflow-hidden">
                        <CardContent className="p-0">
                            <div className="p-4 sm:p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    {item.authorAvatar && (
                                        <Avatar className="h-10 w-10 border hover:ring-2 hover:ring-primary transition-all">
                                            <AvatarImage src={item.authorAvatar.imageUrl} alt={item.author} data-ai-hint={item.authorAvatar.imageHint || ''}/>
                                            <AvatarFallback>{item.author.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                    )}
                                    <div>
                                        <p className="font-semibold">{item.author}</p>
                                        <p className="text-xs text-muted-foreground">{item.date}</p>
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold font-headline leading-snug mb-2">{item.title}</h3>
                                <p className="text-muted-foreground text-sm">{item.content}</p>
                            </div>
                            
                            {item.image && (
                                <div className="relative aspect-video">
                                     <Image
                                        src={item.image.imageUrl}
                                        alt={item.title}
                                        fill
                                        className="object-cover"
                                        data-ai-hint={item.image.imageHint}
                                    />
                                </div>
                            )}
                        </CardContent>
                        <CardFooter className="p-2 sm:p-3 flex justify-between items-center">
                           <div className="flex gap-1">
                                <Button variant="ghost" size="sm" className="flex items-center gap-2" onClick={() => handleAction('Like')}>
                                    <Heart className="h-4 w-4" />
                                    <span className="text-xs text-muted-foreground">{item.likes}</span>
                                </Button>
                                <Button variant="ghost" size="sm" className="flex items-center gap-2" onClick={() => handleAction('Comment')}>
                                    <MessageCircle className="h-4 w-4" />
                                    <span className="text-xs text-muted-foreground">{item.comments}</span>
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleAction('Share')}>
                                    <Share2 className="h-4 w-4" />
                                </Button>
                           </div>
                           <Button variant="ghost" size="sm" onClick={() => handleAction('Bookmark')}>
                                <Bookmark className="h-4 w-4" />
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
