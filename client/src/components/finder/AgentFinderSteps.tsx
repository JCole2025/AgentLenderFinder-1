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
import { formatPrice, getDefaultMinPrice, MIN_PROPERTY_PRICE } from '@/lib/priceValidator';
import { Checkbox } from '@/components/ui/checkbox';
import ButtonRadioGroup from './formFields/ButtonRadioGroup';
import ButtonPropertySelect from './formFields/ButtonPropertySelect';
import OwnerOccupiedButtons from './formFields/OwnerOccupiedButtons';
import ButtonCheckboxGroup from './formFields/ButtonCheckboxGroup';
import ContactFormExtended from './formFields/ContactFormExtended';
import { useIsMobile } from '@/hooks/use-mobile';
import PriceWarningDialog from './formFields/PriceWarningDialog';
import { Button } from "@/components/ui/button"; // Added import for Button component

interface AgentFinderStepsProps {
  currentStep: number;
  formData: AgentFormData;
  updateFormData: (data: Partial<AgentFormData>) => void;
  onNext: () => void;
  onPrevious: () => void;
  onSubmit: () => void;
  advanceMultipleSteps: (stepsCount: number) => void;
  onTransactionTypeChange: (value: string) => void;
  errors: Record<string, any>;
  isValid: boolean;
}

