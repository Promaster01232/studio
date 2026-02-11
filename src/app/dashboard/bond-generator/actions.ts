"use server";

import { generateBondDocument, type GenerateBondDocumentOutput } from "@/ai/flows/generate-bond-document";

export type BondGeneratorState = {
  status: "idle" | "loading" | "success" | "error";
  data: GenerateBondDocumentOutput | null;
  error: string | null;
};

// Helper function to get form data
const get = (formData: FormData, key: string) => formData.get(key)?.toString().trim() || '';

export async function generateBondAction(
  prevState: BondGeneratorState,
  formData: FormData
): Promise<BondGeneratorState> {

  const bondType = get(formData, 'bondType');
  if (!bondType) {
    return { status: 'error', data: null, error: 'Please select a bond type.' };
  }

  let details = '';
  let validationError = '';

  switch (bondType) {
    case 'Bail Bond': {
      const caseNumber = get(formData, 'caseNumber');
      const courtName = get(formData, 'courtName');
      const bondAmount = get(formData, 'bondAmount');
      const accusedName = get(formData, 'accusedName');
      const accusedAddress = get(formData, 'accusedAddress');
      const suretyName = get(formData, 'suretyName');
      const suretyAddress = get(formData, 'suretyAddress');

      if (!caseNumber || !courtName || !bondAmount || !accusedName || !accusedAddress || !suretyName || !suretyAddress) {
        validationError = "Please fill all required fields for the Bail Bond.";
        break;
      }

      details = `
        Bond Type: Bail Bond
        ---
        CASE & COURT DETAILS:
        Case / FIR No.: ${caseNumber}
        Court Name: ${courtName}
        Bond Amount: ${bondAmount}
        ---
        ACCUSED PERSON'S DETAILS:
        Name: ${accusedName}
        Address: ${accusedAddress}
        ---
        SURETY'S DETAILS:
        Name: ${suretyName}
        Address: ${suretyAddress}
      `;
      break;
    }
    case 'Indemnity Bond': {
        const indemnifierName = get(formData, 'indemnifierName');
        const indemnifierAddress = get(formData, 'indemnifierAddress');
        const indemnityHolderName = get(formData, 'indemnityHolderName');
        const indemnityHolderAddress = get(formData, 'indemnityHolderAddress');
        const indemnityDetails = get(formData, 'indemnityDetails');
        
        if (!indemnifierName || !indemnifierAddress || !indemnityHolderName || !indemnityHolderAddress || !indemnityDetails) {
            validationError = "Please fill all required fields for the Indemnity Bond.";
            break;
        }

        details = `
            Bond Type: Indemnity Bond
            ---
            INDEMNIFIER'S DETAILS:
            Name: ${indemnifierName}
            Address: ${indemnifierAddress}
            ---
            INDEMNITY HOLDER'S DETAILS:
            Name: ${indemnityHolderName}
            Address: ${indemnityHolderAddress}
            ---
            BOND DETAILS:
            Purpose of Indemnity: ${indemnityDetails}
            Indemnity Amount: ${get(formData, 'bondAmount') || 'Not Specified'}
        `;
        break;
    }
    case 'Surety Bond': {
        const principalName = get(formData, 'principalName');
        const principalAddress = get(formData, 'principalAddress');
        const obligeeName = get(formData, 'obligeeName');
        const obligeeAddress = get(formData, 'obligeeAddress');
        const suretyName = get(formData, 'suretyName');
        const suretyAddress = get(formData, 'suretyAddress');
        const bondPurpose = get(formData, 'bondPurpose');
        const bondAmount = get(formData, 'bondAmount');
        
        if (!principalName || !principalAddress || !obligeeName || !obligeeAddress || !suretyName || !suretyAddress || !bondPurpose || !bondAmount) {
            validationError = "Please fill all required fields for the Surety Bond.";
            break;
        }

        details = `
            Bond Type: Surety Bond
            ---
            PRINCIPAL'S DETAILS:
            Name: ${principalName}
            Address: ${principalAddress}
            ---
            OBLIGEE'S DETAILS:
            Name: ${obligeeName}
            Address: ${obligeeAddress}
            ---
            SURETY'S DETAILS:
            Name: ${suretyName}
            Address: ${suretyAddress}
            ---
            BOND DETAILS:
            Purpose of Bond: ${bondPurpose}
            Bond Amount: ${bondAmount}
        `;
        break;
    }
    case 'Affidavit': {
        const deponentName = get(formData, 'deponentName');
        const deponentAddress = get(formData, 'deponentAddress');
        const statementOfFacts = get(formData, 'statementOfFacts');
        const verificationPlace = get(formData, 'verificationPlace');
        const verificationDate = get(formData, 'verificationDate');

        if (!deponentName || !deponentAddress || !statementOfFacts || !verificationPlace || !verificationDate) {
            validationError = "Please fill all required fields for the Affidavit.";
            break;
        }

        details = `
            Document Type: Affidavit
            ---
            DEPONENT'S DETAILS:
            Name: ${deponentName}
            Address: ${deponentAddress}
            ---
            AFFIDAVIT DETAILS:
            Statement of Facts: ${statementOfFacts}
            ---
            VERIFICATION:
            Place: ${verificationPlace}
            Date: ${verificationDate}
        `;
        break;
    }
    default:
      return { status: 'error', data: null, error: 'Invalid bond type selected.' };
  }

  if (validationError) {
    return { status: 'error', data: null, error: validationError };
  }

  try {
    const result = await generateBondDocument({
      bondType,
      language: "Simple English", // Hardcoded for a cleaner UI
      details,
    });
    return { status: "success", data: result, error: null };
  } catch (error) {
    console.error(error);
    return { status: "error", data: null, error: "Failed to generate the document. Please try again." };
  }
}
