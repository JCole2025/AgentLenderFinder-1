import FormStep from "./FormStep";
import { AgentFormData, AgentTransactionType } from "@/types/finder";
import RadioGroup from "./formFields/RadioGroup";
import ButtonRadioGroup from "./formFields/ButtonRadioGroup";
import PropertyTypeSelect from "./formFields/PropertyTypeSelect";
import ButtonPropertySelect from "./formFields/ButtonPropertySelect";
import InvestmentDetailsFields from "./formFields/InvestmentDetailsFields";
import ContactFormExtended from "./formFields/ContactFormExtended";
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
      >
        <ButtonRadioGroup
          options={[
            { value: "buy", label: "Buy Property", description: agentTransactionTypeDescriptions.buy },
            { value: "sell", label: "Sell Property", description: agentTransactionTypeDescriptions.sell }
          ]}
          selectedValue={formData.transaction_type}
          onChange={(value) => updateFormData({ 
            transaction_type: value as any,
            // Set default timeline to 'just_researching' to prevent enum errors
            timeline: 'just_researching' as any,
            purchase_timeline: 'just_researching' as any
          })}
          name="agent_transaction_type"
        />
        {errors.transaction_type && (
          <p className="text-red-500 text-sm mt-2">{errors.transaction_type}</p>
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
        
        isValid={Boolean(formData.location && formData.location.trim() !== '')}
        errors={errors}
        title="Where are you looking to invest?"
        subtitle="Enter the city and state of your target location"
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

      {/* Step 3: Property Address (Only for Sell) */}
      {formData.transaction_type === 'sell' && (
        <FormStep
          isActive={currentStep === 3}
          onNext={onNext}
          onPrevious={onPrevious}
          formData={formData}
          updateFormData={updateFormData}
          stepNumber={3}
          
          isValid={Boolean(formData.property_address && formData.property_address.trim() !== '')}
          errors={errors}
          title="What is the property address?"
          subtitle="Enter the full address of the property you want to sell"
        >
          <div className="space-y-6">
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
          </div>
        </FormStep>
      )}

      {/* Step 4: Property Type */}
      <FormStep
        isActive={currentStep === (formData.transaction_type === 'sell' ? 4 : 3)}
        onNext={onNext}
        onPrevious={onPrevious}
        formData={formData}
        updateFormData={updateFormData}
        stepNumber={formData.transaction_type === 'sell' ? 4 : 3}
        
        isValid={Boolean(formData.property_type && formData.property_type.trim() !== '')}
        errors={errors}
        title="What type of property are you looking for?"
        subtitle="Select the property type that best matches your investment goals"
      >
        <div className="space-y-6">
          <div className="mt-4">
            <ButtonPropertySelect
              selectedValue={formData.property_type}
              onChange={(value) => updateFormData({ property_type: value })}
              error={errors.property_type}
            />
          </div>
        </div>
      </FormStep>

      {/* Step 5: Timeline (Only for Buy) */}
      {formData.transaction_type === 'buy' && (
        <FormStep
          isActive={currentStep === 4}
          onNext={onNext}
          onPrevious={onPrevious}
          formData={formData}
          updateFormData={updateFormData}
          stepNumber={4}
          
          isValid={Boolean(formData.purchase_timeline)}
          errors={errors}
          title={`When are you looking to purchase in ${formData.location}?`}
          subtitle="Select the timeline that best matches your investment plans"
        >
          <div>
            <ButtonRadioGroup
              options={[
                { value: "asap", label: "ASAP", description: "I'm ready to make a move now" },
                { value: "1_3_months", label: "1-3 Months", description: "I'm planning to invest in the next 1-3 months" },
                { value: "3_6_months", label: "3-6 Months", description: "I'm planning to invest in the next 3-6 months" },
                { value: "6_12_months", label: "6-12 Months", description: "I'm planning to invest in the next 6-12 months" },
                { value: "just_researching", label: "Just Researching", description: "I'm just exploring my options" }
              ]}
              selectedValue={formData.purchase_timeline}
              onChange={(value) => updateFormData({ 
                purchase_timeline: value as any,
                timeline: value as any
              })}
              name="agent_purchase_timeline"
            />
            {errors.purchase_timeline && (
              <p className="text-red-500 text-sm mt-2">{errors.purchase_timeline}</p>
            )}
          </div>
        </FormStep>
      )}

      {/* Step 6: Price Range */}
      <FormStep
        isActive={currentStep === (formData.transaction_type === 'buy' ? 5 : 4)}
        onNext={onNext}
        onPrevious={onPrevious}
        formData={formData}
        updateFormData={updateFormData}
        stepNumber={formData.transaction_type === 'buy' ? 5 : 4}
        
        isValid={Boolean(
          formData.price_min && formData.price_min.trim() !== '' && 
          formData.price_max && formData.price_max.trim() !== ''
        )}
        errors={errors}
        title="What is your price range?"
        subtitle="Enter your minimum and maximum price range"
      >
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
      </FormStep>

      {/* Step 7: Loan Process (Only for Buy) */}
      {formData.transaction_type === 'buy' && (
        <FormStep
          isActive={currentStep === 6}
          onNext={onNext}
          onPrevious={onPrevious}
          formData={formData}
          updateFormData={updateFormData}
          stepNumber={6}
          
          isValid={true} // Not required field
          errors={errors}
          title="Have you started the loan process?"
          subtitle="Let us know if you've already begun working with a lender (this is optional)"
          showNext={true} // Explicitly show the Next button
        >
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <Switch
                id="loan-started"
                checked={formData.loan_started}
                onCheckedChange={(checked) => updateFormData({ loan_started: checked })}
              />
              <Label htmlFor="loan-started" className="font-medium">
                I have already started the loan process
              </Label>
            </div>
            
            <p className="text-sm text-gray-500 italic mt-4">
              This field is optional. Click Next to continue.
            </p>
          </div>
        </FormStep>
      )}

      {/* Step 8: Owner Occupied */}
      <FormStep
        isActive={currentStep === (formData.transaction_type === 'buy' ? 7 : 5)}
        onNext={onNext}
        onPrevious={onPrevious}
        formData={formData}
        updateFormData={updateFormData}
        stepNumber={formData.transaction_type === 'buy' ? 7 : 5}
        
        isValid={true} // Not a required field
        errors={errors}
        title="Will this be an owner-occupied property?"
        subtitle="Let us know if you plan to live in this property (this is optional)"
        showNext={true} // Explicitly show the Next button
      >
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <Switch
              id="owner-occupied"
              checked={formData.owner_occupied}
              onCheckedChange={(checked) => updateFormData({ owner_occupied: checked })}
            />
            <Label htmlFor="owner-occupied" className="font-medium">
              Yes, I plan to live in this property
            </Label>
          </div>
          
          <p className="text-sm text-gray-500 italic mt-4">
            This field is optional. Click Next to continue.
          </p>
        </div>
      </FormStep>

      {/* Step 9: Existing Properties */}
      <FormStep
        isActive={currentStep === (formData.transaction_type === 'buy' ? 8 : 6)}
        onNext={onNext}
        onPrevious={onPrevious}
        formData={formData}
        updateFormData={updateFormData}
        stepNumber={formData.transaction_type === 'buy' ? 8 : 6}
        
        isValid={true} // Not a required field
        errors={errors}
        title="How many investment properties do you currently own?"
        subtitle="This helps us find the right agent for your experience level (this is optional)"
        showNext={true} // Explicitly show the Next button
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <Input
              id="property-count"
              type="text"
              className={errors.investment_properties_count ? "border-red-500" : ""}
              placeholder="0"
              value={formData.investment_properties_count}
              onChange={(e) => {
                // Only allow numbers
                const value = e.target.value;
                if (/^[0-9]*$/.test(value) || value === '') {
                  updateFormData({ investment_properties_count: value });
                }
              }}
            />
            {errors.investment_properties_count && (
              <p className="text-sm text-red-500">{errors.investment_properties_count}</p>
            )}
          </div>
          
          <p className="text-sm text-gray-500 italic mt-4">
            This field is optional. Click Next to continue. If you leave it blank, we'll assume you own 0 properties.
          </p>
        </div>
      </FormStep>

      {/* Step 10: Investment Strategy */}
      <FormStep
        isActive={currentStep === (formData.transaction_type === 'buy' ? 9 : 7)}
        onNext={onNext}
        onPrevious={onPrevious}
        formData={formData}
        updateFormData={updateFormData}
        stepNumber={formData.transaction_type === 'buy' ? 9 : 7}
        
        isValid={formData.strategy.length > 0}
        errors={errors}
        title="What is your investment strategy?"
        subtitle="Select all that apply"
      >
        <ButtonCheckboxGroup
          options={[
            { value: "buy_and_hold_brrrr", label: "Long Term Rental", description: "I plan to buy and rent out long-term" },
            { value: "short_term_rental", label: "Short-term rental or MTR", description: "I plan to list on Airbnb/VRBO" },
            { value: "not_sure", label: "Not sure yet", description: "I'm still exploring my options" }
          ]}
          selectedValues={formData.strategy}
          onChange={handleStrategyChange}
        />
        {errors.strategy && (
          <p className="text-red-500 text-sm mt-2">{errors.strategy}</p>
        )}
        <p className="text-sm text-gray-500 mt-4">Note: We do not yet support Fix and Flip strategies or commercial.</p>
      </FormStep>

      {/* Step 11: Contact Information */}
      <FormStep
        isActive={currentStep === (formData.transaction_type === 'buy' ? 10 : 8)}
        onNext={onNext}
        onPrevious={onPrevious}
        formData={formData}
        updateFormData={updateFormData}
        stepNumber={formData.transaction_type === 'buy' ? 10 : 8}
        
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
      
      {/* Step 12: Terms and Consent */}
      <FormStep
        isActive={currentStep === (formData.transaction_type === 'buy' ? 11 : 9)}
        onNext={onNext}
        onPrevious={onPrevious}
        formData={formData}
        updateFormData={updateFormData}
        stepNumber={formData.transaction_type === 'buy' ? 11 : 9}
        
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
      
      {/* Step 13: Loan Assistance (only for Buy) */}
      {formData.transaction_type === 'buy' && (
        <FormStep
          isActive={currentStep === 12}
          onNext={onNext}
          onPrevious={onPrevious}
          formData={formData}
          updateFormData={updateFormData}
          stepNumber={12}
          
          isValid={true} // Not required field
          errors={errors}
          title="Would you like loan assistance?"
          subtitle="We can connect you with lenders who can help finance your investment property"
          showNext={true} // Explicitly show the Next button
        >
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <Switch
                id="loan-assistance"
                checked={formData.loan_assistance}
                onCheckedChange={(checked) => updateFormData({ loan_assistance: checked })}
              />
              <Label htmlFor="loan-assistance" className="font-medium">
                Yes, connect me with lenders who can help me finance this property
              </Label>
            </div>
            
            <p className="text-sm text-gray-500 italic mt-4">
              This field is optional. Click Next to continue.
            </p>
          </div>
        </FormStep>
      )}

      {/* Final Step: Review and Submit */}
      <FormStep
        isActive={currentStep === (formData.transaction_type === 'buy' ? 13 : 10)}
        onNext={onSubmit}
        onPrevious={onPrevious}
        formData={formData}
        updateFormData={updateFormData}
        stepNumber={formData.transaction_type === 'buy' ? 13 : 10}
        
        isValid={true}
        errors={errors}
        title="Review your information"
        subtitle="Please verify that everything is correct"
        nextLabel="Submit Information"
        showSubmit={true}
      >
        <AgentReviewSummary formData={formData} />
      </FormStep>
    </>
  );
}