const AgentFinderSteps = React.memo(function AgentFinderSteps({
  currentStep,
  formData,
  updateFormData,
  onNext,
  onPrevious,
  onSubmit,
  advanceMultipleSteps,
  onTransactionTypeChange,
  errors,
  isValid
}: AgentFinderStepsProps) {
  const isMobile = useIsMobile();
  const [showPriceWarning, setShowPriceWarning] = useState(false);
  const [currentPriceField, setCurrentPriceField] = useState<'min' | 'max'>('min');

  const handleNext = () => {
    onNext();
  };

  const handleStrategyChange = (values: string[]) => {
    updateFormData({ strategy: values as any });
  };

  const handlePriceWarningConfirm = () => {
    if (currentPriceField === 'min') {
      updateFormData({ price_min: getDefaultMinPrice() });
    } else {
      updateFormData({ price_max: getDefaultMinPrice() });
    }
    setShowPriceWarning(false);
  };

  // Card Labels:
  // Card A: Transaction Type
  // Card B: Property Type (Buy Path)
  // Card B2: Property Type (Sell Path)
  // Card C: Owner Occupied
  // Card D1: Location & Price (Buy Path)
  // Card D2: Location & Price (Sell Path)
  // Card E: Property Address
  // Card F: Purchase Timeline
  // Card G: Investment Strategy
  // Card H: Contact Info (Buy Path)
  // Card H2: Contact Info (Sell Path)

  const cards = {
    transactionType: { // Card A
      isActive: currentStep === 1,
      title: "Are you looking to buy or sell?",
      subtitle: "",
      content: (
        <ButtonRadioGroup
          options={[
            { value: "buy", label: "Buy Property", description: agentTransactionTypeDescriptions.buy },
            { value: "sell", label: "Sell Property", description: "I'm looking to sell my real estate property and need to find a qualified selling agent" }
          ]}
          selectedValue={formData.transaction_type}
          onChange={(value) => {
            if (value) {
              updateFormData({
                transaction_type: value,
                ...(value === 'sell' ? {
                  owner_occupied: false,
                  price_min: "300000",
                  price_max: "600000",
                  location: "Denver, Colorado"
                } : {})
              });
              onTransactionTypeChange(value);
            }
          }}
          name="agent_transaction_type"
          autoAdvance={false}
          onNext={handleNext}
        />
      )
    },

    propertyType: { // Card B
      isActive: currentStep === 2 && formData.transaction_type === 'buy',
      title: "What type of property are you looking for?",
      subtitle: "Select the property type",
      content: (
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
      )
    },

    propertyTypeSell: { // Card B2
      isActive: currentStep === 2 && formData.transaction_type === 'sell',
      title: "What type of property are you selling?",
      subtitle: "Select your property type",
      content: (
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
      )
    },

    ownerOccupied: { // Card C
      isActive: currentStep === 3 && formData.transaction_type === 'buy',
      title: "Will you live in this property?",
      subtitle: "Select if this will be your primary residence",
      content: (
        <div className="space-y-6 max-w-xl mx-auto">
          <OwnerOccupiedButtons 
            isOwnerOccupied={formData.owner_occupied}
            onChange={(value) => updateFormData({ owner_occupied: value })}
            onNext={handleNext}
          />
        </div>
      )
    },

    sellerLocationAndPrice: { // Card D2
      isActive: currentStep === 2 && formData.transaction_type === 'sell',
      title: "Where is your property located?",
      subtitle: "Tell us about your property location and estimated value",
      content: (
        <div className="space-y-8">
          <div className="mb-4 space-y-4">
            <h3 className="text-lg font-semibold mb-2">Property location</h3>
            <div className="mb-4">
              <Label htmlFor="property_address" className="text-sm font-medium">Property address</Label>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city" className="text-sm font-medium">City</Label>
                <Input 
                  id="city"
                  placeholder="Denver"
                  value={(formData.location || '').split(',')[0] || ''}
                  onChange={(e) => {
                    const state = (formData.location || '').split(',')[1]?.trim() || '';
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
                  value={(formData.location || '').split(',')[1]?.trim() || ''}
                  onValueChange={(value) => {
                    const city = (formData.location || '').split(',')[0] || '';
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

          <div>
            <h3 className="text-lg font-semibold mb-4">What is your estimated property value?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price-min" className="font-medium">Minimum Value</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-dark">$</span>
                  <Input
                    id="price-min"
                    type="text"
                    className={`pl-7 ${errors.price_min ? "border-red-500" : ""}`}
                    placeholder="300000"
                    value={formData.price_min || ''}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      updateFormData({ price_min: value });
                    }}
                  />
                </div>
                {errors.price_min && <p className="text-sm text-red-500">{errors.price_min}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="price-max" className="font-medium">Maximum Value</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-dark">$</span>
                  <Input
                    id="price-max"
                    type="text"
                    className={`pl-7 ${errors.price_max ? "border-red-500" : ""}`}
                    placeholder="600000"
                    value={formData.price_max || ''}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      updateFormData({ price_max: value });
                    }}
                  />
                </div>
                {errors.price_max && <p className="text-sm text-red-500">{errors.price_max}</p>}
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button 
              onClick={handleNext}
              size="lg" 
              className="bg-blue-500 hover:bg-blue-600 text-white"
              disabled={!formData.location || !formData.price_min || !formData.price_max || errors.location || errors.price_min || errors.price_max}
            >
              Next
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Button>
          </div>
        </div>
      )
    },

    locationAndPrice: { // Card D1
      isActive: currentStep === 4 && formData.transaction_type === 'buy',
      title: "Where are you looking to invest?",
      subtitle: "Tell us about your location and budget",
      content: (
        <div className="space-y-8">
          {/* Location fields */}
          <div className="mb-4 space-y-4">
            <h3 className="text-lg font-semibold mb-2">
              {formData.transaction_type === 'buy' ? "Target location" : "Property location"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city" className="text-sm font-medium">City</Label>
                <Input 
                  id="city"
                  placeholder="Denver"
                  value={(formData.location || '').split(',')[0] || ''}
                  onChange={(e) => {
                    const state = (formData.location || '').split(',')[1]?.trim() || '';
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
                  value={(formData.location || '').split(',')[1]?.trim() || ''}
                  onValueChange={(value) => {
                    const city = (formData.location || '').split(',')[0] || '';
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

          {/* Price Range fields */}
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
                    placeholder="100000"
                    value={formData.price_min || ''}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      updateFormData({ price_min: value });
                    }}
                    onBlur={(e) => {
                      const numericValue = parseInt(e.target.value.replace(/[^0-9]/g, ''));
                      if (numericValue > 0 && numericValue < MIN_PROPERTY_PRICE) {
                        setCurrentPriceField('min');
                        setShowPriceWarning(true);
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
                    placeholder="500000"
                    value={formData.price_max || ''}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      updateFormData({ price_max: value });
                    }}
                    onBlur={(e) => {
                      const numericValue = parseInt(e.target.value.replace(/[^0-9]/g, ''));
                      if (numericValue > 0 && numericValue < MIN_PROPERTY_PRICE) {
                        setCurrentPriceField('max');
                        setShowPriceWarning(true);
                      }
                    }}
                  />
                </div>
                {errors.price_max && <p className="text-sm text-red-500">{errors.price_max}</p>}
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button 
              onClick={handleNext}
              size="lg" 
              className="bg-blue-500 hover:bg-blue-600 text-white"
              disabled={!formData.location || !formData.price_min || !formData.price_max || errors.location || errors.price_min || errors.price_max}
            >
              Next
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Button>
          </div>
        </div>
      )
    },

    

    investmentStrategy: { // Card G
      isActive: currentStep === 6 && formData.transaction_type === 'buy',
      title: "What is your investment strategy?",
      subtitle: "Tell us about your investment plans",
      content: (
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-medium mb-3">Select all that apply:</h3>
            <ButtonCheckboxGroup
              options={[
                { value: "buy_and_hold_brrrr", label: "Long Term Rental", description: "I plan to buy and rent out long-term" },
                { value: "short_term_rental", label: "Short-Term Rental (STR)", description: "I plan to list on platforms like Airbnb/VRBO (1-30 days)" },
                { value: "mid_term_rental", label: "Mid-Term Rental (MTR)", description: "I plan to rent for 1-12 months at a time" },
                { value: "not_sure", label: "Not sure yet", description: "I'm still exploring my options" }
              ]}
              selectedValues={formData.strategy || []}
              onChange={handleStrategyChange}
              autoAdvance={true}
              minSelected={1}
              onNext={handleNext}
            />
          </div>
        </div>
      )
    },

    purchaseTimeline: { // Card F
      isActive: currentStep === 5 && formData.transaction_type === 'buy',
      title: `When are you looking to purchase in ${formData.location}?`,
      subtitle: "Select your timeline",
      content: (
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
      )
    },

    contactInformationBuy: { // Card H
      isActive: currentStep === 7 && formData.transaction_type === 'buy',
      title: "Your contact information",
      subtitle: "Tell us how the agent can reach you",
      content: (
        <ContactFormExtended
          formData={formData}
          updateFormData={updateFormData}
          errors={errors}
          isValid={isValid}
          onSubmit={onSubmit}
          enableNotes={true}
          enableLoanAssistance={formData.transaction_type === 'buy'}
          buttonText="Submit Information"
        />
      )
    },

    contactInformationSell: { // Card H2
      isActive: currentStep === 7 && formData.transaction_type === 'sell',
      title: "Your contact information",
      subtitle: "Tell us how the agent can reach you",
      content: (
        <ContactFormExtended
          formData={formData}
          updateFormData={updateFormData}
          errors={errors}
          isValid={isValid}
          onSubmit={onSubmit}
          enableNotes={true}
          enableLoanAssistance={false}
          buttonText="Submit Information"
        />
      )
    }
  };

  return (
    <div className="pt-6 pb-8 px-6 md:px-8">
      <PriceWarningDialog 
        isOpen={showPriceWarning}
        onClose={() => setShowPriceWarning(false)}
        onConfirm={handlePriceWarningConfirm}
      />

      {Object.entries(cards).map(([key, card]) => (
        <FormStep
          key={key}
          isActive={card.isActive}
          onNext={onNext}
          onPrevious={onPrevious}
          formData={formData}
          updateFormData={updateFormData}
          stepNumber={currentStep}
          isValid={isValid}
          errors={errors}
          title={card.title}
          subtitle={card.subtitle}
          showNext={key === 'contactInformation'}
          nextLabel={key === 'contactInformation' ? "Match with an Agent" : undefined}
          showSubmit={key === 'contactInformation'}
        >
          {card.content}
        </FormStep>
      ))}
    </div>
  );
});

export default AgentFinderSteps;