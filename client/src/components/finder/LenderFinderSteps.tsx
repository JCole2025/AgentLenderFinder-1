import FormStep from "./FormStep";
import { LenderFormData } from "@/types/finder";
import RadioGroup from "./formFields/RadioGroup";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { 
  lenderLoanPurposeLabels,
  lenderLoanPurposeDescriptions, 
  lenderPropertyTypeLabels,
  lenderPropertyTypeDescriptions,
  lenderCreditScoreLabels
} from "@/types/finder";
import LenderReviewSummary from "./reviewSummary/LenderReviewSummary";

interface LenderFinderStepsProps {
  currentStep: number;
  formData: LenderFormData;
  updateFormData: (data: Partial<LenderFormData>) => void;
  onNext: () => void;
  onPrevious: () => void;
  onSubmit: () => void;
  errors: Record<string, any>;
  isValid: boolean;
}

export default function LenderFinderSteps({
  currentStep,
  formData,
  updateFormData,
  onNext,
  onPrevious,
  onSubmit,
  errors,
  isValid
}: LenderFinderStepsProps) {
  return (
    <>
      {/* Step 1: Loan Purpose */}
      <FormStep
        isActive={currentStep === 1}
        onNext={onNext}
        onPrevious={onPrevious}
        formData={formData}
        updateFormData={updateFormData}
        stepNumber={1}
        finderType="lender"
        isValid={!!formData.loan_purpose}
        errors={errors}
        title="What type of loan are you looking for?"
        subtitle="Select the purpose of your loan"
        showPrevious={false}
      >
        <RadioGroup
          options={[
            { value: "purchase", label: lenderLoanPurposeLabels.purchase, description: lenderLoanPurposeDescriptions.purchase },
            { value: "refinance", label: lenderLoanPurposeLabels.refinance, description: lenderLoanPurposeDescriptions.refinance },
            { value: "heloc", label: lenderLoanPurposeLabels.heloc, description: lenderLoanPurposeDescriptions.heloc },
            { value: "construction", label: lenderLoanPurposeLabels.construction, description: lenderLoanPurposeDescriptions.construction },
            { value: "not_sure", label: lenderLoanPurposeLabels.not_sure, description: lenderLoanPurposeDescriptions.not_sure }
          ]}
          selectedValue={formData.loan_purpose}
          onChange={(value) => updateFormData({ loan_purpose: value as any })}
          name="lender_loan_purpose"
        />
        {errors.loan_purpose && (
          <p className="text-red-500 text-sm mt-2">{errors.loan_purpose}</p>
        )}
      </FormStep>

      {/* Step 2: Property Type */}
      <FormStep
        isActive={currentStep === 2}
        onNext={onNext}
        onPrevious={onPrevious}
        formData={formData}
        updateFormData={updateFormData}
        stepNumber={2}
        finderType="lender"
        isValid={!!formData.property_type}
        errors={errors}
        title="What type of property?"
        subtitle="Select the property type"
      >
        <RadioGroup
          options={[
            { value: "single_family", label: lenderPropertyTypeLabels.single_family, description: lenderPropertyTypeDescriptions.single_family },
            { value: "multi_family_2_4", label: lenderPropertyTypeLabels.multi_family_2_4, description: lenderPropertyTypeDescriptions.multi_family_2_4 },
            { value: "multi_family_5plus", label: lenderPropertyTypeLabels.multi_family_5plus, description: lenderPropertyTypeDescriptions.multi_family_5plus },
            { value: "commercial", label: lenderPropertyTypeLabels.commercial, description: lenderPropertyTypeDescriptions.commercial },
            { value: "land", label: lenderPropertyTypeLabels.land, description: lenderPropertyTypeDescriptions.land }
          ]}
          selectedValue={formData.property_type}
          onChange={(value) => updateFormData({ property_type: value as any })}
          name="lender_property_type"
        />
        {errors.property_type && (
          <p className="text-red-500 text-sm mt-2">{errors.property_type}</p>
        )}
      </FormStep>

      {/* Step 3: Property Location */}
      <FormStep
        isActive={currentStep === 3}
        onNext={onNext}
        onPrevious={onPrevious}
        formData={formData}
        updateFormData={updateFormData}
        stepNumber={3}
        finderType="lender"
        isValid={formData.location.trim() !== ''}
        errors={errors}
        title="Where is the property located?"
        subtitle="Enter city, state, or zip code"
      >
        <div className="mb-4">
          <Input 
            placeholder="City, state, or zip code"
            value={formData.location}
            onChange={(e) => updateFormData({ location: e.target.value })}
            className="w-full"
          />
          {errors.location && (
            <p className="text-red-500 text-sm mt-2">{errors.location}</p>
          )}
        </div>
      </FormStep>

      {/* Step 4: Credit Score */}
      <FormStep
        isActive={currentStep === 4}
        onNext={onNext}
        onPrevious={onPrevious}
        formData={formData}
        updateFormData={updateFormData}
        stepNumber={4}
        finderType="lender"
        isValid={!!formData.credit_score}
        errors={errors}
        title="What is your approximate credit score?"
        subtitle="This helps match you with appropriate lenders"
      >
        <RadioGroup
          options={[
            { value: "excellent_740plus", label: lenderCreditScoreLabels.excellent_740plus },
            { value: "good_700_739", label: lenderCreditScoreLabels.good_700_739 },
            { value: "fair_650_699", label: lenderCreditScoreLabels.fair_650_699 },
            { value: "below_650", label: lenderCreditScoreLabels.below_650 },
            { value: "not_sure", label: lenderCreditScoreLabels.not_sure }
          ]}
          selectedValue={formData.credit_score}
          onChange={(value) => updateFormData({ credit_score: value as any })}
          name="lender_credit_score"
        />
        {errors.credit_score && (
          <p className="text-red-500 text-sm mt-2">{errors.credit_score}</p>
        )}
      </FormStep>

      {/* Step 5: Contact Information */}
      <FormStep
        isActive={currentStep === 5}
        onNext={onNext}
        onPrevious={onPrevious}
        formData={formData}
        updateFormData={updateFormData}
        stepNumber={5}
        finderType="lender"
        isValid={
          !!formData.contact.name.trim() && 
          !!formData.contact.email.trim() && 
          !!formData.contact.phone.trim() && 
          formData.terms_accepted
        }
        errors={errors}
        title="Your contact information"
        subtitle="How can lenders reach you?"
        nextLabel="Review"
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="lender_full_name" className="block text-sm font-medium text-neutral-darker mb-1">
              Full Name
            </Label>
            <Input
              id="lender_full_name"
              placeholder="Your full name"
              value={formData.contact.name}
              onChange={(e) => updateFormData({ 
                contact: { ...formData.contact, name: e.target.value } 
              })}
            />
            {errors['contact.name'] && (
              <p className="text-red-500 text-sm mt-1">{errors['contact.name']}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="lender_email" className="block text-sm font-medium text-neutral-darker mb-1">
              Email Address
            </Label>
            <Input
              id="lender_email"
              type="email"
              placeholder="your@email.com"
              value={formData.contact.email}
              onChange={(e) => updateFormData({ 
                contact: { ...formData.contact, email: e.target.value } 
              })}
            />
            {errors['contact.email'] && (
              <p className="text-red-500 text-sm mt-1">{errors['contact.email']}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="lender_phone" className="block text-sm font-medium text-neutral-darker mb-1">
              Phone Number
            </Label>
            <Input
              id="lender_phone"
              type="tel"
              placeholder="(555) 123-4567"
              value={formData.contact.phone}
              onChange={(e) => updateFormData({ 
                contact: { ...formData.contact, phone: e.target.value } 
              })}
            />
            {errors['contact.phone'] && (
              <p className="text-red-500 text-sm mt-1">{errors['contact.phone']}</p>
            )}
          </div>
          
          <div className="pt-2">
            <div className="flex items-start">
              <Checkbox
                id="lender_terms"
                checked={formData.terms_accepted}
                onCheckedChange={(checked) => 
                  updateFormData({ terms_accepted: checked as boolean })
                }
                className="mt-1"
              />
              <Label htmlFor="lender_terms" className="ml-3 text-sm">
                I agree to the <a href="#" className="text-primary">Terms of Service</a> and <a href="#" className="text-primary">Privacy Policy</a>. I consent to be contacted by lenders and financing professionals.
              </Label>
            </div>
            {errors.terms_accepted && (
              <p className="text-red-500 text-sm mt-1">{errors.terms_accepted}</p>
            )}
          </div>
        </div>
      </FormStep>

      {/* Step 6: Review and Submit */}
      <FormStep
        isActive={currentStep === 6}
        onNext={onSubmit}
        onPrevious={onPrevious}
        formData={formData}
        updateFormData={updateFormData}
        stepNumber={6}
        finderType="lender"
        isValid={true}
        errors={errors}
        title="Review your information"
        subtitle="Please verify that everything is correct"
        nextLabel="Find Lenders"
        showSubmit={true}
      >
        <LenderReviewSummary formData={formData} />
      </FormStep>
    </>
  );
}
