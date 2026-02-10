import { PageHeader } from "@/components/page-header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const guides = [
  {
    title: "How to File an FIR (First Information Report)",
    content: "1. Go to the police station that has jurisdiction over the area where the crime occurred.\n2. Narrate the incident to the officer-in-charge. It is your right to have the FIR registered.\n3. The police officer will write down your complaint. You have the right to have it read out to you.\n4. Sign the FIR only after verifying that the details are correct.\n5. You are entitled to a free copy of the FIR. Always ask for it.",
  },
  {
    title: "What if the Police Refuse to File an FIR?",
    content: "1. You can send your complaint in writing to the Superintendent of Police (SP) or a higher-ranking officer by registered post.\n2. If the SP is satisfied that a cognizable offense is made out, they will either investigate the case themselves or direct a subordinate officer to do so.\n3. You can also file a private complaint before the Magistrate under Section 156(3) of the CrPC.",
  },
  {
    title: "Understanding 'Zero FIR'",
    content: "A Zero FIR can be filed in any police station, irrespective of jurisdiction, when a cognizable offense is committed. The station will register the FIR, mark it as a 'Zero FIR', and transfer it to the police station with the correct jurisdiction. This is crucial for immediate action, especially in cases of sexual assault or kidnapping.",
  },
  {
    title: "Your Rights During an Arrest",
    content: "1. Right to be informed of the grounds of arrest.\n2. Right to have a memo of arrest prepared, which should be attested by a family member or a respectable person from the locality.\n3. Right to inform a family member or friend about the arrest.\n4. Right to consult a lawyer of your choice.\n5. A woman can only be arrested by a woman police officer and cannot be arrested between sunset and sunrise, except in exceptional circumstances with a Magistrate's permission.",
  },
  {
    title: "Special Protections for Women and Minors",
    content: "1. A woman's statement, especially in cases of sexual offenses, must be recorded by a woman police officer.\n2. A minor (under 18) cannot be taken to a regular police station. They must be dealt with by the Juvenile Justice Board and interviewed by an officer in plain clothes.\n3. The identity of a victim of sexual assault cannot be disclosed.",
  },
];

export default function PoliceGuidePage() {
  return (
    <div>
      <PageHeader
        title="Police Process Guide"
        description="Know your rights and the correct procedures when dealing with the police."
      />
      <Card>
        <CardContent className="p-4 md:p-6">
          <Accordion type="single" collapsible className="w-full">
            {guides.map((guide, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger className="text-lg font-semibold text-left font-headline">
                  {guide.title}
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground whitespace-pre-line leading-relaxed">
                  {guide.content}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
