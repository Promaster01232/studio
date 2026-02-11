import {
  Shield,
  Gavel,
  Users,
  FileText,
  Search,
  FileStack,
  FileUp,
  Briefcase
} from "lucide-react";

export const guides = [
  {
    slug: "fir-complaints",
    title: "FIR & Complaints",
    description: "Step-by-step guide to filing a First Information Report.",
    icon: Shield,
    gradient: "bg-gradient-to-br from-cyan-400 to-teal-600",
    content: "Detailed content about filing an FIR and complaints goes here. This section will explain the process, what documents are needed, and what to do if the police refuse to register your FIR."
  },
  {
    slug: "arrest-bail-process",
    title: "Arrest & Bail Process",
    description: "Your rights and procedures during arrest and applying for bail.",
    icon: Gavel,
    gradient: "bg-gradient-to-br from-orange-400 to-amber-600",
    content: "This guide covers your rights when arrested by the police, the legal procedures for bail, and the different types of bail available under Indian law."
  },
  {
    slug: "courtroom-decorum",
    title: "Courtroom Decorum",
    description: "Rules of conduct and etiquette inside the courtroom.",
    icon: Users,
    gradient: "bg-gradient-to-br from-rose-400 to-pink-600",
    content: "Learn the proper conduct and etiquette to be followed inside a courtroom. This includes how to address the judge, where to stand, and what not to do during a hearing."
  },
  {
    slug: "courtroom-warrants",
    title: "Courtroom Warrants",
    description: "Understanding legal documents and warrants inside the court.",
    icon: FileText,
    gradient: "bg-gradient-to-br from-purple-400 to-violet-600",
    content: "An explanation of various legal documents like summons and warrants, what they mean, and what you should do upon receiving one."
  },
  {
    slug: "evidence-guidelines",
    title: "Evidence Guidelines",
    description: "Guidelines for presenting digital and physical evidence.",
    icon: Search,
    gradient: "bg-gradient-to-br from-yellow-300 to-lime-500 text-black",
    content: "This guide explains the rules of evidence, what is admissible in court, and how to properly present both physical and digital evidence to support your case."
  },
  {
    slug: "summons-warrants",
    title: "Summons & Warrants",
    description: "Understanding the difference and procedures for summons and warrants.",
    icon: FileStack,
    gradient: "bg-gradient-to-br from-sky-400 to-blue-600",
    content: "A detailed look at summons and warrants, their legal implications, and the correct procedures to follow when you are served with one."
  },
  {
    slug: "evidence-submission",
    title: "Evidence Submission",
    description: "Guidelines for presenting and submitting evidence correctly in court.",
    icon: FileUp,
    gradient: "bg-gradient-to-br from-emerald-400 to-green-600",
    content: "A practical guide on how to submit evidence to the court. This covers formatting, chain of custody, and other procedural requirements to ensure your evidence is accepted."
  },
  {
    slug: "public-prosecutor-role",
    title: "Public Prosecutor Role",
    description: "Understanding the role and responsibilities of the state's lawyer.",
    icon: Briefcase,
    gradient: "bg-gradient-to-br from-indigo-400 to-fuchsia-500",
    content: "This guide explains the crucial role of a Public Prosecutor in the criminal justice system, their responsibilities, and how they represent the interests of the state."
  }
];
