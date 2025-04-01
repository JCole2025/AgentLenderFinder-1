import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ContactFormProps {
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  zip: string;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onCityChange: (value: string) => void;
  onStateChange: (value: string) => void;
  onZipChange: (value: string) => void;
  errors: {
    name?: string;
    email?: string;
    phone?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
}

export default function ContactFormExtended({
  name,
  email,
  phone,
  city,
  state,
  zip,
  onNameChange,
  onEmailChange,
  onPhoneChange,
  onCityChange,
  onStateChange,
  onZipChange,
  errors
}: ContactFormProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name" className="font-medium">
          Full Name
        </Label>
        <Input
          id="name"
          type="text"
          className={errors.name ? "border-red-500" : ""}
          placeholder="John Doe"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
        />
        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="font-medium">
          Email Address
        </Label>
        <Input
          id="email"
          type="email"
          className={errors.email ? "border-red-500" : ""}
          placeholder="john@example.com"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
        />
        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone" className="font-medium">
          Phone Number
        </Label>
        <Input
          id="phone"
          type="tel"
          className={errors.phone ? "border-red-500" : ""}
          placeholder="(555) 123-4567"
          value={phone}
          onChange={(e) => onPhoneChange(e.target.value)}
        />
        {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city" className="font-medium">
            City
          </Label>
          <Input
            id="city"
            type="text"
            className={errors.city ? "border-red-500" : ""}
            placeholder="Colorado Springs"
            value={city}
            onChange={(e) => onCityChange(e.target.value)}
          />
          {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="state" className="font-medium">
              State
            </Label>
            <Input
              id="state"
              type="text"
              className={errors.state ? "border-red-500" : ""}
              placeholder="CO"
              value={state}
              onChange={(e) => onStateChange(e.target.value)}
            />
            {errors.state && <p className="text-sm text-red-500">{errors.state}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="zip" className="font-medium">
              ZIP Code
            </Label>
            <Input
              id="zip"
              type="text"
              className={errors.zip ? "border-red-500" : ""}
              placeholder="80903"
              value={zip}
              onChange={(e) => onZipChange(e.target.value)}
            />
            {errors.zip && <p className="text-sm text-red-500">{errors.zip}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}