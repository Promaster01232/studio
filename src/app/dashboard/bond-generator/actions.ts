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
  const language = get(formData, 'language') || 'Simple English';

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
    case 'Personal Bond': {
        const caseNumber = get(formData, 'caseNumber');
        const courtName = get(formData, 'courtName');
        const accusedName = get(formData, 'accusedName');
        const accusedAddress = get(formData, 'accusedAddress');
        const bondAmount = get(formData, 'bondAmount');
        const conditions = get(formData, 'conditions');
  
        if (!caseNumber || !courtName || !accusedName || !accusedAddress || !bondAmount) {
          validationError = "Please fill all required fields for the Personal Bond.";
          break;
        }
  
        details = `
          Bond Type: Personal Bond (Self-Surety)
          ---
          CASE & COURT DETAILS:
          Case / FIR No.: ${caseNumber}
          Court Name: ${courtName}
          ---
          ACCUSED PERSON'S DETAILS:
          Name: ${accusedName}
          Address: ${accusedAddress}
          ---
          BOND DETAILS:
          Bond Amount: ${bondAmount}
          Conditions: ${conditions || 'Standard bail conditions apply.'}
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
    case 'Performance Bond': {
        const obligorName = get(formData, 'obligorName');
        const obligorAddress = get(formData, 'obligorAddress');
        const obligeeName = get(formData, 'obligeeName');
        const obligeeAddress = get(formData, 'obligeeAddress');
        const projectDetails = get(formData, 'projectDetails');
        const bondAmount = get(formData, 'bondAmount');
        const expiryDate = get(formData, 'expiryDate');
  
        if (!obligorName || !obligorAddress || !obligeeName || !obligeeAddress || !projectDetails || !bondAmount) {
          validationError = "Please fill all required fields for the Performance Bond.";
          break;
        }
  
        details = `
          Bond Type: Performance Bond
          ---
          OBLIGOR'S DETAILS (Contractor):
          Name: ${obligorName}
          Address: ${obligorAddress}
          ---
          OBLIGEE'S DETAILS (Client):
          Name: ${obligeeName}
          Address: ${obligeeAddress}
          ---
          BOND DETAILS:
          Project/Contract: ${projectDetails}
          Bond Amount: ${bondAmount}
          Expiry Date: ${expiryDate || 'N/A'}
        `;
        break;
      }
      case 'Mortgage Bond': {
        const mortgagorName = get(formData, 'mortgagorName');
        const mortgagorAddress = get(formData, 'mortgagorAddress');
        const mortgageeName = get(formData, 'mortgageeName');
        const mortgageeAddress = get(formData, 'mortgageeAddress');
        const propertyDetails = get(formData, 'propertyDetails');
        const loanAmount = get(formData, 'loanAmount');
  
        if (!mortgagorName || !mortgagorAddress || !mortgageeName || !mortgageeAddress || !propertyDetails || !loanAmount) {
          validationError = "Please fill all required fields for the Mortgage Bond.";
          break;
        }
  
        details = `
          Bond Type: Mortgage Bond
          ---
          MORTGAGOR'S DETAILS (Borrower):
          Name: ${mortgagorName}
          Address: ${mortgagorAddress}
          ---
          MORTGAGEE'S DETAILS (Lender):
          Name: ${mortgageeName}
          Address: ${mortgageeAddress}
          ---
          BOND DETAILS:
          Property Description: ${propertyDetails}
          Loan Amount: ${loanAmount}
          Interest Rate: ${get(formData, 'interestRate') || 'As per agreement'}
        `;
        break;
      }
      case 'Employment Bond': {
        const employeeName = get(formData, 'employeeName');
        const employeeAddress = get(formData, 'employeeAddress');
        const employerName = get(formData, 'employerName');
        const employerAddress = get(formData, 'employerAddress');
        const bondDuration = get(formData, 'bondDuration');
        const penaltyAmount = get(formData, 'bondAmount');
  
        if (!employeeName || !employeeAddress || !employerName || !employerAddress || !bondDuration || !penaltyAmount) {
          validationError = "Please fill all required fields for the Employment Bond.";
          break;
        }
  
        details = `
          Bond Type: Employment Bond
          ---
          EMPLOYEE'S DETAILS:
          Name: ${employeeName}
          Address: ${employeeAddress}
          ---
          EMPLOYER'S DETAILS:
          Name: ${employerName}
          Address: ${employerAddress}
          ---
          BOND DETAILS:
          Position/Role: ${get(formData, 'position') || 'Employee'}
          Bond Duration (Years/Months): ${bondDuration}
          Penalty Amount: ${penaltyAmount}
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
      language,
      details,
    });
    return { status: "success", data: result, error: null };
  } catch (error) {
    console.error(error);
    return { status: "error", data: null, error: "Failed to generate the document. Please try again." };
  }
}
