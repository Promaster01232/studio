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
    barId?: string;
    courtName?: string;
    courtAddress?: string;
    courts?: string[];
    rawExperience?: string;
    position?: string;
    certificateName?: string;
    isVerified?: boolean;
    [key: string]: any;
}


const initialLawyers: Lawyer[] = [
    {
        id: "mock-1",
        name: "Adv. Anjali Sharma",
        specialty: "Criminal Law & Civil Litigation",
        rating: "4.9",
        reviews: 124,
        isVerified: true,
        image: PlaceHolderImages.find(img => img.id === 'lawyer2'),
        about: "Expert in complex criminal cases and high-stakes civil litigation. Over 15 years of experience in the High Court.",
        experience: "15 Years Experience as Senior Advocate",
        contact: { phone: "+91 98765 43210", email: "anjali.sharma@nyayasahayak.com" },
        courtName: "Bombay High Court",
        courtAddress: "Fort, Mumbai, Maharashtra",
        courts: ["High Court", "Supreme Court"]
    },
    {
        id: "mock-2",
        name: "Adv. Siddharth Rao",
        specialty: "Corporate Law & IP Rights",
        rating: "4.8",
        reviews: 89,
        isVerified: true,
        image: PlaceHolderImages.find(img => img.id === 'lawyer1'),
        about: "Specializing in corporate restructuring, mergers, and intellectual property protection for tech startups.",
        experience: "12 Years Experience as Managing Partner",
        contact: { phone: "+91 98221 12233", email: "siddharth.rao@nyayasahayak.com" },
        courtName: "Delhi High Court",
        courtAddress: "New Delhi, Delhi",
        courts: ["High Court", "Tribunals"]
    },
    {
        id: "mock-3",
        name: "Adv. Meera Kulkarni",
        specialty: "Family Law & Mediation",
        rating: "5.0",
        reviews: 156,
        isVerified: true,
        image: PlaceHolderImages.find(img => img.id === 'lawyer5'),
        about: "Compassionate mediator and family lawyer focusing on amicable settlements and child custody matters.",
        experience: "10 Years Experience as Lead Counsel",
        contact: { phone: "+91 91122 33445", email: "meera.k@nyayasahayak.com" },
        courtName: "District & Sessions Court",
        courtAddress: "Pune, Maharashtra",
        courts: ["District Court", "Family Court"]
    },
    {
        id: "mock-4",
        name: "Adv. Vikram Singh",
        specialty: "Constitutional Law",
        rating: "4.7",
        reviews: 67,
        isVerified: true,
        image: PlaceHolderImages.find(img => img.id === 'lawyer4'),
        about: "Senior counsel with extensive experience in PILs and constitutional challenges before the Supreme Court.",
        experience: "25 Years Experience as Senior Counsel",
        contact: { phone: "+91 99887 76655", email: "vikram.singh@nyayasahayak.com" },
        courtName: "Supreme Court of India",
        courtAddress: "Tilak Marg, New Delhi",
        courts: ["Supreme Court"]
    },
    {
        id: "mock-5",
        name: "Adv. Rahul Verma",
        specialty: "Cyber Law & Digital Evidence",
        rating: "4.9",
        reviews: 42,
        isVerified: true,
        image: PlaceHolderImages.find(img => img.id === 'lawyer3'),
        about: "Handling complex cybercrime litigation and advising on digital data privacy and compliance.",
        experience: "8 Years Experience as Cyber Legal Expert",
        contact: { phone: "+91 94455 66778", email: "rahul.v@nyayasahayak.com" },
        courtName: "Karnataka High Court",
        courtAddress: "Bengaluru, Karnataka",
        courts: ["High Court", "Cyber Cell"]
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
    
    combined.forEach(advocate => {
        uniqueLawyersMap.set(advocate.id, advocate);
    });

    return Array.from(uniqueLawyersMap.values()).reverse();
};

export const saveAdvocate = (newAdvocate: Omit<Lawyer, 'id'>): void => {
    if (typeof window === 'undefined') return;
    
    const storedAdvocates = getStoredAdvocates();
    
    // Check if an advocate with this email already exists to update instead of add
    const existingIndex = storedAdvocates.findIndex(a => a.contact?.email === newAdvocate.contact?.email);
    
    let updatedAdvocates;
    if (existingIndex > -1) {
        const existing = storedAdvocates[existingIndex];
        updatedAdvocates = [...storedAdvocates];
        updatedAdvocates[existingIndex] = { ...newAdvocate, id: existing.id };
    } else {
        const advocateWithId = { ...newAdvocate, id: Date.now() };
        updatedAdvocates = [...storedAdvocates, advocateWithId];
    }
    
    localStorage.setItem('advocates', JSON.stringify(updatedAdvocates));
}

export const deleteAdvocate = (email: string): void => {
    if (typeof window === 'undefined') return;
    const storedAdvocates = getStoredAdvocates();
    const filtered = storedAdvocates.filter(a => a.contact?.email !== email);
    localStorage.setItem('advocates', JSON.stringify(filtered));
}
