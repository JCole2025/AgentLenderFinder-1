import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface CheckboxOption {
  value: string;
  label: string;
  description?: string;
}

interface CheckboxGroupProps {
  options: CheckboxOption[];
  selectedValues: string[];
  onChange: (value: string, checked: boolean) => void;
}

export default function CheckboxGroup({ 
  options, 
  selectedValues, 
  onChange 
}: CheckboxGroupProps) {
  return (
    <div className="space-y-4">
      {options.map((option) => (
        <div className="flex items-start" key={option.value}>
          <Checkbox
            id={`checkbox-${option.value}`}
            checked={selectedValues.includes(option.value)}
            onCheckedChange={(checked) => onChange(option.value, !!checked)}
            className="mt-1"
          />
          <Label 
            htmlFor={`checkbox-${option.value}`}
            className="ml-3"
          >
            <span className="block font-medium">{option.label}</span>
            {option.description && (
              <span className="block text-sm text-neutral-dark">
                {option.description}
              </span>
            )}
          </Label>
        </div>
      ))}
    </div>
  );
}
