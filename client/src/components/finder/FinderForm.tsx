import { useFinderForm } from "@/hooks/useFinderForm";
import { FinderFormProps } from "@/types/finder";
import AgentFinderSteps from "./AgentFinderSteps";

export default function FinderForm({ 
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
  } = useFinderForm();

  const handleNext = () => {
    // Simplified form has the same number of steps for both buy and sell
    const maxSteps = 10; // Total steps for both transaction types
    
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
    </div>
  );
}
