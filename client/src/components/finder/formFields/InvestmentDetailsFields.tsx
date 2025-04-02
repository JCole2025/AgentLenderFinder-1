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
  transactionType?: 'buy' | 'sell'; // Optional parameter to show/hide fields based on transaction type
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
  errors,
  transactionType = 'buy' // Default to buy if not specified
}: InvestmentDetailsProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price-min" className="font-medium">
            {transactionType === 'buy' ? 'Minimum Purchase Price' : 'Minimum Sale Price'}
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-dark">$</span>
            <Input
              id="price-min"
              type="text"
              className={`pl-7 ${errors.priceMin ? "border-red-500" : ""}`}
              placeholder="100,000"
              value={priceMin}
              onChange={(e) => {
                // Only allow numbers and commas
                const value = e.target.value;
                if (/^[0-9,]*$/.test(value) || value === '') {
                  onPriceMinChange(value);
                }
              }}
            />
          </div>
          {errors.priceMin && <p className="text-sm text-red-500">{errors.priceMin}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="price-max" className="font-medium">
            {transactionType === 'buy' ? 'Maximum Purchase Price' : 'Maximum Sale Price'}
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-dark">$</span>
            <Input
              id="price-max"
              type="text"
              className={`pl-7 ${errors.priceMax ? "border-red-500" : ""}`}
              placeholder="350,000"
              value={priceMax}
              onChange={(e) => {
                // Only allow numbers and commas
                const value = e.target.value;
                if (/^[0-9,]*$/.test(value) || value === '') {
                  onPriceMaxChange(value);
                }
              }}
            />
          </div>
          {errors.priceMax && <p className="text-sm text-red-500">{errors.priceMax}</p>}
        </div>
      </div>
      
      {/* Only show loan process for buy transactions */}
      {transactionType === 'buy' && (
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
      )}
      
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
          onChange={(e) => {
            // Only allow numbers
            const value = e.target.value;
            if (/^[0-9]*$/.test(value) || value === '') {
              onPropertyCountChange(value);
            }
          }}
        />
        {errors.propertyCount && <p className="text-sm text-red-500">{errors.propertyCount}</p>}
      </div>
    </div>
  );
}