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
  FileSignature,
  Lock,
  Search,
  Zap,
  Building2,
  HardHat,
  Heart,
  UserCheck,
  ShieldAlert,
  Fingerprint,
  Mic,
  Cpu,
  Mail,
  Smartphone,
  Eye,
  Briefcase,
  AlertTriangle,
  Flame,
  Ambulance,
  Baby,
  Truck,
  Hotel,
  Coffee,
  Coins,
  Gem,
  Hammer,
  Library,
  Newspaper,
  Presentation,
  Terminal,
  Wifi,
  Waves,
  SunMoon,
  TrendingUp,
  UserPlus,
  ShieldCheck,
  Trophy
} from "lucide-react";

export const topics = [
  // CONSTITUTIONAL (1-8)
  {
    slug: "fundamental-rights",
    title: "Fundamental Rights (Constitutional Forensic Audit)",
    description: "Deep-study node covering jurisprudence, statutory framework, and judicial enforcement under Part III.",
    icon: BookOpen,
    category: "Constitutional",
    content: `### PHASE 1: JURISPRUDENTIAL FOUNDATION...`
  },
  {
    slug: "directive-principles",
    title: "Directive Principles of State Policy",
    description: "Statutory mapping of Part IV guidelines for social and economic democracy in India.",
    icon: Landmark,
    category: "Constitutional",
    content: "Detailed content about DPSP... --- **हिन्दी में:** --- राज्य के नीति निदेशक तत्व का विवरण।"
  },
  {
    slug: "writ-jurisdiction",
    title: "Writ Jurisdiction (Art 32 & 226)",
    description: "Forensic study of Habeas Corpus, Mandamus, Quo-Warranto, Certiorari, and Prohibition.",
    icon: Scale,
    category: "Constitutional",
    content: "Detailed content about Writs... --- **हिन्दी में:** --- रिट क्षेत्राधिकार का विवरण।"
  },
  {
    slug: "emergency-provisions",
    title: "Emergency Provisions Protocol",
    description: "Audit of Articles 352, 356, and 360 and their impact on federal statutory structures.",
    icon: ShieldAlert,
    category: "Constitutional",
    content: "Detailed content about Emergency... --- **हिन्दी में:** --- आपातकालीन प्रावधानों का विवरण।"
  },
  {
    slug: "federal-structure",
    title: "Federal Structure & Distribution of Powers",
    description: "Analysis of the Union, State, and Concurrent lists under the Seventh Schedule.",
    icon: Network,
    category: "Constitutional",
    content: "Detailed content about Federalism... --- **हिन्दी में:** --- संघीय ढांचे का विवरण।"
  },
  {
    slug: "amendment-doctrine",
    title: "Basic Structure & Amendment Doctrine",
    description: "The Kesavananda Bharati forensic audit: Limitations on Article 368.",
    icon: Hammer,
    category: "Constitutional",
    content: "Detailed content about Amendments... --- **हिन्दी में:** --- संशोधन सिद्धांत का विवरण।"
  },
  {
    slug: "panchayati-raj",
    title: "Panchayati Raj & Local Self-Gov",
    description: "Statutory framework of the 73rd and 74th Amendments for grassroots democracy.",
    icon: Building,
    category: "Constitutional",
    content: "Detailed content about Local Gov... --- **हिन्दी में:** --- पंचायती राज का विवरण।"
  },
  {
    slug: "citizenship-act",
    title: "Citizenship Act & Constitutional Identity",
    description: "Audit of Articles 5-11 and the Citizenship Act 1955 with recent amendments.",
    icon: UserCheck,
    category: "Constitutional",
    content: "Detailed content about Citizenship... --- **हिन्दी में:** --- नागरिकता अधिनियम का विवरण।"
  },

  // CRIMINAL (9-16)
  {
    slug: "criminal-law-jurisprudence",
    title: "Criminal Law Jurisprudence (BNS & IPC)",
    description: "Deep-study comparing IPC 1860 with the new Bhartiya Nyaya Sanhita (BNS) 2023.",
    icon: Gavel,
    category: "Criminal",
    content: `### PHASE 1: EVOLUTION...`
  },
  {
    slug: "bns-offences-body",
    title: "BNS: Offences Against Human Body",
    description: "Forensic audit of statutes covering murder, culpable homicide, and criminal force.",
    icon: Shield,
    category: "Criminal",
    content: "Detailed content about BNS Body Offences... --- **हिन्दी में:** --- मानव शरीर के खिलाफ अपराधों का विवरण।"
  },
  {
    slug: "bns-offences-property",
    title: "BNS: Offences Against Property",
    description: "Analysis of theft, extortion, robbery, dacoity, and criminal misappropriation.",
    icon: Home,
    category: "Criminal",
    content: "Detailed content about BNS Property Offences... --- **हिन्दी में:** --- संपत्ति के खिलाफ अपराधों का विवरण।"
  },
  {
    slug: "crpc-bnss-procedure",
    title: "BNSS: Criminal Procedure Audit",
    description: "Roadmap of the Bharatiya Nagarik Suraksha Sanhita replacing the CrPC 1973.",
    icon: FileSignature,
    category: "Criminal",
    content: "Detailed content about BNSS... --- **हिन्दी में:** --- भारतीय नागरिक सुरक्षा संहिता का विवरण।"
  },
  {
    slug: "evidence-bsa-2023",
    title: "BSA: Indian Evidence Act Transformation",
    description: "Audit of the Bharatiya Sakshya Adhiniyam 2023 and digital evidence forensics.",
    icon: Search,
    category: "Criminal",
    content: "Detailed content about BSA... --- **हिन्दी में:** --- भारतीय साक्ष्य अधिनियम का विवरण।"
  },
  {
    slug: "juvenile-justice-act",
    title: "Juvenile Justice (Care & Protection)",
    description: "Statutory framework for children in conflict with law and adoption protocols.",
    icon: Baby,
    category: "Criminal",
    content: "Detailed content about JJ Act... --- **हिन्दी में:** --- किशोर न्याय अधिनियम का विवरण।"
  },
  {
    slug: "ndps-act-audit",
    title: "NDPS Act: Narcotics Forensic Node",
    description: "Audit of drug-related offences, search and seizure protocols, and punishments.",
    icon: HeartPulse,
    category: "Criminal",
    content: "Detailed content about NDPS... --- **हिन्दी में:** --- NDPS अधिनियम का विवरण।"
  },
  {
    slug: "sc-st-prevention-of-atrocities",
    title: "SC/ST Prevention of Atrocities Act",
    description: "Special statutory protections, investigative protocols, and special court nodes.",
    icon: Scale,
    category: "Criminal",
    content: "Detailed content about SC/ST Act... --- **हिन्दी में:** --- SC/ST अधिनियम का विवरण।"
  },

  // CIVIL (17-24)
  {
    slug: "property-law",
    title: "Transfer of Property & RERA Audit",
    description: "Deep dive into real estate statutes, title deed forensics, and RERA protocols.",
    icon: Building2,
    category: "Civil",
    content: "Detailed content... --- **हिन्दी में:** --- संपत्ति कानून का विवरण।"
  },
  {
    slug: "indian-contract-act",
    title: "Indian Contract Act & Agreement Nodes",
    description: "Analysis of offer, acceptance, consideration, and breach of statutory agreements.",
    icon: FileText,
    category: "Civil",
    content: "Detailed content... --- **हिन्दी में:** --- भारतीय अनुबंध अधिनियम का विवरण।"
  },
  {
    slug: "consumer-protection-statutes",
    title: "Consumer Protection & E-Commerce",
    description: "Detailed analysis of the 2019 Act, product liability, and digital redressal.",
    icon: ShoppingCart,
    category: "Civil",
    content: "Detailed content... --- **हिन्दी में:** --- उपभोक्ता संरक्षण का विवरण।"
  },
  {
    slug: "tort-law-liability",
    title: "Tort Law & Vicarious Liability",
    description: "Forensic study of civil wrongs, negligence, nuisance, and defamation nodes.",
    icon: Gavel,
    category: "Civil",
    content: "Detailed content... --- **हिन्दी में:** --- अपकृत्य कानून का विवरण।"
  },
  {
    slug: "specific-relief-act",
    title: "Specific Relief Act Audit",
    description: "Statutory remedies for recovery of possession, injunctions, and declarations.",
    icon: CheckSquare,
    category: "Civil",
    content: "Detailed content... --- **हिन्दी में:** --- विशिष्ट राहत अधिनियम का विवरण।"
  },
  {
    slug: "limitation-act-audit",
    title: "Limitation Act: Statutory Timelines",
    description: "Mapping of prescribed periods for filing suits, appeals, and applications.",
    icon: Smartphone,
    category: "Civil",
    content: "Detailed content... --- **हिन्दी में:** --- परिसीमा अधिनियम का विवरण।"
  },
  {
    slug: "arbitration-conciliation",
    title: "Arbitration & Conciliation Node",
    description: "ADR protocols, international commercial arbitration, and award enforcement.",
    icon: HeartHandshake,
    category: "Civil",
    content: "Detailed content... --- **हिन्दी में:** --- मध्यस्थता और सुलह का विवरण।"
  },
  {
    slug: "easement-act-audit",
    title: "Indian Easements Act",
    description: "Audit of rights of way, light, air, and support in property jurisprudence.",
    icon: SunMoon,
    category: "Civil",
    content: "Detailed content... --- **हिन्दी में:** --- सुखाचार अधिनियम का विवरण।"
  },

  // DIGITAL (25-32)
  {
    slug: "cyber-law-it-act",
    title: "Cyber Law & Information Technology",
    description: "Deep study of IT Act 2000, digital privacy, and electronic evidence forensics.",
    icon: Lock,
    category: "Digital",
    content: "Detailed content... --- **हिन्दी में:** --- साइबर कानून का विवरण।"
  },
  {
    slug: "dpdp-act-2023",
    title: "DPDP Act: Data Privacy Protocol",
    description: "Audit of the Digital Personal Data Protection Act and citizen data sovereignty.",
    icon: Fingerprint,
    category: "Digital",
    content: "Detailed content... --- **हिन्दी में:** --- डेटा गोपनीयता अधिनियम का विवरण।"
  },
  {
    slug: "e-evidence-forensics",
    title: "Electronic Evidence & Section 65B",
    description: "Statutory requirements for admissibility of digital records in Indian courts.",
    icon: Cpu,
    category: "Digital",
    content: "Detailed content... --- **हिन्दी में:** --- ई-साक्ष्य फोरेंसिक का विवरण।"
  },
  {
    slug: "intermediary-liability",
    title: "Intermediary Liability & Social Media",
    description: "IT Rules 2021 audit: Safe harbor provisions and compliance nodes.",
    icon: Globe,
    category: "Digital",
    content: "Detailed content... --- **हिन्दी में:** --- मध्यस्थ देयता का विवरण।"
  },
  {
    slug: "crypto-asset-regulation",
    title: "Crypto & Virtual Asset Statutes",
    description: "Analysis of the PMLA 2002 impact on VDA and tax statutory frameworks.",
    icon: Coins,
    category: "Digital",
    content: "Detailed content... --- **हिन्दी में:** --- क्रिप्टो संपत्ति विनियमन का विवरण।"
  },
  {
    slug: "cyber-terrorism-offences",
    title: "Cyber Terrorism & State Security",
    description: "Audit of Section 66F IT Act and its intersection with anti-terror laws.",
    icon: ShieldAlert,
    category: "Digital",
    content: "Detailed content... --- **हिन्दी में:** --- साइबर आतंकवाद अपराधों का विवरण।"
  },
  {
    slug: "fintech-legal-framework",
    title: "Fintech & Payment System Statutes",
    description: "Audit of PSS Act 2007 and RBI digital payment regulatory nodes.",
    icon: Smartphone,
    category: "Digital",
    content: "Detailed content... --- **हिन्दी में:** --- फिनटेक कानूनी ढांचे का विवरण।"
  },
  {
    slug: "ai-legal-ethics",
    title: "AI Governance & Legal Ethics",
    description: "Emerging statutory frameworks for artificial intelligence and neural liability.",
    icon: BrainCircuit,
    category: "Digital",
    content: "Detailed content... --- **हिन्दी में:** --- AI कानूनी नैतिकता का विवरण।"
  },

  // CORPORATE (33-40)
  {
    slug: "companies-act-2013",
    title: "Companies Act & Governance Node",
    description: "Audit of incorporation, management, CSR, and corporate liability protocols.",
    icon: Building2,
    category: "Corporate",
    content: "Detailed content... --- **हिन्दी में:** --- कंपनी अधिनियम का विवरण।"
  },
  {
    slug: "intellectual-property",
    title: "IPR: Patents & Trademark Node",
    description: "Forensic guide to protecting intellectual assets and litigation nodes.",
    icon: Palette,
    category: "Corporate",
    content: "Detailed content... --- **हिन्दी में:** --- बौद्धिक संपदा का विवरण।"
  },
  {
    slug: "msme-compliance",
    title: "MSME Statutory Compliance Registry",
    description: "Guide to Udyam registration, priority benefits, and arbitration nodes.",
    icon: Building,
    category: "Corporate",
    content: "Detailed content... --- **हिन्दी में:** --- MSME अनुपालन का विवरण।"
  },
  {
    slug: "banking-finance-law",
    title: "Banking & Financial Statutes",
    description: "Audit of SARFAESI Act, IBC, and consumer banking rights forensics.",
    icon: PiggyBank,
    category: "Corporate",
    content: "Detailed content... --- **हिन्दी में:** --- बैंकिंग कानून का विवरण।"
  },
  {
    slug: "insolvency-bankruptcy-code",
    title: "IBC: Insolvency & Bankruptcy Node",
    description: "Analysis of the resolution process, liquidation, and NCLT statutory cycles.",
    icon: FileText,
    category: "Corporate",
    content: "Detailed content... --- **हिन्दी में:** --- दिवाला और दिवालियापन संहिता का विवरण।"
  },
  {
    slug: "sebi-market-regulations",
    title: "SEBI & Capital Market Statutes",
    description: "Audit of listing obligations, insider trading, and investor protection nodes.",
    icon: TrendingUp,
    category: "Corporate",
    content: "Detailed content... --- **हिन्दी में:** --- SEBI बाजार नियमों का विवरण।"
  },
  {
    slug: "fema-foreign-exchange",
    title: "FEMA: Foreign Exchange Management",
    description: "Statutory framework for cross-border transactions and FDI protocols.",
    icon: Globe,
    category: "Corporate",
    content: "Detailed content... --- **हिन्दी में:** --- FEMA का विवरण।"
  },
  {
    slug: "competition-act-audit",
    title: "Competition Act & Anti-Trust Node",
    description: "Audit of abuse of dominance, cartels, and combination regulatory cycles.",
    icon: UserPlus,
    category: "Corporate",
    content: "Detailed content... --- **हिन्दी में:** --- प्रतिस्पर्धा अधिनियम का विवरण।"
  },

  // PUBLIC (41-48)
  {
    slug: "environmental-statutes",
    title: "Environmental Protection Protocols",
    description: "Deep study of NGT protocols, pollution control, and public trust doctrine.",
    icon: Leaf,
    category: "Public",
    content: "Detailed content... --- **हिन्दी में:** --- पर्यावरण संरक्षण का विवरण।"
  },
  {
    slug: "rti-transparency",
    title: "Right to Information (RTI) Node",
    description: "Deep study of filing protocols, appeals, and forensic exemption audits.",
    icon: Search,
    category: "Public",
    content: "Detailed content... --- **हिन्दी में:** --- सूचना का अधिकार का विवरण।"
  },
  {
    slug: "medical-negligence",
    title: "Medical Negligence & Healthcare Law",
    description: "Forensic audit of doctor-patient liability, ethics, and claim nodes.",
    icon: Stethoscope,
    category: "Public",
    content: "Detailed content... --- **हिन्दी में:** --- चिकित्सा लापरवाही का विवरण।"
  },
  {
    slug: "human-rights-commission",
    title: "NHRC & State HR Protocols",
    description: "Statutory powers of commissions and protection of human rights Act 1993.",
    icon: Users,
    category: "Public",
    content: "Detailed content... --- **हिन्दी में:** --- मानवाधिकार आयोग का विवरण।"
  },
  {
    slug: "lokpal-lokayukta-act",
    title: "Lokpal & Lokayukta Audit",
    description: "Anti-corruption statutory framework and investigation protocols.",
    icon: ShieldCheck,
    category: "Public",
    content: "Detailed content... --- **हिन्दी में:** --- लोकपाल और लोकायुक्त का विवरण।"
  },
  {
    slug: "election-laws-rp-act",
    title: "Representation of People Act Node",
    description: "Audit of election protocols, disqualification, and model conduct code.",
    icon: CheckSquare,
    category: "Public",
    content: "Detailed content... --- **हिन्दी में:** --- चुनाव कानूनों का विवरण।"
  },
  {
    slug: "municipal-laws-audit",
    title: "Municipal & Civic Statutory Framework",
    description: "Analysis of local body powers, taxation, and civic administrative nodes.",
    icon: Building,
    category: "Public",
    content: "Detailed content... --- **हिन्दी में:** --- नगर पालिका कानूनों का विवरण।"
  },
  {
    slug: "disaster-management-act",
    title: "Disaster Management Protocols",
    description: "Statutory framework for NDMA, SDMA, and institutional response nodes.",
    icon: Flame,
    category: "Public",
    content: "Detailed content... --- **हिन्दी में:** --- आपदा प्रबंधन अधिनियम का विवरण।"
  },

  // SPECIALIZED (49-56)
  {
    slug: "maritime-law",
    title: "Maritime & Admiralty Jurisprudence",
    description: "Specialized study of high-seas legal protocols and ship arrests.",
    icon: Anchor,
    category: "Specialized",
    content: "Detailed content... --- **हिन्दी में:** --- समुद्री कानून का विवरण।"
  },
  {
    slug: "aviation-law",
    title: "Aviation Law & Aircraft Statutes",
    description: "Regulatory framework for Indian airspace, carriers, and consumer rights.",
    icon: Plane,
    category: "Specialized",
    content: "Detailed content... --- **हिन्दी में:** --- विमानन कानून का विवरण।"
  },
  {
    slug: "sports-law-contracts",
    title: "Sports Law & Athlete Contracts",
    description: "Statutory mapping of doping protocols, ADR, and broadcasting rights.",
    icon: Trophy,
    category: "Specialized",
    content: "Detailed content... --- **हिन्दी में:** --- खेल कानून का विवरण।"
  },
  {
    slug: "space-law-satellites",
    title: "Space Law & Satellite Regulation",
    description: "Forensic study of outer space treaties and Indian space policy nodes.",
    icon: Globe,
    category: "Specialized",
    content: "Detailed content... --- **हिन्दी में:** --- अंतरिक्ष कानून का विवरण।"
  },
  {
    slug: "media-law-ethics",
    title: "Media & Entertainment Statutes",
    description: "Audit of censorship, defamation, and cinematography Act protocols.",
    icon: Newspaper,
    category: "Specialized",
    content: "Detailed content... --- **हिन्दी में:** --- मीडिया कानून का विवरण।"
  },
  {
    slug: "energy-renewable-laws",
    title: "Energy & Renewable Statutory Node",
    description: "Analysis of the Electricity Act 2003 and green energy regulatory cycles.",
    icon: Zap,
    category: "Specialized",
    content: "Detailed content... --- **हिन्दी में:** --- ऊर्जा कानूनों का विवरण।"
  },
  {
    slug: "animal-welfare-act",
    title: "Animal Welfare & Wildlife Statutes",
    description: "Audit of PCA Act 1960 and Wildlife Protection Act forensics.",
    icon: Heart,
    category: "Specialized",
    content: "Detailed content... --- **हिन्दी में:** --- पशु कल्याण अधिनियम का विवरण।"
  },
  {
    slug: "intellectual-property-it",
    title: "Patent Forensics in Technology",
    description: "Specialized study of software patentability and source code statutory nodes.",
    icon: Cpu,
    category: "Specialized",
    content: "Detailed content... --- **हिन्दी में:** --- प्रौद्योगिकी पेटेंट का विवरण।"
  },

  // INDUSTRIAL (57-64)
  {
    slug: "labor-codes",
    title: "New Labor Codes 2020",
    description: "Audit of wage regulation, social security, and industrial relations codes.",
    icon: HardHat,
    category: "Industrial",
    content: "Detailed content... --- **हिन्दी में:** --- नए श्रम कोड का विवरण।"
  },
  {
    slug: "posh-act-2013",
    title: "POSH Act & Workplace Audit",
    description: "Audit of internal committee protocols and employer liability nodes.",
    icon: Shield,
    category: "Industrial",
    content: "Detailed content... --- **हिन्दी में:** --- POSH अधिनियम का विवरण।"
  },
  {
    slug: "factory-act-safety",
    title: "Factories Act & Industrial Safety",
    description: "Statutory framework for health, welfare, and safety of industrial workers.",
    icon: Factory,
    category: "Industrial",
    content: "Detailed content... --- **हिन्दी में:** --- कारखाना अधिनियम का विवरण।"
  },
  {
    slug: "trade-union-statutes",
    title: "Trade Union & Collective Bargaining",
    description: "Audit of registration rights, immunities, and industrial dispute nodes.",
    icon: Users,
    category: "Industrial",
    content: "Detailed content... --- **हिन्दी में:** --- ट्रेड यूनियन का विवरण।"
  },
  {
    slug: "workmen-compensation",
    title: "Employees Compensation Audit",
    description: "Forensic mapping of liability for injury and occupational disease protocols.",
    icon: HeartHandshake,
    category: "Industrial",
    content: "Detailed content... --- **हिन्दी में:** --- कर्मचारी मुआवजा का विवरण।"
  },
  {
    slug: "industrial-disputes-act",
    title: "Industrial Disputes Resolution Node",
    description: "Statutory procedures for strikes, lock-outs, and lay-off forensics.",
    icon: Gavel,
    category: "Industrial",
    content: "Detailed content... --- **हिन्दी में:** --- औद्योगिक विवाद का विवरण।"
  },
  {
    slug: "maternity-benefit-act",
    title: "Maternity Benefit Statutory Node",
    description: "Audit of leave entitlements, creche facilities, and statutory protections.",
    icon: Baby,
    category: "Industrial",
    content: "Detailed content... --- **हिन्दी में:** --- मातृत्व लाभ अधिनियम का विवरण।"
  },
  {
    slug: "bonus-gratuity-audit",
    title: "Bonus & Gratuity Calculation Node",
    description: "Statutory framework for payment of bonus and gratuity entitlements.",
    icon: Coins,
    category: "Industrial",
    content: "Detailed content... --- **हिन्दी में:** --- बोनस और ग्रेच्युटी का विवरण।"
  }
];