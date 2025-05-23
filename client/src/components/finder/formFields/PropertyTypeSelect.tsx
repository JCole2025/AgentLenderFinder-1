import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import PropertyNotSupportedDialog from "../PropertyNotSupportedDialog";

const propertyTypes = [
  { value: "single_family", label: "Single Family" },
  { value: "multi_family_2_4", label: "Multi-Family (2-4 units)" },
  { value: "multi_family_5plus", label: "Multi-Family (5+ units)" },
  { value: "townhouse_condo", label: "Townhouse/Condo" },
  { value: "land", label: "Land" },
  { value: "commercial", label: "Commercial/Multifamily (5+ units)" }
];

// These are the property types that will trigger the notification dialog
const UNSUPPORTED_PROPERTY_TYPES = ["land", "commercial"];

interface PropertyTypeSelectProps {
  selectedValue: string;
  onChange: (value: string) => void;
  error?: string;
}

export default function PropertyTypeSelect({
  selectedValue,
  onChange,
  error
}: PropertyTypeSelectProps) {
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
    }
  };

  // Handle dialog close by reverting to the previous value
  const handleDialogClose = () => {
    setShowUnsupportedDialog(false);
    // Revert to previous value when dialog is closed
    onChange(previousValue);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="property-type" className="font-medium">
        Property Type
      </Label>
      <Select
        value={selectedValue}
        onValueChange={handlePropertyTypeChange}
      >
        <SelectTrigger id="property-type" className={error ? "border-red-500" : ""}>
          <SelectValue placeholder="Select property type" />
        </SelectTrigger>
        <SelectContent>
          {propertyTypes.map((type) => (
            <SelectItem key={type.value} value={type.value}>
              {type.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-red-500">{error}</p>}
      
      {/* Dialog for unsupported property types */}
      <PropertyNotSupportedDialog 
        open={showUnsupportedDialog} 
        onClose={handleDialogClose} 
      />
    </div>
  );
}