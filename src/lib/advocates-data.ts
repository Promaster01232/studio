
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


const initialLawyers: Lawyer[] = [];

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
