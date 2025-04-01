import { AgentFormData, agentInterestLabels, agentStrategyLabels, agentTimelineLabels } from "@/types/finder";

interface AgentReviewSummaryProps {
  formData: AgentFormData;
}

export default function AgentReviewSummary({ formData }: AgentReviewSummaryProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium text-neutral-darker">What you're interested in:</h3>
        <ul className="mt-1 list-disc list-inside text-sm pl-2">
          {formData.interest.map((interest) => (
            <li key={interest}>{agentInterestLabels[interest]}</li>
          ))}
        </ul>
      </div>
      
      <div>
        <h3 className="font-medium text-neutral-darker">Where you're looking to invest:</h3>
        <p className="mt-1 text-sm">{formData.location}</p>
        <p className="mt-1 text-sm">
          Open to multiple locations: {formData.multiple_locations ? 'Yes' : 'No'}
        </p>
      </div>
      
      <div>
        <h3 className="font-medium text-neutral-darker">Your investment strategy:</h3>
        <ul className="mt-1 list-disc list-inside text-sm pl-2">
          {formData.strategy.map((strategy) => (
            <li key={strategy}>{agentStrategyLabels[strategy]}</li>
          ))}
        </ul>
      </div>
      
      <div>
        <h3 className="font-medium text-neutral-darker">Your timeline:</h3>
        <p className="mt-1 text-sm">
          {formData.timeline ? agentTimelineLabels[formData.timeline] : ''}
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
