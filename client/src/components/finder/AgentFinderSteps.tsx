import FormStep from "./FormStep";
import { AgentFormData } from "@/types/finder";
import CheckboxGroup from "./formFields/CheckboxGroup";
import RadioGroup from "./formFields/RadioGroup";
import PropertyTypeSelect from "./formFields/PropertyTypeSelect";
import InvestmentDetailsFields from "./formFields/InvestmentDetailsFields";
import ContactFormExtended from "./formFields/ContactFormExtended";
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

      {/* Step 2: Location and Property Type */}
      <FormStep
        isActive={currentStep === 2}
        onNext={onNext}
        onPrevious={onPrevious}
        formData={formData}
        updateFormData={updateFormData}
        stepNumber={2}
        finderType="agent"
        isValid={formData.location.trim() !== '' && formData.property_type.trim() !== ''}
        errors={errors}
        title="Property Location & Type"
        subtitle="Where & what are you looking to invest in?"
      >
        <div className="space-y-6">
          <div className="mb-4">
            <Label htmlFor="location" className="font-medium">
              Where are you looking to invest?
            </Label>
            <Input 
              id="location"
              placeholder="City, state, or zip code (e.g. Colorado Springs, CO)"
              value={formData.location}
              onChange={(e) => updateFormData({ location: e.target.value })}
              className={`w-full ${errors.location ? "border-red-500" : ""}`}
            />
            {errors.location && (
              <p className="text-red-500 text-sm mt-2">{errors.location}</p>
            )}
          </div>
          
          <div className="mt-4">
            <PropertyTypeSelect
              selectedValue={formData.property_type}
              onChange={(value) => updateFormData({ property_type: value })}
              error={errors.property_type}
            />
          </div>
          
          <div className="mt-4">
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
        </div>
      </FormStep>

      {/* Step 3: Timeline and Purchase Details */}
      <FormStep
        isActive={currentStep === 3}
        onNext={onNext}
        onPrevious={onPrevious}
        formData={formData}
        updateFormData={updateFormData}
        stepNumber={3}
        finderType="agent"
        isValid={
          !!formData.purchase_timeline && 
          formData.price_min.trim() !== '' && 
          formData.price_max.trim() !== '' &&
          formData.investment_properties_count.trim() !== ''
        }
        errors={errors}
        title="Purchase Details"
        subtitle="Tell us about your investment timeline and budget"
      >
        <div className="space-y-6">
          <div>
            <Label className="font-medium mb-2 block">
              When are you looking to purchase in {formData.location}?
            </Label>
            <RadioGroup
              options={[
                { value: "asap", label: agentTimelineLabels.asap },
                { value: "1_3_months", label: agentTimelineLabels["1_3_months"] },
                { value: "3_6_months", label: agentTimelineLabels["3_6_months"] },
                { value: "6_12_months", label: agentTimelineLabels["6_12_months"] },
                { value: "just_researching", label: agentTimelineLabels.just_researching }
              ]}
              selectedValue={formData.purchase_timeline}
              onChange={(value) => updateFormData({ purchase_timeline: value as any })}
              name="agent_purchase_timeline"
            />
            {errors.purchase_timeline && (
              <p className="text-red-500 text-sm mt-2">{errors.purchase_timeline}</p>
            )}
          </div>
          
          <InvestmentDetailsFields
            priceMin={formData.price_min}
            priceMax={formData.price_max}
            loanStarted={formData.loan_started}
            propertyCount={formData.investment_properties_count}
            onPriceMinChange={(value) => updateFormData({ price_min: value })}
            onPriceMaxChange={(value) => updateFormData({ price_max: value })}
            onLoanStartedChange={(value) => updateFormData({ loan_started: value })}
            onPropertyCountChange={(value) => updateFormData({ investment_properties_count: value })}
            errors={{
              priceMin: errors.price_min,
              priceMax: errors.price_max,
              propertyCount: errors.investment_properties_count
            }}
          />
        </div>
      </FormStep>

      {/* Step 4: Investment Strategy */}
      <FormStep
        isActive={currentStep === 4}
        onNext={onNext}
        onPrevious={onPrevious}
        formData={formData}
        updateFormData={updateFormData}
        stepNumber={4}
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
          !!formData.contact.city.trim() &&
          !!formData.contact.state.trim() &&
          !!formData.contact.zip.trim() &&
          formData.terms_accepted
        }
        errors={errors}
        title="What's your contact info?"
        subtitle="On the next page you will see your agent matches & bios to be able to select who, if anyone, gets your investment answers and contact details."
        nextLabel="Review"
      >
        <div className="space-y-6">
          <ContactFormExtended
            name={formData.contact.name}
            email={formData.contact.email}
            phone={formData.contact.phone}
            city={formData.contact.city}
            state={formData.contact.state}
            zip={formData.contact.zip}
            onNameChange={(value) => updateFormData({ 
              contact: { ...formData.contact, name: value } 
            })}
            onEmailChange={(value) => updateFormData({ 
              contact: { ...formData.contact, email: value } 
            })}
            onPhoneChange={(value) => updateFormData({ 
              contact: { ...formData.contact, phone: value } 
            })}
            onCityChange={(value) => updateFormData({ 
              contact: { ...formData.contact, city: value } 
            })}
            onStateChange={(value) => updateFormData({ 
              contact: { ...formData.contact, state: value } 
            })}
            onZipChange={(value) => updateFormData({ 
              contact: { ...formData.contact, zip: value } 
            })}
            errors={{
              name: errors['contact.name'],
              email: errors['contact.email'],
              phone: errors['contact.phone'],
              city: errors['contact.city'],
              state: errors['contact.state'],
              zip: errors['contact.zip']
            }}
          />
          
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
                I agree to the <a href="#" className="text-blue-500 hover:text-blue-700">Terms of Service</a> and <a href="#" className="text-blue-500 hover:text-blue-700">Privacy Policy</a>. I consent to be contacted by real estate professionals.
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
