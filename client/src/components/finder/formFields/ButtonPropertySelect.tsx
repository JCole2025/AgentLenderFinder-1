import { useState, useEffect } from "react";
import { Home, Building2, Warehouse, Landmark, Building } from "lucide-react";
import PropertyNotSupportedDialog from "../PropertyNotSupportedDialog";

const propertyTypes = [
  { 
    value: "single_family", 
    label: "Single Family", 
    icon: <Home className="h-6 w-6" />,
    description: "Standalone house on its own lot"
  },
  { 
    value: "multi_family_2_4", 
    label: "Multi-Family (2-4 units)", 
    icon: <Building2 className="h-6 w-6" />,
    description: "Small apartment buildings or duplexes"
  },
  { 
    value: "townhouse_condo", 
    label: "Townhouse/Condo", 
    icon: <Building className="h-6 w-6" />,
    description: "Shared wall properties"
  },
  { 
    value: "commercial", 
    label: "Commercial/Multi-Family (5+)/Land", 
    icon: <Warehouse className="h-6 w-6" />,
    description: "Commercial, large apartments, or undeveloped land"
  }
];

// These are the property types that will trigger the notification dialog
const UNSUPPORTED_PROPERTY_TYPES = ["land", "commercial"];

interface ButtonPropertySelectProps {
  selectedValue: string;
  onChange: (value: string) => void;
  error?: string;
  autoAdvance?: boolean;
  onNext?: () => void;
}

export default function ButtonPropertySelect({
  selectedValue,
  onChange,
  error,
  autoAdvance = true,
  onNext
}: ButtonPropertySelectProps) {
  const [showUnsupportedDialog, setShowUnsupportedDialog] = useState(false);
  const [previousValue, setPreviousValue] = useState(selectedValue);

  // Check if the current value is in the unsupported list and show dialog if needed
  useEffect(() => {
    if (UNSUPPORTED_PROPERTY_TYPES.includes(selectedValue)) {
      setShowUnsupportedDialog(true);
    }
  }, [selectedValue]);

  // Handle property type change and trigger dialog if necessary
  const handlePropertyTypeChange = (value: string) => {
    if (UNSUPPORTED_PROPERTY_TYPES.includes(value)) {
      // Save the previous value so we can restore it when dialog is closed
      if (!UNSUPPORTED_PROPERTY_TYPES.includes(selectedValue)) {
        setPreviousValue(selectedValue);
      }
      setShowUnsupportedDialog(true);
      // Call onChange to update the UI, but we'll revert it when dialog is closed
      onChange(value);
    } else {
      onChange(value);
      
      // Auto advance to next step if enabled and value isn't an unsupported type
      if (autoAdvance && onNext && !UNSUPPORTED_PROPERTY_TYPES.includes(value)) {
        setTimeout(() => {
          onNext();
        }, 400); // Small delay for visual feedback
      }
    }
  };

  // Handle dialog close by reverting to the previous value
  const handleDialogClose = () => {
    setShowUnsupportedDialog(false);
    // Revert to previous value when dialog is closed
    onChange(previousValue);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {propertyTypes.map((type) => {
          const isSelected = type.value === selectedValue;
          
          return (
            <button
              key={type.value}
              type="button"
              className={`
                flex flex-col items-center text-center p-6 rounded-lg border-2 transition-all
                ${isSelected 
                  ? 'border-blue-500 bg-blue-50 shadow-md transform scale-[1.02]' 
                  : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'}
              `}
              onClick={() => handlePropertyTypeChange(type.value)}
            >
              <div className={`
                mb-4 rounded-full p-3 
                ${isSelected ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500'}
              `}>
                {type.icon}
              </div>
              
              <div className="space-y-1">
                <div className="font-semibold text-base">
                  {type.label}
                </div>
                
                {type.description && (
                  <p className="text-sm text-gray-500">
                    {type.description}
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>
      
      {error && <p className="text-sm text-red-500">{error}</p>}
      
      {/* Dialog for unsupported property types */}
      <PropertyNotSupportedDialog 
        open={showUnsupportedDialog} 
        onClose={handleDialogClose} 
      />
    </div>
  );
}