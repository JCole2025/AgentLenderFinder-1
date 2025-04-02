import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface ContactFormProps {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  zip: string;
  terms_accepted: boolean;
  loan_assistance: boolean;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onCityChange: (value: string) => void;
  onStateChange: (value: string) => void;
  onZipChange: (value: string) => void;
  onTermsAcceptedChange: (value: boolean) => void;
  onLoanAssistanceChange: (value: boolean) => void;
  errors: {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    city?: string;
    state?: string;
    zip?: string;
    terms_accepted?: string;
  };
}

export default function ContactFormExtended(props: ContactFormProps) {
  const {
    first_name,
    last_name,
    email,
    phone,
    city,
    state,
    zip,
    terms_accepted,
    loan_assistance,
    onFirstNameChange,
    onLastNameChange,
    onEmailChange,
    onPhoneChange,
    onCityChange,
    onStateChange,
    onZipChange,
    onTermsAcceptedChange,
    onLoanAssistanceChange,
    errors
  } = props;
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="first_name" className="block text-gray-700 font-medium mb-2">
            First name
          </Label>
          <Input
            id="first_name"
            type="text"
            className={`h-12 text-base ${errors.first_name ? "border-red-500" : "border-gray-300"}`}
            placeholder="Joseph"
            value={first_name}
            onChange={(e) => onFirstNameChange(e.target.value)}
          />
          {errors.first_name && <p className="text-sm text-red-500 mt-1">{errors.first_name}</p>}
        </div>
        
        <div>
          <Label htmlFor="last_name" className="block text-gray-700 font-medium mb-2">
            Last name
          </Label>
          <Input
            id="last_name"
            type="text"
            className={`h-12 text-base ${errors.last_name ? "border-red-500" : "border-gray-300"}`}
            placeholder="Coleman"
            value={last_name}
            onChange={(e) => onLastNameChange(e.target.value)}
          />
          {errors.last_name && <p className="text-sm text-red-500 mt-1">{errors.last_name}</p>}
        </div>
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
      
      {/* Consent Checkboxes */}
      <div className="space-y-4 pt-4">
        <div className="flex items-start space-x-3">
          <Checkbox 
            id="terms_accepted" 
            checked={terms_accepted}
            onCheckedChange={(checked) => onTermsAcceptedChange(!!checked)}
            className="mt-1"
          />
          <div>
            <div className="space-y-1">
              <p 
                className={`${errors.terms_accepted ? "text-red-500" : "text-gray-700"}`}
              >
                <span className="font-semibold text-blue-600">By entering your information and submitting this form, you agree to BiggerPockets <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>.</span>
              </p>
              <p className="text-xs text-gray-500 leading-relaxed">
                You also expressly consent to having BiggerPockets and its featured real estate professionals call or text you about your inquiry (including automatic telephone dialing system or an artificial or prerecorded voice) to the telephone number provided, even if that number is on a corporate, state, or national Do Not Call Registry. Message frequency varies, and message/data rates may apply. Text STOP to cancel. You don't need to consent as a condition of buying any property, goods or services.
              </p>
            </div>
            {errors.terms_accepted && (
              <p className="text-sm text-red-500 mt-1">{errors.terms_accepted}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <Checkbox 
            id="loan_assistance" 
            checked={loan_assistance}
            onCheckedChange={(checked) => onLoanAssistanceChange(!!checked)}
            className="mt-1"
          />
          <div>
            <Label htmlFor="loan_assistance" className="text-gray-700">
              I'd like loan assistance (Optional)
            </Label>
            <p className="text-sm text-gray-500">
              I would like to be contacted about financing options available for this property purchase.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}