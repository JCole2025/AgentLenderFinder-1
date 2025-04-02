import { Check, Building, Home, Landmark, HelpCircle, DollarSign, Clock, ShoppingCart, Truck, Key, Bed } from "lucide-react";

interface CheckboxOption {
  value: string;
  label: string;
  description?: string;
}

interface ButtonCheckboxGroupProps {
  options: CheckboxOption[];
  selectedValues: string[];
  onChange: (value: string, checked: boolean) => void;
}

// Map of icons to use for different types of options
const iconMap: Record<string, JSX.Element> = {
  "buy_and_hold_brrrr": <Building className="h-6 w-6" />,
  "short_term_rental": <Bed className="h-6 w-6" />,
  "not_sure": <HelpCircle className="h-6 w-6" />,
};

export default function ButtonCheckboxGroup({ 
  options, 
  selectedValues,
  onChange 
}: ButtonCheckboxGroupProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {options.map((option) => {
        const isSelected = selectedValues.includes(option.value);
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
            onClick={() => onChange(option.value, !isSelected)}
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