
import {
  BookOpen,
  ShoppingCart,
  Factory,
  Car,
  Shield,
  Users,
  Home,
  FileText,
  Landmark,
  Globe,
  Leaf,
  BrainCircuit,
  Scale,
  PiggyBank,
  HeartPulse,
  Building,
  University,
  CheckSquare,
  File,
  Bike,
  HeartHandshake,
  Network,
  Palette,
  Anchor,
  Plane,
  Stethoscope,
  Gavel,
  FileSignature
} from "lucide-react";

export const topics = [
  {
    slug: "fundamental-rights",
    title: "Fundamental Rights",
    description: "Understand the basic rights guaranteed to every citizen by the Constitution of India.",
    icon: BookOpen,
    pdfUrl: "https://cdnbbsr.s3waas.gov.in/s380537a945c7aaa788ccfcdf1b99b5d8f/uploads/2023/05/2023050195.pdf"
  },
  {
    slug: "consumer-rights",
    title: "Consumer Rights",
    description: "Learn about your rights as a consumer and how to file complaints against faulty products or services.",
    icon: ShoppingCart,
    pdfUrl: "https://legislative.gov.in/sites/default/files/A2019-35.pdf"
  },
  {
    slug: "labour-laws",
    title: "Labour Laws",
    description: "Know your rights as an employee, including wages, working hours, and conditions of service.",
    icon: Factory,
    pdfUrl: "https://labour.gov.in/sites/default/files/the_code_on_wages_2019_0.pdf"
  },
  {
    slug: "motor-vehicle-laws",
    title: "Motor Vehicle Laws",
    description: "Understand traffic rules, rights during traffic stops, and procedures for accidents.",
    icon: Car,
    pdfUrl: "https://legislative.gov.in/sites/default/files/A1988-59.pdf"
  },
  {
    slug: "cyber-crime",
    title: "Cyber Crime",
    description: "Learn how to protect yourself from online fraud, harassment, and other cyber crimes.",
    icon: Shield,
    pdfUrl: "https://legislative.gov.in/sites/default/files/A2000-21.pdf"
  },
  {
    slug: "family-law",
    title: "Family Law",
    description: "Information on marriage, divorce, child custody, and adoption laws in India.",
    icon: Users,
    pdfUrl: "https://legislative.gov.in/sites/default/files/A1955-25.pdf"
  },
  {
    slug: "property-law",
    title: "Property Law",
    description: "Understand the laws related to buying, selling, and owning property in India.",
    icon: Home,
    pdfUrl: "https://legislative.gov.in/sites/default/files/A1882-04.pdf"
  },
  {
    slug: "right-to-information",
    title: "Right to Information (RTI)",
    description: "Learn how to use the RTI Act to obtain information from government departments.",
    icon: FileText,
    pdfUrl: "https://legislative.gov.in/sites/default/files/A2005-22.pdf"
  },
  {
    slug: "banking-laws",
    title: "Banking & Finance Laws",
    description: "Know your rights related to banking services, loans, and digital transactions.",
    icon: Landmark,
    pdfUrl: "https://legislative.gov.in/sites/default/files/A1949-10.pdf"
  },
  {
    slug: "human-rights",
    title: "Human Rights",
    description: "An overview of the universal human rights and how they are protected in India.",
    icon: Globe,
    pdfUrl: "https://legislative.gov.in/sites/default/files/A1994-10.pdf"
  },
  {
    slug: "environmental-law",
    title: "Environmental Law",
    description: "Learn about the laws in place to protect the environment and wildlife.",
    icon: Leaf,
    pdfUrl: "https://legislative.gov.in/sites/default/files/A1986-29.pdf"
  },
  {
    slug: "intellectual-property",
    title: "Intellectual Property Rights",
    description: "Understand copyrights, patents, and trademarks for your creations.",
    icon: BrainCircuit,
    pdfUrl: "https://copyright.gov.in/Documents/CopyrightRules1957.pdf"
  },
  {
    slug: "taxation-law",
    title: "Taxation Law",
    description: "Basics of income tax, GST, and your rights and duties as a taxpayer.",
    icon: PiggyBank,
    pdfUrl: "https://legislative.gov.in/sites/default/files/A1961-43.pdf"
  },
  {
    slug: "health-and-medical-law",
    title: "Health & Medical Law",
    description: "Understand patient rights, medical negligence, and healthcare regulations.",
    icon: HeartPulse,
    pdfUrl: "https://www.nmc.org.in/wp-content/uploads/2019/09/NMC-ACT-2019.pdf"
  },
  {
    slug: "real-estate-regulation",
    title: "Real Estate (RERA) Act",
    description: "Learn about the rules that protect homebuyers and regulate the real estate sector.",
    icon: Building,
    pdfUrl: "https://legislative.gov.in/sites/default/files/A2016-16.pdf"
  },
  {
    slug: "education-law",
    title: "Education Law",
    description: "Know the rights of students and regulations governing educational institutions.",
    icon: University,
    pdfUrl: "https://legislative.gov.in/sites/default/files/A2009-35.pdf"
  },
  {
    slug: "contract-law",
    title: "Contract Law",
    description: "Understand the essentials of a valid contract and remedies for breach of contract.",
    icon: CheckSquare,
    pdfUrl: "https://legislative.gov.in/sites/default/files/A1872-09.pdf"
  },
  {
    slug: "arbitration-and-conciliation",
    title: "Arbitration & Conciliation",
    description: "Learn about alternative dispute resolution mechanisms outside of traditional courts.",
    icon: Scale,
    pdfUrl: "https://legislative.gov.in/sites/default/files/A1996-26.pdf"
  },
  {
    slug: "insolvency-and-bankruptcy",
    title: "Insolvency & Bankruptcy Code",
    description: "Understand the process for corporate and individual insolvency resolution.",
    icon: Landmark,
    pdfUrl: "https://legislative.gov.in/sites/default/files/A2016-31.pdf"
  },
  {
    slug: "public-interest-litigation",
    title: "Public Interest Litigation (PIL)",
    description: "Learn how to file a PIL for the protection of public interest.",
    icon: Users,
    pdfUrl: "https://main.sci.gov.in/pdf/PIL/guidelines_pil.pdf"
  },
  {
    slug: "criminal-procedure",
    title: "Criminal Procedure Code (CrPC)",
    description: "Understand the procedure for investigation, trial, and appeal in criminal cases.",
    icon: Gavel,
    pdfUrl: "https://legislative.gov.in/sites/default/files/A1974-02.pdf"
  },
  {
    slug: "evidence-act",
    title: "The Indian Evidence Act",
    description: "Learn what constitutes evidence and the rules of admissibility in court.",
    icon: File,
    pdfUrl: "https://legislative.gov.in/sites/default/files/A1872-01.pdf"
  },
  {
    slug: "information-technology-act",
    title: "Information Technology Act",
    description: "Understand the laws governing electronic commerce and cybercrime.",
    icon: Network,
    pdfUrl: "https://legislative.gov.in/sites/default/files/A2000-21.pdf"
  },
  {
    slug: "domestic-violence-act",
    title: "Domestic Violence Act",
    description: "Protection and remedies available to women from domestic violence.",
    icon: Home,
    pdfUrl: "https://legislative.gov.in/sites/default/files/A2005-43.pdf"
  },
  {
    slug: "juvenile-justice-act",
    title: "Juvenile Justice Act",
    description: "Laws related to children in conflict with law and children in need of care.",
    icon: Users,
    pdfUrl: "https://legislative.gov.in/sites/default/files/A2016-2.pdf"
  },
  {
    slug: "prevention-of-corruption-act",
    title: "Prevention of Corruption Act",
    description: "Understand the laws aimed at combating corruption in government agencies.",
    icon: Shield,
    pdfUrl: "https://legislative.gov.in/sites/default/files/A1988-49.pdf"
  },
  {
    slug: "food-safety-and-standards",
    title: "Food Safety (FSSAI) Laws",
    description: "Regulations for food products to ensure safety and quality for consumers.",
    icon: ShoppingCart,
    pdfUrl: "https://www.fssai.gov.in/upload/uploadfiles/files/FOOD-ACT.pdf"
  },
  {
    slug: "street-vendor-rights",
    title: "Street Vendor Rights",
    description: "Learn about the rights and protections for street vendors in urban areas.",
    icon: Bike,
    pdfUrl: "https://legislative.gov.in/sites/default/files/A2014-7.pdf"
  },
  {
    slug: "animal-cruelty-laws",
    title: "Animal Cruelty Laws",
    description: "Understand the laws for the prevention of cruelty to animals.",
    icon: HeartHandshake,
    pdfUrl: "https://legislative.gov.in/sites/default/files/A1960-59.pdf"
  },
  {
    slug: "disability-rights",
    title: "Rights of Persons with Disabilities",
    description: "Laws ensuring equal opportunities and protection of rights for disabled persons.",
    icon: Users,
    pdfUrl: "https://legislative.gov.in/sites/default/files/A2016-49.pdf"
  },
  {
    slug: "copyright-law",
    title: "Copyright Law",
    description: "Protection for original literary, dramatic, musical and artistic works.",
    icon: Palette,
    pdfUrl: "https://legislative.gov.in/sites/default/files/A1957-14.pdf"
  },
  {
    slug: "patent-law",
    title: "Patent Law",
    description: "How to protect your inventions and the criteria for patentability.",
    icon: BrainCircuit,
    pdfUrl: "https://legislative.gov.in/sites/default/files/A1970-39.pdf"
  },
  {
    slug: "trademark-law",
    title: "Trademark Law",
    description: "Protecting brand names, logos, and symbols that distinguish goods or services.",
    icon: FileSignature,
    pdfUrl: "https://legislative.gov.in/sites/default/files/A1999-47.pdf"
  },
  {
    slug: "maritime-law",
    title: "Maritime Law",
    description: "Legal rules and regulations governing activities at sea.",
    icon: Anchor,
    pdfUrl: "https://legislative.gov.in/sites/default/files/A2017-22.pdf"
  },
  {
    slug: "aviation-law",
    title: "Aviation Law",
    description: "Laws and regulations related to air travel and airport management.",
    icon: Plane,
    pdfUrl: "https://legislative.gov.in/sites/default/files/A1934-22.pdf"
  },
  {
    slug: "hindu-succession-act",
    title: "Hindu Succession Act",
    description: "Rules of inheritance and property succession among Hindus.",
    icon: Users,
    pdfUrl: "https://legislative.gov.in/sites/default/files/A1956-30.pdf"
  },
  {
    slug: "muslim-personal-law",
    title: "Muslim Personal Law",
    description: "Laws governing marriage, divorce, and inheritance for Muslims in India.",
    icon: Users,
    pdfUrl: "https://legislative.gov.in/sites/default/files/A1937-26.pdf"
  },
  {
    slug: "special-marriage-act",
    title: "Special Marriage Act",
    description: "A civil marriage law for people of India irrespective of their religion.",
    icon: Users,
    pdfUrl: "https://legislative.gov.in/sites/default/files/A1954-43.pdf"
  },
  {
    slug: "land-acquisition-act",
    title: "Land Acquisition Act",
    description: "Procedure and rules for land acquisition by the government for public purposes.",
    icon: Home,
    pdfUrl: "https://legislative.gov.in/sites/default/files/A2013-30.pdf"
  },
  {
    slug: "minimum-wages-act",
    title: "Minimum Wages Act",
    description: "Law ensuring a minimum wage for workers in various scheduled employments.",
    icon: Factory,
    pdfUrl: "https://legislative.gov.in/sites/default/files/A1948-11.pdf"
  },
  {
    slug: "child-labour-act",
    title: "Child Labour Act",
    description: "Prohibition and regulation of employment of children in certain occupations.",
    icon: Users,
    pdfUrl: "https://legislative.gov.in/sites/default/files/A1986-61.pdf"
  },
  {
    slug: "sexual-harassment-at-workplace",
    title: "Sexual Harassment at Workplace Act",
    description: "Protection against sexual harassment of women at workplace and redressal of complaints.",
    icon: Shield,
    pdfUrl: "https://legislative.gov.in/sites/default/files/A2013-14.pdf"
  },
  {
    slug: "forest-conservation-act",
    title: "Forest Conservation Act",
    description: "Laws for the conservation of forests and matters connected therewith.",
    icon: Leaf,
    pdfUrl: "https://legislative.gov.in/sites/default/files/A1980-69.pdf"
  },
  {
    slug: "wildlife-protection-act",
    title: "Wildlife Protection Act",
    description: "An Act to provide for the protection of wild animals, birds and plants.",
    icon: Leaf,
    pdfUrl: "https://legislative.gov.in/sites/default/files/A1972-53.pdf"
  },
  {
    slug: "air-pollution-act",
    title: "Air (Prevention & Control) Act",
    description: "Laws to prevent, control, and abate air pollution.",
    icon: Leaf,
    pdfUrl: "https://legislative.gov.in/sites/default/files/A1981-14.pdf"
  },
  {
    slug: "water-pollution-act",
    title: "Water (Prevention & Control) Act",
    description: "Laws to prevent and control water pollution and maintain water quality.",
    icon: Leaf,
    pdfUrl: "https://legislative.gov.in/sites/default/files/A1974-6.pdf"
  },
  {
    slug: "clinical-establishments-act",
    title: "Clinical Establishments Act",
    description: "Regulation and registration of all clinical establishments in the country.",
    icon: Stethoscope,
    pdfUrl: "https://legislative.gov.in/sites/default/files/A2010-23.pdf"
  },
  {
    slug: "transgender-persons-act",
    title: "Transgender Persons Act",
    description: "Act to provide for the protection of rights of transgender persons.",
    icon: Users,
    pdfUrl: "https://legislative.gov.in/sites/default/files/A2019-40.pdf"
  },
  {
    slug: "mental-healthcare-act",
    title: "Mental Healthcare Act",
    description: "An Act to provide for mental healthcare and services for persons with mental illness.",
    icon: HeartPulse,
    pdfUrl: "https://legislative.gov.in/sites/default/files/A2017-10.pdf"
  },
  {
    slug: "companies-act",
    title: "Companies Act, 2013",
    description: "The primary legislation that governs the incorporation and functioning of companies.",
    icon: Building,
    pdfUrl: "https://www.mca.gov.in/Ministry/pdf/CompaniesAct2013.pdf"
  },
  {
    slug: "partnership-act",
    title: "Indian Partnership Act, 1932",
    description: "Laws that govern partnership firms in India.",
    icon: Users,
    pdfUrl: "https://legislative.gov.in/sites/default/files/A1932-09.pdf"
  },
  {
    slug: "negotiable-instruments-act",
    title: "Negotiable Instruments Act",
    description: "Laws relating to promissory notes, bills of exchange and cheques.",
    icon: FileText,
    pdfUrl: "https://legislative.gov.in/sites/default/files/A1881-26.pdf"
  }
];
