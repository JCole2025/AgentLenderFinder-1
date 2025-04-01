import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const propertyTypes = [
  { value: "single_family", label: "Single Family Residence" },
  { value: "multi_family_2_4", label: "Multi-Family (2-4 units)" },
  { value: "multi_family_5plus", label: "Multi-Family (5+ units)" },
  { value: "commercial", label: "Commercial" },
  { value: "land", label: "Land/Lots" },
  { value: "other", label: "Other" }
];

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
  return (
    <div className="space-y-2">
      <Label htmlFor="property-type" className="font-medium">
        Property Type
      </Label>
      <Select
        value={selectedValue}
        onValueChange={onChange}
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
    </div>
  );
}