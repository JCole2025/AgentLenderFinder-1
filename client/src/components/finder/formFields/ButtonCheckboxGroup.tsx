import { Check, Building, Home, Landmark, HelpCircle, DollarSign, Clock, ShoppingCart, Truck, Key, Bed } from "lucide-react";

interface CheckboxOption {
  value: string;
  label: string;
  description?: string;
}

interface ButtonCheckboxGroupProps {
  options: CheckboxOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  autoAdvance?: boolean;
  onNext?: () => void;
  minSelected?: number;
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
  onChange,
  autoAdvance = false,
  onNext,
  minSelected = 1
}: ButtonCheckboxGroupProps) {
  
  const handleOptionClick = (value: string, isCurrentlySelected: boolean) => {
    // Calculate what the new selected values array will be
    let newSelectedValues: string[] = [];
    
    if (isCurrentlySelected) {
      // If it was already selected, we're removing it
      newSelectedValues = selectedValues.filter(v => v !== value);
    } else {
      // If it wasn't selected, we're adding it
      newSelectedValues = [...selectedValues, value];
    }
    
    // Make the change by passing the entire array of new values
    onChange(newSelectedValues);
    
    // Auto advance if:
    // 1. Auto advance is enabled
    // 2. We have an onNext function
    // 3. We've just selected something (not unselected)
    // 4. We meet the minimum selection requirement
    console.log('ButtonCheckboxGroup - Option clicked:', value);
    console.log('ButtonCheckboxGroup - Is currently selected:', isCurrentlySelected);
    console.log('ButtonCheckboxGroup - New selected values:', newSelectedValues);
    console.log('ButtonCheckboxGroup - Auto advance enabled:', autoAdvance);
    console.log('ButtonCheckboxGroup - onNext available:', !!onNext);
    console.log('ButtonCheckboxGroup - Min selections required:', minSelected);
    console.log('ButtonCheckboxGroup - Current selection count:', newSelectedValues.length);
    
    if (autoAdvance && onNext && !isCurrentlySelected && newSelectedValues.length >= minSelected) {
      console.log('ButtonCheckboxGroup - Setting timeout to auto-advance');
      setTimeout(() => {
        console.log('ButtonCheckboxGroup - Executing onNext()');
        onNext();
      }, 400); // Small delay for visual feedback
    } else {
      console.log('ButtonCheckboxGroup - Not auto-advancing. Conditions not met:', 
        { autoAdvance, onNextExists: !!onNext, isAdd: !isCurrentlySelected, 
          minSelectionsMet: newSelectedValues.length >= minSelected });
    }
  };
  
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
            onClick={() => handleOptionClick(option.value, isSelected)}
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