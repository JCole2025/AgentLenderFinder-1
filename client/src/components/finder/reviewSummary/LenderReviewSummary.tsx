import { 
  LenderFormData, 
  lenderLoanPurposeLabels, 
  lenderPropertyTypeLabels,
  lenderCreditScoreLabels
} from "@/types/finder";

interface LenderReviewSummaryProps {
  formData: LenderFormData;
}

export default function LenderReviewSummary({ formData }: LenderReviewSummaryProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium text-neutral-darker">Loan purpose:</h3>
        <p className="mt-1 text-sm">
          {formData.loan_purpose ? lenderLoanPurposeLabels[formData.loan_purpose] : ''}
        </p>
      </div>
      
      <div>
        <h3 className="font-medium text-neutral-darker">Property type:</h3>
        <p className="mt-1 text-sm">
          {formData.property_type ? lenderPropertyTypeLabels[formData.property_type] : ''}
        </p>
      </div>
      
      <div>
        <h3 className="font-medium text-neutral-darker">Property location:</h3>
        <p className="mt-1 text-sm">{formData.location}</p>
      </div>
      
      <div>
        <h3 className="font-medium text-neutral-darker">Credit score:</h3>
        <p className="mt-1 text-sm">
          {formData.credit_score ? lenderCreditScoreLabels[formData.credit_score] : ''}
        </p>
      </div>
      
      <div>
        <h3 className="font-medium text-neutral-darker">Your contact information:</h3>
        <p className="mt-1 text-sm whitespace-pre-line">
          {formData.contact.name}<br/>
          {formData.contact.email}<br/>
          {formData.contact.phone}
        </p>
      </div>
    </div>
  );
}
