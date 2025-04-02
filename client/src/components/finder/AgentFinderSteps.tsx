import FormStep from "./FormStep";
import { AgentFormData, AgentTransactionType } from "@/types/finder";
import RadioGroup from "./formFields/RadioGroup";
import PropertyTypeSelect from "./formFields/PropertyTypeSelect";
import InvestmentDetailsFields from "./formFields/InvestmentDetailsFields";
import ContactFormExtended from "./formFields/ContactFormExtended";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import CheckboxGroup from "./formFields/CheckboxGroup";
import { 
  agentTransactionTypeLabels,
  agentTransactionTypeDescriptions,
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
      {/* Step 1: Transaction Type */}
      <FormStep
        isActive={currentStep === 1}
        onNext={onNext}
        onPrevious={onPrevious}
        formData={formData}
        updateFormData={updateFormData}
        stepNumber={1}
        finderType="agent"
        isValid={!!formData.transaction_type}
        errors={errors}
        title="What are you looking to do?"
        subtitle="Select your real estate transaction goal"
        showPrevious={false}
      >
        <RadioGroup
          options={[
            { value: "buy", label: agentTransactionTypeLabels.buy, description: agentTransactionTypeDescriptions.buy },
            { value: "sell", label: agentTransactionTypeLabels.sell, description: agentTransactionTypeDescriptions.sell }
          ]}
          selectedValue={formData.transaction_type}
          onChange={(value) => updateFormData({ transaction_type: value as any })}
          name="agent_transaction_type"
        />
        {errors.transaction_type && (
          <p className="text-red-500 text-sm mt-2">{errors.transaction_type}</p>
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
        isValid={Boolean(formData.location && formData.location.trim() !== '' && 
          formData.property_type && formData.property_type.trim() !== '' && 
          (formData.transaction_type !== 'sell' || (formData.property_address && formData.property_address.trim() !== '')))}
        errors={errors}
        title={formData.transaction_type === 'buy' ? "Property Location & Type" : "Property Details"}
        subtitle={formData.transaction_type === 'buy' ? "Where & what are you looking to invest in?" : "Tell us about the property you want to sell"}
      >
        <div className="space-y-6">
          <div className="mb-4">
            <Label htmlFor="location" className="font-medium">
              {formData.transaction_type === 'buy' 
                ? "Where are you looking to invest?" 
                : "What city/region is your property located in?"}
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
          
          {formData.transaction_type === 'sell' && (
            <div className="mb-4">
              <Label htmlFor="property_address" className="font-medium">
                What is the property address?
              </Label>
              <Input 
                id="property_address"
                placeholder="Full property address"
                value={formData.property_address || ''}
                onChange={(e) => updateFormData({ property_address: e.target.value })}
                className={`w-full ${errors.property_address ? "border-red-500" : ""}`}
              />
              {errors.property_address && (
                <p className="text-red-500 text-sm mt-2">{errors.property_address}</p>
              )}
            </div>
          )}
          
          <div className="mt-4">
            <PropertyTypeSelect
              selectedValue={formData.property_type}
              onChange={(value) => updateFormData({ property_type: value })}
              error={errors.property_type}
            />
          </div>
          
        </div>
      </FormStep>

      {/* Step 3: Timeline and Purchase/Sale Details */}
      <FormStep
        isActive={currentStep === 3}
        onNext={onNext}
        onPrevious={onPrevious}
        formData={formData}
        updateFormData={updateFormData}
        stepNumber={3}
        finderType="agent"
        isValid={Boolean(
          (formData.transaction_type === 'buy' ? !!formData.purchase_timeline : true) && 
          formData.price_min && formData.price_min.trim() !== '' && 
          formData.price_max && formData.price_max.trim() !== '' &&
          formData.investment_properties_count && formData.investment_properties_count.trim() !== ''
        )}
        errors={errors}
        title={formData.transaction_type === 'buy' ? "Purchase Details" : "Sale Details"}
        subtitle={formData.transaction_type === 'buy' 
          ? "Tell us about your investment timeline and budget" 
          : "Tell us about your property sale expectations"}
      >
        <div className="space-y-6">
          {formData.transaction_type === 'buy' && (
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
          )}
          
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
            transactionType={formData.transaction_type}
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
            { value: "buy_and_hold_brrrr", label: agentStrategyLabels.buy_and_hold_brrrr, description: agentStrategyDescriptions.buy_and_hold_brrrr },
            { value: "short_term_rental", label: agentStrategyLabels.short_term_rental, description: agentStrategyDescriptions.short_term_rental },
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
        isValid={Boolean(
          formData.contact && 
          formData.contact.first_name && !!formData.contact.first_name.trim() && 
          formData.contact.last_name && !!formData.contact.last_name.trim() && 
          formData.contact.email && !!formData.contact.email.trim() && 
          formData.contact.phone && !!formData.contact.phone.trim() &&
          formData.contact.city && !!formData.contact.city.trim() &&
          formData.contact.state && !!formData.contact.state.trim() &&
          formData.contact.zip && !!formData.contact.zip.trim() &&
          formData.terms_accepted
        )}
        errors={errors}
        title="What's your contact info?"
        subtitle="On the next page you will see your agent matches & bios to be able to select who, if anyone, gets your investment answers and contact details."
        nextLabel="Review"
      >
        <div className="space-y-6">
          <ContactFormExtended
            first_name={formData.contact.first_name}
            last_name={formData.contact.last_name}
            email={formData.contact.email}
            phone={formData.contact.phone}
            city={formData.contact.city}
            state={formData.contact.state}
            zip={formData.contact.zip}
            onFirstNameChange={(value: string) => updateFormData({ 
              contact: { ...formData.contact, first_name: value } 
            })}
            onLastNameChange={(value: string) => updateFormData({ 
              contact: { ...formData.contact, last_name: value } 
            })}
            onEmailChange={(value: string) => updateFormData({ 
              contact: { ...formData.contact, email: value } 
            })}
            onPhoneChange={(value: string) => updateFormData({ 
              contact: { ...formData.contact, phone: value } 
            })}
            onCityChange={(value: string) => updateFormData({ 
              contact: { ...formData.contact, city: value } 
            })}
            onStateChange={(value: string) => updateFormData({ 
              contact: { ...formData.contact, state: value } 
            })}
            onZipChange={(value: string) => updateFormData({ 
              contact: { ...formData.contact, zip: value } 
            })}
            errors={{
              first_name: errors['contact.first_name'],
              last_name: errors['contact.last_name'],
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
                By entering your information and submitting this form, you agree to BiggerPockets <a href="#" className="text-blue-500 hover:text-blue-700">terms of service</a> and <a href="#" className="text-blue-500 hover:text-blue-700">privacy policy</a>. 
                
                <p className="mt-2 text-xs text-gray-600">
                  You also expressly consent to having BiggerPockets and its featured real estate professionals call or text you about your inquiry (including automatic telephone dialing system or an artificial or prerecorded voice) to the telephone number provided, even if that number is on a corporate, state, or national Do Not Call Registry. Message frequency varies, and message/data rates may apply. Text STOP to cancel. You don't need to consent as a condition of buying any property, goods or services.
                </p>
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
