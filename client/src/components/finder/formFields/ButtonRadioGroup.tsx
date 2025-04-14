import { useState } from "react";
import { Check, Building, Home, Landmark, HelpCircle, DollarSign, Clock, ShoppingCart, Truck, Key } from "lucide-react";

interface RadioOption {
  value: string;
  label: string;
  description?: string;
  icon?: string;
}

interface ButtonRadioGroupProps {
  options: RadioOption[];
  selectedValue: string | undefined;
  onChange: (value: string | undefined) => void;
  name: string;
  autoAdvance?: boolean;
  onNext?: () => void;
  defaultValue?: string;
}

// Map of icons to use for different types of options
const iconMap: Record<string, JSX.Element> = {
  "buy": <ShoppingCart className="h-6 w-6" />,
  "sell": <Key className="h-6 w-6" />,
  "single_family": <Home className="h-6 w-6" />,
  "multi_family_2_4": <Building className="h-6 w-6" />,
  "multi_family_5plus": <Building className="h-6 w-6" />,
  "townhouse_condo": <Home className="h-6 w-6" />,
  "land": <Landmark className="h-6 w-6" />,
  "commercial": <Building className="h-6 w-6" />,
  "asap": <Clock className="h-6 w-6" />,
  "1_3_months": <Clock className="h-6 w-6" />,
  "3_6_months": <Clock className="h-6 w-6" />,
  "6_12_months": <Clock className="h-6 w-6" />,
  "just_researching": <HelpCircle className="h-6 w-6" />,
  "buy_and_hold_brrrr": <Building className="h-6 w-6" />,
  "short_term_rental": <DollarSign className="h-6 w-6" />,
  "not_sure": <HelpCircle className="h-6 w-6" />,
};

export default function ButtonRadioGroup({ 
  options, 
  selectedValue, 
  onChange,
  name,
  autoAdvance = false,
  onNext,
  defaultValue
}: ButtonRadioGroupProps) {

  const handleOptionClick = (value: string) => {
    // For the timeline step, we don't want to allow deselection 
    // Always use the new value (don't allow undefined)
    const newValue = value;
    onChange(newValue);
    
    console.log('ButtonRadioGroup - Button clicked:', value);
    console.log('ButtonRadioGroup - Auto advance enabled:', autoAdvance);
    console.log('ButtonRadioGroup - onNext available:', !!onNext);
    
    // For sell option, just call onNext once to follow our new flow
    // that includes the property address step
    if (value === "sell" && onNext) {
      console.log('SELL option selected - following property address flow');
      
      // Call the navigation callback to proceed to property address step
      onNext();
      return;
    }
    
    // Check if the value changed
    const valueChanged = selectedValue !== value;
    console.log('ButtonRadioGroup - Value changed:', valueChanged);

    // For Buy selection, we need to auto-advance even if autoAdvance is disabled
    if ((value === "buy" || autoAdvance) && onNext) {
      console.log('ButtonRadioGroup - Auto advancing after selection');
      setTimeout(() => {
        console.log('ButtonRadioGroup - Executing onNext()');
        onNext();
      }, 400);
    } else {
      console.log('ButtonRadioGroup - Not auto-advancing. Conditions not met:', 
        { autoAdvance, onNextExists: !!onNext, isValueBuy: value === "buy" });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {options.map((option) => {
        const isSelected = option.value === selectedValue;
        const icon = iconMap[option.value] || <HelpCircle className="h-6 w-6" />;

        return (
          <button
            key={option.value}
            type="button"
            className={`
              flex flex-col items-center text-center p-6 rounded-lg border-2 transition-all
              ${isSelected 
                ? 'border-blue-500 bg-blue-50 shadow-md transform scale-[1.02]' 
                : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'}
            `}
            onClick={() => handleOptionClick(option.value)}
          >
            <div className={`
              mb-4 rounded-full p-3 
              ${isSelected ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500'}
            `}>
              {icon}
            </div>

            <div className="space-y-1">
              <div className="font-semibold text-base">
                {option.label}
                {isSelected && (
                  <Check className="h-4 w-4 ml-1 inline-block text-blue-500" />
                )}
              </div>

              {option.description && (
                <p className="text-sm text-gray-500">
                  {option.description}
                </p>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}