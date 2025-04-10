import React, { useState } from 'react';
import { 
  agentTransactionTypeDescriptions,
  AgentFormData,
  agentTimelineLabels
} from '@/types/finder';
import FormStep from './FormStep';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getStateOptions } from '@/lib/stateValidator';
import { formatPrice, getDefaultMinPrice } from '@/lib/priceValidator';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import ButtonRadioGroup from './formFields/ButtonRadioGroup';
import ButtonPropertySelect from './formFields/ButtonPropertySelect';
import OwnerOccupiedButtons from './formFields/OwnerOccupiedButtons';
import ButtonCheckboxGroup from './formFields/ButtonCheckboxGroup';
import ContactFormExtended from './formFields/ContactFormExtended';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const toast = useToast();
  const isMobile = useIsMobile();

  // Handle special skipping of steps for navigation
  const handleNext = () => {
    console.log('AgentFinderSteps - handleNext called');
    onNext();
  };

  // Special handling for strategy selection
  const handleStrategyChange = (values: string[]) => {
    // Cast string[] to AgentStrategy[]
    updateFormData({ strategy: values as any });
  };

  return (
    <div className="pt-6 pb-8 px-6 md:px-8">
      {/* Step 1: Transaction Type */}
      <FormStep
        isActive={currentStep === 1}
        onNext={onNext}
        onPrevious={onPrevious}
        formData={formData}
        updateFormData={updateFormData}
        stepNumber={1}
        isValid={Boolean(formData.transaction_type)}
        errors={errors}
        title="What type of transaction are you interested in?"
        subtitle="Select the type of real estate transaction"
        showNext={false}
      >
        <ButtonRadioGroup
          options={[
            { value: "buy", label: "Buy Property", description: agentTransactionTypeDescriptions.buy },
            { value: "sell", label: "Sell Property", description: agentTransactionTypeDescriptions.sell }
          ]}
          selectedValue={formData.transaction_type}
          onChange={(value) => {
            // Set the transaction type and clear unrelated fields
            const newData: Partial<AgentFormData> = { 
              transaction_type: value as any,
              timeline: "asap", // Default to ASAP for all submission types
              purchase_timeline: "asap" // Default to ASAP for all submission types
            };
            
            // Handle the sell path differently
            if (value === 'sell') {
              // Set all required defaults for sell transaction type
              newData.owner_occupied = false;
              newData.property_type = "single_family"; // Default to single family
              newData.location = "Denver, CO"; // Default location
              newData.price_min = "250,000"; // Default price
              newData.price_max = "500,000"; // Default price
              newData.strategy = ["not_sure"]; // Default strategy
              
              // Apply all the form updates at once
              updateFormData(newData);
              
              // IMPORTANT! Set a timeout to skip directly to property address step
              setTimeout(() => {
                // For sell, go to step 5 directly
                console.log("Setting sell path navigation directly to step 5");
                const event = new CustomEvent('agentFinder:setStep', { 
                  detail: { step: 5 } 
                });
                window.dispatchEvent(event);
              }, 300);
              
              return; // Exit early for sell path
            }
            
            // Apply updates for buy path
            updateFormData(newData);
          }}
          name="agent_transaction_type"
          autoAdvance={formData.transaction_type === 'buy'} // Only auto-advance for buy path
          onNext={handleNext}
        />
        {errors.transaction_type && (
          <p className="text-red-500 text-sm mt-2">{errors.transaction_type}</p>
        )}
      </FormStep>

      {/* Step 2: Property Type (Only for Buy) */}
      {formData.transaction_type === 'buy' && (
        <FormStep
          isActive={currentStep === 2}
          onNext={onNext}
          onPrevious={onPrevious}
          formData={formData}
          updateFormData={updateFormData}
          stepNumber={2}

          isValid={Boolean(formData.property_type && formData.property_type.trim() !== '')}
          errors={errors}
          title="What type of property are you looking for?"
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
                onNext={handleNext}
              />
            </div>
          </div>
        </FormStep>
      )}
      
      {/* Skip property type step for sell path */}
      {formData.transaction_type === 'sell' && (
        <div className="hidden"></div>
      )}

      {/* Step 3: Owner Occupied (Only for Buy) */}
      {formData.transaction_type === 'buy' && (
        <FormStep
          isActive={currentStep === 3}
          onNext={onNext}
          onPrevious={onPrevious}
          formData={formData}
          updateFormData={updateFormData}
          stepNumber={3}

          isValid={formData.owner_occupied !== undefined} // Required field
          errors={errors}
          title="Will you live in this property?"
          subtitle="Select if this will be your primary residence"
          showNext={false} // Hide Next button as we auto-advance
        >
          <div className="space-y-6 max-w-xl mx-auto">
            <OwnerOccupiedButtons 
              isOwnerOccupied={formData.owner_occupied}
              onChange={(value) => updateFormData({ owner_occupied: value })}
              onNext={handleNext}
            />
          </div>
        </FormStep>
      )}
      
      {/* Skip step 3 for sell path - add empty component to maintain indexing */}
      {formData.transaction_type === 'sell' && (
        <div className="hidden"></div>
      )}

      {/* Step 4: Location and Price Range */}
      <FormStep
        isActive={currentStep === 4}
        onNext={onNext}
        onPrevious={onPrevious}
        formData={formData}
        updateFormData={updateFormData}
        stepNumber={4}

        isValid={Boolean(
          formData.location && formData.location.trim() !== '' && 
          formData.price_min && formData.price_min.trim() !== '' && 
          formData.price_max && formData.price_max.trim() !== ''
        )}
        errors={errors}
        title={formData.transaction_type === 'buy' ? "Where are you looking to invest?" : "Where is your property located?"}
        subtitle="Tell us about your location and budget"
      >
        <div className="space-y-8">
          {/* Location Section */}
          <div className="mb-4 space-y-4">
            <h3 className="text-lg font-semibold mb-2">
              {formData.transaction_type === 'buy' 
                ? "Target location" 
                : "Property location"}
            </h3>
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
                <Select
                  value={formData.location.split(',')[1]?.trim() || ''}
                  onValueChange={(value) => {
                    const city = formData.location.split(',')[0] || '';
                    updateFormData({ 
                      location: `${city}${value ? `, ${value}` : ''}`
                    });
                  }}
                >
                  <SelectTrigger 
                    id="state" 
                    className={`w-full h-10 ${errors.location ? "border-red-500" : ""}`}
                  >
                    <SelectValue placeholder="Select State" />
                  </SelectTrigger>
                  <SelectContent>
                    {getStateOptions().map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {errors.location && (
              <p className="text-red-500 text-sm">{errors.location}</p>
            )}
          </div>

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
                    onBlur={(e) => {
                      // Check if the value is below minimum when leaving the field
                      const numericValue = parseInt(e.target.value.replace(/[^0-9]/g, ''));
                      if (numericValue < 100000) {
                        updateFormData({ price_min: getDefaultMinPrice() });
                        if (numericValue > 0) {
                          toast({
                            title: "Minimum Price",
                            description: "The minimum purchase price is $100,000",
                            variant: "default"
                          });
                        }
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
                    placeholder="500,000"
                    value={formData.price_max}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9,]/g, '');
                      const formattedPrice = formatPrice(value);
                      updateFormData({ price_max: formattedPrice });
                    }}
                    onBlur={(e) => {
                      // Check if the value is below minimum when leaving the field
                      const numericValue = parseInt(e.target.value.replace(/[^0-9]/g, ''));
                      if (numericValue < 100000 && numericValue > 0) {
                        updateFormData({ price_max: "500,000" });
                        toast({
                          title: "Minimum Price",
                          description: "The minimum price is $100,000",
                          variant: "default"
                        });
                      }
                    }}
                  />
                </div>
                {errors.price_max && <p className="text-sm text-red-500">{errors.price_max}</p>}
              </div>
            </div>
            
            {(errors.price_range || errors.price_min_max) && (
              <p className="text-sm text-red-500 mt-2">
                {errors.price_range || errors.price_min_max}
              </p>
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
            
            <div className="flex justify-end mt-6">
              <button
                type="button"
                className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${!formData.property_address ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={onNext}
                disabled={!formData.property_address}
              >
                Continue
              </button>
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
              selectedValue={formData.purchase_timeline === undefined ? "" : formData.purchase_timeline}
              onChange={(value) => updateFormData({ 
                purchase_timeline: value === "default" ? undefined : value as any,
                timeline: value === "default" ? undefined : value as any
              })}
              name="agent_purchase_timeline"
              autoAdvance={true}
              onNext={handleNext}
            />
            {errors.purchase_timeline && (
              <p className="text-red-500 text-sm mt-2">{errors.purchase_timeline}</p>
            )}
          </div>
        </FormStep>
      )}

      {/* Step 6: Investment Strategy (Only for Buy) */}
      {formData.transaction_type === 'buy' && (
        <FormStep
          isActive={currentStep === 6}
          onNext={onNext}
          onPrevious={onPrevious}
          formData={formData}
          updateFormData={updateFormData}
          stepNumber={6}

          isValid={Boolean(formData.strategy && formData.strategy.length > 0)}
          errors={errors}
          title="What is your investment strategy?"
          subtitle="Tell us about your investment plans"
          showNext={false}
        >
          <div className="space-y-8">
            <div>
              <div>
                <h3 className="text-lg font-medium mb-3">Select all that apply:</h3>
                <ButtonCheckboxGroup
                  options={[
                    { value: "buy_and_hold_brrrr", label: "Long Term Rental", description: "I plan to buy and rent out long-term" },
                    { value: "short_term_rental", label: "Short-term rental or MTR", description: "I plan to list on Airbnb/VRBO" },
                    { value: "not_sure", label: "Not sure yet", description: "I'm still exploring my options" }
                  ]}
                  selectedValues={formData.strategy || []}
                  onChange={handleStrategyChange}
                  autoAdvance={false}
                  minSelected={1}
                />
                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${formData.strategy.length < 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={handleNext}
                    disabled={formData.strategy.length < 1}
                  >
                    Continue
                  </button>
                </div>
              </div>
              {errors.strategy && (
                <p className="text-red-500 text-sm mt-2">{errors.strategy}</p>
              )}
              <p className="text-sm text-gray-500 mt-4">Note: We do not yet support Fix and Flip strategies or commercial.</p>
            </div>
          </div>
        </FormStep>
      )}
      
      {/* Skip step 6 for sell path - add empty component to maintain indexing */}
      {formData.transaction_type === 'sell' && (
        <div className="hidden"></div>
      )}

      {/* Step 7: Contact Information */}
      <FormStep
        isActive={currentStep === 7}
        onNext={onSubmit} // Submit the form when going "next" from the contact step
        onPrevious={onPrevious}
        formData={formData}
        updateFormData={updateFormData}
        stepNumber={7}
        isValid={
          Boolean(formData.contact?.first_name) &&
          Boolean(formData.contact?.last_name) &&
          Boolean(formData.contact?.email) &&
          Boolean(formData.contact?.phone) &&
          Boolean(formData.contact?.zip) &&
          Boolean(formData.terms_accepted)
        }
        errors={errors}
        title="Your contact information"
        subtitle="Tell us how the agent can reach you"
        nextLabel="Get Agent Matches" // Customize the button text
        showSubmit={true} // Show the submit button instead of next
      >
        <ContactFormExtended
          formData={formData}
          updateFormData={updateFormData}
          errors={errors}
          isValid={isValid}
          onSubmit={onSubmit}
          enableNotes={true}
          enableLoanAssistance={formData.transaction_type === 'buy'}
          buttonText={`Find ${formData.transaction_type === 'buy' ? 'Buying' : 'Selling'} Agent`}
        />
      </FormStep>

    </div>
  );
}