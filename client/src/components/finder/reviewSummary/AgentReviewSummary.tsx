import { AgentFormData, agentTransactionTypeLabels, agentStrategyLabels, agentTimelineLabels } from "@/types/finder";

interface AgentReviewSummaryProps {
  formData: AgentFormData;
}

export default function AgentReviewSummary({ formData }: AgentReviewSummaryProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium text-neutral-darker">Transaction Type:</h3>
        <p className="mt-1 text-sm">
          {formData.transaction_type ? agentTransactionTypeLabels[formData.transaction_type] : ''}
        </p>
      </div>
      
      <div>
        <h3 className="font-medium text-neutral-darker">
          {formData.transaction_type === 'buy' 
            ? "Where you're looking to invest:" 
            : "Property location:"}
        </h3>
        <p className="mt-1 text-sm">{formData.location}</p>
        {/* We've removed the multiple locations option */}
        {formData.transaction_type === 'sell' && formData.property_address && (
          <div className="mt-2">
            <h3 className="font-medium text-neutral-darker">Property address:</h3>
            <p className="mt-1 text-sm">{formData.property_address}</p>
          </div>
        )}
      </div>
      
      <div>
        <h3 className="font-medium text-neutral-darker">Property Type:</h3>
        <p className="mt-1 text-sm">{formData.property_type}</p>
      </div>
      
      {formData.transaction_type === 'buy' && (
        <div>
          <h3 className="font-medium text-neutral-darker">Purchase Timeline:</h3>
          <p className="mt-1 text-sm">
            {formData.purchase_timeline ? agentTimelineLabels[formData.purchase_timeline] : ''}
          </p>
        </div>
      )}
      
      <div>
        <h3 className="font-medium text-neutral-darker">
          {formData.transaction_type === 'buy' ? 'Target Purchase Price Range:' : 'Target Sale Price Range:'}
        </h3>
        <p className="mt-1 text-sm">
          ${formData.price_min} - ${formData.price_max}
        </p>
      </div>
      
      {formData.transaction_type === 'buy' && (
        <div>
          <h3 className="font-medium text-neutral-darker">Loan Process Started:</h3>
          <p className="mt-1 text-sm">
            {formData.loan_started ? 'Yes' : 'No'}
          </p>
        </div>
      )}
      
      <div>
        <h3 className="font-medium text-neutral-darker">Owner Occupied:</h3>
        <p className="mt-1 text-sm">
          {formData.owner_occupied ? 'Yes' : 'No'}
        </p>
      </div>
      
      <div>
        <h3 className="font-medium text-neutral-darker">Investment Properties Owned:</h3>
        <p className="mt-1 text-sm">{formData.investment_properties_count}</p>
      </div>
      
      {formData.transaction_type === 'buy' && (
        <>
          <div>
            <h3 className="font-medium text-neutral-darker">Your investment strategy:</h3>
            <ul className="mt-1 list-disc list-inside text-sm pl-2">
              {formData.strategy.map((strategy) => (
                <li key={strategy}>{agentStrategyLabels[strategy]}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-neutral-darker">General investment timeline:</h3>
            <p className="mt-1 text-sm">
              {formData.timeline ? agentTimelineLabels[formData.timeline] : ''}
            </p>
          </div>
        </>
      )}
      
      <div>
        <h3 className="font-medium text-neutral-darker">Your contact information:</h3>
        <p className="mt-1 text-sm whitespace-pre-line">
          {formData.contact.first_name} {formData.contact.last_name}<br/>
          {formData.contact.email}<br/>
          {formData.contact.phone}<br/>
          {formData.contact.city}, {formData.contact.state} {formData.contact.zip}
        </p>
      </div>
    </div>
  );
}
