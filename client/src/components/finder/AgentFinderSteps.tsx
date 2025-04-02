import FormStep from "./FormStep";
import { AgentFormData, AgentTransactionType } from "@/types/finder";
import RadioGroup from "./formFields/RadioGroup";
import ButtonRadioGroup from "./formFields/ButtonRadioGroup";
import PropertyTypeSelect from "./formFields/PropertyTypeSelect";
import ButtonPropertySelect from "./formFields/ButtonPropertySelect";
import InvestmentDetailsFields from "./formFields/InvestmentDetailsFields";
import ContactFormExtended from "./formFields/ContactFormExtended";
import OwnerOccupiedButtons from "./formFields/OwnerOccupiedButtons";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import CheckboxGroup from "./formFields/CheckboxGroup";
import ButtonCheckboxGroup from "./formFields/ButtonCheckboxGroup";
import { 
  agentTransactionTypeLabels,
  agentTransactionTypeDescriptions,
  agentStrategyLabels,
  agentStrategyDescriptions,
  agentTimelineLabels
} from "@/types/finder";
import AgentReviewSummary from "./reviewSummary/AgentReviewSummary";
import { getLocationInputHelperText } from "@/lib/locationValidator";
import { formatPrice, getDefaultMinPrice } from "@/lib/priceValidator";

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
        
        isValid={!!formData.transaction_type}
        errors={errors}
        title="What would you like to do?"
        subtitle="Select your real estate transaction goal"
        showPrevious={false}
        showNext={false}
      >
        <ButtonRadioGroup
          options={[
            { value: "buy", label: "Buy Property", description: agentTransactionTypeDescriptions.buy },
            { value: "sell", label: "Sell Property", description: agentTransactionTypeDescriptions.sell }
          ]}
          selectedValue={formData.transaction_type}
          onChange={(value) => updateFormData({ 
            transaction_type: value as any,
            // Set default timeline to '3_6_months' instead of 'just_researching'
            timeline: '3_6_months' as any,
            purchase_timeline: '3_6_months' as any
          })}
          name="agent_transaction_type"
          autoAdvance={true}
          onNext={onNext}
        />
        {errors.transaction_type && (
          <p className="text-red-500 text-sm mt-2">{errors.transaction_type}</p>
        )}
      </FormStep>

      {/* Step 2: Property Type */}
      <FormStep
        isActive={currentStep === 2}
        onNext={onNext}
        onPrevious={onPrevious}
        formData={formData}
        updateFormData={updateFormData}
        stepNumber={2}
        
        isValid={Boolean(formData.property_type && formData.property_type.trim() !== '')}
        errors={errors}
        title={formData.transaction_type === 'buy' ? "What type of property are you looking for?" : "What type of property are you selling?"}
        subtitle="Select the property type"
        showNext={false}
      >
        <div className="space-y-6">
          <div className="mt-4">
            <ButtonPropertySelect
              selectedValue={formData.property_type}
              onChange={(value) => updateFormData({ property_type: value })}
              error={errors.property_type}
              autoAdvance={true}
              onNext={onNext}
            />
          </div>
        </div>
      </FormStep>

      {/* Step 3: Owner Occupied */}
      <FormStep
        isActive={currentStep === 3}
        onNext={onNext}
        onPrevious={onPrevious}
        formData={formData}
        updateFormData={updateFormData}
        stepNumber={3}
        
        isValid={true} // Not a required field
        errors={errors}
        title="Will this be an owner-occupied property?"
        subtitle="Let us know if you plan to live in this property"
        showNext={false} // Hide Next button as we auto-advance
      >
        <div className="space-y-6">
          <OwnerOccupiedButtons 
            isOwnerOccupied={formData.owner_occupied}
            onChange={(value) => updateFormData({ owner_occupied: value })}
            onNext={onNext}
          />
        </div>
      </FormStep>

      {/* Step 4: Location */}
      <FormStep
        isActive={currentStep === 4}
        onNext={onNext}
        onPrevious={onPrevious}
        formData={formData}
        updateFormData={updateFormData}
        stepNumber={4}
        
        isValid={Boolean(formData.location && formData.location.trim() !== '')}
        errors={errors}
        title={formData.transaction_type === 'buy' ? "Where are you looking to invest?" : "Where is your property located?"}
        subtitle="Enter the city and state"
      >
        <div className="space-y-6">
          <div className="mb-4">
            <Label htmlFor="location" className="font-medium">
              {formData.transaction_type === 'buy' 
                ? "Target location" 
                : "Property location"}
            </Label>
            <Input 
              id="location"
              placeholder="City, ST (e.g. Denver, CO)"
              value={formData.location}
              onChange={(e) => updateFormData({ location: e.target.value })}
              className={`w-full ${errors.location ? "border-red-500" : ""}`}
            />
            {errors.location ? (
              <p className="text-red-500 text-sm mt-2">{errors.location}</p>
            ) : (
              <p className="text-gray-500 text-sm mt-2">{getLocationInputHelperText()}</p>
            )}
          </div>
        </div>
      </FormStep>

      {/* Step 5: Property Address (Only for Sell) */}
      {formData.transaction_type === 'sell' && (
        <FormStep
          isActive={currentStep === 5}
          onNext={onNext}
          onPrevious={onPrevious}
          formData={formData}
          updateFormData={updateFormData}
          stepNumber={5}
          
          isValid={Boolean(formData.property_address && formData.property_address.trim() !== '')}
          errors={errors}
          title="What is the property address?"
          subtitle="Enter the full address of the property you want to sell"
        >
          <div className="space-y-6">
            <div className="mb-4">
              <Label htmlFor="property_address" className="font-medium">
                Full property address
              </Label>
              <Input 
                id="property_address"
                placeholder="123 Main St"
                value={formData.property_address || ''}
                onChange={(e) => updateFormData({ property_address: e.target.value })}
                className={`w-full ${errors.property_address ? "border-red-500" : ""}`}
              />
              {errors.property_address && (
                <p className="text-red-500 text-sm mt-2">{errors.property_address}</p>
              )}
            </div>
          </div>
        </FormStep>
      )}

      {/* Step 6: Timeline (Only for Buy) */}
      {formData.transaction_type === 'buy' && (
        <FormStep
          isActive={currentStep === 5}
          onNext={onNext}
          onPrevious={onPrevious}
          formData={formData}
          updateFormData={updateFormData}
          stepNumber={5}
          
          isValid={Boolean(formData.purchase_timeline)}
          errors={errors}
          title={`When are you looking to purchase in ${formData.location}?`}
          subtitle="Select your timeline"
        >
          <div>
            <ButtonRadioGroup
              options={[
                { value: "asap", label: "ASAP", description: "I'm ready to make a move now" },
                { value: "1_3_months", label: "1-3 Months", description: "I'm planning to invest in the next 1-3 months" },
                { value: "3_6_months", label: "3-6 Months", description: "I'm planning to invest in the next 3-6 months" },
                { value: "6_12_months", label: "6-12 Months", description: "I'm planning to invest in the next 6-12 months" }
              ]}
              selectedValue={formData.purchase_timeline}
              onChange={(value) => updateFormData({ 
                purchase_timeline: value as any,
                timeline: value as any
              })}
              name="agent_purchase_timeline"
              autoAdvance={true}
              onNext={onNext}
            />
            {errors.purchase_timeline && (
              <p className="text-red-500 text-sm mt-2">{errors.purchase_timeline}</p>
            )}
          </div>
        </FormStep>
      )}

      {/* Step 7: Price Range and Investment Strategy */}
      <FormStep
        isActive={currentStep === 6}
        onNext={onNext}
        onPrevious={onPrevious}
        formData={formData}
        updateFormData={updateFormData}
        stepNumber={6}
        
        isValid={Boolean(
          formData.price_min && formData.price_min.trim() !== '' && 
          formData.price_max && formData.price_max.trim() !== '' &&
          (formData.transaction_type === 'sell' || formData.strategy.length > 0)
        )}
        errors={errors}
        title="Price range and investment strategy"
        subtitle="Tell us about your budget and plans"
      >
        <div className="space-y-8">
          {/* Price Range Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">What is your price range?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price-min" className="font-medium">
                  {formData.transaction_type === 'buy' ? 'Minimum Purchase Price' : 'Minimum Sale Price'}
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-dark">$</span>
                  <Input
                    id="price-min"
                    type="text"
                    className={`pl-7 ${errors.price_min ? "border-red-500" : ""}`}
                    placeholder="100,000"
                    value={formData.price_min}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9,]/g, '');
                      const formattedPrice = formatPrice(value);
                      updateFormData({ price_min: formattedPrice });
                    }}
                    onFocus={(e) => {
                      // If empty, auto-populate with the minimum value
                      if (!formData.price_min) {
                        updateFormData({ price_min: getDefaultMinPrice() });
                      }
                    }}
                  />
                </div>
                {errors.price_min && <p className="text-sm text-red-500">{errors.price_min}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price-max" className="font-medium">
                  {formData.transaction_type === 'buy' ? 'Maximum Purchase Price' : 'Maximum Sale Price'}
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-dark">$</span>
                  <Input
                    id="price-max"
                    type="text"
                    className={`pl-7 ${errors.price_max ? "border-red-500" : ""}`}
                    placeholder="350,000"
                    value={formData.price_max}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9,]/g, '');
                      const formattedPrice = formatPrice(value);
                      updateFormData({ price_max: formattedPrice });
                    }}
                  />
                </div>
                {errors.price_max && <p className="text-sm text-red-500">{errors.price_max}</p>}
              </div>
            </div>
          </div>
          
          {/* Investment Strategy Section - Only for Buy */}
          {formData.transaction_type === 'buy' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">What is your investment strategy?</h3>
              <ButtonCheckboxGroup
                options={[
                  { value: "buy_and_hold_brrrr", label: "Long Term Rental", description: "I plan to buy and rent out long-term" },
                  { value: "short_term_rental", label: "Short-term rental or MTR", description: "I plan to list on Airbnb/VRBO" },
                  { value: "not_sure", label: "Not sure yet", description: "I'm still exploring my options" }
                ]}
                selectedValues={formData.strategy}
                onChange={handleStrategyChange}
                minSelected={1}
              />
              {errors.strategy && (
                <p className="text-red-500 text-sm mt-2">{errors.strategy}</p>
              )}
              <p className="text-sm text-gray-500 mt-4">Note: We do not yet support Fix and Flip strategies or commercial.</p>
            </div>
          )}
        </div>
      </FormStep>

      {/* Step 8: Contact Information */}
      <FormStep
        isActive={currentStep === 7}
        onNext={onNext}
        onPrevious={onPrevious}
        formData={formData}
        updateFormData={updateFormData}
        stepNumber={7}
        
        isValid={Boolean(
          formData.contact && 
          formData.contact.first_name && !!formData.contact.first_name.trim() && 
          formData.contact.last_name && !!formData.contact.last_name.trim() && 
          formData.contact.email && !!formData.contact.email.trim() && 
          formData.contact.phone && !!formData.contact.phone.trim()
          // City, state, and zip are not required per the specifications
        )}
        errors={errors}
        title="What's your contact info?"
        subtitle="Please provide your contact information so agents can reach you"
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
            terms_accepted={formData.terms_accepted}
            loan_assistance={formData.loan_assistance}
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
            onTermsAcceptedChange={(value: boolean) => updateFormData({ 
              terms_accepted: value 
            })}
            onLoanAssistanceChange={(value: boolean) => updateFormData({ 
              loan_assistance: value 
            })}
            errors={{
              first_name: errors['contact.first_name'],
              last_name: errors['contact.last_name'],
              email: errors['contact.email'],
              phone: errors['contact.phone'],
              city: errors['contact.city'],
              state: errors['contact.state'],
              zip: errors['contact.zip'],
              terms_accepted: errors.terms_accepted
            }}
          />
        </div>
      </FormStep>
      
      {/* Step 9: Terms and Consent */}
      <FormStep
        isActive={currentStep === 8}
        onNext={onNext}
        onPrevious={onPrevious}
        formData={formData}
        updateFormData={updateFormData}
        stepNumber={8}
        
        isValid={formData.terms_accepted}
        errors={errors}
        title="Terms and Consent"
        subtitle="Please review and accept our terms to continue"
      >
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
              By entering your information and submitting this form, you agree to BiggerPockets <a href="#" className="text-blue-500 hover:text-blue-700">terms of service</a>. You also expressly consent to having BiggerPockets and its featured real estate professionals call or text you about your inquiry (including automatic telephone dialing system or an artificial or prerecorded voice) to the telephone number provided, even if that number is on a corporate, state, or national Do Not Call Registry. Message frequency varies, and message/data rates may apply. Text STOP to cancel. You don't need to consent as a condition of buying any property, goods or services.
            </Label>
          </div>
          {errors.terms_accepted && (
            <p className="text-red-500 text-sm mt-1">{errors.terms_accepted}</p>
          )}
        </div>
      </FormStep>
      
      
    </>
  );
}
