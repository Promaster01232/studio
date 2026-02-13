
import { PlaceHolderImages } from "@/lib/placeholder-images";

export interface Lawyer {
    id: number | string;
    name: string;
    specialty: string;
    rating: number | string;
    reviews?: number;
    image?: {
        id: string;
        imageUrl: string;
        imageHint: string;
    };
    about?: string;
    experience?: string;
    contact?: {
        phone: string;
        email: string;
    };
    [key: string]: any; // for other properties from the form
}


const initialLawyers: Lawyer[] = [
    {
        id: 1,
        name: "Anjali Sharma",
        specialty: "Criminal Law",
        rating: 4.8,
        reviews: 42,
        image: PlaceHolderImages.find(img => img.id === 'lawyer2'),
        about: "Dedicated criminal defense lawyer with over 10 years of experience in high-stakes litigation. Committed to protecting the rights of my clients and ensuring a fair trial.",
        experience: "10+ years in criminal defense, specialization in bail and anticipatory bail matters.",
        contact: { phone: "+91 98765 43210", email: "anjali.sharma@example.com" }
    },
    {
        id: 2,
        name: "Siddharth Rao",
        specialty: "Corporate Law",
        rating: 4.9,
        reviews: 55,
        image: PlaceHolderImages.find(img => img.id === 'lawyer1'),
        about: "Expert in corporate law, mergers & acquisitions, and regulatory compliance. I help businesses navigate the complex legal landscape of India.",
        experience: "15 years of experience advising startups and multinational corporations. Practices at Bombay High Court.",
        contact: { phone: "+91 91234 56789", email: "s.rao@example.com" }
    },
    {
        id: 3,
        name: "Priya Singh",
        specialty: "Family Law",
        rating: 4.7,
        reviews: 35,
        image: PlaceHolderImages.find(img => img.id === 'lawyer5'),
        about: "Compassionate and experienced family law advocate. I specialize in matters of divorce, child custody, and domestic violence. My goal is to find amicable solutions for families.",
        experience: "8 years in family court litigation. Certified mediator.",
        contact: { phone: "+91 99887 76655", email: "priya.singh.law@example.com" }
    }
];

const getStoredAdvocates = (): Lawyer[] => {
    if (typeof window === 'undefined') {
        return [];
    }
    try {
        const stored = localStorage.getItem('advocates');
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error("Failed to parse advocates from local storage", error);
        return [];
    }
}

export const getAdvocates = (): Lawyer[] => {
    const storedAdvocates = getStoredAdvocates();
    const combined = [...initialLawyers, ...storedAdvocates];
    const uniqueLawyersMap = new Map<string | number, Lawyer>();
    
    // Process in reverse to prioritize newly added (or updated) advocates if IDs were to clash
    combined.reverse().forEach(advocate => {
        if (!uniqueLawyersMap.has(advocate.id)) {
            uniqueLawyersMap.set(advocate.id, advocate);
        }
    });

    return Array.from(uniqueLawyersMap.values()).reverse();
};

export const saveAdvocate = (newAdvocate: Omit<Lawyer, 'id'>): void => {
    if (typeof window === 'undefined') return;
    
    const storedAdvocates = getStoredAdvocates();
    const advocateWithId = { ...newAdvocate, id: Date.now() };
    const updatedAdvocates = [...storedAdvocates, advocateWithId];
    
    localStorage.setItem('advocates', JSON.stringify(updatedAdvocates));
}
