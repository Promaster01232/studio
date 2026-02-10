import Image from "next/image";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Phone, Star, Video } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const lawyers = [
  {
    id: 1,
    name: "Adv. Rajesh Sharma",
    specialty: "Criminal Law",
    location: "Delhi",
    experience: 12,
    rating: 4.8,
    languages: ["Hindi", "English"],
    fee: "₹2000 for 30 min",
    image: PlaceHolderImages.find(img => img.id === 'lawyer1')
  },
  {
    id: 2,
    name: "Adv. Priya Singh",
    specialty: "Family Law",
    location: "Mumbai",
    experience: 8,
    rating: 4.9,
    languages: ["Marathi", "English"],
    fee: "₹1500 for 30 min",
    image: PlaceHolderImages.find(img => img.id === 'lawyer2')
  },
  {
    id: 3,
    name: "Adv. Anand Verma",
    specialty: "Corporate Law",
    location: "Bengaluru",
    experience: 15,
    rating: 4.7,
    languages: ["English", "Kannada"],
    fee: "₹3000 for 30 min",
    image: PlaceHolderImages.find(img => img.id === 'lawyer3')
  },
    {
    id: 4,
    name: "Adv. Sunita Patel",
    specialty: "Property Law",
    location: "Ahmedabad",
    experience: 10,
    rating: 4.8,
    languages: ["Gujarati", "Hindi", "English"],
    fee: "₹1800 for 30 min",
    image: PlaceHolderImages.find(img => img.id === 'lawyer5')
  },
  {
    id: 5,
    name: "Adv. Michael D'souza",
    specialty: "Consumer Law",
    location: "Goa",
    experience: 7,
    rating: 4.6,
    languages: ["English", "Konkani"],
    fee: "₹1200 for 30 min",
    image: PlaceHolderImages.find(img => img.id === 'lawyer6')
  },
  {
    id: 6,
    name: "Adv. G.K. Reddy",
    specialty: "Civil Law",
    location: "Hyderabad",
    experience: 20,
    rating: 4.9,
    languages: ["Telugu", "English"],
    fee: "₹2500 for 30 min",
    image: PlaceHolderImages.find(img => img.id === 'lawyer4')
  },
];

export default function LawyerConnectPage() {
  return (
    <div>
      <PageHeader
        title="Find the Right Advocate"
        description="Connect with verified lawyers based on your needs and preferences."
      />
      <Card className="mb-8">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input placeholder="Search by name or location..." className="md:col-span-2" />
            <Select>
              <SelectTrigger><SelectValue placeholder="Filter by practice area" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="criminal">Criminal Law</SelectItem>
                <SelectItem value="family">Family Law</SelectItem>
                <SelectItem value="property">Property Law</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger><SelectValue placeholder="Filter by language" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="hindi">Hindi</SelectItem>
                <SelectItem value="marathi">Marathi</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lawyers.map((lawyer) => (
          <Card key={lawyer.id} className="overflow-hidden hover:shadow-xl transition-shadow">
            <CardHeader className="flex-row gap-4 items-start p-4 bg-card">
              {lawyer.image && (
                 <Image
                    src={lawyer.image.imageUrl}
                    alt={`Portrait of ${lawyer.name}`}
                    width={80}
                    height={80}
                    className="rounded-full border-2 border-primary"
                    data-ai-hint={lawyer.image.imageHint}
                />
              )}
              <div className="flex-1">
                <CardTitle className="font-headline text-lg">{lawyer.name}</CardTitle>
                <p className="text-sm text-primary font-semibold">{lawyer.specialty}</p>
                <p className="text-xs text-muted-foreground">{lawyer.location}</p>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Experience</span>
                <span className="font-semibold">{lawyer.experience} years</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Rating</span>
                <div className="flex items-center gap-1 font-semibold">
                  <Star className="h-4 w-4 text-accent fill-accent" />
                  {lawyer.rating}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {lawyer.languages.map((lang) => (
                  <Badge key={lang} variant="secondary">{lang}</Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="p-4 bg-secondary/50 flex-col items-stretch gap-2">
                <p className="text-center font-bold text-lg">{lawyer.fee}</p>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="w-full"><MessageSquare className="mr-2 h-4 w-4" /> Chat</Button>
                    <Button variant="outline" size="sm" className="w-full"><Phone className="mr-2 h-4 w-4" /> Call</Button>
                    <Button size="sm" className="w-full"><Video className="mr-2 h-4 w-4" /> Video</Button>
                </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
