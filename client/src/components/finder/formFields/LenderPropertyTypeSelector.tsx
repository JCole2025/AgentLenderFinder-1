import { useState } from "react";
import RadioGroup from "./RadioGroup";
import { 
  lenderPropertyTypeLabels, 
  lenderPropertyTypeDescriptions 
} from "@/types/finder";
import PropertyNotSupportedDialog from "../PropertyNotSupportedDialog";

// These are the property types that will trigger the notification dialog
const UNSUPPORTED_PROPERTY_TYPES = ["commercial", "land"];

interface LenderPropertyTypeSelectorProps {
  selectedValue: string;
  onChange: (value: string) => void;
  error?: string;
}

export default function LenderPropertyTypeSelector({
  selectedValue,
  onChange,
  error
}: LenderPropertyTypeSelectorProps) {
  const [showUnsupportedDialog, setShowUnsupportedDialog] = useState(false);
  const [previousValue, setPreviousValue] = useState(selectedValue);

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
    }
  };

  // Handle dialog close by reverting to the previous value
  const handleDialogClose = () => {
    setShowUnsupportedDialog(false);
    // Revert to previous value when dialog is closed
    onChange(previousValue);
  };

  return (
    <>
      <RadioGroup
        options={[
          { value: "single_family", label: lenderPropertyTypeLabels.single_family, description: lenderPropertyTypeDescriptions.single_family },
          { value: "multi_family_2_4", label: lenderPropertyTypeLabels.multi_family_2_4, description: lenderPropertyTypeDescriptions.multi_family_2_4 },
          { value: "multi_family_5plus", label: lenderPropertyTypeLabels.multi_family_5plus, description: lenderPropertyTypeDescriptions.multi_family_5plus },
          { value: "commercial", label: lenderPropertyTypeLabels.commercial, description: lenderPropertyTypeDescriptions.commercial },
          { value: "land", label: lenderPropertyTypeLabels.land, description: lenderPropertyTypeDescriptions.land }
        ]}
        selectedValue={selectedValue}
        onChange={handlePropertyTypeChange}
        name="lender_property_type"
      />
      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}
      
      {/* Dialog for unsupported property types */}
      <PropertyNotSupportedDialog 
        open={showUnsupportedDialog} 
        onClose={handleDialogClose} 
      />
    </>
  );
}