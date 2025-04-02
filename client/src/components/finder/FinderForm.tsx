import { useFinderForm } from "@/hooks/useFinderForm";
import { FinderFormProps } from "@/types/finder";
import AgentFinderSteps from "./AgentFinderSteps";
import LenderFinderSteps from "./LenderFinderSteps";

export default function FinderForm({ 
  finderType, 
  currentStep, 
  setCurrentStep, 
  onSuccess 
}: FinderFormProps) {
  const {
    formData,
    updateFormData,
    errors,
    isValid,
    resetForm,
    submitForm
  } = useFinderForm(finderType);

  const handleNext = () => {
    // Get max steps based on finder type and transaction type
    let maxSteps = 13; // Default for agent buy
    
    if (finderType === 'lender') {
      maxSteps = 6;
    } else if (finderType === 'agent') {
      // Need to cast to access transaction_type
      const agentData = formData as any;
      if (agentData.transaction_type === 'sell') {
        maxSteps = 11;
      }
    }
    
    if (currentStep < maxSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    const success = await submitForm();
    if (success) {
      onSuccess();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {finderType === 'agent' ? (
        <AgentFinderSteps
          currentStep={currentStep}
          formData={formData as any} // Use type assertion to avoid TS errors
          updateFormData={updateFormData}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onSubmit={handleSubmit}
          errors={errors}
          isValid={isValid}
        />
      ) : (
        <LenderFinderSteps
          currentStep={currentStep}
          formData={formData as any} // Use type assertion to avoid TS errors
          updateFormData={updateFormData}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onSubmit={handleSubmit}
          errors={errors}
          isValid={isValid}
        />
      )}
    </div>
  );
}
