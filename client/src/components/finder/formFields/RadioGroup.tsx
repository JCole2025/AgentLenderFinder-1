import { RadioGroup as ShadcnRadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

interface RadioGroupProps {
  options: RadioOption[];
  selectedValue: string;
  onChange: (value: string) => void;
  name: string;
}

export default function RadioGroup({ 
  options, 
  selectedValue, 
  onChange,
  name 
}: RadioGroupProps) {
  return (
    <ShadcnRadioGroup
      value={selectedValue}
      onValueChange={onChange}
      className="space-y-4"
    >
      {options.map((option) => (
        <div className="flex items-start" key={option.value}>
          <RadioGroupItem 
            value={option.value} 
            id={`${name}-${option.value}`}
            className="mt-1"
          />
          <Label 
            htmlFor={`${name}-${option.value}`}
            className="ml-3"
          >
            {option.description ? (
              <>
                <span className="block font-medium">{option.label}</span>
                <span className="block text-sm text-neutral-dark">
                  {option.description}
                </span>
              </>
            ) : (
              <span className="font-medium">{option.label}</span>
            )}
          </Label>
        </div>
      ))}
    </ShadcnRadioGroup>
  );
}
