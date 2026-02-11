"use server";

import { generateLegalDocument, type GenerateLegalDocumentOutput } from "@/ai/flows/generate-legal-documents";

export type DocumentGeneratorState = {
  status: "idle" | "loading" | "success" | "error";
  data: GenerateLegalDocumentOutput | null;
  error: string | null;
};

// Helper function to get form data
const get = (formData: FormData, key: string) => formData.get(key)?.toString().trim() || '';

export async function generateDocumentAction(
  prevState: DocumentGeneratorState,
  formData: FormData
): Promise<DocumentGeneratorState> {

  const documentType = get(formData, 'documentType');
  if (!documentType) {
    return { status: 'error', data: null, error: 'Please select a document type.' };
  }

  let details = '';
  let validationError = '';

  switch (documentType) {
    case 'Legal Notice': {
      const senderName = get(formData, 'senderName');
      const senderAddress = get(formData, 'senderAddress');
      const recipientName = get(formData, 'recipientName');
      const recipientAddress = get(formData, 'recipientAddress');
      const caseDetails = get(formData, 'caseDetails');
      const remedySought = get(formData, 'remedySought');

      if (!senderName || !senderAddress || !recipientName || !recipientAddress || !caseDetails || !remedySought) {
        validationError = "Please fill all required fields for the Legal Notice.";
        break;
      }

      details = `
        Document Type: Legal Notice
        ---
        SENDER'S DETAILS:
        Name: ${senderName}
        Mobile: ${get(formData, 'senderMobile') || 'Not Provided'}
        Address: ${senderAddress}
        ---
        RECIPIENT'S DETAILS:
        Name: ${recipientName}
        Address: ${recipientAddress}
        ---
        NOTICE DETAILS:
        Facts of the Case: ${caseDetails}
        Relief Claimed: ${remedySought}
      `;
      break;
    }
    case 'Police Complaint':
    case 'FIR Application': {
      const complainantName = get(formData, 'complainantName');
      const complainantAddress = get(formData, 'complainantAddress');
      const incidentDate = get(formData, 'incidentDate');
      const incidentPlace = get(formData, 'incidentPlace');
      const caseDetails = get(formData, 'caseDetails');

       if (!complainantName || !complainantAddress || !incidentDate || !incidentPlace || !caseDetails) {
        validationError = `Please fill all required fields for the ${documentType}.`;
        break;
      }
      
      details = `
        Document Type: ${documentType}
        ---
        COMPLAINANT'S DETAILS:
        Name: ${complainantName}
        Address: ${complainantAddress}
        ---
        INCIDENT DETAILS:
        Date and Time: ${incidentDate}
        Place of Incident: ${incidentPlace}
        Description: ${caseDetails}
        Accused Person(s): ${get(formData, 'accusedDetails') || 'Unknown'}
      `;
      break;
    }
    case 'Consumer Complaint': {
        const complainantName = get(formData, 'complainantName');
        const complainantAddress = get(formData, 'complainantAddress');
        const sellerName = get(formData, 'sellerName');
        const sellerAddress = get(formData, 'sellerAddress');
        const productDetails = get(formData, 'productDetails');
        const caseDetails = get(formData, 'caseDetails');
        const remedySought = get(formData, 'remedySought');
        
        if (!complainantName || !complainantAddress || !sellerName || !sellerAddress || !productDetails || !caseDetails || !remedySought) {
            validationError = "Please fill all required fields for the Consumer Complaint.";
            break;
        }

        details = `
            Document Type: Consumer Complaint
            ---
            COMPLAINANT'S DETAILS:
            Name: ${complainantName}
            Address: ${complainantAddress}
            ---
            SELLER/COMPANY DETAILS:
            Name: ${sellerName}
            Address: ${sellerAddress}
            ---
            COMPLAINT DETAILS:
            Product/Service: ${productDetails}
            Nature of Complaint: ${caseDetails}
            Relief Sought: ${remedySought}
        `;
        break;
    }
    case 'RTI Application': {
        const applicantName = get(formData, 'applicantName');
        const applicantAddress = get(formData, 'applicantAddress');
        const departmentAddress = get(formData, 'departmentAddress');
        const caseDetails = get(formData, 'caseDetails');

        if (!applicantName || !applicantAddress || !departmentAddress || !caseDetails) {
            validationError = "Please fill all required fields for the RTI Application.";
            break;
        }

        details = `
            Document Type: RTI Application
            ---
            APPLICANT'S DETAILS:
            Name: ${applicantName}
            Address: ${applicantAddress}
            ---
            AUTHORITY DETAILS:
            Public Information Officer: ${get(formData, 'pioName') || 'Not Specified'}
            Department/Office Address: ${departmentAddress}
            ---
            INFORMATION REQUESTED:
            ${caseDetails}
        `;
        break;
    }
    default:
      return { status: 'error', data: null, error: 'Invalid document type selected.' };
  }

  if (validationError) {
    return { status: 'error', data: null, error: validationError };
  }

  try {
    const result = await generateLegalDocument({
      documentType,
      language: "Simple English", // Hardcoded for a cleaner UI
      details,
    });
    return { status: "success", data: result, error: null };
  } catch (error) {
    console.error(error);
    return { status: "error", data: null, error: "Failed to generate the document. Please try again." };
  }
}
