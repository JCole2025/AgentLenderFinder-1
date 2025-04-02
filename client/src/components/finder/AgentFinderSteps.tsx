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
            timeline: undefined,
            purchase_timeline: undefined
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

        isValid={formData.owner_occupied !== undefined} // Required field
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
          <div className="mb-4 space-y-4">
            <Label className="font-medium">
              {formData.transaction_type === 'buy' 
                ? "Target location" 
                : "Property location"}
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city" className="text-sm font-medium">City</Label>
                <Input 
                  id="city"
                  placeholder="Denver"
                  value={formData.location.split(',')[0] || ''}
                  onChange={(e) => {
                    const state = formData.location.split(',')[1]?.trim() || '';
                    updateFormData({ 
                      location: `${e.target.value}${state ? `, ${state}` : ''}`
                    });
                  }}
                  className={`w-full ${errors.location ? "border-red-500" : ""}`}
                />
              </div>
              <div>
                <Label htmlFor="state" className="text-sm font-medium">State</Label>
                <Input 
                  id="state"
                  placeholder="CO"
                  value={formData.location.split(',')[1]?.trim() || ''}
                  onChange={(e) => {
                    const city = formData.location.split(',')[0] || '';
                    updateFormData({ 
                      location: `${city}${e.target.value ? `, ${e.target.value}` : ''}`
                    });
                  }}
                  className={`w-full ${errors.location ? "border-red-500" : ""}`}
                  maxLength={2}
                />
              </div>
            </div>
            {errors.location && (
              <p className="text-red-500 text-sm">{errors.location}</p>
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
          showNext={false}
        >
          <div>
            <ButtonRadioGroup
              options={[
                { value: "asap", label: "ASAP", description: "I am ready now" },
                { value: "1_3_months", label: "1-3 Months", description: "I'm planning to invest in the next 1-3 months" },
                { value: "3_6_months", label: "3-6 Months", description: "I'm planning to invest in the next 3-6 months" },
                { value: "6_12_months", label: "6-12 Months", description: "I'm planning to invest in the next 6-12 months" }
              ]}
              selectedValue={formData.purchase_timeline}
              onChange={(value) => updateFormData({ 
                purchase_timeline: value === 'default' ? undefined : value as any,
                timeline: value === 'default' ? undefined : value as any
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
                selectedValues={formData.strategy || []}
                onChange={handleStrategyChange}
                autoAdvance={true}
                onNext={onNext}
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
          formData.contact.phone && !!formData.contact.phone.trim() &&
          formData.terms_accepted
          // City, state, and zip are not required per the specifications
        )}
        errors={errors}
        title="What's your contact info?"
        subtitle="Ready to get matched with 2 agents? Please provide your contact information so agents can reach you"
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


    </>
  );
}