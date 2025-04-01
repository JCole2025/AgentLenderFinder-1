import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";

interface InvestmentDetailsProps {
  priceMin: string;
  priceMax: string;
  loanStarted: boolean;
  propertyCount: string;
  onPriceMinChange: (value: string) => void;
  onPriceMaxChange: (value: string) => void;
  onLoanStartedChange: (value: boolean) => void;
  onPropertyCountChange: (value: string) => void;
  errors: {
    priceMin?: string;
    priceMax?: string;
    propertyCount?: string;
  };
}

export default function InvestmentDetailsFields({
  priceMin,
  priceMax,
  loanStarted,
  propertyCount,
  onPriceMinChange,
  onPriceMaxChange,
  onLoanStartedChange,
  onPropertyCountChange,
  errors
}: InvestmentDetailsProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price-min" className="font-medium">
            Minimum Purchase Price
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-dark">$</span>
            <Input
              id="price-min"
              type="text"
              className={`pl-7 ${errors.priceMin ? "border-red-500" : ""}`}
              placeholder="100,000"
              value={priceMin}
              onChange={(e) => onPriceMinChange(e.target.value)}
            />
          </div>
          {errors.priceMin && <p className="text-sm text-red-500">{errors.priceMin}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="price-max" className="font-medium">
            Maximum Purchase Price
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-dark">$</span>
            <Input
              id="price-max"
              type="text"
              className={`pl-7 ${errors.priceMax ? "border-red-500" : ""}`}
              placeholder="350,000"
              value={priceMax}
              onChange={(e) => onPriceMaxChange(e.target.value)}
            />
          </div>
          {errors.priceMax && <p className="text-sm text-red-500">{errors.priceMax}</p>}
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch
          id="loan-started"
          checked={loanStarted}
          onCheckedChange={onLoanStartedChange}
        />
        <Label htmlFor="loan-started" className="font-medium">
          I have already started the loan process
        </Label>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="property-count" className="font-medium">
          How many investment properties do you currently own?
        </Label>
        <Input
          id="property-count"
          type="text"
          className={errors.propertyCount ? "border-red-500" : ""}
          placeholder="0"
          value={propertyCount}
          onChange={(e) => onPropertyCountChange(e.target.value)}
        />
        {errors.propertyCount && <p className="text-sm text-red-500">{errors.propertyCount}</p>}
      </div>
    </div>
  );
}