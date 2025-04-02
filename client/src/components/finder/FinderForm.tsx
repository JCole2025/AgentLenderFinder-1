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
    // Get max steps based on transaction type
    let maxSteps = 13; // Default for agent buy
    
    // Need to cast to access transaction_type
    const agentData = formData as any;
    if (agentData.transaction_type === 'sell') {
      maxSteps = 11;
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
