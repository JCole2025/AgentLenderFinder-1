import FormStep from "./FormStep";
import { AgentFormData } from "@/types/finder";
import CheckboxGroup from "./formFields/CheckboxGroup";
import RadioGroup from "./formFields/RadioGroup";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { 
  agentInterestLabels, 
  agentInterestDescriptions,
  agentStrategyLabels,
  agentStrategyDescriptions,
  agentTimelineLabels
} from "@/types/finder";
import AgentReviewSummary from "./reviewSummary/AgentReviewSummary";

interface AgentFinderStepsProps {
  currentStep: number;
  formData: AgentFormData;
  updateFormData: (data: Partial<AgentFormData>) => void;
  onNext: () => void;
  onPrevious: () => void;
  onSubmit: () => void;
  errors: Record<string, any>;
  isValid: boolean;
}

export default function AgentFinderSteps({
  currentStep,
  formData,
  updateFormData,
  onNext,
  onPrevious,
  onSubmit,
  errors,
  isValid
}: AgentFinderStepsProps) {
  const handleInterestChange = (value: string, checked: boolean) => {
    if (checked) {
      updateFormData({ 
        interest: [...formData.interest, value as any] 
      });
    } else {
      updateFormData({ 
        interest: formData.interest.filter(i => i !== value) 
      });
    }
  };

  const handleStrategyChange = (value: string, checked: boolean) => {
    if (checked) {
      updateFormData({ 
        strategy: [...formData.strategy, value as any] 
      });
    } else {
      updateFormData({ 
        strategy: formData.strategy.filter(s => s !== value) 
      });
    }
  };

  return (
    <>
      {/* Step 1: Investment Interest */}
      <FormStep
        isActive={currentStep === 1}
        onNext={onNext}
        onPrevious={onPrevious}
        formData={formData}
        updateFormData={updateFormData}
        stepNumber={1}
        finderType="agent"
        isValid={formData.interest.length > 0}
        errors={errors}
        title="What are you interested in?"
        subtitle="Select all that apply"
        showPrevious={false}
      >
        <CheckboxGroup
          options={[
            { value: "buy_investment_property", label: agentInterestLabels.buy_investment_property, description: agentInterestDescriptions.buy_investment_property },
            { value: "sell_investment_property", label: agentInterestLabels.sell_investment_property, description: agentInterestDescriptions.sell_investment_property },
            { value: "primary_residence", label: agentInterestLabels.primary_residence, description: agentInterestDescriptions.primary_residence }
          ]}
          selectedValues={formData.interest}
          onChange={handleInterestChange}
        />
        {errors.interest && (
          <p className="text-red-500 text-sm mt-2">{errors.interest}</p>
        )}
      </FormStep>

      {/* Step 2: Location */}
      <FormStep
        isActive={currentStep === 2}
        onNext={onNext}
        onPrevious={onPrevious}
        formData={formData}
        updateFormData={updateFormData}
        stepNumber={2}
        finderType="agent"
        isValid={formData.location.trim() !== ''}
        errors={errors}
        title="Where are you looking to invest?"
        subtitle="Enter city, state, or zip code"
      >
        <div className="mb-4">
          <Input 
            placeholder="City, state, or zip code"
            value={formData.location}
            onChange={(e) => updateFormData({ location: e.target.value })}
            className="w-full"
          />
          {errors.location && (
            <p className="text-red-500 text-sm mt-2">{errors.location}</p>
          )}
        </div>
        
        <div className="mt-6">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="agent_multiple_locations"
              checked={formData.multiple_locations}
              onCheckedChange={(checked) => 
                updateFormData({ multiple_locations: checked as boolean })
              }
            />
            <Label
              htmlFor="agent_multiple_locations"
              className="font-medium"
            >
              I'm open to multiple locations
            </Label>
          </div>
        </div>
      </FormStep>

      {/* Step 3: Investment Strategy */}
      <FormStep
        isActive={currentStep === 3}
        onNext={onNext}
        onPrevious={onPrevious}
        formData={formData}
        updateFormData={updateFormData}
        stepNumber={3}
        finderType="agent"
        isValid={formData.strategy.length > 0}
        errors={errors}
        title="What is your investment strategy?"
        subtitle="Select all that apply"
      >
        <CheckboxGroup
          options={[
            { value: "buy_and_hold", label: agentStrategyLabels.buy_and_hold, description: agentStrategyDescriptions.buy_and_hold },
            { value: "fix_and_flip", label: agentStrategyLabels.fix_and_flip, description: agentStrategyDescriptions.fix_and_flip },
            { value: "brrrr", label: agentStrategyLabels.brrrr, description: agentStrategyDescriptions.brrrr },
            { value: "short_term_rental", label: agentStrategyLabels.short_term_rental, description: agentStrategyDescriptions.short_term_rental },
            { value: "multifamily", label: agentStrategyLabels.multifamily, description: agentStrategyDescriptions.multifamily },
            { value: "commercial", label: agentStrategyLabels.commercial, description: agentStrategyDescriptions.commercial },
            { value: "not_sure", label: agentStrategyLabels.not_sure, description: agentStrategyDescriptions.not_sure }
          ]}
          selectedValues={formData.strategy}
          onChange={handleStrategyChange}
        />
        {errors.strategy && (
          <p className="text-red-500 text-sm mt-2">{errors.strategy}</p>
        )}
      </FormStep>

      {/* Step 4: Timeline */}
      <FormStep
        isActive={currentStep === 4}
        onNext={onNext}
        onPrevious={onPrevious}
        formData={formData}
        updateFormData={updateFormData}
        stepNumber={4}
        finderType="agent"
        isValid={!!formData.timeline}
        errors={errors}
        title="What's your timeline?"
        subtitle="When are you looking to invest?"
      >
        <RadioGroup
          options={[
            { value: "asap", label: agentTimelineLabels.asap },
            { value: "1_3_months", label: agentTimelineLabels["1_3_months"] },
            { value: "3_6_months", label: agentTimelineLabels["3_6_months"] },
            { value: "6_12_months", label: agentTimelineLabels["6_12_months"] },
            { value: "just_researching", label: agentTimelineLabels.just_researching }
          ]}
          selectedValue={formData.timeline}
          onChange={(value) => updateFormData({ timeline: value as any })}
          name="agent_timeline"
        />
        {errors.timeline && (
          <p className="text-red-500 text-sm mt-2">{errors.timeline}</p>
        )}
      </FormStep>

      {/* Step 5: Contact Information */}
      <FormStep
        isActive={currentStep === 5}
        onNext={onNext}
        onPrevious={onPrevious}
        formData={formData}
        updateFormData={updateFormData}
        stepNumber={5}
        finderType="agent"
        isValid={
          !!formData.contact.name.trim() && 
          !!formData.contact.email.trim() && 
          !!formData.contact.phone.trim() && 
          formData.terms_accepted
        }
        errors={errors}
        title="Your contact information"
        subtitle="How can agents reach you?"
        nextLabel="Review"
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="agent_full_name" className="block text-sm font-medium text-neutral-darker mb-1">
              Full Name
            </Label>
            <Input
              id="agent_full_name"
              placeholder="Your full name"
              value={formData.contact.name}
              onChange={(e) => updateFormData({ 
                contact: { ...formData.contact, name: e.target.value } 
              })}
            />
            {errors['contact.name'] && (
              <p className="text-red-500 text-sm mt-1">{errors['contact.name']}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="agent_email" className="block text-sm font-medium text-neutral-darker mb-1">
              Email Address
            </Label>
            <Input
              id="agent_email"
              type="email"
              placeholder="your@email.com"
              value={formData.contact.email}
              onChange={(e) => updateFormData({ 
                contact: { ...formData.contact, email: e.target.value } 
              })}
            />
            {errors['contact.email'] && (
              <p className="text-red-500 text-sm mt-1">{errors['contact.email']}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="agent_phone" className="block text-sm font-medium text-neutral-darker mb-1">
              Phone Number
            </Label>
            <Input
              id="agent_phone"
              type="tel"
              placeholder="(555) 123-4567"
              value={formData.contact.phone}
              onChange={(e) => updateFormData({ 
                contact: { ...formData.contact, phone: e.target.value } 
              })}
            />
            {errors['contact.phone'] && (
              <p className="text-red-500 text-sm mt-1">{errors['contact.phone']}</p>
            )}
          </div>
          
          <div className="pt-2">
            <div className="flex items-start">
              <Checkbox
                id="agent_terms"
                checked={formData.terms_accepted}
                onCheckedChange={(checked) => 
                  updateFormData({ terms_accepted: checked as boolean })
                }
                className="mt-1"
              />
              <Label htmlFor="agent_terms" className="ml-3 text-sm">
                I agree to the <a href="#" className="text-primary">Terms of Service</a> and <a href="#" className="text-primary">Privacy Policy</a>. I consent to be contacted by real estate professionals.
              </Label>
            </div>
            {errors.terms_accepted && (
              <p className="text-red-500 text-sm mt-1">{errors.terms_accepted}</p>
            )}
          </div>
        </div>
      </FormStep>

      {/* Step 6: Review and Submit */}
      <FormStep
        isActive={currentStep === 6}
        onNext={onSubmit}
        onPrevious={onPrevious}
        formData={formData}
        updateFormData={updateFormData}
        stepNumber={6}
        finderType="agent"
        isValid={true}
        errors={errors}
        title="Review your information"
        subtitle="Please verify that everything is correct"
        nextLabel="Find Agents"
        showSubmit={true}
      >
        <AgentReviewSummary formData={formData} />
      </FormStep>
    </>
  );
}
