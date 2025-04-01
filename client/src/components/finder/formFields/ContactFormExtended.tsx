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
    <div className="space-y-5">
      <div>
        <Label htmlFor="name" className="block text-gray-700 font-medium mb-2">
          Full name
        </Label>
        <Input
          id="name"
          type="text"
          className={`h-12 text-base ${errors.name ? "border-red-500" : "border-gray-300"}`}
          placeholder="Joseph Coleman"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
        />
        {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
      </div>

      <div>
        <Label htmlFor="email" className="block text-gray-700 font-medium mb-2">
          Email
        </Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
          </div>
          <Input
            id="email"
            type="email"
            className={`h-12 text-base pl-10 ${errors.email ? "border-red-500" : "border-gray-300"}`}
            placeholder="joseph@biggerpockets.com"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
          />
        </div>
        {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
      </div>

      <div>
        <Label htmlFor="phone" className="block text-gray-700 font-medium mb-2">
          Phone
        </Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
          </div>
          <Input
            id="phone"
            type="tel"
            className={`h-12 text-base pl-10 ${errors.phone ? "border-red-500" : "border-gray-300"}`}
            placeholder="(612) 790-5259"
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
          />
        </div>
        {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1">
          <Label htmlFor="city" className="block text-gray-700 font-medium mb-2">
            City
          </Label>
          <Input
            id="city"
            type="text"
            className={`h-12 text-base ${errors.city ? "border-red-500" : "border-gray-300"}`}
            placeholder="Denver"
            value={city}
            onChange={(e) => onCityChange(e.target.value)}
          />
          {errors.city && <p className="text-sm text-red-500 mt-1">{errors.city}</p>}
        </div>

        <div>
          <Label htmlFor="state" className="block text-gray-700 font-medium mb-2">
            State
          </Label>
          <Input
            id="state"
            type="text"
            className={`h-12 text-base ${errors.state ? "border-red-500" : "border-gray-300"}`}
            placeholder="CO"
            value={state}
            onChange={(e) => onStateChange(e.target.value)}
          />
          {errors.state && <p className="text-sm text-red-500 mt-1">{errors.state}</p>}
        </div>
        
        <div>
          <Label htmlFor="zip" className="block text-gray-700 font-medium mb-2">
            ZIP code
          </Label>
          <Input
            id="zip"
            type="text"
            className={`h-12 text-base ${errors.zip ? "border-red-500" : "border-gray-300"}`}
            placeholder="80202"
            value={zip}
            onChange={(e) => onZipChange(e.target.value)}
          />
          {errors.zip && <p className="text-sm text-red-500 mt-1">{errors.zip}</p>}
        </div>
      </div>
    </div>
  );
}