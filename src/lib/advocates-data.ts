
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
    specialty: "Family Law",
    rating: 4.8,
    reviews: 1903,
    image: PlaceHolderImages.find(img => img.id === 'lawyer2'),
    about: "Anjali Sharma is a dedicated family law attorney with over 10 years of experience. She specializes in divorce, child custody, and adoption cases, providing compassionate and expert legal counsel to her clients. Anjali is committed to achieving the best possible outcomes for the families she represents.",
    experience: "Throughout her career, Anjali has successfully handled hundreds of complex family law cases. She is a skilled negotiator and a formidable presence in the courtroom. Her expertise alsoincludes mediation and collaborative law, offering clients alternative dispute resolution options.",
    contact: {
      phone: "+91 98765 43210",
      email: "anjali.sharma@example.com"
    }
  },
  {
    id: 2,
    name: "Siddharth Rao",
    specialty: "Cyber Law",
    rating: 4.8,
    reviews: 1500,
    image: PlaceHolderImages.find(img => img.id === 'lawyer1'),
    about: "Siddharth Rao is a leading expert in cyber law and data privacy. He advises startups and multinational corporations on navigating the complexities of technology-related legal issues. He has a passion for digital rights and is a frequent speaker at tech law conferences.",
    experience: "With a background in software engineering, Siddharth brings a unique technical perspective to his legal practice. He has been instrumental in shaping data protection policies for several large tech companies and has a proven track record in handling high-stakes cybercrime litigation.",
    contact: {
      phone: "+91 98765 11111",
      email: "siddharth.rao@example.com"
    }
  },
  {
    id: 3,
    name: "Priya Singh",
    specialty: "Civil Law",
    rating: 5.0,
    reviews: 893,
    image: PlaceHolderImages.find(img => img.id === 'lawyer5'),
    about: "Priya Singh is a highly-rated civil litigation lawyer known for her meticulous preparation and client-focused approach. She handles a wide range of civil disputes, including property matters, contract breaches, and tort claims.",
    experience: "Priya has an impressive record of securing favorable settlements and court verdicts for her clients. She is praised for her ability to simplify complex legal arguments and for her unwavering commitment to justice.",
     contact: {
      phone: "+91 98765 22222",
      email: "priya.singh@example.com"
    }
  },
  {
    id: 4,
    name: "Rajesh Kumar",
    specialty: "Crypto Law",
    rating: 4.7,
    reviews: 1354,
    image: PlaceHolderImages.find(img => img.id === 'lawyer3'),
    about: "Rajesh Kumar is at the forefront of the evolving field of cryptocurrency and blockchain law. He assists clients with regulatory compliance, ICOs, and disputes related to digital assets.",
    experience: "As one of the early legal experts in the crypto space in India, Rajesh has a deep understanding of the technology and its legal implications. He has helped numerous blockchain startups launch successfully while navigating the uncertain regulatory landscape.",
    contact: {
      phone: "+91 98765 33333",
      email: "rajesh.kumar@example.com"
    }
  },
  {
    id: 5,
    name: "Sunita Reddy",
    specialty: "Real Estate",
    rating: 4.9,
    reviews: 1101,
    image: PlaceHolderImages.find(img => img.id === 'lawyer2'),
    about: "Sunita Reddy is a specialist in real estate law, handling everything from residential transactions to large-scale commercial development projects. Her clients value her sharp negotiation skills and attention to detail.",
    experience: "Sunita has over 15 years of experience in real estate law. She has a comprehensive understanding of property regulations, zoning laws, and title issues, ensuring smooth and secure transactions for her clients.",
    contact: {
      phone: "+91 98765 44444",
      email: "sunita.reddy@example.com"
    }
  },
  {
    id: 6,
    name: "Amit Verma",
    specialty: "Corporate Law",
    rating: 4.6,
    reviews: 750,
    image: PlaceHolderImages.find(img => img.id === 'lawyer6'),
    about: "Amit Verma provides strategic legal advice to businesses of all sizes. His practice focuses on corporate governance, mergers & acquisitions, and commercial contracts.",
    experience: "Amit has worked with both domestic and international clients, helping them structure deals and manage corporate legal risks. He is known for his business-oriented approach to legal problem-solving.",
    contact: {
      phone: "+91 98765 55555",
      email: "amit.verma@example.com"
    }
  },
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
